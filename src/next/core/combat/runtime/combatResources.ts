/**
 * 一次战斗中技力与队伍终结技能量的唯一状态账本。
 * 技能费用和回复都应通过这里结算，投影层不得另算一份资源曲线作为合法性依据。
 */
import type { CompiledSkillCost } from '../../compiler/combatProgram';
import type { SpGainKind } from '../../game-data/operatorDefinition';
import type { GameplayTag } from '../tags/gameplayTags';
import {
  SharedSpGainModifierSet,
  type SharedSpGainSettings,
} from '../resources/sharedSpGainModifiers';

const RESOURCE_EPSILON = 0.0001;
const ULTIMATE_ENERGY_EPSILON = 0.00001;

/** 单个队员终结技能量及其回复限制的可重建快照。 */
export interface OperatorResourceSnapshot {
  readonly operatorId: string;
  readonly ultimateEnergy: number;
  readonly maxUltimateEnergy: number;
  readonly ultimateEnergyGainMultiplier: number;
  /**
   * 当前终结技能量回复限制聚合后的许可标签；null 表示没有限制，空集合会拦截全部正向回复。
   * 原生由多个有效限制句柄取并集，资源账本只消费聚合结果，不负责 Buff 生命周期。
   */
  readonly allowedUltimateEnergyRecoveryTags: ReadonlySet<GameplayTag> | null;
}

/** 普通战技消耗技力时队内终结技能量的换算参数。 */
export interface NormalSkillUltimateEnergySettings {
  readonly selfGainPerSp: number;
  readonly otherGainPerSp: number;
}

/** 战斗内共享技力自然恢复所需的有效参数与初始计时状态。 */
export interface SpRecoverySnapshot {
  readonly valuePerSecond: number;
  readonly pauseDuration: number;
  readonly pauseRemaining: number;
}

/** 创建一次战斗资源账本所需的完整初始状态。 */
export interface CombatResourceSnapshot {
  readonly sp: number;
  readonly maxSp: number;
  readonly returnedSp: number;
  /** 原生 SkillSetting 提供的共享 SP 获取基础效率。 */
  readonly sharedSpGain: SharedSpGainSettings;
  readonly spRecovery: SpRecoverySnapshot;
  readonly ultimateEnergySystemUnlocked: boolean;
  readonly squad: readonly OperatorResourceSnapshot[];
  readonly normalSkillUltimateEnergy: NormalSkillUltimateEnergySettings;
}

/** 技能费用尝试的结果；失败时不改变资源账本。 */
export interface SkillPaymentResult {
  readonly paid: boolean;
  readonly nonReturnedSpCost: number;
  /** 支付成功时按费用配置顺序产生的实际账本变化。 */
  readonly changes: readonly SkillPaymentChange[];
}

/** 技能支付直接产生的资源变化；运行时凭它记录事实，不再次读取或计算账本。 */
export type SkillPaymentChange =
  | {
      readonly resource: 'sp';
      readonly baseValue: number;
      readonly requestedValue: number;
      readonly actualValue: number;
      readonly previousValue: number;
      readonly currentValue: number;
    }
  | ({ readonly resource: 'ultimateEnergy' } & UltimateEnergyChange);

/** 一次共享技力增加的请求值、实际值与前后账本状态。 */
export interface SpChange {
  readonly baseValue: number;
  readonly requestedValue: number;
  readonly actualValue: number;
  readonly previousValue: number;
  readonly currentValue: number;
  readonly gainKind: SpGainKind;
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

/** 一次终结技能量变化在原生倍率链与恢复许可中的可选语义。 */
export interface UltimateEnergyChangeOptions {
  readonly coefficient?: number;
  readonly isPercentValue?: boolean;
  readonly recoveryTag?: GameplayTag;
  readonly ignoreGainMultiplier?: boolean;
}

interface OperatorResources extends Omit<
  OperatorResourceSnapshot,
  'ultimateEnergy' | 'allowedUltimateEnergyRecoveryTags'
> {
  ultimateEnergy: number;
  allowedUltimateEnergyRecoveryTags: ReadonlySet<GameplayTag> | null;
}

export interface CombatResourceRuntimeResolvers {
  /** 原生每次正向回能时读取目标当前 UltimateSpGainScalar。 */
  readonly ultimateEnergyGainMultiplier?: (operatorId: string) => number;
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
  readonly #maxSp: number;
  #returnedSp: number;
  readonly #spRecoveryPerSecond: number;
  readonly #spRecoveryPauseDuration: number;
  #spRecoveryPauseRemaining: number;
  readonly #ultimateEnergySystemUnlocked: boolean;
  readonly #squad: readonly OperatorResources[];
  readonly #operators = new Map<string, OperatorResources>();
  readonly #baseUltimateRecoveryRestrictions = new Map<string, ReadonlySet<GameplayTag> | null>();
  readonly #ultimateRecoveryRestrictionHandles = new Map<
    number,
    { readonly operatorId: string; readonly allowed: ReadonlySet<GameplayTag> }
  >();
  #nextUltimateRecoveryRestrictionHandle = 1;
  readonly #normalSkillUltimateEnergy: NormalSkillUltimateEnergySettings;
  /** 一次战斗唯一的共享 SP 获取效率注册表，供 Buff 与资源动作共同使用。 */
  readonly sharedSpGainModifiers: SharedSpGainModifierSet;

  constructor(
    snapshot: CombatResourceSnapshot,
    readonly resolvers: CombatResourceRuntimeResolvers = {},
  ) {
    requireNonNegativeFinite(snapshot.sp, 'sp');
    requireNonNegativeFinite(snapshot.maxSp, 'maxSp');
    requireNonNegativeFinite(snapshot.returnedSp, 'returnedSp');
    requireNonNegativeFinite(snapshot.spRecovery.valuePerSecond, 'spRecovery.valuePerSecond');
    requireNonNegativeFinite(snapshot.spRecovery.pauseDuration, 'spRecovery.pauseDuration');
    requireNonNegativeFinite(snapshot.spRecovery.pauseRemaining, 'spRecovery.pauseRemaining');
    if (snapshot.sp > snapshot.maxSp + RESOURCE_EPSILON) {
      throw new RangeError('sp exceeds its maximum');
    }
    if (snapshot.returnedSp > snapshot.sp + RESOURCE_EPSILON) {
      throw new RangeError('returnedSp exceeds current sp');
    }
    requireFinite(
      snapshot.normalSkillUltimateEnergy.selfGainPerSp,
      'normalSkillUltimateEnergy.selfGainPerSp',
    );
    requireFinite(
      snapshot.normalSkillUltimateEnergy.otherGainPerSp,
      'normalSkillUltimateEnergy.otherGainPerSp',
    );
    this.#sp = snapshot.sp;
    this.#maxSp = snapshot.maxSp;
    this.#returnedSp = snapshot.returnedSp;
    this.sharedSpGainModifiers = new SharedSpGainModifierSet({ ...snapshot.sharedSpGain });
    this.#spRecoveryPerSecond = snapshot.spRecovery.valuePerSecond;
    this.#spRecoveryPauseDuration = snapshot.spRecovery.pauseDuration;
    this.#spRecoveryPauseRemaining = snapshot.spRecovery.pauseRemaining;
    this.#ultimateEnergySystemUnlocked = snapshot.ultimateEnergySystemUnlocked;
    this.#normalSkillUltimateEnergy = { ...snapshot.normalSkillUltimateEnergy };
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
      const runtime = {
        ...member,
        allowedUltimateEnergyRecoveryTags:
          member.allowedUltimateEnergyRecoveryTags === null
            ? null
            : new Set(member.allowedUltimateEnergyRecoveryTags),
      };
      this.#operators.set(member.operatorId, runtime);
      this.#baseUltimateRecoveryRestrictions.set(
        member.operatorId,
        member.allowedUltimateEnergyRecoveryTags === null
          ? null
          : new Set(member.allowedUltimateEnergyRecoveryTags),
      );
      return runtime;
    });
  }

  get sp(): number {
    return this.#sp;
  }

  get returnedSp(): number {
    return this.#returnedSp;
  }

  get spRecoveryPauseRemaining(): number {
    return this.#spRecoveryPauseRemaining;
  }

  /** 读取当前完整账本；所有复合值均与运行时状态隔离。 */
  snapshot(): CombatResourceSnapshot {
    return {
      sp: this.#sp,
      maxSp: this.#maxSp,
      returnedSp: this.#returnedSp,
      sharedSpGain: { ...this.sharedSpGainModifiers.settings },
      spRecovery: {
        valuePerSecond: this.#spRecoveryPerSecond,
        pauseDuration: this.#spRecoveryPauseDuration,
        pauseRemaining: this.#spRecoveryPauseRemaining,
      },
      ultimateEnergySystemUnlocked: this.#ultimateEnergySystemUnlocked,
      squad: this.#squad.map(member => ({
        operatorId: member.operatorId,
        ultimateEnergy: member.ultimateEnergy,
        maxUltimateEnergy: member.maxUltimateEnergy,
        ultimateEnergyGainMultiplier: member.ultimateEnergyGainMultiplier,
        allowedUltimateEnergyRecoveryTags:
          member.allowedUltimateEnergyRecoveryTags === null
            ? null
            : new Set(member.allowedUltimateEnergyRecoveryTags),
      })),
      normalSkillUltimateEnergy: { ...this.#normalSkillUltimateEnergy },
    };
  }

  gainSp(
    value: number,
    gainKind: SpGainKind = 'gain',
    source?: Parameters<SharedSpGainModifierSet['resolve']>[0],
  ): SpChange {
    requireNonNegativeFinite(value, 'sp gain');
    const requestedValue =
      source === undefined
        ? value
        : value *
          this.sharedSpGainModifiers.resolve(source, gainKind === 'refund' ? 'return' : 'gain')
            .totalEfficiency;
    const previousValue = this.#sp;
    this.#sp = Math.min(this.#maxSp, previousValue + requestedValue);
    const actualValue = this.#sp - previousValue;
    if (gainKind === 'refund') this.#returnedSp += actualValue;
    return {
      baseValue: value,
      requestedValue,
      actualValue,
      previousValue,
      currentValue: this.#sp,
      gainKind,
    };
  }

  /**
   * 推进战斗内自然恢复。暂停在本帧开始时仍有效时，整帧都不会恢复技力。
   */
  advanceInCombatSpRecovery(deltaSeconds: number): SpChange {
    requireNonNegativeFinite(deltaSeconds, 'sp recovery delta');
    if (this.#spRecoveryPauseRemaining > RESOURCE_EPSILON) {
      this.#spRecoveryPauseRemaining -= deltaSeconds;
      return this.#unchangedSpChange(0);
    }

    const requestedValue = this.#spRecoveryPerSecond * deltaSeconds;
    const change = this.gainSp(requestedValue);
    const overflow = requestedValue - change.actualValue;
    if (this.#returnedSp > RESOURCE_EPSILON && overflow > RESOURCE_EPSILON) {
      this.#returnedSp = Math.max(0, this.#returnedSp - overflow);
    }
    return change;
  }

  getUltimateEnergy(operatorId: string): number {
    return this.#requireOperator(operatorId).ultimateEnergy;
  }

  /** 读取指定队员本场构筑结算后的终结技能量上限。 */
  getMaxUltimateEnergy(operatorId: string): number {
    return this.#requireOperator(operatorId).maxUltimateEnergy;
  }

  /**
   * 应用一次以基础值表达的个人终结技能量变化。
   * 严格按“回能效率 -> 百分比最大值 -> 系数 -> 回复标签许可”的原生顺序结算。
   */
  changeUltimateEnergy(
    operatorId: string,
    baseValue: number,
    options: UltimateEnergyChangeOptions = {},
  ): UltimateEnergyChange {
    requireFinite(baseValue, 'ultimate energy base value');
    const coefficient = options.coefficient ?? 1;
    requireFinite(coefficient, 'ultimate energy coefficient');
    const operator = this.#requireOperator(operatorId);
    let requestedValue = Math.fround(baseValue);
    if (baseValue > 0 && !options.ignoreGainMultiplier) {
      const multiplier =
        this.resolvers.ultimateEnergyGainMultiplier?.(operatorId) ??
        operator.ultimateEnergyGainMultiplier;
      requireFinite(multiplier, `operator '${operatorId}' ultimate energy gain multiplier`);
      requestedValue = Math.fround(requestedValue * multiplier);
    }
    if (options.isPercentValue) {
      requestedValue = Math.fround(requestedValue * operator.maxUltimateEnergy);
    }
    requestedValue = Math.fround(requestedValue * coefficient);
    const previousValue = operator.ultimateEnergy;
    const applied = this.#trySetUltimateEnergy(
      operator,
      previousValue + requestedValue,
      options.recoveryTag,
    );
    return {
      operatorId,
      baseValue,
      requestedValue,
      applied,
      actualValue: operator.ultimateEnergy - previousValue,
      previousValue,
      currentValue: operator.ultimateEnergy,
    };
  }

  canPay(operatorId: string, costs: readonly CompiledSkillCost[]): boolean {
    return costs.every(cost => {
      const available =
        cost.resource === 'sp' ? this.#sp : this.#requireOperator(operatorId).ultimateEnergy;
      return available + RESOURCE_EPSILON >= cost.value;
    });
  }

  pay(operatorId: string, costs: readonly CompiledSkillCost[]): SkillPaymentResult {
    if (!this.canPay(operatorId, costs)) {
      return { paid: false, nonReturnedSpCost: 0, changes: [] };
    }
    let nonReturnedSpCost = 0;
    const changes: SkillPaymentChange[] = [];
    for (const cost of costs) {
      if (cost.resource === 'sp') {
        // 原生 Skill._ApplyCost 只在最终 ATB 费用大于 epsilon 时调用 CostAtb。
        if (cost.value <= RESOURCE_EPSILON) continue;
        const previousValue = this.#sp;
        this.#sp = Math.max(0, this.#sp - cost.value);
        const consumedReturnedSp = Math.min(this.#returnedSp, cost.value);
        this.#returnedSp -= consumedReturnedSp;
        nonReturnedSpCost = cost.value - consumedReturnedSp;
        this.#spRecoveryPauseRemaining = this.#spRecoveryPauseDuration;
        changes.push({
          resource: 'sp',
          baseValue: -cost.value,
          requestedValue: -cost.value,
          actualValue: this.#sp - previousValue,
          previousValue,
          currentValue: this.#sp,
        });
      } else {
        const previousValue = this.getUltimateEnergy(operatorId);
        // 原生 `Skill.ApplyCost` 会忽略终结技能量 Setter 的返回值。
        const applied = this.#trySetUltimateEnergy(
          this.#requireOperator(operatorId),
          previousValue - cost.value,
        );
        const currentValue = this.getUltimateEnergy(operatorId);
        changes.push({
          resource: 'ultimateEnergy',
          operatorId,
          baseValue: -cost.value,
          requestedValue: -cost.value,
          applied,
          actualValue: currentValue - previousValue,
          previousValue,
          currentValue,
        });
      }
    }
    return { paid: true, nonReturnedSpCost, changes };
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
      return this.changeUltimateEnergy(member.operatorId, baseValue);
    });
  }

  requestUltimateEnergyRecoveryRestriction(
    operatorId: string,
    allowedRecoveryTags: ReadonlySet<GameplayTag>,
  ): number {
    this.#requireOperator(operatorId);
    const handle = this.#nextUltimateRecoveryRestrictionHandle++;
    this.#ultimateRecoveryRestrictionHandles.set(handle, {
      operatorId,
      allowed: new Set(allowedRecoveryTags),
    });
    this.#refreshUltimateEnergyRecoveryRestriction(operatorId);
    return handle;
  }

  revertUltimateEnergyRecoveryRestriction(
    handle: number,
    clearUltimateEnergyOnEnd: boolean,
  ): UltimateEnergyChange | null {
    const entry = this.#ultimateRecoveryRestrictionHandles.get(handle);
    if (entry === undefined) return null;
    this.#ultimateRecoveryRestrictionHandles.delete(handle);
    this.#refreshUltimateEnergyRecoveryRestriction(entry.operatorId);
    if (!clearUltimateEnergyOnEnd) return null;
    const current = this.getUltimateEnergy(entry.operatorId);
    return this.changeUltimateEnergy(entry.operatorId, -current);
  }

  #refreshUltimateEnergyRecoveryRestriction(operatorId: string): void {
    const dynamic = [...this.#ultimateRecoveryRestrictionHandles.values()].filter(
      entry => entry.operatorId === operatorId,
    );
    const operator = this.#requireOperator(operatorId);
    if (dynamic.length === 0) {
      const base = this.#baseUltimateRecoveryRestrictions.get(operatorId)!;
      operator.allowedUltimateEnergyRecoveryTags = base === null ? null : new Set(base);
      return;
    }
    const allowed = new Set<GameplayTag>();
    const base = this.#baseUltimateRecoveryRestrictions.get(operatorId);
    if (base !== null && base !== undefined) for (const tag of base) allowed.add(tag);
    for (const entry of dynamic) for (const tag of entry.allowed) allowed.add(tag);
    operator.allowedUltimateEnergyRecoveryTags = allowed;
  }

  #trySetUltimateEnergy(
    operator: OperatorResources,
    value: number,
    recoveryTag?: GameplayTag,
  ): boolean {
    const restriction = operator.allowedUltimateEnergyRecoveryTags;
    if (
      !this.#ultimateEnergySystemUnlocked ||
      (value > operator.ultimateEnergy &&
        restriction !== null &&
        (recoveryTag === undefined || !restriction.has(recoveryTag)))
    ) {
      return false;
    }
    const clamped = Math.min(operator.maxUltimateEnergy, Math.max(0, value));
    if (Math.abs(clamped - operator.ultimateEnergy) <= ULTIMATE_ENERGY_EPSILON) return false;
    operator.ultimateEnergy = clamped;
    return true;
  }

  #unchangedSpChange(requestedValue: number): SpChange {
    return {
      baseValue: requestedValue,
      requestedValue,
      actualValue: 0,
      previousValue: this.#sp,
      currentValue: this.#sp,
      gainKind: 'gain',
    };
  }

  #requireOperator(operatorId: string): OperatorResources {
    const operator = this.#operators.get(operatorId);
    if (operator === undefined) throw new Error(`squad operator '${operatorId}' is not configured`);
    return operator;
  }
}
