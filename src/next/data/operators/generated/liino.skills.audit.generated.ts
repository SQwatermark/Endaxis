/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, repeatEachTick, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

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
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        64,
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
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_audio_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        48,
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
          ),
        ),
      ),
      scheduled(
        4,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_audio_fire'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_audio_fire',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      ),
      scheduled(
        5,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0035_liino_showhide_fire'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0035_liino_showhide_fire',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
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
          ),
        ),
      ),
      scheduled(
        3,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        49,
      ),
      scheduled(
        3,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_audio_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        49,
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
          ),
        ),
      ),
      scheduled(
        6,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        1804,
      ),
      scheduled(
        6,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_audio_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        1804,
      ),
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 0.5,
          }, '11:battleSkill10:projectile27:chr_0035_liino_normal_skill41:chr_0035_liino_normal_skill_projhit_start35:chr_0035_liino_normal_skill_projhit11:actionOrder2:171:11:01:3'),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 0.5,
          }, '11:battleSkill10:projectile27:chr_0035_liino_normal_skill41:chr_0035_liino_normal_skill_projhit_start35:chr_0035_liino_normal_skill_projhit11:actionOrder2:181:11:01:3'),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 0.5,
          }, '11:battleSkill10:projectile27:chr_0035_liino_normal_skill47:chr_0035_liino_normal_skill_projhit_start_vfx0235:chr_0035_liino_normal_skill_projhit11:actionOrder2:211:11:01:3'),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 0.5,
          }, '11:battleSkill10:projectile27:chr_0035_liino_normal_skill45:chr_0035_liino_normal_skill_projhit_start_vfx35:chr_0035_liino_normal_skill_projhit11:actionOrder2:221:11:01:3'),
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
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_normalskill_music_vfx',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'vfx_music_duration': { kind: 'blackboard', key: 'music_duration' },
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
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 0.5,
          }, '11:battleSkill10:projectile27:chr_0035_liino_normal_skill47:chr_0035_liino_normal_skill_projhit_start_vfx0335:chr_0035_liino_normal_skill_projhit11:actionOrder2:191:11:01:3'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([18, 20, 21, 23, 25, 27, 28, 30, 32, 34, 37, 40]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 0.5,
          }, '11:battleSkill10:projectile27:chr_0035_liino_normal_skill47:chr_0035_liino_normal_skill_projhit_start_vfx0435:chr_0035_liino_normal_skill_projhit11:actionOrder2:201:11:01:3'),
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
                    step('applyBuff', {
                      buffId: 'buff_chr_0035_liino_normalskill_music_cry_vfx',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                    }),
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
                    step('applyBuff', {
                      buffId: 'buff_chr_0035_liino_normalskill_music_smile_vfx',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                    }),
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
                    step('applyBuff', {
                      buffId: 'buff_chr_0035_liino_normalskill_music_cry_vfx',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                    }),
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
                    step('applyBuff', {
                      buffId: 'buff_chr_0035_liino_normalskill_music_smile_vfx',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                    }),
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
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        1800,
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
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_audio_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        1800,
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
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        1961,
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
          ),
        ),
      ),
      scheduled(
        1862,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0035_liino_showhide_audio_fire',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        1961,
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
