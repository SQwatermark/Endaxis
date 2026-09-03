/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachTarget,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const endministratorBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0003_endminf_attack1',
    timelineBlockFrames: 9,
    naturalDurationFrames: 179,
    exclusiveFrame: 12,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 5,
          endFrame: 24,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0003_endminf_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 9, endFrame: 24, sourceSkillIds: ['chr_0003_endminf_attack2'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0003_endminf_attack1:/scheduledSequences/0/sequence/steps/0',
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
                spGainSource: 'normalAttack',
              }),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        7,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.230000004172325, 0.25, 0.270000010728836, 0.28999999165535, 0.319999992847443,
      0.340000003576279, 0.360000014305115, 0.389999985694885, 0.409999996423721, 0.439999997615814,
      0.469999998807907, 0.509999990463257,
    ],
    poise: 0,
  },
);

export const endministratorBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0003_endminf_attack2',
    timelineBlockFrames: 12,
    naturalDurationFrames: 105,
    exclusiveFrame: 15,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 4,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0003_endminf_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 12, endFrame: 30, sourceSkillIds: ['chr_0003_endminf_attack3'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0003_endminf_attack2:/scheduledSequences/0/sequence/steps/0',
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
                spGainSource: 'normalAttack',
              }),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        11,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.270000010728836, 0.300000011920929, 0.319999992847443, 0.349999994039536, 0.379999995231628,
      0.409999996423721, 0.430000007152557, 0.46000000834465, 0.490000009536743, 0.519999980926514,
      0.560000002384186, 0.610000014305115,
    ],
    poise: 0,
  },
);

export const endministratorBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0003_endminf_attack3',
    timelineBlockFrames: 17,
    naturalDurationFrames: 101,
    exclusiveFrame: 22,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 12,
          endFrame: 35,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0003_endminf_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 17, endFrame: 35, sourceSkillIds: ['chr_0003_endminf_attack4'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0003_endminf_attack3:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.5 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0399999991059303 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        6,
      ),
      scheduled(
        12,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0003_endminf_attack3:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.5 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        13,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.150000005960464, 0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489,
      0.230000004172325, 0.239999994635582, 0.259999990463257, 0.270000010728836, 0.28999999165535,
      0.310000002384186, 0.340000003576279,
    ],
    poise: 0,
    display_atk_scale: [
      0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978,
      0.449999988079071, 0.479999989271164, 0.509999990463257, 0.540000021457672, 0.579999983310699,
      0.629999995231628, 0.680000007152557,
    ],
  },
);

export const endministratorBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0003_endminf_attack4',
    timelineBlockFrames: 32,
    naturalDurationFrames: 127,
    exclusiveFrame: 34,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 18,
          endFrame: 45,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0003_endminf_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 32, endFrame: 45, sourceSkillIds: ['chr_0003_endminf_attack5'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0003_endminf_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        8,
      ),
      scheduled(
        9,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0003_endminf_attack4:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        10,
      ),
      scheduled(
        19,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0003_endminf_attack4:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        20,
      ),
      scheduled(
        18,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0003_endminf_attack4:/scheduledSequences/3/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0199999995529652 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'endminf_stone' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        19,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.0900000035762787, 0.100000001490116, 0.100000001490116, 0.109999999403954,
      0.119999997317791, 0.129999995231628, 0.140000000596046, 0.150000005960464, 0.159999996423721,
      0.170000001788139, 0.180000007152557, 0.189999997615814,
    ],
    poise: 0,
    display_atk_scale: [
      0.349999994039536, 0.379999995231628, 0.409999996423721, 0.449999988079071, 0.479999989271164,
      0.519999980926514, 0.550000011920929, 0.589999973773956, 0.620000004768372, 0.670000016689301,
      0.720000028610229, 0.779999971389771,
    ],
  },
);

export const endministratorBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0003_endminf_attack5',
    timelineBlockFrames: 25,
    naturalDurationFrames: 125,
    exclusiveFrame: 26,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 15,
          endFrame: 32,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0003_endminf_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 25, endFrame: 32, sourceSkillIds: ['chr_0003_endminf_attack1'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        18,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'normalAttackLastCombo'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0003_endminf_attack5:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('modifyActionValue', {
                key: 'isHitbyMain',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        19,
      ),
      scheduled(
        18,
        sequence(step('mergeContextTargets', { saveToContextKey: 'tar', sources: [] })),
        19,
      ),
      scheduled(
        19,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'isHitbyMain' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        21,
      ),
      scheduled(
        18,
        sequence(
          step('finishBuffsById', {
            target: 'enemy',
            buffIds: ['buff_chr_0003_endminf_attack4'],
            reason: 'other',
          }),
        ),
        21,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 20,
    atk_scale: [
      0.400000005960464, 0.439999997615814, 0.479999989271164, 0.519999980926514, 0.560000002384186,
      0.600000023841858, 0.639999985694885, 0.680000007152557, 0.720000028610229, 0.769999980926514,
      0.829999983310699, 0.899999976158142,
    ],
    isHitbyMain: 0,
    poise: 18,
  },
);

export const endministratorFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0003_endminf_power_attack2',
    timelineBlockFrames: 27,
    naturalDurationFrames: 192,
    exclusiveFrame: 47,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 27,
          endFrame: 58,
          sourceSkillIds: ['chr_0003_endminf_normal_skill', 'chr_0003_endminf_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.100000001490116,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0003_endminf_power_attack2:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'constant', value: 0 },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'default',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        15,
      ),
      scheduled(
        27,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.899999976158142,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0003_endminf_power_attack2:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
        ),
        29,
      ),
      scheduled(
        30,
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
                    durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              ),
            ),
          ),
        ),
        32,
      ),
      scheduled(
        11,
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
                    durationSeconds: { kind: 'constant', value: 0.119999997317791 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_normal_attack' },
                    finishByAction: false,
                    targets: ['caster'],
                  }),
                ),
              ),
            ),
          ),
        ),
        29,
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
        47,
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
        27,
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

export const endministratorPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0003_endminf_plunging_attack_end',
    timelineBlockFrames: 21,
    naturalDurationFrames: 154,
    exclusiveFrame: 20,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0003_endminf_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
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
  },
);

export const endministratorBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0003_endminf_normal_skill',
    timelineBlockFrames: 24,
    naturalDurationFrames: 151,
    exclusiveFrame: 28,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 24, endFrame: 54, sourceSkillIds: ['chr_0003_endminf_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0003_endminf_potential1'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_common_originum_frozen'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'has_returned' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                  ],
                },
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_common_originum_frozen'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_potential1'] },
                        desiredKey: 'atb_return',
                        outputKey: 'atb_return',
                      }),
                      step('applyPhysicalInfliction', {
                        type: 'crush',
                        target: 'enemy',
                        isExtra: false,
                        noGuardBuffId: 'buff_physical_no_guard',
                        noGuardDefinition: {
                          stackingType: 'enhanceAndRefresh',
                          priority: 100,
                          maxStackCount: 4,
                          durationSeconds: { blackboardKey: 'duration' },
                          presentation: {
                            visible: true,
                            iconId: 'icon_shadow_attribute_penetrate',
                            iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
                            showInHeadBarCommon: false,
                            showInHeadBarAttached: true,
                            showDirectlyInHeadBuff: false,
                            showInSquadIcon: false,
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
                            orderPriority: {
                              useDirectoryValue: false,
                              value: 0,
                              category: 'CommonCharBuff',
                            },
                          },
                          applyTags: ['Skill/Character/Common/NoGuard'],
                          extendTags: [],
                          blackboard: {
                            atk_scale: 0,
                            count: 0,
                            duration: 20,
                            skip_handle_cryst_break: 0,
                          },
                          attributeModifiers: [],
                          lifecycleSequences: {
                            start: sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                                  operator: 'equal',
                                  right: { kind: 'constant', value: 0 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_handle_cryst_break',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                              ),
                            ),
                            finish: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_no_guard_fake',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                            afterEnhance: sequence(
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:0',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'buffOwner',
                                    igniteType: 'NoGuard',
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:1',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  branch(
                                    {
                                      kind: 'currentBuffStackCompare',
                                      operator: 'greaterOrEqual',
                                      value: { kind: 'constant', value: 2 },
                                    },
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: {
                                            kind: 'blackboard',
                                            key: 'skip_handle_cryst_break',
                                          },
                                          operator: 'equal',
                                          right: { kind: 'constant', value: 0 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_physical_handle_cryst_break',
                                            target: 'buffOwner',
                                            source: 'buffSource',
                                            inheritSourceSkillCastInfo: true,
                                          }),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              },
                            ),
                          },
                        },
                        crushedBuffId: 'buff_physical_crushed',
                        crushedDefinition: {
                          stackingType: 'stack',
                          stackingKey: 'physical',
                          priority: 0,
                          maxStackCount: 1,
                          durationSeconds: { blackboardKey: 'duration' },
                          triggerIntervalSeconds: 0,
                          waitFirstTriggerInterval: true,
                          maxTriggerCount: 1,
                          presentation: {
                            visible: true,
                            iconId: 'knockback',
                            iconPath: '/icons/knockback.webp',
                            showInHeadBarCommon: false,
                            showInHeadBarAttached: false,
                            showDirectlyInHeadBuff: false,
                            showInSquadIcon: false,
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
                            orderPriority: {
                              useDirectoryValue: false,
                              value: 0,
                              category: 'CommonCharBuff',
                            },
                          },
                          applyTags: ['Skill/Character/Common/PhysicalStatus/CrushStatus'],
                          extendTags: [],
                          blackboard: {
                            atk_scale: 1,
                            count: 0,
                            dmg_multiplier: 1,
                            duration: 3,
                            ignore_hit_effect: 0,
                          },
                          attributeModifiers: [],
                          lifecycleSequences: {
                            start: sequence(
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:0',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('readBuffStackCount', {
                                    target: 'buffOwner',
                                    outputKey: 'count',
                                    query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
                                  }),
                                  step('readSkillSettingData', {
                                    items: [
                                      {
                                        values: [3, 4.5, 6, 7.5],
                                        column: { kind: 'blackboard', key: 'count' },
                                        storeKey: 'atk_scale',
                                        enhance: {
                                          target: 'caster',
                                          formula: { kind: 'linear', paramA: 0.01 },
                                        },
                                      },
                                    ],
                                  }),
                                  step('modifyActionValue', {
                                    key: 'atk_scale',
                                    operation: 'multiply',
                                    value: { kind: 'blackboard', key: 'dmg_multiplier' },
                                  }),
                                  step('finishBuffsById', {
                                    target: 'buffOwner',
                                    buffIds: ['buff_physical_no_guard'],
                                    reason: 'early',
                                  }),
                                  step('dealDamage', {
                                    damageType: 'physical',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                    tags: [],
                                    features: ['physicalInfliction'],
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:1',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_handle_cryst_break',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:2',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'caster',
                                    igniteType: 'PhysicalStatus',
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:3',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'ignore_hit_effect' },
                                      operator: 'less',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence({
                                      kind: 'switch',
                                      parameters: {
                                        choice: { kind: 'blackboard', key: 'count' },
                                        alwaysNext: true,
                                      },
                                      options: [
                                        {
                                          value: { kind: 'constant', value: 0 },
                                          sequence: sequence(
                                            step('startTimeDilation', {
                                              scope: 'entity',
                                              durationSeconds: {
                                                kind: 'constant',
                                                value: 0.100000001490116,
                                              },
                                              slot: 'TimeDilation/Layer/Entity/HitStop',
                                              priority: 15,
                                              curve: { kind: 'named', key: 'interrupt_weakness' },
                                              finishByAction: false,
                                              targets: ['enemy', 'caster'],
                                            }),
                                          ),
                                        },
                                        {
                                          value: { kind: 'constant', value: 1 },
                                          sequence: sequence(
                                            step('startTimeDilation', {
                                              scope: 'entity',
                                              durationSeconds: {
                                                kind: 'constant',
                                                value: 0.100000001490116,
                                              },
                                              slot: 'TimeDilation/Layer/Entity/HitStop',
                                              priority: 10,
                                              curve: { kind: 'named', key: 'interrupt_weakness' },
                                              finishByAction: false,
                                              targets: ['enemy', 'caster'],
                                            }),
                                          ),
                                        },
                                        {
                                          value: { kind: 'constant', value: 2 },
                                          sequence: sequence(
                                            step('startTimeDilation', {
                                              scope: 'entity',
                                              durationSeconds: { kind: 'constant', value: 0.25 },
                                              slot: 'TimeDilation/Layer/Entity/HitStop',
                                              priority: 20,
                                              curve: { kind: 'named', key: 'interrupt_weakness' },
                                              finishByAction: false,
                                              targets: ['enemy', 'caster'],
                                            }),
                                          ),
                                        },
                                        {
                                          value: { kind: 'constant', value: 3 },
                                          sequence: sequence(
                                            step('startTimeDilation', {
                                              scope: 'entity',
                                              durationSeconds: { kind: 'constant', value: 0.5 },
                                              slot: 'TimeDilation/Layer/Entity/HitStop',
                                              priority: 20,
                                              curve: { kind: 'named', key: 'interrupt_weakness' },
                                              finishByAction: false,
                                              targets: ['enemy', 'caster'],
                                            }),
                                          ),
                                        },
                                        {
                                          value: { kind: 'constant', value: 4 },
                                          sequence: sequence(
                                            step('startTimeDilation', {
                                              scope: 'entity',
                                              durationSeconds: {
                                                kind: 'constant',
                                                value: 0.649999976158142,
                                              },
                                              slot: 'TimeDilation/Layer/Entity/HitStop',
                                              priority: 20,
                                              curve: { kind: 'named', key: 'interrupt_weakness' },
                                              finishByAction: false,
                                              targets: ['enemy', 'caster'],
                                            }),
                                          ),
                                        },
                                      ],
                                    }),
                                  ),
                                ),
                              },
                            ),
                          },
                        },
                        damageMultiplier: { kind: 'constant', value: 1 },
                        ignoreHitEffect: false,
                      }),
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_return' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'team',
                        spGainKind: 'refund',
                        spGainSource: 'skill',
                      }),
                      step('modifyActionValue', {
                        key: 'has_returned',
                        operation: 'assign',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'physical',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        },
                        'chr_0003_endminf_normal_skill:/scheduledSequences/0/sequence/steps/0/body/steps/0/whenTrue/steps/0/whenTrue/steps/4',
                      ),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'trigger' },
                          operator: 'lessOrEqual',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.360000014305115 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: {
                              kind: 'inline',
                              keys: [
                                {
                                  time: 0,
                                  value: 0.400000005960464,
                                  inTangent: -4.16986989974976,
                                  outTangent: -4.16986989974976,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 0.150000005960464,
                                  value: 0.0500000007450581,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 0.484432309865952,
                                  value: 0.0722077935934067,
                                  inTangent: 0.194072797894478,
                                  outTangent: 0.194072797894478,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 1,
                                  value: 1,
                                  inTangent: 3.03269696235657,
                                  outTangent: 3.03269696235657,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                              ],
                            },
                            finishByAction: false,
                            targets: ['enemy', 'caster'],
                          }),
                          step('modifyActionValue', {
                            key: 'trigger',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  ),
                ),
                sequence(
                  step('applyPhysicalInfliction', {
                    type: 'crush',
                    target: 'enemy',
                    isExtra: false,
                    noGuardBuffId: 'buff_physical_no_guard',
                    noGuardDefinition: {
                      stackingType: 'enhanceAndRefresh',
                      priority: 100,
                      maxStackCount: 4,
                      durationSeconds: { blackboardKey: 'duration' },
                      presentation: {
                        visible: true,
                        iconId: 'icon_shadow_attribute_penetrate',
                        iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
                        showInHeadBarCommon: false,
                        showInHeadBarAttached: true,
                        showDirectlyInHeadBuff: false,
                        showInSquadIcon: false,
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
                        orderPriority: {
                          useDirectoryValue: false,
                          value: 0,
                          category: 'CommonCharBuff',
                        },
                      },
                      applyTags: ['Skill/Character/Common/NoGuard'],
                      extendTags: [],
                      blackboard: {
                        atk_scale: 0,
                        count: 0,
                        duration: 20,
                        skip_handle_cryst_break: 0,
                      },
                      attributeModifiers: [],
                      lifecycleSequences: {
                        start: sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 0 },
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_handle_cryst_break',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          ),
                        ),
                        finish: sequence(
                          step('applyBuff', {
                            buffId: 'buff_physical_no_guard_fake',
                            target: 'buffOwner',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                        afterEnhance: sequence(
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:0',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'buffOwner',
                                igniteType: 'NoGuard',
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:1',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              branch(
                                {
                                  kind: 'currentBuffStackCompare',
                                  operator: 'greaterOrEqual',
                                  value: { kind: 'constant', value: 2 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                                      operator: 'equal',
                                      right: { kind: 'constant', value: 0 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_physical_handle_cryst_break',
                                        target: 'buffOwner',
                                        source: 'buffSource',
                                        inheritSourceSkillCastInfo: true,
                                      }),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          },
                        ),
                      },
                    },
                    crushedBuffId: 'buff_physical_crushed',
                    crushedDefinition: {
                      stackingType: 'stack',
                      stackingKey: 'physical',
                      priority: 0,
                      maxStackCount: 1,
                      durationSeconds: { blackboardKey: 'duration' },
                      triggerIntervalSeconds: 0,
                      waitFirstTriggerInterval: true,
                      maxTriggerCount: 1,
                      presentation: {
                        visible: true,
                        iconId: 'knockback',
                        iconPath: '/icons/knockback.webp',
                        showInHeadBarCommon: false,
                        showInHeadBarAttached: false,
                        showDirectlyInHeadBuff: false,
                        showInSquadIcon: false,
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
                        orderPriority: {
                          useDirectoryValue: false,
                          value: 0,
                          category: 'CommonCharBuff',
                        },
                      },
                      applyTags: ['Skill/Character/Common/PhysicalStatus/CrushStatus'],
                      extendTags: [],
                      blackboard: {
                        atk_scale: 1,
                        count: 0,
                        dmg_multiplier: 1,
                        duration: 3,
                        ignore_hit_effect: 0,
                      },
                      attributeModifiers: [],
                      lifecycleSequences: {
                        start: sequence(
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:0',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('readBuffStackCount', {
                                target: 'buffOwner',
                                outputKey: 'count',
                                query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
                              }),
                              step('readSkillSettingData', {
                                items: [
                                  {
                                    values: [3, 4.5, 6, 7.5],
                                    column: { kind: 'blackboard', key: 'count' },
                                    storeKey: 'atk_scale',
                                    enhance: {
                                      target: 'caster',
                                      formula: { kind: 'linear', paramA: 0.01 },
                                    },
                                  },
                                ],
                              }),
                              step('modifyActionValue', {
                                key: 'atk_scale',
                                operation: 'multiply',
                                value: { kind: 'blackboard', key: 'dmg_multiplier' },
                              }),
                              step('finishBuffsById', {
                                target: 'buffOwner',
                                buffIds: ['buff_physical_no_guard'],
                                reason: 'early',
                              }),
                              step('dealDamage', {
                                damageType: 'physical',
                                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                tags: [],
                                features: ['physicalInfliction'],
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:1',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_handle_cryst_break',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:2',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'caster',
                                igniteType: 'PhysicalStatus',
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:3',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'ignore_hit_effect' },
                                  operator: 'less',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence({
                                  kind: 'switch',
                                  parameters: {
                                    choice: { kind: 'blackboard', key: 'count' },
                                    alwaysNext: true,
                                  },
                                  options: [
                                    {
                                      value: { kind: 'constant', value: 0 },
                                      sequence: sequence(
                                        step('startTimeDilation', {
                                          scope: 'entity',
                                          durationSeconds: {
                                            kind: 'constant',
                                            value: 0.100000001490116,
                                          },
                                          slot: 'TimeDilation/Layer/Entity/HitStop',
                                          priority: 15,
                                          curve: { kind: 'named', key: 'interrupt_weakness' },
                                          finishByAction: false,
                                          targets: ['enemy', 'caster'],
                                        }),
                                      ),
                                    },
                                    {
                                      value: { kind: 'constant', value: 1 },
                                      sequence: sequence(
                                        step('startTimeDilation', {
                                          scope: 'entity',
                                          durationSeconds: {
                                            kind: 'constant',
                                            value: 0.100000001490116,
                                          },
                                          slot: 'TimeDilation/Layer/Entity/HitStop',
                                          priority: 10,
                                          curve: { kind: 'named', key: 'interrupt_weakness' },
                                          finishByAction: false,
                                          targets: ['enemy', 'caster'],
                                        }),
                                      ),
                                    },
                                    {
                                      value: { kind: 'constant', value: 2 },
                                      sequence: sequence(
                                        step('startTimeDilation', {
                                          scope: 'entity',
                                          durationSeconds: { kind: 'constant', value: 0.25 },
                                          slot: 'TimeDilation/Layer/Entity/HitStop',
                                          priority: 20,
                                          curve: { kind: 'named', key: 'interrupt_weakness' },
                                          finishByAction: false,
                                          targets: ['enemy', 'caster'],
                                        }),
                                      ),
                                    },
                                    {
                                      value: { kind: 'constant', value: 3 },
                                      sequence: sequence(
                                        step('startTimeDilation', {
                                          scope: 'entity',
                                          durationSeconds: { kind: 'constant', value: 0.5 },
                                          slot: 'TimeDilation/Layer/Entity/HitStop',
                                          priority: 20,
                                          curve: { kind: 'named', key: 'interrupt_weakness' },
                                          finishByAction: false,
                                          targets: ['enemy', 'caster'],
                                        }),
                                      ),
                                    },
                                    {
                                      value: { kind: 'constant', value: 4 },
                                      sequence: sequence(
                                        step('startTimeDilation', {
                                          scope: 'entity',
                                          durationSeconds: {
                                            kind: 'constant',
                                            value: 0.649999976158142,
                                          },
                                          slot: 'TimeDilation/Layer/Entity/HitStop',
                                          priority: 20,
                                          curve: { kind: 'named', key: 'interrupt_weakness' },
                                          finishByAction: false,
                                          targets: ['enemy', 'caster'],
                                        }),
                                      ),
                                    },
                                  ],
                                }),
                              ),
                            ),
                          },
                        ),
                      },
                    },
                    damageMultiplier: { kind: 'constant', value: 1 },
                    ignoreHitEffect: false,
                  }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0003_endminf_normal_skill:/scheduledSequences/0/sequence/steps/0/body/steps/0/whenFalse/steps/1',
                  ),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'trigger' },
                      operator: 'lessOrEqual',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('startTimeDilation', {
                        scope: 'entity',
                        durationSeconds: { kind: 'constant', value: 0.360000014305115 },
                        slot: 'TimeDilation/Layer/Entity/HitStop',
                        priority: 10,
                        curve: {
                          kind: 'inline',
                          keys: [
                            {
                              time: 0,
                              value: 0.400000005960464,
                              inTangent: -4.16986989974976,
                              outTangent: -4.16986989974976,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.150000005960464,
                              value: 0.0500000007450581,
                              inTangent: 0,
                              outTangent: 0,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.484432309865952,
                              value: 0.0722077935934067,
                              inTangent: 0.194072797894478,
                              outTangent: 0.194072797894478,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 1,
                              value: 1,
                              inTangent: 3.03269696235657,
                              outTangent: 3.03269696235657,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                          ],
                        },
                        finishByAction: false,
                        targets: ['enemy', 'caster'],
                      }),
                      step('modifyActionValue', {
                        key: 'trigger',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.0329999998211861,
              },
            },
          ),
        ),
        12,
      ),
      scheduled(11, sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })), 12),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0003_endminf_potential5'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0003_endminf_potential5_trigger'],
                      operator: 'lessOrEqual',
                      value: { kind: 'constant', value: 0 },
                    },
                  ],
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0003_endminf_potential5_trigger',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
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
    atb_return: 0,
    atk_scale: [
      1.55999994277954, 1.71000003814697, 1.87000000476837, 2.01999998092651, 2.1800000667572,
      2.33999991416931, 2.49000000953674, 2.65000009536743, 2.79999995231628, 3, 3.23000001907349,
      3.5,
    ],
    blow_off_distance: 2,
    cam_angle: 0,
    cam_duration: 0,
    distance_random_range: 0.2,
    has_returned: 0,
    input_angle: 0,
    poise: 10,
    select_radius: 7,
    trigger: 0,
  },
);

export const endministratorUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0003_endminf_ultimate_skill',
    timelineBlockFrames: 56,
    naturalDurationFrames: 250,
    exclusiveFrame: 55,
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
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('findCharacterTeamTargets', {
                saveToContextKey: 'mainchar',
                selection: { kind: 'controlledOperator' },
              }),
            ),
          ),
        ),
        1,
      ),
      scheduled(
        50,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0003_endminf_ultimate_skill:/scheduledSequences/2/sequence/steps/0',
          ),
          forEachTarget(
            'enemy',
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_common_originum_frozen'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'originum_ult_break_scale' },
                      tags: ['ultimateSkill'],
                    },
                    'chr_0003_endminf_ultimate_skill:/scheduledSequences/2/sequence/steps/1/body/steps/0/whenTrue/steps/0',
                  ),
                  step('igniteBuffs', {
                    target: 'enemy',
                    source: 'caster',
                    igniteType: 'EndminUlt',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        53,
      ),
      scheduled(
        50,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0003_endminf_potential5'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0003_endminf_potential5_trigger'],
                      operator: 'lessOrEqual',
                      value: { kind: 'constant', value: 0 },
                    },
                  ],
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0003_endminf_potential5_trigger',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        53,
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
        55,
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
        44,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    angle: 130,
    atk_scale: [
      3.55999994277954, 3.91000008583069, 4.26999998092651, 4.61999988555908, 4.98000001907349,
      5.32999992370605, 5.69000005722046, 6.03999996185303, 6.40000009536743, 6.84000015258789,
      7.38000011444092, 8,
    ],
    height: 4,
    originum_ult_break_scale: [
      2.67000007629395, 2.94000005722046, 3.20000004768372, 3.47000002861023, 3.74000000953674, 4,
      4.26999998092651, 4.53999996185303, 4.80000019073486, 5.1399998664856, 5.53999996185303, 6,
    ],
    poise: 25,
    radius: 5,
  },
);

export const endministratorComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0003_endminf_combo_skill',
    timelineBlockFrames: 23,
    naturalDurationFrames: 164,
    exclusiveFrame: 30,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 23, endFrame: 54, sourceSkillIds: ['chr_0003_endminf_normal_skill'] },
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
        23,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'constant', value: 0 },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0003_endminf_combo_skill:/scheduledSequences/1/sequence/steps/0',
          ),
          step('applyBuff', {
            buffId: 'buff_common_originum_frozen',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              atk_scale_trigger: { kind: 'blackboard', key: 'atk_scale_trigger' },
              originum_ult_break_scale: { kind: 'blackboard', key: 'originum_ult_break_scale' },
            },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0003_endminf_combo_skill:/scheduledSequences/1/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.200000002980232 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'caster',
          }),
        ),
        24,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.867000043392181 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        23,
      ),
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(),
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 30,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0.0500000007450581,
                      inTangent: 0.000489342026412487,
                      outTangent: 0.000489342026412487,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.611227571964264,
                      value: 0.0360419787466526,
                      inTangent: 0.36740830540657,
                      outTangent: 0.36740830540657,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 4.44000005722046,
                      outTangent: 4.44000005722046,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['caster'],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        4,
      ),
    ],
    smartTarget: 'input',
    cooldownFrames: [480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 450],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [
      0.449999988079071, 0.490000009536743, 0.540000021457672, 0.579999983310699, 0.620000004768372,
      0.670000016689301, 0.709999978542328, 0.759999990463257, 0.800000011920929, 0.860000014305115,
      0.930000007152557, 1,
    ],
    atk_scale_trigger: [
      1.77999997138977, 1.96000003814697, 2.13000011444092, 2.30999994277954, 2.49000000953674,
      2.67000007629395, 2.83999991416931, 3.01999998092651, 3.20000004768372, 3.42000007629395,
      3.69000005722046, 4,
    ],
    duration: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4.5, 4.5, 5],
    main_distance: 0,
    originum_ult_break_scale: [
      2.67000007629395, 2.94000005722046, 3.20000004768372, 3.47000002861023, 3.74000000953674, 4,
      4.26999998092651, 4.53999996185303, 4.80000019073486, 5.1399998664856, 5.53999996185303, 6,
    ],
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    select_radius: 7,
    smart_distance: 0,
    str_ratio: 0,
    usp: 10,
  },
);

export default {
  slug: 'endministrator',
  gameId: 'ENDMINISTRATOR',
  rarity: 6,
  weaponType: 'sword',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'agility',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [14, 38, 62, 86, 111, 123],
    agility: [14, 41, 69, 98, 126, 140],
    intellect: [9, 28, 47, 67, 87, 96],
    will: [10, 31, 53, 74, 96, 107],
    baseAttack: [30, 92, 157, 222, 287, 319],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        endministratorBasicAttack1,
        endministratorBasicAttack2,
        endministratorBasicAttack3,
        endministratorBasicAttack4,
        endministratorBasicAttack5,
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: endministratorFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: endministratorPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: endministratorBattleSkill,
    },
    {
      key: 'ultimate',
      skillType: 'ultimate',
      levelSource: 'ultimate',
      skills: endministratorUltimate,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: endministratorComboSkill,
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
      event: 'outputDamage',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['comboSkill'] },
          sequence(
            branch(
              {
                kind: 'not',
                condition: {
                  kind: 'contextTargetIdentityMatch',
                  contextKey: 'trigger',
                  other: 'actionSource',
                  operator: 'equal',
                },
              },
              sequence(
                branch(
                  { kind: 'actionInputTargetObjectTypeMatch', objectTypeMask: 16 },
                  sequence(),
                ),
              ),
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
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0003_endminf_talent_1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            atk_up: [0.150000005960464, 0.300000011920929],
            duration: { kind: 'constant', value: 15 },
          },
        }),
      ),
    },
    {
      key: 'talent2',
      levels: 2,
      passiveSkills: [
        {
          key: 'chr_0003_endminf_talent_0',
          blackboard: { dmg: [0.100000001490116, 0.200000002980232] },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0003_endminf_talent_0_aura',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: { dmg: { kind: 'blackboard', key: 'dmg' } },
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
          buffId: 'buff_chr_0003_endminf_potential1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { atb_return: { kind: 'constant', value: 50 } },
        }),
      ),
    },
    {
      key: 'potential2',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0003_endminf_potential2',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { ratio: { kind: 'constant', value: 0.5 } },
        }),
      ),
    },
    {
      key: 'potential3',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0003_endminf_potential3',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { usp: { kind: 'constant', value: 15 } },
        }),
      ),
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        { kind: 'modifyBasePanelStat', stat: 'health', operation: 'percent', value: 0.1 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0003_endminf_potential5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { cd_minus: { kind: 'constant', value: 2 } },
        }),
      ),
    },
  ],
  buffDefinitions: {
    buff_chr_0003_endminf_potential1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atb_return: 50 },
      attributeModifiers: [],
    },
    buff_chr_0003_endminf_potential2: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { ratio: 0.5 },
      attributeModifiers: [],
    },
    buff_chr_0003_endminf_potential3: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { usp: 15 },
      attributeModifiers: [],
    },
    buff_chr_0003_endminf_potential5: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { cd_minus: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0003_endminf_potential5_trigger'] },
              sequence(
                step('adjustSkillCooldown', {
                  target: 'caster',
                  skill: { kind: 'id', skillId: 'chr_0003_endminf_combo_skill' },
                  operation: 'reduce',
                  basis: 'absoluteSeconds',
                  value: { kind: 'blackboard', key: 'cd_minus' },
                }),
                step('adjustSkillCooldown', {
                  target: 'caster',
                  skill: { kind: 'id', skillId: 'chr_0002_endminm_combo_skill' },
                  operation: 'reduce',
                  basis: 'absoluteSeconds',
                  value: { kind: 'blackboard', key: 'cd_minus' },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0003_endminf_potential5_trigger: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.100000001490116,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0003_endminf_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { dmg: 0 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'all',
            conditions: [
              {
                kind: 'buffIdCountCompare',
                target: 'enemy',
                buffIds: ['buff_common_originum_frozen'],
                operator: 'greaterOrEqual',
                value: 1,
              },
              { kind: 'eventDamageTypesMatch', damageTypes: ['physical'] },
            ],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'normal',
              addition: { blackboardKey: 'dmg' },
            },
          ],
        },
      ],
    },
    buff_chr_0003_endminf_talent_0_aura: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { dmg: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0003_endminf_talent_0',
            target: 'party',
            finishByAction: true,
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: { dmg: { kind: 'blackboard', key: 'dmg' } },
          }),
        ),
      },
    },
    buff_chr_0003_endminf_talent_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0.15, duration: 15 },
      attributeModifiers: [],
    },
    buff_chr_0003_endminf_talent_1_tirgger: {
      stackingType: 'stack',
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
        iconStyleInSquad: 'LifeTime',
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
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
