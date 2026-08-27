import { describe, expect, it } from 'vitest';
import { renderOperatorDefinitionSource } from '../src/domains/operator/definitionSourceRenderer.ts';

describe('complete operator definition source renderer', () => {
  it('uses the established definition helpers and named skill references', () => {
    const source = renderOperatorDefinitionSource({
      commonBuffDefinitions: {},
      operator: {
        slug: 'sample-operator',
        skillGroups: [
          {
            key: 'battleSkill',
            skillType: 'battleSkill',
            levelSource: 'battleSkill',
            skills: {
              key: 'battleSkill',
              blackboard: { scale: [0.2, 0.3] },
              timelineBlockFrames: 10,
              scheduledSequences: [
                {
                  startFrame: 3,
                  sequence: {
                    steps: [
                      {
                        kind: 'dealDamage',
                        parameters: {
                          damageType: 'physical',
                          attackScale: [0.2, 0.3],
                          tags: ['normalSkill'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    });

    expect(source).toContain("from '../../definitionHelpers'");
    expect(source).toContain('export const sampleOperatorBattleSkill: SkillDefinition');
    expect(source).toContain('withSkillBlackboard(');
    expect(source).toContain('scheduled(3, sequence(step(');
    expect(source).toContain('percentages([20, 30])');
    expect(source).toContain('"skills": sampleOperatorBattleSkill');
    expect(source).not.toContain('prettier-ignore');
  });
});
