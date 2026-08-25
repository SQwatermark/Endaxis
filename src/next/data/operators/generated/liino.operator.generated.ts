/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, once, percentages, repeatEachTick, scheduled, sequence, step, withActionBlackboardScope, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const liinoComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0035_liino_combo_skill',
    timelineBlockFrames: 68,
    cooldownFrames: [300, 300, 300, 300, 300, 300, 300, 300, 270, 270, 270, 240],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0035_liino_normalskill_music_animation_hitl', 'buff_chr_0035_liino_normalskill_music_animation_hitr'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.15 },
            slot: 1464849466,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            targets: [],
            abilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        7,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.933 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        25,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([60, 66, 72, 78, 84, 90, 96, 102, 108, 116, 125, 135]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '10:comboSkill6:direct26:chr_0035_liino_combo_skill11:actionOrder2:22'),
        ),
      ),
      scheduled(
        33,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([100, 110, 120, 130, 140, 150, 160, 170, 180, 193, 208, 225]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '10:comboSkill6:direct26:chr_0035_liino_combo_skill11:actionOrder2:27'),
          step('heal', {
            target: 'controlledOperator',
            alwaysNext: true,
            amount: { kind: 'blackboard', key: 'final_heal_value' },
            tagIds: [-1517158118],
          }),
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
    'atk_scale': [0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 0.96, 1.02, 1.08, 1.16, 1.25, 1.35],
    'atk_scale_2': [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.93, 2.08, 2.25],
    'display_atk_scale': [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    'heal_rate': [72, 86.4, 100.8, 115.2, 122.4, 129.6, 136.8, 144, 151.2, 154.8, 158.4, 162],
    'heal_value': [0.17, 0.2, 0.24, 0.27, 0.29, 0.3, 0.32, 0.34, 0.35, 0.36, 0.37, 0.38],
    'poise': 5,
    'usp': 20,
    'final_heal_value': 0,
  },
);

export const liinoBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0035_liino_attack1',
    timelineBlockFrames: 12,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([9.4, 10.3, 11.2, 12.2, 13.1, 14, 15, 15.9, 16.8, 18, 19.4, 21]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct22:chr_0035_liino_attack111:actionOrder1:7'),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([9.4, 10.3, 11.2, 12.2, 13.1, 14, 15, 15.9, 16.8, 18, 19.4, 21]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct22:chr_0035_liino_attack111:actionOrder2:13'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.094, 0.103, 0.112, 0.122, 0.131, 0.14, 0.15, 0.159, 0.168, 0.18, 0.194, 0.21],
    'display_atk_scale': [0.19, 0.21, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42],
  },
);

export const liinoBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0035_liino_attack2',
    timelineBlockFrames: 20,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5.4, 5.9, 6.4, 7, 7.5, 8, 8.6, 9.1, 9.6, 10.3, 11.1, 12]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0035_liino_attack211:actionOrder1:8'),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5.4, 5.9, 6.4, 7, 7.5, 8, 8.6, 9.1, 9.6, 10.3, 11.1, 12]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0035_liino_attack211:actionOrder1:8'),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5.4, 5.9, 6.4, 7, 7.5, 8, 8.6, 9.1, 9.6, 10.3, 11.1, 12]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0035_liino_attack211:actionOrder1:8'),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5.4, 5.9, 6.4, 7, 7.5, 8, 8.6, 9.1, 9.6, 10.3, 11.1, 12]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0035_liino_attack211:actionOrder1:8'),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5.4, 5.9, 6.4, 7, 7.5, 8, 8.6, 9.1, 9.6, 10.3, 11.1, 12]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0035_liino_attack211:actionOrder1:8'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.054, 0.059, 0.064, 0.07, 0.075, 0.08, 0.086, 0.091, 0.096, 0.103, 0.111, 0.12],
    'display_atk_scale': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.56, 0.6],
  },
);

export const liinoBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0035_liino_attack3',
    timelineBlockFrames: 24,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_attack'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_attack',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([22, 24, 26, 29, 31, 33, 35, 37, 40, 42, 46, 50]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct22:chr_0035_liino_attack311:actionOrder2:16'),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile22:chr_0035_liino_attack330:chr_0035_liino_attack3_projhit11:actionOrder2:211:0'),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile22:chr_0035_liino_attack330:chr_0035_liino_attack3_projhit11:actionOrder2:221:0'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile22:chr_0035_liino_attack330:chr_0035_liino_attack3_projhit11:actionOrder2:231:0'),
        ),
      ),
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile22:chr_0035_liino_attack330:chr_0035_liino_attack3_projhit11:actionOrder2:241:0'),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile22:chr_0035_liino_attack330:chr_0035_liino_attack3_projhit11:actionOrder2:251:0'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.22, 0.24, 0.26, 0.29, 0.31, 0.33, 0.35, 0.37, 0.4, 0.42, 0.46, 0.5],
    'atk_scale_2': [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.02, 0.02, 0.02, 0.02],
    'display_atk_scale': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.56, 0.6],
  },
);

export const liinoBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0035_liino_attack4',
    timelineBlockFrames: 18,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_attack'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_attack',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder1:31:0'),
        ),
      ),
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder1:81:0'),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder1:41:0'),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder1:91:0'),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder1:51:0'),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder2:101:0'),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder1:61:0'),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder2:111:0'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder1:71:0'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([3.6, 4, 4.3, 4.7, 5, 5.4, 5.8, 6.1, 6.5, 6.9, 7.5, 8.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile22:chr_0035_liino_attack430:chr_0035_liino_attack4_projhit11:actionOrder2:121:0'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.036, 0.04, 0.043, 0.047, 0.05, 0.054, 0.058, 0.061, 0.065, 0.069, 0.075, 0.081],
    'display_atk_scale': [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
  },
);

export const liinoBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0035_liino_attack5',
    timelineBlockFrames: 28,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_attack'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_attack',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([45, 49, 53, 58, 62, 67, 71, 76, 80, 86, 92, 100]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 19,
          }, '12:basicAttack56:direct22:chr_0035_liino_attack511:actionOrder1:5'),
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
    'atb': 20,
    'atk_scale': [0.45, 0.49, 0.53, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.92, 1],
    'poise': 19,
  },
);

export const liinoFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0035_liino_power_attack',
    timelineBlockFrames: 58,
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
        68,
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
        58,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_attack'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_attack',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_attack',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        34,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.7,
          }, '8:finisher6:direct27:chr_0035_liino_power_attack11:actionOrder2:13'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const liinoPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0035_liino_plunging_attack_end',
    timelineBlockFrames: 11,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_attack'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_attack',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([64, 70, 77, 83, 90, 96, 102, 109, 115, 123, 133, 144]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct34:chr_0035_liino_plunging_attack_end11:actionOrder1:2'),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([16, 18, 19, 21, 22, 24, 26, 27, 29, 31, 33, 36]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct34:chr_0035_liino_plunging_attack_end11:actionOrder1:5'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.64, 0.7, 0.77, 0.83, 0.9, 0.96, 1.02, 1.09, 1.15, 1.23, 1.33, 1.44],
    'atk_scale_2': [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
    'display_atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const liinoBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0035_liino_normal_skill',
    timelineBlockFrames: 50,
    costs: [{ resource: 'sp', value: 25 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_music_cd_uishow',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'rate': { kind: 'constant', value: 0 },
            },
          }),
        ),
        1815,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_attack'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_attack',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_potential_enterfight'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0035_liino_potential_enterfight'],
                reason: 'other',
              }),
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'potential_atb_return' },
                recipient: 'team',
                spGainKind: 'refund',
                spGainSource: 'skill',
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
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'electric',
                  attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: 0.5,
                }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]35:chr_0035_liino_normal_skill_projhit11:actionOrder1:31:3'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        12,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'electric',
                  attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: 0.5,
                }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]35:chr_0035_liino_normal_skill_projhit11:actionOrder1:31:3'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        14,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'electric',
                  attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: 0.5,
                }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]35:chr_0035_liino_normal_skill_projhit11:actionOrder1:31:3'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        14,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'electric',
                  attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: 0.5,
                }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]35:chr_0035_liino_normal_skill_projhit11:actionOrder1:31:3'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_ui_vfx',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        1815,
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_music_tag',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'music_duration' },
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
              'healtaken_rate': { kind: 'blackboard', key: 'healtaken_rate' },
              'shelter': { kind: 'blackboard', key: 'shelter' },
              'shelter_duration': { kind: 'blackboard', key: 'shelter_duration' },
              'talent_a': { kind: 'blackboard', key: 'talent_a' },
              'rate': { kind: 'constant', value: 0 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_music_vfx',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'vfx_music_duration': { kind: 'blackboard', key: 'music_duration' },
              'rate': { kind: 'constant', value: 0 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_music_damage',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'vfx_music_duration': { kind: 'blackboard', key: 'music_duration' },
              'atk_scale': { kind: 'blackboard', key: 'atk_scale_3' },
              'heal_value': { kind: 'blackboard', key: 'heal_value' },
              'heal_rate': { kind: 'blackboard', key: 'heal_rate' },
              'rate': { kind: 'constant', value: 0 },
            },
          }),
        ),
        1815,
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_endtag_finish',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'rate': { kind: 'constant', value: 0 },
            },
          }),
        ),
        1815,
      ),
      scheduled(
        15,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        16,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'electric',
                  attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: 0.5,
                }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]35:chr_0035_liino_normal_skill_projhit11:actionOrder1:31:3'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        16,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'electric',
                  attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: 0.5,
                }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]35:chr_0035_liino_normal_skill_projhit11:actionOrder1:31:3'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        45,
        sequence(
          repeatEachTick(
            sequence(
              step('storeCurrentTimelineFrame', { outputKey: 'music_loop' }),
              step('calculateActionValue', {
                key: 'normalskill_frame',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'music_loop' },
                right: { kind: 'blackboard', key: 'frame_radio' },
              }),
            ),
          ),
        ),
        1691,
      ),
      scheduled(
        45,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'music_frame': { kind: 'blackboard', key: 'normalskill_frame' },
              'heal_rate': { kind: 'blackboard', key: 'heal_rate' },
              'heal_value': { kind: 'blackboard', key: 'heal_value' },
              'atk_scale_2': { kind: 'blackboard', key: 'atk_scale_2' },
              'hit_tigger': { kind: 'blackboard', key: 'atk_trigger' },
            },
          }),
        ),
        1691,
      ),
      scheduled(
        90,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-24-0',
                  event: { kind: 'buffApplied' },
                  sequence: sequence(
                    step('finishBuffsById', {
                      target: 'caster',
                      buffIds: ['buff_chr_0035_liino_normalskill_spelllnfliction_extraattack', 'buff_chr_0035_liino_normalskill_music_animation_musicloop', 'buff_chr_0035_liino_normalskill_music_cd_uishow'],
                      reason: 'other',
                    }),
                    step('adjustSkillCooldown', {
                      target: 'caster',
                      skill: { kind: 'id', skillId: 'chr_0035_liino_normal_skill' },
                      operation: 'set',
                      basis: 'absoluteSeconds',
                      value: { kind: 'blackboard', key: 'set_cd' },
                    }),
                    step('jumpTimeline', { destinationFrame: 1967 }),
                  ),
                },
            ],
          }),
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0035_liino_normal_skill' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'blackboard', key: 'set_cd' },
          }),
        ),
        1815,
      ),
      scheduled(
        90,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-30-0',
                  event: { kind: 'buffApplied' },
                  sequence: sequence(
                    step('finishBuffsById', {
                      target: 'caster',
                      buffIds: ['buff_chr_0035_liino_normalskill_spelllnfliction_extraattack', 'buff_chr_0035_liino_normalskill_music_animation_musicloop', 'buff_chr_0035_liino_normalskill_music_cd_uishow'],
                      reason: 'other',
                    }),
                    step('jumpTimeline', { destinationFrame: 1967 }),
                  ),
                },
            ],
          }),
        ),
        1815,
      ),
      scheduled(
        1691,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0035_liino_normalskill_spelllnfliction_extraattack', 'buff_chr_0035_liino_normalskill_music_animation_musicloop'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        1929,
        sequence(
          step('finishTimeline', {}),
        ),
      ),
      scheduled(
        1967,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0035_liino_normalskill_spelllnfliction_extraattack', 'buff_chr_0035_liino_normalskill_music_animation_musicloop', 'buff_chr_0035_liino_normalskill_music_animation_hitl', 'buff_chr_0035_liino_normalskill_music_animation_hitr'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'music_loop': 0,
    'normalskill_frame': 0,
    'heal_rate': [18, 21.6, 25.2, 28.8, 30.6, 32.4, 34.2, 36, 37.8, 38.7, 39.6, 40.5],
    'heal_value': [0.04, 0.05, 0.06, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.09, 0.09],
    'atk_scale_2': [0.09, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.2],
    'atk_trigger': 10,
    'music_duration': 60,
    'atk_up': [0.06, 0.06, 0.06, 0.07, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1],
    'healtaken_rate': 0,
    'shelter': 0,
    'shelter_duration': 0,
    'talent_a': 0,
    'atk_scale_3': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    'atb_return': 0,
    'atk_scale': [0.18, 0.2, 0.21, 0.23, 0.25, 0.27, 0.28, 0.3, 0.32, 0.34, 0.37, 0.4],
    'display_atk_scale': [1.07, 1.17, 1.28, 1.39, 1.49, 1.6, 1.7, 1.81, 1.92, 2.05, 2.21, 2.4],
    'display_atk_scale_2': [0.53, 0.59, 0.64, 0.69, 0.75, 0.8, 0.85, 0.91, 0.96, 1.03, 1.11, 1.2],
    'display_poise': 3,
    'music_trigger': 3,
    'poise': 0.5,
    'frame_radio': 30,
    'potential_atb_return': 0,
    'set_cd': 3,
  },
);

export const liinoBattleSkillEnd: SkillDefinition = {
  key: 'battleSkillEnd',
  sourceSkillId: 'chr_0035_liino_normal_skill_end',
  timelineBlockFrames: 1,
  scheduledSequences: [
  ],
};

export const liinoBattleSkillCombo: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkillCombo',
    sourceSkillId: 'chr_0035_liino_normal_skill_combo',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-6-0',
                  event: { kind: 'buffApplied' },
                  sequence: sequence(
                    step('finishBuffsById', {
                      target: 'caster',
                      buffIds: ['buff_chr_0035_liino_normalskill_spelllnfliction_extraattack', 'buff_chr_0035_liino_normalskill_music_animation_musicloop', 'buff_chr_0035_liino_normalskill_music_cd_uishow'],
                      reason: 'other',
                    }),
                    step('adjustSkillCooldown', {
                      target: 'caster',
                      skill: { kind: 'id', skillId: 'chr_0035_liino_normal_skill' },
                      operation: 'set',
                      basis: 'absoluteSeconds',
                      value: { kind: 'blackboard', key: 'set_cd' },
                    }),
                    step('jumpTimeline', { destinationFrame: 1938 }),
                  ),
                },
            ],
          }),
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0035_liino_normal_skill' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'blackboard', key: 'set_cd' },
          }),
        ),
        1800,
      ),
      scheduled(
        0,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-12-0',
                  event: { kind: 'buffApplied' },
                  sequence: sequence(
                    step('finishBuffsById', {
                      target: 'caster',
                      buffIds: ['buff_chr_0035_liino_normalskill_spelllnfliction_extraattack', 'buff_chr_0035_liino_normalskill_music_animation_musicloop', 'buff_chr_0035_liino_normalskill_music_cd_uishow'],
                      reason: 'other',
                    }),
                    step('jumpTimeline', { destinationFrame: 1938 }),
                  ),
                },
            ],
          }),
        ),
        1800,
      ),
      scheduled(
        0,
        sequence(
          repeatEachTick(
            sequence(
              step('storeCurrentTimelineFrame', { outputKey: 'music_loop' }),
              step('calculateActionValue', {
                key: 'normalskill_frame',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'music_loop' },
                right: { kind: 'blackboard', key: 'frame_radio' },
              }),
            ),
          ),
        ),
        1801,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        1800,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 1938,
          }),
        ),
        1801,
      ),
      scheduled(
        1801,
        sequence(
          step('finishTimeline', {}),
        ),
      ),
      scheduled(
        1862,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        1962,
      ),
      scheduled(
        1862,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        1938,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0035_liino_normalskill_spelllnfliction_extraattack', 'buff_chr_0035_liino_normalskill_music_animation_musicloop', 'buff_chr_0035_liino_normalskill_music_animation_hitl', 'buff_chr_0035_liino_normalskill_music_animation_hitr'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'music_loop': 0,
    'atk_scale': [0.18, 0.2, 0.21, 0.23, 0.25, 0.27, 0.28, 0.3, 0.32, 0.34, 0.37, 0.4],
    'atk_scale_2': [0.09, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.2],
    'atk_scale_3': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    'atk_trigger': 10,
    'atk_up': 0.08,
    'display_atk_scale': [1.07, 1.17, 1.28, 1.39, 1.49, 1.6, 1.7, 1.81, 1.92, 2.05, 2.21, 2.4],
    'display_atk_scale_2': [0.53, 0.59, 0.64, 0.69, 0.75, 0.8, 0.85, 0.91, 0.96, 1.03, 1.11, 1.2],
    'display_poise': 12,
    'heal_rate': [18, 21.6, 25.2, 28.8, 30.6, 32.4, 34.2, 36, 37.8, 38.7, 39.6, 40.5],
    'heal_value': [0.04, 0.05, 0.06, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.09, 0.09],
    'music_duration': 60,
    'music_trigger': 3,
    'poise': 2,
    'frame_radio': 30,
    'normalskill_frame': 0,
    'set_cd': 3,
  },
);

export const liinoUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0035_liino_ultimate_skill',
    timelineBlockFrames: 77,
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 160 }],
    costFrame: 0,
    scheduledSequences: [
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
        30,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_ultskill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        523,
      ),
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
        80,
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
        77,
      ),
      scheduled(
        26,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_audio_ultskill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        77,
      ),
      scheduled(
        64,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_audio',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        523,
      ),
      scheduled(
        76,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0035_liino_ult_skill_projhit',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            target: 'enemy',
          }),
        ),
      ),
      scheduled(
        77,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_ultskill_refrainobtainusp',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        527,
      ),
      scheduled(
        77,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_ui_vfx',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        543,
      ),
      scheduled(
        77,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_ultskill_music_vfx',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'vfx_music_duration': { kind: 'blackboard', key: 'ultmusic_duration' },
              'rate': { kind: 'constant', value: 0 },
            },
          }),
        ),
        527,
      ),
      scheduled(
        77,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'fnlatk_up' },
              operator: 'lessOrEqual',
              right: { kind: 'blackboard', key: 'will_max' },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_ultskill_music_tag',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'duration': { kind: 'blackboard', key: 'ultmusic_duration' },
                  'finish_duration': { kind: 'blackboard', key: 'finish_duration' },
                  'atk_up': { kind: 'blackboard', key: 'atk_up' },
                  'spellenhance_rate': { kind: 'blackboard', key: 'fnlatk_up' },
                  'talent_a': { kind: 'blackboard', key: 'talent_a' },
                  'shelter': { kind: 'blackboard', key: 'shelter' },
                  'shelter_duration': { kind: 'blackboard', key: 'shelter_duration' },
                  'healtaken_rate': { kind: 'blackboard', key: 'healtaken_rate' },
                  'rate': { kind: 'constant', value: 0 },
                },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'fnlatk_up',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'will_max' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_ultskill_music_tag',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'duration': { kind: 'blackboard', key: 'ultmusic_duration' },
                  'finish_duration': { kind: 'blackboard', key: 'finish_duration' },
                  'atk_up': { kind: 'blackboard', key: 'atk_up' },
                  'spellenhance_rate': { kind: 'blackboard', key: 'fnlatk_up' },
                  'talent_a': { kind: 'blackboard', key: 'talent_a' },
                  'shelter': { kind: 'blackboard', key: 'shelter' },
                  'shelter_duration': { kind: 'blackboard', key: 'shelter_duration' },
                  'healtaken_rate': { kind: 'blackboard', key: 'healtaken_rate' },
                  'rate': { kind: 'constant', value: 0 },
                },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        77,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_ultskill_music_damage',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'vfx_music_duration': { kind: 'blackboard', key: 'ultmusic_duration' },
              'atk_scale_3': { kind: 'blackboard', key: 'atk_scale_3' },
              'music_damage_trigger': { kind: 'blackboard', key: 'ultmusic_trigger' },
              'ultheal_value': { kind: 'blackboard', key: 'ultheal_value' },
              'ultheal_rate': { kind: 'blackboard', key: 'ultheal_rate' },
              'rate': { kind: 'constant', value: 0 },
            },
          }),
        ),
        477,
      ),
      scheduled(
        77,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'caster',
              tagQueryType: 'hasAny',
              tagIds: [828446949],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_ultskill_weaponvisible_show',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'rate': { kind: 'constant', value: 0 },
                },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_ultskill_weaponvisible',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'rate': { kind: 'constant', value: 0 },
                },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        80,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_ultskill_music_heal_start',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'heal_value': { kind: 'blackboard', key: 'ultheal03_value' },
              'heal_rate': { kind: 'blackboard', key: 'ultheal03_rate' },
            },
          }),
        ),
      ),
      scheduled(
        137,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-45-0',
                  event: { kind: 'buffApplied' },
                  sequence: sequence(
                    step('finishBuffsById', {
                      target: 'caster',
                      buffIds: ['buff_chr_0035_liino_normalskill_music_animation_musicloop'],
                      reason: 'other',
                    }),
                    step('jumpTimeline', { destinationFrame: 540 }),
                  ),
                },
            ],
          }),
        ),
        527,
      ),
      scheduled(
        407,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0035_liino_normalskill_music_animation_musicloop'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        508,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_4',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_3' },
            right: { kind: 'blackboard', key: 'final_value' },
          }),
        ),
      ),
      scheduled(
        508,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0035_liino_ultimate_skill_soundwave_02_projhit:28',
            { atk_scale_4: 0.1, poise: 0 },
            true,
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale_4' },
                tags: ['ultimateSkill'],
              }, '8:ultimate10:projectile29:chr_0035_liino_ultimate_skill50:chr_0035_liino_ultimate_skill_soundwave_02_projhit11:actionOrder2:281:1'),
            ),
          ),
          withActionBlackboardScope(
            'projectile:chr_0035_liino_ultimate_skill_soundwave_02_projhit:28',
            { atk_scale_4: 0.1, poise: 0 },
            true,
            sequence(
              step('applyBuff', {
                buffId: 'buff_physical_no_guard',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      ),
      scheduled(
        513,
        sequence(
          step('calculateActionValue', {
            key: 'ultheal02_rate',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'ultheal_rate' },
            right: { kind: 'blackboard', key: 'final_value' },
          }),
          step('calculateActionValue', {
            key: 'ultheal02_value',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'ultheal_value' },
            right: { kind: 'blackboard', key: 'final_value' },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_ultskill_music_heal',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'heal_value': { kind: 'blackboard', key: 'ultheal02_value' },
              'heal_rate': { kind: 'blackboard', key: 'ultheal02_rate' },
            },
          }),
        ),
      ),
      scheduled(
        540,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0035_liino_normalskill_music_animation_musicloop'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'fnlatk_up': 0,
    'will_max': [0.4, 0.4, 0.4, 0.4, 0.45, 0.45, 0.45, 0.45, 0.45, 0.5, 0.55, 0.6],
    'ultheal03_value': [0.76, 0.91, 1.06, 1.21, 1.29, 1.36, 1.44, 1.51, 1.59, 1.63, 1.66, 1.7],
    'ultheal03_rate': [324, 388.8, 453.6, 518.4, 550.8, 583.2, 615.6, 648, 680.4, 696.6, 712.8, 729],
    'ultheal02_value': 0,
    'ultheal02_rate': 0,
    'ultmusic_duration': 15,
    'atk_scale_3': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.42, 0.45, 0.48, 0.51, 0.55, 0.6],
    'ultmusic_trigger': 1.5,
    'ultheal_value': [0.08, 0.1, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.18, 0.18, 0.19],
    'ultheal_rate': [36, 43.2, 50.4, 57.6, 61.2, 64.8, 68.4, 72, 75.6, 77.4, 79.2, 81],
    'atk_scale': [0.07, 0.08, 0.09, 0.09, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16],
    'atk_scale_2': [2.84, 3.13, 3.41, 3.7, 3.98, 4.27, 4.55, 4.83, 5.12, 5.47, 5.9, 6.4],
    'atk_up': 0.1,
    'display_atk_scale': [1.42, 1.56, 1.71, 1.85, 1.99, 2.13, 2.28, 2.42, 2.56, 2.74, 2.95, 3.2],
    'finish_duration': 0,
    'poise': 20,
    'will_up': [0.00018, 0.0002, 0.00021, 0.00023, 0.00025, 0.00027, 0.00028, 0.0003, 0.00032, 0.00034, 0.00037, 0.0004],
    'atk_scale_4': 0,
    'final_value': 3,
    'healtaken_rate': 0,
    'shelter': 0,
    'shelter_duration': 0,
    'talent_a': 0,
  },
);

export const liinoGeneratedOperator: OperatorDefinition = {
  slug: 'liino',
  gameId: 'LIINO',
  rarity: 6,
  weaponType: 'polearm',
  element: 'electric',
  role: 'supporter',
  mainAttribute: 'will',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [9, 26, 44, 62, 80, 89],
    agility: [14, 37, 61, 85, 109, 121],
    intellect: [9, 26, 45, 64, 82, 91],
    will: [21, 55, 90, 125, 160, 177],
    baseAttack: [30, 90, 152, 215, 277, 309],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: liinoComboSkill },
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [liinoBasicAttack1, liinoBasicAttack2, liinoBasicAttack3, liinoBasicAttack4, liinoBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: liinoFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: liinoPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: [liinoBattleSkill, liinoBattleSkillCombo], replacementSkills: [liinoBattleSkillEnd] },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: liinoUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0035_liino_showhide_finish': {
      stackingType: 'highPriority',
      stackingKey: 'liino_showhide_vfx',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: 0.4,
    },
    'buff_chr_0035_liino_showhide': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_finish',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
    },
    'buff_chr_0035_liino_showhide_audio_finish': {
      stackingType: 'highPriority',
      stackingKey: 'liino_showhide_audio_vfx',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: 0.3,
    },
    'buff_chr_0035_liino_showhide_audio': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_audio_finish',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
    },
    'buff_chr_0035_liino_showhide_attack': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_finish',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
    },
    'buff_chr_0035_liino_normalskill_music_cd_uishow': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      skillSlotReplacements: [
        {
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'battleSkillEnd',
          revertedSkillKey: 'battleSkill',
          inheritOriginSkillCooldownProgress: true,
        },
      ],
    },
    'buff_chr_0035_liino_normalskill_ui_vfx': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0.15,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'attack_num': 0,
        'call_num': 0,
        'call_speed': 0.9,
        'has_clicked': 0,
        'love_open': 0,
        'speed_max': 2.5,
        'speed_up': 1.05,
        'uishow_check': 8,
      },
      lifecycleSequences: {
        finish: sequence(
          step('modifyActionValue', {
            key: 'attack_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'call_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'love_open',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        trigger: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'has_clicked' },
              operator: 'greater',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'attack_num',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'attack_num' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'blackboard', key: 'uishow_check' },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'call_speed' },
                      operator: 'less',
                      right: { kind: 'blackboard', key: 'speed_max' },
                    },
                    sequence(
                      step('calculateActionValue', {
                        key: 'call_speed',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'call_speed' },
                        right: { kind: 'blackboard', key: 'speed_up' },
                      }),
                    ),
                    sequence(
                      step('modifyActionValue', {
                        key: 'call_speed',
                        operation: 'assign',
                        value: { kind: 'blackboard', key: 'call_speed' },
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'love_open',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
                  }),
                  step('modifyActionValue', {
                    key: 'attack_num',
                    operation: 'assign',
                    value: { kind: 'constant', value: 0 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('modifyActionValue', {
                key: 'has_clicked',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
            ),
          ),
        ),
      },
    },
    'buff_chr_0035_liino_atkup': {
      stackingType: 'highPriority',
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
      stackingKey: 'liino_atk_up',
      priority: { blackboardKey: 'atk_up' },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_up': 0,
        'duration': 0,
        'spellenhance_rate': 0,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'atk_up' },
        },
      ],
    },
    'buff_chr_0035_liino_normalskill_buff_atkup': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'atk_up': 0,
        'duration': -1,
        'finish_duration': 0,
        'spellenhance_rate': 0.2,
      },
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_atkup',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
              'duration': { kind: 'blackboard', key: 'duration' },
            },
          }),
        ),
      },
    },
    'buff_chr_0035_liino_atkup_owner': {
      stackingType: 'highPriority',
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
      stackingKey: 'liino_atk_up',
      priority: { blackboardKey: 'atk_up' },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_up': 0,
        'duration': 0,
        'spellenhance_rate': 0,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'atk_up' },
        },
      ],
    },
    'buff_chr_0035_liino_talent_shelter': {
      stackingType: 'stack',
      priority: { blackboardKey: 'shelter', negate: true },
      maxStackCount: 1,
      blackboard: {
        'duration': -1,
        'heal_rate': 0.2,
        'liino_talent': 1,
        'shelter': -0.2,
      },
      attributeModifiers: [
        {
          attribute: 'healTakenIncrease',
          slot: 'addition',
          value: { blackboardKey: 'heal_rate' },
        },
      ],
      damageModifiers: [
        {
          enabledSide: 'defender',
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'product',
              addition: { blackboardKey: 'shelter' },
            },
          ],
        },
      ],
    },
    'buff_chr_0035_liino_talent_shelter_normalskill': {
      stackingType: 'highPriority',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_liino_normalskill_music',
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
      stackingKey: 'liino_talent',
      priority: { blackboardKey: 'shelter', negate: true },
      maxStackCount: 5,
      blackboard: {
        'duration': -1,
        'heal_rate': 0.2,
        'liino_talent': 1,
        'shelter': -0.2,
      },
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_talent_shelter',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'shelter': { kind: 'blackboard', key: 'shelter' },
              'heal_rate': { kind: 'blackboard', key: 'heal_rate' },
            },
          }),
        ),
      },
    },
    'buff_chr_0035_liino_normalskill_end': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 1,
      },
    },
    'buff_chr_0035_liino_normalskill_music_tag': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'AttentionDebuff',
        },
      },
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTagIds: [-438154626],
      blackboard: {
        'atk_up': 0,
        'duration': 15,
        'duration_atkup': -1,
        'finish_duration': 0,
        'healtaken_rate': 0,
        'shelter': 0,
        'shelter_duration': 0,
        'shelter_teammate': 0,
        'spellenhance_rate': 0,
        'talent_a': 0,
      },
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_buff_atkup',
            target: 'partyExceptCaster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_atkup_owner',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
              'duration': { kind: 'blackboard', key: 'duration_atkup' },
            },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent_a' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_talent_shelter_normalskill',
                target: 'party',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                blackboardAssignments: {
                  'shelter': { kind: 'blackboard', key: 'shelter' },
                  'heal_rate': { kind: 'blackboard', key: 'healtaken_rate' },
                },
              }),
            ),
          ),
        ),
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_end',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
    },
    'buff_chr_0035_liino_normalskill_music_vfx': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'vfx_music_duration' },
      blackboard: {
        'time_ratio': 1.5,
        'vfx_music_duration': 20,
      },
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence:
            sequence(
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0035_liino_normalskill_music_vfx_airflow'],
                reason: 'other',
              }),
            ),
        },
      ],
    },
    'buff_chr_0035_liino_normalskill_music_damage': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'vfx_music_duration' },
      triggerIntervalSeconds: { blackboardKey: 'music_damage_trigger' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'atk_scale': 0.1,
        'heal_rate': 0,
        'heal_value': 0,
        'music_damage_trigger': 3,
        'vfx_music_duration': 20,
      },
      lifecycleSequences: {
        trigger: sequence(
          sequence(
            sequence(
              step('storeSourceAttributeValue', {
                attribute: { kind: 'specific', key: 'agility' },
                stage: 'finalNonConverted',
                useFloor: false,
                divisor: { kind: 'constant', value: 1 },
                multiplier: { kind: 'blackboard', key: 'heal_value' },
                base: { kind: 'blackboard', key: 'heal_rate' },
                targetKey: 'final_heal_value',
              }),
              step('heal', {
                target: 'caster',
                alwaysNext: true,
                amount: { kind: 'blackboard', key: 'final_heal_value' },
                tagIds: [-320297214],
              }),
            ),
          ),
          sequence(
            sequence(
              step('storeSourceAttributeValue', {
                attribute: { kind: 'specific', key: 'agility' },
                stage: 'finalNonConverted',
                useFloor: false,
                divisor: { kind: 'constant', value: 1 },
                multiplier: { kind: 'blackboard', key: 'heal_value' },
                base: { kind: 'blackboard', key: 'heal_rate' },
                targetKey: 'final_heal_value',
              }),
              step('heal', {
                target: 'caster',
                alwaysNext: true,
                amount: { kind: 'blackboard', key: 'final_heal_value' },
                tagIds: [-320297214],
              }),
            ),
          ),
        ),
      },
    },
    'buff_chr_0035_liino_normalskill_endtag_finish': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      blackboard: {
        'duration': 1,
      },
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffSource',
            buffIds: ['buff_chr_0035_liino_normalskill_endtag'],
            reason: 'other',
          }),
        ),
      },
    },
    'buff_chr_0035_liino_normalskill_music_animation_musicloop': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'vfx_music_duration' },
      blackboard: {
        'music_frame': 0,
        'vfx_music_duration': 60,
      },
      abilityEventResponses: [
        {
          event: 'skillEnd',
          priority: 0,
          sequence:
            sequence(
              step('finishCurrentBuff', { reason: 'other' }),
            ),
        },
      ],
    },
    'buff_chr_0035_liino_normalskill_music_animation_hitl': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'vfx_music_duration' },
      blackboard: {
        'animation_starttime_key': 0,
        'atk_scale_2': 0,
        'heal_rate': 200,
        'heal_value': 0.2,
        'music_frame': 0,
        'vfx_music_duration': 20,
      },
      scheduledSequences: [
        scheduled(
          60,
          sequence(
            once(
              'animation-end:buff_chr_0035_liino_normalskill_music_animation_hitl:0:0',
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0035_liino_normalskill_music_animation_musicloop',
                  target: 'buffOwner',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    'music_frame': { kind: 'blackboard', key: 'music_frame' },
                    'rate': { kind: 'constant', value: 0 },
                  },
                }),
              ),
            ),
          ),
        ),
      ],
    },
    'buff_chr_0035_liino_normalskill_music_animation_hitr': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'vfx_music_duration' },
      blackboard: {
        'animation_starttime_key': 0,
        'atk_scale_2': 0,
        'heal_rate': 0,
        'heal_value': 0,
        'music_frame': 0,
        'vfx_music_duration': 20,
      },
      scheduledSequences: [
        scheduled(
          63,
          sequence(
            once(
              'animation-end:buff_chr_0035_liino_normalskill_music_animation_hitr:0:0',
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0035_liino_normalskill_music_animation_musicloop',
                  target: 'buffOwner',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    'music_frame': { kind: 'blackboard', key: 'music_frame' },
                    'rate': { kind: 'constant', value: 0 },
                  },
                }),
              ),
            ),
          ),
        ),
      ],
    },
    'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: { blackboardKey: 'hit_tigger' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'atk_scale_2': 0,
        'frame_radio': 30,
        'heal_rate': 0,
        'heal_value': 0,
        'hit_animation': 0,
        'hit_check': 1,
        'hit_duration': 0.6,
        'hit_tigger': 10,
        'music_frame': 0,
        'music_loop': 0,
      },
      lifecycleSequences: {
        trigger: sequence(
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'liino_normalskill_hit' } },
                sequence(
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'liino_normalskill_hit',
                    durationSeconds: { kind: 'blackboard', key: 'hit_duration' },
                    autoFinishByAction: false,
                  }),
                  step('storeCurrentTimelineFrame', { outputKey: 'music_loop' }),
                  step('calculateActionValue', {
                    key: 'music_frame',
                    operation: 'divide',
                    left: { kind: 'blackboard', key: 'music_loop' },
                    right: { kind: 'blackboard', key: 'frame_radio' },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_check' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('calculateActionValue', {
                        key: 'hit_check',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'hit_check' },
                        right: { kind: 'constant', value: -1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0035_liino_normalskill_music_animation_hitl',
                        target: 'buffSource',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'music_frame': { kind: 'blackboard', key: 'music_frame' },
                          'atk_scale_2': { kind: 'blackboard', key: 'atk_scale_2' },
                          'heal_rate': { kind: 'blackboard', key: 'heal_rate' },
                          'heal_value': { kind: 'blackboard', key: 'heal_value' },
                          'rate': { kind: 'constant', value: 0 },
                        },
                      }),
                    ),
                    sequence(
                      step('calculateActionValue', {
                        key: 'hit_check',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'hit_check' },
                        right: { kind: 'constant', value: -1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0035_liino_normalskill_music_animation_hitr',
                        target: 'buffSource',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'music_frame': { kind: 'blackboard', key: 'music_frame' },
                          'heal_rate': { kind: 'blackboard', key: 'heal_rate' },
                          'heal_value': { kind: 'blackboard', key: 'heal_value' },
                          'atk_scale_2': { kind: 'blackboard', key: 'atk_scale_2' },
                          'rate': { kind: 'constant', value: 0 },
                        },
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
              ),
            ),
          ),
        ),
      },
    },
    'buff_chr_0035_liino_showhide_ultskill': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_finish',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
    },
    'buff_chr_0035_liino_showhide_audio_ultskill': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
    },
    'buff_chr_0035_liino_ultskill_refrainobtainusp': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'duration': 1,
      },
    },
    'buff_chr_0035_liino_ultskill_music_vfx': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'vfx_music_duration' },
      blackboard: {
        'vfx_music_duration': 20,
      },
    },
    'buff_chr_0035_liino_spellenhance': {
      stackingType: 'highPriority',
      stackingKey: 'liino_spellenhance',
      priority: { blackboardKey: 'spellenhance_rate' },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_up': 0,
        'duration': 0,
        'spellenhance_rate': 0,
      },
      attributeModifiers: [
        {
          attribute: 'electricEnhancedDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'spellenhance_rate' },
        },
        {
          attribute: 'natureEnhancedDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'spellenhance_rate' },
        },
      ],
    },
    'buff_chr_0035_liino_ultskill_buff_atkup': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'atk_up': 0,
        'duration': -1,
        'finish_duration': 10,
        'spellenhance_rate': 0.2,
        'spellenhance_will_rate': 0,
      },
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_spellenhance',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'spellenhance_rate': { kind: 'blackboard', key: 'spellenhance_rate' },
              'duration': { kind: 'blackboard', key: 'duration' },
            },
          }),
        ),
      },
    },
    'buff_chr_0035_liino_talent_shelter_ultskill': {
      stackingType: 'highPriority',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_liino_ultskill_music',
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
      stackingKey: 'liino_talent',
      priority: { blackboardKey: 'shelter', negate: true },
      maxStackCount: 5,
      blackboard: {
        'duration': -1,
        'heal_rate': 0.2,
        'liino_talent': 1,
        'shelter': -0.2,
      },
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_talent_shelter',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'shelter': { kind: 'blackboard', key: 'shelter' },
              'heal_rate': { kind: 'blackboard', key: 'heal_rate' },
            },
          }),
        ),
      },
    },
    'buff_chr_0035_liino_ultskill_music_tag': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'AttentionDebuff',
        },
      },
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTagIds: [-499637408],
      blackboard: {
        'atk_up': 0,
        'duration': 15,
        'duration_atkup': -1,
        'finish_duration': 0,
        'healtaken_rate': 0,
        'shelter': 0,
        'shelter_duration': 0,
        'shelter_teammate': 0,
        'spellenhance_rate': 0.2,
        'talent_a': 0,
      },
      lifecycleSequences: {
        enable: sequence(
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0035_liino_normalskill_buff_atkup',
              target: 'partyExceptCaster',
              inheritSourceSkillCastInfo: true,
              finishByAction: true,
              blackboardAssignments: {
                'atk_up': { kind: 'blackboard', key: 'atk_up' },
                'finish_duration': { kind: 'blackboard', key: 'finish_duration' },
              },
            }),
            step('applyBuff', {
              buffId: 'buff_chr_0035_liino_ultskill_buff_atkup',
              target: 'partyExceptCaster',
              inheritSourceSkillCastInfo: true,
              finishByAction: true,
              blackboardAssignments: {
                'spellenhance_rate': { kind: 'blackboard', key: 'spellenhance_rate' },
                'finish_duration': { kind: 'blackboard', key: 'finish_duration' },
              },
            }),
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_atkup_owner',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
              'duration': { kind: 'blackboard', key: 'duration_atkup' },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_ultskill_buff_atkup',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'spellenhance_rate': { kind: 'blackboard', key: 'spellenhance_rate' },
              'finish_duration': { kind: 'blackboard', key: 'finish_duration' },
            },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent_a' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_talent_shelter_ultskill',
                target: 'party',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                blackboardAssignments: {
                  'shelter': { kind: 'blackboard', key: 'shelter' },
                  'heal_rate': { kind: 'blackboard', key: 'healtaken_rate' },
                },
              }),
            ),
          ),
        ),
      },
    },
    'buff_chr_0035_liino_ultskill_music_damage': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'vfx_music_duration' },
      triggerIntervalSeconds: { blackboardKey: 'music_damage_trigger' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'atk_scale_3': 0.1,
        'music_damage_trigger': 3,
        'ultheal02_rate': 0,
        'ultheal02_value': 0,
        'ultheal_rate': 0,
        'ultheal_value': 0,
        'vfx_music_duration': 20,
      },
      lifecycleSequences: {
        trigger: sequence(
          sequence(
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
                tags: ['ultimateSkill'],
              }, '51:buff_chr_0035_liino_ultskill_music_damage:trigger:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder1:8'),
            ),
            step('applyBuff', {
              buffId: 'buff_physical_no_guard',
              target: 'buffOwner',
              inheritSourceSkillCastInfo: true,
            }),
          ),
          sequence(
            sequence(
              step('storeSourceAttributeValue', {
                attribute: { kind: 'specific', key: 'agility' },
                stage: 'finalNonConverted',
                useFloor: false,
                divisor: { kind: 'constant', value: 1 },
                multiplier: { kind: 'blackboard', key: 'ultheal_value' },
                base: { kind: 'blackboard', key: 'ultheal_rate' },
                targetKey: 'final_heal_value',
              }),
              step('heal', {
                target: 'caster',
                alwaysNext: true,
                amount: { kind: 'blackboard', key: 'final_heal_value' },
                tagIds: [-1499119779],
              }),
            ),
            step('applyBuff', {
              buffId: 'buff_physical_no_guard',
              target: 'buffSource',
              inheritSourceSkillCastInfo: true,
            }),
          ),
        ),
      },
    },
    'buff_chr_0035_liino_ultskill_weaponvisible_show': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 10,
      },
      abilityEventResponses: [
        {
          event: 'skillEnd',
          priority: 0,
          sequence:
            sequence(
              step('finishCurrentBuff', { reason: 'other' }),
            ),
        },
      ],
    },
    'buff_chr_0035_liino_ultskill_weaponvisible': {
      stackingType: 'stack',
      priority: { blackboardKey: 'rate', negate: true },
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 15,
      },
      abilityEventResponses: [
        {
          event: 'skillEnd',
          priority: 0,
          sequence:
            sequence(
              step('finishCurrentBuff', { reason: 'other' }),
            ),
        },
      ],
    },
    'buff_chr_0035_liino_ultskill_music_heal_start': {
      stackingType: 'unlimited',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 0.5,
        'final_heal_value': 0,
        'heal_rate': 500,
        'heal_value': 0.2,
        'potential_1': 0,
      },
      lifecycleSequences: {
        enable: sequence(
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'agility' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'blackboard', key: 'heal_value' },
            base: { kind: 'blackboard', key: 'heal_rate' },
            targetKey: 'final_heal_value',
          }),
          step('heal', {
            target: 'buffOwner',
            alwaysNext: true,
            amount: { kind: 'blackboard', key: 'final_heal_value' },
            tagIds: [-1499119779],
          }),
        ),
      },
    },
    'buff_chr_0035_liino_ultskill_music_heal': {
      stackingType: 'unlimited',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: 0.5,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      blackboard: {
        'duration': 2,
        'final_heal_value': 0,
        'heal_rate': 500,
        'heal_value': 0.2,
        'potential_1': 0,
      },
      lifecycleSequences: {
        trigger: sequence(
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'agility' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'blackboard', key: 'heal_value' },
            base: { kind: 'blackboard', key: 'heal_rate' },
            targetKey: 'final_heal_value',
          }),
          step('heal', {
            target: 'buffOwner',
            alwaysNext: true,
            amount: { kind: 'blackboard', key: 'final_heal_value' },
            tagIds: [-1499119779],
          }),
        ),
      },
    },
    'buff_chr_0035_liino_potential_enterfight': {
      stackingType: 'unique',
      priority: 1,
      maxStackCount: 1,
    },
    'buff_chr_0035_liino_potential': {
      stackingType: 'unique',
      priority: 1,
      maxStackCount: 1,
      abilityEventResponses: [
        {
          event: 'enterFight',
          priority: 0,
          sequence:
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_potential_enterfight',
                target: 'buffSource',
                inheritSourceSkillCastInfo: true,
              }),
            ),
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0035_liino_ult_skill_projhit': { lifetime: { kind: 'limited', durationSeconds: 30 }, childSkill: {
        skillId: 'chr_0035_liino_ultimate_skill_projhit_abilityentity',
        blackboard: {
          'atk_scale': 0,
          'atk_scale_2': 0,
          'poise': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder1:31:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder1:41:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            3,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder1:91:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:101:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            6,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:151:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:161:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            8,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]39:chr_0035_liino_ultimate_skill_projhit_l11:actionOrder2:211:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]39:chr_0035_liino_ultimate_skill_projhit_r11:actionOrder2:221:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            11,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]39:chr_0035_liino_ultimate_skill_projhit_l11:actionOrder2:271:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]39:chr_0035_liino_ultimate_skill_projhit_r11:actionOrder2:281:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            15,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[6]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:331:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[6]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:341:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            18,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:391:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:401:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            21,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:491:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:501:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            25,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional19:timelineActions[10]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:551:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional19:timelineActions[10]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:561:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            28,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional19:timelineActions[11]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:611:1'),
                  ),
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional19:timelineActions[11]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]37:chr_0035_liino_ultimate_skill_projhit11:actionOrder2:621:1'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            40,
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  sequence(
                    step('dealDamage', {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    }, '98:abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity11:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]47:chr_0035_liino_ultimate_skill_projhit_damage_0211:actionOrder2:451:3'),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ],
    } },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'talent_a',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'shelter',
          operation: 'assign',
          value: [-0.1, -0.2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'healtaken_rate',
          operation: 'assign',
          value: [0.1, 0.2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'shelter_duration',
          operation: 'assign',
          value: [3, 3],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_a',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'shelter',
          operation: 'assign',
          value: [-0.1, -0.2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'healtaken_rate',
          operation: 'assign',
          value: [0.1, 0.2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'shelter_duration',
          operation: 'assign',
          value: [3, 3],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_b',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: [5, 10],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atb_return_duration',
          operation: 'assign',
          value: [30, 30],
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'potential_atb_return',
          operation: 'assign',
          value: 25,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'atk_up',
          operation: 'add',
          value: 0.06,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_up',
          operation: 'add',
          value: 0.06,
        },
      ],
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0035_liino_potential',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
        }),
      ),
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['will'],
          value: 20,
        },
        { kind: 'addStaticHealingIncrease', target: 'output', value: 0.1 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -30,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'heal_value',
          operation: 'multiply',
          value: 1.4,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'heal_rate',
          operation: 'multiply',
          value: 1.4,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.4,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale_2',
          operation: 'multiply',
          value: 1.4,
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
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'will_up',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'will_max',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale_2',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale_3',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale_4',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'atk_scale_2',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'atk_scale_3',
          operation: 'multiply',
          value: 1.2,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
