import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';

export interface DeclaredBlackboardValueSource {
  readonly key: string;
  readonly value: number | string;
  readonly isDynamic: boolean;
}

/** 收集所有启用的黑板引用，供后续读写图和来源审计使用。 */
export function collectBlackboardKeys(value: unknown): string[] {
  const keys = new Set<string>();

  function visit(item: unknown): void {
    if (Array.isArray(item)) {
      item.forEach(visit);
      return;
    }
    if (typeof item !== 'object' || item === null) return;

    const record = item as Record<string, unknown>;
    if (record.useBlackboardKey === true && record.blackboardKey) {
      if (typeof record.blackboardKey !== 'string') {
        throw new Error('non-empty blackboardKey must be a string');
      }
      keys.add(record.blackboardKey);
    }
    Object.values(record).forEach(visit);
  }

  visit(value);
  return [...keys].sort();
}

/** 严格读取 SkillData 自身声明的数值或字符串黑板初值。 */
export function parseDeclaredBlackboard(
  root: unknown,
  sourcePath: string,
): DeclaredBlackboardValueSource[] {
  const source = requireRecord(root, sourcePath);
  const result = requireArray(source.blackboard, `${sourcePath}.blackboard`).map(
    (rawEntry, index) => {
      const path = `${sourcePath}.blackboard[${index}]`;
      const entry = requireRecord(rawEntry, path);
      requireExactFields(entry, new Set(['key', 'valueDouble', 'valueStr', 'isDynamic']), path);
      const key = requireNonEmptyString(entry.key, `${path}.key`);
      const numericValue = requireNumber(entry.valueDouble, `${path}.valueDouble`);
      const stringValue = requireString(entry.valueStr, `${path}.valueStr`);
      if (stringValue && numericValue !== 0) {
        throw new Error(`${path}: numeric and string values are both set`);
      }
      return {
        key,
        value: stringValue || numericValue,
        isDynamic: requireBoolean(entry.isDynamic, `${path}.isDynamic`),
      };
    },
  );

  if (new Set(result.map(item => item.key)).size !== result.length) {
    throw new Error(`${sourcePath}.blackboard: duplicate key`);
  }
  return result.sort((left, right) => left.key.localeCompare(right.key));
}

/**
 * 为局部解析提供已声明的数值来源。动态初值默认不能证明运行时值，只有调用方明确要求时才纳入。
 */
export function numericDeclaredBlackboard(
  values: readonly DeclaredBlackboardValueSource[],
  includeDynamicDefaults = false,
): Readonly<Record<string, readonly number[]>> {
  return Object.fromEntries(
    values
      .filter(item => (includeDynamicDefaults || !item.isDynamic) && typeof item.value === 'number')
      .map(item => [item.key, [item.value as number]]),
  );
}
