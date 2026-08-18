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
  it('resolves heal multiplier and addition at the selected skill level', () => {
    const skill = {
      key: 'heal',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'heal',
                parameters: {
                  target: 'controlledOperator',
                  attribute: 'will',
                  multiplier: [1, 2],
                  addition: [10, 20],
                  tagIds: [-1],
                },
              },
            ],
          },
        },
      ],
    } satisfies SkillDefinition;

    expect(
      compileSkill({
        operatorId: 'fixture',
        skillGroupKey: 'comboSkill',
        skillType: 'comboSkill',
        skillLevel: 2,
        skill,
      }).timelineActions[0]?.sequence.steps[0],
    ).toMatchObject({
      kind: 'heal',
      parameters: { multiplier: 2, addition: 20 },
    });
  });

  it('compiles an embedded AbilityEntity child timeline at the parent skill level', () => {
    const skill = {
      key: 'entity-parent',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'spawnAbilityEntity',
                parameters: {
                  abilityEntityId: 'entity',
                  dieWhenSourceDies: false,
                  definition: {
                    lifetime: { kind: 'infinite' },
                    childSkill: {
                      skillId: 'entity-child',
                      blackboard: { coefficient: [1, 2] },
                      scheduledSequences: [
                        {
                          startFrame: 3,
                          sequence: {
                            steps: [
                              {
                                kind: 'dealDamage',
                                parameters: {
                                  damageType: 'physical',
                                  attackScale: [4, 5],
                                  tags: ['comboSkill'],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'combo',
      skillType: 'comboSkill',
      skillLevel: 2,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toMatchObject({
      parameters: {
        definition: {
          childSkill: {
            skillId: 'entity-child',
            initialBlackboard: { coefficient: 2 },
            timelineActions: [
              { startFrame: 3, sequence: { steps: [{ parameters: { attackScale: 5 } }] } },
            ],
          },
        },
      },
    });
  });

  it('rejects legacy top-level handlers because they do not preserve listener lifetime', () => {
    const skill = {
      key: 'legacy-listener',
      timelineBlockFrames: 1,
      scheduledSequences: [],
      eventHandlers: [
        {
          key: 'legacy',
          event: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
          scheduledSequences: [{ startFrame: 0, sequence: { steps: [] } }],
        },
      ],
    } satisfies SkillDefinition;

    expect(() =>
      compileSkill({
        operatorId: 'fixture',
        skillGroupKey: 'battleSkill',
        skillType: 'battleSkill',
        skillLevel: 1,
        skill,
      }),
    ).toThrow('uses legacy eventHandlers without a listener interval');
  });

  it('编译内联 Buff 生命周期中的等级数值', () => {
    const skill = {
      key: 'buff-lifecycle',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'applyBuff',
                parameters: {
                  buffId: 'scaling-buff',
                  target: 'caster',
                  definition: {
                    stackingType: 'unique',
                    scheduledSequences: [
                      {
                        startFrame: 2,
                        sequence: {
                          steps: [
                            {
                              kind: 'dealDamage',
                              parameters: {
                                damageType: 'nature',
                                attackScale: [5, 6],
                                tags: ['comboSkill'],
                              },
                            },
                          ],
                        },
                      },
                    ],
                    lifecycleSequences: {
                      start: {
                        steps: [
                          {
                            kind: 'dealDamage',
                            parameters: {
                              damageType: 'electric',
                              attackScale: [1, 2],
                              tags: ['normalSkill'],
                            },
                          },
                        ],
                      },
                    },
                    abilityEventResponses: [
                      {
                        event: 'beforeTakeDamage',
                        priority: 5,
                        sequence: {
                          steps: [
                            {
                              kind: 'dealDamage',
                              parameters: {
                                damageType: 'nature',
                                attackScale: [3, 4],
                                tags: ['normalSkill'],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 2,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toMatchObject({
      parameters: {
        definition: {
          scheduledSequences: [
            {
              startFrame: 2,
              sequence: { steps: [{ parameters: { attackScale: 6 } }] },
            },
          ],
          lifecycleSequences: {
            start: { steps: [{ parameters: { attackScale: 2 } }] },
          },
          abilityEventResponses: [
            {
              event: 'beforeTakeDamage',
              priority: 5,
              sequence: { steps: [{ parameters: { attackScale: 4 } }] },
            },
          ],
        },
      },
    });
  });

  it('按技能等级解析初始动作黑板', () => {
    const skill = {
      key: 'blackboard',
      blackboard: { fixed: 3, scaling: [10, 20] },
      timelineBlockFrames: 1,
      scheduledSequences: [],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 2,
      skill,
    });

    expect(program.initialBlackboard).toEqual({ fixed: 3, scaling: 20 });
  });

  it('resolves the per-hit multiplier of a breaking attack', () => {
    const skill = {
      key: 'finisher-split',
      timelineBlockFrames: 10,
      scheduledSequences: [
        {
          startFrame: 3,
          sequence: {
            steps: [
              {
                kind: 'dealDamage',
                parameters: {
                  damageType: 'electric',
                  calculation: 'breakingAttack',
                  attackScale: [4, 9],
                  calculationMultiplier: [0.1, 0.2],
                  tags: ['powerAttack'],
                },
              },
            ],
          },
        },
      ],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'finisher',
      skillType: 'finisher',
      skillLevel: 2,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toMatchObject({
      parameters: { attackScale: 9, calculationMultiplier: 0.2 },
    });
  });

  it('resolves a standalone stagger step without creating health damage', () => {
    const skill = {
      key: 'stagger-only',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [{ kind: 'dealStagger', parameters: { value: [10, 20] } }],
          },
        },
      ],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 2,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toEqual({
      kind: 'dealStagger',
      parameters: { value: 20 },
    });
  });

  it('resolves the level value of fixed base damage', () => {
    const skill = {
      key: 'fixed-damage',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'dealFixedDamage',
                parameters: {
                  damageType: 'physical',
                  value: [10, 20],
                  tags: ['ultimateSkill'],
                },
              },
            ],
          },
        },
      ],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'ultimate',
      skillType: 'ultimate',
      skillLevel: 2,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toEqual({
      kind: 'dealFixedDamage',
      parameters: { damageType: 'physical', value: 20, tags: ['ultimateSkill'] },
    });
  });

  it('keeps dynamic stagger operands for runtime blackboard evaluation', () => {
    const skill = {
      key: 'dynamic-stagger',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'dealDamage',
                parameters: {
                  damageType: 'physical',
                  attackScale: 1,
                  tags: ['comboSkill'],
                  stagger: { kind: 'blackboard', key: 'poise' },
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
      skillLevel: 1,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toMatchObject({
      parameters: { stagger: { kind: 'blackboard', key: 'poise' } },
    });
  });

  it('preserves a dynamic damage multiplier for runtime resolution', () => {
    const skill = {
      key: 'dynamic-damage',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'dealDamage',
                parameters: {
                  damageType: 'electric',
                  attackScale: { kind: 'blackboard', key: 'attackScale' },
                  tags: ['normalSkill'],
                },
              },
            ],
          },
        },
      ],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 1,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toMatchObject({
      parameters: { attackScale: { kind: 'blackboard', key: 'attackScale' } },
    });
  });

  it('keeps the derived timeline block width in the compiled index', () => {
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

  it('rejects cooldown values that cannot be represented as frame periods', () => {
    const skill = {
      key: 'invalid-cooldown',
      timelineBlockFrames: 1,
      cooldownFrames: 1.5,
      scheduledSequences: [],
    } satisfies SkillDefinition;

    expect(() =>
      compileSkill({
        operatorId: 'fixture',
        skillGroupKey: 'comboSkill',
        skillType: 'comboSkill',
        skillLevel: 1,
        skill,
      }),
    ).toThrow("skill 'invalid-cooldown' must use positive integer cooldownFrames");
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
        key: expect.any(String),
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
    expect(program.timelineActions[0]?.sequence.steps[1]?.key).not.toBe('');
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
          sequence: {
            steps: [
              {
                kind: 'changeResource',
                parameters: {
                  resource: 'sp',
                  amount: [10, 20],
                  coefficient: [0.5, 0.25],
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
        coefficient: 0.25,
        recipient: 'team',
        spGainKind: 'refund',
      },
    });
  });

  it('preserves a dynamic resource coefficient for runtime evaluation', () => {
    const skill = {
      key: 'dynamic-refund',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'changeResourceByActionValue',
                parameters: {
                  resource: 'sp',
                  amount: { kind: 'blackboard', key: 'refundAmount' },
                  coefficient: { kind: 'blackboard', key: 'targetCount' },
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
      skillLevel: 1,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toEqual({
      kind: 'changeResourceByActionValue',
      parameters: {
        resource: 'sp',
        amount: { kind: 'blackboard', key: 'refundAmount' },
        coefficient: { kind: 'blackboard', key: 'targetCount' },
        recipient: 'team',
        spGainKind: 'refund',
      },
    });
  });

  it('compiles ultimate-energy recovery options into the runtime protocol', () => {
    const skill = {
      key: 'taggedRecovery',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'changeResource',
                parameters: {
                  resource: 'ultimateEnergy',
                  amount: [0.1, 0.2],
                  coefficient: 0.5,
                  recipient: 'caster',
                  isPercentValue: true,
                  ultimateRecoveryTagId: 264623624,
                  ignoreUltimateEnergyGainMultiplier: true,
                },
              },
            ],
          },
        },
      ],
    } satisfies SkillDefinition;

    const program = compileSkill({
      operatorId: 'fixture',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 2,
      skill,
    });

    expect(program.timelineActions[0]?.sequence.steps[0]).toEqual({
      kind: 'changeResource',
      parameters: {
        resource: 'ultimateEnergy',
        amount: 0.2,
        coefficient: 0.5,
        recipient: 'caster',
        isPercentValue: true,
        ultimateRecoveryTagId: 264623624,
        ignoreUltimateEnergyGainMultiplier: true,
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

  it('rejects invalid native buff tag ids while compiling the index', () => {
    const skill = {
      key: 'invalid-tag',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'readBuffBlackboard',
                parameters: {
                  target: 'enemy',
                  query: {
                    kind: 'tag',
                    tagQueryType: 'hasAny',
                    buffTagIds: [0x80000000],
                  },
                  desiredKey: 'count',
                  outputKey: 'result',
                },
              },
            ],
          },
        },
      ],
    } satisfies SkillDefinition;

    expect(() =>
      compileSkill({
        operatorId: 'fixture',
        skillGroupKey: 'battleSkill',
        skillType: 'battleSkill',
        skillLevel: 1,
        skill,
      }),
    ).toThrow('gameplay tag id must be a signed 32-bit integer');
  });
});
