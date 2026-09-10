import type { FrameRuntime } from './combatSimulation';
import type { AbilityResetReference } from '../events/combatAbilityEvent';

/** A specific projected projectile, not its source skill or a public battle event. */
export type ProjectileLifetimeReference = AbilityResetReference;

interface ProjectileLifetime {
  phase: 'active' | 'finished' | 'marked' | 'reset';
  remainingSeconds: number;
  readonly recycleDelaySeconds: number;
  readonly resetCallbacks: Set<() => void>;
  readonly resolveTickDeltaSeconds: () => number | null;
  readonly finish: () => void;
  readonly beforeReset: () => void;
  readonly abilityRuntime?: FrameRuntime;
}

/**
 * Duration-finish projection of ProjectileComponent's lifetime. The host supplies an
 * admitted, owner-scaled Tick delta (null means no Tick). Finishing, marking recycling,
 * and resetting occur in separate passes, even with a zero recycle delay.
 * No spatial behavior, source-skill cancellation, or synthetic public event is implied.
 */
export class ProjectileLifecycleRuntime implements FrameRuntime {
  readonly #instances = new Set<ProjectileLifetime>();
  #admittedAbilities: readonly ProjectileLifetime[] | null = null;

  /** Capture at Battle-group entry, not after operator actions have spawned new objects. */
  beginAbilityFrame(): void {
    if (this.#admittedAbilities !== null)
      throw new Error('projectile ability phase has not finished');
    this.#admittedAbilities = [...this.#instances];
  }

  /** The ability host owns its clock and cast-frame zero delta; component delta is not reused. */
  advanceAbilityFrame(): void {
    const admitted = this.#admittedAbilities;
    if (admitted === null) throw new Error('projectile ability phase must be captured first');
    try {
      for (const instance of admitted) {
        if (instance.phase !== 'reset') instance.abilityRuntime?.advanceFrame();
      }
    } finally {
      this.#admittedAbilities = null;
    }
  }

  launch(request: {
    readonly finishDelaySeconds: number;
    readonly recycleDelaySeconds: number;
    readonly resolveTickDeltaSeconds: () => number | null;
    readonly finish: () => void;
    /** End this projectile's current callback skill before notifying retained references. */
    readonly beforeReset: () => void;
    /** Actual callback AbilitySystem host; no skill interpreter or timer is created here. */
    readonly abilityRuntime?: FrameRuntime;
  }): ProjectileLifetimeReference {
    const finishDelay = Math.fround(request.finishDelaySeconds);
    const recycleDelay = Math.fround(request.recycleDelaySeconds);
    if (!Number.isFinite(finishDelay) || finishDelay <= 0)
      throw new RangeError('projectile finish delay must be positive and finite');
    if (!Number.isFinite(recycleDelay) || request.recycleDelaySeconds < 0)
      throw new RangeError('projectile recycle delay must be non-negative and finite');
    const instance: ProjectileLifetime = {
      phase: 'active',
      remainingSeconds: finishDelay,
      recycleDelaySeconds: recycleDelay,
      resetCallbacks: new Set(),
      resolveTickDeltaSeconds: request.resolveTickDeltaSeconds,
      finish: request.finish,
      beforeReset: request.beforeReset,
      ...(request.abilityRuntime === undefined ? {} : { abilityRuntime: request.abilityRuntime }),
    };
    this.#instances.add(instance);
    return {
      onReset: callback => {
        if (instance.phase === 'reset')
          throw new Error('cannot retain an already reset projectile');
        // Each registration is independent, including repeated registrations of one function.
        const entry = () => callback();
        instance.resetCallbacks.add(entry);
        return { dispose: () => instance.resetCallbacks.delete(entry) };
      },
    };
  }

  advanceFrame(): void {
    // Callbacks may launch another projectile; it must not gain a Tick in this pass.
    for (const instance of [...this.#instances]) {
      const delta = instance.resolveTickDeltaSeconds();
      if (delta === null) continue;
      const nativeDelta = Math.fround(delta);
      if (!Number.isFinite(nativeDelta) || delta < 0)
        throw new RangeError('projectile Tick delta must be non-negative and finite');
      if (instance.phase === 'marked') {
        instance.beforeReset();
        instance.phase = 'reset';
        this.#instances.delete(instance);
        try {
          for (const callback of [...instance.resetCallbacks]) callback();
        } finally {
          instance.resetCallbacks.clear();
        }
        continue;
      }
      // Native PeriodicTimer.Update compares remaining <= 0, without isReady's epsilon.
      instance.remainingSeconds = Math.max(0, Math.fround(instance.remainingSeconds - nativeDelta));
      if (instance.remainingSeconds > 0) continue;
      if (instance.phase === 'active') {
        instance.phase = 'finished';
        instance.remainingSeconds = instance.recycleDelaySeconds;
        instance.finish();
      } else {
        instance.phase = 'marked';
      }
    }
  }

  get activeCount(): number {
    return this.#instances.size;
  }
}
