import { describe, expect, it } from 'vitest';

import type { GearDefinition } from '../../core/game-data/equipmentDefinition';
import { registerGeneratedGearDefinitions } from './generatedGearRegistration';

describe('generatedGearRegistration', () => {
  it('用精确图标身份替换现行旧定义、保留退出现行表的模板并建立套装别名', () => {
    const current = generated('item_current', 'suit_native');
    const added = generated('item_added');
    const oldCurrent = legacy('old-current', 'item_current', 'set-legacy');
    const retired = legacy('retired', 'item_retired');

    const result = registerGeneratedGearDefinitions([added, current], [retired, oldCurrent]);

    expect(result.definitions.map(definition => definition.slug)).toEqual([
      'item_added',
      'item_current',
      'retired',
    ]);
    expect(result.definitions.find(definition => definition.slug === 'item_current')).toMatchObject(
      {
        assetSlug: 'old-current',
        iconPath: '/equipment/set/item_current.webp',
      },
    );
    expect(result.gearAliases).toEqual({ 'old-current': 'item_current' });
    expect(result.gearSetAliasesToLegacyDefinitions).toEqual({ suit_native: 'set-legacy' });
    expect(result.issues).toContainEqual({
      code: 'missingLegacyPresentation',
      canonicalSlug: 'item_added',
      legacySlugs: [],
    });
  });

  it('允许多个旧项目身份指向同一规范模板，但不臆选展示名称', () => {
    const result = registerGeneratedGearDefinitions(
      [generated('item_current', 'suit_native')],
      [
        legacy('old-a', 'item_current', 'set-legacy'),
        legacy('old-b', 'item_current', 'set-legacy'),
      ],
    );

    expect(result.gearAliases).toEqual({ 'old-a': 'item_current', 'old-b': 'item_current' });
    expect(result.definitions[0]).toMatchObject({
      slug: 'item_current',
      assetSlug: 'item_current',
      iconPath: '/equipment/set/item_current.webp',
    });
    expect(result.issues).toContainEqual({
      code: 'ambiguousLegacyAliases',
      canonicalSlug: 'item_current',
      legacySlugs: ['old-a', 'old-b'],
    });
  });

  it('拒绝重复原生资源身份、冲突套装映射和碰撞定义', () => {
    expect(() => registerGeneratedGearDefinitions([generated('a'), generated('a')], [])).toThrow(
      "duplicate generated gear asset identity 'a'",
    );

    expect(() =>
      registerGeneratedGearDefinitions(
        [generated('a', 'native-set'), generated('b', 'native-set')],
        [legacy('old-a', 'a', 'legacy-a'), legacy('old-b', 'b', 'legacy-b')],
      ),
    ).toThrow("native gear set 'native-set' maps to both 'legacy-a' and 'legacy-b'");

    expect(() =>
      registerGeneratedGearDefinitions([generated('collision')], [legacy('collision', 'retired')]),
    ).toThrow("collide at 'collision'");
  });
});

function generated(slug: string, gearSetSlug?: string): GearDefinition {
  return {
    slug,
    assetSlug: slug,
    slotType: 'armor',
    levelRequirement: 70,
    baseDefense: 48,
    traits: [],
    ...(gearSetSlug === undefined ? {} : { gearSetSlug }),
  };
}

function legacy(slug: string, iconIdentity: string, gearSetSlug?: string): GearDefinition {
  return {
    slug,
    assetSlug: slug,
    iconPath: `/equipment/set/${iconIdentity}.webp`,
    slotType: 'armor',
    levelRequirement: 70,
    baseDefense: 48,
    traits: [],
    ...(gearSetSlug === undefined ? {} : { gearSetSlug }),
  };
}
