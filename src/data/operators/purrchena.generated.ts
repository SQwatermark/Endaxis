/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */

import type { ActionGraphResourceDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import type { SkillDefinition } from '../../../packages/game-data-contract/src/skills';
import type { SkillBuffDefinition } from '../../../packages/game-data-contract/src/buffs';
import type {
  OperatorPassiveSkillDefinition,
  ComboSkillConditionDefinition,
} from '../../../packages/game-data-contract/src/operators';
import type { OperatorDefinition } from '../../../packages/game-data-contract/src/operators';
export const purrchenaChr_0038_purrche_attack1ActionGraph = {
  main: {
    nodes: {
      startTimeDilation_1: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.08 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      once_3: {
        action: { kind: 'once', parameters: {}, body: { $sequence: 'startTimeDilation_1' } },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'once_3' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_4: {
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
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'ifElse_5' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_7: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_3' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_6',
      },
      calculateActionValue_8: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_1',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_4' },
            right: { kind: 'constant', value: 0.4 },
          },
        },
        next: 'dealDamage_7',
      },
      repeatEachTick_9: {
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
          body: { $sequence: 'calculateActionValue_8' },
        },
        next: null,
      },
      startTimeDilation_10: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.1 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      once_12: {
        action: { kind: 'once', parameters: {}, body: { $sequence: 'startTimeDilation_10' } },
        next: null,
      },
      ifElse_14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'once_12' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'ifElse_14' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_16: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_5' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_15',
      },
      calculateActionValue_17: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_2',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_6' },
            right: { kind: 'constant', value: 0.6 },
          },
        },
        next: 'dealDamage_16',
      },
      repeatEachTick_18: {
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
          body: { $sequence: 'calculateActionValue_17' },
        },
        next: null,
      },
      reachSkillOperableBoundary_19: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0038_purrche_attack2'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'inputTarget' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_1' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_2' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_attack1: SkillDefinition = {
  key: 'chr_0038_purrche_attack1',
  element: 'physical',
  blackboard: {
    atk_scale: [0.48, 0.53, 0.58, 0.62, 0.67, 0.72, 0.77, 0.82, 0.86, 0.92, 1, 1.08],
    atk_scale_1: 0,
    atk_scale_2: 0,
  },
  timelineBlockFrames: 23,
  naturalDurationFrames: 130,
  exclusiveFrame: 28,
  offsetRecordFrame: 10,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 42,
        input: 'basicAttack',
        targetSkillId: 'chr_0038_purrche_attack2',
      },
    ],
    allowedNextSkills: [{ startFrame: 23, endFrame: 42, skillIds: ['chr_0038_purrche_attack2'] }],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 10, endFrame: 11, sequence: { $sequence: 'repeatEachTick_9' } },
    { startFrame: 17, endFrame: 18, sequence: { $sequence: 'repeatEachTick_18' } },
    { startFrame: 23, endFrame: 42, sequence: { $sequence: 'reachSkillOperableBoundary_19' } },
  ],
  timelineContinuationSkillId: 'chr_0038_purrche_attack2',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: purrchenaChr_0038_purrche_attack1ActionGraph,
};

export const purrchenaChr_0038_purrche_attack2ActionGraph = {
  main: {
    nodes: {
      startTimeDilation_2: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.12 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'hitstoptime_1',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'startTimeDilation_2',
      },
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'modifyActionValue_3' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'ifElse_5' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'ifElse_7' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_9: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_5' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_8',
      },
      calculateActionValue_10: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_1',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_6' },
            right: { kind: 'constant', value: 0.2 },
          },
        },
        next: 'dealDamage_9',
      },
      repeatEachTick_11: {
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
          body: { $sequence: 'calculateActionValue_10' },
        },
        next: null,
      },
      startTimeDilation_13: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.12 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      modifyActionValue_14: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'hitstoptime_2',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'startTimeDilation_13',
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      ifElse_16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: 'modifyActionValue_14' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_18: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'ifElse_16' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_19: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'ifElse_18' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_20: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_9' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_19',
      },
      calculateActionValue_21: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_2',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_10' },
            right: { kind: 'constant', value: 0.3 },
          },
        },
        next: 'dealDamage_20',
      },
      repeatEachTick_22: {
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
          body: { $sequence: 'calculateActionValue_21' },
        },
        next: null,
      },
      startTimeDilation_24: {
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
      modifyActionValue_25: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'hitstoptime_3',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'startTimeDilation_24',
      },
      checkCondition_23: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      ifElse_27: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_23' },
          whenTrue: { $sequence: 'modifyActionValue_25' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_29: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'ifElse_27' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_30: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'ifElse_29' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_31: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_13' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_30',
      },
      calculateActionValue_32: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_3',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_14' },
            right: { kind: 'constant', value: 0.5 },
          },
        },
        next: 'dealDamage_31',
      },
      repeatEachTick_33: {
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
          body: { $sequence: 'calculateActionValue_32' },
        },
        next: null,
      },
      reachSkillOperableBoundary_34: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0038_purrche_attack3'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'hitstoptime_1', fallback: 0 },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'less',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_3: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'inputTarget' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_1' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_7: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'hitstoptime_2', fallback: 0 },
      },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_7' },
          operator: 'less',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_2' } },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_11: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'hitstoptime_3', fallback: 0 },
      },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_11' },
          operator: 'less',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_3' } },
      data_14: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_attack2: SkillDefinition = {
  key: 'chr_0038_purrche_attack2',
  element: 'physical',
  blackboard: {
    atk_scale: [0.52, 0.57, 0.62, 0.67, 0.72, 0.77, 0.82, 0.88, 0.93, 0.99, 1.07, 1.16],
    atk_scale_1: 0,
    atk_scale_2: 0,
    atk_scale_3: 0,
    hitstoptime_1: 0,
    hitstoptime_2: 0,
    hitstoptime_3: 0,
  },
  timelineBlockFrames: 46,
  naturalDurationFrames: 180,
  exclusiveFrame: 48,
  offsetRecordFrame: 22,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 53,
        input: 'basicAttack',
        targetSkillId: 'chr_0038_purrche_attack3',
      },
    ],
    allowedNextSkills: [{ startFrame: 46, endFrame: 53, skillIds: ['chr_0038_purrche_attack3'] }],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 11, endFrame: 12, sequence: { $sequence: 'repeatEachTick_11' } },
    { startFrame: 14, endFrame: 15, sequence: { $sequence: 'repeatEachTick_22' } },
    { startFrame: 22, endFrame: 24, sequence: { $sequence: 'repeatEachTick_33' } },
    { startFrame: 46, endFrame: 53, sequence: { $sequence: 'reachSkillOperableBoundary_34' } },
  ],
  timelineContinuationSkillId: 'chr_0038_purrche_attack3',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: purrchenaChr_0038_purrche_attack2ActionGraph,
};

export const purrchenaChr_0038_purrche_attack3ActionGraph = {
  main: {
    nodes: {
      startTimeDilation_2: {
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
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'hitstop_times_1',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'startTimeDilation_2',
      },
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'modifyActionValue_3' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'ifElse_5' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'ifElse_7' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_9: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_5' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_8',
      },
      calculateActionValue_10: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_1',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_6' },
            right: { kind: 'constant', value: 0.2 },
          },
        },
        next: 'dealDamage_9',
      },
      repeatEachTick_11: {
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
          body: { $sequence: 'calculateActionValue_10' },
        },
        next: null,
      },
      changeResource_13: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_7' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            onlyMainOperator: true,
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          },
        },
        next: null,
      },
      once_15: {
        action: { kind: 'once', parameters: {}, body: { $sequence: 'changeResource_13' } },
        next: null,
      },
      ifElse_17: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'once_15' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_18: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'ifElse_17' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_19: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_8' },
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: { kind: 'valueNode', nodeId: 'data_9' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'ifElse_18',
      },
      calculateActionValue_20: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_2',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_10' },
            right: { kind: 'constant', value: 0.8 },
          },
        },
        next: 'dealDamage_19',
      },
      repeatEachTick_21: {
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
          body: { $sequence: 'calculateActionValue_20' },
        },
        next: null,
      },
      reachSkillOperableBoundary_23: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0038_purrche_attack1'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'hitstop_times_1', fallback: 0 },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'less',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_3: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'inputTarget' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_1' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_2' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_attack3: SkillDefinition = {
  key: 'chr_0038_purrche_attack3',
  element: 'physical',
  blackboard: {
    atb: 23,
    atk_scale: [1.02, 1.12, 1.22, 1.33, 1.43, 1.53, 1.63, 1.73, 1.84, 1.96, 2.12, 2.3],
    atk_scale_1: 0,
    atk_scale_2: 0,
    hitstop_times_1: 0,
    poise: 21,
  },
  timelineBlockFrames: 47,
  naturalDurationFrames: 209,
  exclusiveFrame: 47,
  offsetRecordFrame: 21,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 58,
        input: 'basicAttack',
        targetSkillId: 'chr_0038_purrche_attack1',
      },
    ],
    allowedNextSkills: [{ startFrame: 47, endFrame: 58, skillIds: ['chr_0038_purrche_attack1'] }],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 18, endFrame: 20, sequence: { $sequence: 'repeatEachTick_11' } },
    { startFrame: 21, endFrame: 23, sequence: { $sequence: 'repeatEachTick_21' } },
    { startFrame: 47, endFrame: 58, sequence: { $sequence: 'reachSkillOperableBoundary_23' } },
  ],
  timelineContinuationSkillId: 'chr_0038_purrche_attack1',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: purrchenaChr_0038_purrche_attack3ActionGraph,
};

export const purrchenaChr_0038_purrche_power_attackActionGraph = {
  main: {
    nodes: {
      gainFinisherSp_1: {
        action: { kind: 'gainFinisherSp', parameters: { factor: 1, recipient: 'team' } },
        next: null,
      },
      startTimeDilation_2: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.42 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0.004006803,
                  value: 0.4333363,
                  inTangent: -14.53776,
                  outTangent: -14.53776,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.03453654,
                  value: -0.0104978,
                  inTangent: -0.00949474,
                  outTangent: -0.00949474,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.9195074,
                  value: 0.001982015,
                  inTangent: 0.01377201,
                  outTangent: 0.01377201,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.9931734,
                  value: 1.999922,
                  inTangent: 27.12162,
                  outTangent: 27.12162,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: 'gainFinisherSp_1',
      },
      dealDamage_3: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
            tags: ['normalAttack', 'powerAttack'],
          },
        },
        next: 'startTimeDilation_2',
      },
      startTimeDilation_4: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.15 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0.005714327,
                  value: 0.2817955,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0.333333343,
                },
                {
                  time: 1.0057143,
                  value: 0.2817955,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      applyBuff_5: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_full_immune_medium' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      applyBuff_6: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_power_attack_disable_cast_skill' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_power_attack: SkillDefinition = {
  actionGraph: purrchenaChr_0038_purrche_power_attackActionGraph,
  key: 'chr_0038_purrche_power_attack',
  element: 'physical',
  blackboard: { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
  timelineBlockFrames: 47,
  naturalDurationFrames: 137,
  exclusiveFrame: 46,
  offsetRecordFrame: 0,
  inputWindows: { allowedNextSkills: [{ startFrame: 37, endFrame: 56, skillIds: [] }] },
  costFrame: 4,
  scheduledSequences: [
    { startFrame: 24, endFrame: 26, sequence: { $sequence: 'dealDamage_3' } },
    { startFrame: 33, endFrame: 35, sequence: { $sequence: 'startTimeDilation_4' } },
    { startFrame: 0, endFrame: 46, sequence: { $sequence: 'applyBuff_5' } },
    { startFrame: 0, endFrame: 25, sequence: { $sequence: 'applyBuff_6' } },
  ],
  skillType: 'finisher',
  levelSource: 'basicAttack',
  nativeSkillType: 'breakingAttack',
};

export const purrchenaChr_0038_purrche_plunging_attack_endActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      changeResource_2: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_2' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            onlyMainOperator: true,
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          },
        },
        next: null,
      },
      ifElse_3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'changeResource_2' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_4: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_3' },
            tags: ['normalAttack', 'plungingAttack'],
          },
        },
        next: 'ifElse_3',
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_plunging_attack_end: SkillDefinition = {
  key: 'chr_0038_purrche_plunging_attack_end',
  element: 'physical',
  blackboard: {
    atb: 0,
    atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
  timelineBlockFrames: 22,
  naturalDurationFrames: 228,
  exclusiveFrame: 21,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [{ startFrame: 1, endFrame: 6, sequence: { $sequence: 'dealDamage_4' } }],
  skillType: 'plungingAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: purrchenaChr_0038_purrche_plunging_attack_endActionGraph,
};

export const purrchenaChr_0038_purrche_normal_skillActionGraph = {
  main: {
    nodes: {
      castSkillDuringAction_1: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_loop_1',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_1',
      },
      markCurrentSkillCanInterrupt_3: {
        action: { kind: 'markCurrentSkillCanInterrupt', parameters: {} },
        next: null,
      },
      interruptCurrentSkill_4: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      finishBuffsById_7: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: [
              'buff_chr_0038_purrche_enter_normal_skill_end',
              'buff_chr_0038_purrche_block_end',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      findCharacterTeamTargets_8: {
        action: {
          kind: 'findCharacterTeamTargets',
          parameters: { saveToContextKey: 'MainChar', selection: { kind: 'controlledOperator' } },
        },
        next: null,
      },
      findTargets_9: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: 'findCharacterTeamTargets_8',
      },
      applyBuff_10: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_obtain_ultimate_sp' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: 'applyBuff_10',
      },
      applyBuff_12: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_aura_block',
                copiedBlackboardAssignments: {
                  dmg_taken_down_1: 'dmg_taken_down_1',
                  dmg_taken_down_2: 'dmg_taken_down_2',
                  dmg_taken_down_3: 'dmg_taken_down_3',
                  dmg_taken_down_4: 'dmg_taken_down_4',
                },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0038_purrche_normal_skill_block_1',
              'chr_0038_purrche_normal_skill_block_2',
              'chr_0038_purrche_normal_skill_loop_1',
              'chr_0038_purrche_normal_skill_loop_2',
              'chr_0038_purrche_combo_skill',
              'chr_0038_purrche_normal_skill_counter',
            ],
          },
        },
        next: null,
      },
      copyContextTargets_15: {
        action: {
          kind: 'copyContextTargets',
          parameters: { source: { kind: 'context', key: 'Attacker' }, saveToContextKey: 'HitTar' },
        },
        next: null,
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_19: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'copyContextTargets_15' },
          whenFalse: { $sequence: 'copyContextTargets_15' },
        },
        next: null,
      },
      copyContextTargets_17: {
        action: {
          kind: 'copyContextTargets',
          parameters: { source: { kind: 'fixed', target: 'enemy' }, saveToContextKey: 'HitTar' },
        },
        next: null,
      },
      findTargets_18: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: 'copyContextTargets_17',
      },
      checkCondition_16: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_20: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_16' },
          whenTrue: { $sequence: 'findTargets_18' },
          whenFalse: { $sequence: 'ifElse_19' },
        },
        next: null,
      },
      copyContextTargets_21: {
        action: {
          kind: 'copyContextTargets',
          parameters: { source: { kind: 'inputTarget' }, saveToContextKey: 'Attacker' },
        },
        next: 'ifElse_20',
      },
      castSkillDuringAction_26: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_1',
            target: 'actionInputTarget',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_27: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_26',
      },
      copyContextTargets_28: {
        action: {
          kind: 'copyContextTargets',
          parameters: { source: { kind: 'inputTarget' }, saveToContextKey: 'Attacker' },
        },
        next: 'applyBuff_27',
      },
      checkCondition_29: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'copyContextTargets_28',
      },
      checkCondition_30: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_29',
      },
      castSkillDuringAction_22: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_1',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_23: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              { buffId: 'buff_chr_0038_purrche_block_counter' },
              { buffId: 'buff_chr_0038_purrche_block_immune_skillfx' },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_22',
      },
      copyContextTargets_24: {
        action: {
          kind: 'copyContextTargets',
          parameters: { source: { kind: 'inputTarget' }, saveToContextKey: 'Attacker' },
        },
        next: 'applyBuff_23',
      },
      checkCondition_25: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'copyContextTargets_24',
      },
      listenForCombatEvents_31: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill.actionGroupData.timelineActions[29]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_25' },
              },
              {
                key: 'SkillData.chr_0038_purrche_normal_skill.actionGroupData.timelineActions[29]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_30' },
              },
            ],
          },
        },
        next: null,
      },
      jumpTimeline_36: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 107 },
          condition: { $sequence: null },
        },
        next: null,
      },
      copyContextTargets_37: {
        action: {
          kind: 'copyContextTargets',
          parameters: { source: { kind: 'inputTarget' }, saveToContextKey: 'Attacker' },
        },
        next: 'jumpTimeline_36',
      },
      checkCondition_38: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'copyContextTargets_37',
      },
      checkCondition_39: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'checkCondition_38',
      },
      castSkillDuringAction_32: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_block',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_33: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_counter' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_32',
      },
      copyContextTargets_34: {
        action: {
          kind: 'copyContextTargets',
          parameters: { source: { kind: 'inputTarget' }, saveToContextKey: 'Attacker' },
        },
        next: 'applyBuff_33',
      },
      checkCondition_35: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: 'copyContextTargets_34',
      },
      listenForCombatEvents_40: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill.actionGroupData.timelineActions[30]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_35' },
              },
              {
                key: 'SkillData.chr_0038_purrche_normal_skill.actionGroupData.timelineActions[30]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_39' },
              },
            ],
          },
        },
        next: null,
      },
      jumpTimeline_opt1: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 252 },
          condition: { $sequence: null },
        },
        next: null,
      },
      checkCondition_opt2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: 'jumpTimeline_opt1',
      },
      listenForCombatEvents_opt3: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill.actionGroupData.timelineActions[32]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_opt2' },
              },
            ],
          },
        },
        next: null,
      },
      listenForCombatEvents_opt4: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill.actionGroupData.timelineActions[33]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_opt2' },
              },
            ],
          },
        },
        next: null,
      },
      jumpTimeline_opt5: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 674 },
          condition: { $sequence: null },
        },
        next: null,
      },
      checkCondition_opt6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: 'jumpTimeline_opt5',
      },
      listenForCombatEvents_opt7: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill.actionGroupData.timelineActions[34]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_opt6' },
              },
            ],
          },
        },
        next: null,
      },
      listenForCombatEvents_opt8: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill.actionGroupData.timelineActions[35]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_opt6' },
              },
            ],
          },
        },
        next: null,
      },
      applyBuff_53: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_counter' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      changeResource_54: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_11' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'default',
          },
        },
        next: null,
      },
      changeResource_55: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_12' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'default',
          },
        },
        next: 'changeResource_54',
      },
      applyBuff_56: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_change_skill' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'targetFacingAngle',
          origin: { kind: 'context', key: 'Attacker' },
          target: { kind: 'owner' },
          angleType: 'forward',
          angle: { kind: 'constant', value: 180 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'context', key: 'Attacker' },
          distance: 3.5,
          lessThan: false,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 3,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_eny_0018_lbtough_pre_catch'] },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageFeaturesMatch',
          match: 'exceptAny',
          features: ['dot', 'remainArea'],
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 3,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_7: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_eny_0018_lbtough_pre_catch'] },
      },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageFeaturesMatch',
          match: 'exceptAny',
          features: ['dot', 'remainArea'],
        },
      },
      data_9: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_end'] },
      },
      data_10: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_end'] },
      },
      data_11: { type: 'number', expression: { kind: 'blackboard', key: 'potential_5_atb' } },
      data_12: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return_1' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_normal_skill: SkillDefinition = {
  key: 'chr_0038_purrche_normal_skill',
  element: 'nature',
  blackboard: {
    atb_return_1: 20,
    dmg_taken_down_1: 0.9,
    dmg_taken_down_2: 0.8,
    dmg_taken_down_3: 0.7,
    dmg_taken_down_4: 0.6,
    potential_5_atb: 0,
  },
  timelineBlockFrames: 12,
  naturalDurationFrames: 184,
  exclusiveFrame: 50,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 12, endFrame: 50, skillIds: ['chr_0038_purrche_normal_skill_counter'] },
      { startFrame: 300, endFrame: 585, skillIds: ['chr_0038_purrche_normal_skill_sp'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 49, endFrame: 49, sequence: { $sequence: 'applyBuff_2' } },
    { startFrame: 1007, endFrame: 1010, sequence: { $sequence: 'markCurrentSkillCanInterrupt_3' } },
    { startFrame: 1134, endFrame: 1137, sequence: { $sequence: 'interruptCurrentSkill_4' } },
    { startFrame: 1429, endFrame: 1432, sequence: { $sequence: 'markCurrentSkillCanInterrupt_3' } },
    { startFrame: 1492, endFrame: 1495, sequence: { $sequence: 'interruptCurrentSkill_4' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_7' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findTargets_9' } },
    { startFrame: 0, endFrame: 5, sequence: { $sequence: 'checkCondition_11' } },
    { startFrame: 0, endFrame: 50, sequence: { $sequence: 'applyBuff_12' } },
    { startFrame: 1204, endFrame: 1207, sequence: { $sequence: 'copyContextTargets_21' } },
    { startFrame: 0, endFrame: 50, sequence: { $sequence: 'listenForCombatEvents_31' } },
    { startFrame: 1204, endFrame: 1410, sequence: { $sequence: 'listenForCombatEvents_40' } },
    { startFrame: 312, endFrame: 417, sequence: { $sequence: 'listenForCombatEvents_opt3' } },
    { startFrame: 874, endFrame: 1006, sequence: { $sequence: 'listenForCombatEvents_opt4' } },
    { startFrame: 1204, endFrame: 1285, sequence: { $sequence: 'listenForCombatEvents_opt7' } },
    { startFrame: 1285, endFrame: 1428, sequence: { $sequence: 'listenForCombatEvents_opt8' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'applyBuff_53' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'changeResource_55' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'applyBuff_56' } },
  ],
  costs: [{ resource: 'sp', value: 100 }],
  timelineBlockFollowUpSkillId: 'chr_0038_purrche_normal_skill_counter',
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: purrchenaChr_0038_purrche_normal_skillActionGraph,
};

export const purrchenaChr_0038_purrche_normal_skill_counterActionGraph = {
  main: {
    nodes: {
      findTargets_1: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'tar',
          },
        },
        next: null,
      },
      finishBuffsById_2: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: [
              'buff_chr_0038_purrche_block_counter',
              'buff_chr_0038_purrche_block_change_skill',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      readBuffStackCount_3: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'block_time',
            query: { kind: 'id', buffIds: ['buff_chr_0038_purrche_block_counter'] },
          },
        },
        next: 'finishBuffsById_2',
      },
      finishBuffsById_4: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0038_purrche_block_counter_mark'],
            reason: 'other',
          },
        },
        next: 'readBuffStackCount_3',
      },
      readBuffStackCount_5: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'is_block',
            query: { kind: 'id', buffIds: ['buff_chr_0038_purrche_block_counter_mark'] },
          },
        },
        next: 'finishBuffsById_4',
      },
      changeResource_7: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_1' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'skill',
          },
        },
        next: null,
      },
      changeResource_8: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_2' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'skill',
          },
        },
        next: 'changeResource_7',
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      startTimeDilation_11: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.7 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      startTimeDilation_10: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.55 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      startTimeDilation_9: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.4 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      switch_12: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_5' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 1 },
              sequence: { $sequence: 'startTimeDilation_9' },
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'startTimeDilation_10' },
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'startTimeDilation_11' },
            },
          ],
        },
        next: null,
      },
      once_14: {
        action: { kind: 'once', parameters: {}, body: { $sequence: 'switch_12' } },
        next: null,
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      ifElse_15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'once_14' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'changeResource_8' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_15',
      },
      dealDamage_17: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_7' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_8' },
          },
        },
        next: 'ifElse_16',
      },
      applyElementalInfliction_18: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'nature', isExtra: false },
        },
        next: 'dealDamage_17',
      },
      once_19: {
        action: { kind: 'once', parameters: {}, body: { $sequence: null } },
        next: 'applyElementalInfliction_18',
      },
      repeatEachTick_20: {
        action: {
          kind: 'repeatEachTick',
          parameters: {
            nativeChanneling: {
              target: { kind: 'fixed', target: 'enemy' },
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: 1,
              targetTriggerIntervalSeconds: 0,
            },
          },
          body: { $sequence: 'once_19' },
        },
        next: null,
      },
      finishBuffsById_21: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: [
              'buff_chr_0038_purrche_aura_block',
              'buff_chr_0038_purrche_block_shelter_down_aura_instance',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_28: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      checkCondition_31: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: null,
      },
      checkCondition_37: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: null,
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_28' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_opt2: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_31' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_opt1' },
        },
        next: null,
      },
      ifElse_opt3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'ifElse_opt2' },
          whenFalse: { $sequence: 'ifElse_opt2' },
        },
        next: null,
      },
      ifElse_opt5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_37' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_opt3' },
        },
        next: null,
      },
      ifElse_opt4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'potential_5_atb' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'is_block', fallback: 0 } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_3' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'block_time' } },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'inputTarget' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'mainCharacter' },
          distance: 8,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'mainCharacter' },
          distance: 4,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_11: { type: 'boolean', expression: { kind: 'casterControlled' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_normal_skill_counter: SkillDefinition = {
  key: 'chr_0038_purrche_normal_skill_counter',
  element: 'nature',
  blackboard: {
    atb_return: 0,
    atk_scale: [1.78, 1.95, 2.13, 2.31, 2.49, 2.66, 2.84, 3.02, 3.2, 3.42, 3.69, 4],
    block_time: 1,
    is_block: 0,
    poise: 20,
    potential_5_atb: 0,
  },
  timelineBlockFrames: 36,
  naturalDurationFrames: 399,
  exclusiveFrame: 35,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 15, endFrame: 45, skillIds: ['chr_0038_purrche_normal_skill'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findTargets_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'readBuffStackCount_5' } },
    { startFrame: 9, endFrame: 13, sequence: { $sequence: 'repeatEachTick_20' } },
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'finishBuffsById_21' } },
    { startFrame: 0, endFrame: 9, sequence: { $sequence: 'ifElse_opt5' } },
    { startFrame: 0, endFrame: 9, sequence: { $sequence: 'ifElse_opt4' } },
  ],
  icon: 'endaxis:operators/purrchena/battle_02',
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: purrchenaChr_0038_purrche_normal_skill_counterActionGraph,
};

export const purrchenaChr_0038_purrche_normal_skill_block_1ActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0038_purrche_aura_block',
            inheritToNextSkillIds: [
              'chr_0038_purrche_normal_skill_block_1',
              'chr_0038_purrche_normal_skill_block_2',
              'chr_0038_purrche_normal_skill_loop_1',
              'chr_0038_purrche_normal_skill_loop_2',
              'chr_0038_purrche_combo_skill',
              'chr_0038_purrche_normal_skill_counter',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_2: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_loop_2',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_2',
      },
      castSkillDuringAction_4: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_2',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_5: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              { buffId: 'buff_chr_0038_purrche_block_counter' },
              { buffId: 'buff_chr_0038_purrche_block_immune_skillfx' },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_4',
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'applyBuff_5',
      },
      castSkillDuringAction_7: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_2',
            target: 'actionInputTarget',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_8: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_7',
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_8',
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'checkCondition_9',
      },
      listenForCombatEvents_11: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_block_1.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_6' },
              },
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_block_1.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_10' },
              },
            ],
          },
        },
        next: null,
      },
      applyBuff_12: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_enter_normal_skill_end' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'applyBuff_12',
      },
      listenForCombatEvents_14: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_block_1.actionGroupData.timelineActions[7]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_13' },
              },
            ],
          },
        },
        next: null,
      },
      castSkillDuringAction_15: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_loop_2',
            target: 'actionInputTarget',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_16: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_enter_normal_skill_end' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_15',
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'applyBuff_16',
      },
      listenForCombatEvents_18: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_block_1.actionGroupData.timelineActions[8]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_17' },
              },
            ],
          },
        },
        next: null,
      },
      castSkillDuringAction_19: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_loop_2',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'castSkillDuringAction_19',
      },
      applyBuff_21: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'checkCondition_20',
      },
      startTimeDilation_22: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.6 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0.000007561175,
                  value: 0.9554025,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0.333333343,
                },
                {
                  time: 0.17689614,
                  value: 0.05861299,
                  inTangent: 3.83089883e-7,
                  outTangent: 3.83089883e-7,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0.333333343,
                },
                {
                  time: 0.8731842,
                  value: 0.0586136,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0.333333343,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 4.596606,
                  outTangent: 4.596606,
                  weightedMode: 0,
                  inWeight: 0.0243593454,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      applyBuff_23: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_pause_block' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      applyBuff_24: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_ult_add_red',
                copiedBlackboardAssignments: { stack: 'talent_1_stack' },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      changeResource_25: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_7' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'default',
          },
        },
        next: 'applyBuff_24',
      },
      changeResource_26: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_8' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'default',
          },
        },
        next: 'changeResource_25',
      },
      changeResource_27: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_9' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: 'changeResource_26',
      },
      applyBuff_28: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_shelter_stay' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageFeaturesMatch',
          match: 'exceptAny',
          features: ['dot', 'remainArea'],
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 3,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_3: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_eny_0018_lbtough_pre_catch'] },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_end'] },
      },
      data_5: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_end'] },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_enter_normal_skill_end'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'potential_5_atb' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return_2' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'talent_1_usp' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_normal_skill_block_1: SkillDefinition = {
  actionGraph: purrchenaChr_0038_purrche_normal_skill_block_1ActionGraph,
  key: 'chr_0038_purrche_normal_skill_block_1',
  element: 'nature',
  blackboard: { atb_return_2: 20, potential_5_atb: 0, talent_1_stack: 0, talent_1_usp: 0 },
  timelineBlockFrames: 26,
  naturalDurationFrames: 25,
  exclusiveFrame: 25,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 0, endFrame: 24, skillIds: ['chr_0038_purrche_normal_skill_counter'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 25, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 23, endFrame: 23, sequence: { $sequence: 'applyBuff_3' } },
    { startFrame: 3, endFrame: 24, sequence: { $sequence: 'listenForCombatEvents_11' } },
    { startFrame: 0, endFrame: 9, sequence: { $sequence: 'listenForCombatEvents_14' } },
    { startFrame: 9, endFrame: 24, sequence: { $sequence: 'listenForCombatEvents_18' } },
    { startFrame: 9, endFrame: 9, sequence: { $sequence: 'applyBuff_21' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'startTimeDilation_22' } },
    { startFrame: 0, endFrame: 9, sequence: { $sequence: 'applyBuff_23' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'changeResource_27' } },
    { startFrame: 0, endFrame: 21, sequence: { $sequence: 'applyBuff_28' } },
  ],
  icon: 'endaxis:operators/purrchena/battle_02',
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'extraActiveSkill',
};

export const purrchenaChr_0038_purrche_normal_skill_block_2ActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0038_purrche_aura_block',
            inheritToNextSkillIds: [
              'chr_0038_purrche_normal_skill_block_1',
              'chr_0038_purrche_normal_skill_block_2',
              'chr_0038_purrche_normal_skill_loop_1',
              'chr_0038_purrche_normal_skill_loop_2',
              'chr_0038_purrche_combo_skill',
              'chr_0038_purrche_normal_skill_counter',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_2: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_loop_2',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_2',
      },
      castSkillDuringAction_4: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_2',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_5: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              { buffId: 'buff_chr_0038_purrche_block_counter' },
              { buffId: 'buff_chr_0038_purrche_block_immune_skillfx' },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_4',
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'applyBuff_5',
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'checkCondition_6',
      },
      castSkillDuringAction_8: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_2',
            target: 'actionInputTarget',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_9: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_8',
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'applyBuff_9',
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_10',
      },
      listenForCombatEvents_12: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_block_2.actionGroupData.timelineActions[7]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_7' },
              },
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_block_2.actionGroupData.timelineActions[7]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_11' },
              },
            ],
          },
        },
        next: null,
      },
      applyBuff_13: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_enter_normal_skill_end' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_14: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'applyBuff_13',
      },
      listenForCombatEvents_15: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_block_2.actionGroupData.timelineActions[8]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_14' },
              },
            ],
          },
        },
        next: null,
      },
      castSkillDuringAction_16: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_loop_2',
            target: 'actionInputTarget',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_17: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_16',
      },
      applyBuff_18: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_enter_normal_skill_end' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'applyBuff_17',
      },
      checkCondition_19: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'applyBuff_18',
      },
      listenForCombatEvents_20: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_block_2.actionGroupData.timelineActions[9]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
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
      castSkillDuringAction_21: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_loop_2',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_22: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_21',
      },
      checkCondition_23: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'applyBuff_22',
      },
      checkCondition_24: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      startTimeDilation_25: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.4 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: -0.003320307,
                  value: 0.06893496,
                  inTangent: 0.002727071,
                  outTangent: 0.002727071,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1933896,
                  value: 0.0694714,
                  inTangent: -0.005988318,
                  outTangent: -0.005988318,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.2475097,
                  value: 0.2076706,
                  inTangent: -0.007820179,
                  outTangent: -0.007820179,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.8658105,
                  value: 0.2205032,
                  inTangent: 0.08536714,
                  outTangent: 0.08536714,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 5.808926,
                  outTangent: 5.808926,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      startTimeDilation_26: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.3 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0.002380371,
                  value: 0.01728821,
                  inTangent: -0.009265231,
                  outTangent: -0.009265231,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1802043,
                  value: 0.02063313,
                  inTangent: -0.1249941,
                  outTangent: -0.1249941,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.307336,
                  value: 0.1805526,
                  inTangent: 0.04394849,
                  outTangent: 0.04394849,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.9206635,
                  value: 0.1941004,
                  inTangent: -0.002866605,
                  outTangent: -0.002866605,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 10.158,
                  outTangent: 10.158,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      ifElse_27: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_24' },
          whenTrue: { $sequence: 'startTimeDilation_25' },
          whenFalse: { $sequence: 'startTimeDilation_26' },
        },
        next: null,
      },
      applyBuff_28: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_pause_block' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
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
          buffIds: ['buff_chr_0038_purrche_aura_block'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageFeaturesMatch',
          match: 'exceptAny',
          features: ['dot', 'remainArea'],
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 3,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_eny_0018_lbtough_pre_catch'] },
      },
      data_5: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_end'] },
      },
      data_6: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_end'] },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_enter_normal_skill_end'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_8: { type: 'boolean', expression: { kind: 'casterControlled' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_normal_skill_block_2: SkillDefinition = {
  key: 'chr_0038_purrche_normal_skill_block_2',
  element: 'physical',
  blackboard: {},
  timelineBlockFrames: 26,
  naturalDurationFrames: 25,
  exclusiveFrame: 25,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 0, endFrame: 25, skillIds: ['chr_0038_purrche_normal_skill_counter'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 25, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 22, endFrame: 22, sequence: { $sequence: 'applyBuff_3' } },
    { startFrame: 2, endFrame: 25, sequence: { $sequence: 'listenForCombatEvents_12' } },
    { startFrame: 0, endFrame: 12, sequence: { $sequence: 'listenForCombatEvents_15' } },
    { startFrame: 12, endFrame: 25, sequence: { $sequence: 'listenForCombatEvents_20' } },
    { startFrame: 12, endFrame: 12, sequence: { $sequence: 'checkCondition_23' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_27' } },
    { startFrame: 0, endFrame: 11, sequence: { $sequence: 'applyBuff_28' } },
  ],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'extraActiveSkill',
  actionGraph: purrchenaChr_0038_purrche_normal_skill_block_2ActionGraph,
};

export const purrchenaChr_0038_purrche_normal_skill_loop_1ActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0038_purrche_aura_block',
            inheritToNextSkillIds: [
              'chr_0038_purrche_normal_skill_block_1',
              'chr_0038_purrche_normal_skill_block_2',
              'chr_0038_purrche_normal_skill_loop_1',
              'chr_0038_purrche_normal_skill_loop_2',
              'chr_0038_purrche_combo_skill',
              'chr_0038_purrche_normal_skill_counter',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      markCurrentSkillCanInterrupt_2: {
        action: { kind: 'markCurrentSkillCanInterrupt', parameters: {} },
        next: null,
      },
      interruptCurrentSkill_3: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      jumpTimeline_opt1: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 360 },
          condition: { $sequence: null },
        },
        next: null,
      },
      finishBuffsById_opt2: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0038_purrche_enter_normal_skill_end'],
            reason: 'other',
          },
        },
        next: 'jumpTimeline_opt1',
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_opt3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'finishBuffsById_opt2' },
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
      ifElse_opt4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'finishBuffsById_opt2' },
          whenFalse: { $sequence: 'ifElse_opt3' },
        },
        next: null,
      },
      finishBuffsById_14: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0038_purrche_loop_anim'],
            reason: 'other',
          },
        },
        next: null,
      },
      finishBuffsById_15: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0038_purrche_combo_anim'],
            reason: 'other',
          },
        },
        next: 'finishBuffsById_14',
      },
      castSkillDuringAction_19: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_1',
            target: 'actionInputTarget',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_20: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_19',
      },
      checkCondition_21: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'applyBuff_20',
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_21',
      },
      castSkillDuringAction_16: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_1',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_17: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              { buffId: 'buff_chr_0038_purrche_block_counter' },
              { buffId: 'buff_chr_0038_purrche_block_immune_skillfx' },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_16',
      },
      checkCondition_18: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'applyBuff_17',
      },
      listenForCombatEvents_23: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_loop_1.actionGroupData.timelineActions[25]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_18' },
              },
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_loop_1.actionGroupData.timelineActions[25]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_22' },
              },
            ],
          },
        },
        next: null,
      },
      checkCondition_opt5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'jumpTimeline_opt1',
      },
      listenForCombatEvents_opt6: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_loop_1.actionGroupData.timelineActions[26]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_opt5' },
              },
            ],
          },
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
          buffIds: ['buff_chr_0038_purrche_aura_block'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_enter_normal_skill_end'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 3,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_eny_0018_lbtough_pre_catch'] },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageFeaturesMatch',
          match: 'exceptAny',
          features: ['dot', 'remainArea'],
        },
      },
      data_6: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_end'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_normal_skill_loop_1: SkillDefinition = {
  key: 'chr_0038_purrche_normal_skill_loop_1',
  element: 'physical',
  blackboard: {},
  timelineBlockFrames: 362,
  naturalDurationFrames: 494,
  exclusiveFrame: 361,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 1, endFrame: 494, skillIds: ['chr_0038_purrche_normal_skill_counter'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 494, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 361, endFrame: 364, sequence: { $sequence: 'markCurrentSkillCanInterrupt_2' } },
    { startFrame: 491, endFrame: 494, sequence: { $sequence: 'interruptCurrentSkill_3' } },
    { startFrame: 675, endFrame: 678, sequence: { $sequence: 'markCurrentSkillCanInterrupt_2' } },
    { startFrame: 738, endFrame: 741, sequence: { $sequence: 'interruptCurrentSkill_3' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'ifElse_opt4' } },
    { startFrame: 1, endFrame: 2, sequence: { $sequence: 'finishBuffsById_15' } },
    { startFrame: 0, endFrame: 360, sequence: { $sequence: 'listenForCombatEvents_23' } },
    { startFrame: 0, endFrame: 360, sequence: { $sequence: 'listenForCombatEvents_opt6' } },
  ],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'extraActiveSkill',
  actionGraph: purrchenaChr_0038_purrche_normal_skill_loop_1ActionGraph,
};

export const purrchenaChr_0038_purrche_normal_skill_loop_2ActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0038_purrche_aura_block',
            inheritToNextSkillIds: [
              'chr_0038_purrche_normal_skill_block_1',
              'chr_0038_purrche_normal_skill_block_2',
              'chr_0038_purrche_normal_skill_loop_1',
              'chr_0038_purrche_normal_skill_loop_2',
              'chr_0038_purrche_combo_skill',
              'chr_0038_purrche_normal_skill_counter',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      markCurrentSkillCanInterrupt_2: {
        action: { kind: 'markCurrentSkillCanInterrupt', parameters: {} },
        next: null,
      },
      jumpTimeline_opt1: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 360 },
          condition: { $sequence: null },
        },
        next: null,
      },
      finishBuffsById_opt2: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0038_purrche_enter_normal_skill_end'],
            reason: 'other',
          },
        },
        next: 'jumpTimeline_opt1',
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_opt3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_3' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'finishBuffsById_opt2' },
        },
        next: null,
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_opt4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'finishBuffsById_opt2' },
          whenFalse: { $sequence: 'ifElse_opt3' },
        },
        next: null,
      },
      finishBuffsById_11: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0038_purrche_loop_anim'],
            reason: 'other',
          },
        },
        next: null,
      },
      finishBuffsById_12: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0038_purrche_combo_anim'],
            reason: 'other',
          },
        },
        next: 'finishBuffsById_11',
      },
      castSkillDuringAction_19: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_2',
            target: 'actionInputTarget',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_20: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_19',
      },
      copyContextTargets_21: {
        action: {
          kind: 'copyContextTargets',
          parameters: { source: { kind: 'inputTarget' }, saveToContextKey: 'Attacker' },
        },
        next: 'applyBuff_20',
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'copyContextTargets_21',
      },
      checkCondition_23: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_22',
      },
      castSkillDuringAction_15: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_2',
            targetContextKey: 'Attacker',
            target: 'context',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      applyBuff_16: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              { buffId: 'buff_chr_0038_purrche_block_counter' },
              { buffId: 'buff_chr_0038_purrche_block_immune_skillfx' },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_15',
      },
      copyContextTargets_17: {
        action: {
          kind: 'copyContextTargets',
          parameters: { source: { kind: 'inputTarget' }, saveToContextKey: 'Attacker' },
        },
        next: 'applyBuff_16',
      },
      checkCondition_18: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'copyContextTargets_17',
      },
      listenForCombatEvents_24: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_loop_2.actionGroupData.timelineActions[18]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_18' },
              },
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_loop_2.actionGroupData.timelineActions[18]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_23' },
              },
            ],
          },
        },
        next: null,
      },
      checkCondition_opt5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'jumpTimeline_opt1',
      },
      listenForCombatEvents_opt6: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_normal_skill_loop_2.actionGroupData.timelineActions[19]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_opt5' },
              },
            ],
          },
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
          buffIds: ['buff_chr_0038_purrche_aura_block'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_enter_normal_skill_end'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 3,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_eny_0018_lbtough_pre_catch'] },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageFeaturesMatch',
          match: 'exceptAny',
          features: ['dot', 'remainArea'],
        },
      },
      data_6: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_end'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_normal_skill_loop_2: SkillDefinition = {
  key: 'chr_0038_purrche_normal_skill_loop_2',
  element: 'physical',
  blackboard: {},
  timelineBlockFrames: 362,
  naturalDurationFrames: 431,
  exclusiveFrame: 361,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 0, endFrame: 431, skillIds: ['chr_0038_purrche_normal_skill_counter'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 431, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 361, endFrame: 364, sequence: { $sequence: 'markCurrentSkillCanInterrupt_2' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'ifElse_opt4' } },
    { startFrame: 1, endFrame: 2, sequence: { $sequence: 'finishBuffsById_12' } },
    { startFrame: 361, endFrame: 362, sequence: { $sequence: 'finishBuffsById_12' } },
    { startFrame: 0, endFrame: 360, sequence: { $sequence: 'listenForCombatEvents_24' } },
    { startFrame: 0, endFrame: 360, sequence: { $sequence: 'listenForCombatEvents_opt6' } },
  ],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'extraActiveSkill',
  actionGraph: purrchenaChr_0038_purrche_normal_skill_loop_2ActionGraph,
};

export const purrchenaChr_0038_purrche_combo_skillActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0038_purrche_aura_block',
            inheritToNextSkillIds: [
              'chr_0038_purrche_normal_skill_block_1',
              'chr_0038_purrche_normal_skill_block_2',
              'chr_0038_purrche_normal_skill_loop_1',
              'chr_0038_purrche_normal_skill_loop_2',
              'chr_0038_purrche_combo_skill',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      inheritBuffById_2: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0038_purrche_aura_block',
            inheritToNextSkillIds: [
              'chr_0038_purrche_normal_skill_block_1',
              'chr_0038_purrche_normal_skill_block_2',
              'chr_0038_purrche_normal_skill_loop_1',
              'chr_0038_purrche_normal_skill_loop_2',
              'chr_0038_purrche_combo_skill',
              'chr_0038_purrche_normal_skill_counter',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      findCharacterTeamTargets_4: {
        action: {
          kind: 'findCharacterTeamTargets',
          parameters: { saveToContextKey: 'box_pos', selection: { kind: 'controlledOperator' } },
        },
        next: null,
      },
      findTargets_5: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'main_tar',
          },
        },
        next: 'findCharacterTeamTargets_4',
      },
      jumpTimeline_8: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 210 },
          condition: { $sequence: null },
        },
        next: null,
      },
      jumpTimeline_7: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 270 },
          condition: { $sequence: null },
        },
        next: null,
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'jumpTimeline_7' },
          whenFalse: { $sequence: 'jumpTimeline_8' },
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
      ifElse_11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_10' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      finishBuffsById_12: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0038_purrche_loop_anim', 'buff_chr_0038_purrche_combo_anim'],
            reason: 'other',
          },
        },
        next: 'ifElse_11',
      },
      markCurrentSkillCanInterrupt_13: {
        action: { kind: 'markCurrentSkillCanInterrupt', parameters: {} },
        next: null,
      },
      interruptCurrentSkill_14: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      castSkillDuringAction_15: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_loop_1',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_16: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_15',
      },
      castSkillDuringAction_17: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_loop_2',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_18: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_17',
      },
      ifElse_20: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_94: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_combo_lasttype',
                copiedBlackboardAssignments: { combotype: 'comboType_last' },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      modifyActionValue_95: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType_last',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_3' },
          },
        },
        next: 'applyBuff_94',
      },
      modifyActionValue_91: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType',
            operation: 'assign',
            value: { kind: 'constant', value: 2 },
          },
        },
        next: 'modifyActionValue_95',
      },
      modifyActionValue_88: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_95',
      },
      checkCondition_85: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_93: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_85' },
          whenTrue: { $sequence: 'modifyActionValue_88' },
          whenFalse: { $sequence: 'modifyActionValue_91' },
        },
        next: null,
      },
      checkCondition_92: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      ifElse_99: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_92' },
          whenTrue: { $sequence: 'ifElse_93' },
          whenFalse: { $sequence: 'modifyActionValue_95' },
        },
        next: null,
      },
      modifyActionValue_100: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType',
            operation: 'assign',
            value: { kind: 'constant', value: 3 },
          },
        },
        next: 'ifElse_99',
      },
      modifyActionValue_80: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType',
            operation: 'assign',
            value: { kind: 'constant', value: 3 },
          },
        },
        next: 'modifyActionValue_95',
      },
      ifElse_82: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_85' },
          whenTrue: { $sequence: 'modifyActionValue_88' },
          whenFalse: { $sequence: 'modifyActionValue_80' },
        },
        next: null,
      },
      ifElse_97: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_92' },
          whenTrue: { $sequence: 'ifElse_82' },
          whenFalse: { $sequence: 'modifyActionValue_95' },
        },
        next: null,
      },
      modifyActionValue_98: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType',
            operation: 'assign',
            value: { kind: 'constant', value: 2 },
          },
        },
        next: 'ifElse_97',
      },
      ifElse_104: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_85' },
          whenTrue: { $sequence: 'modifyActionValue_98' },
          whenFalse: { $sequence: 'modifyActionValue_100' },
        },
        next: null,
      },
      ifElse_71: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_85' },
          whenTrue: { $sequence: 'modifyActionValue_91' },
          whenFalse: { $sequence: 'modifyActionValue_80' },
        },
        next: null,
      },
      ifElse_102: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_92' },
          whenTrue: { $sequence: 'ifElse_71' },
          whenFalse: { $sequence: 'modifyActionValue_95' },
        },
        next: null,
      },
      modifyActionValue_103: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_102',
      },
      checkCondition_101: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      ifElse_108: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_101' },
          whenTrue: { $sequence: 'modifyActionValue_103' },
          whenFalse: { $sequence: 'ifElse_104' },
        },
        next: null,
      },
      applyBuff_109: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_combo_lasttype' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'ifElse_108',
      },
      readBuffBlackboard_107: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0038_purrche_combo_lasttype'] },
            desiredKey: 'combotype',
            outputKey: 'comboType_last',
          },
        },
        next: 'ifElse_108',
      },
      checkCondition_105: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      ifElse_110: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_105' },
          whenTrue: { $sequence: 'readBuffBlackboard_107' },
          whenFalse: { $sequence: 'applyBuff_109' },
        },
        next: null,
      },
      modifyActionValue_112: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType',
            operation: 'assign',
            value: { kind: 'constant', value: 3 },
          },
        },
        next: null,
      },
      checkCondition_111: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: null,
      },
      ifElse_115: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_111' },
          whenTrue: { $sequence: 'modifyActionValue_112' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_114: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType',
            operation: 'assign',
            value: { kind: 'constant', value: 2 },
          },
        },
        next: null,
      },
      checkCondition_113: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: null,
      },
      ifElse_118: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_113' },
          whenTrue: { $sequence: 'modifyActionValue_114' },
          whenFalse: { $sequence: 'ifElse_115' },
        },
        next: null,
      },
      modifyActionValue_117: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'comboType',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      checkCondition_116: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      ifElse_119: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_116' },
          whenTrue: { $sequence: 'modifyActionValue_117' },
          whenFalse: { $sequence: 'ifElse_118' },
        },
        next: null,
      },
      launchProjectile_122: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            syncTimeScale: true,
            recycleDelaySeconds: 0.0666666701436043,
            hit: { onReach: true, target: 'controlledOperator', finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0038_purrche_combo_skill_gene',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 2,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atk_scale_blackhole_dot: 0,
                  atk_scale_blackhole_end: 0.1,
                  atk_scale_boom: 1,
                  comboType: 0,
                  duration: 0,
                  poise: 15,
                  usp: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'spawnAbilityEntity_1' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      spawnAbilityEntity_1: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'context', key: 'pos' },
                            abilityEntityId: 'abilityentity_chr_0038_purrche_combo',
                            childSkillId: 'chr_0038_purrche_combo_skill_giftbox_abilityrange',
                            inheritActionBlackboard: true,
                            dieWhenSourceDies: false,
                          },
                        },
                        next: null,
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
      startTimeDilation_316: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.667 },
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
      startTimeDilation_317: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.6 },
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
      startTimeDilation_318: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
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
      castSkillDuringAction_322: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_1',
            target: 'actionInputTarget',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_323: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_immune_skillfx' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_322',
      },
      applyBuff_324: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_counter' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'applyBuff_323',
      },
      checkCondition_325: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_13' } },
        },
        next: 'applyBuff_324',
      },
      checkCondition_326: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
        },
        next: 'checkCondition_325',
      },
      castSkillDuringAction_319: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_1',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_320: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              { buffId: 'buff_chr_0038_purrche_block_counter' },
              { buffId: 'buff_chr_0038_purrche_block_counter_mark' },
              { buffId: 'buff_chr_0038_purrche_block_immune_skillfx' },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_319',
      },
      checkCondition_321: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
        },
        next: 'applyBuff_320',
      },
      listenForCombatEvents_327: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_combo_skill.actionGroupData.timelineActions[49]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_321' },
              },
              {
                key: 'SkillData.chr_0038_purrche_combo_skill.actionGroupData.timelineActions[49]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_326' },
              },
            ],
          },
        },
        next: null,
      },
      castSkillDuringAction_331: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_2',
            target: 'actionInputTarget',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_332: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              { buffId: 'buff_chr_0038_purrche_combo_to_normal_skill_hit' },
              { buffId: 'buff_chr_0038_purrche_block_immune_skillfx' },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_331',
      },
      applyBuff_333: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_counter' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'applyBuff_332',
      },
      checkCondition_334: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
        },
        next: 'applyBuff_333',
      },
      checkCondition_335: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_17' } },
        },
        next: 'checkCondition_334',
      },
      castSkillDuringAction_328: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0038_purrche_normal_skill_block_2',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      applyBuff_329: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              { buffId: 'buff_chr_0038_purrche_block_counter' },
              { buffId: 'buff_chr_0038_purrche_block_counter_mark' },
              { buffId: 'buff_chr_0038_purrche_block_immune_skillfx' },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'castSkillDuringAction_328',
      },
      checkCondition_330: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_18' } },
        },
        next: 'applyBuff_329',
      },
      listenForCombatEvents_336: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_combo_skill.actionGroupData.timelineActions[50]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_330' },
              },
              {
                key: 'SkillData.chr_0038_purrche_combo_skill.actionGroupData.timelineActions[50]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_335' },
              },
            ],
          },
        },
        next: null,
      },
      applyBuff_337: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_enter_normal_skill_end' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_338: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
        },
        next: 'applyBuff_337',
      },
      listenForCombatEvents_339: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_combo_skill.actionGroupData.timelineActions[51]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_338' },
              },
            ],
          },
        },
        next: null,
      },
      listenForCombatEvents_342: {
        action: {
          kind: 'listenForCombatEvents',
          parameters: {
            responses: [
              {
                key: 'SkillData.chr_0038_purrche_combo_skill.actionGroupData.timelineActions[52]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'abilityEvent', event: 'addedBuff' },
                phase: 'dataAction',
                priority: 0,
                sequence: { $sequence: 'checkCondition_338' },
              },
            ],
          },
        },
        next: null,
      },
      applyBuff_343: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_pause_block' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_122' },
          whenFalse: { $sequence: 'launchProjectile_122' },
        },
        next: null,
      },
      ifElse_opt2: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
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
          buffIds: ['buff_chr_0038_purrche_block_counter'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 2 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_aura_block'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'comboType' } },
      data_4: {
        type: 'boolean',
        expression: { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
      },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'comboType', fallback: 0 } },
      data_6: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'comboType_last', fallback: 0 },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_5' },
          operator: 'equal',
          right: { kind: 'valueNode', nodeId: 'data_6' },
        },
      },
      data_8: {
        type: 'boolean',
        expression: { kind: 'probability', probability: { kind: 'constant', value: 0.3333 } },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_combo_lasttype'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_combo_always_fish'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_combo_always_bomb'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_combo_always_black_hole'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_13: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 3,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_14: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_eny_0018_lbtough_pre_catch'] },
      },
      data_15: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageFeaturesMatch',
          match: 'exceptAny',
          features: ['dot', 'remainArea'],
        },
      },
      data_16: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 3,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_17: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_eny_0018_lbtough_pre_catch'] },
      },
      data_18: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageFeaturesMatch',
          match: 'exceptAny',
          features: ['dot', 'remainArea'],
        },
      },
      data_19: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_end'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_combo_skill: SkillDefinition = {
  key: 'chr_0038_purrche_combo_skill',
  element: 'physical',
  blackboard: {
    atk_scale_blackhole_dot: [
      0.11, 0.12, 0.13, 0.14, 0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.23, 0.25,
    ],
    atk_scale_blackhole_end: [0.22, 0.24, 0.27, 0.29, 0.31, 0.33, 0.36, 0.38, 0.4, 0.43, 0.46, 0.5],
    atk_scale_boom: [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    comboType: 1,
    comboType_last: 0,
    heal_scale: [0.5, 0.6, 0.71, 0.81, 0.86, 0.91, 0.96, 1.01, 1.06, 1.08, 1.11, 1.13],
    heal_scale_fish: [0.34, 0.4, 0.47, 0.54, 0.57, 0.6, 0.64, 0.67, 0.71, 0.72, 0.74, 0.76],
    heal_static_value: [
      216, 259.2, 302.4, 345.6, 367.2, 388.8, 410.4, 432, 453.6, 464.4, 475.2, 486,
    ],
    heal_static_value_fish: [
      144, 172.8, 201.6, 230.4, 244.8, 259.2, 273.6, 288, 302.4, 309.6, 316.8, 324,
    ],
    owner_mainchar_distance: 0,
    poise: 10,
    potential_3: 0,
    radiusadd_display: 0,
    usp: 10,
  },
  timelineBlockFrames: 28,
  naturalDurationFrames: 330,
  exclusiveFrame: 330,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 26,
        endFrame: 75,
        skillIds: ['chr_0038_purrche_normal_skill_counter', 'chr_0038_purrche_normal_skill'],
      },
      { startFrame: 221, endFrame: 251, skillIds: ['chr_0038_purrche_normal_skill_counter'] },
      { startFrame: 281, endFrame: 310, skillIds: ['chr_0038_purrche_normal_skill_counter'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 332, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 210, endFrame: 251, sequence: { $sequence: 'inheritBuffById_2' } },
    { startFrame: 270, endFrame: 310, sequence: { $sequence: 'inheritBuffById_2' } },
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'findTargets_5' } },
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'finishBuffsById_12' } },
    { startFrame: 28, endFrame: 28, sequence: { $sequence: 'markCurrentSkillCanInterrupt_13' } },
    { startFrame: 206, endFrame: 206, sequence: { $sequence: 'interruptCurrentSkill_14' } },
    { startFrame: 250, endFrame: 250, sequence: { $sequence: 'applyBuff_16' } },
    { startFrame: 309, endFrame: 309, sequence: { $sequence: 'applyBuff_18' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 1, endFrame: 1, sequence: { $sequence: 'ifElse_110' } },
    { startFrame: 2, endFrame: 2, sequence: { $sequence: 'ifElse_119' } },
    { startFrame: 17, endFrame: 20, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 211, endFrame: 211, sequence: { $sequence: 'ifElse_110' } },
    { startFrame: 221, endFrame: 224, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 271, endFrame: 271, sequence: { $sequence: 'ifElse_110' } },
    { startFrame: 281, endFrame: 284, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 0, endFrame: 15, sequence: { $sequence: 'ifElse_opt2' } },
    { startFrame: 0, endFrame: 17, sequence: { $sequence: 'startTimeDilation_316' } },
    { startFrame: 210, endFrame: 225, sequence: { $sequence: 'startTimeDilation_317' } },
    { startFrame: 270, endFrame: 282, sequence: { $sequence: 'startTimeDilation_318' } },
    { startFrame: 221, endFrame: 251, sequence: { $sequence: 'listenForCombatEvents_327' } },
    { startFrame: 281, endFrame: 310, sequence: { $sequence: 'listenForCombatEvents_336' } },
    { startFrame: 210, endFrame: 251, sequence: { $sequence: 'listenForCombatEvents_339' } },
    { startFrame: 270, endFrame: 310, sequence: { $sequence: 'listenForCombatEvents_342' } },
    { startFrame: 210, endFrame: 251, sequence: { $sequence: 'applyBuff_343' } },
    { startFrame: 270, endFrame: 310, sequence: { $sequence: 'applyBuff_343' } },
  ],
  cooldownFrames: [720, 720, 720, 720, 720, 720, 720, 720, 690, 690, 690, 660],
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'comboSkill',
  actionGraph: purrchenaChr_0038_purrche_combo_skillActionGraph,
};

export const purrchenaChr_0038_purrche_ultimate_skillActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_pause_change_skill_buff' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      findTargets_3: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: 'findTargets_3',
      },
      modifyActionValue_8: {
        action: {
          kind: 'modifyActionValue',
          parameters: { key: 'box_num', operation: 'add', value: { kind: 'constant', value: 1 } },
        },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      modifyActionValue_14: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'box_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      modifyActionValue_16: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'box_num',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
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
      modifyActionValue_18: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'box_num',
            operation: 'assign',
            value: { kind: 'constant', value: 3 },
          },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      modifyActionValue_20: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'normal_boom_prob',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      modifyActionValue_21: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'box_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'modifyActionValue_20',
      },
      checkCondition_19: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      modifyActionValue_23: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'normal_boom_prob',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      modifyActionValue_24: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'box_num',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_23',
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      modifyActionValue_27: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'box_num',
            operation: 'assign',
            value: { kind: 'constant', value: 2 },
          },
        },
        next: 'modifyActionValue_23',
      },
      checkCondition_25: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      finishBuffsById_28: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0038_purrche_ult_add_red'],
            reason: 'other',
          },
        },
        next: null,
      },
      ifElse_29: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_25' },
          whenTrue: { $sequence: 'modifyActionValue_27' },
          whenFalse: { $sequence: null },
        },
        next: 'finishBuffsById_28',
      },
      ifElse_30: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_22' },
          whenTrue: { $sequence: 'modifyActionValue_24' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_29',
      },
      ifElse_31: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_19' },
          whenTrue: { $sequence: 'modifyActionValue_21' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_30',
      },
      ifElse_32: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'modifyActionValue_18' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_31',
      },
      ifElse_33: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_15' },
          whenTrue: { $sequence: 'modifyActionValue_16' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_32',
      },
      ifElse_34: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'modifyActionValue_14' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_33',
      },
      ifElse_35: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'modifyActionValue_8' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_34',
      },
      ifElse_36: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'modifyActionValue_8' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_35',
      },
      ifElse_37: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'modifyActionValue_8' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_36',
      },
      calculateActionValue_38: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'prob',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_9' },
            right: { kind: 'valueNode', nodeId: 'data_10' },
          },
        },
        next: 'ifElse_37',
      },
      calculateActionValue_39: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'add_prob',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_11' },
            right: { kind: 'valueNode', nodeId: 'data_12' },
          },
        },
        next: 'calculateActionValue_38',
      },
      readBuffStackCount_40: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'skill_defend_count',
            query: { kind: 'id', buffIds: ['buff_chr_0038_purrche_ult_add_red'] },
          },
        },
        next: 'calculateActionValue_39',
      },
      startTimeDilation_41: {
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
      launchProjectile_98: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.466666668653488,
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0038_purrche_ult_skill_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 14,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atk_scale: 1,
                  atk_scale_ult: 4,
                  duration: 0,
                  duration_vul: 0,
                  poise_2: 10,
                  rate_vul: 0,
                  stack: 0,
                  usp: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'applyBuff_2' } },
                  { startFrame: 2, endFrame: 2, sequence: { $sequence: 'startTimeDilation_5' } },
                  { startFrame: 6, endFrame: 6, sequence: { $sequence: 'startTimeDilation_8' } },
                  { startFrame: 0, endFrame: 44, sequence: { $sequence: null } },
                  { startFrame: 2, endFrame: 2, sequence: { $sequence: null } },
                  { startFrame: 7, endFrame: 7, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 15, sequence: { $sequence: null } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'physical',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['ultimateSkill'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
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
                                buffId: 'buff_chr_0038_purrche_ult_spell_vulnerable',
                                copiedBlackboardAssignments: {
                                  duration_vul: 'duration_vul',
                                  rate: 'rate_vul',
                                },
                              },
                            ],
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: 'dealDamage_1',
                      },
                      startTimeDilation_3: {
                        action: {
                          kind: 'startTimeDilation',
                          parameters: {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.034 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: {
                              kind: 'inline',
                              keys: [
                                {
                                  time: -0.002857149,
                                  value: 0.07730663,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 0.9971429,
                                  value: 0.07730663,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                              ],
                            },
                            finishByAction: false,
                            targets: ['caster'],
                            abilityEntityTargets: [{ kind: 'context', contextKey: 'projectile' }],
                          },
                        },
                        next: null,
                      },
                      findTargets_4: {
                        action: {
                          kind: 'findTargets',
                          parameters: {
                            owner: { kind: 'owner' },
                            query: { kind: 'unfinishedProjectiles' },
                            saveToContextKey: 'projectile',
                          },
                        },
                        next: 'startTimeDilation_3',
                      },
                      startTimeDilation_5: {
                        action: {
                          kind: 'startTimeDilation',
                          parameters: {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.034 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: {
                              kind: 'inline',
                              keys: [
                                {
                                  time: -0.002857149,
                                  value: 0.07730663,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 0.9971429,
                                  value: 0.07730663,
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
                          },
                        },
                        next: 'findTargets_4',
                      },
                      startTimeDilation_6: {
                        action: {
                          kind: 'startTimeDilation',
                          parameters: {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.0667 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: {
                              kind: 'inline',
                              keys: [
                                {
                                  time: -0.005714298,
                                  value: 0.0488777,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 0.9942858,
                                  value: 0.0488777,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                              ],
                            },
                            finishByAction: false,
                            targets: [],
                            abilityEntityTargets: [{ kind: 'context', contextKey: 'projectile' }],
                          },
                        },
                        next: null,
                      },
                      findTargets_7: {
                        action: {
                          kind: 'findTargets',
                          parameters: {
                            owner: { kind: 'owner' },
                            query: { kind: 'unfinishedProjectiles' },
                            saveToContextKey: 'projectile',
                          },
                        },
                        next: 'startTimeDilation_6',
                      },
                      startTimeDilation_8: {
                        action: {
                          kind: 'startTimeDilation',
                          parameters: {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.0667 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: {
                              kind: 'inline',
                              keys: [
                                {
                                  time: 0.002857089,
                                  value: 0.05236897,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 1.002857,
                                  value: 0.05236897,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                              ],
                            },
                            finishByAction: false,
                            targets: ['enemy'],
                            abilityEntityTargets: [{ kind: 'current' }],
                          },
                        },
                        next: 'findTargets_7',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_ult' },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'poise_2' },
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
      launchProjectile_93: {
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
                skillId: 'chr_0038_purrche_ult_skill_normal_bomb_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 1, duration: 0, poise_1: 5, stack: 0, usp: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_1' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 14, sequence: { $sequence: null } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'physical',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['ultimateSkill'],
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
                        expression: { kind: 'blackboard', key: 'poise_1' },
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
      modifyActionValue_91: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'black_hole_count',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      launchProjectile_92: {
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
                skillId: 'chr_0038_purrche_ult_skill_normal_blackhole_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atk_scale: 1,
                  atk_scale_blackhole_dot: 0,
                  atk_scale_blackhole_end: 0,
                  duration: 0,
                  poise_1: 15,
                  stack: 0,
                  usp: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'spawnAbilityEntity_1' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      spawnAbilityEntity_1: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'owner' },
                            abilityEntityId: 'abilityentity_chr_0038_purrche_combo_item_1',
                            childSkillId: 'chr_0038_purrche_ultimate_skill_abilityrange_blackhole',
                            inheritActionBlackboard: true,
                            dieWhenSourceDies: false,
                          },
                        },
                        next: null,
                      },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: 'modifyActionValue_91',
      },
      checkCondition_90: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
        },
        next: null,
      },
      ifElse_96: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_90' },
          whenTrue: { $sequence: 'launchProjectile_92' },
          whenFalse: { $sequence: 'launchProjectile_93' },
        },
        next: null,
      },
      checkCondition_94: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
        },
        next: null,
      },
      ifElse_97: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_94' },
          whenTrue: { $sequence: 'launchProjectile_93' },
          whenFalse: { $sequence: 'ifElse_96' },
        },
        next: null,
      },
      switch_101: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_17' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'launchProjectile_98' },
            },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: 'ifElse_97' } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'ifElse_97' } },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'launchProjectile_98' },
            },
          ],
        },
        next: null,
      },
      switch_79: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_18' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'launchProjectile_98' },
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'launchProjectile_98' },
            },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: 'ifElse_97' } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'ifElse_97' } },
          ],
        },
        next: null,
      },
      checkCondition_78: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
        },
        next: null,
      },
      ifElse_100: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_78' },
          whenTrue: { $sequence: 'switch_79' },
          whenFalse: { $sequence: 'switch_101' },
        },
        next: null,
      },
      checkCondition_99: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_20' } },
        },
        next: null,
      },
      ifElse_102: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_99' },
          whenTrue: { $sequence: 'ifElse_100' },
          whenFalse: { $sequence: 'switch_101' },
        },
        next: null,
      },
      findTargets_103: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'Main_tar',
          },
        },
        next: 'ifElse_102',
      },
      switch_115: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_21' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 1 },
              sequence: { $sequence: 'launchProjectile_98' },
            },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: 'ifElse_97' } },
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'launchProjectile_98' },
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'launchProjectile_98' },
            },
          ],
        },
        next: null,
      },
      ifElse_116: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'switch_115' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_117: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'ifElse_116' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      findTargets_118: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'Main_tar',
          },
        },
        next: 'ifElse_117',
      },
      switch_144: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_22' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'launchProjectile_98' },
            },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: 'ifElse_97' } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'ifElse_97' } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: 'ifElse_97' } },
          ],
        },
        next: null,
      },
      ifElse_145: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'switch_144' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_146: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'ifElse_145' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      findTargets_147: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'Main_tar',
          },
        },
        next: 'ifElse_146',
      },
      startTimeDilation_148: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 2.3 },
            slot: 'unassigned',
            priority: 100,
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
                  outWeight: 0.333333343,
                },
                {
                  time: 1,
                  value: 0,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: true,
            ignoredTargets: ['caster'],
          },
        },
        next: null,
      },
      hideUi_149: { action: { kind: 'hideUi', parameters: { onlyBlockInput: false } }, next: null },
      checkCondition_150: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_24' } },
        },
        next: null,
      },
      jumpTimeline_151: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 68 },
          condition: { $sequence: 'checkCondition_150' },
        },
        next: null,
      },
      jumpTimeline_152: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 135 },
          condition: { $sequence: null },
        },
        next: null,
      },
      applyBuff_153: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_damage_immune_ult_skill' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'prob' } },
      data_2: {
        type: 'boolean',
        expression: { kind: 'probability', probability: { kind: 'valueNode', nodeId: 'data_1' } },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_train_ult_always3y'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_train_ult_always2y1r'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_perform_test_always3r'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_perform_test_always3boom'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_perform_test_always1r1b1h'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0038_purrche_perform_test_always2r1h'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'prob' } },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'add_prob' } },
      data_11: { type: 'number', expression: { kind: 'blackboard', key: 'skill_defend_count' } },
      data_12: { type: 'number', expression: { kind: 'blackboard', key: 'talent1_prob_up' } },
      data_13: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'black_hole_count', fallback: 0 },
      },
      data_14: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_13' },
          operator: 'less',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_15: { type: 'number', expression: { kind: 'blackboard', key: 'normal_boom_prob' } },
      data_16: {
        type: 'boolean',
        expression: { kind: 'probability', probability: { kind: 'valueNode', nodeId: 'data_15' } },
      },
      data_17: { type: 'number', expression: { kind: 'blackboard', key: 'box_num' } },
      data_18: { type: 'number', expression: { kind: 'blackboard', key: 'box_num' } },
      data_19: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'mainCharacter' },
          target: { kind: 'fixed', target: 'enemy' },
          distance: 12,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_20: {
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
      data_21: { type: 'number', expression: { kind: 'blackboard', key: 'box_num' } },
      data_22: { type: 'number', expression: { kind: 'blackboard', key: 'box_num' } },
      data_23: { type: 'number', expression: { kind: 'blackboard', key: 'box_num', fallback: 0 } },
      data_24: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_23' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaChr_0038_purrche_ultimate_skill: SkillDefinition = {
  key: 'chr_0038_purrche_ultimate_skill',
  element: 'physical',
  blackboard: {
    add_prob: 0,
    atk_scale: [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    atk_scale_blackhole_dot: [
      0.11, 0.12, 0.13, 0.14, 0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.23, 0.25,
    ],
    atk_scale_blackhole_end: [0.22, 0.24, 0.27, 0.29, 0.31, 0.33, 0.36, 0.38, 0.4, 0.43, 0.46, 0.5],
    atk_scale_ult: [2.67, 2.93, 3.2, 3.47, 3.73, 4, 4.27, 4.53, 4.8, 5.13, 5.53, 6],
    black_hole_count: 0,
    box_num: 0,
    duration_vul: 5,
    normal_boom_prob: 0.5,
    poise_1: 10,
    poise_2: 15,
    prob: [0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.18, 0.18, 0.18, 0.2],
    rate_vul: [0.015, 0.015, 0.015, 0.015, 0.015, 0.015, 0.015, 0.015, 0.02, 0.02, 0.02, 0.025],
    skill_defend_count: 0,
    talent1_prob_up: 0,
  },
  timelineBlockFrames: 158,
  naturalDurationFrames: 262,
  exclusiveFrame: 157,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 146,
        endFrame: 180,
        skillIds: ['chr_0038_purrche_combo_skill', 'chr_0038_purrche_normal_skill'],
      },
      { startFrame: 146, endFrame: 180, skillIds: ['chr_0038_purrche_normal_skill_counter'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 1, endFrame: 143, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 69, endFrame: 143, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 1, endFrame: 6, sequence: { $sequence: 'checkCondition_4' } },
    { startFrame: 68, endFrame: 71, sequence: { $sequence: 'checkCondition_4' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'readBuffStackCount_40' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'startTimeDilation_41' } },
    { startFrame: 138, endFrame: 139, sequence: { $sequence: 'findTargets_103' } },
    { startFrame: 138, endFrame: 139, sequence: { $sequence: 'findTargets_118' } },
    { startFrame: 138, endFrame: 139, sequence: { $sequence: 'findTargets_147' } },
    { startFrame: 0, endFrame: 135, sequence: { $sequence: 'startTimeDilation_148' } },
    { startFrame: 0, endFrame: 135, sequence: { $sequence: 'hideUi_149' } },
    { startFrame: 0, endFrame: 2, sequence: { $sequence: 'jumpTimeline_151' } },
    { startFrame: 67, endFrame: 67, sequence: { $sequence: 'jumpTimeline_152' } },
    { startFrame: 0, endFrame: 157, sequence: { $sequence: 'applyBuff_153' } },
    { startFrame: 68, endFrame: 157, sequence: { $sequence: 'applyBuff_153' } },
  ],
  cooldownFrames: 600,
  costs: [{ resource: 'ultimateEnergy', value: 100 }],
  skillType: 'ultimate',
  levelSource: 'ultimate',
  nativeSkillType: 'ultimateSkill',
  actionGraph: purrchenaChr_0038_purrche_ultimate_skillActionGraph,
};

export const purrchenaCommon_character_perfect_dodgeActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const purrchenaCommon_character_perfect_dodge: SkillDefinition = {
  actionGraph: purrchenaCommon_character_perfect_dodgeActionGraph,
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

const purrchenaPassive1ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_talent_2',
                blackboardAssignments: {
                  cd: { kind: 'valueNode', nodeId: 'data_1' },
                  dmg_down: { kind: 'valueNode', nodeId: 'data_2' },
                },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'cd' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_down' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaPassive1: OperatorPassiveSkillDefinition = {
  key: 'chr_0038_purrche_talent_2',
  blackboard: { cd: [180, 90], dmg_down: [0.5, 0.5] },
  enableSequence: { $sequence: 'applyBuff_1' },
  actionGraph: purrchenaPassive1ActionGraph,
};

const purrchenaComboCondition1ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetIdentityMatch',
          contextKey: 'trigger',
          other: 'controlledOperator',
          operator: 'equal',
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaComboCondition1: ComboSkillConditionDefinition = {
  key: 'native-combo:0',
  skillKey: 'chr_0038_purrche_combo_skill',
  event: 'takeDamage',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'checkCondition_1' },
  actionGraph: purrchenaComboCondition1ActionGraph,
};

const purrchenaBuff1ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_block',
                copiedBlackboardAssignments: {
                  dmg_taken_down_1: 'dmg_taken_down_1',
                  dmg_taken_down_2: 'dmg_taken_down_2',
                  dmg_taken_down_3: 'dmg_taken_down_3',
                  dmg_taken_down_4: 'dmg_taken_down_4',
                },
              },
            ],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_end' }],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      finishBuffsById_3: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: [
              'buff_chr_0038_purrche_block_shelter_down',
              'buff_chr_0038_purrche_block_shelter_down_count',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      finishBuffsById_4: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0038_purrche_block_counter'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'finishBuffsById_4',
      },
      withActionBlackboardScope_24: {
        action: {
          kind: 'withActionBlackboardScope',
          parameters: {
            scopeKey: 'native-buff-callback:2',
            lifetime: 'execution',
            alwaysNext: true,
            shareParentBlackboard: true,
            initialValues: {},
            inheritParent: true,
          },
          body: { $sequence: 'checkCondition_5' },
        },
        next: null,
      },
      withActionBlackboardScope_25: {
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
          body: { $sequence: 'finishBuffsById_3' },
        },
        next: 'withActionBlackboardScope_24',
      },
      withActionBlackboardScope_26: {
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
          body: { $sequence: 'applyBuff_2' },
        },
        next: 'withActionBlackboardScope_25',
      },
      setCurrentBuffTimePaused_6: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: false } },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'setCurrentBuffTimePaused_6',
      },
      setCurrentBuffTimePaused_8: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: true } },
        next: null,
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'setCurrentBuffTimePaused_8',
      },
      finishBuffsById_10: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0038_purrche_aura_block'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'finishBuffsById_10',
      },
      finishCurrentBuff_14: {
        action: {
          kind: 'finishCurrentBuff',
          parameters: { reason: 'other', finishSource: 'actionSource' },
        },
        next: null,
      },
      checkCondition_15: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'finishCurrentBuff_14',
      },
      modifyActionValue_16: {
        action: {
          kind: 'modifyActionValue',
          parameters: { key: 'count', operation: 'assign', value: { kind: 'constant', value: 1 } },
        },
        next: null,
      },
      setCurrentBuffRemainingDuration_17: {
        action: {
          kind: 'setCurrentBuffRemainingDuration',
          parameters: {
            operation: 'assign',
            value: { kind: 'constant', value: 3 },
            target: 'eventTarget',
          },
        },
        next: 'modifyActionValue_16',
      },
      checkCondition_18: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'setCurrentBuffRemainingDuration_17',
      },
      checkCondition_19: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: 'checkCondition_18',
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: 'checkCondition_19',
      },
      applyBuff_21: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_shelter_down' }],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: 'applyBuff_21',
      },
      checkCondition_23: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: 'checkCondition_22',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0038_purrche_block_change_skill'],
          operator: 'less',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_pause_block'] },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'eventSkillIdIn',
          skillIds: [
            'chr_0038_purrche_normal_skill_block_1',
            'chr_0038_purrche_normal_skill_block_2',
            'chr_0038_purrche_combo_skill',
          ],
        },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_common_dash'] },
      },
      data_5: {
        type: 'boolean',
        expression: { kind: 'eventSkillTypeIn', skillTypes: ['ultimate'] },
      },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'count', fallback: 0 } },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_6' },
          operator: 'equal',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'actionInputTarget',
          buffIds: ['buff_chr_0038_purrche_block_counter'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 2 },
        },
      },
      data_9: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_counter'] },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0038_purrche_block_counter'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 2 },
        },
      },
      data_11: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_block_counter'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff1: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: {
    count: 0,
    dmg_taken_down_1: 0.9,
    dmg_taken_down_2: 0.7,
    dmg_taken_down_3: 0.5,
    dmg_taken_down_4: 0.3,
    duration: 3,
    hit: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: {
    enable: { $sequence: 'applyBuff_1' },
    finish: { $sequence: 'withActionBlackboardScope_26' },
  },
  abilityEventResponses: [
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_7' } },
    { event: 'beforeCastSkill', priority: 0, sequence: { $sequence: 'checkCondition_9' } },
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'checkCondition_11' } },
    { event: 'ownerSwitchToGuard', priority: 0, sequence: { $sequence: 'finishBuffsById_10' } },
    { event: 'ownerSwitchToCenter', priority: 0, sequence: { $sequence: 'finishBuffsById_10' } },
    { event: 'beforeCastSkill', priority: 0, sequence: { $sequence: 'checkCondition_15' } },
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'checkCondition_20' } },
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'checkCondition_23' } },
  ],
  actionGraph: purrchenaBuff1ActionGraph,
};

const purrchenaBuff2ActionGraph = {
  main: {
    nodes: {
      modifyActionValue_1: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'dmg_taken_down',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: null,
      },
      modifyActionValue_2: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'dmg_taken_down',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: null,
      },
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'dmg_taken_down',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_3' },
          },
        },
        next: null,
      },
      modifyActionValue_4: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'dmg_taken_down',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_4' },
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
                buffId: 'buff_chr_0038_purrche_block_instance_aura',
                copiedBlackboardAssignments: { dmg_taken_down: 'dmg_taken_down' },
              },
            ],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      finishBuffsById_6: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0038_purrche_block_instance'],
            reason: 'other',
          },
        },
        next: 'applyBuff_5',
      },
      switch_7: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_5' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 0 },
              sequence: { $sequence: 'modifyActionValue_1' },
            },
            {
              value: { kind: 'constant', value: 1 },
              sequence: { $sequence: 'modifyActionValue_2' },
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'modifyActionValue_3' },
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'modifyActionValue_4' },
            },
          ],
        },
        next: 'finishBuffsById_6',
      },
      readBuffStackCount_8: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'count',
            query: { kind: 'id', buffIds: ['buff_chr_0038_purrche_block_shelter_down_count'] },
          },
        },
        next: 'switch_7',
      },
      applyBuff_9: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_shelter_down_aura' }],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'applyBuff_9',
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'checkCondition_10',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_taken_down_1' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_taken_down_2' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_taken_down_3' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_taken_down_4' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0038_purrche_aura_block'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0038_purrche_block_shelter_down_count'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff2: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  triggerIntervalSeconds: 0.1,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: ['Skill/Character/Common/Shielded'],
  extendTags: [],
  blackboard: {
    count: 0,
    dmg_taken_down: 0.9,
    dmg_taken_down_1: 0.9,
    dmg_taken_down_2: 0.7,
    dmg_taken_down_3: 0.5,
    dmg_taken_down_4: 0.3,
  },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'readBuffStackCount_8' } },
  abilityEventResponses: [
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'checkCondition_11' } },
  ],
  actionGraph: purrchenaBuff2ActionGraph,
};

const purrchenaBuff3ActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0038_purrche_block_counter'],
            reason: 'other',
          },
        },
        next: null,
      },
      setCurrentBuffTimePaused_2: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: true } },
        next: null,
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'setCurrentBuffTimePaused_2',
      },
      setCurrentBuffTimePaused_4: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: false } },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'setCurrentBuffTimePaused_4',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0038_purrche_pause_change_skill_buff'],
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0038_purrche_pause_change_skill_buff'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff3: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  triggerIntervalSeconds: 0.5,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  timeClock: 'global',
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_atk_up',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 10 },
  attributeModifiers: [],
  lifecycleSequences: { finish: { $sequence: 'finishBuffsById_1' } },
  abilityEventResponses: [
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'checkCondition_3' } },
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_5' } },
  ],
  actionGraph: purrchenaBuff3ActionGraph,
  skillSlotReplacements: [
    {
      skillSlotKey: 'battleSkill',
      targetSkillKey: 'chr_0038_purrche_normal_skill_counter',
      revertedSkillKey: 'chr_0038_purrche_normal_skill',
      inheritOriginSkillCooldownProgress: false,
    },
  ],
};

const purrchenaBuff4ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_counter_mark' }],
            target: 'buffOwner',
            source: 'buffSource',
            asChildBuff: true,
          },
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_1',
      },
      readBuffStackCount_3: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'buffOwner',
            outputKey: 'enhance',
            query: { kind: 'id', buffIds: ['buff_chr_0038_purrche_block_counter'] },
          },
        },
        next: 'checkCondition_2',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'enhance', fallback: 0 } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 2 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff4: SkillBuffDefinition = {
  stackingType: 'enhanceAndRefresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  triggerIntervalSeconds: 0.5,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_atk_up',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 30, enhance: 0, stack: 0 },
  attributeModifiers: [],
  lifecycleSequences: { enhanceChanged: { $sequence: 'readBuffStackCount_3' } },
  actionGraph: purrchenaBuff4ActionGraph,
};

const purrchenaBuff5ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff5: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 3,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: purrchenaBuff5ActionGraph,
};

const purrchenaBuff6ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff6: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: 2,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { dmg_taken_down: 0.1 },
  attributeModifiers: [],
  actionGraph: purrchenaBuff6ActionGraph,
};

const purrchenaBuff7ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff7: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: 0.5,
  applyTags: ['Skill/Character/chr_0038_purrche/ImmuneNormalSkillfx'],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: purrchenaBuff7ActionGraph,
};

const purrchenaBuff8ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_shelter',
                blackboardAssignments: {
                  duration: { kind: 'constant', value: 99999 },
                  rate: { kind: 'valueNode', nodeId: 'data_1' },
                },
                keywordEnhancements: [
                  {
                    triggerBuffIds: ['buff_chr_0038_purrche_block_shelter_down_aura_instance'],
                    operation: 'add',
                    value: { kind: 'valueNode', nodeId: 'data_2' },
                  },
                ],
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_taken_down' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'shelter_add' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff8: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: ['Skill/Character/Common/Shielded'],
  extendTags: [],
  blackboard: { dmg_taken_down: 0.9, shelter_add: -0.2 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: purrchenaBuff8ActionGraph,
};

const purrchenaBuff9ActionGraph = {
  main: {
    nodes: {
      aura_1: {
        action: {
          kind: 'aura',
          parameters: {
            target: 'party',
            inheritSourceSkillCastInfo: true,
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_block_instance',
                blackboardAssignments: { dmg_taken_down: { kind: 'valueNode', nodeId: 'data_1' } },
                stringBlackboardAssignments: {},
              },
            ],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: null },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_taken_down' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff9: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: ['Skill/Character/Common/Shielded'],
  extendTags: [],
  blackboard: { dmg_taken_down: 0 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'aura_1' } },
  actionGraph: purrchenaBuff9ActionGraph,
};

const purrchenaBuff10ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0038_purrche_block_shelter_down_count' }],
            target: 'buffOwner',
            source: 'buffSource',
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
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'checkCondition_2',
      },
      finishCurrentBuff_4: {
        action: {
          kind: 'finishCurrentBuff',
          parameters: { reason: 'other', finishSource: 'actionSource' },
        },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'finishCurrentBuff_4',
      },
      setCurrentBuffTimePaused_6: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: false } },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'setCurrentBuffTimePaused_6',
      },
      setCurrentBuffTimePaused_8: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: true } },
        next: null,
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'setCurrentBuffTimePaused_8',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0038_purrche_block_shelter_down_count'],
          operator: 'less',
          value: { kind: 'constant', value: 3 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0038_purrche_aura_block'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_aura_block'] },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_pause_block'] },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'eventSkillIdIn',
          skillIds: [
            'chr_0038_purrche_normal_skill_block_1',
            'chr_0038_purrche_normal_skill_block_2',
            'chr_0038_purrche_combo_skill',
          ],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff10: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 4,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 0.3 },
  attributeModifiers: [],
  lifecycleSequences: { finish: { $sequence: 'checkCondition_3' } },
  abilityEventResponses: [
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_5' } },
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_7' } },
    { event: 'beforeCastSkill', priority: 0, sequence: { $sequence: 'checkCondition_9' } },
  ],
  actionGraph: purrchenaBuff10ActionGraph,
};

const purrchenaBuff11ActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0038_purrche_block_shelter_down_aura_instance'],
            reason: 'other',
          },
        },
        next: null,
      },
      aura_2: {
        action: {
          kind: 'aura',
          parameters: {
            target: 'party',
            inheritSourceSkillCastInfo: true,
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_block_shelter_down_aura_instance',
                blackboardAssignments: {},
                stringBlackboardAssignments: {},
              },
            ],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: 'finishBuffsById_1' },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff11: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 3,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { dmg_taken_down: 0 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'aura_2' } },
  actionGraph: purrchenaBuff11ActionGraph,
};

const purrchenaBuff12ActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0038_purrche_block_shelter_down_aura_instance'],
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
        next: 'finishBuffsById_1',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_aura_block'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff12: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 3,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_2' } },
  ],
  actionGraph: purrchenaBuff12ActionGraph,
};

const purrchenaBuff13ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff13: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: 3,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: purrchenaBuff13ActionGraph,
};

const purrchenaBuff14ActionGraph = {
  main: {
    nodes: {
      setCurrentBuffTimePaused_2: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: true } },
        next: null,
      },
      aura_1: {
        action: {
          kind: 'aura',
          parameters: {
            target: 'party',
            inheritSourceSkillCastInfo: false,
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_block_shelter_stay_instance',
                blackboardAssignments: { dmg_taken_down: { kind: 'valueNode', nodeId: 'data_1' } },
                stringBlackboardAssignments: {},
              },
            ],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: null },
        },
        next: null,
      },
      finishCurrentBuff_3: {
        action: {
          kind: 'finishCurrentBuff',
          parameters: { reason: 'other', finishSource: 'actionSource' },
        },
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'finishCurrentBuff_3',
      },
      setCurrentBuffTimePaused_5: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: false } },
        next: null,
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'setCurrentBuffTimePaused_5',
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'setCurrentBuffTimePaused_2',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_taken_down' } },
      data_2: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_aura_block'] },
      },
      data_3: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0038_purrche_pause_block'] },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'eventSkillIdIn',
          skillIds: [
            'chr_0038_purrche_normal_skill_block_1',
            'chr_0038_purrche_normal_skill_block_2',
            'chr_0038_purrche_combo_skill',
          ],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff14: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: ['Skill/Character/Common/Shielded'],
  extendTags: [],
  blackboard: { dmg_taken_down: 0.9, duration: 0.7 },
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'setCurrentBuffTimePaused_2' },
    enable: { $sequence: 'aura_1' },
  },
  abilityEventResponses: [
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_4' } },
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_6' } },
    { event: 'beforeCastSkill', priority: 0, sequence: { $sequence: 'checkCondition_8' } },
  ],
  actionGraph: purrchenaBuff14ActionGraph,
};

const purrchenaBuff15ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_shelter',
                blackboardAssignments: {
                  duration: { kind: 'constant', value: 99999 },
                  rate: { kind: 'valueNode', nodeId: 'data_1' },
                },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_taken_down' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff15: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 999,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_shield',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: ['Skill/Character/Common/Shielded'],
  extendTags: [],
  blackboard: { dmg_taken_down: 0.9, duration: 0.7 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: purrchenaBuff15ActionGraph,
};

const purrchenaBuff16ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff16: SkillBuffDefinition = {
  stackingType: 'modify',
  priority: 0,
  maxStackCount: 999,
  applyTags: [],
  extendTags: [],
  blackboard: { combotype: 0 },
  attributeModifiers: [],
  actionGraph: purrchenaBuff16ActionGraph,
};

const purrchenaBuff17ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff17: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: 5,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: purrchenaBuff17ActionGraph,
};

const purrchenaBuff18ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff18: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: purrchenaBuff18ActionGraph,
};

const purrchenaBuff19ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff19: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: purrchenaBuff19ActionGraph,
};

const purrchenaBuff20ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff20: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 3,
  triggerIntervalSeconds: 0.5,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  timeClock: 'global',
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: purrchenaBuff20ActionGraph,
};

const purrchenaBuff21ActionGraph = {
  main: {
    nodes: {
      aura_1: {
        action: {
          kind: 'aura',
          parameters: {
            target: 'party',
            inheritSourceSkillCastInfo: true,
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_talent_2_effectbuff',
                blackboardAssignments: {
                  dmg_down: { kind: 'valueNode', nodeId: 'data_1' },
                  cd: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {},
              },
            ],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: null },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_down' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'cd' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff21: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { cd: 0, dmg_down: 0.3 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'aura_1' } },
  actionGraph: purrchenaBuff21ActionGraph,
};

const purrchenaBuff22ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0038_purrche_talent_2_effectbuff_Add',
                copiedBlackboardAssignments: { dmg_down: 'dmg_down_true', cd: 'cd' },
              },
            ],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      calculateActionValue_2: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'dmg_down_true',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_1' },
            right: { kind: 'constant', value: -1 },
          },
        },
        next: 'applyBuff_1',
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'calculateActionValue_2',
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_3',
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'calculateActionValue_2',
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'checkCondition_11',
      },
      finishBuffsById_13: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0038_purrche_talent_2_effectbuff_Add'],
            reason: 'other',
          },
        },
        next: null,
      },
      calculateActionValue_14: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'dmg_down_true',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_8' },
            right: { kind: 'constant', value: -1 },
          },
        },
        next: 'finishBuffsById_13',
      },
      checkCondition_15: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: 'calculateActionValue_14',
      },
      setGlobalCooldown_16: {
        action: {
          kind: 'setGlobalCooldown',
          parameters: {
            target: 'buffOwner',
            markerId: 'buff_chr_0038_purrche_talent_2_effectbuff',
            durationSeconds: { kind: 'valueNode', nodeId: 'data_10' },
          },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: 'setGlobalCooldown_16',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_down' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'healthCompare',
          target: 'caster',
          valueType: 'ratio',
          operator: 'equal',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'globalCooldownPresent',
          target: 'buffOwner',
          markerId: 'buff_chr_0038_purrche_talent_2_effectbuff',
        },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_3' } },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'globalCooldownPresent',
          target: 'buffOwner',
          markerId: 'buff_chr_0038_purrche_talent_2_effectbuff',
        },
      },
      data_6: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_5' } },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'healthCompare',
          target: 'caster',
          valueType: 'ratio',
          operator: 'equal',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_down' } },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'healthCompare',
          target: 'caster',
          valueType: 'ratio',
          operator: 'less',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'cd' } },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0038_purrche_talent_2_effectbuff_Add'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff22: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  triggerIntervalSeconds: 0.5,
  waitFirstTriggerInterval: false,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: { cd: 0, dmg_down: 0, dmg_down_true: 0 },
  attributeModifiers: [],
  lifecycleSequences: {
    enable: { $sequence: 'checkCondition_4' },
    trigger: { $sequence: 'checkCondition_4' },
  },
  abilityEventResponses: [
    { event: 'hpChanged', priority: 0, sequence: { $sequence: 'checkCondition_12' } },
    { event: 'hpChanged', priority: 0, sequence: { $sequence: 'checkCondition_15' } },
    { event: 'beforeTakeDamage', priority: 0, sequence: { $sequence: 'checkCondition_17' } },
  ],
  actionGraph: purrchenaBuff22ActionGraph,
};

const purrchenaBuff23ActionGraph = {
  main: {
    nodes: {
      finishCurrentBuff_1: {
        action: {
          kind: 'finishCurrentBuff',
          parameters: { reason: 'other', finishSource: 'actionSource' },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff23: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_purrche_talent_02',
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
  blackboard: { cd: 0, dmg_down: 0 },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'defender',
      processors: [
        {
          kind: 'damageScale',
          side: 'attacker',
          zone: 'product',
          addition: { blackboardKey: 'dmg_down' },
        },
      ],
    },
  ],
  abilityEventResponses: [
    { event: 'takeDamage', priority: 0, sequence: { $sequence: 'finishCurrentBuff_1' } },
  ],
  actionGraph: purrchenaBuff23ActionGraph,
};

const purrchenaBuff24ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff24: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 3,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_purrche_talent_01',
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
  blackboard: { stack: 0 },
  attributeModifiers: [],
  actionGraph: purrchenaBuff24ActionGraph,
};

const purrchenaBuff25ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_vulnerable_spell',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  rate: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {
                  child_buff_id: 'buff_chr_0038_purrche_vulnerable_spell_child',
                },
              },
            ],
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'duration_vul' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'rate' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff25: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration_vul' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_purrche_ult_vulnerable',
    showInHeadBarCommon: true,
    showInHeadBarAttached: false,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration_vul: 0, rate: 0 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: purrchenaBuff25ActionGraph,
};

const purrchenaBuff26ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const purrchenaBuff26: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: { blackboardKey: 'rate' },
  maxStackCount: 0,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_purrche_ult_vulnerable',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
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
    iconStyleInSquad: 'LifeTime',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 0, rate: 0.2 },
  attributeModifiers: [],
  actionGraph: purrchenaBuff26ActionGraph,
};

export const purrchena: OperatorDefinition = {
  slug: 'purrchena',
  gameId: 'PURRCHENA',
  rarity: 5,
  weaponType: 'sword',
  element: 'physical',
  characterTypeId: 'Physical',
  role: 'defender',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [20, 52, 85, 118, 152, 168],
    agility: [8, 26, 45, 64, 84, 93],
    intellect: [9, 26, 44, 62, 80, 89],
    will: [12, 34, 56, 79, 102, 113],
    baseAttack: [30, 90, 152, 215, 277, 309],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      operationType: 'basicAttack',
      skills: [
        purrchenaChr_0038_purrche_attack1,
        purrchenaChr_0038_purrche_attack2,
        purrchenaChr_0038_purrche_attack3,
      ],
    },
    { key: 'finisher', operationType: 'finisher', skills: purrchenaChr_0038_purrche_power_attack },
    {
      key: 'plungingAttack',
      operationType: 'plungingAttack',
      skills: purrchenaChr_0038_purrche_plunging_attack_end,
    },
    {
      key: 'battleSkill',
      operationType: 'battleSkill',
      skills: purrchenaChr_0038_purrche_normal_skill,
      placementSequenceSkillKeys: [
        'chr_0038_purrche_normal_skill',
        'chr_0038_purrche_normal_skill_counter',
      ],
      replacementSkills: [
        purrchenaChr_0038_purrche_normal_skill_counter,
        purrchenaChr_0038_purrche_normal_skill_block_1,
        purrchenaChr_0038_purrche_normal_skill_block_2,
        purrchenaChr_0038_purrche_normal_skill_loop_1,
        purrchenaChr_0038_purrche_normal_skill_loop_2,
      ],
      replacementSkillPlacements: {
        chr_0038_purrche_normal_skill_block_1: 'internal',
        chr_0038_purrche_normal_skill_block_2: 'internal',
        chr_0038_purrche_normal_skill_loop_1: 'internal',
        chr_0038_purrche_normal_skill_loop_2: 'internal',
      },
    },
    {
      key: 'comboSkill',
      operationType: 'comboSkill',
      skills: purrchenaChr_0038_purrche_combo_skill,
    },
    {
      key: 'ultimate',
      operationType: 'ultimate',
      skills: purrchenaChr_0038_purrche_ultimate_skill,
    },
  ],
  dodgeSkill: purrchenaCommon_character_perfect_dodge,
  dashBuffs: [
    { buffId: 'buff_common_dash', blackboard: { dodgeSkillId: 'common_character_perfect_dodge' } },
  ],
  skillSlots: [
    {
      key: 'battleSkill',
      baseSkillKey: 'chr_0038_purrche_normal_skill',
      replacementSkillKeys: ['chr_0038_purrche_normal_skill_counter'],
    },
    { key: 'comboSkill', baseSkillKey: 'chr_0038_purrche_combo_skill', replacementSkillKeys: [] },
    { key: 'ultimate', baseSkillKey: 'chr_0038_purrche_ultimate_skill', replacementSkillKeys: [] },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'chr_0038_purrche_attack1',
        'chr_0038_purrche_attack2',
        'chr_0038_purrche_attack3',
        'chr_0038_purrche_power_attack',
        'chr_0038_purrche_plunging_attack_end',
      ],
      normalAttackSkillKeys: [
        'chr_0038_purrche_attack1',
        'chr_0038_purrche_attack2',
        'chr_0038_purrche_attack3',
      ],
      defaultSkillKey: 'chr_0038_purrche_attack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  comboSkillConditions: [purrchenaComboCondition1],
  comboSkillPriority: 'default',
  talents: [
    {
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_normal_skill_block_1',
          blackboardKey: 'talent_1_usp',
          operation: 'assign',
          value: [6, 10],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_ultimate_skill',
          blackboardKey: 'talent1_prob_up',
          operation: 'assign',
          value: [0.1, 0.1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_normal_skill_block_1',
          blackboardKey: 'talent_1_stack',
          operation: 'assign',
          value: [3, 3],
        },
      ],
    },
    { levels: 2, passiveSkills: [purrchenaPassive1] },
  ],
  potentials: [
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_ultimate_skill',
          blackboardKey: 'prob',
          operation: 'multiply',
          value: 1.5,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'modifyBasePanelStat', stat: 'defense', operation: 'flat', value: 20 },
        { kind: 'addBuildAttribute', attributes: ['will'], value: 20 },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_combo_skill',
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_combo_skill',
          blackboardKey: 'heal_static_value_fish',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_combo_skill',
          blackboardKey: 'heal_scale_fish',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_combo_skill',
          blackboardKey: 'atk_scale_boom',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_combo_skill',
          blackboardKey: 'radiusadd_display',
          operation: 'multiply',
          value: 0.2,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillKey: 'chr_0038_purrche_ultimate_skill',
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
          skillKey: 'chr_0038_purrche_ultimate_skill',
          blackboardKey: 'atk_scale_ult',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0038_purrche_ultimate_skill',
          blackboardKey: 'rate_vul',
          operation: 'multiply',
          value: 1.2,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0038_purrche_aura_block: purrchenaBuff1,
    buff_chr_0038_purrche_block: purrchenaBuff2,
    buff_chr_0038_purrche_block_change_skill: purrchenaBuff3,
    buff_chr_0038_purrche_block_counter: purrchenaBuff4,
    buff_chr_0038_purrche_block_counter_mark: purrchenaBuff5,
    buff_chr_0038_purrche_block_end: purrchenaBuff6,
    buff_chr_0038_purrche_block_immune_skillfx: purrchenaBuff7,
    buff_chr_0038_purrche_block_instance: purrchenaBuff8,
    buff_chr_0038_purrche_block_instance_aura: purrchenaBuff9,
    buff_chr_0038_purrche_block_shelter_down: purrchenaBuff10,
    buff_chr_0038_purrche_block_shelter_down_aura: purrchenaBuff11,
    buff_chr_0038_purrche_block_shelter_down_aura_instance: purrchenaBuff12,
    buff_chr_0038_purrche_block_shelter_down_count: purrchenaBuff13,
    buff_chr_0038_purrche_block_shelter_stay: purrchenaBuff14,
    buff_chr_0038_purrche_block_shelter_stay_instance: purrchenaBuff15,
    buff_chr_0038_purrche_combo_lasttype: purrchenaBuff16,
    buff_chr_0038_purrche_combo_to_normal_skill_hit: purrchenaBuff17,
    buff_chr_0038_purrche_enter_normal_skill_end: purrchenaBuff18,
    buff_chr_0038_purrche_pause_block: purrchenaBuff19,
    buff_chr_0038_purrche_pause_change_skill_buff: purrchenaBuff20,
    buff_chr_0038_purrche_talent_2: purrchenaBuff21,
    buff_chr_0038_purrche_talent_2_effectbuff: purrchenaBuff22,
    buff_chr_0038_purrche_talent_2_effectbuff_Add: purrchenaBuff23,
    buff_chr_0038_purrche_ult_add_red: purrchenaBuff24,
    buff_chr_0038_purrche_ult_spell_vulnerable: purrchenaBuff25,
    buff_chr_0038_purrche_vulnerable_spell_child: purrchenaBuff26,
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0038_purrche_combo: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'infinite' },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0038_purrche_combo_skill_giftbox_abilityrange',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 120,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 10,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: {
          atk_scale_blackhole_dot: 0.1,
          atk_scale_blackhole_end: 0,
          atk_scale_boom: 0,
          comboType: 0,
          heal_scale: 1,
          heal_scale_fish: 1,
          heal_static_value: 100,
          heal_static_value_fish: 100,
          poise: 15,
          usp: 0,
        },
        scheduledSequences: [
          { startFrame: 64, endFrame: 67, sequence: { $sequence: 'finishOwner_1' } },
          { startFrame: 44, endFrame: 44, sequence: { $sequence: 'findTargets_2' } },
          { startFrame: 45, endFrame: 48, sequence: { $sequence: 'switch_27' } },
          { startFrame: 44, endFrame: 45, sequence: { $sequence: 'findCharacterTeamTargets_28' } },
          { startFrame: 44, endFrame: 45, sequence: { $sequence: 'repeatEachTick_30' } },
          { startFrame: 44, endFrame: 47, sequence: { $sequence: 'changeResource_31' } },
        ],
        actionGraph: {
          main: {
            nodes: {
              finishOwner_1: {
                action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                next: null,
              },
              findTargets_2: {
                action: {
                  kind: 'findTargets',
                  parameters: {
                    owner: { kind: 'owner' },
                    query: { kind: 'mainTarget', owner: { kind: 'owner' } },
                    saveToContextKey: 'main_tar',
                  },
                },
                next: null,
              },
              launchProjectile_25: {
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
                        skillId: 'chr_0038_purrche_combo_skill_projhit_3',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 1,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale_boom: 1, duration: 0, poise: 15, usp: 0 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'physical',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    tags: ['comboSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                  },
                                  key: 'abilityentity_chr_0038_purrche_combo:chr_0038_purrche_combo_skill_giftbox_abilityrange:/childSkill/actionGraph/main/nodes/launchProjectile_25/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale_boom' },
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
              launchProjectile_22: {
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
                        skillId: 'chr_0038_purrche_combo_skill_projhit_3',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 1,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale_boom: 1, duration: 0, poise: 15, usp: 0 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'physical',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    tags: ['comboSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                  },
                                  key: 'abilityentity_chr_0038_purrche_combo:chr_0038_purrche_combo_skill_giftbox_abilityrange:/childSkill/actionGraph/main/nodes/launchProjectile_22/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale_boom' },
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
              launchProjectile_21: {
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
                        skillId: 'chr_0038_purrche_combo_skill_projhit_3',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 1,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { atk_scale_boom: 1, duration: 0, poise: 15, usp: 0 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                          { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              dealDamage_1: {
                                action: {
                                  kind: 'dealDamage',
                                  parameters: {
                                    damageType: 'physical',
                                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                                    tags: ['comboSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: { kind: 'valueNode', nodeId: 'data_2' },
                                  },
                                  key: 'abilityentity_chr_0038_purrche_combo:chr_0038_purrche_combo_skill_giftbox_abilityrange:/childSkill/actionGraph/main/nodes/launchProjectile_21/action/callbacks/0/skill/actionGraph/main/nodes/dealDamage_1/action',
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'atk_scale_boom' },
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
              checkCondition_20: {
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
                  condition: { $sequence: 'checkCondition_20' },
                  whenTrue: { $sequence: 'launchProjectile_21' },
                  whenFalse: { $sequence: 'launchProjectile_22' },
                },
                next: null,
              },
              checkCondition_23: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
                },
                next: null,
              },
              ifElse_26: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_23' },
                  whenTrue: { $sequence: 'ifElse_24' },
                  whenFalse: { $sequence: 'launchProjectile_25' },
                },
                next: null,
              },
              launchProjectile_17: {
                action: {
                  kind: 'launchProjectile',
                  parameters: {
                    inheritActionBlackboard: true,
                    entityInitialValues: {},
                    finish: { reachAfterTicks: 2, maxDurationSeconds: 5 },
                    recycleDelaySeconds: 0.0666666701436043,
                    hit: { onReach: true, target: 'currentTarget', finishOnHit: true },
                  },
                  callbacks: [
                    {
                      event: 'hit',
                      skill: {
                        skillId: 'chr_0038_purrche_combo_skill_projhit_4',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 2,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: { heal_scale_fish: 1, heal_static_value_fish: 100 },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 0, sequence: { $sequence: 'heal_1' } },
                          { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              heal_1: {
                                action: {
                                  kind: 'heal',
                                  parameters: {
                                    target: 'actionInputTarget',
                                    alwaysNext: true,
                                    tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
                                    attribute: 'will',
                                    multiplier: { kind: 'valueNode', nodeId: 'data_1' },
                                    addition: { kind: 'valueNode', nodeId: 'data_2' },
                                  },
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'heal_scale_fish' },
                              },
                              data_2: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'heal_static_value_fish' },
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
              forEachContextTarget_18: {
                action: {
                  kind: 'forEachContextTarget',
                  parameters: { targets: { kind: 'context', key: 'team' } },
                  body: { $sequence: 'launchProjectile_17' },
                },
                next: null,
              },
              findCharacterTeamTargets_19: {
                action: {
                  kind: 'findCharacterTeamTargets',
                  parameters: {
                    saveToContextKey: 'team',
                    selection: { kind: 'controlledOperator' },
                  },
                },
                next: 'forEachContextTarget_18',
              },
              launchProjectile_15: {
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
                        skillId: 'chr_0038_purrche_combo_skill_projhit_1',
                        nativeSkillType: 'normalSkill',
                        naturalDurationFrames: 1,
                        castResource: {
                          costFrame: 0,
                          cooldownSeconds: 0,
                          maxChargeTime: 1,
                          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                        },
                        blackboard: {
                          atk_scale: 1,
                          atk_scale_blackhole_dot: 0,
                          duration: 0,
                          poise: 10,
                          potential_3: 0,
                          usp: 0,
                        },
                        scheduledSequences: [
                          { startFrame: 0, endFrame: 0, sequence: { $sequence: 'ifElse_opt1' } },
                          { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                        ],
                        actionGraph: {
                          main: {
                            nodes: {
                              checkCondition_1: {
                                action: {
                                  kind: 'checkCondition',
                                  parameters: {
                                    condition: { kind: 'conditionNode', nodeId: 'data_2' },
                                  },
                                },
                                next: null,
                              },
                              spawnAbilityEntity_2: {
                                action: {
                                  kind: 'spawnAbilityEntity',
                                  parameters: {
                                    bornAt: { kind: 'context', key: 'pos' },
                                    abilityEntityId: 'abilityentity_chr_0038_purrche_combo_item_1',
                                    childSkillId:
                                      'chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3',
                                    inheritActionBlackboard: true,
                                    dieWhenSourceDies: false,
                                  },
                                },
                                next: null,
                              },
                              spawnAbilityEntity_3: {
                                action: {
                                  kind: 'spawnAbilityEntity',
                                  parameters: {
                                    bornAt: { kind: 'context', key: 'pos' },
                                    abilityEntityId: 'abilityentity_chr_0038_purrche_combo_item_1',
                                    childSkillId: 'chr_0038_purrche_combo_skill_abilityrange_1_1',
                                    inheritActionBlackboard: true,
                                    dieWhenSourceDies: false,
                                  },
                                },
                                next: null,
                              },
                              ifElse_opt1: {
                                action: {
                                  kind: 'ifElse',
                                  parameters: { alwaysNext: true },
                                  condition: { $sequence: 'checkCondition_1' },
                                  whenTrue: { $sequence: 'spawnAbilityEntity_2' },
                                  whenFalse: { $sequence: 'spawnAbilityEntity_3' },
                                },
                                next: null,
                              },
                            },
                            dataNodes: {
                              data_1: {
                                type: 'number',
                                expression: { kind: 'blackboard', key: 'potential_3', fallback: 0 },
                              },
                              data_2: {
                                type: 'boolean',
                                expression: {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'valueNode', nodeId: 'data_1' },
                                  operator: 'greaterOrEqual',
                                  right: { kind: 'constant', value: 1 },
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
              ifElse_14: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_20' },
                  whenTrue: { $sequence: 'launchProjectile_15' },
                  whenFalse: { $sequence: 'launchProjectile_15' },
                },
                next: null,
              },
              ifElse_16: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_23' },
                  whenTrue: { $sequence: 'ifElse_14' },
                  whenFalse: { $sequence: 'launchProjectile_15' },
                },
                next: null,
              },
              switch_27: {
                action: {
                  kind: 'switch',
                  parameters: { choice: { kind: 'valueNode', nodeId: 'data_3' }, alwaysNext: true },
                  options: [
                    { value: { kind: 'constant', value: 0 }, sequence: { $sequence: 'ifElse_16' } },
                    { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'ifElse_16' } },
                    {
                      value: { kind: 'constant', value: 3 },
                      sequence: { $sequence: 'findCharacterTeamTargets_19' },
                    },
                    { value: { kind: 'constant', value: 2 }, sequence: { $sequence: 'ifElse_26' } },
                  ],
                },
                next: null,
              },
              findCharacterTeamTargets_28: {
                action: {
                  kind: 'findCharacterTeamTargets',
                  parameters: { saveToContextKey: 'team', selection: { kind: 'allOperators' } },
                },
                next: null,
              },
              heal_29: {
                action: {
                  kind: 'heal',
                  parameters: {
                    target: 'actionInputTarget',
                    alwaysNext: true,
                    tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
                    attribute: 'will',
                    multiplier: { kind: 'valueNode', nodeId: 'data_4' },
                    addition: { kind: 'valueNode', nodeId: 'data_5' },
                  },
                },
                next: null,
              },
              repeatEachTick_30: {
                action: {
                  kind: 'repeatEachTick',
                  parameters: {
                    nativeChanneling: {
                      target: { kind: 'context', key: 'team' },
                      executeEachFrame: true,
                      triggerIntervalSeconds: 0.033,
                      maxCountPerTarget: 1,
                      targetTriggerIntervalSeconds: 0.033,
                    },
                  },
                  body: { $sequence: 'heal_29' },
                },
                next: null,
              },
              changeResource_31: {
                action: {
                  kind: 'changeResource',
                  parameters: {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'valueNode', nodeId: 'data_6' },
                    coefficient: { kind: 'constant', value: 1 },
                    source: { kind: 'source' },
                    targets: { kind: 'source' },
                  },
                },
                next: null,
              },
            },
            dataNodes: {
              data_1: {
                type: 'boolean',
                expression: {
                  kind: 'targetDistance',
                  source: { kind: 'mainCharacter' },
                  target: { kind: 'fixed', target: 'enemy' },
                  distance: 10,
                  lessThan: true,
                  includeTargetRadius: false,
                  containsHittableObject: false,
                },
              },
              data_2: {
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
              data_3: { type: 'number', expression: { kind: 'blackboard', key: 'comboType' } },
              data_4: { type: 'number', expression: { kind: 'blackboard', key: 'heal_scale' } },
              data_5: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'heal_static_value' },
              },
              data_6: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
            },
          },
          macros: {},
        },
      },
    },
    abilityentity_chr_0038_purrche_combo_item_1: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'infinite' },
      maxStackingCount: 1,
      childSkills: {
        chr_0038_purrche_ultimate_skill_abilityrange_blackhole: {
          actionGraph: {
            main: {
              nodes: {
                dealDamage_1: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'physical',
                      attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                    },
                    key: 'abilityentity_chr_0038_purrche_combo_item_1:chr_0038_purrche_ultimate_skill_abilityrange_blackhole|chr_0038_purrche_combo_skill_abilityrange_1_1|chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3:/childSkills/chr_0038_purrche_ultimate_skill_abilityrange_blackhole/actionGraph/main/nodes/dealDamage_1/action',
                  },
                  next: null,
                },
                finishOwner_2: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
                dealDamage_3: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'physical',
                      attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                      tags: ['ultimateSkill'],
                    },
                    key: 'abilityentity_chr_0038_purrche_combo_item_1:chr_0038_purrche_ultimate_skill_abilityrange_blackhole|chr_0038_purrche_combo_skill_abilityrange_1_1|chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3:/childSkills/chr_0038_purrche_ultimate_skill_abilityrange_blackhole/actionGraph/main/nodes/dealDamage_3/action',
                  },
                  next: null,
                },
                repeatEachTick_4: {
                  action: {
                    kind: 'repeatEachTick',
                    parameters: {
                      nativeExecuteInterval: { executeEachFrame: false, intervalSeconds: 0.5 },
                    },
                    body: { $sequence: 'dealDamage_3' },
                  },
                  next: null,
                },
              },
              dataNodes: {
                data_1: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_blackhole_end' },
                },
                data_2: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_blackhole_dot' },
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0038_purrche_ultimate_skill_abilityrange_blackhole',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 67,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 10,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale_blackhole_dot: 0.1, atk_scale_blackhole_end: 0 },
          scheduledSequences: [
            { startFrame: 56, endFrame: 59, sequence: { $sequence: 'dealDamage_1' } },
            { startFrame: 64, endFrame: 67, sequence: { $sequence: 'finishOwner_2' } },
            { startFrame: 0, endFrame: 56, sequence: { $sequence: 'repeatEachTick_4' } },
          ],
        },
        chr_0038_purrche_combo_skill_abilityrange_1_1: {
          actionGraph: {
            main: {
              nodes: {
                dealDamage_1: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'physical',
                      attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                      tags: ['comboSkill'],
                      features: ['canBreakWeakness'],
                    },
                    key: 'abilityentity_chr_0038_purrche_combo_item_1:chr_0038_purrche_ultimate_skill_abilityrange_blackhole|chr_0038_purrche_combo_skill_abilityrange_1_1|chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3:/childSkills/chr_0038_purrche_combo_skill_abilityrange_1_1/actionGraph/main/nodes/dealDamage_1/action',
                  },
                  next: null,
                },
                finishOwner_2: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
                dealDamage_3: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'physical',
                      attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                      tags: ['comboSkill'],
                    },
                    key: 'abilityentity_chr_0038_purrche_combo_item_1:chr_0038_purrche_ultimate_skill_abilityrange_blackhole|chr_0038_purrche_combo_skill_abilityrange_1_1|chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3:/childSkills/chr_0038_purrche_combo_skill_abilityrange_1_1/actionGraph/main/nodes/dealDamage_3/action',
                  },
                  next: null,
                },
                repeatEachTick_4: {
                  action: {
                    kind: 'repeatEachTick',
                    parameters: {
                      nativeExecuteInterval: { executeEachFrame: false, intervalSeconds: 0.5 },
                    },
                    body: { $sequence: 'dealDamage_3' },
                  },
                  next: null,
                },
              },
              dataNodes: {
                data_1: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_blackhole_end' },
                },
                data_2: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_blackhole_dot' },
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0038_purrche_combo_skill_abilityrange_1_1',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 67,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 10,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale_blackhole_dot: 0.1, atk_scale_blackhole_end: 0 },
          scheduledSequences: [
            { startFrame: 56, endFrame: 59, sequence: { $sequence: 'dealDamage_1' } },
            { startFrame: 64, endFrame: 67, sequence: { $sequence: 'finishOwner_2' } },
            { startFrame: 0, endFrame: 56, sequence: { $sequence: 'repeatEachTick_4' } },
          ],
        },
        chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3: {
          actionGraph: {
            main: {
              nodes: {
                dealDamage_1: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'physical',
                      attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                      tags: ['comboSkill'],
                      features: ['canBreakWeakness'],
                    },
                    key: 'abilityentity_chr_0038_purrche_combo_item_1:chr_0038_purrche_ultimate_skill_abilityrange_blackhole|chr_0038_purrche_combo_skill_abilityrange_1_1|chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3:/childSkills/chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3/actionGraph/main/nodes/dealDamage_1/action',
                  },
                  next: null,
                },
                finishOwner_2: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
                dealDamage_3: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'physical',
                      attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                      tags: ['comboSkill'],
                    },
                    key: 'abilityentity_chr_0038_purrche_combo_item_1:chr_0038_purrche_ultimate_skill_abilityrange_blackhole|chr_0038_purrche_combo_skill_abilityrange_1_1|chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3:/childSkills/chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3/actionGraph/main/nodes/dealDamage_3/action',
                  },
                  next: null,
                },
                repeatEachTick_4: {
                  action: {
                    kind: 'repeatEachTick',
                    parameters: {
                      nativeExecuteInterval: { executeEachFrame: false, intervalSeconds: 0.5 },
                    },
                    body: { $sequence: 'dealDamage_3' },
                  },
                  next: null,
                },
              },
              dataNodes: {
                data_1: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_blackhole_end' },
                },
                data_2: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_blackhole_dot' },
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0038_purrche_combo_skill_abilityrange_1_1_potential_3',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 67,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 10,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale_blackhole_dot: 0.1, atk_scale_blackhole_end: 0 },
          scheduledSequences: [
            { startFrame: 56, endFrame: 59, sequence: { $sequence: 'dealDamage_1' } },
            { startFrame: 64, endFrame: 67, sequence: { $sequence: 'finishOwner_2' } },
            { startFrame: 0, endFrame: 56, sequence: { $sequence: 'repeatEachTick_4' } },
          ],
        },
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;

export default purrchena;
