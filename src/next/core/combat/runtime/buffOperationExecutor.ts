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
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';

type RuntimeOperation = ResolvedCombatOperationStep;

/** Buff 查询结果只暴露当前动作需要读取的数值黑板。 */
export interface BuffQueryResult {
  readonly blackboard: Pick<ActionBlackboard, 'getNumber'>;
}

/** Buff 生命周期解析操作链时可使用的稳定实例来源。 */
export interface BuffLifecycleOperationSource {
  /** Buff 当前实际宿主；队伍 Buff 的生命周期必须相对此实体执行。 */
  readonly ownerId: string;
  /** 创建 Buff 的来源实体；用于回溯原始施法或常驻动作绑定。 */
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
  /** 场景装配根把成功施加事实接入全场语义事件中心。 */
  configureBuffAppliedObserver?(observer: (event: BuffAppliedEvent) => void): void;
  apply?(request: BuffApplicationRequest): boolean;
  applyScoped?(request: BuffApplicationRequest): BuffApplicationHandle | null;
  getCountByIds(ids: readonly string[], skillCastId?: number): number;
  findFirstByIds(ids: readonly string[]): BuffQueryResult | undefined;
  finishByIds(ids: readonly string[], reason: BuffFinishReason): number;
  finishCountByIds?(ids: readonly string[], count: number, reason: BuffFinishReason): number;
  ignite?(igniteType: string, sourceId: string): number;
  holdByIds(ids: readonly string[]): { release(): void };
  getCountByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
    skillCastId?: number,
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

export interface BuffAppliedEvent {
  readonly targetId: string;
  readonly buffId: string;
  readonly sourceId: string;
}

/** 由有状态动作精确持有的 Buff 实例，不按 ID 误删其他来源实例。 */
export interface BuffApplicationHandle {
  finish(reason: BuffFinishReason): boolean;
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
    target: Exclude<BuffApplicationTarget, 'currentAbilityEntity'>,
  ) => readonly BuffOperationTarget[];
  /** 当前子时间线/Context 句柄只在显式能力实体目标的施加路径使用。 */
  readonly resolveCurrentAbilityEntityTarget?: (target: RuntimeTargetRef) => BuffOperationTarget;
  readonly delegate: CombatOperationExecutor;
}

export class BuffOperationExecutor implements CombatOperationExecutor {
  readonly #holds = new WeakMap<RuntimeOperation, { release(): void }>();
  readonly #actionDurationBuffs = new WeakMap<RuntimeOperation, readonly BuffApplicationHandle[]>();
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
      const targets = this.#resolveApplicationTargets(step.parameters.target, context);
      const finishByAction = step.parameters.finishByAction === true;
      if (
        targets.some(target =>
          finishByAction ? target.applyScoped === undefined : target.apply === undefined,
        )
      ) {
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
            : this.#resolveApplicationSource(step.parameters.source, context).ownerId,
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
      if (finishByAction && this.#actionDurationBuffs.has(step)) {
        throw new Error('action-duration applyBuff step is already active');
      }
      const scoped: BuffApplicationHandle[] = [];
      // 原生用从 0 开始的整数计数器与 float 次数比较，正小数因此会多执行一次。
      for (let repetition = 0; repetition < count; repetition += 1) {
        for (const target of targets) {
          if (finishByAction) {
            const handle = target.applyScoped!(request);
            if (handle !== null) scoped.push(handle);
          } else {
            target.apply!(request);
          }
        }
      }
      if (finishByAction) this.#actionDurationBuffs.set(step, scoped);
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
      const skillCastId = step.parameters.sameSourceSkillCast
        ? this.#requireSkillCastId(context, 'readBuffStackCount')
        : undefined;
      const count =
        step.parameters.query.kind === 'tag'
          ? target.getCountByTags(
              step.parameters.query.buffTagIds.map(gameplayTagId),
              step.parameters.query.tagQueryType,
              false,
              skillCastId,
            )
          : target.getCountByIds(step.parameters.query.buffIds, skillCastId);
      context.blackboard.assignDynamic(step.parameters.outputKey, count);
      return true;
    }

    if (step.kind === 'finishBuffsByTag') {
      const target = this.#resolveSingleTarget(step.parameters.target, context);
      const tags = step.parameters.buffTagIds.map(gameplayTagId);
      target.finishByTags(tags, step.parameters.tagQueryType, step.parameters.reason);
      return true;
    }

    if (step.kind === 'finishBuffsById') {
      const targets = this.#resolveApplicationTargets(step.parameters.target, context);
      for (const target of targets) {
        if (step.parameters.count === undefined) {
          target.finishByIds(step.parameters.buffIds, step.parameters.reason);
        } else {
          if (context === undefined) {
            throw new Error('finishBuffsById runtime count requires a combat operation context');
          }
          const count = resolveActionValueOperand(step.parameters.count, context.blackboard);
          if (target.finishCountByIds === undefined) {
            throw new Error('finishBuffsById count requires a count-aware Buff target');
          }
          target.finishCountByIds(step.parameters.buffIds, count, step.parameters.reason);
        }
      }
      return true;
    }

    if (step.kind === 'finishCurrentBuff') {
      if (context?.finishCurrentBuff === undefined) {
        throw new Error('finishCurrentBuff requires a Buff operation context');
      }
      context.finishCurrentBuff(step.parameters.reason);
      return true;
    }

    if (step.kind === 'igniteBuffs') {
      const target = this.dependencies.resolveTarget(step.parameters.target);
      if (target.ignite === undefined) {
        throw new Error(`Buff target '${target.ownerId}' does not support ignite events`);
      }
      const sourceId =
        step.parameters.source === 'currentBuffSource'
          ? context?.buffSourceId
          : this.dependencies.resolveTarget(step.parameters.source).ownerId;
      if (sourceId === undefined) {
        throw new Error('igniteBuffs current Buff source requires a Buff operation context');
      }
      target.ignite(step.parameters.igniteType, sourceId);
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

  #resolveApplicationTargets(
    target: BuffApplicationTarget,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): readonly BuffOperationTarget[] {
    if (target === 'currentAbilityEntity') {
      if (context?.currentTarget === undefined) {
        throw new Error('currentAbilityEntity Buff application requires a current target');
      }
      const resolve = this.dependencies.resolveCurrentAbilityEntityTarget;
      if (resolve === undefined) {
        throw new Error('currentAbilityEntity Buff application is not configured');
      }
      return [resolve(context.currentTarget)];
    }
    const resolved = this.dependencies.resolveApplicationTargets?.(target);
    if (resolved !== undefined) return resolved;
    if (target === 'party' || target === 'partyExceptCaster') {
      throw new Error('party Buff application requires a collection target resolver');
    }
    return [this.dependencies.resolveTarget(target)];
  }

  #resolveApplicationSource(
    source: NonNullable<Extract<RuntimeOperation, { kind: 'applyBuff' }>['parameters']['source']>,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): BuffOperationTarget {
    if (source !== 'currentAbilityEntity') return this.dependencies.resolveTarget(source);
    if (context?.currentTarget === undefined) {
      throw new Error('currentAbilityEntity Buff source requires a current target');
    }
    const resolve = this.dependencies.resolveCurrentAbilityEntityTarget;
    if (resolve === undefined) {
      throw new Error('currentAbilityEntity Buff source is not configured');
    }
    return resolve(context.currentTarget);
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
    if (step.kind === 'applyBuff' && step.parameters.finishByAction === true) {
      for (const handle of this.#actionDurationBuffs.get(step) ?? []) handle.finish('other');
      this.#actionDurationBuffs.delete(step);
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
        .getCountByTags(
          condition.buffTagIds.map(gameplayTagId),
          condition.tagQueryType,
          false,
          condition.sameSourceSkillCast
            ? this.#requireSkillCastId(context, 'buffStackCompare')
            : undefined,
        );
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
        .getCountByIds(
          condition.buffIds,
          condition.sameSourceSkillCast
            ? this.#requireSkillCastId(context, 'buffIdStackCompare')
            : undefined,
        );
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

  #resolveSingleTarget(
    target: CombatTarget | 'currentAbilityEntity',
    context: Parameters<CombatOperationExecutor['execute']>[1],
  ): BuffOperationTarget {
    if (target !== 'currentAbilityEntity') return this.dependencies.resolveTarget(target);
    if (context?.currentTarget?.kind !== 'abilityEntity') {
      throw new Error(
        'currentAbilityEntity Buff operation requires a current AbilityEntity target',
      );
    }
    const resolve = this.dependencies.resolveCurrentAbilityEntityTarget;
    if (resolve === undefined) {
      throw new Error('currentAbilityEntity Buff operation runtime is not configured');
    }
    return resolve(context.currentTarget);
  }

  #requireSkillCastId(
    context: Parameters<CombatOperationExecutor['execute']>[1],
    operation: string,
  ): number {
    const skillCastId = context?.skillCastInfo?.skillCastId;
    if (skillCastId === undefined) {
      throw new Error(`${operation} same-source query requires skill cast info`);
    }
    return skillCastId;
  }
}
