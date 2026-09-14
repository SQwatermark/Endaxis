/**
 * 属性集合与修正器的纯数据。注册列表保留对象身份和顺序，完整数据图复制时保留共享引用。
 * 固定属性上下限与基础值由宿主提供，不能通过丢失定义来绕过原生边界检查。
 */
import type {
  AttributeModifierTiming,
  AttributeModifierValues,
} from '../../../../packages/game-data-contract/src/modifiers.ts';
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

export const COMBAT_ATTRIBUTE_VALUE_STAGES = ['armed', 'final'] as const;
/** 属性聚合中可供原生动作读取的已确认阶段。 */
export type CombatAttributeValueStage = (typeof COMBAT_ATTRIBUTE_VALUE_STAGES)[number];

/** 一组战斗属性的基础值和按槽位计算方式。 */
export interface CombatAttributeDefinition {
  /** 省略表示原生 AttributeMeta 没有配置下限。 */
  readonly minimum?: number;
  /** 省略表示原生 AttributeMeta 没有配置上限。 */
  readonly maximum?: number;
  readonly otherAttributeBaseAddition?: number;
  readonly otherAttributeBaseFinalMultiplier?: number;
  readonly otherAttributeFinalMultiplier?: number;
}

/** 一项属性修正。无类实例、访问器或执行回调，可直接进入战斗状态。 */
export interface CombatAttributeModifier<Key extends string> {
  readonly attribute: Key;
  readonly values: AttributeModifierValues;
  readonly source: AttributeModifierSource;
  readonly timing: AttributeModifierTiming;
}

export interface CombatAttributeState<Key extends string> {
  readonly rawValues: Map<Key, number>;
  readonly definitions: Map<Key, CombatAttributeDefinition>;
  readonly modifiers: CombatAttributeModifier<Key>[];
}

export function createCombatAttributeState<Key extends string>(): CombatAttributeState<Key> {
  return { rawValues: new Map(), definitions: new Map(), modifiers: [] };
}

export function createCombatAttributeModifier<Key extends string>(
  attribute: Key,
  values: AttributeModifierValues,
  source: AttributeModifierSource,
  timing: AttributeModifierTiming,
): CombatAttributeModifier<Key> {
  for (const [name, value] of Object.entries(values)) {
    if (!Number.isFinite(value)) throw new TypeError(`attribute modifier ${name} must be finite`);
  }
  return { attribute, values, source, timing };
}
