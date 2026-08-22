import type { CombatEventTrigger } from '../../core/game-data/operatorDefinition';

export const EDITABLE_COMBAT_EVENT_TRIGGER_KINDS = [
  'buffApplied',
  'operatorHealed',
  'airborneOutput',
  'knockDownOutput',
  'damageTagHit',
  'elementalInflictionApplied',
  'skillHit',
  'enemyDefeated',
  'statusExpired',
  'statusConsumed',
] as const satisfies readonly CombatEventTrigger['kind'][];

export type EditableCombatEventTriggerKind = (typeof EDITABLE_COMBAT_EVENT_TRIGGER_KINDS)[number];

/** 创建结构有效、语义仍需用户明确填写的事件触发器草稿。 */
export function createCombatEventTriggerDraft(
  kind: EditableCombatEventTriggerKind,
): CombatEventTrigger {
  switch (kind) {
    case 'buffApplied':
    case 'operatorHealed':
    case 'airborneOutput':
    case 'knockDownOutput':
      return { kind };
    case 'damageTagHit':
      return { kind, tag: 'normalSkill', scope: 'operator' };
    case 'elementalInflictionApplied':
      return { kind, elements: 'heat', scope: 'operator' };
    case 'skillHit':
      return { kind, skillGroupKey: 'skill', scope: 'operator' };
    case 'enemyDefeated':
      return { kind, scope: 'operator' };
    case 'statusExpired':
    case 'statusConsumed':
      return { kind, statusKey: 'status', target: 'caster' };
  }
}
