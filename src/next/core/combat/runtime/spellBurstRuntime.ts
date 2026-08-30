/**
 * 法术爆发的伤害执行。
 *
 * 倍率来自 SkillSetting 的"法术爆发伤害倍率"（原生 ReadSkillSettingData 语义，公式已由
 * combat-spec 复刻）：倍率 = 定义值 × 增强公式(来源附着增强属性)。之后走标准玩家伤害公式
 * （防御、抗性、暴击），最后写入敌人生命账本。数据缺失时明确报错，不假装打出伤害。
 */
import type { CombatBuffSpellBurstDefinition } from '../buffs/combatBuffDefinitions';
import type { PlayerDamageDefenderSnapshot } from '../damage/playerActiveDamageInput';
import { resolvePlayerActiveDamageInput } from '../damage/playerActiveDamageInput';
import { calculatePlayerActiveDamage } from '../damage/playerActiveDamage';
import {
  executeHealthDamage,
  type HealthDamageSourceEvent,
  type HealthDamageTargetEvent,
} from '../damage/healthDamage';
import type { CompoundStatusSkillSettingSource } from '../infliction/skillSettings';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { CombatVitals } from './combatVitals';
import type { CombatSkillCastInfo } from './skillCastInfo';

/** 一次爆发伤害需要的全部输入。 */
export interface ExecuteSpellBurstInput {
  readonly skillCastInfo?: CombatSkillCastInfo | null;
  readonly definition: CombatBuffSpellBurstDefinition;
  readonly sourceId: string;
  /** 来源攻击力（面板）。 */
  readonly attack: number;
  /**
   * 来源附着增强属性；面板尚未落地该属性时传 `null`。
   * `null` 只允许在爆发不需要增强公式（enhanceFormulaKey 为空）时使用，
   * 需要增强公式的爆发必须显式失败，不能退化为无增强。
   */
  readonly enhance: number | null;
  readonly criticalRate: number;
  readonly criticalDamageIncrease: number;
  readonly weaknessDamageMultiplier: number;
  readonly criticalSample: number;
  readonly settings: CompoundStatusSkillSettingSource;
  readonly defender: PlayerDamageDefenderSnapshot;
  readonly target: CombatVitals;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly emitSourceEvent: (event: HealthDamageSourceEvent, payload: unknown) => void;
  readonly emitTargetEvent: (event: HealthDamageTargetEvent, payload: unknown) => void;
}

/** 一次爆发结算后的结果。 */
export interface SpellBurstResult {
  readonly burstType: string;
  readonly skillScale: number;
  readonly enhanceFactor: number;
  readonly value: number;
  readonly actualDamage: number;
  readonly remainingHealth: number;
}

/** 按增强公式计算倍率乘数；无公式时退化为 1（与 combat-spec 一致）。 */
export function resolveSpellBurstEnhanceFactor(
  settings: CompoundStatusSkillSettingSource,
  enhanceFormulaKey: string,
  enhance: number | null,
): number {
  if (enhanceFormulaKey === '') return 1;
  if (enhance === null) {
    throw new Error(
      `spell burst enhancement formula '${enhanceFormulaKey}' requires the source infliction-enhance attribute, which is not available`,
    );
  }
  const formula = settings.getEnhanceFormula(enhanceFormulaKey);
  if (formula === undefined) return 1;
  switch (formula.kind) {
    case 'linear':
      return formula.paramA * enhance + 1;
    case 'saturating':
      return (formula.paramA * enhance) / (formula.paramB + enhance) + 1;
    case 'none':
      return 1;
  }
}

/** 执行一次爆发伤害；SkillSetting 缺少对应倍率数据时严格失败。 */
export function executeSpellBurst(input: ExecuteSpellBurstInput): SpellBurstResult {
  const setting = input.settings.getSetting(input.definition.skillSettingDataKey);
  if (setting === undefined) {
    throw new Error(
      `spell burst '${input.definition.burstType}' requires SkillSetting '${input.definition.skillSettingDataKey}', but the setting is missing`,
    );
  }
  const column = input.definition.skillSettingColumn - 1;
  if (column < 0 || column >= setting.values.length) {
    throw new Error(
      `spell burst '${input.definition.burstType}' reads SkillSetting column ${input.definition.skillSettingColumn} (index ${column}), but only ${setting.values.length} columns exist`,
    );
  }
  const skillScale = setting.values[column]!;
  const enhanceFactor = resolveSpellBurstEnhanceFactor(
    input.settings,
    setting.enhanceFormulaKey,
    input.enhance,
  );
  const scale = skillScale * enhanceFactor;

  const step = {
    kind: 'dealDamage' as const,
    parameters: {
      damageType: input.definition.damageType,
      attackScale: 1,
      tags: [] as const,
    },
  };
  const formulaInput = resolvePlayerActiveDamageInput({
    step,
    // 标准公式直接消费 finalAttackValue；倍率在这里已经乘进攻击力。
    finalAttackValue: input.attack * scale,
    attacker: {
      attack: input.attack,
      criticalRate: input.criticalRate,
      criticalDamageIncrease: input.criticalDamageIncrease,
      weaknessDamageMultiplier: input.weaknessDamageMultiplier,
      igniteDamageMultiplier: 1,
      physicalInflictionDamageMultiplier: 1,
    },
    defender: input.defender,
    runtime: {
      runtimeExtensionMultiplier: 1,
      appliesIgniteDamageMultiplier: false,
      appliesPhysicalInflictionDamageMultiplier: false,
      criticalSample: input.criticalSample,
    },
  });
  const damage = calculatePlayerActiveDamage(formulaInput);
  const stateChange = executeHealthDamage({
    ...(input.skillCastInfo === undefined ? {} : { skillCastInfo: input.skillCastInfo }),
    sourceId: input.sourceId,
    targetId: 'enemy',
    damageType: input.definition.damageType,
    tags: [],
    features: [],
    result: damage,
    target: input.target,
    clock: input.clock,
    receipt: input.receipt,
    emitSourceEvent: input.emitSourceEvent,
    emitTargetEvent: input.emitTargetEvent,
  });
  input.receipt.record({
    frame: input.clock.frame,
    time: input.clock.time,
    event: 'SpellBurstApplied',
    sourceId: input.sourceId,
    targetId: 'enemy',
    data: {
      burstType: input.definition.burstType,
      skillScale,
      enhanceFactor,
      value: damage.value,
      actualDamage: stateChange.actualDamage,
      remainingHealth: stateChange.currentHealth,
    },
  });
  return {
    burstType: input.definition.burstType,
    skillScale,
    enhanceFactor,
    value: damage.value,
    actualDamage: stateChange.actualDamage,
    remainingHealth: stateChange.currentHealth,
  };
}
