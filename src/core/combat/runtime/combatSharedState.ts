/**
 * 一场战斗中由所有干员和动态实例共同使用的数据。
 * 这里只保存时钟、资源、全局机制和编号分配器；干员、环境和动态实例数据由 CombatStateGraph 其他层保存。
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
