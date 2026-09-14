/**
 * 单个动作已经接入的内部数据。序列按步骤下标持有这些数据，子分支继续包含子序列。
 * null 表示步骤尚未提供数据，不能据此断言它无状态，也不能据此开放整场恢复。
 */
import type { ActionSequenceState } from './actionSequenceState';
import type { BranchActionState } from '../runtime/branchActionState';
import type { RepeatedActionState } from '../runtime/repeatedActionState';
import type { TargetLoopState } from '../runtime/targetLoopState';
import type { TimelineJumpState } from '../runtime/timelineJumpState';
import type { ActionBlackboardScopeState } from '../runtime/actionBlackboardScopeState';
import type { CombatEventListenerState } from '../runtime/combatEventListenerState';
import type { BuffReference } from '../buffs/buffReference';

/** 当前动作持有的登记。结束动作时按编号解除，不保存回调。 */
export interface ActionRegistrationState {
  registrationId: number | null;
}

/** 动作负责结束或转交的 Buff；对象句柄由当前分支按引用重新解析。 */
export interface ActionBuffReferencesState {
  active: boolean;
  readonly references: BuffReference[];
}

export type ActionStepData =
  | { readonly kind: 'playerActionMode'; readonly activation: ActionRegistrationState }
  | { readonly kind: 'basicAttackMapping'; readonly activation: ActionRegistrationState }
  | { readonly kind: 'skillSlotReplacement'; readonly activation: ActionRegistrationState }
  | { readonly kind: 'skillAffix'; readonly activation: ActionRegistrationState }
  | { readonly kind: 'actionDurationBuffs'; readonly buffs: ActionBuffReferencesState }
  | { readonly kind: 'inheritedBuff'; readonly buffs: ActionBuffReferencesState }
  | { readonly kind: 'buffHold'; readonly buffs: ActionBuffReferencesState }
  | { readonly kind: 'stateless' }
  | { readonly kind: 'sequence'; readonly sequence: ActionSequenceState }
  | {
      readonly kind: 'branch';
      readonly selection: BranchActionState;
      readonly branches: readonly ActionSequenceState[];
    }
  | { readonly kind: 'repeat'; readonly repetition: RepeatedActionState }
  | { readonly kind: 'targets'; readonly loop: TargetLoopState }
  | { readonly kind: 'blackboardScope'; readonly scope: ActionBlackboardScopeState }
  | { readonly kind: 'listener'; readonly listener: CombatEventListenerState }
  | { readonly kind: 'jump'; readonly jump: TimelineJumpState };
