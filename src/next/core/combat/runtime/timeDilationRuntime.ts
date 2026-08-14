/**
 * 管理战斗中的全局与实体时间倍率。这里复现原生实例仲裁和生命周期，
 * 只提供各时间域的倍率，不决定技能、Buff 或资源具体使用哪一路时钟。
 */
import type { FrameRuntime } from './combatSimulation';
import { COMBAT_FRAME_INTERVAL } from './combatClock';

const VALIDITY_EPSILON = 0.00001;
const GLOBAL_SCALE_SELECTION_EPSILON = 0.00001;

export type TimeScaleCurve = (progress: number) => number;

export interface TimeDilationSlotRule {
  readonly globalSlot: number;
  readonly entitySlot: number;
  readonly entityLifetimeUsesGlobalScale: boolean;
}

export interface TimeDilationRuntimeConfig {
  readonly priorities: ReadonlyMap<number, number>;
  readonly slotRules?: readonly TimeDilationSlotRule[];
  readonly curves?: ReadonlyMap<string, TimeScaleCurve>;
  readonly ultimateSlot?: number;
}

export interface StartGlobalTimeDilationOptions {
  readonly durationSeconds: number;
  readonly slot: number;
  readonly priority: number;
  readonly curve?: TimeScaleCurve;
  readonly constantScale?: number;
  readonly influenceSkillCooldownSeconds?: number;
  readonly ignoredOperatorIds?: readonly string[];
}

export interface StartEntityTimeDilationOptions {
  readonly operatorId: string;
  readonly durationSeconds: number;
  readonly slot: number;
  readonly priority: number;
  readonly curve: TimeScaleCurve;
  readonly ignoreSlotCheck?: boolean;
}

export interface TimeDilationInstanceSnapshot {
  readonly id: number;
  readonly durationSeconds: number;
  readonly elapsedSeconds: number;
  readonly slot: number;
  readonly priority: number;
  readonly currentScale: number;
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
  readonly #slotRules: readonly TimeDilationSlotRule[];
  readonly #curves: ReadonlyMap<string, TimeScaleCurve>;
  readonly #ultimateSlot?: number;
  readonly #globalInstances: GlobalTimeDilationInstance[] = [];
  readonly #entityInstances: EntityTimeDilationInstance[] = [];
  #nextInstanceId = 0;

  constructor(config: TimeDilationRuntimeConfig) {
    this.#priorities = config.priorities;
    this.#slotRules = config.slotRules ?? [];
    this.#curves = config.curves ?? new Map();
    this.#ultimateSlot = config.ultimateSlot;
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
    };
    if (!this.#tryAddGlobal(instance)) return instance.id;
    this.#tickGlobal(instance, 0);
    return instance.id;
  }

  startUltimate(
    priority: number,
    targetScale: number,
    ignoredOperatorIds: readonly string[],
  ): number {
    if (this.#ultimateSlot === undefined) {
      throw new Error('ultimate time-dilation slot is not configured');
    }
    return this.startGlobal({
      durationSeconds: Number.MAX_VALUE,
      slot: this.#ultimateSlot,
      priority,
      constantScale: targetScale,
      ignoredOperatorIds,
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
      lifetimeUsesGlobalScale:
        this.#slotRules.find(rule => rule.entitySlot === options.slot)
          ?.entityLifetimeUsesGlobalScale ?? false,
    };
    if (!this.#tryAddEntity(instance, options.ignoreSlotCheck === true)) return instance.id;
    this.#tickEntity(instance, 0, this.currentGlobalScale);
    return instance.id;
  }

  stop(instanceId: number): void {
    const entityIndex = this.#entityInstances.findIndex(instance => instance.id === instanceId);
    if (entityIndex >= 0) {
      this.#entityInstances.splice(entityIndex, 1);
      return;
    }
    const globalIndex = this.#globalInstances.findIndex(instance => instance.id === instanceId);
    if (globalIndex >= 0) this.#globalInstances.splice(globalIndex, 1);
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

  advanceFrame(): void {
    const globalScale = this.currentGlobalScale;
    for (let index = this.#entityInstances.length - 1; index >= 0; index -= 1) {
      const instance = this.#entityInstances[index]!;
      if (isValid(instance)) {
        this.#tickEntity(instance, COMBAT_FRAME_INTERVAL, globalScale);
      } else {
        this.#entityInstances.splice(index, 1);
      }
    }
    for (let index = this.#globalInstances.length - 1; index >= 0; index -= 1) {
      const instance = this.#globalInstances[index]!;
      if (isValid(instance)) {
        this.#tickGlobal(instance, COMBAT_FRAME_INTERVAL);
      } else {
        this.#globalInstances.splice(index, 1);
      }
    }
  }

  #tryAddGlobal(candidate: GlobalTimeDilationInstance): boolean {
    for (let index = this.#globalInstances.length - 1; index >= 0; index -= 1) {
      const current = this.#globalInstances[index]!;
      if (current.slot !== candidate.slot) continue;
      if (this.#priorityOf(current.priority) > this.#priorityOf(candidate.priority)) return false;
      this.#globalInstances.splice(index, 1);
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
      this.#entityInstances.splice(index, 1);
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
