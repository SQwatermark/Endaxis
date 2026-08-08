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
          }),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.08, 0.09, 0.1, 0.1, 0.11, 0.12, 0.13, 0.14, 0.14, 0.15, 0.17, 0.18],
    'display_atk_scale': [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
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
          }),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
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
          }),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
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
