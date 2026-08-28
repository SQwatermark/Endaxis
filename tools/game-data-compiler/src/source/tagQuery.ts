import { requireArray, requireExactFields, requireInteger, requireRecord } from './primitives.ts';
import type { GameplayTagQueryType } from '../../../../packages/game-data-contract/src/gameplayTags.ts';

export type TagQueryType = GameplayTagQueryType;
/** 来源解析保留原生身份；不可作为公开契约输出。 */
export interface TagQuerySource {
  readonly queryType: TagQueryType;
  readonly tagIds: readonly number[];
}

const QUERY_TYPES: Readonly<Record<string, TagQueryType>> = {
  HasAny: 'hasAny',
  HasAll: 'hasAll',
  ExceptAny: 'exceptAny',
  ExceptAll: 'exceptAll',
};

/** 读取 GameplayTag 查询；这里只保留原生 ID，不为 ID 猜测显示语义。 */
export function parseTagQuerySource(value: unknown, path: string): TagQuerySource {
  const query = requireRecord(value, path);
  requireExactFields(query, new Set(['queryType', 'tags']), path);

  const rawQueryType = query.queryType;
  const queryType = typeof rawQueryType === 'string' ? QUERY_TYPES[rawQueryType] : undefined;
  if (!queryType) {
    throw new Error(`${path}.queryType: unsupported value ${JSON.stringify(rawQueryType)}`);
  }

  return { queryType, tagIds: parseTagIdsSource(query.tags, `${path}.tags`) };
}

/** 原生缓存查询在 GameplayTagPredefineTable 中使用 Int32 枚举，动作 JSON 使用名称。 */
export function parseCachedTagQuerySource(value: unknown, path: string): TagQuerySource {
  const query = requireRecord(value, path);
  requireExactFields(query, new Set(['queryType', 'tags']), path);
  const queryType = requireInteger(query.queryType, `${path}.queryType`);
  const kinds = ['hasAny', 'hasAll', 'exceptAny', 'exceptAll'] as const;
  const kind = kinds[queryType];
  if (kind === undefined) throw new Error(`${path}.queryType: unsupported value ${queryType}`);
  return { queryType: kind, tagIds: parseTagIdsSource(query.tags, `${path}.tags`) };
}

export function parseTagIdsSource(value: unknown, path: string): number[] {
  return requireArray(value, path).map((rawTag, index) => {
    return parseTagIdSource(rawTag, `${path}[${index}]`);
  });
}

export function parseTagIdSource(value: unknown, path: string): number {
  const tag = requireRecord(value, path);
  requireExactFields(tag, new Set(['tagId']), path);
  const id = requireInteger(tag.tagId, `${path}.tagId`);
  if (id < -0x80000000 || id > 0x7fffffff) {
    throw new Error(`${path}.tagId: expected signed 32-bit integer`);
  }
  return id;
}
