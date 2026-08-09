/**
 * 面板解析和战斗运行时共享的属性修正聚合核心。
 * 调用方必须按已确认的原生槽位注册修正，并显式管理启停，不能预先合并而丢失来源身份。
 */
export const ATTRIBUTE_MODIFIER_SOURCES = {
  none: 0,
  buff: 1,
  equipment: 2,
  weapon: 4,
  talent: 8,
  cardSkill: 16,
  instant: 32,
  converted: 64,
  potential: 128,
  all: -1,
  nonConverted: -65,
  deck: 158,
} as const;
/** 属性修正的稳定来源身份，用于追踪和移除对应修正。 */
export type AttributeModifierSource =
  (typeof ATTRIBUTE_MODIFIER_SOURCES)[keyof typeof ATTRIBUTE_MODIFIER_SOURCES];

export const ATTRIBUTE_MODIFIER_TIMINGS = ['deck', 'runtime'] as const;
/** 属性修正写入原生八槽公式的处理时机。 */
export type AttributeModifierTiming = (typeof ATTRIBUTE_MODIFIER_TIMINGS)[number];

export const ATTRIBUTE_MODIFIER_SLOTS = [
  'addition',
  'multiplier',
  'finalAddition',
  'finalMultiplier',
  'baseAddition',
  'baseMultiplier',
  'baseFinalAddition',
  'baseFinalMultiplier',
] as const;
/** 原生属性聚合公式中的固定槽位。 */
export type AttributeModifierSlot = (typeof ATTRIBUTE_MODIFIER_SLOTS)[number];

export const COMBAT_ATTRIBUTE_VALUE_STAGES = ['armed', 'final'] as const;
/** 属性聚合中可供原生动作读取的已确认阶段。 */
export type CombatAttributeValueStage = (typeof COMBAT_ATTRIBUTE_VALUE_STAGES)[number];

/** 一个修正在各槽位提供的稀疏数值集合。 */
export interface AttributeModifierValues {
  readonly addition: number;
  readonly multiplier: number;
  readonly finalAddition: number;
  readonly finalMultiplier: number;
  readonly baseAddition: number;
  readonly baseMultiplier: number;
  readonly baseFinalAddition: number;
  readonly baseFinalMultiplier: number;
}

/** 一组战斗属性的基础值和按槽位计算方式。 */
export interface CombatAttributeDefinition {
  readonly minimum: number;
  readonly maximum: number;
  readonly otherAttributeBaseAddition?: number;
  readonly otherAttributeBaseFinalMultiplier?: number;
  readonly otherAttributeFinalMultiplier?: number;
}

const IDENTITY_VALUES: AttributeModifierValues = {
  addition: 0,
  multiplier: 0,
  finalAddition: 0,
  finalMultiplier: 1,
  baseAddition: 0,
  baseMultiplier: 0,
  baseFinalAddition: 0,
  baseFinalMultiplier: 1,
};

/** 可独立启停并保留来源身份的一项运行时属性修正。 */
export class CombatAttributeModifier<Key extends string> {
  constructor(
    readonly attribute: Key,
    readonly values: AttributeModifierValues,
    readonly source: AttributeModifierSource,
    readonly timing: AttributeModifierTiming,
  ) {
    for (const [name, value] of Object.entries(values)) {
      assertFinite(value, `attribute modifier ${name}`);
    }
  }
}

export function attributeModifierValues(
  slot: AttributeModifierSlot,
  value: number,
): AttributeModifierValues {
  if (!Number.isFinite(value)) throw new TypeError('attribute modifier value must be finite');
  return { ...IDENTITY_VALUES, [slot]: value };
}

/** 使用已还原的原生八槽公式聚合属性。 */
export class CombatAttributeSet<Key extends string> {
  readonly #rawValues = new Map<Key, number>();
  readonly #definitions = new Map<Key, CombatAttributeDefinition>();
  readonly #modifiers: CombatAttributeModifier<Key>[] = [];

  get modifierCount(): number {
    return this.#modifiers.length;
  }

  define(attribute: Key, rawValue: number, definition: CombatAttributeDefinition): void {
    assertFinite(rawValue, 'raw attribute value');
    assertDefinition(definition);
    this.#rawValues.set(attribute, rawValue);
    this.#definitions.set(attribute, definition);
  }

  setRawValue(attribute: Key, value: number): void {
    assertFinite(value, 'raw attribute value');
    this.#rawValues.set(attribute, value);
  }

  /** 只检查属性身份是否已进入当前实体，不把缺失属性静默解释成 0。 */
  has(attribute: string): boolean {
    return this.#rawValues.has(attribute as Key);
  }

  /**
   * 读取基础槽结算后的 Armed 值；StoreAttributeValue 会配合 nonConverted 来源掩码调用。
   * 该阶段不包含 addition/multiplier/finalAddition/finalMultiplier 四个最终槽。
   */
  getArmed(
    attribute: Key,
    filter: AttributeModifierSource = ATTRIBUTE_MODIFIER_SOURCES.all,
  ): number {
    return this.#getAtStage(attribute, 'armed', filter);
  }

  get(attribute: Key, filter: AttributeModifierSource = ATTRIBUTE_MODIFIER_SOURCES.all): number {
    return this.#getAtStage(attribute, 'final', filter);
  }

  #getAtStage(
    attribute: Key,
    stage: CombatAttributeValueStage,
    filter: AttributeModifierSource,
  ): number {
    const rawValue = this.#rawValues.get(attribute);
    if (rawValue === undefined) return 0;
    const definition = this.#definitions.get(attribute);
    const modifiers = this.#modifiers.filter(
      modifier => modifier.attribute === attribute && (modifier.source & filter) !== 0,
    );
    if (definition === undefined) {
      if (modifiers.length > 0) {
        throw new Error(`attribute '${attribute}' requires explicit native bounds`);
      }
      return rawValue;
    }

    const values = modifiers.map(modifier => modifier.values);
    const baseValue = clamp(
      rawValue + sum(values, 'baseAddition') + (definition.otherAttributeBaseAddition ?? 0),
      definition,
    );
    const armedValue = clamp(
      (baseValue * Math.max(0, 1 + sum(values, 'baseMultiplier')) +
        sum(values, 'baseFinalAddition')) *
        product(values, 'baseFinalMultiplier') *
        (definition.otherAttributeBaseFinalMultiplier ?? 1),
      definition,
    );
    if (stage === 'armed') return armedValue;
    const finalValue =
      ((armedValue + sum(values, 'addition')) * Math.max(0, 1 + sum(values, 'multiplier')) +
        sum(values, 'finalAddition')) *
      product(values, 'finalMultiplier') *
      (definition.otherAttributeFinalMultiplier ?? 1);
    return clamp(finalValue, definition);
  }

  addModifier(modifier: CombatAttributeModifier<Key>): void {
    if (!this.#definitions.has(modifier.attribute)) {
      throw new Error(`attribute '${modifier.attribute}' requires explicit native bounds`);
    }
    if (!this.#modifiers.includes(modifier)) this.#modifiers.push(modifier);
  }

  removeModifier(modifier: CombatAttributeModifier<Key>): boolean {
    const index = this.#modifiers.indexOf(modifier);
    if (index < 0) return false;
    this.#modifiers.splice(index, 1);
    return true;
  }

  clearInstantModifiers(): void {
    for (let index = this.#modifiers.length - 1; index >= 0; index -= 1) {
      if (this.#modifiers[index]!.source === ATTRIBUTE_MODIFIER_SOURCES.instant) {
        this.#modifiers.splice(index, 1);
      }
    }
  }

  capture(attributes: readonly Key[]): ReadonlyMap<Key, number> {
    return new Map(attributes.map(attribute => [attribute, this.get(attribute)]));
  }
}

function sum(
  values: readonly AttributeModifierValues[],
  key: keyof AttributeModifierValues,
): number {
  return values.reduce((total, current) => total + current[key], 0);
}

function product(
  values: readonly AttributeModifierValues[],
  key: 'finalMultiplier' | 'baseFinalMultiplier',
): number {
  return values.reduce((total, current) => total * current[key], 1);
}

function clamp(value: number, definition: CombatAttributeDefinition): number {
  return Math.min(Math.max(value, definition.minimum), definition.maximum);
}

function assertDefinition(definition: CombatAttributeDefinition): void {
  for (const [name, value] of Object.entries(definition)) assertFinite(value, name);
  if (definition.minimum > definition.maximum) {
    throw new RangeError('minimum attribute value cannot exceed maximum value');
  }
}

function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}
