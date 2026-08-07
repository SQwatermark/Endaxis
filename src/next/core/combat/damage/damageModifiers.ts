/**
 * Buff 定义与伤害包各处理阶段之间的声明式协议。
 * 修正必须明确所属阶段、作用方和条件，不能直接回调或任意修改完整伤害上下文。
 */
import type { DamageScaleSide, DamageScaleZone } from './damageScale';
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

/** 判断一个伤害处理器是否适用于当前伤害包的声明式条件。 */
export type DamageModifierCondition = (
  context: PlayerDamageContext,
  oppositeEntityId: string,
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
      readonly addition: number;
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
  ) {}

  apply(timing: DamageProcessTiming, side: DamageModifierSide, context: PlayerDamageContext): void {
    if (side !== this.definition.enabledSide || context.getEntityId(side) !== this.ownerId) {
      return;
    }
    const oppositeSide = side === 'attacker' ? 'defender' : 'attacker';
    if (
      this.definition.condition !== undefined &&
      !this.definition.condition(context, context.getEntityId(oppositeSide))
    ) {
      return;
    }
    for (const processor of this.definition.processors) {
      applyProcessor(processor, timing, context);
    }
  }
}

function applyProcessor(
  processor: DamageProcessorDefinition,
  timing: DamageProcessTiming,
  context: PlayerDamageContext,
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
        context.damageScales.modify(processor.side, processor.zone, processor.addition);
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
