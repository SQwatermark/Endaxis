import { describe, expect, it } from 'vitest';
import type { GearDefinition, WeaponDefinition } from '../../core/game-data/equipmentDefinition';
import { perlica } from '../../data/operators';
import {
  createDefaultGearInstance,
  createDefaultOperatorInstance,
  createDefaultWeaponInstance,
} from './loadoutBuildFactory';

describe('loadoutBuildFactory', () => {
  it('按干员技能等级来源建立一次默认值', () => {
    const build = createDefaultOperatorInstance(perlica);

    expect(build.operatorSlug).toBe(perlica.slug);
    expect(build.skillLevels).toEqual({
      basicAttack: 12,
      battleSkill: 12,
      comboSkill: 12,
      ultimate: 12,
    });
  });

  it('按定义词条数量建立武器和装备初始等级', () => {
    const weapon: WeaponDefinition = {
      slug: 'weapon',
      rarity: 6,
      weaponType: 'sword',
      baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
      traits: [
        { key: 'first', levelCount: 9 },
        { key: 'second', levelCount: 9 },
      ],
    };
    const gear: GearDefinition = {
      slug: 'gear',
      slotType: 'armor',
      levelRequirement: 70,
      baseDefense: 100,
      traits: [
        { key: 'first', levelCount: 4 },
        { key: 'second', levelCount: 4 },
      ],
    };

    expect(createDefaultWeaponInstance(weapon).traitLevels).toEqual([1, 1]);
    expect(createDefaultGearInstance(gear, 3).artificingLevels).toEqual([3, 3]);
  });
});
