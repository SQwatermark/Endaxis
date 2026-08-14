import { describe, expect, it } from 'vitest';
import { perlica } from './perlica';
import { collectSteps, getGroupSkills, getSkill as findSkill } from './testUtils';

const getSkill = (key: string) => findSkill(perlica, key);

describe('next Perlica definition', () => {
  it('keeps infliction, damage, and energy gain in source order', () => {
    const steps = getSkill('battleSkill').scheduledSequences[0]!.sequence.steps;

    expect(steps.map(step => step.kind)).toEqual([
      'applyElementalInfliction',
      'dealDamage',
      'gainSquadUltimateEnergyFromSkillCost',
    ]);
  });

  it('models combo impact as supported semantic operations', () => {
    const skill = getSkill('comboSkill');
    const steps = skill.scheduledSequences.find(item => item.startFrame === 24)!.sequence.steps;

    expect(skill.scheduledSequences[0]!.sequence.steps[0]?.kind).toBe('startTimeDilation');

    expect(steps.map(step => step.kind)).toEqual([
      'applyElementalReaction',
      'dealDamage',
      'changeResourceByActionValue',
    ]);
    expect(steps[2]).toMatchObject({
      kind: 'changeResourceByActionValue',
      parameters: {
        resource: 'ultimateEnergy',
        amount: { kind: 'blackboard', key: 'usp' },
        recipient: 'caster',
      },
    });
  });

  it('uses the earliest operable boundary as each basic attack timeline width', () => {
    const basicAttackGroup = perlica.skillGroups.find(group => group.key === 'basicAttack');

    expect(Array.isArray(basicAttackGroup?.skills)).toBe(true);
    if (!basicAttackGroup || !Array.isArray(basicAttackGroup.skills)) {
      throw new Error('expected basic attack sequence');
    }
    expect(basicAttackGroup.skills.map(skill => skill.timelineBlockFrames)).toEqual([
      16, 18, 26, 44,
    ]);
  });

  it('marks only the final normal-attack hit as the last combo hit', () => {
    const normalAttackHits = ['basicAttack1', 'basicAttack2', 'basicAttack3', 'basicAttack4']
      .map(key => getSkill(key))
      .flatMap(skill => skill.scheduledSequences)
      .flatMap(scheduledSequence => collectSteps(scheduledSequence.sequence))
      .filter(step => step.kind === 'dealDamage');

    expect(normalAttackHits.map(hit => hit.parameters.tags)).toEqual([
      ['normalAttack'],
      ['normalAttack'],
      ['normalAttack'],
      ['normalAttack'],
      ['normalAttack'],
      ['normalAttack'],
      ['normalAttack', 'normalAttackLastCombo'],
    ]);
  });

  it('uses the third normal attack per-hit scales instead of its rounded display totals', () => {
    const damageHits = getSkill('basicAttack3')
      .scheduledSequences.flatMap(scheduledSequence => collectSteps(scheduledSequence.sequence))
      .filter(step => step.kind === 'dealDamage');

    expect(damageHits).toHaveLength(3);
    expect(damageHits[0]?.parameters.attackScale).toEqual([
      0.12, 0.14, 0.15, 0.16, 0.17, 0.19, 0.2, 0.21, 0.22, 0.24, 0.26, 0.28,
    ]);
    expect(damageHits[1]?.parameters.attackScale).toBe(damageHits[0]?.parameters.attackScale);
    expect(damageHits[2]?.parameters.attackScale).toBe(damageHits[0]?.parameters.attackScale);
  });

  it('opens the combo window from the final normal-attack damage tag', () => {
    expect(perlica.comboSkillRegistrations).toEqual([
      {
        skillKey: 'comboSkill',
        priority: 'default',
        rules: [
          {
            trigger: {
              kind: 'damageTagHit',
              tag: 'normalAttackLastCombo',
              scope: 'team',
            },
          },
        ],
      },
    ]);
  });

  it('defines finisher and plunging attack as independent basic-attack-level groups', () => {
    expect(perlica.skillGroups.find(group => group.key === 'finisher')).toMatchObject({
      skillType: 'finisher',
      levelSource: 'basicAttack',
    });
    expect(perlica.skillGroups.find(group => group.key === 'plungingAttack')).toMatchObject({
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
    });
  });

  it('uses breaking-attack calculation only for the finisher', () => {
    const finisherSteps = getSkill('finisher').scheduledSequences.flatMap(item =>
      collectSteps(item.sequence),
    );
    const finisherDamage = finisherSteps[0];
    const plungingDamage = getSkill('plungingAttack').scheduledSequences.flatMap(item =>
      collectSteps(item.sequence),
    )[0];

    expect(finisherDamage).toMatchObject({
      kind: 'dealDamage',
      parameters: {
        calculation: 'breakingAttack',
        tags: ['normalAttack', 'powerAttack'],
      },
    });
    expect(plungingDamage).toMatchObject({
      kind: 'dealDamage',
      parameters: { tags: ['normalAttack', 'plungingAttack'] },
    });
    expect(finisherSteps[1]).toEqual({
      kind: 'gainFinisherSp',
      parameters: { factor: 1, recipient: 'team' },
    });
  });

  it('preserves both talents even while the second effect is unsupported', () => {
    expect(perlica.talents.map(talent => talent.key)).toEqual([
      'staggerDamageBonus',
      'comboRicochetAgainstBrokenEnemy',
    ]);
    expect(perlica.talents[1]?.modifiers).toEqual([]);
  });

  it('models the third potential as an event handler instead of a static modifier', () => {
    const potential = perlica.potentials[2];

    expect(potential).toMatchObject({
      key: 'attackAfterElectrification',
      eventHandlers: [
        {
          event: { kind: 'reactionApplied', reaction: 'electrification' },
          sequence: {
            steps: [
              {
                kind: 'applyStatus',
                parameters: {
                  statusKey: 'attackAfterElectrification',
                  target: 'caster',
                  durationFrames: 150,
                  maxStacks: 2,
                  modifiers: [{ kind: 'attackPercent', value: 0.2 }],
                },
              },
            ],
          },
        },
      ],
    });
    expect(potential?.modifiers).toBeUndefined();
  });

  it('uses ordered steps instead of damage timing flags', () => {
    const serialized = JSON.stringify(perlica);

    expect(serialized).not.toContain('beforeDamage');
    expect(serialized).not.toContain('afterDamage');
    expect(serialized).not.toContain('evidence');
    expect(serialized).not.toContain('sourceOrder');
    expect(serialized).not.toContain('buff_common_');
    expect(serialized).not.toContain('projectileId');
    expect(serialized).not.toContain('impactSkillId');
    expect(serialized).not.toContain('onReactionApplied');
  });

  it('keys every damage step with a non-empty unique identity', () => {
    const entries: Array<{ skillKey: string; stepKey: string }> = [];
    for (const skill of perlica.skillGroups.flatMap(getGroupSkills)) {
      for (const scheduledSequence of skill.scheduledSequences) {
        for (const step of collectSteps(scheduledSequence.sequence)) {
          if (step.kind === 'dealDamage' || step.kind === 'dealFixedDamage') {
            entries.push({ skillKey: skill.key, stepKey: step.key ?? '' });
          }
        }
      }
    }

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.stepKey.length).toBeGreaterThan(0);
    }
    const allKeys = entries.map(entry => entry.stepKey);
    expect(allKeys.length).toBe(new Set(allKeys).size);
  });
});
