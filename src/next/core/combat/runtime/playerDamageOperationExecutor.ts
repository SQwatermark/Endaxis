/**
 * 生命伤害与独立失衡步骤进入玩家主动伤害生命周期的装配点。
 * 调用方必须提供同一命中的属性快照和事件端口；此处顺序具有战斗语义，不能随意拆分或并行。
 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type {
  ActionValueOperand,
  OperatorAttribute,
  SkillType,
} from '../../game-data/operatorDefinition';
import { calculateBreakingAttackValue } from '../damage/breakingAttackDamage';
import { executeHealthDamage } from '../damage/healthDamage';
import { calculatePlayerActiveDamage } from '../damage/playerActiveDamage';
import {
  PlayerDamageContext,
  type DamageModifierSide,
  type DamageProcessTiming,
  type InstantAttributeModifierRequest,
  type PlayerDamageAttributeSnapshots,
} from '../damage/playerDamageContext';
import {
  resolvePlayerActiveDamageInput,
  type PlayerDamageNonRandomRuntimeSnapshot,
} from '../damage/playerActiveDamageInput';
import type { CriticalSampleSource } from '../random/criticalSampleSource';
import { classifyDamageTags, injectDamageScaleAttributes } from '../damage/damageScaleAttributes';
import {
  executePoiseDamage,
  type PoiseDamageEvent,
  type PoiseDamageModifier,
} from '../damage/poiseDamage';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { CombatVitals } from './combatVitals';
import type { CombatOperationExecutor } from './skillRuntime';
import { resolveActionValueOperand } from './actionBlackboard';

type RuntimeOperation = ResolvedCombatOperationStep;
type DamageStep = Extract<RuntimeOperation, { kind: 'dealDamage' | 'dealFixedDamage' }>;
type StaggerStep = Extract<RuntimeOperation, { kind: 'dealStagger' }>;
type PoiseStep = DamageStep | StaggerStep;
type OperationContext = Parameters<CombatOperationExecutor['execute']>[1];

export const PLAYER_DAMAGE_PREPARATION_EVENTS = [
  'beforeDamageAction',
  'beforeCalculateDamage',
] as const;
/** 完整伤害公式前用于冻结属性和完成即时修正的准备事件。 */
export type PlayerDamagePreparationEvent = (typeof PLAYER_DAMAGE_PREPARATION_EVENTS)[number];

/** 同一次命中的来源方与目标方失衡倍率。 */
export interface PoiseDamageMultipliers {
  readonly output: number;
  readonly taken: number;
  readonly ignorePoiseImmune?: boolean;
}

/** 玩家伤害执行节点需要由战斗装配层提供的全部状态与事件端口。 */
export interface PlayerDamageOperationDependencies {
  readonly sourceOperatorId: string;
  /** 存档中的技能释放身份；伤害回执凭它与具体施放对应。单元测试程序可能缺失。 */
  readonly castId?: string;
  /** 只用于把本次公式已经确定的技能分类写入伤害详情回执。 */
  readonly skillType?: SkillType;
  readonly targetId: string;
  readonly targetVitals: CombatVitals;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly captureAttributeSnapshots: (step: DamageStep) => PlayerDamageAttributeSnapshots;
  readonly criticalSamples: CriticalSampleSource;
  readonly attackDetail?: {
    readonly panelAttack: number;
    readonly operatorBaseAttack: number;
    readonly weaponBaseAttack: number;
    readonly attackPercent: number;
    readonly flatAttack: number;
    readonly mainAttribute: OperatorAttribute;
    readonly secondaryAttribute: OperatorAttribute;
    readonly attributes: Readonly<Record<OperatorAttribute, number>>;
    readonly coefficients: Readonly<Record<OperatorAttribute, number>>;
  };
  /** 场景显式指定的命中覆盖；只改变本次实际结算，不污染公式中的原始暴击率。 */
  readonly isCriticalForced?: (step: DamageStep) => boolean;
  readonly resolveNonRandomRuntimeSnapshot: (
    step: DamageStep,
  ) => PlayerDamageNonRandomRuntimeSnapshot;
  readonly applyDamageModifiers: (
    timing: DamageProcessTiming,
    side: DamageModifierSide,
    context: PlayerDamageContext,
  ) => void;
  readonly clearInstantAttributeModifiers: (side: DamageModifierSide) => void;
  readonly addInstantAttributeModifier: (
    side: DamageModifierSide,
    request: InstantAttributeModifierRequest,
  ) => void;
  readonly emitPreparationEvent: (
    event: PlayerDamagePreparationEvent,
    context: PlayerDamageContext,
  ) => void;
  readonly resolvePoiseMultipliers: (step: PoiseStep) => PoiseDamageMultipliers;
  readonly emitHealthSourceEvent: Parameters<typeof executeHealthDamage>[0]['emitSourceEvent'];
  readonly emitHealthTargetEvent: Parameters<typeof executeHealthDamage>[0]['emitTargetEvent'];
  readonly absorbHealthDamage?: Parameters<typeof executeHealthDamage>[0]['absorbDamage'];
  readonly emitPoiseSourceEvent: (event: PoiseDamageEvent, modifier: PoiseDamageModifier) => void;
  readonly emitPoiseTargetEvent: (event: PoiseDamageEvent, modifier: PoiseDamageModifier) => void;
  /** 生命伤害已经写入目标后，向统一语义事件层报告本次命中。 */
  readonly emitSemanticHit?: (step: DamageStep) => void;
  readonly delegate: CombatOperationExecutor;
}

/** 执行已确认的标准玩家伤害路径，包括两个修正阶段。 */
export class PlayerDamageOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: PlayerDamageOperationDependencies) {}

  execute(step: RuntimeOperation, operationContext?: OperationContext): boolean {
    if (step.kind === 'dealStagger') {
      this.#executePoise(
        step,
        this.#resolveActionValue(step.parameters.value, operationContext, 'dynamic stagger value'),
      );
      return true;
    }
    if (step.kind !== 'dealDamage' && step.kind !== 'dealFixedDamage') {
      return operationContext === undefined
        ? this.dependencies.delegate.execute(step)
        : this.dependencies.delegate.execute(step, operationContext);
    }

    if (step.kind === 'dealDamage' && step.parameters.attackScalePerStatusStack !== undefined) {
      throw new Error('status-stack attack scale must be resolved by its recovered branch');
    }
    if (step.parameters.damageType === 'lifeDrain') {
      throw new Error('life-drain damage uses a separate native calculation branch');
    }
    const context = new PlayerDamageContext({
      sourceId: this.dependencies.sourceOperatorId,
      targetId: this.dependencies.targetId,
      damageType: step.parameters.damageType,
      targetHealthType: 'normal',
      tags: step.parameters.tags,
      features: step.parameters.features ?? [],
      ports: {
        captureAttributeSnapshots: () => this.dependencies.captureAttributeSnapshots(step),
        applyModifiers: (timing, side, damageContext) =>
          this.dependencies.applyDamageModifiers(timing, side, damageContext),
        addInstantAttributeModifier: this.dependencies.addInstantAttributeModifier,
        clearInstantAttributeModifiers: this.dependencies.clearInstantAttributeModifiers,
      },
    });
    try {
      this.dependencies.emitPreparationEvent('beforeDamageAction', context);
      this.dependencies.emitPreparationEvent('beforeCalculateDamage', context);
      context.applyModifiers('beforeCalculation');
      context.setCalculationResult(this.#resolveCalculationResult(step, context, operationContext));
      injectDamageScaleAttributes(context.damageScales, {
        damageType: step.parameters.damageType,
        classifications: classifyDamageTags(step.parameters.tags),
        attacker: context.attackerAttributes,
        defender: context.defenderAttributes,
        defenderStaggered: this.dependencies.targetVitals.hasPoiseBrokenTag,
      });
      const finalAttackValue = context.resolveFinalAttackValue();
      const runtimeSnapshot = this.dependencies.resolveNonRandomRuntimeSnapshot(step);
      const criticalForced = this.dependencies.isCriticalForced?.(step) === true;
      const formulaInput = resolvePlayerActiveDamageInput({
        step,
        finalAttackValue,
        attacker: context.attackerAttributes,
        defender: context.defenderAttributes,
        runtime: {
          ...runtimeSnapshot,
          appliesPhysicalInflictionDamageMultiplier:
            runtimeSnapshot.appliesPhysicalInflictionDamageMultiplier ||
            (step.parameters.features ?? []).includes('physicalInfliction'),
          criticalSample:
            !criticalForced && context.attackerAttributes.criticalRate > 0.00001
              ? this.dependencies.criticalSamples.nextCriticalSample()
              : 0,
        },
      });
      const damageResult = calculatePlayerActiveDamage(
        criticalForced ? { ...formulaInput, criticalRate: 1, criticalSample: 0 } : formulaInput,
      );
      const nonCriticalDamage = damageResult.value / damageResult.criticalMultiplier;
      const criticalDamage =
        nonCriticalDamage * (1 + context.attackerAttributes.criticalDamageIncrease);
      const expectedDamage =
        nonCriticalDamage *
        (1 +
          Math.min(Math.max(context.attackerAttributes.criticalRate, 0), 1) *
            context.attackerAttributes.criticalDamageIncrease);
      const standardCalculation =
        step.kind === 'dealDamage' &&
        (step.parameters.calculation === undefined || step.parameters.calculation === 'standard');
      const damageScaleMultiplier = context.damageScales.getFinalValue();
      const unscaledCalculationValue = context.baseValue * damageScaleMultiplier;
      const calculationMultiplier =
        Math.abs(unscaledCalculationValue) <= Number.EPSILON
          ? 1
          : finalAttackValue / unscaledCalculationValue;
      const attackDetail = this.dependencies.attackDetail;
      const hasExactAttackDetail =
        attackDetail !== undefined &&
        Math.abs(attackDetail.panelAttack - context.attackerAttributes.attack) <= Number.EPSILON;
      executeHealthDamage({
        sourceId: this.dependencies.sourceOperatorId,
        targetId: this.dependencies.targetId,
        damageType: step.parameters.damageType,
        tags: step.parameters.tags,
        features: step.parameters.features ?? [],
        result: damageResult,
        detail: {
          ...(this.dependencies.skillType === undefined
            ? {}
            : { skillType: this.dependencies.skillType }),
          attack: context.attackerAttributes.attack,
          ...(hasExactAttackDetail
            ? {
                attackDetailOperatorBase: attackDetail.operatorBaseAttack,
                attackDetailWeaponBase: attackDetail.weaponBaseAttack,
                attackDetailAttackPercent: attackDetail.attackPercent,
                attackDetailFlatAttack: attackDetail.flatAttack,
                attackDetailMainAttribute: attackDetail.mainAttribute,
                attackDetailSecondaryAttribute: attackDetail.secondaryAttribute,
                attackDetailStrength: attackDetail.attributes.strength,
                attackDetailAgility: attackDetail.attributes.agility,
                attackDetailIntellect: attackDetail.attributes.intellect,
                attackDetailWill: attackDetail.attributes.will,
                attackDetailStrengthCoefficient: attackDetail.coefficients.strength,
                attackDetailAgilityCoefficient: attackDetail.coefficients.agility,
                attackDetailIntellectCoefficient: attackDetail.coefficients.intellect,
                attackDetailWillCoefficient: attackDetail.coefficients.will,
              }
            : {}),
          baseDamage: context.baseValue,
          finalAttackValue,
          standardCalculation,
          ...(standardCalculation && context.attackerAttributes.attack !== 0
            ? {
                skillMultiplierPercent:
                  (context.baseValue / context.attackerAttributes.attack) * 100,
              }
            : {}),
          calculationMultiplier,
          damageScaleMultiplier,
          criticalRate: context.attackerAttributes.criticalRate,
          criticalDamageIncrease: context.attackerAttributes.criticalDamageIncrease,
          nonCriticalDamage,
          criticalDamage,
          expectedDamage,
          enemyDefense: context.defenderAttributes.defense,
          enemyResistancePercent: formulaInput.resistancePercent,
          damageTakenMultiplier: formulaInput.damageTakenMultiplier,
          weaknessDamageMultiplier: formulaInput.weaknessDamageMultiplier,
          shelterDamageMultiplier: formulaInput.shelterDamageMultiplier,
        },
        target: this.dependencies.targetVitals,
        clock: this.dependencies.clock,
        receipt: this.dependencies.receipt,
        ...(this.dependencies.castId === undefined ? {} : { castId: this.dependencies.castId }),
        ...(step.key === undefined ? {} : { stepKey: step.key }),
        ...(step.hitId === undefined ? {} : { hitId: step.hitId }),
        emitSourceEvent: this.dependencies.emitHealthSourceEvent,
        emitTargetEvent: this.dependencies.emitHealthTargetEvent,
        ...(this.dependencies.absorbHealthDamage === undefined
          ? {}
          : { absorbDamage: this.dependencies.absorbHealthDamage }),
      });
      this.dependencies.emitSemanticHit?.(step);

      if (step.parameters.stagger !== undefined) {
        this.#executePoise(
          step,
          this.#resolveActionValue(
            step.parameters.stagger,
            operationContext,
            'dynamic stagger value',
          ),
        );
      }
      return true;
    } finally {
      context.dispose();
    }
  }

  /** 只选择原生基础值计算分支；所有分支完成后仍共享同一伤害修正和最终公式。 */
  #resolveCalculationResult(
    step: DamageStep,
    context: PlayerDamageContext,
    operationContext: OperationContext | undefined,
  ): number {
    if (step.kind === 'dealFixedDamage') {
      return this.#resolveActionValue(
        step.parameters.value,
        operationContext,
        'dynamic fixed damage value',
      );
    }
    const attackScale = this.#resolveActionValue(
      step.parameters.attackScale,
      operationContext,
      'dynamic damage scale',
    );
    if (step.parameters.calculation === 'attribute') {
      const attributeValue = context.attackerAttributes.calculationAttributeValue;
      if (attributeValue === undefined) {
        throw new Error(
          `damage calculation attribute '${step.parameters.calculationAttribute ?? ''}' is missing`,
        );
      }
      const addition = this.#resolveActionValue(
        step.parameters.calculationAddition ?? 0,
        operationContext,
        'dynamic damage calculation addition',
      );
      return attributeValue * attackScale + addition;
    }
    if (step.parameters.calculation !== 'breakingAttack') {
      return context.attackerAttributes.attack * attackScale;
    }
    return calculateBreakingAttackValue({
      attack: context.attackerAttributes.attack,
      targetDamageTakenMultiplier: context.defenderAttributes.breakingAttackDamageTakenMultiplier,
      calculationMultiplier: step.parameters.calculationMultiplier ?? 1,
      attackScale,
    });
  }

  #executePoise(step: PoiseStep, calculationValue: number): void {
    const multipliers = this.dependencies.resolvePoiseMultipliers(step);
    executePoiseDamage({
      sourceId: this.dependencies.sourceOperatorId,
      targetId: this.dependencies.targetId,
      target: this.dependencies.targetVitals,
      calculationValue,
      outputMultiplier: multipliers.output,
      takenMultiplier: multipliers.taken,
      ignorePoiseImmune: multipliers.ignorePoiseImmune,
      clock: this.dependencies.clock,
      receipt: this.dependencies.receipt,
      emitSourceEvent: this.dependencies.emitPoiseSourceEvent,
      emitTargetEvent: this.dependencies.emitPoiseTargetEvent,
    });
  }

  #resolveActionValue(
    value: number | ActionValueOperand,
    operationContext: OperationContext | undefined,
    missingContextMessage: string,
  ): number {
    if (typeof value === 'number') return value;
    if (operationContext === undefined)
      throw new Error(`${missingContextMessage} requires an action blackboard`);
    return resolveActionValueOperand(value, operationContext.blackboard);
  }

  end(
    step: Parameters<NonNullable<CombatOperationExecutor['end']>>[0],
    context?: Parameters<NonNullable<CombatOperationExecutor['end']>>[1],
  ): void {
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }
}
