import { describe, expect, it } from 'vitest';
import type { GearDefinition, WeaponDefinition } from '../../core/game-data/equipmentDefinition';
import { perlica } from '../../data/operators';
import { nextGameDataRepository } from '../../data/gameDataRepository';
import { getOperator, getOperatorTalentGroups, getWeapon } from '@/data';
import { getSkillBounds } from '@/utils/weaponBounds';
import {
  createDefaultGearInstance,
  createDefaultOperatorInstance,
  createDefaultWeaponInstance,
  resolveGearArtificingLevels,
  resolveMaxGearArtificingLevels,
} from './loadoutBuildFactory';

describe('loadoutBuildFactory', () => {
  it('按干员技能等级来源建立一次默认值', () => {
    const build = createDefaultOperatorInstance({
      ...perlica,
      // 组级字段只负责迁移期展示；养成实例必须从每个技能读取等级来源。
      skillGroups: perlica.skillGroups.map(group => ({ ...group, levelSource: 'basicAttack' })),
    });

    expect(build.operatorSlug).toBe(perlica.slug);
    expect(build.skillLevels).toEqual({
      basicAttack: 12,
      battleSkill: 12,
      comboSkill: 12,
      ultimate: 12,
    });
    expect(build).toMatchObject({
      level: 90,
      promoted: true,
      potential: 5,
      trustLevel: 4,
      talentStates: { 0: 2, 1: 1 },
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

    expect(createDefaultWeaponInstance(weapon)).toMatchObject({
      level: 90,
      tuned: true,
      potential: 0,
      traitLevels: [9, 9],
    });
    expect(createDefaultGearInstance(gear, 3).artificingLevels).toEqual([3, 3]);
  });

  it('装备精锻按每条词条自己的 0 基档位上限解析', () => {
    const gear: GearDefinition = {
      slug: 'custom-gear',
      slotType: 'gloves',
      levelRequirement: 70,
      baseDefense: 1,
      traits: [
        { key: 'single', levelCount: 1 },
        { key: 'four-levels', levelCount: 4 },
        { key: 'six-levels', levelCount: 6 },
      ],
    };

    expect(resolveGearArtificingLevels(gear, 3)).toEqual([0, 3, 3]);
    expect(resolveGearArtificingLevels(gear, 99)).toEqual([0, 3, 5]);
    expect(resolveMaxGearArtificingLevels(gear)).toEqual([0, 3, 5]);
    expect(createDefaultGearInstance(gear, 99).artificingLevels).toEqual([0, 3, 5]);
  });

  it('非原生三槽身份的自定义武器词条直接使用定义级数', () => {
    const weapon: WeaponDefinition = {
      slug: 'custom-weapon',
      rarity: 6,
      weaponType: 'sword',
      baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
      traits: [
        { key: 'skill1', levelCount: 12 },
        { key: 'custom-passive', levelCount: 12 },
      ],
    };

    expect(createDefaultWeaponInstance(weapon).traitLevels).toEqual([9, 12]);
  });

  it('沿用旧版低星满潜和显式默认潜能策略', () => {
    const lowRarityWeapon: WeaponDefinition = {
      slug: 'weapon-low',
      rarity: 5,
      weaponType: 'sword',
      baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
      traits: [
        { key: 'skill1', levelCount: 9 },
        { key: 'skill2', levelCount: 9 },
        { key: 'skill3', levelCount: 9 },
      ],
    };
    expect(createDefaultWeaponInstance(lowRarityWeapon)).toMatchObject({
      potential: 5,
      traitLevels: [9, 9, 9],
    });
    expect(
      createDefaultOperatorInstance({ ...perlica, rarity: 6, defaultPotential: 2 }),
    ).toMatchObject({ potential: 2 });
  });

  it('所有具备旧版身份的正式干员保持相同的默认潜能与技能、天赋加点', () => {
    const missingPresentations: string[] = [];
    for (const operator of nextGameDataRepository.getOperators()) {
      const assetSlug = operator.assetSlug ?? operator.slug;
      const legacy = getOperator(assetSlug);
      if (!legacy) {
        missingPresentations.push(operator.slug);
        continue;
      }

      const build = createDefaultOperatorInstance(operator);
      const expectedPotential =
        legacy.defaultPotential ?? (Number(legacy.rarity || 6) <= 5 ? 5 : 0);
      const expectedSkillLevels = Object.fromEntries(
        Object.keys(legacy.combatSkills ?? {}).map(key => [key, 12]),
      );
      const expectedTalentStates = Object.fromEntries(
        getOperatorTalentGroups(assetSlug).map((talent, index) => [
          String(index),
          talent.levels ?? 0,
        ]),
      );

      expect(build.potential, `${operator.slug} 默认潜能`).toBe(expectedPotential);
      expect(build.skillLevels, `${operator.slug} 默认技能加点`).toEqual(expectedSkillLevels);
      expect(build.talentStates, `${operator.slug} 默认天赋加点`).toEqual(expectedTalentStates);
    }
    // 当前分支没有梨诺的旧版 OperatorSheet；其富文本另由已有主线 i18n 证据覆盖。
    expect(missingPresentations, '缺少旧版干员展示身份').toEqual(['liino']);
  });

  it('所有具备旧版身份的正式武器保持相同的默认潜能与词条上限', () => {
    const missingPresentations: string[] = [];
    for (const weapon of nextGameDataRepository.getWeapons()) {
      const assetSlug = weapon.assetSlug ?? weapon.slug;
      const legacy = getWeapon(assetSlug);
      if (!legacy) {
        missingPresentations.push(weapon.slug);
        continue;
      }

      const build = createDefaultWeaponInstance(weapon);
      const potential = Number(legacy.rarity || 6) <= 5 ? 5 : 0;
      const bounds = getSkillBounds(90, true, potential);
      const expectedTraitLevels = weapon.traits.map(trait => {
        if (trait.key === 'skill1' || trait.key === 'skill2' || trait.key === 'skill3') {
          return Math.min(trait.levelCount, bounds[trait.key].max);
        }
        return Math.min(trait.levelCount, 9);
      });

      expect(build, `${weapon.slug} 默认武器养成`).toMatchObject({
        level: 90,
        tuned: true,
        potential,
        traitLevels: expectedTraitLevels,
      });
    }
    // 该武器来自新 AKEDB 静态定义；当前分支没有旧 WeaponSheet，但已有主线 i18n 文本。
    expect(missingPresentations, '缺少旧版武器展示身份').toEqual(['wpn_lance_0014']);
  });
});
