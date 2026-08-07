/**
 * 执行原生动作序列中的黑板算术，并把其他步骤转交给后续执行器。
 * 本层只处理已由编译器展开等级值的数值运算；缺失输入键属于数据闭环错误，不提供默认值。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { ActionBlackboard } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' }>;
type BlackboardOperand = { value: number } | { blackboardKey: string };

export class ActionBlackboardOperationExecutor implements CombatOperationExecutor {
  constructor(readonly delegate: CombatOperationExecutor) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind !== 'calculateBlackboard' && step.kind !== 'modifyBlackboard') {
      return context === undefined
        ? this.delegate.execute(step)
        : this.delegate.execute(step, context);
    }
    if (context === undefined) {
      throw new Error(`${step.kind} requires a combat operation context`);
    }

    const blackboard = context.blackboard;
    if (step.kind === 'calculateBlackboard') {
      const left = resolveOperand(blackboard, step.parameters.left);
      const right = resolveOperand(blackboard, step.parameters.right);
      blackboard.assignDynamic(
        step.parameters.outputKey,
        calculate(step.parameters.operation, left, right),
      );
      return true;
    }

    const value = resolveOperand(blackboard, step.parameters.value);
    const current = blackboard.getNumber(step.parameters.key);
    if (step.parameters.operation !== 'assign' && current === undefined) {
      throw new Error(`action blackboard key '${step.parameters.key}' is not numeric`);
    }
    const next =
      step.parameters.operation === 'assign'
        ? value
        : calculate(step.parameters.operation, current!, value);
    blackboard.assignDynamic(step.parameters.key, next);
    return true;
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.delegate.evaluate(condition)
      : this.delegate.evaluate(condition, context);
  }
}

function resolveOperand(blackboard: ActionBlackboard, operand: BlackboardOperand): number {
  if ('value' in operand) return operand.value;
  const value = blackboard.getNumber(operand.blackboardKey);
  if (value === undefined) {
    throw new Error(`action blackboard key '${operand.blackboardKey}' is not numeric`);
  }
  return value;
}

function calculate(operation: 'add' | 'multiply' | 'divide', left: number, right: number): number {
  switch (operation) {
    case 'add':
      return left + right;
    case 'multiply':
      return left * right;
    case 'divide':
      return left / right;
  }
}
