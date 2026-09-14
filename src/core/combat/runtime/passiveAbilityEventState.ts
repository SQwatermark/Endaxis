/**
 * 一个原生被动 Ability 的事件响应进度。
 *
 * `host` 保存启用状态、订阅和子 Buff 身份；`responses` 与编译结果中的响应顺序一致，保存每个
 * SequenceAction 的执行进度。黑板和动作宿主由更外层的来源状态持有，以便和初始化序列共享。
 */
import type { ActionSequenceState } from '../actions/actionSequenceState';
import { createAbilityEventHostState, type AbilityEventHostState } from './abilityEventHostState';
import type { ActionBlackboardState } from './actionBlackboardState';
import {
  createCombatOperationHostState,
  type CombatOperationHostState,
} from './combatOperationHostState';

export interface PassiveAbilityEventState {
  readonly host: AbilityEventHostState;
  /** 被动初始化、事件响应和结束动作共享的 direct 黑板。 */
  readonly blackboard: ActionBlackboardState;
  /** 被动来源动作跨开始和结束保存的全部关系。 */
  readonly operations: CombatOperationHostState;
  /** 常驻启用序列；保存后可在来源释放时继续执行原来的 End。 */
  enableSequence: ActionSequenceState | null;
  readonly responses: ActionSequenceState[];
}

export function createPassiveAbilityEventState(
  blackboard: ActionBlackboardState,
  operations: CombatOperationHostState = createCombatOperationHostState(),
): PassiveAbilityEventState {
  return {
    host: createAbilityEventHostState(),
    blackboard,
    operations,
    enableSequence: null,
    responses: [],
  };
}
