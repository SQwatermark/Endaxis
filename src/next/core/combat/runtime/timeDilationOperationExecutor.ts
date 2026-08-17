/**
 * 执行技能步骤中的普通时间膨胀动作，并按动作生命周期清理实例。
 * 曲线存储方式不决定作用范围；目标解析由整场战斗的装配根提供。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { CombatTarget, TimeDilationIgnoreTarget } from '../../game-data/operatorDefinition';
import { resolveActionValueOperand } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';
import { resolveTimeScaleCurve } from './timeScaleCurve';
import type { TimeDilationRuntime } from './timeDilationRuntime';

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' | 'once' }>;

export interface TimeDilationOperationDependencies {
  readonly runtime: TimeDilationRuntime;
  readonly resolveTargetIds: (target: TimeDilationIgnoreTarget) => readonly string[];
  readonly sourceId: string;
  readonly sourceActionId: string;
  readonly delegate: CombatOperationExecutor;
}

export class TimeDilationOperationExecutor implements CombatOperationExecutor {
  readonly #instanceIds = new WeakMap<RuntimeOperation, readonly number[]>();

  constructor(readonly dependencies: TimeDilationOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind !== 'startTimeDilation' && step.kind !== 'startUltimateTimeDilation') {
      return context === undefined
        ? this.dependencies.delegate.execute(step)
        : this.dependencies.delegate.execute(step, context);
    }
    if (context === undefined) throw new Error(`${step.kind} requires an operation context`);
    const source = {
      sourceId: this.dependencies.sourceId,
      sourceActionId: this.dependencies.sourceActionId,
      ...(context.skillCastInfo?.originCastId === undefined
        ? {}
        : { sourceCastId: context.skillCastInfo.originCastId }),
    };
    if (step.kind === 'startUltimateTimeDilation') {
      const id = this.dependencies.runtime.startUltimate(
        step.parameters.priority,
        resolveActionValueOperand(step.parameters.targetScale, context.blackboard),
        [
          ...this.dependencies.resolveTargetIds('caster'),
          ...step.parameters.ignoredTargets.flatMap(this.dependencies.resolveTargetIds),
        ],
        source,
      );
      this.#instanceIds.set(step, [id]);
      return true;
    }
    const parameters = step.parameters;
    const durationSeconds = resolveActionValueOperand(
      parameters.durationSeconds,
      context.blackboard,
    );
    const curve = resolveTimeScaleCurve(parameters.curve, this.dependencies.runtime);
    const ids =
      parameters.scope === 'global'
        ? [
            this.dependencies.runtime.startGlobal({
              durationSeconds,
              slot: parameters.slot,
              priority: parameters.priority,
              curve,
              ignoredOperatorIds: parameters.ignoredTargets.flatMap(
                this.dependencies.resolveTargetIds,
              ),
              source,
              ...(parameters.influenceSkillCooldownSeconds === undefined
                ? {}
                : {
                    influenceSkillCooldownSeconds: resolveActionValueOperand(
                      parameters.influenceSkillCooldownSeconds,
                      context.blackboard,
                    ),
                  }),
            }),
          ]
        : parameters.targets.map(target =>
            this.dependencies.runtime.startEntity({
              operatorId: resolveSingleTargetId(this.dependencies, target),
              durationSeconds,
              slot: parameters.slot,
              priority: parameters.priority,
              curve,
              source,
              ...(parameters.ignoreSlotCheck === undefined
                ? {}
                : { ignoreSlotCheck: parameters.ignoreSlotCheck }),
            }),
          );
    if (parameters.finishByAction) {
      this.#instanceIds.set(step, [...(this.#instanceIds.get(step) ?? []), ...ids]);
    }
    return true;
  }

  end(
    step: RuntimeOperation,
    context?: Parameters<NonNullable<CombatOperationExecutor['end']>>[1],
  ): void {
    if (step.kind === 'startTimeDilation' || step.kind === 'startUltimateTimeDilation') {
      for (const id of this.#instanceIds.get(step) ?? []) this.dependencies.runtime.stop(id);
      this.#instanceIds.delete(step);
      return;
    }
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }
}

function resolveSingleTargetId(
  dependencies: TimeDilationOperationDependencies,
  target: CombatTarget,
): string {
  const ids = dependencies.resolveTargetIds(target);
  if (ids.length !== 1) {
    throw new Error(`time-dilation entity target '${target}' must resolve to exactly one entity`);
  }
  return ids[0]!;
}
