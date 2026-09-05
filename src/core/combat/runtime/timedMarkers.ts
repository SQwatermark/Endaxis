/**
 * 保存单个战斗实体拥有的原生定时标记。
 * 标记允许同 ID 多实例；每个实例绑定创建时选择的时钟，查询时惰性过滤。
 */
export interface TimedMarkerClock {
  readonly time: number;
}

export const VALIDITY_TOLERANCE_SECONDS = 0.00001;

export interface TimedMarkerHandle {
  readonly sourceTargetId: string;
  remove(): void;
}

export type TimedMarkerFinishReason = 'expired' | 'removed' | 'ownerFinished';

export interface TimedMarkerSnapshot {
  readonly instanceId: number;
  readonly ownerId: string;
  readonly markerId: string;
  /** 可被 Buff 展示回执稳定引用的实例身份；同名重建不会复用。 */
  readonly sourceTargetId: string;
  readonly createdAt: number;
  readonly expiresAt: number;
}

export interface TimedMarkerContainerHooks {
  created?(snapshot: TimedMarkerSnapshot): void;
  finished?(snapshot: TimedMarkerSnapshot, reason: TimedMarkerFinishReason): void;
}

interface TimedMarkerEntry extends TimedMarkerSnapshot {
  readonly id: string;
  readonly clock: TimedMarkerClock;
  finished: boolean;
}

export class TimedMarkerContainer {
  readonly #entries: TimedMarkerEntry[] = [];
  #nextInstanceId = 1;

  constructor(
    readonly ownerId: string,
    readonly clock: TimedMarkerClock,
    readonly hooks: TimedMarkerContainerHooks = {},
  ) {}

  add(
    id: string,
    durationSeconds: number,
    clock: TimedMarkerClock = this.clock,
  ): TimedMarkerHandle {
    if (id.length === 0) throw new TypeError('timed marker id cannot be empty');
    if (!Number.isFinite(durationSeconds)) {
      throw new TypeError('timed marker duration must be finite');
    }
    const instanceId = this.#nextInstanceId++;
    const entry: TimedMarkerEntry = {
      id,
      markerId: id,
      instanceId,
      ownerId: this.ownerId,
      sourceTargetId: `${this.ownerId}:timed-marker:${instanceId}`,
      createdAt: clock.time,
      expiresAt: clock.time + durationSeconds,
      clock,
      finished: false,
    };
    this.#entries.push(entry);
    this.hooks.created?.(this.#snapshot(entry));
    return {
      sourceTargetId: entry.sourceTargetId,
      remove: () => this.#finish(entry, 'removed'),
    };
  }

  has(id: string): boolean {
    this.sweep();
    return this.#entries.some(
      marker =>
        !marker.finished &&
        marker.id === id &&
        marker.expiresAt - marker.clock.time >= -VALIDITY_TOLERANCE_SECONDS,
    );
  }

  /** 原生按 markerId 取当前实例；重复 ID 时最近创建的活动实例是本次覆盖来源。 */
  latestActiveSourceTargetId(id: string): string | undefined {
    this.sweep();
    return this.#entries.findLast(entry => !entry.finished && entry.id === id)?.sourceTargetId;
  }

  /** 由所属实体逐帧调用，确保没有条件查询时也能产生精确的结束边沿。 */
  sweep(): void {
    for (const entry of [...this.#entries]) {
      if (!entry.finished && entry.expiresAt - entry.clock.time < -VALIDITY_TOLERANCE_SECONDS) {
        this.#finish(entry, 'expired');
      }
    }
  }

  finishAll(reason: TimedMarkerFinishReason = 'ownerFinished'): void {
    for (const entry of [...this.#entries]) this.#finish(entry, reason);
  }

  #finish(entry: TimedMarkerEntry, reason: TimedMarkerFinishReason): void {
    if (entry.finished) return;
    entry.finished = true;
    this.hooks.finished?.(this.#snapshot(entry), reason);
    const index = this.#entries.indexOf(entry);
    if (index >= 0) this.#entries.splice(index, 1);
  }

  #snapshot(entry: TimedMarkerEntry): TimedMarkerSnapshot {
    return Object.freeze({
      instanceId: entry.instanceId,
      ownerId: entry.ownerId,
      markerId: entry.markerId,
      sourceTargetId: entry.sourceTargetId,
      createdAt: entry.createdAt,
      expiresAt: entry.expiresAt,
    });
  }
}
