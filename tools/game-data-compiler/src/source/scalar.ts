import { requireBoolean, requireNumber, requireRecord } from './primitives.ts';

export interface ScalarSource {
  /** 原生字段中的直接数值；即使启用黑板引用也必须保留。 */
  readonly value: number;
  /** 启用黑板引用时的键；未启用时固定为 null。 */
  readonly blackboardKey: string | null;
  /** 从上层 SkillPatch 解析出的逐等级值；运行时输入没有该数组。 */
  readonly levelValues: readonly number[] | null;
}

export interface StringScalarSource {
  /** 原生字段中的直接字符串；启用黑板引用时也必须保留。 */
  readonly value: string;
  /** 启用黑板引用时的键；未启用时固定为 null。 */
  readonly blackboardKey: string | null;
}

export type BlackboardLevelValues = Readonly<Record<string, readonly number[]>>;

export function parseScalarSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): ScalarSource {
  const source = requireRecord(value, path);
  const rawValue = requireNumber(source.value, `${path}.value`);
  const useBlackboardKey = requireBoolean(source.useBlackboardKey, `${path}.useBlackboardKey`);
  const key = source.blackboardKey;
  if (typeof key !== 'string') {
    throw new Error(`${path}.blackboardKey: expected string`);
  }
  if (useBlackboardKey && key.length === 0) {
    throw new Error(`${path}: active scalar blackboard reference has no key`);
  }

  const blackboardKey = useBlackboardKey ? key : null;
  // 未在 SkillPatch 中声明不等于错误：该键也可能由技能动作或运行时写入。
  return {
    value: rawValue,
    blackboardKey,
    levelValues: blackboardKey ? (inheritedBlackboard[blackboardKey] ?? null) : null,
  };
}

/** 读取与 BlackboardDouble 同形、但直接值为字符串的原生包装。 */
export function parseStringScalarSource(value: unknown, path: string): StringScalarSource {
  const source = requireRecord(value, path);
  const rawValue = source.value;
  if (typeof rawValue !== 'string') {
    throw new Error(`${path}.value: expected string`);
  }
  const useBlackboardKey = requireBoolean(source.useBlackboardKey, `${path}.useBlackboardKey`);
  const key = source.blackboardKey;
  if (typeof key !== 'string') {
    throw new Error(`${path}.blackboardKey: expected string`);
  }
  if (useBlackboardKey && key.length === 0) {
    throw new Error(`${path}: active string blackboard reference has no key`);
  }
  return { value: rawValue, blackboardKey: useBlackboardKey ? key : null };
}
