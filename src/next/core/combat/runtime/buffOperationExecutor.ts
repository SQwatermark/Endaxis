/**
 * 执行技能序列中面向施法者或敌方 Buff 容器的查询与结束操作。
 * 这里只暴露动作需要的最小端口；目标身份到具体容器的映射由战斗装配层决定。
 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { ResolvedSkillBuffDefinition } from '../../compiler/combatProgram';
import type { BuffApplicationTarget, CombatTarget } from '../../game-data/operatorDefinition';
import type { BuffFinishReason } from '../buffs/combatBuffs';
import type { GameplayTag, GameplayTagQueryType } from '../tags/gameplayTags';
import { resolveActionValueOperand, type ActionBlackboard } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';
import { compareCombatNumbers } from './numericComparison';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type { RegisterBuffSemanticEventAction } from './buffLifecycleSequenceRuntime';

type RuntimeOperation = ResolvedCombatOperationStep;

/** Buff 查询结果只暴露当前动作需要读取的数值黑板。 */
export interface BuffQueryResult {
  readonly blackboard: Pick<ActionBlackboard, 'getNumber'>;
  readonly remainingDuration?: number | null;
}

/** Buff 生命周期解析操作链时的宿主、动作来源与施法身份。 */
export interface BuffLifecycleOperationSource {
  /** Buff 当前实际宿主；队伍 Buff 的生命周期必须相对此实体执行。 */
  readonly ownerId: string;
  /** 普通生命周期为创建者；叠层和点燃回调显式传入本次动作来源，不改变实例归属。 */
  readonly sourceId: string;
  readonly sourceActionId: string;
  /** 普通/叠层回调沿用 Buff 来源施法，点燃使用本次 IgniteAction 的施法身份。 */
  readonly skillCastInfo: CombatSkillCastInfo | null;
}

/** 技能动作对目标 Buff 容器使用的最小稳定端口。 */
export interface BuffOperationTarget {
  /** 此端口所属的稳定战斗实体身份，用于原生动作显式指定 Buff 来源时传递来源。 */
  readonly ownerId: string;
  /** 只读原生属性值；技能费用等非 Buff 操作不得反向持有具体容器。 */
  getAttributeValue?(attribute: string): number;
  /** 支持内联生命周期行为的目标由场景装配根配置；普通查询目标可以不实现。 */
  configureLifecycleOperations?(
    resolveOperations: (source: BuffLifecycleOperationSource) => CombatOperationExecutor,
  ): void;
  /** 场景装配根把成功施加事实接入全场语义事件中心。 */
  configureBuffAppliedObserver?(observer: (event: BuffAppliedEvent) => void): void;
  configureBuffConsumedObserver?(observer: (event: BuffConsumedEvent) => void): void;
  /** 场景装配根把 Buff 存续期内的全场语义事件监听接入唯一事件中心。 */
  configureSemanticEventAction?(register: RegisterBuffSemanticEventAction): void;
  apply?(request: BuffApplicationRequest): boolean;
  applyScoped?(request: BuffApplicationRequest): BuffApplicationHandle | null;
  getCountByIds(ids: readonly string[], skillCastId?: number): number;
  getInstanceCountByIds?(ids: readonly string[]): number;
  findFirstByIds(ids: readonly string[]): BuffQueryResult | undefined;
  /** InheritBuffAction 需要稳定实例身份；普通查询端口不能代替。 */
  findFirstHandleByIds?(ids: readonly string[]): BuffApplicationHandle | undefined;
  finishByIds(ids: readonly string[], reason: BuffFinishReason): number;
  finishCountByIds?(ids: readonly string[], count: number, reason: BuffFinishReason): number;
  ignite?(igniteType: string, sourceId: string, skillCastInfo?: CombatSkillCastInfo): number;
  holdByIds(ids: readonly string[]): { release(): void };
  getCountByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
    skillCastId?: number,
  ): number;
  getDistinctIdCountByTags?(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
    skillCastId?: number,
  ): number;
  getInstanceCountByTags?(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
    skillCastId?: number,
  ): number;
  matchesEntityTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): boolean;
  matchesTags?(
    ownedTags: readonly GameplayTag[],
    requiredTags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): boolean;
  findFirstByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): BuffQueryResult | undefined;
  finishByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    reason: BuffFinishReason,
    exact?: boolean,
  ): number;
  finishCountByTags?(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    count: number,
    reason: BuffFinishReason,
    exact?: boolean,
  ): number;
}

export interface BuffAppliedEvent {
  readonly targetId: string;
  readonly buffId: string;
  readonly sourceId: string;
  readonly buffTags: readonly GameplayTag[];
  /** AddBuffContext 使用本次施加请求的来源，不能从接收者/监听器反推。 */
  readonly skillCastInfo?: CombatSkillCastInfo | null;
}

export interface BuffConsumedEvent {
  readonly sourceOperatorId: string;
  readonly targetId: string;
  readonly buffId: string;
  readonly layers: number;
  readonly buffTags: readonly GameplayTag[];
  readonly blackboardValues: Readonly<Record<string, string | number | null>>;
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
  readonly finishParentGlobalBuff?: (reason: 'early' | 'other') => boolean;
  readonly getSourceAttributeValue?: (attribute: string) => number;
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
  /** Ability 事件响应中把原生 Target 解析为事件载荷的真实 targetId。 */
  readonly resolveEventTarget?: (targetId: string) => BuffOperationTarget;
  /** 从当前动作所属干员、原始技能等级对应的附属对象表解析定义。 */
  readonly resolveBuffDefinition?: (buffId: string) => ResolvedSkillBuffDefinition | undefined;
  /** 仅在已证明的消费路径完成后报告原生 OnConsumeBuff 事实。 */
  readonly onBuffConsumed?: (event: {
    readonly sourceOperatorId: string;
    readonly targetId: string;
    readonly buffId: string;
    readonly layers: number;
    readonly buffTags: readonly GameplayTag[];
    readonly blackboardValues: Readonly<Record<string, string | number | null>>;
  }) => void;
  readonly onPhysicalInflictionApplied?: (event: {
    readonly sourceOperatorId: string;
    readonly targetId: string;
    readonly type: 'airborne' | 'fracture' | 'crush';
    readonly skillCastInfo: CombatSkillCastInfo;
    readonly attachBuffToCurrentSkill?: (buff: BuffApplicationHandle) => void;
  }) => void;
  readonly onBeforeOutputPhysicalInfliction?: (event: {
    readonly sourceId: string;
    readonly targetId: string;
    readonly type: 'airborne' | 'fracture' | 'crush';
    readonly skillCastInfo: CombatSkillCastInfo;
    readonly attachBuffToCurrentSkill?: (buff: BuffApplicationHandle) => void;
  }) => void;
  readonly delegate: CombatOperationExecutor;
}

export class BuffOperationExecutor implements CombatOperationExecutor {
  readonly #holds = new WeakMap<RuntimeOperation, { release(): void }>();
  readonly #actionDurationBuffs = new WeakMap<RuntimeOperation, readonly BuffApplicationHandle[]>();
  readonly #inheritedBuffs = new WeakMap<RuntimeOperation, BuffApplicationHandle>();
  constructor(readonly dependencies: BuffOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind === 'applyPhysicalInfliction') {
      if (context?.skillCastInfo === undefined) {
        throw new Error('applyPhysicalInfliction requires a skill runtime context');
      }
      const target = this.dependencies.resolveTarget(step.parameters.target);
      if (target.apply === undefined) {
        throw new Error(
          `physical infliction target '${target.ownerId}' does not support Buff application`,
        );
      }
      if (step.parameters.type === 'airborne' && step.parameters.targetFilter === 'skipAll') {
        return step.parameters.returnWhen === 'always';
      }
      const noGuardCount = target.getCountByIds([step.parameters.noGuardBuffId]);
      const hasNoGuard = noGuardCount > 0;
      const entersPhysicalInfliction =
        hasNoGuard || (step.parameters.type === 'airborne' && step.parameters.force);
      if (entersPhysicalInfliction) {
        this.dependencies.onBeforeOutputPhysicalInfliction?.({
          sourceId: this.dependencies.sourceId,
          targetId: target.ownerId,
          type: step.parameters.type,
          skillCastInfo: context.skillCastInfo,
          ...(context.attachBuffToCurrentSkill === undefined
            ? {}
            : { attachBuffToCurrentSkill: context.attachBuffToCurrentSkill }),
        });
      }
      const crushBlackboardValues: Readonly<Record<string, number>> =
        hasNoGuard && step.parameters.type === 'crush'
          ? (() => {
              const values: Record<string, number> = {};
              const multiplier = resolveActionValueOperand(
                step.parameters.damageMultiplier,
                context.blackboard,
              );
              if (Math.abs(multiplier - 1) > 1e-5) {
                values.dmg_multiplier = multiplier;
              }
              if (step.parameters.ignoreHitEffect) {
                values.ignore_hit_effect = 1;
              }
              return values;
            })()
          : {};
      const request: BuffApplicationRequest = !entersPhysicalInfliction
        ? {
            buffId: step.parameters.noGuardBuffId,
            definition: step.parameters.noGuardDefinition,
            sourceId: this.dependencies.sourceId,
            ...(this.dependencies.sourceActionId === undefined
              ? {}
              : { sourceActionId: this.dependencies.sourceActionId }),
            blackboardValues: {},
            skillCastInfo: context.skillCastInfo,
          }
        : step.parameters.type === 'crush'
          ? {
              buffId: step.parameters.crushedBuffId,
              definition: step.parameters.crushedDefinition,
              sourceId: this.dependencies.sourceId,
              ...(this.dependencies.sourceActionId === undefined
                ? {}
                : { sourceActionId: this.dependencies.sourceActionId }),
              blackboardValues: crushBlackboardValues,
              skillCastInfo: context.skillCastInfo,
            }
          : step.parameters.type === 'fracture'
            ? {
                buffId: step.parameters.fractureBuffId,
                definition: step.parameters.fractureDefinition,
                sourceId: this.dependencies.sourceId,
                ...(this.dependencies.sourceActionId === undefined
                  ? {}
                  : { sourceActionId: this.dependencies.sourceActionId }),
                blackboardValues: {},
                skillCastInfo: context.skillCastInfo,
              }
            : {
                buffId: step.parameters.airborneBuffId,
                definition: step.parameters.airborneDefinition,
                sourceId: this.dependencies.sourceId,
                ...(this.dependencies.sourceActionId === undefined
                  ? {}
                  : { sourceActionId: this.dependencies.sourceActionId }),
                blackboardValues: {},
                skillCastInfo: context.skillCastInfo,
              };
      const applied = target.apply(request);
      if (applied && entersPhysicalInfliction) {
        this.dependencies.onPhysicalInflictionApplied?.({
          sourceOperatorId: this.dependencies.sourceId,
          targetId: target.ownerId,
          type: step.parameters.type,
          skillCastInfo: context.skillCastInfo,
          ...(context.attachBuffToCurrentSkill === undefined
            ? {}
            : { attachBuffToCurrentSkill: context.attachBuffToCurrentSkill }),
        });
      }
      if (applied && entersPhysicalInfliction && hasNoGuard) {
        const remainingCount = target.getCountByIds([step.parameters.noGuardBuffId]);
        const consumedLayers = Math.max(0, noGuardCount - remainingCount);
        if (consumedLayers > 0) {
          this.dependencies.onBuffConsumed?.({
            sourceOperatorId: this.dependencies.sourceId,
            targetId: target.ownerId,
            buffId: step.parameters.noGuardBuffId,
            layers: consumedLayers,
            buffTags: [],
            blackboardValues: {},
          });
        }
      }
      if (step.parameters.type !== 'airborne') return applied;
      // 固定木桩不安装空间控制组件：状态 Buff 与通用 After 链仍执行，但不能伪造
      // ApplyAirborne 的 Success/Interruption。真实 1.4.4 样本当前均使用 Always。
      return step.parameters.returnWhen === 'always';
    }

    if (step.kind === 'applyBuff') {
      const identity = step.parameters.buffId;
      const dynamicId = typeof identity !== 'string';
      if (
        dynamicId &&
        (step.parameters.definition !== undefined ||
          step.parameters.durationSeconds !== undefined ||
          step.parameters.effectiveness !== undefined)
      )
        throw new Error('动态 Buff ID 不能使用内联定义或旧式覆盖');
      const attachToSkill = step.parameters.lifetimeOwner === 'currentCastSkill';
      const attachBuff =
        context?.event !== undefined && 'attachBuffToCurrentSkill' in context.event
          ? context.event.attachBuffToCurrentSkill
          : undefined;
      // 旧手写配置仍由原执行器解释；定义路径只接收原生身份和施加黑板覆盖值。
      if (
        step.parameters.durationSeconds !== undefined ||
        step.parameters.effectiveness !== undefined
      ) {
        if (attachToSkill) {
          throw new Error(
            'currentCastSkill Buff lifetime requires a definition-backed Buff handle',
          );
        }
        return context === undefined
          ? this.dependencies.delegate.execute(step)
          : this.dependencies.delegate.execute(step, context);
      }
      const targets = this.#resolveApplicationTargets(step.parameters.target, context);
      const finishByAction = step.parameters.finishByAction === true;
      const asChildBuff = step.parameters.asChildBuff === true;
      const addOwnerChild =
        context?.addCurrentBuffChild ??
        context?.addAbilityChildBuff ??
        context?.attachBuffToCurrentSkill;
      if (asChildBuff && addOwnerChild === undefined) {
        throw new Error('asChildBuff applyBuff requires a Buff, Ability, or Skill owner context');
      }
      if (
        targets.some(target =>
          finishByAction || asChildBuff || attachToSkill
            ? target.applyScoped === undefined
            : target.apply === undefined,
        )
      ) {
        if (dynamicId) throw new Error('动态 Buff ID 需要支持定义施加的 Buff 目标端口');
        if (attachToSkill) {
          throw new Error('currentCastSkill Buff lifetime requires a scoped Buff application port');
        }
        return context === undefined
          ? this.dependencies.delegate.execute(step)
          : this.dependencies.delegate.execute(step, context);
      }
      const assignments = step.parameters.blackboardAssignments ?? {};
      const stringAssignments = step.parameters.stringBlackboardAssignments ?? {};
      if (
        (Object.keys(assignments).length > 0 || Object.keys(stringAssignments).length > 0) &&
        context === undefined
      ) {
        throw new Error('applyBuff runtime values require a combat operation context');
      }
      if (step.parameters.count !== undefined && context === undefined) {
        throw new Error('applyBuff runtime count requires a combat operation context');
      }
      const count =
        step.parameters.count === undefined
          ? 1
          : resolveActionValueOperand(step.parameters.count, context!.blackboard);
      const inheritedSkillCastInfo =
        context?.eventSkillCastInfo === undefined
          ? context?.skillCastInfo
          : (context.eventSkillCastInfo ?? undefined);
      if (!Number.isFinite(count)) throw new RangeError('applyBuff count must be finite');
      // CreateBuffAction 每次实际施加都读 ID 和参数；前一个子 Buff 启动后可以改变后续读取值。
      const createRequest = (): BuffApplicationRequest => {
        const buffId =
          typeof identity === 'string'
            ? identity
            : context?.blackboard.getString(identity.blackboardKey);
        if (buffId === undefined || buffId.trim().length === 0)
          throw new Error(
            `Buff ID '${typeof identity === 'string' ? identity : identity.blackboardKey}' 缺失、为空或不是字符串`,
          );
        let definition =
          step.parameters.definition ?? this.dependencies.resolveBuffDefinition?.(buffId);
        if (dynamicId && definition === undefined)
          throw new Error(`动态 Buff ID '${buffId}' 在定义目录中不存在`);
        if (step.parameters.keywordEnhancements?.length) {
          if (definition === undefined)
            throw new Error(`关键词 Buff '${buffId}' 在定义目录中不存在`);
          if (definition.keywordEnhancements?.length)
            throw new Error(`关键词 Buff '${buffId}' 的共享定义已含实例增强规则`);
          definition = {
            ...definition,
            keywordEnhancements: step.parameters.keywordEnhancements.map(enhancement => ({
              triggerBuffIds: enhancement.triggerBuffIds,
              operation: enhancement.operation,
              targetKey: 'rate',
              initialValue: { blackboardKey: 'rate' },
              value: resolveActionValueOperand(enhancement.value, context!.blackboard),
            })),
          };
        }
        const requiresSourceAttributeValue = definition?.shields?.some(
          shield =>
            typeof shield.value === 'object' &&
            'attribute' in shield.value &&
            shield.value.attributeSource === 'buffSource',
        );
        const sourceTarget =
          step.parameters.source !== undefined || requiresSourceAttributeValue
            ? this.#resolveApplicationSource(step.parameters.source ?? 'caster', context)
            : undefined;
        return {
          buffId,
          ...(definition === undefined ? {} : { definition }),
          sourceId:
            step.parameters.source === undefined
              ? this.dependencies.sourceId
              : sourceTarget!.ownerId,
          ...(sourceTarget?.getAttributeValue === undefined
            ? {}
            : { getSourceAttributeValue: sourceTarget.getAttributeValue.bind(sourceTarget) }),
          ...(this.dependencies.sourceActionId === undefined
            ? {}
            : { sourceActionId: this.dependencies.sourceActionId }),
          blackboardValues: Object.fromEntries([
            ...Object.entries(assignments).map(
              ([key, operand]) =>
                [key, resolveActionValueOperand(operand, context!.blackboard)] as const,
            ),
            ...Object.entries(stringAssignments),
          ]),
          ...(step.parameters.inheritSourceSkillCastInfo && inheritedSkillCastInfo !== undefined
            ? { skillCastInfo: inheritedSkillCastInfo }
            : {}),
        };
      };
      if (finishByAction && this.#actionDurationBuffs.has(step)) {
        throw new Error('action-duration applyBuff step is already active');
      }
      const scoped: BuffApplicationHandle[] = [];
      // 原生用从 0 开始的整数计数器与 float 次数比较，正小数因此会多执行一次。
      for (const target of targets) {
        for (let repetition = 0; repetition < count; repetition += 1) {
          const request = createRequest();
          if (finishByAction || asChildBuff || attachToSkill) {
            const handle = target.applyScoped!(request);
            if (handle !== null) {
              if (finishByAction) scoped.push(handle);
              if (asChildBuff) addOwnerChild!(handle);
              if (attachToSkill) {
                // 原生派生钩子只对创建成功的实例读取 CastSkillContext。
                if (attachBuff === undefined) {
                  throw new Error(
                    'currentCastSkill Buff lifetime requires a native CastSkillContext attachment port',
                  );
                }
                attachBuff(handle);
              }
            }
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
      const target = this.#resolveSingleTarget(step.parameters.target, context);
      const buff =
        step.parameters.query.kind === 'tag'
          ? target.findFirstByTags(
              step.parameters.query.buffTags,
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

    if (step.kind === 'readEventBuffBlackboard') {
      if (context?.event?.kind !== 'buffConsumed') {
        throw new Error('readEventBuffBlackboard requires a consumed Buff event');
      }
      const value = context.event.blackboardValues?.[step.parameters.desiredKey];
      context.blackboard.assignDynamic(
        step.parameters.outputKey,
        typeof value === 'number' ? value : 0,
      );
      return true;
    }

    if (step.kind === 'readCurrentBuffRemainingDuration') {
      if (context?.getCurrentBuffRemainingDuration === undefined) {
        throw new Error('readCurrentBuffRemainingDuration requires a Buff operation context');
      }
      context.blackboard.assignDynamic(
        step.parameters.outputKey,
        context.getCurrentBuffRemainingDuration() ?? 0,
      );
      return true;
    }

    if (step.kind === 'readBuffRemainingDuration') {
      if (context === undefined)
        throw new Error('readBuffRemainingDuration requires a combat operation context');
      const target = this.#resolveSingleTarget(step.parameters.target, context);
      const buff = target.findFirstByIds(step.parameters.buffIds);
      if (buff === undefined) return false;
      context.blackboard.assignDynamic(step.parameters.outputKey, buff.remainingDuration ?? 0);
      return true;
    }

    if (step.kind === 'setCurrentBuffRemainingDuration') {
      if (
        context?.getCurrentBuffRemainingDuration === undefined ||
        context.setCurrentBuffRemainingDuration === undefined
      ) {
        throw new Error('setCurrentBuffRemainingDuration requires a Buff operation context');
      }
      const current = context.getCurrentBuffRemainingDuration();
      if (current === null) return true;
      const operand = resolveActionValueOperand(step.parameters.value, context.blackboard);
      const result =
        step.parameters.operation === 'assign'
          ? operand
          : step.parameters.operation === 'add'
            ? current + operand
            : current * operand;
      context.setCurrentBuffRemainingDuration(Math.max(0, result));
      return true;
    }

    if (step.kind === 'refreshCurrentBuffAttributeModifiers') {
      if (context?.refreshCurrentBuffAttributeModifiers === undefined) {
        throw new Error('refreshCurrentBuffAttributeModifiers requires a Buff operation context');
      }
      context.refreshCurrentBuffAttributeModifiers();
      return true;
    }

    if (step.kind === 'readBuffStackCount') {
      if (context === undefined) {
        throw new Error('readBuffStackCount requires a combat operation context');
      }
      if (step.parameters.query.kind === 'environment') {
        if (context.getCurrentBuffEnhanceCount === undefined) {
          throw new Error('readBuffStackCount environment query requires a Buff operation context');
        }
        context.blackboard.assignDynamic(
          step.parameters.outputKey,
          context.getCurrentBuffEnhanceCount(),
        );
        return true;
      }
      const target = this.#resolveSingleTarget(step.parameters.target, context);
      const skillCastId = step.parameters.sameSourceSkillCast
        ? this.#requireSkillCastId(context, 'readBuffStackCount')
        : undefined;
      const count =
        step.parameters.countType === 'instance'
          ? (() => {
              if (skillCastId !== undefined) {
                throw new Error(
                  'readBuffStackCount instance mode does not support sameSourceSkillCast',
                );
              }
              if (step.parameters.query.kind === 'id') {
                if (target.getInstanceCountByIds === undefined) {
                  throw new Error(
                    'readBuffStackCount ID instance mode requires Buff instance counting',
                  );
                }
                return target.getInstanceCountByIds(step.parameters.query.buffIds);
              }
              if (
                step.parameters.query.kind !== 'tag' ||
                target.getInstanceCountByTags === undefined
              ) {
                throw new Error(
                  'readBuffStackCount instance mode requires a tag query and Buff instance counting',
                );
              }
              return target.getInstanceCountByTags(
                step.parameters.query.buffTags,
                step.parameters.query.tagQueryType,
              );
            })()
          : step.parameters.query.kind === 'tag'
            ? target.getCountByTags(
                step.parameters.query.buffTags,
                step.parameters.query.tagQueryType,
                false,
                skillCastId,
              )
            : // 原生 Save 的 Id 分支逐项求和，重复 ID 也重复计入；不做集合去重。
              step.parameters.query.buffIds.reduce(
                (sum, id) => sum + target.getCountByIds([id], skillCastId),
                0,
              );
      context.blackboard.assignDynamic(step.parameters.outputKey, count);
      return true;
    }

    if (step.kind === 'finishBuffsByTag') {
      const target = this.#resolveSingleTarget(step.parameters.target, context);
      const tags = step.parameters.buffTags;
      if (step.parameters.count === undefined) {
        target.finishByTags(tags, step.parameters.tagQueryType, step.parameters.reason);
      } else {
        if (context === undefined) {
          throw new Error('finishBuffsByTag runtime count requires a combat operation context');
        }
        const count = resolveActionValueOperand(step.parameters.count, context.blackboard);
        if (target.finishCountByTags === undefined) {
          throw new Error('finishBuffsByTag count requires a count-aware Buff target');
        }
        target.finishCountByTags(tags, step.parameters.tagQueryType, count, step.parameters.reason);
      }
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

    if (step.kind === 'setCurrentBuffTimePaused') {
      if (context?.setCurrentBuffTimePaused === undefined) {
        throw new Error('setCurrentBuffTimePaused requires a Buff operation context');
      }
      context.setCurrentBuffTimePaused(step.parameters.paused);
      return true;
    }

    if (step.kind === 'igniteBuffs') {
      const target = this.#resolveSingleTarget(step.parameters.target, context);
      if (target.ignite === undefined) {
        throw new Error(`Buff target '${target.ownerId}' does not support ignite events`);
      }
      const sourceId =
        step.parameters.source === 'currentBuffSource'
          ? context?.buffSourceId
          : this.#resolveSingleTarget(step.parameters.source, context).ownerId;
      if (sourceId === undefined) {
        throw new Error('igniteBuffs current Buff source requires a Buff operation context');
      }
      target.ignite(step.parameters.igniteType, sourceId, context?.skillCastInfo);
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

    if (step.kind === 'inheritBuffById') {
      if (this.#inheritedBuffs.has(step)) {
        throw new Error('inheritBuffById step is already active');
      }
      const target = this.dependencies.resolveTarget(step.parameters.target);
      if (target.findFirstHandleByIds === undefined) {
        throw new Error(`Buff target '${target.ownerId}' cannot expose stable instance handles`);
      }
      const handle = target.findFirstHandleByIds([step.parameters.buffId]);
      if (handle === undefined) return true;
      if (context?.detachBuffFromCurrentSkill === undefined) {
        throw new Error('inheritBuffById requires a current-skill detachment port');
      }
      context.detachBuffFromCurrentSkill(handle);
      this.#inheritedBuffs.set(step, handle);
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
    if (target === 'eventSource') {
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('eventSource Buff application is not configured');
      }
      return [resolve(this.#requireEventSourceId(context))];
    }
    if (target === 'buffOwner') {
      if (context?.buffOwnerId === undefined) {
        throw new Error('buffOwner Buff application requires a Buff lifecycle context');
      }
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('buffOwner Buff application is not configured');
      }
      return [resolve(context.buffOwnerId)];
    }
    if (target === 'buffSource') {
      if (context?.buffSourceId === undefined) {
        throw new Error('buffSource Buff application requires a Buff lifecycle context');
      }
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('buffSource Buff application is not configured');
      }
      return [resolve(context.buffSourceId)];
    }
    if (target === 'eventTarget') {
      if (context?.event === undefined) {
        throw new Error('eventTarget Buff application requires an event context');
      }
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('eventTarget Buff application is not configured');
      }
      const eventTargetId =
        'targetId' in context.event
          ? context.event.targetId
          : context.event.kind === 'operatorHealed'
            ? context.event.targetOperatorId
            : context.event.kind === 'operatorHit'
              ? context.event.targetOperatorId
              : undefined;
      if (eventTargetId === undefined) {
        throw new Error(`event '${context.event.kind}' does not expose a Buff target`);
      }
      return [resolve(eventTargetId)];
    }
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
    if (target === 'currentTarget') {
      if (context?.currentTarget?.kind !== 'operator') {
        throw new Error('currentTarget Buff application requires a current operator target');
      }
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('currentTarget Buff application is not configured');
      }
      return [resolve(context.currentTarget.operatorId)];
    }
    const resolved = this.dependencies.resolveApplicationTargets?.(target);
    if (resolved !== undefined) return resolved;
    if (
      target === 'party' ||
      target === 'partyExceptCaster' ||
      target === 'partyExceptCasterAndSameCharacterType' ||
      target === 'controlledOperator' ||
      target === 'casterAndControlledOperator' ||
      target === 'casterAndLowestHealthRatioOperatorExceptCaster'
    ) {
      throw new Error('collection Buff application requires a collection target resolver');
    }
    return [this.dependencies.resolveTarget(target)];
  }

  #resolveApplicationSource(
    source: NonNullable<Extract<RuntimeOperation, { kind: 'applyBuff' }>['parameters']['source']>,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): BuffOperationTarget {
    if (source === 'buffSource' || source === 'buffOwner') {
      const id = source === 'buffSource' ? context?.buffSourceId : context?.buffOwnerId;
      if (id === undefined)
        throw new Error(`${source} Buff source requires a Buff lifecycle context`);
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) throw new Error(`${source} Buff source is not configured`);
      return resolve(id);
    }
    if (source === 'eventSource') {
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('eventSource Buff source is not configured');
      }
      return resolve(this.#requireEventSourceId(context));
    }
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
    if (step.kind === 'inheritBuffById') {
      const handle = this.#inheritedBuffs.get(step);
      this.#inheritedBuffs.delete(step);
      if (handle === undefined) return;
      const hasNextSkill = context?.pendingNextSkillId !== undefined;
      const inherited =
        hasNextSkill && step.parameters.inheritToNextSkillIds.includes(context.pendingNextSkillId!);
      const followsNextSkill = hasNextSkill && step.parameters.finishWithNextSkillIfNotInherited;
      if (inherited || followsNextSkill) {
        if (context?.attachBuffToNextSkill === undefined) {
          throw new Error('inheritBuffById requires a next-skill attachment port');
        }
        context.attachBuffToNextSkill(handle);
      } else if (step.parameters.finishByAction) {
        handle.finish('other');
      }
      return;
    }
    if (step.kind === 'applyBuff' && step.parameters.finishByAction === true) {
      const handles = this.#actionDurationBuffs.get(step) ?? [];
      const inherited =
        context?.pendingNextSkillId !== undefined &&
        step.parameters.inheritToNextSkillIds?.includes(context.pendingNextSkillId) === true;
      if (inherited) {
        if (
          context.detachBuffFromCurrentSkill === undefined ||
          context.attachBuffToNextSkill === undefined
        ) {
          throw new Error('inherited action-duration Buff requires a next-skill attachment port');
        }
        for (const handle of handles) {
          context.detachBuffFromCurrentSkill(handle);
          context.attachBuffToNextSkill(handle);
        }
      } else {
        for (const handle of handles) handle.finish('other');
      }
      this.#actionDurationBuffs.delete(step);
      for (const exit of step.parameters.onActionEndBuffs ?? []) {
        this.execute(
          {
            kind: 'applyBuff',
            parameters: exit,
          },
          context,
        );
      }
      return;
    }
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    if (condition.kind === 'contextTargetBuffStackCompare') {
      if (context?.targetContext === undefined)
        throw new Error('context Buff count requires a combat target context');
      const first = context.targetContext.getOptional(condition.contextKey)?.[0];
      if (first === undefined) return false;
      if (first.kind === 'spatialPoint') {
        throw new Error('spatial Context targets cannot own Buffs');
      }
      const target =
        first.kind === 'abilityEntity'
          ? this.dependencies.resolveCurrentAbilityEntityTarget?.(first)
          : this.dependencies.resolveEventTarget?.(
              first.kind === 'enemy' ? 'enemy' : first.operatorId,
            );
      if (target === undefined) throw new Error('context Buff count requires a target resolver');
      const count = target.getCountByTags(condition.buffTags, condition.tagQueryType);
      return compareCombatNumbers(
        count,
        resolveActionValueOperand(condition.value, context.blackboard),
        condition.operator,
      );
    }
    if (condition.kind === 'eventTargetBuffCountCompare') {
      if (context?.event === undefined || !('targetId' in context.event)) {
        throw new Error('eventTargetBuffCountCompare requires an event target identity');
      }
      const resolveTarget = this.dependencies.resolveEventTarget;
      if (resolveTarget === undefined) {
        throw new Error('eventTargetBuffCountCompare requires an event target resolver');
      }
      const target = resolveTarget(context.event.targetId);
      if (target.getInstanceCountByTags === undefined) {
        throw new Error('eventTargetBuffCountCompare requires Buff instance counting');
      }
      const count = target.getInstanceCountByTags(condition.buffTags, condition.tagQueryType);
      return compareCombatNumbers(
        count,
        resolveActionValueOperand(condition.value, context.blackboard),
        condition.operator,
      );
    }
    if (condition.kind === 'buffStackCompare') {
      if (context === undefined) {
        throw new Error('buffStackCompare requires a combat operation context');
      }
      const count = this.#resolveSingleTarget(condition.target, context).getCountByTags(
        condition.buffTags,
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
    if (condition.kind === 'buffTagIdCountCompare') {
      if (context === undefined) {
        throw new Error('buffTagIdCountCompare requires a combat operation context');
      }
      const target = this.#resolveSingleTarget(condition.target, context);
      if (target.getDistinctIdCountByTags === undefined) {
        throw new Error('buffTagIdCountCompare requires distinct Buff ID counting');
      }
      const count = target.getDistinctIdCountByTags(condition.buffTags, condition.tagQueryType);
      return compareCombatNumbers(
        count,
        resolveActionValueOperand(condition.value, context.blackboard),
        condition.operator,
      );
    }
    if (condition.kind === 'currentBuffStackCompare') {
      if (context?.getCurrentBuffEnhanceCount === undefined) {
        throw new Error('currentBuffStackCompare requires a Buff operation context');
      }
      return compareCombatNumbers(
        context.getCurrentBuffEnhanceCount(),
        resolveActionValueOperand(condition.value, context.blackboard),
        condition.operator,
      );
    }
    if (condition.kind === 'entityTagMatch') {
      return this.#resolveSingleTarget(condition.target, context).matchesEntityTags(
        condition.tags,
        condition.tagQueryType,
      );
    }
    if (condition.kind === 'buffIdStackCompare') {
      const count = this.#resolveSingleTarget(condition.target, context).getCountByIds(
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
    target:
      | CombatTarget
      | 'currentAbilityEntity'
      | 'eventTarget'
      | 'eventSource'
      | 'controlledOperator'
      | 'buffOwner'
      | 'buffSource'
      | 'currentTarget',
    context: Parameters<CombatOperationExecutor['execute']>[1],
  ): BuffOperationTarget {
    if (target === 'eventSource') {
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('eventSource Buff operation is not configured');
      }
      return resolve(this.#requireEventSourceId(context));
    }
    if (target === 'buffOwner') {
      if (context?.buffOwnerId === undefined) {
        throw new Error('buffOwner Buff operation requires a Buff lifecycle context');
      }
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('buffOwner Buff operation is not configured');
      }
      return resolve(context.buffOwnerId);
    }
    if (target === 'buffSource') {
      if (context?.buffSourceId === undefined) {
        throw new Error('buffSource Buff operation requires a Buff lifecycle context');
      }
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('buffSource Buff operation is not configured');
      }
      return resolve(context.buffSourceId);
    }
    if (target === 'eventTarget') {
      if (context?.event === undefined) {
        throw new Error('eventTarget Buff operation requires an event context');
      }
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) {
        throw new Error('eventTarget Buff operation is not configured');
      }
      const eventTargetId =
        'targetId' in context.event
          ? context.event.targetId
          : context.event.kind === 'operatorHealed'
            ? context.event.targetOperatorId
            : context.event.kind === 'operatorHit'
              ? context.event.targetOperatorId
              : undefined;
      if (eventTargetId === undefined) {
        throw new Error(`event '${context.event.kind}' does not expose a Buff target`);
      }
      return resolve(eventTargetId);
    }
    if (target === 'currentTarget') {
      if (context?.currentTarget?.kind !== 'operator') {
        throw new Error('currentTarget Buff operation requires a current operator target');
      }
      const resolve = this.dependencies.resolveEventTarget;
      if (resolve === undefined) throw new Error('currentTarget Buff operation is not configured');
      return resolve(context.currentTarget.operatorId);
    }
    if (target === 'controlledOperator') {
      const targets = this.dependencies.resolveApplicationTargets?.(target) ?? [];
      if (targets.length !== 1) {
        throw new Error('controlledOperator Buff query must resolve to exactly one target');
      }
      return targets[0]!;
    }
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

  #requireEventSourceId(context: Parameters<CombatOperationExecutor['execute']>[1]): string {
    const event = context?.event;
    if (event === undefined) {
      if (context?.actionSourceId !== undefined) return context.actionSourceId;
      if (context?.buffSourceId !== undefined) return context.buffSourceId;
      throw new Error('eventSource Buff operation requires an event or Buff source context');
    }
    if ('sourceId' in event && typeof event.sourceId === 'string') return event.sourceId;
    if ('sourceOperatorId' in event && typeof event.sourceOperatorId === 'string') {
      return event.sourceOperatorId;
    }
    throw new Error(`event '${event.kind}' does not expose a Buff source`);
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
