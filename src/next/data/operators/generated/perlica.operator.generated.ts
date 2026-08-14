/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { electricBasicAttack, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const perlicaBasicAttack1: SkillDefinition = withSkillBlackboard(
  electricBasicAttack(
    'basicAttack1',
    16,
    8,
    percentages([25, 28, 31, 33, 36, 38, 41, 43, 46, 49, 53, 57]),
  ),
  {
    'atb': 0,
    'atk_scale': [0.25, 0.28, 0.31, 0.33, 0.36, 0.38, 0.41, 0.43, 0.46, 0.49, 0.53, 0.57],
  },
);

export const perlicaBasicAttack2: SkillDefinition = withSkillBlackboard(
  electricBasicAttack(
    'basicAttack2',
    18,
    [9, 12],
    percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
  ),
  {
    'atb': 0,
    'atk_scale': [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    'display_atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const perlicaBasicAttack3: SkillDefinition = withSkillBlackboard(
  electricBasicAttack(
    'basicAttack3',
    26,
    [16, 19, 22],
    percentages([12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 26, 28]),
  ),
  {
    'atb': 0,
    'atk_scale': [0.12, 0.14, 0.15, 0.16, 0.17, 0.19, 0.2, 0.21, 0.22, 0.24, 0.26, 0.28],
    'display_atk_scale': [0.37, 0.41, 0.45, 0.48, 0.52, 0.56, 0.59, 0.63, 0.67, 0.71, 0.77, 0.84],
  },
);

export const perlicaBasicAttack4: SkillDefinition = withSkillBlackboard(
  electricBasicAttack(
    'basicAttack4',
    44,
    27,
    percentages([57, 62, 68, 73, 79, 85, 90, 96, 102, 109, 117, 127]),
    { final: true, spRecovery: 15, stagger: 15 },
  ),
  {
    'atb': 15,
    'atk_scale': [0.57, 0.62, 0.68, 0.73, 0.79, 0.85, 0.9, 0.96, 1.02, 1.09, 1.17, 1.27],
    'poise': 15,
  },
);

export const perlicaFinisher: SkillDefinition = withSkillBlackboard(
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
          }, '8:finisher6:direct28:chr_0004_pelica_power_attack11:actionOrder1:2'),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const perlicaPlungingAttack: SkillDefinition = withSkillBlackboard(
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
          }, '14:plungingAttack6:direct35:chr_0004_pelica_plunging_attack_end11:actionOrder1:3'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const perlicaBattleSkill: SkillDefinition = withSkillBlackboard(
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
          }, '11:battleSkill6:direct28:chr_0004_pelica_normal_skill11:actionOrder2:12'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [1.78, 1.96, 2.13, 2.31, 2.49, 2.67, 2.85, 3.02, 3.2, 3.42, 3.69, 4],
    'poise': 10,
  },
);

export const perlicaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    timelineBlockFrames: 25,
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 570],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.833 },
            slot: 0,
            priority: -593023102,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
          }),
        ),
        22,
      ),
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
          }, '10:comboSkill10:projectile27:chr_0004_pelica_combo_skill35:chr_0004_pelica_combo_skill_projhit11:actionOrder1:72:11'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    'duration': 5,
    'poise': 10,
    'usp': 10,
  },
);

export const perlicaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    timelineBlockFrames: 63,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startUltimateTimeDilation', {
            priority: -1742631616,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        50,
      ),
      scheduled(
        58,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([445, 489, 534, 578, 622, 667, 711, 756, 800, 856, 923, 1000]),
            tags: ['ultimateSkill'],
            stagger: 20,
          }, '8:ultimate6:direct30:chr_0004_pelica_ultimate_skill11:actionOrder2:18'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4.45, 4.89, 5.34, 5.78, 6.22, 6.67, 7.11, 7.56, 8, 8.56, 9.23, 10],
    'poise': 20,
  },
);

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
  comboSkillRegistrations: [{ skillKey: 'comboSkill', priority: 'default', rules: [{ trigger: { kind: 'damageTagHit', tag: 'normalAttackLastCombo', scope: 'team' } }] }],
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
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'talentEffects' }] },
};
