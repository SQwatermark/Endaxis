/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { electricBasicAttack, percentages, scheduled, sequence, step } from '../definitionHelpers';

// prettier-ignore
export const perlicaGeneratedSkills = [
  electricBasicAttack(
    'basicAttack1',
    16,
    8,
    percentages([25, 28, 31, 33, 36, 38, 41, 43, 46, 49, 53, 57]),
  ),
  electricBasicAttack(
    'basicAttack2',
    18,
    [9, 12],
    percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
  ),
  electricBasicAttack(
    'basicAttack3',
    26,
    [16, 19, 22],
    percentages([12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 26, 28]),
  ),
  electricBasicAttack(
    'basicAttack4',
    44,
    27,
    percentages([57, 62, 68, 73, 79, 85, 90, 96, 102, 109, 117, 127]),
    { final: true, spRecovery: 15, stagger: 15 },
  ),
  {
    key: 'finisher',
    timelineBlockFrames: 35,
    availability: { kind: 'targetStaggered', target: 'enemy' },
    scheduledSequences: [
      scheduled(
        35,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['normalAttack', 'powerAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
          }),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
      ),
    ],
  },
  {
    key: 'plungingAttack',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }),
        ),
      ),
    ],
  },
  {
    key: 'battleSkill',
    timelineBlockFrames: 28,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('applyElementalInfliction', { element: 'electric', isExtra: false }),
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([178, 196, 213, 231, 249, 267, 285, 302, 320, 342, 369, 400]),
            tags: ['normalSkill'],
            stagger: 10,
          }),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    key: 'comboSkill',
    timelineBlockFrames: 25,
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 570],
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
          step('applyElementalReaction', {
            reaction: 'electrification',
            target: 'enemy',
            durationSeconds: 5,
            effectiveness: 1,
          }, 'comboSkill.electrification'),
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['comboSkill'],
            stagger: 10,
          }),
          step('changeResource', { resource: 'ultimateEnergy', amount: 10, recipient: 'caster' }),
        ),
      ),
    ],
  },
  {
    key: 'ultimate',
    timelineBlockFrames: 63,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        58,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([445, 489, 534, 578, 622, 667, 711, 756, 800, 856, 923, 1000]),
            tags: ['ultimateSkill'],
            stagger: 20,
          }),
        ),
      ),
    ],
  },
] as const satisfies readonly SkillDefinition[];

export const perlicaGeneratedOperator: OperatorDefinition = {
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
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [perlicaGeneratedSkills[0]!, perlicaGeneratedSkills[1]!, perlicaGeneratedSkills[2]!, perlicaGeneratedSkills[3]!] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: perlicaGeneratedSkills[4]! },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: perlicaGeneratedSkills[5]! },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: perlicaGeneratedSkills[6]! },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: perlicaGeneratedSkills[7]! },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: perlicaGeneratedSkills[8]! },
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
              modifiers: [
                { kind: 'attackPercent', value: 0.2 },
              ],
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
