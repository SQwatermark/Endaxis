import { CombatClock } from './combatClock';

export interface FrameRuntime {
  advanceFrame(): void;
}

/** Advances the shared clock before ticking registered runtime systems. */
export class CombatSimulation {
  readonly #systems: FrameRuntime[] = [];

  constructor(readonly clock: CombatClock) {}

  add(system: FrameRuntime): void {
    this.#systems.push(system);
  }

  advanceFrame(): void {
    this.clock.advanceFrame();
    for (const system of this.#systems) system.advanceFrame();
  }

  advanceFrames(count: number): void {
    if (!Number.isInteger(count) || count < 0) {
      throw new RangeError('frame count must be a non-negative integer');
    }
    for (let frame = 0; frame < count; frame += 1) this.advanceFrame();
  }
}
