/**
 * 执行定时标记的创建、条件查询与动作结束清理。
 * 目标到实体容器的映射由装配层提供；动态时长只读取当前技能实例黑板。
 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { CombatTarget } from '../../game-data/operatorDefinition';
import { resolveActionValueOperand } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';
import type { TimedMarkerContainer, TimedMarkerHandle } from './timedMarkers';

type RuntimeOperation = ResolvedCombatOperationStep;

export interface TimedMarkerOperationDependencies {
  readonly resolveTarget: (target: CombatTarget) => TimedMarkerContainer;
  readonly delegate: CombatOperationExecutor;
}

export class TimedMarkerOperationExecutor implements CombatOperationExecutor {
  readonly #handles = new WeakMap<RuntimeOperation, readonly TimedMarkerHandle[]>();

  constructor(readonly dependencies: TimedMarkerOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind !== 'createTimedMarker') {
      return context === undefined
        ? this.dependencies.delegate.execute(step)
        : this.dependencies.delegate.execute(step, context);
    }
    if (context === undefined) {
      throw new Error('createTimedMarker requires a combat operation context');
    }
    const duration = resolveActionValueOperand(step.parameters.durationSeconds, context.blackboard);
    const handle = this.dependencies
      .resolveTarget(step.parameters.target)
      .add(step.parameters.markerId, duration);
    if (step.parameters.autoFinishByAction) {
      this.#handles.set(step, [...(this.#handles.get(step) ?? []), handle]);
    }
    return true;
  }

  end(
    step: RuntimeOperation,
    context?: Parameters<NonNullable<CombatOperationExecutor['end']>>[1],
  ): void {
    if (step.kind === 'createTimedMarker') {
      for (const handle of this.#handles.get(step) ?? []) handle.remove();
      this.#handles.delete(step);
      return;
    }
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    if (condition.kind === 'timedMarkerPresent') {
      return this.dependencies.resolveTarget(condition.target).has(condition.markerId);
    }
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }
}
