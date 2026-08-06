export interface BreakingAttackCalculationInput {
  readonly attack: number;
  readonly targetDamageTakenMultiplier: number;
  readonly calculationMultiplier: number;
  readonly attackScale: number;
}

/**
 * Reproduces BreakingAttackCalculation before the shared damage formula runs.
 * Each cast marks a native conversion or float multiplication boundary.
 */
export function calculateBreakingAttackValue(input: BreakingAttackCalculationInput): number {
  const scaledAttack = Math.fround(input.attack * input.targetDamageTakenMultiplier);
  const attackScale = Math.fround(input.attackScale);
  const calculationMultiplier = Math.fround(input.calculationMultiplier);
  return Math.fround(Math.fround(attackScale * calculationMultiplier) * scaledAttack);
}
