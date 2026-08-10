/**
 * 有状态伤害上下文进入纯伤害公式前的解析边界。
 * 调用方需先完成事件与 Buff 修正；返回值应视为该命中公式阶段的冻结输入。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { DamageType } from '../../game-data/operatorDefinition';
import type { PlayerActiveDamageInput } from './playerActiveDamage';

/** 会读取目标元素抗性的伤害类型。 */
export type ResistibleDamageType = Exclude<DamageType, 'true' | 'lifeDrain'>;

/** 目标在一次命中开始时冻结的各类伤害抗性。 */
export interface DamageResistanceSnapshot {
  readonly percent: number;
  readonly damageTakenMultiplier: number;
}

/** 来源方对标准主动伤害公式有影响的属性快照。 */
export interface PlayerDamageAttackerSnapshot {
  readonly attack: number;
  readonly criticalRate: number;
  readonly criticalDamageIncrease: number;
  readonly weaknessDamageMultiplier: number;
  readonly igniteDamageMultiplier: number;
  readonly physicalInflictionDamageMultiplier: number;
}

/** 目标方对标准主动伤害公式有影响的属性与状态快照。 */
export interface PlayerDamageDefenderSnapshot {
  readonly defense: number;
  readonly shelterDamageMultiplier: number;
  /** 敌人固定属性 `BreakingAttackDamageTakenScalar`，只参与处决基础值计算。 */
  readonly breakingAttackDamageTakenMultiplier: number;
  readonly resistances: Readonly<Record<ResistibleDamageType, DamageResistanceSnapshot>>;
}

/** 不含有状态随机取样、但参与一次伤害公式的运行时数值。 */
export interface PlayerDamageNonRandomRuntimeSnapshot {
  readonly runtimeExtensionMultiplier: number;
  /** 由定义适配器设置的原生修饰掩码解析得到。 */
  readonly appliesIgniteDamageMultiplier: boolean;
  /** 由定义适配器设置的原生修饰掩码解析得到。 */
  readonly appliesPhysicalInflictionDamageMultiplier: boolean;
}

/** 一次伤害公式最终冻结的全部运行时数值。 */
export interface PlayerDamageRuntimeSnapshot extends PlayerDamageNonRandomRuntimeSnapshot {
  readonly criticalSample: number;
}

/** 从伤害步骤、双方快照和运行时状态解析公式输入的完整参数。 */
export interface ResolvePlayerActiveDamageInput {
  readonly step: Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;
  readonly finalAttackValue: number;
  readonly attacker: PlayerDamageAttackerSnapshot;
  readonly defender: PlayerDamageDefenderSnapshot;
  readonly runtime: PlayerDamageRuntimeSnapshot;
}

/** 在所有修正阶段完成后解析已还原的标准攻击倍率路径。 */
export function resolvePlayerActiveDamageInput({
  step,
  finalAttackValue,
  attacker,
  defender,
  runtime,
}: ResolvePlayerActiveDamageInput): PlayerActiveDamageInput {
  if (step.kind === 'dealDamage' && step.parameters.attackScalePerStatusStack !== undefined) {
    throw new Error('status-stack attack scale must be resolved before damage input construction');
  }
  if (step.parameters.damageType === 'lifeDrain') {
    throw new Error('life-drain damage uses a separate native calculation branch');
  }

  const resistance =
    step.parameters.damageType === 'true'
      ? { percent: 0, damageTakenMultiplier: 1 }
      : defender.resistances[step.parameters.damageType];

  return {
    finalAttackValue,
    damageType: step.parameters.damageType,
    criticalRate: attacker.criticalRate,
    criticalDamageIncrease: attacker.criticalDamageIncrease,
    criticalSample: runtime.criticalSample,
    defense: defender.defense,
    resistancePercent: resistance.percent,
    damageTakenMultiplier: resistance.damageTakenMultiplier,
    weaknessDamageMultiplier: attacker.weaknessDamageMultiplier,
    shelterDamageMultiplier: defender.shelterDamageMultiplier,
    runtimeExtensionMultiplier: runtime.runtimeExtensionMultiplier,
    igniteDamageMultiplier: attacker.igniteDamageMultiplier,
    appliesIgniteDamageMultiplier: runtime.appliesIgniteDamageMultiplier,
    physicalInflictionDamageMultiplier: attacker.physicalInflictionDamageMultiplier,
    appliesPhysicalInflictionDamageMultiplier: runtime.appliesPhysicalInflictionDamageMultiplier,
  };
}
