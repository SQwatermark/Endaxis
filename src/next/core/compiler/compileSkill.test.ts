import { describe, expect, it } from 'vitest';
import type { SkillDefinition } from '../game-data/operatorDefinition';
import { perlica } from '../../data/operators/perlica';
import { compileSkill } from './compileSkill';

function findPerlicaSkill(key: string): SkillDefinition {
  for (const group of perlica.skillGroups) {
    const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
    const skill = skills.find(candidate => candidate.key === key);
    if (skill !== undefined) return skill;
  }
  throw new Error(`missing Perlica skill '${key}'`);
}

describe('compileSkill', () => {
  it('keeps the derived timeline block width in the compiled catalog', () => {
    const skill = {
      key: 'timeline-block',
      timelineBlockFrames: 18,
      scheduledSequences: [],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 1,
      skill,
    });

    expect(program.timelineBlockFrames).toBe(18);
  });

  it('compiles Perlica battle skill into a single-level runtime program', () => {
    const skill = findPerlicaSkill('battleSkill');

    const program = compileSkill({
      operatorId: perlica.slug,
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 12,
      skill,
    });

    expect(program).toMatchObject({
      operatorId: 'perlica',
      skillId: 'battleSkill',
      timelineBlockFrames: 28,
      costFrame: 0,
      costs: [{ resource: 'sp', value: 100 }],
    });
    expect(program.timelineActions[0]?.startFrame).toBe(13);
    expect(program.timelineActions[0]?.sequence.steps).toEqual([
      {
        kind: 'applyElementalInfliction',
        parameters: { element: 'electric', isExtra: false },
      },
      {
        kind: 'dealDamage',
        parameters: {
          damageType: 'electric',
          attackScale: 4,
          tags: ['normalSkill'],
          stagger: 10,
        },
      },
      {
        kind: 'gainSquadUltimateEnergyFromSkillCost',
        parameters: { coefficient: 1 },
      },
    ]);
  });

  it('resolves nested level values without retaining level arrays', () => {
    const skill = findPerlicaSkill('comboSkill');

    const program = compileSkill({
      operatorId: perlica.slug,
      skillGroupKey: 'comboSkill',
      skillType: 'comboSkill',
      skillLevel: 12,
      skill,
    });

    expect(program.cooldownFrames).toBe(570);
    expect(JSON.stringify(program)).not.toContain('[0.8,');
  });

  it('preserves the SP refund category while resolving its level value', () => {
    const skill = {
      key: 'refund',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          endFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'changeResource',
                parameters: {
                  resource: 'sp',
                  amount: [10, 20],
                  recipient: 'team',
                  spGainKind: 'refund',
                },
              },
            ],
          },
        },
      ],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'comboSkill',
      skillType: 'comboSkill',
      skillLevel: 2,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toEqual({
      kind: 'changeResource',
      parameters: {
        resource: 'sp',
        amount: 20,
        recipient: 'team',
        spGainKind: 'refund',
      },
    });
  });

  it('rejects paid skills whose native cost frame has not been recovered', () => {
    const incomplete = {
      key: 'incomplete',
      timelineBlockFrames: 30,
      costs: [{ resource: 'sp', value: 100 }],
      scheduledSequences: [],
    } satisfies SkillDefinition;

    expect(() =>
      compileSkill({
        operatorId: 'fixture',
        skillGroupKey: 'battleSkill',
        skillType: 'battleSkill',
        skillLevel: 1,
        skill: incomplete,
      }),
    ).toThrow("skill 'incomplete' has costs but no recovered costFrame");
  });

  it('rejects a level outside the recovered value table', () => {
    const skill = findPerlicaSkill('battleSkill');

    expect(() =>
      compileSkill({
        operatorId: perlica.slug,
        skillGroupKey: 'battleSkill',
        skillType: 'battleSkill',
        skillLevel: 13,
        skill,
      }),
    ).toThrow('has no value for skill level 13');
  });

  it('rejects multiple costs because native CastData has one cost slot', () => {
    const incomplete = {
      key: 'multiple-costs',
      timelineBlockFrames: 30,
      costFrame: 0,
      costs: [
        { resource: 'sp', value: 100 },
        { resource: 'ultimateEnergy', value: 10 },
      ],
      scheduledSequences: [],
    } satisfies SkillDefinition;

    expect(() =>
      compileSkill({
        operatorId: 'fixture',
        skillGroupKey: 'battleSkill',
        skillType: 'battleSkill',
        skillLevel: 1,
        skill: incomplete,
      }),
    ).toThrow("skill 'multiple-costs' has multiple costs, but native CastData has one cost");
  });
});
