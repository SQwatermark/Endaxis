import { describe, expect, it } from 'vitest';
import type { CompiledSkillProgram, ResolvedActionSequence } from '../../compiler/combatProgram';
import type { CombatOperatorProgram } from './combatRuntimeAssembly';
import {
  assertStandardPlayerDamageCompatibility,
  inspectStandardPlayerDamageCompatibility,
  StandardPlayerDamageCompatibilityError,
} from './standardPlayerDamageCompatibility';

function program(sequence: ResolvedActionSequence): CompiledSkillProgram {
  return {
    operatorId: 'operator:1',
    skillGroupKey: 'battleSkill',
    skillId: 'battle-skill',
    skillType: 'battleSkill',
    skillLevel: 1,
    initialBlackboard: {},
    timelineBlockFrames: 1,
    costs: [],
    timelineActions: [{ startFrame: 0, sequence }],
  };
}

function operator(
  sequence: ResolvedActionSequence,
  equipmentEventHandlerCount = 0,
): CombatOperatorProgram {
  return {
    operatorId: 'operator:1',
    skills: [program(sequence)],
    equipmentContributions:
      equipmentEventHandlerCount === 0
        ? []
        : [
            {
              source: { kind: 'gearSet', slug: 'gear-set' },
              selectedLevel: 1,
              modifiers: [],
              eventHandlers: Array.from({ length: equipmentEventHandlerCount }, (_, index) => ({
                key: `handler:${index}`,
                event: {
                  kind: 'damageTagHit' as const,
                  tag: 'normalSkill' as const,
                  scope: 'operator' as const,
                },
                sequence: { steps: [] },
              })),
            },
          ],
  };
}

function compatibilityInput(
  entry: CombatOperatorProgram,
  endFrame = 100,
  supportsElementalInfliction = false,
): Parameters<typeof inspectStandardPlayerDamageCompatibility>[0] {
  return {
    operators: [entry],
    inputs: [{ frame: 0, operatorId: 'operator:1', skillId: 'battle-skill' }],
    endFrame,
    ...(supportsElementalInfliction ? { supportsElementalInfliction: true } : {}),
  };
}

describe('standardPlayerDamageCompatibility', () => {
  it('accepts the closed standard damage, poise, infliction, action value and resource subset', () => {
    const issues = inspectStandardPlayerDamageCompatibility(
      compatibilityInput(
        operator({
          steps: [
            {
              kind: 'modifyActionValue',
              parameters: {
                key: 'scale',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              },
            },
            {
              kind: 'dealDamage',
              parameters: {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'scale' },
                tags: ['normalSkill'],
                stagger: 10,
              },
            },
            { kind: 'dealStagger', parameters: { value: 10 } },
            {
              kind: 'applyElementalInfliction',
              parameters: { element: 'electric', isExtra: false },
            },
            {
              kind: 'applyElementalReaction',
              parameters: {
                reaction: 'electrification',
                target: 'enemy',
                durationSeconds: 5,
                effectiveness: 1,
              },
            },
            {
              kind: 'consumeElementalReaction',
              parameters: { reaction: 'electrification', target: 'enemy' },
            },
            {
              kind: 'conditional',
              parameters: {
                condition: {
                  kind: 'elementalReactionActive',
                  reaction: 'electrification',
                  minimumLevel: 1,
                },
              },
              whenTrue: { steps: [] },
            },
            {
              kind: 'createTimedMarker',
              parameters: {
                markerId: 'marker',
                target: 'enemy',
                durationSeconds: { kind: 'constant', value: 1 },
                autoFinishByAction: false,
              },
            },
            {
              kind: 'changeResource',
              parameters: { resource: 'sp', recipient: 'team', amount: 10 },
            },
            {
              kind: 'changeResource',
              parameters: { resource: 'ultimateEnergy', recipient: 'caster', amount: 10 },
            },
          ],
        }),
        100,
        true,
      ),
    );

    expect(issues).toEqual([]);
  });

  it('recursively reports unsupported branches and nested conditions in stable order', () => {
    const issues = inspectStandardPlayerDamageCompatibility(
      compatibilityInput(
        operator({
          steps: [
            {
              kind: 'conditional',
              parameters: {
                condition: {
                  kind: 'all',
                  conditions: [
                    { kind: 'combatActive' },
                    { kind: 'not', condition: { kind: 'targetStaggered', target: 'enemy' } },
                  ],
                },
              },
              whenTrue: { steps: [] },
              whenFalse: {
                steps: [
                  {
                    kind: 'once',
                    parameters: { scopeKey: 'nested' },
                    body: {
                      steps: [
                        {
                          kind: 'applyBuff',
                          parameters: { buffId: 'buff:missing', target: 'enemy' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        }),
      ),
    );

    expect(issues.map(issue => issue.code)).toEqual(['unsupported-condition', 'unsupported-step']);
    expect(issues[0]?.path).toContain('.parameters.condition.conditions[1].condition');
    expect(issues[1]?.path).toContain('.whenFalse.steps[0].body.steps[0]');
  });

  it('does not reject unsupported skills that cannot run before the requested end frame', () => {
    const entry = operator({
      steps: [{ kind: 'applyBuff', parameters: { buffId: 'buff:missing', target: 'enemy' } }],
    });

    expect(
      inspectStandardPlayerDamageCompatibility({
        operators: [entry],
        inputs: [{ frame: 11, operatorId: 'operator:1', skillId: 'battle-skill' }],
        endFrame: 10,
      }),
    ).toEqual([]);
  });

  it('does not inspect a scheduled skill action that starts after the requested end frame', () => {
    const base = operator({ steps: [] });
    const entry: CombatOperatorProgram = {
      ...base,
      skills: [
        {
          ...base.skills[0]!,
          timelineActions: [
            {
              startFrame: 20,
              sequence: {
                steps: [
                  {
                    kind: 'applyBuff',
                    parameters: { buffId: 'buff:missing', target: 'enemy' },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    expect(
      inspectStandardPlayerDamageCompatibility({
        operators: [entry],
        inputs: [{ frame: 1, operatorId: 'operator:1', skillId: 'battle-skill' }],
        endFrame: 10,
      }),
    ).toEqual([]);
  });

  it('reports every unsupported damage field and resource combination', () => {
    const issues = inspectStandardPlayerDamageCompatibility(
      compatibilityInput(
        operator(
          {
            steps: [
              {
                kind: 'dealDamage',
                parameters: {
                  damageType: 'lifeDrain',
                  calculation: 'breakingAttack',
                  attackScale: 1,
                  calculationMultiplier: 2,
                  tags: [],
                  attackScalePerStatusStack: {
                    statusKey: 'marked',
                    target: 'enemy',
                    coefficient: 0.1,
                  },
                },
              },
              {
                kind: 'changeResource',
                parameters: { resource: 'sp', recipient: 'caster', amount: 1 },
              },
            ],
          },
          1,
        ),
      ),
    );

    expect(issues.map(issue => issue.code)).toEqual([
      'unsupported-damage-calculation',
      'unsupported-damage-calculation',
      'unsupported-damage-field',
      'unsupported-damage-field',
      'unsupported-resource-change',
    ]);
  });

  it('checks equipment handler conditions and steps instead of rejecting all listeners', () => {
    expect(
      inspectStandardPlayerDamageCompatibility(compatibilityInput(operator({ steps: [] }, 1))),
    ).toEqual([]);

    const entry = operator({ steps: [] }, 1);
    const contribution = entry.equipmentContributions![0]!;
    const handler = contribution.eventHandlers[0]!;
    const issues = inspectStandardPlayerDamageCompatibility(
      compatibilityInput({
        ...entry,
        equipmentContributions: [
          {
            ...contribution,
            eventHandlers: [
              {
                ...handler,
                sequence: {
                  steps: [
                    {
                      kind: 'dealDamage',
                      parameters: {
                        damageType: 'electric',
                        attackScale: 1,
                        tags: ['normalSkill'],
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      }),
    );
    expect(issues).toContainEqual(expect.objectContaining({ code: 'unsupported-step' }));
  });

  it('rejects elemental infliction without an installed infliction document', () => {
    const issues = inspectStandardPlayerDamageCompatibility(
      compatibilityInput(
        operator({
          steps: [
            { kind: 'applyElementalInfliction', parameters: { element: 'heat', isExtra: false } },
          ],
        }),
      ),
    );

    expect(issues.map(issue => issue.code)).toEqual(['unsupported-step']);
    expect(issues[0]?.detail).toContain('infliction document');
  });

  it('throws one aggregate error containing all issues', () => {
    const operators = [
      operator({
        steps: [
          { kind: 'dealStagger', parameters: { value: 10 } },
          {
            kind: 'applyBuff',
            parameters: { buffId: 'buff:missing', target: 'enemy' },
          },
          { kind: 'setContextFlag', parameters: { flag: 'ready', value: true, target: 'caster' } },
        ],
      }),
    ];

    try {
      assertStandardPlayerDamageCompatibility({
        operators,
        inputs: [{ frame: 0, operatorId: 'operator:1', skillId: 'battle-skill' }],
        endFrame: 1,
      });
      throw new Error('expected compatibility assertion to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(StandardPlayerDamageCompatibilityError);
      expect((error as StandardPlayerDamageCompatibilityError).issues).toHaveLength(2);
    }
  });
});
