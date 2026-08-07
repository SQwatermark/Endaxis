import type { ResolvedActionSequence } from '../compiler/combatProgram';

/** 当前向机制适配器开放的、已确认的原生 `AbilityEvent` 身份。 */
export const MECHANIC_ABILITY_EVENTS = [
  'beforeSkillCast',
  'skillEnded',
  'damageOutput',
  'damageTaken',
  'beforeDamageCalculation',
  'skillCostApplied',
] as const;
export type MechanicAbilityEvent = (typeof MECHANIC_ABILITY_EVENTS)[number];

/** 已还原身份和同步分发边界的关卡事件。 */
export type MechanicGameLevelEvent = { kind: 'spellInflictionStarted' };

/**
 * 首批可执行的机制原语。适配器只能返回数据，不能表达运行时回调
 * 或任意对象补丁，以维持明确的执行边界。
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
