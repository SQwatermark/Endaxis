import type { ResolvedCombatStep } from '../../compiler/combatProgram';
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

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' }>;
type DamageStep = Extract<RuntimeOperation, { kind: 'dealDamage' }>;

export const PLAYER_DAMAGE_PREPARATION_EVENTS = [
  'beforeDamageAction',
  'beforeCalculateDamage',
] as const;
export type PlayerDamagePreparationEvent = (typeof PLAYER_DAMAGE_PREPARATION_EVENTS)[number];

export interface PoiseDamageMultipliers {
  readonly output: number;
  readonly taken: number;
  readonly ignorePoiseImmune?: boolean;
}

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
  readonly resolvePoiseMultipliers: (step: DamageStep) => PoiseDamageMultipliers;
  readonly emitHealthSourceEvent: Parameters<typeof executeHealthDamage>[0]['emitSourceEvent'];
  readonly emitPoiseSourceEvent: (event: PoiseDamageEvent, modifier: PoiseDamageModifier) => void;
  readonly emitPoiseTargetEvent: (event: PoiseDamageEvent, modifier: PoiseDamageModifier) => void;
  readonly delegate: CombatOperationExecutor;
}

/** Executes the confirmed standard player-damage path, including both modifier stages. */
export class PlayerDamageOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: PlayerDamageOperationDependencies) {}

  execute(step: RuntimeOperation): boolean {
    if (step.kind !== 'dealDamage') return this.dependencies.delegate.execute(step);

    if (step.parameters.calculation === 'breakingAttack') {
      throw new Error('breaking-attack input requires the separate recovered calculation branch');
    }
    if (step.parameters.attackScalePerStatusStack !== undefined) {
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
    context.setCalculationResult(context.attackerAttributes.attack * step.parameters.attackScale);
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
    });

    if (step.parameters.stagger !== undefined) {
      const multipliers = this.dependencies.resolvePoiseMultipliers(step);
      executePoiseDamage({
        sourceId: this.dependencies.sourceOperatorId,
        targetId: this.dependencies.targetId,
        target: this.dependencies.targetVitals,
        calculationValue: step.parameters.stagger,
        outputMultiplier: multipliers.output,
        takenMultiplier: multipliers.taken,
        ignorePoiseImmune: multipliers.ignorePoiseImmune,
        clock: this.dependencies.clock,
        receipt: this.dependencies.receipt,
        emitSourceEvent: this.dependencies.emitPoiseSourceEvent,
        emitTargetEvent: this.dependencies.emitPoiseTargetEvent,
      });
    }
    return true;
  }

  evaluate(condition: Parameters<CombatOperationExecutor['evaluate']>[0]): boolean {
    return this.dependencies.delegate.evaluate(condition);
  }
}
