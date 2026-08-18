/**
 * 处理依赖当前技能动作黑板的条件，并把其余操作继续交给运行时执行器链。
 * 该执行器必须位于技能运行时内部，因为动作黑板不能跨技能实例共享。
 */
import type {
  ActionValueCalculationOperation,
  ActionValueOperation,
  CombatCondition,
} from '../../game-data/operatorDefinition';
import { resolveActionValueOperand } from './actionBlackboard';
import { compareCombatNumbers } from './numericComparison';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

export class ActionBlackboardOperationExecutor implements CombatOperationExecutor {
  constructor(readonly delegate: CombatOperationExecutor) {}

  execute(
    step: Parameters<CombatOperationExecutor['execute']>[0],
    context?: CombatOperationContext,
  ): boolean {
    if (step.kind === 'storeCurrentTimelineFrame') {
      if (context?.getCurrentTimelineFrame === undefined) {
        throw new Error('storeCurrentTimelineFrame requires a timeline host');
      }
      context.blackboard.assignDynamic(
        step.parameters.outputKey,
        context.getCurrentTimelineFrame(),
      );
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
