import type { CompiledSkillCost } from '../../compiler/combatProgram';

const RESOURCE_EPSILON = 0.0001;

export interface CombatResourceSnapshot {
  readonly sp: number;
  readonly ultimateEnergy: Readonly<Record<string, number>>;
}

/** Shared SP and per-operator ultimate energy used by cast checks and deductions. */
export class CombatResources {
  #sp: number;
  readonly #ultimateEnergy = new Map<string, number>();

  constructor(snapshot: CombatResourceSnapshot) {
    this.#sp = snapshot.sp;
    for (const [operatorId, value] of Object.entries(snapshot.ultimateEnergy)) {
      this.#ultimateEnergy.set(operatorId, value);
    }
  }

  get sp(): number {
    return this.#sp;
  }

  getUltimateEnergy(operatorId: string): number {
    return this.#ultimateEnergy.get(operatorId) ?? 0;
  }

  canPay(operatorId: string, costs: readonly CompiledSkillCost[]): boolean {
    return costs.every(cost => {
      const available = cost.resource === 'sp' ? this.#sp : this.getUltimateEnergy(operatorId);
      return available + RESOURCE_EPSILON >= cost.value;
    });
  }

  pay(operatorId: string, costs: readonly CompiledSkillCost[]): boolean {
    if (!this.canPay(operatorId, costs)) return false;
    for (const cost of costs) {
      if (cost.resource === 'sp') {
        this.#sp -= cost.value;
      } else {
        this.#ultimateEnergy.set(operatorId, this.getUltimateEnergy(operatorId) - cost.value);
      }
    }
    return true;
  }
}
