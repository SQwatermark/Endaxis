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
    target: Extract<
      CombatCondition,
      { kind: 'healthCompare' | 'poiseCompare' | 'targetStaggered' }
    >['target'],
    buffSourceId?: string,
  ) => CombatVitals;
  /** Context 查询保存的是干员实例身份；条件不得重新运行选择器。 */
  readonly resolveContextTarget?: (operatorId: string) => CombatVitals;
  readonly delegate: CombatOperationExecutor;
}

/** 处理由同一实体生命账本持有的生命与失衡比较。 */
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
    if (
      condition.kind !== 'healthCompare' &&
      condition.kind !== 'poiseCompare' &&
      condition.kind !== 'targetStaggered'
    ) {
      return context === undefined
        ? this.dependencies.delegate.evaluate(condition)
        : this.dependencies.delegate.evaluate(condition, context);
    }
    if (context === undefined)
      throw new Error(`${condition.kind} requires a combat operation context`);
    const vitals =
      condition.kind === 'healthCompare' && condition.target === 'contextTarget'
        ? this.#resolveContextTarget(condition.contextKey, context)
        : condition.kind === 'healthCompare' && condition.target === 'currentTarget'
          ? this.#resolveCurrentTarget(context)
          : this.dependencies.resolveTarget(condition.target, context.buffSourceId);
    if (condition.kind === 'targetStaggered') return vitals.hasPoiseBrokenTag;
    if (condition.kind === 'poiseCompare') {
      if (!vitals.hasPoise) return condition.returnValueIfMissing;
      return compareCombatNumbers(
        vitals.poise,
        resolveActionValueOperand(condition.value, context.blackboard),
        condition.operator,
      );
    }
    const current =
      condition.valueType === 'ratio' ? vitals.health / vitals.maxHealth : vitals.health;
    return compareCombatNumbers(
      current,
      resolveActionValueOperand(condition.value, context.blackboard),
      condition.operator,
    );
  }

  #resolveContextTarget(
    contextKey: string | undefined,
    context: CombatOperationContext,
  ): CombatVitals {
    if (context.targetContext === undefined || contextKey === undefined) {
      throw new Error("healthCompare target 'contextTarget' requires a combat target context key");
    }
    const targets = context.targetContext.get(contextKey);
    const target = targets[0];
    if (targets.length !== 1 || target?.kind !== 'operator') {
      throw new Error(`healthCompare context target '${contextKey}' must be one operator`);
    }
    const resolve = this.dependencies.resolveContextTarget;
    if (resolve === undefined) throw new Error('context health target resolver is not configured');
    return resolve(target.operatorId);
  }

  #resolveCurrentTarget(context: CombatOperationContext): CombatVitals {
    if (context.currentTarget?.kind !== 'operator') {
      throw new Error("healthCompare target 'currentTarget' requires one current operator");
    }
    const resolve = this.dependencies.resolveContextTarget;
    if (resolve === undefined) throw new Error('current health target resolver is not configured');
    return resolve(context.currentTarget.operatorId);
  }
}
