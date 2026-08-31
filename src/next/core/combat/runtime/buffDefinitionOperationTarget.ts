/**
 * 把只读 Buff 定义与单场战斗的 Buff 容器组合成技能操作端口。
 * 定义负责稳定身份解析，容器只持有实例；未知身份必须在施加点明确失败。
 */
import {
  CombatBuffContainer,
  type BuffFinishReason,
  type CombatBuffDefinition,
} from '../buffs/combatBuffs';
import type { CombatBuffDefinitionEntry } from '../buffs/combatBuffDefinitions';
import type { ResolvedSkillBuffDefinition } from '../../compiler/combatProgram';
import type {
  BuffApplicationRequest,
  BuffApplicationHandle,
  BuffAppliedEvent,
  BuffConsumedEvent,
  BuffLifecycleOperationSource,
  BuffOperationTarget,
  BuffQueryResult,
} from './buffOperationExecutor';
import type { GameplayTag, GameplayTagQueryType } from '../tags/gameplayTags';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import type { FrameRuntime } from './combatSimulation';
import {
  attachBuffLifecycleSequences,
  type RegisterBuffAbilityEventAction,
  type RegisterBuffSemanticEventAction,
} from './buffLifecycleSequenceRuntime';
import type { CombatOperationExecutor } from './skillRuntime';
import type { AbilityTickDeltas } from './timeDilationRuntime';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';

export interface CombatBuffDefinitionResolver<Key extends string> {
  get(id: string): CombatBuffDefinition<Key> | undefined;
  compile?(entry: CombatBuffDefinitionEntry): CombatBuffDefinition<Key>;
}

export class BuffDefinitionOperationTarget<Key extends string>
  implements BuffOperationTarget, FrameRuntime
{
  readonly #inlineDefinitions = new WeakMap<
    ResolvedSkillBuffDefinition,
    CombatBuffDefinition<Key>
  >();
  #resolveLifecycleOperations:
    ((source: BuffLifecycleOperationSource) => CombatOperationExecutor) | null = null;
  #buffAppliedObserver: ((event: BuffAppliedEvent) => void) | null = null;
  #registerSemanticEventAction: RegisterBuffSemanticEventAction | null = null;
  constructor(
    readonly container: CombatBuffContainer<Key>,
    readonly definitions: CombatBuffDefinitionResolver<Key>,
    readonly currentTarget?: RuntimeTargetRef,
    readonly registerAbilityEventAction?: RegisterBuffAbilityEventAction,
    readonly onBuffApplied?: (event: BuffAppliedEvent) => void,
    readonly onBeforeBuffApplied?: (event: BuffAppliedEvent) => void,
    readonly onOutputBuff?: (event: BuffAppliedEvent) => void,
    readonly onBeforeBuffAdded?: (event: BuffAppliedEvent) => void,
  ) {}

  get ownerId(): string {
    return this.container.ownerId;
  }

  get entityBlackboard() {
    return this.container.entityBlackboard;
  }

  getAttributeValue(attribute: string): number {
    return this.container.attributes.get(attribute as Key);
  }

  apply(request: BuffApplicationRequest): boolean {
    return this.#apply(request) !== null;
  }

  applyScoped(request: BuffApplicationRequest): BuffApplicationHandle | null {
    // 返回稳定的实例句柄，使重复施加/刷新后的 Skill.AttachBuff 可以按身份去重。
    return this.#apply(request);
  }

  #apply(request: BuffApplicationRequest) {
    const definition =
      request.definition === undefined
        ? this.definitions.get(request.buffId)
        : this.#compileInlineDefinition(request.buffId, request.definition);
    if (definition === undefined) throw new Error(`unknown combat buff '${request.buffId}'`);
    const event: BuffAppliedEvent = {
      targetId: this.ownerId,
      buffId: request.buffId,
      sourceId: request.sourceId,
      buffTags: definition.applyTags ?? [],
      skillCastInfo: request.skillCastInfo ?? null,
    };
    // 原生 OnBeforeOutputBuff 在来源 AbilitySystem 上同步发布，且早于目标 Buff 实例创建。
    this.onBeforeBuffApplied?.(event);
    // 原生 OnBeforeAddedBuff 随后在接收目标 AbilitySystem 上同步发布，仍早于实例创建。
    this.onBeforeBuffAdded?.(event);
    return this.container.add(
      definition,
      request.sourceId,
      {
        blackboardValues: request.blackboardValues,
        sourceActionId: request.sourceActionId ?? request.buffId,
        definitionOwnerId: request.definitionOwnerId ?? request.sourceId,
        ...(request.skillCastInfo === undefined ? {} : { skillCastInfo: request.skillCastInfo }),
        ...(request.finishParentGlobalBuff === undefined
          ? {}
          : { finishParentGlobalBuff: request.finishParentGlobalBuff }),
        ...(request.getSourceAttributeValue === undefined
          ? {}
          : { getSourceAttributeValue: request.getSourceAttributeValue }),
      },
      () => {
        // 接收侧 Added → 来源侧 Output → 容器执行已有关键词增强。
        this.onBuffApplied?.(event);
        this.#buffAppliedObserver?.(event);
        this.onOutputBuff?.(event);
      },
    );
  }

  configureBuffAppliedObserver(observer: (event: BuffAppliedEvent) => void): void {
    if (this.#buffAppliedObserver !== null) {
      throw new Error(`combat Buff runtime '${this.ownerId}' applied observer is configured`);
    }
    this.#buffAppliedObserver = observer;
  }

  configureBuffConsumedObserver(observer: (event: BuffConsumedEvent) => void): void {
    this.container.configureConsumedObserver((buff, sourceOperatorId, layers) =>
      observer({
        sourceOperatorId,
        targetId: this.container.ownerId,
        buffId: buff.definition.id,
        layers,
        buffTags: buff.definition.applyTags ?? [],
        blackboardValues: buff.blackboard.snapshot(),
      }),
    );
  }

  configureSemanticEventAction(register: RegisterBuffSemanticEventAction): void {
    if (this.#registerSemanticEventAction !== null) {
      throw new Error(`combat Buff runtime '${this.ownerId}' semantic events are configured`);
    }
    this.#registerSemanticEventAction = register;
  }

  /**
   * 场景装配完成后绑定生命周期步骤使用的完整操作链。
   * 同一运行时只能配置一次，避免定义缓存跨装配规则混用。
   */
  configureLifecycleOperations(
    resolveOperations: (source: BuffLifecycleOperationSource) => CombatOperationExecutor,
  ): void {
    if (this.#resolveLifecycleOperations !== null) {
      throw new Error(`combat Buff runtime '${this.ownerId}' lifecycle operations are configured`);
    }
    this.#resolveLifecycleOperations = resolveOperations;
  }

  #compileInlineDefinition(
    id: string,
    source: ResolvedSkillBuffDefinition,
  ): CombatBuffDefinition<Key> {
    const cached = this.#inlineDefinitions.get(source);
    if (cached !== undefined) return cached;
    const {
      presentation,
      scheduledSequences,
      lifecycleSequences,
      abilityEventResponses,
      igniteEventResponses,
      skillSlotReplacements,
      ...runtimeDefinition
    } = source;
    if (
      (scheduledSequences !== undefined ||
        lifecycleSequences !== undefined ||
        abilityEventResponses !== undefined ||
        igniteEventResponses !== undefined ||
        skillSlotReplacements !== undefined) &&
      this.#resolveLifecycleOperations === null
    ) {
      throw new Error(
        `combat buff '${id}' has runtime sequences, but no Buff sequence runtime is configured`,
      );
    }
    if (
      scheduledSequences === undefined &&
      lifecycleSequences === undefined &&
      abilityEventResponses === undefined &&
      igniteEventResponses === undefined &&
      skillSlotReplacements === undefined &&
      this.definitions.compile === undefined
    ) {
      throw new Error(
        `combat buff '${id}' uses an inline definition, but no compiler is configured`,
      );
    }
    if (this.definitions.compile === undefined) {
      throw new Error(
        `combat buff '${id}' uses an inline definition, but no compiler is configured`,
      );
    }
    const { maxStackCount, ...staticRuntimeDefinition } = runtimeDefinition;
    const entry: CombatBuffDefinitionEntry = {
      id,
      ...staticRuntimeDefinition,
      ...(typeof maxStackCount === 'number' ? { maxStackCount } : {}),
    };
    const compiledBaseDefinition = this.definitions.compile(entry);
    const compiledDefinitionWithPresentation =
      presentation === undefined
        ? compiledBaseDefinition
        : { ...compiledBaseDefinition, presentation };
    const baseDefinition =
      maxStackCount !== undefined && typeof maxStackCount !== 'number'
        ? { ...compiledDefinitionWithPresentation, maxStackCount }
        : compiledDefinitionWithPresentation;
    const definition =
      scheduledSequences === undefined &&
      lifecycleSequences === undefined &&
      abilityEventResponses === undefined &&
      igniteEventResponses === undefined &&
      skillSlotReplacements === undefined
        ? baseDefinition
        : attachBuffLifecycleSequences(
            baseDefinition,
            lifecycleSequences ?? {},
            (buff, actionSourceId = buff.sourceId, skillCastInfo = buff.skillCastInfo) =>
              this.#resolveLifecycleOperations!({
                ownerId: buff.owner.ownerId,
                sourceId: actionSourceId,
                definitionOwnerId: buff.definitionOwnerId,
                sourceActionId: buff.sourceActionId,
                skillCastInfo,
              }),
            this.currentTarget,
            abilityEventResponses,
            this.registerAbilityEventAction,
            scheduledSequences,
            igniteEventResponses,
            skillSlotReplacements,
            this.#registerSemanticEventAction ?? undefined,
          );
    this.#inlineDefinitions.set(source, definition);
    return definition;
  }

  advanceFrame(): void {
    this.container.tick(COMBAT_FRAME_INTERVAL);
  }

  /** AbilitySystem 提供四路时钟后，由各 Buff 定义自行选择其生命周期时间域。 */
  advanceWithDeltas(deltas: AbilityTickDeltas): void {
    this.container.tick(deltas);
  }

  finishAll(reason: BuffFinishReason = 'other'): number {
    return this.container.finishAll(reason);
  }

  getCountByIds(ids: readonly string[]): number {
    return this.container.getCountByIds(ids);
  }

  getInstanceCountByIds(ids: readonly string[]): number {
    return this.container.getInstanceCountByIds(ids);
  }

  findFirstByIds(ids: readonly string[]): BuffQueryResult | undefined {
    return this.container.findFirstByIds(ids);
  }

  findFirstHandleByIds(ids: readonly string[]): BuffApplicationHandle | undefined {
    return this.container.findFirstByIds(ids);
  }

  finishByIds(ids: readonly string[], reason: BuffFinishReason): number {
    return this.container.finishByIds(ids, reason);
  }

  finishCountByIds(ids: readonly string[], count: number, reason: BuffFinishReason): number {
    return this.container.finishCountByIds(ids, count, reason);
  }

  ignite(igniteType: string, sourceId: string, skillCastInfo?: CombatSkillCastInfo): number {
    return this.container.ignite(igniteType, sourceId, skillCastInfo);
  }

  holdByIds(ids: readonly string[]): { release(): void } {
    return this.container.holdByIds(ids);
  }

  getCountByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): number {
    return this.container.getCountByTags(tags, type, exact);
  }

  getDistinctIdCountByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): number {
    return this.container.getDistinctIdCountByTags(tags, type, exact);
  }

  getInstanceCountByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): number {
    return this.container.getInstanceCountByTags(tags, type, exact);
  }

  matchesEntityTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): boolean {
    return this.container.matchesEntityTags(tags, type, exact);
  }

  matchesTags(
    ownedTags: readonly GameplayTag[],
    requiredTags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): boolean {
    return this.container.matchesTags(ownedTags, requiredTags, type, exact);
  }

  findFirstByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): BuffQueryResult | undefined {
    return this.container.findFirstByTags(tags, type, exact);
  }

  finishByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    reason: BuffFinishReason,
    exact?: boolean,
  ): number {
    return this.container.finishByTags(tags, type, reason, exact);
  }

  finishCountByTags(
    tags: readonly GameplayTag[],
    type: GameplayTagQueryType,
    count: number,
    reason: BuffFinishReason,
    exact?: boolean,
  ): number {
    return this.container.finishCountByTags(tags, type, count, reason, exact);
  }
}
