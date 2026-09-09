import type { AbilityEvent } from '../../../../packages/game-data-contract/src/abilityEvents';
import type {
  InflictionElement,
  PhysicalInflictionType,
  SkillType,
  SpGainSource,
  SpGainKind,
} from '../../game-data/operatorDefinition';
import type { GameplayTag } from '../../../../packages/game-data-contract/src/gameplayTags';
import type { CombatSkillCastInfo } from '../runtime/skillCastInfo';
import type { BuffApplicationHandle, BuffAppliedEvent } from '../runtime/buffOperationExecutor';
import type { BuffFinishReason } from '../buffs/combatBuffs';
import type { AbilityEventFromMap } from './abilityEventDispatcher';
import type { HealthDamageEventPayload } from '../damage/healthDamage';
import type { PlayerDamageContext } from '../damage/playerDamageContext';
import type { ElementalInflictionEventPayload } from '../runtime/elementalInflictionOperationExecutor';

export type SpellBurstAbilityEvent = CombatAbilityEvent<'beforeOutputSpellBurst'> & {
  readonly kind?: never;
};
export type CharacterInflictionAbilityEvent = CombatAbilityEvent<'beforeTakeSpellInfliction'> & {
  readonly kind?: never;
};
export function spellBurstAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): SpellBurstAbilityEvent | undefined {
  if (!('event' in event) || event.event !== 'beforeOutputSpellBurst') return undefined;
  const published = event as SpellBurstAbilityEvent;
  if (
    typeof published.payload?.sourceId !== 'string' ||
    typeof published.payload.targetId !== 'string' ||
    typeof published.payload.burstType !== 'string'
  )
    throw new TypeError('Spell burst event has invalid payload');
  return published;
}
/** 角色承术与敌人附着四阶段分开；允许原载荷未提供元素。 */
export function characterInflictionAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): CharacterInflictionAbilityEvent | undefined {
  if (!('event' in event) || event.event !== 'beforeTakeSpellInfliction') return undefined;
  const published = event as CharacterInflictionAbilityEvent;
  if (
    typeof published.payload?.sourceId !== 'string' ||
    typeof published.payload.targetId !== 'string' ||
    (published.payload.element !== undefined &&
      !['heat', 'electric', 'cryo', 'nature'].includes(published.payload.element))
  )
    throw new TypeError('Character infliction event has invalid payload');
  return published;
}

export type SkillAbilityEvent = CombatAbilityEvent<
  'beforeCastSkill' | 'afterSkillApplyCost' | 'skillEnd'
> & { readonly kind?: never };
/** 当前施法身份和继承来源相互独立；保留原始挂载端口，不重建技能对象。 */
export function skillAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): SkillAbilityEvent | undefined {
  if (
    !('event' in event) ||
    (event.event !== 'beforeCastSkill' &&
      event.event !== 'afterSkillApplyCost' &&
      event.event !== 'skillEnd')
  )
    return undefined;
  const published = event as SkillAbilityEvent;
  const payload = published.payload;
  if (
    typeof payload?.sourceId !== 'string' ||
    typeof payload.targetId !== 'string' ||
    typeof payload.skillId !== 'string' ||
    !Number.isSafeInteger(payload.skillCastId) ||
    payload.skillCastId <= 0 ||
    ![
      'basicAttack',
      'battleSkill',
      'comboSkill',
      'ultimate',
      'finisher',
      'plungingAttack',
    ].includes(payload.skillType)
  )
    throw new TypeError('Skill event has invalid skill identity');
  return published;
}

export type LifecycleAbilityEvent = CombatAbilityEvent<
  | 'enterFight'
  | 'ownerSwitchToCenter'
  | 'ownerSwitchToGuard'
  | 'ownerHpZero'
  | 'abilityEntitySpawned'
  | 'abilityEntityFinished'
> & { readonly kind?: never };
/** 生命周期只识别原始发布身份，不合并事件或重建出生/结束时的实体关系。 */
export function lifecycleAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): LifecycleAbilityEvent | undefined {
  if (!('event' in event)) return undefined;
  switch (event.event) {
    case 'enterFight':
    case 'ownerSwitchToCenter':
    case 'ownerSwitchToGuard':
    case 'ownerHpZero':
    case 'abilityEntitySpawned':
    case 'abilityEntityFinished': {
      const published = event as LifecycleAbilityEvent;
      if (
        typeof published.payload?.sourceId !== 'string' ||
        typeof published.payload.targetId !== 'string'
      )
        throw new TypeError('Lifecycle event has invalid entity identities');
      return published;
    }
    default:
      return undefined;
  }
}

export type WeaknessAbilityEvent = CombatAbilityEvent<
  'weaknessSet' | 'afterOutputWeaknessTriggered'
> & { readonly kind?: never };
export type CustomAbilityEvent = CombatAbilityEvent<'customAbilityEvent'> & {
  readonly kind?: never;
};
/** 设置与触发是两个原生事件；此处仅识别，不互相转换。 */
export function weaknessAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): WeaknessAbilityEvent | undefined {
  if (
    !('event' in event) ||
    (event.event !== 'weaknessSet' && event.event !== 'afterOutputWeaknessTriggered')
  )
    return undefined;
  const published = event as WeaknessAbilityEvent;
  if (
    typeof published.payload?.sourceId !== 'string' ||
    (published.event === 'afterOutputWeaknessTriggered' &&
      typeof published.payload.targetId !== 'string')
  )
    throw new TypeError('Weakness event has invalid entity identities');
  return published;
}
/** 自定义事件的名称和参数保持原值，不推测名称语义。 */
export function customAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): CustomAbilityEvent | undefined {
  if (!('event' in event) || event.event !== 'customAbilityEvent') return undefined;
  const published = event as CustomAbilityEvent;
  if (
    typeof published.payload?.sourceId !== 'string' ||
    typeof published.payload.targetId !== 'string' ||
    typeof published.payload.eventName !== 'string' ||
    typeof published.payload.eventParam !== 'number'
  )
    throw new TypeError('Custom ability event has invalid values');
  return published;
}

export type PoiseAbilityEvent = CombatAbilityEvent<'poiseZero' | 'poiseKnotBreak'> & {
  readonly kind?: never;
};
export type ShieldAbilityEvent = CombatAbilityEvent<'afterAddedShield'> & { readonly kind?: never };
/** 失衡事件保留发布端载荷，不压平来源、目标或施法信息。 */
export function poiseAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): PoiseAbilityEvent | undefined {
  if (!('event' in event) || (event.event !== 'poiseZero' && event.event !== 'poiseKnotBreak'))
    return undefined;
  const published = event as PoiseAbilityEvent;
  if (
    typeof published.payload?.sourceId !== 'string' ||
    typeof published.payload.targetId !== 'string'
  )
    throw new TypeError('Poise event has invalid entity identities');
  return published;
}
/** 护盾新增量与当前值保持独立；识别事件不重新计算或复制它们。 */
export function shieldAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): ShieldAbilityEvent | undefined {
  if (!('event' in event) || event.event !== 'afterAddedShield') return undefined;
  const published = event as ShieldAbilityEvent;
  if (
    typeof published.payload?.sourceId !== 'string' ||
    typeof published.payload.targetId !== 'string' ||
    typeof published.payload.gainedValue !== 'number' ||
    typeof published.payload.currentValue !== 'number'
  )
    throw new TypeError('Shield event has invalid shield values');
  return published;
}

/**
 * 发布和消费共用的事件载荷。事件身份在外层，载荷不再另造 kind 或重命名字段。
 * 原生依据：combo-event-gates-and-pending、origin-skill-event-context、buff-ability-event-actions。
 * 对象由发布者持有；同步修改端口和嵌套对象仍是原始引用，不序列化/复制。
 */
export type NativeKillEvent = CombatAbilityEvent<'afterKillEntity'> & { readonly kind?: never };

/** 击杀沿用结算载荷与发布对象，不经 Buff 专用事件适配。 */
export function killAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): NativeKillEvent | undefined {
  return 'event' in event && event.event === 'afterKillEntity'
    ? (event as NativeKillEvent)
    : undefined;
}

export interface AbilityEntityPair {
  readonly sourceId: string;
  readonly targetId: string;
}

/** 附着四阶段使用生产者的完整载荷，保留 isExtra 与施法来源，不压平为第二套事件。 */
export type InflictionAbilityEvent = CombatAbilityEvent<
  | 'beforeOutputInfliction'
  | 'beforeTakeInfliction'
  | 'afterOutputInfliction'
  | 'afterTakeInfliction'
> & { readonly kind?: never };
export function inflictionAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): InflictionAbilityEvent | undefined {
  if (!('event' in event)) return undefined;
  switch (event.event) {
    case 'beforeOutputInfliction':
    case 'beforeTakeInfliction':
    case 'afterOutputInfliction':
    case 'afterTakeInfliction':
      return event as InflictionAbilityEvent;
    default:
      return undefined;
  }
}

/** 仅返回事件实际携带的目标；无目标事件不得补造敌人或自身。 */
export function abilityEventTargetId(event: CombatAbilityEvent): string | undefined {
  return 'targetId' in event.payload ? event.payload.targetId : undefined;
}
export function abilityEventSourceId(event: CombatAbilityEvent): string {
  return 'sourceId' in event.payload ? event.payload.sourceId : event.payload.sourceOperatorId;
}

export interface AbilityOriginPayload extends AbilityEntityPair {
  /** undefined 是生产者未提供，null 是明确无来源，均不能回退外层事件。 */
  readonly skillCastInfo?: CombatSkillCastInfo | null;
}

export interface AbilityPhysicalInflictionPayload extends AbilityOriginPayload {
  readonly type?: PhysicalInflictionType;
  readonly attachBuffToCurrentSkill?: (buff: BuffApplicationHandle) => void;
}

export interface AbilityKnockDownPayload extends AbilityOriginPayload {
  readonly fromAirborne: boolean;
}

export interface AbilitySpellInflictionPayload extends AbilityOriginPayload {
  readonly element?: InflictionElement;
}

export interface AbilitySpellBurstPayload extends AbilityOriginPayload {
  readonly burstType: string;
}

export interface AbilityFinishedBuffPayload extends AbilityOriginPayload {
  readonly buffId: string;
  readonly buffTags: readonly GameplayTag[];
  readonly reason: BuffFinishReason;
}

export interface AbilityConsumedBuffPayload extends AbilityOriginPayload {
  readonly buffId: string;
  readonly buffTags: readonly GameplayTag[];
  readonly layers: number;
  readonly blackboardValues?: Readonly<Record<string, string | number | null>>;
}

/** OnBuffEnhanceChanged 在 Buff owner 上广播，不具有动作目标。 */
export interface AbilityBuffEnhancePayload {
  readonly sourceId: string;
  readonly buffId: string;
  readonly layerCount: number;
  readonly reason?: BuffFinishReason;
}

export interface AbilitySkillPayload extends AbilityOriginPayload {
  readonly skillType: SkillType;
  readonly skillId: string;
  readonly skillCastId: number;
  readonly attachBuffToCurrentSkill?: (buff: BuffApplicationHandle) => void;
}

export interface AbilityHealPayload extends AbilityEntityPair {
  readonly requestedHealing: number;
  readonly actualHealing: number;
  readonly overhealing: number;
  readonly tags: readonly GameplayTag[];
}

export interface AbilityShieldPayload extends AbilityEntityPair {
  readonly gainedValue: number;
  readonly currentValue: number;
}

export interface AbilityCustomPayload extends AbilityEntityPair {
  readonly eventName: string;
  readonly eventParam: number;
}

/** OnObtainAtb 的来源/方式及请求量/实增量；skillSpGained 是历史契约名称，不限定 Skill/Gain。 */
export interface AbilitySpGainPayload {
  readonly sourceOperatorId: string;
  readonly source: SpGainSource;
  readonly gainKind: SpGainKind;
  readonly requestedAmount: number;
  readonly amount: number;
}

export type SpGainAbilityEvent = CombatAbilityEvent<'skillSpGained'> & { readonly kind?: never };
export function spGainAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): SpGainAbilityEvent | undefined {
  return 'event' in event && event.event === 'skillSpGained'
    ? (event as SpGainAbilityEvent)
    : undefined;
}

/** 每个公共事件只在此关联一种载荷；不按 Buff/技能/装备重新定义范围。 */
export interface AbilityEventPayloadMap {
  enterFight: AbilityOriginPayload;
  ownerSwitchToCenter: AbilityOriginPayload;
  ownerSwitchToGuard: AbilityOriginPayload;
  ownerHpZero: AbilityOriginPayload;
  abilityEntitySpawned: AbilityOriginPayload;
  abilityEntityFinished: AbilityOriginPayload;
  // 准备阶段传递可变伤害包，结算阶段传递结算结果；不能裁成相似的只读字段集合。
  beforeTakeDamage: HealthDamageEventPayload | ExternalOperatorHitPayload;
  beforeCalculateDamage: PlayerDamageContext;
  beforeDamageAction: PlayerDamageContext;
  beforeOutputDamage: HealthDamageEventPayload;
  takeDamage: HealthDamageEventPayload | ExternalOperatorHitPayload;
  takeCriticalDamage: HealthDamageEventPayload;
  outputDamage: HealthDamageEventPayload;
  outputCriticalDamage: HealthDamageEventPayload;
  beforeTakePhysicalInfliction: AbilityPhysicalInflictionPayload;
  afterTakePhysicalInfliction: AbilityPhysicalInflictionPayload;
  beforeOutputPhysicalInfliction: AbilityPhysicalInflictionPayload;
  afterOutputPhysicalInfliction: AbilityPhysicalInflictionPayload;
  beforeOutputKnockDown: AbilityKnockDownPayload;
  afterOutputKnockDown: AbilityKnockDownPayload;
  outputKnockDown: AbilityEntityPair;
  beforeOutputInfliction: ElementalInflictionEventPayload;
  afterOutputInfliction: ElementalInflictionEventPayload;
  beforeTakeSpellInfliction: AbilitySpellInflictionPayload;
  beforeTakeInfliction: ElementalInflictionEventPayload;
  afterTakeInfliction: ElementalInflictionEventPayload;
  beforeOutputSpellBurst: AbilitySpellBurstPayload;
  outputHeal: AbilityHealPayload;
  receiveHeal: AbilityHealPayload;
  afterAddedShield: AbilityShieldPayload;
  poiseZero: AbilityOriginPayload;
  poiseKnotBreak: AbilityOriginPayload;
  beforeCastSkill: AbilitySkillPayload;
  afterSkillApplyCost: AbilitySkillPayload;
  skillEnd: AbilitySkillPayload;
  beforeOutputBuff: BuffAppliedEvent;
  beforeAddedBuff: BuffAppliedEvent;
  outputBuff: BuffAppliedEvent;
  addedBuff: BuffAppliedEvent;
  finishedBuff: AbilityFinishedBuffPayload;
  buffEndsEarly: AbilityFinishedBuffPayload;
  buffEnhanceChanged: AbilityBuffEnhancePayload;
  afterOutputWeaknessTriggered: AbilityEntityPair;
  weaknessSet: { readonly sourceId: string };
  customAbilityEvent: AbilityCustomPayload;
  afterKillEntity: HealthDamageEventPayload;
  buffConsumed: AbilityConsumedBuffPayload;
  buffAbsorbed: AbilityConsumedBuffPayload;
  skillSpGained: AbilitySpGainPayload;
}

/** 按事件名索引，保留 event 与 payload 的关联；新增公共事件必须补齐载荷定义。 */
export type CombatAbilityEvent<Event extends AbilityEvent = AbilityEvent> = AbilityEventFromMap<
  Event,
  AbilityEventPayloadMap
>;

/** 四个施加阶段共用 AddBuffContext 数据，但必须保留各自的事件身份。 */
export type BuffApplicationAbilityEvent = CombatAbilityEvent<
  'beforeOutputBuff' | 'beforeAddedBuff' | 'addedBuff' | 'outputBuff'
> & { readonly kind?: never };

export function buffApplicationEvent(
  event: CombatAbilityEvent,
): BuffApplicationAbilityEvent | undefined {
  switch (event.event) {
    case 'beforeOutputBuff':
    case 'beforeAddedBuff':
    case 'addedBuff':
    case 'outputBuff':
      return event;
    default:
      return undefined;
  }
}

/** Buff 通知共用身份与数据读取；结束与消耗的不同字段仍由事件名判别。 */
export type BuffAbilityEvent =
  | BuffApplicationAbilityEvent
  | (CombatAbilityEvent<'finishedBuff' | 'buffEndsEarly' | 'buffConsumed' | 'buffAbsorbed'> & {
      readonly kind?: never;
    });

export function buffAbilityEvent(event: CombatAbilityEvent): BuffAbilityEvent | undefined {
  switch (event.event) {
    case 'finishedBuff':
    case 'buffEndsEarly':
    case 'buffConsumed':
    case 'buffAbsorbed':
      return event;
    default:
      return buffApplicationEvent(event);
  }
}

/** 两侧成功治疗通知共享载荷结构，但发布者与事件身份保持独立。 */
export type HealAbilityEvent = CombatAbilityEvent<'outputHeal' | 'receiveHeal'> & {
  readonly kind?: never;
};
export function healAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): HealAbilityEvent | undefined {
  return 'event' in event && (event.event === 'outputHeal' || event.event === 'receiveHeal')
    ? (event as HealAbilityEvent)
    : undefined;
}

/** 准备阶段保留可变伤害包，结算阶段保留结果，禁止裁成只读字段副本。 */
export type DamageAbilityEvent = CombatAbilityEvent<
  | 'beforeDamageAction'
  | 'beforeCalculateDamage'
  | 'beforeOutputDamage'
  | 'beforeTakeDamage'
  | 'takeDamage'
  | 'takeCriticalDamage'
  | 'outputDamage'
  | 'outputCriticalDamage'
> & { readonly kind?: never };
export function damageAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): DamageAbilityEvent | undefined {
  if (!('event' in event)) return undefined;
  switch (event.event) {
    case 'beforeDamageAction':
    case 'beforeCalculateDamage':
    case 'beforeOutputDamage':
    case 'beforeTakeDamage':
    case 'takeDamage':
    case 'takeCriticalDamage':
    case 'outputDamage':
    case 'outputCriticalDamage':
      return event as DamageAbilityEvent;
    default:
      return undefined;
  }
}

/** 用户注入的受击事实：只通知监听器，没有敌人执行、生命写入或虚构伤害结果。 */
export interface ExternalOperatorHitPayload {
  readonly external: true;
  readonly sourceId: 'enemy';
  readonly targetId: string;
  readonly damageType?: import('../../game-data/operatorDefinition').DamageType;
  readonly tags: readonly import('../../game-data/operatorDefinition').DamageTag[];
  readonly features: readonly import('../../game-data/operatorDefinition').DamageFeature[];
  readonly result?: never;
  readonly skillCastInfo?: never;
}

/** 通用物理异常与控制组件专属通知保留不同载荷，不混成同一种“击倒”。 */
export type PhysicalAbilityEvent = CombatAbilityEvent<
  | 'beforeTakePhysicalInfliction'
  | 'beforeOutputPhysicalInfliction'
  | 'afterTakePhysicalInfliction'
  | 'afterOutputPhysicalInfliction'
> & { readonly kind?: never };
export type KnockDownAbilityEvent = CombatAbilityEvent<
  'beforeOutputKnockDown' | 'afterOutputKnockDown'
> & { readonly kind?: never };
export function physicalAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): PhysicalAbilityEvent | undefined {
  if (!('event' in event)) return undefined;
  switch (event.event) {
    case 'beforeTakePhysicalInfliction':
    case 'beforeOutputPhysicalInfliction':
    case 'afterTakePhysicalInfliction':
    case 'afterOutputPhysicalInfliction':
      return event as PhysicalAbilityEvent;
    default:
      return undefined;
  }
}
export function knockDownAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): KnockDownAbilityEvent | undefined {
  if (
    !('event' in event) ||
    (event.event !== 'beforeOutputKnockDown' && event.event !== 'afterOutputKnockDown')
  )
    return undefined;
  const published = event as KnockDownAbilityEvent;
  if (typeof published.payload?.fromAirborne !== 'boolean')
    throw new TypeError('KnockDown event requires explicit fromAirborne');
  return published;
}

/** 层数变化使用同一发布对象，变化量可以为负，不是变化后的总层数。 */
export type BuffEnhanceAbilityEvent = CombatAbilityEvent<'buffEnhanceChanged'> & {
  readonly kind?: never;
};
export function buffEnhanceAbilityEvent(
  event: { readonly event?: unknown } | { readonly kind: unknown },
): BuffEnhanceAbilityEvent | undefined {
  if (!('event' in event) || event.event !== 'buffEnhanceChanged') return undefined;
  const published = event as BuffEnhanceAbilityEvent;
  if (
    typeof published.payload?.sourceId !== 'string' ||
    typeof published.payload.buffId !== 'string' ||
    !Number.isInteger(published.payload.layerCount)
  )
    throw new TypeError('Buff enhance event has invalid layer change');
  return published;
}
