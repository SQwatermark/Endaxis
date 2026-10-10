/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */

import type { ActionGraphResourceDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import type { SkillDefinition } from '../../../packages/game-data-contract/src/skills';
import type { SkillBuffDefinition } from '../../../packages/game-data-contract/src/buffs';
import type {
  OperatorPassiveSkillDefinition,
  ComboSkillConditionDefinition,
} from '../../../packages/game-data-contract/src/operators';
import type { OperatorDefinition } from '../../../packages/game-data-contract/src/operators';
export const arcaneChr_0032_lizhiyan_attack1ActionGraph = {
  main: {
    nodes: {
      checkCondition_2: {
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
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_7: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_6',
      },
      dealDamage_10: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack'],
          },
        },
        next: null,
      },
      repeatEachTick_12: {
        action: {
          kind: 'repeatEachTick',
          parameters: {
            nativeChanneling: {
              target: { kind: 'fixed', target: 'enemy' },
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: 1,
              targetTriggerIntervalSeconds: 0.1,
            },
          },
          body: { $sequence: 'dealDamage_10' },
        },
        next: null,
      },
      repeatEachTick_13: {
        action: {
          kind: 'repeatEachTick',
          parameters: {
            nativeChanneling: {
              target: { kind: 'fixed', target: 'enemy' },
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: 1,
              targetTriggerIntervalSeconds: 0.1,
            },
          },
          body: { $sequence: 'dealDamage_10' },
        },
        next: 'repeatEachTick_12',
      },
      reachSkillOperableBoundary_14: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0032_lizhiyan_attack2'] },
        },
        next: null,
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'dealDamage_7' },
          whenFalse: { $sequence: 'dealDamage_7' },
        },
        next: null,
      },
      repeatEachTick_opt2: {
        action: {
          kind: 'repeatEachTick',
          parameters: {
            nativeChanneling: {
              target: { kind: 'fixed', target: 'enemy' },
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: 1,
              targetTriggerIntervalSeconds: 0.1,
            },
          },
          body: { $sequence: 'ifElse_opt1' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'enemy',
          buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_attack1: SkillDefinition = {
  key: 'chr_0032_lizhiyan_attack1',
  element: 'nature',
  blackboard: {
    atk_scale: [0.062, 0.069, 0.075, 0.081, 0.087, 0.094, 0.1, 0.106, 0.112, 0.12, 0.129, 0.14],
  },
  timelineBlockFrames: 10,
  naturalDurationFrames: 224,
  exclusiveFrame: 30,
  offsetRecordFrame: 10,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 3,
        endFrame: 30,
        input: 'basicAttack',
        targetSkillId: 'chr_0032_lizhiyan_attack2',
      },
    ],
    allowedNextSkills: [{ startFrame: 10, endFrame: 30, skillIds: ['chr_0032_lizhiyan_attack2'] }],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 10, endFrame: 12, sequence: { $sequence: 'repeatEachTick_opt2' } },
    { startFrame: 10, endFrame: 12, sequence: { $sequence: 'repeatEachTick_13' } },
    { startFrame: 10, endFrame: 30, sequence: { $sequence: 'reachSkillOperableBoundary_14' } },
  ],
  timelineContinuationSkillId: 'chr_0032_lizhiyan_attack2',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: arcaneChr_0032_lizhiyan_attack1ActionGraph,
};

export const arcaneChr_0032_lizhiyan_attack2ActionGraph = {
  main: {
    nodes: {
      checkCondition_2: {
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
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_7: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_6',
      },
      dealDamage_12: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack'],
          },
        },
        next: null,
      },
      changeResource_15: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_3' },
            coefficient: { kind: 'constant', value: 0.167 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          },
        },
        next: null,
      },
      checkCondition_14: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_14' },
          whenTrue: { $sequence: 'changeResource_15' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      reachSkillOperableBoundary_26: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0032_lizhiyan_attack3'] },
        },
        next: null,
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'dealDamage_7' },
          whenFalse: { $sequence: 'dealDamage_7' },
        },
        next: null,
      },
      forEachContextTarget_opt2: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt1' },
        },
        next: null,
      },
      ifElse_opt3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'dealDamage_12' },
          whenFalse: { $sequence: 'dealDamage_12' },
        },
        next: null,
      },
      forEachContextTarget_opt4: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt3' },
        },
        next: 'ifElse_16',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'enemy',
          buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
      data_4: { type: 'boolean', expression: { kind: 'casterControlled' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_attack2: SkillDefinition = {
  key: 'chr_0032_lizhiyan_attack2',
  element: 'nature',
  blackboard: {
    atb: 0,
    atk_scale: [0.071, 0.078, 0.085, 0.092, 0.099, 0.107, 0.114, 0.121, 0.128, 0.137, 0.147, 0.16],
  },
  timelineBlockFrames: 14,
  naturalDurationFrames: 215,
  exclusiveFrame: 30,
  offsetRecordFrame: 11,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 32,
        input: 'basicAttack',
        targetSkillId: 'chr_0032_lizhiyan_attack3',
      },
    ],
    allowedNextSkills: [{ startFrame: 14, endFrame: 32, skillIds: ['chr_0032_lizhiyan_attack3'] }],
  },
  costFrame: 11,
  scheduledSequences: [
    { startFrame: 11, endFrame: 12, sequence: { $sequence: 'forEachContextTarget_opt2' } },
    { startFrame: 12, endFrame: 13, sequence: { $sequence: 'forEachContextTarget_opt4' } },
    { startFrame: 13, endFrame: 14, sequence: { $sequence: 'forEachContextTarget_opt4' } },
    { startFrame: 14, endFrame: 32, sequence: { $sequence: 'reachSkillOperableBoundary_26' } },
  ],
  timelineContinuationSkillId: 'chr_0032_lizhiyan_attack3',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: arcaneChr_0032_lizhiyan_attack2ActionGraph,
};

export const arcaneChr_0032_lizhiyan_attack3ActionGraph = {
  main: {
    nodes: {
      dealDamage_3: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['normalAttack'],
          },
        },
        next: null,
      },
      changeResource_6: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_2' },
            coefficient: { kind: 'constant', value: 0.167 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          },
        },
        next: null,
      },
      checkCondition_5: {
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
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'changeResource_6' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_15: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_14',
      },
      reachSkillOperableBoundary_21: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0032_lizhiyan_attack4'] },
        },
        next: null,
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'dealDamage_3' },
          whenFalse: { $sequence: 'dealDamage_3' },
        },
        next: null,
      },
      forEachContextTarget_opt2: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt1' },
        },
        next: 'ifElse_7',
      },
      ifElse_opt3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'dealDamage_15' },
          whenFalse: { $sequence: 'dealDamage_15' },
        },
        next: null,
      },
      forEachContextTarget_opt4: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt3' },
        },
        next: 'ifElse_7',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
      data_3: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'enemy',
          buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_attack3: SkillDefinition = {
  key: 'chr_0032_lizhiyan_attack3',
  element: 'nature',
  blackboard: {
    atb: 0,
    atk_scale: [0.17, 0.18, 0.2, 0.22, 0.23, 0.25, 0.27, 0.28, 0.3, 0.32, 0.35, 0.38],
  },
  timelineBlockFrames: 22,
  naturalDurationFrames: 235,
  exclusiveFrame: 30,
  offsetRecordFrame: 7,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 39,
        input: 'basicAttack',
        targetSkillId: 'chr_0032_lizhiyan_attack4',
      },
    ],
    allowedNextSkills: [{ startFrame: 22, endFrame: 39, skillIds: ['chr_0032_lizhiyan_attack4'] }],
  },
  costFrame: 13,
  scheduledSequences: [
    { startFrame: 5, endFrame: 6, sequence: { $sequence: 'forEachContextTarget_opt2' } },
    { startFrame: 13, endFrame: 14, sequence: { $sequence: 'forEachContextTarget_opt4' } },
    { startFrame: 22, endFrame: 39, sequence: { $sequence: 'reachSkillOperableBoundary_21' } },
  ],
  timelineContinuationSkillId: 'chr_0032_lizhiyan_attack4',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: arcaneChr_0032_lizhiyan_attack3ActionGraph,
};

export const arcaneChr_0032_lizhiyan_attack4ActionGraph = {
  main: {
    nodes: {
      dealDamage_1: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['normalAttack'],
          },
        },
        next: null,
      },
      createTimedMarker_9: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'owner' },
            markerId: 'lizhiyan_attack4',
            durationSeconds: { kind: 'constant', value: 0.1 },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: null,
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'createTimedMarker_9',
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_10',
      },
      forEachContextTarget_12: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'checkCondition_11' },
        },
        next: null,
      },
      reachSkillOperableBoundary_13: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0032_lizhiyan_attack5'] },
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
          target: 'enemy',
          buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'lizhiyan_attack4' },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_3' } },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_attack4: SkillDefinition = {
  key: 'chr_0032_lizhiyan_attack4',
  element: 'nature',
  blackboard: {
    atk_scale: [0.045, 0.049, 0.053, 0.058, 0.062, 0.067, 0.071, 0.076, 0.08, 0.086, 0.092, 0.1],
  },
  timelineBlockFrames: 18,
  naturalDurationFrames: 230,
  exclusiveFrame: 26,
  offsetRecordFrame: 8,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 39,
        input: 'basicAttack',
        targetSkillId: 'chr_0032_lizhiyan_attack5',
      },
    ],
    allowedNextSkills: [{ startFrame: 18, endFrame: 39, skillIds: ['chr_0032_lizhiyan_attack5'] }],
  },
  costFrame: 13,
  scheduledSequences: [
    { startFrame: 2, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 5, endFrame: 6, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 8, endFrame: 9, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 11, endFrame: 12, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 2, endFrame: 3, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 5, endFrame: 6, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 8, endFrame: 9, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 11, endFrame: 12, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 4, endFrame: 36, sequence: { $sequence: 'forEachContextTarget_12' } },
    { startFrame: 18, endFrame: 39, sequence: { $sequence: 'reachSkillOperableBoundary_13' } },
  ],
  timelineContinuationSkillId: 'chr_0032_lizhiyan_attack5',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: arcaneChr_0032_lizhiyan_attack4ActionGraph,
};

export const arcaneChr_0032_lizhiyan_attack5ActionGraph = {
  main: {
    nodes: {
      modifyActionValue_1: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'isHitbyMain',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      changeResource_3: {
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
      ifElse_4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'modifyActionValue_1' },
          whenFalse: { $sequence: null },
        },
        next: 'changeResource_3',
      },
      checkCondition_2: {
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
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'ifElse_4' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_6: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_3' },
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: { kind: 'valueNode', nodeId: 'data_4' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'ifElse_5',
      },
      startTimeDilation_8: {
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
                  time: 0,
                  value: 0.6,
                  inTangent: -7.07589,
                  outTangent: -7.07589,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.15,
                  value: 0.03,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.5,
                  value: 0.1,
                  inTangent: 0.4752959,
                  outTangent: 0.4752959,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.8,
                  inTangent: 2.06752,
                  outTangent: 2.06752,
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
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      ifElse_9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'startTimeDilation_8' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      createTimedMarker_19: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'owner' },
            markerId: 'lizhiyan_attack5',
            durationSeconds: { kind: 'constant', value: 0.1 },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: null,
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'createTimedMarker_19',
      },
      checkCondition_21: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: 'checkCondition_20',
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: null,
      },
      ifElse_25: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_22' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_23: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: null,
      },
      checkCondition_24: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: 'checkCondition_23',
      },
      ifElse_27: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_24' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_25' },
        },
        next: null,
      },
      checkCondition_26: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_13' } },
        },
        next: null,
      },
      ifElse_31: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_26' },
          whenTrue: { $sequence: 'ifElse_27' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      forEachContextTarget_32: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'checkCondition_21' },
        },
        next: 'ifElse_31',
      },
      reachSkillOperableBoundary_34: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0032_lizhiyan_attack1'] },
        },
        next: null,
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'forEachContextTarget_32' },
          whenFalse: { $sequence: 'forEachContextTarget_32' },
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
        type: 'number',
        expression: { kind: 'blackboard', key: 'isHitbyMain', fallback: 0 },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_5' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'enemy',
          buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_8: {
        type: 'boolean',
        expression: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'lizhiyan_attack5' },
      },
      data_9: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_8' } },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_listener'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_listener_owner'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_12: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_13: {
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
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_attack5: SkillDefinition = {
  key: 'chr_0032_lizhiyan_attack5',
  element: 'nature',
  blackboard: {
    atb: 17,
    atk_scale: [0.47, 0.52, 0.56, 0.61, 0.66, 0.71, 0.75, 0.8, 0.85, 0.9, 0.98, 1.06],
    isHitbyMain: 0,
    poise: 17,
  },
  timelineBlockFrames: 40,
  naturalDurationFrames: 300,
  exclusiveFrame: 41,
  offsetRecordFrame: 22,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 50,
        input: 'basicAttack',
        targetSkillId: 'chr_0032_lizhiyan_attack1',
      },
    ],
    allowedNextSkills: [{ startFrame: 40, endFrame: 50, skillIds: ['chr_0032_lizhiyan_attack1'] }],
  },
  costFrame: 13,
  scheduledSequences: [
    { startFrame: 22, endFrame: 25, sequence: { $sequence: 'dealDamage_6' } },
    { startFrame: 23, endFrame: 25, sequence: { $sequence: 'ifElse_9' } },
    { startFrame: 22, endFrame: 25, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 40, endFrame: 50, sequence: { $sequence: 'reachSkillOperableBoundary_34' } },
  ],
  timelineContinuationSkillId: 'chr_0032_lizhiyan_attack1',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: arcaneChr_0032_lizhiyan_attack5ActionGraph,
};

export const arcaneChr_0032_lizhiyan_power_attackActionGraph = {
  main: {
    nodes: {
      dealDamage_1: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
            tags: ['normalAttack', 'powerAttack'],
          },
        },
        next: null,
      },
      startTimeDilation_4: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.55 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.5,
                  inTangent: -7,
                  outTangent: -7,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.07,
                  value: 0.01,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.898291,
                  value: 0.1031128,
                  inTangent: 0.03048408,
                  outTangent: 0.03048408,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.3,
                  inTangent: 2.232943,
                  outTangent: 2.232943,
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
      gainFinisherSp_5: {
        action: { kind: 'gainFinisherSp', parameters: { factor: 1, recipient: 'team' } },
        next: 'startTimeDilation_4',
      },
      dealDamage_6: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            calculation: 'breakingAttack',
            calculationMultiplier: 0.5,
            tags: ['normalAttack', 'powerAttack'],
          },
        },
        next: 'gainFinisherSp_5',
      },
      repeatEachTick_8: {
        action: {
          kind: 'repeatEachTick',
          parameters: {
            nativeChanneling: {
              target: { kind: 'inputTarget' },
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: 2,
              targetTriggerIntervalSeconds: 0.067,
            },
          },
          body: { $sequence: 'dealDamage_1' },
        },
        next: null,
      },
      createTimedMarker_9: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'source' },
            markerId: 'lizhiyan_power_attack_effect',
            durationSeconds: { kind: 'constant', value: 1 },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: null,
      },
      applyBuff_10: {
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
      applyBuff_11: {
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
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_power_attack: SkillDefinition = {
  key: 'chr_0032_lizhiyan_power_attack',
  element: 'nature',
  blackboard: { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
  timelineBlockFrames: 52,
  naturalDurationFrames: 163,
  exclusiveFrame: 51,
  offsetRecordFrame: 21,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 34,
        endFrame: 51,
        skillIds: ['chr_0032_lizhiyan_normal_skill', 'chr_0032_lizhiyan_combo_skill'],
      },
    ],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 7, endFrame: 8, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 10, endFrame: 11, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 13, endFrame: 14, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 36, endFrame: 39, sequence: { $sequence: 'dealDamage_6' } },
    { startFrame: 32, endFrame: 35, sequence: { $sequence: 'repeatEachTick_8' } },
    { startFrame: 7, endFrame: 37, sequence: { $sequence: 'createTimedMarker_9' } },
    { startFrame: 0, endFrame: 51, sequence: { $sequence: 'applyBuff_10' } },
    { startFrame: 0, endFrame: 37, sequence: { $sequence: 'applyBuff_11' } },
  ],
  skillType: 'finisher',
  levelSource: 'basicAttack',
  nativeSkillType: 'breakingAttack',
  actionGraph: arcaneChr_0032_lizhiyan_power_attackActionGraph,
};

export const arcaneChr_0032_lizhiyan_plunging_attack_endActionGraph = {
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
            damageType: 'nature',
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

export const arcaneChr_0032_lizhiyan_plunging_attack_end: SkillDefinition = {
  key: 'chr_0032_lizhiyan_plunging_attack_end',
  element: 'nature',
  blackboard: {
    atb: 0,
    atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
  timelineBlockFrames: 13,
  naturalDurationFrames: 120,
  exclusiveFrame: 12,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [{ startFrame: 1, endFrame: 6, sequence: { $sequence: 'dealDamage_4' } }],
  skillType: 'plungingAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: arcaneChr_0032_lizhiyan_plunging_attack_endActionGraph,
};

export const arcaneChr_0032_lizhiyan_normal_skillActionGraph = {
  main: {
    nodes: {
      spawnAbilityEntity_1: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'center' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_normal_skill',
            childSkillId: 'chr_0032_lizhiyan_normal_skill_abilityrange2',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'constant', value: 7 },
            blackboardAssignments: {
              EntityBB_wisd_greater_will: { kind: 'valueNode', nodeId: 'data_1' },
            },
          },
        },
        next: null,
      },
      ifElse_opt1: {
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
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_normal_skill: SkillDefinition = {
  key: 'chr_0032_lizhiyan_normal_skill',
  useSkillGroupIcon: true,
  element: 'nature',
  blackboard: {
    atk_scale: 2.85,
    atk_scale_will: [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    atk_scale_wisd: [2.22, 2.45, 2.67, 2.89, 3.11, 3.33, 3.56, 3.78, 4, 4.28, 4.61, 5],
    duration: 6,
    poise: 10,
    radius: 5,
  },
  timelineBlockFrames: 33,
  naturalDurationFrames: 225,
  exclusiveFrame: 32,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 24, endFrame: 56, skillIds: ['chr_0032_lizhiyan_combo_skill'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 2, sequence: { $sequence: 'spawnAbilityEntity_1' } },
    { startFrame: 0, endFrame: 16, sequence: { $sequence: 'ifElse_opt1' } },
  ],
  smartTarget: 'enemy',
  costs: [{ resource: 'sp', value: 100 }],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: arcaneChr_0032_lizhiyan_normal_skillActionGraph,
};

export const arcaneChr_0032_lizhiyan_combo_skillActionGraph = {
  main: {
    nodes: {
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      calculateActionValue_15: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'rate_final',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_2' },
            right: { kind: 'valueNode', nodeId: 'data_3' },
          },
        },
        next: null,
      },
      calculateActionValue_16: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'rate_final',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_4' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'calculateActionValue_15',
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      ifElse_19: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'calculateActionValue_15' },
          whenFalse: { $sequence: 'calculateActionValue_16' },
        },
        next: null,
      },
      calculateActionValue_20: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'rate_final',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_8' },
            right: { kind: 'valueNode', nodeId: 'data_9' },
          },
        },
        next: 'ifElse_19',
      },
      storeSourceAttributeValue_21: {
        action: {
          kind: 'storeSourceAttributeValue',
          parameters: {
            attribute: { kind: 'specific', key: 'will' },
            stage: 'armedNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'constant', value: 1 },
            base: { kind: 'constant', value: 0 },
            targetKey: 'will',
          },
        },
        next: 'calculateActionValue_20',
      },
      ifElse_22: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: 'storeSourceAttributeValue_21',
      },
      modifyActionValue_18: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'rate_final',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_3' },
          },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: null,
      },
      ifElse_27: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'modifyActionValue_18' },
          whenFalse: { $sequence: 'ifElse_22' },
        },
        next: null,
      },
      calculateActionValue_28: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'trigger_time',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_12' },
            right: { kind: 'constant', value: -0.5 },
          },
        },
        next: 'ifElse_27',
      },
      calculateActionValue_29: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'duration_final',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_13' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'calculateActionValue_28',
      },
      calculateActionValue_30: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'duration',
            operation: 'add',
            left: { kind: 'constant', value: 0 },
            right: { kind: 'valueNode', nodeId: 'data_15' },
          },
        },
        next: 'calculateActionValue_29',
      },
      ifElse_31: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'calculateActionValue_29' },
          whenFalse: { $sequence: 'calculateActionValue_30' },
        },
        next: null,
      },
      startTimeDilation_32: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.033 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: false,
            ignoredTargets: [],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          },
        },
        next: null,
      },
      setAbilityEntityRemainingDuration_33: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: {
            target: { kind: 'context', key: 'bunshin4' },
            value: { kind: 'constant', value: 0.5 },
          },
        },
        next: null,
      },
      setAbilityEntityRemainingDuration_34: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: {
            target: { kind: 'context', key: 'bunshin3' },
            value: { kind: 'constant', value: 0.5 },
          },
        },
        next: 'setAbilityEntityRemainingDuration_33',
      },
      setAbilityEntityRemainingDuration_35: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: {
            target: { kind: 'context', key: 'bunshin2' },
            value: { kind: 'constant', value: 0.5 },
          },
        },
        next: 'setAbilityEntityRemainingDuration_34',
      },
      setAbilityEntityRemainingDuration_36: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: {
            target: { kind: 'context', key: 'bunshin1' },
            value: { kind: 'constant', value: 0.5 },
          },
        },
        next: 'setAbilityEntityRemainingDuration_35',
      },
      spawnAbilityEntity_37: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'fixed', target: 'enemy' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',
            childSkillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'constant', value: 40 },
            saveToContextKey: 'bunshin4',
            blackboardAssignments: {
              EntityBB_wisd_greater_will: { kind: 'valueNode', nodeId: 'data_16' },
            },
          },
        },
        next: 'setAbilityEntityRemainingDuration_36',
      },
      spawnAbilityEntity_38: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'fixed', target: 'enemy' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',
            childSkillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'constant', value: 40 },
            saveToContextKey: 'bunshin3',
            blackboardAssignments: {
              EntityBB_wisd_greater_will: { kind: 'valueNode', nodeId: 'data_16' },
            },
          },
        },
        next: 'spawnAbilityEntity_37',
      },
      spawnAbilityEntity_39: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'fixed', target: 'enemy' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',
            childSkillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'constant', value: 40 },
            saveToContextKey: 'bunshin2',
            blackboardAssignments: {
              EntityBB_wisd_greater_will: { kind: 'valueNode', nodeId: 'data_16' },
            },
          },
        },
        next: 'spawnAbilityEntity_38',
      },
      spawnAbilityEntity_40: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'fixed', target: 'enemy' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',
            childSkillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'constant', value: 40 },
            saveToContextKey: 'bunshin1',
            blackboardAssignments: {
              EntityBB_wisd_greater_will: { kind: 'valueNode', nodeId: 'data_16' },
            },
          },
        },
        next: 'spawnAbilityEntity_39',
      },
      checkCondition_41: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_17' } },
        },
        next: 'spawnAbilityEntity_40',
      },
      setAbilityEntityRemainingDuration_43: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: {
            target: { kind: 'context', key: 'bunshin4' },
            value: { kind: 'constant', value: 30 },
          },
        },
        next: null,
      },
      setAbilityEntityRemainingDuration_44: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: {
            target: { kind: 'context', key: 'bunshin3' },
            value: { kind: 'constant', value: 30 },
          },
        },
        next: 'setAbilityEntityRemainingDuration_43',
      },
      setAbilityEntityRemainingDuration_45: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: {
            target: { kind: 'context', key: 'bunshin2' },
            value: { kind: 'constant', value: 30 },
          },
        },
        next: 'setAbilityEntityRemainingDuration_44',
      },
      setAbilityEntityRemainingDuration_46: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: {
            target: { kind: 'context', key: 'bunshin1' },
            value: { kind: 'constant', value: 30 },
          },
        },
        next: 'setAbilityEntityRemainingDuration_45',
      },
      checkCondition_42: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_18' } },
        },
        next: null,
      },
      ifElse_47: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_42' },
          whenTrue: { $sequence: 'setAbilityEntityRemainingDuration_46' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_48: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_combo_skill_precheck' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      calculateActionValue_49: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'duration_total',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_12' },
            right: { kind: 'constant', value: 0.067 },
          },
        },
        next: null,
      },
      applyBuff_50: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_total',
                copiedBlackboardAssignments: {
                  duration_total: 'duration_total',
                  duration_final: 'duration_final',
                  rate_final: 'rate_final',
                  trigger_time: 'trigger_time',
                  isWisd: 'EntityBB_wisd_greater_will',
                  atk_scale_boom: 'atk_scale_boom',
                  poise_boom: 'poise_boom',
                  radius: 'radius',
                  duration_seal2: 'duration',
                  rate_pre: 'rate_pre',
                  atk_scale_touch: 'atk_scale_touch',
                  poise_touch: 'poise_touch',
                  usp: 'usp',
                  atb_return_wisd: 'atb_return_wisd',
                },
              },
            ],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      startTimeDilation_51: {
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
      modifyActionValue_53: {
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
      findCharacterTeamTargets_54: {
        action: {
          kind: 'findCharacterTeamTargets',
          parameters: { saveToContextKey: 'mainchar', selection: { kind: 'controlledOperator' } },
        },
        next: 'modifyActionValue_53',
      },
      checkCondition_52: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
        },
        next: null,
      },
      ifElse_55: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_52' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'findCharacterTeamTargets_54' },
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
          buffIds: ['buff_chr_0032_lizhiyan_talent2'],
          operator: 'less',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'rate_final' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'rate_pre' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'max_spell_vul_will' } },
      data_5: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'rate_final', fallback: 0 },
      },
      data_6: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'max_spell_vul_will', fallback: 0 },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_5' },
          operator: 'lessOrEqual',
          right: { kind: 'valueNode', nodeId: 'data_6' },
        },
      },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'spell_vul_per_will' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'will' } },
      data_10: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will', fallback: 0 },
      },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_10' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_12: { type: 'number', expression: { kind: 'blackboard', key: 'duration_final' } },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'duration_pre' } },
      data_14: { type: 'number', expression: { kind: 'blackboard', key: 'duration' } },
      data_15: { type: 'number', expression: { kind: 'blackboard', key: 'duration_will' } },
      data_16: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
      },
      data_17: {
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
      data_18: {
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
      data_19: { type: 'boolean', expression: { kind: 'casterControlled' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_combo_skill: SkillDefinition = {
  key: 'chr_0032_lizhiyan_combo_skill',
  useSkillGroupIcon: true,
  element: 'nature',
  blackboard: {
    atb_return_wisd: [28, 28, 28, 28, 28, 28, 28, 28, 28, 30, 30, 30],
    atk_scale_boom: [0.53, 0.59, 0.64, 0.69, 0.75, 0.8, 0.85, 0.91, 0.96, 1.03, 1.11, 1.2],
    atk_scale_laser1: [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    atk_scale_laser2: [1.15, 1.27, 1.38, 1.5, 1.62, 1.73, 1.85, 1.96, 2.08, 2.22, 2.39, 2.6],
    atk_scale_touch: [0.35, 0.39, 0.42, 0.46, 0.5, 0.53, 0.57, 0.6, 0.64, 0.68, 0.73, 0.8],
    cd_reduce: 0,
    consumed_layer: 0,
    consumed_type: 0,
    duration: 4,
    duration_effect: 0,
    duration_extra: 6,
    duration_final: 0,
    duration_pre: 0.633,
    duration_seal2: 0,
    duration_total: 0,
    duration_will: 6,
    max_spell_vul_will: [0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.075, 0.075, 0.075, 0.08],
    owner_mainchar_distance: 0,
    poise_boom: 5,
    poise_laser: 0,
    poise_touch: 5,
    radius: 5.67,
    rate: 0.4,
    rate_final: 0,
    rate_pre: 0.04,
    spell_vul_per_will: 0.000125,
    trigger_time: 0,
    usp: 10,
    will: 0,
  },
  timelineBlockFrames: 24,
  naturalDurationFrames: 122,
  exclusiveFrame: 23,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 16, endFrame: 39, skillIds: ['chr_0032_lizhiyan_normal_skill'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_31' } },
    { startFrame: 9, endFrame: 10, sequence: { $sequence: 'startTimeDilation_32' } },
    { startFrame: 9, endFrame: 10, sequence: { $sequence: 'checkCondition_41' } },
    { startFrame: 9, endFrame: 12, sequence: { $sequence: 'ifElse_47' } },
    { startFrame: 0, endFrame: 11, sequence: { $sequence: 'applyBuff_48' } },
    { startFrame: 9, endFrame: 12, sequence: { $sequence: 'calculateActionValue_49' } },
    { startFrame: 9, endFrame: 30, sequence: { $sequence: 'applyBuff_50' } },
    { startFrame: 0, endFrame: 15, sequence: { $sequence: 'startTimeDilation_51' } },
    { startFrame: 0, endFrame: 15, sequence: { $sequence: 'ifElse_55' } },
  ],
  smartTarget: 'trigger',
  cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 570, 570, 570, 540],
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'comboSkill',
  actionGraph: arcaneChr_0032_lizhiyan_combo_skillActionGraph,
};

export const arcaneChr_0032_lizhiyan_ultimate_skillActionGraph = {
  main: {
    nodes: {
      startTimeDilation_1: {
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
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      hideUi_3: { action: { kind: 'hideUi', parameters: { onlyBlockInput: false } }, next: null },
      startUltimateTimeDilation_4: {
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
      finishBuffsById_5: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'source' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0032_lizhiyan_ultimate_skill_listener',
              'buff_chr_0032_lizhiyan_ultimate_skill_layer',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      setIgnoreGlobalTimeScale_6: {
        action: {
          kind: 'setIgnoreGlobalTimeScale',
          parameters: {
            abilityEntityTargets: [
              {
                kind: 'ownerSpawned',
                abilityEntityIds: [
                  'abilityentity_chr_0032_lizhiyan_ultimate_skill',
                  'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
                ],
              },
            ],
            ignore: true,
            revertOnEnd: true,
          },
        },
        next: null,
      },
      spawnAbilityEntity_7: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 7 } },
          },
        },
        next: 'setIgnoreGlobalTimeScale_6',
      },
      spawnAbilityEntity_8: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 6 } },
          },
        },
        next: 'spawnAbilityEntity_7',
      },
      spawnAbilityEntity_9: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 5 } },
          },
        },
        next: 'spawnAbilityEntity_8',
      },
      spawnAbilityEntity_10: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 4 } },
          },
        },
        next: 'spawnAbilityEntity_9',
      },
      spawnAbilityEntity_11: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 3 } },
          },
        },
        next: 'spawnAbilityEntity_10',
      },
      spawnAbilityEntity_12: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 2 } },
          },
        },
        next: 'spawnAbilityEntity_11',
      },
      spawnAbilityEntity_13: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 1 } },
          },
        },
        next: 'spawnAbilityEntity_12',
      },
      spawnAbilityEntity_14: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 0 } },
          },
        },
        next: 'spawnAbilityEntity_13',
      },
      spawnAbilityEntity_15: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: 'spawnAbilityEntity_14',
      },
      modifyActionValue_16: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'isWisd',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: 'spawnAbilityEntity_15',
      },
      finishOwner_17: {
        action: {
          kind: 'finishOwner',
          parameters: {
            targets: {
              kind: 'ownerSpawned',
              owner: { kind: 'owner' },
              objectType: 'abilityEntity',
              abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
              sameSourceSkillCast: false,
            },
          },
        },
        next: null,
      },
      applyBuff_18: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener_owner',
                copiedBlackboardAssignments: {
                  duration: 'duration',
                  isWisd: 'EntityBB_wisd_greater_will',
                },
              },
            ],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      restrictUltimateEnergyRecovery_19: {
        action: {
          kind: 'restrictUltimateEnergyRecovery',
          parameters: {
            target: 'caster',
            allowedRecoveryTags: ['Skill/Character/chr_0032_lizhiyan/special_usp'],
            clearUltimateEnergyOnEnd: false,
          },
        },
        next: null,
      },
      applyElementalInfliction_21: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'heat', isExtra: false },
        },
        next: null,
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_24: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_20' },
          whenTrue: { $sequence: 'applyElementalInfliction_21' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyElementalInfliction_23: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'electric', isExtra: false },
        },
        next: null,
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_27: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_22' },
          whenTrue: { $sequence: 'applyElementalInfliction_23' },
          whenFalse: { $sequence: 'ifElse_24' },
        },
        next: null,
      },
      applyElementalInfliction_26: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'cryo', isExtra: false },
        },
        next: null,
      },
      checkCondition_25: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_30: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_25' },
          whenTrue: { $sequence: 'applyElementalInfliction_26' },
          whenFalse: { $sequence: 'ifElse_27' },
        },
        next: null,
      },
      applyElementalInfliction_29: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'nature', isExtra: false },
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
      ifElse_31: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_28' },
          whenTrue: { $sequence: 'applyElementalInfliction_29' },
          whenFalse: { $sequence: 'ifElse_30' },
        },
        next: null,
      },
      forEachContextTarget_34: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_31' },
        },
        next: null,
      },
      applyBuff_33: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_natural_natural_corrupt_triggered',
                copiedBlackboardAssignments: { count: 'count', duration: 'duration2' },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_32: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      applyBuff_38: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_talent1_vulnerable',
                copiedBlackboardAssignments: { rate: 'spell_vul_rate', duration: 'duration_vul' },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      modifyActionValue_39: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'spell_vul_rate',
            operation: 'add',
            value: { kind: 'valueNode', nodeId: 'data_9' },
          },
        },
        next: 'applyBuff_38',
      },
      applyBuff_36: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_talent1_vulnerable',
                copiedBlackboardAssignments: {
                  rate: 'spell_vul_rate_calc',
                  duration: 'duration_vul',
                },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      modifyActionValue_37: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'spell_vul_rate_calc',
            operation: 'add',
            value: { kind: 'valueNode', nodeId: 'data_9' },
          },
        },
        next: 'applyBuff_36',
      },
      checkCondition_35: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      ifElse_41: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_35' },
          whenTrue: { $sequence: 'modifyActionValue_37' },
          whenFalse: { $sequence: 'modifyActionValue_39' },
        },
        next: null,
      },
      calculateActionValue_42: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'spell_vul_rate_calc',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_13' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'ifElse_41',
      },
      storeSourceAttributeValue_43: {
        action: {
          kind: 'storeSourceAttributeValue',
          parameters: {
            attribute: { kind: 'specific', key: 'will' },
            stage: 'armedNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'constant', value: 1 },
            base: { kind: 'constant', value: 0 },
            targetKey: 'will',
          },
        },
        next: 'calculateActionValue_42',
      },
      readBuffBlackboard_44: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'spell_vul_rate_per_will',
            outputKey: 'spell_vul_rate_per_will',
          },
        },
        next: 'storeSourceAttributeValue_43',
      },
      readBuffBlackboard_45: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'duration',
            outputKey: 'duration_vul',
          },
        },
        next: 'readBuffBlackboard_44',
      },
      checkCondition_46: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
        },
        next: 'readBuffBlackboard_45',
      },
      calculateActionValue_47: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'spell_vul_rate_calc',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_16' },
            right: { kind: 'valueNode', nodeId: 'data_9' },
          },
        },
        next: 'checkCondition_46',
      },
      readBuffBlackboard_48: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'spell_vul_rate_potential',
            outputKey: 'spell_vul_rate_potential',
          },
        },
        next: 'calculateActionValue_47',
      },
      readBuffBlackboard_49: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'spell_vul_rate',
            outputKey: 'spell_vul_rate',
          },
        },
        next: 'readBuffBlackboard_48',
      },
      checkCondition_50: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_17' } },
        },
        next: 'readBuffBlackboard_49',
      },
      dealDamage_51: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_18' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_19' },
          },
        },
        next: null,
      },
      ifElse_52: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_32' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'checkCondition_50' },
        },
        next: 'dealDamage_51',
      },
      ifElse_53: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_32' },
          whenTrue: { $sequence: 'applyBuff_33' },
          whenFalse: { $sequence: 'forEachContextTarget_34' },
        },
        next: 'ifElse_52',
      },
      applyBuff_54: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_damage_immune_ult_skill' }],
            targets: { kind: 'owner' },
            source: { kind: 'owner' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      markCurrentSkillCanDash_55: {
        action: { kind: 'markCurrentSkillCanDash', parameters: {} },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'duration_aura' } },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_7: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will', fallback: 0 },
      },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_7' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_9: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
      },
      data_10: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate_calc', fallback: 0 },
      },
      data_11: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate', fallback: 0 },
      },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_10' },
          operator: 'lessOrEqual',
          right: { kind: 'valueNode', nodeId: 'data_11' },
        },
      },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'will' } },
      data_14: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate_per_will' },
      },
      data_15: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_10' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_16: { type: 'number', expression: { kind: 'blackboard', key: 'spell_vul_rate' } },
      data_17: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_talent1'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_18: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_19: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_ultimate_skill: SkillDefinition = {
  key: 'chr_0032_lizhiyan_ultimate_skill',
  useSkillGroupIcon: true,
  element: 'nature',
  blackboard: {
    atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    atk_scale_laser: [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.41, 0.45],
    atk_scale_laser_will: [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.41, 0.45],
    count: 1,
    duration: 20,
    duration_aura: 60,
    duration_vul: 0,
    duration2: 15,
    isWisd: 1,
    lv: 0,
    poise: 10,
    radius: 30,
    spell_vul_rate: 0,
    spell_vul_rate_calc: 0,
    spell_vul_rate_per_will: 0,
    spell_vul_rate_potential: 0,
    will: 0,
  },
  timelineBlockFrames: 73,
  naturalDurationFrames: 308,
  exclusiveFrame: 72,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 48,
        endFrame: 79,
        skillIds: ['chr_0032_lizhiyan_combo_skill', 'chr_0032_lizhiyan_normal_skill'],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'startTimeDilation_1' } },
    { startFrame: 0, endFrame: 44, sequence: { $sequence: 'applyBuff_2' } },
    { startFrame: 0, endFrame: 47, sequence: { $sequence: 'hideUi_3' } },
    { startFrame: 0, endFrame: 47, sequence: { $sequence: 'startUltimateTimeDilation_4' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_5' } },
    { startFrame: 41, endFrame: 55, sequence: { $sequence: 'modifyActionValue_16' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishOwner_17' } },
    { startFrame: 47, endFrame: 50, sequence: { $sequence: 'applyBuff_18' } },
    { startFrame: 0, endFrame: 47, sequence: { $sequence: 'restrictUltimateEnergyRecovery_19' } },
    { startFrame: 47, endFrame: 47, sequence: { $sequence: 'ifElse_53' } },
    { startFrame: 0, endFrame: 72, sequence: { $sequence: 'applyBuff_54' } },
    { startFrame: 48, endFrame: 79, sequence: { $sequence: 'markCurrentSkillCanDash_55' } },
  ],
  cooldownFrames: 600,
  costs: [{ resource: 'ultimateEnergy', value: 100 }],
  enhancementStateBuffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener_owner',
  skillType: 'ultimate',
  levelSource: 'ultimate',
  nativeSkillType: 'ultimateSkill',
  actionGraph: arcaneChr_0032_lizhiyan_ultimate_skillActionGraph,
};

export const arcaneChr_0032_lizhiyan_ultimate_skill2ActionGraph = {
  main: {
    nodes: {
      modifyActionValue_4: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'spell_vul_rate',
            operation: 'add',
            value: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: null,
      },
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'spell_vul_rate',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: 'modifyActionValue_4',
      },
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'modifyActionValue_3' },
          whenFalse: { $sequence: 'modifyActionValue_4' },
        },
        next: null,
      },
      calculateActionValue_9: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'spell_vul_rate_calc',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_6' },
            right: { kind: 'valueNode', nodeId: 'data_7' },
          },
        },
        next: 'ifElse_8',
      },
      storeSourceAttributeValue_10: {
        action: {
          kind: 'storeSourceAttributeValue',
          parameters: {
            attribute: { kind: 'specific', key: 'will' },
            stage: 'armedNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'constant', value: 1 },
            base: { kind: 'constant', value: 0 },
            targetKey: 'will',
          },
        },
        next: 'calculateActionValue_9',
      },
      readBuffBlackboard_11: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'spell_vul_rate_per_will',
            outputKey: 'spell_vul_rate_per_will',
          },
        },
        next: 'storeSourceAttributeValue_10',
      },
      readBuffBlackboard_12: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'duration',
            outputKey: 'duration_vul',
          },
        },
        next: 'readBuffBlackboard_11',
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: 'readBuffBlackboard_12',
      },
      applyBuff_6: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_talent1_enhance',
                copiedBlackboardAssignments: { enhance_rate: 'enhance_rate' },
              },
            ],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: 'applyBuff_6',
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      ifElse_15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'checkCondition_7' },
          whenFalse: { $sequence: 'checkCondition_13' },
        },
        next: null,
      },
      calculateActionValue_16: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'spell_vul_rate_calc',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_13' },
            right: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: 'ifElse_15',
      },
      readBuffBlackboard_17: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'spell_vul_rate_potential',
            outputKey: 'spell_vul_rate_potential',
          },
        },
        next: 'calculateActionValue_16',
      },
      readBuffBlackboard_18: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'lv',
            outputKey: 'lv',
          },
        },
        next: 'readBuffBlackboard_17',
      },
      readBuffBlackboard_19: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'spell_vul_rate',
            outputKey: 'spell_vul_rate',
          },
        },
        next: 'readBuffBlackboard_18',
      },
      readBuffBlackboard_20: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'enhance_rate',
            outputKey: 'enhance_rate',
          },
        },
        next: 'readBuffBlackboard_19',
      },
      checkCondition_14: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
        },
        next: null,
      },
      ifElse_21: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_14' },
          whenTrue: { $sequence: 'readBuffBlackboard_20' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      startTimeDilation_22: {
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
      applyBuff_23: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      finishBuffsById_24: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'source' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0032_lizhiyan_ultimate_skill_listener',
              'buff_chr_0032_lizhiyan_ultimate_skill_layer',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      finishOwner_25: {
        action: {
          kind: 'finishOwner',
          parameters: { targets: { kind: 'context', key: 'ult_abilityentity' } },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_26: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'ult_abilityentity',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
          },
        },
        next: 'finishOwner_25',
      },
      changeSkillSlot_27: {
        action: {
          kind: 'changeSkillSlot',
          parameters: {
            skillSlotKey: 'ultimate',
            targetSkillKey: 'chr_0032_lizhiyan_ultimate_skill',
            inheritOriginSkillCooldownProgress: false,
            lifetime: 'infinite',
          },
        },
        next: null,
      },
      dealDamage_33: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_15' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_16' },
          },
        },
        next: null,
      },
      applyBuff_29: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_talent1_vulnerable',
                copiedBlackboardAssignments: { rate: 'spell_vul_rate', duration: 'duration_vul' },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_28: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_17' } },
        },
        next: null,
      },
      dealDamage_31: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_18' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_16' },
          },
        },
        next: null,
      },
      ifElse_32: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_28' },
          whenTrue: { $sequence: 'applyBuff_29' },
          whenFalse: { $sequence: null },
        },
        next: 'dealDamage_31',
      },
      checkCondition_30: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
        },
        next: null,
      },
      ifElse_34: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_30' },
          whenTrue: { $sequence: 'ifElse_32' },
          whenFalse: { $sequence: 'dealDamage_33' },
        },
        next: null,
      },
      startTimeDilation_38: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.4 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 15,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.7,
                  inTangent: -6.591719,
                  outTangent: -6.591719,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1,
                  value: 0.015,
                  inTangent: 0.03159265,
                  outTangent: 0.03159265,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.7484403,
                  value: 0.1815591,
                  inTangent: 0.9312042,
                  outTangent: 0.9312042,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.7,
                  inTangent: 2.428422,
                  outTangent: 2.428422,
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
      checkCondition_39: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_20' } },
        },
        next: 'startTimeDilation_38',
      },
      adjustSkillCooldown_42: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0032_lizhiyan_combo_skill' },
            operation: 'reduce',
            basis: 'baseDurationRatio',
            value: { kind: 'valueNode', nodeId: 'data_21' },
          },
        },
        next: null,
      },
      checkCondition_40: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_23' } },
        },
        next: null,
      },
      checkCondition_41: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_24' } },
        },
        next: 'checkCondition_40',
      },
      ifElse_43: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_41' },
          whenTrue: { $sequence: 'adjustSkillCooldown_42' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      hideUi_44: { action: { kind: 'hideUi', parameters: { onlyBlockInput: false } }, next: null },
      startUltimateTimeDilation_45: {
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
      applyBuff_46: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_damage_immune_ult_skill' }],
            targets: { kind: 'owner' },
            source: { kind: 'owner' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      applyBuff_47: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_damage_immune_medium' }],
            targets: { kind: 'owner' },
            source: { kind: 'owner' },
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
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      forEachContextTarget_opt2: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt1' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'spell_vul_rate_calc' } },
      data_3: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate_calc', fallback: 0 },
      },
      data_4: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate', fallback: 0 },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_3' },
          operator: 'lessOrEqual',
          right: { kind: 'valueNode', nodeId: 'data_4' },
        },
      },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'will' } },
      data_7: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate_per_will' },
      },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_3' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_9: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'enhance_rate', fallback: 0 },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_9' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_11: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will', fallback: 0 },
      },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_11' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'spell_vul_rate' } },
      data_14: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_talent1'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_15: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_16: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_17: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_4' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_18: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_will' } },
      data_19: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_11' },
          operator: 'equal',
          right: { kind: 'constant', value: 0 },
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
      data_21: { type: 'number', expression: { kind: 'blackboard', key: 'cd_minus' } },
      data_22: { type: 'number', expression: { kind: 'blackboard', key: 'cd_minus', fallback: 0 } },
      data_23: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_22' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_24: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_11' },
          operator: 'equal',
          right: { kind: 'constant', value: 0 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneChr_0032_lizhiyan_ultimate_skill2: SkillDefinition = {
  key: 'chr_0032_lizhiyan_ultimate_skill2',
  element: 'nature',
  blackboard: {
    atk_scale: [6.4, 7.04, 7.68, 8.32, 8.96, 9.6, 10.24, 10.88, 11.52, 12.32, 13.28, 14.4],
    atk_scale_will: [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    cd_minus: 0,
    duration_vul: 0,
    enhance_rate: 0,
    lv: 0,
    poise: 10,
    spell_vul_rate: 0,
    spell_vul_rate_calc: 0,
    spell_vul_rate_per_will: 0,
    spell_vul_rate_potential: 0,
    will: 0,
  },
  timelineBlockFrames: 76,
  naturalDurationFrames: 287,
  exclusiveFrame: 75,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 60,
        endFrame: 91,
        skillIds: ['chr_0032_lizhiyan_normal_skill', 'chr_0032_lizhiyan_combo_skill'],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 287, sequence: { $sequence: 'ifElse_21' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'startTimeDilation_22' } },
    { startFrame: 0, endFrame: 50, sequence: { $sequence: 'applyBuff_23' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_24' } },
    { startFrame: 57, endFrame: 58, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_26' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'changeSkillSlot_27' } },
    { startFrame: 58, endFrame: 58, sequence: { $sequence: 'ifElse_34' } },
    { startFrame: 58, endFrame: 59, sequence: { $sequence: 'forEachContextTarget_opt2' } },
    { startFrame: 60, endFrame: 63, sequence: { $sequence: 'checkCondition_39' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_43' } },
    { startFrame: 0, endFrame: 50, sequence: { $sequence: 'hideUi_44' } },
    { startFrame: 0, endFrame: 50, sequence: { $sequence: 'startUltimateTimeDilation_45' } },
    { startFrame: 0, endFrame: 59, sequence: { $sequence: 'applyBuff_46' } },
    { startFrame: 59, endFrame: 75, sequence: { $sequence: 'applyBuff_47' } },
  ],
  cooldownFrames: 300,
  costs: [{ resource: 'ultimateEnergy', value: 100 }],
  icon: 'endaxis:operators/arcane/ultimate_03',
  skillType: 'ultimate',
  levelSource: 'ultimate',
  nativeSkillType: 'normalSkill',
  actionGraph: arcaneChr_0032_lizhiyan_ultimate_skill2ActionGraph,
};

export const arcaneCommon_character_perfect_dodgeActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const arcaneCommon_character_perfect_dodge: SkillDefinition = {
  actionGraph: arcaneCommon_character_perfect_dodgeActionGraph,
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

const arcanePassive1ActionGraph = {
  main: {
    nodes: {
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_wisd_greater_will',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      modifyActionValue_2: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_wisd_greater_will',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
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
      ifElse_5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'modifyActionValue_2' },
          whenFalse: { $sequence: 'modifyActionValue_3' },
        },
        next: null,
      },
      applyBuff_6: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_passive' }],
            targets: { kind: 'fixed', target: 'caster' },
            inheritSourceSkillCastInfo: false,
          },
        },
        next: 'ifElse_5',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'deckAttributeCompare',
          left: 'intellect',
          operator: 'greaterOrEqual',
          right: 'will',
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcanePassive1: OperatorPassiveSkillDefinition = {
  key: 'chr_0032_lizhiyan_passive',
  enableSequence: { $sequence: 'applyBuff_6' },
  actionGraph: arcanePassive1ActionGraph,
};

const arcanePassive2ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_talent1',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  enhance_rate: { kind: 'valueNode', nodeId: 'data_2' },
                  lv: { kind: 'valueNode', nodeId: 'data_3' },
                  spell_vul_rate: { kind: 'valueNode', nodeId: 'data_4' },
                  spell_vul_rate_per_will: { kind: 'valueNode', nodeId: 'data_5' },
                  spell_vul_rate_potential: { kind: 'valueNode', nodeId: 'data_6' },
                },
              },
            ],
            targets: { kind: 'fixed', target: 'caster' },
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'duration' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'enhance_rate' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'lv' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'spell_vul_rate' } },
      data_5: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate_per_will' },
      },
      data_6: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcanePassive2: OperatorPassiveSkillDefinition = {
  key: 'chr_0032_lizhiyan_talent1',
  blackboard: {
    duration: [10, 10],
    enhance_rate: [0, 0.24],
    lv: [1, 2],
    spell_vul_rate: [0, 0.128],
    spell_vul_rate_per_will: [0, 0.0002],
    spell_vul_rate_potential: [0, 0],
  },
  enableSequence: { $sequence: 'applyBuff_1' },
  actionGraph: arcanePassive2ActionGraph,
};

const arcaneComboCondition1ActionGraph = {
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
        expression: { kind: 'eventInflictionElementIn', elements: ['nature'] },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetObjectTypeMatch',
          contextKey: 'trigger',
          objectTypes: ['enemy'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneComboCondition1: ComboSkillConditionDefinition = {
  key: 'native-combo:0',
  skillKey: 'chr_0032_lizhiyan_combo_skill',
  event: 'beforeTakeInfliction',
  immediately: false,
  initialValues: { consumed_layer: 0, consumed_type: 0 },
  sequence: { $sequence: 'checkCondition_2' },
  actionGraph: arcaneComboCondition1ActionGraph,
};

const arcaneComboCondition2ActionGraph = {
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
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'checkCondition_2',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetBuffStackCompare',
          contextKey: 'trigger',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: { kind: 'eventInflictionElementIn', elements: ['heat'] },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetObjectTypeMatch',
          contextKey: 'trigger',
          objectTypes: ['enemy'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneComboCondition2: ComboSkillConditionDefinition = {
  key: 'native-combo:1',
  skillKey: 'chr_0032_lizhiyan_combo_skill',
  event: 'beforeTakeInfliction',
  immediately: false,
  initialValues: { consumed_layer: 0, consumed_type: 0 },
  sequence: { $sequence: 'checkCondition_3' },
  actionGraph: arcaneComboCondition2ActionGraph,
};

const arcaneComboCondition3ActionGraph = {
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
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'checkCondition_2',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetBuffStackCompare',
          contextKey: 'trigger',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: { kind: 'eventInflictionElementIn', elements: ['electric'] },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetObjectTypeMatch',
          contextKey: 'trigger',
          objectTypes: ['enemy'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneComboCondition3: ComboSkillConditionDefinition = {
  key: 'native-combo:2',
  skillKey: 'chr_0032_lizhiyan_combo_skill',
  event: 'beforeTakeInfliction',
  immediately: false,
  initialValues: { consumed_layer: 0, consumed_type: 0 },
  sequence: { $sequence: 'checkCondition_3' },
  actionGraph: arcaneComboCondition3ActionGraph,
};

const arcaneComboCondition4ActionGraph = {
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
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'checkCondition_2',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetBuffStackCompare',
          contextKey: 'trigger',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: { kind: 'eventInflictionElementIn', elements: ['cryo'] },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetObjectTypeMatch',
          contextKey: 'trigger',
          objectTypes: ['enemy'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneComboCondition4: ComboSkillConditionDefinition = {
  key: 'native-combo:3',
  skillKey: 'chr_0032_lizhiyan_combo_skill',
  event: 'beforeTakeInfliction',
  immediately: false,
  initialValues: { consumed_layer: 0, consumed_type: 0 },
  sequence: { $sequence: 'checkCondition_3' },
  actionGraph: arcaneComboCondition4ActionGraph,
};

const arcaneComboCondition5ActionGraph = {
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
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'checkCondition_1',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'eventInflictionElementIn',
          elements: ['heat', 'electric', 'cryo', 'nature'],
          outputKey: 'EntityBB_consumed_type',
        },
      },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will', fallback: 0 },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'less',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneComboCondition5: ComboSkillConditionDefinition = {
  key: 'native-combo:4',
  skillKey: 'chr_0032_lizhiyan_combo_skill',
  event: 'beforeTakeInfliction',
  immediately: false,
  initialValues: { consumed_layer: 0, consumed_type: 0 },
  sequence: { $sequence: 'checkCondition_2' },
  actionGraph: arcaneComboCondition5ActionGraph,
};

const arcaneBuff1ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff1: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  triggerIntervalSeconds: 0,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: arcaneBuff1ActionGraph,
};

const arcaneBuff2ActionGraph = {
  main: {
    nodes: {
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable_pre',
                copiedBlackboardAssignments: { duration_vul: 'duration', rate: 'rate_pre' },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      ifElse_3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'applyBuff_2' },
          whenFalse: { $sequence: 'applyBuff_2' },
        },
        next: null,
      },
      forEachContextTarget_4: {
        action: {
          kind: 'forEachContextTarget',
          parameters: {
            targets: {
              kind: 'ownerSpawned',
              owner: { kind: 'source' },
              objectType: 'abilityEntity',
              abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
              sameSourceSkillCast: true,
            },
          },
          body: { $sequence: null },
        },
        next: null,
      },
      withActionBlackboardScope_8: {
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
          body: { $sequence: 'forEachContextTarget_4' },
        },
        next: null,
      },
      withActionBlackboardScope_9: {
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
          body: { $sequence: 'ifElse_3' },
        },
        next: 'withActionBlackboardScope_8',
      },
      startCurrentAbilityEntityChildSkillById_5: {
        action: {
          kind: 'startCurrentAbilityEntityChildSkillById',
          parameters: { childSkillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_end' },
        },
        next: null,
      },
      forEachContextTarget_6: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'bunshin' } },
          body: { $sequence: 'startCurrentAbilityEntityChildSkillById_5' },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_7: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'bunshin',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
            sameSourceSkillCast: true,
          },
        },
        next: 'forEachContextTarget_6',
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff2: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  triggerIntervalSeconds: { blackboardKey: 'trigger_time' },
  waitFirstTriggerInterval: true,
  maxTriggerCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 5, isWisd: 0, rate_pre: 0.1, trigger_time: 0 },
  attributeModifiers: [],
  lifecycleSequences: {
    enable: { $sequence: 'withActionBlackboardScope_9' },
    trigger: { $sequence: 'findOwnerSpawnedAbilityEntities_7' },
  },
  actionGraph: arcaneBuff2ActionGraph,
};

const arcaneBuff3ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff3: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 0.1,
  triggerIntervalSeconds: 0,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: arcaneBuff3ActionGraph,
};

const arcaneBuff4ActionGraph = {
  main: {
    nodes: {
      finishCurrentBuff_1: {
        action: {
          kind: 'finishCurrentBuff',
          parameters: { reason: 'early', finishSource: 'actionSource' },
        },
        next: null,
      },
      createTimedMarker_2: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'source' },
            markerId: 'lizhiyan_combo_hit',
            durationSeconds: { kind: 'constant', value: 0.1 },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: 'finishCurrentBuff_1',
      },
      dealDamage_3: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: 'createTimedMarker_2',
      },
      changeResource_4: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_3' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'default',
          },
        },
        next: 'dealDamage_3',
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'changeResource_4',
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'checkCondition_5',
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'checkCondition_6',
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'checkCondition_7',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_early_finish' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'poise_early_finish' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return_wisd' } },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['normalSkill'] },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'actionInputTargetIdentityMatch',
          other: 'actionSource',
          operator: 'equal',
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal_atb'],
          operator: 'less',
          value: { kind: 'constant', value: 1 },
          sameSourceSkillCast: true,
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal2'],
          operator: 'less',
          value: { kind: 'constant', value: 1 },
          sameSourceSkillCast: true,
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff4: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  triggerIntervalSeconds: 0,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    atb_return_wisd: 10,
    atk_scale_early_finish: 1,
    poise_early_finish: 1,
    radius_early_finish: 5.67,
  },
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'beforeTakeDamage', priority: 0, sequence: { $sequence: 'checkCondition_8' } },
  ],
  actionGraph: arcaneBuff4ActionGraph,
};

const arcaneBuff5ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff5: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: arcaneBuff5ActionGraph,
};

const arcaneBuff6ActionGraph = {
  main: {
    nodes: {
      createTimedMarker_1: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'source' },
            markerId: 'lizhiyan_combo_hit',
            durationSeconds: { kind: 'constant', value: 0.1 },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: null,
      },
      dealDamage_2: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: 'createTimedMarker_1',
      },
      startTimeDilation_3: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.55 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 15,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.5,
                  inTangent: -6.042728,
                  outTangent: -6.042728,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1,
                  value: 0.015,
                  inTangent: 0.03159265,
                  outTangent: 0.03159265,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.85,
                  value: 0.18,
                  inTangent: 0.5393099,
                  outTangent: 0.5393099,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.7,
                  inTangent: 4.793082,
                  outTangent: 4.793082,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: [],
            abilityEntityTargets: [{ kind: 'context', contextKey: 'bunshin' }],
          },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_4: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'bunshin',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
            sameSourceSkillCast: true,
          },
        },
        next: 'startTimeDilation_3',
      },
      finishBuffsById_5: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable'],
            reason: 'other',
          },
        },
        next: null,
      },
      forEachContextTarget_6: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'finishBuffsById_5' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_laser2' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'poise_final' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff6: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 5,
  triggerIntervalSeconds: 0,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale_laser2: 0, cd_reduce: 7, isWisd: 0, poise_final: 10, radius: 5 },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 0, endFrame: 6, sequence: { $sequence: 'dealDamage_2' } },
    { startFrame: 1, endFrame: 4, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_4' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'forEachContextTarget_6' } },
  ],
  actionGraph: arcaneBuff6ActionGraph,
};

const arcaneBuff7ActionGraph = {
  main: {
    nodes: {
      spawnAbilityEntity_1: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill_place',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'constant', value: 2 },
            saveToContextKey: 'laser_root',
          },
        },
        next: null,
      },
      findCharacterTeamTargets_2: {
        action: {
          kind: 'findCharacterTeamTargets',
          parameters: { saveToContextKey: 'mainchar', selection: { kind: 'controlledOperator' } },
        },
        next: 'spawnAbilityEntity_1',
      },
      dealDamage_3: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          },
        },
        next: null,
      },
      createTimedMarker_7: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'source' },
            markerId: 'lizhiyan_combo_hit',
            durationSeconds: { kind: 'constant', value: 0.1 },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: null,
      },
      dealDamage_8: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_3' },
          },
        },
        next: 'createTimedMarker_7',
      },
      findOwnerSpawnedAbilityEntities_9: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'bunshin',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
            sameSourceSkillCast: true,
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
            priority: 15,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.6,
                  inTangent: -5.656393,
                  outTangent: -5.656393,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1,
                  value: 0.015,
                  inTangent: 0.03159265,
                  outTangent: 0.03159265,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.85,
                  value: 0.18,
                  inTangent: 0.5393099,
                  outTangent: 0.5393099,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.7,
                  inTangent: 4.793082,
                  outTangent: 4.793082,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: [],
            abilityEntityTargets: [{ kind: 'context', contextKey: 'bunshin' }],
          },
        },
        next: null,
      },
      startTimeDilation_11: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.55 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 15,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.6,
                  inTangent: -5.656393,
                  outTangent: -5.656393,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1,
                  value: 0.015,
                  inTangent: 0.03159265,
                  outTangent: 0.03159265,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.85,
                  value: 0.18,
                  inTangent: 0.5393099,
                  outTangent: 0.5393099,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.7,
                  inTangent: 4.793082,
                  outTangent: 4.793082,
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
        next: 'startTimeDilation_10',
      },
      findOwnerSpawnedAbilityEntities_12: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'bunshin',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
            sameSourceSkillCast: true,
          },
        },
        next: 'startTimeDilation_11',
      },
      finishBuffsById_13: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable'],
            reason: 'other',
          },
        },
        next: null,
      },
      forEachContextTarget_14: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'finishBuffsById_13' },
        },
        next: null,
      },
      createTimedMarker_16: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'source' },
            markerId: 'lizhiyan_combo_wisd_has_finish',
            durationSeconds: { kind: 'constant', value: 1 },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: null,
      },
      triggerCustomAbilityEvent_15: {
        action: {
          kind: 'triggerCustomAbilityEvent',
          parameters: {
            eventName: 'lizhiyan_combo_wisd_end',
            eventParam: 0,
            target: 'caster',
            source: 'currentAbilityEntity',
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_laser1' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_laser2' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'poise_final' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff7: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 3,
  triggerIntervalSeconds: 0,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    atb_return_wisd: 0,
    atk_scale_laser1: 0.5,
    atk_scale_laser2: 3,
    cd_reduce: 7,
    isWisd: 0,
    poise_final: 10,
    radius: 5.67,
  },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findCharacterTeamTargets_2' } },
    { startFrame: 2, endFrame: 4, sequence: { $sequence: 'dealDamage_3' } },
    { startFrame: 5, endFrame: 7, sequence: { $sequence: 'dealDamage_3' } },
    { startFrame: 8, endFrame: 10, sequence: { $sequence: 'dealDamage_3' } },
    { startFrame: 11, endFrame: 13, sequence: { $sequence: 'dealDamage_3' } },
    { startFrame: 17, endFrame: 23, sequence: { $sequence: 'dealDamage_8' } },
    { startFrame: 11, endFrame: 14, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_9' } },
    { startFrame: 18, endFrame: 21, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_12' } },
    { startFrame: 17, endFrame: 20, sequence: { $sequence: 'forEachContextTarget_14' } },
  ],
  lifecycleSequences: {
    start: { $sequence: 'createTimedMarker_16' },
    finish: { $sequence: 'triggerCustomAbilityEvent_15' },
  },
  actionGraph: arcaneBuff7ActionGraph,
};

const arcaneBuff8ActionGraph = {
  main: {
    nodes: {
      startCurrentAbilityEntityChildSkillById_1: {
        action: {
          kind: 'startCurrentAbilityEntityChildSkillById',
          parameters: { childSkillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_seal_again' },
        },
        next: null,
      },
      finishCurrentBuff_2: {
        action: {
          kind: 'finishCurrentBuff',
          parameters: { reason: 'other', finishSource: 'actionSource' },
        },
        next: null,
      },
      forEachContextTarget_3: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'bunshin' } },
          body: { $sequence: 'startCurrentAbilityEntityChildSkillById_1' },
        },
        next: 'finishCurrentBuff_2',
      },
      findOwnerSpawnedAbilityEntities_4: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'bunshin',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
            sameSourceSkillCast: true,
          },
        },
        next: 'forEachContextTarget_3',
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'findOwnerSpawnedAbilityEntities_4',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: [
            'buff_chr_0032_lizhiyan_combo_skill_seal',
            'buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener',
          ],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff8: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale_early_finish: 5,
    atk_scale_wisd_ratio: 0,
    duration: 5,
    duration_extra: 0,
    poise_early_finish: 5,
    radius: 5.67,
    radius_early_finish: 5.67,
    wisd_greater_will: 0,
  },
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'buffEndsEarly', priority: 0, sequence: { $sequence: 'checkCondition_5' } },
  ],
  actionGraph: arcaneBuff8ActionGraph,
};

const arcaneBuff9ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_listener',
                copiedBlackboardAssignments: {
                  duration: 'duration_final',
                  wisd_greater_will: 'EntityBB_wisd_greater_will',
                  atk_scale_early_finish: 'atk_scale_boom',
                  poise_early_finish: 'poise_boom',
                },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
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
                buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal',
                copiedBlackboardAssignments: {
                  duration: 'duration_final',
                  rate_pre: 'rate_final',
                  trigger_time: 'trigger_time',
                  isWisd: 'EntityBB_wisd_greater_will',
                },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'applyBuff_1',
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_combo_skill_precheck' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      applyElementalInfliction_21: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'heat', isExtra: false },
        },
        next: null,
      },
      applyElementalInfliction_20: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'electric', isExtra: false },
        },
        next: null,
      },
      applyElementalInfliction_19: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'cryo', isExtra: false },
        },
        next: null,
      },
      applyElementalInfliction_18: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'nature', isExtra: false },
        },
        next: null,
      },
      switch_23: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_1' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'applyElementalInfliction_18' },
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'applyElementalInfliction_19' },
            },
            {
              value: { kind: 'constant', value: 1 },
              sequence: { $sequence: 'applyElementalInfliction_20' },
            },
            {
              value: { kind: 'constant', value: 0 },
              sequence: { $sequence: 'applyElementalInfliction_21' },
            },
          ],
        },
        next: null,
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      dealDamage_26: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_4' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_5' },
          },
        },
        next: null,
      },
      changeResource_29: {
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
      checkCondition_28: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      startTimeDilation_31: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.2 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      checkCondition_30: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      ifElse_38: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_30' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'startTimeDilation_31' },
        },
        next: null,
      },
      ifElse_39: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_28' },
          whenTrue: { $sequence: 'changeResource_29' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_38',
      },
      calculateActionValue_44: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'duration_effect',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_9' },
            right: { kind: 'constant', value: -0.2 },
          },
        },
        next: null,
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'dealDamage_26' },
          whenFalse: { $sequence: 'dealDamage_26' },
        },
        next: null,
      },
      forEachContextTarget_opt2: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt1' },
        },
        next: 'ifElse_39',
      },
      applyBuff_opt3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal2',
                copiedBlackboardAssignments: {
                  duration: 'duration_seal2',
                  isWisd: 'EntityBB_wisd_greater_will',
                  rate_pre: 'rate_pre',
                  atk_scale_early_finish: 'atk_scale_boom',
                  poise_early_finish: 'poise_boom',
                  atb_return_wisd: 'atb_return_wisd',
                },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'forEachContextTarget_opt2',
      },
      ifElse_opt4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_22' },
          whenTrue: { $sequence: 'switch_23' },
          whenFalse: { $sequence: null },
        },
        next: 'applyBuff_opt3',
      },
      ifElse_opt5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'ifElse_opt4' },
          whenFalse: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'EntityBB_consumed_type' } },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will', fallback: 0 },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'less',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_touch' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'poise_touch' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
      data_7: {
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
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'duration_final' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff9: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration_total' },
  timeClock: 'global',
  applyTags: [],
  extendTags: [],
  blackboard: {
    atb_return_wisd: 0,
    atk_scale_boom: 0,
    atk_scale_touch: 0,
    duration_effect: 0,
    duration_final: 0,
    duration_seal2: 0,
    duration_total: 5,
    isWisd: 0,
    poise_boom: 0,
    poise_touch: 0,
    radius: 5.67,
    rate_final: 0,
    rate_pre: 0,
    trigger_time: 0.1,
    usp: 0,
  },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 2, endFrame: 21, sequence: { $sequence: 'applyBuff_2' } },
    { startFrame: 0, endFrame: 2, sequence: { $sequence: 'applyBuff_3' } },
    { startFrame: 6, endFrame: 9, sequence: { $sequence: 'ifElse_opt5' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'calculateActionValue_44' } },
  ],
  actionGraph: arcaneBuff9ActionGraph,
};

const arcaneBuff10ActionGraph = {
  main: {
    nodes: {
      finishCurrentBuff_1: {
        action: {
          kind: 'finishCurrentBuff',
          parameters: { reason: 'early', finishSource: 'actionSource' },
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
              'buff_chr_0032_lizhiyan_combo_skill_seal',
              'buff_chr_0032_lizhiyan_combo_skill_seal_effect',
            ],
            reason: 'early',
          },
        },
        next: 'finishCurrentBuff_1',
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_atb' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'finishBuffsById_2',
      },
      dealDamage_4: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'nature',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: 'applyBuff_3',
      },
      changeResource_5: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_3' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'default',
          },
        },
        next: 'dealDamage_4',
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'changeResource_5',
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'checkCondition_6',
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'checkCondition_7',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_early_finish' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'poise_early_finish' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return_wisd' } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'actionInputTargetIdentityMatch',
          other: 'actionSource',
          operator: 'equal',
        },
      },
      data_5: {
        type: 'boolean',
        expression: { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['normalSkill'] },
      },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'isWisd', fallback: 0 } },
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

const arcaneBuff10: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_lizhiyan_combo_seal',
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
    nameKey: 'effects.name.imprisonment',
  },
  applyTags: ['Skill/Character/chr_0032_lizhiyan/combo_seal'],
  extendTags: [],
  blackboard: {
    atb_return_wisd: 0,
    atk_scale_early_finish: 1,
    duration: 5,
    isWisd: 1,
    poise_early_finish: 1,
    radius_early_finish: 5.67,
    rate_pre: 0.1,
    trigger_time: 0,
  },
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'beforeTakeDamage', priority: 0, sequence: { $sequence: 'checkCondition_8' } },
  ],
  actionGraph: arcaneBuff10ActionGraph,
};

const arcaneBuff11ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_vulnerable_crystal',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  rate: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {
                  child_buff_id: 'buff_common_affixes_vulnerable_crystal_lizhiyan_child',
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
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_vulnerable_natural',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  rate: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {
                  child_buff_id: 'buff_common_affixes_vulnerable_natural_lizhiyan_child',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: 'applyBuff_1',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'duration_vul' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'rate' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff11: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration_vul' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_lizhiyan_combo_vulnerable',
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale_calc: 0,
    atk_scale_laser1: 0,
    atk_scale_laser2: 0,
    cd_reduce: 7,
    duration_vul: 6,
    isWisd: 0,
    poise_final: 0,
    rate: 0.2,
  },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_2' } },
  actionGraph: arcaneBuff11ActionGraph,
};

const arcaneBuff12ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_vulnerable_crystal',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  rate: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {
                  child_buff_id: 'buff_common_affixes_vulnerable_crystal_lizhiyan_child',
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
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_vulnerable_natural',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  rate: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {
                  child_buff_id: 'buff_common_affixes_vulnerable_natural_lizhiyan_child',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: 'applyBuff_1',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'duration_vul' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'rate' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff12: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration_vul' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_lizhiyan_combo_vulnerable',
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration_vul: 6, isWisd: 0, rate: 0.2 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_2' } },
  actionGraph: arcaneBuff12ActionGraph,
};

const arcaneBuff13ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_normal_skill_listener' }],
            targets: { kind: 'source' },
            source: { kind: 'owner' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff13: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'beforeTakeInfliction', priority: 0, sequence: { $sequence: 'applyBuff_1' } },
  ],
  actionGraph: arcaneBuff13ActionGraph,
};

const arcaneBuff14ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff14: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 0.5,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: arcaneBuff14ActionGraph,
};

const arcaneBuff15ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      modifyActionValue_2: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_wisd_greater_will',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_wisd_greater_will',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      ifElse_4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'modifyActionValue_2' },
          whenFalse: { $sequence: 'modifyActionValue_3' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'deckAttributeCompare',
          left: 'intellect',
          operator: 'greaterOrEqual',
          right: 'will',
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff15: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 3,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'ifElse_4' } },
  actionGraph: arcaneBuff15ActionGraph,
};

const arcaneBuff16ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff16: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 3,
  applyTags: [],
  extendTags: [],
  blackboard: {
    duration: 10,
    enhance_rate: 0.1,
    lv: 2,
    spell_vul_rate: 0.1,
    spell_vul_rate_per_will: 0,
    spell_vul_rate_potential: 0,
  },
  attributeModifiers: [],
  actionGraph: arcaneBuff16ActionGraph,
};

const arcaneBuff17ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_enhance_spell',
                blackboardAssignments: {
                  duration: { kind: 'constant', value: -1 },
                  rate: { kind: 'valueNode', nodeId: 'data_1' },
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'owner' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'enhance_rate' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff17: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { enhance_rate: 0.1 },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'applyBuff_1' } },
  actionGraph: arcaneBuff17ActionGraph,
};

const arcaneBuff18ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_vulnerable_crystal',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  rate: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {
                  child_buff_id: 'buff_common_affixes_vulnerable_crystal_lizhiyan_child',
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
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_vulnerable_natural',
                blackboardAssignments: {
                  duration: { kind: 'valueNode', nodeId: 'data_1' },
                  rate: { kind: 'valueNode', nodeId: 'data_2' },
                },
                stringBlackboardAssignments: {
                  child_buff_id: 'buff_common_affixes_vulnerable_natural_lizhiyan_child',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: 'applyBuff_1',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'duration' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'rate' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff18: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_lizhiyan_combo_vulnerable',
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 0, rate: 0 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_2' } },
  actionGraph: arcaneBuff18ActionGraph,
};

const arcaneBuff19ActionGraph = {
  main: {
    nodes: {
      finishOwner_1: {
        action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff19: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 1.5,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  lifecycleSequences: { finish: { $sequence: 'finishOwner_1' } },
  actionGraph: arcaneBuff19ActionGraph,
};

const arcaneBuff20ActionGraph = {
  main: {
    nodes: {
      calculateActionValue_1: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'usp_step',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_1' },
            right: { kind: 'constant', value: 2 },
          },
        },
        next: null,
      },
      storeSourceAttributeValue_2: {
        action: {
          kind: 'storeSourceAttributeValue',
          parameters: {
            attribute: { kind: 'specific', key: 'maxUltimateEnergy' },
            stage: 'armedNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'constant', value: 1 },
            base: { kind: 'constant', value: 0 },
            targetKey: 'usp_step',
          },
        },
        next: 'calculateActionValue_1',
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_target_mark',
                copiedBlackboardAssignments: {
                  atk_scale_laser: 'atk_scale_laser',
                  usp_step: 'usp_step',
                },
              },
            ],
            targets: { kind: 'context', key: 'ult_death' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      spawnAbilityEntity_4: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_death',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'constant', value: 0.2 },
            saveToContextKey: 'ult_death',
          },
        },
        next: 'applyBuff_3',
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'spawnAbilityEntity_4',
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'checkCondition_5',
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_6',
      },
      changeResource_18: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_1' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            ultimateRecoveryTag: 'Skill/Character/chr_0032_lizhiyan/special_usp',
            ignoreUltimateEnergyGainMultiplier: true,
          },
        },
        next: null,
      },
      applyBuff_19: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser2',
                copiedBlackboardAssignments: { atk_scale_laser: 'atk_scale_laser' },
              },
            ],
            targets: { kind: 'context', key: 'laser_target2' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'changeResource_18',
      },
      spawnAbilityEntity_20: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            saveToContextKey: 'laser_target2',
          },
        },
        next: 'applyBuff_19',
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_25: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'spawnAbilityEntity_20' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_23: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser1',
                copiedBlackboardAssignments: { atk_scale_laser: 'atk_scale_laser' },
              },
            ],
            targets: { kind: 'context', key: 'laser_target1' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'changeResource_18',
      },
      spawnAbilityEntity_24: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            saveToContextKey: 'laser_target1',
          },
        },
        next: 'applyBuff_23',
      },
      checkCondition_21: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      applyBuff_26: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_layer' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_27: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_21' },
          whenTrue: { $sequence: 'spawnAbilityEntity_24' },
          whenFalse: { $sequence: 'ifElse_25' },
        },
        next: 'applyBuff_26',
      },
      findOwnerSpawnedAbilityEntities_28: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'ult_aura',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
          },
        },
        next: 'ifElse_27',
      },
      modifyActionValue_29: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'is_power_attacked',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'findOwnerSpawnedAbilityEntities_28',
      },
      createTimedMarker_30: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'source' },
            markerId: 'chr_0032_lizhiyan_ultimate_count',
            durationSeconds: { kind: 'constant', value: 0.4 },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: 'modifyActionValue_29',
      },
      checkCondition_31: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: 'createTimedMarker_30',
      },
      checkCondition_32: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: 'checkCondition_31',
      },
      checkCondition_33: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: 'checkCondition_32',
      },
      checkCondition_34: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: 'checkCondition_33',
      },
      checkCondition_35: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_13' } },
        },
        next: 'checkCondition_34',
      },
      modifyActionValue_36: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'is_power_attacked',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'usp_step' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageTagsMatch',
          match: 'hasAny',
          tags: ['normalAttackLastCombo'],
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: {
            kind: 'ownerSpawned',
            owner: { kind: 'source' },
            objectType: 'abilityEntity',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
            sameSourceSkillCast: false,
          },
          distance: 60,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'actionInputTargetIdentityMatch',
          other: 'controlledOperator',
          operator: 'equal',
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffSource',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
          operator: 'lessOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffSource',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
          operator: 'lessOrEqual',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'timedMarkerPresent',
          target: 'buffSource',
          markerId: 'chr_0032_lizhiyan_ultimate_count',
        },
      },
      data_8: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_7' } },
      },
      data_9: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'is_power_attacked', fallback: 0 },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_9' },
          operator: 'equal',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_11: {
        type: 'boolean',
        expression: { kind: 'eventDamageTagsMatch', match: 'hasAny', tags: ['powerAttack'] },
      },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: {
            kind: 'ownerSpawned',
            owner: { kind: 'source' },
            objectType: 'abilityEntity',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
            sameSourceSkillCast: false,
          },
          distance: 60,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_13: {
        type: 'boolean',
        expression: {
          kind: 'actionInputTargetIdentityMatch',
          other: 'controlledOperator',
          operator: 'equal',
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff20: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale_laser: 0.5, is_power_attacked: 0, usp_step: 0 },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'storeSourceAttributeValue_2' } },
  abilityEventResponses: [
    { event: 'beforeTakeDamage', priority: 0, sequence: { $sequence: 'checkCondition_7' } },
    { event: 'beforeTakeDamage', priority: 0, sequence: { $sequence: 'checkCondition_35' } },
    { event: 'poiseZero', priority: 0, sequence: { $sequence: 'modifyActionValue_36' } },
  ],
  actionGraph: arcaneBuff20ActionGraph,
};

const arcaneBuff21ActionGraph = {
  main: {
    nodes: {
      findOwnerSpawnedAbilityEntities_1: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'placesorted',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill_place'],
            circularOrder: {
              indexBlackboardKey: 'EntityBB_index',
              desiredCount: 8,
              reverseFlag: 1,
            },
          },
        },
        next: null,
      },
      pickContextTarget_2: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'fifth',
            index: { kind: 'constant', value: 4 },
          },
        },
        next: null,
      },
      pickContextTarget_3: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'forth',
            index: { kind: 'constant', value: 3 },
          },
        },
        next: 'pickContextTarget_2',
      },
      pickContextTarget_4: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'third',
            index: { kind: 'constant', value: 2 },
          },
        },
        next: 'pickContextTarget_3',
      },
      pickContextTarget_5: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'second',
            index: { kind: 'constant', value: 1 },
          },
        },
        next: 'pickContextTarget_4',
      },
      pickContextTarget_6: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'first',
            index: { kind: 'constant', value: 0 },
          },
        },
        next: 'pickContextTarget_5',
      },
      mergeContextTargets_7: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'fifth', sources: [] },
        },
        next: 'pickContextTarget_6',
      },
      mergeContextTargets_8: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'forth', sources: [] },
        },
        next: 'mergeContextTargets_7',
      },
      mergeContextTargets_9: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'third', sources: [] },
        },
        next: 'mergeContextTargets_8',
      },
      mergeContextTargets_10: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'second', sources: [] },
        },
        next: 'mergeContextTargets_9',
      },
      mergeContextTargets_11: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'first', sources: [] },
        },
        next: 'mergeContextTargets_10',
      },
      spawnAbilityEntity_12: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'first' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'currentAbilityEntity',
          },
        },
        next: null,
      },
      spawnAbilityEntity_13: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'second' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'currentAbilityEntity',
          },
        },
        next: null,
      },
      spawnAbilityEntity_14: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'third' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'currentAbilityEntity',
          },
        },
        next: null,
      },
      spawnAbilityEntity_15: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'forth' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'currentAbilityEntity',
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff21: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 2,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale_laser: 10, trigger_time: 0 },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'mergeContextTargets_11' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'spawnAbilityEntity_12' } },
    { startFrame: 4, endFrame: 7, sequence: { $sequence: 'spawnAbilityEntity_13' } },
    { startFrame: 8, endFrame: 11, sequence: { $sequence: 'spawnAbilityEntity_14' } },
    { startFrame: 12, endFrame: 15, sequence: { $sequence: 'spawnAbilityEntity_15' } },
  ],
  actionGraph: arcaneBuff21ActionGraph,
};

const arcaneBuff22ActionGraph = {
  main: {
    nodes: {
      findOwnerSpawnedAbilityEntities_1: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'placesorted',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill_place'],
            circularOrder: {
              indexBlackboardKey: 'EntityBB_index',
              desiredCount: 8,
              reverseFlag: -1,
            },
          },
        },
        next: null,
      },
      pickContextTarget_2: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'fifth',
            index: { kind: 'constant', value: 4 },
          },
        },
        next: null,
      },
      pickContextTarget_3: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'forth',
            index: { kind: 'constant', value: 3 },
          },
        },
        next: 'pickContextTarget_2',
      },
      pickContextTarget_4: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'third',
            index: { kind: 'constant', value: 2 },
          },
        },
        next: 'pickContextTarget_3',
      },
      pickContextTarget_5: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'second',
            index: { kind: 'constant', value: 1 },
          },
        },
        next: 'pickContextTarget_4',
      },
      pickContextTarget_6: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'placesorted',
            saveToContextKey: 'first',
            index: { kind: 'constant', value: 0 },
          },
        },
        next: 'pickContextTarget_5',
      },
      mergeContextTargets_7: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'fifth', sources: [] },
        },
        next: 'pickContextTarget_6',
      },
      mergeContextTargets_8: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'forth', sources: [] },
        },
        next: 'mergeContextTargets_7',
      },
      mergeContextTargets_9: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'third', sources: [] },
        },
        next: 'mergeContextTargets_8',
      },
      mergeContextTargets_10: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'second', sources: [] },
        },
        next: 'mergeContextTargets_9',
      },
      mergeContextTargets_11: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'first', sources: [] },
        },
        next: 'mergeContextTargets_10',
      },
      spawnAbilityEntity_12: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'first' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'currentAbilityEntity',
          },
        },
        next: null,
      },
      spawnAbilityEntity_13: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'second' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'currentAbilityEntity',
          },
        },
        next: null,
      },
      spawnAbilityEntity_14: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'third' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'currentAbilityEntity',
          },
        },
        next: null,
      },
      spawnAbilityEntity_15: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'forth' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'currentAbilityEntity',
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff22: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 2,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale_laser: 10, trigger_time: 0 },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'mergeContextTargets_11' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'spawnAbilityEntity_12' } },
    { startFrame: 4, endFrame: 7, sequence: { $sequence: 'spawnAbilityEntity_13' } },
    { startFrame: 8, endFrame: 11, sequence: { $sequence: 'spawnAbilityEntity_14' } },
    { startFrame: 12, endFrame: 15, sequence: { $sequence: 'spawnAbilityEntity_15' } },
  ],
  actionGraph: arcaneBuff22ActionGraph,
};

const arcaneBuff23ActionGraph = {
  main: {
    nodes: {
      setCharacterPassiveUiValue_1: {
        action: {
          kind: 'setCharacterPassiveUiValue',
          parameters: { target: 'caster', value: { kind: 'valueNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      readBuffStackCount_2: {
        action: {
          kind: 'readBuffStackCount',
          parameters: { target: 'caster', outputKey: 'count', query: { kind: 'environment' } },
        },
        next: 'setCharacterPassiveUiValue_1',
      },
      setCharacterPassiveUiValue_3: {
        action: {
          kind: 'setCharacterPassiveUiValue',
          parameters: { target: 'caster', value: { kind: 'constant', value: 1 } },
        },
        next: null,
      },
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'count' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff23: SkillBuffDefinition = {
  stackingType: 'enhance',
  priority: 0,
  maxStackCount: 3,
  applyTags: [],
  extendTags: [],
  blackboard: { count: 0 },
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'setCharacterPassiveUiValue_3' },
    enhanceChanged: { $sequence: 'readBuffStackCount_2' },
  },
  actionGraph: arcaneBuff23ActionGraph,
};

const arcaneBuff24ActionGraph = {
  main: {
    nodes: {
      restrictUltimateEnergyRecovery_1: {
        action: {
          kind: 'restrictUltimateEnergyRecovery',
          parameters: {
            target: 'caster',
            allowedRecoveryTags: ['Skill/Character/chr_0032_lizhiyan/special_usp'],
            clearUltimateEnergyOnEnd: true,
          },
        },
        next: null,
      },
      changeResource_2: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'constant', value: -999 },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: null,
      },
      finishBuffsById_3: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
            reason: 'other',
          },
        },
        next: 'changeResource_2',
      },
      setCharacterPassiveUiValue_4: {
        action: {
          kind: 'setCharacterPassiveUiValue',
          parameters: { target: 'caster', value: { kind: 'constant', value: 0 } },
        },
        next: 'finishBuffsById_3',
      },
      changeResource_5: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'constant', value: 1 },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            isPercentValue: true,
            ultimateRecoveryTag: 'Skill/Character/chr_0032_lizhiyan/special_usp',
          },
        },
        next: null,
      },
      finishBuffsById_6: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_listener_owner'],
            reason: 'other',
          },
        },
        next: 'changeResource_5',
      },
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_talent1_enhance',
                copiedBlackboardAssignments: { enhance_rate: 'enhance_rate' },
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
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_7',
      },
      readBuffBlackboard_9: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'enhance_rate',
            outputKey: 'enhance_rate',
          },
        },
        next: 'checkCondition_8',
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'readBuffBlackboard_9',
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'checkCondition_10',
      },
      setCharacterPassiveUiValue_12: {
        action: {
          kind: 'setCharacterPassiveUiValue',
          parameters: { target: 'caster', value: { kind: 'constant', value: 2 } },
        },
        next: null,
      },
      withActionBlackboardScope_13: {
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
          body: { $sequence: 'setCharacterPassiveUiValue_12' },
        },
        next: null,
      },
      withActionBlackboardScope_14: {
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
          body: { $sequence: 'checkCondition_11' },
        },
        next: 'withActionBlackboardScope_13',
      },
      withActionBlackboardScope_15: {
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
          body: { $sequence: 'finishBuffsById_6' },
        },
        next: 'withActionBlackboardScope_14',
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'enhance_rate', fallback: 0 },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_talent1'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will', fallback: 0 },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_4' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff24: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_ult_laser',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: true,
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
  blackboard: { duration: 10, enhance_rate: 0, lv: 0 },
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'withActionBlackboardScope_15' },
    enable: { $sequence: 'restrictUltimateEnergyRecovery_1' },
    finish: { $sequence: 'setCharacterPassiveUiValue_4' },
  },
  actionGraph: arcaneBuff24ActionGraph,
  skillSlotReplacements: [
    {
      skillSlotKey: 'ultimate',
      targetSkillKey: 'chr_0032_lizhiyan_ultimate_skill2',
      revertedSkillKey: 'chr_0032_lizhiyan_ultimate_skill',
      inheritOriginSkillCooldownProgress: false,
    },
  ],
};

const arcaneBuff25ActionGraph = {
  main: {
    nodes: {
      finishOwner_1: {
        action: {
          kind: 'finishOwner',
          parameters: {
            targets: {
              kind: 'ownerSpawned',
              owner: { kind: 'source' },
              objectType: 'abilityEntity',
              abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill_place'],
              sameSourceSkillCast: false,
            },
          },
        },
        next: null,
      },
      finishBuffsById_2: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'source' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
            reason: 'other',
          },
        },
        next: 'finishOwner_1',
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff25: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  lifecycleSequences: { finish: { $sequence: 'finishBuffsById_2' } },
  actionGraph: arcaneBuff25ActionGraph,
};

const arcaneBuff26ActionGraph = {
  main: {
    nodes: {
      setCharacterPassiveUiValue_1: {
        action: {
          kind: 'setCharacterPassiveUiValue',
          parameters: { target: 'caster', value: { kind: 'constant', value: 3 } },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_talent1_enhance',
                copiedBlackboardAssignments: { enhance_rate: 'enhance_rate' },
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
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_2',
      },
      readBuffBlackboard_4: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
            desiredKey: 'enhance_rate',
            outputKey: 'enhance_rate',
          },
        },
        next: 'checkCondition_3',
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'readBuffBlackboard_4',
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'checkCondition_5',
      },
      restrictUltimateEnergyRecovery_7: {
        action: {
          kind: 'restrictUltimateEnergyRecovery',
          parameters: {
            target: 'caster',
            allowedRecoveryTags: ['Skill/Character/chr_0032_lizhiyan/special_usp'],
            clearUltimateEnergyOnEnd: true,
          },
        },
        next: null,
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      setCharacterPassiveUiValue_9: {
        action: {
          kind: 'setCharacterPassiveUiValue',
          parameters: { target: 'caster', value: { kind: 'constant', value: 0 } },
        },
        next: null,
      },
      changeResource_10: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'constant', value: -999 },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: 'setCharacterPassiveUiValue_9',
      },
      applyBuff_11: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_abilityentity_finish_self' }],
            targets: { kind: 'context', key: 'ult_aura' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_12: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'ult_aura',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
            sameSourceSkillCast: true,
          },
        },
        next: 'applyBuff_11',
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_8' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'changeResource_10' },
        },
        next: 'findOwnerSpawnedAbilityEntities_12',
      },
      checkCondition_14: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      applyBuff_15: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_14' },
          whenTrue: { $sequence: 'applyBuff_15' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      withActionBlackboardScope_17: {
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
      withActionBlackboardScope_18: {
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
          body: { $sequence: 'setCharacterPassiveUiValue_1' },
        },
        next: 'withActionBlackboardScope_17',
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'enhance_rate', fallback: 0 },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_talent1'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'isWisd', fallback: 0 } },
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
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 2 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 2 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff26: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_ult_skill',
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
  blackboard: { duration: 30, enhance_rate: 0, isWisd: 0, lv: 0 },
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'withActionBlackboardScope_18' },
    enable: { $sequence: 'restrictUltimateEnergyRecovery_7' },
    finish: { $sequence: 'ifElse_13' },
  },
  abilityEventResponses: [
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'ifElse_16' } },
  ],
  skillSlotReplacements: [
    {
      skillSlotKey: 'ultimate',
      targetSkillKey: 'chr_0032_lizhiyan_ultimate_skill2',
      revertedSkillKey: 'chr_0032_lizhiyan_ultimate_skill',
      inheritOriginSkillCooldownProgress: false,
    },
  ],
  actionGraph: arcaneBuff26ActionGraph,
};

const arcaneBuff27ActionGraph = {
  main: {
    nodes: {
      changeResource_11: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_1' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            ultimateRecoveryTag: 'Skill/Character/chr_0032_lizhiyan/special_usp',
            ignoreUltimateEnergyGainMultiplier: true,
          },
        },
        next: null,
      },
      applyBuff_12: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser2',
                copiedBlackboardAssignments: { atk_scale_laser: 'atk_scale_laser' },
              },
            ],
            targets: { kind: 'context', key: 'laser_target2' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'changeResource_11',
      },
      spawnAbilityEntity_13: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            saveToContextKey: 'laser_target2',
          },
        },
        next: 'applyBuff_12',
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_18: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'spawnAbilityEntity_13' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_16: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser1',
                copiedBlackboardAssignments: { atk_scale_laser: 'atk_scale_laser' },
              },
            ],
            targets: { kind: 'context', key: 'laser_target1' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'changeResource_11',
      },
      spawnAbilityEntity_17: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            saveToContextKey: 'laser_target1',
          },
        },
        next: 'applyBuff_16',
      },
      checkCondition_14: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      applyBuff_19: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_layer' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_20: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_14' },
          whenTrue: { $sequence: 'spawnAbilityEntity_17' },
          whenFalse: { $sequence: 'ifElse_18' },
        },
        next: 'applyBuff_19',
      },
      findOwnerSpawnedAbilityEntities_21: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'ult_aura',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
          },
        },
        next: 'ifElse_20',
      },
      createTimedMarker_22: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            targets: { kind: 'source' },
            markerId: 'chr_0032_lizhiyan_ultimate_count',
            durationSeconds: { kind: 'constant', value: 0.4 },
            autoFinishByAction: false,
            timeDomain: 'globalScaled',
          },
        },
        next: 'findOwnerSpawnedAbilityEntities_21',
      },
      checkCondition_23: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'createTimedMarker_22',
      },
      checkCondition_24: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'checkCondition_23',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'usp_step' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
          operator: 'lessOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
          operator: 'lessOrEqual',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'timedMarkerPresent',
          target: 'caster',
          markerId: 'chr_0032_lizhiyan_ultimate_count',
        },
      },
      data_5: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_4' } },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_listener_owner'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff27: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 0.1,
  triggerIntervalSeconds: 0.033,
  waitFirstTriggerInterval: false,
  maxTriggerCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale_laser: 0, usp_step: 0 },
  attributeModifiers: [],
  lifecycleSequences: { trigger: { $sequence: 'checkCondition_24' } },
  actionGraph: arcaneBuff27ActionGraph,
};

const arcaneBuff28ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const arcaneBuff28: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 3,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: arcaneBuff28ActionGraph,
};

export const arcane: OperatorDefinition = {
  slug: 'arcane',
  gameId: 'ARCANE',
  rarity: 6,
  weaponType: 'funnel',
  element: 'nature',
  characterTypeId: 'Natural',
  role: 'caster',
  mainAttribute: 'intellect',
  secondaryAttribute: 'will',
  attributes: {
    strength: [9, 26, 45, 64, 82, 91],
    agility: [9, 27, 46, 65, 84, 93],
    intellect: [21, 54, 89, 124, 159, 176],
    will: [14, 37, 61, 85, 109, 121],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  trustAttributeBonus: { values: [8, 10, 10, 15], attributes: ['intellect', 'will'] },
  passiveUi: { kind: 'numeric', appearance: 'arcaneSigils', maximum: 3 },
  skillGroups: [
    {
      key: 'basicAttack',
      operationType: 'basicAttack',
      skills: [
        arcaneChr_0032_lizhiyan_attack1,
        arcaneChr_0032_lizhiyan_attack2,
        arcaneChr_0032_lizhiyan_attack3,
        arcaneChr_0032_lizhiyan_attack4,
        arcaneChr_0032_lizhiyan_attack5,
      ],
      presentationVariants: [
        {
          key: 'int',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
        },
        {
          key: 'will',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'less',
            right: 'will',
          },
        },
      ],
    },
    {
      key: 'finisher',
      operationType: 'finisher',
      skills: arcaneChr_0032_lizhiyan_power_attack,
      presentationVariants: [
        {
          key: 'int',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
        },
        {
          key: 'will',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'less',
            right: 'will',
          },
        },
      ],
    },
    {
      key: 'plungingAttack',
      operationType: 'plungingAttack',
      skills: arcaneChr_0032_lizhiyan_plunging_attack_end,
      presentationVariants: [
        {
          key: 'int',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
        },
        {
          key: 'will',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'less',
            right: 'will',
          },
        },
      ],
    },
    {
      key: 'battleSkill',
      operationType: 'battleSkill',
      skills: arcaneChr_0032_lizhiyan_normal_skill,
      presentationVariants: [
        {
          key: 'int',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
          icon: 'endaxis:operators/arcane/battle_01',
        },
        {
          key: 'will',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'less',
            right: 'will',
          },
          icon: 'endaxis:operators/arcane/battle_02',
        },
      ],
    },
    {
      key: 'comboSkill',
      operationType: 'comboSkill',
      skills: arcaneChr_0032_lizhiyan_combo_skill,
      presentationVariants: [
        {
          key: 'int',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
          icon: 'endaxis:operators/arcane/combo_01',
        },
        {
          key: 'will',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'less',
            right: 'will',
          },
          icon: 'endaxis:operators/arcane/combo_02',
        },
      ],
    },
    {
      key: 'ultimate',
      operationType: 'ultimate',
      skills: arcaneChr_0032_lizhiyan_ultimate_skill,
      placementSequenceSkillKeys: [
        'chr_0032_lizhiyan_ultimate_skill',
        'chr_0032_lizhiyan_ultimate_skill2',
      ],
      replacementSkills: [arcaneChr_0032_lizhiyan_ultimate_skill2],
      presentationVariants: [
        {
          key: 'int',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
          icon: 'endaxis:operators/arcane/ultimate_01',
        },
        {
          key: 'will',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'less',
            right: 'will',
          },
          icon: 'endaxis:operators/arcane/ultimate_02',
        },
      ],
    },
  ],
  dodgeSkill: arcaneCommon_character_perfect_dodge,
  dashBuffs: [
    { buffId: 'buff_common_dash', blackboard: { dodgeSkillId: 'common_character_perfect_dodge' } },
  ],
  skillSlots: [
    {
      key: 'battleSkill',
      baseSkillKey: 'chr_0032_lizhiyan_normal_skill',
      replacementSkillKeys: [],
    },
    { key: 'comboSkill', baseSkillKey: 'chr_0032_lizhiyan_combo_skill', replacementSkillKeys: [] },
    {
      key: 'ultimate',
      baseSkillKey: 'chr_0032_lizhiyan_ultimate_skill',
      replacementSkillKeys: ['chr_0032_lizhiyan_ultimate_skill2'],
    },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'chr_0032_lizhiyan_attack1',
        'chr_0032_lizhiyan_attack2',
        'chr_0032_lizhiyan_attack3',
        'chr_0032_lizhiyan_attack4',
        'chr_0032_lizhiyan_attack5',
        'chr_0032_lizhiyan_plunging_attack_end',
        'chr_0032_lizhiyan_power_attack',
      ],
      normalAttackSkillKeys: [
        'chr_0032_lizhiyan_attack1',
        'chr_0032_lizhiyan_attack2',
        'chr_0032_lizhiyan_attack3',
        'chr_0032_lizhiyan_attack4',
        'chr_0032_lizhiyan_attack5',
      ],
      defaultSkillKey: 'chr_0032_lizhiyan_attack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  comboSkillConditions: [
    arcaneComboCondition1,
    arcaneComboCondition2,
    arcaneComboCondition3,
    arcaneComboCondition4,
    arcaneComboCondition5,
  ],
  comboSkillPriority: 'enemyRank',
  talents: [
    {
      levels: 2,
      modifiers: [
        {
          kind: 'addSkillCooldownFrames',
          skillKey: 'chr_0032_lizhiyan_combo_skill',
          frames: -180,
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
        },
      ],
      passiveSkills: [arcanePassive2],
    },
    {
      levels: 2,
      modifiers: [
        { kind: 'addReactionDuration', reaction: 'corrosion', seconds: [5, 10] },
        { kind: 'addReactionEffectiveness', reaction: 'corrosion', value: [0.05, 0.1] },
      ],
    },
  ],
  potentials: [
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0032_lizhiyan_combo_skill',
          blackboardKey: 'atk_scale_touch',
          operation: 'multiply',
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0032_lizhiyan_combo_skill',
          blackboardKey: 'atk_scale_boom',
          operation: 'multiply',
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0032_lizhiyan_combo_skill',
          blackboardKey: 'atk_scale_laser1',
          operation: 'multiply',
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0032_lizhiyan_combo_skill',
          blackboardKey: 'atk_scale_laser2',
          operation: 'multiply',
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0032_lizhiyan_combo_skill',
          blackboardKey: 'atb_return_wisd',
          operation: 'add',
          value: 10,
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0032_lizhiyan_combo_skill',
          blackboardKey: 'rate_pre',
          operation: 'add',
          value: 0.06,
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'less',
            right: 'will',
          },
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 15 },
        { kind: 'addBuildAttribute', attributes: ['will'], value: 15 },
        { kind: 'modifyBasePanelStat', stat: 'artsIntensity', operation: 'flat', value: 16 },
      ],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'addReactionDuration', reaction: 'corrosion', seconds: 5 },
        { kind: 'addReactionEffectiveness', reaction: 'corrosion', value: 0.2 },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillKey: 'chr_0032_lizhiyan_ultimate_skill',
          resource: 'ultimateEnergy',
          multiplier: 0.85,
        },
        {
          kind: 'multiplySkillCost',
          skillKey: 'chr_0032_lizhiyan_ultimate_skill2',
          resource: 'ultimateEnergy',
          multiplier: 0.85,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0032_lizhiyan_talent1',
          blackboardKey: 'enhance_rate',
          operation: 'add',
          value: 0.16,
        },
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0032_lizhiyan_talent1',
          blackboardKey: 'spell_vul_rate_potential',
          operation: 'add',
          value: 0.07,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0032_lizhiyan_ultimate_skill2',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0032_lizhiyan_ultimate_skill2',
          blackboardKey: 'cd_minus',
          operation: 'add',
          value: 0.3,
        },
      ],
    },
  ],
  entityBlackboard: {
    EntityBB_consumed_layer: 0,
    EntityBB_consumed_type: 0,
    EntityBB_ult_hit: 0,
    EntityBB_wisd_greater_will: 1,
  },
  passiveSkills: [arcanePassive1],
  buffDefinitions: {
    buff_chr_0032_lizhiyan_combo_skill_precheck: arcaneBuff1,
    buff_chr_0032_lizhiyan_combo_skill_seal: arcaneBuff2,
    buff_chr_0032_lizhiyan_combo_skill_seal_atb: arcaneBuff3,
    buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener: arcaneBuff4,
    buff_chr_0032_lizhiyan_combo_skill_seal_finish_count: arcaneBuff5,
    buff_chr_0032_lizhiyan_combo_skill_seal_finisher: arcaneBuff6,
    buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd: arcaneBuff7,
    buff_chr_0032_lizhiyan_combo_skill_seal_listener: arcaneBuff8,
    buff_chr_0032_lizhiyan_combo_skill_seal_total: arcaneBuff9,
    buff_chr_0032_lizhiyan_combo_skill_seal2: arcaneBuff10,
    buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable: arcaneBuff11,
    buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable_pre: arcaneBuff12,
    buff_chr_0032_lizhiyan_normal_skill_aura: arcaneBuff13,
    buff_chr_0032_lizhiyan_normal_skill_listener: arcaneBuff14,
    buff_chr_0032_lizhiyan_passive: arcaneBuff15,
    buff_chr_0032_lizhiyan_talent1: arcaneBuff16,
    buff_chr_0032_lizhiyan_talent1_enhance: arcaneBuff17,
    buff_chr_0032_lizhiyan_talent1_vulnerable: arcaneBuff18,
    buff_chr_0032_lizhiyan_ultimate_skill_abilityentity_finish_self: arcaneBuff19,
    buff_chr_0032_lizhiyan_ultimate_skill_inaura: arcaneBuff20,
    buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser1: arcaneBuff21,
    buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser2: arcaneBuff22,
    buff_chr_0032_lizhiyan_ultimate_skill_layer: arcaneBuff23,
    buff_chr_0032_lizhiyan_ultimate_skill_listener: arcaneBuff24,
    buff_chr_0032_lizhiyan_ultimate_skill_listener_abilityentity: arcaneBuff25,
    buff_chr_0032_lizhiyan_ultimate_skill_listener_owner: arcaneBuff26,
    buff_chr_0032_lizhiyan_ultimate_skill_target_mark: arcaneBuff27,
    buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener: arcaneBuff28,
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0032_lizhiyan_combo_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0032_lizhiyan/combo_bunshin',
      ],
      blackboard: { EntityBB_wisd_greater_will: 1 },
      lifetime: { kind: 'limited', durationSeconds: 50 },
      childSkills: {
        chr_032_lizhiyan_combo_skill_abilityentity_seal: {
          actionGraph: { main: { nodes: {} }, macros: {} },
          skillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 190,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: {
            atb_final: 50,
            atk_scale_final: 1,
            minAngle: 0,
            number: 0,
            owner_mainchar_alpha: 0,
            owner_mainchar_distance: 0,
            poise_final: 0,
            radius: 5,
          },
          scheduledSequences: [],
        },
        chr_0032_lizhiyan_combo_skill_abilityentity_end: {
          skillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_end',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 45,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: {
            atb_final: 50,
            atb_return_wisd: 0,
            atk_scale_boom: 1,
            minAngle: 0,
            number: 0,
            owner_mainchar_alpha: 0,
            owner_mainchar_distance: 0,
            poise_boom: 5,
            radius: 5,
          },
          scheduledSequences: [
            { startFrame: 9, endFrame: 12, sequence: { $sequence: 'finishBuffsById_1' } },
            {
              startFrame: 21,
              endFrame: 22,
              sequence: { $sequence: 'triggerCustomAbilityEvent_2' },
            },
            { startFrame: 44, endFrame: 45, sequence: { $sequence: 'finishOwner_3' } },
            { startFrame: 0, endFrame: 15, sequence: { $sequence: 'repeatEachTick_4' } },
            { startFrame: 0, endFrame: 14, sequence: { $sequence: 'checkCondition_8' } },
            { startFrame: 14, endFrame: 20, sequence: { $sequence: 'ifElse_13' } },
            { startFrame: 0, endFrame: 3, sequence: { $sequence: 'createTimedMarker_14' } },
            { startFrame: 14, endFrame: 17, sequence: { $sequence: 'forEachContextTarget_18' } },
          ],
          actionGraph: {
            main: {
              nodes: {
                finishBuffsById_1: {
                  action: {
                    kind: 'finishBuffsById',
                    parameters: {
                      targets: { kind: 'owner' },
                      finishSource: { kind: 'source' },
                      buffIds: [
                        'buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect',
                        'buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect_line',
                      ],
                      reason: 'other',
                    },
                  },
                  next: null,
                },
                triggerCustomAbilityEvent_2: {
                  action: {
                    kind: 'triggerCustomAbilityEvent',
                    parameters: {
                      eventName: 'lizhiyan_combo_normal_end',
                      eventParam: 0,
                      target: 'caster',
                      source: 'currentAbilityEntity',
                    },
                  },
                  next: null,
                },
                finishOwner_3: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
                repeatEachTick_4: {
                  action: {
                    kind: 'repeatEachTick',
                    parameters: {
                      nativeChanneling: {
                        target: { kind: 'inputTarget' },
                        executeEachFrame: true,
                        triggerIntervalSeconds: 0.033,
                        maxCountPerTarget: -1,
                        targetTriggerIntervalSeconds: 0.033,
                      },
                    },
                    body: { $sequence: null },
                  },
                  next: null,
                },
                createTimedMarker_5: {
                  action: {
                    kind: 'createTimedMarker',
                    parameters: {
                      targets: { kind: 'source' },
                      markerId: 'lizhiyan_combo_end_not_finish',
                      durationSeconds: { kind: 'constant', value: 0.1 },
                      autoFinishByAction: false,
                      timeDomain: 'globalScaled',
                    },
                  },
                  next: null,
                },
                applyBuff_6: {
                  action: {
                    kind: 'applyBuff',
                    parameters: {
                      buffs: [
                        {
                          buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener',
                          copiedBlackboardAssignments: {
                            atk_scale_early_finish: 'atk_scale_boom',
                            poise_early_finish: 'poise_boom',
                            atb_return_wisd: 'atb_return_wisd',
                          },
                        },
                      ],
                      targets: { kind: 'fixed', target: 'enemy' },
                      source: { kind: 'source' },
                      inheritSourceSkillCastInfo: true,
                      finishByAction: true,
                    },
                  },
                  next: 'createTimedMarker_5',
                },
                checkCondition_7: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
                  },
                  next: 'applyBuff_6',
                },
                checkCondition_8: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                  },
                  next: 'checkCondition_7',
                },
                checkCondition_9: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                  },
                  next: null,
                },
                createTimedMarker_10: {
                  action: {
                    kind: 'createTimedMarker',
                    parameters: {
                      targets: { kind: 'source' },
                      markerId: 'lizhiyan_combo_hit',
                      durationSeconds: { kind: 'constant', value: 0.1 },
                      autoFinishByAction: false,
                      timeDomain: 'globalScaled',
                    },
                  },
                  next: null,
                },
                dealDamage_11: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'nature',
                      attackScale: { kind: 'valueNode', nodeId: 'data_7' },
                      tags: ['comboSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'valueNode', nodeId: 'data_8' },
                    },
                    key: 'abilityentity_chr_0032_lizhiyan_combo_skill:chr_032_lizhiyan_combo_skill_abilityentity_seal|chr_0032_lizhiyan_combo_skill_abilityentity_end|chr_0032_lizhiyan_combo_skill_abilityentity_seal_again|chr_0032_lizhiyan_combo_skill_abilityentity_seal_finisher:/childSkills/chr_0032_lizhiyan_combo_skill_abilityentity_end/actionGraph/main/nodes/dealDamage_11/action',
                  },
                  next: 'createTimedMarker_10',
                },
                startTimeDilation_12: {
                  action: {
                    kind: 'startTimeDilation',
                    parameters: {
                      scope: 'entity',
                      durationSeconds: { kind: 'constant', value: 0.3 },
                      slot: 'TimeDilation/Layer/Entity/HitStop',
                      priority: 15,
                      curve: {
                        kind: 'inline',
                        keys: [
                          {
                            time: 0,
                            value: 1,
                            inTangent: -14.14286,
                            outTangent: -14.14286,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                          {
                            time: 0.07,
                            value: 0.01,
                            inTangent: 0.03159265,
                            outTangent: 0.03159265,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                          {
                            time: 0.9385403,
                            value: 0.1655021,
                            inTangent: 0.5255258,
                            outTangent: 0.5255258,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                          {
                            time: 1,
                            value: 0.3,
                            inTangent: 3.249784,
                            outTangent: 3.249784,
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
                  next: null,
                },
                ifElse_13: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: 'checkCondition_9' },
                    whenTrue: { $sequence: 'dealDamage_11' },
                    whenFalse: { $sequence: null },
                  },
                  next: 'startTimeDilation_12',
                },
                createTimedMarker_14: {
                  action: {
                    kind: 'createTimedMarker',
                    parameters: {
                      targets: { kind: 'owner' },
                      markerId: 'lizhiyan_bunshin_end',
                      durationSeconds: { kind: 'constant', value: 1 },
                      autoFinishByAction: false,
                      timeDomain: 'self',
                    },
                  },
                  next: null,
                },
                checkCondition_15: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
                  },
                  next: null,
                },
                finishBuffsById_16: {
                  action: {
                    kind: 'finishBuffsById',
                    parameters: {
                      targets: { kind: 'fixed', target: 'enemy' },
                      finishSource: { kind: 'source' },
                      buffIds: ['buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable'],
                      reason: 'other',
                    },
                  },
                  next: null,
                },
                ifElse_17: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: 'checkCondition_15' },
                    whenTrue: { $sequence: 'finishBuffsById_16' },
                    whenFalse: { $sequence: null },
                  },
                  next: null,
                },
                forEachContextTarget_18: {
                  action: {
                    kind: 'forEachContextTarget',
                    parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                    body: { $sequence: 'ifElse_17' },
                  },
                  next: null,
                },
              },
              dataNodes: {
                data_1: {
                  type: 'number',
                  expression: {
                    kind: 'blackboard',
                    key: 'EntityBB_wisd_greater_will',
                    fallback: 0,
                  },
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
                data_3: {
                  type: 'boolean',
                  expression: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'lizhiyan_combo_end_not_finish',
                  },
                },
                data_4: {
                  type: 'boolean',
                  expression: {
                    kind: 'not',
                    condition: { kind: 'conditionNode', nodeId: 'data_3' },
                  },
                },
                data_5: {
                  type: 'boolean',
                  expression: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'lizhiyan_combo_hit',
                  },
                },
                data_6: {
                  type: 'boolean',
                  expression: {
                    kind: 'not',
                    condition: { kind: 'conditionNode', nodeId: 'data_5' },
                  },
                },
                data_7: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_boom' },
                },
                data_8: { type: 'number', expression: { kind: 'blackboard', key: 'poise_boom' } },
                data_9: {
                  type: 'boolean',
                  expression: {
                    kind: 'buffIdStackCompare',
                    target: 'enemy',
                    buffIds: ['buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable'],
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 1 },
                  },
                },
              },
            },
            macros: {},
          },
        },
        chr_0032_lizhiyan_combo_skill_abilityentity_seal_again: {
          skillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_seal_again',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 243,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: {
            atb_final: 50,
            atb_return_wisd: 10,
            atk_scale_calc: 0,
            atk_scale_laser1: 6,
            atk_scale_laser2: 2,
            atk_scale_wisd_ratio: 0,
            cd_reduce: 3,
            duration_calc: 0,
            duration_extra: 0,
            duration_vul: 2,
            isWisd: 1,
            minAngle: 0,
            number: 0,
            owner_mainchar_alpha: 0,
            owner_mainchar_distance: 0,
            poise_laser: 5,
            radius: 5,
            radius_early_finish: 5.67,
            rate_final: 0.3,
          },
          scheduledSequences: [
            { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_1' } },
            { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_7' } },
            { startFrame: 41, endFrame: 44, sequence: { $sequence: 'ifElse_16' } },
            { startFrame: 23, endFrame: 26, sequence: { $sequence: 'finishBuffsById_17' } },
            { startFrame: 239, endFrame: 239, sequence: { $sequence: 'checkCondition_22' } },
            { startFrame: 240, endFrame: 243, sequence: { $sequence: 'finishOwner_23' } },
            { startFrame: 0, endFrame: 240, sequence: { $sequence: 'checkCondition_29' } },
          ],
          actionGraph: {
            main: {
              nodes: {
                finishBuffsById_1: {
                  action: {
                    kind: 'finishBuffsById',
                    parameters: {
                      targets: { kind: 'owner' },
                      finishSource: { kind: 'source' },
                      buffIds: ['buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect_line'],
                      reason: 'other',
                    },
                  },
                  next: null,
                },
                calculateActionValue_5: {
                  action: {
                    kind: 'calculateActionValue',
                    parameters: {
                      key: 'duration_calc',
                      operation: 'add',
                      left: { kind: 'valueNode', nodeId: 'data_1' },
                      right: { kind: 'valueNode', nodeId: 'data_2' },
                    },
                  },
                  next: null,
                },
                modifyActionValue_6: {
                  action: {
                    kind: 'modifyActionValue',
                    parameters: {
                      key: 'isWisd',
                      operation: 'assign',
                      value: { kind: 'constant', value: 0 },
                    },
                  },
                  next: 'calculateActionValue_5',
                },
                calculateActionValue_3: {
                  action: {
                    kind: 'calculateActionValue',
                    parameters: {
                      key: 'duration_calc',
                      operation: 'add',
                      left: { kind: 'valueNode', nodeId: 'data_1' },
                      right: { kind: 'constant', value: 0 },
                    },
                  },
                  next: null,
                },
                modifyActionValue_4: {
                  action: {
                    kind: 'modifyActionValue',
                    parameters: {
                      key: 'isWisd',
                      operation: 'assign',
                      value: { kind: 'constant', value: 1 },
                    },
                  },
                  next: 'calculateActionValue_3',
                },
                checkCondition_2: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                  },
                  next: null,
                },
                ifElse_7: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: 'checkCondition_2' },
                    whenTrue: { $sequence: 'modifyActionValue_4' },
                    whenFalse: { $sequence: 'modifyActionValue_6' },
                  },
                  next: null,
                },
                jumpTimeline_13: {
                  action: {
                    kind: 'jumpTimeline',
                    parameters: { destinationFrame: 240 },
                    condition: { $sequence: null },
                  },
                  next: null,
                },
                jumpTimeline_9: {
                  action: {
                    kind: 'jumpTimeline',
                    parameters: { destinationFrame: 239 },
                    condition: { $sequence: null },
                  },
                  next: null,
                },
                applyBuff_10: {
                  action: {
                    kind: 'applyBuff',
                    parameters: {
                      buffs: [
                        {
                          buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd',
                          copiedBlackboardAssignments: {
                            atk_scale_laser1: 'atk_scale_laser1',
                            atk_scale_laser2: 'atk_scale_laser2',
                            poise_final: 'poise_laser',
                            isWisd: 'isWisd',
                            cd_reduce: 'cd_reduce',
                            atb_return_wisd: 'atb_return_wisd',
                          },
                        },
                      ],
                      targets: { kind: 'context', key: 'death' },
                      source: { kind: 'source' },
                      inheritSourceSkillCastInfo: true,
                    },
                  },
                  next: 'jumpTimeline_9',
                },
                spawnAbilityEntity_11: {
                  action: {
                    kind: 'spawnAbilityEntity',
                    parameters: {
                      bornAt: { kind: 'fixed', target: 'enemy' },
                      abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill_death',
                      childSkillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_death_move',
                      inheritActionBlackboard: true,
                      dieWhenSourceDies: false,
                      target: 'enemy',
                      saveToContextKey: 'death',
                    },
                  },
                  next: 'applyBuff_10',
                },
                applyBuff_12: {
                  action: {
                    kind: 'applyBuff',
                    parameters: {
                      buffs: [{ buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_finish_count' }],
                      targets: { kind: 'source' },
                      source: { kind: 'owner' },
                      inheritSourceSkillCastInfo: true,
                    },
                  },
                  next: 'spawnAbilityEntity_11',
                },
                checkCondition_8: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
                  },
                  next: null,
                },
                ifElse_15: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: 'checkCondition_8' },
                    whenTrue: { $sequence: 'applyBuff_12' },
                    whenFalse: { $sequence: 'jumpTimeline_13' },
                  },
                  next: null,
                },
                checkCondition_14: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                  },
                  next: null,
                },
                ifElse_16: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: 'checkCondition_14' },
                    whenTrue: { $sequence: 'ifElse_15' },
                    whenFalse: { $sequence: null },
                  },
                  next: null,
                },
                finishBuffsById_17: {
                  action: {
                    kind: 'finishBuffsById',
                    parameters: {
                      targets: { kind: 'owner' },
                      finishSource: { kind: 'source' },
                      buffIds: ['buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect'],
                      reason: 'other',
                    },
                  },
                  next: null,
                },
                createTimedMarker_19: {
                  action: {
                    kind: 'createTimedMarker',
                    parameters: {
                      targets: { kind: 'source' },
                      markerId: 'lizhiyan_combo_finisher',
                      durationSeconds: { kind: 'constant', value: 0.1 },
                      autoFinishByAction: false,
                      timeDomain: 'globalScaled',
                    },
                  },
                  next: null,
                },
                applyBuff_20: {
                  action: {
                    kind: 'applyBuff',
                    parameters: {
                      buffs: [
                        {
                          buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_finisher',
                          copiedBlackboardAssignments: {
                            atk_scale_laser2: 'atk_scale_laser2',
                            poise_final: 'poise_laser',
                            isWisd: 'isWisd',
                          },
                        },
                      ],
                      targets: { kind: 'fixed', target: 'enemy' },
                      source: { kind: 'source' },
                      inheritSourceSkillCastInfo: true,
                    },
                  },
                  next: 'createTimedMarker_19',
                },
                ifElse_21: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: 'checkCondition_14' },
                    whenTrue: { $sequence: null },
                    whenFalse: { $sequence: 'applyBuff_20' },
                  },
                  next: null,
                },
                checkCondition_22: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
                  },
                  next: 'ifElse_21',
                },
                finishOwner_23: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
                applyBuff_26: {
                  action: {
                    kind: 'applyBuff',
                    parameters: {
                      buffs: [
                        {
                          buffId: 'buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable',
                          copiedBlackboardAssignments: {
                            rate: 'rate_final',
                            duration_vul: 'duration_calc',
                            atk_scale_calc: 'atk_scale_calc',
                            poise_final: 'poise_laser',
                            isWisd: 'isWisd',
                            atk_scale_laser1: 'atk_scale_laser1',
                            atk_scale_laser2: 'atk_scale_laser2',
                          },
                        },
                      ],
                      targets: { kind: 'fixed', target: 'enemy' },
                      source: { kind: 'source' },
                      inheritSourceSkillCastInfo: true,
                    },
                  },
                  next: null,
                },
                createTimedMarker_27: {
                  action: {
                    kind: 'createTimedMarker',
                    parameters: {
                      targets: { kind: 'source' },
                      markerId: 'lizhiyan_combo_vul',
                      durationSeconds: { kind: 'constant', value: 0.1 },
                      autoFinishByAction: false,
                      timeDomain: 'globalScaled',
                    },
                  },
                  next: 'applyBuff_26',
                },
                ifElse_28: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: null },
                    whenTrue: { $sequence: 'createTimedMarker_27' },
                    whenFalse: { $sequence: 'createTimedMarker_27' },
                  },
                  next: null,
                },
                checkCondition_29: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
                  },
                  next: 'ifElse_28',
                },
              },
              dataNodes: {
                data_1: { type: 'number', expression: { kind: 'blackboard', key: 'duration_vul' } },
                data_2: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'duration_extra' },
                },
                data_3: {
                  type: 'number',
                  expression: {
                    kind: 'blackboard',
                    key: 'EntityBB_wisd_greater_will',
                    fallback: 0,
                  },
                },
                data_4: {
                  type: 'boolean',
                  expression: {
                    kind: 'actionValueCompare',
                    left: { kind: 'valueNode', nodeId: 'data_3' },
                    operator: 'greaterOrEqual',
                    right: { kind: 'constant', value: 1 },
                  },
                },
                data_5: {
                  type: 'boolean',
                  expression: {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal_finish_count'],
                    operator: 'less',
                    value: { kind: 'constant', value: 1 },
                    sameSourceSkillCast: true,
                  },
                },
                data_6: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'isWisd', fallback: 0 },
                },
                data_7: {
                  type: 'boolean',
                  expression: {
                    kind: 'actionValueCompare',
                    left: { kind: 'valueNode', nodeId: 'data_6' },
                    operator: 'greaterOrEqual',
                    right: { kind: 'constant', value: 1 },
                  },
                },
                data_8: {
                  type: 'boolean',
                  expression: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'lizhiyan_combo_finisher',
                  },
                },
                data_9: {
                  type: 'boolean',
                  expression: {
                    kind: 'not',
                    condition: { kind: 'conditionNode', nodeId: 'data_8' },
                  },
                },
                data_10: {
                  type: 'boolean',
                  expression: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'lizhiyan_combo_vul',
                  },
                },
                data_11: {
                  type: 'boolean',
                  expression: {
                    kind: 'not',
                    condition: { kind: 'conditionNode', nodeId: 'data_10' },
                  },
                },
              },
            },
            macros: {},
          },
        },
        chr_0032_lizhiyan_combo_skill_abilityentity_seal_finisher: {
          actionGraph: {
            main: {
              nodes: {
                finishOwner_1: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_seal_finisher',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 19,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: {
            atb_final: 50,
            atk_scale_calc: 0,
            atk_scale_final: 6,
            atk_scale_wisd_ratio: 0,
            duration_calc: 0,
            duration_extra: 0,
            duration_vul: 6,
            isWisd: 1,
            minAngle: 0,
            number: 0,
            owner_mainchar_alpha: 0,
            owner_mainchar_distance: 0,
            poise_final: 5,
            radius: 5,
            rate: 0.3,
          },
          scheduledSequences: [
            { startFrame: 18, endFrame: 19, sequence: { $sequence: 'finishOwner_1' } },
          ],
        },
      },
    },
    abilityentity_chr_0032_lizhiyan_normal_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      blackboard: { EntityBB_wisd_greater_will: 1 },
      lifetime: { kind: 'limited', durationSeconds: 6 },
      childSkills: {
        chr_0032_lizhiyan_normal_skill_abilityrange2: {
          skillId: 'chr_0032_lizhiyan_normal_skill_abilityrange2',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 240,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: {
            atb_return_dynamic: 20,
            atk_scale: 0,
            atk_scale_final: 0,
            atk_scale_will: 1,
            atk_scale_wisd: 1,
            atk_scale_wisd_ratio: 1.5,
            duration: 6,
            effect_count: 0,
            has_returned: 0,
            isJumped: 0,
            max_effect_count: 3,
            poise: 0,
            radius: 5,
          },
          scheduledSequences: [
            { startFrame: 0, endFrame: 3, sequence: { $sequence: 'modifyActionValue_1' } },
            { startFrame: 20, endFrame: 22, sequence: { $sequence: 'forEachContextTarget_13' } },
            { startFrame: 20, endFrame: 23, sequence: { $sequence: 'ifElse_15' } },
            { startFrame: 22, endFrame: 25, sequence: { $sequence: 'finishOwner_16' } },
          ],
          actionGraph: {
            main: {
              nodes: {
                modifyActionValue_1: {
                  action: {
                    kind: 'modifyActionValue',
                    parameters: {
                      key: 'radius',
                      operation: 'add',
                      value: { kind: 'constant', value: 0.67 },
                    },
                  },
                  next: null,
                },
                checkCondition_2: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
                  },
                  next: null,
                },
                calculateActionValue_3: {
                  action: {
                    kind: 'calculateActionValue',
                    parameters: {
                      key: 'effect_count',
                      operation: 'add',
                      left: { kind: 'valueNode', nodeId: 'data_4' },
                      right: { kind: 'constant', value: 1 },
                    },
                  },
                  next: null,
                },
                checkCondition_4: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
                  },
                  next: null,
                },
                ifElse_5: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: 'checkCondition_2' },
                    whenTrue: { $sequence: 'calculateActionValue_3' },
                    whenFalse: { $sequence: null },
                  },
                  next: null,
                },
                ifElse_6: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: 'checkCondition_4' },
                    whenTrue: { $sequence: null },
                    whenFalse: { $sequence: 'ifElse_5' },
                  },
                  next: null,
                },
                checkCondition_7: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                  },
                  next: null,
                },
                dealDamage_8: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'nature',
                      attackScale: { kind: 'valueNode', nodeId: 'data_8' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'valueNode', nodeId: 'data_9' },
                    },
                    key: 'abilityentity_chr_0032_lizhiyan_normal_skill:chr_0032_lizhiyan_normal_skill_abilityrange2|chr_0032_lizhiyan_normal_skill_abilityrange:/childSkills/chr_0032_lizhiyan_normal_skill_abilityrange2/actionGraph/main/nodes/dealDamage_8/action',
                  },
                  next: null,
                },
                dealDamage_9: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'nature',
                      attackScale: { kind: 'valueNode', nodeId: 'data_10' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'valueNode', nodeId: 'data_9' },
                    },
                    key: 'abilityentity_chr_0032_lizhiyan_normal_skill:chr_0032_lizhiyan_normal_skill_abilityrange2|chr_0032_lizhiyan_normal_skill_abilityrange:/childSkills/chr_0032_lizhiyan_normal_skill_abilityrange2/actionGraph/main/nodes/dealDamage_9/action',
                  },
                  next: null,
                },
                startTimeDilation_10: {
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
                            time: 0,
                            value: 1,
                            inTangent: -14.14286,
                            outTangent: -14.14286,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                          {
                            time: 0.07,
                            value: 0.01,
                            inTangent: 0,
                            outTangent: 0,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                          {
                            time: 1,
                            value: 0.1,
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
                  next: null,
                },
                ifElse_11: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: 'checkCondition_7' },
                    whenTrue: { $sequence: 'dealDamage_8' },
                    whenFalse: { $sequence: 'dealDamage_9' },
                  },
                  next: 'startTimeDilation_10',
                },
                applyElementalInfliction_12: {
                  action: {
                    kind: 'applyElementalInfliction',
                    parameters: { element: 'nature', isExtra: false },
                  },
                  next: 'ifElse_11',
                },
                forEachContextTarget_13: {
                  action: {
                    kind: 'forEachContextTarget',
                    parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                    body: { $sequence: 'ifElse_6' },
                  },
                  next: 'applyElementalInfliction_12',
                },
                gainSquadUltimateEnergyFromSkillCost_14: {
                  action: {
                    kind: 'gainSquadUltimateEnergyFromSkillCost',
                    parameters: { coefficient: 1 },
                  },
                  next: null,
                },
                ifElse_15: {
                  action: {
                    kind: 'ifElse',
                    parameters: { alwaysNext: true },
                    condition: { $sequence: null },
                    whenTrue: { $sequence: 'gainSquadUltimateEnergyFromSkillCost_14' },
                    whenFalse: { $sequence: null },
                  },
                  next: null,
                },
                finishOwner_16: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
              },
              dataNodes: {
                data_1: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'effect_count', fallback: 0 },
                },
                data_2: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'max_effect_count', fallback: 0 },
                },
                data_3: {
                  type: 'boolean',
                  expression: {
                    kind: 'actionValueCompare',
                    left: { kind: 'valueNode', nodeId: 'data_1' },
                    operator: 'less',
                    right: { kind: 'valueNode', nodeId: 'data_2' },
                  },
                },
                data_4: { type: 'number', expression: { kind: 'blackboard', key: 'effect_count' } },
                data_5: {
                  type: 'boolean',
                  expression: {
                    kind: 'targetDistance',
                    source: { kind: 'owner' },
                    target: { kind: 'fixed', target: 'enemy' },
                    distance: 0.5,
                    lessThan: false,
                    includeTargetRadius: true,
                    containsHittableObject: false,
                  },
                },
                data_6: {
                  type: 'number',
                  expression: {
                    kind: 'blackboard',
                    key: 'EntityBB_wisd_greater_will',
                    fallback: 0,
                  },
                },
                data_7: {
                  type: 'boolean',
                  expression: {
                    kind: 'actionValueCompare',
                    left: { kind: 'valueNode', nodeId: 'data_6' },
                    operator: 'greaterOrEqual',
                    right: { kind: 'constant', value: 1 },
                  },
                },
                data_8: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_wisd' },
                },
                data_9: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
                data_10: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_will' },
                },
              },
            },
            macros: {},
          },
        },
        chr_0032_lizhiyan_normal_skill_abilityrange: {
          skillId: 'chr_0032_lizhiyan_normal_skill_abilityrange',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 240,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale: 0, duration: 6, isJumped: 0, poise: 0, radius: 5 },
          scheduledSequences: [
            { startFrame: 21, endFrame: 180, sequence: { $sequence: 'aura_1' } },
            { startFrame: 21, endFrame: 180, sequence: { $sequence: 'listenForCombatEvents_5' } },
            { startFrame: 187, endFrame: 190, sequence: { $sequence: 'finishOwner_6' } },
            { startFrame: 20, endFrame: 23, sequence: { $sequence: 'forEachContextTarget_9' } },
            { startFrame: 186, endFrame: 189, sequence: { $sequence: 'forEachContextTarget_13' } },
          ],
          actionGraph: {
            main: {
              nodes: {
                aura_1: {
                  action: {
                    kind: 'aura',
                    parameters: {
                      targets: { kind: 'fixed', target: 'enemy' },
                      source: { kind: 'owner' },
                      inheritSourceSkillCastInfo: false,
                      buffs: [
                        {
                          buffId: 'buff_chr_0032_lizhiyan_normal_skill_aura',
                          blackboardAssignments: {},
                          stringBlackboardAssignments: {},
                        },
                      ],
                    },
                    onEnter: { $sequence: null },
                    onExit: { $sequence: null },
                  },
                  next: null,
                },
                jumpTimeline_2: {
                  action: {
                    kind: 'jumpTimeline',
                    parameters: { destinationFrame: 180 },
                    condition: { $sequence: null },
                  },
                  next: null,
                },
                modifyActionValue_3: {
                  action: {
                    kind: 'modifyActionValue',
                    parameters: {
                      key: 'isJumped',
                      operation: 'assign',
                      value: { kind: 'constant', value: 1 },
                    },
                  },
                  next: 'jumpTimeline_2',
                },
                checkCondition_4: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                  },
                  next: 'modifyActionValue_3',
                },
                listenForCombatEvents_5: {
                  action: {
                    kind: 'listenForCombatEvents',
                    parameters: {
                      responses: [
                        {
                          key: 'SkillData.chr_0032_lizhiyan_normal_skill_abilityrange.actionGroupData.timelineActions[1]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                          event: { kind: 'abilityEvent', event: 'beforeAddedBuff' },
                          phase: 'dataAction',
                          priority: 0,
                          sequence: { $sequence: 'checkCondition_4' },
                        },
                      ],
                    },
                  },
                  next: null,
                },
                finishOwner_6: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
                applyElementalInfliction_7: {
                  action: {
                    kind: 'applyElementalInfliction',
                    parameters: { element: 'nature', isExtra: false, inverseReaction: true },
                  },
                  next: null,
                },
                dealDamage_8: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'nature',
                      attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                      tags: ['normalSkill'],
                      stagger: { kind: 'valueNode', nodeId: 'data_3' },
                    },
                    key: 'abilityentity_chr_0032_lizhiyan_normal_skill:chr_0032_lizhiyan_normal_skill_abilityrange2|chr_0032_lizhiyan_normal_skill_abilityrange:/childSkills/chr_0032_lizhiyan_normal_skill_abilityrange/actionGraph/main/nodes/dealDamage_8/action',
                  },
                  next: 'applyElementalInfliction_7',
                },
                forEachContextTarget_9: {
                  action: {
                    kind: 'forEachContextTarget',
                    parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                    body: { $sequence: null },
                  },
                  next: 'dealDamage_8',
                },
                checkCondition_11: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
                  },
                  next: 'applyElementalInfliction_7',
                },
                dealDamage_12: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'nature',
                      attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                      tags: ['normalSkill'],
                      stagger: { kind: 'valueNode', nodeId: 'data_3' },
                    },
                    key: 'abilityentity_chr_0032_lizhiyan_normal_skill:chr_0032_lizhiyan_normal_skill_abilityrange2|chr_0032_lizhiyan_normal_skill_abilityrange:/childSkills/chr_0032_lizhiyan_normal_skill_abilityrange/actionGraph/main/nodes/dealDamage_12/action',
                  },
                  next: 'checkCondition_11',
                },
                forEachContextTarget_13: {
                  action: {
                    kind: 'forEachContextTarget',
                    parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                    body: { $sequence: null },
                  },
                  next: 'dealDamage_12',
                },
              },
              dataNodes: {
                data_1: {
                  type: 'boolean',
                  expression: {
                    kind: 'eventBuffIdMatch',
                    buffIds: ['buff_chr_0032_lizhiyan_normal_skill_listener'],
                  },
                },
                data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
                data_3: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
                data_4: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'isJumped', fallback: 0 },
                },
                data_5: {
                  type: 'boolean',
                  expression: {
                    kind: 'actionValueCompare',
                    left: { kind: 'valueNode', nodeId: 'data_4' },
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
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0032_lizhiyan/ultimate_aura',
      ],
      lifetime: { kind: 'limited', durationSeconds: 30 },
      childSkill: {
        skillId: 'chr_0032_lizhiyan_ultimate_skill_abilityrange',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 1800,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: {
          atk_scale_laser: 0.5,
          atk_scale_laser_will: 0.2,
          duration: 0,
          isWisd: 0,
          radius: 5,
        },
        scheduledSequences: [
          { startFrame: 0, endFrame: 1800, sequence: { $sequence: 'applyBuff_1' } },
          { startFrame: 0, endFrame: 1800, sequence: { $sequence: 'ifElse_5' } },
        ],
        actionGraph: {
          main: {
            nodes: {
              applyBuff_1: {
                action: {
                  kind: 'applyBuff',
                  parameters: {
                    buffs: [
                      { buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener_abilityentity' },
                    ],
                    targets: { kind: 'owner' },
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
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
                },
                next: null,
              },
              aura_3: {
                action: {
                  kind: 'aura',
                  parameters: {
                    targets: { kind: 'fixed', target: 'enemy' },
                    source: { kind: 'source' },
                    inheritSourceSkillCastInfo: true,
                    buffs: [
                      {
                        buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura',
                        blackboardAssignments: {
                          atk_scale_laser: { kind: 'valueNode', nodeId: 'data_3' },
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
              aura_4: {
                action: {
                  kind: 'aura',
                  parameters: {
                    targets: { kind: 'fixed', target: 'enemy' },
                    source: { kind: 'source' },
                    inheritSourceSkillCastInfo: true,
                    buffs: [
                      {
                        buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura',
                        blackboardAssignments: {
                          atk_scale_laser: { kind: 'valueNode', nodeId: 'data_4' },
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
              ifElse_5: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_2' },
                  whenTrue: { $sequence: 'aura_3' },
                  whenFalse: { $sequence: 'aura_4' },
                },
                next: null,
              },
            },
            dataNodes: {
              data_1: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'isWisd', fallback: 0 },
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
              data_3: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_laser' },
              },
              data_4: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_laser_will' },
              },
            },
          },
          macros: {},
        },
      },
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill_place: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0032_lizhiyan/ultimate_place',
      ],
      blackboard: { EntityBB_index: 0 },
      lifetime: { kind: 'limited', durationSeconds: 30 },
    },
    abilityentity_chr_0032_lizhiyan_combo_skill_death: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
      childSkill: {
        actionGraph: { main: { nodes: {} }, macros: {} },
        skillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_death_move',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 200,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: {
          atb_final: 50,
          atk_scale_final: 1,
          minAngle: 0,
          number: 0,
          owner_mainchar_alpha: 0,
          owner_mainchar_distance: 0,
          poise_final: 0,
          radius: 5,
        },
        scheduledSequences: [],
      },
    },
    abilityentity_chr_0032_lizhiyan_combo_skill_place: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill_death: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 2 },
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill_laser: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0032_lizhiyan/ultimate_tower',
      ],
      lifetime: { kind: 'limited', durationSeconds: 2 },
      childSkill: {
        skillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 90,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atk_scale_laser: 1, duration: 0, radius: 5.67 },
        scheduledSequences: [
          { startFrame: 12, endFrame: 28, sequence: { $sequence: 'ifElse_3' } },
          { startFrame: 13, endFrame: 45, sequence: { $sequence: 'ifElse_13' } },
        ],
        actionGraph: {
          main: {
            nodes: {
              checkCondition_1: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                },
                next: null,
              },
              dealDamage_2: {
                action: {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'nature',
                    attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                    tags: ['ultimateSkill'],
                    features: ['canBreakWeakness'],
                  },
                  key: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser:chr_0032_lizhiyan_ultimate_skill_laser:/childSkill/actionGraph/main/nodes/dealDamage_2/action',
                },
                next: null,
              },
              ifElse_3: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: null },
                  whenFalse: { $sequence: null },
                },
                next: 'dealDamage_2',
              },
              checkCondition_4: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                },
                next: null,
              },
              createTimedMarker_5: {
                action: {
                  kind: 'createTimedMarker',
                  parameters: {
                    targets: { kind: 'source' },
                    markerId: 'lizhiyan_ult_laser_hit3',
                    durationSeconds: { kind: 'constant', value: 0.8 },
                    autoFinishByAction: false,
                    timeDomain: 'globalScaled',
                  },
                },
                next: null,
              },
              checkCondition_6: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                },
                next: null,
              },
              checkCondition_7: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
                },
                next: null,
              },
              createTimedMarker_8: {
                action: {
                  kind: 'createTimedMarker',
                  parameters: {
                    targets: { kind: 'source' },
                    markerId: 'lizhiyan_ult_laser_hit2',
                    durationSeconds: { kind: 'constant', value: 0.8 },
                    autoFinishByAction: false,
                    timeDomain: 'globalScaled',
                  },
                },
                next: null,
              },
              ifElse_9: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_4' },
                  whenTrue: { $sequence: 'createTimedMarker_5' },
                  whenFalse: { $sequence: 'checkCondition_6' },
                },
                next: null,
              },
              checkCondition_10: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
                },
                next: null,
              },
              createTimedMarker_11: {
                action: {
                  kind: 'createTimedMarker',
                  parameters: {
                    targets: { kind: 'source' },
                    markerId: 'lizhiyan_ult_laser_hit1',
                    durationSeconds: { kind: 'constant', value: 0.8 },
                    autoFinishByAction: false,
                    timeDomain: 'globalScaled',
                  },
                },
                next: null,
              },
              ifElse_12: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_7' },
                  whenTrue: { $sequence: 'createTimedMarker_8' },
                  whenFalse: { $sequence: 'ifElse_9' },
                },
                next: null,
              },
              ifElse_13: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_10' },
                  whenTrue: { $sequence: 'createTimedMarker_11' },
                  whenFalse: { $sequence: 'ifElse_12' },
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
                  buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
                  operator: 'equal',
                  value: { kind: 'constant', value: 2 },
                },
              },
              data_2: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_laser' },
              },
              data_3: {
                type: 'boolean',
                expression: {
                  kind: 'timedMarkerPresent',
                  target: 'caster',
                  markerId: 'lizhiyan_ult_laser_hit3',
                },
              },
              data_4: {
                type: 'boolean',
                expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_3' } },
              },
              data_5: {
                type: 'boolean',
                expression: {
                  kind: 'timedMarkerPresent',
                  target: 'caster',
                  markerId: 'lizhiyan_power_attack_effect',
                },
              },
              data_6: {
                type: 'boolean',
                expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_5' } },
              },
              data_7: {
                type: 'boolean',
                expression: {
                  kind: 'timedMarkerPresent',
                  target: 'caster',
                  markerId: 'lizhiyan_ult_laser_hit2',
                },
              },
              data_8: {
                type: 'boolean',
                expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_7' } },
              },
              data_9: {
                type: 'boolean',
                expression: {
                  kind: 'timedMarkerPresent',
                  target: 'caster',
                  markerId: 'lizhiyan_ult_laser_hit1',
                },
              },
              data_10: {
                type: 'boolean',
                expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_9' } },
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

export default arcane;
