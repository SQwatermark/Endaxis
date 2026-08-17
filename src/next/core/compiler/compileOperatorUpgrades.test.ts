import { describe, expect, it } from 'vitest';
import { perlica } from '../../data/operators/perlica';
import { arclightGeneratedOperator } from '../../data/operators/generated/arclight.operator.generated';
import type { CompiledSkillProgram } from './combatProgram';
import type { OperatorInstanceDocument } from '../project/schema';
import { compileOperatorDefinitionSkills } from './compileScenarioTimeline';
import {
  applyOperatorUpgradeSkillPatches,
  resolveActiveOperatorUpgrades,
} from './compileOperatorUpgrades';

function build(overrides: Partial<OperatorInstanceDocument> = {}): OperatorInstanceDocument {
  return {
    operatorSlug: perlica.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates: {},
    ...overrides,
  };
}

function program(
  skillId: string,
  skillGroupKey: string,
  resource: 'sp' | 'ultimateEnergy',
  value: number,
): CompiledSkillProgram {
  return {
    operatorId: 'operator:1',
    skillGroupKey,
    skillId,
    skillType: resource === 'sp' ? 'battleSkill' : 'ultimate',
    skillLevel: 12,
    initialBlackboard: {},
    timelineBlockFrames: 1,
    costFrame: 0,
    costs: [{ resource, value }],
    timelineActions: [],
  };
}

describe('operator upgrade compilation', () => {
  it('compiles generated talent and potential effects into operator skills', () => {
    const skills = compileOperatorDefinitionSkills(
      'track:0',
      build({
        operatorSlug: arclightGeneratedOperator.slug,
        potential: 4,
        talentStates: { 0: 2 },
      }),
      arclightGeneratedOperator,
    );
    const battleSkill = skills.find(skill => skill.skillGroupKey === 'battleSkill');
    const ultimate = skills.find(skill => skill.skillGroupKey === 'ultimate');

    expect(battleSkill?.initialBlackboard).toMatchObject({
      talent_1: 1,
      duration: 15,
      pulse_up: Math.fround(0.0008 * 1.3),
      count: 3,
      atb: 50,
    });
    expect(ultimate?.costs).toEqual([{ resource: 'ultimateEnergy', value: 76.5 }]);
  });

  it('selects talents and potentials in stable declaration order', () => {
    const operator = {
      ...perlica,
      talents: [
        { key: 'talent-a', levels: 2 },
        { key: 'talent-b', levels: 1 },
      ],
      potentials: [
        { key: 'potential-a', levels: 1 },
        { key: 'potential-b', levels: 2 },
      ],
    };

    expect(
      resolveActiveOperatorUpgrades(
        build({ talentStates: { 0: 2, 1: 0 }, potential: 2 }),
        operator,
      ).map(upgrade => [upgrade.source, upgrade.definition.key, upgrade.level]),
    ).toEqual([
      ['talent', 'talent-a', 2],
      ['potential', 'potential-a', 1],
      ['potential', 'potential-b', 1],
    ]);
  });

  it('applies cost multipliers in upgrade and modifier order to every skill variant', () => {
    const source = [
      program('ultimate-a', 'ultimate', 'ultimateEnergy', 100),
      program('ultimate-b', 'ultimate', 'ultimateEnergy', 120),
      program('battle-skill', 'battleSkill', 'sp', 100),
    ];
    const upgrades = [
      {
        source: 'talent',
        level: 1,
        definition: {
          key: 'talent-cost',
          levels: 1,
          modifiers: [
            {
              kind: 'multiplySkillCost',
              skillGroupKey: 'ultimate',
              resource: 'ultimateEnergy',
              multiplier: 0.8,
            },
          ],
        },
      },
      {
        source: 'potential',
        level: 1,
        definition: {
          key: 'potential-cost',
          levels: 1,
          modifiers: [
            {
              kind: 'multiplySkillCost',
              skillGroupKey: 'ultimate',
              resource: 'ultimateEnergy',
              multiplier: 0.5,
            },
          ],
        },
      },
    ] as const;

    const patched = applyOperatorUpgradeSkillPatches(source, upgrades);

    expect(patched.map(skill => skill.costs[0]!.value)).toEqual([40, 48, 100]);
    expect(source.map(skill => skill.costs[0]!.value)).toEqual([100, 120, 100]);
  });

  it('patches initial skill blackboards with add, multiply and assign operations', () => {
    const source = [
      { ...program('battle-a', 'battleSkill', 'sp', 100), initialBlackboard: { atb: 40, pulse_up: 0.0005, count: 3 } },
      { ...program('battle-b', 'battleSkill', 'sp', 100), initialBlackboard: { atb: 35, pulse_up: 0.0008, count: 3 } },
      program('ultimate', 'ultimate', 'ultimateEnergy', 100),
    ];
    const patched = applyOperatorUpgradeSkillPatches(source, [
      {
        source: 'talent',
        level: 2,
        definition: {
          key: 'talent-patch',
          levels: 2,
          modifiers: [
            {
              kind: 'patchSkillBlackboard',
              skillGroupKey: 'battleSkill',
              blackboardKey: 'talent_1',
              operation: 'assign',
              value: [1, 1],
            },
            {
              kind: 'patchSkillBlackboard',
              skillGroupKey: 'battleSkill',
              blackboardKey: 'pulse_up',
              operation: 'multiply',
              value: [1, 1.3],
            },
          ],
        },
      },
    ]);

    expect(patched[0]!.initialBlackboard).toMatchObject({ talent_1: 1, atb: 40, pulse_up: Math.fround(0.0005 * 1.3), count: 3 });
    expect(patched[1]!.initialBlackboard).toMatchObject({ talent_1: 1, atb: 35, pulse_up: Math.fround(0.0008 * 1.3), count: 3 });
    expect(patched[2]!.initialBlackboard).toEqual({});
    expect(source[0]!.initialBlackboard).not.toHaveProperty('talent_1');
  });

  it('fails closed for missing targets and unsupported active modifiers', () => {
    const source = [program('ultimate', 'ultimate', 'ultimateEnergy', 100)];
    expect(() =>
      applyOperatorUpgradeSkillPatches(source, [
        {
          source: 'potential',
          level: 1,
          definition: {
            key: 'bad-target',
            levels: 1,
            modifiers: [
              {
                kind: 'multiplySkillCost',
                skillGroupKey: 'missing',
                resource: 'ultimateEnergy',
                multiplier: 0.85,
              },
            ],
          },
        },
      ]),
    ).toThrow("references missing skill group 'missing'");
    expect(() =>
      applyOperatorUpgradeSkillPatches(source, [
        {
          source: 'potential',
          level: 1,
          definition: {
            key: 'unsupported',
            levels: 1,
            modifiers: [
              { kind: 'multiplySkillDamage', skillGroupKey: 'ultimate', multiplier: 1.1 },
            ],
          },
        },
      ]),
    ).toThrow("kind 'multiplySkillDamage' is not connected to skill compilation");
    expect(() =>
      applyOperatorUpgradeSkillPatches(source, [
        {
          source: 'potential',
          level: 1,
          definition: {
            key: 'bad-blackboard-target',
            levels: 1,
            modifiers: [
              {
                kind: 'patchSkillBlackboard',
                skillGroupKey: 'missing',
                blackboardKey: 'atb',
                operation: 'add',
                value: 10,
              },
            ],
          },
        },
      ]),
    ).toThrow("references missing skill group 'missing'");
  });
});
