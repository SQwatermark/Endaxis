/**
 * 执行技能序列中面向施法者或敌方 Buff 容器的查询与结束操作。
 * 这里只暴露动作需要的最小端口；目标身份到具体容器的映射由战斗装配层决定。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { CombatTarget } from '../../game-data/operatorDefinition';
import type { BuffFinishReason } from '../buffs/combatBuffs';
import { gameplayTagId, type GameplayTagId, type GameplayTagQueryType } from '../tags/gameplayTags';
import type { ActionBlackboard } from './actionBlackboard';
import { resolveActionValueOperand } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';
import { compareCombatNumbers } from './numericComparison';

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' }>;

/** Buff 查询结果只暴露当前动作需要读取的数值黑板。 */
export interface BuffQueryResult {
  readonly blackboard: Pick<ActionBlackboard, 'getNumber'>;
}

/** 技能动作对目标 Buff 容器使用的最小稳定端口。 */
export interface BuffOperationTarget {
  apply?(request: BuffApplicationRequest): boolean;
  getCountByIds(ids: readonly string[]): number;
  finishByIds(ids: readonly string[], reason: BuffFinishReason): number;
  getCountByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): number;
  findFirstByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): BuffQueryResult | undefined;
  finishByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    reason: BuffFinishReason,
    exact?: boolean,
  ): number;
}

/** 目录身份与本次施加覆盖值已经分离求值后的运行时请求。 */
export interface BuffApplicationRequest {
  readonly buffId: string;
  readonly sourceId: string;
  readonly blackboardValues: Readonly<Record<string, number>>;
}

export interface BuffOperationDependencies {
  readonly sourceId: string;
  readonly resolveTarget: (target: CombatTarget) => BuffOperationTarget;
  readonly delegate: CombatOperationExecutor;
}

export class BuffOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: BuffOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind === 'applyBuff') {
      // 旧手写配置仍由原执行器解释；目录路径只接收原生身份和施加黑板覆盖值。
      if (
        step.parameters.durationSeconds !== undefined ||
        step.parameters.effectiveness !== undefined
      ) {
        return context === undefined
          ? this.dependencies.delegate.execute(step)
          : this.dependencies.delegate.execute(step, context);
      }
      const target = this.dependencies.resolveTarget(step.parameters.target);
      if (target.apply === undefined) {
        return context === undefined
          ? this.dependencies.delegate.execute(step)
          : this.dependencies.delegate.execute(step, context);
      }
      const assignments = step.parameters.blackboardAssignments ?? {};
      if (Object.keys(assignments).length > 0 && context === undefined) {
        throw new Error('applyBuff blackboard assignments require a combat operation context');
      }
      return target.apply({
        buffId: step.parameters.buffId,
        sourceId: this.dependencies.sourceId,
        blackboardValues: Object.fromEntries(
          Object.entries(assignments).map(([key, operand]) => [
            key,
            resolveActionValueOperand(operand, context!.blackboard),
          ]),
        ),
      });
    }

    if (step.kind === 'readBuffBlackboard') {
      if (context === undefined) {
        throw new Error('readBuffBlackboard requires a combat operation context');
      }
      const target = this.dependencies.resolveTarget(step.parameters.target);
      const tags = step.parameters.buffTagIds.map(gameplayTagId);
      const buff = target.findFirstByTags(tags, step.parameters.tagQueryType);
      if (buff === undefined) return false;

      context.blackboard.assignDynamic(
        step.parameters.outputKey,
        buff.blackboard.getNumber(step.parameters.desiredKey) ?? 0,
      );
      return true;
    }

    if (step.kind === 'finishBuffsByTag') {
      const target = this.dependencies.resolveTarget(step.parameters.target);
      const tags = step.parameters.buffTagIds.map(gameplayTagId);
      target.finishByTags(tags, step.parameters.tagQueryType, step.parameters.reason);
      return true;
    }

    if (step.kind === 'finishBuffsById') {
      this.dependencies
        .resolveTarget(step.parameters.target)
        .finishByIds(step.parameters.buffIds, step.parameters.reason);
      return true;
    }

    return context === undefined
      ? this.dependencies.delegate.execute(step)
      : this.dependencies.delegate.execute(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    if (condition.kind === 'buffStackCompare') {
      const count = this.dependencies
        .resolveTarget(condition.target)
        .getCountByTags(condition.buffTagIds.map(gameplayTagId), condition.tagQueryType);
      return compareCombatNumbers(count, condition.value, condition.operator);
    }
    if (condition.kind === 'buffIdStackCompare') {
      const count = this.dependencies
        .resolveTarget(condition.target)
        .getCountByIds(condition.buffIds);
      return compareCombatNumbers(count, condition.value, condition.operator);
    }
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }
}
