// 纯数据契约由独立包唯一声明；此路径保留兼容导出。
export {
  BUFF_STACKING_TYPES,
  type BuffStackingType,
  type BuffDuration,
  type BuffTriggerCount,
  type BuffMaxStackCount,
  type BuffPriority,
  type BuffShieldPriority,
  type BuffShieldDamageAbsorptionDefinition,
  type BuffShieldDefinition,
  type BuffSustainedProtectionDefinition,
  type BuffTimeClock,
  type CombatBuffPresentation,
  type CombatBuffChildPresentation,
  type BuffKeywordEnhancementDefinition,
} from '../../../../../packages/game-data-contract/src/buffs.ts';
import {
  type BuffDuration,
  type BuffKeywordEnhancementDefinition,
  type BuffMaxStackCount,
  type BuffPriority,
  type BuffShieldDefinition,
  type BuffStackingType,
  type BuffSustainedProtectionDefinition,
  type BuffTimeClock,
  type BuffTriggerCount,
  type CombatBuffChildPresentation,
  type CombatBuffPresentation,
} from '../../../../../packages/game-data-contract/src/buffs.ts';
/**
 * 一次模拟中每个实体的 Buff 状态所有者。
 * 调用方通过稳定定义添加 Buff，并按战斗时钟推进；不得把实例写回定义或项目存档。
 */
import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
  attributeModifierValues,
  type AttributeModifierSlot,
  type AttributeModifierSource,
  type AttributeModifierTiming,
  type AttributeModifierValues,
  type CombatAttributeSet,
} from '../attributes/combatAttributes';
import {
  DamageModifier,
  type DamageModifierConditionEvaluator,
  type DamageModifierDefinition,
  type DamageModifierNumber,
} from '../damage/damageModifiers';
import type {
  DamageModifierSide,
  DamageProcessTiming,
  PlayerDamageContext,
} from '../damage/playerDamageContext';
import { ActionBlackboard, type ActionBlackboardValue } from '../runtime/actionBlackboard';
import type { CombatSkillCastInfo } from '../runtime/skillCastInfo';
import type { DamageType } from '../../game-data/operatorDefinition';
import {
  HealModifier,
  type HealCalculationContext,
  type HealModifierDefinition,
  type HealModifierNumber,
  type HealModifierSide,
  type HealProcessTiming,
} from '../heal/healModifiers';
import {
  PoiseModifier,
  type PoiseCalculationContext,
  type PoiseModifierDefinition,
  type PoiseModifierNumber,
  type PoiseModifierSide,
  type PoiseProcessTiming,
} from '../damage/poiseModifiers';
import {
  SharedSpGainModifier,
  type SharedSpGainAttribute,
  type SharedSpGainModifierOperation,
  type SharedSpGainModifierSet,
} from '../resources/sharedSpGainModifiers';
import {
  GameplayTagRegistry,
  type GameplayTag,
  type GameplayTagQueryType,
} from '../tags/gameplayTags';

const BUFF_LIFETIME_EPSILON = 0.00001;
const BUFF_PRIORITY_EPSILON = 0.00001;

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
  readonly source?: AttributeModifierSource;
  /** 原生属性修正目标；buffSource 不得静默退化为 Buff Owner。 */
  readonly target?: 'owner' | 'buffSource';
}

/** Buff 启用期间注册到整场战斗共享 SP 系统的一项固定值修正。 */
export interface BuffSharedSpGainModifierDefinition {
  readonly attribute: SharedSpGainAttribute;
  readonly operation: SharedSpGainModifierOperation;
  readonly value: number;
  readonly applyToReturnSpGain: boolean;
}

/** 一帧内供 Buff 实例选择的三路时间增量。 */
export interface BuffTickDeltas {
  readonly defaultDeltaSeconds: number;
  readonly globalScaledDeltaSeconds: number;
  readonly selfScaledDeltaSeconds: number;
}

/**
 * Buff 启用期间持续执行的有状态动作。
 * 定义对象只充当蓝图；每个 Buff 实例必须通过 createRuntimeInstance 获得独立运行状态。
 */
export interface BuffDuringEnableAction<Key extends string> {
  createRuntimeInstance(): BuffDuringEnableAction<Key>;
  tryExecute(buff: CombatBuff<Key>): boolean;
  tick(deltaTime: number, buff: CombatBuff<Key>): void;
  end(buff: CombatBuff<Key>): void;
  reset(buff: CombatBuff<Key>): void;
}

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
  readonly ignite?: (
    buff: CombatBuff<Key>,
    igniteType: string,
    sourceId: string,
    skillCastInfo?: CombatSkillCastInfo,
  ) => boolean;
  readonly duringEnable?: BuffDuringEnableAction<Key>;
}

/** 可复用、不可变的 Buff 定义；实例状态不应写回这里。 */
export interface CombatBuffDefinition<Key extends string> {
  readonly id: string;
  readonly presentation?: CombatBuffPresentation;
  /** 原生关键词载体创建的表现子 Buff，可同时显示多个元素图标。 */
  readonly childPresentations?: readonly CombatBuffChildPresentation[];
  readonly timeClock?: BuffTimeClock;
  /** Buff 实例自身的原生分类标签；不等同于启用期间可能挂到所属实体的标签。 */
  readonly applyTags?: readonly GameplayTag[];
  /** Buff 到期但被 ExtendBuffAction 阻止结束后，临时注册到所属实体的标签。 */
  readonly extendTags?: readonly GameplayTag[];
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
  readonly keywordEnhancements?: readonly BuffKeywordEnhancementDefinition[];
  readonly healModifiers?: readonly HealModifierDefinition[];
  readonly poiseModifiers?: readonly PoiseModifierDefinition[];
  readonly attributeModifiers?: readonly BuffAttributeModifierDefinition<Key>[];
  /**
   * 共享 SP 修正属于战斗级状态，但其注册生命周期归当前 Buff 实例所有。
   * 当前仅支持固定值；原生动态黑板刷新链还没做通前，不在这里复用属性修正的动态语义。
   */
  readonly sharedSpGainModifiers?: readonly BuffSharedSpGainModifierDefinition[];
  readonly shields?: readonly BuffShieldDefinition[];
  readonly sustainedProtection?: BuffSustainedProtectionDefinition;
  readonly actions?: BuffLifecycleActions<Key>;
}

/** 添加 Buff 实例时由具体行为提供的初始黑板和层数。 */
export interface CombatBuffAddOptions {
  readonly blackboardValues?: Readonly<Record<string, ActionBlackboardValue>>;
  /** 创建该实例的技能、被动或配装动作身份，用于解释后续生命周期步骤。 */
  readonly sourceActionId?: string;
  /** 创建该定义的 AbilitySystem；跨实体挂载和事件触发都不改变它。 */
  readonly definitionOwnerId?: string;
  /** 创建时复制的来源施法信息；缺少表示该 Buff 不继承施法身份。 */
  readonly skillCastInfo?: CombatSkillCastInfo;
  /** GlobalBuff 子投影专用：精确结束创建当前子 Buff 的父实例。 */
  readonly finishParentGlobalBuff?: (reason: 'early' | 'other') => boolean;
  /** 原生护盾 Calculation 的 attacker 端；跨实体 Buff 不得退化为 owner 属性。 */
  readonly getSourceAttributeValue?: (attribute: string) => number;
}

/** 一个实体上某项 Buff 的独立运行时实例。 */
export class CombatBuff<Key extends string> {
  readonly damageModifiers: readonly DamageModifier[];
  readonly healModifiers: readonly HealModifier[];
  readonly poiseModifiers: readonly PoiseModifier[];
  readonly blackboard: ActionBlackboard;
  readonly priority: number;
  readonly sourceActionId: string;
  readonly definitionOwnerId: string;
  /** 来源施法在创建瞬间的快照，不随后续技能扣费变化。 */
  readonly skillCastInfo: CombatSkillCastInfo | null;
  readonly finishParentGlobalBuff: ((reason: 'early' | 'other') => boolean) | null;
  readonly getSourceAttributeValue: ((attribute: string) => number) | null;
  #attributeModifiers: readonly CombatAttributeModifier<Key>[];
  readonly #sharedSpGainModifiers: readonly SharedSpGainModifier[];
  #passedTime = 0;
  #remainingDuration: number | null;
  #started = false;
  #enabled = false;
  #finished = false;
  #finishing = false;
  #timePaused = false;
  #finishable = true;
  #appliedTags = false;
  #appliedExtendTags = false;
  #finishReason: BuffFinishReason | null = null;
  #enhanceCount = 1;
  #stackingGroup: BuffStackingGroup<Key> | null = null;
  #triggerInterval: number | null = null;
  #triggerRemainingTime = 0;
  #remainingTriggerCount = 0;
  readonly #duringEnableAction: BuffDuringEnableAction<Key> | null;
  readonly shields: readonly CombatShield<Key>[];

  constructor(
    readonly definition: CombatBuffDefinition<Key>,
    readonly owner: CombatBuffContainer<Key>,
    readonly sourceId: string,
    readonly instanceId: number,
    options?: CombatBuffAddOptions,
  ) {
    this.blackboard = new ActionBlackboard(definition.blackboard, owner.entityBlackboard);
    this.blackboard.assign(options?.blackboardValues);
    this.getSourceAttributeValue = options?.getSourceAttributeValue ?? null;
    const initializedKeywordRates = new Set<string>();
    for (const enhancement of definition.keywordEnhancements ?? []) {
      if (initializedKeywordRates.has(enhancement.targetKey)) continue;
      const initialValue = resolveOptionalBuffNumber(
        definition.id,
        'keyword initial rate',
        enhancement.initialValue,
        this.blackboard,
      );
      if (initialValue === null) {
        throw new Error(`buff '${definition.id}' keyword initial rate is missing`);
      }
      this.blackboard.assignDynamic(enhancement.targetKey, initialValue);
      initializedKeywordRates.add(enhancement.targetKey);
    }
    this.sourceActionId = options?.sourceActionId ?? definition.id;
    this.definitionOwnerId = options?.definitionOwnerId ?? sourceId;
    this.skillCastInfo = options?.skillCastInfo === undefined ? null : { ...options.skillCastInfo };
    this.finishParentGlobalBuff = options?.finishParentGlobalBuff ?? null;
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
      modifier =>
        new DamageModifier(
          owner.ownerId,
          modifier,
          value => this.resolveDamageNumber(value),
          this.skillCastInfo?.skillCastId ?? null,
        ),
    );
    this.healModifiers = (definition.healModifiers ?? []).map(
      modifier => new HealModifier(owner.ownerId, modifier, value => this.resolveHealNumber(value)),
    );
    this.poiseModifiers = (definition.poiseModifiers ?? []).map(
      modifier =>
        new PoiseModifier(owner.ownerId, modifier, value => this.resolvePoiseNumber(value)),
    );
    this.#attributeModifiers = this.createAttributeModifiers();
    this.#sharedSpGainModifiers = (definition.sharedSpGainModifiers ?? []).map(
      modifier =>
        new SharedSpGainModifier(
          modifier.attribute,
          modifier.operation,
          modifier.value,
          modifier.applyToReturnSpGain,
        ),
    );
    if (this.#sharedSpGainModifiers.length > 0 && owner.sharedSpGainModifiers === null) {
      throw new Error(
        `buff '${definition.id}' requires a shared SP gain modifier set on its owner`,
      );
    }
    this.#duringEnableAction = definition.actions?.duringEnable?.createRuntimeInstance() ?? null;
    this.shields = (definition.shields ?? []).map(shield => new CombatShield(this, shield));
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

  get isFinishable(): boolean {
    return this.#finishable;
  }

  get isTimePaused(): boolean {
    return this.#timePaused;
  }

  get enhanceCount(): number {
    return this.#enhanceCount;
  }

  applyKeywordEnhancements(onAddedBuffId: string): boolean {
    let changed = false;
    for (const enhancement of this.definition.keywordEnhancements ?? []) {
      if (!enhancement.triggerBuffIds.includes(onAddedBuffId)) continue;
      const operand = resolveOptionalBuffNumber(
        this.definition.id,
        'keyword enhancement value',
        enhancement.value,
        this.blackboard,
      );
      if (operand === null) {
        throw new Error(`buff '${this.definition.id}' keyword enhancement value is missing`);
      }
      const current = this.blackboard.getNumber(enhancement.targetKey);
      if (current === undefined) {
        throw new Error(
          `buff '${this.definition.id}' keyword target '${enhancement.targetKey}' is missing or not numeric`,
        );
      }
      const next =
        enhancement.operation === 'assign'
          ? operand
          : enhancement.operation === 'add'
            ? current + operand
            : current * operand;
      this.blackboard.assignDynamic(enhancement.targetKey, next);
      changed = true;
    }
    if (changed) this.refreshAttributeModifierValues();
    return changed;
  }

  get attributeModifiers(): readonly CombatAttributeModifier<Key>[] {
    return this.#attributeModifiers;
  }

  private resolveDamageNumber(value: DamageModifierNumber): number {
    if (typeof value === 'number') return value;
    const resolved = this.blackboard.getNumber(value.blackboardKey);
    if (resolved === undefined) {
      throw new Error(
        `buff '${this.definition.id}' damage modifier blackboard value '${value.blackboardKey}' is missing`,
      );
    }
    return resolved;
  }

  private resolveHealNumber(value: HealModifierNumber): number {
    if (typeof value === 'number') return value;
    const resolved = this.blackboard.getNumber(value.blackboardKey);
    if (resolved === undefined) {
      throw new Error(
        `buff '${this.definition.id}' heal modifier blackboard value '${value.blackboardKey}' is missing`,
      );
    }
    return resolved;
  }

  private resolvePoiseNumber(value: PoiseModifierNumber): number {
    if (typeof value === 'number') return value;
    const resolved = this.blackboard.getNumber(value.blackboardKey);
    if (resolved === undefined) {
      throw new Error(
        `buff '${this.definition.id}' poise modifier blackboard value '${value.blackboardKey}' is missing`,
      );
    }
    return resolved;
  }

  /** 按原生 Buff.ContainsTag 语义查询定义携带的 applyTags。 */
  containsTag(tag: GameplayTag, exact = false): boolean {
    return (this.definition.applyTags ?? []).some(candidate =>
      this.owner.tagRegistry.matches(candidate, tag, exact),
    );
  }

  enable(): void {
    if (this.#finished || this.#enabled) return;
    this.#enabled = true;
    if (!this.#started) {
      this.#started = true;
      this.definition.actions?.start?.(this);
      this.triggerInternal(0);
    }

    try {
      this.assertAttributeModifierTargetsSupported();
      this.owner.registerDamageModifiers(this.damageModifiers);
      this.owner.registerHealModifiers(this.healModifiers);
      this.owner.registerPoiseModifiers(this.poiseModifiers);
      this.owner.registerShields(this.shields);
      this.owner.registerSustainedProtection(this);
      this.addApplyTags();
      for (const modifier of this.attributeModifiers) {
        this.owner.attributes.addModifier(modifier);
      }
      this.registerSharedSpGainModifiers();
    } catch (error) {
      this.unregisterSharedSpGainModifiers();
      this.removeAttributeModifiers();
      this.owner.unregisterDamageModifiers(this.damageModifiers);
      this.owner.unregisterHealModifiers(this.healModifiers);
      this.owner.unregisterPoiseModifiers(this.poiseModifiers);
      this.owner.unregisterShields(this.shields);
      this.owner.unregisterSustainedProtection(this);
      this.removeApplyTags();
      this.#enabled = false;
      throw error;
    }
    this.definition.actions?.enable?.(this);
    this.#duringEnableAction?.tryExecute(this);
  }

  disable(): void {
    if (!this.#enabled) return;
    this.definition.actions?.disable?.(this);
    this.endDuringEnableAction();
    this.owner.unregisterDamageModifiers(this.damageModifiers);
    this.owner.unregisterHealModifiers(this.healModifiers);
    this.owner.unregisterPoiseModifiers(this.poiseModifiers);
    this.owner.unregisterShields(this.shields);
    this.owner.unregisterSustainedProtection(this);
    this.removeApplyTags();
    this.removeAttributeModifiers();
    this.unregisterSharedSpGainModifiers();
    this.#enabled = false;
  }

  finish(reason: BuffFinishReason = 'other'): boolean {
    if (this.#finished || this.#finishing) return false;
    if (!this.#finishable) {
      this.addExtendTags();
      return false;
    }
    this.#finishing = true;
    this.#finishReason = reason;
    this.definition.actions?.finish?.(this);
    const hadRegisteredModifiers = this.#enabled;
    this.#enabled = false;
    this.#finished = true;
    this.removeExtendTags();
    this.#stackingGroup?.refreshAfterFinish();
    if (hadRegisteredModifiers) {
      this.owner.unregisterDamageModifiers(this.damageModifiers);
      this.owner.unregisterHealModifiers(this.healModifiers);
      this.owner.unregisterPoiseModifiers(this.poiseModifiers);
      this.owner.unregisterShields(this.shields);
      this.owner.unregisterSustainedProtection(this);
      this.removeApplyTags();
      this.removeAttributeModifiers();
      this.unregisterSharedSpGainModifiers();
    }
    this.endDuringEnableAction();
    this.#finishing = false;
    this.owner.handleBuffFinished(this, reason);
    return true;
  }

  tick(deltaTime: number | BuffTickDeltas): void {
    if (this.#finished) return;
    const resolvedDeltaTime =
      typeof deltaTime === 'number'
        ? deltaTime
        : resolveBuffTickDelta(this.definition.timeClock ?? 'default', deltaTime);
    if (!Number.isFinite(resolvedDeltaTime)) throw new TypeError('buff delta time must be finite');
    if (this.#timePaused) return;
    const elapsed = Math.max(0, resolvedDeltaTime);
    this.#passedTime += elapsed;
    if (this.#enabled) {
      this.triggerInternal(elapsed);
      this.#duringEnableAction?.tick(elapsed, this);
    }
    if (this.#remainingDuration === null) return;
    this.#remainingDuration -= elapsed;
    if (this.#remainingDuration <= BUFF_LIFETIME_EPSILON) this.finish('lifetime');
  }

  /** PauseBuffTime 只冻结当前 Buff 的生命周期、周期触发与挂载时间轴。 */
  setTimePaused(paused: boolean): void {
    this.#timePaused = paused;
  }

  /** 恢复可结束时，原生仅在剩余时长已经小于 0 的情况下补发到期结束。 */
  setFinishable(finishable: boolean): void {
    this.#finishable = finishable;
    if (finishable && this.#remainingDuration !== null && this.#remainingDuration < 0) {
      this.finish('lifetime');
    }
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

  /** 原生 RawSetLifeTime：仅有限时长定义接受直接剩余时间写入。 */
  rawSetRemainingDuration(duration: number): void {
    if (this.definition.durationSeconds === undefined) return;
    this.#remainingDuration = Math.max(0, duration);
  }

  executeBeforeEnhance(sourceId: string): void {
    this.definition.actions?.beforeEnhance?.(this, sourceId);
  }

  enhance(sourceId: string): void {
    this.#enhanceCount += 1;
    // 强化层等价于重复注册同一组属性修正；重复对象可保留八槽中加法与乘法槽各自的聚合公式。
    this.replaceAttributeModifiers(this.createAttributeModifiers());
    this.definition.actions?.enhanceChanged?.(this, sourceId);
  }

  /** 原生 DecreaseEnhanceCnt：增强型 Buff 扣层，扣尽时结束整个实例。 */
  decreaseEnhanceCount(count: number, reason: BuffFinishReason): boolean {
    if (this.#finished || count <= 0) return false;
    if (this.#enhanceCount <= count) return this.finish(reason);
    this.#enhanceCount -= count;
    this.definition.actions?.enhanceChanged?.(this, this.sourceId);
    this.replaceAttributeModifiers(this.createAttributeModifiers());
    this.#stackingGroup?.refreshAfterEnhanceDecrease();
    return true;
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

  /** 按当前实例黑板重新解析属性修正；供原生刷新修正值动作调用。 */
  refreshAttributeModifierValues(): void {
    this.replaceAttributeModifiers(this.createAttributeModifiers());
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

  private registerSharedSpGainModifiers(): void {
    const registry = this.owner.sharedSpGainModifiers;
    if (registry === null) return;
    for (const modifier of this.#sharedSpGainModifiers) registry.add(modifier);
  }

  private unregisterSharedSpGainModifiers(): void {
    const registry = this.owner.sharedSpGainModifiers;
    if (registry === null) return;
    for (const modifier of this.#sharedSpGainModifiers) registry.remove(modifier);
  }

  private endDuringEnableAction(): void {
    if (this.#duringEnableAction === null) return;
    this.#duringEnableAction.end(this);
    this.#duringEnableAction.reset(this);
  }

  private createAttributeModifiers(): readonly CombatAttributeModifier<Key>[] {
    return (this.definition.attributeModifiers ?? []).flatMap(modifier =>
      Array.from({ length: this.#enhanceCount }, () => {
        const values = resolveBuffAttributeModifierValues(
          this.definition.id,
          modifier.values,
          this.blackboard,
        );
        return new CombatAttributeModifier(
          modifier.attribute,
          values,
          modifier.source ?? ATTRIBUTE_MODIFIER_SOURCES.buff,
          modifier.timing,
        );
      }),
    );
  }

  private assertAttributeModifierTargetsSupported(): void {
    for (const modifier of this.definition.attributeModifiers ?? []) {
      if (modifier.target === 'buffSource' && this.sourceId !== this.owner.ownerId) {
        throw new Error(
          `buff '${this.definition.id}' targets distinct buff source '${this.sourceId}' for attribute modifier`,
        );
      }
    }
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

  private addExtendTags(): void {
    if (this.#appliedExtendTags) return;
    this.owner.addEntityTags(this.definition.extendTags ?? []);
    this.#appliedExtendTags = true;
  }

  private addApplyTags(): void {
    if (this.#appliedTags) return;
    this.owner.addEntityTags(this.definition.applyTags ?? []);
    this.#appliedTags = true;
  }

  private removeApplyTags(): void {
    if (!this.#appliedTags) return;
    this.owner.removeEntityTags(this.definition.applyTags ?? []);
    this.#appliedTags = false;
  }

  private removeExtendTags(): void {
    if (!this.#appliedExtendTags) return;
    this.owner.removeEntityTags(this.definition.extendTags ?? []);
    this.#appliedExtendTags = false;
  }
}

export class CombatShield<Key extends string> {
  static readonly epsilon = 0.00001;
  readonly maxValue: number;
  readonly maxAbsorbCount: number;
  readonly #absorptions = new Map<DamageType, readonly [number, number]>();
  remainingValue: number;
  remainingAbsorbCount: number;
  consumed = false;

  constructor(
    readonly buff: CombatBuff<Key>,
    readonly definition: BuffShieldDefinition,
  ) {
    const value =
      typeof definition.value === 'object' && 'attribute' in definition.value
        ? resolveShieldAttributeValue(buff, definition.value)
        : resolveBuffNumber(buff, definition.value, 'shield value');
    this.maxValue = Math.max(0, value);
    this.remainingValue = this.maxValue;
    this.maxAbsorbCount = resolveBuffInteger(buff, definition.absorbCount, 'shield absorb count');
    this.remainingAbsorbCount = this.maxAbsorbCount;
    for (const absorption of definition.damageAbsorptions) {
      this.#absorptions.set(absorption.damageType, [
        resolveBuffNumber(buff, absorption.ratio, 'shield absorption ratio'),
        resolveBuffNumber(buff, absorption.scale, 'shield absorption scale'),
      ]);
    }
    this.refreshConsumed();
  }

  get infiniteValue(): boolean {
    return this.definition.infinityValue;
  }

  get infiniteAbsorbCount(): boolean {
    return this.maxAbsorbCount < 0;
  }

  absorb(damageType: DamageType, inputValue: number): number {
    if (this.consumed || inputValue <= CombatShield.epsilon) return inputValue;
    const [ratio, scale] = this.#absorptions.get(damageType) ?? [1, 1];
    if (ratio <= CombatShield.epsilon || scale <= CombatShield.epsilon) return inputValue;
    const configuredBlocked = ratio * inputValue;
    const cost = configuredBlocked / scale;
    let remaining: number;
    if (!this.infiniteValue && this.remainingValue + CombatShield.epsilon < cost) {
      remaining = inputValue - scale * this.remainingValue;
      this.remainingValue = 0;
    } else {
      if (!this.infiniteValue) this.remainingValue -= cost;
      remaining = inputValue - configuredBlocked;
    }
    if (!this.infiniteAbsorbCount) this.remainingAbsorbCount -= 1;
    this.refreshConsumed();
    if (this.consumed && this.definition.absorbAllDamageWhenConsumed) {
      remaining = inputValue - configuredBlocked;
    }
    remaining = Math.max(0, remaining);
    if (this.consumed && this.definition.removeBuffWhenConsumed) this.buff.finish('other');
    return remaining;
  }

  private refreshConsumed(): void {
    this.consumed =
      (!this.infiniteAbsorbCount && this.remainingAbsorbCount <= 0) ||
      (!this.infiniteValue && this.remainingValue <= CombatShield.epsilon);
  }
}

/** 按实体隔离的 Buff 存储与活动伤害修正注册表。 */
export class CombatBuffContainer<Key extends string> {
  readonly #buffs: CombatBuff<Key>[] = [];
  readonly #damageModifiers: DamageModifier[] = [];
  readonly #healModifiers: HealModifier[] = [];
  readonly #poiseModifiers: PoiseModifier[] = [];
  readonly #stackingGroups = new Map<string, BuffStackingGroup<Key>>();
  readonly #entityTagCounts = new Map<GameplayTag, number>();
  readonly #shields: CombatShield<Key>[] = [];
  readonly #sustainedProtections = new Map<CombatBuff<Key>, readonly [number, number]>();
  #nextInstanceId = 1;
  #onBuffConsumed?: (buff: CombatBuff<Key>, sourceId: string, layers: number) => void;
  #onBuffAbsorbed?: (buff: CombatBuff<Key>, sourceId: string, layers: number) => void;

  constructor(
    readonly ownerId: string,
    readonly attributes: CombatAttributeSet<Key>,
    readonly tagRegistry = new GameplayTagRegistry([]),
    /** 一次战斗唯一的共享 SP 修正注册表；仅使用相应 Buff 的容器需要提供。 */
    readonly sharedSpGainModifiers: SharedSpGainModifierSet | null = null,
    /** 该实体的技能与 Buff 共同回退读写的持久运行时黑板。 */
    readonly entityBlackboard = new ActionBlackboard(),
    /** Buff 结束（到期、消费、驱散等）时通知，供回执记录结束事实。 */
    readonly onBuffFinished?: (buff: CombatBuff<Key>, reason: BuffFinishReason) => void,
  ) {}

  /** Buff 结束成功时由实例调用；调用方不应在回调里修改容器。 */
  handleBuffFinished(buff: CombatBuff<Key>, reason: BuffFinishReason): void {
    this.onBuffFinished?.(buff, reason);
  }

  configureConsumedObserver(
    observer: (buff: CombatBuff<Key>, sourceId: string, layers: number) => void,
  ): void {
    if (this.#onBuffConsumed !== undefined) {
      throw new Error(`Buff container '${this.ownerId}' consumed observer is already configured`);
    }
    this.#onBuffConsumed = observer;
  }

  configureAbsorbedObserver(
    observer: (buff: CombatBuff<Key>, sourceId: string, layers: number) => void,
  ): void {
    if (this.#onBuffAbsorbed !== undefined) {
      throw new Error(`Buff container '${this.ownerId}' absorbed observer is already configured`);
    }
    this.#onBuffAbsorbed = observer;
  }

  get buffs(): readonly CombatBuff<Key>[] {
    return this.#buffs;
  }

  get shields(): readonly CombatShield<Key>[] {
    return this.#shields;
  }

  get superArmor(): number {
    return Math.max(0, ...[...this.#sustainedProtections.values()].map(value => value[0]));
  }

  get impactResistance(): number {
    return Math.max(0, ...[...this.#sustainedProtections.values()].map(value => value[1]));
  }

  /** 添加成功时返回实例；原生叠加策略拒绝本次施加时返回 null。 */
  add(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
    afterPublished?: (buff: CombatBuff<Key>) => void,
  ): CombatBuff<Key> | null {
    const stackingKey = definition.stackingKey ?? definition.id;
    let group = this.#stackingGroups.get(stackingKey);
    if (group === undefined) {
      group = new BuffStackingGroup(this, stackingKey, definition.stackingType);
      this.#stackingGroups.set(stackingKey, group);
    }
    const buff = group.stack(definition, sourceId, options);
    // 原生 BuffContainer.CreateBuff 在 StackBuff（含 Start/Enable）返回后才登记实例。
    // 因此启动动作查询容器时尚看不到自身；返回旧实例的刷新路径不能重复登记。
    if (buff !== null && !this.#buffs.includes(buff)) {
      this.#buffs.push(buff);
    }
    if (buff === null) return null;
    // combat-spec/before-output-buff.md：成功事件先于已有关键词增强；刷新旧实例也走成功尾部。
    afterPublished?.(buff);
    for (const active of this.#buffs) {
      if (!active.isFinished) active.applyKeywordEnhancements(definition.id);
    }
    return buff;
  }

  allocateBuff(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    return new CombatBuff(definition, this, sourceId, this.#nextInstanceId++, options);
  }

  getCountById(id: string): number {
    return this.#buffs
      .filter(buff => !buff.isFinished && buff.definition.id === id)
      .reduce((count, buff) => count + buff.enhanceCount, 0);
  }

  /** 统计所有未结束且 ID 命中任一候选项的 Buff 层数。 */
  getCountByIds(ids: readonly string[], skillCastId?: number): number {
    const accepted = new Set(ids);
    return this.#buffs
      .filter(
        buff =>
          !buff.isFinished &&
          accepted.has(buff.definition.id) &&
          (skillCastId === undefined || buff.skillCastInfo?.skillCastId === skillCastId),
      )
      .reduce((count, buff) => count + buff.enhanceCount, 0);
  }

  /** 显式实例数模式；原生 SaveBuffStackNumAdvanced 的 BuffCount 不使用此入口。 */
  getInstanceCountByIds(ids: readonly string[]): number {
    return ids.reduce(
      (total, id) =>
        total + this.#buffs.filter(buff => !buff.isFinished && buff.definition.id === id).length,
      0,
    );
  }

  /** 按容器插入顺序返回首个未结束且 ID 命中任一候选项的 Buff。 */
  findFirstByIds(ids: readonly string[]): CombatBuff<Key> | undefined {
    const accepted = new Set(ids);
    return this.#buffs.find(buff => !buff.isFinished && accepted.has(buff.definition.id));
  }

  /** 按容器插入顺序结束所有 ID 命中任一候选项的 Buff。 */
  finishByIds(ids: readonly string[], reason: BuffFinishReason, sourceId?: string): number {
    const accepted = new Set(ids);
    let count = 0;
    for (const buff of this.#buffs) {
      if (!buff.isFinished && accepted.has(buff.definition.id)) {
        const layers = buff.enhanceCount;
        if (buff.finish(reason)) {
          count += 1;
          if (reason === 'absorbed' && sourceId !== undefined)
            this.#onBuffAbsorbed?.(buff, sourceId, layers);
        }
      }
    }
    return count;
  }

  /** 按容器插入顺序结束最多 count 个 ID 匹配的 Buff 实例。 */
  finishCountByIds(
    ids: readonly string[],
    count: number,
    reason: BuffFinishReason,
    sourceId?: string,
  ): number {
    if (!Number.isFinite(count) || count < 0) {
      throw new RangeError('Buff finish count must be a finite non-negative number');
    }
    const accepted = new Set(ids);
    const firstMatch = this.#buffs.find(
      buff => !buff.isFinished && accepted.has(buff.definition.id),
    );
    if (
      firstMatch !== undefined &&
      ['enhance', 'enhanceAndRefresh', 'enhanceAndOverwriteDuration'].includes(
        firstMatch.definition.stackingType,
      )
    ) {
      let changed = 0;
      for (const buff of this.#buffs) {
        if (
          !buff.isFinished &&
          accepted.has(buff.definition.id) &&
          buff.decreaseEnhanceCount(count, reason)
        ) {
          changed += 1;
        }
      }
      return changed;
    }
    let finished = 0;
    for (const buff of this.#buffs) {
      if (finished >= count) break;
      if (!buff.isFinished && accepted.has(buff.definition.id)) {
        const layers = buff.enhanceCount;
        if (buff.finish(reason)) {
          finished += 1;
          if (reason === 'absorbed' && sourceId !== undefined)
            this.#onBuffAbsorbed?.(buff, sourceId, layers);
        }
      }
    }
    return finished;
  }

  /** 同步点燃所有在调用开始时仍活动的 Buff；响应可在处理过程中结束自身。 */
  ignite(igniteType: string, sourceId: string, skillCastInfo?: CombatSkillCastInfo): number {
    if (igniteType.length === 0) throw new Error('Buff ignite type must not be empty');
    if (sourceId.length === 0) throw new Error('Buff ignite source id must not be empty');
    const active = this.#buffs.filter(buff => !buff.isFinished);
    let count = 0;
    for (const buff of active) {
      if (buff.isFinished) continue;
      const layers = buff.enhanceCount;
      if (buff.definition.actions?.ignite?.(buff, igniteType, sourceId, skillCastInfo)) {
        count += 1;
        if (buff.isFinished) this.#onBuffConsumed?.(buff, sourceId, layers);
      }
    }
    return count;
  }

  /** 按插入顺序结束所属实体上的全部活动 Buff。 */
  finishAll(reason: BuffFinishReason = 'other'): number {
    let count = 0;
    for (const buff of this.#buffs) {
      if (!buff.isFinished && buff.finish(reason)) count += 1;
    }
    return count;
  }

  /** 固定当前匹配实例并禁止其结束；释放不会影响保护开始后新增的同 ID Buff。 */
  holdByIds(ids: readonly string[]): { release(): void } {
    const accepted = new Set(ids);
    const held = this.#buffs.filter(buff => !buff.isFinished && accepted.has(buff.definition.id));
    for (const buff of held) buff.setFinishable(false);
    let released = false;
    return {
      release: () => {
        if (released) return;
        released = true;
        for (const buff of held) {
          if (!buff.isFinished) buff.setFinishable(true);
        }
      },
    };
  }

  hasEntityTag(tag: GameplayTag): boolean {
    return (this.#entityTagCounts.get(tag) ?? 0) > 0;
  }

  addEntityTags(tags: readonly GameplayTag[]): void {
    for (const tag of tags)
      this.#entityTagCounts.set(tag, (this.#entityTagCounts.get(tag) ?? 0) + 1);
  }

  removeEntityTags(tags: readonly GameplayTag[]): void {
    for (const tag of tags) {
      const next = (this.#entityTagCounts.get(tag) ?? 0) - 1;
      if (next > 0) this.#entityTagCounts.set(tag, next);
      else this.#entityTagCounts.delete(tag);
    }
  }

  /** 按原生父级展开规则查询当前实体标签，不把 Buff 分类标签另行计数。 */
  matchesEntityTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact = false,
  ): boolean {
    return this.tagRegistry.query(this.#entityTagCounts.keys(), tags, type, exact);
  }

  /** 对任意一组原生标签执行同一目录的父级展开查询，供事件载荷匹配使用。 */
  matchesTags(
    ownedTags: readonly GameplayTag[],
    requiredTags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact = false,
  ): boolean {
    return this.tagRegistry.query(ownedTags, requiredTags, type, exact);
  }

  /** 统计所有未结束且分类标签满足查询的 Buff 层数。 */
  getCountByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType = 'hasAny',
    exact = false,
    skillCastId?: number,
  ): number {
    return this.#buffs
      .filter(
        buff =>
          !buff.isFinished &&
          (skillCastId === undefined || buff.skillCastInfo?.skillCastId === skillCastId) &&
          this.tagRegistry.query(buff.definition.applyTags ?? [], tags, type, exact),
      )
      .reduce((count, buff) => count + buff.enhanceCount, 0);
  }

  /** 对应原生 BuffContainer.GetBuffIdCountByTag：统计匹配活动 Buff 的不同定义 ID。 */
  getDistinctIdCountByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType = 'hasAny',
    exact = false,
    skillCastId?: number,
  ): number {
    return new Set(
      this.#buffs
        .filter(
          buff =>
            !buff.isFinished &&
            (skillCastId === undefined || buff.skillCastInfo?.skillCastId === skillCastId) &&
            this.tagRegistry.query(buff.definition.applyTags ?? [], tags, type, exact),
        )
        .map(buff => buff.definition.id),
    ).size;
  }

  /** 统计所有未结束且分类标签满足查询的 Buff 实例数，不把 Enhance 层数计入结果。 */
  getInstanceCountByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType = 'hasAny',
    exact = false,
    skillCastId?: number,
  ): number {
    return this.#buffs.filter(
      buff =>
        !buff.isFinished &&
        (skillCastId === undefined || buff.skillCastInfo?.skillCastId === skillCastId) &&
        this.tagRegistry.query(buff.definition.applyTags ?? [], tags, type, exact),
    ).length;
  }

  /** 按容器插入顺序返回首个未结束且分类标签满足查询的 Buff。 */
  findFirstByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType = 'hasAny',
    exact = false,
  ): CombatBuff<Key> | undefined {
    return this.#buffs.find(
      buff =>
        !buff.isFinished &&
        this.tagRegistry.query(buff.definition.applyTags ?? [], tags, type, exact),
    );
  }

  /** 按容器插入顺序结束所有匹配标签查询的 Buff，并返回实际结束数量。 */
  finishByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    reason: BuffFinishReason,
    exact = false,
    sourceId?: string,
  ): number {
    let count = 0;
    for (const buff of this.#buffs) {
      if (
        !buff.isFinished &&
        this.tagRegistry.query(buff.definition.applyTags ?? [], tags, type, exact) &&
        (() => {
          const layers = buff.enhanceCount;
          const finished = buff.finish(reason);
          if (finished && reason === 'absorbed' && sourceId !== undefined)
            this.#onBuffAbsorbed?.(buff, sourceId, layers);
          return finished;
        })()
      ) {
        count += 1;
      }
    }
    return count;
  }

  /** 原生 FinishBuffByTag 限层路径：先快照匹配实例 ID，再逐项复用 ID 扣层入口。 */
  finishCountByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    count: number,
    reason: BuffFinishReason,
    exact = false,
    sourceId?: string,
  ): number {
    if (!Number.isFinite(count) || count < 0) {
      throw new RangeError('Buff finish count must be a finite non-negative number');
    }
    const matchingIds = this.#buffs
      .filter(
        buff =>
          !buff.isFinished &&
          this.tagRegistry.query(buff.definition.applyTags ?? [], tags, type, exact),
      )
      .map(buff => buff.definition.id);
    let changed = 0;
    for (const id of matchingIds) changed += this.finishCountByIds([id], count, reason, sourceId);
    return changed;
  }

  findFirst(predicate: (buff: CombatBuff<Key>) => boolean): CombatBuff<Key> | undefined {
    return this.#buffs.find(buff => !buff.isFinished && predicate(buff));
  }

  applyDamageModifiers(
    timing: DamageProcessTiming,
    side: DamageModifierSide,
    context: PlayerDamageContext,
    evaluateCondition?: DamageModifierConditionEvaluator,
  ): void {
    for (const modifier of this.#damageModifiers) {
      modifier.apply(timing, side, context, evaluateCondition);
    }
  }

  applyHealModifiers(
    timing: HealProcessTiming,
    side: HealModifierSide,
    context: HealCalculationContext,
  ): void {
    for (const modifier of this.#healModifiers) modifier.apply(timing, side, context);
  }

  applyPoiseModifiers(
    timing: PoiseProcessTiming,
    side: PoiseModifierSide,
    context: PoiseCalculationContext,
  ): void {
    for (const modifier of this.#poiseModifiers) modifier.apply(timing, side, context);
  }

  tick(deltaTime: number | BuffTickDeltas): void {
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

  registerHealModifiers(modifiers: readonly HealModifier[]): void {
    this.#healModifiers.push(...modifiers);
  }

  unregisterHealModifiers(modifiers: readonly HealModifier[]): void {
    for (const modifier of modifiers) {
      const index = this.#healModifiers.indexOf(modifier);
      if (index >= 0) this.#healModifiers.splice(index, 1);
    }
  }

  registerPoiseModifiers(modifiers: readonly PoiseModifier[]): void {
    this.#poiseModifiers.push(...modifiers);
  }

  unregisterPoiseModifiers(modifiers: readonly PoiseModifier[]): void {
    for (const modifier of modifiers) {
      const index = this.#poiseModifiers.indexOf(modifier);
      if (index >= 0) this.#poiseModifiers.splice(index, 1);
    }
  }

  registerShields(shields: readonly CombatShield<Key>[]): void {
    this.#shields.push(...shields);
    this.#shields.sort(compareShields);
  }

  unregisterShields(shields: readonly CombatShield<Key>[]): void {
    for (const shield of shields) {
      const index = this.#shields.indexOf(shield);
      if (index >= 0) this.#shields.splice(index, 1);
    }
  }

  absorbDamage(damageType: DamageType, inputValue: number): number {
    let remaining = inputValue;
    for (const shield of [...this.#shields].reverse()) {
      if (remaining <= 0) break;
      remaining = shield.absorb(damageType, remaining);
    }
    return remaining;
  }

  registerSustainedProtection(buff: CombatBuff<Key>): void {
    const definition = buff.definition.sustainedProtection;
    if (definition === undefined) return;
    if (definition.target === 'buffSource' && buff.sourceId !== this.ownerId) {
      throw new Error(
        `buff '${buff.definition.id}' targets a distinct buff source for sustained protection`,
      );
    }
    this.#sustainedProtections.set(buff, [
      resolveBuffNumber(buff, definition.superArmor, 'super armor'),
      resolveBuffNumber(buff, definition.impactResistance, 'impact resistance'),
    ]);
  }

  unregisterSustainedProtection(buff: CombatBuff<Key>): void {
    this.#sustainedProtections.delete(buff);
  }
}

function resolveBuffNumber<Key extends string>(
  buff: CombatBuff<Key>,
  value: BuffDuration,
  label: string,
): number {
  const resolved =
    typeof value === 'number' ? value : buff.blackboard.getNumber(value.blackboardKey);
  if (resolved === undefined || !Number.isFinite(resolved)) {
    throw new Error(`buff '${buff.definition.id}' ${label} must resolve to a finite number`);
  }
  return resolved;
}

function resolveShieldAttributeValue<Key extends string>(
  buff: CombatBuff<Key>,
  calculation: Extract<BuffShieldDefinition['value'], { readonly attribute: string }>,
): number {
  const useSource = calculation.attributeSource === 'buffSource';
  if (useSource && buff.sourceId !== buff.owner.ownerId) {
    const resolve = buff.getSourceAttributeValue;
    if (resolve === null) {
      throw new Error(
        `buff '${buff.definition.id}' shield source attribute '${calculation.attribute}' is unavailable`,
      );
    }
    const value = resolve(calculation.attribute);
    const multiplier = resolveBuffNumber(buff, calculation.multiplier, 'shield multiplier');
    const addition = resolveBuffNumber(buff, calculation.addition, 'shield addition');
    return value * multiplier + addition;
  }
  if (!buff.owner.attributes.has(calculation.attribute)) {
    throw new Error(
      `buff '${buff.definition.id}' shield attribute '${calculation.attribute}' is missing`,
    );
  }
  const attributeValue = buff.owner.attributes.get(calculation.attribute as Key);
  const multiplier = resolveBuffNumber(buff, calculation.multiplier, 'shield multiplier');
  const addition = resolveBuffNumber(buff, calculation.addition, 'shield addition');
  return attributeValue * multiplier + addition;
}

function resolveBuffInteger<Key extends string>(
  buff: CombatBuff<Key>,
  value: BuffTriggerCount,
  label: string,
): number {
  const resolved = resolveBuffNumber(buff, value, label);
  if (!Number.isInteger(resolved)) {
    throw new Error(`buff '${buff.definition.id}' ${label} must resolve to an integer`);
  }
  return resolved;
}

function compareShields<Key extends string>(
  left: CombatShield<Key>,
  right: CombatShield<Key>,
): number {
  const priority =
    (left.definition.priority === 'prioritizeConsume' ? 1 : 0) -
    (right.definition.priority === 'prioritizeConsume' ? 1 : 0);
  if (priority !== 0) return priority;
  return (
    (left.buff.remainingDuration ?? Number.POSITIVE_INFINITY) -
    (right.buff.remainingDuration ?? Number.POSITIVE_INFINITY)
  );
}

function resolveBuffTickDelta(clock: BuffTimeClock, deltas: BuffTickDeltas): number {
  switch (clock) {
    case 'default':
      return deltas.defaultDeltaSeconds;
    case 'global':
      return deltas.globalScaledDeltaSeconds;
    case 'self':
      return deltas.selfScaledDeltaSeconds;
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

  refreshAfterEnhanceDecrease(): void {
    this.#currentStackCount = this.#buffs
      .filter(buff => !buff.isFinished)
      .reduce((count, buff) => count + buff.enhanceCount, 0);
  }

  private allocate(
    definition: CombatBuffDefinition<Key>,
    sourceId: string,
    options?: CombatBuffAddOptions,
  ): CombatBuff<Key> {
    const buff = this.owner.allocateBuff(definition, sourceId, options);
    buff.attachStackingGroup(this);
    buff.enable();
    this.#buffs.push(buff);
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
  if (!Number.isFinite(value))
    throw new RangeError('buff duration must resolve to a finite number');
  return value;
}

function resolveBuffPriority<Key extends string>(
  definition: CombatBuffDefinition<Key>,
  blackboard: ActionBlackboard,
): number {
  // combat-spec/buff-priority-loading.md：Stack 等非优先级类型不会加载残留的配置字段。
  if (
    definition.stackingType !== 'highPriority' &&
    definition.stackingType !== 'highPriorityWithMaxStack'
  )
    return 0;
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
