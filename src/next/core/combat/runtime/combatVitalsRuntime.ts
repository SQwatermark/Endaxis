import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { COMBAT_FRAME_INTERVAL, type CombatClock } from './combatClock';
import type { CombatVitals, PoiseTimerTransition } from './combatVitals';
import type { FrameRuntime } from './combatSimulation';

export type CombatVitalsEvent = 'poiseRecovered';

export interface CombatVitalsRuntimeDependencies {
  readonly ownerId: string;
  readonly clock: CombatClock;
  readonly vitals: CombatVitals;
  readonly receipt: CombatReceiptSink;
  readonly emitOwnerEvent: (event: CombatVitalsEvent) => void;
}

/** Advances health-adjacent timers and publishes transitions at their native boundaries. */
export class CombatVitalsRuntime implements FrameRuntime {
  constructor(readonly dependencies: CombatVitalsRuntimeDependencies) {}

  advanceFrame(): void {
    this.dependencies.vitals.tick(COMBAT_FRAME_INTERVAL, transition => {
      this.#publish(transition);
    });
  }

  #publish(transition: PoiseTimerTransition): void {
    if (transition === 'poiseRecovered') {
      this.dependencies.emitOwnerEvent('poiseRecovered');
    }
    this.dependencies.receipt.record({
      frame: this.dependencies.clock.frame,
      time: this.dependencies.clock.time,
      event: transition === 'poiseRecovered' ? 'PoiseRecovered' : 'PoiseBrokenTagEnded',
      targetId: this.dependencies.ownerId,
      data: {
        poise: this.dependencies.vitals.poise,
        hasPoiseBrokenTag: this.dependencies.vitals.hasPoiseBrokenTag,
      },
    });
  }
}
