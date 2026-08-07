/**
 * 执行技能序列中面向敌方 Buff 容器的查询与结束操作。
 * 这里只暴露动作需要的最小端口；具体 Buff 容器归属仍由战斗装配层决定。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { ComparisonOperator } from '../../game-data/operatorDefinition';
import type { BuffFinishReason } from '../buffs/combatBuffs';
import { gameplayTagId, type GameplayTagId, type GameplayTagQueryType } from '../tags/gameplayTags';
import type { ActionBlackboard } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' }>;

/** Buff 查询结果只暴露当前动作需要读取的数值黑板。 */
export interface BuffQueryResult {
  readonly blackboard: Pick<ActionBlackboard, 'getNumber'>;
}

/** 技能动作对目标 Buff 容器使用的最小稳定端口。 */
export interface BuffOperationTarget {
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

export interface BuffOperationDependencies {
  readonly target: BuffOperationTarget;
  readonly delegate: CombatOperationExecutor;
}

export class BuffOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: BuffOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind === 'readBuffBlackboard') {
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

    if (step.kind === 'finishBuffsByTag') {
      const tags = step.parameters.buffTagIds.map(gameplayTagId);
      this.dependencies.target.finishByTags(
        tags,
        step.parameters.tagQueryType,
        step.parameters.reason,
      );
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
      const count = this.dependencies.target.getCountByTags(
        condition.buffTagIds.map(gameplayTagId),
        condition.tagQueryType,
      );
      return compareBuffStackCount(count, condition.value, condition.operator);
    }
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }
}

const BUFF_STACK_COMPARE_TOLERANCE = 1e-5;

/** 保持原生 `MathUtils.CompareFloat` 的边界，不把近似相等改成普通 JS 比较。 */
function compareBuffStackCount(
  count: number,
  value: number,
  operator: ComparisonOperator,
): boolean {
  switch (operator) {
    case 'less':
      return count < value - BUFF_STACK_COMPARE_TOLERANCE;
    case 'lessOrEqual':
      return count <= value + BUFF_STACK_COMPARE_TOLERANCE;
    case 'greater':
      return count > value + BUFF_STACK_COMPARE_TOLERANCE;
    case 'greaterOrEqual':
      return count >= value - BUFF_STACK_COMPARE_TOLERANCE;
    case 'equal':
      return Math.abs(count - value) <= BUFF_STACK_COMPARE_TOLERANCE;
    case 'notEqual':
      return Math.abs(count - value) > BUFF_STACK_COMPARE_TOLERANCE;
  }
}
