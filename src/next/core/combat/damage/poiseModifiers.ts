/**
 * Buff 对单次失衡包的声明式修正。
 * 该模型属于通用 Buff 运行时；武器、装备和干员只负责生成相同的定义。
 */
import type { DamageTag } from '../../game-data/operatorDefinition';

export type PoiseModifierSide = 'attacker' | 'defender';
export type PoiseProcessTiming = 'beforeCalculation' | 'afterCalculation';
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

/** 同一次失衡计算持有的可变倍率快照。 */
export class PoiseCalculationContext {
  constructor(
    readonly attackerId: string,
    readonly defenderId: string,
    readonly tags: readonly DamageTag[],
    readonly isAttackerControlled: boolean,
    public outputMultiplier: number,
    public takenMultiplier: number,
  ) {}

  getEntityId(side: PoiseModifierSide): string {
    return side === 'attacker' ? this.attackerId : this.defenderId;
  }
}

/** 由一个已启用 Buff 实例持有的失衡修正器。 */
export class PoiseModifier {
  constructor(
    readonly ownerId: string,
    readonly definition: PoiseModifierDefinition,
    readonly resolveNumber: (value: PoiseModifierNumber) => number,
  ) {}

  apply(
    timing: PoiseProcessTiming,
    side: PoiseModifierSide,
    context: PoiseCalculationContext,
  ): void {
    if (side !== this.definition.enabledSide || context.getEntityId(side) !== this.ownerId) return;
    if (
      this.definition.condition !== undefined &&
      !evaluateCondition(this.definition.condition, context)
    ) {
      return;
    }
    for (const processor of this.definition.processors) {
      if (processor.timing !== timing) continue;
      const addition = this.resolveNumber(processor.addition);
      if (processor.side === 'attacker') context.outputMultiplier += addition;
      else context.takenMultiplier += addition;
    }
  }
}

function evaluateCondition(
  condition: PoiseModifierCondition,
  context: PoiseCalculationContext,
): boolean {
  if (condition.kind === 'casterControlled') return context.isAttackerControlled;
  if (condition.kind === 'all') {
    return condition.conditions.every(child => evaluateCondition(child, context));
  }
  const actual = new Set(context.tags);
  return condition.match === 'hasAny'
    ? condition.tags.some(tag => actual.has(tag))
    : condition.tags.every(tag => actual.has(tag));
}
