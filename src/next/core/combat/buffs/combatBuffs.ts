/**
 * 一次模拟中每个实体的 Buff 状态所有者。
 * 调用方通过稳定定义添加 Buff，并按战斗时钟推进；不得把实例写回目录或项目存档。
 */
import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
  attributeModifierValues,
  type AttributeModifierSlot,
  type AttributeModifierTiming,
  type AttributeModifierValues,
  type CombatAttributeSet,
} from '../attributes/combatAttributes';
import { DamageModifier, type DamageModifierDefinition } from '../damage/damageModifiers';
import type {
  DamageModifierSide,
  DamageProcessTiming,
  PlayerDamageContext,
} from '../damage/playerDamageContext';
import { ActionBlackboard, type ActionBlackboardValue } from '../runtime/actionBlackboard';

const BUFF_LIFETIME_EPSILON = 0.00001;
const BUFF_PRIORITY_EPSILON = 0.00001;

export const BUFF_STACKING_TYPES = [
  'unlimited',
  'highPriority',
  'stack',
  'enhance',
  'refresh',
  'extend',
  'modify',
  'unique',
  'enhanceAndRefresh',
  'overwriteDuration',
  'enhanceAndOverwriteDuration',
  'highPriorityWithMaxStack',
] as const;
/** 同身份 Buff 再次添加时采用的原生叠加策略。 */
export type BuffStackingType = (typeof BUFF_STACKING_TYPES)[number];

export const BUFF_FINISH_REASONS = [
  'lifetime',
  'ignite',
  'early',
  'dispelled',
  'absorbed',
  'other',
] as const;
/** Buff 结束时记录并传给生命周期行为的原因。 */
export type BuffFinishReason = (typeof BUFF_FINISH_REASONS)[number];

/** 从 Buff 实例黑板读取单个原生属性槽位值的动态修正。 */
export interface BuffBlackboardAttributeModifierValues {
  readonly slot: AttributeModifierSlot;
  readonly blackboardKey: string;
}

/** Buff 属性修正可使用固定八槽值，也可在实例运行期间从黑板重新解析。 */
export type BuffAttributeModifierValues =
  AttributeModifierValues | BuffBlackboardAttributeModifierValues;

/** Buff 激活期间向实体属性系统注册的一项修正。 */
export interface BuffAttributeModifierDefinition<Key extends string> {
  readonly attribute: Key;
  readonly values: BuffAttributeModifierValues;
  readonly timing: AttributeModifierTiming;
}

/** 固定秒数或由实例黑板提供的 Buff 持续时间。 */
export type BuffDuration = number | { readonly blackboardKey: string };
/** 固定值或由实例黑板提供的 Buff 可触发次数。 */
export type BuffTriggerCount = number | { readonly blackboardKey: string };
/** 固定最大层数，或从首次施加实例的黑板读取的动态最大层数。 */
export type BuffMaxStackCount = number | { readonly blackboardKey: string };
/** 固定优先级，或从实例黑板读取并按原生配置选择取反的动态优先级。 */
export type BuffPriority = number | { readonly blackboardKey: string; readonly negate?: boolean };

/** Buff 在启用、结束和移除边界执行的有序生命周期行为。 */
export interface BuffLifecycleActions<Key extends string> {
  readonly start?: (buff: CombatBuff<Key>) => void;
  readonly enable?: (buff: CombatBuff<Key>) => void;
  readonly disable?: (buff: CombatBuff<Key>) => void;
  readonly finish?: (buff: CombatBuff<Key>) => void;
  readonly beforeEnhance?: (buff: CombatBuff<Key>, sourceId: string) => void;
  readonly enhanceChanged?: (buff: CombatBuff<Key>, sourceId: string) => void;
  readonly afterEnhance?: (buff: CombatBuff<Key>, sourceId: string) => void;
  readonly trigger?: (buff: CombatBuff<Key>) => void;
}

/** 可复用、不可变的 Buff 目录定义；实例状态不应写回这里。 */
export interface CombatBuffDefinition<Key extends string> {
  readonly id: string;
  readonly stackingType: BuffStackingType;
  readonly stackingKey?: string;
  readonly priority?: BuffPriority;
  readonly maxStackCount?: BuffMaxStackCount;
  /** 缺少持续时间表示已还原出的无限生命周期。 */
  readonly durationSeconds?: BuffDuration;
  readonly triggerIntervalSeconds?: BuffDuration;
  readonly waitFirstTriggerInterval?: boolean;
  readonly maxTriggerCount?: BuffTriggerCount;
  readonly blackboard?: Readonly<Record<string, ActionBlackboardValue>>;
  readonly damageModifiers?: readonly DamageModifierDefinition[];
  readonly attributeModifiers?: readonly BuffAttributeModifierDefinition<Key>[];
  readonly actions?: BuffLifecycleActions<Key>;
}

/** 添加 Buff 实例时由具体行为提供的初始黑板和层数。 */
export interface CombatBuffAddOptions {
  readonly blackboardValues?: Readonly<Record<string, ActionBlackboardValue>>;
}

/** 一个实体上某项 Buff 的独立运行时实例。 */
export class CombatBuff<Key extends string> {
  readonly damageModifiers: readonly DamageModifier[];
  readonly blackboard: ActionBlackboard;
  readonly priority: number;
  #attributeModifiers: readonly CombatAttributeModifier<Key>[];
  #passedTime = 0;
  #remainingDuration: number | null;
  #started = false;
  #enabled = false;
  #finished = false;
  #finishing = false;
  #finishReason: BuffFinishReason | null = null;
  #enhanceCount = 1;
  #stackingGroup: BuffStackingGroup<Key> | null = null;
  #triggerInterval: number | null = null;
  #triggerRemainingTime = 0;
  #remainingTriggerCount = 0;

  constructor(
    readonly definition: CombatBuffDefinition<Key>,
    readonly owner: CombatBuffContainer<Key>,
    readonly sourceId: string,
    readonly instanceId: number,
    options?: CombatBuffAddOptions,
  ) {
    this.blackboard = new ActionBlackboard(definition.blackboard);
    this.blackboard.assign(options?.blackboardValues);
    this.priority = resolveBuffPriority(definition, this.blackboard);
    this.#remainingDuration = resolveBuffDuration(definition, this.blackboard);
    this.#remainingTriggerCount = resolveBuffTriggerCount(definition, this.blackboard);
    const triggerInterval = resolveOptionalBuffNumber(
      definition.id,
      'trigger interval',
      definition.triggerIntervalSeconds,
      this.blackboard,
    );
    if (triggerInterval !== null && !Number.isFinite(triggerInterval)) {
      throw new RangeError('buff trigger interval must resolve to a finite number');
    }
    if (triggerInterval !== null && triggerInterval > BUFF_LIFETIME_EPSILON) {
      this.#triggerInterval = triggerInterval;
      this.#triggerRemainingTime = definition.waitFirstTriggerInterval ? triggerInterval : 0;
    }
    this.damageModifiers = (definition.damageModifiers ?? []).map(
      modifier => new DamageModifier(owner.ownerId, modifier),
    );
    this.#attributeModifiers = this.createAttributeModifiers();
  }

  get passedTime(): number {
    return this.#passedTime;
  }

  get remainingDuration(): number | null {
    return this.#remainingDuration;
  }

  get isStarted(): boolean {
    return this.#started;
  }

  get isEnabled(): boolean {
    return this.#enabled;
  }

  get isFinished(): boolean {
    return this.#finished;
  }

  get finishReason(): BuffFinishReason | null {
    return this.#finishReason;
  }

  get enhanceCount(): number {
    return this.#enhanceCount;
  }

  get attributeModifiers(): readonly CombatAttributeModifier<Key>[] {
    return this.#attributeModifiers;
  }

  enable(): void {
    if (this.#finished || this.#enabled) return;
    this.#enabled = true;
    if (!this.#started) {
      this.#started = true;
      this.definition.actions?.start?.(this);
      this.triggerInternal(0);
    }

    this.owner.registerDamageModifiers(this.damageModifiers);
    try {
      for (const modifier of this.attributeModifiers) {
        this.owner.attributes.addModifier(modifier);
      }
    } catch (error) {
      this.removeAttributeModifiers();
      this.owner.unregisterDamageModifiers(this.damageModifiers);
      this.#enabled = false;
      throw error;
    }
    this.definition.actions?.enable?.(this);
  }

  disable(): void {
    if (!this.#enabled) return;
    this.definition.actions?.disable?.(this);
    this.owner.unregisterDamageModifiers(this.damageModifiers);
    this.removeAttributeModifiers();
    this.#enabled = false;
  }

  finish(reason: BuffFinishReason = 'other'): boolean {
    if (this.#finished || this.#finishing) return false;
    this.#finishing = true;
    this.#finishReason = reason;
    this.definition.actions?.finish?.(this);
    const hadRegisteredModifiers = this.#enabled;
    this.#enabled = false;
    this.#finished = true;
    this.#stackingGroup?.refreshAfterFinish();
    if (hadRegisteredModifiers) {
      this.owner.unregisterDamageModifiers(this.damageModifiers);
      this.removeAttributeModifiers();
    }
    this.#finishing = false;
    return true;
  }

  tick(deltaTime: number): void {
    if (this.#finished) return;
    if (!Number.isFinite(deltaTime)) throw new TypeError('buff delta time must be finite');
    const elapsed = Math.max(0, deltaTime);
    this.#passedTime += elapsed;
    if (this.#enabled) this.triggerInternal(elapsed);
    if (this.#remainingDuration === null) return;
    this.#remainingDuration = Math.max(0, this.#remainingDuration - elapsed);
    if (this.#remainingDuration <= BUFF_LIFETIME_EPSILON) this.finish('lifetime');
  }

  attachStackingGroup(group: BuffStackingGroup<Key>): void {
    this.#stackingGroup = group;
  }

  refreshDuration(incomingDuration: number | null): void {
    if (this.#remainingDuration === null || incomingDuration === null) {
      this.#remainingDuration = null;
      return;
    }
    if (incomingDuration > this.#remainingDuration + BUFF_LIFETIME_EPSILON) {
      this.#remainingDuration = incomingDuration;
    }
  }

  extendDuration(incomingDuration: number | null): void {
    if (this.#remainingDuration === null || incomingDuration === null) {
      this.#remainingDuration = null;
      return;
    }
    this.#remainingDuration += incomingDuration;
  }

  overwriteDuration(incomingDuration: number | null): void {
    this.#remainingDuration = incomingDuration;
  }

  executeBeforeEnhance(sourceId: string): void {
    this.definition.actions?.beforeEnhance?.(this, sourceId);
  }

  enhance(sourceId: string): void {
    this.#enhanceCount += 1;
    this.definition.actions?.enhanceChanged?.(this, sourceId);
  }

  executeAfterEnhance(sourceId: string): void {
    this.definition.actions?.afterEnhance?.(this, sourceId);
  }

  /** 原生 Modify 只合并输入黑板，并据旧定义重建已注册的属性修正。 */
  modify(options?: CombatBuffAddOptions): void {
    const previousBlackboard = this.blackboard.snapshot();
    this.blackboard.assign(options?.blackboardValues);
    try {
      this.replaceAttributeModifiers(this.createAttributeModifiers());
    } catch (error) {
      this.blackboard.restore(previousBlackboard);
      throw error;
    }
  }

  private triggerInternal(deltaTime: number): void {
    if (this.#remainingTriggerCount === 0 || this.#triggerInterval === null) return;
    this.#triggerRemainingTime -= deltaTime;
    if (this.#triggerRemainingTime > BUFF_LIFETIME_EPSILON) return;

    const triggerCount =
      Math.max(0, Math.trunc(-this.#triggerRemainingTime / this.#triggerInterval)) + 1;
    this.#triggerRemainingTime += triggerCount * this.#triggerInterval;
    for (let index = 0; index < triggerCount; index += 1) {
      if (this.#remainingTriggerCount === 0 || !this.#enabled) break;
      this.#remainingTriggerCount -= 1;
      this.definition.actions?.trigger?.(this);
    }
  }

  private removeAttributeModifiers(): void {
    for (const modifier of this.#attributeModifiers) {
      this.owner.attributes.removeModifier(modifier);
    }
  }

  private createAttributeModifiers(): readonly CombatAttributeModifier<Key>[] {
    return (this.definition.attributeModifiers ?? []).map(modifier => {
      const values = resolveBuffAttributeModifierValues(
        this.definition.id,
        modifier.values,
        this.blackboard,
      );
      return new CombatAttributeModifier(
        modifier.attribute,
        values,
        ATTRIBUTE_MODIFIER_SOURCES.buff,
        modifier.timing,
      );
    });
  }

  private replaceAttributeModifiers(replacements: readonly CombatAttributeModifier<Key>[]): void {
    if (this.#enabled) {
      let registeredCount = 0;
      try {
        for (const modifier of replacements) {
          this.owner.attributes.addModifier(modifier);
          registeredCount += 1;
        }
      } catch (error) {
        for (const modifier of replacements.slice(0, registeredCount)) {
          this.owner.attributes.removeModifier(modifier);
        }
        throw error;
      }

      this.removeAttributeModifiers();
    }
    this.#attributeModifiers = replacements;
  }
}

/** 按实体隔离的 Buff 存储与活动伤害修正注册表。 */
export class CombatBuffContainer<Key extends string> {
  readonly #buffs: CombatBuff<Key>[] = [];
  readonly #damageModifiers: DamageModifier[] = [];
  readonly #stackingGroups = new Map<string, BuffStackingGroup<Key>>();
  #nextInstanceId = 1;

  constructor(
    readonly ownerId: string,
    readonly attributes: CombatAttributeSet<Key>,
  ) {}

  get buffs(): readonly CombatBuff<Key>[] {
    return this.#buffs;
  }

  /** 添加成功时返回实例；原生叠加策略拒绝本次施加时返回 null。 */
  add(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> | null {
    const stackingKey = definition.stackingKey ?? definition.id;
    let group = this.#stackingGroups.get(stackingKey);
    if (group === undefined) {
      group = new BuffStackingGroup(this, stackingKey, definition.stackingType);
      this.#stackingGroups.set(stackingKey, group);
    }
    return group.stack(definition, sourceId, options);
  }

  allocateBuff(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    const buff = new CombatBuff(definition, this, sourceId, this.#nextInstanceId++, options);
    this.#buffs.push(buff);
    return buff;
  }

  getCountById(id: string): number {
    return this.#buffs
      .filter(buff => !buff.isFinished && buff.definition.id === id)
      .reduce((count, buff) => count + buff.enhanceCount, 0);
  }

  findFirst(predicate: (buff: CombatBuff<Key>) => boolean): CombatBuff<Key> | undefined {
    return this.#buffs.find(buff => !buff.isFinished && predicate(buff));
  }

  applyDamageModifiers(
    timing: DamageProcessTiming,
    side: DamageModifierSide,
    context: PlayerDamageContext,
  ): void {
    for (const modifier of this.#damageModifiers) modifier.apply(timing, side, context);
  }

  tick(deltaTime: number): void {
    for (const buff of this.#buffs) buff.tick(deltaTime);
  }

  registerDamageModifiers(modifiers: readonly DamageModifier[]): void {
    this.#damageModifiers.push(...modifiers);
  }

  unregisterDamageModifiers(modifiers: readonly DamageModifier[]): void {
    for (const modifier of modifiers) {
      const index = this.#damageModifiers.indexOf(modifier);
      if (index >= 0) this.#damageModifiers.splice(index, 1);
    }
  }
}

class BuffStackingGroup<Key extends string> {
  readonly #buffs: CombatBuff<Key>[] = [];
  #currentStackCount = 0;
  #maxStackCount = 0;

  constructor(
    readonly owner: CombatBuffContainer<Key>,
    readonly key: string,
    readonly stackingType: BuffStackingType,
  ) {}

  stack(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> | null {
    if (definition.stackingType !== this.stackingType) {
      throw new Error(
        `buff stacking key '${this.key}' changed type from '${this.stackingType}' to '${definition.stackingType}'`,
      );
    }
    const existing = this.#buffs.find(buff => !buff.isFinished);
    switch (this.stackingType) {
      case 'unlimited':
        return this.allocate(definition, sourceId, options);
      case 'highPriority':
        return this.allocatePrioritized(definition, sourceId, options);
      case 'highPriorityWithMaxStack':
        return this.allocatePrioritized(definition, sourceId, options);
      case 'stack':
        return this.stackInstances(definition, sourceId, options);
      case 'enhance':
        return this.enhance(existing, definition, sourceId, options);
      case 'refresh':
        return this.refresh(existing, definition, sourceId, options);
      case 'extend':
        return this.extend(existing, definition, sourceId, options);
      case 'modify':
        return this.modify(existing, definition, sourceId, options);
      case 'unique':
        return existing === undefined ? this.allocate(definition, sourceId, options) : null;
      case 'enhanceAndRefresh':
        return this.enhanceAndRefresh(existing, definition, sourceId, options);
      case 'overwriteDuration':
        return this.overwriteDuration(existing, definition, sourceId, options);
      case 'enhanceAndOverwriteDuration':
        return this.enhanceAndOverwriteDuration(existing, definition, sourceId, options);
      default:
        throw new Error(`buff stacking type '${this.stackingType}' is not implemented`);
    }
  }

  refreshAfterFinish(): void {
    this.#currentStackCount = this.#buffs.filter(buff => !buff.isFinished).length;
    if (this.stackingType === 'highPriority' || this.stackingType === 'highPriorityWithMaxStack') {
      this.refreshPriority();
    }
  }

  private allocate(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    const buff = this.owner.allocateBuff(definition, sourceId, options);
    buff.attachStackingGroup(this);
    this.#buffs.push(buff);
    buff.enable();
    return buff;
  }

  private stackInstances(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    const initialMaxStackCount =
      this.#currentStackCount === 0 ? resolveIncomingMaxStackCount(definition, options) : undefined;

    const buff = this.owner.allocateBuff(definition, sourceId, options);
    buff.attachStackingGroup(this);
    if (initialMaxStackCount !== undefined) this.#maxStackCount = initialMaxStackCount;
    if (this.#maxStackCount > 0 && this.#currentStackCount >= this.#maxStackCount) {
      this.getLastUnfinishedBuff()?.finish('other');
    }

    this.#buffs.push(buff);
    this.#currentStackCount = this.#buffs.filter(candidate => !candidate.isFinished).length;
    buff.enable();
    return buff;
  }

  private allocatePrioritized(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    const initialMaxStackCount =
      this.stackingType === 'highPriorityWithMaxStack' && this.#currentStackCount === 0
        ? resolveIncomingMaxStackCount(definition, options)
        : undefined;
    const buff = this.owner.allocateBuff(definition, sourceId, options);
    buff.attachStackingGroup(this);
    if (initialMaxStackCount !== undefined) this.#maxStackCount = initialMaxStackCount;
    this.#buffs.push(buff);
    this.#currentStackCount += 1;
    this.refreshPriority();
    return buff;
  }

  private refreshPriority(): void {
    const enabledLimit =
      this.stackingType === 'highPriority' ? 1 : Math.max(0, this.#maxStackCount);
    let enabledCount = 0;
    for (const buff of [...this.#buffs].sort(compareBuffPriority)) {
      if (buff.isFinished) continue;
      if (enabledCount < enabledLimit) {
        enabledCount += 1;
        buff.enable();
      } else {
        buff.disable();
      }
    }
  }

  private getLastUnfinishedBuff(): CombatBuff<Key> | undefined {
    const sorted = this.#buffs.filter(buff => !buff.isFinished).sort(compareBuffPriority);
    return sorted[sorted.length - 1];
  }

  private enhanceAndRefresh(
    existing: CombatBuff<Key> | undefined,
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    if (existing === undefined) return this.allocateEnhanced(definition, sourceId, options);

    existing.executeBeforeEnhance(sourceId);
    this.enhanceWithinLimit(existing, sourceId);
    existing.refreshDuration(resolveIncomingDuration(definition, options));
    existing.executeAfterEnhance(sourceId);
    return existing;
  }

  private enhanceAndOverwriteDuration(
    existing: CombatBuff<Key> | undefined,
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    if (existing === undefined) return this.allocateEnhanced(definition, sourceId, options);

    const incomingDuration = resolveIncomingDuration(definition, options);
    existing.executeBeforeEnhance(sourceId);
    this.enhanceWithinLimit(existing, sourceId);
    existing.overwriteDuration(incomingDuration);
    existing.executeAfterEnhance(sourceId);
    return existing;
  }

  private enhance(
    existing: CombatBuff<Key> | undefined,
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    if (existing === undefined) return this.allocateEnhanced(definition, sourceId, options);

    existing.executeBeforeEnhance(sourceId);
    this.enhanceWithinLimit(existing, sourceId);
    existing.executeAfterEnhance(sourceId);
    return existing;
  }

  private allocateEnhanced(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    const maxStackCount = resolveIncomingMaxStackCount(definition, options);
    const buff = this.allocate(definition, sourceId, options);
    this.#currentStackCount = 1;
    this.#maxStackCount = maxStackCount;
    return buff;
  }

  private enhanceWithinLimit(buff: CombatBuff<Key>, sourceId: string): void {
    if (this.#maxStackCount > 0 && this.#currentStackCount >= this.#maxStackCount) return;
    this.#currentStackCount += 1;
    buff.enhance(sourceId);
  }

  private refresh(
    existing: CombatBuff<Key> | undefined,
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    if (existing === undefined) return this.allocate(definition, sourceId, options);

    // 原生 Refresh 只借用本次输入计算初始时长，不替换旧实例或重跑启用流程。
    existing.refreshDuration(resolveIncomingDuration(definition, options));
    return existing;
  }

  private extend(
    existing: CombatBuff<Key> | undefined,
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    if (existing === undefined) return this.allocate(definition, sourceId, options);

    existing.extendDuration(resolveIncomingDuration(definition, options));
    return existing;
  }

  private overwriteDuration(
    existing: CombatBuff<Key> | undefined,
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    if (existing === undefined) return this.allocate(definition, sourceId, options);

    existing.overwriteDuration(resolveIncomingDuration(definition, options));
    return existing;
  }

  private modify(
    existing: CombatBuff<Key> | undefined,
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    if (existing === undefined) return this.allocate(definition, sourceId, options);

    existing.modify(options);
    return existing;
  }
}

function resolveBuffAttributeModifierValues(
  definitionId: string,
  configured: BuffAttributeModifierValues,
  blackboard: ActionBlackboard,
): AttributeModifierValues {
  if (!('blackboardKey' in configured)) return configured;
  const value = blackboard.getNumber(configured.blackboardKey);
  if (value === undefined) {
    throw new Error(
      `buff '${definitionId}' attribute modifier blackboard key ` +
        `'${configured.blackboardKey}' is missing or not numeric`,
    );
  }
  return attributeModifierValues(configured.slot, value);
}

function resolveIncomingDuration<Key extends string>(
  definition: CombatBuffDefinition<Key>,
  options?: CombatBuffAddOptions,
): number | null {
  const blackboard = new ActionBlackboard(definition.blackboard);
  blackboard.assign(options?.blackboardValues);
  return resolveBuffDuration(definition, blackboard);
}

function resolveIncomingMaxStackCount<Key extends string>(
  definition: CombatBuffDefinition<Key>,
  options?: CombatBuffAddOptions,
): number {
  const blackboard = new ActionBlackboard(definition.blackboard);
  blackboard.assign(options?.blackboardValues);
  const configured = definition.maxStackCount ?? 0;
  if (typeof configured === 'number') {
    validateBuffMaxStackCount(configured);
    return configured;
  }
  const value = blackboard.getNumber(configured.blackboardKey);
  if (value === undefined) {
    throw new Error(
      `buff '${definition.id}' max stack count blackboard key ` +
        `'${configured.blackboardKey}' is missing or not numeric`,
    );
  }
  validateBuffMaxStackCount(value);
  return value;
}

function validateBuffMaxStackCount(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError('buff max stack count must resolve to a non-negative safe integer');
  }
}

function resolveBuffDuration<Key extends string>(
  definition: CombatBuffDefinition<Key>,
  blackboard: ActionBlackboard,
): number | null {
  const value = resolveOptionalBuffNumber(
    definition.id,
    'duration',
    definition.durationSeconds,
    blackboard,
  );
  if (value === null) return null;
  validateNonNegativeBuffNumber(value, 'buff duration');
  return value;
}

function resolveBuffPriority<Key extends string>(
  definition: CombatBuffDefinition<Key>,
  blackboard: ActionBlackboard,
): number {
  const configured = definition.priority ?? 0;
  if (typeof configured === 'number') {
    validateFiniteBuffPriority(configured);
    return configured;
  }
  const value = blackboard.getNumber(configured.blackboardKey);
  if (value === undefined) {
    throw new Error(
      `buff '${definition.id}' priority blackboard key '${configured.blackboardKey}' is missing or not numeric`,
    );
  }
  const priority = configured.negate ? -value : value;
  validateFiniteBuffPriority(priority);
  return priority;
}

function compareBuffPriority<Key extends string>(
  left: CombatBuff<Key>,
  right: CombatBuff<Key>,
): number {
  const priority = compareDescending(left.priority, right.priority);
  if (priority !== 0) return priority;

  const duration = compareDurationDescending(left.remainingDuration, right.remainingDuration);
  return duration !== 0 ? duration : left.instanceId - right.instanceId;
}

function compareDurationDescending(left: number | null, right: number | null): number {
  if (left === null) return right === null ? 0 : -1;
  if (right === null) return 1;
  return compareDescending(left, right);
}

function compareDescending(left: number, right: number): number {
  if (Math.abs(left - right) <= BUFF_PRIORITY_EPSILON) return 0;
  return left > right ? -1 : 1;
}

function validateFiniteBuffPriority(value: number): void {
  if (!Number.isFinite(value))
    throw new RangeError('buff priority must resolve to a finite number');
}

function resolveBuffTriggerCount<Key extends string>(
  definition: CombatBuffDefinition<Key>,
  blackboard: ActionBlackboard,
): number {
  const configured = definition.maxTriggerCount;
  if (configured === undefined) return 0;
  if (typeof configured === 'number') {
    validateBuffTriggerCount(configured);
    return configured;
  }
  const value = blackboard.getNumber(configured.blackboardKey);
  if (value === undefined) {
    throw new Error(
      `buff '${definition.id}' trigger count blackboard key '${configured.blackboardKey}' is missing or not numeric`,
    );
  }
  validateBuffTriggerCount(value);
  return value;
}

function validateBuffTriggerCount(value: number): void {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError('buff trigger count must resolve to a safe integer');
  }
}

function resolveOptionalBuffNumber(
  buffId: string,
  field: string,
  configured: BuffDuration | undefined,
  blackboard: ActionBlackboard,
): number | null {
  if (configured === undefined) return null;
  if (typeof configured === 'number') return configured;
  const value = blackboard.getNumber(configured.blackboardKey);
  if (value === undefined) {
    throw new Error(
      `buff '${buffId}' ${field} blackboard key '${configured.blackboardKey}' is missing or not numeric`,
    );
  }
  return value;
}

function validateNonNegativeBuffNumber(value: number, field: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${field} must resolve to a non-negative finite number`);
  }
}
