import { CombatClock } from './combatClock';

export interface FrameRuntime {
  advanceFrame(): void;
}

/** 先推进共享时钟，再更新已注册的运行时系统。 */
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
