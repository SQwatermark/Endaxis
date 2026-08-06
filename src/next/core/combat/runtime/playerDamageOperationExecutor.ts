import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { executeHealthDamage } from '../damage/healthDamage';
import { calculatePlayerActiveDamage } from '../damage/playerActiveDamage';
import {
  resolvePlayerActiveDamageInput,
  type PlayerDamageAttackerSnapshot,
  type PlayerDamageDefenderSnapshot,
  type PlayerDamageRuntimeSnapshot,
} from '../damage/playerActiveDamageInput';
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

export interface PlayerDamageSnapshots {
  readonly attacker: PlayerDamageAttackerSnapshot;
  readonly defender: PlayerDamageDefenderSnapshot;
  readonly runtime: PlayerDamageRuntimeSnapshot;
}

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
  /** Supplies snapshots after the recovered event and modifier stages have run. */
  readonly resolveSnapshots: (step: DamageStep) => PlayerDamageSnapshots;
  readonly resolvePoiseMultipliers: (step: DamageStep) => PoiseDamageMultipliers;
  readonly emitHealthSourceEvent: Parameters<typeof executeHealthDamage>[0]['emitSourceEvent'];
  readonly emitPoiseSourceEvent: (event: PoiseDamageEvent, modifier: PoiseDamageModifier) => void;
  readonly emitPoiseTargetEvent: (event: PoiseDamageEvent, modifier: PoiseDamageModifier) => void;
  readonly delegate: CombatOperationExecutor;
}

/** Executes the confirmed standard player-damage path from resolved snapshots onward. */
export class PlayerDamageOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: PlayerDamageOperationDependencies) {}

  execute(step: RuntimeOperation): boolean {
    if (step.kind !== 'dealDamage') return this.dependencies.delegate.execute(step);

    const snapshots = this.dependencies.resolveSnapshots(step);
    const formulaInput = resolvePlayerActiveDamageInput({ step, ...snapshots });
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
