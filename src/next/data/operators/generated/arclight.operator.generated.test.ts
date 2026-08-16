import { describe, expect, it } from 'vitest';
import type { ScheduledSequenceDefinition } from '../../../core/game-data/operatorDefinition';
import { arclightGeneratedOperator } from './arclight.operator.generated';

function findSkill(key: string) {
  for (const group of arclightGeneratedOperator.skillGroups) {
    const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
    const skill = skills.find(candidate => candidate.key === key);
    if (skill !== undefined) return skill;
  }
  throw new Error(`missing generated skill '${key}'`);
}

describe('arclight generated operator', () => {
  it('has a partial conversion support with declared talent/potential/ultimate buff gaps', () => {
    expect(arclightGeneratedOperator.slug).toBe('arclight');
    expect(arclightGeneratedOperator.weaponType).toBe('sword');
    expect(arclightGeneratedOperator.role).toBe('vanguard');
    expect(arclightGeneratedOperator.conversionSupport).toEqual({
      completeness: 'partial',
      missingCapabilities: [
        { capability: 'talentEffects' },
        { capability: 'potentialEffects' },
        { capability: 'skillBehavior', skillGroupKeys: ['ultimate'] },
      ],
    });
  });

  it('compiles battle skill SP cost into squad ultimate energy instead of an inline buff', () => {
    const battleSkill = findSkill('battleSkill');
    const steps = battleSkill.scheduledSequences.flatMap(
      (sequence: ScheduledSequenceDefinition) =>
        sequence.sequence.steps.map(step => step.kind),
    );
    expect(steps).toContain('gainSquadUltimateEnergyFromSkillCost');
  });
});
