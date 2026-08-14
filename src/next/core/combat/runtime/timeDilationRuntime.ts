/**
 * 管理战斗中的全局与实体时间倍率。这里复现原生实例仲裁和生命周期，
 * 只提供各时间域的倍率，不决定技能、Buff 或资源具体使用哪一路时钟。
 */
import type { FrameRuntime } from './combatSimulation';
import { COMBAT_FRAME_INTERVAL } from './combatClock';

const VALIDITY_EPSILON = 0.00001;
const GLOBAL_SCALE_SELECTION_EPSILON = 0.00001;

export type TimeScaleCurve = (progress: number) => number;

/** 普通动作使用原生数值槽位；终结技使用独立语义槽位，避免伪造尚未恢复的原生标签。 */
export type TimeDilationSlot = number | 'ultimate';

export interface TimeDilationSource {
  readonly sourceId: string;
  readonly sourceActionId: string;
  readonly sourceCastId?: string;
}

/** AbilitySystem 一帧内按不同原生用途消费的四路时间增量。 */
export interface AbilityTickDeltas {
  readonly defaultDeltaSeconds: number;
  readonly globalScaledDeltaSeconds: number;
  readonly selfScaledDeltaSeconds: number;
  readonly skillCooldownDeltaSeconds: number;
}

export function uniformAbilityTickDeltas(deltaSeconds: number): AbilityTickDeltas {
  return {
    defaultDeltaSeconds: deltaSeconds,
    globalScaledDeltaSeconds: deltaSeconds,
    selfScaledDeltaSeconds: deltaSeconds,
    skillCooldownDeltaSeconds: deltaSeconds,
  };
}

export interface TimeDilationRuntimeConfig {
  readonly priorities: ReadonlyMap<number, number>;
  /** 仅列出寿命使用全局时间的实体槽位；未列出的槽位使用原始帧时间。 */
  readonly entityLifetimeUsesGlobalScaleBySlot?: ReadonlyMap<number, boolean>;
  readonly curves?: ReadonlyMap<string, TimeScaleCurve>;
}

export interface StartGlobalTimeDilationOptions {
  readonly durationSeconds: number;
  readonly slot: TimeDilationSlot;
  readonly priority: number;
  readonly curve?: TimeScaleCurve;
  readonly constantScale?: number;
  readonly influenceSkillCooldownSeconds?: number;
  readonly ignoredOperatorIds?: readonly string[];
  readonly source?: TimeDilationSource;
}

export interface StartEntityTimeDilationOptions {
  readonly operatorId: string;
  readonly durationSeconds: number;
  readonly slot: number;
  readonly priority: number;
  readonly curve: TimeScaleCurve;
  readonly ignoreSlotCheck?: boolean;
  readonly source?: TimeDilationSource;
}

export interface TimeDilationInstanceSnapshot {
  readonly id: number;
  readonly durationSeconds: number;
  readonly elapsedSeconds: number;
  readonly slot: TimeDilationSlot;
  readonly priority: number;
  readonly currentScale: number;
  readonly source?: TimeDilationSource;
}

export type TimeDilationInstanceKind = 'global' | 'entity';
export type TimeDilationEndReason = 'natural' | 'replaced' | 'stopped';

export interface TimeDilationRuntimeObserver {
  readonly started?: (
    kind: TimeDilationInstanceKind,
    instance: TimeDilationInstanceSnapshot,
    operatorId?: string,
  ) => void;
  readonly rejected?: (
    kind: TimeDilationInstanceKind,
    instance: TimeDilationInstanceSnapshot,
    operatorId?: string,
  ) => void;
  readonly ended?: (
    kind: TimeDilationInstanceKind,
    instance: TimeDilationInstanceSnapshot,
    reason: TimeDilationEndReason,
    operatorId?: string,
  ) => void;
}

interface MutableTimeDilationInstance extends TimeDilationInstanceSnapshot {
  elapsedSeconds: number;
  currentScale: number;
  active: boolean;
}

interface GlobalTimeDilationInstance extends MutableTimeDilationInstance {
  readonly curve?: TimeScaleCurve;
  readonly constantScale?: number;
  readonly influenceSkillCooldownSeconds?: number;
  readonly ignoredOperatorIds: ReadonlySet<string>;
}

interface EntityTimeDilationInstance extends MutableTimeDilationInstance {
  readonly operatorId: string;
  readonly curve: TimeScaleCurve;
  readonly lifetimeUsesGlobalScale: boolean;
}

/** 原生时间膨胀管理器的行为等价边界；版本相关标签和曲线必须由装配层传入。 */
export class TimeDilationRuntime implements FrameRuntime {
  readonly #priorities: ReadonlyMap<number, number>;
  readonly #entityLifetimeUsesGlobalScaleBySlot: ReadonlyMap<number, boolean>;
  readonly #curves: ReadonlyMap<string, TimeScaleCurve>;
  readonly #globalInstances: GlobalTimeDilationInstance[] = [];
  readonly #entityInstances: EntityTimeDilationInstance[] = [];
  readonly #observer: TimeDilationRuntimeObserver;
  #nextInstanceId = 0;

  constructor(config: TimeDilationRuntimeConfig, observer: TimeDilationRuntimeObserver = {}) {
    this.#priorities = config.priorities;
    this.#entityLifetimeUsesGlobalScaleBySlot =
      config.entityLifetimeUsesGlobalScaleBySlot ?? new Map();
    this.#curves = config.curves ?? new Map();
    this.#observer = observer;
  }

  get currentGlobalScale(): number {
    return this.#selectActiveGlobal()?.currentScale ?? 1;
  }

  get activeGlobalInfluencesSkillCooldown(): boolean {
    const active = this.#selectActiveGlobal();
    return (
      active?.influenceSkillCooldownSeconds !== undefined &&
      active.elapsedSeconds <= active.influenceSkillCooldownSeconds
    );
  }

  get globalInstances(): readonly TimeDilationInstanceSnapshot[] {
    return this.#globalInstances.map(snapshotInstance);
  }

  get entityInstances(): readonly (TimeDilationInstanceSnapshot & { operatorId: string })[] {
    return this.#entityInstances.map(instance => ({
      ...snapshotInstance(instance),
      operatorId: instance.operatorId,
    }));
  }

  resolveCurve(key: string): TimeScaleCurve {
    if (key.length === 0) throw new Error('time-dilation curve key must not be empty');
    const curve = this.#curves.get(key);
    if (curve === undefined) throw new Error(`unknown time-dilation curve '${key}'`);
    return curve;
  }

  startGlobal(options: StartGlobalTimeDilationOptions): number {
    validateDuration(options.durationSeconds);
    if (options.curve === undefined && options.constantScale === undefined) {
      throw new Error('global time dilation requires a curve or constant scale');
    }
    if (options.constantScale !== undefined) validateScale(options.constantScale);
    this.#priorityOf(options.priority);

    const instance: GlobalTimeDilationInstance = {
      id: ++this.#nextInstanceId,
      durationSeconds: options.durationSeconds,
      elapsedSeconds: 0,
      slot: options.slot,
      priority: options.priority,
      currentScale: 1,
      active: false,
      ...(options.curve === undefined ? {} : { curve: options.curve }),
      ...(options.constantScale === undefined ? {} : { constantScale: options.constantScale }),
      ...(options.influenceSkillCooldownSeconds === undefined
        ? {}
        : { influenceSkillCooldownSeconds: options.influenceSkillCooldownSeconds }),
      ignoredOperatorIds: new Set(options.ignoredOperatorIds ?? []),
      ...(options.source === undefined ? {} : { source: options.source }),
    };
    if (!this.#tryAddGlobal(instance)) {
      this.#observer.rejected?.('global', snapshotInstance(instance));
      return instance.id;
    }
    this.#tickGlobal(instance, 0);
    this.#observer.started?.('global', snapshotInstance(instance));
    return instance.id;
  }

  startUltimate(
    priority: number,
    targetScale: number,
    ignoredOperatorIds: readonly string[],
    source?: TimeDilationSource,
  ): number {
    return this.startGlobal({
      durationSeconds: Number.MAX_VALUE,
      slot: 'ultimate',
      priority,
      constantScale: targetScale,
      ignoredOperatorIds,
      ...(source === undefined ? {} : { source }),
    });
  }

  startEntity(options: StartEntityTimeDilationOptions): number {
    if (options.operatorId.length === 0) throw new Error('operator id must not be empty');
    validateDuration(options.durationSeconds);
    this.#priorityOf(options.priority);
    const instance: EntityTimeDilationInstance = {
      id: ++this.#nextInstanceId,
      operatorId: options.operatorId,
      durationSeconds: options.durationSeconds,
      elapsedSeconds: 0,
      slot: options.slot,
      priority: options.priority,
      currentScale: 1,
      active: false,
      curve: options.curve,
      lifetimeUsesGlobalScale: this.#entityLifetimeUsesGlobalScaleBySlot.get(options.slot) ?? false,
      ...(options.source === undefined ? {} : { source: options.source }),
    };
    if (!this.#tryAddEntity(instance, options.ignoreSlotCheck === true)) {
      this.#observer.rejected?.('entity', snapshotInstance(instance), instance.operatorId);
      return instance.id;
    }
    this.#tickEntity(instance, 0, this.currentGlobalScale);
    this.#observer.started?.('entity', snapshotInstance(instance), instance.operatorId);
    return instance.id;
  }

  stop(instanceId: number): void {
    const entityIndex = this.#entityInstances.findIndex(instance => instance.id === instanceId);
    if (entityIndex >= 0) {
      const [instance] = this.#entityInstances.splice(entityIndex, 1);
      this.#observer.ended?.(
        'entity',
        snapshotInstance(instance!),
        'stopped',
        instance!.operatorId,
      );
      return;
    }
    const globalIndex = this.#globalInstances.findIndex(instance => instance.id === instanceId);
    if (globalIndex >= 0) {
      const [instance] = this.#globalInstances.splice(globalIndex, 1);
      this.#observer.ended?.('global', snapshotInstance(instance!), 'stopped');
    }
  }

  getOperatorScale(operatorId: string): number {
    const localScale = this.#entityInstances
      .filter(instance => instance.operatorId === operatorId)
      .reduce((scale, instance) => scale * instance.currentScale, 1);
    const ignoresGlobal = this.#globalInstances.some(
      instance => instance.active && instance.ignoredOperatorIds.has(operatorId),
    );
    return Math.max(0, localScale * (ignoresGlobal ? 1 : this.currentGlobalScale));
  }

  /** 按原生 AbilitySystem.PreLateTick 分支生成本实体使用的四路时钟。 */
  getAbilityTickDeltas(
    operatorId: string,
    rawDeltaSeconds: number,
    timeManagerDeltaMode: number,
  ): AbilityTickDeltas {
    if (!Number.isFinite(rawDeltaSeconds) || rawDeltaSeconds < 0) {
      throw new RangeError('raw delta seconds must be a non-negative finite number');
    }
    if (!Number.isInteger(timeManagerDeltaMode)) {
      throw new TypeError('time-manager delta mode must be an integer');
    }
    const globalScaledDeltaSeconds = rawDeltaSeconds * this.currentGlobalScale;
    const defaultDeltaSeconds =
      timeManagerDeltaMode === 2 ? rawDeltaSeconds : globalScaledDeltaSeconds;
    return {
      defaultDeltaSeconds,
      globalScaledDeltaSeconds,
      selfScaledDeltaSeconds: rawDeltaSeconds * this.getOperatorScale(operatorId),
      skillCooldownDeltaSeconds: this.activeGlobalInfluencesSkillCooldown
        ? globalScaledDeltaSeconds
        : defaultDeltaSeconds,
    };
  }

  advanceFrame(): void {
    const globalScale = this.currentGlobalScale;
    for (let index = this.#entityInstances.length - 1; index >= 0; index -= 1) {
      const instance = this.#entityInstances[index]!;
      if (isValid(instance)) {
        this.#tickEntity(instance, COMBAT_FRAME_INTERVAL, globalScale);
      } else {
        const [removed] = this.#entityInstances.splice(index, 1);
        this.#observer.ended?.(
          'entity',
          snapshotInstance(removed!),
          'natural',
          removed!.operatorId,
        );
      }
    }
    for (let index = this.#globalInstances.length - 1; index >= 0; index -= 1) {
      const instance = this.#globalInstances[index]!;
      if (isValid(instance)) {
        this.#tickGlobal(instance, COMBAT_FRAME_INTERVAL);
      } else {
        const [removed] = this.#globalInstances.splice(index, 1);
        this.#observer.ended?.('global', snapshotInstance(removed!), 'natural');
      }
    }
  }

  #tryAddGlobal(candidate: GlobalTimeDilationInstance): boolean {
    for (let index = this.#globalInstances.length - 1; index >= 0; index -= 1) {
      const current = this.#globalInstances[index]!;
      if (current.slot !== candidate.slot) continue;
      if (this.#priorityOf(current.priority) > this.#priorityOf(candidate.priority)) return false;
      const [removed] = this.#globalInstances.splice(index, 1);
      this.#observer.ended?.('global', snapshotInstance(removed!), 'replaced');
    }
    this.#globalInstances.push(candidate);
    return true;
  }

  #tryAddEntity(candidate: EntityTimeDilationInstance, ignoreSlotCheck: boolean): boolean {
    for (let index = this.#entityInstances.length - 1; index >= 0; index -= 1) {
      const current = this.#entityInstances[index]!;
      if (
        current.operatorId !== candidate.operatorId ||
        ignoreSlotCheck ||
        current.slot !== candidate.slot
      ) {
        continue;
      }
      if (this.#priorityOf(current.priority) > this.#priorityOf(candidate.priority)) return false;
      const [removed] = this.#entityInstances.splice(index, 1);
      this.#observer.ended?.('entity', snapshotInstance(removed!), 'replaced', removed!.operatorId);
    }
    this.#entityInstances.push(candidate);
    return true;
  }

  #priorityOf(tag: number): number {
    const priority = this.#priorities.get(tag);
    if (priority === undefined) throw new Error(`unknown time-dilation priority '${tag}'`);
    return priority;
  }

  #selectActiveGlobal(): GlobalTimeDilationInstance | undefined {
    let selected: GlobalTimeDilationInstance | undefined;
    let selectedScale = Number.MAX_VALUE;
    for (const instance of this.#globalInstances) {
      if (selectedScale - GLOBAL_SCALE_SELECTION_EPSILON <= instance.currentScale) continue;
      selected = instance;
      selectedScale = instance.currentScale;
    }
    return selected;
  }

  #tickGlobal(instance: GlobalTimeDilationInstance, deltaSeconds: number): void {
    instance.currentScale = Math.max(
      0,
      instance.constantScale ?? instance.curve!(curveProgress(instance)),
    );
    instance.active = true;
    instance.elapsedSeconds += deltaSeconds;
  }

  #tickEntity(
    instance: EntityTimeDilationInstance,
    deltaSeconds: number,
    globalScale: number,
  ): void {
    instance.currentScale = Math.max(0, instance.curve(curveProgress(instance)));
    instance.active = true;
    instance.elapsedSeconds += instance.lifetimeUsesGlobalScale
      ? deltaSeconds * globalScale
      : deltaSeconds;
  }
}

function curveProgress(instance: MutableTimeDilationInstance): number {
  return Math.min(1, Math.max(0, instance.elapsedSeconds / instance.durationSeconds));
}

function isValid(instance: MutableTimeDilationInstance): boolean {
  return (
    instance.active &&
    (instance.durationSeconds < 0 ||
      instance.elapsedSeconds <= instance.durationSeconds + VALIDITY_EPSILON)
  );
}

function snapshotInstance(instance: MutableTimeDilationInstance): TimeDilationInstanceSnapshot {
  return Object.freeze({
    id: instance.id,
    durationSeconds: instance.durationSeconds,
    elapsedSeconds: instance.elapsedSeconds,
    slot: instance.slot,
    priority: instance.priority,
    currentScale: instance.currentScale,
    ...(instance.source === undefined ? {} : { source: Object.freeze({ ...instance.source }) }),
  });
}

function validateDuration(value: number): void {
  if (!Number.isFinite(value) || value === 0) {
    throw new RangeError('time-dilation duration must be finite and non-zero');
  }
}

function validateScale(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('time scale must be a non-negative finite number');
  }
}
