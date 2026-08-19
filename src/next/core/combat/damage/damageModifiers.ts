/**
 * Buff 定义与伤害包各处理阶段之间的声明式协议。
 * 修正必须明确所属阶段、作用方和条件，不能直接回调或任意修改完整伤害上下文。
 */
import type { DamageScaleSide, DamageScaleZone } from './damageScale';
import type {
  ComparisonOperator,
  CombatTarget,
  DamageFeature,
  DamageTag,
} from '../../game-data/operatorDefinition';
import { compareCombatNumbers } from '../runtime/numericComparison';
import type {
  AttributeModifierTiming,
  AttributeModifierValues,
} from '../attributes/combatAttributes';
import type {
  DamageModifierSide,
  DamageProcessTiming,
  DamageTargetHealthType,
  PlayerDamageContext,
} from './playerDamageContext';

/** 伤害处理器中的动态数值可直接取常量，也可读取所属 Buff 实例的黑板。 */
export type DamageModifierNumber = number | { readonly blackboardKey: string };

/** 战斗装配层负责使用统一条件系统判断当前伤害修正是否成立。 */
export type DamageModifierExternalCondition =
  | {
      readonly kind: 'entityTagMatch';
      readonly target: CombatTarget;
      readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      readonly tagIds: readonly number[];
    }
  | { readonly kind: 'casterControlled' }
  | {
      readonly kind: 'eventDamageTagsMatch';
      readonly match: 'exact' | 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      readonly tags: readonly DamageTag[];
    }
  | {
      readonly kind: 'eventDamageFeaturesMatch';
      readonly match: 'exact' | 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      readonly features: readonly DamageFeature[];
    }
  | {
      readonly kind: 'targetHealthCompare';
      readonly target: 'enemy';
      readonly valueType: 'current' | 'ratio';
      readonly operator: ComparisonOperator;
      readonly value: DamageModifierNumber;
    };

/** 伤害修正专用条件树；Buff 黑板只在持有该修正的实例内求值。 */
export type DamageModifierCondition =
  | DamageModifierExternalCondition
  | {
      readonly kind: 'buffBlackboardCompare';
      readonly left: DamageModifierNumber;
      readonly operator: ComparisonOperator;
      readonly right: DamageModifierNumber;
    }
  | { readonly kind: 'not'; readonly condition: DamageModifierCondition }
  | { readonly kind: 'all'; readonly conditions: readonly DamageModifierCondition[] }
  | { readonly kind: 'any'; readonly conditions: readonly DamageModifierCondition[] };

/** 战斗装配层只判断依赖场景或当前伤害包的叶子条件。 */
export type DamageModifierConditionEvaluator = (
  condition: DamageModifierExternalCondition,
  resolveNumber: (value: DamageModifierNumber) => number,
) => boolean;

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
      readonly values: AttributeModifierValues;
      readonly attributeTiming: AttributeModifierTiming;
    };

/** 一个 Buff 在伤害生命周期中注册的全部处理器。 */
export interface DamageModifierDefinition {
  readonly enabledSide: DamageModifierSide;
  readonly processors: readonly DamageProcessorDefinition[];
  readonly condition?: DamageModifierCondition;
}

/** 由一个已启用 Buff 实例持有的运行时修正。 */
export class DamageModifier {
  constructor(
    readonly ownerId: string,
    readonly definition: DamageModifierDefinition,
    readonly resolveNumber: (value: DamageModifierNumber) => number = value => {
      if (typeof value === 'number') return value;
      throw new Error(
        `damage modifier blackboard value '${value.blackboardKey}' cannot be resolved`,
      );
    },
  ) {}

  apply(
    timing: DamageProcessTiming,
    side: DamageModifierSide,
    context: PlayerDamageContext,
    evaluateCondition?: DamageModifierConditionEvaluator,
  ): void {
    if (side !== this.definition.enabledSide || context.getEntityId(side) !== this.ownerId) {
      return;
    }
    if (this.definition.condition !== undefined) {
      if (evaluateCondition === undefined) {
        throw new Error('conditional damage modifier requires a condition evaluator');
      }
      if (!this.#evaluateCondition(this.definition.condition, evaluateCondition)) return;
    }
    for (const processor of this.definition.processors) {
      applyProcessor(processor, timing, context, this.resolveNumber);
    }
  }

  #evaluateCondition(
    condition: DamageModifierCondition,
    evaluateExternal: DamageModifierConditionEvaluator,
  ): boolean {
    switch (condition.kind) {
      case 'buffBlackboardCompare':
        return compareCombatNumbers(
          this.resolveNumber(condition.left),
          this.resolveNumber(condition.right),
          condition.operator,
        );
      case 'not':
        return !this.#evaluateCondition(condition.condition, evaluateExternal);
      case 'all':
        return condition.conditions.every(child =>
          this.#evaluateCondition(child, evaluateExternal),
        );
      case 'any':
        return condition.conditions.some(child => this.#evaluateCondition(child, evaluateExternal));
      default:
        return evaluateExternal(condition, this.resolveNumber);
    }
  }
}

function applyProcessor(
  processor: DamageProcessorDefinition,
  timing: DamageProcessTiming,
  context: PlayerDamageContext,
  resolveNumber: (value: DamageModifierNumber) => number,
): void {
  if (context.damageType === 'lifeDrain') return;
  switch (processor.kind) {
    case 'multiplyValue':
      if (
        timing === processor.timing &&
        processor.targetHealthTypes.includes(context.targetHealthType)
      ) {
        context.multiplyCalculationValue(processor.scale);
      }
      return;
    case 'damageScale':
      if (timing === 'afterCalculation' && context.targetHealthType === 'normal') {
        context.damageScales.modify(
          processor.side,
          processor.zone,
          resolveNumber(processor.addition),
        );
      }
      return;
    case 'instantAttribute':
      if (timing === 'beforeCalculation' && context.targetHealthType === 'normal') {
        context.addInstantAttributeModifier(processor.targetSide, {
          attribute: processor.attribute,
          values: processor.values,
          timing: processor.attributeTiming,
        });
      }
  }
}
