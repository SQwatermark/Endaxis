/**
 * 执行技能步骤中的普通时间膨胀动作，并按动作生命周期清理实例。
 * 曲线存储方式不决定作用范围；目标解析由整场战斗的装配根提供。
 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type {
  AbilityEntityTargetQuery,
  CombatTarget,
  TimeDilationIgnoreTarget,
} from '../../game-data/operatorDefinition';
import { resolveActionValueOperand } from './actionBlackboard';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import { resolveTimeScaleCurve } from './timeScaleCurve';
import type { TimeDilationRuntime } from './timeDilationRuntime';

type RuntimeOperation = ResolvedCombatOperationStep;

export interface TimeDilationOperationDependencies {
  readonly runtime: TimeDilationRuntime;
  readonly resolveTargetIds: (target: TimeDilationIgnoreTarget) => readonly string[];
  readonly resolveAbilityEntityTargetIds?: (query: AbilityEntityTargetQuery) => readonly string[];
  readonly resolveContextAbilityEntityId?: (instanceId: number) => string | null;
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
          ...this.#resolveAbilityEntityTargetIds(
            step.parameters.ignoredAbilityEntityTargets ?? [],
            context,
          ),
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
              ignoredOperatorIds: parameters.ignoredTargets
                .flatMap(this.dependencies.resolveTargetIds)
                .concat(
                  this.#resolveAbilityEntityTargetIds(
                    parameters.ignoredAbilityEntityTargets ?? [],
                    context,
                  ),
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
        : [
            ...parameters.targets.map(target => resolveSingleTargetId(this.dependencies, target)),
            ...this.#resolveAbilityEntityTargetIds(parameters.abilityEntityTargets ?? [], context),
          ].map(entityId =>
            this.dependencies.runtime.startEntity({
              entityId,
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

  #resolveAbilityEntityTargetIds(
    queries: readonly AbilityEntityTargetQuery[],
    context: CombatOperationContext,
  ): readonly string[] {
    if (queries.length === 0) return [];
    const result: string[] = [];
    for (const query of queries) {
      if (query.kind === 'context') {
        if (context.targetContext === undefined) {
          throw new Error('ability-entity Context query requires a combat target context');
        }
        for (const target of context.targetContext.get(query.contextKey)) {
          if (target.kind !== 'abilityEntity') {
            throw new Error(
              `time-dilation Context '${query.contextKey}' contains a non-AbilityEntity target`,
            );
          }
          const resolve = this.dependencies.resolveContextAbilityEntityId;
          if (resolve === undefined) {
            throw new Error('ability-entity Context targets require a stable entity resolver');
          }
          const entityId = resolve(target.instanceId);
          if (entityId !== null) result.push(entityId);
        }
        continue;
      }
      const resolve = this.dependencies.resolveAbilityEntityTargetIds;
      if (resolve === undefined) {
        throw new Error('ability-entity time-dilation targets require a logical entity resolver');
      }
      result.push(...resolve(query));
    }
    return result;
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
