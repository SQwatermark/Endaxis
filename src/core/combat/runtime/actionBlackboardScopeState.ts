/**
 * 黑板作用域动作当前创建的子序列。尚未执行或已经重置时 body 为 null。
 * 子黑板直接引用作用域实际使用的数据，以保留它与宿主实体板的共享关系。
 */
import type { ActionBlackboardState } from './actionBlackboardState';
import type { ActionSequenceState } from '../actions/actionSequenceState';

export interface ActionBlackboardScopeState {
  body: {
    readonly blackboard: ActionBlackboardState;
    readonly sequence: ActionSequenceState;
  } | null;
}
