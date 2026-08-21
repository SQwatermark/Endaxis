import { describe, expect, it } from 'vitest';
import { gameplayTagIdFromPath } from '../../core/combat/tags/gameplayTags';
import {
  GAMEPLAY_TAG_DEFINITIONS,
  GAMEPLAY_TAG_PATHS,
  gameplayTagRegistry,
  gameplayTagPath,
  parseGameplayTagReference,
  requireGameplayTagId,
} from './gameplayTagCatalog';

describe('versioned GameplayTag catalog', () => {
  it('contains every unique path from the pinned native config', () => {
    expect(GAMEPLAY_TAG_PATHS).toHaveLength(652);
    expect(new Set(GAMEPLAY_TAG_PATHS)).toHaveLength(652);
    expect(new Set(GAMEPLAY_TAG_DEFINITIONS.map(definition => definition.id))).toHaveLength(652);
  });

  it('provides the native hierarchy to production tag queries', () => {
    expect(
      gameplayTagRegistry.matches(
        requireGameplayTagId('Status/Immobilized/Frozen'),
        requireGameplayTagId('Status/Immobilized'),
      ),
    ).toBe(true);
  });

  it('maps paths and signed ids without usage-site guesses', () => {
    const path = 'Skill/Character/Common/Heal/ComboSkillHeal';
    const id = gameplayTagIdFromPath(path);
    expect(id).toBe(-1517158118);
    expect(requireGameplayTagId(path)).toBe(id);
    expect(gameplayTagPath(id)).toBe(path);
  });

  it('parses registered paths and preserves unknown signed source ids', () => {
    expect(parseGameplayTagReference('TimeDilation/Layer/Entity/HitStop')).toBe(1464849466);
    expect(parseGameplayTagReference('-123')).toBe(-123);
    expect(parseGameplayTagReference('not/a/registered/path')).toBeUndefined();
    expect(parseGameplayTagReference('2147483648')).toBeUndefined();
  });
});
