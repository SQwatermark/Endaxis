/**
 * 求值依赖实体生命账本的战斗条件，并把其他操作交给执行器链。
 * 调用方必须按目标身份提供同一场模拟中的 `CombatVitals`，不得用面板快照代替运行时生命。
 */
import type { CombatCondition } from '../../game-data/operatorDefinition';
import { resolveActionValueOperand } from './actionBlackboard';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { CombatVitals } from './combatVitals';
import { compareCombatNumbers } from './numericComparison';

export interface CombatVitalsConditionDependencies {
  readonly resolveTarget: (
    target: Extract<CombatCondition, { kind: 'healthCompare' }>['target'],
  ) => CombatVitals;
  readonly delegate: CombatOperationExecutor;
}

/** 只处理生命比较；失衡等其他实体条件由各自状态所有者负责。 */
export class CombatVitalsConditionExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: CombatVitalsConditionDependencies) {}

  execute(
    step: Parameters<CombatOperationExecutor['execute']>[0],
    context?: CombatOperationContext,
  ): boolean {
    return context === undefined
      ? this.dependencies.delegate.execute(step)
      : this.dependencies.delegate.execute(step, context);
  }

  end(
    step: Parameters<NonNullable<CombatOperationExecutor['end']>>[0],
    context?: CombatOperationContext,
  ): void {
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
    if (condition.kind !== 'healthCompare') {
      return context === undefined
        ? this.dependencies.delegate.evaluate(condition)
        : this.dependencies.delegate.evaluate(condition, context);
    }
    if (context === undefined) throw new Error('healthCompare requires a combat operation context');
    const vitals = this.dependencies.resolveTarget(condition.target);
    const current =
      condition.valueType === 'ratio' ? vitals.health / vitals.maxHealth : vitals.health;
    return compareCombatNumbers(
      current,
      resolveActionValueOperand(condition.value, context.blackboard),
      condition.operator,
    );
  }
}
