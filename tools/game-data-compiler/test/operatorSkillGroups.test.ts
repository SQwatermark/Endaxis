import { describe, expect, it } from 'vitest';

import {
  parseNativeOperatorSkillGroupSources,
  parseOperatorSkillGroupSources,
  validateOperatorSkillGroups,
  type OperatorSkillIdentitySource,
} from '../src/index.ts';
import { runPythonOracle } from './pythonOracle.ts';

const SKILLS: readonly OperatorSkillIdentitySource[] = (
  [
    ['basicAttack1', 'attack_1', 'basicAttack'],
    ['basicAttack2', 'attack_2', 'basicAttack'],
    ['finisher', 'power_attack', 'finisher'],
    ['plungingAttack', 'plunging', 'plungingAttack'],
    ['battleSkill', 'normal_skill', 'battleSkill'],
    ['comboSkill', 'combo_skill', 'comboSkill'],
    ['ultimate', 'ultimate_skill', 'ultimate'],
  ] as const
).map(([key, skillId, skillType]) => ({ key, skillId, skillType }));

describe('干员技能等级组', () => {
  it.each([
    ['skillType', 'passive'],
    ['levelSource', 'finisher'],
    ['levelSource', 'plungingAttack'],
  ])('配置入口拒绝不属于契约的 %s=%s', (field, value) => {
    const groups = operatorGroups();
    groups[0]![field] = value;
    expect(() => parseOperatorSkillGroupSources(groups, 'fixture.skillGroups')).toThrow(
      `fixture.skillGroups[0].${field}: unsupported identity ${JSON.stringify(value)}`,
    );
  });

  it('变体同样校验等级来源，不借用技能类型枚举', () => {
    const groups = operatorGroups();
    groups[0]!.variants = [
      { key: 'bad', levelSource: 'finisher', nativeGroupType: 2, skillKeys: ['basicAttack1'] },
    ];
    expect(() => parseOperatorSkillGroupSources(groups, 'fixture.skillGroups')).toThrow(
      'fixture.skillGroups[0].variants[0].levelSource: unsupported identity "finisher"',
    );
  });

  it('严格读取原生有序组，并通过佩丽卡式显式分组与 Python oracle', () => {
    const growth = growthTable();
    const rawGroups = operatorGroups();
    const groups = parseOperatorSkillGroupSources(rawGroups, 'perlica.skillGroups');
    const nativeGroups = parseNativeOperatorSkillGroupSources(growth, 'chr_test');

    expect(nativeGroups.map(group => [group.nativeGroupType, group.skillIds])).toEqual([
      [0, ['attack_1', 'attack_2', 'power_attack', 'plunging']],
      [1, ['normal_skill']],
      [3, ['combo_skill']],
      [2, ['ultimate_skill']],
    ]);
    expect(() => validateOperatorSkillGroups(groups, SKILLS, nativeGroups)).not.toThrow();
    expect(
      runPythonOracle({
        operation: 'validateSkillGroups',
        payload: {
          operator: { slug: 'perlica', skillGroups: rawGroups },
          skills: SKILLS,
          growth: growth.chr_test,
          path: 'CharGrowthTable.chr_test',
        },
      }),
    ).toEqual({ valid: true });
  });

  it('把强化普攻保留在普攻释放组，但按其原生终结技等级组校验', () => {
    const skills: readonly OperatorSkillIdentitySource[] = [
      { key: 'basic', skillId: 'basic', skillType: 'basicAttack' },
      { key: 'enhanced', skillId: 'enhanced', skillType: 'basicAttack' },
    ];
    const groups = parseOperatorSkillGroupSources(
      [
        {
          key: 'basicAttack',
          skillType: 'basicAttack',
          levelSource: 'basicAttack',
          nativeGroupType: 0,
          skillKeys: ['basic'],
          variants: [
            {
              key: 'enhancedBasicAttack',
              levelSource: 'ultimate',
              nativeGroupType: 2,
              skillKeys: ['enhanced'],
            },
          ],
        },
      ],
      'fixture.skillGroups',
    );
    expect(() =>
      validateOperatorSkillGroups(groups, skills, [
        nativeSource(0, ['basic']),
        nativeSource(2, ['enhanced']),
      ]),
    ).not.toThrow();
  });

  it('拒绝重复归属、技能类型错配和原生组漂移', () => {
    const duplicate = operatorGroups();
    duplicate[1]!.skillType = 'basicAttack';
    duplicate[1]!.skillKeys = ['basicAttack1'];
    expect(() =>
      validateOperatorSkillGroups(
        parseOperatorSkillGroupSources(duplicate, 'fixture.skillGroups'),
        SKILLS,
        parseNativeOperatorSkillGroupSources(growthTable(), 'chr_test'),
      ),
    ).toThrow('assigned more than once');

    const wrongType = operatorGroups();
    wrongType[0]!.skillType = 'battleSkill';
    expect(() =>
      validateOperatorSkillGroups(
        parseOperatorSkillGroupSources(wrongType, 'fixture.skillGroups'),
        SKILLS,
        parseNativeOperatorSkillGroupSources(growthTable(), 'chr_test'),
      ),
    ).toThrow('skill type does not match');

    const drifted = growthTable();
    drifted.chr_test.skillGroupMap.normal.skillIdList.pop();
    expect(() =>
      validateOperatorSkillGroups(
        parseOperatorSkillGroupSources(operatorGroups(), 'fixture.skillGroups'),
        SKILLS,
        parseNativeOperatorSkillGroupSources(drifted, 'chr_test'),
      ),
    ).toThrow('does not match generated skill sources');
  });

  it('只在 manifest 明确声明后从可放置技能组排除基础被动', () => {
    const groups = parseOperatorSkillGroupSources(operatorGroups(), 'fixture.skillGroups');
    const nativeGroups = parseNativeOperatorSkillGroupSources(growthTable(), 'chr_test').map(
      group =>
        group.nativeGroupType === 1
          ? { ...group, skillIds: [...group.skillIds, 'passive_0'] }
          : group,
    );

    expect(() =>
      validateOperatorSkillGroups(groups, SKILLS, nativeGroups, {
        basePassiveSkillIds: ['passive_0'],
      }),
    ).not.toThrow();
    expect(() =>
      validateOperatorSkillGroups(groups, SKILLS, nativeGroups, {
        basePassiveSkillIds: ['missing_passive'],
      }),
    ).toThrow('basePassiveSkillIds: unknown IDs');
  });
});

function operatorGroups(): Array<Record<string, unknown> & { skillKeys: string[] }> {
  return [
    group('basicAttack', 'basicAttack', 'basicAttack', 0, ['basicAttack1', 'basicAttack2']),
    group('finisher', 'finisher', 'basicAttack', 0, ['finisher']),
    group('plungingAttack', 'plungingAttack', 'basicAttack', 0, ['plungingAttack']),
    group('battleSkill', 'battleSkill', 'battleSkill', 1, ['battleSkill']),
    group('comboSkill', 'comboSkill', 'comboSkill', 3, ['comboSkill']),
    group('ultimate', 'ultimate', 'ultimate', 2, ['ultimate']),
  ];
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

function growthTable() {
  return {
    chr_test: {
      skillGroupMap: {
        normal: nativeRow('normal', 0, ['attack_1', 'attack_2', 'power_attack', 'plunging']),
        battle: nativeRow('battle', 1, ['normal_skill']),
        combo: nativeRow('combo', 3, ['combo_skill']),
        ultimate: nativeRow('ultimate', 2, ['ultimate_skill']),
      },
    },
  };
}

function nativeRow(skillGroupId: string, skillGroupType: number, skillIdList: string[]) {
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

function nativeSource(nativeGroupType: number, skillIds: string[]) {
  return {
    sourcePath: 'fixture',
    skillGroupId: `group_${nativeGroupType}`,
    nativeGroupType,
    skillIds,
  };
}
