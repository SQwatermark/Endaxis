import { VALIDITY_TOLERANCE_SECONDS, type TimedMarkerClock } from './timedMarkers';

/** BattleManager.GlobalTimedMarker 的排轴投影。独立命名空间，按角色/ID 刷新，不创建重复实例。 */
export class GlobalCooldowns {
  readonly #entries = new Map<string, Map<string, number>>();
  #lastTick: number;

  constructor(readonly clock: TimedMarkerClock) {
    this.#lastTick = clock.time;
  }

  set(characterId: string, markerId: string, durationSeconds: number): void {
    if (!characterId || !markerId)
      throw new TypeError('global cooldown requires character and marker IDs');
    if (!Number.isFinite(durationSeconds))
      throw new TypeError('global cooldown duration must be finite');
    this.#tick();
    const markers = this.#entries.get(characterId) ?? new Map<string, number>();
    markers.set(markerId, this.clock.time + durationSeconds);
    this.#entries.set(characterId, markers);
  }

  has(characterId: string, markerId: string): boolean {
    this.#tick();
    return this.#entries.get(characterId)?.has(markerId) ?? false;
  }

  /** 与现有确定性帧时钟对齐；新加的零时长项在同帧仍存在，下次推进时才清理。 */
  #tick(): void {
    if (this.#lastTick === this.clock.time) return;
    this.#lastTick = this.clock.time;
    for (const [characterId, markers] of this.#entries) {
      for (const [id, expiresAt] of markers) {
        if (expiresAt - this.clock.time < -VALIDITY_TOLERANCE_SECONDS) markers.delete(id);
      }
      if (!markers.size) this.#entries.delete(characterId);
    }
  }
}
