import type { ResolvedActionSequence } from '../compiler/combatProgram';

/** Confirmed native AbilityEvent identities currently exposed to mechanic adapters. */
export const MECHANIC_ABILITY_EVENTS = [
  'beforeSkillCast',
  'skillEnded',
  'damageOutput',
  'damageTaken',
  'beforeDamageCalculation',
  'skillCostApplied',
] as const;
export type MechanicAbilityEvent = (typeof MECHANIC_ABILITY_EVENTS)[number];

/** Level events whose identity and synchronous dispatch boundary are recovered. */
export type MechanicGameLevelEvent = { kind: 'spellInflictionStarted' };

/**
 * First executable mechanic primitives. Adapters return data only; runtime
 * callbacks and arbitrary object patches are deliberately not representable.
 */
export type MechanicContribution =
  | {
      readonly kind: 'combatEventSequence';
      readonly event: MechanicAbilityEvent;
      readonly priority: number;
      readonly sequence: ResolvedActionSequence;
    }
  | {
      readonly kind: 'gameLevelEventSequence';
      readonly event: MechanicGameLevelEvent;
      readonly sequence: ResolvedActionSequence;
    };

export interface CompiledMechanicContribution {
  readonly selectionId: string;
  readonly mechanicId: string;
  readonly selectionIndex: number;
  readonly contributionIndex: number;
  readonly contribution: MechanicContribution;
}
