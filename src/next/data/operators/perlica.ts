import type { OperatorDefinition, SkillDefinition } from '../../core/game-data/operatorDefinition';
import {
  basicAttackOfType,
  damageOfType,
  percentages,
  scheduled,
  secondsToFrames,
  sequence,
  step,
} from './definitionHelpers';

const electricDamage = damageOfType('electric');
const electricBasicAttack = basicAttackOfType('electric');

const basicAttacks = [
  electricBasicAttack(
    'basicAttack1',
    16,
    8,
    percentages([25, 28, 31, 33, 36, 38, 41, 43, 46, 49, 53, 57]),
  ),
  electricBasicAttack(
    'basicAttack2',
    19,
    [9, 12],
    percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
  ),
  electricBasicAttack(
    'basicAttack3',
    27,
    [16, 19, 22],
    percentages([12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 26, 28]),
  ),
  electricBasicAttack(
    'basicAttack4',
    44,
    27,
    percentages([57, 62, 68, 73, 79, 85, 90, 96, 102, 109, 117, 127]),
    { final: true, stagger: 15, spRecovery: 15 },
  ),
] satisfies readonly SkillDefinition[];

const finisher = {
  key: 'finisher',
  durationFrames: 59,
  availability: { kind: 'targetStaggered', target: 'enemy' },
  scheduledSequences: [
    scheduled(
      35,
      sequence(
        step(
          'dealDamage',
          electricDamage(
            percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            ['normalAttack', 'powerAttack'],
            { calculation: 'breakingAttack' },
          ),
        ),
        step('gainFinisherSp', { factor: 1, recipient: 'team' }),
      ),
      44,
    ),
  ],
} satisfies SkillDefinition;

const plungingAttack = {
  key: 'plungingAttack',
  // This definition starts at landing; airborne duration belongs to movement state.
  durationFrames: 20,
  scheduledSequences: [
    scheduled(
      3,
      sequence(
        step(
          'dealDamage',
          electricDamage(percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]), [
            'normalAttack',
            'plungingAttack',
          ]),
        ),
      ),
      8,
    ),
  ],
} satisfies SkillDefinition;

const battleSkill = {
  key: 'battleSkill',
  durationFrames: 28,
  costs: [{ resource: 'sp', value: 100 }],
  costFrame: 0,
  scheduledSequences: [
    scheduled(
      13,
      sequence(
        step('applyElementalInfliction', { element: 'electric' }),
        step(
          'dealDamage',
          electricDamage(
            percentages([178, 196, 213, 231, 249, 267, 285, 302, 320, 342, 369, 400]),
            ['normalSkill'],
            { stagger: 10 },
          ),
        ),
        step('gainUltimateEnergyFromSkillCost', { recipient: 'caster' }),
      ),
    ),
  ],
} satisfies SkillDefinition;

const comboSkill = {
  key: 'comboSkill',
  durationFrames: 25,
  cooldownFrames: secondsToFrames([20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 19]),
  activationWindow: {
    durationFrames: 150,
    rules: {
      trigger: {
        kind: 'damageTagHit',
        tag: 'normalAttackLastCombo',
        scope: 'team',
      },
    },
  },
  scheduledSequences: [
    scheduled(
      24,
      sequence(
        step(
          'applyElementalReaction',
          {
            reaction: 'electrification',
            target: 'enemy',
            durationSeconds: 5,
            effectiveness: 1,
          },
          'comboSkill.electrification',
        ),
        step(
          'dealDamage',
          electricDamage(
            percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            ['comboSkill'],
            { stagger: 10 },
          ),
        ),
        step('changeResource', {
          resource: 'ultimateEnergy',
          amount: 10,
          recipient: 'caster',
        }),
      ),
    ),
  ],
} satisfies SkillDefinition;

const ultimate = {
  key: 'ultimate',
  durationFrames: 63,
  cooldownFrames: 300,
  costs: [{ resource: 'ultimateEnergy', value: 80 }],
  costFrame: 0,
  scheduledSequences: [
    scheduled(
      58,
      sequence(
        step(
          'dealDamage',
          electricDamage(
            percentages([445, 489, 534, 578, 622, 667, 711, 756, 800, 856, 923, 1000]),
            ['ultimateSkill'],
            { stagger: 20 },
          ),
        ),
      ),
    ),
  ],
} satisfies SkillDefinition;

export const perlica: OperatorDefinition = {
  slug: 'perlica',
  gameId: 'PERLICA',
  rarity: 5,
  weaponType: 'arts-unit',
  element: 'electric',
  role: 'caster',
  mainAttribute: 'intellect',
  secondaryAttribute: 'will',
  attributes: {
    strength: [9, 26, 45, 64, 82, 91],
    agility: [9, 27, 46, 65, 84, 93],
    intellect: [21, 51, 83, 114, 145, 161],
    will: [13, 34, 57, 79, 102, 113],
    baseAttack: [30, 88, 150, 211, 272, 303],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: basicAttacks,
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: finisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: plungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: battleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: comboSkill,
    },
    {
      key: 'ultimate',
      skillType: 'ultimate',
      levelSource: 'ultimate',
      skills: ultimate,
    },
  ],
  talents: [
    {
      key: 'staggerDamageBonus',
      levels: 2,
      modifiers: [
        {
          kind: 'addConditionalDamage',
          condition: { kind: 'targetStaggered', target: 'enemy' },
          values: [0.2, 0.3],
        },
      ],
    },
    {
      key: 'comboRicochetAgainstBrokenEnemy',
      levels: 1,
      // Preserve talent order; multi-target ricochet is outside the current combat model.
      modifiers: [],
    },
  ],
  potentials: [
    {
      key: 'extendedElectrification',
      levels: 1,
      modifiers: [
        {
          kind: 'multiplyEffectDuration',
          skillGroupKey: 'comboSkill',
          stepKey: 'comboSkill.electrification',
          multiplier: 1.75,
        },
      ],
    },
    {
      key: 'reducedUltimateCost',
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillGroupKey: 'ultimate',
          resource: 'ultimateEnergy',
          multiplier: 0.85,
        },
      ],
    },
    {
      key: 'attackAfterElectrification',
      levels: 1,
      eventHandlers: [
        {
          event: { kind: 'reactionApplied', reaction: 'electrification' },
          sequence: sequence(
            step('applyStatus', {
              statusKey: 'attackAfterElectrification',
              target: 'caster',
              durationFrames: 150,
              maxStacks: 2,
              modifiers: [{ kind: 'attackPercent', value: 0.2 }],
            }),
          ),
        },
      ],
    },
    {
      key: 'strongerElectrification',
      levels: 1,
      modifiers: [
        {
          kind: 'setEffectiveness',
          skillGroupKey: 'comboSkill',
          stepKey: 'comboSkill.electrification',
          value: 1.33,
        },
      ],
    },
    {
      key: 'ultimateCriticalRate',
      levels: 1,
      modifiers: [
        {
          kind: 'addSkillStat',
          skillGroupKey: 'ultimate',
          stat: 'criticalRate',
          value: 0.3,
        },
      ],
    },
  ],
};
