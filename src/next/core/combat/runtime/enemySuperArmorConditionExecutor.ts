import type { CombatCondition } from '../../game-data/operatorDefinition';
import { resolveActionValueOperand } from './actionBlackboard';
import { compareCombatNumbers } from './numericComparison';
import type { CombatOperationExecutor } from './skillRuntime';

/** 对运行时捕获的单敌人超级护甲值执行原生浮点容差比较。 */
export class EnemySuperArmorConditionExecutor implements CombatOperationExecutor {
  constructor(
    private readonly superArmor: number,
    private readonly delegate: CombatOperationExecutor,
  ) {}

  execute: CombatOperationExecutor['execute'] = (step, context) =>
    this.delegate.execute(step, context);

  end: NonNullable<CombatOperationExecutor['end']> = (step, context) =>
    this.delegate.end?.(step, context);

  evaluate(
    condition: CombatCondition,
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    if (condition.kind !== 'enemySuperArmorCompare') {
      return this.delegate.evaluate(condition, context);
    }
    if (context === undefined) {
      throw new Error('enemySuperArmorCompare requires a combat operation context');
    }
    return compareCombatNumbers(
      this.superArmor,
      resolveActionValueOperand(condition.value, context.blackboard),
      condition.operator,
    );
  }
}
