import { describe, expect, it } from 'vitest';

import { compileOperatorActiveSkills, parseOperatorActiveSkillEntries } from '../src/index.ts';
import { activeSkillFixture } from './sourceFixtures.ts';
import { OPERATOR_ACTIVE_SKILL_TYPES } from '../src/domains/operator/activeSkills.ts';
import { SKILL_TYPES } from '../../../packages/game-data-contract/src/primitives.ts';

describe('Operator 主动技能入口', () => {
  it('兼容列表保留既有顺序，当前支持值域与契约一致', () => {
    expect(OPERATOR_ACTIVE_SKILL_TYPES).toEqual([
      'basicAttack',
      'finisher',
      'plungingAttack',
      'battleSkill',
      'comboSkill',
      'ultimate',
    ]);
    expect([...OPERATOR_ACTIVE_SKILL_TYPES].sort()).toEqual([...SKILL_TYPES].sort());
  });

  it('绑定编辑器 key、原生 skillId 与公共 SkillData 定义', () => {
    const result = compileOperatorActiveSkills(
      [
        {
          key: 'basicAttack1',
          skillType: 'basicAttack',
          source: 'attack_1.json',
          compile: { kind: 'resolvedSequence' },
        },
        {
          key: 'battleSkill',
          skillType: 'battleSkill',
          source: 'battle.json',
          enhancementStateBuffId: 'buff_native_battle_enhancement',
          compile: { kind: 'resolvedSequence' },
        },
      ],
      {
        'attack_1.json': activeSkillFixture('native_attack_1'),
        'battle.json': activeSkillFixture('native_battle'),
      },
      {},
      'perlica.skills',
    );

    expect(result.entries.map(entry => [entry.key, entry.skillId, entry.skillType])).toEqual([
      ['basicAttack1', 'native_attack_1', 'basicAttack'],
      ['battleSkill', 'native_battle', 'battleSkill'],
    ]);
    expect(result.entries[0]!.projectionConfig).toEqual({ kind: 'resolvedSequence' });
    expect(result.entries[1]!.enhancementStateBuffId).toBe('buff_native_battle_enhancement');
    expect(result.definitions.map(definition => definition.skillId)).toEqual([
      'native_attack_1',
      'native_battle',
    ]);
  });

  it('拒绝重复身份、不安全路径、未知技能类型与缺失文件', () => {
    expect(() =>
      parseOperatorActiveSkillEntries(
        [entry('same', 'basicAttack', 'one.json'), entry('same', 'basicAttack', 'two.json')],
        'fixture.skills',
      ),
    ).toThrow('duplicate value "same"');
    expect(() =>
      parseOperatorActiveSkillEntries(
        [entry('one', 'basicAttack', '../one.json')],
        'fixture.skills',
      ),
    ).toThrow('expected a safe JSON file name');
    expect(() =>
      parseOperatorActiveSkillEntries([entry('one', 'passive', 'one.json')], 'fixture.skills'),
    ).toThrow('unsupported operator skill type "passive"');
    expect(() =>
      compileOperatorActiveSkills(
        [entry('one', 'basicAttack', 'missing.json')],
        {},
        {},
        'fixture.skills',
      ),
    ).toThrow('missing SkillData file missing.json');
  });
});

function entry(key: string, skillType: string, source: string) {
  return { key, skillType, source };
}
