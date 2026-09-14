/** 全局 Buff 结束时先注销技力修正，再固定子实例并逐个结束，不转发父实例结束原因。 */
import type { GlobalBuffInstanceState } from '../state/instanceState';
import type { BuffReference } from '../buffs/buffReference';
import type {
  SharedSpGainModifier,
  SharedSpRecoveryModifier,
} from '../resources/sharedSpGainModifiers';

export function finishGlobalBuffInstance(
  state: GlobalBuffInstanceState,
  host: {
    removeGain(modifier: SharedSpGainModifier): void;
    removeRecovery(modifier: SharedSpRecoveryModifier): void;
    resolveChild(reference: BuffReference): { finish(reason: 'other', source: null): boolean };
  },
): boolean {
  if (state.finished) return false;
  state.finished = true;
  for (const modifier of state.sharedSpGainModifiers) host.removeGain(modifier);
  for (const modifier of state.sharedSpRecoveryModifiers) host.removeRecovery(modifier);
  const children = state.children.map(reference => host.resolveChild(reference));
  for (const child of children) child.finish('other', null);
  state.children.length = 0;
  return true;
}
