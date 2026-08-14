/**
 * 将全局时间倍率积分为项目时间轴使用的逻辑帧。
 * 技能、Buff 和冷却各自使用原生时钟；该对象只决定用户排入时间轴的后续输入何时到达。
 */
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { FrameRuntime } from './combatSimulation';

const SCALE_EPSILON = 0.000001;

export interface CombatTimelineClockOptions {
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly resolveGlobalScale: () => number;
}

/** 战斗实际帧与项目逻辑帧之间的运行时积分器。 */
export class CombatTimelineClock implements FrameRuntime {
  readonly #clock: CombatClock;
  readonly #receipt: CombatReceiptSink;
  readonly #resolveGlobalScale: () => number;
  #frame = 0;
  #previousScale = 1;

  constructor(options: CombatTimelineClockOptions) {
    this.#clock = options.clock;
    this.#receipt = options.receipt;
    this.#resolveGlobalScale = options.resolveGlobalScale;
  }

  get frame(): number {
    return this.#frame;
  }

  advanceFrame(): void {
    const scale = this.#resolveGlobalScale();
    if (!Number.isFinite(scale) || scale < 0) {
      throw new RangeError('global time scale must be a non-negative finite number');
    }
    this.#frame += scale;
    if (!approximatelyOne(scale) || !approximatelyOne(this.#previousScale)) {
      this.#receipt.record({
        frame: this.#clock.frame,
        time: this.#clock.time,
        event: 'TimelineTimeSampled',
        data: {
          logicalFrame: this.#frame,
          globalScale: scale,
        },
      });
    }
    this.#previousScale = scale;
  }
}

function approximatelyOne(value: number): boolean {
  return Math.abs(value - 1) <= SCALE_EPSILON;
}
