/** 目标循环拥有子序列编号、目标和序列进度；具体动作内部数据仍需继续接入。 */
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type { ActionSequenceState } from '../actions/actionSequenceState';

export interface TargetLoopState {
  readonly activeBodies: number[];
  readonly bodies: Map<
    number,
    { readonly target: RuntimeTargetRef; readonly sequence: ActionSequenceState }
  >;
  nextBodyId: number;
}

export function createTargetLoopState(): TargetLoopState {
  return { activeBodies: [], bodies: new Map(), nextBodyId: 1 };
}
