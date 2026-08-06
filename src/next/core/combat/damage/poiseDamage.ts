import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from '../runtime/combatClock';
import type { CombatVitals } from '../runtime/combatVitals';

export const POISE_DAMAGE_EVENTS = [
  'beforeOutputPoiseDamage',
  'beforeTakePoiseDamage',
  'takePoiseDamage',
  'poiseZero',
] as const;
export type PoiseDamageEvent = (typeof POISE_DAMAGE_EVENTS)[number];

export interface PoiseDamageModifier {
  readonly sourceId: string;
  readonly targetId: string;
  finalDelta: number;
  actualDelta: number;
  readonly ignorePoiseImmune: boolean;
  cancelled: boolean;
}

export interface CalculatePoiseDamageInput {
  readonly calculationValue: number;
  readonly outputMultiplier: number;
  readonly takenMultiplier: number;
}

export interface ExecutePoiseDamageInput extends CalculatePoiseDamageInput {
  readonly sourceId: string;
  readonly targetId: string;
  readonly target: CombatVitals;
  readonly ignorePoiseImmune?: boolean;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly emitSourceEvent: (event: PoiseDamageEvent, modifier: PoiseDamageModifier) => void;
  readonly emitTargetEvent: (event: PoiseDamageEvent, modifier: PoiseDamageModifier) => void;
}

export interface PoiseDamageExecutionResult {
  readonly calculatedDamage: number;
  readonly requestedDelta: number;
  readonly actualDelta: number;
  readonly cancelled: boolean;
  readonly brokePoise: boolean;
  readonly previousPoise: number;
  readonly currentPoise: number;
}

/** Recovered poise formula before event listeners modify the final delta. */
export function calculatePoiseDamage(input: CalculatePoiseDamageInput): number {
  return input.calculationValue * input.outputMultiplier * input.takenMultiplier;
}

/** Applies one poise unit in the recovered source/target event order. */
export function executePoiseDamage(input: ExecutePoiseDamageInput): PoiseDamageExecutionResult {
  const calculatedDamage = calculatePoiseDamage(input);
  const modifier: PoiseDamageModifier = {
    sourceId: input.sourceId,
    targetId: input.targetId,
    finalDelta: -calculatedDamage,
    actualDelta: 0,
    ignorePoiseImmune: input.ignorePoiseImmune ?? false,
    cancelled: false,
  };

  if (Math.abs(modifier.finalDelta) <= 0.00001) {
    return unchangedPoise(calculatedDamage, input.target, modifier.finalDelta);
  }

  input.emitSourceEvent('beforeOutputPoiseDamage', modifier);
  input.emitTargetEvent('beforeTakePoiseDamage', modifier);

  const previousPoise = input.target.poise;
  modifier.cancelled =
    modifier.finalDelta < 0 && input.target.poiseImmune && !modifier.ignorePoiseImmune;
  let brokePoise = false;
  if (!modifier.cancelled && input.target.hasPoise) {
    modifier.actualDelta = input.target.applyPoiseDelta(modifier.finalDelta);
    if (modifier.finalDelta < 0) input.emitTargetEvent('takePoiseDamage', modifier);
    brokePoise = input.target.beginPoiseBreakIfZero();
    if (brokePoise) input.emitTargetEvent('poiseZero', modifier);
  }

  input.receipt.record({
    frame: input.clock.frame,
    time: input.clock.time,
    event: 'PoiseApplied',
    sourceId: input.sourceId,
    targetId: input.targetId,
    data: {
      calculationValue: input.calculationValue,
      calculatedDamage,
      requestedDelta: modifier.finalDelta,
      actualDelta: modifier.actualDelta,
      cancelled: modifier.cancelled,
      remainingPoise: input.target.poise,
      inPoiseRecovery: input.target.inPoiseRecovery,
      hasPoiseBrokenTag: input.target.hasPoiseBrokenTag,
    },
  });

  return {
    calculatedDamage,
    requestedDelta: modifier.finalDelta,
    actualDelta: modifier.actualDelta,
    cancelled: modifier.cancelled,
    brokePoise,
    previousPoise,
    currentPoise: input.target.poise,
  };
}

function unchangedPoise(
  calculatedDamage: number,
  target: CombatVitals,
  requestedDelta: number,
): PoiseDamageExecutionResult {
  return {
    calculatedDamage,
    requestedDelta,
    actualDelta: 0,
    cancelled: false,
    brokePoise: false,
    previousPoise: target.poise,
    currentPoise: target.poise,
  };
}
