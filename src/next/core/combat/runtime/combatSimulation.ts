/**
 * 一次战斗实例的最小逐帧驱动器。
 * 当前注册顺序与原生同一 TickGroup 的列表顺序一致；跨阶段及跨实体注册来源仍由装配层显式确定。
 * 调用方不得依赖对象映射或集合的偶然遍历顺序注册系统。
 */
import { CombatClock } from './combatClock';

/** 由 `CombatSimulation` 按帧驱动的运行时子系统。 */
export interface FrameRuntime {
  advanceFrame(): void;
}

/** 先推进共享时钟，再按当前显式注册顺序更新运行时系统。 */
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
