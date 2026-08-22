/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const akekuriBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0019_karin_attack1',
    timelineBlockFrames: 14,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct22:chr_0019_karin_attack111:actionOrder1:4'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
  },
);

export const akekuriBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0019_karin_attack2',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([13, 14, 15, 16, 18, 19, 20, 21, 23, 24, 26, 28]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0019_karin_attack211:actionOrder1:5'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0019_karin_attack211:actionOrder2:12'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.13, 0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.21, 0.23, 0.24, 0.26, 0.28],
    'atk_scale_2': [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    'display_atk_scale': [0.28, 0.3, 0.33, 0.36, 0.39, 0.41, 0.44, 0.47, 0.5, 0.53, 0.57, 0.62],
  },
);

export const akekuriBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0019_karin_attack3',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([33, 36, 39, 42, 46, 49, 52, 55, 59, 63, 67, 73]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct22:chr_0019_karin_attack311:actionOrder1:4'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.33, 0.36, 0.39, 0.42, 0.46, 0.49, 0.52, 0.55, 0.59, 0.63, 0.67, 0.73],
  },
);

export const akekuriBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0019_karin_attack4',
    timelineBlockFrames: 35,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([17, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 37]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0019_karin_attack411:actionOrder2:14'),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([17, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 37]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0019_karin_attack411:actionOrder2:18'),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([17, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 37]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 17,
          }, '12:basicAttack46:direct22:chr_0019_karin_attack411:actionOrder2:24'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 19,
    'atk_scale': [0.17, 0.18, 0.2, 0.21, 0.23, 0.25, 0.26, 0.28, 0.3, 0.32, 0.34, 0.37],
    'display_atk_scale': [0.5, 0.54, 0.59, 0.64, 0.69, 0.74, 0.79, 0.84, 0.89, 0.95, 1.03, 1.11],
    'poise': 17,
  },
);

export const akekuriFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0019_karin_power_attack',
    timelineBlockFrames: 37,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_medium',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        60,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_power_attack_disable_cast_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        36,
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.2,
          }, '8:finisher6:direct27:chr_0019_karin_power_attack11:actionOrder2:19'),
        ),
      ),
      scheduled(
        36,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.8,
          }, '8:finisher6:direct27:chr_0019_karin_power_attack11:actionOrder2:27'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const akekuriPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0019_karin_plunging_attack_end',
    timelineBlockFrames: 14,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct34:chr_0019_karin_plunging_attack_end11:actionOrder1:4'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const akekuriBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0019_karin_normal_skill',
    timelineBlockFrames: 41,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          step('applyElementalInfliction', { element: 'heat', isExtra: false }),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([142, 156, 171, 185, 199, 213, 228, 242, 256, 274, 295, 320]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill6:direct27:chr_0019_karin_normal_skill11:actionOrder2:65'),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [1.42, 1.56, 1.71, 1.85, 1.99, 2.13, 2.28, 2.42, 2.56, 2.74, 2.95, 3.2],
    'poise': 10,
  },
);

export const akekuriComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0019_karin_combo_skill',
    timelineBlockFrames: 38,
    cooldownFrames: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 270],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.6 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        15,
      ),
      scheduled(
        22,
        sequence(
          step('modifyActionValue', {
            key: 'sub_ratio',
            operation: 'divide',
            value: { kind: 'blackboard', key: 'rate' },
          }),
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'level' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'blackboard', key: 'sub_ratio' },
            base: { kind: 'constant', value: 1 },
            targetKey: 'atb_up',
          }),
          step('modifyActionValue', {
            key: 'max_ratio',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'atb_up' },
              operator: 'less',
              right: { kind: 'blackboard', key: 'max_ratio' },
            },
            sequence(
              step('modifyActionValue', {
                key: 'atb',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'atb_up' },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'atb',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'max_ratio' },
              }),
            ),
            { alwaysNext: true },
          ),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '10:comboSkill6:direct26:chr_0019_karin_combo_skill11:actionOrder2:27'),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                recipient: 'caster',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        31,
        sequence(
          step('modifyActionValue', {
            key: 'count',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '10:comboSkill6:direct26:chr_0019_karin_combo_skill11:actionOrder2:40'),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                recipient: 'caster',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 7.5,
    'atb_up': 1,
    'count': 0,
    'max_ratio': 0,
    'rate': 10,
    'sub_ratio': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    'poise': 5,
    'usp': 5,
  },
);

export const akekuriUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0019_karin_ultimate_skill',
    timelineBlockFrames: 129,
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 120 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0019_karin_potential_3',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'atk': { kind: 'blackboard', key: 'atk' },
            },
          }),
        ),
        150,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: 1464849466,
            priority: 10,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        3,
      ),
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'max_ratio',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'atb_up' },
              operator: 'less',
              right: { kind: 'blackboard', key: 'max_ratio' },
            },
            sequence(
              step('modifyActionValue', {
                key: 'atb_1',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'atb_up' },
              }),
              step('modifyActionValue', {
                key: 'atb_2',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'atb_up' },
              }),
              step('modifyActionValue', {
                key: 'atb_3',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'atb_up' },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'atb_1',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'max_ratio' },
              }),
              step('modifyActionValue', {
                key: 'atb_2',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'max_ratio' },
              }),
              step('modifyActionValue', {
                key: 'atb_3',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'max_ratio' },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        55,
      ),
      scheduled(
        59,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_1' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
        ),
      ),
      scheduled(
        86,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_2' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
        ),
      ),
      scheduled(
        119,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_3' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
        ),
      ),
    ],
  },
  {
    'atb_1': [19, 19, 20, 21, 21, 22, 23, 23, 24, 25, 25, 26],
    'atb_2': [19, 20, 21, 21, 22, 23, 23, 24, 25, 25, 26, 27],
    'atb_3': [20, 21, 21, 22, 23, 23, 24, 25, 25, 26, 27, 27],
    'atb_up': 1,
    'max_ratio': 0,
    'atk': 0,
    'potential_5_duration': 0,
    'imbue_scale': 0,
    'duration': 10,
    'atb_display': [58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80],
  },
);

export const akekuriGeneratedOperator: OperatorDefinition = {
  slug: 'akekuri',
  gameId: 'AKEKURI',
  rarity: 4,
  weaponType: 'sword',
  element: 'heat',
  role: 'vanguard',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [13, 34, 55, 77, 99, 110],
    agility: [15, 42, 70, 98, 126, 140],
    intellect: [12, 32, 53, 75, 96, 106],
    will: [9, 30, 52, 74, 96, 108],
    baseAttack: [30, 92, 157, 222, 287, 319],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [akekuriBasicAttack1, akekuriBasicAttack2, akekuriBasicAttack3, akekuriBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: akekuriFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: akekuriPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: akekuriBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: akekuriUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: akekuriComboSkill },
  ],
  buffDefinitions: {
    'buff_chr_0019_karin_potential_3': {
      stackingType: 'unlimited',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'CommonCharBuff',
        },
      },
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'atk': 0.1,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'atk' },
        },
      ],
    },
    'buff_chr_0019_karin_talent_2': {
      stackingType: 'unique',
      blackboard: { 'duration': 10, 'imbue_scale': 0.2 },
      abilityEventResponses: [
        {
          event: 'beforeCastSkill',
          priority: 0,
          samePriorityKey: 'akekuri-combo-before-cast',
          sequence: sequence(
            branch(
              { kind: 'eventSkillTypeIn', skillTypes: ['ultimate'] },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_common_affixes_combo_trigger',
                  target: 'party',
                  blackboardAssignments: {
                    'duration': { kind: 'blackboard', key: 'duration' },
                    'imbue_scale': { kind: 'blackboard', key: 'imbue_scale' },
                  },
                }),
              ),
            ),
          ),
        },
      ],
    },
    'buff_chr_0019_karin_potential_1_1': {
      stackingType: 'enhanceAndRefresh',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'CommonCharBuff',
        },
      },
      priority: 0,
      maxStackCount: 5,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_up': 0,
        'duration': 5,
        'max_stack': 1,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'atk_up' },
        },
      ],
    },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'sub_ratio',
          operation: 'assign',
          value: [0.01, 0.015],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'max_ratio',
          operation: 'assign',
          value: [0.5, 0.75],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'rate',
          operation: 'assign',
          value: [10, 10],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'combo',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'imbue_scale',
          operation: 'assign',
          value: 0.2,
        },
      ],
      passiveSkills: [
        {
          key: 'akekuriComboImbue',
          blackboard: { 'duration': 10, 'imbue_scale': 0.2 },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0019_karin_talent_2',
              target: 'caster',
              blackboardAssignments: {
                'duration': { kind: 'blackboard', key: 'duration' },
                'imbue_scale': { kind: 'blackboard', key: 'imbue_scale' },
              },
            }),
          ),
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      eventHandlers: [
        {
          event: { kind: 'spGained', source: 'skill', gainKind: 'gain' },
          sequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0019_karin_potential_1_1',
              target: 'caster',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                'atk_up': { kind: 'constant', value: 0.1 },
                'duration': { kind: 'constant', value: 10 },
              },
            }),
          ),
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['agility', 'intellect'],
          value: 10,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk',
          operation: 'assign',
          value: 0.1,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillGroupKey: 'ultimate',
          resource: 'ultimateEnergy',
          multiplier: 0.9,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'akekuriComboImbue',
          blackboardKey: 'duration',
          operation: 'add',
          value: 5,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
