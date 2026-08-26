import { describe, expect, it } from 'vitest';

import type { WeaponDefinition } from '../../core/game-data/equipmentDefinition';
import { registerGeneratedWeaponDefinitions } from './generatedWeaponRegistration';
import { generatedWeaponDefinitions } from './generated-weapons/index.generated';
import { sharedWeaponDefinitions } from './sharedEquipmentDefinitions';

describe('generated weapon registration', () => {
  it('maps real identities and icons but reports the five incompatible saved trait layouts', () => {
    const result = registerGeneratedWeaponDefinitions(
      generatedWeaponDefinitions,
      sharedWeaponDefinitions,
    );
    expect(result.issues).toEqual(
      [
        ['freedom-to-proselytize', 'wpn_funnel_0012'],
        ['dreams-of-the-starry-beach', 'wpn_funnel_0013'],
        ['type-42-solemn-phalanx', 'wpn_funnel_0016'],
        ['former-finery', 'wpn_claym_0006'],
        ['golden-age', 'wpn_lance_0016'],
      ].map(([legacySlug, canonicalSlug]) => ({
        code: 'legacyTraitLayoutMismatch',
        legacySlug,
        canonicalSlug,
        legacyLevelCounts: [9, 9],
        generatedLevelCounts: [9, 9, 9],
      })),
    );
    expect(result.definitions).toHaveLength(77);
    for (const legacy of sharedWeaponDefinitions) {
      const canonicalId = result.aliases[legacy.slug] ?? legacy.slug;
      const registered = result.definitions.find(item => item.slug === canonicalId)!;
      expect(registered, legacy.slug).toBeDefined();
      expect(registered.assetSlug).toBe(legacy.slug);
      expect(registered.iconPath).toBe(legacy.iconPath);
      expect(registered.weaponType).toBe(legacy.weaponType);
      const generated = generatedWeaponDefinitions.find(item => item.slug === canonicalId)!;
      expect(registered.traits).toEqual(generated.traits);
    }
  });

  it('reports reduced level capacity even when slot counts still match', () => {
    const canonical = {
      ...weapon('wpn_sword_0001', '/weapons/sword/wpn_sword_0001.webp'),
      traits: [{ key: 'skill1', levelCount: 8, modifiers: [] }],
    };
    const legacy = {
      ...weapon('friendly-name', '/weapons/sword/wpn_sword_0001.webp'),
      traits: [{ key: 'legacy-trait', levelCount: 9, modifiers: [] }],
    };
    expect(registerGeneratedWeaponDefinitions([canonical], [legacy]).issues).toEqual([
      {
        code: 'legacyTraitLayoutMismatch',
        canonicalSlug: canonical.slug,
        legacySlug: legacy.slug,
        legacyLevelCounts: [9],
        generatedLevelCounts: [8],
      },
    ]);
  });

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
