/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const zhuangFangyiBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile25:chr_0030_zhuangfy_attack133:chr_0030_zhuangfy_attack1_projhit11:actionOrder1:31:0'),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile25:chr_0030_zhuangfy_attack133:chr_0030_zhuangfy_attack1_projhit11:actionOrder1:41:0'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.08, 0.09, 0.1, 0.1, 0.11, 0.12, 0.13, 0.14, 0.14, 0.15, 0.17, 0.18],
    'display_atk_scale': [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
  },
);

export const zhuangFangyiBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'sword_dist' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 10 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'sword_dist',
                operation: 'add',
                value: { kind: 'constant', value: 3 },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'sword_dist',
                operation: 'assign',
                value: { kind: 'constant', value: 14 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile25:chr_0030_zhuangfy_attack239:chr_0030_zhuangfy_attack2_sword_projhit11:actionOrder2:101:0'),
        ),
      ),
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile25:chr_0030_zhuangfy_attack239:chr_0030_zhuangfy_attack2_sword_projhit11:actionOrder2:111:0'),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack213:abilityEntity25:chr_0030_zhuangfy_attack238:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder2:131:01:2'),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack221:abilityEntityInterval25:chr_0030_zhuangfy_attack238:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder2:131:01:81:02:14'),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack221:abilityEntityInterval25:chr_0030_zhuangfy_attack238:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder2:131:01:81:12:14'),
        ),
      ),
      scheduled(
        30,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack221:abilityEntityInterval25:chr_0030_zhuangfy_attack238:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder2:131:01:81:22:14'),
        ),
      ),
    ],
  },
  {
    'sword_dist': 0,
    'atk_scale': [0.04, 0.04, 0.04, 0.05, 0.05, 0.05, 0.06, 0.06, 0.06, 0.07, 0.07, 0.08],
    'atk_scale_sword': [0.05, 0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.11],
    'display_atk_scale': [0.24, 0.26, 0.29, 0.31, 0.34, 0.36, 0.38, 0.41, 0.43, 0.46, 0.5, 0.54],
  },
);

export const zhuangFangyiBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    timelineBlockFrames: 26,
    scheduledSequences: [
      scheduled(
        14,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'sword_dist' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 10 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'sword_dist',
                operation: 'add',
                value: { kind: 'constant', value: 3 },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'sword_dist',
                operation: 'assign',
                value: { kind: 'constant', value: 14 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0030_zhuangfy_attack339:chr_0030_zhuangfy_attack3_sword_projhit11:actionOrder2:101:0'),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0030_zhuangfy_attack339:chr_0030_zhuangfy_attack3_sword_projhit11:actionOrder2:111:0'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0030_zhuangfy_attack339:chr_0030_zhuangfy_attack3_sword_projhit11:actionOrder2:121:0'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0030_zhuangfy_attack339:chr_0030_zhuangfy_attack3_sword_projhit11:actionOrder2:131:0'),
        ),
      ),
    ],
  },
  {
    'sword_dist': 0,
    'atk_scale_sword': [0.08, 0.09, 0.1, 0.1, 0.11, 0.12, 0.13, 0.14, 0.14, 0.15, 0.17, 0.18],
    'display_atk_scale': [0.32, 0.35, 0.39, 0.42, 0.45, 0.48, 0.52, 0.55, 0.58, 0.62, 0.67, 0.72],
  },
);

export const zhuangFangyiBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    timelineBlockFrames: 17,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([11, 12, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25]),
            tags: ['normalAttack'],
          }, '12:basicAttack413:abilityEntity25:chr_0030_zhuangfy_attack438:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder1:61:01:2'),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([11, 12, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25]),
            tags: ['normalAttack'],
          }, '12:basicAttack421:abilityEntityInterval25:chr_0030_zhuangfy_attack438:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder1:61:01:81:02:14'),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([11, 12, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25]),
            tags: ['normalAttack'],
          }, '12:basicAttack421:abilityEntityInterval25:chr_0030_zhuangfy_attack438:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder1:61:01:81:12:14'),
        ),
      ),
      scheduled(
        26,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([11, 12, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25]),
            tags: ['normalAttack'],
          }, '12:basicAttack421:abilityEntityInterval25:chr_0030_zhuangfy_attack438:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder1:61:01:81:22:14'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.11, 0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.22, 0.23, 0.25],
    'display_atk_scale': [0.45, 0.5, 0.54, 0.59, 0.63, 0.68, 0.72, 0.77, 0.81, 0.87, 0.93, 1.01],
  },
);

export const zhuangFangyiBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    timelineBlockFrames: 50,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([48, 53, 58, 62, 67, 72, 77, 82, 86, 92, 100, 108]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 18,
          }, '12:basicAttack513:abilityEntity25:chr_0030_zhuangfy_attack538:chr_0030_zhuangfy_attack5_abilityrange11:actionOrder1:61:02:11'),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          }),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('modifyActionValue', {
            key: 'hasGainAtb',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('modifyActionValue', {
            key: 'hasGainAtb',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        28,
        sequence(
          step('modifyActionValue', {
            key: 'hasGainAtb',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
    ],
  },
  {
    'atb': 18,
    'atk_scale': [0.48, 0.53, 0.58, 0.62, 0.67, 0.72, 0.77, 0.82, 0.86, 0.92, 1, 1.08],
    'poise': 18,
  },
);

export const zhuangFangyiEnhancedBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'enhancedBasicAttack1',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('holdBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          }),
        ),
        22,
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([67, 73, 80, 86, 93, 100, 106, 113, 120, 128, 138, 150]),
            tags: ['normalAttack'],
          }, '20:enhancedBasicAttack113:abilityEntity29:chr_0030_zhuangfy_attack1_ult44:chr_0030_zhuangfy_attack1_ult_1_abilityrange11:actionOrder2:111:01:4'),
        ),
      ),
    ],
  },
  {
    'target_in_range': 0,
    'atk_scale': [0.67, 0.73, 0.8, 0.86, 0.93, 1, 1.06, 1.13, 1.2, 1.28, 1.38, 1.5],
  },
);

export const zhuangFangyiEnhancedBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'enhancedBasicAttack2',
    timelineBlockFrames: 27,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('holdBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          }),
        ),
        17,
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([94, 103, 112, 122, 131, 140, 150, 159, 168, 180, 194, 210]),
            tags: ['normalAttack'],
          }, '20:enhancedBasicAttack213:abilityEntity29:chr_0030_zhuangfy_attack2_ult44:chr_0030_zhuangfy_attack1_ult_1_abilityrange11:actionOrder2:101:01:4'),
        ),
      ),
    ],
  },
  {
    'target_in_range': 0,
    'atk_scale': [0.94, 1.03, 1.12, 1.22, 1.31, 1.4, 1.5, 1.59, 1.68, 1.8, 1.94, 2.1],
  },
);

export const zhuangFangyiEnhancedBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'enhancedBasicAttack3',
    timelineBlockFrames: 60,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('holdBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          }),
        ),
        35,
      ),
      scheduled(
        33,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([134, 147, 160, 174, 187, 200, 214, 227, 240, 257, 277, 300]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 18,
          }, '20:enhancedBasicAttack313:abilityEntity29:chr_0030_zhuangfy_attack3_ult42:chr_0030_zhuangfy_attack3_ult_abilityrange11:actionOrder2:111:01:2'),
        ),
      ),
      scheduled(
        33,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          }),
        ),
      ),
    ],
  },
  {
    'atb': 20,
    'atk_scale': [1.34, 1.47, 1.6, 1.74, 1.87, 2, 2.14, 2.27, 2.4, 2.57, 2.77, 3],
    'poise': 18,
  },
);

export const zhuangFangyiFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    timelineBlockFrames: 41,
    availability: { kind: 'targetStaggered', target: 'enemy' },
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['normalAttack', 'powerAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct30:chr_0030_zhuangfy_power_attack11:actionOrder2:10'),
        ),
      ),
      scheduled(
        40,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['normalAttack', 'powerAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.9,
          }, '8:finisher6:direct30:chr_0030_zhuangfy_power_attack11:actionOrder2:13'),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const zhuangFangyiPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct37:chr_0030_zhuangfy_plunging_attack_end11:actionOrder2:16'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const zhuangFangyiComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    timelineBlockFrames: 25,
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    scheduledSequences: [
      scheduled(
        24,
        sequence(
          branch(
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTagIds: [2123008650],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'inflictCnt',
                query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [2123008650] },
              }),
              step('modifyActionValue', {
                key: 'conductCnt',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'inflictCnt' },
              }),
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTagIds: [1466867135],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'conductCnt',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'conductCnt' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 4 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'conductCnt',
                    operation: 'assign',
                    value: { kind: 'constant', value: 4 },
                  }),
                ),
              ),
              step('applyBuff', {
                buffId: 'buff_common_pulse_pulse_conduct_triggered',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'count': { kind: 'blackboard', key: 'conductCnt' },
                },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([160, 176, 192, 208, 224, 240, 256, 272, 288, 308, 332, 360]),
            tags: ['comboSkill'],
            stagger: 10,
          }, '10:comboSkill6:direct29:chr_0030_zhuangfy_combo_skill11:actionOrder2:49'),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('finishBuffsByTag', {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTagIds: [2123008650],
            reason: 'early',
          }),
        ),
      ),
      scheduled(
        24,
        sequence(
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                recipient: 'caster',
              }),
              step('calculateActionValue', {
                key: 'usp_extra',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'usp_extra' },
                right: { kind: 'blackboard', key: 'inflictCnt' },
              }),
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_extra' },
                recipient: 'caster',
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'conductCnt': 0,
    'inflictCnt': 0,
    'atk_scale': [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    'poise': 10,
    'usp': 10,
    'usp_extra': 10,
  },
);

export const zhuangFangyiEnhancedComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'enhancedComboSkill',
    timelineBlockFrames: 25,
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('holdBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          }),
        ),
        28,
      ),
      scheduled(
        24,
        sequence(
          branch(
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTagIds: [2123008650],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'inflictCnt',
                query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [2123008650] },
              }),
              step('modifyActionValue', {
                key: 'conductCnt',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'inflictCnt' },
              }),
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTagIds: [1466867135],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'conductCnt',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'conductCnt' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 4 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'conductCnt',
                    operation: 'assign',
                    value: { kind: 'constant', value: 4 },
                  }),
                ),
              ),
              step('applyBuff', {
                buffId: 'buff_common_pulse_pulse_conduct_triggered',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'count': { kind: 'blackboard', key: 'conductCnt' },
                },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([240, 264, 288, 312, 336, 360, 384, 408, 432, 462, 498, 540]),
            tags: ['comboSkill'],
            stagger: 10,
          }, '18:enhancedComboSkill6:direct33:chr_0030_zhuangfy_combo_skill_ult11:actionOrder2:51'),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('finishBuffsByTag', {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTagIds: [2123008650],
            reason: 'early',
          }),
        ),
      ),
    ],
  },
  {
    'conductCnt': 0,
    'inflictCnt': 0,
    'atk_scale': [2.4, 2.64, 2.88, 3.12, 3.36, 3.6, 3.84, 4.08, 4.32, 4.62, 4.98, 5.4],
    'poise': 10,
  },
);

export const zhuangFangyiUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    timelineBlockFrames: 91,
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 240 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        78,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0030_zhuangfy_ult_base',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration' },
              'combo_cd_rate': { kind: 'blackboard', key: 'combo_cd_rate' },
            },
          }),
        ),
      ),
    ],
  },
  {
    'combo_cd_rate': 4,
    'duration': 25,
    'duration_extra': 1,
  },
);
