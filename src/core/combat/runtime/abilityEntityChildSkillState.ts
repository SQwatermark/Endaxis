/**
 * 能力实体的一次子技能执行数据。
 * 恢复时还需同一固定技能程序及其伤害快照槽位映射，不能只凭此数据执行。
 */
import type { ActionBlackboardState } from './actionBlackboardState';
import type { RuntimeTargetContextState } from './runtimeTargetContext';
import type { ActionScopeState } from './actionScopeState';
import type { TimelineRuntimeState } from '../timeline/timelineActionProcessor';
import type { DamageCalculationSnapshotState } from './damageCalculationSnapshots';
import type { CombatOperationHostState } from './combatOperationHostState';

export interface AbilityEntityChildSkillState {
  /** 会话内固定程序目录编号；恢复时不得按遍历顺序重新登记。 */
  readonly programId: number;
  /** 在所属能力实体定义中解析固定程序；同一实体可以依次启动多个不同子技能。 */
  readonly skillId: string;
  passedFrames: number;
  started: boolean;
  finished: boolean;
  readonly blackboard: ActionBlackboardState;
  readonly targets: RuntimeTargetContextState;
  readonly scopes: ActionScopeState;
  readonly timeline: TimelineRuntimeState;
  readonly damageSnapshots: DamageCalculationSnapshotState;
  /** 子技能复用来源动作链时，与来源宿主共享同一动作关系数据。 */
  readonly operations: CombatOperationHostState;
}
