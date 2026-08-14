import { describe, expect, it } from 'vitest';
import { arcane } from './arcane';
import { collectSteps, getGroupSkills, getSkill as findSkill } from './testUtils';

const getSkill = (key: string) => findSkill(arcane, key);

describe('next Arcane definition', () => {
  it('keeps the five-hit-chain skills in one ordered basic-attack group', () => {
    const group = arcane.skillGroups.find(candidate => candidate.key === 'basicAttack');
    if (!group) throw new Error('missing basic attack group');

    expect(getGroupSkills(group).map(skill => skill.key)).toEqual([
      'basicAttack1',
      'basicAttack2',
      'basicAttack3',
      'basicAttack4',
      'basicAttack5',
    ]);

    const finalHit = getSkill('basicAttack5').scheduledSequences[0]!.sequence.steps[0];
    expect(finalHit).toMatchObject({
      kind: 'dealDamage',
      parameters: { tags: ['normalAttack', 'normalAttackLastCombo'], stagger: 17 },
    });
  });

  it('derives the intellect form on equal deck attributes', () => {
    const handler = arcane.eventHandlers?.[0];
    const formBranch = handler?.sequence.steps[0];

    expect(handler?.event).toBe('deckAttributesChanged');
    expect(formBranch).toMatchObject({
      kind: 'conditional',
      parameters: {
        condition: {
          kind: 'deckAttributeCompare',
          left: 'intellect',
          operator: 'greaterOrEqual',
          right: 'will',
        },
      },
    });
    expect(
      arcane.skillGroups.find(group => group.key === 'battleSkill')?.presentationVariants,
    ).toEqual([
      expect.objectContaining({ key: 'intellect' }),
      expect.objectContaining({ key: 'will' }),
    ]);
  });

  it('branches battle-skill damage after applying nature infliction', () => {
    const steps = getSkill('battleSkill').scheduledSequences[0]!.sequence.steps;

    expect(steps.map(step => step.kind)).toEqual([
      'applyElementalInfliction',
      'conditional',
      'gainSquadUltimateEnergyFromSkillCost',
    ]);
    expect(steps[1]).toMatchObject({
      kind: 'conditional',
      parameters: {
        condition: { kind: 'contextFlagEquals', flag: 'arcaneForm', value: 'intellect' },
      },
    });
  });

  it('uses three form-aware combo-window rules', () => {
    const registration = arcane.comboSkillRegistrations?.find(
      item => item.skillKey === 'comboSkill',
    );
    if (registration === undefined) throw new Error('expected combo activation rules');
    const rules = registration.rules;

    expect(registration.priority).toBe('default');
    expect(rules).toHaveLength(3);
    expect(rules.map(rule => rule.trigger)).toEqual([
      { kind: 'elementalInflictionApplied', elements: 'nature', scope: 'team' },
      {
        kind: 'elementalInflictionApplied',
        elements: ['heat', 'cryo', 'electric'],
        scope: 'team',
      },
      {
        kind: 'elementalInflictionApplied',
        elements: ['heat', 'cryo', 'electric', 'nature'],
        scope: 'team',
      },
    ]);
  });

  it('handles imprisonment expiry and active consumption separately', () => {
    const handlers = getSkill('comboSkill').eventHandlers ?? [];

    expect(handlers.map(handler => handler.event.kind)).toEqual([
      'skillHit',
      'statusExpired',
      'statusConsumed',
    ]);
  });

  it('requires arcana readiness for a second ultimate during the array', () => {
    const ultimate = getSkill('ultimate');

    expect(ultimate.availability).toEqual({
      kind: 'any',
      conditions: [
        {
          kind: 'not',
          condition: { kind: 'statusActive', statusKey: 'gloompurgerArray', target: 'caster' },
        },
        { kind: 'statusActive', statusKey: 'gloompurgeArcanaReady', target: 'caster' },
      ],
    });
    expect(ultimate.eventHandlers?.slice(0, 2).map(handler => handler.event)).toEqual([
      { kind: 'damageTagHit', tag: 'normalAttackLastCombo', scope: 'team' },
      { kind: 'damageTagHit', tag: 'powerAttack', scope: 'team' },
    ]);
    expect(ultimate.eventHandlers?.[0]?.scheduledSequences).toBe(
      ultimate.eventHandlers?.[1]?.scheduledSequences,
    );
  });

  it('blocks ultimate gain during the array and gives every damage step a stable key', () => {
    const steps = getSkill('ultimate')
      .scheduledSequences.flatMap(item => item.sequence.steps)
      .flatMap(step => collectSteps({ steps: [step] }));

    expect(steps).toContainEqual({
      kind: 'applyStatus',
      parameters: {
        statusKey: 'gloompurgerArray',
        target: 'caster',
        durationFrames: 600,
        modifiers: [{ kind: 'blockResourceGain', resource: 'ultimateEnergy' }],
      },
    });
    expect(steps.filter(step => step.key !== undefined).map(step => step.key)).toEqual([
      'ultimate.arrayStrike',
      'ultimate.arcanaDamage',
      'ultimate.arcanaDamage',
    ]);
  });

  it('keeps form-aware talent and potential patches typed', () => {
    expect(arcane.talents[0]?.modifiers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -180,
        }),
      ]),
    );
    expect(arcane.potentials.map(potential => potential.key)).toEqual([
      'strengthenedComboSkill',
      'attributeAndArtsIntensity',
      'strongerCorrosionMastery',
      'reducedUltimateCost',
      'strengthenedFormTalentAndArcana',
    ]);
    expect(arcane.potentials[4]?.modifiers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'multiplyStepDamage',
          stepKey: 'ultimate.arcanaDamage',
          multiplier: 1.3,
        }),
      ]),
    );
  });

  it('keeps reverse-engineering identifiers out of the executable definition', () => {
    const serialized = JSON.stringify(arcane);

    expect(serialized).not.toContain('chr_0032_lizhiyan');
    expect(serialized).not.toContain('buff_chr_');
    expect(serialized).not.toContain('EntityBB_');
    expect(serialized).not.toContain('OnCharDeckAttrChanged');
  });
});
