import type { DamageType } from '../../game-data/operatorDefinition';
import { DamageScaleAccumulator } from './damageScale';
import type { DamageScaleAttributeSnapshot } from './damageScaleAttributes';
import type {
  PlayerDamageAttackerSnapshot,
  PlayerDamageDefenderSnapshot,
} from './playerActiveDamageInput';

export const DAMAGE_PROCESS_TIMINGS = ['beforeCalculation', 'afterCalculation'] as const;
export type DamageProcessTiming = (typeof DAMAGE_PROCESS_TIMINGS)[number];

export const DAMAGE_MODIFIER_SIDES = ['attacker', 'defender'] as const;
export type DamageModifierSide = (typeof DAMAGE_MODIFIER_SIDES)[number];

export interface PlayerDamageAttributeSnapshots {
  readonly attacker: PlayerDamageAttackerSnapshot & DamageScaleAttributeSnapshot;
  readonly defender: PlayerDamageDefenderSnapshot & DamageScaleAttributeSnapshot;
}

export interface PlayerDamageContextPorts {
  readonly captureAttributeSnapshots: () => PlayerDamageAttributeSnapshots;
  readonly applyModifiers: (
    timing: DamageProcessTiming,
    side: DamageModifierSide,
    context: PlayerDamageContext,
  ) => void;
  readonly clearInstantAttributeModifiers: (side: DamageModifierSide) => void;
}

interface PlayerDamageContextInput {
  readonly damageType: DamageType;
  readonly ports: PlayerDamageContextPorts;
}

/** Mutable per-hit state following the recovered native damage-pack lifecycle. */
export class PlayerDamageContext {
  readonly damageType: DamageType;
  readonly damageScales = new DamageScaleAccumulator();
  readonly #ports: PlayerDamageContextPorts;
  #baseValue = 0;
  #value = 0;
  #pendingCalculationScale = 1;
  #hasCalculationResult = false;
  #snapshots: PlayerDamageAttributeSnapshots;

  constructor(input: PlayerDamageContextInput) {
    this.damageType = input.damageType;
    this.#ports = input.ports;
    this.#snapshots = input.ports.captureAttributeSnapshots();
  }

  get baseValue(): number {
    return this.#baseValue;
  }

  get value(): number {
    return this.#value;
  }

  get hasCalculationResult(): boolean {
    return this.#hasCalculationResult;
  }

  get attackerAttributes(): PlayerDamageAttributeSnapshots['attacker'] {
    return this.#snapshots.attacker;
  }

  get defenderAttributes(): PlayerDamageAttributeSnapshots['defender'] {
    return this.#snapshots.defender;
  }

  applyModifiers(timing: DamageProcessTiming): void {
    try {
      this.#ports.applyModifiers(timing, 'attacker', this);
      this.#ports.applyModifiers(timing, 'defender', this);
      this.#snapshots = this.#ports.captureAttributeSnapshots();
    } finally {
      this.#ports.clearInstantAttributeModifiers('attacker');
      this.#ports.clearInstantAttributeModifiers('defender');
    }
  }

  setCalculationResult(value: number): void {
    this.#baseValue = value;
    this.#value = value * this.#pendingCalculationScale;
    this.#hasCalculationResult = true;
  }

  multiplyCalculationValue(scale: number): void {
    if (this.#hasCalculationResult) {
      this.#value *= scale;
      return;
    }
    this.#pendingCalculationScale *= scale;
  }

  resolveFinalAttackValue(): number {
    if (this.damageType === 'lifeDrain') return this.#value;
    this.applyModifiers('afterCalculation');
    return this.#value * this.damageScales.getFinalValue();
  }
}
