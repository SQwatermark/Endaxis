export const COMBAT_FRAMES_PER_SECOND = 30 as const;
export const COMBAT_FRAME_INTERVAL = 1 / COMBAT_FRAMES_PER_SECOND;

export class CombatClock {
  #frame = 0;

  get frame(): number {
    return this.#frame;
  }

  get time(): number {
    return this.#frame / COMBAT_FRAMES_PER_SECOND;
  }

  advanceFrame(): void {
    this.#frame += 1;
  }
}
