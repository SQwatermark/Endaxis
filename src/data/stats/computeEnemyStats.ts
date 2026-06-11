import type { ComputedEnemyStatus } from '../../types';
import type { SheetStatEffect, ResolvedStatModifier } from './types';

/** Extract the base numeric value from a sheet effect (already level-resolved). */
function getEffectValue(effect: SheetStatEffect): number {
  if (effect.value !== undefined) {
    if (Array.isArray(effect.value)) {
      return effect.value[effect.value.length - 1] ?? 0;
    }
    return effect.value;
  }
  return 0;
}

/**
 * Compute enemy status from sheet effects + dynamic modifiers.
 *
 * Sheet effects come from team-status condition-filtered enemy-targeting effects.
 * Dynamic modifiers come from EnemyState.enemyStatusEffects at time T.
 */
export function computeEnemyStats(
  sheetEffects: SheetStatEffect[],
  dynamicModifiers: ResolvedStatModifier[],
): ComputedEnemyStatus {
  let susceptibility = 0;
  let resistanceShred = 0;
  let defReduction = 0;
  let increasedDmgTaken = 0;
  const dmgReductionEffects: number[] = [];
  const elementalSusceptibility: Record<string, number> = {};
  const elementalIncreasedDmgTaken: Record<string, number> = {};

  // Accumulate sheet effects
  for (const effect of sheetEffects) {
    const val = getEffectValue(effect);
    accumulateEnemyStat(effect.stat.modifier, val, effect.stat);
  }

  // Accumulate dynamic modifiers
  for (const mod of dynamicModifiers) {
    accumulateEnemyStat(mod.stat.modifier, mod.value, mod.stat);
  }

  function accumulateEnemyStat(modifier: string, val: number, stat: Record<string, unknown>): void {
    const pct = val / 100;

    switch (modifier) {
      case 'susceptibility': {
        const elemField = stat.elements;
        if (elemField != null) {
          const arr = Array.isArray(elemField) ? elemField : [elemField];
          for (const elem of arr)
            elementalSusceptibility[elem as string] =
              (elementalSusceptibility[elem as string] ?? 0) + pct;
        } else {
          susceptibility += pct;
        }
        break;
      }
      case 'increasedDmgTaken': {
        const elemField = stat.elements;
        if (elemField != null) {
          const arr = Array.isArray(elemField) ? elemField : [elemField];
          for (const elem of arr)
            elementalIncreasedDmgTaken[elem as string] =
              (elementalIncreasedDmgTaken[elem as string] ?? 0) + pct;
        } else {
          increasedDmgTaken += pct;
        }
        break;
      }
      case 'resistanceShred':
        resistanceShred += pct;
        break;
      default:
        break;
    }
  }

  return {
    susceptibility,
    resistanceShred,
    defReduction,
    increasedDmgTaken,
    dmgReductionEffects,
    elementalSusceptibility,
    elementalIncreasedDmgTaken,
  };
}
