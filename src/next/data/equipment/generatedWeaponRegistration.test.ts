import { describe, expect, it } from 'vitest';

import type { WeaponDefinition } from '../../core/game-data/equipmentDefinition';
import { registerGeneratedWeaponDefinitions } from './generatedWeaponRegistration';

describe('generated weapon registration', () => {
  it('keeps generated behavior while mapping an old presentation slug by icon identity', () => {
    const canonical = weapon('wpn_sword_0001', '/weapons/sword/wpn_sword_0001.webp');
    const legacy = weapon('friendly-name', '/weapons/sword/wpn_sword_0001.webp');
    const result = registerGeneratedWeaponDefinitions([canonical], [legacy]);

    expect(result.definitions).toEqual([{ ...canonical, assetSlug: legacy.slug }]);
    expect(result.aliases).toEqual({ 'friendly-name': canonical.slug });
    expect(result.issues).toEqual([]);
  });

  it('retains an unmatched legacy weapon without guessing its identity', () => {
    const canonical = weapon('wpn_sword_0001', '/weapons/sword/wpn_sword_0001.webp');
    const legacy = weapon('retired', '/weapons/sword/wpn_sword_0999.webp');
    const result = registerGeneratedWeaponDefinitions([canonical], [legacy]);

    expect(result.definitions).toHaveLength(2);
    expect(result.issues).toEqual([
      { code: 'missingLegacyPresentation', canonicalSlug: canonical.slug },
    ]);
  });
});

function weapon(slug: string, iconPath: string): WeaponDefinition {
  return {
    slug,
    assetSlug: slug,
    iconPath,
    rarity: 5,
    weaponType: 'sword',
    baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
    traits: [],
  };
}
