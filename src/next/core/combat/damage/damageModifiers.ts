/**
 * Buff 定义与伤害包各处理阶段之间的声明式协议。
 * 修正必须明确所属阶段、作用方和条件，不能直接回调或任意修改完整伤害上下文。
 */
import type { DamageScaleSide, DamageScaleZone } from './damageScale';
import type { CombatCondition } from '../../game-data/operatorDefinition';
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
export type DamageModifierConditionEvaluator = (condition: CombatCondition) => boolean;

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
  readonly condition?: CombatCondition;
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
      if (!evaluateCondition(this.definition.condition)) return;
    }
    for (const processor of this.definition.processors) {
      applyProcessor(processor, timing, context, this.resolveNumber);
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
