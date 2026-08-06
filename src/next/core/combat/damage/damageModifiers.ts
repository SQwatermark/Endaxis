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

export type DamageModifierCondition = (
  context: PlayerDamageContext,
  oppositeEntityId: string,
) => boolean;

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

export interface DamageModifierDefinition {
  readonly enabledSide: DamageModifierSide;
  readonly processors: readonly DamageProcessorDefinition[];
  readonly condition?: DamageModifierCondition;
}

/** Runtime modifier owned by one enabled Buff instance. */
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
