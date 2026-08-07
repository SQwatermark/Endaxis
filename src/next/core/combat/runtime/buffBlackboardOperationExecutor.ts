/**
 * 在技能动作执行点读取目标 Buff 黑板，并写入当前技能实例的动作黑板。
 * 该层只依赖最小查询端口；目标解析与 Buff 容器归属应由战斗装配层决定。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { ActionBlackboard } from './actionBlackboard';
import { gameplayTagId, type GameplayTagId, type GameplayTagQueryType } from '../tags/gameplayTags';
import type { CombatOperationExecutor } from './skillRuntime';

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' }>;

/** Buff 查询结果只暴露当前动作需要的数值黑板能力。 */
export interface BuffBlackboardQueryResult {
  readonly blackboard: Pick<ActionBlackboard, 'getNumber'>;
}

/** 目标 Buff 容器对动作执行器暴露的最小稳定端口。 */
export interface BuffBlackboardQueryTarget {
  findFirstByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): BuffBlackboardQueryResult | undefined;
}

export interface BuffBlackboardOperationDependencies {
  readonly target: BuffBlackboardQueryTarget;
  readonly delegate: CombatOperationExecutor;
}

export class BuffBlackboardOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: BuffBlackboardOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind !== 'readBuffBlackboard') {
      return context === undefined
        ? this.dependencies.delegate.execute(step)
        : this.dependencies.delegate.execute(step, context);
    }
    if (context === undefined) {
      throw new Error('readBuffBlackboard requires a combat operation context');
    }

    const tags = step.parameters.buffTagIds.map(gameplayTagId);
    const buff = this.dependencies.target.findFirstByTags(tags, step.parameters.tagQueryType);
    if (buff === undefined) return false;

    context.blackboard.assignDynamic(
      step.parameters.outputKey,
      buff.blackboard.getNumber(step.parameters.desiredKey) ?? 0,
    );
    return true;
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
