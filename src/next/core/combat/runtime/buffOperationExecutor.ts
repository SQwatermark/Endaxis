/**
 * 执行技能序列中面向施法者或敌方 Buff 容器的查询与结束操作。
 * 这里只暴露动作需要的最小端口；目标身份到具体容器的映射由战斗装配层决定。
 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { ResolvedSkillBuffDefinition } from '../../compiler/combatProgram';
import type { BuffApplicationTarget, CombatTarget } from '../../game-data/operatorDefinition';
import type { BuffFinishReason } from '../buffs/combatBuffs';
import { gameplayTagId, type GameplayTagId, type GameplayTagQueryType } from '../tags/gameplayTags';
import { resolveActionValueOperand, type ActionBlackboard } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';
import { compareCombatNumbers } from './numericComparison';
import type { CombatSkillCastInfo } from './skillCastInfo';

type RuntimeOperation = ResolvedCombatOperationStep;

/** Buff 查询结果只暴露当前动作需要读取的数值黑板。 */
export interface BuffQueryResult {
  readonly blackboard: Pick<ActionBlackboard, 'getNumber'>;
}

/** Buff 生命周期解析操作链时可使用的稳定实例来源。 */
export interface BuffLifecycleOperationSource {
  readonly sourceId: string;
  readonly sourceActionId: string;
  readonly skillCastInfo: CombatSkillCastInfo | null;
}

/** 技能动作对目标 Buff 容器使用的最小稳定端口。 */
export interface BuffOperationTarget {
  /** 此端口所属的稳定战斗实体身份，用于原生动作显式指定 Buff 来源时传递来源。 */
  readonly ownerId: string;
  /** 支持内联生命周期行为的目标由场景装配根配置；普通查询目标可以不实现。 */
  configureLifecycleOperations?(
    resolveOperations: (source: BuffLifecycleOperationSource) => CombatOperationExecutor,
  ): void;
  apply?(request: BuffApplicationRequest): boolean;
  getCountByIds(ids: readonly string[]): number;
  findFirstByIds(ids: readonly string[]): BuffQueryResult | undefined;
  finishByIds(ids: readonly string[], reason: BuffFinishReason): number;
  holdByIds(ids: readonly string[]): { release(): void };
  getCountByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): number;
  matchesEntityTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): boolean;
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

/** 定义身份与本次施加覆盖值已经分离求值后的运行时请求。 */
export interface BuffApplicationRequest {
  readonly buffId: string;
  /** 缺少表示旧式外部定义引用；内联技能步骤必须携带。 */
  readonly definition?: ResolvedSkillBuffDefinition;
  readonly sourceId: string;
  readonly sourceActionId?: string;
  readonly blackboardValues: Readonly<Record<string, number>>;
  readonly skillCastInfo?: CombatSkillCastInfo;
}

export interface BuffOperationDependencies {
  readonly sourceId: string;
  readonly sourceActionId?: string;
  readonly resolveTarget: (target: CombatTarget) => BuffOperationTarget;
  /** 集合施加只用于 CreateBuffAction；Buff 查询与结束仍必须解析为单一实体。 */
  readonly resolveApplicationTargets?: (
    target: BuffApplicationTarget,
  ) => readonly BuffOperationTarget[];
  readonly delegate: CombatOperationExecutor;
}

export class BuffOperationExecutor implements CombatOperationExecutor {
  readonly #holds = new WeakMap<RuntimeOperation, { release(): void }>();
  constructor(readonly dependencies: BuffOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind === 'applyBuff') {
      // 旧手写配置仍由原执行器解释；定义路径只接收原生身份和施加黑板覆盖值。
      if (
        step.parameters.durationSeconds !== undefined ||
        step.parameters.effectiveness !== undefined
      ) {
        return context === undefined
          ? this.dependencies.delegate.execute(step)
          : this.dependencies.delegate.execute(step, context);
      }
      const targets = this.#resolveApplicationTargets(step.parameters.target);
      if (targets.some(target => target.apply === undefined)) {
        return context === undefined
          ? this.dependencies.delegate.execute(step)
          : this.dependencies.delegate.execute(step, context);
      }
      const assignments = step.parameters.blackboardAssignments ?? {};
      if (Object.keys(assignments).length > 0 && context === undefined) {
        throw new Error('applyBuff runtime values require a combat operation context');
      }
      if (step.parameters.inheritSourceSkillCastInfo && context?.skillCastInfo === undefined) {
        throw new Error('applyBuff inherited skill-cast info requires a skill runtime context');
      }
      if (step.parameters.count !== undefined && context === undefined) {
        throw new Error('applyBuff runtime count requires a combat operation context');
      }
      const count =
        step.parameters.count === undefined
          ? 1
          : resolveActionValueOperand(step.parameters.count, context!.blackboard);
      if (!Number.isFinite(count)) throw new RangeError('applyBuff count must be finite');
      const request: BuffApplicationRequest = {
        buffId: step.parameters.buffId,
        ...(step.parameters.definition === undefined
          ? {}
          : { definition: step.parameters.definition }),
        sourceId:
          step.parameters.source === undefined
            ? this.dependencies.sourceId
            : this.dependencies.resolveTarget(step.parameters.source).ownerId,
        ...(this.dependencies.sourceActionId === undefined
          ? {}
          : { sourceActionId: this.dependencies.sourceActionId }),
        blackboardValues: Object.fromEntries(
          Object.entries(assignments).map(([key, operand]) => [
            key,
            resolveActionValueOperand(operand, context!.blackboard),
          ]),
        ),
        ...(step.parameters.inheritSourceSkillCastInfo
          ? { skillCastInfo: context!.skillCastInfo! }
          : {}),
      };
      // 原生用从 0 开始的整数计数器与 float 次数比较，正小数因此会多执行一次。
      for (let repetition = 0; repetition < count; repetition += 1) {
        for (const target of targets) target.apply!(request);
      }
      return true;
    }

    if (step.kind === 'readBuffBlackboard') {
      if (context === undefined) {
        throw new Error('readBuffBlackboard requires a combat operation context');
      }
      const target = this.dependencies.resolveTarget(step.parameters.target);
      const buff =
        step.parameters.query.kind === 'tag'
          ? target.findFirstByTags(
              step.parameters.query.buffTagIds.map(gameplayTagId),
              step.parameters.query.tagQueryType,
            )
          : target.findFirstByIds(step.parameters.query.buffIds);
      if (buff === undefined) return false;

      context.blackboard.assignDynamic(
        step.parameters.outputKey,
        buff.blackboard.getNumber(step.parameters.desiredKey) ?? 0,
      );
      return true;
    }

    if (step.kind === 'readBuffStackCount') {
      if (context === undefined) {
        throw new Error('readBuffStackCount requires a combat operation context');
      }
      const target = this.dependencies.resolveTarget(step.parameters.target);
      const count =
        step.parameters.query.kind === 'tag'
          ? target.getCountByTags(
              step.parameters.query.buffTagIds.map(gameplayTagId),
              step.parameters.query.tagQueryType,
            )
          : target.getCountByIds(step.parameters.query.buffIds);
      context.blackboard.assignDynamic(step.parameters.outputKey, count);
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

    if (step.kind === 'holdBuffsById') {
      const previous = this.#holds.get(step);
      if (previous !== undefined) {
        throw new Error('holdBuffsById step is already active');
      }
      this.#holds.set(
        step,
        this.dependencies.resolveTarget(step.parameters.target).holdByIds(step.parameters.buffIds),
      );
      return true;
    }

    return context === undefined
      ? this.dependencies.delegate.execute(step)
      : this.dependencies.delegate.execute(step, context);
  }

  #resolveApplicationTargets(target: BuffApplicationTarget): readonly BuffOperationTarget[] {
    const resolved = this.dependencies.resolveApplicationTargets?.(target);
    if (resolved !== undefined) return resolved;
    if (target === 'party') {
      throw new Error('party Buff application requires a collection target resolver');
    }
    return [this.dependencies.resolveTarget(target)];
  }

  end(
    step: RuntimeOperation,
    context?: Parameters<NonNullable<CombatOperationExecutor['end']>>[1],
  ): void {
    if (step.kind === 'holdBuffsById') {
      this.#holds.get(step)?.release();
      this.#holds.delete(step);
      return;
    }
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    if (condition.kind === 'buffStackCompare') {
      if (context === undefined) {
        throw new Error('buffStackCompare requires a combat operation context');
      }
      const count = this.dependencies
        .resolveTarget(condition.target)
        .getCountByTags(condition.buffTagIds.map(gameplayTagId), condition.tagQueryType);
      return compareCombatNumbers(
        count,
        resolveActionValueOperand(condition.value, context.blackboard),
        condition.operator,
      );
    }
    if (condition.kind === 'entityTagMatch') {
      return this.dependencies
        .resolveTarget(condition.target)
        .matchesEntityTags(condition.tagIds.map(gameplayTagId), condition.tagQueryType);
    }
    if (condition.kind === 'buffIdStackCompare') {
      const count = this.dependencies
        .resolveTarget(condition.target)
        .getCountByIds(condition.buffIds);
      if (typeof condition.value === 'number') {
        return compareCombatNumbers(count, condition.value, condition.operator);
      }
      if (context === undefined) {
        throw new Error('dynamic buffIdStackCompare requires a combat operation context');
      }
      const value = resolveActionValueOperand(condition.value, context.blackboard);
      return compareCombatNumbers(count, value, condition.operator);
    }
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }
}
