/**
 * 处理依赖当前技能动作黑板的条件，并把其余操作继续交给运行时执行器链。
 * 该执行器必须位于技能运行时内部，因为动作黑板不能跨技能实例共享。
 */
import type {
  ActionValueCalculationOperation,
  ActionValueOperation,
  CombatCondition,
  OperatorAttribute,
} from '../../game-data/operatorDefinition';
import { resolveActionValueOperand } from './actionBlackboard';
import { compareCombatNumbers } from './numericComparison';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { ProbabilitySampleSource } from '../random/probabilitySampleSource';

const PROBABILITY_TOLERANCE = 0.00001;

export class ActionBlackboardOperationExecutor implements CombatOperationExecutor {
  constructor(
    readonly delegate: CombatOperationExecutor,
    readonly probabilitySamples?: ProbabilitySampleSource,
    readonly sourceAttributes?: {
      readonly sourceId: string;
      readonly read: (
        sourceId: string,
        request: Extract<
          Parameters<CombatOperationExecutor['execute']>[0],
          { kind: 'storeSourceAttributeValue' }
        >['parameters'],
      ) => number;
    },
    /** Buff 内的 StoreCurSkillExecuteFrame 从 Owner AbilitySystem 读取当前技能，而非 Buff 时间。 */
    readonly resolveOwnerCurrentSkillTimelineFrame?: (ownerId: string) => number | undefined,
    /** 原生 Deck 快照来自构筑完成时的静态四维，不随战斗内 Modifier 改变。 */
    readonly sourceDeckAttributes?: Readonly<Record<OperatorAttribute, number>>,
  ) {}

  execute(
    step: Parameters<CombatOperationExecutor['execute']>[0],
    context?: CombatOperationContext,
  ): boolean {
    if (step.kind === 'storeCurrentTimelineFrame') {
      const hostFrame = context?.getCurrentTimelineFrame?.();
      const ownerFrame =
        hostFrame === undefined && context?.buffOwnerId !== undefined
          ? this.resolveOwnerCurrentSkillTimelineFrame?.(context.buffOwnerId)
          : undefined;
      const frame = hostFrame ?? ownerFrame;
      if (frame === undefined) {
        if (
          context?.buffOwnerId !== undefined &&
          this.resolveOwnerCurrentSkillTimelineFrame !== undefined
        ) {
          return false;
        }
        throw new Error('storeCurrentTimelineFrame requires a timeline host');
      }
      context!.blackboard.assignDynamic(step.parameters.outputKey, frame);
      return true;
    }
    if (step.kind === 'storeEventSpGainAmount') {
      if (context?.event?.kind !== 'spGained') {
        throw new Error('storeEventSpGainAmount requires an spGained event context');
      }
      context.blackboard.assignDynamic(step.parameters.outputKey, context.event.amount);
      return true;
    }
    if (step.kind === 'modifyActionValue') {
      if (context === undefined) {
        throw new Error('modifyActionValue requires a combat operation context');
      }
      const operand = Math.fround(
        resolveActionValueOperand(step.parameters.value, context.blackboard),
      );
      const oldValue = Math.fround(context.blackboard.getNumber(step.parameters.key) ?? 0);
      context.blackboard.assignDynamic(
        step.parameters.key,
        evaluateActionValueOperation(step.parameters.operation, oldValue, operand),
      );
      context.refreshCurrentBuffAttributeModifiers?.();
      return true;
    }
    if (step.kind === 'calculateActionValue') {
      if (context === undefined) {
        throw new Error('calculateActionValue requires a combat operation context');
      }
      const left = Math.fround(resolveActionValueOperand(step.parameters.left, context.blackboard));
      const right = Math.fround(
        resolveActionValueOperand(step.parameters.right, context.blackboard),
      );
      context.blackboard.assignDynamic(
        step.parameters.key,
        evaluateActionValueCalculation(step.parameters.operation, left, right),
      );
      context.refreshCurrentBuffAttributeModifiers?.();
      return true;
    }
    if (step.kind === 'storeSourceAttributeValue') {
      if (context === undefined) {
        throw new Error('storeSourceAttributeValue requires a combat operation context');
      }
      if (this.sourceAttributes === undefined) {
        throw new Error('storeSourceAttributeValue requires a source attribute reader');
      }
      const sourceId = context.buffSourceId ?? this.sourceAttributes.sourceId;
      const attributeValue = this.sourceAttributes.read(sourceId, step.parameters);
      const scaledAttribute = step.parameters.useFloor
        ? Math.floor(
            attributeValue / resolveActionValueOperand(step.parameters.divisor, context.blackboard),
          )
        : attributeValue;
      const result =
        resolveActionValueOperand(step.parameters.base, context.blackboard) +
        scaledAttribute * resolveActionValueOperand(step.parameters.multiplier, context.blackboard);
      context.blackboard.assignDynamic(step.parameters.targetKey, result);
      context.refreshCurrentBuffAttributeModifiers?.();
      return true;
    }
    if (step.kind === 'readSkillSettingData') {
      if (context === undefined) {
        throw new Error('readSkillSettingData requires a combat operation context');
      }
      for (const item of step.parameters.items) {
        const column = roundToEven(resolveActionValueOperand(item.column, context.blackboard)) - 1;
        if (column < 0 || column >= item.values.length) continue;
        let value = item.values[column]!;
        if (item.enhance !== undefined) {
          if (this.sourceAttributes === undefined) {
            throw new Error('enhanced readSkillSettingData requires a source attribute reader');
          }
          const sourceId =
            item.enhance.target === 'caster'
              ? this.sourceAttributes.sourceId
              : item.enhance.target === 'buffOwner'
                ? context.buffOwnerId
                : context.buffSourceId;
          if (sourceId === undefined) {
            throw new Error(
              `readSkillSettingData target '${item.enhance.target}' requires a Buff context`,
            );
          }
          const enhance = this.sourceAttributes.read(sourceId, {
            attribute: { kind: 'specific', key: 'PhysicalAndSpellInflictionEnhance' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'constant', value: 1 },
            base: { kind: 'constant', value: 0 },
            targetKey: item.storeKey,
          });
          const formula = item.enhance.formula;
          value *=
            formula.kind === 'linear'
              ? 1 + formula.paramA * enhance
              : 1 + (formula.paramA * enhance) / (formula.paramB + enhance);
        }
        context.blackboard.assignDynamic(item.storeKey, value);
        context.refreshCurrentBuffAttributeModifiers?.();
      }
      return true;
    }
    return context === undefined
      ? this.delegate.execute(step)
      : this.delegate.execute(step, context);
  }

  end(
    step: Parameters<NonNullable<CombatOperationExecutor['end']>>[0],
    context?: CombatOperationContext,
  ): void {
    this.delegate.end?.(step, context);
  }

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
    if (condition.kind === 'combatActive') return true;
    if (condition.kind === 'singleEnemyPresent') return true;
    if (condition.kind === 'buffSourceMatchesOwner') {
      if (context?.buffSourceId === undefined || context.buffOwnerId === undefined) {
        throw new Error('buffSourceMatchesOwner requires Buff source and owner identities');
      }
      return context.buffSourceId === context.buffOwnerId;
    }
    if (condition.kind === 'not') return !this.evaluate(condition.condition, context);
    if (condition.kind === 'all') {
      return condition.conditions.every(child => this.evaluate(child, context));
    }
    if (condition.kind === 'any') {
      return condition.conditions.some(child => this.evaluate(child, context));
    }
    if (condition.kind === 'actionValueCompare') {
      if (context === undefined) {
        throw new Error('actionValueCompare requires a combat operation context');
      }
      return compareCombatNumbers(
        resolveActionValueOperand(condition.left, context.blackboard),
        resolveActionValueOperand(condition.right, context.blackboard),
        condition.operator,
      );
    }
    if (condition.kind === 'deckAttributeCompare') {
      if (this.sourceDeckAttributes === undefined) {
        throw new Error('deckAttributeCompare requires source Deck attributes');
      }
      return compareCombatNumbers(
        Math.fround(this.sourceDeckAttributes[condition.left]),
        Math.fround(this.sourceDeckAttributes[condition.right]),
        condition.operator,
      );
    }
    if (condition.kind === 'probability') {
      if (context === undefined) {
        throw new Error('probability requires a combat operation context');
      }
      const probability = Math.fround(
        resolveActionValueOperand(condition.probability, context.blackboard),
      );
      if (!(probability > PROBABILITY_TOLERANCE)) return false;
      if (this.probabilitySamples === undefined) {
        throw new Error('probability requires an explicit probability sample source');
      }
      const sample = this.probabilitySamples.nextProbabilitySample();
      if (!Number.isFinite(sample) || sample < 0 || sample > 1) {
        throw new RangeError('probability sample must be a finite value in [0, 1]');
      }
      return Math.fround(probability + PROBABILITY_TOLERANCE) >= sample;
    }
    return context === undefined
      ? this.delegate.evaluate(condition)
      : this.delegate.evaluate(condition, context);
  }
}

function evaluateActionValueCalculation(
  operation: ActionValueCalculationOperation,
  left: number,
  right: number,
): number {
  switch (operation) {
    case 'add':
      return Math.fround(left + right);
    case 'multiply':
      return Math.fround(left * right);
    case 'divide':
      return Math.fround(left / right);
  }
}

const ACTION_VALUE_EPSILON = 0.00001;
const INT32_MIN = -2147483648;
const INT32_MAX = 2147483647;

function evaluateActionValueOperation(
  operation: ActionValueOperation,
  oldValue: number,
  operand: number,
): number {
  switch (operation) {
    case 'assign':
      return operand;
    case 'add':
      return Math.fround(oldValue + operand);
    case 'multiply':
      return Math.fround(oldValue * operand);
    case 'divide':
      return Math.abs(operand) <= ACTION_VALUE_EPSILON ? 0 : Math.fround(oldValue / operand);
    case 'floor':
      return toUnityInt32(Math.floor(operand + ACTION_VALUE_EPSILON));
    case 'ceil':
      return toUnityInt32(Math.ceil(operand - ACTION_VALUE_EPSILON));
    case 'roundToInt':
      return toUnityInt32(roundToEven(operand));
  }
}

function roundToEven(value: number): number {
  const lower = Math.floor(value);
  const fraction = value - lower;
  if (fraction < 0.5) return lower;
  if (fraction > 0.5) return lower + 1;
  return lower % 2 === 0 ? lower : lower + 1;
}

function toUnityInt32(value: number): number {
  if (!Number.isFinite(value) || value < INT32_MIN || value > INT32_MAX) return INT32_MIN;
  return Math.trunc(value);
}
