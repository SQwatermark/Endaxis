/**
 * 正式战斗装配中的全场共享数据。这里连接各模块唯一的数据实例，不保存模块对象或执行函数。
 * 这只是完整战斗根的共享层：实体、技能、Buff、事件和随机流尚未全部接入，不能单独恢复。
 */
import type { CombatClockState } from './combatClock';
import type { CombatResourceState } from './combatResourceState';
import type { TimeDilationState } from './timeDilationState';
import type { ComboWindowState } from './comboWindowRuntime';
import type { UltimatePresentationState } from './ultimatePresentationRuntime';
import type { GlobalCooldownState } from './globalCooldowns';
import type { SkillCastInheritanceState } from './skillCastInheritanceOperationExecutor';
import type { AbilityEntityInstanceIdState } from './abilityEntityInstanceIdAllocator';
import type { SkillCastIdState } from './skillCastInfo';

export interface CombatSharedState {
  readonly clock: CombatClockState;
  readonly resources: CombatResourceState;
  readonly timeDilation: TimeDilationState | null;
  readonly comboWindows: ComboWindowState;
  readonly ultimatePresentation: UltimatePresentationState;
  readonly globalCooldowns: GlobalCooldownState;
  readonly basicAttackInheritance: SkillCastInheritanceState;
  readonly identities: {
    readonly abilityEntities: AbilityEntityInstanceIdState;
    readonly skillCasts: SkillCastIdState;
  };
}
