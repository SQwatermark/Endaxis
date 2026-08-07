import { describe, expect, it } from 'vitest';

import { perlica } from '../perlica';
import { perlicaGeneratedSkills } from './perlica.skills.generated';

describe('佩丽卡生成 DSL', () => {
  it('保留四段普攻的命中帧和末段语义', () => {
    expect(perlicaGeneratedSkills.slice(0, 4).map(skill => skill.key)).toEqual([
      'basicAttack1',
      'basicAttack2',
      'basicAttack3',
      'basicAttack4',
    ]);
    expect(
      perlicaGeneratedSkills
        .slice(0, 4)
        .map(skill => skill.scheduledSequences.map(sequence => sequence.startFrame)),
    ).toEqual([[8], [9, 12], [16, 19, 22], [27]]);

    const finalSteps = perlicaGeneratedSkills[3]!.scheduledSequences[0]!.sequence.steps;
    expect(finalSteps.map(step => step.kind)).toEqual(['dealDamage', 'changeResource']);
    expect(finalSteps[0]).toMatchObject({
      kind: 'dealDamage',
      parameters: {
        damageType: 'electric',
        stagger: 15,
        tags: ['normalAttack', 'normalAttackLastCombo'],
      },
    });
    expect(finalSteps[1]).toMatchObject({
      kind: 'changeResource',
      parameters: { resource: 'sp', amount: 15, recipient: 'team' },
    });
  });

  it('与当前人工配置的普攻战斗语义一致', () => {
    const basicAttackGroup = perlica.skillGroups.find(group => group.key === 'basicAttack');

    expect(basicAttackGroup?.skills).toEqual(perlicaGeneratedSkills.slice(0, 4));
  });

  it('与当前人工配置的处决和终结技战斗语义一致', () => {
    const finisher = perlica.skillGroups.find(group => group.key === 'finisher');
    const plungingAttack = perlica.skillGroups.find(group => group.key === 'plungingAttack');
    const battleSkill = perlica.skillGroups.find(group => group.key === 'battleSkill');
    const ultimate = perlica.skillGroups.find(group => group.key === 'ultimate');

    const generatedByKey = new Map(perlicaGeneratedSkills.map(skill => [skill.key, skill]));
    expect(generatedByKey.get('finisher')).toEqual(finisher?.skills);
    expect(generatedByKey.get('plungingAttack')).toEqual(plungingAttack?.skills);
    expect(generatedByKey.get('battleSkill')).toEqual(battleSkill?.skills);
    expect(generatedByKey.get('ultimate')).toEqual(ultimate?.skills);
  });
});
