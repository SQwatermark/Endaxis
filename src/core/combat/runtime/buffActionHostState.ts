/**
 * Buff 生命周期动作的宿主数据。所有序列共用作用域、目标组和攻击快照。
 * 这里同时保存序列进度、事件订阅、SkillAffix 引用及定义级技能槽替换状态。
 * 处理函数不进入数据；恢复时由当前分支的定义和环境端口按稳定编号重新绑定。
 */
import type { ActionScopeState } from './actionScopeState';
import type { RuntimeTargetContextState } from './runtimeTargetContext';
import type { DamageCalculationSnapshotState } from './damageCalculationSnapshots';
import type { ActionSequenceState } from '../actions/actionSequenceState';
import type { TimelineRuntimeState } from '../timeline/timelineActionProcessor';
import type { SkillAffixState } from './skillAffixState';
import type { AbilityEventSubscriptionReference } from '../events/abilityEventState';

export interface BuffScheduledActionState {
  passedFrames: number;
  timeline: TimelineRuntimeState | null;
}

/** 一个常驻能力事件响应的序列进度及其事件目录订阅。 */
export interface BuffEventResponseState {
  readonly sequence: ActionSequenceState;
  readonly subscriptions: AbilityEventSubscriptionReference[];
}

export interface BuffActionHostState {
  readonly affixes: SkillAffixState[];
  nextAffixId: number;
  /** 与定义中的能力事件响应同序；同时保留动作进度和实际安装的订阅。 */
  readonly eventResponses: BuffEventResponseState[];
  readonly scopes: ActionScopeState;
  readonly targets: RuntimeTargetContextState;
  readonly damageSnapshots: DamageCalculationSnapshotState;
  enable: ActionSequenceState | null;
  trigger: ActionSequenceState | null;
  scheduled: BuffScheduledActionState | null;
  /** 定义级技能槽替换是否已经应用；结束时按定义逆序还原。 */
  skillSlotsReplaced: boolean;
}
