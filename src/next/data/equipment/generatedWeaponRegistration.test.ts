import { describe, expect, it } from 'vitest';

import type { WeaponDefinition } from '../../core/game-data/equipmentDefinition';
import { registerGeneratedWeaponDefinitions } from './generatedWeaponRegistration';
import { generatedWeaponDefinitions } from './generated-weapons/index.generated';
import { weaponPresentationSlugByAsset } from './weaponPresentationSlugs';

describe('generated weapon registration', () => {
  it('registers all current weapons from the latest presentation catalog', () => {
    const result = registerGeneratedWeaponDefinitions(
      generatedWeaponDefinitions,
      weaponPresentationSlugByAsset,
    );

    expect(result.definitions).toHaveLength(79);
    expect(Object.keys(result.aliases)).toHaveLength(77);
    expect(result.missingPresentationAssets).toEqual([]);
    for (const definition of result.definitions) {
      const generated = generatedWeaponDefinitions.find(item => item.slug === definition.slug)!;
      expect(definition.traits).toEqual(generated.traits);
      expect(definition.assetSlug).toBe(weaponPresentationSlugByAsset[generated.assetSlug!]);
    }
  });

  it('reports an asset missing from the current presentation catalog', () => {
    const definition = weapon('wpn_sword_0999');
    expect(registerGeneratedWeaponDefinitions([definition], {})).toEqual({
      definitions: [definition],
      aliases: {},
      missingPresentationAssets: ['wpn_sword_0999'],
    });
  });

  it('rejects a duplicated presentation identity', () => {
    expect(() =>
      registerGeneratedWeaponDefinitions([weapon('wpn_sword_0001'), weapon('wpn_sword_0002')], {
        wpn_sword_0001: 'same',
        wpn_sword_0002: 'same',
      }),
    ).toThrow("weapon presentation slug 'same' is shared");
  });
});

function weapon(slug: string): WeaponDefinition {
  return {
    slug,
    assetSlug: slug,
    iconPath: `/weapons/sword/${slug}.webp`,
    rarity: 5,
    weaponType: 'sword',
    baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
    traits: [],
  };
}
