/** 仅用于诊断显示；路径引用保留切面中的共享身份和环，不作为存档格式。 */
export function formatCombatStateInspection(value: unknown): string {
  const paths = new WeakMap<object, string>();
  function visit(value: unknown, path: string): unknown {
    if (typeof value === 'number' && !Number.isFinite(value)) return String(value);
    if (value === undefined) return { $type: 'undefined' };
    if (typeof value === 'bigint') return { $type: 'bigint', value: String(value) };
    if (value === null || typeof value !== 'object') return value;
    const previous = paths.get(value);
    if (previous !== undefined) return { $ref: previous };
    paths.set(value, path);
    if (value instanceof Map) {
      return {
        $type: 'Map',
        entries: [...value].map(([key, entry], index) => [
          visit(key, `${path}.entries[${index}][0]`),
          visit(entry, `${path}.entries[${index}][1]`),
        ]),
      };
    }
    if (value instanceof Set)
      return {
        $type: 'Set',
        values: [...value].map((entry, index) => visit(entry, `${path}.values[${index}]`)),
      };
    if (Array.isArray(value)) return value.map((entry, index) => visit(entry, `${path}[${index}]`));
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        visit(entry, `${path}[${JSON.stringify(key)}]`),
      ]),
    );
  }
  return JSON.stringify(visit(value, '$'), null, 2);
}
