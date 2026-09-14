/**
 * 一条干员养成或装备初始化程序在战斗中的数据。
 *
 * 初始化程序通常在第 0 帧同步完成，但它的启用序列可以持有直到来源释放才结束的动作，因此仍要
 * 保存两段序列、共享黑板和动作宿主。`initializationExecuted` 区分仅负责开放监听的空初始化。
 */
import type { ActionSequenceState } from '../actions/actionSequenceState';
import type { ActionBlackboardState } from './actionBlackboardState';
import type { CombatOperationHostState } from './combatOperationHostState';

export interface OperatorInitializationState {
  readonly key: string;
  readonly equipmentContributionIndex?: number;
  readonly blackboard: ActionBlackboardState;
  readonly operations: CombatOperationHostState;
  readonly enableSequence: ActionSequenceState | null;
  readonly initializationSequence: ActionSequenceState;
  initializationExecuted: boolean;
}
