import type { CompiledSkillCost } from '../../compiler/combatProgram';

const RESOURCE_EPSILON = 0.0001;
const ULTIMATE_ENERGY_EPSILON = 0.00001;

export interface OperatorResourceSnapshot {
  readonly operatorId: string;
  readonly ultimateEnergy: number;
  readonly maxUltimateEnergy: number;
  readonly ultimateEnergyGainMultiplier: number;
  /** Whether a positive recovery without a recovery tag passes current restrictions. */
  readonly canGainUntaggedUltimateEnergy: boolean;
}

export interface NormalSkillUltimateEnergySettings {
  readonly selfGainPerSp: number;
  readonly otherGainPerSp: number;
}

export interface CombatResourceSnapshot {
  readonly sp: number;
  readonly returnedSp: number;
  readonly ultimateEnergySystemUnlocked: boolean;
  readonly squad: readonly OperatorResourceSnapshot[];
  readonly normalSkillUltimateEnergy: NormalSkillUltimateEnergySettings;
}

export interface SkillPaymentResult {
  readonly paid: boolean;
  readonly nonReturnedSpCost: number;
}

export interface UltimateEnergyChange {
  readonly operatorId: string;
  readonly baseValue: number;
  readonly requestedValue: number;
  readonly applied: boolean;
  readonly actualValue: number;
  readonly previousValue: number;
  readonly currentValue: number;
}

interface OperatorResources extends Omit<OperatorResourceSnapshot, 'ultimateEnergy'> {
  ultimateEnergy: number;
}

function requireNonNegativeFinite(value: number, path: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${path} must be a non-negative finite number`);
  }
}

function requireFinite(value: number, path: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${path} must be a finite number`);
  }
}

/** Native shared SP and ordered squad ultimate-energy state. */
export class CombatResources {
  #sp: number;
  #returnedSp: number;
  readonly #ultimateEnergySystemUnlocked: boolean;
  readonly #squad: readonly OperatorResources[];
  readonly #operators = new Map<string, OperatorResources>();
  readonly #normalSkillUltimateEnergy: NormalSkillUltimateEnergySettings;

  constructor(snapshot: CombatResourceSnapshot) {
    requireNonNegativeFinite(snapshot.sp, 'sp');
    requireNonNegativeFinite(snapshot.returnedSp, 'returnedSp');
    requireFinite(
      snapshot.normalSkillUltimateEnergy.selfGainPerSp,
      'normalSkillUltimateEnergy.selfGainPerSp',
    );
    requireFinite(
      snapshot.normalSkillUltimateEnergy.otherGainPerSp,
      'normalSkillUltimateEnergy.otherGainPerSp',
    );
    this.#sp = snapshot.sp;
    this.#returnedSp = snapshot.returnedSp;
    this.#ultimateEnergySystemUnlocked = snapshot.ultimateEnergySystemUnlocked;
    this.#normalSkillUltimateEnergy = snapshot.normalSkillUltimateEnergy;
    this.#squad = snapshot.squad.map((member, index) => {
      if (member.operatorId.length === 0) {
        throw new Error(`squad[${index}].operatorId must not be empty`);
      }
      requireNonNegativeFinite(member.ultimateEnergy, `squad[${index}].ultimateEnergy`);
      requireNonNegativeFinite(member.maxUltimateEnergy, `squad[${index}].maxUltimateEnergy`);
      requireFinite(
        member.ultimateEnergyGainMultiplier,
        `squad[${index}].ultimateEnergyGainMultiplier`,
      );
      if (member.ultimateEnergy > member.maxUltimateEnergy + ULTIMATE_ENERGY_EPSILON) {
        throw new RangeError(`squad[${index}].ultimateEnergy exceeds its maximum`);
      }
      if (this.#operators.has(member.operatorId)) {
        throw new Error(`duplicate squad operator '${member.operatorId}'`);
      }
      const runtime = { ...member };
      this.#operators.set(member.operatorId, runtime);
      return runtime;
    });
  }

  get sp(): number {
    return this.#sp;
  }

  get returnedSp(): number {
    return this.#returnedSp;
  }

  getUltimateEnergy(operatorId: string): number {
    return this.#requireOperator(operatorId).ultimateEnergy;
  }

  canPay(operatorId: string, costs: readonly CompiledSkillCost[]): boolean {
    return costs.every(cost => {
      const available =
        cost.resource === 'sp' ? this.#sp : this.#requireOperator(operatorId).ultimateEnergy;
      return available + RESOURCE_EPSILON >= cost.value;
    });
  }

  pay(operatorId: string, costs: readonly CompiledSkillCost[]): SkillPaymentResult {
    if (!this.canPay(operatorId, costs)) return { paid: false, nonReturnedSpCost: 0 };
    let nonReturnedSpCost = 0;
    for (const cost of costs) {
      if (cost.resource === 'sp') {
        this.#sp = Math.max(0, this.#sp - cost.value);
        const consumedReturnedSp = Math.min(this.#returnedSp, cost.value);
        this.#returnedSp -= consumedReturnedSp;
        nonReturnedSpCost = cost.value - consumedReturnedSp;
      } else {
        const operator = this.#requireOperator(operatorId);
        // Native Skill.ApplyCost ignores the ultimate-energy setter result.
        this.#trySetUltimateEnergy(operator, operator.ultimateEnergy - cost.value);
      }
    }
    return { paid: true, nonReturnedSpCost };
  }

  gainSquadUltimateEnergyFromSkillCost(
    sourceOperatorId: string,
    nonReturnedSpCost: number,
    coefficient: number,
  ): readonly UltimateEnergyChange[] {
    requireNonNegativeFinite(nonReturnedSpCost, 'nonReturnedSpCost');
    requireFinite(coefficient, 'coefficient');
    this.#requireOperator(sourceOperatorId);

    return this.#squad.map(member => {
      const gainPerSp =
        member.operatorId === sourceOperatorId
          ? this.#normalSkillUltimateEnergy.selfGainPerSp
          : this.#normalSkillUltimateEnergy.otherGainPerSp;
      const baseValue = coefficient * nonReturnedSpCost * gainPerSp;
      const requestedValue =
        baseValue > 0 ? baseValue * member.ultimateEnergyGainMultiplier : baseValue;
      const previousValue = member.ultimateEnergy;
      const applied = this.#trySetUltimateEnergy(member, previousValue + requestedValue);
      return {
        operatorId: member.operatorId,
        baseValue,
        requestedValue,
        applied,
        actualValue: member.ultimateEnergy - previousValue,
        previousValue,
        currentValue: member.ultimateEnergy,
      };
    });
  }

  #trySetUltimateEnergy(operator: OperatorResources, value: number): boolean {
    if (
      !this.#ultimateEnergySystemUnlocked ||
      (value > operator.ultimateEnergy && !operator.canGainUntaggedUltimateEnergy)
    ) {
      return false;
    }
    const clamped = Math.min(operator.maxUltimateEnergy, Math.max(0, value));
    if (Math.abs(clamped - operator.ultimateEnergy) <= ULTIMATE_ENERGY_EPSILON) return false;
    operator.ultimateEnergy = clamped;
    return true;
  }

  #requireOperator(operatorId: string): OperatorResources {
    const operator = this.#operators.get(operatorId);
    if (operator === undefined) throw new Error(`squad operator '${operatorId}' is not configured`);
    return operator;
  }
}
