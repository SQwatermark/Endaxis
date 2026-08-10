/**
 * 已计算生命伤害与目标生命状态之间的写入边界。
 * 只能在承伤事件完成后的正确阶段调用，避免提前改变后续监听器看到的生命值。
 */
import type { DamageType } from '../../game-data/operatorDefinition';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from '../runtime/combatClock';
import type { CombatVitals, HealthDamageResult } from '../runtime/combatVitals';
import type { PlayerActiveDamageResult } from './playerActiveDamage';

export const HEALTH_DAMAGE_EVENTS = [
  'beforeTakeDamage',
  'beforeOutputDamage',
  'takeDamage',
  'outputDamage',
] as const;
/** 生命伤害写入前后向来源方和目标方发布的事件。 */
export type HealthDamageEvent = (typeof HEALTH_DAMAGE_EVENTS)[number];
/** 生命伤害结算中由攻击来源接收的事件。 */
export type HealthDamageSourceEvent = Extract<
  HealthDamageEvent,
  'beforeOutputDamage' | 'outputDamage'
>;
/** 生命伤害结算中由承伤目标接收的事件。 */
export type HealthDamageTargetEvent = Extract<HealthDamageEvent, 'beforeTakeDamage' | 'takeDamage'>;

/** 生命伤害事件共享的伤害包、请求值和实际值。 */
export interface HealthDamageEventPayload {
  readonly sourceId: string;
  readonly targetId: string;
  readonly damageType: DamageType;
  readonly result: PlayerActiveDamageResult;
}

/** 在正确事件边界写入一次生命伤害所需的状态和端口。 */
export interface ExecuteHealthDamageInput {
  readonly sourceId: string;
  readonly targetId: string;
  readonly damageType: DamageType;
  readonly result: PlayerActiveDamageResult;
  readonly target: CombatVitals;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  /** 这个步骤在目录里的名字（如果有）。命中点提示用它把伤害日志对应到具体命中点。 */
  readonly stepKey?: string;
  readonly emitSourceEvent: (
    event: HealthDamageSourceEvent,
    payload: HealthDamageEventPayload,
  ) => void;
  readonly emitTargetEvent: (
    event: HealthDamageTargetEvent,
    payload: HealthDamageEventPayload,
  ) => void;
}

/** 在已还原的公式后边界应用解析完成的玩家主动伤害。 */
export function executeHealthDamage(input: ExecuteHealthDamageInput): HealthDamageResult {
  const payload: HealthDamageEventPayload = {
    sourceId: input.sourceId,
    targetId: input.targetId,
    damageType: input.damageType,
    result: input.result,
  };

  input.emitTargetEvent('beforeTakeDamage', payload);
  input.emitSourceEvent('beforeOutputDamage', payload);
  const stateChange = input.target.takeDamage(input.result.value);
  input.receipt.record({
    frame: input.clock.frame,
    time: input.clock.time,
    event: 'DamageApplied',
    sourceId: input.sourceId,
    targetId: input.targetId,
    data: {
      damageType: input.damageType,
      value: input.result.value,
      actualDamage: stateChange.actualDamage,
      remainingHealth: stateChange.currentHealth,
      isCritical: input.result.isCritical,
      criticalMultiplier: input.result.criticalMultiplier,
      defenseMultiplier: input.result.defenseMultiplier,
      resistanceMultiplier: input.result.resistanceMultiplier,
      weaknessShelterMultiplier: input.result.weaknessShelterMultiplier,
      runtimeExtensionMultiplier: input.result.runtimeExtensionMultiplier,
      igniteMultiplier: input.result.igniteMultiplier,
      physicalInflictionMultiplier: input.result.physicalInflictionMultiplier,
      ...(input.stepKey === undefined ? {} : { stepKey: input.stepKey }),
    },
  });
  input.emitTargetEvent('takeDamage', payload);
  input.emitSourceEvent('outputDamage', payload);
  return stateChange;
}
