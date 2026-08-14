/**
 * 生命伤害与独立失衡步骤进入玩家主动伤害生命周期的装配点。
 * 调用方必须提供同一命中的属性快照和事件端口；此处顺序具有战斗语义，不能随意拆分或并行。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { ActionValueOperand } from '../../game-data/operatorDefinition';
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

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' | 'once' }>;
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
  readonly targetId: string;
  readonly targetVitals: CombatVitals;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly captureAttributeSnapshots: (step: DamageStep) => PlayerDamageAttributeSnapshots;
  readonly criticalSamples: CriticalSampleSource;
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
      ports: {
        captureAttributeSnapshots: () => this.dependencies.captureAttributeSnapshots(step),
        applyModifiers: (timing, side, damageContext) =>
          this.dependencies.applyDamageModifiers(timing, side, damageContext),
        addInstantAttributeModifier: this.dependencies.addInstantAttributeModifier,
        clearInstantAttributeModifiers: this.dependencies.clearInstantAttributeModifiers,
      },
    });
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
    const formulaInput = resolvePlayerActiveDamageInput({
      step,
      finalAttackValue,
      attacker: context.attackerAttributes,
      defender: context.defenderAttributes,
      runtime: {
        ...this.dependencies.resolveNonRandomRuntimeSnapshot(step),
        criticalSample:
          context.attackerAttributes.criticalRate > 0.00001
            ? this.dependencies.criticalSamples.nextCriticalSample()
            : 0,
      },
    });
    const damageResult = calculatePlayerActiveDamage(formulaInput);
    executeHealthDamage({
      sourceId: this.dependencies.sourceOperatorId,
      targetId: this.dependencies.targetId,
      damageType: step.parameters.damageType,
      tags: step.parameters.tags,
      features: step.parameters.features ?? [],
      result: damageResult,
      target: this.dependencies.targetVitals,
      clock: this.dependencies.clock,
      receipt: this.dependencies.receipt,
      ...(this.dependencies.castId === undefined ? {} : { castId: this.dependencies.castId }),
      ...(step.key === undefined ? {} : { stepKey: step.key }),
      ...(step.hitId === undefined ? {} : { hitId: step.hitId }),
      emitSourceEvent: this.dependencies.emitHealthSourceEvent,
      emitTargetEvent: this.dependencies.emitHealthTargetEvent,
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

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }
}
