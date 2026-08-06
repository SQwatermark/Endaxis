import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { DamageType } from '../../game-data/operatorDefinition';
import type { PlayerActiveDamageInput } from './playerActiveDamage';

export type ResistibleDamageType = Exclude<DamageType, 'true' | 'lifeDrain'>;

export interface DamageResistanceSnapshot {
  readonly percent: number;
  readonly damageTakenMultiplier: number;
}

export interface PlayerDamageAttackerSnapshot {
  readonly attack: number;
  readonly criticalRate: number;
  readonly criticalDamageIncrease: number;
  readonly weaknessDamageMultiplier: number;
  readonly igniteDamageMultiplier: number;
  readonly physicalInflictionDamageMultiplier: number;
}

export interface PlayerDamageDefenderSnapshot {
  readonly defense: number;
  readonly shelterDamageMultiplier: number;
  readonly resistances: Readonly<Record<ResistibleDamageType, DamageResistanceSnapshot>>;
}

export interface PlayerDamageRuntimeSnapshot {
  readonly criticalSample: number;
  readonly runtimeExtensionMultiplier: number;
  /** Resolved from the native decorate-mask set by the catalog adapter. */
  readonly appliesIgniteDamageMultiplier: boolean;
  /** Resolved from the native decorate-mask set by the catalog adapter. */
  readonly appliesPhysicalInflictionDamageMultiplier: boolean;
}

export interface ResolvePlayerActiveDamageInput {
  readonly step: Extract<ResolvedCombatStep, { kind: 'dealDamage' }>;
  readonly finalAttackValue: number;
  readonly attacker: PlayerDamageAttackerSnapshot;
  readonly defender: PlayerDamageDefenderSnapshot;
  readonly runtime: PlayerDamageRuntimeSnapshot;
}

/** Resolves the recovered standard AtkScale path after all modifier stages have run. */
export function resolvePlayerActiveDamageInput({
  step,
  finalAttackValue,
  attacker,
  defender,
  runtime,
}: ResolvePlayerActiveDamageInput): PlayerActiveDamageInput {
  if (step.parameters.calculation === 'breakingAttack') {
    throw new Error('breaking-attack input requires the separate recovered calculation branch');
  }
  if (step.parameters.attackScalePerStatusStack !== undefined) {
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
