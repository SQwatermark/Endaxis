import type { GameplayTag, GameplayTagMatchType, GameplayTagQueryType } from './gameplayTags.ts';
import {
  type CombatTarget,
  type ComparisonOperator,
  type DamageFeature,
  type DamageTag,
  type DamageType,
} from './primitives.ts';

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

/**
 * 属性、Buff 和技能分类汇入最终伤害公式前的统一倍率容器。
 * 调用方必须保留来源方/目标方与区间身份，不能先行压缩为一个总乘区。
 */
export const DAMAGE_SCALE_ZONES = [
  'product',
  'normal',
  'abnormalAndBurst',
  'enhanced',
  'combo',
  'vulnerable',
  'race',
] as const;

/** 七区间伤害倍率中的稳定区间身份。 */
export type DamageScaleZone = (typeof DAMAGE_SCALE_ZONES)[number];

export const DAMAGE_MODIFIER_SIDES = ['attacker', 'defender'] as const;

/** 指明修正来自伤害来源方还是目标方。 */
export type DamageModifierSide = (typeof DAMAGE_MODIFIER_SIDES)[number];

/** 伤害倍率与其他伤害修正使用同一来源方/目标方身份。 */
export const DAMAGE_SCALE_SIDES = DAMAGE_MODIFIER_SIDES;

/** 区分来源方增伤和目标方易伤/减伤的倍率所有者。 */
export type DamageScaleSide = (typeof DAMAGE_SCALE_SIDES)[number];

export const DAMAGE_PROCESS_TIMINGS = ['beforeCalculation', 'afterCalculation'] as const;

/** 伤害修正器可以挂载的原生处理阶段。 */
export type DamageProcessTiming = (typeof DAMAGE_PROCESS_TIMINGS)[number];

export const DAMAGE_TARGET_HEALTH_TYPES = ['none', 'normal', 'independent'] as const;

/** 目标的生命形态分类，供特定伤害规则筛选。 */
export type DamageTargetHealthType = (typeof DAMAGE_TARGET_HEALTH_TYPES)[number];

/** 伤害处理器中的动态数值可直接取常量，也可读取所属 Buff 实例的黑板。 */
export type DamageModifierNumber = number | { readonly blackboardKey: string };

/** 战斗装配层负责使用统一条件系统判断当前伤害修正是否成立。 */
export type DamageModifierExternalCondition =
  | {
      readonly kind: 'entityTagMatch';
      readonly target: CombatTarget;
      readonly tagQueryType: GameplayTagQueryType;
      readonly tags: readonly GameplayTag[];
    }
  | { readonly kind: 'casterControlled' }
  | {
      readonly kind: 'buffIdCountCompare';
      readonly target: 'caster' | 'enemy';
      readonly buffIds: readonly string[];
      readonly operator: ComparisonOperator;
      readonly value: DamageModifierNumber;
    }
  | {
      readonly kind: 'eventDamageTagsMatch';
      readonly match: GameplayTagMatchType;
      readonly tags: readonly DamageTag[];
    }
  | {
      readonly kind: 'eventDamageFeaturesMatch';
      readonly match: GameplayTagMatchType;
      readonly features: readonly DamageFeature[];
    }
  | {
      readonly kind: 'eventDamageTypesMatch';
      readonly damageTypes: readonly DamageType[];
    }
  | {
      readonly kind: 'targetHealthCompare';
      readonly target: 'enemy';
      readonly valueType: 'current' | 'ratio';
      readonly operator: ComparisonOperator;
      readonly value: DamageModifierNumber;
    }
  | {
      readonly kind: 'targetPoiseCompare';
      readonly target: 'enemy';
      readonly returnValueIfMissing: boolean;
      readonly operator: ComparisonOperator;
      readonly value: DamageModifierNumber;
    };

/** 伤害修正专用条件树；Buff 黑板只在持有该修正的实例内求值。 */
export type DamageModifierCondition =
  | DamageModifierExternalCondition
  | { readonly kind: 'sourceSkillCastMatch' }
  | {
      readonly kind: 'buffBlackboardCompare';
      readonly left: DamageModifierNumber;
      readonly operator: ComparisonOperator;
      readonly right: DamageModifierNumber;
    }
  | { readonly kind: 'not'; readonly condition: DamageModifierCondition }
  | { readonly kind: 'all'; readonly conditions: readonly DamageModifierCondition[] }
  | { readonly kind: 'any'; readonly conditions: readonly DamageModifierCondition[] };

/** 在指定阶段向倍率区间或即时属性写入修正的处理器定义。 */
export type DamageProcessorDefinition =
  | {
      readonly kind: 'multiplyValue';
      readonly timing: DamageProcessTiming;
      readonly targetHealthTypes: readonly DamageTargetHealthType[];
      readonly scale: number;
    }
  | {
      readonly kind: 'damageScale';
      readonly side: DamageScaleSide;
      readonly zone: DamageScaleZone;
      readonly addition: DamageModifierNumber;
    }
  | {
      readonly kind: 'instantAttribute';
      readonly targetSide: DamageModifierSide;
      readonly attribute: string;
      readonly values:
        | AttributeModifierValues
        | { readonly slot: AttributeModifierSlot; readonly value: DamageModifierNumber };
      readonly attributeTiming: AttributeModifierTiming;
    };

/** 一个 Buff 在伤害生命周期中注册的全部处理器。 */
export interface DamageModifierDefinition {
  readonly enabledSide: DamageModifierSide;
  readonly processors: readonly DamageProcessorDefinition[];
  readonly condition?: DamageModifierCondition;
}

export type HealModifierSide = 'healer' | 'receiver';

export type HealProcessTiming = DamageProcessTiming;

export type HealModifierNumber = number | { readonly blackboardKey: string };

export type HealModifierCondition =
  | {
      readonly kind: 'targetHealthCompare';
      readonly valueType: 'current' | 'ratio';
      readonly operator: ComparisonOperator;
      readonly value: HealModifierNumber;
    }
  | {
      readonly kind: 'buffBlackboardCompare';
      readonly left: HealModifierNumber;
      readonly operator: ComparisonOperator;
      readonly right: HealModifierNumber;
    }
  | {
      readonly kind: 'healTagsMatch';
      readonly match: 'hasAny' | 'hasAll';
      readonly tags: readonly GameplayTag[];
    };

export interface ModifyHealCalculationResultProcessorDefinition {
  readonly kind: 'modifyCalculationResult';
  readonly timing: 'afterCalculation';
  readonly baseMultiplier: HealModifierNumber;
  readonly multiplierCount: HealModifierNumber;
}

export interface ModifyHealingIncreaseProcessorDefinition {
  readonly kind: 'modifyHealingIncrease';
  readonly timing: 'beforeCalculation';
  readonly side: HealModifierSide;
  readonly addition: HealModifierNumber;
}

export interface HealModifierDefinition {
  readonly enabledSide: HealModifierSide;
  readonly condition?: HealModifierCondition;
  readonly processors: readonly (
    ModifyHealCalculationResultProcessorDefinition | ModifyHealingIncreaseProcessorDefinition
  )[];
}

export type PoiseModifierSide = DamageModifierSide;

export type PoiseProcessTiming = DamageProcessTiming;

export type PoiseModifierNumber = number | { readonly blackboardKey: string };

export type PoiseModifierCondition =
  | { readonly kind: 'casterControlled' }
  | {
      readonly kind: 'eventDamageTagsMatch';
      readonly match: 'hasAny' | 'hasAll';
      readonly tags: readonly DamageTag[];
    }
  | { readonly kind: 'all'; readonly conditions: readonly PoiseModifierCondition[] };

export interface ModifyPoiseScalarProcessorDefinition {
  readonly kind: 'modifyPoiseScalar';
  readonly timing: 'beforeCalculation';
  readonly side: PoiseModifierSide;
  readonly addition: PoiseModifierNumber;
}

export interface PoiseModifierDefinition {
  readonly enabledSide: PoiseModifierSide;
  readonly condition?: PoiseModifierCondition;
  readonly processors: readonly ModifyPoiseScalarProcessorDefinition[];
}
