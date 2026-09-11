import type { FrameRuntime } from './combatSimulation';
import type { AbilityResetReference } from '../events/combatAbilityEvent';
import type {
  AbilityEntityTargetRef,
  RuntimeTargetRef,
} from '../../game-data/logicalAbilityEntity';
import { AbilityEntityInstanceIdAllocator } from './abilityEntityInstanceIdAllocator';

/** A specific projected projectile, not its source skill or a public battle event. */
export type ProjectileLifetimeReference = AbilityResetReference & {
  /** Endaxis 内部动作宿主身份；公开原生事件仍只暴露 AbilityResetReference。 */
  readonly target: AbilityEntityTargetRef;
};

interface ProjectileLifetime {
  readonly instanceId: number;
  readonly source?: RuntimeTargetRef;
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
  readonly #instances = new Map<number, ProjectileLifetime>();
  #admittedAbilities: readonly ProjectileLifetime[] | null = null;
  readonly #allocateInstanceId: () => number;

  constructor(allocateInstanceId?: () => number) {
    const instanceIds = new AbilityEntityInstanceIdAllocator();
    this.#allocateInstanceId = allocateInstanceId ?? (() => instanceIds.allocate());
  }

  /** SourceFinder 保留一层来源；reset 通知完成后来源关系才释放。 */
  findSource(instanceId: number): RuntimeTargetRef | undefined {
    return this.#instances.get(instanceId)?.source;
  }

  isActive(target: RuntimeTargetRef): boolean {
    if (target.kind !== 'abilityEntity') return false;
    const instance = this.#instances.get(target.instanceId);
    return instance !== undefined && instance.phase !== 'reset';
  }

  /** Capture at Battle-group entry, not after operator actions have spawned new objects. */
  beginAbilityFrame(): void {
    if (this.#admittedAbilities !== null)
      throw new Error('projectile ability phase has not finished');
    this.#admittedAbilities = [...this.#instances.values()];
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
    readonly source?: RuntimeTargetRef;
    readonly finishDelaySeconds: number | 'firstTickReach';
    readonly recycleDelaySeconds: number;
    readonly resolveTickDeltaSeconds: () => number | null;
    readonly finish: () => void;
    /** End this projectile's current callback skill before notifying retained references. */
    readonly beforeReset: () => void;
    /** Actual callback AbilitySystem host; no skill interpreter or timer is created here. */
    readonly abilityRuntime?: FrameRuntime;
  }): ProjectileLifetimeReference {
    const finishOnFirstTick = request.finishDelaySeconds === 'firstTickReach';
    const finishDelay =
      typeof request.finishDelaySeconds === 'number' ? Math.fround(request.finishDelaySeconds) : 0;
    const recycleDelay = Math.fround(request.recycleDelaySeconds);
    if (!finishOnFirstTick && (!Number.isFinite(finishDelay) || finishDelay <= 0))
      throw new RangeError('projectile finish delay must be positive and finite');
    if (!Number.isFinite(recycleDelay) || request.recycleDelaySeconds < 0)
      throw new RangeError('projectile recycle delay must be non-negative and finite');
    const instanceId = this.#allocateInstanceId();
    if (!Number.isSafeInteger(instanceId) || instanceId <= 0)
      throw new RangeError('projectile AbilityEntity instance id must be a positive safe integer');
    if (this.#instances.has(instanceId))
      throw new Error(`duplicate projectile AbilityEntity instance id '${instanceId}'`);
    const instance: ProjectileLifetime = {
      instanceId,
      ...(request.source === undefined ? {} : { source: request.source }),
      phase: 'active',
      remainingSeconds: finishDelay,
      recycleDelaySeconds: recycleDelay,
      resetCallbacks: new Set(),
      resolveTickDeltaSeconds: request.resolveTickDeltaSeconds,
      finish: request.finish,
      beforeReset: request.beforeReset,
      ...(request.abilityRuntime === undefined ? {} : { abilityRuntime: request.abilityRuntime }),
    };
    this.#instances.set(instanceId, instance);
    return {
      target: { kind: 'abilityEntity', instanceId },
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
    for (const instance of [...this.#instances.values()]) {
      const delta = instance.resolveTickDeltaSeconds();
      if (delta === null) continue;
      const nativeDelta = Math.fround(delta);
      if (!Number.isFinite(nativeDelta) || delta < 0)
        throw new RangeError('projectile Tick delta must be non-negative and finite');
      if (instance.phase === 'marked') {
        instance.beforeReset();
        instance.phase = 'reset';
        try {
          for (const callback of [...instance.resetCallbacks]) callback();
        } finally {
          instance.resetCallbacks.clear();
          this.#instances.delete(instance.instanceId);
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
