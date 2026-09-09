import type { CombatSkillCastInfo } from './skillCastInfo';

export function readSkillCastInfoFromPayload(
  payload: unknown,
): CombatSkillCastInfo | null | undefined {
  if (typeof payload !== 'object' || payload === null) return undefined;
  // 调用者明确选择载荷，禁止按事件白名单自动拆包，避免两种入口读出不同结果。
  if ('event' in payload && 'payload' in payload)
    throw new TypeError('Expected ability event payload, not an event envelope');
  const value = (payload as Record<string, unknown>).skillCastInfo;
  if (value === null) return null;
  // 当前施法身份不是来源快照；缺省保持缺省，不推算 origin 或补零费用。
  if (value === undefined) return undefined;
  if (typeof value !== 'object')
    throw new TypeError('Ability event payload has invalid skill cast identity');
  const source = value as Record<string, unknown>;
  if (
    typeof source.skillCastId !== 'number' ||
    typeof source.originSkillId !== 'string' ||
    (source.originSkillType !== 'basicAttack' &&
      source.originSkillType !== 'plungingAttack' &&
      source.originSkillType !== 'finisher' &&
      source.originSkillType !== 'battleSkill' &&
      source.originSkillType !== 'comboSkill' &&
      source.originSkillType !== 'ultimate') ||
    typeof source.nonReturnedSpCost !== 'number'
  ) {
    throw new TypeError('Ability event payload has invalid skill cast identity');
  }
  return source as unknown as CombatSkillCastInfo;
}
