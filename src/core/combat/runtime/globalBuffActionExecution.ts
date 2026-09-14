import type { GlobalBuffActionState } from './globalBuffActionState';
import type { GlobalBuffInstanceState } from './globalBuffState';

/** 全部结束成功后才移除记录；结束回调抛错时保留原有未清理关系。 */
export function finishGlobalBuffAction(
  state: GlobalBuffActionState,
  slot: number,
  finish: (instance: GlobalBuffInstanceState) => void,
): void {
  for (const instance of state.active.get(slot) ?? []) finish(instance);
  state.active.delete(slot);
}
