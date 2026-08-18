/**
 * 单次玩家伤害包跨原生处理阶段传递的唯一上下文。
 * 每次命中都应新建实例；处理器只能在自己的阶段修改允许的字段。
 */
import type { DamageFeature, DamageTag, DamageType } from '../../game-data/operatorDefinition';
import type {
  AttributeModifierTiming,
  AttributeModifierValues,
} from '../attributes/combatAttributes';
import { DamageScaleAccumulator } from './damageScale';
import type { DamageScaleAttributeSnapshot } from './damageScaleAttributes';
import type {
  PlayerDamageAttackerSnapshot,
  PlayerDamageDefenderSnapshot,
} from './playerActiveDamageInput';

export const DAMAGE_PROCESS_TIMINGS = ['beforeCalculation', 'afterCalculation'] as const;
/** 伤害修正器可以挂载的原生处理阶段。 */
export type DamageProcessTiming = (typeof DAMAGE_PROCESS_TIMINGS)[number];

export const DAMAGE_MODIFIER_SIDES = ['attacker', 'defender'] as const;
/** 指明修正来自伤害来源方还是目标方。 */
export type DamageModifierSide = (typeof DAMAGE_MODIFIER_SIDES)[number];

export const DAMAGE_TARGET_HEALTH_TYPES = ['none', 'normal', 'independent'] as const;
/** 目标的生命形态分类，供特定伤害规则筛选。 */
export type DamageTargetHealthType = (typeof DAMAGE_TARGET_HEALTH_TYPES)[number];

/** 单次伤害包冻结的来源方与目标方属性快照。 */
export interface PlayerDamageAttributeSnapshots {
  readonly attacker: PlayerDamageAttackerSnapshot & DamageScaleAttributeSnapshot;
  readonly defender: PlayerDamageDefenderSnapshot & DamageScaleAttributeSnapshot;
}

/** 伤害处理阶段临时加入、结束后必须清理的属性修正请求。 */
export interface InstantAttributeModifierRequest {
  readonly attribute: string;
  readonly values: AttributeModifierValues;
  readonly timing: AttributeModifierTiming;
}

/** 伤害上下文访问属性修正注册表所需的受控端口。 */
export interface PlayerDamageContextPorts {
  readonly captureAttributeSnapshots: () => PlayerDamageAttributeSnapshots;
  readonly applyModifiers: (
    timing: DamageProcessTiming,
    side: DamageModifierSide,
    context: PlayerDamageContext,
  ) => void;
  readonly addInstantAttributeModifier: (
    side: DamageModifierSide,
    request: InstantAttributeModifierRequest,
  ) => void;
  readonly clearInstantAttributeModifiers: (side: DamageModifierSide) => void;
}

interface PlayerDamageContextInput {
  readonly sourceId: string;
  readonly targetId: string;
  readonly damageType: DamageType;
  readonly targetHealthType: DamageTargetHealthType;
  readonly tags?: readonly DamageTag[];
  readonly features?: readonly DamageFeature[];
  readonly ports: PlayerDamageContextPorts;
}

/** 遵循已还原原生伤害包生命周期的单次命中可变状态。 */
export class PlayerDamageContext {
  readonly sourceId: string;
  readonly targetId: string;
  readonly damageType: DamageType;
  readonly targetHealthType: DamageTargetHealthType;
  readonly tags: readonly DamageTag[];
  readonly features: readonly DamageFeature[];
  readonly damageScales = new DamageScaleAccumulator();
  readonly #ports: PlayerDamageContextPorts;
  #baseValue = 0;
  #value = 0;
  #pendingCalculationScale = 1;
  #hasCalculationResult = false;
  #snapshots: PlayerDamageAttributeSnapshots;

  constructor(input: PlayerDamageContextInput) {
    this.sourceId = input.sourceId;
    this.targetId = input.targetId;
    this.damageType = input.damageType;
    this.targetHealthType = input.targetHealthType;
    this.tags = input.tags ?? [];
    this.features = input.features ?? [];
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

  getEntityId(side: DamageModifierSide): string {
    return side === 'attacker' ? this.sourceId : this.targetId;
  }

  addInstantAttributeModifier(
    side: DamageModifierSide,
    request: InstantAttributeModifierRequest,
  ): void {
    this.#ports.addInstantAttributeModifier(side, request);
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
