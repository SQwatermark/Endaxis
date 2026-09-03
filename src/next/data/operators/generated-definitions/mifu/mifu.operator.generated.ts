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

export const mifuBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0031_mifu_attack1',
    timelineBlockFrames: 17,
    naturalDurationFrames: 196,
    exclusiveFrame: 27,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 38,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0031_mifu_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 17, endFrame: 38, sourceSkillIds: ['chr_0031_mifu_attack2'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'hitstop_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0031_mifu_attack1:/scheduledSequences/0/sequence/steps/2/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('modifyActionValue', {
                    key: 'hit_target',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  {
                    kind: 'switch',
                    parameters: {
                      choice: { kind: 'blackboard', key: 'hitstop_times' },
                      alwaysNext: true,
                    },
                    options: [
                      {
                        value: { kind: 'constant', value: 3 },
                        sequence: sequence(
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
                      },
                      {
                        value: { kind: 'constant', value: 4 },
                        sequence: sequence(
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
                      },
                      {
                        value: { kind: 'constant', value: 0 },
                        sequence: sequence(
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
                      },
                      {
                        value: { kind: 'constant', value: 1 },
                        sequence: sequence(
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
                      },
                      {
                        value: { kind: 'constant', value: 2 },
                        sequence: sequence(
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
                      },
                    ],
                  },
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
        12,
      ),
      scheduled(
        9,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        10,
      ),
      scheduled(
        10,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        11,
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
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
      0.340000003576279, 0.370000004768372, 0.409999996423721, 0.439999997615814, 0.469999998807907,
      0.509999990463257, 0.540000021457672, 0.569999992847443, 0.610000014305115, 0.649999976158142,
      0.699999988079071, 0.759999990463257,
    ],
    hit_target: 0,
    hitstop_times: 0,
  },
);

export const mifuBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0031_mifu_attack2',
    timelineBlockFrames: 21,
    naturalDurationFrames: 217,
    exclusiveFrame: 29,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 67,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0031_mifu_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 21, endFrame: 67, sourceSkillIds: ['chr_0031_mifu_attack3'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                  tags: ['normalAttack'],
                },
                'chr_0031_mifu_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 0,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                      ],
                    },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
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
        10,
      ),
      scheduled(
        16,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['normalAttack'],
                },
                'chr_0031_mifu_attack2:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
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
        19,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale1: [
      0.129999995231628, 0.150000005960464, 0.159999996423721, 0.170000001788139, 0.189999997615814,
      0.200000002980232, 0.209999993443489, 0.230000004172325, 0.239999994635582, 0.259999990463257,
      0.270000010728836, 0.300000011920929,
    ],
    atk_scale2: [
      0.25, 0.280000001192093, 0.300000011920929, 0.330000013113022, 0.349999994039536,
      0.379999995231628, 0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164,
      0.519999980926514, 0.560000002384186,
    ],
    display_atk_scale: [
      0.379999995231628, 0.419999986886978, 0.46000000834465, 0.5, 0.540000021457672,
      0.569999992847443, 0.610000014305115, 0.649999976158142, 0.689999997615814, 0.740000009536743,
      0.790000021457672, 0.860000014305115,
    ],
  },
);

export const mifuBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0031_mifu_attack3',
    timelineBlockFrames: 37,
    naturalDurationFrames: 425,
    exclusiveFrame: 54,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 76,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0031_mifu_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 37, endFrame: 76, sourceSkillIds: ['chr_0031_mifu_attack4'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'hitstop_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                  tags: ['normalAttack'],
                },
                'chr_0031_mifu_attack3:/scheduledSequences/0/sequence/steps/2/body/steps/0',
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
        13,
      ),
      scheduled(
        16,
        sequence(
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'hitstop_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                  tags: ['normalAttack'],
                },
                'chr_0031_mifu_attack3:/scheduledSequences/1/sequence/steps/2/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('modifyActionValue', {
                    key: 'hit_target',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  {
                    kind: 'switch',
                    parameters: {
                      choice: { kind: 'blackboard', key: 'hitstop_times' },
                      alwaysNext: true,
                    },
                    options: [
                      {
                        value: { kind: 'constant', value: 3 },
                        sequence: sequence(
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: { kind: 'named', key: 'char_hard_stop' },
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
                            durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: { kind: 'named', key: 'char_hard_stop' },
                            finishByAction: false,
                            targets: ['enemy', 'caster'],
                          }),
                        ),
                      },
                      {
                        value: { kind: 'constant', value: 0 },
                        sequence: sequence(
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
                      },
                      {
                        value: { kind: 'constant', value: 1 },
                        sequence: sequence(
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
                      },
                      {
                        value: { kind: 'constant', value: 2 },
                        sequence: sequence(
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
                      },
                    ],
                  },
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
        20,
      ),
      scheduled(
        30,
        sequence(
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'hitstop_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['normalAttack'],
                },
                'chr_0031_mifu_attack3:/scheduledSequences/2/sequence/steps/2/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('modifyActionValue', {
                    key: 'hit_target',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  {
                    kind: 'switch',
                    parameters: {
                      choice: { kind: 'blackboard', key: 'hitstop_times' },
                      alwaysNext: true,
                    },
                    options: [
                      {
                        value: { kind: 'constant', value: 0 },
                        sequence: sequence(
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: { kind: 'named', key: 'char_hard_stop' },
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
                            durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: { kind: 'named', key: 'char_hard_stop' },
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
                            durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: { kind: 'named', key: 'char_hard_stop' },
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
                            durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: { kind: 'named', key: 'char_hard_stop' },
                            finishByAction: false,
                            targets: ['enemy', 'caster'],
                          }),
                        ),
                      },
                    ],
                  },
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
        33,
      ),
      scheduled(
        10,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        11,
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        12,
      ),
      scheduled(
        12,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        13,
      ),
      scheduled(
        16,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        17,
      ),
      scheduled(
        17,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        18,
      ),
      scheduled(
        18,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        19,
      ),
      scheduled(
        19,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        20,
      ),
      scheduled(
        30,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        31,
      ),
      scheduled(
        31,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        32,
      ),
      scheduled(
        32,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        33,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale1: [
      0.150000005960464, 0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489,
      0.230000004172325, 0.239999994635582, 0.259999990463257, 0.270000010728836, 0.28999999165535,
      0.310000002384186, 0.340000003576279,
    ],
    atk_scale2: [
      0.310000002384186, 0.340000003576279, 0.370000004768372, 0.400000005960464, 0.430000007152557,
      0.46000000834465, 0.490000009536743, 0.519999980926514, 0.550000011920929, 0.589999973773956,
      0.629999995231628, 0.689999997615814,
    ],
    hit_target: 0,
    hitstop_times: 0,
    display_atk_scale: [
      0.610000014305115, 0.670000016689301, 0.730000019073486, 0.790000021457672, 0.850000023841858,
      0.910000026226044, 0.970000028610229, 1.02999997138977, 1.0900000333786, 1.1599999666214,
      1.25999999046326, 1.36000001430511,
    ],
  },
);

export const mifuBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0031_mifu_attack4',
    timelineBlockFrames: 38,
    naturalDurationFrames: 280,
    exclusiveFrame: 54,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 99,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0031_mifu_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 38, endFrame: 99, sourceSkillIds: ['chr_0031_mifu_attack1'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                  tags: ['normalAttack'],
                },
                'chr_0031_mifu_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
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
        7,
      ),
      scheduled(
        30,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['normalAttack', 'normalAttackLastCombo'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0031_mifu_attack4:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
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
        30,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 28,
    atk_scale1: [
      0.0500000007450581, 0.0599999986588955, 0.0599999986588955, 0.0700000002980232,
      0.0700000002980232, 0.0799999982118607, 0.0799999982118607, 0.0900000035762787,
      0.0900000035762787, 0.100000001490116, 0.100000001490116, 0.109999999403954,
    ],
    atk_scale2: [
      0.720000028610229, 0.790000021457672, 0.860000014305115, 0.930000007152557, 1,
      1.07000005245209, 1.13999998569489, 1.22000002861023, 1.28999996185303, 1.37999999523163,
      1.48000001907349, 1.61000001430511,
    ],
    poise: 25,
    display_atk_scale: [
      0.769999980926514, 0.839999973773956, 0.920000016689301, 0.990000009536743, 1.07000005245209,
      1.14999997615814, 1.22000002861023, 1.29999995231628, 1.37999999523163, 1.47000002861023,
      1.5900000333786, 1.72000002861023,
    ],
  },
);

export const mifuPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0031_mifu_plunging_attack_end',
    timelineBlockFrames: 12,
    naturalDurationFrames: 206,
    exclusiveFrame: 20,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 12, endFrame: 21, sourceSkillIds: ['chr_0009_azrila_attack1'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0031_mifu_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
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
        7,
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

export const mifuFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0031_mifu_powerattack',
    timelineBlockFrames: 38,
    naturalDurationFrames: 282,
    exclusiveFrame: 53,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 38,
          endFrame: 67,
          sourceSkillIds: [
            'chr_0031_mifu_combo_skill',
            'chr_0031_mifu_normalskill_1',
            'chr_0031_mifu_normalskill_2',
            'chr_0031_mifu_normalskill_3',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.150000005960464 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.74716192483902,
                  value: 0,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        5,
      ),
      scheduled(
        6,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.300000011920929,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0031_mifu_powerattack:/scheduledSequences/1/sequence/steps/0',
          ),
        ),
        6,
      ),
      scheduled(
        17,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.200000002980232,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0031_mifu_powerattack:/scheduledSequences/2/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.802449405193329,
                  value: 0,
                  inTangent: 0,
                  outTangent: 2.53099703788757,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 5.06199502944946,
                  outTangent: 5.06199502944946,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        17,
      ),
      scheduled(
        37,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.5,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0031_mifu_powerattack:/scheduledSequences/3/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.230000004172325 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.700745522975922,
                  value: 0,
                  inTangent: 0,
                  outTangent: 1.67081904411316,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 3.34163808822632,
                  outTangent: 3.34163808822632,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        37,
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
        53,
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
        38,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_buffpause',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        38,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  {
    atb: 0,
    atk_scale: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
    atk_scale2: 0.58,
    atk_scale3: 0.58,
    ifrightside: 0,
    poise: 0,
  },
);

export const mifuBattleSkill1: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill1',
    sourceSkillId: 'chr_0031_mifu_normalskill_1',
    timelineBlockFrames: 11,
    naturalDurationFrames: 203,
    exclusiveFrame: 125,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 131,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0031_mifu_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 11, endFrame: 30, sourceSkillIds: ['chr_0031_mifu_normalskill_2'] },
        { startFrame: 115, endFrame: 131, sourceSkillIds: ['chr_0031_mifu_normalskill_2'] },
        { startFrame: 11, endFrame: 30, sourceSkillIds: ['chr_0031_mifu_attack2'] },
        { startFrame: 115, endFrame: 131, sourceSkillIds: ['chr_0031_mifu_attack2'] },
        { startFrame: 11, endFrame: 30, sourceSkillIds: ['chr_0031_mifu_powerattack'] },
        { startFrame: 115, endFrame: 131, sourceSkillIds: ['chr_0031_mifu_powerattack'] },
        { startFrame: 11, endFrame: 30, sourceSkillIds: ['chr_0031_mifu_combo_skill'] },
        { startFrame: 115, endFrame: 131, sourceSkillIds: ['chr_0031_mifu_combo_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_comboprocess',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0031_mifu_normalskill_2', 'chr_0031_mifu_normalskill_3'],
          }),
        ),
        38,
      ),
      scheduled(
        105,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_comboprocess',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0031_mifu_normalskill_2', 'chr_0031_mifu_normalskill_3'],
          }),
        ),
        156,
      ),
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'MainChar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        0,
      ),
      scheduled(
        0,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'constant', value: 50 },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'refund',
            spGainSource: 'skill',
          }),
        ),
        0,
      ),
      scheduled(
        7,
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
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                    },
                    'chr_0031_mifu_normalskill_1:/scheduledSequences/4/sequence/steps/0/whenTrue/steps/0/whenTrue/steps/0',
                  ),
                  step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                        {
                          kind: 'enemySuperArmorCompare',
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 30 },
                        },
                      ],
                    },
                    sequence(step('jumpTimeline', { destinationFrame: 105 })),
                    sequence(forEachTarget('enemy', sequence())),
                    { alwaysNext: true },
                  ),
                ),
              ),
            ),
          ),
        ),
        12,
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
              step('modifyActionValue', {
                key: 'effect_z_scale',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
              step('modifyActionValue', {
                key: 'effect_z_scale',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
              step('modifyActionValue', {
                key: 'effect_z_scale',
                operation: 'divide',
                value: { kind: 'constant', value: 8 },
              }),
            ),
          ),
        ),
        0,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_normalskill_2',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        0,
      ),
      scheduled(104, sequence(step('jumpTimeline', { destinationFrame: 204 })), 104),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    angle: 120,
    atk_scale: [
      0.670000016689301, 0.730000019073486, 0.800000011920929, 0.870000004768372, 0.930000007152557,
      1, 1.07000005245209, 1.12999999523163, 1.20000004768372, 1.27999997138977, 1.37999999523163,
      1.5,
    ],
    buff_duration: 0,
    cam_angle: 0,
    cam_duration: 3.41,
    defend_reduct: 0,
    duration: 2,
    effect_z_scale: 1,
    height: 4,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 0,
    prob: 0,
    pulloffset: 0,
    radius: 5,
    select_radius: 5,
    usp: 0,
    usp_everyone: 0,
    usp_self: 0,
    will_additive: 0,
    display_atk_scale: [
      0.670000016689301, 0.730000019073486, 0.800000011920929, 0.870000004768372, 0.930000007152557,
      1, 1.07000005245209, 1.12999999523163, 1.20000004768372, 1.27999997138977, 1.37999999523163,
      1.5,
    ],
  },
);

export const mifuBattleSkill2: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill2',
    sourceSkillId: 'chr_0031_mifu_normalskill_2',
    timelineBlockFrames: 28,
    naturalDurationFrames: 150,
    exclusiveFrame: 34,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 28, endFrame: 62, sourceSkillIds: ['chr_0031_mifu_normalskill_3'] },
        { startFrame: 28, endFrame: 62, sourceSkillIds: ['chr_0031_mifu_powerattack'] },
        { startFrame: 28, endFrame: 62, sourceSkillIds: ['chr_0031_mifu_combo_skill'] },
        {
          startFrame: 28,
          endFrame: 62,
          sourceSkillIds: [
            'chr_0031_mifu_attack1',
            'chr_0031_mifu_attack2',
            'chr_0031_mifu_attack3',
            'chr_0031_mifu_attack4',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        24,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0031_mifu_normalskill_2'],
            reason: 'other',
          }),
        ),
        24,
      ),
      scheduled(
        28,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_comboprocess',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0031_mifu_normalskill_3'],
          }),
        ),
        129,
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
              branch(
                { kind: 'casterControlled' },
                sequence(),
                sequence(
                  step('finishBuffsById', {
                    target: 'caster',
                    buffIds: ['buff_chr_0031_mifu_comboprocess'],
                    reason: 'other',
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        0,
      ),
      scheduled(
        3,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0031_mifu_normalskill_2:/scheduledSequences/3/sequence/steps/0/whenTrue/steps/0',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.100000001490116,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.746557116508484,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 3.94566202163696,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        3,
      ),
      scheduled(
        10,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0031_mifu_normalskill_2:/scheduledSequences/4/sequence/steps/0/whenTrue/steps/0',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.100000001490116,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.746557116508484,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 3.94566202163696,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        10,
      ),
      scheduled(
        24,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              forEachTarget(
                'enemy',
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'stack',
                    query: {
                      kind: 'tag',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/NoGuard'],
                    },
                  }),
                ),
              ),
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
                  blackboard: { atk_scale: 0, count: 0, duration: 20, skip_handle_cryst_break: 0 },
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
                ignoreHitEffect: true,
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0031_mifu_normalskill_2:/scheduledSequences/5/sequence/steps/0/whenTrue/steps/2',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.119999997317791 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.100000001490116,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.746557116508484,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 3.94566202163696,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              step('applyBuff', {
                buffId: 'buff_common_obtain_ultimate_sp',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
        24,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 99999 },
            slot: 'TimeDilation/Layer/Entity/VisualAdjust',
            priority: 50,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 1.25,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0.333333343267441,
                },
                {
                  time: 1,
                  value: 1.25,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343267441,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: true,
            targets: ['caster'],
          }),
        ),
        15,
      ),
      scheduled(
        22,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_listen_crush',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        27,
      ),
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 50 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    angle: 120,
    atk_heal: 0,
    atk_scale: [
      0.270000010728836, 0.300000011920929, 0.319999992847443, 0.349999994039536, 0.379999995231628,
      0.409999996423721, 0.430000007152557, 0.46000000834465, 0.490000009536743, 0.519999980926514,
      0.560000002384186, 0.610000014305115,
    ],
    atk_scale2: [
      0.349999994039536, 0.389999985694885, 0.419999986886978, 0.46000000834465, 0.490000009536743,
      0.529999971389771, 0.560000002384186, 0.600000023841858, 0.629999995231628, 0.680000007152557,
      0.730000019073486, 0.790000021457672,
    ],
    cam_angle: 0,
    cam_duration: 3.41,
    duration: 2,
    input_angle: 0,
    maxstack: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 5,
    potential: 0,
    potential_minuscd: 0,
    prob: 0,
    radius: 5,
    select_radius: 5,
    stack: 4,
    usp_everyone: 0,
    usp_self: 0,
    display_atk_scale: [
      0.889999985694885, 0.980000019073486, 1.07000005245209, 1.1599999666214, 1.25,
      1.3400000333786, 1.42999994754791, 1.50999999046326, 1.60000002384186, 1.72000002861023,
      1.85000002384186, 2,
    ],
    display_poise: 5,
  },
);

export const mifuBattleSkill3: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill3',
    sourceSkillId: 'chr_0031_mifu_normalskill_3',
    timelineBlockFrames: 46,
    naturalDurationFrames: 241,
    exclusiveFrame: 45,
    costFrame: 0,
    scheduledSequences: [
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
              branch(
                { kind: 'casterControlled' },
                sequence(),
                sequence(
                  step('finishBuffsById', {
                    target: 'caster',
                    buffIds: ['buff_chr_0031_mifu_comboprocess'],
                    reason: 'other',
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        0,
      ),
      scheduled(
        21,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0031_mifu_normalskill_3'],
            reason: 'other',
          }),
        ),
        21,
      ),
      scheduled(
        23,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('dealStagger', {
                value: { kind: 'blackboard', key: 'poise' },
                features: ['canBreakWeakness'],
              }),
              branch(
                {
                  kind: 'enemySuperArmorCompare',
                  operator: 'greater',
                  value: { kind: 'constant', value: 10 },
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 0,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                      ],
                    },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.159999996423721 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 0,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                      ],
                    },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        23,
      ),
      scheduled(
        25,
        sequence(
          branch(
            {
              kind: 'enemySuperArmorCompare',
              operator: 'greater',
              value: { kind: 'constant', value: 10 },
            },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0888800024986267 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.751347720623016,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.06666000187397 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.751347720623016,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            { alwaysNext: true },
          ),
          step('dealStagger', { value: { kind: 'blackboard', key: 'poise' } }),
        ),
        25,
      ),
      scheduled(
        26,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              step('modifyActionValue', {
                key: 'atk_scale_runtime',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'atk_scale' },
              }),
              step('readSkillSettingData', {
                items: [
                  {
                    values: [1, 1, 1, 1],
                    column: { kind: 'constant', value: 1 },
                    storeKey: 'yuanshi_multi',
                    enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.01 } },
                  },
                ],
              }),
              step('modifyActionValue', {
                key: 'atk_scale_runtime',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'yuanshi_multi' },
              }),
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'talent' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    {
                      kind: 'any',
                      conditions: [
                        {
                          kind: 'poiseCompare',
                          target: 'enemy',
                          returnValueIfMissing: false,
                          operator: 'equal',
                          value: { kind: 'constant', value: 0 },
                        },
                        {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/Affixes/Vulnerable/VulnerablePhysic'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
                  ],
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'crushmulti',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
                  }),
                  step('modifyActionValue', {
                    key: 'crushmultiadd_talent_runtime',
                    operation: 'assign',
                    value: { kind: 'blackboard', key: 'crushmultiadd_talent' },
                  }),
                  step('modifyActionValue', {
                    key: 'crushmulti',
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'crushmultiadd_talent_runtime' },
                  }),
                  step('modifyActionValue', {
                    key: 'atk_scale_runtime',
                    operation: 'multiply',
                    value: { kind: 'blackboard', key: 'crushmulti' },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_runtime' },
                  tags: [],
                  features: ['canBreakWeakness', 'physicalInfliction'],
                },
                'chr_0031_mifu_normalskill_3:/scheduledSequences/4/sequence/steps/0/body/steps/4',
              ),
            ),
          ),
          step('applyBuff', {
            buffId: 'buff_common_obtain_ultimate_sp',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        26,
      ),
      scheduled(
        21,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 0 },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 10 },
                },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'Ifmoveto',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        23,
      ),
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 50 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    anglestack: 0,
    atk_scale: [
      4, 4.15999984741211, 4.32000017166138, 4.48000001907349, 4.6399998664856, 4.80000019073486,
      4.96000003814697, 5.11999988555908, 5.28000020980835, 5.48000001907349, 5.71999979019165, 6,
    ],
    atk_scale_runtime: 0,
    cam_angle: 0,
    cam_duration: 3.41,
    crushmulti: 1,
    crushmultiadd_talent: 0,
    crushmultiadd_talent_runtime: 0,
    cure: 5,
    damagemulti: 1,
    distance: 4,
    heal_base: 0,
    Ifmoveto: 0,
    ifrightside: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 5,
    potential: 0,
    potential_multi: 0,
    prob: 0,
    talent: 0,
    usp: 0,
    usp_everyone: 0,
    usp_self: 0,
    yuanshi_multi: 1,
    display_poise: 10,
  },
);

export const mifuUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0031_mifu_ultimate_skill',
    timelineBlockFrames: 113,
    naturalDurationFrames: 249,
    exclusiveFrame: 118,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 113, endFrame: 124, sourceSkillIds: ['chr_0031_mifu_powerattack'] },
        { startFrame: 113, endFrame: 124, sourceSkillIds: ['chr_0031_mifu_normalskill_2'] },
        { startFrame: 113, endFrame: 124, sourceSkillIds: ['chr_0031_mifu_normalskill_3'] },
        { startFrame: 113, endFrame: 124, sourceSkillIds: ['chr_0031_mifu_combo_skill'] },
        {
          startFrame: 113,
          endFrame: 124,
          sourceSkillIds: [
            'chr_0031_mifu_attack1',
            'chr_0031_mifu_attack2',
            'chr_0031_mifu_attack3',
            'chr_0031_mifu_attack4',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_buffpause',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        105,
      ),
      scheduled(
        102,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_normalskill_2',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        102,
      ),
      scheduled(
        75,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyPhysicalInfliction', {
                type: 'airborne',
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
                  blackboard: { atk_scale: 0, count: 0, duration: 20, skip_handle_cryst_break: 0 },
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
                airborneBuffId: 'buff_physical_airborne',
                airborneDefinition: {
                  stackingType: 'stack',
                  stackingKey: 'physical',
                  priority: 0,
                  maxStackCount: 1,
                  durationSeconds: { blackboardKey: 'duration' },
                  triggerIntervalSeconds: 0.100000001490116,
                  waitFirstTriggerInterval: true,
                  maxTriggerCount: 1,
                  presentation: {
                    visible: true,
                    iconId: 'airborne',
                    iconPath: '/icons/airborne.webp',
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
                  applyTags: ['Skill/Character/Common/PhysicalStatus/AirborneStatus'],
                  extendTags: [],
                  blackboard: { atk_scale: 0, duration: 3, poise: 10 },
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
                          step('applyBuff', {
                            buffId: 'buff_physical_no_guard',
                            target: 'buffOwner',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              skip_handle_cryst_break: { kind: 'constant', value: 1 },
                            },
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
                          step('readSkillSettingData', {
                            items: [
                              {
                                values: [1.2, 1.2, 1.2, 1.2],
                                column: { kind: 'constant', value: 1 },
                                storeKey: 'atk_scale',
                                enhance: {
                                  target: 'caster',
                                  formula: { kind: 'linear', paramA: 0.01 },
                                },
                              },
                              {
                                values: [10, 10, 10, 10],
                                column: { kind: 'constant', value: 1 },
                                storeKey: 'poise',
                                enhance: {
                                  target: 'caster',
                                  formula: { kind: 'linear', paramA: 0.005 },
                                },
                              },
                            ],
                          }),
                          step('dealDamage', {
                            damageType: 'physical',
                            attackScale: { kind: 'blackboard', key: 'atk_scale' },
                            tags: [],
                            features: ['physicalInfliction'],
                            stagger: { kind: 'blackboard', key: 'poise' },
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
                          scopeKey: 'native-buff-callback:3',
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
                    ),
                  },
                },
                duration: { kind: 'constant', value: 0.800000011920929 },
                height: { kind: 'constant', value: 1.20000004768372 },
                speedFactorMultiplier: 1,
                force: true,
                targetFilter: 'aliveOnly',
                returnWhen: 'always',
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0031_mifu_ultimate_skill:/scheduledSequences/2/sequence/steps/0/whenTrue/steps/1',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.119999997317791 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.100000001490116,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.596828997135162,
                      value: 0,
                      inTangent: 0,
                      outTangent: 2.48033690452576,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: -0.542390584945679,
                      outTangent: -0.542390584945679,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        75,
      ),
      scheduled(
        98,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'constant', value: 0 },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0031_mifu_ultimate_skill:/scheduledSequences/3/sequence/steps/0/whenTrue/steps/0',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.100000001490116,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.746557116508484,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        98,
      ),
      scheduled(
        102,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise2' },
            },
            'chr_0031_mifu_ultimate_skill:/scheduledSequences/4/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.300000011920929 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 1,
                  inTangent: 0,
                  outTangent: -3.06540393829346,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.326221287250519,
                  value: 0,
                  inTangent: -0.183094397187233,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.746557116508484,
                  value: 0,
                  inTangent: 0,
                  outTangent: -0.580187380313873,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 3.94566202163696,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        102,
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
        118,
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
        71,
      ),
    ],
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: [
      0.899999976158142, 0.990000009536743, 1.08000004291534, 1.16999995708466, 1.25999999046326,
      1.35000002384186, 1.44000005722046, 1.52999997138977, 1.62000000476837, 1.73000001907349,
      1.87000000476837, 2.02999997138977,
    ],
    atk_scale2: [
      2.21000003814697, 2.4300000667572, 2.65000009536743, 2.86999988555908, 3.08999991416931,
      3.30999994277954, 3.53999996185303, 3.75999999046326, 3.98000001907349, 4.25,
      4.57999992370605, 4.96999979019165,
    ],
    duration: 15,
    extraattack: 0,
    FinalShield: 0,
    poise_extra: 0,
    poise1: 0,
    poise2: 20,
    potential_5: 0,
    rate: 0.1,
    shelter: 0,
    display_atk_scale: [
      3.10999989509583, 3.42000007629395, 3.73000001907349, 4.03999996185303, 4.34999990463257,
      4.65999984741211, 4.98000001907349, 5.28999996185303, 5.59999990463257, 5.98999977111816,
      6.44999980926514, 7,
    ],
    display_poise: 20,
    poise: 0,
  },
);

export const mifuComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0031_mifu_combo_skill',
    timelineBlockFrames: 35,
    naturalDurationFrames: 211,
    exclusiveFrame: 41,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 35, endFrame: 73, sourceSkillIds: ['chr_0031_mifu_powerattack'] },
        {
          startFrame: 35,
          endFrame: 73,
          sourceSkillIds: ['chr_0031_mifu_normalskill_2', 'chr_0031_mifu_normalskill_3'],
        },
        {
          startFrame: 35,
          endFrame: 73,
          sourceSkillIds: [
            'chr_0031_mifu_attack1',
            'chr_0031_mifu_attack2',
            'chr_0031_mifu_attack3',
            'chr_0031_mifu_attack4',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        27,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_normalskill_2',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        28,
      ),
      scheduled(
        35,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_comboprocess',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0031_mifu_normalskill_2', 'chr_0031_mifu_normalskill_3'],
          }),
        ),
        73,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'not',
                  condition: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'buff_chr_0031_mifu_shield',
                  },
                },
              ],
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0031_mifu_potential_addattack',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      addattack_effect: { kind: 'blackboard', key: 'potential_addattack_effect' },
                      addattack_duraion: {
                        kind: 'blackboard',
                        key: 'potential_addattack_duration',
                      },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('storeSourceAttributeValue', {
                attribute: { kind: 'specific', key: 'maxHealth' },
                stage: 'finalNonConverted',
                useFloor: false,
                divisor: { kind: 'constant', value: 1 },
                multiplier: { kind: 'constant', value: 1 },
                base: { kind: 'constant', value: 0 },
                targetKey: 'talent_shield_maxhp',
              }),
              step('modifyActionValue', {
                key: 'talent_shield_maxhp',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'talent_shield_hppercent' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0031_mifu_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  duration: { kind: 'blackboard', key: 'talent_shield_duration' },
                  FinalShield: { kind: 'blackboard', key: 'talent_shield_maxhp' },
                },
              }),
              step('createTimedMarker', {
                target: 'caster',
                markerId: 'buff_chr_0031_mifu_shield',
                durationSeconds: { kind: 'blackboard', key: 'talent_shield_cd' },
                autoFinishByAction: false,
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        1,
      ),
      scheduled(
        2,
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
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 0 },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 15 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'Ifmoveto',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
              ),
            ),
          ),
        ),
        8,
      ),
      scheduled(
        8,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale1' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0031_mifu_combo_skill:/scheduledSequences/4/sequence/steps/0',
          ),
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
                durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.75000011920929,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        9,
      ),
      scheduled(
        10,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale1' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0031_mifu_combo_skill:/scheduledSequences/5/sequence/steps/0',
          ),
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
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        11,
      ),
      scheduled(
        27,
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
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.699999988079071,
                      value: 0,
                      inTangent: 0,
                      outTangent: 2.48160600662231,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 3.33333301544189,
                      outTangent: 3.33333301544189,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        28,
      ),
      scheduled(
        31,
        sequence(
          step('modifyActionValue', {
            key: 'final_effect',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'rate' },
          }),
          step('modifyActionValue', {
            key: 'final_time',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'duration' },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'final_effect',
                operation: 'add',
                value: { kind: 'blackboard', key: 'extra_effect' },
              }),
              step('modifyActionValue', {
                key: 'final_time',
                operation: 'add',
                value: { kind: 'blackboard', key: 'extra_time' },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_vulnerablephysic_comboskill',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'final_time' },
              rate: { kind: 'blackboard', key: 'final_effect' },
            },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0031_mifu_combo_skill:/scheduledSequences/7/sequence/steps/4',
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: '__endaxis_native_skill_has_hit' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        32,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.366659998893738 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        8,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 570],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale1: [
      0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978,
      0.449999988079071, 0.479999989271164, 0.509999990463257, 0.540000021457672, 0.579999983310699,
      0.620000004768372, 0.680000007152557,
    ],
    atk_scale2: [
      0.509999990463257, 0.560000002384186, 0.610000014305115, 0.660000026226044, 0.709999978542328,
      0.769999980926514, 0.819999992847443, 0.870000004768372, 0.920000016689301, 0.980000019073486,
      1.05999994277954, 1.14999997615814,
    ],
    distance: 0,
    duration: 16,
    extra_effect: 0,
    extra_time: 0,
    final_effect: 0,
    final_time: 0,
    Ifmoveto: 0,
    movedistance: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    potential: 0,
    potential_addattack_duration: 0,
    potential_addattack_effect: 0,
    rate: 0.0500000007450581,
    talent: 0,
    talent_shield_cd: 0,
    talent_shield_duration: 0,
    talent_shield_hppercent: 0,
    talent_shield_maxhp: 0,
    usp: 10,
    display_atk_scale: [
      1.11000001430511, 1.22000002861023, 1.33000004291534, 1.44000005722046, 1.54999995231628,
      1.66999995708466, 1.77999997138977, 1.88999998569489, 2, 2.14000010490417, 2.29999995231628,
      2.5,
    ],
    __endaxis_native_skill_has_hit: 0,
  },
);

export default {
  slug: 'mifu',
  gameId: 'MIFU',
  rarity: 6,
  weaponType: 'greatsword',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [22, 54, 88, 122, 156, 173],
    agility: [10, 27, 46, 65, 83, 92],
    intellect: [9, 27, 45, 63, 81, 90],
    will: [14, 37, 60, 84, 107, 119],
    baseAttack: [30, 91, 155, 219, 283, 315],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [mifuBasicAttack1, mifuBasicAttack2, mifuBasicAttack3, mifuBasicAttack4],
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: mifuPlungingAttack,
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: mifuFinisher },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: mifuBattleSkill1,
      placementSequenceSkillKeys: ['battleSkill1', 'battleSkill2', 'battleSkill3'],
      replacementSkills: [mifuBattleSkill2, mifuBattleSkill3],
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: mifuUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: mifuComboSkill,
    },
  ],
  skillSlots: [
    {
      key: 'battleSkill',
      baseSkillKey: 'battleSkill1',
      replacementSkillKeys: ['battleSkill2', 'battleSkill3'],
    },
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
      event: 'addedBuff',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'eventBuffTagsMatch',
            match: 'hasAny',
            buffTags: ['Skill/Character/Common/NoGuard'],
          },
          sequence(
            branch(
              { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
              sequence(
                branch(
                  {
                    kind: 'contextTargetBuffIdStackCompare',
                    contextKey: 'trigger',
                    buffIds: ['buff_physical_no_guard'],
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 3 },
                  },
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
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill3',
          blackboardKey: 'talent',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill3',
          blackboardKey: 'crushmultiadd_talent',
          operation: 'assign',
          value: [0.100000001490116, 0.200000002980232],
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
          blackboardKey: 'talent',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_hppercent',
          operation: 'assign',
          value: [0.150000005960464, 0.300000011920929],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_duration',
          operation: 'assign',
          value: [10, 10],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_cd',
          operation: 'assign',
          value: [60, 60],
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
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'extra_effect',
          operation: 'assign',
          value: 0.0500000007450581,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'extra_time',
          operation: 'assign',
          value: 4,
        },
        { kind: 'addSkillCooldownFrames', skillGroupKey: 'comboSkill', frames: -60 },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['strength'], value: 20 },
        { kind: 'modifyBasePanelStat', stat: 'artsIntensity', operation: 'flat', value: 16 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_cd',
          operation: 'add',
          value: -15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_duration',
          operation: 'add',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_addattack_effect',
          operation: 'assign',
          value: 0.0599999986588955,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_addattack_duration',
          operation: 'assign',
          value: 20,
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
          blackboardKey: 'poise2',
          operation: 'add',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill1',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.10000002384186,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill2',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.10000002384186,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill2',
          blackboardKey: 'atk_scale2',
          operation: 'multiply',
          value: 1.10000002384186,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill3',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.10000002384186,
        },
      ],
    },
  ],
  entityBlackboard: { EntityBB_normalskill_1_moveto: 0 },
  buffDefinitions: {
    buff_chr_0031_mifu_buffpause: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_down',
        iconPath: '/icons/icon_battle_buff_def_down.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { def: 0, dur: 0, prob: 0 },
      attributeModifiers: [],
    },
    buff_chr_0031_mifu_comboprocess: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0031_mifu_listen_crush: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeOutputPhysicalInfliction',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventPhysicalInflictionTypeIn', types: ['crush'] },
              sequence(
                branch(
                  { kind: 'originSkillTypeIn', skillTypes: ['battleSkill'] },
                  sequence(
                    branch(
                      {
                        kind: 'not',
                        condition: {
                          kind: 'timedMarkerPresent',
                          target: 'caster',
                          markerId: 'buff_chr_0031_mifu_listen_crush',
                        },
                      },
                      sequence(
                        branch(
                          {
                            kind: 'buffStackCompare',
                            target: 'actionInputTarget',
                            tagQueryType: 'hasAny',
                            buffTags: ['Skill/Character/Common/NoGuard'],
                            operator: 'greaterOrEqual',
                            value: { kind: 'constant', value: 3 },
                          },
                          sequence(
                            step('applyBuff', {
                              buffId: 'buff_chr_0031_mifu_normalskill_3',
                              target: 'buffOwner',
                              source: 'buffOwner',
                              inheritSourceSkillCastInfo: true,
                            }),
                            step('createTimedMarker', {
                              target: 'caster',
                              markerId: 'buff_chr_0031_mifu_listen_crush',
                              durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                              autoFinishByAction: false,
                            }),
                          ),
                        ),
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
    buff_chr_0031_mifu_normalskill_2: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 15,
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_up',
        iconPath: '/icons/icon_battle_buff_def_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
        blinkInMainCharHpBar: false,
        showProgressInHpBar: false,
        showProgressInNormalSkillButton: true,
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
      applyTags: ['Skill/Character/chr_0031_mifu/normalskill_2'],
      extendTags: [],
      blackboard: { def: 0, dur: 0, prob: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0031_mifu_normalskill_3'],
            reason: 'other',
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0031_mifu_buffpause'] },
              sequence(step('setCurrentBuffTimePaused', { paused: true })),
            ),
          ),
        },
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0031_mifu_buffpause'] },
              sequence(step('setCurrentBuffTimePaused', { paused: false })),
            ),
          ),
        },
      ],
      skillSlotReplacements: [
        {
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'battleSkill2',
          revertedSkillKey: 'battleSkill1',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
    },
    buff_chr_0031_mifu_normalskill_3: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 15,
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_up',
        iconPath: '/icons/icon_battle_buff_def_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
        blinkInMainCharHpBar: false,
        showProgressInHpBar: false,
        showProgressInNormalSkillButton: true,
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
      applyTags: ['Skill/Character/chr_0031_mifu/normalskill_3'],
      extendTags: [],
      blackboard: { def: 0, dur: 0, prob: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0031_mifu_normalskill_2'],
            reason: 'other',
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0031_mifu_buffpause'] },
              sequence(step('setCurrentBuffTimePaused', { paused: true })),
            ),
          ),
        },
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0031_mifu_buffpause'] },
              sequence(step('setCurrentBuffTimePaused', { paused: false })),
            ),
          ),
        },
      ],
      skillSlotReplacements: [
        {
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'battleSkill3',
          revertedSkillKey: 'battleSkill1',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
    },
    buff_chr_0031_mifu_potential_addattack: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'addattack_duraion' },
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
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
      blackboard: { addattack_duraion: 0, addattack_effect: 0 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'addattack_effect' } },
      ],
    },
    buff_chr_0031_mifu_shield: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_shield',
        iconPath: '/icons/icon_battle_shield.webp',
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
      applyTags: ['Skill/Character/Common/HpShield'],
      extendTags: [],
      blackboard: { duration: 8, extraattack: 0, FinalShield: 1000, potential_5: 0, shelter: 0 },
      attributeModifiers: [],
      shields: [
        {
          infinityValue: false,
          value: { blackboardKey: 'FinalShield' },
          damageAbsorptions: [],
          absorbCount: -1,
          absorbAllDamageWhenConsumed: false,
          removeBuffWhenConsumed: true,
          priority: 'normal',
          replaceHitEffect: true,
        },
      ],
    },
    buff_chr_0031_mifu_vulnerablephysic_comboskill: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_down',
        iconPath: '/icons/icon_battle_buff_def_down.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 15, rate: 0.25 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_physical',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
          }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
