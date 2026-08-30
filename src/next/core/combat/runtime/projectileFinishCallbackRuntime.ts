import type { FrameRuntime } from './combatSimulation';

interface PendingProjectileFinishCallback {
  remainingSeconds: number;
  readonly resolveDeltaSeconds: () => number;
  readonly execute: () => void;
}

/** 发射时注册、独立于父技能寿命的 Projectile duration-finish 队列。 */
export class ProjectileFinishCallbackRuntime implements FrameRuntime {
  readonly #pending: PendingProjectileFinishCallback[] = [];

  schedule(request: {
    readonly delaySeconds: number;
    readonly resolveDeltaSeconds: () => number;
    readonly execute: () => void;
  }): void {
    if (!Number.isFinite(request.delaySeconds) || request.delaySeconds <= 0) {
      throw new RangeError('projectile finish delay must be a positive finite number');
    }
    this.#pending.push({
      remainingSeconds: request.delaySeconds,
      resolveDeltaSeconds: request.resolveDeltaSeconds,
      execute: request.execute,
    });
  }

  advanceFrame(): void {
    const due: PendingProjectileFinishCallback[] = [];
    for (const callback of [...this.#pending]) {
      const deltaSeconds = callback.resolveDeltaSeconds();
      if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) {
        throw new RangeError('projectile finish delta must be non-negative and finite');
      }
      callback.remainingSeconds = Math.max(0, callback.remainingSeconds - deltaSeconds);
      if (callback.remainingSeconds <= 0.00001) due.push(callback);
    }
    for (const callback of due) {
      const index = this.#pending.indexOf(callback);
      if (index >= 0) this.#pending.splice(index, 1);
      callback.execute();
    }
  }

  get pendingCount(): number {
    return this.#pending.length;
  }
}
