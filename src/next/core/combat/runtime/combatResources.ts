/**
 * 一次战斗中技力与队伍终结技能量的唯一状态账本。
 * 技能费用和回复都应通过这里结算，投影层不得另算一份资源曲线作为合法性依据。
 */
import type { CompiledSkillCost } from '../../compiler/combatProgram';

const RESOURCE_EPSILON = 0.0001;
const ULTIMATE_ENERGY_EPSILON = 0.00001;

/** 单个队员终结技能量及其回复限制的可重建快照。 */
export interface OperatorResourceSnapshot {
  readonly operatorId: string;
  readonly ultimateEnergy: number;
  readonly maxUltimateEnergy: number;
  readonly ultimateEnergyGainMultiplier: number;
  /** 不带回复标签的正向回复是否能通过当前限制。 */
  readonly canGainUntaggedUltimateEnergy: boolean;
}

/** 普通战技消耗技力时队内终结技能量的换算参数。 */
export interface NormalSkillUltimateEnergySettings {
  readonly selfGainPerSp: number;
  readonly otherGainPerSp: number;
}

/** 创建一次战斗资源账本所需的完整初始状态。 */
export interface CombatResourceSnapshot {
  readonly sp: number;
  readonly returnedSp: number;
  readonly ultimateEnergySystemUnlocked: boolean;
  readonly squad: readonly OperatorResourceSnapshot[];
  readonly normalSkillUltimateEnergy: NormalSkillUltimateEnergySettings;
}

/** 技能费用尝试的结果；失败时不得继续执行技能。 */
export interface SkillPaymentResult {
  readonly paid: boolean;
  readonly nonReturnedSpCost: number;
}

/** 一次终结技能量变化的请求值、实际值和前后状态。 */
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

/** 原生共享技力与按队伍顺序保存的终结技能量状态。 */
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
        // 原生 `Skill.ApplyCost` 会忽略终结技能量 Setter 的返回值。
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
