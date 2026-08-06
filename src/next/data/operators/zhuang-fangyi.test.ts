import { describe, expect, it } from 'vitest';
import { collectSteps, getGroupSkills, getSkill as findSkill } from './testUtils';
import { zhuangFangyi } from './zhuang-fangyi';

const getSkill = (key: string) => findSkill(zhuangFangyi, key);

describe('next Zhuang Fangyi definition', () => {
  it('keeps normal and enhanced attack chains as separate cast identities', () => {
    const normal = zhuangFangyi.skillGroups.find(group => group.key === 'basicAttack');
    const enhanced = zhuangFangyi.skillGroups.find(group => group.key === 'enhancedBasicAttack');
    if (!normal || !enhanced) throw new Error('missing basic attack group');

    expect(getGroupSkills(normal).map(skill => skill.key)).toEqual([
      'basicAttack1',
      'basicAttack2',
      'basicAttack3',
      'basicAttack4',
      'basicAttack5',
    ]);
    expect(getGroupSkills(enhanced).map(skill => skill.key)).toEqual([
      'enhancedBasicAttack1',
      'enhancedBasicAttack2',
      'enhancedBasicAttack3',
    ]);
    expect(getSkill('basicAttack1').availability).toEqual({
      kind: 'not',
      condition: {
        kind: 'statusActive',
        statusKey: 'ultimateEnhancement',
        target: 'caster',
      },
    });
    expect(getSkill('enhancedBasicAttack1').availability).toEqual({
      kind: 'statusActive',
      statusKey: 'ultimateEnhancement',
      target: 'caster',
    });
  });

  it('marks the last hit of both attack chains as a final normal attack', () => {
    for (const key of ['basicAttack5', 'enhancedBasicAttack3']) {
      const damage = collectSteps(getSkill(key).scheduledSequences[0]!.sequence).find(
        step => step.kind === 'dealDamage',
      );
      expect(damage).toMatchObject({
        kind: 'dealDamage',
        parameters: { tags: ['normalAttack', 'normalAttackLastCombo'], stagger: 18 },
      });
    }
  });

  it('creates the enhancement and one-use free battle state in source order', () => {
    const ultimate = getSkill('ultimate');
    const steps = ultimate.scheduledSequences[0]!.sequence.steps;

    expect(ultimate).toMatchObject({
      cooldownFrames: 450,
      costs: [{ resource: 'ultimateEnergy', value: 240 }],
    });
    expect(steps).toEqual([
      {
        kind: 'applyStatus',
        parameters: {
          statusKey: 'ultimateEnhancement',
          target: 'caster',
          durationFrames: 750,
          modifiers: [
            {
              kind: 'skillCooldownMultiplier',
              skillGroupKey: 'enhancedComboSkill',
              value: 0.25,
            },
          ],
        },
      },
      {
        kind: 'applyStatus',
        parameters: {
          statusKey: 'freeEnhancedBattle',
          target: 'caster',
          durationFrames: 750,
          modifiers: [{ kind: 'resourceCostMultiplier', resource: 'sp', value: 0 }],
        },
      },
    ]);
  });

  it('uses the free enhanced battle before considering reaction consumption', () => {
    const setup = getSkill('enhancedBattleSkill').scheduledSequences[0]!.sequence;
    const steps = collectSteps(setup);
    const freeStateConsumption = steps.findIndex(
      step => step.kind === 'consumeStatus' && step.parameters.statusKey === 'freeEnhancedBattle',
    );
    const reactionConsumption = steps.findIndex(step => step.kind === 'consumeElementalReaction');

    expect(setup.steps[1]).toMatchObject({
      kind: 'conditional',
      parameters: {
        condition: {
          kind: 'statusActive',
          statusKey: 'freeEnhancedBattle',
          target: 'caster',
        },
      },
    });
    expect(steps).toContainEqual({
      kind: 'applyStatus',
      parameters: {
        statusKey: 'sunderblade',
        target: 'caster',
        durationFrames: 1080,
        stacks: 3,
        maxStacks: 9,
      },
    });
    expect(freeStateConsumption).toBeGreaterThan(-1);
    expect(reactionConsumption).toBeGreaterThan(freeStateConsumption);
  });

  it('records consumed reaction level before consuming the reaction', () => {
    const steps = collectSteps(getSkill('battleSkill').scheduledSequences[0]!.sequence);
    const levelFourStatus = steps.findIndex(
      step =>
        step.kind === 'applyStatus' &&
        step.parameters.statusKey === 'consumedElectrificationLevel' &&
        step.parameters.stacks === 4,
    );
    const reactionConsumption = steps.findIndex(step => step.kind === 'consumeElementalReaction');

    expect(levelFourStatus).toBeGreaterThan(-1);
    expect(reactionConsumption).toBeGreaterThan(levelFourStatus);
  });

  it('models nine conditional sword strikes and one final branch per sword count', () => {
    const sequences = getSkill('battleSkill').scheduledSequences;

    expect(sequences.slice(1, 10).map(item => item.startFrame)).toEqual([
      30, 37, 44, 51, 58, 65, 72, 79, 86,
    ]);
    expect(sequences.slice(10).map(item => item.startFrame)).toEqual([
      48, 55, 62, 69, 76, 83, 90, 97, 104,
    ]);
  });

  it('applies electric infliction before enhanced final-thunder damage', () => {
    const finalThunder = getSkill('enhancedBattleSkill').scheduledSequences[10]!;
    const steps = collectSteps(finalThunder.sequence);
    const infliction = steps.findIndex(step => step.kind === 'applyElementalInfliction');
    const damage = steps.findIndex(step => step.kind === 'dealDamage');

    expect(infliction).toBeGreaterThan(-1);
    expect(damage).toBeGreaterThan(infliction);
  });

  it('caps a nine-sword cast at nine six-point energy gains', () => {
    const sequences = getSkill('battleSkill').scheduledSequences;
    const ordinaryGains = sequences
      .slice(1, 10)
      .flatMap(item => collectSteps(item.sequence))
      .filter(step => step.kind === 'changeResource');
    const nineSwordFinalGains = collectSteps(sequences[18]!.sequence).filter(
      step => step.kind === 'changeResource',
    );

    expect(ordinaryGains).toHaveLength(9);
    expect(nineSwordFinalGains).toHaveLength(0);
  });

  it('requires electric infliction for both combo variants', () => {
    for (const key of ['comboSkill', 'enhancedComboSkill']) {
      const rules = getSkill(key).activationWindow?.rules;
      if (!Array.isArray(rules)) throw new Error('expected combo activation rules');

      expect(rules).toHaveLength(2);
      expect(rules.map(rule => rule.condition)).toEqual([
        {
          kind: 'elementalInflictionPresent',
          elements: 'electric',
          minimumStacks: 1,
        },
        {
          kind: 'elementalInflictionPresent',
          elements: 'electric',
          minimumStacks: 1,
        },
      ]);
    }
  });

  it('preserves all talent and potential slots without source identifiers', () => {
    expect(zhuangFangyi.talents.map(talent => talent.key)).toEqual([
      'progressiveElectricAmplification',
      'fatalDamageProtection',
    ]);
    expect(zhuangFangyi.potentials).toHaveLength(5);

    const serialized = JSON.stringify(zhuangFangyi);
    expect(serialized).not.toContain('chr_0030_zhuangfy');
    expect(serialized).not.toContain('buff_chr_');
    expect(serialized).not.toContain('blackboard');
  });
});
