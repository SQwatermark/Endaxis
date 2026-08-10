/**
 * 把构筑中启用的天赋、潜能统一解析为编译期养成计划，并将已支持的修正应用到技能程序。
 * 各编译阶段应复用这里的选择结果；运行时只消费修正后的程序，不再解释养成 DSL。
 */
import type { CompiledSkillProgram } from './combatProgram';
import type {
  OperatorDefinition,
  OperatorUpgradeDefinition,
  UpgradeModifierDefinition,
} from '../game-data/operatorDefinition';
import type { OperatorBuildDocument } from '../project/schema';

export interface ActiveOperatorUpgrade {
  readonly source: 'talent' | 'potential';
  readonly level: number;
  readonly definition: OperatorUpgradeDefinition;
}

/** 解析构筑当前实际启用的养成项；返回顺序固定为天赋声明顺序、潜能解锁顺序。 */
export function resolveActiveOperatorUpgrades(
  build: OperatorBuildDocument,
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
