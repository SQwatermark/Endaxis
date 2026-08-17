/**
 * 把构筑中启用的天赋、潜能统一解析为编译期养成计划，并将已支持的修正应用到技能程序。
 * 各编译阶段应复用这里的选择结果；运行时只消费修正后的程序，不再解释养成 DSL。
 */
import type { CompiledOperatorPassiveProgram, CompiledSkillProgram } from './combatProgram';
import type {
  LevelValues,
  OperatorDefinition,
  OperatorUpgradeDefinition,
  UpgradeModifierDefinition,
} from '../game-data/operatorDefinition';
import type { OperatorInstanceDocument } from '../project/schema';
import { compileActionSequence } from './compileSkill';

export interface ActiveOperatorUpgrade {
  readonly source: 'talent' | 'potential';
  readonly level: number;
  readonly definition: OperatorUpgradeDefinition;
}

/** 解析构筑当前实际启用的养成项；返回顺序固定为天赋声明顺序、潜能解锁顺序。 */
export function resolveActiveOperatorUpgrades(
  build: OperatorInstanceDocument,
  operator: OperatorDefinition,
): readonly ActiveOperatorUpgrade[] {
  const active: ActiveOperatorUpgrade[] = [];
  const knownTalentIndexes = new Set(operator.talents.map((_, index) => String(index)));

  for (const [key, level] of Object.entries(build.talentStates)) {
    if (!knownTalentIndexes.has(key) && level !== 0) {
      throw new RangeError(`operator talent state '${key}' does not exist`);
    }
  }
  operator.talents.forEach((definition, index) => {
    const level = build.talentStates[String(index)] ?? 0;
    if (!Number.isInteger(level) || level < 0 || level > definition.levels) {
      throw new RangeError(
        `operator talent '${definition.key}' must be an integer between 0 and ${definition.levels}`,
      );
    }
    if (level > 0) active.push({ source: 'talent', level, definition });
  });

  const totalPotential = operator.potentials.reduce(
    (sum, definition) => sum + definition.levels,
    0,
  );
  if (
    !Number.isInteger(build.potential) ||
    build.potential < 0 ||
    build.potential > totalPotential
  ) {
    throw new RangeError(`operator potential must be an integer between 0 and ${totalPotential}`);
  }
  let remainingPotential = build.potential;
  for (const definition of operator.potentials) {
    if (remainingPotential <= 0) break;
    const level = Math.min(remainingPotential, definition.levels);
    active.push({ source: 'potential', level, definition });
    remainingPotential -= level;
  }
  return active;
}

const PANEL_MODIFIER_KINDS = new Set<UpgradeModifierDefinition['kind']>([
  'addBuildAttribute',
  'modifyBasePanelStat',
  'addStaticDamageIncrease',
]);

function requireMultiplier(value: number, path: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${path} must be a non-negative finite number`);
  }
}

function resolveUpgradeLevelValue(value: LevelValues, upgradeLevel: number, path: string): number {
  const resolved = typeof value === 'number' ? value : value[upgradeLevel - 1];
  if (resolved === undefined) {
    throw new RangeError(`${path} has no value for upgrade level ${upgradeLevel}`);
  }
  if (!Number.isFinite(resolved)) throw new TypeError(`${path} must resolve to a finite number`);
  return resolved;
}

/**
 * 将已启用养成项中的原生常驻被动编译为单等级程序。
 * 声明顺序决定启用顺序；重复 key 会让 Buff 和事件归因不稳定，因此直接拒绝。
 */
export function compileOperatorPassivePrograms(
  upgrades: readonly ActiveOperatorUpgrade[],
): readonly CompiledOperatorPassiveProgram[] {
  const programs: CompiledOperatorPassiveProgram[] = [];
  const keys = new Set<string>();
  for (const upgrade of upgrades) {
    for (const [index, passive] of (upgrade.definition.passiveSkills ?? []).entries()) {
      const path = `${upgrade.source} '${upgrade.definition.key}'.passiveSkills[${index}]`;
      if (passive.key.length === 0) throw new Error(`${path}.key must not be empty`);
      if (keys.has(passive.key)) throw new Error(`${path} duplicates passive '${passive.key}'`);
      keys.add(passive.key);
      programs.push({
        key: passive.key,
        initialBlackboard: Object.fromEntries(
          Object.entries(passive.blackboard ?? {}).map(([key, value]) => [
            key,
            resolveUpgradeLevelValue(value, upgrade.level, `${path}.blackboard.${key}`),
          ]),
        ),
        enableSequence: compileActionSequence(
          passive.enableSequence,
          upgrade.level,
          `${path}.enableSequence`,
        ),
      });
    }
  }
  return programs;
}

function patchSkillBlackboard(
  programs: readonly CompiledSkillProgram[],
  modifier: Extract<UpgradeModifierDefinition, { kind: 'patchSkillBlackboard' }>,
  upgradeLevel: number,
  path: string,
): readonly CompiledSkillProgram[] {
  const value = resolveUpgradeLevelValue(modifier.value, upgradeLevel, `${path}.value`);
  const targets = programs.filter(program => program.skillGroupKey === modifier.skillGroupKey);
  if (targets.length === 0) {
    throw new Error(`${path} references missing skill group '${modifier.skillGroupKey}'`);
  }
  return programs.map(program => {
    if (program.skillGroupKey !== modifier.skillGroupKey) return program;
    const previousValue = program.initialBlackboard[modifier.blackboardKey] ?? 0;
    const nextValue =
      modifier.operation === 'add'
        ? previousValue + value
        : modifier.operation === 'multiply'
          ? previousValue * value
          : value;
    return {
      ...program,
      initialBlackboard: {
        ...program.initialBlackboard,
        [modifier.blackboardKey]: Math.fround(nextValue),
      },
    };
  });
}

function multiplySkillCost(
  programs: readonly CompiledSkillProgram[],
  modifier: Extract<UpgradeModifierDefinition, { kind: 'multiplySkillCost' }>,
  path: string,
): readonly CompiledSkillProgram[] {
  requireMultiplier(modifier.multiplier, `${path}.multiplier`);
  const targets = programs.filter(program => program.skillGroupKey === modifier.skillGroupKey);
  if (targets.length === 0) {
    throw new Error(`${path} references missing skill group '${modifier.skillGroupKey}'`);
  }
  for (const target of targets) {
    if (!target.costs.some(cost => cost.resource === modifier.resource)) {
      throw new Error(`${path} target '${target.skillId}' has no '${modifier.resource}' cost`);
    }
  }
  return programs.map(program => {
    if (program.skillGroupKey !== modifier.skillGroupKey) return program;
    return {
      ...program,
      costs: program.costs.map(cost =>
        cost.resource === modifier.resource
          ? { ...cost, value: cost.value * modifier.multiplier }
          : cost,
      ),
    };
  });
}

/**
 * 按养成声明顺序修正技能程序。面板类 modifier 由面板编译器消费；其余还没做通的类型必须失败。
 */
export function applyOperatorUpgradeSkillPatches(
  programs: readonly CompiledSkillProgram[],
  upgrades: readonly ActiveOperatorUpgrade[],
): readonly CompiledSkillProgram[] {
  let patched = programs;
  for (const upgrade of upgrades) {
    for (const [modifierIndex, modifier] of (upgrade.definition.modifiers ?? []).entries()) {
      const path = `${upgrade.source} '${upgrade.definition.key}'.modifiers[${modifierIndex}]`;
      if (PANEL_MODIFIER_KINDS.has(modifier.kind)) continue;
      if (modifier.kind === 'multiplySkillCost') {
        patched = multiplySkillCost(patched, modifier, path);
        continue;
      }
      if (modifier.kind === 'patchSkillBlackboard') {
        patched = patchSkillBlackboard(patched, modifier, upgrade.level, path);
        continue;
      }
      throw new Error(`${path} kind '${modifier.kind}' is not connected to skill compilation`);
    }
    if (upgrade.definition.eventHandlers?.length) {
      throw new Error(
        `${upgrade.source} '${upgrade.definition.key}' has event handlers, but upgrade event compilation is not connected`,
      );
    }
  }
  return patched;
}
