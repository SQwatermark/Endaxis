import type { ComparisonOperator } from '../../game-data/operatorDefinition';
import { compareCombatNumbers } from '../runtime/numericComparison';
import type { CombatVitals } from '../runtime/combatVitals';

export type HealModifierSide = 'healer' | 'receiver';
export type HealProcessTiming = 'afterCalculation' | 'beforeCalculation';
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
    };

export interface ModifyHealCalculationResultProcessorDefinition {
  readonly kind: 'modifyCalculationResult';
  readonly timing: 'afterCalculation';
  readonly baseMultiplier: HealModifierNumber;
  readonly multiplierCount: HealModifierNumber;
}

export interface HealModifierDefinition {
  readonly enabledSide: HealModifierSide;
  readonly condition?: HealModifierCondition;
  readonly processors: readonly ModifyHealCalculationResultProcessorDefinition[];
}

export class HealCalculationContext {
  constructor(
    readonly healerId: string,
    readonly receiverId: string,
    readonly receiverVitals: CombatVitals,
    public value: number,
  ) {}

  getEntityId(side: HealModifierSide): string {
    return side === 'healer' ? this.healerId : this.receiverId;
  }
}

export class HealModifier {
  constructor(
    readonly ownerId: string,
    readonly definition: HealModifierDefinition,
    readonly resolveNumber: (value: HealModifierNumber) => number,
  ) {}

  apply(timing: HealProcessTiming, side: HealModifierSide, context: HealCalculationContext): void {
    if (side !== this.definition.enabledSide || context.getEntityId(side) !== this.ownerId) return;
    if (
      this.definition.condition !== undefined &&
      !this.#evaluate(this.definition.condition, context)
    ) {
      return;
    }
    for (const processor of this.definition.processors) {
      if (processor.timing !== timing) continue;
      context.value *=
        1 +
        this.resolveNumber(processor.baseMultiplier) *
          this.resolveNumber(processor.multiplierCount);
    }
  }

  #evaluate(condition: HealModifierCondition, context: HealCalculationContext): boolean {
    if (condition.kind === 'buffBlackboardCompare') {
      return compareCombatNumbers(
        this.resolveNumber(condition.left),
        this.resolveNumber(condition.right),
        condition.operator,
      );
    }
    const actual =
      condition.valueType === 'current'
        ? context.receiverVitals.health
        : context.receiverVitals.health / context.receiverVitals.maxHealth;
    return compareCombatNumbers(actual, this.resolveNumber(condition.value), condition.operator);
  }
}
