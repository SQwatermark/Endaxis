/**
 * 全部运行时系统共享的确定性时间来源。
 * 调用方以整数帧推进，不能混入墙上时钟或自行维护另一套秒制时间。
 */
export const COMBAT_FRAMES_PER_SECOND = 30 as const;
export const COMBAT_FRAME_INTERVAL = 1 / COMBAT_FRAMES_PER_SECOND;

/** 一次模拟的可推进帧时钟；同一实例不得被多个模拟共享。 */
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
