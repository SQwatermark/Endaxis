import { describe, expect, it } from 'vitest';
import { nextGameDataRepository } from '../../data/gameDataRepository';
import { perlica } from '../../data/operators/perlica';
import { validateOperatorDefinition } from './validateOperatorDefinition';

describe('validateOperatorDefinition', () => {
  it('accepts every registered operator through one complete-definition entry point', () => {
    const issues = nextGameDataRepository
      .getOperators()
      .flatMap(operator => validateOperatorDefinition(operator, `$.operators['${operator.slug}']`));
    expect(issues).toEqual([]);
  });

  it('validates root programs and combo-to-skill references, not only timeline skills', () => {
    expect(
      validateOperatorDefinition({
        ...perlica,
        passiveSkills: [
          {
            key: 'invalid-passive',
            enableSequence: {
              steps: [
                {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'physical',
                    attackScale: Number.NaN,
                    tags: ['normalAttack'],
                  },
                },
              ],
            },
          },
        ],
      }).some(issue => issue.path.includes('passiveSkills[0].enableSequence')),
    ).toBe(true);

    expect(
      validateOperatorDefinition({
        ...perlica,
        comboSkillConditions: [
          {
            key: 'invalid-combo-reference',
            skillKey: 'missing-combo-skill',
            event: 'enterFight',
            immediately: false,
            initialValues: {},
            sequence: { steps: [] },
          },
        ],
      }),
    ).toContainEqual({
      path: '$.comboSkillConditions[0].skillKey',
      message: "unknown combo skill 'missing-combo-skill'",
    });
  });
});
