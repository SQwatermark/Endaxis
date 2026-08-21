/**
 * 已计算生命伤害与目标生命状态之间的写入边界。
 * 只能在承伤事件完成后的正确阶段调用，避免提前改变后续监听器看到的生命值。
 */
import type { DamageFeature, DamageTag, DamageType } from '../../game-data/operatorDefinition';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from '../runtime/combatClock';
import type { CombatVitals, HealthDamageResult } from '../runtime/combatVitals';
import type { PlayerActiveDamageResult } from './playerActiveDamage';

export const HEALTH_DAMAGE_EVENTS = [
  'beforeTakeDamage',
  'beforeOutputDamage',
  'beforeKillEntity',
  'afterKillEntity',
  'takeDamage',
  'outputDamage',
] as const;
/** 生命伤害写入前后向来源方和目标方发布的事件。 */
export type HealthDamageEvent = (typeof HEALTH_DAMAGE_EVENTS)[number];
/** 生命伤害结算中由攻击来源接收的事件。 */
export type HealthDamageSourceEvent = Extract<
  HealthDamageEvent,
  'beforeOutputDamage' | 'beforeKillEntity' | 'afterKillEntity' | 'outputDamage'
>;
/** 生命伤害结算中由承伤目标接收的事件。 */
export type HealthDamageTargetEvent = Extract<HealthDamageEvent, 'beforeTakeDamage' | 'takeDamage'>;

/** 生命伤害事件共享的伤害包、请求值和实际值。 */
export interface HealthDamageEventPayload {
  readonly sourceId: string;
  readonly targetId: string;
  readonly damageType: DamageType;
  readonly tags: readonly DamageTag[];
  readonly features: readonly DamageFeature[];
  readonly result: PlayerActiveDamageResult;
}

/** 在正确事件边界写入一次生命伤害所需的状态和端口。 */
export interface ExecuteHealthDamageInput {
  readonly sourceId: string;
  readonly targetId: string;
  readonly damageType: DamageType;
  readonly tags: readonly DamageTag[];
  readonly features?: readonly DamageFeature[];
  readonly result: PlayerActiveDamageResult;
  readonly target: CombatVitals;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  /** 这个步骤在定义里的名字（如果有）。命中点提示用它把伤害日志对应到具体命中点。 */
  readonly stepKey?: string;
  /** 存档中的技能释放身份；命中回执凭它与具体施放对应。 */
  readonly castId?: string;
  /** 存档中的命中身份；命中回执凭它与具体命中点对应。 */
  readonly hitId?: string;
  readonly emitSourceEvent: (
    event: HealthDamageSourceEvent,
    payload: HealthDamageEventPayload,
  ) => void;
  readonly emitTargetEvent: (
    event: HealthDamageTargetEvent,
    payload: HealthDamageEventPayload,
  ) => void;
  /** OnBeforeTake/OutputDamage 之后、生命写入之前执行的目标护盾链。 */
  readonly absorbDamage?: (damageType: DamageType, value: number) => number;
}

/** 在已还原的公式后边界应用解析完成的玩家主动伤害。 */
export function executeHealthDamage(input: ExecuteHealthDamageInput): HealthDamageResult {
  const beforePayload: HealthDamageEventPayload = {
    sourceId: input.sourceId,
    targetId: input.targetId,
    damageType: input.damageType,
    tags: input.tags,
    features: input.features ?? [],
    result: input.result,
  };

  input.emitTargetEvent('beforeTakeDamage', beforePayload);
  input.emitSourceEvent('beforeOutputDamage', beforePayload);
  const result =
    input.absorbDamage === undefined
      ? input.result
      : { ...input.result, value: input.absorbDamage(input.damageType, input.result.value) };
  const payload: HealthDamageEventPayload = { ...beforePayload, result };
  const mayKillTarget = input.target.health > 0 && result.value >= input.target.health;
  if (mayKillTarget) input.emitSourceEvent('beforeKillEntity', payload);
  const stateChange = input.target.takeDamage(result.value);
  if (mayKillTarget && stateChange.currentHealth === 0) {
    input.emitSourceEvent('afterKillEntity', payload);
  }
  input.receipt.record({
    frame: input.clock.frame,
    time: input.clock.time,
    event: 'DamageApplied',
    sourceId: input.sourceId,
    targetId: input.targetId,
    data: {
      damageType: input.damageType,
      value: result.value,
      actualDamage: stateChange.actualDamage,
      remainingHealth: stateChange.currentHealth,
      isCritical: result.isCritical,
      criticalMultiplier: result.criticalMultiplier,
      defenseMultiplier: result.defenseMultiplier,
      resistanceMultiplier: result.resistanceMultiplier,
      weaknessShelterMultiplier: result.weaknessShelterMultiplier,
      runtimeExtensionMultiplier: result.runtimeExtensionMultiplier,
      igniteMultiplier: result.igniteMultiplier,
      physicalInflictionMultiplier: result.physicalInflictionMultiplier,
      ...(input.stepKey === undefined ? {} : { stepKey: input.stepKey }),
      ...(input.castId === undefined ? {} : { castId: input.castId }),
      ...(input.hitId === undefined ? {} : { hitId: input.hitId }),
    },
  });
  input.emitTargetEvent('takeDamage', payload);
  input.emitSourceEvent('outputDamage', payload);
  return stateChange;
}
