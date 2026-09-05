import { describe, expect, it } from 'vitest';

import { perlica } from './perlica';
import { collectSteps, getGroupSkills } from './testUtils';
import {
  perlicaBasicAttack1,
  perlicaBasicAttack2,
  perlicaBasicAttack3,
  perlicaBasicAttack4,
  perlicaBattleSkill,
  perlicaComboSkill,
  perlicaFinisher,
  perlicaPlungingAttack,
  perlicaUltimate,
} from './generated-definitions/perlica/perlica.operator.generated';

const basicAttacks = [
  perlicaBasicAttack1,
  perlicaBasicAttack2,
  perlicaBasicAttack3,
  perlicaBasicAttack4,
];

describe('佩丽卡生成 DSL', () => {
  it('保留四段普攻的命中帧和末段语义', () => {
    expect(basicAttacks.map(skill => skill.key)).toEqual([
      'basicAttack1',
      'basicAttack2',
      'basicAttack3',
      'basicAttack4',
    ]);
    expect(
      basicAttacks.map(skill => skill.scheduledSequences.map(sequence => sequence.startFrame)),
    ).toEqual([[8], [9, 12], [16, 19, 22], [27]]);

    const finalSteps = collectSteps(perlicaBasicAttack4.scheduledSequences[0]!.sequence);
    expect(finalSteps.map(step => step.kind)).toEqual([
      'withActionBlackboardScope',
      'withActionBlackboardScope',
      'dealDamage',
      'conditional',
      'changeResourceByActionValue',
    ]);
    expect(finalSteps.find(step => step.kind === 'dealDamage')).toMatchObject({
      kind: 'dealDamage',
      parameters: {
        damageType: 'electric',
        stagger: { kind: 'blackboard', key: 'poise' },
        tags: ['normalAttack', 'normalAttackLastCombo'],
      },
    });
    expect(finalSteps.find(step => step.kind === 'changeResourceByActionValue')).toMatchObject({
      kind: 'changeResourceByActionValue',
      parameters: {
        resource: 'sp',
        amount: { kind: 'blackboard', key: 'atb' },
        recipient: 'team',
        spGainSource: 'normalAttack',
      },
    });
  });

  it('完整转换保留旧基线的普攻命中帧和伤害标签', () => {
    const basicAttackGroup = perlica.skillGroups.find(group => group.key === 'basicAttack');
    if (basicAttackGroup === undefined) throw new Error('missing complete basic attacks');
    const complete = getGroupSkills(basicAttackGroup);

    expect(complete.map(skill => skill.scheduledSequences.map(item => item.startFrame))).toEqual(
      basicAttacks.map(skill => skill.scheduledSequences.map(item => item.startFrame)),
    );
    expect(
      complete.map(skill =>
        skill.scheduledSequences
          .flatMap(item => collectSteps(item.sequence))
          .filter(step => step.kind === 'dealDamage')
          .map(step => step.parameters.tags),
      ),
    ).toEqual(
      basicAttacks.map(skill =>
        skill.scheduledSequences
          .flatMap(item => collectSteps(item.sequence))
          .filter(step => step.kind === 'dealDamage')
          .map(step => step.parameters.tags),
      ),
    );
  });

  it('完整转换保留旧基线各主动技能的原生身份与主要命中帧', () => {
    const legacy = [
      perlicaFinisher,
      perlicaPlungingAttack,
      perlicaBattleSkill,
      perlicaComboSkill,
      perlicaUltimate,
    ];
    const completeByKey = new Map(
      perlica.skillGroups
        .flatMap(getGroupSkills)
        .filter(skill => legacy.some(candidate => candidate.key === skill.key))
        .map(skill => [skill.key, skill]),
    );

    for (const baseline of legacy) {
      const complete = completeByKey.get(baseline.key);
      expect(complete?.sourceSkillId).toBe(baseline.sourceSkillId);
      const damageFrames = (skill: typeof baseline) =>
        skill.scheduledSequences
          .filter(item => collectSteps(item.sequence).some(step => step.kind === 'dealDamage'))
          .map(item => item.startFrame);
      expect(damageFrames(complete!)).toEqual(damageFrames(baseline));
    }
  });
});
