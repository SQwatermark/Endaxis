/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */

import type { ActionGraphResourceDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import type { SkillDefinition } from '../../../packages/game-data-contract/src/skills';
import type { SkillBuffDefinition } from '../../../packages/game-data-contract/src/buffs';
import type { ComboSkillConditionDefinition } from '../../../packages/game-data-contract/src/operators';
import type { OperatorDefinition } from '../../../packages/game-data-contract/src/operators';
export const liinoChr_0035_liino_combo_skillActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_comboskill_ultskill_hit',
                blackboardAssignments: {
                  atb_return_duration: { kind: 'valueNode', nodeId: 'data_1' },
                  atb_return: { kind: 'valueNode', nodeId: 'data_2' },
                  time_duration: { kind: 'valueNode', nodeId: 'data_3' },
                  usp: { kind: 'valueNode', nodeId: 'data_4' },
                  atk_scale_2: { kind: 'valueNode', nodeId: 'data_5' },
                  radius: { kind: 'valueNode', nodeId: 'data_6' },
                  atk_scale: { kind: 'valueNode', nodeId: 'data_7' },
                  poise: { kind: 'valueNode', nodeId: 'data_8' },
                  input_angle: { kind: 'valueNode', nodeId: 'data_9' },
                  cam_angle: { kind: 'valueNode', nodeId: 'data_10' },
                  cam_duration: { kind: 'valueNode', nodeId: 'data_11' },
                  owner_mainchar_distance: { kind: 'valueNode', nodeId: 'data_12' },
                  owner_mainchar_alpha: { kind: 'valueNode', nodeId: 'data_13' },
                  normal_combo: { kind: 'valueNode', nodeId: 'data_14' },
                  remainingtime: { kind: 'valueNode', nodeId: 'data_15' },
                  combo_duration: { kind: 'valueNode', nodeId: 'data_16' },
                  time_ratio: { kind: 'valueNode', nodeId: 'data_17' },
                  talent_b: { kind: 'valueNode', nodeId: 'data_18' },
                  heal_value: { kind: 'valueNode', nodeId: 'data_19' },
                  heal_rate: { kind: 'valueNode', nodeId: 'data_20' },
                },
              },
            ],
            targets: { kind: 'fixed', target: 'caster' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      dealDamage_2: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_7' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          },
        },
        next: null,
      },
      changeResource_3: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_4' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: null,
      },
      heal_4: {
        action: {
          kind: 'heal',
          parameters: {
            target: 'controlledOperator',
            alwaysNext: true,
            tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
            amount: { kind: 'valueNode', nodeId: 'data_21' },
          },
        },
        next: 'changeResource_3',
      },
      storeSourceAttributeValue_5: {
        action: {
          kind: 'storeSourceAttributeValue',
          parameters: {
            attribute: { kind: 'specific', key: 'agility' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'valueNode', nodeId: 'data_19' },
            base: { kind: 'valueNode', nodeId: 'data_20' },
            targetKey: 'final_heal_value',
          },
        },
        next: 'heal_4',
      },
      dealDamage_6: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_5' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_8' },
          },
        },
        next: 'storeSourceAttributeValue_5',
      },
      createGlobalBuff_7: {
        action: {
          kind: 'createGlobalBuff',
          parameters: {
            globalBuffId: 'global_buff_liino_combo_atb_return',
            definition: {
              stackingType: 'stack',
              maxStackCount: 1,
              durationSeconds: { blackboardKey: 'duration' },
              applyIconDurationToBuffs: true,
              blackboard: { atb_return: 0, duration: 0 },
              children: [
                {
                  buffId: 'buff_chr_0035_liino_combo_atb_return',
                  blackboardAssignments: {
                    atb_return: { kind: 'valueNode', nodeId: 'data_2' },
                    duration: { kind: 'valueNode', nodeId: 'data_22' },
                  },
                },
              ],
            },
            source: 'caster',
            blackboardAssignments: {
              duration: { kind: 'valueNode', nodeId: 'data_1' },
              atb_return: { kind: 'valueNode', nodeId: 'data_2' },
            },
          },
        },
        next: null,
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_24' } },
        },
        next: 'createGlobalBuff_7',
      },
      finishBuffsById_9: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0035_liino_normalskill_music_animation_hitl',
              'buff_chr_0035_liino_normalskill_music_animation_hitr',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      inheritBuffById_10: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_normalskill_music_cd_uishow',
            inheritToNextSkillIds: ['chr_0035_liino_normal_skill_combo'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      inheritBuffById_11: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
            inheritToNextSkillIds: ['chr_0035_liino_normal_skill_combo'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: 'inheritBuffById_10',
      },
      inheritBuffById_12: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_normalskill_music_tag',
            inheritToNextSkillIds: ['chr_0035_liino_normal_skill_combo'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: 'inheritBuffById_11',
      },
      inheritBuffById_13: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_normalskill_music_damage',
            inheritToNextSkillIds: ['chr_0035_liino_normal_skill_combo'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: 'inheritBuffById_12',
      },
      triggerCustomAbilityEvent_14: {
        action: {
          kind: 'triggerCustomAbilityEvent',
          parameters: {
            eventName: 'liino_comboskill_end',
            eventParam: 0,
            target: 'caster',
            source: 'caster',
          },
        },
        next: null,
      },
      checkCondition_15: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_25' } },
        },
        next: 'triggerCustomAbilityEvent_14',
      },
      startTimeDilation_16: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.15 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            targets: [],
            abilityEntityTargets: [{ kind: 'ownerSpawned' }],
          },
        },
        next: null,
      },
      startTimeDilation_17: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.933 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          },
        },
        next: null,
      },
      checkCondition_18: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_26' } },
        },
        next: null,
      },
      inheritBuffById_19: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_attack',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_27' } },
        },
        next: null,
      },
      inheritBuffById_21: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_normal_skill_combo',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_22: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_normal_skill_combo',
            ],
          },
        },
        next: null,
      },
      ifElse_23: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_20' },
          whenTrue: { $sequence: 'inheritBuffById_21' },
          whenFalse: { $sequence: 'applyBuff_22' },
        },
        next: null,
      },
      ifElse_24: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_18' },
          whenTrue: { $sequence: 'inheritBuffById_19' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_23',
      },
      applyBuff_25: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      checkCondition_26: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_28' } },
        },
        next: null,
      },
      inheritBuffById_27: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_normal_skill_combo',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_28: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_normal_skill_combo',
            ],
          },
        },
        next: null,
      },
      ifElse_29: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_26' },
          whenTrue: { $sequence: 'inheritBuffById_27' },
          whenFalse: { $sequence: 'applyBuff_28' },
        },
        next: null,
      },
      applyBuff_30: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return_duration' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'time_duration' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_2' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'radius' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'input_angle' } },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'cam_angle' } },
      data_11: { type: 'number', expression: { kind: 'blackboard', key: 'cam_duration' } },
      data_12: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'owner_mainchar_distance' },
      },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'owner_mainchar_alpha' } },
      data_14: { type: 'number', expression: { kind: 'blackboard', key: 'normal_combo' } },
      data_15: { type: 'number', expression: { kind: 'blackboard', key: 'remainingtime' } },
      data_16: { type: 'number', expression: { kind: 'blackboard', key: 'combo_duration' } },
      data_17: { type: 'number', expression: { kind: 'blackboard', key: 'time_ratio' } },
      data_18: { type: 'number', expression: { kind: 'blackboard', key: 'talent_b' } },
      data_19: { type: 'number', expression: { kind: 'blackboard', key: 'heal_value' } },
      data_20: { type: 'number', expression: { kind: 'blackboard', key: 'heal_rate' } },
      data_21: { type: 'number', expression: { kind: 'blackboard', key: 'final_heal_value' } },
      data_22: { type: 'number', expression: { kind: 'blackboard', key: 'duration' } },
      data_23: { type: 'number', expression: { kind: 'blackboard', key: 'talent_b', fallback: 0 } },
      data_24: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_23' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_25: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_normalskill_music_tag'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_26: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_attack'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_27: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_28: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_29: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'caster',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/chr_0035_liino/UltSkillMusic'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_combo_skill: SkillDefinition = {
  key: 'chr_0035_liino_combo_skill',
  element: 'electric',
  blackboard: {
    atb_return: 5,
    atb_return_duration: 30,
    atk_scale: [0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 0.96, 1.02, 1.08, 1.16, 1.25, 1.35],
    atk_scale_2: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.93, 2.08, 2.25],
    cam_angle: 0,
    cam_duration: 0,
    combo_duration: 0,
    final_heal_value: 0,
    heal_rate: [72, 86.4, 100.8, 115.2, 122.4, 129.6, 136.8, 144, 151.2, 154.8, 158.4, 162],
    heal_value: [0.17, 0.2, 0.24, 0.27, 0.29, 0.3, 0.32, 0.34, 0.35, 0.36, 0.37, 0.38],
    input_angle: 0,
    normal_combo: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 5,
    radius: 4,
    remainingtime: 0,
    talent_b: 0,
    time_duration: 0,
    time_ratio: 0,
    usp: 20,
  },
  timelineBlockFrames: 99,
  naturalDurationFrames: 150,
  exclusiveFrame: 98,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 68,
        endFrame: 109,
        skillIds: ['chr_0035_liino_normal_skill', 'chr_0035_liino_normal_skill_combo'],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 9, endFrame: 13, sequence: { $sequence: 'dealDamage_2' } },
    { startFrame: 33, endFrame: 37, sequence: { $sequence: 'dealDamage_6' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'checkCondition_8' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'finishBuffsById_9' } },
    { startFrame: 0, endFrame: 78, sequence: { $sequence: 'inheritBuffById_13' } },
    { startFrame: 67, endFrame: 67, sequence: { $sequence: 'checkCondition_15' } },
    { startFrame: 0, endFrame: 7, sequence: { $sequence: 'startTimeDilation_16' } },
    { startFrame: 0, endFrame: 25, sequence: { $sequence: 'startTimeDilation_17' } },
    { startFrame: 0, endFrame: 68, sequence: { $sequence: 'ifElse_24' } },
    { startFrame: 0, endFrame: 64, sequence: { $sequence: 'applyBuff_25' } },
    { startFrame: 0, endFrame: 48, sequence: { $sequence: 'ifElse_29' } },
    { startFrame: 0, endFrame: 48, sequence: { $sequence: 'applyBuff_30' } },
  ],
  smartTarget: 'enemy',
  switchToBuffCast: {
    condition: { kind: 'conditionNode', nodeId: 'data_29' },
    asSkillCast: true,
    sequence: { $sequence: 'applyBuff_1' },
  },
  cooldownFrames: [300, 300, 300, 300, 300, 300, 300, 300, 270, 270, 270, 240],
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'comboSkill',
  actionGraph: liinoChr_0035_liino_combo_skillActionGraph,
};

export const liinoChr_0035_liino_attack1ActionGraph = {
  main: {
    nodes: {
      startTimeDilation_2: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.06 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'startTimeDilation_2' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_4: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_3',
      },
      reachSkillOperableBoundary_9: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0035_liino_attack2'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_attack1: SkillDefinition = {
  key: 'chr_0035_liino_attack1',
  element: 'electric',
  blackboard: {
    atk_scale: [0.094, 0.103, 0.112, 0.122, 0.131, 0.14, 0.15, 0.159, 0.168, 0.18, 0.194, 0.21],
  },
  timelineBlockFrames: 12,
  naturalDurationFrames: 103,
  exclusiveFrame: 18,
  offsetRecordFrame: 3,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 30,
        input: 'basicAttack',
        targetSkillId: 'chr_0035_liino_attack2',
      },
    ],
    allowedNextSkills: [{ startFrame: 12, endFrame: 30, skillIds: ['chr_0035_liino_attack2'] }],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 3, endFrame: 6, sequence: { $sequence: 'dealDamage_4' } },
    { startFrame: 7, endFrame: 11, sequence: { $sequence: 'dealDamage_4' } },
    { startFrame: 12, endFrame: 30, sequence: { $sequence: 'reachSkillOperableBoundary_9' } },
  ],
  timelineContinuationSkillId: 'chr_0035_liino_attack2',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: liinoChr_0035_liino_attack1ActionGraph,
};

export const liinoChr_0035_liino_attack2ActionGraph = {
  main: {
    nodes: {
      dealDamage_1: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['normalAttack'],
          },
        },
        next: null,
      },
      repeatEachTick_2: {
        action: {
          kind: 'repeatEachTick',
          parameters: {
            nativeChanneling: {
              target: { kind: 'fixed', target: 'enemy' },
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: 5,
              targetTriggerIntervalSeconds: 0.06,
            },
          },
          body: { $sequence: 'dealDamage_1' },
        },
        next: null,
      },
      reachSkillOperableBoundary_3: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0035_liino_attack3'] },
        },
        next: null,
      },
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_attack2: SkillDefinition = {
  actionGraph: liinoChr_0035_liino_attack2ActionGraph,
  key: 'chr_0035_liino_attack2',
  element: 'electric',
  blackboard: {
    atk_scale: [0.054, 0.059, 0.064, 0.07, 0.075, 0.08, 0.086, 0.091, 0.096, 0.103, 0.111, 0.12],
  },
  timelineBlockFrames: 20,
  naturalDurationFrames: 175,
  exclusiveFrame: 30,
  offsetRecordFrame: 7,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 38,
        input: 'basicAttack',
        targetSkillId: 'chr_0035_liino_attack3',
      },
    ],
    allowedNextSkills: [{ startFrame: 20, endFrame: 38, skillIds: ['chr_0035_liino_attack3'] }],
  },
  costFrame: 8,
  scheduledSequences: [
    { startFrame: 7, endFrame: 19, sequence: { $sequence: 'repeatEachTick_2' } },
    { startFrame: 20, endFrame: 38, sequence: { $sequence: 'reachSkillOperableBoundary_3' } },
  ],
  timelineContinuationSkillId: 'chr_0035_liino_attack3',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
};

export const liinoChr_0035_liino_attack3ActionGraph = {
  main: {
    nodes: {
      dealDamage_1: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['normalAttack'],
          },
        },
        next: null,
      },
      launchProjectile_2: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0035_liino_attack3_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale_2: 0.1 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_1' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'electric',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: null,
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_2' },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
      launchProjectile_7: {
        action: {
          kind: 'launchProjectile',
          parameters: { inheritActionBlackboard: false, finish: 'firstTickReach' },
          callbacks: [],
        },
        next: null,
      },
      applyBuff_14: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_attack' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_power_attack',
              'chr_0035_liino_normal_skill',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_13: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_attack',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_power_attack',
              'chr_0035_liino_normal_skill',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: 'inheritBuffById_13' },
          whenFalse: { $sequence: 'applyBuff_14' },
        },
        next: null,
      },
      applyBuff_18: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_17: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_fire',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_16: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_19: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_16' },
          whenTrue: { $sequence: 'inheritBuffById_17' },
          whenFalse: { $sequence: 'applyBuff_18' },
        },
        next: null,
      },
      applyBuff_22: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_21: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_23: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_20' },
          whenTrue: { $sequence: 'inheritBuffById_21' },
          whenFalse: { $sequence: 'applyBuff_22' },
        },
        next: null,
      },
      applyBuff_26: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_25: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio_fire',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_24: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_27: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_24' },
          whenTrue: { $sequence: 'inheritBuffById_25' },
          whenFalse: { $sequence: 'applyBuff_26' },
        },
        next: null,
      },
      reachSkillOperableBoundary_28: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0035_liino_attack4'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_attack'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_fire'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio_fire'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_attack3: SkillDefinition = {
  key: 'chr_0035_liino_attack3',
  element: 'electric',
  blackboard: {
    atk_scale: [0.22, 0.24, 0.26, 0.29, 0.31, 0.33, 0.35, 0.37, 0.4, 0.42, 0.46, 0.5],
    atk_scale_2: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.02, 0.02, 0.02, 0.02],
  },
  timelineBlockFrames: 24,
  naturalDurationFrames: 163,
  exclusiveFrame: 27,
  offsetRecordFrame: 12,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 44,
        input: 'basicAttack',
        targetSkillId: 'chr_0035_liino_attack4',
      },
    ],
    allowedNextSkills: [{ startFrame: 24, endFrame: 44, skillIds: ['chr_0035_liino_attack4'] }],
  },
  costFrame: 12,
  scheduledSequences: [
    { startFrame: 12, endFrame: 21, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 12, endFrame: 12, sequence: { $sequence: 'launchProjectile_2' } },
    { startFrame: 14, endFrame: 14, sequence: { $sequence: 'launchProjectile_2' } },
    { startFrame: 16, endFrame: 16, sequence: { $sequence: 'launchProjectile_2' } },
    { startFrame: 18, endFrame: 18, sequence: { $sequence: 'launchProjectile_2' } },
    { startFrame: 20, endFrame: 20, sequence: { $sequence: 'launchProjectile_2' } },
    { startFrame: 12, endFrame: 12, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 14, endFrame: 14, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 16, endFrame: 16, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 18, endFrame: 18, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 20, endFrame: 20, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 0, endFrame: 34, sequence: { $sequence: 'ifElse_15' } },
    { startFrame: 2, endFrame: 33, sequence: { $sequence: 'ifElse_19' } },
    { startFrame: 0, endFrame: 33, sequence: { $sequence: 'ifElse_23' } },
    { startFrame: 2, endFrame: 32, sequence: { $sequence: 'ifElse_27' } },
    { startFrame: 24, endFrame: 44, sequence: { $sequence: 'reachSkillOperableBoundary_28' } },
  ],
  timelineContinuationSkillId: 'chr_0035_liino_attack4',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: liinoChr_0035_liino_attack3ActionGraph,
};

export const liinoChr_0035_liino_attack4ActionGraph = {
  main: {
    nodes: {
      launchProjectile_1: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0035_liino_attack4_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0.1, poise: 5 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_1' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'electric',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: null,
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale' },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
      launchProjectile_11: {
        action: {
          kind: 'launchProjectile',
          parameters: { inheritActionBlackboard: false, finish: 'firstTickReach' },
          callbacks: [],
        },
        next: null,
      },
      applyBuff_23: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_attack' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_power_attack',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_22: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_attack',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_21: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_24: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_21' },
          whenTrue: { $sequence: 'inheritBuffById_22' },
          whenFalse: { $sequence: 'applyBuff_23' },
        },
        next: null,
      },
      applyBuff_27: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_26: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_fire',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_25: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_28: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_25' },
          whenTrue: { $sequence: 'inheritBuffById_26' },
          whenFalse: { $sequence: 'applyBuff_27' },
        },
        next: null,
      },
      applyBuff_31: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_30: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_29: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_32: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_29' },
          whenTrue: { $sequence: 'inheritBuffById_30' },
          whenFalse: { $sequence: 'applyBuff_31' },
        },
        next: null,
      },
      applyBuff_35: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_34: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio_fire',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_33: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_36: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_33' },
          whenTrue: { $sequence: 'inheritBuffById_34' },
          whenFalse: { $sequence: 'applyBuff_35' },
        },
        next: null,
      },
      reachSkillOperableBoundary_37: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0035_liino_attack5'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_attack'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_fire'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio_fire'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_attack4: SkillDefinition = {
  key: 'chr_0035_liino_attack4',
  element: 'electric',
  blackboard: {
    atk_scale: [0.036, 0.04, 0.043, 0.047, 0.05, 0.054, 0.058, 0.061, 0.065, 0.069, 0.075, 0.081],
  },
  timelineBlockFrames: 18,
  naturalDurationFrames: 212,
  exclusiveFrame: 56,
  offsetRecordFrame: 5,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 33,
        input: 'basicAttack',
        targetSkillId: 'chr_0035_liino_attack5',
      },
    ],
    allowedNextSkills: [{ startFrame: 18, endFrame: 33, skillIds: ['chr_0035_liino_attack5'] }],
  },
  costFrame: 8,
  scheduledSequences: [
    { startFrame: 5, endFrame: 5, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 7, endFrame: 7, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 10, endFrame: 10, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 13, endFrame: 13, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 16, endFrame: 16, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 5, endFrame: 5, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 7, endFrame: 7, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 10, endFrame: 10, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 13, endFrame: 13, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 16, endFrame: 16, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 5, endFrame: 5, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 7, endFrame: 7, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 10, endFrame: 10, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 13, endFrame: 13, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 16, endFrame: 16, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 5, endFrame: 5, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 7, endFrame: 7, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 10, endFrame: 10, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 13, endFrame: 13, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 16, endFrame: 16, sequence: { $sequence: 'launchProjectile_11' } },
    { startFrame: 0, endFrame: 71, sequence: { $sequence: 'ifElse_24' } },
    { startFrame: 0, endFrame: 70, sequence: { $sequence: 'ifElse_28' } },
    { startFrame: 0, endFrame: 64, sequence: { $sequence: 'ifElse_32' } },
    { startFrame: 0, endFrame: 63, sequence: { $sequence: 'ifElse_36' } },
    { startFrame: 18, endFrame: 33, sequence: { $sequence: 'reachSkillOperableBoundary_37' } },
  ],
  timelineContinuationSkillId: 'chr_0035_liino_attack5',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: liinoChr_0035_liino_attack4ActionGraph,
};

export const liinoChr_0035_liino_attack5ActionGraph = {
  main: {
    nodes: {
      changeResource_1: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_1' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          },
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'changeResource_1' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      startTimeDilation_4: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.1 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['caster'],
          },
        },
        next: 'ifElse_3',
      },
      ifElse_5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'startTimeDilation_4' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      once_6: {
        action: { kind: 'once', parameters: {}, body: { $sequence: null } },
        next: 'ifElse_5',
      },
      dealDamage_7: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_3' },
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: { kind: 'valueNode', nodeId: 'data_4' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'once_6',
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      inheritBuffById_9: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_attack',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_power_attack',
              'chr_0035_liino_normal_skill',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_10: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_attack' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_power_attack',
              'chr_0035_liino_normal_skill',
            ],
          },
        },
        next: null,
      },
      ifElse_11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_8' },
          whenTrue: { $sequence: 'inheritBuffById_9' },
          whenFalse: { $sequence: 'applyBuff_10' },
        },
        next: null,
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      inheritBuffById_13: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_fire',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_14: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      ifElse_15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: 'inheritBuffById_13' },
          whenFalse: { $sequence: 'applyBuff_14' },
        },
        next: null,
      },
      checkCondition_16: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      inheritBuffById_17: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_18: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
          },
        },
        next: null,
      },
      ifElse_19: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_16' },
          whenTrue: { $sequence: 'inheritBuffById_17' },
          whenFalse: { $sequence: 'applyBuff_18' },
        },
        next: null,
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      inheritBuffById_21: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio_fire',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_22: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      ifElse_23: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_20' },
          whenTrue: { $sequence: 'inheritBuffById_21' },
          whenFalse: { $sequence: 'applyBuff_22' },
        },
        next: null,
      },
      reachSkillOperableBoundary_24: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0035_liino_attack1'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
      data_2: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_attack'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_fire'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio_fire'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_attack5: SkillDefinition = {
  key: 'chr_0035_liino_attack5',
  element: 'electric',
  blackboard: {
    atb: 20,
    atk_scale: [0.45, 0.49, 0.53, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.92, 1],
    poise: 19,
  },
  timelineBlockFrames: 28,
  naturalDurationFrames: 173,
  exclusiveFrame: 46,
  offsetRecordFrame: 17,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 49,
        input: 'basicAttack',
        targetSkillId: 'chr_0035_liino_attack1',
      },
    ],
    allowedNextSkills: [{ startFrame: 28, endFrame: 49, skillIds: ['chr_0035_liino_attack1'] }],
  },
  costFrame: 12,
  scheduledSequences: [
    { startFrame: 17, endFrame: 24, sequence: { $sequence: 'dealDamage_7' } },
    { startFrame: 0, endFrame: 25, sequence: { $sequence: 'ifElse_11' } },
    { startFrame: 5, endFrame: 23, sequence: { $sequence: 'ifElse_15' } },
    { startFrame: 0, endFrame: 23, sequence: { $sequence: 'ifElse_19' } },
    { startFrame: 4, endFrame: 20, sequence: { $sequence: 'ifElse_23' } },
    { startFrame: 28, endFrame: 49, sequence: { $sequence: 'reachSkillOperableBoundary_24' } },
  ],
  timelineContinuationSkillId: 'chr_0035_liino_attack1',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: liinoChr_0035_liino_attack5ActionGraph,
};

export const liinoChr_0035_liino_power_attackActionGraph = {
  main: {
    nodes: {
      dealDamage_1: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
            tags: ['normalAttack', 'powerAttack'],
          },
        },
        next: null,
      },
      repeatEachTick_2: {
        action: {
          kind: 'repeatEachTick',
          parameters: {
            nativeChanneling: {
              target: { kind: 'inputTarget' },
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: 3,
              targetTriggerIntervalSeconds: 0.1,
            },
          },
          body: { $sequence: 'dealDamage_1' },
        },
        next: null,
      },
      dealDamage_3: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            calculation: 'breakingAttack',
            calculationMultiplier: 0.7,
            tags: ['normalAttack', 'powerAttack'],
          },
        },
        next: null,
      },
      gainFinisherSp_4: {
        action: { kind: 'gainFinisherSp', parameters: { factor: 1, recipient: 'team' } },
        next: 'dealDamage_3',
      },
      startTimeDilation_5: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.2 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['caster'],
          },
        },
        next: null,
      },
      startTimeDilation_6: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.35 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.75,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.3,
                  value: 0.75,
                  inTangent: -0.01084917,
                  outTangent: -0.01084917,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.4556158,
                  value: 0.4247887,
                  inTangent: -6.50331,
                  outTangent: -6.50331,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.5,
                  value: 0.1,
                  inTangent: -7.317658,
                  outTangent: -7.317658,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['caster'],
          },
        },
        next: null,
      },
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_full_immune_medium' }],
            targets: { kind: 'owner' },
            source: { kind: 'owner' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      applyBuff_8: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_power_attack_disable_cast_skill' }],
            targets: { kind: 'owner' },
            source: { kind: 'owner' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      inheritBuffById_10: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_attack',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_11: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_attack' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      inheritBuffById_13: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_attack',
            inheritToNextSkillIds: [
              'chr_0035_liino_power_attack',
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_combo_skill',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_14: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_attack' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_power_attack',
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_combo_skill',
            ],
          },
        },
        next: null,
      },
      ifElse_15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: 'inheritBuffById_13' },
          whenFalse: { $sequence: 'applyBuff_14' },
        },
        next: null,
      },
      ifElse_16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'inheritBuffById_10' },
          whenFalse: { $sequence: 'applyBuff_11' },
        },
        next: 'ifElse_15',
      },
      applyBuff_17: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      checkCondition_18: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      inheritBuffById_19: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_20: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
          },
        },
        next: null,
      },
      ifElse_21: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_18' },
          whenTrue: { $sequence: 'inheritBuffById_19' },
          whenFalse: { $sequence: 'applyBuff_20' },
        },
        next: null,
      },
      applyBuff_22: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_attack'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_power_attack: SkillDefinition = {
  key: 'chr_0035_liino_power_attack',
  element: 'electric',
  blackboard: { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
  timelineBlockFrames: 69,
  naturalDurationFrames: 219,
  exclusiveFrame: 68,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 58,
        endFrame: 74,
        skillIds: [
          'chr_0035_liino_normal_skill',
          'chr_0035_liino_combo_skill',
          'chr_0035_liino_power_attack',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 12, endFrame: 24, sequence: { $sequence: 'repeatEachTick_2' } },
    { startFrame: 34, endFrame: 35, sequence: { $sequence: 'gainFinisherSp_4' } },
    { startFrame: 31, endFrame: 31, sequence: { $sequence: 'startTimeDilation_5' } },
    { startFrame: 44, endFrame: 60, sequence: { $sequence: 'startTimeDilation_6' } },
    { startFrame: 0, endFrame: 68, sequence: { $sequence: 'applyBuff_7' } },
    { startFrame: 0, endFrame: 58, sequence: { $sequence: 'applyBuff_8' } },
    { startFrame: 0, endFrame: 50, sequence: { $sequence: 'ifElse_16' } },
    { startFrame: 3, endFrame: 49, sequence: { $sequence: 'applyBuff_17' } },
    { startFrame: 0, endFrame: 50, sequence: { $sequence: 'ifElse_21' } },
    { startFrame: 3, endFrame: 49, sequence: { $sequence: 'applyBuff_22' } },
  ],
  skillType: 'finisher',
  levelSource: 'basicAttack',
  nativeSkillType: 'breakingAttack',
  actionGraph: liinoChr_0035_liino_power_attackActionGraph,
};

export const liinoChr_0035_liino_plunging_attack_endActionGraph = {
  main: {
    nodes: {
      dealDamage_1: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['normalAttack', 'plungingAttack'],
          },
        },
        next: null,
      },
      dealDamage_2: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack', 'plungingAttack'],
          },
        },
        next: null,
      },
      repeatEachTick_3: {
        action: {
          kind: 'repeatEachTick',
          parameters: {
            nativeChanneling: {
              target: { kind: 'fixed', target: 'enemy' },
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: 1,
              targetTriggerIntervalSeconds: 0.033,
            },
          },
          body: { $sequence: 'dealDamage_2' },
        },
        next: null,
      },
      launchProjectile_4: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                actionGraph: { main: { nodes: {} }, macros: {} },
                skillId: 'chr_0035_liino_plunging_attack_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0.1, poise: 5 },
                scheduledSequences: [{ startFrame: 0, endFrame: 0, sequence: { $sequence: null } }],
              },
            },
          ],
        },
        next: null,
      },
      launchProjectile_5: {
        action: {
          kind: 'launchProjectile',
          parameters: { inheritActionBlackboard: true, finish: 'firstTickReach' },
          callbacks: [],
        },
        next: null,
      },
      applyBuff_12: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_attack' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_power_attack',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_11: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_attack',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'inheritBuffById_11' },
          whenFalse: { $sequence: 'applyBuff_12' },
        },
        next: null,
      },
      applyBuff_14: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      applyBuff_17: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_16: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_15: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_18: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_15' },
          whenTrue: { $sequence: 'inheritBuffById_16' },
          whenFalse: { $sequence: 'applyBuff_17' },
        },
        next: null,
      },
      applyBuff_19: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_2' } },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_attack'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_plunging_attack_end: SkillDefinition = {
  key: 'chr_0035_liino_plunging_attack_end',
  element: 'electric',
  blackboard: {
    atk_scale: [0.64, 0.7, 0.77, 0.83, 0.9, 0.96, 1.02, 1.09, 1.15, 1.23, 1.33, 1.44],
    atk_scale_2: [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
  },
  timelineBlockFrames: 21,
  naturalDurationFrames: 121,
  exclusiveFrame: 20,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [{ startFrame: 11, endFrame: 20, skillIds: ['chr_0012_avywen_attack1'] }],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 2, endFrame: 2, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 8, endFrame: 9, sequence: { $sequence: 'repeatEachTick_3' } },
    { startFrame: 2, endFrame: 2, sequence: { $sequence: 'launchProjectile_4' } },
    { startFrame: 5, endFrame: 5, sequence: { $sequence: 'launchProjectile_5' } },
    { startFrame: 8, endFrame: 8, sequence: { $sequence: 'launchProjectile_5' } },
    { startFrame: 3, endFrame: 3, sequence: { $sequence: 'launchProjectile_5' } },
    { startFrame: 6, endFrame: 6, sequence: { $sequence: 'launchProjectile_5' } },
    { startFrame: 9, endFrame: 9, sequence: { $sequence: 'launchProjectile_5' } },
    { startFrame: 0, endFrame: 19, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 0, endFrame: 19, sequence: { $sequence: 'applyBuff_14' } },
    { startFrame: 0, endFrame: 17, sequence: { $sequence: 'ifElse_18' } },
    { startFrame: 0, endFrame: 17, sequence: { $sequence: 'applyBuff_19' } },
  ],
  skillType: 'plungingAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: liinoChr_0035_liino_plunging_attack_endActionGraph,
};

export const liinoChr_0035_liino_normal_skillActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
              'buff_chr_0035_liino_normalskill_music_animation_musicloop',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      finishBuffsById_2: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
              'buff_chr_0035_liino_normalskill_music_animation_musicloop',
              'buff_chr_0035_liino_normalskill_music_animation_hitl',
              'buff_chr_0035_liino_normalskill_music_animation_hitr',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      interruptCurrentSkill_3: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      launchProjectile_4: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0035_liino_normal_skill_projhit_start_vfx',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0.1, hit_cnt: 0, poise: 5 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'findTargets_5' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      launchProjectile_3: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit_02',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      launchProjectile_2: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                            targets: { kind: 'context', contextKey: 'smart_target' },
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit_02',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                        },
                        next: null,
                      },
                      ifElse_4: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'launchProjectile_2' },
                          whenFalse: { $sequence: 'launchProjectile_3' },
                        },
                        next: null,
                      },
                      findTargets_5: {
                        action: {
                          kind: 'findTargets',
                          parameters: {
                            owner: { kind: 'source' },
                            query: { kind: 'mainTarget', owner: { kind: 'source' } },
                            saveToContextKey: 'smart_target',
                          },
                        },
                        next: 'ifElse_4',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'entityCountCompare',
                          target: { kind: 'context', key: 'smart_target' },
                          containsHittableTarget: false,
                          excludeDeadEntity: false,
                          operator: 'greaterOrEqual',
                          value: 1,
                        },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
      launchProjectile_5: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0035_liino_normal_skill_projhit_start',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0.1, hit_cnt: 0, poise: 5 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'findTargets_5' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      launchProjectile_3: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            features: ['canBreakWeakness'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      launchProjectile_2: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                            targets: { kind: 'context', contextKey: 'smart_target' },
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            features: ['canBreakWeakness'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                        },
                        next: null,
                      },
                      ifElse_4: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'launchProjectile_2' },
                          whenFalse: { $sequence: 'launchProjectile_3' },
                        },
                        next: null,
                      },
                      findTargets_5: {
                        action: {
                          kind: 'findTargets',
                          parameters: {
                            owner: { kind: 'source' },
                            query: { kind: 'mainTarget', owner: { kind: 'source' } },
                            saveToContextKey: 'smart_target',
                          },
                        },
                        next: 'ifElse_4',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'entityCountCompare',
                          target: { kind: 'context', key: 'smart_target' },
                          containsHittableTarget: false,
                          excludeDeadEntity: false,
                          operator: 'greaterOrEqual',
                          value: 1,
                        },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: 'launchProjectile_4',
      },
      launchProjectile_6: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0035_liino_normal_skill_projhit_start_vfx04',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0.1, hit_cnt: 0, poise: 5 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'findTargets_5' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      launchProjectile_3: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit_02',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      launchProjectile_2: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                            targets: { kind: 'context', contextKey: 'smart_target' },
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit_02',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                        },
                        next: null,
                      },
                      ifElse_4: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'launchProjectile_2' },
                          whenFalse: { $sequence: 'launchProjectile_3' },
                        },
                        next: null,
                      },
                      findTargets_5: {
                        action: {
                          kind: 'findTargets',
                          parameters: {
                            owner: { kind: 'source' },
                            query: { kind: 'mainTarget', owner: { kind: 'source' } },
                            saveToContextKey: 'smart_target',
                          },
                        },
                        next: 'ifElse_4',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'entityCountCompare',
                          target: { kind: 'context', key: 'smart_target' },
                          containsHittableTarget: false,
                          excludeDeadEntity: false,
                          operator: 'greaterOrEqual',
                          value: 1,
                        },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
      launchProjectile_7: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0035_liino_normal_skill_projhit_start_vfx03',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0.1, hit_cnt: 0, poise: 5 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'findTargets_5' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      launchProjectile_3: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit_02',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      launchProjectile_2: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                            targets: { kind: 'context', contextKey: 'smart_target' },
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit_02',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                        },
                        next: null,
                      },
                      ifElse_4: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'launchProjectile_2' },
                          whenFalse: { $sequence: 'launchProjectile_3' },
                        },
                        next: null,
                      },
                      findTargets_5: {
                        action: {
                          kind: 'findTargets',
                          parameters: {
                            owner: { kind: 'source' },
                            query: { kind: 'mainTarget', owner: { kind: 'source' } },
                            saveToContextKey: 'smart_target',
                          },
                        },
                        next: 'ifElse_4',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'entityCountCompare',
                          target: { kind: 'context', key: 'smart_target' },
                          containsHittableTarget: false,
                          excludeDeadEntity: false,
                          operator: 'greaterOrEqual',
                          value: 1,
                        },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: 'launchProjectile_6',
      },
      launchProjectile_9: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0035_liino_normal_skill_projhit_start_vfx02',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0.1, hit_cnt: 0, poise: 5 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'findTargets_5' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      launchProjectile_3: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit_02',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      launchProjectile_2: {
                        action: {
                          kind: 'launchProjectile',
                          parameters: {
                            inheritActionBlackboard: true,
                            entityInitialValues: {},
                            finish: 'firstTickBlock',
                            recycleDelaySeconds: 0.133333340287209,
                            targets: { kind: 'context', contextKey: 'smart_target' },
                          },
                          callbacks: [
                            {
                              event: 'block',
                              skill: {
                                skillId: 'chr_0035_liino_normal_skill_projhit_02',
                                nativeSkillType: 'normalSkill',
                                naturalDurationFrames: 4,
                                castResource: {
                                  costFrame: 0,
                                  cooldownSeconds: 0,
                                  maxChargeTime: 1,
                                  cost: {
                                    resource: 'ultimateEnergy',
                                    value: 0,
                                    availabilityThreshold: 0,
                                  },
                                },
                                blackboard: { atk_scale: 0.1, hit_cnt: 1, poise: 2 },
                                scheduledSequences: [
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                  {
                                    startFrame: 0,
                                    endFrame: 4,
                                    sequence: { $sequence: 'dealDamage_1' },
                                  },
                                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                                ],
                                actionGraph: {
                                  main: {
                                    nodes: {
                                      dealDamage_1: {
                                        action: {
                                          kind: 'dealDamage',
                                          parameters: {
                                            damageType: 'electric',
                                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                            tags: ['normalSkill'],
                                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                          },
                                        },
                                        next: null,
                                      },
                                    },
                                    dataNodes: {
                                      data_1: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'atk_scale' },
                                      },
                                      data_2: {
                                        type: 'number',
                                        expression: { kind: 'blackboard', key: 'poise' },
                                      },
                                    },
                                  },
                                  macros: {},
                                },
                              },
                            },
                          ],
                        },
                        next: null,
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                        },
                        next: null,
                      },
                      ifElse_4: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'launchProjectile_2' },
                          whenFalse: { $sequence: 'launchProjectile_3' },
                        },
                        next: null,
                      },
                      findTargets_5: {
                        action: {
                          kind: 'findTargets',
                          parameters: {
                            owner: { kind: 'source' },
                            query: { kind: 'mainTarget', owner: { kind: 'source' } },
                            saveToContextKey: 'smart_target',
                          },
                        },
                        next: 'ifElse_4',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'entityCountCompare',
                          target: { kind: 'context', key: 'smart_target' },
                          containsHittableTarget: false,
                          excludeDeadEntity: false,
                          operator: 'greaterOrEqual',
                          value: 1,
                        },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: 'launchProjectile_4',
      },
      applyBuff_10: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_normalskill_music_cd_uishow' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0035_liino_combo_skill'],
          },
        },
        next: null,
      },
      jumpTimeline_11: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 1967 },
          condition: { $sequence: null },
        },
        next: null,
      },
      adjustSkillCooldown_12: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0035_liino_normal_skill' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: 'jumpTimeline_11',
      },
      finishBuffsById_13: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
              'buff_chr_0035_liino_normalskill_music_animation_musicloop',
              'buff_chr_0035_liino_normalskill_music_cd_uishow',
            ],
            reason: 'other',
          },
        },
        next: 'adjustSkillCooldown_12',
      },
      applyBuff_14: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_normalskill_music_cry_vfx' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'finishBuffsById_13',
      },
      checkCondition_15: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_14',
      },
      listenForCombatEvents_16: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0035_liino_normal_skill.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_15' },
              },
            ],
          },
        },
        next: null,
      },
      finishBuffsById_18: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
              'buff_chr_0035_liino_normalskill_music_animation_musicloop',
              'buff_chr_0035_liino_normalskill_music_cd_uishow',
            ],
            reason: 'other',
          },
        },
        next: 'jumpTimeline_11',
      },
      checkCondition_19: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'finishBuffsById_18',
      },
      listenForCombatEvents_20: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0035_liino_normal_skill.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_19' },
              },
            ],
          },
        },
        next: null,
      },
      calculateActionValue_21: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'normalskill_frame',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_4' },
            right: { kind: 'valueNode', nodeId: 'data_5' },
          },
        },
        next: null,
      },
      storeCurrentTimelineFrame_22: {
        action: { kind: 'storeCurrentTimelineFrame', parameters: { outputKey: 'music_loop' } },
        next: 'calculateActionValue_21',
      },
      repeatEachTick_23: {
        action: {
          kind: 'repeatEachTick',
          parameters: { nativeTickInterval: { executeEachFrame: true, intervalSeconds: 0.1 } },
          body: { $sequence: 'storeCurrentTimelineFrame_22' },
        },
        next: null,
      },
      applyBuff_24: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
                copiedBlackboardAssignments: {
                  music_frame: 'normalskill_frame',
                  heal_rate: 'heal_rate',
                  heal_value: 'heal_value',
                  atk_scale_2: 'atk_scale_2',
                  hit_tigger: 'atk_trigger',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_normal_skill_combo',
            ],
          },
        },
        next: null,
      },
      aura_25: {
        action: {
          kind: 'aura',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            buffs: [{ buffId: 'buff_chr_0035_liino_normalskill_spelllnfliction_check' }],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: null },
        },
        next: 'applyBuff_24',
      },
      applyBuff_26: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_normalskill_music_damage',
                copiedBlackboardAssignments: {
                  vfx_music_duration: 'music_duration',
                  atk_scale: 'atk_scale_3',
                  heal_value: 'heal_value',
                  heal_rate: 'heal_rate',
                },
              },
            ],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0035_liino_combo_skill'],
          },
        },
        next: null,
      },
      applyBuff_27: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_normalskill_music_tag',
                copiedBlackboardAssignments: {
                  duration: 'music_duration',
                  atk_up: 'atk_up',
                  healtaken_rate: 'healtaken_rate',
                  shelter: 'shelter',
                  shelter_duration: 'shelter_duration',
                  talent_a: 'talent_a',
                },
              },
            ],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0035_liino_combo_skill'],
          },
        },
        next: 'applyBuff_26',
      },
      applyBuff_30: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_29: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_28: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      applyBuff_33: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_attack' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_32: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_attack',
            inheritToNextSkillIds: [
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_31: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      ifElse_34: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_31' },
          whenTrue: { $sequence: 'inheritBuffById_32' },
          whenFalse: { $sequence: 'applyBuff_33' },
        },
        next: null,
      },
      ifElse_35: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_28' },
          whenTrue: { $sequence: 'inheritBuffById_29' },
          whenFalse: { $sequence: 'applyBuff_30' },
        },
        next: 'ifElse_34',
      },
      applyBuff_36: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      applyBuff_39: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_38: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_37: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      ifElse_40: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_37' },
          whenTrue: { $sequence: 'inheritBuffById_38' },
          whenFalse: { $sequence: 'applyBuff_39' },
        },
        next: null,
      },
      applyBuff_41: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      changeResource_43: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_9' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'skill',
          },
        },
        next: null,
      },
      checkCondition_44: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: 'changeResource_43',
      },
      finishBuffsById_45: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0035_liino_potential_enterfight'],
            reason: 'other',
          },
        },
        next: 'checkCondition_44',
      },
      checkCondition_42: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: null,
      },
      ifElse_46: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_42' },
          whenTrue: { $sequence: 'finishBuffsById_45' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      gainSquadUltimateEnergyFromSkillCost_47: {
        action: { kind: 'gainSquadUltimateEnergyFromSkillCost', parameters: { coefficient: 1 } },
        next: null,
      },
      checkCondition_48: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: 'gainSquadUltimateEnergyFromSkillCost_47',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'set_cd' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0035_liino_normalskill_end_active'],
        },
      },
      data_3: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0035_liino_normalskill_end'] },
      },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'music_loop' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'frame_radio' } },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_attack'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'potential_atb_return' } },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_potential_enterfight'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_normal_skill: SkillDefinition = {
  key: 'chr_0035_liino_normal_skill',
  element: 'electric',
  blackboard: {
    atb_return: 0,
    atk_scale: [0.18, 0.2, 0.21, 0.23, 0.25, 0.27, 0.28, 0.3, 0.32, 0.34, 0.37, 0.4],
    atk_scale_2: [0.09, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.2],
    atk_scale_3: [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    atk_trigger: 10,
    atk_up: [0.06, 0.06, 0.06, 0.07, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1],
    frame_radio: 30,
    heal_rate: [18, 21.6, 25.2, 28.8, 30.6, 32.4, 34.2, 36, 37.8, 38.7, 39.6, 40.5],
    heal_value: [0.04, 0.05, 0.06, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.09, 0.09],
    healtaken_rate: 0,
    music_duration: 60,
    music_loop: 0,
    normalskill_frame: 0,
    poise: 0.5,
    potential_atb_return: 0,
    set_cd: 3,
    shelter: 0,
    shelter_duration: 0,
    talent_a: 0,
    talent_b: 0,
  },
  timelineBlockFrames: 50,
  naturalDurationFrames: 2100,
  exclusiveFrame: 1821,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 50,
        endFrame: 1872,
        skillIds: ['chr_0035_liino_combo_skill', 'chr_0035_liino_normal_skill_end'],
      },
      {
        startFrame: 1959,
        endFrame: 2092,
        skillIds: ['chr_0035_liino_combo_skill', 'chr_0035_liino_normal_skill_end'],
      },
      {
        startFrame: 1817,
        endFrame: 1872,
        skillIds: [
          'chr_0035_liino_combo_skill',
          'chr_0035_liino_normal_skill',
          'chr_0035_liino_power_attack',
        ],
      },
      {
        startFrame: 2024,
        endFrame: 2092,
        skillIds: [
          'chr_0035_liino_combo_skill',
          'chr_0035_liino_normal_skill',
          'chr_0035_liino_power_attack',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 1691, endFrame: 1694, sequence: { $sequence: 'finishBuffsById_1' } },
    { startFrame: 1967, endFrame: 1967, sequence: { $sequence: 'finishBuffsById_2' } },
    { startFrame: 1929, endFrame: 1931, sequence: { $sequence: 'interruptCurrentSkill_3' } },
    { startFrame: 12, endFrame: 12, sequence: { $sequence: 'launchProjectile_5' } },
    { startFrame: 16, endFrame: 16, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 14, endFrame: 14, sequence: { $sequence: 'launchProjectile_9' } },
    { startFrame: 0, endFrame: 1815, sequence: { $sequence: 'applyBuff_10' } },
    { startFrame: 90, endFrame: 1815, sequence: { $sequence: 'listenForCombatEvents_16' } },
    { startFrame: 90, endFrame: 1815, sequence: { $sequence: 'listenForCombatEvents_20' } },
    { startFrame: 45, endFrame: 1691, sequence: { $sequence: 'repeatEachTick_23' } },
    { startFrame: 45, endFrame: 1691, sequence: { $sequence: 'aura_25' } },
    { startFrame: 15, endFrame: 1815, sequence: { $sequence: 'applyBuff_27' } },
    { startFrame: 0, endFrame: 1804, sequence: { $sequence: 'ifElse_35' } },
    { startFrame: 6, endFrame: 1804, sequence: { $sequence: 'applyBuff_36' } },
    { startFrame: 0, endFrame: 1804, sequence: { $sequence: 'ifElse_40' } },
    { startFrame: 6, endFrame: 1804, sequence: { $sequence: 'applyBuff_41' } },
    { startFrame: 0, endFrame: 2, sequence: { $sequence: 'ifElse_46' } },
    { startFrame: 15, endFrame: 18, sequence: { $sequence: 'checkCondition_48' } },
  ],
  costs: [{ resource: 'sp', value: 25 }],
  timelineBlockFollowUpSkillId: 'chr_0035_liino_normal_skill_end',
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: liinoChr_0035_liino_normal_skillActionGraph,
};

export const liinoChr_0035_liino_normal_skill_comboActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
              'buff_chr_0035_liino_normalskill_music_animation_musicloop',
              'buff_chr_0035_liino_normalskill_music_animation_hitl',
              'buff_chr_0035_liino_normalskill_music_animation_hitr',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      jumpTimeline_2: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 1938 },
          condition: { $sequence: null },
        },
        next: null,
      },
      interruptCurrentSkill_3: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      adjustSkillCooldown_5: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0035_liino_normal_skill' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: 'jumpTimeline_2',
      },
      finishBuffsById_6: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
              'buff_chr_0035_liino_normalskill_music_animation_musicloop',
              'buff_chr_0035_liino_normalskill_music_cd_uishow',
            ],
            reason: 'other',
          },
        },
        next: 'adjustSkillCooldown_5',
      },
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_normalskill_music_cry_vfx' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'finishBuffsById_6',
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_7',
      },
      listenForCombatEvents_9: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0035_liino_normal_skill_combo.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_8' },
              },
            ],
          },
        },
        next: null,
      },
      finishBuffsById_11: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
              'buff_chr_0035_liino_normalskill_music_animation_musicloop',
              'buff_chr_0035_liino_normalskill_music_cd_uishow',
            ],
            reason: 'other',
          },
        },
        next: 'jumpTimeline_2',
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'finishBuffsById_11',
      },
      listenForCombatEvents_13: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0035_liino_normal_skill_combo.actionGroupData.timelineActions[7]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_12' },
              },
            ],
          },
        },
        next: null,
      },
      storeCurrentTimelineFrame_15: {
        action: { kind: 'storeCurrentTimelineFrame', parameters: { outputKey: 'music_loop' } },
        next: null,
      },
      repeatEachTick_16: {
        action: {
          kind: 'repeatEachTick',
          parameters: { nativeTickInterval: { executeEachFrame: true, intervalSeconds: 0.1 } },
          body: { $sequence: 'storeCurrentTimelineFrame_15' },
        },
        next: null,
      },
      inheritBuffById_17: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_normalskill_music_cd_uishow',
            inheritToNextSkillIds: ['chr_0035_liino_combo_skill'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      inheritBuffById_18: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_normalskill_spelllnfliction_extraattack',
            inheritToNextSkillIds: ['chr_0035_liino_combo_skill'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: 'inheritBuffById_17',
      },
      inheritBuffById_19: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_normalskill_music_damage',
            inheritToNextSkillIds: ['chr_0035_liino_combo_skill'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: 'inheritBuffById_18',
      },
      inheritBuffById_20: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_normalskill_music_tag',
            inheritToNextSkillIds: ['chr_0035_liino_combo_skill'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: 'inheritBuffById_19',
      },
      applyBuff_23: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0035_liino_normal_skill', 'chr_0035_liino_combo_skill'],
          },
        },
        next: null,
      },
      inheritBuffById_22: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide',
            inheritToNextSkillIds: ['chr_0035_liino_normal_skill', 'chr_0035_liino_combo_skill'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_21: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_24: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_21' },
          whenTrue: { $sequence: 'inheritBuffById_22' },
          whenFalse: { $sequence: 'applyBuff_23' },
        },
        next: null,
      },
      applyBuff_25: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0035_liino_combo_skill'],
          },
        },
        next: null,
      },
      applyBuff_26: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      applyBuff_30: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_29: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_28: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_31: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_28' },
          whenTrue: { $sequence: 'inheritBuffById_29' },
          whenFalse: { $sequence: 'applyBuff_30' },
        },
        next: null,
      },
      applyBuff_34: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_33: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0035_liino_showhide_audio',
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack3',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_combo_skill',
              'chr_0035_liino_power_attack',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      ifElse_35: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_28' },
          whenTrue: { $sequence: 'inheritBuffById_33' },
          whenFalse: { $sequence: 'applyBuff_34' },
        },
        next: null,
      },
      applyBuff_36: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'set_cd' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0035_liino_normalskill_end_active'],
        },
      },
      data_3: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0035_liino_normalskill_end'] },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_showhide_audio'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_normal_skill_combo: SkillDefinition = {
  key: 'chr_0035_liino_normal_skill_combo',
  element: 'electric',
  blackboard: {
    atk_scale: [0.18, 0.2, 0.21, 0.23, 0.25, 0.27, 0.28, 0.3, 0.32, 0.34, 0.37, 0.4],
    atk_scale_2: [0.09, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.2],
    atk_scale_3: [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    atk_up: 0.08,
    heal_rate: [18, 21.6, 25.2, 28.8, 30.6, 32.4, 34.2, 36, 37.8, 38.7, 39.6, 40.5],
    heal_value: [0.04, 0.05, 0.06, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.09, 0.09],
    music_loop: 0,
    set_cd: 3,
    shelter: 0,
    shelter_duration: 0,
    talent_a: 0,
    talent_b: 0,
  },
  timelineBlockFrames: 1723,
  naturalDurationFrames: 2100,
  exclusiveFrame: 1954,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 0,
        endFrame: 1800,
        skillIds: ['chr_0035_liino_normal_skill_end', 'chr_0035_liino_combo_skill'],
      },
      {
        startFrame: 1723,
        endFrame: 1800,
        skillIds: ['chr_0035_liino_normal_skill_end', 'chr_0035_liino_normal_skill'],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 1938, endFrame: 1938, sequence: { $sequence: 'finishBuffsById_1' } },
    { startFrame: 1800, endFrame: 1801, sequence: { $sequence: 'jumpTimeline_2' } },
    { startFrame: 1801, endFrame: 1803, sequence: { $sequence: 'interruptCurrentSkill_3' } },
    { startFrame: 0, endFrame: 1800, sequence: { $sequence: 'listenForCombatEvents_9' } },
    { startFrame: 0, endFrame: 1800, sequence: { $sequence: 'listenForCombatEvents_13' } },
    { startFrame: 0, endFrame: 1801, sequence: { $sequence: 'repeatEachTick_16' } },
    { startFrame: 0, endFrame: 1800, sequence: { $sequence: 'inheritBuffById_20' } },
    { startFrame: 0, endFrame: 1800, sequence: { $sequence: 'ifElse_24' } },
    { startFrame: 1862, endFrame: 1962, sequence: { $sequence: 'applyBuff_25' } },
    { startFrame: 0, endFrame: 1800, sequence: { $sequence: 'applyBuff_26' } },
    { startFrame: 1862, endFrame: 1961, sequence: { $sequence: 'applyBuff_26' } },
    { startFrame: 0, endFrame: 1800, sequence: { $sequence: 'ifElse_31' } },
    { startFrame: 1862, endFrame: 1962, sequence: { $sequence: 'ifElse_35' } },
    { startFrame: 0, endFrame: 1800, sequence: { $sequence: 'applyBuff_36' } },
    { startFrame: 1862, endFrame: 1961, sequence: { $sequence: 'applyBuff_36' } },
  ],
  timelineBlockFollowUpSkillId: 'chr_0035_liino_normal_skill_end',
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'extraActiveSkill',
  actionGraph: liinoChr_0035_liino_normal_skill_comboActionGraph,
};

export const liinoChr_0035_liino_normal_skill_endActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_skill_end' }],
            targets: { kind: 'fixed', target: 'caster' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_normal_skill_end: SkillDefinition = {
  actionGraph: liinoChr_0035_liino_normal_skill_endActionGraph,
  key: 'chr_0035_liino_normal_skill_end',
  element: 'electric',
  blackboard: { atk_scale: 1, atk_up: 0.5 },
  timelineBlockFrames: 1,
  naturalDurationFrames: 1,
  exclusiveFrame: 0,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [],
  switchToBuffCast: {
    currentSkillTypes: ['battleSkill', 'ultimate'],
    asSkillCast: false,
    sequence: { $sequence: 'applyBuff_1' },
  },
  icon: 'endaxis:operators/liino/battle_02',
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'extraActiveSkill',
};

export const liinoChr_0035_liino_ultimate_skillActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'source' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0035_liino_normalskill_music_animation_musicloop'],
            reason: 'other',
          },
        },
        next: null,
      },
      startTimeDilation_3: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: false,
            targets: ['caster'],
          },
        },
        next: null,
      },
      spawnAbilityEntity_4: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0035_liino_ult_skill_projhit',
            childSkillId: 'chr_0035_liino_ultimate_skill_projhit_abilityentity',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
          },
        },
        next: null,
      },
      applyBuff_5: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_ultskill_music_heal_start',
                copiedBlackboardAssignments: {
                  heal_value: 'ultheal03_value',
                  heal_rate: 'ultheal03_rate',
                },
              },
            ],
            targets: { kind: 'context', key: 'heal_target' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      findTargets_6: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'characterTeam', excludeOwner: false, owner: { kind: 'owner' } },
            saveToContextKey: 'heal_target',
          },
        },
        next: 'applyBuff_5',
      },
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_ultskill_music_heal',
                copiedBlackboardAssignments: {
                  heal_value: 'ultheal02_value',
                  heal_rate: 'ultheal02_rate',
                },
              },
            ],
            targets: { kind: 'context', key: 'heal_target' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      calculateActionValue_8: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'ultheal02_value',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_1' },
            right: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: 'applyBuff_7',
      },
      calculateActionValue_9: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'ultheal02_rate',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_3' },
            right: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: 'calculateActionValue_8',
      },
      findTargets_10: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'characterTeam', excludeOwner: false, owner: { kind: 'owner' } },
            saveToContextKey: 'heal_target',
          },
        },
        next: 'calculateActionValue_9',
      },
      launchProjectile_11: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 0.4,
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0035_liino_ultimate_skill_soundwave_02_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale_4: 0.1, poise: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_3' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      applyBuff_1: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_physical_no_guard' }],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      checkCondition_2: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                        },
                        next: 'applyBuff_1',
                      },
                      dealDamage_3: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'electric',
                            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                            tags: ['ultimateSkill'],
                          },
                        },
                        next: 'checkCondition_2',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0035_liino_chrdung_armorbreak'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_4' },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
      calculateActionValue_12: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_4',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_4' },
            right: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: 'launchProjectile_11',
      },
      applyBuff_13: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_ultskill_refrainobtainusp' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      changeSkillSlot_14: {
        action: {
          kind: 'changeSkillSlot',
          parameters: {
            skillSlotKey: 'battleSkill',
            targetSkillKey: 'chr_0035_liino_normal_skill_end',
            inheritOriginSkillCooldownProgress: true,
            lifetime: 'finishByAction',
            revertedSkillKey: 'chr_0035_liino_normal_skill',
          },
        },
        next: null,
      },
      jumpTimeline_15: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 540 },
          condition: { $sequence: null },
        },
        next: null,
      },
      finishBuffsById_16: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0035_liino_normalskill_music_animation_musicloop'],
            reason: 'other',
          },
        },
        next: 'jumpTimeline_15',
      },
      applyBuff_17: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_normalskill_music_cry_vfx' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'finishBuffsById_16',
      },
      checkCondition_18: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'applyBuff_17',
      },
      listenForCombatEvents_19: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0035_liino_ultimate_skill.actionGroupData.timelineActions[18]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_18' },
              },
            ],
          },
        },
        next: null,
      },
      applyBuff_22: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_ultskill_music_tag',
                copiedBlackboardAssignments: {
                  duration: 'ultmusic_duration',
                  finish_duration: 'finish_duration',
                  atk_up: 'atk_up',
                  spellenhance_rate: 'fnlatk_up',
                  talent_a: 'talent_a',
                  shelter: 'shelter',
                  shelter_duration: 'shelter_duration',
                  healtaken_rate: 'healtaken_rate',
                },
              },
            ],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      modifyActionValue_23: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'fnlatk_up',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_6' },
          },
        },
        next: 'applyBuff_22',
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      ifElse_24: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_20' },
          whenTrue: { $sequence: 'applyBuff_22' },
          whenFalse: { $sequence: 'modifyActionValue_23' },
        },
        next: null,
      },
      storeSourceAttributeValue_25: {
        action: {
          kind: 'storeSourceAttributeValue',
          parameters: {
            attribute: { kind: 'specific', key: 'will' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'valueNode', nodeId: 'data_10' },
            base: { kind: 'constant', value: 0 },
            targetKey: 'fnlatk_up',
          },
        },
        next: 'ifElse_24',
      },
      applyBuff_26: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_ultskill_music_damage',
                copiedBlackboardAssignments: {
                  vfx_music_duration: 'ultmusic_duration',
                  atk_scale_3: 'atk_scale_3',
                  music_damage_trigger: 'ultmusic_trigger',
                  ultheal_value: 'ultheal_value',
                  ultheal_rate: 'ultheal_rate',
                },
              },
            ],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0035_liino_combo_skill'],
          },
        },
        next: null,
      },
      applyBuff_27: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      applyBuff_28: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
              'chr_0035_liino_attack3',
            ],
          },
        },
        next: null,
      },
      applyBuff_29: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_showhide_audio_fire' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0035_liino_normal_skill',
              'chr_0035_liino_attack4',
              'chr_0035_liino_attack5',
            ],
          },
        },
        next: null,
      },
      applyBuff_30: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_damage_immune_medium' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      hideUi_31: { action: { kind: 'hideUi', parameters: { onlyBlockInput: false } }, next: null },
      startUltimateTimeDilation_32: {
        action: {
          kind: 'startUltimateTimeDilation',
          parameters: {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          },
        },
        next: null,
      },
      checkCondition_33: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: null,
      },
      ifElse_34: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_33' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'ultheal_value' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'final_value' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'ultheal_rate' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_3' } },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0035_liino_ultskill_end'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'will_max' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'fnlatk_up', fallback: 0 } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'will_max', fallback: 0 } },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_7' },
          operator: 'lessOrEqual',
          right: { kind: 'valueNode', nodeId: 'data_8' },
        },
      },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'will_up' } },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'caster',
          tagQueryType: 'hasAny',
          tags: ['Skill/Character/chr_0035_liino/ComboSkill'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoChr_0035_liino_ultimate_skill: SkillDefinition = {
  key: 'chr_0035_liino_ultimate_skill',
  element: 'electric',
  blackboard: {
    atk_scale: [0.07, 0.08, 0.09, 0.09, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16],
    atk_scale_2: [2.84, 3.13, 3.41, 3.7, 3.98, 4.27, 4.55, 4.83, 5.12, 5.47, 5.9, 6.4],
    atk_scale_3: [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.42, 0.45, 0.48, 0.51, 0.55, 0.6],
    atk_scale_4: 0,
    atk_up: 0.1,
    final_value: 3,
    finish_duration: 0,
    fnlatk_up: 0,
    healtaken_rate: 0,
    music_loop: 0,
    poise: 20,
    pulse_vul_duration: 0,
    pulse_vul_rate: 0,
    radius: 5,
    shelter: 0,
    shelter_duration: 0,
    spell_vulnerable_rate: 0,
    spellenhance_rate: 0.2,
    talent_a: 0,
    talent_b: 0,
    ultheal_rate: [36, 43.2, 50.4, 57.6, 61.2, 64.8, 68.4, 72, 75.6, 77.4, 79.2, 81],
    ultheal_value: [0.08, 0.1, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.18, 0.18, 0.19],
    ultheal02_rate: 0,
    ultheal02_value: 0,
    ultheal03_rate: [324, 388.8, 453.6, 518.4, 550.8, 583.2, 615.6, 648, 680.4, 696.6, 712.8, 729],
    ultheal03_value: [0.76, 0.91, 1.06, 1.21, 1.29, 1.36, 1.44, 1.51, 1.59, 1.63, 1.66, 1.7],
    ultmusic_duration: 15,
    ultmusic_trigger: 1.5,
    will_max: [0.4, 0.4, 0.4, 0.4, 0.45, 0.45, 0.45, 0.45, 0.45, 0.5, 0.55, 0.6],
    will_up: [
      0.00018, 0.0002, 0.00021, 0.00023, 0.00025, 0.00027, 0.00028, 0.0003, 0.00032, 0.00034,
      0.00037, 0.0004,
    ],
  },
  timelineBlockFrames: 77,
  naturalDurationFrames: 660,
  exclusiveFrame: 543,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 77, endFrame: 527, skillIds: ['chr_0035_liino_normal_skill_end'] },
      { startFrame: 163, endFrame: 527, skillIds: ['chr_0035_liino_combo_skill'] },
      {
        startFrame: 527,
        endFrame: 580,
        skillIds: [
          'chr_0035_liino_normal_skill',
          'chr_0035_liino_combo_skill',
          'chr_0035_liino_attack1',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 407, endFrame: 408, sequence: { $sequence: 'finishBuffsById_1' } },
    { startFrame: 540, endFrame: 541, sequence: { $sequence: 'finishBuffsById_1' } },
    { startFrame: 0, endFrame: 30, sequence: { $sequence: 'startTimeDilation_3' } },
    { startFrame: 76, endFrame: 76, sequence: { $sequence: 'spawnAbilityEntity_4' } },
    { startFrame: 80, endFrame: 80, sequence: { $sequence: 'findTargets_6' } },
    { startFrame: 513, endFrame: 514, sequence: { $sequence: 'findTargets_10' } },
    { startFrame: 508, endFrame: 508, sequence: { $sequence: 'calculateActionValue_12' } },
    { startFrame: 77, endFrame: 527, sequence: { $sequence: 'applyBuff_13' } },
    { startFrame: 77, endFrame: 527, sequence: { $sequence: 'changeSkillSlot_14' } },
    { startFrame: 137, endFrame: 527, sequence: { $sequence: 'listenForCombatEvents_19' } },
    { startFrame: 77, endFrame: 527, sequence: { $sequence: 'storeSourceAttributeValue_25' } },
    { startFrame: 77, endFrame: 477, sequence: { $sequence: 'applyBuff_26' } },
    { startFrame: 77, endFrame: 520, sequence: { $sequence: 'applyBuff_27' } },
    { startFrame: 64, endFrame: 523, sequence: { $sequence: 'applyBuff_28' } },
    { startFrame: 77, endFrame: 520, sequence: { $sequence: 'applyBuff_29' } },
    { startFrame: 0, endFrame: 80, sequence: { $sequence: 'applyBuff_30' } },
    { startFrame: 0, endFrame: 77, sequence: { $sequence: 'hideUi_31' } },
    { startFrame: 0, endFrame: 77, sequence: { $sequence: 'startUltimateTimeDilation_32' } },
    { startFrame: 77, endFrame: 406, sequence: { $sequence: 'ifElse_34' } },
  ],
  cooldownFrames: 600,
  costs: [{ resource: 'ultimateEnergy', value: 160 }],
  timelineBlockFollowUpSkillId: 'chr_0035_liino_normal_skill_end',
  skillType: 'ultimate',
  levelSource: 'ultimate',
  nativeSkillType: 'ultimateSkill',
  actionGraph: liinoChr_0035_liino_ultimate_skillActionGraph,
};

export const liinoCommon_character_perfect_dodgeActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const liinoCommon_character_perfect_dodge: SkillDefinition = {
  actionGraph: liinoCommon_character_perfect_dodgeActionGraph,
  key: 'common_character_perfect_dodge',
  blackboard: {},
  timelineBlockFrames: 16,
  naturalDurationFrames: 15,
  exclusiveFrame: 15,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [],
  skillType: 'dodge',
  nativeSkillType: 'dodge',
};

const liinoComboCondition1ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'checkCondition_1',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffTagIdCountCompare',
          target: 'caster',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/chr_0035_liino/NormalSkillMusic'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTags: [
            'Skill/Character/Common/SpellStatus',
            'Skill/Character/Common/SpellStatus/Conduct',
            'Skill/Character/Common/SpellStatus/Frozen',
            'Skill/Character/Common/SpellStatus/Burning',
            'Skill/Character/Common/SpellStatus/Corrupt',
          ],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoComboCondition1: ComboSkillConditionDefinition = {
  key: 'native-combo:0',
  skillKey: 'chr_0035_liino_combo_skill',
  event: 'addedBuff',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'checkCondition_2' },
  actionGraph: liinoComboCondition1ActionGraph,
};

const liinoComboCondition2ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'checkCondition_1',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffTagIdCountCompare',
          target: 'caster',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/chr_0035_liino/NormalSkillMusic'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTags: [
            'Skill/Character/Common/SpellStatus',
            'Skill/Character/Common/SpellStatus/Conduct',
            'Skill/Character/Common/SpellStatus/Frozen',
            'Skill/Character/Common/SpellStatus/Burning',
            'Skill/Character/Common/SpellStatus/Corrupt',
          ],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoComboCondition2: ComboSkillConditionDefinition = {
  key: 'native-combo:1',
  skillKey: 'chr_0035_liino_combo_skill',
  event: 'buffEndsEarly',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'checkCondition_2' },
  actionGraph: liinoComboCondition2ActionGraph,
};

const liinoBuff1ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff1: SkillBuffDefinition = {
  stackingType: 'highPriority',
  stackingKey: 'liino_atk_up',
  priority: { blackboardKey: 'atk_up' },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_atk_up',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: false,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'Default',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { atk_up: 0, duration: 0, spellenhance_rate: 0 },
  attributeModifiers: [
    { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
  ],
  actionGraph: liinoBuff1ActionGraph,
};

const liinoBuff2ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff2: SkillBuffDefinition = {
  stackingType: 'highPriority',
  stackingKey: 'liino_atk_up',
  priority: { blackboardKey: 'atk_up' },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_atk_up',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: false,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'Default',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { atk_up: 0, duration: 0, spellenhance_rate: 0 },
  attributeModifiers: [
    { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
  ],
  actionGraph: liinoBuff2ActionGraph,
};

const liinoBuff3ActionGraph = {
  main: {
    nodes: {
      finishParentGlobalBuff_10: {
        action: { kind: 'finishParentGlobalBuff', parameters: { reason: 'early' } },
        next: null,
      },
      changeResource_11: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_1' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'context', key: 'godentity' },
            targets: { kind: 'owner' },
            spGainKind: 'refund',
            spGainSource: 'skill',
          },
        },
        next: 'finishParentGlobalBuff_10',
      },
      findTargets_12: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'godEntity' },
            saveToContextKey: 'godentity',
          },
        },
        next: 'changeResource_11',
      },
      changeResource_9: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_1' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'owner' },
            spGainKind: 'refund',
            spGainSource: 'skill',
          },
        },
        next: 'finishParentGlobalBuff_10',
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'changeResource_9' },
          whenFalse: { $sequence: 'findTargets_12' },
        },
        next: null,
      },
      checkCondition_16: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'ifElse_15',
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_17: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'ifElse_15' },
          whenFalse: { $sequence: 'checkCondition_16' },
        },
        next: null,
      },
      storeCharacterTypeId_18: {
        action: {
          kind: 'storeCharacterTypeId',
          parameters: { target: 'buffOwner', outputKey: 'ower_char_type' },
        },
        next: 'ifElse_17',
      },
      checkCondition_19: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'storeCharacterTypeId_18',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'source' },
          containsHittableTarget: false,
          excludeDeadEntity: true,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_3: { type: 'string', expression: { blackboardKey: 'ower_char_type' } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'stringEquals',
          left: { kind: 'stringNode', nodeId: 'data_3' },
          right: 'Natural',
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'stringEquals',
          left: { kind: 'stringNode', nodeId: 'data_3' },
          right: 'Pulse',
        },
      },
      data_6: {
        type: 'boolean',
        expression: { kind: 'eventSkillTypeIn', skillTypes: ['battleSkill'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff3: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: { blackboardKey: 'imbue_scale', negate: true },
  maxStackCount: 99,
  triggerIntervalSeconds: 0,
  waitFirstTriggerInterval: true,
  maxTriggerCount: 1,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_liino_inspire',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: false,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'Default',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { atb_return: 0, duration: 0 },
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'afterSkillApplyCost', priority: 0, sequence: { $sequence: 'checkCondition_19' } },
  ],
  actionGraph: liinoBuff3ActionGraph,
};

const liinoBuff4ActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0035_liino_normalskill_music_animation_musicloop'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      findCharacterTeamTargets_3: {
        action: {
          kind: 'findCharacterTeamTargets',
          parameters: { saveToContextKey: 'mainchar', selection: { kind: 'controlledOperator' } },
        },
        next: null,
      },
      dealDamage_4: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          },
        },
        next: null,
      },
      changeResource_5: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_3' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: null,
      },
      heal_6: {
        action: {
          kind: 'heal',
          parameters: {
            target: 'controlledOperator',
            alwaysNext: true,
            tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
            amount: { kind: 'valueNode', nodeId: 'data_4' },
          },
        },
        next: 'changeResource_5',
      },
      storeSourceAttributeValue_7: {
        action: {
          kind: 'storeSourceAttributeValue',
          parameters: {
            attribute: { kind: 'specific', key: 'agility' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'valueNode', nodeId: 'data_5' },
            base: { kind: 'valueNode', nodeId: 'data_6' },
            targetKey: 'final_heal_value',
          },
        },
        next: 'heal_6',
      },
      dealDamage_8: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_7' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_8' },
          },
        },
        next: 'storeSourceAttributeValue_7',
      },
      createGlobalBuff_9: {
        action: {
          kind: 'createGlobalBuff',
          parameters: {
            globalBuffId: 'global_buff_liino_combo_atb_return',
            definition: {
              stackingType: 'stack',
              maxStackCount: 1,
              durationSeconds: { blackboardKey: 'duration' },
              applyIconDurationToBuffs: true,
              blackboard: { atb_return: 0, duration: 0 },
              children: [
                {
                  buffId: 'buff_chr_0035_liino_combo_atb_return',
                  blackboardAssignments: {
                    atb_return: { kind: 'valueNode', nodeId: 'data_9' },
                    duration: { kind: 'valueNode', nodeId: 'data_10' },
                  },
                },
              ],
            },
            source: 'buffOwner',
            blackboardAssignments: {
              duration: { kind: 'valueNode', nodeId: 'data_11' },
              atb_return: { kind: 'valueNode', nodeId: 'data_9' },
            },
          },
        },
        next: null,
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_13' } },
        },
        next: 'createGlobalBuff_9',
      },
      readBuffRemainingDuration_11: {
        action: {
          kind: 'readBuffRemainingDuration',
          parameters: {
            target: { kind: 'owner' },
            query: { kind: 'id', buffIds: ['buff_chr_0035_liino_normalskill_music_tag'] },
            outputKey: 'remainingtime',
          },
        },
        next: null,
      },
      modifyActionValue_12: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'normal_combo',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'readBuffRemainingDuration_11',
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
        },
        next: 'modifyActionValue_12',
      },
      startTimeDilation_14: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.15 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            targets: [],
            abilityEntityTargets: [{ kind: 'ownerSpawned' }],
          },
        },
        next: null,
      },
      startTimeDilation_15: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.9333 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          },
        },
        next: null,
      },
      checkCondition_16: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
        },
        next: null,
      },
      modifyActionValue_17: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'owner_mainchar_distance',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      findCharacterTeamTargets_18: {
        action: {
          kind: 'findCharacterTeamTargets',
          parameters: { saveToContextKey: 'mainchar', selection: { kind: 'controlledOperator' } },
        },
        next: 'modifyActionValue_17',
      },
      ifElse_19: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_16' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'findCharacterTeamTargets_18' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'buffOwner',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/chr_0035_liino/UltSkillMusic'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'final_heal_value' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'heal_value' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'heal_rate' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_2' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return' } },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'duration' } },
      data_11: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return_duration' } },
      data_12: { type: 'number', expression: { kind: 'blackboard', key: 'talent_b', fallback: 0 } },
      data_13: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_12' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_14: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0035_liino_normalskill_music_tag'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_15: { type: 'boolean', expression: { kind: 'casterControlled' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff4: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  timeClock: 'global',
  applyTags: [],
  extendTags: [],
  blackboard: {
    atb_return: 5,
    atb_return_duration: 30,
    atk_scale: 1,
    atk_scale_2: 0,
    cam_angle: 0,
    cam_duration: 0,
    combo_duration: 0,
    duration: 3,
    final_heal_value: 0,
    heal_rate: 0,
    heal_value: 0,
    input_angle: 0,
    normal_combo: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    radius: 4,
    remainingtime: 0,
    talent_b: 0,
    time_duration: 0,
    time_ratio: 0,
    usp: 0,
  },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 0, endFrame: 68, sequence: { $sequence: 'finishBuffsById_1' } },
    { startFrame: 63, endFrame: 63, sequence: { $sequence: 'checkCondition_2' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findCharacterTeamTargets_3' } },
    { startFrame: 9, endFrame: 13, sequence: { $sequence: 'dealDamage_4' } },
    { startFrame: 33, endFrame: 37, sequence: { $sequence: 'dealDamage_8' } },
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_10' } },
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_13' } },
    { startFrame: 0, endFrame: 7, sequence: { $sequence: 'startTimeDilation_14' } },
    { startFrame: 0, endFrame: 25, sequence: { $sequence: 'startTimeDilation_15' } },
    { startFrame: 0, endFrame: 25, sequence: { $sequence: 'ifElse_19' } },
  ],
  actionGraph: liinoBuff4ActionGraph,
};

const liinoBuff5ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_atkup',
                copiedBlackboardAssignments: { atk_up: 'atk_up', duration: 'duration' },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff5: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_up: 0, duration: -1, finish_duration: 0, spellenhance_rate: 0.2 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: liinoBuff5ActionGraph,
};

const liinoBuff6ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff6: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 1 },
  attributeModifiers: [],
  actionGraph: liinoBuff6ActionGraph,
};

const liinoBuff7ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff7: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 1 },
  attributeModifiers: [],
  actionGraph: liinoBuff7ActionGraph,
};

const liinoBuff8ActionGraph = {
  main: {
    nodes: {
      launchProjectile_1: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickBlock',
            recycleDelaySeconds: 0.133333340287209,
          },
          callbacks: [
            {
              event: 'block',
              skill: {
                skillId: 'chr_0035_liino_normal_skill_projhit_hit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 4,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale_2: 0, hit_cnt: 1, poise: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 4, sequence: { $sequence: 'dealDamage_1' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'electric',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['normalSkill'],
                          },
                        },
                        next: null,
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_2' },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff8: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'vfx_music_duration' },
  applyTags: [],
  extendTags: [],
  blackboard: {
    animation_starttime_key: 0,
    atk_scale_2: 0,
    heal_rate: 200,
    heal_value: 0.2,
    music_frame: 0,
    vfx_music_duration: 20,
  },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 24, endFrame: 24, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 32, endFrame: 32, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 25, endFrame: 25, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 33, endFrame: 33, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 28, endFrame: 28, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 29, endFrame: 29, sequence: { $sequence: 'launchProjectile_1' } },
  ],
  actionGraph: liinoBuff8ActionGraph,
};

const liinoBuff9ActionGraph = {
  main: {
    nodes: {
      launchProjectile_1: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickBlock',
            recycleDelaySeconds: 0.133333340287209,
          },
          callbacks: [
            {
              event: 'block',
              skill: {
                skillId: 'chr_0035_liino_normal_skill_projhit_hit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 4,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale_2: 0, hit_cnt: 1, poise: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 4, sequence: { $sequence: 'dealDamage_1' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'electric',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['normalSkill'],
                          },
                        },
                        next: null,
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_2' },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff9: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'vfx_music_duration' },
  applyTags: [],
  extendTags: [],
  blackboard: {
    animation_starttime_key: 0,
    atk_scale_2: 0,
    heal_rate: 0,
    heal_value: 0,
    music_frame: 0,
    vfx_music_duration: 20,
  },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 24, endFrame: 24, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 32, endFrame: 32, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 25, endFrame: 25, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 33, endFrame: 33, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 28, endFrame: 28, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 29, endFrame: 29, sequence: { $sequence: 'launchProjectile_1' } },
  ],
  actionGraph: liinoBuff9ActionGraph,
};

const liinoBuff10ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff10: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: liinoBuff10ActionGraph,
  skillSlotReplacements: [
    {
      skillSlotKey: 'battleSkill',
      targetSkillKey: 'chr_0035_liino_normal_skill_end',
      revertedSkillKey: 'chr_0035_liino_normal_skill',
      inheritOriginSkillCooldownProgress: true,
    },
  ],
};

const liinoBuff11ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff11: SkillBuffDefinition = {
  stackingType: 'highPriority',
  stackingKey: 'liino_expression_vfx',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 1.5,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: liinoBuff11ActionGraph,
};

const liinoBuff12ActionGraph = {
  main: {
    nodes: {
      launchProjectile_1: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 0.45,
            recycleDelaySeconds: 0.0333333350718021,
            hit: { target: 'allOperators', finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0035_liino_normal_skill_soundwave_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atk_scale: 0.1,
                  final_heal_value: 0,
                  heal_rate: 0,
                  heal_value: 0,
                  poise: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'ifElse_6' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      applyBuff_4: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_physical_no_guard' }],
                            targets: { kind: 'inputTarget' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      checkCondition_5: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                        },
                        next: 'applyBuff_4',
                      },
                      heal_2: {
                        action: {
                          kind: 'heal',
                          parameters: {
                            target: 'actionInputTarget',
                            alwaysNext: true,
                            tags: ['Skill/Character/Common/Heal/NormalSkillHeal'],
                            amount: { kind: 'valueNode', nodeId: 'data_2' },
                          },
                        },
                        next: null,
                      },
                      storeSourceAttributeValue_3: {
                        action: {
                          kind: 'storeSourceAttributeValue',
                          parameters: {
                            attribute: { kind: 'specific', key: 'agility' },
                            stage: 'finalNonConverted',
                            useFloor: false,
                            divisor: { kind: 'constant', value: 1 },
                            multiplier: { kind: 'valueNode', nodeId: 'data_3' },
                            base: { kind: 'valueNode', nodeId: 'data_4' },
                            targetKey: 'final_heal_value',
                          },
                        },
                        next: 'heal_2',
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
                        },
                        next: null,
                      },
                      ifElse_6: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'storeSourceAttributeValue_3' },
                          whenFalse: { $sequence: 'checkCondition_5' },
                        },
                        next: null,
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0035_liino_chrdung_armorbreak'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'final_heal_value' },
                      },
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'heal_value' },
                      },
                      data_4: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'heal_rate' },
                      },
                      data_5: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionInputTargetObjectTypeMatch',
                          objectTypes: ['character'],
                        },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: 'launchProjectile_1',
      },
      launchProjectile_3: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 0.45,
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0035_liino_normal_skill_soundwave_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atk_scale: 0.1,
                  final_heal_value: 0,
                  heal_rate: 0,
                  heal_value: 0,
                  poise: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'ifElse_6' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      applyBuff_4: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_physical_no_guard' }],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      checkCondition_5: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                        },
                        next: 'applyBuff_4',
                      },
                      heal_2: {
                        action: {
                          kind: 'heal',
                          parameters: {
                            target: 'actionInputTarget',
                            alwaysNext: true,
                            tags: ['Skill/Character/Common/Heal/NormalSkillHeal'],
                            amount: { kind: 'valueNode', nodeId: 'data_2' },
                          },
                        },
                        next: null,
                      },
                      storeSourceAttributeValue_3: {
                        action: {
                          kind: 'storeSourceAttributeValue',
                          parameters: {
                            attribute: { kind: 'specific', key: 'agility' },
                            stage: 'finalNonConverted',
                            useFloor: false,
                            divisor: { kind: 'constant', value: 1 },
                            multiplier: { kind: 'valueNode', nodeId: 'data_3' },
                            base: { kind: 'valueNode', nodeId: 'data_4' },
                            targetKey: 'final_heal_value',
                          },
                        },
                        next: 'heal_2',
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
                        },
                        next: null,
                      },
                      ifElse_6: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'storeSourceAttributeValue_3' },
                          whenFalse: { $sequence: 'checkCondition_5' },
                        },
                        next: null,
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0035_liino_chrdung_armorbreak'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'final_heal_value' },
                      },
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'heal_value' },
                      },
                      data_4: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'heal_rate' },
                      },
                      data_5: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionInputTargetObjectTypeMatch',
                          objectTypes: ['character'],
                        },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'launchProjectile_3',
      },
      withActionBlackboardScope_5: {
        action: {
          kind: 'withActionBlackboardScope',
          parameters: {
            scopeKey: 'native-buff-callback:1',
            lifetime: 'execution',
            alwaysNext: true,
            shareParentBlackboard: true,
            initialValues: {},
            inheritParent: true,
          },
          body: { $sequence: 'checkCondition_4' },
        },
        next: null,
      },
      withActionBlackboardScope_6: {
        action: {
          kind: 'withActionBlackboardScope',
          parameters: {
            scopeKey: 'native-buff-callback:0',
            lifetime: 'execution',
            alwaysNext: true,
            shareParentBlackboard: true,
            initialValues: {},
            inheritParent: true,
          },
          body: { $sequence: 'checkCondition_2' },
        },
        next: 'withActionBlackboardScope_5',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0035_liino_chrdung_armorbreak'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff12: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'vfx_music_duration' },
  triggerIntervalSeconds: { blackboardKey: 'music_damage_trigger' },
  waitFirstTriggerInterval: false,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale: 0.1,
    heal_rate: 0,
    heal_value: 0,
    music_damage_trigger: 3,
    vfx_music_duration: 20,
  },
  attributeModifiers: [],
  lifecycleSequences: { trigger: { $sequence: 'withActionBlackboardScope_6' } },
  actionGraph: liinoBuff12ActionGraph,
};

const liinoBuff13ActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'inputTarget' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0035_liino_normalskill_buff_atkup'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_atkup_owner',
                copiedBlackboardAssignments: { atk_up: 'atk_up', duration: 'duration_atkup' },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      aura_3: {
        action: {
          kind: 'aura',
          parameters: {
            targets: { kind: 'characterTeam', excludeOwner: true },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_normalskill_buff_atkup',
                blackboardAssignments: { atk_up: { kind: 'valueNode', nodeId: 'data_1' } },
                stringBlackboardAssignments: {},
              },
            ],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: 'finishBuffsById_1' },
        },
        next: 'applyBuff_2',
      },
      applyBuff_4: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_talent_shelter_finishtime_normalskill',
                copiedBlackboardAssignments: {
                  shelter: 'shelter',
                  duration: 'shelter_duration',
                  heal_rate: 'healtaken_rate',
                },
              },
            ],
            targets: { kind: 'inputTarget' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      aura_5: {
        action: {
          kind: 'aura',
          parameters: {
            targets: { kind: 'characterTeam', excludeOwner: false },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_talent_shelter_normalskill',
                blackboardAssignments: {
                  shelter: { kind: 'valueNode', nodeId: 'data_2' },
                  heal_rate: { kind: 'valueNode', nodeId: 'data_3' },
                },
                stringBlackboardAssignments: {},
              },
            ],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: 'applyBuff_4' },
        },
        next: null,
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'aura_5',
      },
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_normalskill_end' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_8: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0035_liino_normal_skill_combo',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'castSkillDuringAction_8',
      },
      withActionBlackboardScope_10: {
        action: {
          kind: 'withActionBlackboardScope',
          parameters: {
            scopeKey: 'native-buff-callback:1',
            lifetime: 'execution',
            alwaysNext: true,
            shareParentBlackboard: true,
            initialValues: {},
            inheritParent: true,
          },
          body: { $sequence: 'checkCondition_6' },
        },
        next: null,
      },
      withActionBlackboardScope_11: {
        action: {
          kind: 'withActionBlackboardScope',
          parameters: {
            scopeKey: 'native-buff-callback:0',
            lifetime: 'execution',
            alwaysNext: true,
            shareParentBlackboard: true,
            initialValues: {},
            inheritParent: true,
          },
          body: { $sequence: 'aura_3' },
        },
        next: 'withActionBlackboardScope_10',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_up' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'shelter' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'healtaken_rate' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'talent_a', fallback: 0 } },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_4' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: { kind: 'eventCustomAbilityNameMatch', eventName: 'liino_comboskill_end' },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff13: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: false,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: true,
    useWeakProgressInNormalSkillButton: true,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: true,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'LifeTime',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: ['Skill/Character/chr_0035_liino/NormalSkillMusic'],
  extendTags: [],
  blackboard: {
    atk_up: 0,
    duration: 15,
    duration_atkup: -1,
    finish_duration: 0,
    healtaken_rate: 0,
    shelter: 0,
    shelter_duration: 0,
    shelter_teammate: 0,
    spellenhance_rate: 0,
    talent_a: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: {
    enable: { $sequence: 'withActionBlackboardScope_11' },
    finish: { $sequence: 'applyBuff_7' },
  },
  abilityEventResponses: [
    { event: 'customAbilityEvent', priority: 0, sequence: { $sequence: 'checkCondition_9' } },
  ],
  actionGraph: liinoBuff13ActionGraph,
};

const liinoBuff14ActionGraph = {
  main: {
    nodes: {
      createTimedMarker_1: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'owner' },
            markerId: 'liino_normalhit',
            durationSeconds: { kind: 'constant', value: 1 },
            autoFinishByAction: false,
            timeDomain: 'self',
          },
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'createTimedMarker_1',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff14: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 5, rate: 0 },
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'checkCondition_2' } },
  ],
  actionGraph: liinoBuff14ActionGraph,
};

const liinoBuff15ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_normalskill_music_animation_hitl',
                copiedBlackboardAssignments: {
                  music_frame: 'music_frame',
                  atk_scale_2: 'atk_scale_2',
                  heal_rate: 'heal_rate',
                  heal_value: 'heal_value',
                },
              },
            ],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      calculateActionValue_3: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'hit_check',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_3' },
            right: { kind: 'constant', value: -1 },
          },
        },
        next: 'applyBuff_2',
      },
      applyBuff_4: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_normalskill_music_animation_hitr',
                copiedBlackboardAssignments: {
                  music_frame: 'music_frame',
                  heal_rate: 'heal_rate',
                  heal_value: 'heal_value',
                  atk_scale_2: 'atk_scale_2',
                },
              },
            ],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      calculateActionValue_5: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'hit_check',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_3' },
            right: { kind: 'constant', value: -1 },
          },
        },
        next: 'applyBuff_4',
      },
      ifElse_6: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'calculateActionValue_3' },
          whenFalse: { $sequence: 'calculateActionValue_5' },
        },
        next: null,
      },
      calculateActionValue_7: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'music_frame',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_4' },
            right: { kind: 'valueNode', nodeId: 'data_5' },
          },
        },
        next: 'ifElse_6',
      },
      storeCurrentTimelineFrame_8: {
        action: { kind: 'storeCurrentTimelineFrame', parameters: { outputKey: 'music_loop' } },
        next: 'calculateActionValue_7',
      },
      createTimedMarker_9: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'owner' },
            markerId: 'liino_normalskill_hit',
            durationSeconds: { kind: 'valueNode', nodeId: 'data_6' },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: 'storeCurrentTimelineFrame_8',
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: 'createTimedMarker_9',
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: 'checkCondition_10',
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: 'checkCondition_11',
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: 'checkCondition_12',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'hit_check', fallback: 0 } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'hit_check' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'music_loop' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'frame_radio' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'hit_duration' } },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'timedMarkerPresent',
          target: 'buffOwner',
          markerId: 'liino_normalskill_hit',
        },
      },
      data_8: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_7' } },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'source' },
          target: { kind: 'fixed', target: 'enemy' },
          distance: 20,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'fixed', target: 'enemy' },
          containsHittableTarget: false,
          excludeDeadEntity: true,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff15: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  triggerIntervalSeconds: { blackboardKey: 'hit_tigger' },
  waitFirstTriggerInterval: false,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale_2: 0,
    frame_radio: 30,
    heal_rate: 0,
    heal_value: 0,
    hit_animation: 0,
    hit_check: 1,
    hit_duration: 0.6,
    hit_tigger: 10,
    music_frame: 0,
    music_loop: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: { trigger: { $sequence: 'checkCondition_13' } },
  actionGraph: liinoBuff15ActionGraph,
};

const liinoBuff16ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_potential_enterfight' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'applyBuff_1',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'caster',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/chr_0035_liino/NormalSkillMusic'],
          operator: 'lessOrEqual',
          value: { kind: 'constant', value: 0 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff16: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 1,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'enterFight', priority: 0, sequence: { $sequence: 'checkCondition_2' } },
  ],
  actionGraph: liinoBuff16ActionGraph,
};

const liinoBuff17ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff17: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 1,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: liinoBuff17ActionGraph,
};

const liinoBuff18ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff18: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: liinoBuff18ActionGraph,
};

const liinoBuff19ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff19: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: liinoBuff19ActionGraph,
};

const liinoBuff20ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff20: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: liinoBuff20ActionGraph,
};

const liinoBuff21ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff21: SkillBuffDefinition = {
  stackingType: 'highPriority',
  stackingKey: 'vfx_show',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: liinoBuff21ActionGraph,
};

const liinoBuff22ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff22: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: liinoBuff22ActionGraph,
};

const liinoBuff23ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_normalskill_end_active' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0035_liino_ultskill_end' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_3',
      },
      ifElse_5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'applyBuff_2' },
          whenFalse: { $sequence: 'checkCondition_4' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'currentSkillTypeIn',
          target: 'buffOwner',
          skillTypes: ['battleSkill'],
        },
      },
      data_2: {
        type: 'boolean',
        expression: { kind: 'currentSkillTypeIn', target: 'buffOwner', skillTypes: ['ultimate'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff23: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 1 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'ifElse_5' } },
  actionGraph: liinoBuff23ActionGraph,
};

const liinoBuff24ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_enhance_natural',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  rate: { kind: 'valueNode', nodeId: 'data_2' },
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_enhance_pulse',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  rate: { kind: 'valueNode', nodeId: 'data_2' },
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            finishByAction: true,
          },
        },
        next: 'applyBuff_1',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'duration' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'spellenhance_rate' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff24: SkillBuffDefinition = {
  stackingType: 'highPriority',
  stackingKey: 'liino_spellenhance',
  priority: { blackboardKey: 'spellenhance_rate' },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { atk_up: 0, duration: 0, spellenhance_rate: 0 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_2' } },
  actionGraph: liinoBuff24ActionGraph,
};

const liinoBuff25ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff25: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'shelter', negate: true },
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { duration: -1, heal_rate: 0.2, liino_talent: 1, shelter: -0.2 },
  attributeModifiers: [
    { attribute: 'healTakenIncrease', slot: 'addition', value: { blackboardKey: 'heal_rate' } },
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
  actionGraph: liinoBuff25ActionGraph,
};

const liinoBuff26ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff26: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'shelter', negate: true },
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 3, heal_rate: 0.1, liino_talent: 0, shelter: -0.2 },
  attributeModifiers: [
    { attribute: 'healTakenIncrease', slot: 'addition', value: { blackboardKey: 'heal_rate' } },
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
  actionGraph: liinoBuff26ActionGraph,
};

const liinoBuff27ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_talent_shelter_finishtime',
                copiedBlackboardAssignments: { shelter: 'shelter', heal_rate: 'heal_rate' },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff27: SkillBuffDefinition = {
  stackingType: 'highPriority',
  stackingKey: 'liino_talent',
  priority: { blackboardKey: 'shelter', negate: true },
  maxStackCount: 5,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_liino_normalskill_music',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: false,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'Default',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 3, heal_rate: 0.1, liino_talent: 0, shelter: -0.2 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: liinoBuff27ActionGraph,
};

const liinoBuff28ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_talent_shelter_finishtime',
                copiedBlackboardAssignments: { shelter: 'shelter', heal_rate: 'heal_rate' },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff28: SkillBuffDefinition = {
  stackingType: 'highPriority',
  stackingKey: 'liino_talent',
  priority: { blackboardKey: 'shelter', negate: true },
  maxStackCount: 5,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_liino_ultskill_music',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: false,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'Default',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 3, heal_rate: 0.1, liino_talent: 0, shelter: -0.2 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: liinoBuff28ActionGraph,
};

const liinoBuff29ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_talent_shelter',
                copiedBlackboardAssignments: { shelter: 'shelter', heal_rate: 'heal_rate' },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff29: SkillBuffDefinition = {
  stackingType: 'highPriority',
  stackingKey: 'liino_talent',
  priority: { blackboardKey: 'shelter', negate: true },
  maxStackCount: 5,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_liino_normalskill_music',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: false,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'Default',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: -1, heal_rate: 0.2, liino_talent: 1, shelter: -0.2 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: liinoBuff29ActionGraph,
};

const liinoBuff30ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_talent_shelter',
                copiedBlackboardAssignments: { shelter: 'shelter', heal_rate: 'heal_rate' },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff30: SkillBuffDefinition = {
  stackingType: 'highPriority',
  stackingKey: 'liino_talent',
  priority: { blackboardKey: 'shelter', negate: true },
  maxStackCount: 5,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_liino_ultskill_music',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: false,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'Default',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: -1, heal_rate: 0.2, liino_talent: 1, shelter: -0.2 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: liinoBuff30ActionGraph,
};

const liinoBuff31ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_spellenhance',
                copiedBlackboardAssignments: {
                  spellenhance_rate: 'spellenhance_rate',
                  duration: 'duration',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff31: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_up: 0,
    duration: -1,
    finish_duration: 10,
    spellenhance_rate: 0.2,
    spellenhance_will_rate: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: liinoBuff31ActionGraph,
};

const liinoBuff32ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff32: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 1 },
  attributeModifiers: [],
  actionGraph: liinoBuff32ActionGraph,
};

const liinoBuff33ActionGraph = {
  main: {
    nodes: {
      launchProjectile_1: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 0.4,
            recycleDelaySeconds: 0.0333333350718021,
            hit: { target: 'allOperators', finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0035_liino_ultimate_skill_soundwave_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atk_scale_3: 0.1,
                  final_heal_value: 0,
                  poise: 5,
                  ultheal_rate: 0,
                  ultheal_value: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'ifElse_9' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'electric',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['ultimateSkill'],
                          },
                        },
                        next: null,
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
                        },
                        next: null,
                      },
                      ifElse_6: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'dealDamage_2' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      heal_4: {
                        action: {
                          kind: 'heal',
                          parameters: {
                            target: 'actionInputTarget',
                            alwaysNext: true,
                            tags: ['Skill/Character/Common/Heal/UltimateSkillHeal'],
                            amount: { kind: 'valueNode', nodeId: 'data_3' },
                          },
                        },
                        next: null,
                      },
                      storeSourceAttributeValue_5: {
                        action: {
                          kind: 'storeSourceAttributeValue',
                          parameters: {
                            attribute: { kind: 'specific', key: 'agility' },
                            stage: 'finalNonConverted',
                            useFloor: false,
                            divisor: { kind: 'constant', value: 1 },
                            multiplier: { kind: 'valueNode', nodeId: 'data_4' },
                            base: { kind: 'valueNode', nodeId: 'data_5' },
                            targetKey: 'final_heal_value',
                          },
                        },
                        next: 'heal_4',
                      },
                      checkCondition_3: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      applyBuff_7: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_physical_no_guard' }],
                            targets: { kind: 'inputTarget' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      checkCondition_8: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                        },
                        next: 'applyBuff_7',
                      },
                      ifElse_9: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_3' },
                          whenTrue: { $sequence: 'storeSourceAttributeValue_5' },
                          whenFalse: { $sequence: 'ifElse_6' },
                        },
                        next: 'checkCondition_8',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_3' },
                      },
                      data_2: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionInputTargetObjectTypeMatch',
                          objectTypes: ['enemy'],
                        },
                      },
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'final_heal_value' },
                      },
                      data_4: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'ultheal_value' },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'ultheal_rate' },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionInputTargetObjectTypeMatch',
                          objectTypes: ['character'],
                        },
                      },
                      data_7: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0035_liino_chrdung_armorbreak'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: null,
      },
      launchProjectile_2: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 0.4,
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0035_liino_ultimate_skill_soundwave_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atk_scale_3: 0.1,
                  final_heal_value: 0,
                  poise: 5,
                  ultheal_rate: 0,
                  ultheal_value: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'ifElse_9' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'electric',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['ultimateSkill'],
                          },
                        },
                        next: null,
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
                        },
                        next: null,
                      },
                      ifElse_6: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'dealDamage_2' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      heal_4: {
                        action: {
                          kind: 'heal',
                          parameters: {
                            target: 'actionInputTarget',
                            alwaysNext: true,
                            tags: ['Skill/Character/Common/Heal/UltimateSkillHeal'],
                            amount: { kind: 'valueNode', nodeId: 'data_3' },
                          },
                        },
                        next: null,
                      },
                      storeSourceAttributeValue_5: {
                        action: {
                          kind: 'storeSourceAttributeValue',
                          parameters: {
                            attribute: { kind: 'specific', key: 'agility' },
                            stage: 'finalNonConverted',
                            useFloor: false,
                            divisor: { kind: 'constant', value: 1 },
                            multiplier: { kind: 'valueNode', nodeId: 'data_4' },
                            base: { kind: 'valueNode', nodeId: 'data_5' },
                            targetKey: 'final_heal_value',
                          },
                        },
                        next: 'heal_4',
                      },
                      checkCondition_3: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      applyBuff_7: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_physical_no_guard' }],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      checkCondition_8: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                        },
                        next: 'applyBuff_7',
                      },
                      ifElse_9: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_3' },
                          whenTrue: { $sequence: 'storeSourceAttributeValue_5' },
                          whenFalse: { $sequence: 'ifElse_6' },
                        },
                        next: 'checkCondition_8',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_3' },
                      },
                      data_2: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionInputTargetObjectTypeMatch',
                          objectTypes: ['enemy'],
                        },
                      },
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'final_heal_value' },
                      },
                      data_4: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'ultheal_value' },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'ultheal_rate' },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionInputTargetObjectTypeMatch',
                          objectTypes: ['character'],
                        },
                      },
                      data_7: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0035_liino_chrdung_armorbreak'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: 'launchProjectile_1',
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff33: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'vfx_music_duration' },
  triggerIntervalSeconds: { blackboardKey: 'music_damage_trigger' },
  waitFirstTriggerInterval: false,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale_3: 0.1,
    music_damage_trigger: 3,
    ultheal_rate: 0,
    ultheal_value: 0,
    ultheal02_rate: 0,
    ultheal02_value: 0,
    vfx_music_duration: 20,
  },
  attributeModifiers: [],
  lifecycleSequences: { trigger: { $sequence: 'launchProjectile_2' } },
  actionGraph: liinoBuff33ActionGraph,
};

const liinoBuff34ActionGraph = {
  main: {
    nodes: {
      heal_1: {
        action: {
          kind: 'heal',
          parameters: {
            target: 'buffOwner',
            alwaysNext: true,
            tags: ['Skill/Character/Common/Heal/UltimateSkillHeal'],
            amount: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: null,
      },
      storeSourceAttributeValue_2: {
        action: {
          kind: 'storeSourceAttributeValue',
          parameters: {
            attribute: { kind: 'specific', key: 'agility' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'valueNode', nodeId: 'data_2' },
            base: { kind: 'valueNode', nodeId: 'data_3' },
            targetKey: 'final_heal_value',
          },
        },
        next: 'heal_1',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'final_heal_value' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'heal_value' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'heal_rate' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff34: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 1,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  triggerIntervalSeconds: 0.5,
  waitFirstTriggerInterval: true,
  maxTriggerCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 2, final_heal_value: 0, heal_rate: 500, heal_value: 0.2, potential_1: 0 },
  attributeModifiers: [],
  lifecycleSequences: { trigger: { $sequence: 'storeSourceAttributeValue_2' } },
  actionGraph: liinoBuff34ActionGraph,
};

const liinoBuff35ActionGraph = {
  main: {
    nodes: {
      heal_1: {
        action: {
          kind: 'heal',
          parameters: {
            target: 'buffOwner',
            alwaysNext: true,
            tags: ['Skill/Character/Common/Heal/UltimateSkillHeal'],
            amount: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: null,
      },
      storeSourceAttributeValue_2: {
        action: {
          kind: 'storeSourceAttributeValue',
          parameters: {
            attribute: { kind: 'specific', key: 'agility' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'valueNode', nodeId: 'data_2' },
            base: { kind: 'valueNode', nodeId: 'data_3' },
            targetKey: 'final_heal_value',
          },
        },
        next: 'heal_1',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'final_heal_value' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'heal_value' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'heal_rate' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff35: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 1,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: {
    duration: 0.5,
    final_heal_value: 0,
    heal_rate: 500,
    heal_value: 0.2,
    potential_1: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'storeSourceAttributeValue_2' } },
  actionGraph: liinoBuff35ActionGraph,
};

const liinoBuff36ActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'inputTarget' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0035_liino_ultskill_buff_atkup'],
            reason: 'other',
          },
        },
        next: null,
      },
      finishBuffsById_2: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'inputTarget' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0035_liino_normalskill_buff_atkup'],
            reason: 'other',
          },
        },
        next: 'finishBuffsById_1',
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_ultskill_buff_atkup',
                copiedBlackboardAssignments: {
                  spellenhance_rate: 'spellenhance_rate',
                  finish_duration: 'finish_duration',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      applyBuff_4: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_atkup_owner',
                copiedBlackboardAssignments: { atk_up: 'atk_up', duration: 'duration_atkup' },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            asChildBuff: true,
          },
        },
        next: 'applyBuff_3',
      },
      aura_5: {
        action: {
          kind: 'aura',
          parameters: {
            targets: { kind: 'characterTeam', excludeOwner: true },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_normalskill_buff_atkup',
                blackboardAssignments: {
                  atk_up: { kind: 'valueNode', nodeId: 'data_1' },
                  finish_duration: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {},
              },
              {
                buffId: 'buff_chr_0035_liino_ultskill_buff_atkup',
                blackboardAssignments: {
                  spellenhance_rate: { kind: 'valueNode', nodeId: 'data_3' },
                  finish_duration: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {},
              },
            ],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: 'finishBuffsById_2' },
        },
        next: 'applyBuff_4',
      },
      applyBuff_6: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_talent_shelter_finishtime_ultskill',
                copiedBlackboardAssignments: {
                  shelter: 'shelter',
                  duration: 'shelter_duration',
                  heal_rate: 'healtaken_rate',
                },
              },
            ],
            targets: { kind: 'inputTarget' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      aura_7: {
        action: {
          kind: 'aura',
          parameters: {
            targets: { kind: 'characterTeam', excludeOwner: false },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            buffs: [
              {
                buffId: 'buff_chr_0035_liino_talent_shelter_ultskill',
                blackboardAssignments: {
                  shelter: { kind: 'valueNode', nodeId: 'data_4' },
                  heal_rate: { kind: 'valueNode', nodeId: 'data_5' },
                },
                stringBlackboardAssignments: {},
              },
            ],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: 'applyBuff_6' },
        },
        next: null,
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'aura_7',
      },
      withActionBlackboardScope_9: {
        action: {
          kind: 'withActionBlackboardScope',
          parameters: {
            scopeKey: 'native-buff-callback:1',
            lifetime: 'execution',
            alwaysNext: true,
            shareParentBlackboard: true,
            initialValues: {},
            inheritParent: true,
          },
          body: { $sequence: 'checkCondition_8' },
        },
        next: null,
      },
      withActionBlackboardScope_10: {
        action: {
          kind: 'withActionBlackboardScope',
          parameters: {
            scopeKey: 'native-buff-callback:0',
            lifetime: 'execution',
            alwaysNext: true,
            shareParentBlackboard: true,
            initialValues: {},
            inheritParent: true,
          },
          body: { $sequence: 'aura_5' },
        },
        next: 'withActionBlackboardScope_9',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_up' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'finish_duration' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'spellenhance_rate' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'shelter' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'healtaken_rate' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'talent_a', fallback: 0 } },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_6' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff36: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: false,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: true,
    useWeakProgressInNormalSkillButton: true,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: true,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'LifeTime',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: ['Skill/Character/chr_0035_liino/UltSkillMusic'],
  extendTags: [],
  blackboard: {
    atk_up: 0,
    duration: 15,
    duration_atkup: -1,
    finish_duration: 0,
    healtaken_rate: 0,
    shelter: 0,
    shelter_duration: 0,
    shelter_teammate: 0,
    spellenhance_rate: 0.2,
    talent_a: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'withActionBlackboardScope_10' } },
  actionGraph: liinoBuff36ActionGraph,
};

const liinoBuff37ActionGraph = {
  main: {
    nodes: {
      restrictUltimateEnergyRecovery_1: {
        action: {
          kind: 'restrictUltimateEnergyRecovery',
          parameters: {
            target: 'caster',
            allowedRecoveryTags: [],
            clearUltimateEnergyOnEnd: false,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const liinoBuff37: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: { blackboardKey: 'rate', negate: true },
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 1 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'restrictUltimateEnergyRecovery_1' } },
  actionGraph: liinoBuff37ActionGraph,
};

export const liino: OperatorDefinition = {
  slug: 'liino',
  gameId: 'LIINO',
  rarity: 6,
  weaponType: 'lance',
  element: 'electric',
  characterTypeId: 'Pulse',
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
  passiveUi: {
    kind: 'buffProgress',
    appearance: 'liinoMusic',
    normalBuffId: 'buff_chr_0035_liino_normalskill_music_tag',
    ultimateBuffId: 'buff_chr_0035_liino_ultskill_music_tag',
  },
  skillGroups: [
    { key: 'comboSkill', operationType: 'comboSkill', skills: liinoChr_0035_liino_combo_skill },
    {
      key: 'basicAttack',
      operationType: 'basicAttack',
      skills: [
        liinoChr_0035_liino_attack1,
        liinoChr_0035_liino_attack2,
        liinoChr_0035_liino_attack3,
        liinoChr_0035_liino_attack4,
        liinoChr_0035_liino_attack5,
      ],
    },
    { key: 'finisher', operationType: 'finisher', skills: liinoChr_0035_liino_power_attack },
    {
      key: 'plungingAttack',
      operationType: 'plungingAttack',
      skills: liinoChr_0035_liino_plunging_attack_end,
    },
    {
      key: 'battleSkill',
      operationType: 'battleSkill',
      skills: liinoChr_0035_liino_normal_skill,
      replacementSkills: [liinoChr_0035_liino_normal_skill_combo],
      replacementSkillPlacements: { chr_0035_liino_normal_skill_combo: 'internal' },
    },
    {
      key: 'stanceTermination',
      operationType: 'battleSkill',
      nameKey: 'skillNames.stanceTermination',
      skills: liinoChr_0035_liino_normal_skill_end,
    },
    { key: 'ultimate', operationType: 'ultimate', skills: liinoChr_0035_liino_ultimate_skill },
  ],
  dodgeSkill: liinoCommon_character_perfect_dodge,
  dashBuffs: [
    { buffId: 'buff_common_dash', blackboard: { dodgeSkillId: 'common_character_perfect_dodge' } },
  ],
  skillSlots: [
    {
      key: 'battleSkill',
      baseSkillKey: 'chr_0035_liino_normal_skill',
      replacementSkillKeys: ['chr_0035_liino_normal_skill_end'],
    },
    { key: 'comboSkill', baseSkillKey: 'chr_0035_liino_combo_skill', replacementSkillKeys: [] },
    { key: 'ultimate', baseSkillKey: 'chr_0035_liino_ultimate_skill', replacementSkillKeys: [] },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'chr_0035_liino_attack1',
        'chr_0035_liino_attack2',
        'chr_0035_liino_attack3',
        'chr_0035_liino_attack4',
        'chr_0035_liino_attack5',
        'chr_0035_liino_plunging_attack_end',
        'chr_0035_liino_power_attack',
      ],
      normalAttackSkillKeys: [
        'chr_0035_liino_attack1',
        'chr_0035_liino_attack2',
        'chr_0035_liino_attack3',
        'chr_0035_liino_attack4',
        'chr_0035_liino_attack5',
      ],
      defaultSkillKey: 'chr_0035_liino_attack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  comboSkillConditions: [liinoComboCondition1, liinoComboCondition2],
  comboSkillPriority: 'default',
  talents: [
    {
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_normal_skill',
          blackboardKey: 'talent_a',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_normal_skill',
          blackboardKey: 'shelter',
          operation: 'assign',
          value: [-0.1, -0.2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_normal_skill',
          blackboardKey: 'healtaken_rate',
          operation: 'assign',
          value: [0.1, 0.2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_normal_skill',
          blackboardKey: 'shelter_duration',
          operation: 'assign',
          value: [3, 3],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'talent_a',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'shelter',
          operation: 'assign',
          value: [-0.1, -0.2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'healtaken_rate',
          operation: 'assign',
          value: [0.1, 0.2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'shelter_duration',
          operation: 'assign',
          value: [3, 3],
        },
      ],
    },
    {
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_combo_skill',
          blackboardKey: 'talent_b',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_combo_skill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: [5, 10],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_combo_skill',
          blackboardKey: 'atb_return_duration',
          operation: 'assign',
          value: [30, 30],
        },
      ],
    },
  ],
  potentials: [
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_normal_skill',
          blackboardKey: 'potential_atb_return',
          operation: 'assign',
          value: 25,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_normal_skill',
          blackboardKey: 'atk_up',
          operation: 'add',
          value: 0.06,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'atk_up',
          operation: 'add',
          value: 0.06,
        },
      ],
      attachedBuffs: [{ buffId: 'buff_chr_0035_liino_potential' }],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['will'], value: 20 },
        { kind: 'addStaticHealingIncrease', target: 'output', value: 0.1 },
      ],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'addSkillCooldownFrames', skillKey: 'chr_0035_liino_combo_skill', frames: -30 },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_combo_skill',
          blackboardKey: 'heal_value',
          operation: 'multiply',
          value: 1.4,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_combo_skill',
          blackboardKey: 'heal_rate',
          operation: 'multiply',
          value: 1.4,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_combo_skill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.4,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_combo_skill',
          blackboardKey: 'atk_scale_2',
          operation: 'multiply',
          value: 1.4,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillKey: 'chr_0035_liino_ultimate_skill',
          resource: 'ultimateEnergy',
          multiplier: 0.85,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'will_up',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'will_max',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'atk_scale_2',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'atk_scale_3',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_ultimate_skill',
          blackboardKey: 'atk_scale_4',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_normal_skill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_normal_skill',
          blackboardKey: 'atk_scale_2',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0035_liino_normal_skill',
          blackboardKey: 'atk_scale_3',
          operation: 'multiply',
          value: 1.2,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0035_liino_atkup: liinoBuff1,
    buff_chr_0035_liino_atkup_owner: liinoBuff2,
    buff_chr_0035_liino_combo_atb_return: liinoBuff3,
    buff_chr_0035_liino_comboskill_ultskill_hit: liinoBuff4,
    buff_chr_0035_liino_normalskill_buff_atkup: liinoBuff5,
    buff_chr_0035_liino_normalskill_end: liinoBuff6,
    buff_chr_0035_liino_normalskill_end_active: liinoBuff7,
    buff_chr_0035_liino_normalskill_music_animation_hitl: liinoBuff8,
    buff_chr_0035_liino_normalskill_music_animation_hitr: liinoBuff9,
    buff_chr_0035_liino_normalskill_music_cd_uishow: liinoBuff10,
    buff_chr_0035_liino_normalskill_music_cry_vfx: liinoBuff11,
    buff_chr_0035_liino_normalskill_music_damage: liinoBuff12,
    buff_chr_0035_liino_normalskill_music_tag: liinoBuff13,
    buff_chr_0035_liino_normalskill_spelllnfliction_check: liinoBuff14,
    buff_chr_0035_liino_normalskill_spelllnfliction_extraattack: liinoBuff15,
    buff_chr_0035_liino_potential: liinoBuff16,
    buff_chr_0035_liino_potential_enterfight: liinoBuff17,
    buff_chr_0035_liino_showhide: liinoBuff18,
    buff_chr_0035_liino_showhide_attack: liinoBuff19,
    buff_chr_0035_liino_showhide_audio: liinoBuff20,
    buff_chr_0035_liino_showhide_audio_fire: liinoBuff21,
    buff_chr_0035_liino_showhide_fire: liinoBuff22,
    buff_chr_0035_liino_skill_end: liinoBuff23,
    buff_chr_0035_liino_spellenhance: liinoBuff24,
    buff_chr_0035_liino_talent_shelter: liinoBuff25,
    buff_chr_0035_liino_talent_shelter_finishtime: liinoBuff26,
    buff_chr_0035_liino_talent_shelter_finishtime_normalskill: liinoBuff27,
    buff_chr_0035_liino_talent_shelter_finishtime_ultskill: liinoBuff28,
    buff_chr_0035_liino_talent_shelter_normalskill: liinoBuff29,
    buff_chr_0035_liino_talent_shelter_ultskill: liinoBuff30,
    buff_chr_0035_liino_ultskill_buff_atkup: liinoBuff31,
    buff_chr_0035_liino_ultskill_end: liinoBuff32,
    buff_chr_0035_liino_ultskill_music_damage: liinoBuff33,
    buff_chr_0035_liino_ultskill_music_heal: liinoBuff34,
    buff_chr_0035_liino_ultskill_music_heal_start: liinoBuff35,
    buff_chr_0035_liino_ultskill_music_tag: liinoBuff36,
    buff_chr_0035_liino_ultskill_refrainobtainusp: liinoBuff37,
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0035_liino_ult_skill_projhit: {
      bornTags: [
        'Immune',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 5 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0035_liino_ultimate_skill_projhit_abilityentity',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 41,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atk_scale: 0, atk_scale_2: 0, poise: 0 },
        scheduledSequences: [
          { startFrame: 0, endFrame: 0, sequence: { $sequence: 'ifElse_6' } },
          { startFrame: 3, endFrame: 3, sequence: { $sequence: 'ifElse_12' } },
          { startFrame: 6, endFrame: 6, sequence: { $sequence: 'ifElse_18' } },
          { startFrame: 8, endFrame: 8, sequence: { $sequence: 'ifElse_24' } },
          { startFrame: 11, endFrame: 11, sequence: { $sequence: 'ifElse_30' } },
          { startFrame: 15, endFrame: 15, sequence: { $sequence: 'ifElse_36' } },
          { startFrame: 18, endFrame: 18, sequence: { $sequence: 'ifElse_42' } },
          { startFrame: 40, endFrame: 40, sequence: { $sequence: 'ifElse_46' } },
          { startFrame: 21, endFrame: 21, sequence: { $sequence: 'ifElse_52' } },
          { startFrame: 25, endFrame: 25, sequence: { $sequence: 'ifElse_58' } },
          { startFrame: 28, endFrame: 28, sequence: { $sequence: 'ifElse_64' } },
        ],
        actionGraph: {
          main: {
            nodes: {
              launchProjectile_4: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_4/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_5: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_5/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_4',
              },
              launchProjectile_2: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_2/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_3: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_3/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_2',
              },
              checkCondition_1: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                },
                next: null,
              },
              ifElse_6: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_3' },
                  whenFalse: { $sequence: 'launchProjectile_5' },
                },
                next: null,
              },
              launchProjectile_10: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_10/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_11: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_11/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_10',
              },
              launchProjectile_8: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_8/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_9: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_9/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_8',
              },
              ifElse_12: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_9' },
                  whenFalse: { $sequence: 'launchProjectile_11' },
                },
                next: null,
              },
              launchProjectile_16: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_16/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_17: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_17/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_16',
              },
              launchProjectile_14: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_14/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_15: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_15/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_14',
              },
              ifElse_18: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_15' },
                  whenFalse: { $sequence: 'launchProjectile_17' },
                },
                next: null,
              },
              launchProjectile_22: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_r',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_22/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_23: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_l',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_23/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_22',
              },
              launchProjectile_20: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_r',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_20/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_21: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_l',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_21/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_20',
              },
              ifElse_24: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_21' },
                  whenFalse: { $sequence: 'launchProjectile_23' },
                },
                next: null,
              },
              launchProjectile_28: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_r',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_28/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_29: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_l',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_29/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_28',
              },
              launchProjectile_26: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_r',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_26/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_27: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_l',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_27/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_26',
              },
              ifElse_30: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_27' },
                  whenFalse: { $sequence: 'launchProjectile_29' },
                },
                next: null,
              },
              launchProjectile_34: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_34/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_35: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_35/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_34',
              },
              launchProjectile_32: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_32/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_33: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_33/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_32',
              },
              ifElse_36: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_33' },
                  whenFalse: { $sequence: 'launchProjectile_35' },
                },
                next: null,
              },
              launchProjectile_40: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_40/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_41: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_41/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_40',
              },
              launchProjectile_38: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_38/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_39: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_39/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_38',
              },
              ifElse_42: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_39' },
                  whenFalse: { $sequence: 'launchProjectile_41' },
                },
                next: null,
              },
              launchProjectile_45: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.133333340287209,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_damage_02',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 4,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: {
                          atk_scale_2: 0.1,
                          count: 1,
                          duration_spellvulnerable: 0,
                          hit_cnt: 1,
                          poise: 10,
                          rate_spellvulnerable: 0,
                        },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                          {
                            startFrame: 0,
                            endFrame: 4,
                            sequence: { $sequence: 'forceSpellStatus_3' },
                          },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              startTimeDilation_1: {
                                action: {
                                  kind: 'startTimeDilation',
                                  parameters: {
                                    scope: 'entity',
                                    durationSeconds: { kind: 'constant', value: 0.25 },
                                    slot: 'TimeDilation/Layer/Entity/HitStop',
                                    priority: 10,
                                    curve: { kind: 'named', key: 'char_hard_stop' },
                                    finishByAction: false,
                                    targets: ['enemy', 'caster'],
                                  },
                                },
                                next: null,
                              },
                              dealDamage_2: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_45/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_2/action',
                                },
                                next: 'startTimeDilation_1',
                              },
                              forceSpellStatus_3: {
                                action: {
                                  kind: 'forceSpellStatus',
                                  parameters: {
                                    target: 'enemy',
                                    element: 'electric',
                                    consumedElement: 'electric',
                                    consumedLayers: { kind: 'constant', value: 0 },
                                    count: { kind: 'valueNode', nodeId: 'data_3' },
                                    isExtra: false,
                                  },
                                },
                                next: 'dealDamage_2',
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale_2' },
                              },
                              data_2: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'poise' },
                              },
                              data_3: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'count' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_44: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.133333340287209,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit_damage_02',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 4,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: {
                          atk_scale_2: 0.1,
                          count: 1,
                          duration_spellvulnerable: 0,
                          hit_cnt: 1,
                          poise: 10,
                          rate_spellvulnerable: 0,
                        },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 4, sequence: { $sequence: null } },
                          {
                            startFrame: 0,
                            endFrame: 4,
                            sequence: { $sequence: 'forceSpellStatus_3' },
                          },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              startTimeDilation_1: {
                                action: {
                                  kind: 'startTimeDilation',
                                  parameters: {
                                    scope: 'entity',
                                    durationSeconds: { kind: 'constant', value: 0.25 },
                                    slot: 'TimeDilation/Layer/Entity/HitStop',
                                    priority: 10,
                                    curve: { kind: 'named', key: 'char_hard_stop' },
                                    finishByAction: false,
                                    targets: ['enemy', 'caster'],
                                  },
                                },
                                next: null,
                              },
                              dealDamage_2: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_44/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_2/action',
                                },
                                next: 'startTimeDilation_1',
                              },
                              forceSpellStatus_3: {
                                action: {
                                  kind: 'forceSpellStatus',
                                  parameters: {
                                    target: 'enemy',
                                    element: 'electric',
                                    consumedElement: 'electric',
                                    consumedLayers: { kind: 'constant', value: 0 },
                                    count: { kind: 'valueNode', nodeId: 'data_3' },
                                    isExtra: false,
                                  },
                                },
                                next: 'dealDamage_2',
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale_2' },
                              },
                              data_2: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'poise' },
                              },
                              data_3: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'count' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              ifElse_46: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_44' },
                  whenFalse: { $sequence: 'launchProjectile_45' },
                },
                next: null,
              },
              launchProjectile_50: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_50/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_51: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_51/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_50',
              },
              launchProjectile_48: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_48/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_49: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_49/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_48',
              },
              ifElse_52: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_49' },
                  whenFalse: { $sequence: 'launchProjectile_51' },
                },
                next: null,
              },
              launchProjectile_56: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_56/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_57: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_57/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_56',
              },
              launchProjectile_54: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_54/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_55: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_55/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_54',
              },
              ifElse_58: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_55' },
                  whenFalse: { $sequence: 'launchProjectile_57' },
                },
                next: null,
              },
              launchProjectile_62: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_62/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_63: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_63/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_62',
              },
              launchProjectile_60: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_60/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: null,
              },
              launchProjectile_61: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: 'firstTickReach',
                    recycleDelaySeconds: 0.100000001490116,
                  },
                  callbacks: [
                    {
                      event: 'reach',
                      skill: {
                        skillId: 'chr_0035_liino_ultimate_skill_projhit',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 3,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale: 0.1, poise: 5 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'electric',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    takeAttackSnapshot: true,
                                    tags: ['ultimateSkill'],
                                  },
                                  key: 'abilityentity_chr_0035_liino_ult_skill_projhit:chr_0035_liino_ultimate_skill_projhit_abilityentity:/childSkill/actionGraph/main/nodes/launchProjectile_61/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale' },
                              },
                            },
                          },
                          macros: {},
                        },
                      },
                    },
                  ],
                },
                next: 'launchProjectile_60',
              },
              ifElse_64: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'launchProjectile_61' },
                  whenFalse: { $sequence: 'launchProjectile_63' },
                },
                next: null,
              },
            },
            dataNodes: {
              data_1: {
                type: 'boolean',
                expression: {
                  kind: 'entityCountCompare',
                  target: { kind: 'fixed', target: 'enemy' },
                  containsHittableTarget: false,
                  excludeDeadEntity: false,
                  operator: 'greaterOrEqual',
                  value: 1,
                },
              },
            },
          },
          macros: {},
        },
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;

export default liino;
