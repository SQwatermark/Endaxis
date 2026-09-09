import type { AbilityEvent } from '../../../../packages/game-data-contract/src/abilityEvents';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { AbilityEventContext } from '../events/abilityEventDispatcher';
import {
  skillAbilityEvent,
  lifecycleAbilityEvent,
  weaknessAbilityEvent,
  customAbilityEvent,
  poiseAbilityEvent,
  shieldAbilityEvent,
  buffEnhanceAbilityEvent,
  inflictionAbilityEvent,
  spGainAbilityEvent,
  killAbilityEvent,
  physicalAbilityEvent,
  knockDownAbilityEvent,
  healAbilityEvent,
  damageAbilityEvent,
  buffAbilityEvent,
  spellBurstAbilityEvent,
  characterInflictionAbilityEvent,
  type CombatAbilityEvent,
} from '../events/combatAbilityEvent';

/**
 * 条件执行器可接收的 AbilitySystem 事件名。Buff 定义目前只订阅其中一部分；
 * 连携条件仍必须复用同一原始事件识别入口，不能因此另建事件投影。
 */
// outputKnockDown 是旧定义兼容入口，不是此原始事件响应端口；这里是明确的能力边界。
export type AbilityResponseEventName = Exclude<AbilityEvent, 'outputKnockDown'>;

/** 仅识别原始事件；不压平、不复制载荷，不补造第二份上下文。 */
export function resolveAbilityEventContext(
  published: AbilityEventContext<AbilityResponseEventName>,
) {
  const buff = buffAbilityEvent(published as CombatAbilityEvent);
  const resolved =
    buff ??
    spellBurstAbilityEvent(published) ??
    characterInflictionAbilityEvent(published) ??
    skillAbilityEvent(published) ??
    lifecycleAbilityEvent(published) ??
    weaknessAbilityEvent(published) ??
    customAbilityEvent(published) ??
    poiseAbilityEvent(published) ??
    shieldAbilityEvent(published) ??
    buffEnhanceAbilityEvent(published) ??
    inflictionAbilityEvent(published) ??
    spGainAbilityEvent(published) ??
    killAbilityEvent(published) ??
    physicalAbilityEvent(published) ??
    knockDownAbilityEvent(published) ??
    damageAbilityEvent(published) ??
    healAbilityEvent(published);
  if (resolved === undefined) throw new Error(`Unsupported event response '${published.event}'`);
  return resolved;
}

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
