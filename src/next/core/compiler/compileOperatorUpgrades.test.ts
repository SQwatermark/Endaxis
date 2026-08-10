import { describe, expect, it } from 'vitest';
import { perlica } from '../../data/operators/perlica';
import type { CompiledSkillProgram } from './combatProgram';
import type { OperatorInstanceDocument } from '../project/schema';
import {
  applyOperatorUpgradeSkillPatches,
  resolveActiveOperatorUpgrades,
} from './compileOperatorUpgrades';

function build(overrides: Partial<OperatorInstanceDocument> = {}): OperatorInstanceDocument {
  return {
    id: 'operator:1',
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
  });
});
