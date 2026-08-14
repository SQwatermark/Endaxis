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
  BuffLifecycleOperationSource,
  BuffOperationTarget,
  BuffQueryResult,
} from './buffOperationExecutor';
import type { GameplayTagId, GameplayTagQueryType } from '../tags/gameplayTags';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import type { FrameRuntime } from './combatSimulation';
import { attachBuffLifecycleSequences } from './buffLifecycleSequenceRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

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
  constructor(
    readonly container: CombatBuffContainer<Key>,
    readonly definitions: CombatBuffDefinitionResolver<Key>,
  ) {}

  get ownerId(): string {
    return this.container.ownerId;
  }

  get entityBlackboard() {
    return this.container.entityBlackboard;
  }

  apply(request: BuffApplicationRequest): boolean {
    const definition =
      request.definition === undefined
        ? this.definitions.get(request.buffId)
        : this.#compileInlineDefinition(request.buffId, request.definition);
    if (definition === undefined) throw new Error(`unknown combat buff '${request.buffId}'`);
    return (
      this.container.add(definition, request.sourceId, {
        blackboardValues: request.blackboardValues,
        ...(request.skillCastInfo === undefined ? {} : { skillCastInfo: request.skillCastInfo }),
      }) !== null
    );
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
    // 显示信息随技能定义保存，但不进入战斗运行时。
    const { presentation: _presentation, lifecycleSequences, ...runtimeDefinition } = source;
    if (lifecycleSequences !== undefined && this.#resolveLifecycleOperations === null) {
      throw new Error(
        `combat buff '${id}' has lifecycle sequences, but no Buff sequence runtime is configured`,
      );
    }
    if (lifecycleSequences === undefined && this.definitions.compile === undefined) {
      throw new Error(
        `combat buff '${id}' uses an inline definition, but no compiler is configured`,
      );
    }
    if (this.definitions.compile === undefined) {
      throw new Error(
        `combat buff '${id}' uses an inline definition, but no compiler is configured`,
      );
    }
    const entry: CombatBuffDefinitionEntry = { id, ...runtimeDefinition };
    const baseDefinition = this.definitions.compile(entry);
    const definition =
      lifecycleSequences === undefined
        ? baseDefinition
        : attachBuffLifecycleSequences(baseDefinition, lifecycleSequences, buff =>
            this.#resolveLifecycleOperations!(buff),
          );
    this.#inlineDefinitions.set(source, definition);
    return definition;
  }

  advanceFrame(): void {
    this.container.tick(COMBAT_FRAME_INTERVAL);
  }

  getCountByIds(ids: readonly string[]): number {
    return this.container.getCountByIds(ids);
  }

  findFirstByIds(ids: readonly string[]): BuffQueryResult | undefined {
    return this.container.findFirstByIds(ids);
  }

  finishByIds(ids: readonly string[], reason: BuffFinishReason): number {
    return this.container.finishByIds(ids, reason);
  }

  holdByIds(ids: readonly string[]): { release(): void } {
    return this.container.holdByIds(ids);
  }

  getCountByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): number {
    return this.container.getCountByTags(tags, type, exact);
  }

  matchesEntityTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): boolean {
    return this.container.matchesEntityTags(tags, type, exact);
  }

  findFirstByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): BuffQueryResult | undefined {
    return this.container.findFirstByTags(tags, type, exact);
  }

  finishByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    reason: BuffFinishReason,
    exact?: boolean,
  ): number {
    return this.container.finishByTags(tags, type, reason, exact);
  }
}
