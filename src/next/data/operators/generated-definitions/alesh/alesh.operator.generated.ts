/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const aleshBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0024_deepfin_attack1',
    timelineBlockFrames: 12,
    naturalDurationFrames: 130,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 7,
          endFrame: 25,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0024_deepfin_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 12, endFrame: 25, sourceSkillIds: ['chr_0024_deepfin_attack2'] },
      ],
    },
    costFrame: 9,
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
            'chr_0024_deepfin_attack1:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
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
        8,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.180000007152557, 0.189999997615814, 0.209999993443489, 0.230000004172325, 0.25,
      0.259999990463257, 0.280000001192093, 0.300000011920929, 0.319999992847443, 0.340000003576279,
      0.360000014305115, 0.389999985694885,
    ],
  },
);

export const aleshBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0024_deepfin_attack2',
    timelineBlockFrames: 10,
    naturalDurationFrames: 128,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 6,
          endFrame: 25,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0024_deepfin_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 10, endFrame: 25, sourceSkillIds: ['chr_0024_deepfin_attack3'] },
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
            'chr_0024_deepfin_attack2:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
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
        11,
      ),
      scheduled(
        5,
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
                durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        8,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.100000001490116, 0.109999999403954, 0.119999997317791, 0.129999995231628, 0.140000000596046,
      0.150000005960464, 0.159999996423721, 0.170000001788139, 0.180000007152557, 0.189999997615814,
      0.209999993443489, 0.230000004172325,
    ],
  },
);

export const aleshBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0024_deepfin_attack3',
    timelineBlockFrames: 16,
    naturalDurationFrames: 145,
    exclusiveFrame: 29,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 13,
          endFrame: 31,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0024_deepfin_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 16, endFrame: 31, sourceSkillIds: ['chr_0024_deepfin_attack4'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        13,
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
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        14,
      ),
      scheduled(
        13,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0024_deepfin_attack3:/scheduledSequences/1/sequence/steps/0',
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
      0.280000001192093, 0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885,
      0.409999996423721, 0.439999997615814, 0.469999998807907, 0.5, 0.529999971389771,
      0.569999992847443, 0.620000004768372,
    ],
  },
);

export const aleshBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0024_deepfin_attack4',
    timelineBlockFrames: 22,
    naturalDurationFrames: 90,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 15,
          endFrame: 33,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0024_deepfin_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 22, endFrame: 33, sourceSkillIds: ['chr_0024_deepfin_attack5'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        15,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0024_deepfin_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
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
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.5 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        16,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.280000001192093, 0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885,
      0.409999996423721, 0.439999997615814, 0.469999998807907, 0.5, 0.529999971389771,
      0.569999992847443, 0.620000004768372,
    ],
  },
);

export const aleshBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0024_deepfin_attack5',
    timelineBlockFrames: 31,
    naturalDurationFrames: 104,
    exclusiveFrame: 40,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 14,
          endFrame: 40,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0024_deepfin_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 31, endFrame: 40, sourceSkillIds: ['chr_0024_deepfin_attack1'] },
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
            'chr_0024_deepfin_attack5:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_zero' },
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
      scheduled(
        19,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'constant', value: 0 },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0024_deepfin_attack5:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
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
        20,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 19,
    atk_scale: [
      0.280000001192093, 0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885,
      0.409999996423721, 0.439999997615814, 0.469999998807907, 0.5, 0.529999971389771,
      0.569999992847443, 0.620000004768372,
    ],
    poise: 17,
    atk_scale_display: [
      0.550000011920929, 0.610000014305115, 0.660000026226044, 0.720000028610229, 0.769999980926514,
      0.829999983310699, 0.879999995231628, 0.939999997615814, 0.990000009536743, 1.05999994277954,
      1.13999998569489, 1.24000000953674,
    ],
  },
);

export const aleshFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0024_deepfin_power_attack',
    timelineBlockFrames: 47,
    naturalDurationFrames: 113,
    exclusiveFrame: 75,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 47,
          endFrame: 75,
          sourceSkillIds: ['chr_0024_deepfin_normal_skill', 'chr_0024_deepfin_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale1' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0024_deepfin_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_zero' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
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
        47,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0024_deepfin_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.300000011920929 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        49,
      ),
      scheduled(
        13,
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
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['caster'],
                  }),
                ),
              ),
            ),
          ),
        ),
        15,
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
        75,
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
        47,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  {
    atk_scale: 4,
    atk_scale1: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
    atk_scale2: [
      3.20000004768372, 3.51999998092651, 3.83999991416931, 4.15999984741211, 4.48000001907349,
      4.80000019073486, 5.11999988555908, 5.44000005722046, 5.76000022888184, 6.15999984741211,
      6.6399998664856, 7.19999980926514,
    ],
    camera: 0,
    atk_scale_display: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
  },
);

export const aleshPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0024_deepfin_plunging_attack_end',
    timelineBlockFrames: 21,
    naturalDurationFrames: 92,
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
            'chr_0024_deepfin_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const aleshBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0024_deepfin_normal_skill',
    timelineBlockFrames: 51,
    naturalDurationFrames: 126,
    exclusiveFrame: 50,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        27,
        sequence(
          repeatEachTick(
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'num_1',
                query: {
                  kind: 'tag',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'num_1' },
                  operator: 'greater',
                  right: { kind: 'blackboard', key: 'num' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'num',
                    operation: 'assign',
                    value: { kind: 'blackboard', key: 'num_1' },
                  }),
                ),
                undefined,
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
        28,
      ),
      scheduled(
        27,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_1' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('calculateActionValue', {
                key: 'atb_1',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atb_1' },
                right: { kind: 'blackboard', key: 'potential_1_atb' },
              }),
              step('calculateActionValue', {
                key: 'atb_2',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atb_2' },
                right: { kind: 'blackboard', key: 'potential_1_atb' },
              }),
              step('calculateActionValue', {
                key: 'atb_3',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atb_3' },
                right: { kind: 'blackboard', key: 'potential_1_atb' },
              }),
              step('calculateActionValue', {
                key: 'atb_4',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atb_4' },
                right: { kind: 'blackboard', key: 'potential_1_atb' },
              }),
              {
                kind: 'switch',
                parameters: { choice: { kind: 'blackboard', key: 'num' }, alwaysNext: true },
                options: [
                  {
                    value: { kind: 'constant', value: 1 },
                    sequence: sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_1' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'skill',
                      }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 2 },
                    sequence: sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_2' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'skill',
                      }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 3 },
                    sequence: sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_3' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'skill',
                      }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 4 },
                    sequence: sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_4' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'skill',
                      }),
                    ),
                  },
                ],
              },
            ),
            sequence({
              kind: 'switch',
              parameters: { choice: { kind: 'blackboard', key: 'num' }, alwaysNext: true },
              options: [
                {
                  value: { kind: 'constant', value: 1 },
                  sequence: sequence(
                    step('changeResourceByActionValue', {
                      resource: 'sp',
                      amount: { kind: 'blackboard', key: 'atb_1' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'team',
                      spGainKind: 'gain',
                      spGainSource: 'skill',
                    }),
                  ),
                },
                {
                  value: { kind: 'constant', value: 2 },
                  sequence: sequence(
                    step('changeResourceByActionValue', {
                      resource: 'sp',
                      amount: { kind: 'blackboard', key: 'atb_2' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'team',
                      spGainKind: 'gain',
                      spGainSource: 'skill',
                    }),
                  ),
                },
                {
                  value: { kind: 'constant', value: 3 },
                  sequence: sequence(
                    step('changeResourceByActionValue', {
                      resource: 'sp',
                      amount: { kind: 'blackboard', key: 'atb_3' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'team',
                      spGainKind: 'gain',
                      spGainSource: 'skill',
                    }),
                  ),
                },
                {
                  value: { kind: 'constant', value: 4 },
                  sequence: sequence(
                    step('changeResourceByActionValue', {
                      resource: 'sp',
                      amount: { kind: 'blackboard', key: 'atb_4' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'team',
                      spGainKind: 'gain',
                      spGainSource: 'skill',
                    }),
                  ),
                },
              ],
            }),
            { alwaysNext: true },
          ),
        ),
        28,
      ),
      scheduled(
        27,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0024_deepfin_normal_skill:/scheduledSequences/2/sequence/steps/0/body/steps/0',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
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
        28,
      ),
      scheduled(27, sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })), 28),
      scheduled(
        27,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'count',
                    query: {
                      kind: 'tag',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                    },
                  }),
                  branch(
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'blackboard', key: 'count' },
                    },
                    sequence(
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                        reason: 'early',
                        count: { kind: 'blackboard', key: 'count' },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_cryst_cryst_frozen_triggered',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          consumed_type: { kind: 'constant', value: 2 },
                          consumed_layer: { kind: 'blackboard', key: 'count' },
                          count: { kind: 'blackboard', key: 'count' },
                        },
                      }),
                    ),
                  ),
                ),
                undefined,
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
        28,
      ),
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb_1: [10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15],
    atb_2: [20, 20, 20, 20, 20, 20, 20, 20, 20, 25, 25, 25],
    atb_3: [30, 30, 30, 30, 30, 30, 30, 30, 30, 35, 35, 35],
    atb_4: [40, 40, 40, 40, 40, 40, 40, 40, 40, 45, 45, 45],
    atk_scale: [
      2, 2.20000004768372, 2.40000009536743, 2.59999990463257, 2.79999995231628, 3,
      3.20000004768372, 3.40000009536743, 3.59999990463257, 3.84999990463257, 4.15000009536743, 4.5,
    ],
    blow_off_distance: 2,
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    distance_random_range: 0.2,
    input_angle: 0,
    num: 0,
    num_1: 0,
    poise: 10,
    potential_1: 0,
    potential_1_atb: 0,
    trigger: 0,
  },
);

export const aleshComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0024_deepfin_combo_skill',
    timelineBlockFrames: 39,
    naturalDurationFrames: 213,
    exclusiveFrame: 130,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 39, endFrame: 65, sourceSkillIds: ['chr_0024_deepfin_normal_skill'] },
        { startFrame: 94, endFrame: 120, sourceSkillIds: ['chr_0024_deepfin_normal_skill'] },
        { startFrame: 120, endFrame: 130, sourceSkillIds: ['chr_0024_deepfin_normal_skill'] },
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
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0024_deepfin_combo_camera',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        23,
      ),
      scheduled(
        38,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0024_deepfin_combo_skill:/scheduledSequences/2/sequence/steps/0',
          ),
        ),
        41,
      ),
      scheduled(
        93,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_sp' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'default',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_2ex' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0024_deepfin_combo_skill:/scheduledSequences/3/sequence/steps/1',
          ),
        ),
        96,
      ),
      scheduled(
        38,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_normal' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.949999988079071 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'deepfin_combo2' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'deepfin_combo2' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        43,
      ),
      scheduled(
        93,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_normal' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.949999988079071 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'deepfin_combo2' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'deepfin_combo2' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        98,
      ),
      scheduled(
        22,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['comboSkill'],
            },
            'chr_0024_deepfin_combo_skill:/scheduledSequences/6/sequence/steps/1',
          ),
        ),
        24,
      ),
      scheduled(64, sequence(step('jumpTimeline', { destinationFrame: 120 })), 66),
      scheduled(
        77,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1ex' },
              tags: ['comboSkill'],
            },
            'chr_0024_deepfin_combo_skill:/scheduledSequences/8/sequence/steps/1',
          ),
        ),
        79,
      ),
      scheduled(
        10,
        sequence(
          step('calculateActionValue', {
            key: 'prob_max',
            operation: 'add',
            left: { kind: 'blackboard', key: 'prob' },
            right: { kind: 'blackboard', key: 'prob_max' },
          }),
          step('calculateActionValue', {
            key: 'prob_add',
            operation: 'divide',
            left: { kind: 'blackboard', key: 'prob_add' },
            right: { kind: 'blackboard', key: 'rate' },
          }),
          step('storeSourceAttributeValue', {
            attribute: { kind: 'secondary' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'blackboard', key: 'prob_add' },
            base: { kind: 'blackboard', key: 'prob' },
            targetKey: 'prob',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'prob' },
              operator: 'lessOrEqual',
              right: { kind: 'blackboard', key: 'prob_max' },
            },
            sequence(
              branch(
                { kind: 'probability', probability: { kind: 'blackboard', key: 'prob' } },
                sequence(step('jumpTimeline', { destinationFrame: 65 })),
              ),
            ),
            sequence(
              branch(
                { kind: 'probability', probability: { kind: 'blackboard', key: 'prob_max' } },
                sequence(step('jumpTimeline', { destinationFrame: 65 })),
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        11,
      ),
      scheduled(
        93,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_3' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0024_deepfin_potential_3',
                target: 'party',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  atk_up: { kind: 'blackboard', key: 'atk_up' },
                  duration: { kind: 'blackboard', key: 'Duration' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        96,
      ),
      scheduled(
        34,
        sequence(
          branch(
            { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
            sequence(),
            undefined,
            { alwaysNext: true },
          ),
        ),
        75,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [270, 270, 270, 270, 270, 270, 270, 270, 270, 270, 270, 240],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atb: [10, 10, 10, 10, 10, 12, 12, 12, 12, 13, 13, 15],
    atb_sp: 10,
    atk_scale_1: [
      0.330000013113022, 0.370000004768372, 0.400000005960464, 0.430000007152557, 0.469999998807907,
      0.5, 0.529999971389771, 0.569999992847443, 0.600000023841858, 0.639999985694885,
      0.689999997615814, 0.75,
    ],
    atk_scale_1ex: [
      0.529999971389771, 0.589999973773956, 0.639999985694885, 0.689999997615814, 0.75,
      0.800000011920929, 0.850000023841858, 0.910000026226044, 0.959999978542328, 1.02999997138977,
      1.11000001430511, 1.20000004768372,
    ],
    atk_scale_2: [
      1, 1.10000002384186, 1.20000004768372, 1.29999995231628, 1.39999997615814, 1.5,
      1.60000002384186, 1.70000004768372, 1.79999995231628, 1.92999994754791, 2.07999992370605,
      2.25,
    ],
    atk_scale_2ex: [
      1.60000002384186, 1.75999999046326, 1.91999995708466, 2.07999992370605, 2.24000000953674,
      2.40000009536743, 2.55999994277954, 2.72000002861023, 2.88000011444092, 3.07999992370605,
      3.3199999332428, 3.59999990463257,
    ],
    atk_scale_trigger: 2,
    atk_up: 0.15,
    camera: 0,
    duration: 0,
    Duration: 10,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    potential_3: 0,
    prob: 0.100000001490116,
    prob_add: 0,
    prob_max: 0,
    rate: 10,
    usp_normal: 10,
    atk_scale_display: [
      1.33000004291534, 1.47000002861023, 1.60000002384186, 1.73000001907349, 1.87000000476837, 2,
      2.13000011444092, 2.26999998092651, 2.40000009536743, 2.5699999332428, 2.76999998092651, 3,
    ],
    atk_scale_display_ex: [
      2.13000011444092, 2.34999990463257, 2.55999994277954, 2.76999998092651, 2.99000000953674,
      3.20000004768372, 3.41000008583069, 3.63000011444092, 3.83999991416931, 4.1100001335144,
      4.42999982833862, 4.80000019073486,
    ],
  },
);

export const aleshUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0024_deepfin_ultimate_skill',
    timelineBlockFrames: 96,
    naturalDurationFrames: 180,
    exclusiveFrame: 110,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 87,
          endFrame: 113,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0024_deepfin_attack1',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 96,
          endFrame: 113,
          sourceSkillIds: [
            'chr_0024_deepfin_attack1',
            'chr_0024_deepfin_normal_skill',
            'chr_0024_deepfin_combo_skill',
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
        90,
        sequence(
          step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'potential_5' },
                      operator: 'greaterOrEqual',
                      right: { kind: 'constant', value: 1 },
                    },
                    {
                      kind: 'healthCompare',
                      target: 'enemy',
                      valueType: 'ratio',
                      operator: 'lessOrEqual',
                      value: { kind: 'blackboard', key: 'hp_tar' },
                    },
                  ],
                },
                sequence(
                  step('calculateActionValue', {
                    key: 'atk_scale',
                    operation: 'multiply',
                    left: { kind: 'blackboard', key: 'atk_scale' },
                    right: { kind: 'blackboard', key: 'atk_up' },
                  }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0024_deepfin_ultimate_skill:/scheduledSequences/1/sequence/steps/1/body/steps/0/whenTrue/steps/1',
                  ),
                ),
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0024_deepfin_ultimate_skill:/scheduledSequences/1/sequence/steps/1/body/steps/0/whenFalse/steps/0',
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
        93,
      ),
      scheduled(
        91,
        sequence(
          step('modifyActionValue', {
            key: 'atb_up',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'kill_num' },
          }),
          step('modifyActionValue', {
            key: 'atb_up',
            operation: 'add',
            value: { kind: 'blackboard', key: 'atb' },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'atb_up' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 100 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb_up' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
            ),
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb_max' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        94,
      ),
      scheduled(
        90,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'deepfin_ult' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        93,
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
        110,
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
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    angle: 0,
    atb: [20, 20, 20, 20, 20, 20, 20, 20, 20, 25, 25, 25],
    atb_max: 100,
    atb_up: [12, 12, 12, 12, 12, 12, 12, 12, 12, 15, 15, 15],
    atk_scale: [
      4.3600001335144, 4.78999996185303, 5.23000001907349, 5.65999984741211, 6.09999990463257,
      6.53000020980835, 6.96999979019165, 7.40999984741211, 7.84000015258789, 8.39000034332275,
      9.03999996185303, 9.80000019073486,
    ],
    atk_up: 1.5,
    height: 4,
    hp_tar: 0.5,
    kill_num: 0,
    originum_ult_break_scale: 4,
    poise: 20,
    potential_5: 0,
    radius: 5,
    ult_angle: 0,
  },
);

export default {
  slug: 'alesh',
  gameId: 'ALESH',
  rarity: 5,
  weaponType: 'sword',
  element: 'cryo',
  role: 'vanguard',
  mainAttribute: 'strength',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [20, 49, 80, 111, 142, 158],
    agility: [9, 27, 47, 66, 86, 95],
    intellect: [13, 37, 62, 87, 113, 125],
    will: [10, 27, 45, 63, 81, 89],
    baseAttack: [30, 90, 152, 215, 277, 309],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        aleshBasicAttack1,
        aleshBasicAttack2,
        aleshBasicAttack3,
        aleshBasicAttack4,
        aleshBasicAttack5,
      ],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: aleshFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: aleshPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: aleshBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: aleshComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: aleshUltimate },
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
      event: 'buffEndsEarly',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          { kind: 'actionInputTargetObjectTypeMatch', objectTypeMask: 16 },
          sequence(
            branch(
              {
                kind: 'eventBuffTagsMatch',
                match: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellStatus'],
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
      event: 'buffEndsEarly',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          { kind: 'actionInputTargetObjectTypeMatch', objectTypeMask: 16 },
          sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_common_originum_frozen'] },
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
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0024_deepfin_talent_1_auro',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { usp: [3, 4], usp_self: [6, 8] },
        }),
      ),
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'prob_add',
          operation: 'assign',
          value: [0.0020000000949949, 0.00499999988824129],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'prob_max',
          operation: 'assign',
          value: [0.300000011920929, 0.300000011920929],
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
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_1_atb',
          operation: 'add',
          value: 10,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['strength'], value: 15 },
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 15 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.150000005960464,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'Duration',
          operation: 'assign',
          value: 10,
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
          multiplier: 0.850000023841858,
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
          blackboardKey: 'potential_5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'hp_tar',
          operation: 'assign',
          value: 0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 1.5,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0024_deepfin_combo_camera: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 2,
      durationSeconds: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { CD: 0, count: 0, owner_mainchar_alpha: 0, owner_mainchar_distance: 0, usp: 10 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('startTimeDilation', {
              scope: 'global',
              durationSeconds: { kind: 'constant', value: 0.629999995231628 },
              slot: 'unassigned',
              priority: 30,
              curve: { kind: 'named', key: 'ComboSkill' },
              finishByAction: false,
              ignoredTargets: ['caster'],
              ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
              influenceSkillCooldownSeconds: { kind: 'constant', value: 0.300000011920929 },
            }),
          ),
          16,
        ),
      ],
    },
    buff_chr_0024_deepfin_potential_3: {
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
      blackboard: { atk_up: 0.15, duration: 0 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
      ],
    },
    buff_chr_0024_deepfin_talent_1: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 2,
      applyTags: [],
      extendTags: [],
      blackboard: { CD: 0, count: 0, usp: 10 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'talent' },
              },
              sequence(
                branch(
                  { kind: 'eventBuffIdMatch', buffIds: ['buff_common_originum_frozen'] },
                  sequence(
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'usp' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'caster',
                    }),
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'talent',
                      durationSeconds: { kind: 'blackboard', key: 'CD' },
                      autoFinishByAction: false,
                    }),
                  ),
                ),
              ),
            ),
          ),
        },
        {
          event: 'outputBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'talent' },
              },
              sequence(
                branch(
                  {
                    kind: 'eventBuffTagsMatch',
                    match: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
                  },
                  sequence(
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'usp' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'caster',
                    }),
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'talent',
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
    buff_chr_0024_deepfin_talent_1_auro: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 2,
      applyTags: [],
      extendTags: [],
      blackboard: { CD: 3, count: 0, usp: 10, usp_final: 0, usp_self: 12 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0024_deepfin_talent_1',
            target: 'partyExceptCaster',
            finishByAction: true,
            blackboardAssignments: {
              usp: { kind: 'blackboard', key: 'usp' },
              CD: { kind: 'blackboard', key: 'CD' },
            },
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'talent' },
              },
              sequence(
                branch(
                  {
                    kind: 'eventBuffTagsMatch',
                    match: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
                  },
                  sequence(
                    step('calculateActionValue', {
                      key: 'usp_final',
                      operation: 'add',
                      left: { kind: 'blackboard', key: 'usp' },
                      right: { kind: 'blackboard', key: 'usp_self' },
                    }),
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'usp_final' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'caster',
                    }),
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'talent',
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
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
