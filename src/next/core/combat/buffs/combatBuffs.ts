import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
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
export type BuffStackingType = (typeof BUFF_STACKING_TYPES)[number];

export const BUFF_FINISH_REASONS = [
  'lifetime',
  'ignite',
  'early',
  'dispelled',
  'absorbed',
  'other',
] as const;
export type BuffFinishReason = (typeof BUFF_FINISH_REASONS)[number];

export interface BuffAttributeModifierDefinition<Key extends string> {
  readonly attribute: Key;
  readonly values: AttributeModifierValues;
  readonly timing: AttributeModifierTiming;
}

export interface BuffLifecycleActions<Key extends string> {
  readonly start?: (buff: CombatBuff<Key>) => void;
  readonly enable?: (buff: CombatBuff<Key>) => void;
  readonly disable?: (buff: CombatBuff<Key>) => void;
  readonly finish?: (buff: CombatBuff<Key>) => void;
  readonly beforeEnhance?: (buff: CombatBuff<Key>, sourceId: string) => void;
  readonly enhanceChanged?: (buff: CombatBuff<Key>, sourceId: string) => void;
  readonly afterEnhance?: (buff: CombatBuff<Key>, sourceId: string) => void;
}

export interface CombatBuffDefinition<Key extends string> {
  readonly id: string;
  readonly stackingType: BuffStackingType;
  readonly stackingKey?: string;
  readonly maxStackCount?: number;
  /** Missing duration is the recovered infinite-lifetime representation. */
  readonly durationSeconds?: number;
  readonly blackboard?: Readonly<Record<string, ActionBlackboardValue>>;
  readonly damageModifiers?: readonly DamageModifierDefinition[];
  readonly attributeModifiers?: readonly BuffAttributeModifierDefinition<Key>[];
  readonly actions?: BuffLifecycleActions<Key>;
}

export interface CombatBuffAddOptions {
  readonly blackboardValues?: Readonly<Record<string, ActionBlackboardValue>>;
}

export class CombatBuff<Key extends string> {
  readonly damageModifiers: readonly DamageModifier[];
  readonly attributeModifiers: readonly CombatAttributeModifier<Key>[];
  readonly blackboard: ActionBlackboard;
  #passedTime = 0;
  #remainingDuration: number | null;
  #started = false;
  #enabled = false;
  #finished = false;
  #finishing = false;
  #finishReason: BuffFinishReason | null = null;
  #enhanceCount = 1;
  #stackingGroup: BuffStackingGroup<Key> | null = null;

  constructor(
    readonly definition: CombatBuffDefinition<Key>,
    readonly owner: CombatBuffContainer<Key>,
    readonly sourceId: string,
    readonly instanceId: number,
    options?: CombatBuffAddOptions,
  ) {
    if (
      definition.durationSeconds !== undefined &&
      (!Number.isFinite(definition.durationSeconds) || definition.durationSeconds < 0)
    ) {
      throw new RangeError('buff duration must be a non-negative finite number');
    }
    this.#remainingDuration = definition.durationSeconds ?? null;
    this.blackboard = new ActionBlackboard(definition.blackboard);
    this.blackboard.assign(options?.blackboardValues);
    this.damageModifiers = (definition.damageModifiers ?? []).map(
      modifier => new DamageModifier(owner.ownerId, modifier),
    );
    this.attributeModifiers = (definition.attributeModifiers ?? []).map(
      modifier =>
        new CombatAttributeModifier(
          modifier.attribute,
          modifier.values,
          ATTRIBUTE_MODIFIER_SOURCES.buff,
          modifier.timing,
        ),
    );
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

  enable(): void {
    if (this.#finished || this.#enabled) return;
    this.#enabled = true;
    if (!this.#started) {
      this.#started = true;
      this.definition.actions?.start?.(this);
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

  private removeAttributeModifiers(): void {
    for (const modifier of this.attributeModifiers) {
      this.owner.attributes.removeModifier(modifier);
    }
  }
}

/** Per-entity Buff storage and active DamageModifier registry. */
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

  add(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
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
  ): CombatBuff<Key> {
    if (definition.stackingType !== this.stackingType) {
      throw new Error(
        `buff stacking key '${this.key}' changed type from '${this.stackingType}' to '${definition.stackingType}'`,
      );
    }
    const existing = this.#buffs.find(buff => !buff.isFinished);
    switch (this.stackingType) {
      case 'unlimited':
        return this.allocate(definition, sourceId, options);
      case 'enhanceAndRefresh':
        return this.enhanceAndRefresh(existing, definition, sourceId, options);
      default:
        throw new Error(`buff stacking type '${this.stackingType}' is not implemented`);
    }
  }

  refreshAfterFinish(): void {
    this.#currentStackCount = this.#buffs.filter(buff => !buff.isFinished).length;
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

  private enhanceAndRefresh(
    existing: CombatBuff<Key> | undefined,
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    if (existing === undefined) {
      const buff = this.allocate(definition, sourceId, options);
      this.#currentStackCount = 1;
      this.#maxStackCount = definition.maxStackCount ?? 0;
      return buff;
    }

    existing.executeBeforeEnhance(sourceId);
    if (this.#maxStackCount <= 0 || this.#currentStackCount < this.#maxStackCount) {
      this.#currentStackCount += 1;
      existing.enhance(sourceId);
    }
    existing.refreshDuration(definition.durationSeconds ?? null);
    existing.executeAfterEnhance(sourceId);
    return existing;
  }
}
