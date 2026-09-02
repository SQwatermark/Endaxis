/** 可读完整路径是标签的唯一公开身份；原生数字 ID/CRC 仅属于转换器来源层。 */
export type GameplayTag = string;

/** 验证自定义定义和反序列化边界；数字串和伪造的 unknown 占位符不是标签。 */
export function assertGameplayTag(value: unknown): asserts value is GameplayTag {
  if (
    typeof value !== 'string' ||
    value.trim() !== value ||
    value.split('/').some(segment => !segment || !/[\p{L}_]/u.test(segment)) ||
    /^(?:unknown|unresolved)(?:[:/]|$)/i.test(value)
  ) {
    throw new Error(`GameplayTag 必须是可读路径：${JSON.stringify(value)}`);
  }
}

/** 标签查询与准入配置的唯一数据契约；不保存可变标签计数或运行时索引。 */
export const GAMEPLAY_TAG_QUERY_TYPES = ['hasAny', 'hasAll', 'exceptAny', 'exceptAll'] as const;
export type GameplayTagQueryType = (typeof GAMEPLAY_TAG_QUERY_TYPES)[number];

/** 事件载荷匹配比普通标签查询多一个“集合完全相等”语义。 */
export const GAMEPLAY_TAG_MATCH_TYPES = ['exact', ...GAMEPLAY_TAG_QUERY_TYPES] as const;
export type GameplayTagMatchType = (typeof GAMEPLAY_TAG_MATCH_TYPES)[number];

export interface GameplayTagQueryDefinition {
  readonly queryType: GameplayTagQueryType;
  readonly tags: readonly GameplayTag[];
}

/** 原生预定义标签枚举名称对应可读路径；不携带原生枚举值或 CRC。 */
export interface GameplayTagPredefineDefinition {
  readonly tags: Readonly<Record<string, GameplayTag>>;
  readonly queries: Readonly<Record<string, GameplayTagQueryDefinition>>;
  /** Entity.CanAddTag 的免疫查询；无条目与有空查询是不同的配置事实。 */
  readonly immunityQueries: readonly {
    readonly tag: GameplayTag;
    readonly query: GameplayTagQueryDefinition;
  }[];
}

/** 配置来源身份随产物保存；不是从动作名称推断出的默认免疫表。 */
export interface GameplayTagPredefineDocument extends GameplayTagPredefineDefinition {
  readonly schemaVersion: 1;
  readonly revision: string;
  readonly sourceSha256: string;
}
