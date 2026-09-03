/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const fluoriteBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0022_bounda_attack1',
    timelineBlockFrames: 22,
    naturalDurationFrames: 132,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 10,
          endFrame: 40,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0022_bounda_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 22, endFrame: 40, sourceSkillIds: ['chr_0022_bounda_attack2'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack1.actionGroupData.timelineActions[5]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack1.actionGroupData.timelineActions[5]._sequenceActionData.actionData[1]:chr_0022_bounda_attack1_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0022_bounda_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        14,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.25, 0.280000001192093, 0.300000011920929, 0.330000013113022, 0.349999994039536,
      0.379999995231628, 0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164,
      0.519999980926514, 0.560000002384186,
    ],
  },
);

export const fluoriteBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0022_bounda_attack2',
    timelineBlockFrames: 15,
    naturalDurationFrames: 106,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 10,
          endFrame: 36,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0022_bounda_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 15, endFrame: 36, sourceSkillIds: ['chr_0022_bounda_attack3'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack2.actionGroupData.timelineActions[4]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack2.actionGroupData.timelineActions[4]._sequenceActionData.actionData[1]:chr_0022_bounda_attack2_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0022_bounda_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        12,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978, 0.46000000834465,
      0.490000009536743, 0.519999980926514, 0.550000011920929, 0.589999973773956, 0.629999995231628,
      0.670000016689301, 0.730000019073486,
    ],
    display_atk_scale: [
      0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978, 0.46000000834465,
      0.490000009536743, 0.519999980926514, 0.550000011920929, 0.589999973773956, 0.629999995231628,
      0.670000016689301, 0.730000019073486,
    ],
  },
);

export const fluoriteBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0022_bounda_attack3',
    timelineBlockFrames: 18,
    naturalDurationFrames: 137,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 10,
          endFrame: 24,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0022_bounda_attack4',
        },
        {
          startFrame: 24,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0022_bounda_attack4_1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 18, endFrame: 24, sourceSkillIds: ['chr_0022_bounda_attack4'] },
        { startFrame: 24, endFrame: 30, sourceSkillIds: ['chr_0022_bounda_attack4_1'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0022_bounda_attack3_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0022_bounda_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
                    sequence(
                      branch(
                        { kind: 'casterControlled' },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'sp',
                            amount: { kind: 'blackboard', key: 'atb' },
                            coefficient: { kind: 'constant', value: 0.333333313465118 },
                            recipient: 'team',
                            spGainKind: 'gain',
                            spGainSource: 'normalAttack',
                          }),
                        ),
                      ),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        10,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.259999990463257, 0.280000001192093, 0.310000002384186, 0.330000013113022, 0.360000014305115,
      0.379999995231628, 0.409999996423721, 0.430000007152557, 0.46000000834465, 0.490000009536743,
      0.529999971389771, 0.569999992847443,
    ],
  },
);

export const fluoriteBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0022_bounda_attack4',
    timelineBlockFrames: 52,
    naturalDurationFrames: 153,
    exclusiveFrame: 55,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 29,
          endFrame: 71,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0022_bounda_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 52, endFrame: 71, sourceSkillIds: ['chr_0022_bounda_attack1'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        29,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0022_bounda_attack4_projhit',
                { atb: 0, atk_scale: 0, attack_poise: 20 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack', 'normalAttackLastCombo'],
                      stagger: { kind: 'blackboard', key: 'attack_poise' },
                      staggerOnlyWhenCasterControlled: true,
                    },
                    'chr_0022_bounda_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
                    sequence(
                      branch(
                        { kind: 'casterControlled' },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'sp',
                            amount: { kind: 'blackboard', key: 'atb' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'team',
                            spGainKind: 'gain',
                            spGainSource: 'normalAttack',
                          }),
                        ),
                      ),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        30,
      ),
      scheduled(
        26,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'slow' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        29,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 15,
    atk_scale: [
      0.600000023841858, 0.660000026226044, 0.720000028610229, 0.779999971389771, 0.839999973773956,
      0.899999976158142, 0.959999978542328, 1.01999998092651, 1.08000004291534, 1.1599999666214,
      1.25, 1.35000002384186,
    ],
    attack_poise: 15,
    display_atk_scale: [
      1.79999995231628, 1.98000001907349, 2.16000008583069, 2.33999991416931, 2.51999998092651,
      2.70000004768372, 2.88000011444092, 3.05999994277954, 3.24000000953674, 3.47000002861023,
      3.74000000953674, 4.05000019073486,
    ],
  },
);

export const fluoriteBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0022_bounda_attack4_1',
    timelineBlockFrames: 49,
    naturalDurationFrames: 150,
    exclusiveFrame: 52,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 10,
          endFrame: 70,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0022_bounda_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 49, endFrame: 70, sourceSkillIds: ['chr_0022_bounda_attack1'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        26,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack4_1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack4_1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0022_bounda_attack4_projhit',
                { atb: 0, atk_scale: 0, attack_poise: 20 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack', 'normalAttackLastCombo'],
                      stagger: { kind: 'blackboard', key: 'attack_poise' },
                      staggerOnlyWhenCasterControlled: true,
                    },
                    'chr_0022_bounda_attack4_1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
                    sequence(
                      branch(
                        { kind: 'casterControlled' },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'sp',
                            amount: { kind: 'blackboard', key: 'atb' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'team',
                            spGainKind: 'gain',
                            spGainSource: 'normalAttack',
                          }),
                        ),
                      ),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        27,
      ),
      scheduled(
        23,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'slow' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        26,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 15,
    atk_scale: [
      0.600000023841858, 0.660000026226044, 0.720000028610229, 0.779999971389771, 0.839999973773956,
      0.899999976158142, 0.959999978542328, 1.01999998092651, 1.08000004291534, 1.1599999666214,
      1.25, 1.35000002384186,
    ],
    attack_poise: 15,
    display_atk_scale: [
      1.79999995231628, 1.98000001907349, 2.16000008583069, 2.33999991416931, 2.51999998092651,
      2.70000004768372, 2.88000011444092, 3.05999994277954, 3.24000000953674, 3.47000002861023,
      3.74000000953674, 4.05000019073486,
    ],
  },
);

export const fluoriteFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0022_bounda_power_attack',
    timelineBlockFrames: 22,
    naturalDurationFrames: 127,
    exclusiveFrame: 45,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 22,
          endFrame: 45,
          sourceSkillIds: ['chr_0022_bounda_normal_skill', 'chr_0022_bounda_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0022_bounda_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        21,
      ),
      scheduled(
        18,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.119999997317791 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        24,
      ),
      scheduled(
        21,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.25 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        25,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_full_immune_medium',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        45,
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
        22,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  {
    atk_scale: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
  },
);

export const fluoritePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0022_bounda_plunging_attack_end',
    timelineBlockFrames: 21,
    naturalDurationFrames: 90,
    exclusiveFrame: 20,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0022_bounda_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'default',
              }),
            ),
          ),
        ),
        6,
      ),
    ],
    skillType: 'plungingAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
    cd: 15,
    dmg_scale: 2.5,
    poise: 5,
    prob: 0.5,
  },
);

export const fluoriteBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0022_bounda_normal_skill',
    timelineBlockFrames: 35,
    naturalDurationFrames: 101,
    exclusiveFrame: 34,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        2,
      ),
      scheduled(
        10,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0022_bounda_normal_skill_onlymark',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_normal_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[2]:projectile_chr_0022_bounda_normal_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_normal_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[2]:chr_0022_bounda_normal_skill_projhit',
                {
                  atk_scale: 0,
                  boom_up: 0,
                  duration: 0,
                  duration_potential: 0,
                  move_speed_scalar: 0,
                  poise: 30,
                  potential_lv: 0,
                },
                true,
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0022_bounda_normal_skill',
                    childSkillId: 'chr_0022_bounda_normal_skill_abilityrange',
                    inheritActionBlackboard: true,
                    inheritSourceSkillCastInfo: true,
                    dieWhenSourceDies: false,
                    target: 'enemy',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_common_affixes_slow',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'constant', value: 3.09999990463257 },
                      rate: { kind: 'blackboard', key: 'move_speed_scalar' },
                    },
                  }),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        11,
      ),
      scheduled(
        12,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.100000001490116 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'slow' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        14,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atk_scale: [
      1.87000000476837, 2.05999994277954, 2.24000000953674, 2.4300000667572, 2.61999988555908,
      2.79999995231628, 2.99000000953674, 3.1800000667572, 3.35999989509583, 3.59999990463257,
      3.88000011444092, 4.19999980926514,
    ],
    boom_up: 0.300000011920929,
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    duration: 3,
    duration_potential: 0,
    gained_atb: 0,
    input_angle: 0,
    move_speed_scalar: 0.300000011920929,
    poise: 10,
    potential_lv: 0,
  },
);

export const fluoriteUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0022_bounda_ultimate_skill',
    timelineBlockFrames: 77,
    naturalDurationFrames: 120,
    exclusiveFrame: 90,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 68,
          endFrame: 94,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0022_bounda_attack1',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 77,
          endFrame: 94,
          sourceSkillIds: [
            'chr_0022_bounda_attack1',
            'chr_0022_bounda_normal_skill',
            'chr_0022_bounda_combo_skill',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
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
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_ult_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        90,
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
        56,
      ),
      scheduled(
        59,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:projectile_chr_0022_bounda_ultimate_skill_1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:chr_0022_bounda_ultimate_skill_1_projhit',
                { atb: 0, atk_scale1: 0, poise: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0022_bounda_ultimate_skill:/scheduledSequences/3/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0022_bounda_ultimate_skill',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        60,
      ),
      scheduled(
        63,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:projectile_chr_0022_bounda_ultimate_skill_1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:chr_0022_bounda_ultimate_skill_2_projhit',
                { atb: 0, atk_scale2: 0, atk_scale3: 0, poise: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                      tags: ['ultimateSkill'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0022_bounda_ultimate_skill:/scheduledSequences/4/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0022_bounda_ultimate_skill',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        64,
      ),
      scheduled(
        67,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:projectile_chr_0022_bounda_ultimate_skill_1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:chr_0022_bounda_ultimate_skill_3_projhit',
                { atb: 0, atk_scale3: 0, poise: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale3' },
                      tags: ['ultimateSkill'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0022_bounda_ultimate_skill:/scheduledSequences/5/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0022_bounda_ultimate_skill',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        68,
      ),
      scheduled(
        72,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0]:projectile_chr_0022_bounda_ultimate_skill_1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0]:chr_0022_bounda_ultimate_skill_4_projhit',
                { atb: 0, atk_scale4: 0, poise: 0 },
                true,
                sequence(
                  branch(
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 2 },
                    },
                    sequence(
                      step('applyElementalInfliction', { element: 'nature', isExtra: false }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 2 },
                        },
                        sequence(
                          step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                    { alwaysNext: true },
                  ),
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale4' },
                      tags: ['ultimateSkill'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0022_bounda_ultimate_skill:/scheduledSequences/6/sequence/steps/0/body/steps/0/body/steps/1',
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0022_bounda_ultimate_skill',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        73,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale1: [
      1.11000001430511, 1.22000002861023, 1.33000004291534, 1.44000005722046, 1.55999994277954,
      1.66999995708466, 1.77999997138977, 1.88999998569489, 2, 2.14000010490417, 2.30999994277954,
      2.5,
    ],
    atk_scale2: [
      1.11000001430511, 1.22000002861023, 1.33000004291534, 1.44000005722046, 1.55999994277954,
      1.66999995708466, 1.77999997138977, 1.88999998569489, 2, 2.14000010490417, 2.30999994277954,
      2.5,
    ],
    atk_scale3: [
      1.11000001430511, 1.22000002861023, 1.33000004291534, 1.44000005722046, 1.55999994277954,
      1.66999995708466, 1.77999997138977, 1.88999998569489, 2, 2.14000010490417, 2.30999994277954,
      2.5,
    ],
    atk_scale4: [
      1.11000001430511, 1.22000002861023, 1.33000004291534, 1.44000005722046, 1.55999994277954,
      1.66999995708466, 1.77999997138977, 1.88999998569489, 2, 2.14000010490417, 2.30999994277954,
      2.5,
    ],
    boom_up: 0.300000011920929,
    duration: 12,
    ex_usp_up: 0.3,
    has_potential4: 0,
    poise: 5,
  },
);

export const fluoriteComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0022_bounda_combo_skill',
    timelineBlockFrames: 17,
    naturalDurationFrames: 93,
    exclusiveFrame: 24,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 17, endFrame: 56, sourceSkillIds: ['chr_0022_bounda_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        1,
      ),
      scheduled(
        15,
        sequence(
          {
            kind: 'switch',
            parameters: {
              choice: { kind: 'blackboard', key: 'EntityBB_combo_index' },
              alwaysNext: true,
            },
            options: [
              {
                value: { kind: 'constant', value: 2 },
                sequence: sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                ),
              },
              {
                value: { kind: 'constant', value: 3 },
                sequence: sequence(
                  step('applyElementalInfliction', { element: 'nature', isExtra: false }),
                ),
              },
            ],
          },
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0022_bounda_combo_skill:/scheduledSequences/1/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
          ),
        ),
        18,
      ),
      scheduled(
        11,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.300000011920929 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'slow' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        20,
      ),
      scheduled(
        16,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.330000013113022 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'bounda_power_attack' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              ),
            ),
          ),
        ),
        19,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.532999992370605 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        13,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1140],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atb: 10,
    atk_scale: [
      1.69000005722046, 1.86000001430511, 2.02999997138977, 2.20000004768372, 2.36999988555908,
      2.53999996185303, 2.70000004768372, 2.86999988555908, 3.03999996185303, 3.25,
      3.50999999046326, 3.79999995231628,
    ],
    atk_scale_add: 1.5,
    atk_scale_add_1: [
      0.400000005960464, 0.449999988079071, 0.5, 0.550000011920929, 0.600000023841858,
      0.649999976158142, 0.699999988079071, 0.75, 0.800000011920929, 1, 1.20000004768372,
      1.20000004768372,
    ],
    atk_scale_add_2: [
      0.800000011920929, 0.899999976158142, 1, 1.10000002384186, 1.20000004768372, 1.29999995231628,
      1.39999997615814, 1.5, 1.60000002384186, 2, 2.40000009536743, 2.40000009536743,
    ],
    atk_scale_add_3: [
      1.04999995231628, 1.20000004768372, 1.35000002384186, 1.5, 1.64999997615814, 1.79999995231628,
      1.95000004768372, 2.09999990463257, 2.25, 2.59999990463257, 3.20000004768372,
      3.20000004768372,
    ],
    atk_scale_add_4: [
      1.33000004291534, 1.5, 1.66999995708466, 1.83000004291534, 2, 2.1800000667572,
      2.34999990463257, 2.51999998092651, 2.69000005722046, 3.32999992370605, 4.15000009536743,
      4.15000009536743,
    ],
    atk_scale_potential5: 1.3,
    cam_angle: 0,
    cam_angle2: 0,
    cam_duration: 0,
    cam_duration2: 0,
    duration: 3,
    infliction_num: 0,
    input_angle: 0,
    input_angle2: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    potential_lv: 0,
    usp: 10,
  },
);

export default {
  slug: 'fluorite',
  gameId: 'FLUORITE',
  rarity: 4,
  weaponType: 'handcannon',
  element: 'nature',
  role: 'caster',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [14, 30, 47, 64, 81, 90],
    agility: [14, 47, 81, 116, 150, 168],
    intellect: [12, 34, 57, 80, 103, 114],
    will: [10, 27, 45, 64, 82, 91],
    baseAttack: [30, 88, 150, 211, 272, 303],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        fluoriteBasicAttack1,
        fluoriteBasicAttack2,
        fluoriteBasicAttack3,
        fluoriteBasicAttack4,
        fluoriteBasicAttack5,
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: fluoriteFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: fluoritePlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: fluoriteBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: fluoriteUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: fluoriteComboSkill,
    },
  ],
  skillSlots: [
    { key: 'battleSkill', baseSkillKey: 'battleSkill', replacementSkillKeys: [] },
    { key: 'comboSkill', baseSkillKey: 'comboSkill', replacementSkillKeys: [] },
    { key: 'ultimate', baseSkillKey: 'ultimate', replacementSkillKeys: [] },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'basicAttack1',
        'basicAttack2',
        'basicAttack3',
        'basicAttack4',
        'basicAttack5',
        'plungingAttack',
        'finisher',
      ],
      defaultSkillKey: 'basicAttack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  comboSkillConditions: [
    {
      key: 'native-combo:0',
      skillKey: 'comboSkill',
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'contextTargetBuffStackCompare',
            contextKey: 'trigger',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
            operator: 'greaterOrEqual',
            value: { kind: 'constant', value: 1 },
          },
          sequence(
            branch(
              {
                kind: 'eventInflictionElementIn',
                elements: ['cryo'],
                outputKey: 'EntityBB_combo_index',
              },
              sequence(),
            ),
          ),
        ),
      ),
    },
    {
      key: 'native-combo:1',
      skillKey: 'comboSkill',
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'contextTargetBuffStackCompare',
            contextKey: 'trigger',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
            operator: 'greaterOrEqual',
            value: { kind: 'constant', value: 1 },
          },
          sequence(
            branch(
              {
                kind: 'eventInflictionElementIn',
                elements: ['nature'],
                outputKey: 'EntityBB_combo_index',
              },
              sequence(),
            ),
          ),
        ),
      ),
    },
  ],
  comboSkillPriority: 'default',
  talents: [
    {
      key: 'talent1',
      levels: 2,
      passiveSkills: [
        {
          key: 'chr_0022_bounda_talent_1',
          blackboard: { dmg_up: [0.100000001490116, 0.200000002980232] },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0022_bounda_talent_1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: { dmg_up: { kind: 'blackboard', key: 'dmg_up' } },
            }),
          ),
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      passiveSkills: [
        {
          key: 'chr_0022_bounda_talent_2',
          blackboard: {
            atk_up: [0.100000001490116, 0.200000002980232],
            duration: [10, 10],
            probability: [0.200000002980232, 0.200000002980232],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0022_bounda_talent_2',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                atk_up: { kind: 'blackboard', key: 'atk_up' },
                duration: { kind: 'blackboard', key: 'duration' },
                probability: { kind: 'blackboard', key: 'probability' },
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
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 10 },
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 10 },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0022_bounda_talent_2',
          blackboardKey: 'probability',
          operation: 'add',
          value: 0.100000001490116,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'duration_potential',
          operation: 'assign',
          value: 6,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_lv',
          operation: 'assign',
          value: 3,
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
          multiplier: 0.899999976158142,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0022_bounda_potential_5_auro',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            CD: { kind: 'constant', value: 1 },
            reduce: { kind: 'constant', value: 1 },
          },
        }),
      ),
    },
  ],
  entityBlackboard: { EntityBB_combo_index: 0 },
  buffDefinitions: {
    buff_chr_0022_bounda_normal_skill_onlymark: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 5,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: ['Status/DisableNormalSkill'],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0022_bounda_potential_5_auro: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { CD: 1, dmg_up: 0, reduce: 1 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0022_bounda_potential_5_cd',
            target: 'enemy',
            source: 'buffOwner',
            finishByAction: true,
            blackboardAssignments: {
              CD: { kind: 'blackboard', key: 'CD' },
              reduce: { kind: 'blackboard', key: 'reduce' },
            },
          }),
        ),
      },
    },
    buff_chr_0022_bounda_potential_5_cd: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { CD: 0, dmg_up: 0, reduce: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeTakeInfliction',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'potential' },
              },
              sequence(
                branch(
                  { kind: 'eventInflictionElementIn', elements: ['cryo', 'nature'] },
                  sequence(
                    step('adjustSkillCooldown', {
                      target: 'caster',
                      skill: { kind: 'id', skillId: 'chr_0022_bounda_combo_skill' },
                      operation: 'reduce',
                      basis: 'absoluteSeconds',
                      value: { kind: 'blackboard', key: 'reduce' },
                    }),
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'potential',
                      durationSeconds: { kind: 'blackboard', key: 'CD' },
                      autoFinishByAction: false,
                    }),
                  ),
                ),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0022_bounda_talent_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { dmg_up: 0 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'entityTagMatch',
            target: 'enemy',
            tagQueryType: 'hasAny',
            tags: ['Skill/Character/Common/Affixes/Slow'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'attacker',
              zone: 'normal',
              addition: { blackboardKey: 'dmg_up' },
            },
          ],
        },
      ],
    },
    buff_chr_0022_bounda_talent_2: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0.1, duration: 10, probability: 0.2 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'entityTagMatch',
                target: 'buffOwner',
                tagQueryType: 'exceptAny',
                tags: ['Status/DashImmune', 'Status/DashSucceedImmune'],
              },
              sequence(
                branch(
                  { kind: 'eventDamageTypeIn', damageTypes: ['heat'] },
                  sequence(
                    branch(
                      {
                        kind: 'probability',
                        probability: { kind: 'blackboard', key: 'probability' },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_common_damage_immune_talent',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            duration: { kind: 'constant', value: 0.00999999977648258 },
                          },
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0022_bounda_talent_2_atkup',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'entityTagMatch',
                target: 'buffOwner',
                tagQueryType: 'exceptAny',
                tags: ['Status/DashImmune', 'Status/DashSucceedImmune'],
              },
              sequence(
                branch(
                  { kind: 'eventDamageTypeIn', damageTypes: ['electric'] },
                  sequence(
                    branch(
                      {
                        kind: 'probability',
                        probability: { kind: 'blackboard', key: 'probability' },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_common_damage_immune_talent',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            duration: { kind: 'constant', value: 0.00999999977648258 },
                          },
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0022_bounda_talent_2_atkup',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'entityTagMatch',
                target: 'buffOwner',
                tagQueryType: 'exceptAny',
                tags: ['Status/DashImmune', 'Status/DashSucceedImmune'],
              },
              sequence(
                branch(
                  { kind: 'eventDamageTypeIn', damageTypes: ['cryo'] },
                  sequence(
                    branch(
                      {
                        kind: 'probability',
                        probability: { kind: 'blackboard', key: 'probability' },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_common_damage_immune_talent',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            duration: { kind: 'constant', value: 0.00999999977648258 },
                          },
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0022_bounda_talent_2_atkup',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'entityTagMatch',
                target: 'buffOwner',
                tagQueryType: 'exceptAny',
                tags: ['Status/DashImmune', 'Status/DashSucceedImmune'],
              },
              sequence(
                branch(
                  { kind: 'eventDamageTypeIn', damageTypes: ['nature'] },
                  sequence(
                    branch(
                      {
                        kind: 'probability',
                        probability: { kind: 'blackboard', key: 'probability' },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_common_damage_immune_talent',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            duration: { kind: 'constant', value: 0.00999999977648258 },
                          },
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0022_bounda_talent_2_atkup',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0022_bounda_talent_2_atkup: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
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
      blackboard: { atk_up: 0.1, duration: 10 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
      ],
    },
    buff_chr_0022_bounda_ultimate_skill: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.200000002980232,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0022_bounda_normal_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 5 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0022_bounda_normal_skill_abilityrange',
        blackboard: {
          atk_scale: 1,
          boom_up: 0,
          duration: 0,
          duration_potential: 0,
          move_speed_scalar: 0,
          poise: 20,
          potential_lv: 0,
          usp: 5,
        },
        scheduledSequences: [
          scheduled(
            89,
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0022_bounda_normal_skill_onlymark',
                  'buff_chr_0022_bounda_ultimate_skill',
                ],
                reason: 'other',
              }),
              step('applyElementalInfliction', { element: 'nature', isExtra: false }),
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'abilityentity_chr_0022_bounda_normal_skill:chr_0022_bounda_normal_skill_abilityrange:/childSkill/scheduledSequences/0/sequence/steps/2',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_lv' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 3 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_common_affixes_slow',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'duration_potential' },
                      rate: { kind: 'blackboard', key: 'move_speed_scalar' },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
            90,
          ),
          scheduled(90, sequence(step('finishActionOwnerAbilityEntity', {})), 90),
          scheduled(
            149,
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0022_bounda_normal_skill_onlymark',
                  'buff_chr_0022_bounda_ultimate_skill',
                ],
                reason: 'other',
              }),
              step('applyElementalInfliction', { element: 'nature', isExtra: false }),
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  instantDamageScaleModifiers: [
                    {
                      side: 'attacker',
                      zone: 'product',
                      addition: { kind: 'constant', value: 0.300000011920929 },
                    },
                  ],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'abilityentity_chr_0022_bounda_normal_skill:chr_0022_bounda_normal_skill_abilityrange:/childSkill/scheduledSequences/2/sequence/steps/2',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_lv' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 3 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_common_affixes_slow',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'duration_potential' },
                      rate: { kind: 'blackboard', key: 'move_speed_scalar' },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
            150,
          ),
          scheduled(150, sequence(step('finishActionOwnerAbilityEntity', {})), 150),
          scheduled(
            0,
            sequence(
              step('jumpTimeline', {
                destinationFrame: 89,
                condition: {
                  kind: 'healthCompare',
                  target: 'enemy',
                  valueType: 'ratio',
                  operator: 'lessOrEqual',
                  value: { kind: 'constant', value: 0 },
                },
              }),
            ),
            89,
          ),
          scheduled(
            0,
            sequence(
              step('jumpTimeline', {
                destinationFrame: 149,
                condition: {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0022_bounda_ultimate_skill'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              }),
            ),
            89,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
