/**
 * 技能宿主已经接入的数据层次。各字段引用正式执行所用的数据，不能另建一份镜像。
 * 冷却和实体黑板可以被多个宿主共享，整图复制必须保留这种关系。
 * 可用于重新绑定技能宿主；操作执行器、Buff 和事件环境必须从同一份战斗切面恢复，不能单独恢复本结构。
 */
import type { SkillExecutionState } from './skillExecutionState';
import type { ActionBlackboardState } from './actionBlackboardState';
import type { SkillCooldownState } from './skillCooldownState';
import type { ActionScopeState } from './actionScopeState';
import type { TimelineRuntimeState } from '../timeline/timelineActionProcessor';
import type { DamageCalculationSnapshotState } from './damageCalculationSnapshots';
import type { ActionBlackboardValue } from '../../../../packages/game-data-contract/src/primitives';
import type { CombatOperationHostState } from './combatOperationHostState';

export interface SkillRuntimeState {
  /** 文档施放身份属于当前实例；null 为没有人工技能块身份的宿主。 */
  readonly castId: string | null;
  readonly execution: SkillExecutionState;
  readonly blackboard: ActionBlackboardState;
  /** 再次施放时恢复的初值，不能用已经被动作修改的当前黑板代替。 */
  readonly initialBlackboard: Readonly<Record<string, ActionBlackboardValue>>;
  readonly cooldown: SkillCooldownState;
  readonly scopes: ActionScopeState;
  readonly damageSnapshots: DamageCalculationSnapshotState;
  /** 动作开始到结束之间持有的实体、Buff、时间、资源和标记关系。 */
  readonly operations: CombatOperationHostState;
  /** 每次实际开始施放时替换；未开始时没有动作时间轴。 */
  timeline: TimelineRuntimeState | null;
}
