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
): Parameters<typeof inspectStandardPlayerDamageCompatibility>[0] {
  return {
    operators: [entry],
    inputs: [{ frame: 0, operatorId: 'operator:1', skillId: 'battle-skill' }],
    endFrame,
  };
}

describe('standardPlayerDamageCompatibility', () => {
  it('accepts the closed standard damage, action value, marker and resource subset', () => {
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
              },
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
                          kind: 'applyElementalInfliction',
                          parameters: { element: 'electric', isExtra: false },
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
      steps: [
        { kind: 'applyElementalInfliction', parameters: { element: 'heat', isExtra: false } },
      ],
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
                    kind: 'applyElementalInfliction',
                    parameters: { element: 'heat', isExtra: false },
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

  it('reports every unsupported damage field, resource combination and equipment listener', () => {
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
                  stagger: 10,
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
      'unsupported-damage-field',
      'unsupported-resource-change',
      'uninstalled-equipment-event-handler',
    ]);
  });

  it('throws one aggregate error containing all issues', () => {
    const operators = [
      operator({
        steps: [
          { kind: 'dealStagger', parameters: { value: 10 } },
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
