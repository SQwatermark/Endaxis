// 纯数据契约由独立包唯一声明；此路径保留兼容导出。
export {
  type HealModifierSide,
  type HealProcessTiming,
  type HealModifierNumber,
  type HealModifierCondition,
  type ModifyHealCalculationResultProcessorDefinition,
  type ModifyHealingIncreaseProcessorDefinition,
  type HealModifierDefinition,
} from '../../../../../packages/game-data-contract/src/modifiers.ts';
import {
  type HealModifierCondition,
  type HealModifierDefinition,
  type HealModifierNumber,
  type HealModifierSide,
  type HealProcessTiming,
} from '../../../../../packages/game-data-contract/src/modifiers.ts';
import { compareCombatNumbers } from '../runtime/numericComparison';
import type { CombatVitals } from '../runtime/combatVitals';

export class HealCalculationContext {
  constructor(
    readonly healerId: string,
    readonly receiverId: string,
    readonly receiverVitals: CombatVitals,
    public value: number,
    readonly tagIds: readonly number[] = [],
    public healerOutputIncrease = 0,
    public receiverTakenIncrease = 0,
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
      if (processor.kind === 'modifyCalculationResult') {
        context.value *=
          1 +
          this.resolveNumber(processor.baseMultiplier) *
            this.resolveNumber(processor.multiplierCount);
      } else if (processor.side === 'healer') {
        context.healerOutputIncrease += this.resolveNumber(processor.addition);
      } else {
        context.receiverTakenIncrease += this.resolveNumber(processor.addition);
      }
    }
  }

  #evaluate(condition: HealModifierCondition, context: HealCalculationContext): boolean {
    if (condition.kind === 'healTagsMatch') {
      const actual = new Set(context.tagIds);
      return condition.match === 'hasAny'
        ? condition.tagIds.some(tagId => actual.has(tagId))
        : condition.tagIds.every(tagId => actual.has(tagId));
    }
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
