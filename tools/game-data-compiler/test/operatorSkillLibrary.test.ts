import { describe, expect, it } from 'vitest';

import { compileOperatorSkillLibrarySource } from '../src/index.ts';
import { activeSkillFixture } from './sourceFixtures.ts';

describe('Operator 技能库组装', () => {
  it('主动定义与 CharGrowthTable 原生等级组同时闭合', () => {
    const result = compileOperatorSkillLibrarySource({
      characterId: 'chr_test',
      sourcePath: 'perlica',
      manifestSkills: [
        skill('basicAttack1', 'basicAttack', 'attack.json'),
        skill('battleSkill', 'battleSkill', 'battle.json'),
      ],
      manifestSkillGroups: [
        group('basicAttack', 'basicAttack', 'basicAttack', 0, ['basicAttack1']),
        group('battleSkill', 'battleSkill', 'battleSkill', 1, ['battleSkill']),
      ],
      skillDataBySourceFile: {
        'attack.json': activeSkillFixture('native_attack'),
        'battle.json': activeSkillFixture('native_battle'),
      },
      skillPatchTable: {},
      charGrowthTable: {
        chr_test: {
          skillGroupMap: {
            normal: nativeGroup('normal', 0, ['native_attack']),
            battle: nativeGroup('battle', 1, ['native_battle']),
          },
        },
      },
    });

    expect(result.activeSkills.entries.map(entry => entry.skillId)).toEqual([
      'native_attack',
      'native_battle',
    ]);
    expect(result.skillGroups.map(group => group.key)).toEqual(['basicAttack', 'battleSkill']);
    expect(result.nativeSkillGroups.map(group => group.nativeGroupType)).toEqual([0, 1]);
  });

  it('原生等级组与配置技能漂移时整体组装失败', () => {
    expect(() =>
      compileOperatorSkillLibrarySource({
        characterId: 'chr_test',
        sourcePath: 'fixture',
        manifestSkills: [skill('basicAttack1', 'basicAttack', 'attack.json')],
        manifestSkillGroups: [
          group('basicAttack', 'basicAttack', 'basicAttack', 0, ['basicAttack1']),
        ],
        skillDataBySourceFile: { 'attack.json': activeSkillFixture('native_attack') },
        skillPatchTable: {},
        charGrowthTable: {
          chr_test: {
            skillGroupMap: { normal: nativeGroup('normal', 0, ['different_attack']) },
          },
        },
      }),
    ).toThrow('missing native skills ["native_attack"]');
  });
});

function skill(key: string, skillType: string, source: string) {
  return { key, skillType, source, compile: { kind: 'resolvedSequence' } };
}

function group(
  key: string,
  skillType: string,
  levelSource: string,
  nativeGroupType: number,
  skillKeys: string[],
) {
  return { key, skillType, levelSource, nativeGroupType, skillKeys };
}

function nativeGroup(skillGroupId: string, skillGroupType: number, skillIdList: string[]) {
  return {
    conditionDesc1: {},
    conditionDesc2: {},
    conditionDescInactive1: {},
    conditionDescInactive2: {},
    conditionIcon1: '',
    conditionIcon2: '',
    conditionId1: '',
    conditionId2: '',
    conditionName1: {},
    conditionName2: {},
    conditionPostDesc1: {},
    conditionPostDesc2: {},
    desc: {},
    icon: '',
    name: {},
    skillGroupId,
    skillGroupType,
    skillIdList,
  };
}
