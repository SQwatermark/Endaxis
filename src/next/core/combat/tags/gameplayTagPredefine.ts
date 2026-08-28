import type {
  GameplayTagPredefineDefinition,
  GameplayTagQueryDefinition,
} from '../../../../../packages/game-data-contract/src/gameplayTags';
import type { CombatBuffContainer } from '../buffs/combatBuffs';
import { assertGameplayTag, type GameplayTag } from './gameplayTags';

/** 复用实体当前的标签存储，不另建一套与 Buff/条件查询分离的控制状态标签。 */
type EntityTags = Pick<
  CombatBuffContainer<string>,
  'hasEntityTag' | 'matchesEntityTags' | 'addEntityTags' | 'removeEntityTags'
>;

/** 原生 Entity.CanAddTag / 预定义标签操作；本对象只有配置，实体可变状态由调用者持有。 */
export class GameplayTagPredefine {
  readonly #tags: ReadonlyMap<string, GameplayTag>;
  readonly #queries: ReadonlyMap<string, GameplayTagQueryDefinition>;
  readonly #immunity: ReadonlyMap<GameplayTag, GameplayTagQueryDefinition>;

  constructor(definition: GameplayTagPredefineDefinition) {
    Object.values(definition.tags).forEach(assertGameplayTag);
    this.#tags = new Map(Object.entries(definition.tags));
    Object.values(definition.queries).forEach(query => query.tags.forEach(assertGameplayTag));
    this.#queries = new Map(Object.entries(definition.queries));
    const immunity = new Map<GameplayTag, GameplayTagQueryDefinition>();
    for (const entry of definition.immunityQueries) {
      const tag = entry.tag;
      assertGameplayTag(tag);
      entry.query.tags.forEach(assertGameplayTag);
      if (immunity.has(tag)) throw new Error(`duplicate immunity tag ${tag}`);
      immunity.set(tag, entry.query);
    }
    this.#immunity = immunity;
  }

  getTag(name: string): GameplayTag {
    const tag = this.#tags.get(name);
    if (tag === undefined) throw new Error(`missing predefined gameplay tag '${name}'`);
    return tag;
  }

  getQuery(name: string): GameplayTagQueryDefinition {
    const query = this.#queries.get(name);
    if (query === undefined) throw new Error(`missing predefined gameplay tag query '${name}'`);
    return query;
  }

  canAddTag(entity: EntityTags, tag: GameplayTag): boolean {
    const query = this.#immunity.get(tag);
    return query === undefined || !entity.matchesEntityTags(query.tags, query.queryType);
  }

  /** 安装时重新准入；先前 Before 成功不保证事件回调之后仍能安装。 */
  addTagIfNotHaving(entity: EntityTags, name: string): void {
    const tag = this.getTag(name);
    if (!entity.hasEntityTag(tag) && this.canAddTag(entity, tag)) entity.addEntityTags([tag]);
  }

  /** 与原生控制组件退出一致：移除一次已有计数，不假造“只删自己”的句柄。 */
  removeTagIfHaving(entity: EntityTags, name: string): void {
    const tag = this.getTag(name);
    if (entity.hasEntityTag(tag)) entity.removeEntityTags([tag]);
  }
}
