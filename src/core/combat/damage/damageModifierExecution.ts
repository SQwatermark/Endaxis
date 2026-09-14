/** 伤害修正的条件与处理器算法；所有本次输入由调用方传入，不保留伤害上下文。 */
import type {
  DamageModifierCondition,
  DamageModifierDefinition,
  DamageModifierNumber,
  DamageProcessorDefinition,
} from '../../../../packages/game-data-contract/src/modifiers.ts';
import { compareCombatNumbers } from '../../../shared/combatNumericComparison';
import { attributeModifierValues } from '../attributes/combatAttributes';
import type {
  DamageModifierSide,
  DamageProcessTiming,
  PlayerDamageContext,
} from './playerDamageContext';
import type {
  DamageModifierConditionEvaluator,
  DamageModifierConditionProgram,
} from './damageModifiers';

export function applyDamageModifier(
  ownerId: string,
  sourceSkillCastId: number | null,
  definition: DamageModifierDefinition,
  resolveNumber: (value: DamageModifierNumber) => number,
  conditionProgram: DamageModifierConditionProgram | undefined,
  timing: DamageProcessTiming,
  side: DamageModifierSide,
  context: PlayerDamageContext,
  evaluateCondition?: DamageModifierConditionEvaluator,
): void {
  if (side !== definition.enabledSide || context.getEntityId(side) !== ownerId) {
    return;
  }
  if (
    conditionProgram !== undefined &&
    !conditionProgram.execute({
      side,
      sourceId: context.sourceId,
      targetId: context.targetId,
      skillCastId: context.skillCastId,
      damageType: context.damageType,
      tags: context.tags,
      gameplayTags: context.gameplayTags,
      features: context.features,
    })
  )
    return;
  if (definition.condition !== undefined) {
    if (evaluateCondition === undefined) {
      throw new Error('conditional damage modifier requires a condition evaluator');
    }
    if (
      !evaluateDamageCondition(
        definition.condition,
        evaluateCondition,
        context,
        sourceSkillCastId,
        resolveNumber,
      )
    )
      return;
  }
  for (const processor of definition.processors) {
    applyProcessor(processor, timing, context, resolveNumber);
  }
}

function evaluateDamageCondition(
  condition: DamageModifierCondition,
  evaluateExternal: DamageModifierConditionEvaluator,
  context: PlayerDamageContext,
  sourceSkillCastId: number | null,
  resolveNumber: (value: DamageModifierNumber) => number,
): boolean {
  switch (condition.kind) {
    case 'sourceSkillCastMatch':
      return (
        sourceSkillCastId !== null &&
        sourceSkillCastId > 0 &&
        context.skillCastId === sourceSkillCastId
      );
    case 'buffBlackboardCompare':
      return compareCombatNumbers(
        resolveNumber(condition.left),
        resolveNumber(condition.right),
        condition.operator,
      );
    case 'not':
      return !evaluateDamageCondition(
        condition.condition,
        evaluateExternal,
        context,
        sourceSkillCastId,
        resolveNumber,
      );
    case 'all':
      return condition.conditions.every(child =>
        evaluateDamageCondition(child, evaluateExternal, context, sourceSkillCastId, resolveNumber),
      );
    case 'any':
      return condition.conditions.some(child =>
        evaluateDamageCondition(child, evaluateExternal, context, sourceSkillCastId, resolveNumber),
      );
    default:
      return evaluateExternal(condition, resolveNumber);
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
        const values =
          'slot' in processor.values
            ? attributeModifierValues(processor.values.slot, resolveNumber(processor.values.value))
            : processor.values;
        context.addInstantAttributeModifier(processor.targetSide, {
          attribute: processor.attribute,
          values,
          timing: processor.attributeTiming,
        });
      }
  }
}
