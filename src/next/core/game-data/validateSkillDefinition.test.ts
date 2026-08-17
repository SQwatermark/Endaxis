import { describe, expect, it } from 'vitest';
import { validateSkillDefinition } from './validateSkillDefinition';

function baseSkill(): Record<string, unknown> {
  return {
    key: 'testSkill',
    timelineBlockFrames: 30,
    scheduledSequences: [
      {
        startFrame: 0,
        sequence: { steps: [] },
      },
    ],
  };
}

function damageStep(key?: string): Record<string, unknown> {
  return {
    kind: 'dealDamage',
    ...(key === undefined ? {} : { key }),
    parameters: { damageType: 'physical', attackScale: 1, tags: ['normalAttack'] },
  };
}

describe('validateSkillDefinition', () => {
  it('只接受已知的敌人原生 rank，并允许原生空集合表达永不匹配', () => {
    const definition = baseSkill();
    definition.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'conditional',
              parameters: { condition: { kind: 'enemyRankIn', ranks: ['elite', 'boss'] } },
              whenTrue: { steps: [] },
            },
          ],
        },
      },
    ];

    expect(validateSkillDefinition(definition)).toEqual([]);

    const condition = (
      definition.scheduledSequences as Array<{
        sequence: { steps: Array<{ parameters: { condition: { ranks: string[] } } }> };
      }>
    )[0]!.sequence.steps[0]!.parameters.condition;
    condition.ranks = ['advanced'];
    expect(validateSkillDefinition(definition)).toContainEqual(
      expect.objectContaining({ message: 'unknown enemy rank' }),
    );
    condition.ranks = [];
    expect(validateSkillDefinition(definition)).toEqual([]);
  });

  it('允许终结技仅自动忽略施法者而不配置额外对象', () => {
    const definition = baseSkill();
    definition.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'startUltimateTimeDilation',
              parameters: {
                priority: -1742631616,
                targetScale: { kind: 'constant', value: 0 },
                ignoredTargets: [],
              },
            },
          ],
        },
      },
    ];

    expect(validateSkillDefinition(definition)).toEqual([]);
  });

  it('允许全局时间膨胀在执行帧排除当前主控干员', () => {
    const definition = baseSkill();
    definition.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'startTimeDilation',
              parameters: {
                scope: 'global',
                durationSeconds: { kind: 'constant', value: 1 },
                slot: 1,
                priority: 2,
                curve: { kind: 'named', key: 'ComboSkill' },
                finishByAction: false,
                ignoredTargets: ['controlled'],
              },
            },
          ],
        },
      },
    ];

    expect(validateSkillDefinition(definition)).toEqual([]);
  });

  it('accepts a structurally valid skill', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            damageStep('hit:1'),
            {
              kind: 'modifyActionValue',
              parameters: { key: 'x', operation: 'add', value: { kind: 'constant', value: 1 } },
            },
          ],
        },
      },
    ];
    expect(validateSkillDefinition(skill)).toEqual([]);
  });

  it('validates named and inline time-dilation curves', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'startTimeDilation',
              parameters: {
                scope: 'global',
                durationSeconds: { kind: 'constant', value: 1 },
                slot: 1,
                priority: 2,
                curve: { kind: 'named', key: 'ComboSkill' },
                finishByAction: false,
                ignoredTargets: ['caster'],
              },
            },
          ],
        },
      },
    ];
    expect(validateSkillDefinition(skill)).toEqual([]);

    const parameters = (
      skill.scheduledSequences as Array<{
        sequence: { steps: Array<{ parameters: Record<string, unknown> }> };
      }>
    )[0]!.sequence.steps[0]!.parameters;
    parameters.curve = {
      kind: 'inline',
      keys: [
        {
          time: 1,
          value: 0,
          inTangent: 0,
          outTangent: 0,
          weightedMode: 4,
          inWeight: 0,
          outWeight: 0,
        },
        {
          time: 0,
          value: 1,
          inTangent: 0,
          outTangent: 0,
          weightedMode: 0,
          inWeight: 0,
          outWeight: 0,
        },
      ],
    };
    const issues = validateSkillDefinition(skill);
    expect(issues.some(issue => issue.path.endsWith('.weightedMode'))).toBe(true);
    expect(issues.some(issue => issue.message.includes('strictly increasing'))).toBe(true);
  });

  it('keeps Buff presentation metadata strict and separate from runtime fields', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: {
                buffId: 'buff.example',
                target: 'caster',
                definition: {
                  stackingType: 'refresh',
                  presentation: { iconPath: '/icons/buffs/example.webp' },
                },
              },
            },
          ],
        },
      },
    ];

    expect(validateSkillDefinition(skill)).toEqual([]);
    const definition = (
      skill.scheduledSequences as Array<{
        sequence: { steps: Array<{ parameters: { definition: Record<string, unknown> } }> };
      }>
    )[0]!.sequence.steps[0]!.parameters.definition;
    definition.presentation = { iconPath: '', color: '#fff' };
    const issues = validateSkillDefinition(skill);
    expect(issues.some(issue => issue.path.endsWith('.presentation.iconPath'))).toBe(true);
    expect(issues.some(issue => issue.path.endsWith('.presentation.color'))).toBe(true);
  });

  it('accepts ordered inline Buff lifecycle sequences', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: {
                buffId: 'buff.lifecycle',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                definition: {
                  stackingType: 'unique',
                  lifecycleSequences: {
                    start: {
                      steps: [
                        {
                          kind: 'setContextFlag',
                          parameters: { flag: 'started', value: true, target: 'caster' },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      },
    ];

    expect(validateSkillDefinition(skill)).toEqual([]);
  });

  it('requires source skill-cast identity for inline Buff lifecycle sequences', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: {
                buffId: 'buff.lifecycle-without-origin',
                target: 'caster',
                definition: {
                  stackingType: 'unique',
                  lifecycleSequences: { start: { steps: [] } },
                },
              },
            },
          ],
        },
      },
    ];

    const issues = validateSkillDefinition(skill);
    expect(
      issues.some(
        issue =>
          issue.path.endsWith('.parameters.inheritSourceSkillCastInfo') &&
          issue.message.includes('require inherited skill-cast info'),
      ),
    ).toBe(true);
  });

  it('rejects old low-level actions and unknown inline Buff lifecycle names', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: {
                buffId: 'buff.invalid-lifecycle',
                target: 'caster',
                definition: {
                  stackingType: 'unique',
                  actions: { start: [] },
                  lifecycleSequences: { update: { steps: [] } },
                },
              },
            },
          ],
        },
      },
    ];

    const issues = validateSkillDefinition(skill);
    expect(issues.some(issue => issue.path.endsWith('.definition.actions'))).toBe(true);
    expect(issues.some(issue => issue.path.endsWith('.lifecycleSequences.update'))).toBe(true);
  });

  it('rejects missing top-level key and timelineBlockFrames', () => {
    const skill = { scheduledSequences: [] };
    const issues = validateSkillDefinition(skill);
    expect(issues.some(issue => issue.path === '$.key')).toBe(true);
    expect(issues.some(issue => issue.path === '$.timelineBlockFrames')).toBe(true);
    expect(issues.some(issue => issue.path === '$.scheduledSequences')).toBe(false);
  });

  it('rejects empty scheduledSequences requirement when omitted', () => {
    const issues = validateSkillDefinition({ key: 'k', timelineBlockFrames: 30 });
    expect(issues.some(issue => issue.path === '$.scheduledSequences')).toBe(true);
  });

  it('rejects a missing damage step key', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [{ startFrame: 0, sequence: { steps: [damageStep()] } }];
    const issues = validateSkillDefinition(skill);
    expect(
      issues.some(
        issue =>
          issue.path === '$.scheduledSequences[0].sequence.steps[0]' &&
          issue.message.includes('non-empty key'),
      ),
    ).toBe(true);
  });

  it('rejects a missing key nested inside conditional branches', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'conditional',
              parameters: { condition: { kind: 'combatActive' } },
              whenTrue: { steps: [damageStep()] },
            },
          ],
        },
      },
    ];
    const issues = validateSkillDefinition(skill);
    expect(
      issues.some(
        issue =>
          issue.path === '$.scheduledSequences[0].sequence.steps[0].whenTrue.steps[0]' &&
          issue.message.includes('non-empty key'),
      ),
    ).toBe(true);
  });

  it('rejects a missing key nested inside once body', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [{ kind: 'once', parameters: { scopeKey: 's' }, body: { steps: [damageStep()] } }],
        },
      },
    ];
    const issues = validateSkillDefinition(skill);
    expect(
      issues.some(
        issue =>
          issue.path === '$.scheduledSequences[0].sequence.steps[0].once.steps[0]' &&
          issue.message.includes('non-empty key'),
      ),
    ).toBe(true);
  });

  it('rejects duplicate damage step keys anywhere in the definition', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            damageStep('dup'),
            {
              kind: 'conditional',
              parameters: { condition: { kind: 'combatActive' } },
              whenTrue: { steps: [damageStep('dup')] },
            },
          ],
        },
      },
    ];
    const issues = validateSkillDefinition(skill);
    expect(issues.some(issue => issue.message.includes("duplicate damage step key 'dup'"))).toBe(
      true,
    );
  });

  it('rejects an invalid event trigger kind', () => {
    const skill = baseSkill();
    skill.eventHandlers = [
      {
        key: 'handler:1',
        event: { kind: 'unknownTrigger' },
        scheduledSequences: [{ startFrame: 0, sequence: { steps: [] } }],
      },
    ];
    const issues = validateSkillDefinition(skill);
    expect(
      issues.some(
        issue =>
          issue.path === '$.eventHandlers[0].event.kind' &&
          issue.message.includes('unknown event trigger'),
      ),
    ).toBe(true);
  });

  it('requires an explicit end frame for nested combat event listeners', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'conditional',
              parameters: { condition: { kind: 'combatActive' } },
              whenTrue: {
                steps: [
                  {
                    kind: 'listenForCombatEvents',
                    parameters: {
                      responses: [
                        {
                          key: 'response',
                          event: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
                          sequence: { steps: [] },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ];

    expect(validateSkillDefinition(skill)).toContainEqual({
      path: '$.scheduledSequences[0].endFrame',
      message: 'combat event listeners require an end frame',
    });
  });

  it('rejects an event trigger with an invalid scope', () => {
    const skill = baseSkill();
    skill.eventHandlers = [
      {
        key: 'handler:1',
        event: { kind: 'skillHit', skillGroupKey: 'battleSkill', scope: 'all' },
        scheduledSequences: [{ startFrame: 0, sequence: { steps: [] } }],
      },
    ];
    const issues = validateSkillDefinition(skill);
    expect(issues.some(issue => issue.path === '$.eventHandlers[0].event.scope')).toBe(true);
  });

  it('rejects invalid LevelValues: NaN and empty array', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [damageStep('hit:1')],
        },
      },
    ];
    // 攻击倍率传 NaN
    const skillA = structuredClone(skill) as Record<string, unknown>;
    const stepsA = skillA.scheduledSequences as Array<{
      sequence: { steps: Array<{ parameters: Record<string, unknown> }> };
    }>;
    stepsA[0]!.sequence.steps[0]!.parameters.attackScale = Number.NaN;
    expect(
      validateSkillDefinition(skillA).some(
        issue => issue.path === '$.scheduledSequences[0].sequence.steps[0].parameters.attackScale',
      ),
    ).toBe(true);

    // 黑板值传空数组
    const skillB = baseSkill();
    skillB.blackboard = { scale: [] };
    expect(validateSkillDefinition(skillB).some(issue => issue.path === '$.blackboard.scale')).toBe(
      true,
    );
  });

  it('rejects invalid damage tag', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: { steps: [damageStep('hit:1')] },
      },
    ];
    const tagsStep = skill.scheduledSequences as Array<{
      sequence: { steps: Array<{ parameters: { tags: string[] } }> };
    }>;
    tagsStep[0]!.sequence.steps[0]!.parameters.tags = ['unknownTag'];
    expect(
      validateSkillDefinition(skill).some(
        issue => issue.path === '$.scheduledSequences[0].sequence.steps[0].parameters.tags[0]',
      ),
    ).toBe(true);
  });

  it('rejects unknown combat step kind', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: { steps: [{ kind: 'unknownStep', parameters: {} }] },
      },
    ];
    expect(
      validateSkillDefinition(skill).some(
        issue =>
          issue.path === '$.scheduledSequences[0].sequence.steps[0].kind' &&
          issue.message.includes('unknown combat step'),
      ),
    ).toBe(true);
  });

  it('requires an entity iteration target for AbilityEntity finish operations', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: { steps: [{ kind: 'finishCurrentAbilityEntity', parameters: {} }] },
      },
    ];

    expect(validateSkillDefinition(skill)).toContainEqual({
      path: '$.scheduledSequences[0].sequence.steps[0]',
      message: 'requires a forEachContextTarget body',
    });

    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'forEachContextTarget',
              parameters: { contextKey: 'entities' },
              body: {
                steps: [{ kind: 'finishCurrentAbilityEntity', parameters: {} }],
              },
            },
          ],
        },
      },
    ];
    expect(validateSkillDefinition(skill)).toEqual([]);

    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [{ kind: 'finishCurrentAbilityEntityWhenSourceDies', parameters: {} }],
        },
      },
    ];
    expect(validateSkillDefinition(skill)).toContainEqual({
      path: '$.scheduledSequences[0].sequence.steps[0]',
      message: 'requires a forEachContextTarget body',
    });
  });

  it('allows current AbilityEntity Buff application only inside an entity target scope', () => {
    const apply = {
      kind: 'applyBuff' as const,
      parameters: {
        buffId: 'entity-monitor',
        target: 'currentAbilityEntity' as const,
        definition: { stackingType: 'unique' as const },
      },
    };
    const skill = baseSkill();
    skill.scheduledSequences = [{ startFrame: 0, sequence: { steps: [apply] } }];
    expect(validateSkillDefinition(skill)).toContainEqual({
      path: '$.scheduledSequences[0].sequence.steps[0]',
      message: 'currentAbilityEntity target requires a forEachContextTarget body',
    });

    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'forEachContextTarget',
              parameters: { contextKey: 'entities' },
              body: { steps: [apply] },
            },
          ],
        },
      },
    ];
    expect(validateSkillDefinition(skill)).toEqual([]);
  });

  it('rejects conditional without whenTrue', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [{ kind: 'conditional', parameters: { condition: { kind: 'combatActive' } } }],
        },
      },
    ];
    const issues = validateSkillDefinition(skill);
    expect(
      issues.some(issue => issue.path === '$.scheduledSequences[0].sequence.steps[0].whenTrue'),
    ).toBe(true);
  });

  it('rejects invalid cost resource and negative level value', () => {
    const skill = baseSkill();
    skill.costs = [{ resource: 'mana', value: 10 }];
    expect(validateSkillDefinition(skill).some(issue => issue.path === '$.costs[0].resource')).toBe(
      true,
    );

    const skillB = baseSkill();
    skillB.costs = [{ resource: 'sp', value: -1 }];
    // LevelValues 只要求有限数，负数费用在编译期才做非负约束；这里不应报错。
    expect(validateSkillDefinition(skillB).some(issue => issue.path === '$.costs[0].value')).toBe(
      false,
    );
  });

  it('rejects changeResource with sp-only fields on ultimateEnergy', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'changeResource',
              parameters: {
                resource: 'ultimateEnergy',
                amount: 10,
                recipient: 'caster',
                spGainSource: 'normalAttack',
              },
            },
          ],
        },
      },
    ];
    expect(
      validateSkillDefinition(skill).some(
        issue => issue.path === '$.scheduledSequences[0].sequence.steps[0].parameters.spGainSource',
      ),
    ).toBe(true);
  });

  it('validates a dynamic resource coefficient as an action value operand', () => {
    const skill = baseSkill();
    skill.scheduledSequences = [
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
              },
            },
          ],
        },
      },
    ];

    expect(validateSkillDefinition(skill)).toEqual([]);

    const coefficient = (
      skill.scheduledSequences as Array<{
        sequence: { steps: Array<{ parameters: Record<string, unknown> }> };
      }>
    )[0]!.sequence.steps[0]!.parameters.coefficient as Record<string, unknown>;
    coefficient.key = '';

    expect(
      validateSkillDefinition(skill).some(
        issue =>
          issue.path === '$.scheduledSequences[0].sequence.steps[0].parameters.coefficient.key',
      ),
    ).toBe(true);
  });
});
