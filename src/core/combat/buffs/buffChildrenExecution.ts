/** 父子关系算法。结束时沿用实时遍历，结束回调中新添的子实例也在本轮处理。 */
import { buffReferenceKey, type BuffReference } from './buffReference';
import type { BuffChildrenState } from './buffChildrenState';

export function attachBuffChild(state: BuffChildrenState, reference: BuffReference): void {
  state.members.set(buffReferenceKey(reference), reference);
}

export function finishBuffChildren(
  state: BuffChildrenState,
  finish: (reference: BuffReference) => void,
): void {
  for (const reference of state.members.values()) finish(reference);
  state.members.clear();
}
