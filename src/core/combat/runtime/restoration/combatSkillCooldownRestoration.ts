/** 校验恢复候选的固定配置与保存账本，再为同一技能的全部施放绑定一个冷却对象。 */
import type { CompiledSkillCooldownProgram } from '../../../compiler/combatProgram';
import type { CombatOperatorProgram } from '../combatRuntimeAssembly';
import type { SkillCooldown } from '../../skills/skillCooldown';
import {
  createCombatSkillCooldown,
  resolveCombatSkillCooldownConfiguration,
  type CombatSkillCooldownConfiguration,
} from '../../skills/combatSkillCooldownRules';
import type { SkillCooldownState } from '../../state/abilityState';

export interface RestoredCombatSkillCooldownBinding {
  readonly program: CompiledSkillCooldownProgram;
  readonly skillIds: ReadonlySet<string>;
  readonly cooldown: SkillCooldown;
  readonly configuration: CombatSkillCooldownConfiguration;
}

/**
 * 从一个干员节点的保存数据重建全部共享冷却对象。
 * 返回表按 skillId 索引；多个施放实例随后必须引用这里的同一个对象。
 */
export function bindRestoredCombatSkillCooldowns(
  operator: CombatOperatorProgram,
  states: ReadonlyMap<string, SkillCooldownState>,
): ReadonlyMap<string, RestoredCombatSkillCooldownBinding> {
  const programs = [
    ...(operator.skillCooldownPrograms ?? []),
    ...operator.skills,
  ] as readonly CompiledSkillCooldownProgram[];
  const definitions = new Map<
    string,
    {
      readonly program: CompiledSkillCooldownProgram;
      readonly configuration: CombatSkillCooldownConfiguration;
      readonly skillIds: Set<string>;
    }
  >();
  for (const program of programs) {
    const configuration = resolveCombatSkillCooldownConfiguration(operator, program);
    const existing = definitions.get(program.skillId);
    if (existing !== undefined) {
      if (
        existing.configuration.periodFrames !== configuration.periodFrames ||
        existing.configuration.commitFrame !== configuration.commitFrame ||
        existing.program.skillType !== program.skillType
      ) {
        throw new Error(
          `skill '${program.skillId}' of '${operator.operatorId}' has inconsistent cooldown configuration`,
        );
      }
      if (program.nativeSkillType !== undefined)
        existing.skillIds.add(program.executionSkillId ?? program.skillId);
      continue;
    }
    definitions.set(program.skillId, {
      program,
      configuration,
      skillIds: new Set(
        program.nativeSkillType === undefined ? [] : [program.executionSkillId ?? program.skillId],
      ),
    });
  }
  for (const skillId of states.keys()) {
    if (!definitions.has(skillId)) {
      throw new Error(
        `restored operator '${operator.operatorId}' has unknown cooldown '${skillId}'`,
      );
    }
  }
  const result = new Map<string, RestoredCombatSkillCooldownBinding>();
  for (const [skillId, definition] of definitions) {
    const state = states.get(skillId);
    if (state === undefined) {
      throw new Error(
        `restored operator '${operator.operatorId}' is missing cooldown '${skillId}'`,
      );
    }
    const configured = definition.configuration.periodFrames !== undefined;
    if ((state.timer !== undefined) !== configured) {
      throw new Error(
        `restored cooldown '${operator.operatorId}:${skillId}' does not match its fixed configuration`,
      );
    }
    const cooldown = createCombatSkillCooldown(
      operator,
      definition.program,
      definition.configuration,
      state,
    );
    result.set(skillId, {
      program: definition.program,
      skillIds: definition.skillIds,
      cooldown,
      configuration: definition.configuration,
    });
  }
  return result;
}
