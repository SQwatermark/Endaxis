/**
 * 处理依赖当前技能动作黑板的条件，并把其余操作继续交给运行时执行器链。
 * 该执行器必须位于技能运行时内部，因为动作黑板不能跨技能实例共享。
 */
import type { ActionValueOperand, CombatCondition } from '../../game-data/operatorDefinition';
import { compareCombatNumbers } from './numericComparison';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

export class ActionBlackboardOperationExecutor implements CombatOperationExecutor {
  constructor(readonly delegate: CombatOperationExecutor) {}

  execute(
    step: Parameters<CombatOperationExecutor['execute']>[0],
    context?: CombatOperationContext,
  ): boolean {
    return context === undefined
      ? this.delegate.execute(step)
      : this.delegate.execute(step, context);
  }

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
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
        resolveOperand(condition.left, context),
        resolveOperand(condition.right, context),
        condition.operator,
      );
    }
    return context === undefined
      ? this.delegate.evaluate(condition)
      : this.delegate.evaluate(condition, context);
  }
}

function resolveOperand(operand: ActionValueOperand, context: CombatOperationContext): number {
  if (operand.kind === 'constant') return operand.value;
  const value = context.blackboard.getNumber(operand.key);
  if (value === undefined) {
    throw new Error(`action blackboard value '${operand.key}' is missing`);
  }
  return value;
}
