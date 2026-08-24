import { requireArray, requireExactFields, requireInteger, requireRecord } from './primitives.ts';

export type TagQueryType = 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';

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

  const tagIds = requireArray(query.tags, `${path}.tags`).map((rawTag, index) => {
    const tagPath = `${path}.tags[${index}]`;
    const tag = requireRecord(rawTag, tagPath);
    requireExactFields(tag, new Set(['tagId']), tagPath);
    return requireInteger(tag.tagId, `${tagPath}.tagId`);
  });
  return { queryType, tagIds };
}
