import { describe, expect, it } from 'vitest';
import {
  validateGearDefinition,
  validateGearSetDefinition,
  validateWeaponDefinition,
} from '../../core/game-data/equipmentDefinitionValidation';
import {
  getSharedEquipmentSupport,
  nextGearDefinitionRegistration,
  nextGearSetDefinitionRegistration,
  nextGearDefinitions,
  sharedEquipmentAdaptationIssues,
  sharedGearDefinitions,
  sharedGearSetDefinitions,
  sharedWeaponDefinitions,
} from './sharedEquipmentDefinitions';

describe('sharedEquipmentDefinitions', () => {
  it('loads real shared directories and keeps deterministic stable identities', () => {
    expect(sharedWeaponDefinitions.some(definition => definition.slug === 'tarr-11')).toBe(true);
    expect(
      sharedGearDefinitions.some(definition => definition.slug === 'xiranflow-light-armor'),
    ).toBe(true);
    expect(
      sharedGearSetDefinitions.some(definition => definition.slug === 'suit_generaltype'),
    ).toBe(true);
    expect(nextGearSetDefinitionRegistration.aliases['aic-fieldwork']).toBe('suit_generaltype');
    for (const definitions of [
      sharedWeaponDefinitions,
      sharedGearDefinitions,
      sharedGearSetDefinitions,
    ]) {
      expect(new Set(definitions.map(definition => definition.slug)).size).toBe(definitions.length);
    }
  });

  it('registers only structurally valid Next definitions', () => {
    const issues = [
      ...sharedWeaponDefinitions.flatMap((definition, index) =>
        validateWeaponDefinition(definition, `$.weapons[${index}]`),
      ),
      ...sharedGearDefinitions.flatMap((definition, index) =>
        validateGearDefinition(definition, `$.gears[${index}]`),
      ),
      ...nextGearDefinitions.flatMap((definition, index) =>
        validateGearDefinition(definition, `$.nextGears[${index}]`),
      ),
      ...sharedGearSetDefinitions.flatMap((definition, index) =>
        validateGearSetDefinition(definition, `$.gearSets[${index}]`),
      ),
    ];

    expect(issues).toEqual([]);
  });

  it('replaces matched legacy gear with 258 current native definitions without guessing presentation', () => {
    const current = nextGearDefinitions.filter(definition => definition.slug.startsWith('item_'));
    const retainedLegacy = nextGearDefinitions.filter(
      definition => !definition.slug.startsWith('item_'),
    );

    expect(current).toHaveLength(258);
    expect(retainedLegacy).toHaveLength(5);
    expect(Object.keys(nextGearDefinitionRegistration.gearAliases)).toHaveLength(237);
    expect(
      Object.keys(nextGearDefinitionRegistration.gearSetAliasesToLegacyDefinitions),
    ).toHaveLength(23);
    expect(
      nextGearDefinitionRegistration.issues.filter(
        issue => issue.code === 'missingLegacyPresentation',
      ),
    ).toHaveLength(21);
    expect(
      nextGearDefinitionRegistration.issues.filter(
        issue => issue.code === 'ambiguousLegacyAliases',
      ),
    ).toEqual([]);
    expect(
      nextGearDefinitionRegistration.issues.filter(
        issue => issue.code === 'ambiguousGeneratedAssetIdentity',
      ),
    ).toEqual([]);
    expect(
      current.find(definition => definition.slug === 'item_equip_t4_suit_atk02_hand_02'),
    ).toMatchObject({ iconPath: '/equipment/atk02/item_equip_t4_suit_atk02_hand_01.webp' });
  });

  it('registers reliable base definitions and exposes unsupported source semantics as partial', () => {
    expect(sharedEquipmentAdaptationIssues).toContainEqual(
      expect.objectContaining({
        sourceKind: 'weapon',
        slug: 'lone-barge',
        path: 'skill3.triggers',
        code: 'unsupported-trigger',
      }),
    );
    expect(sharedEquipmentAdaptationIssues).toContainEqual(
      expect.objectContaining({
        sourceKind: 'gearSet',
        slug: 'xiranflow',
        path: 'triggers',
        code: 'unsupported-trigger',
      }),
    );
    expect(sharedWeaponDefinitions.some(definition => definition.slug === 'lone-barge')).toBe(true);
    expect(sharedGearSetDefinitions.some(definition => definition.slug === 'xiranflow')).toBe(
      false,
    );
    expect(getSharedEquipmentSupport('weapon', 'lone-barge')).toMatchObject({
      completeness: 'partial',
      issues: [expect.objectContaining({ path: 'skill3.triggers' })],
    });
    expect(getSharedEquipmentSupport('gearSet', 'xiranflow')).toMatchObject({
      completeness: 'partial',
      issues: [expect.objectContaining({ path: 'triggers' })],
    });
  });

  it('does not expose the old no-set sentinel as a real three-piece set', () => {
    expect(sharedGearSetDefinitions.some(definition => definition.slug === 'no-set-bonuses')).toBe(
      false,
    );
    expect(
      sharedGearDefinitions.some(definition => definition.gearSetSlug === 'no-set-bonuses'),
    ).toBe(false);
  });

  it('keeps reliable set membership while exposing partial set definitions', () => {
    const registeredSets = new Set(sharedGearSetDefinitions.map(definition => definition.slug));
    const referencedSets = new Set(
      sharedGearDefinitions
        .map(definition => definition.gearSetSlug)
        .filter((slug): slug is string => slug !== undefined),
    );

    for (const slug of referencedSets) {
      const registeredSlug = nextGearSetDefinitionRegistration.aliases[slug] ?? slug;
      expect(registeredSets.has(registeredSlug)).toBe(true);
      expect(getSharedEquipmentSupport('gearSet', slug)).not.toBeNull();
    }
  });
});
