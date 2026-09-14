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

export interface TimedMarkerEntry extends TimedMarkerSnapshot {
  readonly id: string;
  readonly clockId: number;
  finished: boolean;
}

/** 标记只保存时钟编号；具体读取哪份战斗时间由执行时的绑定提供。 */
export interface TimedMarkerState {
  readonly entries: TimedMarkerEntry[];
  nextInstanceId: number;
}

export function createTimedMarkerState(): TimedMarkerState {
  return { entries: [], nextInstanceId: 1 };
}

export class TimedMarkerContainer {
  readonly #clockIds = new WeakMap<TimedMarkerClock, number>();
  readonly #clocks: TimedMarkerClock[] = [];

  constructor(
    readonly ownerId: string,
    readonly clock: TimedMarkerClock,
    readonly hooks: TimedMarkerContainerHooks = {},
    readonly runtimeState = createTimedMarkerState(),
  ) {
    // 默认时钟始终占用 0。这样恢复后的 clockId=0 可立即读取，首次新增也不会改变编号。
    this.#clocks.push(clock);
    this.#clockIds.set(clock, 0);
    for (const entry of runtimeState.entries) {
      if (entry.clockId !== 0) {
        throw new Error(
          `timed marker '${entry.sourceTargetId}' uses unbound clock '${entry.clockId}'`,
        );
      }
    }
  }

  add(
    id: string,
    durationSeconds: number,
    clock: TimedMarkerClock = this.clock,
  ): TimedMarkerHandle {
    if (id.length === 0) throw new TypeError('timed marker id cannot be empty');
    if (!Number.isFinite(durationSeconds)) {
      throw new TypeError('timed marker duration must be finite');
    }
    const instanceId = this.runtimeState.nextInstanceId++;
    let clockId = this.#clockIds.get(clock);
    if (clockId === undefined) {
      clockId = this.#clocks.length;
      this.#clocks.push(clock);
      this.#clockIds.set(clock, clockId);
    }
    const entry: TimedMarkerEntry = {
      id,
      markerId: id,
      instanceId,
      ownerId: this.ownerId,
      sourceTargetId: `${this.ownerId}:timed-marker:${instanceId}`,
      createdAt: clock.time,
      expiresAt: clock.time + durationSeconds,
      clockId,
      finished: false,
    };
    this.runtimeState.entries.push(entry);
    this.hooks.created?.(this.#snapshot(entry));
    return {
      sourceTargetId: entry.sourceTargetId,
      remove: () => this.#finish(entry, 'removed'),
    };
  }

  has(id: string): boolean {
    this.sweep();
    return this.runtimeState.entries.some(
      marker =>
        !marker.finished &&
        marker.id === id &&
        marker.expiresAt - this.#clocks[marker.clockId]!.time >= -VALIDITY_TOLERANCE_SECONDS,
    );
  }

  /** 原生按 markerId 取当前实例；重复 ID 时最近创建的活动实例是本次覆盖来源。 */
  latestActiveSourceTargetId(id: string): string | undefined {
    this.sweep();
    return this.runtimeState.entries.findLast(entry => !entry.finished && entry.id === id)
      ?.sourceTargetId;
  }

  /** 由所属实体逐帧调用，确保没有条件查询时也能产生精确的结束边沿。 */
  sweep(): void {
    sweepTimedMarkers(this.runtimeState, id => this.#clocks[id]!.time, this.hooks);
  }

  finishAll(reason: TimedMarkerFinishReason = 'ownerFinished'): void {
    for (const entry of [...this.runtimeState.entries]) this.#finish(entry, reason);
  }

  /** 按保存的实例来源身份移除一个标记；已结束或不存在时保持幂等。 */
  remove(sourceTargetId: string): void {
    const entry = this.runtimeState.entries.find(
      candidate => candidate.sourceTargetId === sourceTargetId,
    );
    if (entry !== undefined) this.#finish(entry, 'removed');
  }

  #finish(entry: TimedMarkerEntry, reason: TimedMarkerFinishReason): void {
    finishTimedMarker(this.runtimeState, entry, reason, this.hooks);
  }

  #snapshot(entry: TimedMarkerEntry): TimedMarkerSnapshot {
    return snapshotTimedMarker(entry);
  }
}

/** 按扫描开始时的登记顺序处理到期，通知期间新建的标记留给下一次扫描。 */
export function sweepTimedMarkers(
  state: TimedMarkerState,
  readTime: (clockId: number) => number,
  hooks: TimedMarkerContainerHooks,
): void {
  for (const entry of [...state.entries]) {
    if (
      !entry.finished &&
      entry.expiresAt - readTime(entry.clockId) < -VALIDITY_TOLERANCE_SECONDS
    ) {
      finishTimedMarker(state, entry, 'expired', hooks);
    }
  }
}

export function finishTimedMarker(
  state: TimedMarkerState,
  entry: TimedMarkerEntry,
  reason: TimedMarkerFinishReason,
  hooks: TimedMarkerContainerHooks,
): void {
  if (entry.finished) return;
  entry.finished = true;
  hooks.finished?.(snapshotTimedMarker(entry), reason);
  const index = state.entries.indexOf(entry);
  if (index >= 0) state.entries.splice(index, 1);
}

function snapshotTimedMarker(entry: TimedMarkerEntry): TimedMarkerSnapshot {
  return Object.freeze({
    instanceId: entry.instanceId,
    ownerId: entry.ownerId,
    markerId: entry.markerId,
    sourceTargetId: entry.sourceTargetId,
    createdAt: entry.createdAt,
    expiresAt: entry.expiresAt,
  });
}
