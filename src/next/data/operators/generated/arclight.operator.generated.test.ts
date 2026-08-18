import { describe, expect, it } from 'vitest';
import type {
  ScheduledSequenceDefinition,
  SkillDefinition,
} from '../../../core/game-data/operatorDefinition';
import { arclightGeneratedOperator } from './arclight.operator.generated';

function findSkill(key: string): SkillDefinition {
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

  it('owns ultimate AbilityEntity damage on the child local timeline only', () => {
    const ultimate = findSkill('ultimate');
    const spawn = ultimate.scheduledSequences
      .flatMap(sequence => sequence.sequence.steps)
      .find(step => step.kind === 'spawnAbilityEntity');
    expect(spawn?.kind).toBe('spawnAbilityEntity');
    if (spawn?.kind !== 'spawnAbilityEntity') throw new Error('missing AbilityEntity spawn');

    expect(spawn.parameters.inheritActionBlackboard).toBe(true);
    expect(spawn.parameters.definition.childSkill?.scheduledSequences.map(sequence => sequence.startFrame)).toEqual([
      7, 63,
    ]);
    expect(ultimate.scheduledSequences.map(sequence => sequence.startFrame)).not.toEqual(
      expect.arrayContaining([61, 117]),
    );
  });
});
