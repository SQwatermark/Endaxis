/**
 * 把只读 Buff 目录与单场战斗的 Buff 容器组合成技能操作端口。
 * 目录负责稳定身份解析，容器只持有实例；未知身份必须在施加点明确失败。
 */
import {
  CombatBuffContainer,
  type BuffFinishReason,
  type CombatBuffDefinition,
} from '../buffs/combatBuffs';
import type {
  BuffApplicationRequest,
  BuffOperationTarget,
  BuffQueryResult,
} from './buffOperationExecutor';
import type { GameplayTagId, GameplayTagQueryType } from '../tags/gameplayTags';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import type { FrameRuntime } from './combatSimulation';

export interface CombatBuffDefinitionResolver<Key extends string> {
  get(id: string): CombatBuffDefinition<Key> | undefined;
}

export class CatalogBuffOperationTarget<Key extends string>
  implements BuffOperationTarget, FrameRuntime
{
  constructor(
    readonly container: CombatBuffContainer<Key>,
    readonly definitions: CombatBuffDefinitionResolver<Key>,
  ) {}

  apply(request: BuffApplicationRequest): boolean {
    const definition = this.definitions.get(request.buffId);
    if (definition === undefined) throw new Error(`unknown combat buff '${request.buffId}'`);
    return (
      this.container.add(definition, request.sourceId, {
        blackboardValues: request.blackboardValues,
      }) !== null
    );
  }

  advanceFrame(): void {
    this.container.tick(COMBAT_FRAME_INTERVAL);
  }

  getCountByIds(ids: readonly string[]): number {
    return this.container.getCountByIds(ids);
  }

  finishByIds(ids: readonly string[], reason: BuffFinishReason): number {
    return this.container.finishByIds(ids, reason);
  }

  getCountByTags(
    tags: readonly GameplayTagId[],
    type: GameplayTagQueryType,
    exact?: boolean,
  ): number {
    return this.container.getCountByTags(tags, type, exact);
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
