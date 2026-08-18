/**
 * 保存单个战斗实体拥有的原生定时标记。
 * 标记允许同 ID 多实例；查询按当前共享战斗时钟惰性过滤，不自行推进另一套时间。
 */
interface TimedMarkerClock {
  readonly time: number;
}

const VALIDITY_TOLERANCE_SECONDS = 0.00001;

export interface TimedMarkerHandle {
  remove(): void;
}

interface TimedMarkerEntry {
  readonly id: string;
  readonly expiresAt: number;
  removed: boolean;
}

export class TimedMarkerContainer {
  readonly #entries: TimedMarkerEntry[] = [];

  constructor(
    readonly ownerId: string,
    readonly clock: TimedMarkerClock,
  ) {}

  add(id: string, durationSeconds: number): TimedMarkerHandle {
    if (id.length === 0) throw new TypeError('timed marker id cannot be empty');
    if (!Number.isFinite(durationSeconds)) {
      throw new TypeError('timed marker duration must be finite');
    }
    const entry: TimedMarkerEntry = {
      id,
      expiresAt: this.clock.time + durationSeconds,
      removed: false,
    };
    this.#entries.push(entry);
    return {
      remove: () => {
        entry.removed = true;
      },
    };
  }

  has(id: string): boolean {
    return this.#entries.some(
      marker =>
        !marker.removed &&
        marker.id === id &&
        marker.expiresAt - this.clock.time >= -VALIDITY_TOLERANCE_SECONDS,
    );
  }
}
