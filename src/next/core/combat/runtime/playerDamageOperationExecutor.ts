/**
 * `dealDamage` 与 `dealStagger` 步骤进入玩家主动伤害生命周期的装配点。
 * 调用方必须提供同一命中的属性快照和事件端口；此处顺序具有战斗语义，不能随意拆分或并行。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
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
  type PlayerDamageRuntimeSnapshot,
} from '../damage/playerActiveDamageInput';
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
type DamageStep = Extract<RuntimeOperation, { kind: 'dealDamage' }>;
type StaggerStep = Extract<RuntimeOperation, { kind: 'dealStagger' }>;
type PoiseStep = DamageStep | StaggerStep;

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
  readonly targetId: string;
  readonly targetVitals: CombatVitals;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly captureAttributeSnapshots: (step: DamageStep) => PlayerDamageAttributeSnapshots;
  readonly resolveRuntimeSnapshot: (step: DamageStep) => PlayerDamageRuntimeSnapshot;
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
  readonly delegate: CombatOperationExecutor;
}

/** 执行已确认的标准玩家伤害路径，包括两个修正阶段。 */
export class PlayerDamageOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: PlayerDamageOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    operationContext?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind === 'dealStagger') {
      this.#executePoise(step, step.parameters.value);
      return true;
    }
    if (step.kind !== 'dealDamage') {
      return operationContext === undefined
        ? this.dependencies.delegate.execute(step)
        : this.dependencies.delegate.execute(step, operationContext);
    }

    if (step.parameters.attackScalePerStatusStack !== undefined) {
      throw new Error('status-stack attack scale must be resolved by its recovered branch');
    }
    if (step.parameters.damageType === 'lifeDrain') {
      throw new Error('life-drain damage uses a separate native calculation branch');
    }
    let attackScale: number;
    if (typeof step.parameters.attackScale === 'number') {
      attackScale = step.parameters.attackScale;
    } else {
      if (operationContext === undefined) {
        throw new Error('dynamic damage scale requires an action blackboard');
      }
      attackScale = resolveActionValueOperand(
        step.parameters.attackScale,
        operationContext.blackboard,
      );
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
    context.setCalculationResult(
      step.parameters.calculation === 'breakingAttack'
        ? calculateBreakingAttackValue({
            attack: context.attackerAttributes.attack,
            targetDamageTakenMultiplier:
              context.defenderAttributes.breakingAttackDamageTakenMultiplier,
            calculationMultiplier: step.parameters.calculationMultiplier ?? 1,
            attackScale,
          })
        : context.attackerAttributes.attack * attackScale,
    );
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
      runtime: this.dependencies.resolveRuntimeSnapshot(step),
    });
    const damageResult = calculatePlayerActiveDamage(formulaInput);
    executeHealthDamage({
      sourceId: this.dependencies.sourceOperatorId,
      targetId: this.dependencies.targetId,
      damageType: step.parameters.damageType,
      result: damageResult,
      target: this.dependencies.targetVitals,
      clock: this.dependencies.clock,
      receipt: this.dependencies.receipt,
      emitSourceEvent: this.dependencies.emitHealthSourceEvent,
      emitTargetEvent: this.dependencies.emitHealthTargetEvent,
    });

    if (step.parameters.stagger !== undefined) {
      this.#executePoise(step, step.parameters.stagger);
    }
    return true;
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

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }
}
