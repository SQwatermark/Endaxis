/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
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
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const mifuBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0031_mifu_attack1',
    timelineBlockFrames: 17,
    exclusiveFrame: 27,
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
                            durationSeconds: { kind: 'constant', value: 0.06 },
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
                            durationSeconds: { kind: 'constant', value: 0.06 },
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
                            durationSeconds: { kind: 'constant', value: 0.1 },
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
                            durationSeconds: { kind: 'constant', value: 0.1 },
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
                            durationSeconds: { kind: 'constant', value: 0.1 },
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
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
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
  },
  {
    atb: 0,
    atk_scale: [0.34, 0.37, 0.41, 0.44, 0.47, 0.51, 0.54, 0.57, 0.61, 0.65, 0.7, 0.76],
    hit_target: 0,
    hitstop_times: 0,
  },
);

export const mifuBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0031_mifu_attack2',
    timelineBlockFrames: 21,
    exclusiveFrame: 29,
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
                    durationSeconds: { kind: 'constant', value: 0.03 },
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
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
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
                    durationSeconds: { kind: 'constant', value: 0.1 },
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
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        19,
      ),
    ],
  },
  {
    atb: 0,
    atk_scale1: [0.13, 0.15, 0.16, 0.17, 0.19, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.3],
    atk_scale2: [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56],
    display_atk_scale: [0.38, 0.42, 0.46, 0.5, 0.54, 0.57, 0.61, 0.65, 0.69, 0.74, 0.79, 0.86],
  },
);

export const mifuBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0031_mifu_attack3',
    timelineBlockFrames: 37,
    exclusiveFrame: 54,
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
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
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
                            durationSeconds: { kind: 'constant', value: 0.03 },
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
                            durationSeconds: { kind: 'constant', value: 0.03 },
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
                            durationSeconds: { kind: 'constant', value: 0.1 },
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
                            durationSeconds: { kind: 'constant', value: 0.1 },
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
                            durationSeconds: { kind: 'constant', value: 0.1 },
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
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
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
                            durationSeconds: { kind: 'constant', value: 0.2 },
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
                            durationSeconds: { kind: 'constant', value: 0.15 },
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
                            durationSeconds: { kind: 'constant', value: 0.15 },
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
                            durationSeconds: { kind: 'constant', value: 0.03 },
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
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
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
  },
  {
    atb: 0,
    atk_scale1: [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    atk_scale2: [0.31, 0.34, 0.37, 0.4, 0.43, 0.46, 0.49, 0.52, 0.55, 0.59, 0.63, 0.69],
    hit_target: 0,
    hitstop_times: 0,
    display_atk_scale: [0.61, 0.67, 0.73, 0.79, 0.85, 0.91, 0.97, 1.03, 1.09, 1.16, 1.26, 1.36],
  },
);

export const mifuBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0031_mifu_attack4',
    timelineBlockFrames: 38,
    exclusiveFrame: 54,
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
                    durationSeconds: { kind: 'constant', value: 0.03 },
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
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
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
                durationSeconds: { kind: 'constant', value: 0.1 },
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
  },
  {
    atb: 28,
    atk_scale1: [0.05, 0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.11],
    atk_scale2: [0.72, 0.79, 0.86, 0.93, 1, 1.07, 1.14, 1.22, 1.29, 1.38, 1.48, 1.61],
    poise: 25,
    display_atk_scale: [0.77, 0.84, 0.92, 0.99, 1.07, 1.15, 1.22, 1.3, 1.38, 1.47, 1.59, 1.72],
  },
);

export const mifuPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0031_mifu_plunging_attack_end',
    timelineBlockFrames: 12,
    exclusiveFrame: 20,
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
  },
  { atb: 0, atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8] },
);

export const mifuFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0031_mifu_powerattack',
    timelineBlockFrames: 38,
    exclusiveFrame: 53,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.15 },
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
                  time: 0.7471619,
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
              calculationMultiplier: 0.3,
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
              calculationMultiplier: 0.2,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0031_mifu_powerattack:/scheduledSequences/2/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.03 },
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
                  time: 0.8024494,
                  value: 0,
                  inTangent: 0,
                  outTangent: 2.530997,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 5.061995,
                  outTangent: 5.061995,
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
            durationSeconds: { kind: 'constant', value: 0.23 },
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
                  time: 0.7007455,
                  value: 0,
                  inTangent: 0,
                  outTangent: 1.670819,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 3.341638,
                  outTangent: 3.341638,
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
            buffId: 'buff_common_damage_immune_medium',
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
  },
  {
    atb: 0,
    atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
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
    exclusiveFrame: 125,
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
  },
  {
    angle: 120,
    atk_scale: [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
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
    display_atk_scale: [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
  },
);

export const mifuBattleSkill2: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill2',
    sourceSkillId: 'chr_0031_mifu_normalskill_2',
    timelineBlockFrames: 28,
    exclusiveFrame: 34,
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
                durationSeconds: { kind: 'constant', value: 0.03 },
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
                      time: 0.1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.7465571,
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
                      inTangent: 3.945662,
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
                durationSeconds: { kind: 'constant', value: 0.03 },
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
                      time: 0.1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.7465571,
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
                      inTangent: 3.945662,
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
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'stack' },
                      operator: 'greater',
                      right: { kind: 'blackboard', key: 'maxstack' },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'maxstack',
                        operation: 'assign',
                        value: { kind: 'blackboard', key: 'stack' },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
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
                    showInSquadIcon: false,
                    onlyShowForMainCharacter: false,
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
                      withActionBlackboardScope(
                        'native-buff-callback:0',
                        {},
                        true,
                        sequence(
                          step('igniteBuffs', {
                            target: 'buffOwner',
                            source: 'buffOwner',
                            igniteType: 'NoGuard',
                          }),
                        ),
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                      withActionBlackboardScope(
                        'native-buff-callback:1',
                        {},
                        true,
                        sequence(
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
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
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
                    showInSquadIcon: false,
                    onlyShowForMainCharacter: false,
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
                      withActionBlackboardScope(
                        'native-buff-callback:0',
                        {},
                        true,
                        sequence(
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
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                      withActionBlackboardScope(
                        'native-buff-callback:1',
                        {},
                        true,
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_physical_handle_cryst_break',
                            target: 'buffOwner',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                      withActionBlackboardScope(
                        'native-buff-callback:2',
                        {},
                        true,
                        sequence(
                          step('igniteBuffs', {
                            target: 'buffOwner',
                            source: 'caster',
                            igniteType: 'PhysicalStatus',
                          }),
                        ),
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                      withActionBlackboardScope(
                        'native-buff-callback:3',
                        {},
                        true,
                        sequence(
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
                                      durationSeconds: { kind: 'constant', value: 0.1 },
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
                                      durationSeconds: { kind: 'constant', value: 0.1 },
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
                                      durationSeconds: { kind: 'constant', value: 0.65 },
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
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                    ),
                  },
                },
                damageMultiplier: { kind: 'constant', value: 1 },
                ignoreHitEffect: true,
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'maxstack' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 3 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0031_mifu_normalskill_3',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0031_mifu_normalskill_2:/scheduledSequences/5/sequence/steps/0/whenTrue/steps/3',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.12 },
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
                      time: 0.1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.7465571,
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
                      inTangent: 3.945662,
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
                  outWeight: 0.333333343,
                },
                {
                  time: 1,
                  value: 1.25,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
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
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 50 }],
  },
  {
    angle: 120,
    atk_heal: 0,
    atk_scale: [0.27, 0.3, 0.32, 0.35, 0.38, 0.41, 0.43, 0.46, 0.49, 0.52, 0.56, 0.61],
    atk_scale2: [0.35, 0.39, 0.42, 0.46, 0.49, 0.53, 0.56, 0.6, 0.63, 0.68, 0.73, 0.79],
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
    display_atk_scale: [0.89, 0.98, 1.07, 1.16, 1.25, 1.34, 1.43, 1.51, 1.6, 1.72, 1.85, 2],
    display_poise: 5,
  },
);

export const mifuBattleSkill3: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill3',
    sourceSkillId: 'chr_0031_mifu_normalskill_3',
    timelineBlockFrames: 46,
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
                    durationSeconds: { kind: 'constant', value: 0.2 },
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
                    durationSeconds: { kind: 'constant', value: 0.16 },
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
                durationSeconds: { kind: 'constant', value: 0.08888 },
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
                      time: 0.7513477,
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
                durationSeconds: { kind: 'constant', value: 0.06666 },
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
                      time: 0.7513477,
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
  },
  {
    anglestack: 0,
    atk_scale: [4, 4.16, 4.32, 4.48, 4.64, 4.8, 4.96, 5.12, 5.28, 5.48, 5.72, 6],
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
    exclusiveFrame: 118,
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
                    showInSquadIcon: false,
                    onlyShowForMainCharacter: false,
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
                      withActionBlackboardScope(
                        'native-buff-callback:0',
                        {},
                        true,
                        sequence(
                          step('igniteBuffs', {
                            target: 'buffOwner',
                            source: 'buffOwner',
                            igniteType: 'NoGuard',
                          }),
                        ),
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                      withActionBlackboardScope(
                        'native-buff-callback:1',
                        {},
                        true,
                        sequence(
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
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
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
                  triggerIntervalSeconds: 0.1,
                  waitFirstTriggerInterval: true,
                  maxTriggerCount: 1,
                  presentation: {
                    visible: true,
                    iconId: 'airborne',
                    iconPath: '/icons/airborne.webp',
                    showInHeadBarCommon: false,
                    showInHeadBarAttached: false,
                    showInSquadIcon: false,
                    onlyShowForMainCharacter: false,
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
                      withActionBlackboardScope(
                        'native-buff-callback:0',
                        {},
                        true,
                        sequence(
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
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                      withActionBlackboardScope(
                        'native-buff-callback:1',
                        {},
                        true,
                        sequence(
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
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                      withActionBlackboardScope(
                        'native-buff-callback:2',
                        {},
                        true,
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_physical_handle_cryst_break',
                            target: 'buffOwner',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                      withActionBlackboardScope(
                        'native-buff-callback:3',
                        {},
                        true,
                        sequence(
                          step('igniteBuffs', {
                            target: 'buffOwner',
                            source: 'caster',
                            igniteType: 'PhysicalStatus',
                          }),
                        ),
                        undefined,
                        { lifetime: 'execution', alwaysNext: true },
                      ),
                    ),
                  },
                },
                duration: { kind: 'constant', value: 0.8 },
                height: { kind: 'constant', value: 1.2 },
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
                durationSeconds: { kind: 'constant', value: 0.12 },
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
                      time: 0.1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.596829,
                      value: 0,
                      inTangent: 0,
                      outTangent: 2.480337,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: -0.5423906,
                      outTangent: -0.5423906,
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
                durationSeconds: { kind: 'constant', value: 0.15 },
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
                      time: 0.1,
                      value: 0,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.7465571,
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
            durationSeconds: { kind: 'constant', value: 0.3 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 1,
                  inTangent: 0,
                  outTangent: -3.065404,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.3262213,
                  value: 0,
                  inTangent: -0.1830944,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.7465571,
                  value: 0,
                  inTangent: 0,
                  outTangent: -0.5801874,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 3.945662,
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
  },
  {
    atk_scale: [0.9, 0.99, 1.08, 1.17, 1.26, 1.35, 1.44, 1.53, 1.62, 1.73, 1.87, 2.03],
    atk_scale2: [2.21, 2.43, 2.65, 2.87, 3.09, 3.31, 3.54, 3.76, 3.98, 4.25, 4.58, 4.97],
    duration: 15,
    extraattack: 0,
    FinalShield: 0,
    poise_extra: 0,
    poise1: 0,
    poise2: 20,
    potential_5: 0,
    rate: 0.1,
    shelter: 0,
    display_atk_scale: [3.11, 3.42, 3.73, 4.04, 4.35, 4.66, 4.98, 5.29, 5.6, 5.99, 6.45, 7],
    display_poise: 20,
    poise: 0,
  },
);

export const mifuComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0031_mifu_combo_skill',
    timelineBlockFrames: 35,
    exclusiveFrame: 41,
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
                durationSeconds: { kind: 'constant', value: 0.1 },
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
                      time: 0.7500001,
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
                durationSeconds: { kind: 'constant', value: 0.15 },
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
                durationSeconds: { kind: 'constant', value: 0.06 },
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
                      time: 0.7,
                      value: 0,
                      inTangent: 0,
                      outTangent: 2.481606,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 3.333333,
                      outTangent: 3.333333,
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
            durationSeconds: { kind: 'constant', value: 0.36666 },
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
  },
  {
    atk_scale1: [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
    atk_scale2: [0.51, 0.56, 0.61, 0.66, 0.71, 0.77, 0.82, 0.87, 0.92, 0.98, 1.06, 1.15],
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
    rate: 0.05,
    talent: 0,
    talent_shield_cd: 0,
    talent_shield_duration: 0,
    talent_shield_hppercent: 0,
    talent_shield_maxhp: 0,
    usp: 10,
    display_atk_scale: [1.11, 1.22, 1.33, 1.44, 1.55, 1.67, 1.78, 1.89, 2, 2.14, 2.3, 2.5],
    __endaxis_native_skill_has_hit: 0,
  },
);

export const commonBuffDefinitions = {
  buff_common_affixes_vulnerable_physical: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Skill/Character/Common/Affixes/Vulnerable',
      'Skill/Character/Common/Affixes/Vulnerable/VulnerablePhysic',
    ],
    extendTags: [],
    blackboard: {
      child_buff_id: 'buff_common_affixes_vulnerable_physical_default_child',
      duration: 0.8,
      rate: 0.2,
    },
    attributeModifiers: [
      {
        attribute: 'physicalVulnerabilityIncrease',
        slot: 'baseAddition',
        value: { blackboardKey: 'rate' },
      },
    ],
    lifecycleSequences: {
      enable: sequence(
        step('applyBuff', {
          buffId: { blackboardKey: 'child_buff_id' },
          target: 'buffOwner',
          source: 'buffOwner',
          inheritSourceSkillCastInfo: true,
          finishByAction: true,
          asChildBuff: true,
          blackboardAssignments: {
            rate: { kind: 'blackboard', key: 'rate' },
            duration: { kind: 'blackboard', key: 'duration' },
          },
        }),
      ),
    },
  },
  buff_common_affixes_vulnerable_physical_default_child: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    presentation: {
      visible: true,
      iconId: 'icon_battle_affix_physical_vulnerable',
      iconPath: '/icons/icon_battle_affix_physical_vulnerable.webp',
      showInHeadBarCommon: true,
      showInHeadBarAttached: false,
      showInSquadIcon: true,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'LifeTime',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
    },
    applyTags: [],
    extendTags: [],
    blackboard: { duration: 0, rate: 0.2 },
    attributeModifiers: [],
  },
  buff_common_cryst_triggered_physical_break: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 5,
    applyTags: ['Skill/Character/Common/SpellStatusSpecial/Shatter'],
    extendTags: [],
    blackboard: { atk_scale: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step(
          'dealDamage',
          {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['cryoAbnormal'],
            features: ['shatter'],
          },
          'buff_common_cryst_triggered_physical_break:/lifecycleSequences/start/steps/0',
        ),
      ),
    },
  },
  buff_common_damage_immune_medium: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Status/DodgeDamageImmune',
      'Status/SkillDamageImmune',
      'Immune/SpellInflictOnChar/All',
    ],
    extendTags: [],
    blackboard: { duration: 9999 },
    attributeModifiers: [],
  },
  buff_common_damage_immune_ult_skill: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Status/DodgeDamageImmune',
      'Status/SkillDamageImmune',
      'Immune/SpellInflictOnChar/All',
    ],
    extendTags: [],
    blackboard: { duration: 9999 },
    attributeModifiers: [],
  },
  buff_common_obtain_ultimate_sp: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 1,
    applyTags: [],
    extendTags: [],
    blackboard: { ratio: 1, usp_everyone: 6.5, usp_self: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })),
    },
  },
  buff_common_power_attack_disable_cast_skill: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    applyTags: [
      'Status/DisableDash',
      'Status/CantSwitchOutCenter',
      'Status/DisableNormalSkill',
      'Status/DisableCastComboSkill',
      'Status/Unjumpable',
    ],
    extendTags: [],
    blackboard: {},
    attributeModifiers: [],
  },
  buff_physical_airborne: {
    stackingType: 'stack',
    stackingKey: 'physical',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 0.1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    presentation: {
      visible: true,
      iconId: 'airborne',
      iconPath: '/icons/airborne.webp',
      showInHeadBarCommon: false,
      showInHeadBarAttached: false,
      showInSquadIcon: false,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'Default',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
    },
    applyTags: ['Skill/Character/Common/PhysicalStatus/AirborneStatus'],
    extendTags: [],
    blackboard: { atk_scale: 0, duration: 3, poise: 10 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        withActionBlackboardScope(
          'native-buff-callback:0',
          {},
          true,
          sequence(
            step('applyBuff', {
              buffId: 'buff_physical_no_guard',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: { skip_handle_cryst_break: { kind: 'constant', value: 1 } },
            }),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
        withActionBlackboardScope(
          'native-buff-callback:1',
          {},
          true,
          sequence(
            step('readSkillSettingData', {
              items: [
                {
                  values: [1.2, 1.2, 1.2, 1.2],
                  column: { kind: 'constant', value: 1 },
                  storeKey: 'atk_scale',
                  enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.01 } },
                },
                {
                  values: [10, 10, 10, 10],
                  column: { kind: 'constant', value: 1 },
                  storeKey: 'poise',
                  enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.005 } },
                },
              ],
            }),
            step(
              'dealDamage',
              {
                damageType: 'physical',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: [],
                features: ['physicalInfliction'],
                stagger: { kind: 'blackboard', key: 'poise' },
              },
              'buff_physical_airborne:/lifecycleSequences/start/steps/1/body/steps/1',
            ),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
        withActionBlackboardScope(
          'native-buff-callback:2',
          {},
          true,
          sequence(
            step('applyBuff', {
              buffId: 'buff_physical_handle_cryst_break',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
            }),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
        withActionBlackboardScope(
          'native-buff-callback:3',
          {},
          true,
          sequence(
            step('igniteBuffs', {
              target: 'buffOwner',
              source: 'caster',
              igniteType: 'PhysicalStatus',
            }),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
      ),
    },
  },
  buff_physical_crushed: {
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
      showInSquadIcon: false,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'Default',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
    },
    applyTags: ['Skill/Character/Common/PhysicalStatus/CrushStatus'],
    extendTags: [],
    blackboard: { atk_scale: 1, count: 0, dmg_multiplier: 1, duration: 3, ignore_hit_effect: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        withActionBlackboardScope(
          'native-buff-callback:0',
          {},
          true,
          sequence(
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
                  enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.01 } },
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
            step(
              'dealDamage',
              {
                damageType: 'physical',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: [],
                features: ['physicalInfliction'],
              },
              'buff_physical_crushed:/lifecycleSequences/start/steps/0/body/steps/4',
            ),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
        withActionBlackboardScope(
          'native-buff-callback:1',
          {},
          true,
          sequence(
            step('applyBuff', {
              buffId: 'buff_physical_handle_cryst_break',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
            }),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
        withActionBlackboardScope(
          'native-buff-callback:2',
          {},
          true,
          sequence(
            step('igniteBuffs', {
              target: 'buffOwner',
              source: 'caster',
              igniteType: 'PhysicalStatus',
            }),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
        withActionBlackboardScope(
          'native-buff-callback:3',
          {},
          true,
          sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'ignore_hit_effect' },
                operator: 'less',
                right: { kind: 'constant', value: 0.5 },
              },
              sequence({
                kind: 'switch',
                parameters: { choice: { kind: 'blackboard', key: 'count' }, alwaysNext: true },
                options: [
                  {
                    value: { kind: 'constant', value: 0 },
                    sequence: sequence(
                      step('startTimeDilation', {
                        scope: 'entity',
                        durationSeconds: { kind: 'constant', value: 0.1 },
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
                        durationSeconds: { kind: 'constant', value: 0.1 },
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
                        durationSeconds: { kind: 'constant', value: 0.65 },
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
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
      ),
    },
  },
  buff_physical_handle_cryst_break: {
    stackingType: 'stack',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: 10,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    applyTags: [],
    extendTags: [],
    blackboard: { atk_scale: 0, count: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step('readBuffBlackboard', {
          target: 'buffOwner',
          query: {
            kind: 'tag',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
          },
          desiredKey: 'count',
          outputKey: 'count',
        }),
        step('readSkillSettingData', {
          items: [
            {
              values: [2.4, 3.6, 4.8, 6],
              column: { kind: 'blackboard', key: 'count' },
              storeKey: 'atk_scale',
              enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.01 } },
            },
          ],
        }),
        step('finishBuffsByTag', {
          target: 'buffOwner',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
          reason: 'early',
        }),
        step('applyBuff', {
          buffId: 'buff_common_cryst_triggered_physical_break',
          target: 'buffOwner',
          source: 'buffSource',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: { atk_scale: { kind: 'blackboard', key: 'atk_scale' } },
        }),
        {
          kind: 'switch',
          parameters: { choice: { kind: 'blackboard', key: 'count' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 0 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.1 },
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
                  durationSeconds: { kind: 'constant', value: 0.1 },
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
                  durationSeconds: { kind: 'constant', value: 0.65 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 20,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
          ],
        },
      ),
    },
  },
  buff_physical_no_guard: {
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
      showInSquadIcon: false,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'Default',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
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
        withActionBlackboardScope(
          'native-buff-callback:0',
          {},
          true,
          sequence(
            step('igniteBuffs', {
              target: 'buffOwner',
              source: 'buffOwner',
              igniteType: 'NoGuard',
            }),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
        withActionBlackboardScope(
          'native-buff-callback:1',
          {},
          true,
          sequence(
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
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
      ),
    },
  },
  buff_physical_no_guard_fake: {
    stackingType: 'refresh',
    priority: 100,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: ['Skill/Character/Common/NoGuardFake'],
    extendTags: [],
    blackboard: { duration: 1 },
    attributeModifiers: [],
  },
} as const satisfies OperatorBuffDefinitions;

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
          value: [0.1, 0.2],
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
          value: [0.15, 0.3],
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
          value: 0.05,
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
          value: 0.06,
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
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill2',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill2',
          blackboardKey: 'atk_scale2',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill3',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.1,
        },
      ],
    },
  ],
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
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
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
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
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
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
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
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
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
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
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
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
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
