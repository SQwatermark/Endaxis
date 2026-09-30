/** 新建与恢复共用技能冷却规则；状态归共享账本，动态属性从当前分支的 Buff 目标读取。 */
import type { CompiledSkillCooldownProgram } from '../../compiler/combatProgram';
import type { ResolvedOperatorPanel } from '../../compiler/resolveOperatorPanel';
import type { BuffOperationTarget } from '../buffs/buffOperationExecutor';
import type { SkillCooldownState } from '../state/abilityState';
import { COMBAT_FRAMES_PER_SECOND } from '../time/combatClock';
import { SkillCooldown } from './skillCooldown';

interface CombatSkillCooldownOwner {
  readonly operatorId: string;
  readonly panel?: Pick<ResolvedOperatorPanel, 'combatModifiers'>;
  readonly buffRuntime?: Pick<BuffOperationTarget, 'getAttributeValue'>;
}

export interface CombatSkillCooldownConfiguration {
  readonly periodFrames?: number;
  readonly commitFrame?: number;
}

export function resolveCombatSkillCooldownConfiguration(
  operator: CombatSkillCooldownOwner,
  program: CompiledSkillCooldownProgram,
): CombatSkillCooldownConfiguration {
  if (program.operatorId !== operator.operatorId) {
    throw new Error(
      `skill '${program.skillId}' belongs to '${program.operatorId}', expected '${operator.operatorId}'`,
    );
  }
  const multiplier = (operator.panel?.combatModifiers ?? []).reduce((result, modifier) => {
    if (
      modifier.kind === 'skillCooldownMultiplier' &&
      (Array.isArray(modifier.skillTypes)
        ? modifier.skillTypes.includes(program.skillType)
        : modifier.skillTypes === program.skillType)
    ) {
      return result * modifier.value;
    }
    return result;
  }, 1);
  if (!Number.isFinite(multiplier) || multiplier <= 0) {
    throw new RangeError(
      `skill '${program.skillId}' of '${operator.operatorId}' has invalid cooldown multiplier ${multiplier}`,
    );
  }
  return program.cooldownFrames === undefined
    ? {}
    : {
        periodFrames: program.cooldownFrames * multiplier,
        ...(program.costFrame === undefined ? {} : { commitFrame: program.costFrame }),
      };
}

/** 只绑定当前分支的动态周期倍率；保存状态由恢复入口先校验，再原样交给账本。 */
export function createCombatSkillCooldown(
  operator: CombatSkillCooldownOwner,
  program: CompiledSkillCooldownProgram,
  configuration: CombatSkillCooldownConfiguration,
  state?: SkillCooldownState,
): SkillCooldown {
  return new SkillCooldown(
    configuration.periodFrames,
    configuration.commitFrame,
    program.skillType === 'comboSkill'
      ? () => operator.buffRuntime?.getAttributeValue?.('ComboSkillCooldownScalar') ?? 1
      : undefined,
    state,
  );
}

/** 返回本次是否转为就绪；调用者仍负责一次性回执，不改变能力系统提供的冷却时间域。 */
export function advanceCombatSkillCooldown(
  operator: CombatSkillCooldownOwner,
  program: CompiledSkillCooldownProgram,
  cooldown: SkillCooldown,
  deltaSeconds: number,
): boolean {
  if (cooldown.ready) return false;
  const recoveryScalar =
    program.skillType === 'comboSkill'
      ? (operator.buffRuntime?.getAttributeValue?.('ComboSkillCooldownRecoveryScalar') ?? 1)
      : 1;
  if (!Number.isFinite(recoveryScalar) || recoveryScalar < 0) {
    throw new RangeError(
      `combo skill cooldown recovery scalar of '${operator.operatorId}' must be non-negative and finite, received ${recoveryScalar}`,
    );
  }
  return cooldown.advance(deltaSeconds * COMBAT_FRAMES_PER_SECOND * recoveryScalar);
}
