// 纯数据契约由独立包唯一声明；此路径保留兼容导出。
export {
  type DamageModifierNumber,
  type DamageModifierExternalCondition,
  type DamageModifierCondition,
  type DamageProcessorDefinition,
  type DamageModifierDefinition,
} from '../../../../../packages/game-data-contract/src/modifiers.ts';
import {
  type DamageModifierCondition,
  type DamageModifierDefinition,
  type DamageModifierExternalCondition,
  type DamageModifierNumber,
  type DamageProcessorDefinition,
} from '../../../../../packages/game-data-contract/src/modifiers.ts';
/**
 * Buff 定义与伤害包各处理阶段之间的声明式协议。
 * 修正必须明确所属阶段、作用方和条件；可保存定义不接受回调，已编译程序也只获得只读伤害视图。
 */
import { compareCombatNumbers } from '../runtime/numericComparison';
import { attributeModifierValues } from '../attributes/combatAttributes';
import type {
  DamageModifierSide,
  DamageProcessTiming,
  PlayerDamageContext,
} from './playerDamageContext';

/** 战斗装配层只判断依赖场景或当前伤害包的叶子条件。 */
export type DamageModifierConditionEvaluator = (
  condition: DamageModifierExternalCondition,
  resolveNumber: (value: DamageModifierNumber) => number,
) => boolean;

/** 同步条件只能读取本次伤害身份；不能持有或任意修改可变 DamageContext。 */
export interface DamageModifierConditionInput {
  readonly side: DamageModifierSide;
  readonly sourceId: string;
  readonly targetId: string;
  readonly skillCastId: number | null;
  readonly damageType: PlayerDamageContext['damageType'];
  readonly tags: PlayerDamageContext['tags'];
  readonly gameplayTags?: PlayerDamageContext['gameplayTags'];
  readonly features: PlayerDamageContext['features'];
}

/** 已编译动作程序的运行端口，不属于可保存的游戏数据协议。 */
export interface DamageModifierConditionProgram {
  execute(input: DamageModifierConditionInput): boolean;
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
    readonly sourceSkillCastId: number | null = null,
    readonly conditionProgram?: DamageModifierConditionProgram,
  ) {
    if (definition.condition !== undefined && conditionProgram !== undefined) {
      throw new Error('damage modifier cannot combine a pure condition with a condition program');
    }
  }

  apply(
    timing: DamageProcessTiming,
    side: DamageModifierSide,
    context: PlayerDamageContext,
    evaluateCondition?: DamageModifierConditionEvaluator,
  ): void {
    if (side !== this.definition.enabledSide || context.getEntityId(side) !== this.ownerId) {
      return;
    }
    if (
      this.conditionProgram !== undefined &&
      !this.conditionProgram.execute({
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
    if (this.definition.condition !== undefined) {
      if (evaluateCondition === undefined) {
        throw new Error('conditional damage modifier requires a condition evaluator');
      }
      if (!this.#evaluateCondition(this.definition.condition, evaluateCondition, context)) return;
    }
    for (const processor of this.definition.processors) {
      applyProcessor(processor, timing, context, this.resolveNumber);
    }
  }

  #evaluateCondition(
    condition: DamageModifierCondition,
    evaluateExternal: DamageModifierConditionEvaluator,
    context: PlayerDamageContext,
  ): boolean {
    switch (condition.kind) {
      case 'sourceSkillCastMatch':
        return (
          this.sourceSkillCastId !== null &&
          this.sourceSkillCastId > 0 &&
          context.skillCastId === this.sourceSkillCastId
        );
      case 'buffBlackboardCompare':
        return compareCombatNumbers(
          this.resolveNumber(condition.left),
          this.resolveNumber(condition.right),
          condition.operator,
        );
      case 'not':
        return !this.#evaluateCondition(condition.condition, evaluateExternal, context);
      case 'all':
        return condition.conditions.every(child =>
          this.#evaluateCondition(child, evaluateExternal, context),
        );
      case 'any':
        return condition.conditions.some(child =>
          this.#evaluateCondition(child, evaluateExternal, context),
        );
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
