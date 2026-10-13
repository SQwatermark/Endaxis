/** 不可变更新定义字段；允许补建对象，数组只替换已有位置。undefined 删除对象字段。 */
export function writeFieldValue(
  value: unknown,
  path: readonly (string | number)[],
  fieldValue: unknown,
): unknown {
  if (path.length === 0) return fieldValue;
  const [key, ...rest] = path;
  if (key === '__proto__' || key === 'prototype' || key === 'constructor')
    throw new Error('不能编辑对象原型字段');
  if (Array.isArray(value)) {
    if (!/^(0|[1-9]\d*)$/.test(String(key)) || Number(key) >= value.length)
      throw new Error('数组输入位置不存在');
    const result = [...value];
    result[Number(key)] = writeFieldValue(value[Number(key)], rest, fieldValue);
    return result;
  }
  const record = value !== null && typeof value === 'object' ? value : {};
  const result: Record<string | number, unknown> = { ...record };
  const child = writeFieldValue(result[key!], rest, fieldValue);
  if (child === undefined) delete result[key!];
  else result[key!] = child;
  return result;
}
