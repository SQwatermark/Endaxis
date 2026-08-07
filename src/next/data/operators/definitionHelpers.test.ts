import { describe, expect, it } from 'vitest';
import {
  basicAttackOfType,
  damageOfType,
  multiplyLevelValues,
  reactionActive,
  scaleDamageByStatusStacks,
  statusActive,
  statusStacksExactly,
  withSkillBlackboard,
} from './definitionHelpers';

describe('operator definition helpers', () => {
  it('附加初始黑板时不修改原技能定义', () => {
    const skill = basicAttackOfType('electric')('basicAttack1', 10, 5, 0.2);
    const wrapped = withSkillBlackboard(skill, { attackScale: [0.2, 0.3] });

    expect(skill.blackboard).toBeUndefined();
    expect(wrapped.blackboard).toEqual({ attackScale: [0.2, 0.3] });
    expect(wrapped.scheduledSequences).toBe(skill.scheduledSequences);
  });

  it('keeps the explicitly bound damage type on every basic-attack hit', () => {
    const natureBasicAttack = basicAttackOfType('nature');
    const segment = natureBasicAttack('basicAttack1', 20, [5, 8], [0.1, 0.2]);

    expect(segment.scheduledSequences.map(item => item.sequence.steps[0])).toEqual([
      {
        kind: 'dealDamage',
        parameters: {
          damageType: 'nature',
          attackScale: [0.1, 0.2],
          tags: ['normalAttack'],
        },
      },
      {
        kind: 'dealDamage',
        parameters: {
          damageType: 'nature',
          attackScale: [0.1, 0.2],
          tags: ['normalAttack'],
        },
      },
    ]);
  });

  it('adds final-hit identity and SP recovery only to the last hit', () => {
    const segment = basicAttackOfType('electric')('basicAttack4', 40, [20, 24], 0.5, {
      final: true,
      stagger: 15,
      spRecovery: 17,
    });

    expect(segment.scheduledSequences.map(item => item.startFrame)).toEqual([20, 24]);
    expect(segment.scheduledSequences[0]?.sequence.steps).toHaveLength(1);
    expect(segment.scheduledSequences[1]?.sequence.steps).toEqual([
      {
        kind: 'dealDamage',
        parameters: {
          damageType: 'electric',
          attackScale: 0.5,
          tags: ['normalAttack', 'normalAttackLastCombo'],
          stagger: 15,
        },
      },
      {
        kind: 'changeResource',
        parameters: {
          resource: 'sp',
          amount: 17,
          recipient: 'team',
          spGainSource: 'normalAttack',
        },
      },
    ]);
  });

  it('builds status conditions without emitting absent optional fields', () => {
    expect(statusActive('enhancement')).toEqual({
      kind: 'statusActive',
      statusKey: 'enhancement',
      target: 'caster',
    });
    expect(statusActive('mark', 'enemy', 2)).toEqual({
      kind: 'statusActive',
      statusKey: 'mark',
      target: 'enemy',
      minimumStacks: 2,
    });
  });

  it('expresses exact stacks as a lower bound plus the negated next bound', () => {
    expect(statusStacksExactly('sword', 3)).toEqual({
      kind: 'all',
      conditions: [
        {
          kind: 'statusActive',
          statusKey: 'sword',
          target: 'caster',
          minimumStacks: 3,
        },
        {
          kind: 'not',
          condition: {
            kind: 'statusActive',
            statusKey: 'sword',
            target: 'caster',
            minimumStacks: 4,
          },
        },
      ],
    });
  });

  it('keeps reaction level optional', () => {
    expect(reactionActive('electrification')).toEqual({
      kind: 'elementalReactionActive',
      reaction: 'electrification',
    });
    expect(reactionActive('electrification', 2)).toEqual({
      kind: 'elementalReactionActive',
      reaction: 'electrification',
      minimumLevel: 2,
    });
  });

  it('scales scalar and leveled values without mutating the source array', () => {
    const values = [0.2, 0.4] as const;
    const scaled = multiplyLevelValues(values, 6);

    expect(multiplyLevelValues(0.2, 6)).toBeCloseTo(1.2);
    expect(scaled).toHaveLength(2);
    expect(scaled[0]).toBeCloseTo(1.2);
    expect(scaled[1]).toBeCloseTo(2.4);
    expect(values).toEqual([0.2, 0.4]);
  });

  it('adds status-stack scaling without discarding base damage semantics', () => {
    const damage = damageOfType('electric')(0.2, ['normalSkill'], { stagger: 15 });

    expect(scaleDamageByStatusStacks(damage, 'consumedLevel', 0.03)).toEqual({
      damageType: 'electric',
      attackScale: 0.2,
      tags: ['normalSkill'],
      stagger: 15,
      attackScalePerStatusStack: {
        statusKey: 'consumedLevel',
        target: 'caster',
        coefficient: 0.03,
      },
    });
    expect(damage).not.toHaveProperty('attackScalePerStatusStack');
  });
});
