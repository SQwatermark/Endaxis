/** 一条常驻连携条件在事件之间保留的数据。 */
import type { ActionBlackboardState } from './actionBlackboardState';
import type { CombatOperationHostState } from './combatOperationHostState';

export interface ComboSkillConditionState {
  /** 条件自己的 direct 板；entity 始终指向所属干员的共享板。 */
  readonly blackboard: ActionBlackboardState;
  /** 条件动作使用的公共动作宿主账本。 */
  readonly operations: CombatOperationHostState;
}
