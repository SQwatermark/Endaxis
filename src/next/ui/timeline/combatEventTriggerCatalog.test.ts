import { describe, expect, it } from 'vitest';
import { validateCombatEventTriggerDefinition } from '../../core/game-data/validateSkillDefinition';
import {
  createCombatEventTriggerDraft,
  EDITABLE_COMBAT_EVENT_TRIGGER_KINDS,
} from './combatEventTriggerCatalog';

describe('combatEventTriggerCatalog', () => {
  it('creates a structurally valid draft for every editable trigger kind', () => {
    for (const kind of EDITABLE_COMBAT_EVENT_TRIGGER_KINDS) {
      expect(
        validateCombatEventTriggerDefinition(createCombatEventTriggerDraft(kind), '$.event'),
      ).toEqual([]);
    }
  });

  it('keeps the picker restricted to trigger kinds supported by the layer-local editor', () => {
    expect(EDITABLE_COMBAT_EVENT_TRIGGER_KINDS).toEqual([
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
    ]);
  });
});
