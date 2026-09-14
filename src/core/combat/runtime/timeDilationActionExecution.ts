/** 动作结束时清理它登记的膨胀和忽略设置；实际运行时操作由当前分支提供。 */
import type { TimeDilationActionState } from './timeDilationActionState';

/** 保留注册顺序，全部停止成功后才删除动作关系。 */
export function finishTimeDilationAction(
  state: TimeDilationActionState,
  slot: number,
  stop: (instanceId: number) => void,
): void {
  for (const id of state.instanceIds.get(slot) ?? []) stop(id);
  state.instanceIds.delete(slot);
}

/** 按原动作设置的反值恢复；不把它改成引用计数或推断此前状态。 */
export function revertTimeDilationIgnoreAction(
  state: TimeDilationActionState,
  slot: number,
  ignore: boolean,
  setIgnore: (entityId: string, ignore: boolean) => void,
): void {
  for (const entityId of state.ignoredEntityIds.get(slot) ?? []) setIgnore(entityId, !ignore);
  state.ignoredEntityIds.delete(slot);
}
