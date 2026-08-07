/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { electricBasicAttack, percentages, scheduled, sequence, step } from '../definitionHelpers';

// prettier-ignore
export const perlicaBasicAttack1: SkillDefinition = electricBasicAttack(
  'basicAttack1',
  16,
  8,
  percentages([25, 28, 31, 33, 36, 38, 41, 43, 46, 49, 53, 57]),
);

export const perlicaBasicAttack2: SkillDefinition = electricBasicAttack(
  'basicAttack2',
  18,
  [9, 12],
  percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
);

export const perlicaBasicAttack3: SkillDefinition = electricBasicAttack(
  'basicAttack3',
  26,
  [16, 19, 22],
  percentages([12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 26, 28]),
);

export const perlicaBasicAttack4: SkillDefinition = electricBasicAttack(
  'basicAttack4',
  44,
  27,
  percentages([57, 62, 68, 73, 79, 85, 90, 96, 102, 109, 117, 127]),
  { final: true, spRecovery: 15, stagger: 15 },
);

export const perlicaFinisher: SkillDefinition = {
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
};

export const perlicaPlungingAttack: SkillDefinition = {
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
};

export const perlicaBattleSkill: SkillDefinition = {
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
};

export const perlicaComboSkill: SkillDefinition = {
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
};

export const perlicaUltimate: SkillDefinition = {
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
};

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
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [perlicaBasicAttack1, perlicaBasicAttack2, perlicaBasicAttack3, perlicaBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: perlicaFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: perlicaPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: perlicaBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: perlicaComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: perlicaUltimate },
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
