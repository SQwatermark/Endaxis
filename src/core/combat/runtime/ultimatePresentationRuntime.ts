import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';

/** HideUIAction 普通分支的全场状态；不提供未经证实的统一施法门禁。 */
export class UltimatePresentationRuntime {
  #inUltimateCasting = false;

  constructor(
    readonly clock: CombatClock,
    readonly receipt: CombatReceiptSink,
  ) {}

  get inUltimateCasting(): boolean {
    return this.#inUltimateCasting;
  }

  setActive(active: boolean, sourceId: string, sourceActionId: string): void {
    // 原生为直接布尔写入，不擅自改成引用计数。
    this.#inUltimateCasting = active;
    this.receipt.record({
      frame: this.clock.frame,
      time: this.clock.time,
      event: 'UltimatePresentationChanged',
      sourceId,
      data: { sourceActionId, active, showUi: !active },
    });
  }
}
