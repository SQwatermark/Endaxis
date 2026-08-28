/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const chenQianyuBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0005_chen_attack1',
    timelineBlockFrames: 14,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct21:chr_0005_chen_attack111:actionOrder1:5'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.5,
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
        11,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct21:chr_0005_chen_attack111:actionOrder2:12'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.5,
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
    'atk_scale': [0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.23],
    'display_atk_scale': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
  },
);

export const chenQianyuBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0005_chen_attack2',
    timelineBlockFrames: 10,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([24, 26, 29, 31, 34, 36, 38, 41, 43, 46, 50, 54]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct21:chr_0005_chen_attack211:actionOrder1:6'),
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
    'atk_scale': [0.24, 0.26, 0.29, 0.31, 0.34, 0.36, 0.38, 0.41, 0.43, 0.46, 0.5, 0.54],
  },
);

export const chenQianyuBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0005_chen_attack3',
    timelineBlockFrames: 18,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([13, 15, 16, 17, 19, 20, 21, 23, 24, 26, 28, 30]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct21:chr_0005_chen_attack311:actionOrder1:7'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.5,
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
        12,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([13, 15, 16, 17, 19, 20, 21, 23, 24, 26, 28, 30]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct21:chr_0005_chen_attack311:actionOrder2:13'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.5,
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
    'atk_scale': [0.13, 0.15, 0.16, 0.17, 0.19, 0.2, 0.21, 0.23, 0.24, 0.26, 0.28, 0.3],
    'display_atk_scale': [0.27, 0.29, 0.32, 0.35, 0.38, 0.4, 0.43, 0.46, 0.48, 0.52, 0.56, 0.6],
  },
);

export const chenQianyuBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0005_chen_attack4',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        4,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct21:chr_0005_chen_attack411:actionOrder1:7'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.5,
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
        10,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct21:chr_0005_chen_attack411:actionOrder2:13'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.5,
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
    'atk_scale': [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    'display_atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const chenQianyuBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0005_chen_attack5',
    timelineBlockFrames: 32,
    scheduledSequences: [
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([40, 44, 48, 52, 56, 60, 64, 68, 72, 77, 83, 90]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 16,
          }, '12:basicAttack56:direct21:chr_0005_chen_attack511:actionOrder2:22'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'hit' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                  step('modifyActionValue', {
                    key: 'hit',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'hit': 0,
    'atb': 18,
    'atk_scale': [0.4, 0.44, 0.48, 0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.77, 0.83, 0.9],
    'poise': 16,
  },
);

export const chenQianyuFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0005_chen_power_attack',
    timelineBlockFrames: 30,
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
        50,
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
        30,
      ),
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.2,
          }, '8:finisher6:direct26:chr_0005_chen_power_attack11:actionOrder2:22'),
        ),
      ),
      scheduled(
        29,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.8,
          }, '8:finisher6:direct26:chr_0005_chen_power_attack11:actionOrder1:2'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const chenQianyuPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0005_chen_plunging_attack_end',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct33:chr_0005_chen_plunging_attack_end11:actionOrder1:4'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const chenQianyuBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0005_chen_normal_skill',
    timelineBlockFrames: 25,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([169, 186, 203, 219, 236, 253, 270, 287, 304, 325, 350, 380]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill6:direct26:chr_0005_chen_normal_skill11:actionOrder2:49'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'airborne_coefficient': 0,
    'airborne_initial': [1, 1, 1, 1, 1, 1.5, 1.5, 1.5, 2, 2, 2, 2.5],
    'atk_scale': [1.69, 1.86, 2.03, 2.19, 2.36, 2.53, 2.7, 2.87, 3.04, 3.25, 3.5, 3.8],
    'poise': 10,
  },
);

export const chenQianyuComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0005_chen_combo_skill',
    timelineBlockFrames: 23,
    cooldownFrames: [480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 450],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
            slot: "unassigned",
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        16,
      ),
      scheduled(
        15,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-21-0',
                  event: { kind: 'airborneOutput' },
                  sequence: sequence(
                    step('adjustSkillCooldown', {
                      target: 'caster',
                      skill: { kind: 'type', skillType: 'comboSkill' },
                      operation: 'reduce',
                      basis: 'baseDurationRatio',
                      value: { kind: 'blackboard', key: 'cd_reduction' },
                    }),
                  ),
                },
            ],
          }),
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'type', skillType: 'comboSkill' },
            operation: 'reduce',
            basis: 'baseDurationRatio',
            value: { kind: 'blackboard', key: 'cd_reduction' },
          }),
        ),
        31,
      ),
      scheduled(
        17,
        sequence(
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
    'count': 0,
    'atk_scale': [1.2, 1.32, 1.44, 1.56, 1.68, 1.8, 1.92, 2.04, 2.16, 2.31, 2.49, 2.7],
    'usp': 10,
    'cd_reduction': 0,
  },
);

export const chenQianyuUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0005_chen_ultimate_skill',
    timelineBlockFrames: 112,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 70 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: "TimeDilation/Layer/Entity/HitStop",
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
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        49,
      ),
      scheduled(
        58,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([36, 40, 43, 47, 50, 54, 58, 61, 65, 69, 75, 81]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 15,
          }, '8:ultimate6:direct28:chr_0005_chen_ultimate_skill11:actionOrder2:43'),
        ),
      ),
      scheduled(
        63,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([36, 40, 43, 47, 50, 54, 58, 61, 65, 69, 75, 81]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 0,
          }, '8:ultimate6:direct28:chr_0005_chen_ultimate_skill11:actionOrder2:46'),
        ),
      ),
      scheduled(
        68,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([36, 40, 43, 47, 50, 54, 58, 61, 65, 69, 75, 81]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 0,
          }, '8:ultimate6:direct28:chr_0005_chen_ultimate_skill11:actionOrder2:49'),
        ),
      ),
      scheduled(
        72,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([36, 40, 43, 47, 50, 54, 58, 61, 65, 69, 75, 81]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 0,
          }, '8:ultimate6:direct28:chr_0005_chen_ultimate_skill11:actionOrder2:52'),
        ),
      ),
      scheduled(
        76,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([36, 40, 43, 47, 50, 54, 58, 61, 65, 69, 75, 81]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 0,
          }, '8:ultimate6:direct28:chr_0005_chen_ultimate_skill11:actionOrder2:55'),
        ),
      ),
      scheduled(
        80,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([36, 40, 43, 47, 50, 54, 58, 61, 65, 69, 75, 81]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 0,
          }, '8:ultimate6:direct28:chr_0005_chen_ultimate_skill11:actionOrder2:58'),
        ),
      ),
      scheduled(
        103,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential5' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'atk_scale2',
                operation: 'add',
                value: { kind: 'blackboard', key: 'phy_up' },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale2' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 20,
          }, '8:ultimate6:direct28:chr_0005_chen_ultimate_skill11:actionOrder2:64'),
        ),
      ),
    ],
  },
  {
    'atk_scale2': [4.55, 5, 5.45, 5.91, 6.36, 6.82, 7.27, 7.73, 8.18, 8.75, 9.43, 10.23],
    'phy_up': 0,
    'potential5': 0,
    'atk_scale1': [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
    'poise_final': 20,
    'poise_start': 15,
  },
);

export const chenQianyuGeneratedOperator: OperatorDefinition = {
  slug: 'chen-qianyu',
  gameId: 'CHEN QIANYU',
  rarity: 5,
  weaponType: 'sword',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'agility',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [10, 31, 52, 74, 95, 106],
    agility: [20, 52, 86, 120, 154, 171],
    intellect: [8, 25, 42, 59, 77, 85],
    will: [9, 27, 46, 65, 84, 93],
    baseAttack: [30, 87, 147, 207, 267, 297],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [chenQianyuBasicAttack1, chenQianyuBasicAttack2, chenQianyuBasicAttack3, chenQianyuBasicAttack4, chenQianyuBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: chenQianyuFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: chenQianyuPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: chenQianyuBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: chenQianyuComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: chenQianyuUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0005_chen_talent_0_1': {
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
        'atk': 0,
        'duration': 0,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'atk' },
        },
      ],
    },
    'buff_chr_0005_chen_talent_0': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'atk': 0,
        'duration': 0,
      },
      abilityEventResponses: [
        {
          event: 'outputDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventDamageTagsMatch',
                  match: 'hasAll',
                  tags: ['normalSkill'],
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0005_chen_talent_0_1',
                    target: 'buffOwner',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'atk': { kind: 'blackboard', key: 'atk' },
                      'duration': { kind: 'blackboard', key: 'duration' },
                    },
                  }),
                ),
              ),
            ),
        },
        {
          event: 'outputDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventDamageTagsMatch',
                  match: 'hasAll',
                  tags: ['ultimateSkill'],
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0005_chen_talent_0_1',
                    target: 'buffOwner',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'atk': { kind: 'blackboard', key: 'atk' },
                      'duration': { kind: 'blackboard', key: 'duration' },
                    },
                  }),
                ),
              ),
            ),
        },
        {
          event: 'outputDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventDamageTagsMatch',
                  match: 'hasAll',
                  tags: ['comboSkill'],
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0005_chen_talent_0_1',
                    target: 'buffOwner',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'atk': { kind: 'blackboard', key: 'atk' },
                      'duration': { kind: 'blackboard', key: 'duration' },
                    },
                  }),
                ),
              ),
            ),
        },
      ],
    },
    'buff_chr_0005_chen_talent_1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'poise': 0,
      },
      abilityEventResponses: [
        {
          event: 'afterOutputWeaknessTriggered',
          priority: 0,
          sequence:
            sequence(
              step('dealStagger', {
                value: { kind: 'blackboard', key: 'poise' },
              }),
            ),
        },
      ],
    },
    'buff_chr_0005_chen_potential_1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'extra_dmg': 0,
        'hp_remain': 0.5,
      },
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'targetHealthCompare',
            target: 'enemy',
            valueType: 'ratio',
            operator: 'less',
            value: { blackboardKey: 'hp_remain' },
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'attacker',
              zone: 'normal',
              addition: { blackboardKey: 'extra_dmg' },
            },
          ],
        },
      ],
    },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [],
      passiveSkills: [
        {
          key: 'buff_chr_0005_chen_talent_0',
          blackboard: {
            'atk': [0.04, 0.08],
            'duration': [10, 10],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0005_chen_talent_0',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'atk': { kind: 'blackboard', key: 'atk' },
                'duration': { kind: 'blackboard', key: 'duration' },
              },
            }),
          ),
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [],
      passiveSkills: [
        {
          key: 'buff_chr_0005_chen_talent_1',
          blackboard: {
            'poise': [5, 10],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0005_chen_talent_1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'poise': { kind: 'blackboard', key: 'poise' },
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
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0005_chen_potential_1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'extra_dmg': { kind: 'constant', value: 0.2 },
            'hp_remain': { kind: 'constant', value: 0.5 },
          },
        }),
      ),
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['agility'],
          value: 15,
        },
        { kind: 'addStaticDamageIncrease', target: 'physical', value: 0.08 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale1',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale2',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.1,
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
          multiplier: 0.85,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -90,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential5',
          operation: 'assign',
          value: 1,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
