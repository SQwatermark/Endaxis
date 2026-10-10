/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */

import type { ActionGraphResourceDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import type { SkillDefinition } from '../../../packages/game-data-contract/src/skills';
import type { SkillBuffDefinition } from '../../../packages/game-data-contract/src/buffs';
import type { ComboSkillConditionDefinition } from '../../../packages/game-data-contract/src/operators';
import type { OperatorDefinition } from '../../../packages/game-data-contract/src/operators';
export const rossiChr_0028_wulfa_attack1ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      startTimeDilation_2: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.03 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      changeResource_3: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_2' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          },
        },
        next: 'startTimeDilation_2',
      },
      ifElse_4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'changeResource_3' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_5: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_3' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_4',
      },
      reachSkillOperableBoundary_6: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0028_wulfa_attack2'] },
        },
        next: null,
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

export const rossiChr_0028_wulfa_attack1: SkillDefinition = {
  key: 'chr_0028_wulfa_attack1',
  element: 'physical',
  blackboard: {
    atb: 0,
    atk_scale: [0.27, 0.3, 0.32, 0.35, 0.38, 0.41, 0.43, 0.46, 0.49, 0.52, 0.56, 0.61],
  },
  timelineBlockFrames: 9,
  naturalDurationFrames: 139,
  exclusiveFrame: 15,
  offsetRecordFrame: 8,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 3,
        endFrame: 34,
        input: 'basicAttack',
        targetSkillId: 'chr_0028_wulfa_attack2',
      },
    ],
    allowedNextSkills: [{ startFrame: 9, endFrame: 34, skillIds: ['chr_0028_wulfa_attack2'] }],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 8, endFrame: 9, sequence: { $sequence: 'dealDamage_5' } },
    { startFrame: 9, endFrame: 34, sequence: { $sequence: 'reachSkillOperableBoundary_6' } },
  ],
  timelineContinuationSkillId: 'chr_0028_wulfa_attack2',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: rossiChr_0028_wulfa_attack1ActionGraph,
};

export const rossiChr_0028_wulfa_attack2ActionGraph = {
  main: {
    nodes: {
      startTimeDilation_2: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.03 },
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
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_3',
      },
      calculateActionValue_5: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_2' },
            right: { kind: 'constant', value: 0.5 },
          },
        },
        next: 'dealDamage_4',
      },
      startTimeDilation_7: {
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
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'startTimeDilation_7' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_9: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack'],
          },
        },
        next: 'ifElse_8',
      },
      reachSkillOperableBoundary_10: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0028_wulfa_attack3'] },
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

export const rossiChr_0028_wulfa_attack2: SkillDefinition = {
  key: 'chr_0028_wulfa_attack2',
  element: 'physical',
  blackboard: {
    atk_scale: [0.32, 0.35, 0.38, 0.41, 0.44, 0.47, 0.5, 0.54, 0.57, 0.61, 0.65, 0.71],
  },
  timelineBlockFrames: 12,
  naturalDurationFrames: 151,
  exclusiveFrame: 20,
  offsetRecordFrame: 9,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 4,
        endFrame: 35,
        input: 'basicAttack',
        targetSkillId: 'chr_0028_wulfa_attack3',
      },
    ],
    allowedNextSkills: [{ startFrame: 12, endFrame: 34, skillIds: ['chr_0028_wulfa_attack3'] }],
  },
  costFrame: 8,
  scheduledSequences: [
    { startFrame: 5, endFrame: 6, sequence: { $sequence: 'calculateActionValue_5' } },
    { startFrame: 9, endFrame: 10, sequence: { $sequence: 'dealDamage_9' } },
    { startFrame: 12, endFrame: 34, sequence: { $sequence: 'reachSkillOperableBoundary_10' } },
  ],
  timelineContinuationSkillId: 'chr_0028_wulfa_attack3',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: rossiChr_0028_wulfa_attack2ActionGraph,
};

export const rossiChr_0028_wulfa_attack3ActionGraph = {
  main: {
    nodes: {
      startTimeDilation_2: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.03 },
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
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack'],
            stagger: { kind: 'valueNode', nodeId: 'data_3' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'ifElse_3',
      },
      calculateActionValue_5: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_2' },
            right: { kind: 'constant', value: 0.5 },
          },
        },
        next: 'dealDamage_4',
      },
      startTimeDilation_7: {
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
      changeResource_8: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_4' },
            coefficient: { kind: 'constant', value: 0.5 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          },
        },
        next: 'startTimeDilation_7',
      },
      ifElse_9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'changeResource_8' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_10: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack'],
            stagger: { kind: 'valueNode', nodeId: 'data_3' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'ifElse_9',
      },
      reachSkillOperableBoundary_11: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0028_wulfa_attack4'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const rossiChr_0028_wulfa_attack3: SkillDefinition = {
  key: 'chr_0028_wulfa_attack3',
  element: 'physical',
  blackboard: {
    atb: 0,
    atk_scale: [0.34, 0.37, 0.41, 0.44, 0.48, 0.51, 0.54, 0.58, 0.61, 0.65, 0.71, 0.77],
    poise: 0,
  },
  timelineBlockFrames: 15,
  naturalDurationFrames: 209,
  exclusiveFrame: 25,
  offsetRecordFrame: 12,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 5,
        endFrame: 35,
        input: 'basicAttack',
        targetSkillId: 'chr_0028_wulfa_attack4',
      },
    ],
    allowedNextSkills: [{ startFrame: 15, endFrame: 36, skillIds: ['chr_0028_wulfa_attack4'] }],
  },
  costFrame: 12,
  scheduledSequences: [
    { startFrame: 4, endFrame: 5, sequence: { $sequence: 'calculateActionValue_5' } },
    { startFrame: 12, endFrame: 13, sequence: { $sequence: 'dealDamage_10' } },
    { startFrame: 15, endFrame: 36, sequence: { $sequence: 'reachSkillOperableBoundary_11' } },
  ],
  timelineContinuationSkillId: 'chr_0028_wulfa_attack4',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: rossiChr_0028_wulfa_attack3ActionGraph,
};

export const rossiChr_0028_wulfa_attack4ActionGraph = {
  main: {
    nodes: {
      jumpTimeline_2: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 189 },
          condition: { $sequence: null },
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
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'jumpTimeline_2' },
        },
        next: null,
      },
      changeResource_5: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_2' },
            coefficient: { kind: 'constant', value: 0.25 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          },
        },
        next: null,
      },
      ifElse_6: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'changeResource_5' },
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
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_3' },
            right: { kind: 'constant', value: 0.2 },
          },
        },
        next: 'dealDamage_7',
      },
      calculateActionValue_29: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_3' },
            right: { kind: 'constant', value: 0.5 },
          },
        },
        next: 'dealDamage_7',
      },
      markCurrentSkillCanInterrupt_46: {
        action: { kind: 'markCurrentSkillCanInterrupt', parameters: {} },
        next: null,
      },
      interruptCurrentSkill_47: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      reachSkillOperableBoundary_48: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0028_wulfa_attack5'] },
        },
        next: null,
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

export const rossiChr_0028_wulfa_attack4: SkillDefinition = {
  key: 'chr_0028_wulfa_attack4',
  element: 'physical',
  blackboard: {
    atb: 0,
    atk_scale: [0.41, 0.45, 0.49, 0.53, 0.57, 0.61, 0.65, 0.69, 0.73, 0.78, 0.84, 0.91],
  },
  timelineBlockFrames: 36,
  naturalDurationFrames: 329,
  exclusiveFrame: 239,
  offsetRecordFrame: 15,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 18,
        endFrame: 65,
        input: 'basicAttack',
        targetSkillId: 'chr_0028_wulfa_attack5',
      },
      {
        startFrame: 207,
        endFrame: 246,
        input: 'basicAttack',
        targetSkillId: 'chr_0028_wulfa_attack5',
      },
    ],
    allowedNextSkills: [
      { startFrame: 36, endFrame: 67, skillIds: ['chr_0028_wulfa_attack5'] },
      { startFrame: 225, endFrame: 250, skillIds: ['chr_0028_wulfa_attack5'] },
    ],
  },
  costFrame: 8,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_3' } },
    { startFrame: 6, endFrame: 8, sequence: { $sequence: 'calculateActionValue_8' } },
    { startFrame: 8, endFrame: 9, sequence: { $sequence: 'dealDamage_7' } },
    { startFrame: 13, endFrame: 15, sequence: { $sequence: 'dealDamage_7' } },
    { startFrame: 15, endFrame: 17, sequence: { $sequence: 'dealDamage_7' } },
    { startFrame: 23, endFrame: 25, sequence: { $sequence: 'dealDamage_7' } },
    { startFrame: 195, endFrame: 197, sequence: { $sequence: 'calculateActionValue_29' } },
    { startFrame: 198, endFrame: 199, sequence: { $sequence: 'dealDamage_7' } },
    { startFrame: 203, endFrame: 205, sequence: { $sequence: 'dealDamage_7' } },
    { startFrame: 205, endFrame: 207, sequence: { $sequence: 'dealDamage_7' } },
    { startFrame: 213, endFrame: 215, sequence: { $sequence: 'dealDamage_7' } },
    { startFrame: 50, endFrame: 188, sequence: { $sequence: 'markCurrentSkillCanInterrupt_46' } },
    { startFrame: 188, endFrame: 189, sequence: { $sequence: 'interruptCurrentSkill_47' } },
    { startFrame: 36, endFrame: 67, sequence: { $sequence: 'reachSkillOperableBoundary_48' } },
    { startFrame: 225, endFrame: 250, sequence: { $sequence: 'reachSkillOperableBoundary_48' } },
  ],
  timelineContinuationSkillId: 'chr_0028_wulfa_attack5',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: rossiChr_0028_wulfa_attack4ActionGraph,
};

export const rossiChr_0028_wulfa_attack5ActionGraph = {
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
      changeResource_3: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_3' },
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
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'changeResource_3' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_5: {
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
      checkCondition_6: {
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
          condition: { $sequence: null },
          whenTrue: { $sequence: 'modifyActionValue_5' },
          whenFalse: { $sequence: null },
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
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: { kind: 'valueNode', nodeId: 'data_6' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'ifElse_8',
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      startTimeDilation_11: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.25 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0.002923974,
                  value: 0.2,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1241782,
                  value: 0.1,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.5,
                  value: 0.1,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.2,
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
        next: null,
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'startTimeDilation_11' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      reachSkillOperableBoundary_13: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0028_wulfa_attack1'] },
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
      data_2: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
      data_4: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_7: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'isHitbyMain', fallback: 0 },
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
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const rossiChr_0028_wulfa_attack5: SkillDefinition = {
  key: 'chr_0028_wulfa_attack5',
  element: 'physical',
  blackboard: {
    atb: 21,
    atk_scale: [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.96, 1.04, 1.13],
    isHitbyMain: 0,
    poise: 18,
  },
  timelineBlockFrames: 31,
  naturalDurationFrames: 146,
  exclusiveFrame: 30,
  offsetRecordFrame: 15,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 27,
        endFrame: 60,
        input: 'basicAttack',
        targetSkillId: 'chr_0028_wulfa_attack1',
      },
    ],
    allowedNextSkills: [{ startFrame: 45, endFrame: 60, skillIds: ['chr_0028_wulfa_attack1'] }],
  },
  costFrame: 12,
  scheduledSequences: [
    { startFrame: 15, endFrame: 17, sequence: { $sequence: 'ifElse_4' } },
    { startFrame: 15, endFrame: 17, sequence: { $sequence: 'dealDamage_9' } },
    { startFrame: 16, endFrame: 18, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 45, endFrame: 60, sequence: { $sequence: 'reachSkillOperableBoundary_13' } },
  ],
  timelineContinuationSkillId: 'chr_0028_wulfa_attack1',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: rossiChr_0028_wulfa_attack5ActionGraph,
};

export const rossiChr_0028_wulfa_power_attackActionGraph = {
  main: {
    nodes: {
      changeResource_2: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'constant', value: 0 },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'gain',
            spGainSource: 'default',
          },
        },
        next: null,
      },
      startTimeDilation_3: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.06 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['caster'],
          },
        },
        next: 'changeResource_2',
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
          whenTrue: { $sequence: 'startTimeDilation_3' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_5: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
            tags: ['normalAttack', 'powerAttack'],
          },
        },
        next: 'ifElse_4',
      },
      dealDamage_17: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            calculation: 'breakingAttack',
            calculationMultiplier: 0.8,
            tags: ['normalAttack', 'powerAttack'],
          },
        },
        next: null,
      },
      gainFinisherSp_18: {
        action: { kind: 'gainFinisherSp', parameters: { factor: 1, recipient: 'team' } },
        next: 'dealDamage_17',
      },
      startTimeDilation_19: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.45 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.5935698,
                  value: 0.05,
                  inTangent: -0.02046953,
                  outTangent: -0.02046953,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 3.483965,
                  outTangent: 3.483965,
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
      ifElse_20: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'startTimeDilation_19' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_21: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_powerattack_resumecombo' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'applyBuff_21',
      },
      applyBuff_23: {
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
      applyBuff_24: {
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
      checkCondition_opt1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: 'dealDamage_5',
      },
      findTargets_opt2: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: 'checkCondition_opt1',
      },
      repeatEachTick_opt3: {
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
          body: { $sequence: 'findTargets_opt2' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timerlistening'],
          operator: 'greater',
          value: { kind: 'constant', value: 0.5 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const rossiChr_0028_wulfa_power_attack: SkillDefinition = {
  key: 'chr_0028_wulfa_power_attack',
  element: 'physical',
  blackboard: { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
  timelineBlockFrames: 66,
  naturalDurationFrames: 216,
  exclusiveFrame: 65,
  offsetRecordFrame: 0,
  costFrame: 4,
  scheduledSequences: [
    { startFrame: 6, endFrame: 8, sequence: { $sequence: 'repeatEachTick_opt3' } },
    { startFrame: 15, endFrame: 17, sequence: { $sequence: 'repeatEachTick_opt3' } },
    { startFrame: 36, endFrame: 39, sequence: { $sequence: 'gainFinisherSp_18' } },
    { startFrame: 38, endFrame: 41, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 0, endFrame: 65, sequence: { $sequence: 'checkCondition_22' } },
    { startFrame: 0, endFrame: 65, sequence: { $sequence: 'applyBuff_23' } },
    { startFrame: 0, endFrame: 65, sequence: { $sequence: 'applyBuff_24' } },
  ],
  skillType: 'finisher',
  levelSource: 'basicAttack',
  nativeSkillType: 'breakingAttack',
  actionGraph: rossiChr_0028_wulfa_power_attackActionGraph,
};

export const rossiChr_0028_wulfa_plunging_attack_endActionGraph = {
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

export const rossiChr_0028_wulfa_plunging_attack_end: SkillDefinition = {
  key: 'chr_0028_wulfa_plunging_attack_end',
  element: 'physical',
  blackboard: {
    atb: 0,
    atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
  timelineBlockFrames: 21,
  naturalDurationFrames: 161,
  exclusiveFrame: 20,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [{ startFrame: 1, endFrame: 6, sequence: { $sequence: 'dealDamage_4' } }],
  skillType: 'plungingAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: rossiChr_0028_wulfa_plunging_attack_endActionGraph,
};

export const rossiChr_0028_wulfa_normal_skillActionGraph = {
  main: {
    nodes: {
      checkCondition_4: {
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
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_6' },
        },
        next: null,
      },
      ifElse_10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'ifElse_8' },
          whenFalse: { $sequence: 'ifElse_8' },
        },
        next: null,
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_10' },
        },
        next: null,
      },
      modifyActionValue_24: {
        action: {
          kind: 'modifyActionValue',
          parameters: { key: 'trigger', operation: 'add', value: { kind: 'constant', value: 1 } },
        },
        next: null,
      },
      checkCondition_23: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_25: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_23' },
          whenTrue: { $sequence: 'modifyActionValue_24' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_26: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_5' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          },
        },
        next: 'ifElse_25',
      },
      findTargets_27: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: 'dealDamage_26',
      },
      repeatEachTick_28: {
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
          body: { $sequence: 'findTargets_27' },
        },
        next: null,
      },
      calculateActionValue_29: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_6' },
            right: { kind: 'constant', value: 0.3 },
          },
        },
        next: 'repeatEachTick_28',
      },
      checkCondition_43: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      startTimeDilation_46: {
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
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.7389196,
                  value: 0.05473808,
                  inTangent: 0.02105814,
                  outTangent: 0.02105814,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.5,
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
        next: null,
      },
      checkCondition_45: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      ifElse_53: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_45' },
          whenTrue: { $sequence: 'startTimeDilation_46' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_54: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_43' },
          whenTrue: { $sequence: 'modifyActionValue_24' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_53',
      },
      dealDamage_55: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_5' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_10' },
          },
        },
        next: 'ifElse_54',
      },
      applyPhysicalInfliction_56: {
        action: {
          kind: 'applyPhysicalInfliction',
          parameters: {
            type: 'airborne',
            target: 'enemy',
            isExtra: false,
            duration: { kind: 'constant', value: 1.2 },
            height: { kind: 'constant', value: 1.5 },
            speedFactorMultiplier: 1,
            force: false,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
          },
        },
        next: 'dealDamage_55',
      },
      modifyActionValue_52: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'FollowAttackTrigger',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'applyPhysicalInfliction_56',
      },
      checkCondition_47: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: null,
      },
      ifElse_57: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_47' },
          whenTrue: { $sequence: 'modifyActionValue_52' },
          whenFalse: { $sequence: 'applyPhysicalInfliction_56' },
        },
        next: null,
      },
      repeatEachTick_58: {
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
          body: { $sequence: 'ifElse_57' },
        },
        next: null,
      },
      modifyActionValue_59: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'trigger',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'repeatEachTick_58',
      },
      calculateActionValue_60: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_6' },
            right: { kind: 'constant', value: 0.4 },
          },
        },
        next: 'modifyActionValue_59',
      },
      applyBuff_61: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_normal_wolf_timer' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
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
            source: 'actionOwner',
            recycleDelaySeconds: 1,
            hit: { onReach: true, finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0028_wulfa_normal_skill_projhit5',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 30,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'repeatEachTick_58' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_66' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_54: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'heat',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['normalSkill'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                          },
                        },
                        next: null,
                      },
                      applyBuff_38: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                blackboardAssignments: { talent_2: { kind: 'constant', value: 0 } },
                                copiedBlackboardAssignments: {
                                  duration: 'duration_bleed',
                                  atk_scale: 'atk_scale_bleed',
                                  extra_atk_scale: 'bleed_critical_damage_scale',
                                  damage_cd: 'bleed_critical_damage_interval',
                                  damage_up: 'damage_up',
                                  heal_scale: 'heal_scale',
                                  talent2_burning_damage_scale: 'talent2_burning_damage_scale',
                                },
                              },
                            ],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                          },
                        },
                        next: 'dealDamage_54',
                      },
                      applyBuff_36: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                blackboardAssignments: { talent_2: { kind: 'constant', value: 1 } },
                                copiedBlackboardAssignments: {
                                  duration: 'duration_bleed',
                                  atk_scale: 'atk_scale_bleed',
                                  extra_atk_scale: 'bleed_critical_damage_scale',
                                  damage_cd: 'bleed_critical_damage_interval',
                                  damage_up: 'damage_up',
                                  heal_scale: 'heal_scale',
                                  talent2_burning_damage_scale: 'talent2_burning_damage_scale',
                                },
                              },
                            ],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                          },
                        },
                        next: 'dealDamage_54',
                      },
                      checkCondition_34: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                        },
                        next: null,
                      },
                      ifElse_42: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_34' },
                          whenTrue: { $sequence: 'applyBuff_36' },
                          whenFalse: { $sequence: 'applyBuff_38' },
                        },
                        next: null,
                      },
                      checkCondition_39: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      ifElse_44: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_39' },
                          whenTrue: { $sequence: 'applyBuff_36' },
                          whenFalse: { $sequence: 'ifElse_42' },
                        },
                        next: null,
                      },
                      checkCondition_43: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
                        },
                        next: null,
                      },
                      ifElse_48: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_43' },
                          whenTrue: { $sequence: 'ifElse_44' },
                          whenFalse: { $sequence: 'dealDamage_54' },
                        },
                        next: null,
                      },
                      checkCondition_46: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
                        },
                        next: null,
                      },
                      ifElse_50: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_46' },
                          whenTrue: { $sequence: 'ifElse_44' },
                          whenFalse: { $sequence: 'ifElse_48' },
                        },
                        next: null,
                      },
                      ifElse_53: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: null },
                          whenTrue: { $sequence: 'ifElse_50' },
                          whenFalse: { $sequence: 'ifElse_50' },
                        },
                        next: null,
                      },
                      checkCondition_51: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
                        },
                        next: null,
                      },
                      checkCondition_52: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
                        },
                        next: 'checkCondition_51',
                      },
                      ifElse_55: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_52' },
                          whenTrue: { $sequence: 'ifElse_53' },
                          whenFalse: { $sequence: 'dealDamage_54' },
                        },
                        next: null,
                      },
                      calculateActionValue_56: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'poise_2',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_2' },
                            right: { kind: 'constant', value: 0.25 },
                          },
                        },
                        next: 'ifElse_55',
                      },
                      calculateActionValue_57: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale_once',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_13' },
                            right: { kind: 'constant', value: 0.25 },
                          },
                        },
                        next: 'calculateActionValue_56',
                      },
                      repeatEachTick_58: {
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
                          body: { $sequence: 'calculateActionValue_57' },
                        },
                        next: null,
                      },
                      finishBuffsById_62: {
                        action: {
                          kind: 'finishBuffsById',
                          parameters: {
                            targets: { kind: 'source' },
                            finishSource: { kind: 'source' },
                            buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                            reason: 'early',
                          },
                        },
                        next: null,
                      },
                      changeResource_61: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'sp',
                            amount: { kind: 'valueNode', nodeId: 'data_14' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                            spGainKind: 'refund',
                            spGainSource: 'skill',
                          },
                        },
                        next: 'finishBuffsById_62',
                      },
                      checkCondition_59: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
                        },
                        next: null,
                      },
                      ifElse_63: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_59' },
                          whenTrue: { $sequence: 'changeResource_61' },
                          whenFalse: { $sequence: 'finishBuffsById_62' },
                        },
                        next: null,
                      },
                      changeResource_64: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'valueNode', nodeId: 'data_17' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                          },
                        },
                        next: 'ifElse_63',
                      },
                      checkCondition_65: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_18' } },
                        },
                        next: 'changeResource_64',
                      },
                      checkCondition_66: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
                        },
                        next: 'checkCondition_65',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_once' },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'poise_2' },
                      },
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_2_2', fallback: 0 },
                      },
                      data_4: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_3' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_2_1', fallback: 0 },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_5' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_7: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_1_2', fallback: 0 },
                      },
                      data_8: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_7' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_9: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_1_1', fallback: 0 },
                      },
                      data_10: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_9' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_11: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_12: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                          operator: 'greater',
                          value: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_13: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_3' },
                      },
                      data_14: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atb_return' },
                      },
                      data_15: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'potential_upgrade', fallback: 0 },
                      },
                      data_16: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_15' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 1 },
                        },
                      },
                      data_17: { type: 'number', expression: { kind: 'blackboard', key: 'usp_2' } },
                      data_18: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_19: {
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
          ],
        },
        next: 'applyBuff_61',
      },
      launchProjectile_63: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            source: 'actionOwner',
            recycleDelaySeconds: 1,
            hit: { onReach: true, finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0028_wulfa_normal_skill_projhit4',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 30,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'repeatEachTick_58' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_66' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_54: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'heat',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['normalSkill'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                          },
                        },
                        next: null,
                      },
                      applyBuff_38: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                blackboardAssignments: { talent_2: { kind: 'constant', value: 0 } },
                                copiedBlackboardAssignments: {
                                  duration: 'duration_bleed',
                                  atk_scale: 'atk_scale_bleed',
                                  extra_atk_scale: 'bleed_critical_damage_scale',
                                  damage_cd: 'bleed_critical_damage_interval',
                                  damage_up: 'damage_up',
                                  heal_scale: 'heal_scale',
                                  talent2_burning_damage_scale: 'talent2_burning_damage_scale',
                                },
                              },
                            ],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                          },
                        },
                        next: 'dealDamage_54',
                      },
                      applyBuff_36: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                blackboardAssignments: { talent_2: { kind: 'constant', value: 1 } },
                                copiedBlackboardAssignments: {
                                  duration: 'duration_bleed',
                                  atk_scale: 'atk_scale_bleed',
                                  extra_atk_scale: 'bleed_critical_damage_scale',
                                  damage_cd: 'bleed_critical_damage_interval',
                                  damage_up: 'damage_up',
                                  heal_scale: 'heal_scale',
                                  talent2_burning_damage_scale: 'talent2_burning_damage_scale',
                                },
                              },
                            ],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                          },
                        },
                        next: 'dealDamage_54',
                      },
                      checkCondition_34: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                        },
                        next: null,
                      },
                      ifElse_42: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_34' },
                          whenTrue: { $sequence: 'applyBuff_36' },
                          whenFalse: { $sequence: 'applyBuff_38' },
                        },
                        next: null,
                      },
                      checkCondition_39: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      ifElse_44: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_39' },
                          whenTrue: { $sequence: 'applyBuff_36' },
                          whenFalse: { $sequence: 'ifElse_42' },
                        },
                        next: null,
                      },
                      checkCondition_43: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
                        },
                        next: null,
                      },
                      ifElse_48: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_43' },
                          whenTrue: { $sequence: 'ifElse_44' },
                          whenFalse: { $sequence: 'dealDamage_54' },
                        },
                        next: null,
                      },
                      checkCondition_46: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
                        },
                        next: null,
                      },
                      ifElse_50: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_46' },
                          whenTrue: { $sequence: 'ifElse_44' },
                          whenFalse: { $sequence: 'ifElse_48' },
                        },
                        next: null,
                      },
                      ifElse_53: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: null },
                          whenTrue: { $sequence: 'ifElse_50' },
                          whenFalse: { $sequence: 'ifElse_50' },
                        },
                        next: null,
                      },
                      checkCondition_51: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
                        },
                        next: null,
                      },
                      checkCondition_52: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
                        },
                        next: 'checkCondition_51',
                      },
                      ifElse_55: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_52' },
                          whenTrue: { $sequence: 'ifElse_53' },
                          whenFalse: { $sequence: 'dealDamage_54' },
                        },
                        next: null,
                      },
                      calculateActionValue_56: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'poise_2',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_2' },
                            right: { kind: 'constant', value: 0.25 },
                          },
                        },
                        next: 'ifElse_55',
                      },
                      calculateActionValue_57: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale_once',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_13' },
                            right: { kind: 'constant', value: 0.25 },
                          },
                        },
                        next: 'calculateActionValue_56',
                      },
                      repeatEachTick_58: {
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
                          body: { $sequence: 'calculateActionValue_57' },
                        },
                        next: null,
                      },
                      finishBuffsById_62: {
                        action: {
                          kind: 'finishBuffsById',
                          parameters: {
                            targets: { kind: 'source' },
                            finishSource: { kind: 'source' },
                            buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                            reason: 'early',
                          },
                        },
                        next: null,
                      },
                      changeResource_61: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'sp',
                            amount: { kind: 'valueNode', nodeId: 'data_14' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                            spGainKind: 'refund',
                            spGainSource: 'skill',
                          },
                        },
                        next: 'finishBuffsById_62',
                      },
                      checkCondition_59: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
                        },
                        next: null,
                      },
                      ifElse_63: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_59' },
                          whenTrue: { $sequence: 'changeResource_61' },
                          whenFalse: { $sequence: 'finishBuffsById_62' },
                        },
                        next: null,
                      },
                      changeResource_64: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'valueNode', nodeId: 'data_17' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                          },
                        },
                        next: 'ifElse_63',
                      },
                      checkCondition_65: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_18' } },
                        },
                        next: 'changeResource_64',
                      },
                      checkCondition_66: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
                        },
                        next: 'checkCondition_65',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_once' },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'poise_2' },
                      },
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_2_2', fallback: 0 },
                      },
                      data_4: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_3' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_2_1', fallback: 0 },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_5' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_7: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_1_2', fallback: 0 },
                      },
                      data_8: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_7' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_9: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_1_1', fallback: 0 },
                      },
                      data_10: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_9' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_11: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_12: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                          operator: 'greater',
                          value: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_13: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_3' },
                      },
                      data_14: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atb_return' },
                      },
                      data_15: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'potential_upgrade', fallback: 0 },
                      },
                      data_16: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_15' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 1 },
                        },
                      },
                      data_17: { type: 'number', expression: { kind: 'blackboard', key: 'usp_2' } },
                      data_18: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_19: {
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
          ],
        },
        next: 'launchProjectile_62',
      },
      launchProjectile_64: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            source: 'actionOwner',
            recycleDelaySeconds: 1,
            hit: { onReach: true, finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0028_wulfa_normal_skill_projhit3',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 30,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'repeatEachTick_59' } },
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'checkCondition_62' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_70' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_54: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'heat',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['normalSkill'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                          },
                        },
                        next: null,
                      },
                      applyBuff_38: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                blackboardAssignments: { talent_2: { kind: 'constant', value: 0 } },
                                copiedBlackboardAssignments: {
                                  duration: 'duration_bleed',
                                  atk_scale: 'atk_scale_bleed',
                                  extra_atk_scale: 'bleed_critical_damage_scale',
                                  damage_cd: 'bleed_critical_damage_interval',
                                  damage_up: 'damage_up',
                                  heal_scale: 'heal_scale',
                                  talent2_burning_damage_scale: 'talent2_burning_damage_scale',
                                },
                              },
                            ],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                          },
                        },
                        next: 'dealDamage_54',
                      },
                      applyBuff_36: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                blackboardAssignments: { talent_2: { kind: 'constant', value: 1 } },
                                copiedBlackboardAssignments: {
                                  duration: 'duration_bleed',
                                  atk_scale: 'atk_scale_bleed',
                                  extra_atk_scale: 'bleed_critical_damage_scale',
                                  damage_cd: 'bleed_critical_damage_interval',
                                  damage_up: 'damage_up',
                                  heal_scale: 'heal_scale',
                                  talent2_burning_damage_scale: 'talent2_burning_damage_scale',
                                },
                              },
                            ],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                          },
                        },
                        next: 'dealDamage_54',
                      },
                      checkCondition_34: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                        },
                        next: null,
                      },
                      ifElse_42: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_34' },
                          whenTrue: { $sequence: 'applyBuff_36' },
                          whenFalse: { $sequence: 'applyBuff_38' },
                        },
                        next: null,
                      },
                      checkCondition_39: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      ifElse_44: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_39' },
                          whenTrue: { $sequence: 'applyBuff_36' },
                          whenFalse: { $sequence: 'ifElse_42' },
                        },
                        next: null,
                      },
                      checkCondition_43: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
                        },
                        next: null,
                      },
                      ifElse_48: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_43' },
                          whenTrue: { $sequence: 'ifElse_44' },
                          whenFalse: { $sequence: 'dealDamage_54' },
                        },
                        next: null,
                      },
                      checkCondition_46: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
                        },
                        next: null,
                      },
                      ifElse_50: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_46' },
                          whenTrue: { $sequence: 'ifElse_44' },
                          whenFalse: { $sequence: 'ifElse_48' },
                        },
                        next: null,
                      },
                      ifElse_53: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: null },
                          whenTrue: { $sequence: 'ifElse_50' },
                          whenFalse: { $sequence: 'ifElse_50' },
                        },
                        next: null,
                      },
                      checkCondition_51: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
                        },
                        next: null,
                      },
                      checkCondition_52: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
                        },
                        next: 'checkCondition_51',
                      },
                      ifElse_55: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_52' },
                          whenTrue: { $sequence: 'ifElse_53' },
                          whenFalse: { $sequence: 'dealDamage_54' },
                        },
                        next: null,
                      },
                      applyBuff_56: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_chr_0028_wulfa_tut_normalskill_success' }],
                            targets: { kind: 'source' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                            finishByAction: true,
                          },
                        },
                        next: 'ifElse_55',
                      },
                      calculateActionValue_57: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'poise_2',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_2' },
                            right: { kind: 'constant', value: 0.25 },
                          },
                        },
                        next: 'applyBuff_56',
                      },
                      calculateActionValue_58: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale_once',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_13' },
                            right: { kind: 'constant', value: 0.25 },
                          },
                        },
                        next: 'calculateActionValue_57',
                      },
                      repeatEachTick_59: {
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
                          body: { $sequence: 'calculateActionValue_58' },
                        },
                        next: null,
                      },
                      calculateActionValue_60: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'hit_bleed_num',
                            operation: 'add',
                            left: { kind: 'valueNode', nodeId: 'data_14' },
                            right: { kind: 'constant', value: 1 },
                          },
                        },
                        next: null,
                      },
                      checkCondition_61: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
                        },
                        next: 'calculateActionValue_60',
                      },
                      checkCondition_62: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
                        },
                        next: 'checkCondition_61',
                      },
                      finishBuffsById_66: {
                        action: {
                          kind: 'finishBuffsById',
                          parameters: {
                            targets: { kind: 'source' },
                            finishSource: { kind: 'source' },
                            buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                            reason: 'early',
                          },
                        },
                        next: null,
                      },
                      changeResource_65: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'sp',
                            amount: { kind: 'valueNode', nodeId: 'data_17' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                            spGainKind: 'refund',
                            spGainSource: 'skill',
                          },
                        },
                        next: 'finishBuffsById_66',
                      },
                      checkCondition_63: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
                        },
                        next: null,
                      },
                      ifElse_67: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_63' },
                          whenTrue: { $sequence: 'changeResource_65' },
                          whenFalse: { $sequence: 'finishBuffsById_66' },
                        },
                        next: null,
                      },
                      changeResource_68: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'valueNode', nodeId: 'data_20' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                          },
                        },
                        next: 'ifElse_67',
                      },
                      checkCondition_69: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_21' } },
                        },
                        next: 'changeResource_68',
                      },
                      checkCondition_70: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_22' } },
                        },
                        next: 'checkCondition_69',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_once' },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'poise_2' },
                      },
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_2_2', fallback: 0 },
                      },
                      data_4: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_3' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_2_1', fallback: 0 },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_5' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_7: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_1_2', fallback: 0 },
                      },
                      data_8: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_7' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_9: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_1_1', fallback: 0 },
                      },
                      data_10: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_9' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_11: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_12: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                          operator: 'greater',
                          value: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_13: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_3' },
                      },
                      data_14: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'hit_bleed_num' },
                      },
                      data_15: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0028_wulfa_normal_bleed'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_16: {
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
                      data_17: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atb_return' },
                      },
                      data_18: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'potential_upgrade', fallback: 0 },
                      },
                      data_19: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_18' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 1 },
                        },
                      },
                      data_20: { type: 'number', expression: { kind: 'blackboard', key: 'usp_2' } },
                      data_21: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_22: {
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
          ],
        },
        next: 'launchProjectile_63',
      },
      launchProjectile_65: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            source: 'actionOwner',
            recycleDelaySeconds: 0.333333343267441,
            hit: { onReach: true, finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0028_wulfa_normal_skill_projhit2',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 10,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'repeatEachTick_58' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_66' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_54: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'heat',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['normalSkill'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'valueNode', nodeId: 'data_2' },
                          },
                        },
                        next: null,
                      },
                      applyBuff_38: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                blackboardAssignments: { talent_2: { kind: 'constant', value: 0 } },
                                copiedBlackboardAssignments: {
                                  duration: 'duration_bleed',
                                  atk_scale: 'atk_scale_bleed',
                                  extra_atk_scale: 'bleed_critical_damage_scale',
                                  damage_cd: 'bleed_critical_damage_interval',
                                  damage_up: 'damage_up',
                                  heal_scale: 'heal_scale',
                                  talent2_burning_damage_scale: 'talent2_burning_damage_scale',
                                },
                              },
                            ],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                          },
                        },
                        next: 'dealDamage_54',
                      },
                      applyBuff_36: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                blackboardAssignments: { talent_2: { kind: 'constant', value: 1 } },
                                copiedBlackboardAssignments: {
                                  duration: 'duration_bleed',
                                  atk_scale: 'atk_scale_bleed',
                                  extra_atk_scale: 'bleed_critical_damage_scale',
                                  damage_cd: 'bleed_critical_damage_interval',
                                  damage_up: 'damage_up',
                                  heal_scale: 'heal_scale',
                                  talent2_burning_damage_scale: 'talent2_burning_damage_scale',
                                },
                              },
                            ],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                          },
                        },
                        next: 'dealDamage_54',
                      },
                      checkCondition_34: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                        },
                        next: null,
                      },
                      ifElse_42: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_34' },
                          whenTrue: { $sequence: 'applyBuff_36' },
                          whenFalse: { $sequence: 'applyBuff_38' },
                        },
                        next: null,
                      },
                      checkCondition_39: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      ifElse_44: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_39' },
                          whenTrue: { $sequence: 'applyBuff_36' },
                          whenFalse: { $sequence: 'ifElse_42' },
                        },
                        next: null,
                      },
                      checkCondition_43: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
                        },
                        next: null,
                      },
                      ifElse_48: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_43' },
                          whenTrue: { $sequence: 'ifElse_44' },
                          whenFalse: { $sequence: 'dealDamage_54' },
                        },
                        next: null,
                      },
                      checkCondition_46: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
                        },
                        next: null,
                      },
                      ifElse_50: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_46' },
                          whenTrue: { $sequence: 'ifElse_44' },
                          whenFalse: { $sequence: 'ifElse_48' },
                        },
                        next: null,
                      },
                      ifElse_53: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: null },
                          whenTrue: { $sequence: 'ifElse_50' },
                          whenFalse: { $sequence: 'ifElse_50' },
                        },
                        next: null,
                      },
                      checkCondition_51: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
                        },
                        next: null,
                      },
                      checkCondition_52: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
                        },
                        next: 'checkCondition_51',
                      },
                      ifElse_55: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_52' },
                          whenTrue: { $sequence: 'ifElse_53' },
                          whenFalse: { $sequence: 'dealDamage_54' },
                        },
                        next: null,
                      },
                      calculateActionValue_56: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'poise_2',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_2' },
                            right: { kind: 'constant', value: 0.25 },
                          },
                        },
                        next: 'ifElse_55',
                      },
                      calculateActionValue_57: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale_once',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_13' },
                            right: { kind: 'constant', value: 0.25 },
                          },
                        },
                        next: 'calculateActionValue_56',
                      },
                      repeatEachTick_58: {
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
                          body: { $sequence: 'calculateActionValue_57' },
                        },
                        next: null,
                      },
                      finishBuffsById_62: {
                        action: {
                          kind: 'finishBuffsById',
                          parameters: {
                            targets: { kind: 'source' },
                            finishSource: { kind: 'source' },
                            buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                            reason: 'early',
                          },
                        },
                        next: null,
                      },
                      changeResource_61: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'sp',
                            amount: { kind: 'valueNode', nodeId: 'data_14' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                            spGainKind: 'refund',
                            spGainSource: 'skill',
                          },
                        },
                        next: 'finishBuffsById_62',
                      },
                      checkCondition_59: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
                        },
                        next: null,
                      },
                      ifElse_63: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_59' },
                          whenTrue: { $sequence: 'changeResource_61' },
                          whenFalse: { $sequence: 'finishBuffsById_62' },
                        },
                        next: null,
                      },
                      changeResource_64: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'valueNode', nodeId: 'data_17' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                          },
                        },
                        next: 'ifElse_63',
                      },
                      checkCondition_65: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_18' } },
                        },
                        next: 'changeResource_64',
                      },
                      checkCondition_66: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
                        },
                        next: 'checkCondition_65',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_once' },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'poise_2' },
                      },
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_2_2', fallback: 0 },
                      },
                      data_4: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_3' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_2_1', fallback: 0 },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_5' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_7: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_1_2', fallback: 0 },
                      },
                      data_8: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_7' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_9: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'talent_1_1', fallback: 0 },
                      },
                      data_10: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_9' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_11: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_12: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                          operator: 'greater',
                          value: { kind: 'constant', value: 0.5 },
                        },
                      },
                      data_13: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_3' },
                      },
                      data_14: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atb_return' },
                      },
                      data_15: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'potential_upgrade', fallback: 0 },
                      },
                      data_16: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_15' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 1 },
                        },
                      },
                      data_17: { type: 'number', expression: { kind: 'blackboard', key: 'usp_2' } },
                      data_18: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_19: {
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
          ],
        },
        next: 'launchProjectile_64',
      },
      applyBuff_66: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_normal_smarttarget' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'launchProjectile_65',
      },
      gainSquadUltimateEnergyFromSkillCost_67: {
        action: { kind: 'gainSquadUltimateEnergyFromSkillCost', parameters: { coefficient: 1 } },
        next: null,
      },
      checkCondition_68: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_13' } },
        },
        next: 'gainSquadUltimateEnergyFromSkillCost_67',
      },
      finishBuffsById_69: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'source' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
            reason: 'early',
          },
        },
        next: null,
      },
      checkCondition_70: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
        },
        next: null,
      },
      ifElse_73: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_70' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_74: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
        },
        next: null,
      },
      jumpTimeline_75: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 215 },
          condition: { $sequence: 'checkCondition_74' },
        },
        next: null,
      },
      markCurrentSkillCanInterrupt_76: {
        action: { kind: 'markCurrentSkillCanInterrupt', parameters: {} },
        next: null,
      },
      interruptCurrentSkill_77: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      applyBuff_79: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_tut_normalskill_failure' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      checkCondition_78: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
        },
        next: null,
      },
      ifElse_80: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_78' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'applyBuff_79' },
        },
        next: null,
      },
      applyBuff_81: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_normal_defup' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
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
    },
    dataNodes: {
      data_1: {
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
      data_2: {
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
      data_3: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_4: {
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
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_once' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_1' } },
      data_7: {
        type: 'boolean',
        expression: { kind: 'actionInputTargetObjectTypeMatch', objectTypes: ['enemy'] },
      },
      data_8: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'FollowAttackTrigger', fallback: 0 },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_8' },
          operator: 'equal',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'poise_1' } },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/NoGuard'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_12: { type: 'number', expression: { kind: 'blackboard', key: 'trigger', fallback: 0 } },
      data_13: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_12' },
          operator: 'greater',
          right: { kind: 'constant', value: 0.5 },
        },
      },
      data_14: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'caster',
          tagQueryType: 'hasAny',
          tags: ['Skill/Character/Common/Affixes/skillimbue'],
        },
      },
      data_15: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_8' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 0.9 },
        },
      },
      data_16: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_8' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const rossiChr_0028_wulfa_normal_skill: SkillDefinition = {
  key: 'chr_0028_wulfa_normal_skill',
  element: 'physical',
  blackboard: {
    atb_return: 10,
    atk_scale_1: [0.85, 0.94, 1.02, 1.11, 1.19, 1.28, 1.37, 1.45, 1.54, 1.64, 1.77, 1.92],
    atk_scale_3: [1.28, 1.41, 1.53, 1.66, 1.79, 1.92, 2.04, 2.17, 2.3, 2.46, 2.65, 2.88],
    atk_scale_bleed: [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
    atk_scale_once: 0,
    bleed_critical_damage_interval: 2,
    bleed_critical_damage_scale: 1,
    damage_up: 0,
    duration_bleed: 15,
    FollowAttackTrigger: 0,
    heal_scale: 0.2,
    poise_1: 5,
    poise_2: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
    potential_upgrade: 0,
    talent_1_1: 0,
    talent_1_2: 0,
    talent_2_1: 0,
    talent_2_2: 0,
    talent2_burning_damage_scale: 1.5,
    trigger: 0,
    usp_2: 10,
  },
  timelineBlockFrames: 49,
  naturalDurationFrames: 475,
  exclusiveFrame: 272,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 38,
        endFrame: 56,
        skillIds: [
          'chr_0028_wulfa_normal_skill',
          'chr_0028_wulfa_combo_2_skill',
          'chr_0028_wulfa_combo_3_skill',
        ],
      },
      {
        startFrame: 258,
        endFrame: 277,
        skillIds: [
          'chr_0028_wulfa_normal_skill',
          'chr_0028_wulfa_combo_2_skill',
          'chr_0028_wulfa_combo_3_skill',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 13, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 215, endFrame: 230, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 0, endFrame: 8, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 16, endFrame: 20, sequence: { $sequence: 'calculateActionValue_29' } },
    { startFrame: 22, endFrame: 26, sequence: { $sequence: 'calculateActionValue_29' } },
    { startFrame: 35, endFrame: 37, sequence: { $sequence: 'calculateActionValue_60' } },
    { startFrame: 230, endFrame: 233, sequence: { $sequence: 'applyBuff_66' } },
    { startFrame: 35, endFrame: 37, sequence: { $sequence: 'checkCondition_68' } },
    { startFrame: 215, endFrame: 218, sequence: { $sequence: 'finishBuffsById_69' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_73' } },
    { startFrame: 37, endFrame: 40, sequence: { $sequence: 'jumpTimeline_75' } },
    { startFrame: 49, endFrame: 214, sequence: { $sequence: 'markCurrentSkillCanInterrupt_76' } },
    { startFrame: 214, endFrame: 215, sequence: { $sequence: 'interruptCurrentSkill_77' } },
    { startFrame: 37, endFrame: 72, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 215, endFrame: 272, sequence: { $sequence: 'applyBuff_81' } },
  ],
  smartTarget: 'enemy',
  costs: [{ resource: 'sp', value: 100 }],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: rossiChr_0028_wulfa_normal_skillActionGraph,
};

export const rossiChr_0028_wulfa_combo_2_skillActionGraph = {
  main: {
    nodes: {
      startTimeDilation_12: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.24 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.7,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.075,
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
        next: null,
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'checkCondition_10',
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_11' },
          whenTrue: { $sequence: 'startTimeDilation_12' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      calculateActionValue_14: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'can_trigger_combo',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_4' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_13',
      },
      calculateActionValue_15: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'count',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_5' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'calculateActionValue_14',
      },
      dealDamage_16: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_6' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_7' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'calculateActionValue_15',
      },
      calculateActionValue_17: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'poise_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_8' },
            right: { kind: 'constant', value: 0.5 },
          },
        },
        next: 'dealDamage_16',
      },
      calculateActionValue_18: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_9' },
            right: { kind: 'constant', value: 0.35 },
          },
        },
        next: 'calculateActionValue_17',
      },
      repeatEachTick_19: {
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
          body: { $sequence: 'calculateActionValue_18' },
        },
        next: null,
      },
      findTargets_20: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: 'repeatEachTick_19',
      },
      calculateActionValue_27: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'count',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_5' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      applyBuff_28: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_combo_2_damagewait',
                blackboardAssignments: {
                  trigger_times: { kind: 'constant', value: 3 },
                  damage_interval: { kind: 'constant', value: 0.125 },
                  duration: { kind: 'constant', value: 0.3 },
                },
                copiedBlackboardAssignments: { atk_scale: 'atk_scale_once' },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'calculateActionValue_27',
      },
      calculateActionValue_29: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_9' },
            right: { kind: 'constant', value: 0.1 },
          },
        },
        next: 'applyBuff_28',
      },
      dealDamage_30: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_6' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_7' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'calculateActionValue_29',
      },
      calculateActionValue_31: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'poise_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_8' },
            right: { kind: 'constant', value: 0.5 },
          },
        },
        next: 'dealDamage_30',
      },
      calculateActionValue_32: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_9' },
            right: { kind: 'constant', value: 0.35 },
          },
        },
        next: 'calculateActionValue_31',
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
      findTargets_34: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: 'repeatEachTick_33',
      },
      changeResource_36: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_10' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: null,
      },
      checkCondition_35: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: null,
      },
      ifElse_37: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_35' },
          whenTrue: { $sequence: 'changeResource_36' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      finishBuffsById_38: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timerlistening'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_40: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_13' } },
        },
        next: 'finishBuffsById_38',
      },
      applyBuff_43: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
                copiedBlackboardAssignments: { time_succeed: 'time_succeed' },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_41: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
        },
        next: null,
      },
      checkCondition_42: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
        },
        next: 'checkCondition_41',
      },
      ifElse_44: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_42' },
          whenTrue: { $sequence: 'applyBuff_43' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      changeSkillSlot_45: {
        action: {
          kind: 'changeSkillSlot',
          parameters: {
            skillSlotKey: 'comboSkill',
            targetSkillKey: 'chr_0028_wulfa_combo_3_skill',
            inheritOriginSkillCooldownProgress: false,
            lifetime: 'infinite',
            revertedSkillKey: 'chr_0028_wulfa_combo_2_skill',
          },
        },
        next: null,
      },
      checkCondition_46: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_17' } },
        },
        next: 'changeSkillSlot_45',
      },
      finishBuffsById_47: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0028_wulfa_combo_usetimer'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_48: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_18' } },
        },
        next: 'finishBuffsById_47',
      },
      applyBuff_49: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_combo_usecount' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'checkCondition_48',
      },
      finishBuffsById_59: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_54: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_combo_usetimer' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      adjustSkillCooldown_55: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'applyBuff_54',
      },
      openComboWindow_56: {
        action: { kind: 'openComboWindow', parameters: { nextSkillKeyFromSlot: 'comboSkill' } },
        next: 'adjustSkillCooldown_55',
      },
      checkCondition_50: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
        },
        next: null,
      },
      ifElse_58: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_50' },
          whenTrue: { $sequence: 'openComboWindow_56' },
          whenFalse: { $sequence: 'openComboWindow_56' },
        },
        next: null,
      },
      checkCondition_57: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_20' } },
        },
        next: null,
      },
      ifElse_60: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_57' },
          whenTrue: { $sequence: 'ifElse_58' },
          whenFalse: { $sequence: 'finishBuffsById_59' },
        },
        next: null,
      },
      startTimeDilation_61: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
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
      applyBuff_62: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_normal_defup' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'count', fallback: 0 } },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'can_trigger_combo' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_once' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'poise_once' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_12: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_Combo_qte_proto_use', fallback: 0 },
      },
      data_13: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_12' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_14: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'can_trigger_combo', fallback: 0 },
      },
      data_15: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_14' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_16: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_17: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_14' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_18: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 2 },
        },
      },
      data_19: {
        type: 'boolean',
        expression: {
          kind: 'healthCompare',
          target: 'enemy',
          valueType: 'ratio',
          operator: 'greater',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_20: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_14' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const rossiChr_0028_wulfa_combo_2_skill: SkillDefinition = {
  key: 'chr_0028_wulfa_combo_2_skill',
  element: 'physical',
  blackboard: {
    atk_scale: [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    atk_scale_once: 0.01,
    can_trigger_combo: 0,
    count: 0,
    poise: 0,
    poise_once: 0.01,
    time_succeed: 0.4,
    usp: 10,
  },
  timelineBlockFrames: 66,
  naturalDurationFrames: 198,
  exclusiveFrame: 65,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 37,
        endFrame: 65,
        skillIds: ['chr_0028_wulfa_normal_skill', 'chr_0028_wulfa_combo_3_skill'],
      },
    ],
  },
  costFrame: 12,
  scheduledSequences: [
    { startFrame: 13, endFrame: 14, sequence: { $sequence: 'findTargets_20' } },
    { startFrame: 24, endFrame: 25, sequence: { $sequence: 'findTargets_34' } },
    { startFrame: 24, endFrame: 25, sequence: { $sequence: 'ifElse_37' } },
    { startFrame: 0, endFrame: 15, sequence: { $sequence: 'checkCondition_40' } },
    { startFrame: 37, endFrame: 38, sequence: { $sequence: 'ifElse_44' } },
    { startFrame: 37, endFrame: 58, sequence: { $sequence: 'checkCondition_46' } },
    { startFrame: 0, endFrame: 37, sequence: { $sequence: 'applyBuff_49' } },
    { startFrame: 37, endFrame: 41, sequence: { $sequence: 'ifElse_60' } },
    { startFrame: 0, endFrame: 16, sequence: { $sequence: 'startTimeDilation_61' } },
    { startFrame: 0, endFrame: 65, sequence: { $sequence: 'applyBuff_62' } },
  ],
  smartTarget: 'trigger',
  cooldownFrames: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 420],
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'comboSkill',
  actionGraph: rossiChr_0028_wulfa_combo_2_skillActionGraph,
};

export const rossiChr_0028_wulfa_combo_3_skillActionGraph = {
  main: {
    nodes: {
      startTimeDilation_5: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.4 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 50,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.5,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.2,
                  value: 0.03,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.75,
                  value: 0.03,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 0.149662,
                  outTangent: 0.149662,
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
          whenTrue: { $sequence: 'startTimeDilation_5' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      repeatEachTick_7: {
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
          body: { $sequence: 'ifElse_6' },
        },
        next: null,
      },
      findTargets_8: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: 'repeatEachTick_7',
      },
      modifyActionValue_15: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'spellinflict_stack_max',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      applyBuff_11: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_combo_hasinflict' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      applyBuff_12: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_combo_inflictnum' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            count: { kind: 'valueNode', nodeId: 'data_3' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'applyBuff_11',
      },
      finishBuffsByTag_13: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            finishSource: { kind: 'owner' },
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
            reason: 'early',
          },
        },
        next: 'applyBuff_12',
      },
      readBuffStackCount_14: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'enemy',
            outputKey: 'buff_stack',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
            },
          },
        },
        next: 'finishBuffsByTag_13',
      },
      checkCondition_9: {
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
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'readBuffStackCount_14' },
          whenFalse: { $sequence: 'modifyActionValue_15' },
        },
        next: null,
      },
      finishBuffsByTag_21: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            finishSource: { kind: 'owner' },
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
            reason: 'early',
          },
        },
        next: 'applyBuff_12',
      },
      readBuffStackCount_22: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'enemy',
            outputKey: 'buff_stack',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
            },
          },
        },
        next: 'finishBuffsByTag_21',
      },
      checkCondition_17: {
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
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'readBuffStackCount_22' },
          whenFalse: { $sequence: 'ifElse_23' },
        },
        next: null,
      },
      finishBuffsByTag_28: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            finishSource: { kind: 'owner' },
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
            reason: 'early',
          },
        },
        next: 'applyBuff_12',
      },
      readBuffStackCount_29: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'enemy',
            outputKey: 'buff_stack',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
            },
          },
        },
        next: 'finishBuffsByTag_28',
      },
      checkCondition_24: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      ifElse_37: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_24' },
          whenTrue: { $sequence: 'readBuffStackCount_29' },
          whenFalse: { $sequence: 'ifElse_30' },
        },
        next: null,
      },
      finishBuffsByTag_35: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            finishSource: { kind: 'owner' },
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
            reason: 'early',
          },
        },
        next: 'applyBuff_12',
      },
      readBuffStackCount_36: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'enemy',
            outputKey: 'buff_stack',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
            },
          },
        },
        next: 'finishBuffsByTag_35',
      },
      checkCondition_31: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      ifElse_38: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_31' },
          whenTrue: { $sequence: 'readBuffStackCount_36' },
          whenFalse: { $sequence: 'ifElse_37' },
        },
        next: null,
      },
      repeatEachTick_39: {
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
          body: { $sequence: 'ifElse_38' },
        },
        next: null,
      },
      finishBuffsById_43: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyPhysicalInfliction_44: {
        action: {
          kind: 'applyPhysicalInfliction',
          parameters: {
            type: 'airborne',
            target: 'enemy',
            isExtra: false,
            duration: { kind: 'constant', value: 1 },
            height: { kind: 'constant', value: 20 },
            speedFactorMultiplier: 10,
            force: false,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
          },
        },
        next: 'finishBuffsById_43',
      },
      checkCondition_45: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: 'applyPhysicalInfliction_44',
      },
      forEachContextTarget_47: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'checkCondition_45' },
        },
        next: null,
      },
      ifElse_49: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'forEachContextTarget_47' },
          whenFalse: { $sequence: 'forEachContextTarget_47' },
        },
        next: null,
      },
      checkCondition_48: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      ifElse_50: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_48' },
          whenTrue: { $sequence: 'ifElse_49' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      calculateActionValue_60: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'count',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_10' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      dealDamage_61: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_11' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_12' },
          },
        },
        next: 'calculateActionValue_60',
      },
      finishBuffsById_62: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'],
            reason: 'other',
          },
        },
        next: 'dealDamage_61',
      },
      calculateActionValue_63: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'poise_once',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_13' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'finishBuffsById_62',
      },
      calculateActionValue_64: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_11' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'calculateActionValue_63',
      },
      calculateActionValue_65: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_11' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'calculateActionValue_64',
      },
      calculateActionValue_66: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_11' },
            right: { kind: 'valueNode', nodeId: 'data_15' },
          },
        },
        next: 'calculateActionValue_65',
      },
      calculateActionValue_67: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_16' },
            right: { kind: 'valueNode', nodeId: 'data_17' },
          },
        },
        next: 'calculateActionValue_66',
      },
      readBuffStackCount_68: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'enemy',
            outputKey: 'spellinflict_stack_max',
            query: { kind: 'id', buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'] },
          },
        },
        next: 'calculateActionValue_67',
      },
      repeatEachTick_69: {
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
          body: { $sequence: 'readBuffStackCount_68' },
        },
        next: null,
      },
      findTargets_70: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: 'repeatEachTick_69',
      },
      finishBuffsById_71: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0028_wulfa_combo_usetimer', 'buff_chr_0028_wulfa_combo_usecount'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_72: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_18' } },
        },
        next: 'finishBuffsById_71',
      },
      changeSkillSlot_73: {
        action: {
          kind: 'changeSkillSlot',
          parameters: {
            skillSlotKey: 'comboSkill',
            targetSkillKey: 'chr_0028_wulfa_combo_2_skill',
            inheritOriginSkillCooldownProgress: false,
            lifetime: 'infinite',
          },
        },
        next: 'checkCondition_72',
      },
      adjustSkillCooldown_74: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
            operation: 'set',
            basis: 'baseDurationRatio',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'changeSkillSlot_73',
      },
      applyBuff_75: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_combo_usecount' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'adjustSkillCooldown_74',
      },
      changeResource_76: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_19' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: null,
      },
      checkCondition_77: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_21' } },
        },
        next: 'changeResource_76',
      },
      modifyActionValue_85: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'buff_stack',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'modifyActionValue_15',
      },
      ifElse_93: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'readBuffStackCount_14' },
          whenFalse: { $sequence: 'modifyActionValue_85' },
        },
        next: null,
      },
      ifElse_100: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'readBuffStackCount_22' },
          whenFalse: { $sequence: 'ifElse_93' },
        },
        next: null,
      },
      ifElse_107: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_24' },
          whenTrue: { $sequence: 'readBuffStackCount_29' },
          whenFalse: { $sequence: 'ifElse_100' },
        },
        next: null,
      },
      ifElse_108: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_31' },
          whenTrue: { $sequence: 'readBuffStackCount_36' },
          whenFalse: { $sequence: 'ifElse_107' },
        },
        next: null,
      },
      repeatEachTick_109: {
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
          body: { $sequence: 'ifElse_108' },
        },
        next: null,
      },
      applyBuff_115: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_physical_no_guard' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'finishBuffsById_43',
      },
      applyPhysicalInfliction_116: {
        action: {
          kind: 'applyPhysicalInfliction',
          parameters: {
            type: 'airborne',
            target: 'enemy',
            isExtra: false,
            duration: { kind: 'constant', value: 1 },
            height: { kind: 'constant', value: 20 },
            speedFactorMultiplier: 10,
            force: false,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
          },
        },
        next: 'applyBuff_115',
      },
      checkCondition_117: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_22' } },
        },
        next: 'applyPhysicalInfliction_116',
      },
      forEachContextTarget_119: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'checkCondition_117' },
        },
        next: null,
      },
      ifElse_121: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'forEachContextTarget_119' },
          whenFalse: { $sequence: 'forEachContextTarget_119' },
        },
        next: null,
      },
      checkCondition_120: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_23' } },
        },
        next: null,
      },
      ifElse_122: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_120' },
          whenTrue: { $sequence: 'ifElse_121' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      calculateActionValue_143: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'poise_once',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_24' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'finishBuffsById_62',
      },
      calculateActionValue_144: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_11' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'calculateActionValue_143',
      },
      calculateActionValue_145: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_11' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'calculateActionValue_144',
      },
      calculateActionValue_146: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_11' },
            right: { kind: 'valueNode', nodeId: 'data_15' },
          },
        },
        next: 'calculateActionValue_145',
      },
      calculateActionValue_147: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_16' },
            right: { kind: 'valueNode', nodeId: 'data_17' },
          },
        },
        next: 'calculateActionValue_146',
      },
      readBuffStackCount_148: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'enemy',
            outputKey: 'spellinflict_stack_max',
            query: { kind: 'id', buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'] },
          },
        },
        next: 'calculateActionValue_147',
      },
      repeatEachTick_149: {
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
          body: { $sequence: 'readBuffStackCount_148' },
        },
        next: null,
      },
      findTargets_150: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'MainTar',
          },
        },
        next: 'repeatEachTick_149',
      },
      jumpTimeline_160: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 212 },
          condition: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_161: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'timing_success',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'jumpTimeline_160',
      },
      finishOwner_162: {
        action: {
          kind: 'finishOwner',
          parameters: {
            targets: {
              kind: 'ownerSpawned',
              owner: { kind: 'owner' },
              objectType: 'all',
              sameSourceSkillCast: false,
            },
          },
        },
        next: 'modifyActionValue_161',
      },
      finishBuffsById_163: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'owner' },
            buffIds: [
              'buff_chr_0028_wulfa_combo_2_qte_timer',
              'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
            ],
            reason: 'early',
          },
        },
        next: 'finishOwner_162',
      },
      calculateActionValue_152: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_s',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_15' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: null,
      },
      checkCondition_151: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_26' } },
        },
        next: null,
      },
      ifElse_154: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_151' },
          whenTrue: { $sequence: 'calculateActionValue_152' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      finishOwner_155: {
        action: {
          kind: 'finishOwner',
          parameters: {
            targets: {
              kind: 'ownerSpawned',
              owner: { kind: 'owner' },
              objectType: 'all',
              sameSourceSkillCast: false,
            },
          },
        },
        next: 'ifElse_154',
      },
      startTimeDilation_156: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.4 },
            slot: 'unassigned',
            priority: 50,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.01,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1,
                  value: 0.01,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.8,
                  value: 0.01,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.01,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            ignoredTargets: ['caster'],
          },
        },
        next: 'finishOwner_155',
      },
      finishOwner_157: {
        action: {
          kind: 'finishOwner',
          parameters: {
            targets: {
              kind: 'ownerSpawned',
              owner: { kind: 'owner' },
              objectType: 'all',
              sameSourceSkillCast: false,
            },
          },
        },
        next: 'startTimeDilation_156',
      },
      modifyActionValue_158: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'timing_success',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'finishOwner_157',
      },
      finishBuffsById_159: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'owner' },
            buffIds: [
              'buff_chr_0028_wulfa_combo_2_qte_timer',
              'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
            ],
            reason: 'early',
          },
        },
        next: 'modifyActionValue_158',
      },
      checkCondition_153: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_28' } },
        },
        next: null,
      },
      ifElse_164: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_153' },
          whenTrue: { $sequence: 'finishBuffsById_159' },
          whenFalse: { $sequence: 'finishBuffsById_163' },
        },
        next: null,
      },
      checkCondition_165: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_29' } },
        },
        next: null,
      },
      checkCondition_166: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_30' } },
        },
        next: 'checkCondition_165',
      },
      ifElse_168: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_166' },
          whenTrue: { $sequence: 'changeResource_76' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_169: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_combo_criticalrate',
                copiedBlackboardAssignments: {
                  duration: 'crit_increase_duration',
                  critical_rate: 'crit_increase_rate',
                  critical_damage_inc: 'crit_damage_increase_rate',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      markCurrentSkillCanInterrupt_171: {
        action: { kind: 'markCurrentSkillCanInterrupt', parameters: {} },
        next: null,
      },
      interruptCurrentSkill_172: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      startTimeDilation_173: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
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
      applyBuff_177: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      applyBuff_176: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_tut_comboskill_success' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      ifElse_178: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_120' },
          whenTrue: { $sequence: 'applyBuff_176' },
          whenFalse: { $sequence: 'applyBuff_177' },
        },
        next: null,
      },
      applyBuff_181: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_tut_comboskill_finish' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      ifElse_182: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_120' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'applyBuff_177' },
        },
        next: 'applyBuff_181',
      },
      applyBuff_187: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_normal_defup' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'timing_success', fallback: 0 },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'greater',
          right: { kind: 'constant', value: 0.5 },
        },
      },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'buff_stack' } },
      data_4: {
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
      data_5: {
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
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'enemy',
          buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'equal',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
      data_11: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_once' } },
      data_12: { type: 'number', expression: { kind: 'blackboard', key: 'poise_once' } },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'poise_f' } },
      data_14: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'potential_atk_multiply' },
      },
      data_15: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_s' } },
      data_16: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'spellinflict_stack_max' },
      },
      data_17: { type: 'number', expression: { kind: 'blackboard', key: 'damage_add' } },
      data_18: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
          operator: 'equal',
          value: { kind: 'constant', value: 2 },
        },
      },
      data_19: { type: 'number', expression: { kind: 'blackboard', key: 'usp_s' } },
      data_20: { type: 'number', expression: { kind: 'blackboard', key: 'count', fallback: 0 } },
      data_21: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_20' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_22: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'enemy',
          buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_23: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_24: { type: 'number', expression: { kind: 'blackboard', key: 'poise_s' } },
      data_25: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'potential_1', fallback: 0 },
      },
      data_26: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_25' },
          operator: 'greater',
          right: { kind: 'constant', value: 0.5 },
        },
      },
      data_27: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_Combo_QTE_Trigger', fallback: 0 },
      },
      data_28: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_27' },
          operator: 'greater',
          right: { kind: 'constant', value: 0.5 },
        },
      },
      data_29: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_20' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_30: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const rossiChr_0028_wulfa_combo_3_skill: SkillDefinition = {
  key: 'chr_0028_wulfa_combo_3_skill',
  element: 'physical',
  blackboard: {
    atk_scale_f: [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    atk_scale_once: 0,
    atk_scale_s: [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    buff_stack: 0,
    count: 0,
    crit_damage_increase_rate: [0.3, 0.3, 0.3, 0.34, 0.34, 0.34, 0.38, 0.38, 0.42, 0.42, 0.46, 0.5],
    crit_increase_duration: 15,
    crit_increase_rate: [0.15, 0.15, 0.15, 0.17, 0.17, 0.17, 0.19, 0.19, 0.21, 0.21, 0.23, 0.25],
    damage_add: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    poise_f: 5,
    poise_once: 0,
    poise_s: 5,
    potential_1: 0,
    potential_atk_multiply: 1,
    spellinflict_stack_max: 0,
    timing_success: 0,
    usp_s: 10,
  },
  timelineBlockFrames: 60,
  naturalDurationFrames: 409,
  exclusiveFrame: 259,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 52, endFrame: 72, skillIds: ['chr_0028_wulfa_normal_skill'] },
      { startFrame: 249, endFrame: 269, skillIds: ['chr_0028_wulfa_normal_skill'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 225, endFrame: 226, sequence: { $sequence: 'findTargets_8' } },
    { startFrame: 227, endFrame: 227, sequence: { $sequence: 'repeatEachTick_39' } },
    { startFrame: 227, endFrame: 228, sequence: { $sequence: 'ifElse_50' } },
    { startFrame: 227, endFrame: 228, sequence: { $sequence: 'findTargets_70' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'applyBuff_75' } },
    { startFrame: 227, endFrame: 228, sequence: { $sequence: 'checkCondition_77' } },
    { startFrame: 29, endFrame: 29, sequence: { $sequence: 'repeatEachTick_109' } },
    { startFrame: 29, endFrame: 30, sequence: { $sequence: 'ifElse_122' } },
    { startFrame: 27, endFrame: 28, sequence: { $sequence: 'findTargets_8' } },
    { startFrame: 29, endFrame: 30, sequence: { $sequence: 'findTargets_150' } },
    { startFrame: 0, endFrame: 28, sequence: { $sequence: 'ifElse_164' } },
    { startFrame: 29, endFrame: 30, sequence: { $sequence: 'ifElse_168' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'applyBuff_169' } },
    { startFrame: 212, endFrame: 215, sequence: { $sequence: 'applyBuff_169' } },
    { startFrame: 60, endFrame: 211, sequence: { $sequence: 'markCurrentSkillCanInterrupt_171' } },
    { startFrame: 211, endFrame: 212, sequence: { $sequence: 'interruptCurrentSkill_172' } },
    { startFrame: 0, endFrame: 16, sequence: { $sequence: 'startTimeDilation_173' } },
    { startFrame: 212, endFrame: 222, sequence: { $sequence: 'startTimeDilation_173' } },
    { startFrame: 29, endFrame: 58, sequence: { $sequence: 'ifElse_178' } },
    { startFrame: 29, endFrame: 59, sequence: { $sequence: 'ifElse_182' } },
    { startFrame: 227, endFrame: 257, sequence: { $sequence: 'ifElse_182' } },
    { startFrame: 0, endFrame: 60, sequence: { $sequence: 'applyBuff_187' } },
    { startFrame: 212, endFrame: 259, sequence: { $sequence: 'applyBuff_187' } },
  ],
  smartTarget: 'enemy',
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: rossiChr_0028_wulfa_combo_3_skillActionGraph,
};

export const rossiChr_0028_wulfa_ultimate_skillActionGraph = {
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
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_ult_stopenemy_elite',
                blackboardAssignments: { duration: { kind: 'constant', value: 3.099969 } },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
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
      ifElse_9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'applyBuff_7' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_8' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_9' },
        },
        next: null,
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'ifElse_10',
      },
      findTargets_12: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'maintar',
          },
        },
        next: 'checkCondition_11',
      },
      applyBuff_18: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_ult_stopenemy',
                blackboardAssignments: { duration: { kind: 'constant', value: 2.866664 } },
              },
            ],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_20: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'applyBuff_18' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_21: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_8' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_20' },
        },
        next: null,
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'ifElse_21',
      },
      findTargets_23: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'maintar',
          },
        },
        next: 'checkCondition_22',
      },
      applyBuff_24: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_ult_addtional_battleshape' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      modifyActionValue_25: {
        action: {
          kind: 'modifyActionValue',
          parameters: { key: 'hit_num', operation: 'add', value: { kind: 'constant', value: 1 } },
        },
        next: null,
      },
      dealDamage_26: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'heat',
            attackScale: { kind: 'valueNode', nodeId: 'data_6' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          },
        },
        next: 'modifyActionValue_25',
      },
      repeatEachTick_27: {
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
          body: { $sequence: 'dealDamage_26' },
        },
        next: null,
      },
      modifyActionValue_28: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'hit_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'repeatEachTick_27',
      },
      dealDamage_34: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'heat',
            attackScale: { kind: 'valueNode', nodeId: 'data_7' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_8' },
          },
        },
        next: 'modifyActionValue_25',
      },
      applyElementalInfliction_35: {
        action: {
          kind: 'applyElementalInfliction',
          parameters: { element: 'heat', isExtra: false },
        },
        next: 'dealDamage_34',
      },
      checkCondition_29: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      ifElse_36: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_29' },
          whenTrue: { $sequence: 'applyElementalInfliction_35' },
          whenFalse: { $sequence: 'applyElementalInfliction_35' },
        },
        next: null,
      },
      repeatEachTick_37: {
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
          body: { $sequence: 'ifElse_36' },
        },
        next: null,
      },
      modifyActionValue_38: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'hit_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'repeatEachTick_37',
      },
      startTimeDilation_40: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.32 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 50,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.6,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.6,
                  inTangent: 1.865142,
                  outTangent: 1.865142,
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
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: null,
      },
      ifElse_41: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_39' },
          whenTrue: { $sequence: 'startTimeDilation_40' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_42: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_common_damage_immune_ult_skill' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      hideUi_43: { action: { kind: 'hideUi', parameters: { onlyBlockInput: false } }, next: null },
      startUltimateTimeDilation_44: {
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
      calculateActionValue_45: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'crit_damage_up_to_bleed',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_12' },
            right: { kind: 'valueNode', nodeId: 'data_13' },
          },
        },
        next: null,
      },
      calculateActionValue_46: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_3',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_7' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'calculateActionValue_45',
      },
      calculateActionValue_47: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_2',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_6' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'calculateActionValue_46',
      },
      calculateActionValue_48: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_1',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_15' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'calculateActionValue_47',
      },
      checkCondition_49: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_17' } },
        },
        next: 'calculateActionValue_48',
      },
      applyBuff_50: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed',
                copiedBlackboardAssignments: {
                  critical_damage_up_to_bleed: 'crit_damage_up_to_bleed',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      dealDamage_54: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'heat',
            attackScale: { kind: 'valueNode', nodeId: 'data_15' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          },
        },
        next: null,
      },
      ifElse_57: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'dealDamage_54' },
          whenFalse: { $sequence: 'dealDamage_54' },
        },
        next: null,
      },
      createSpatialPointTargets_58: {
        action: {
          kind: 'createSpatialPointTargets',
          parameters: { saveToContextKey: 'pos2', count: { kind: 'constant', value: 1 } },
        },
        next: 'ifElse_57',
      },
      ifElse_59: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'createSpatialPointTargets_58' },
          whenFalse: { $sequence: 'createSpatialPointTargets_58' },
        },
        next: null,
      },
      checkCondition_276: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_18' } },
        },
        next: null,
      },
      repeatEachTick_277: {
        action: {
          kind: 'repeatEachTick',
          parameters: {
            nativeChanneling: {
              target: { kind: 'fixed', target: 'enemy' },
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: -1,
              targetTriggerIntervalSeconds: 0.03333,
            },
          },
          body: { $sequence: 'checkCondition_276' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'enemyRankIn', ranks: ['elite'] } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'enemy',
          tagQueryType: 'hasAny',
          tags: ['Immune/Damage', 'SelectCategory/Unmarkable'],
        },
      },
      data_3: {
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
      data_4: { type: 'boolean', expression: { kind: 'enemyRankIn', ranks: ['mob'] } },
      data_5: {
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
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_2' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_3' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'enemy',
          buffIds: ['buff_chr_0028_wulfa_normal_bleed'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'hit_num', fallback: 0 } },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_10' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_12: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'crit_damage_up_to_bleed' },
      },
      data_13: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'potential_5_critical_damage' },
      },
      data_14: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'potential_5_damage_scale' },
      },
      data_15: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_1' } },
      data_16: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'potential_5', fallback: 0 },
      },
      data_17: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_16' },
          operator: 'greater',
          right: { kind: 'constant', value: 0.5 },
        },
      },
      data_18: { type: 'boolean', expression: { kind: 'enemyRankIn', ranks: ['elite', 'boss'] } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const rossiChr_0028_wulfa_ultimate_skill: SkillDefinition = {
  key: 'chr_0028_wulfa_ultimate_skill',
  element: 'heat',
  blackboard: {
    atk_scale_1: [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.22, 0.24],
    atk_scale_2: [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    atk_scale_3: [3.33, 3.67, 4, 4.33, 4.67, 5, 5.34, 5.67, 6, 6.42, 6.92, 7.5],
    crit_damage_up_to_bleed: 0.6,
    hit_num: 0,
    poise: 25,
    potential_5: 0,
    potential_5_critical_damage: 0,
    potential_5_damage_scale: 1.2,
  },
  timelineBlockFrames: 156,
  naturalDurationFrames: 311,
  exclusiveFrame: 155,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'startTimeDilation_1' } },
    { startFrame: 57, endFrame: 150, sequence: { $sequence: 'findTargets_12' } },
    { startFrame: 64, endFrame: 150, sequence: { $sequence: 'findTargets_23' } },
    { startFrame: 64, endFrame: 111, sequence: { $sequence: 'applyBuff_24' } },
    { startFrame: 122, endFrame: 125, sequence: { $sequence: 'modifyActionValue_28' } },
    { startFrame: 131, endFrame: 134, sequence: { $sequence: 'modifyActionValue_38' } },
    { startFrame: 134, endFrame: 135, sequence: { $sequence: 'ifElse_41' } },
    { startFrame: 0, endFrame: 155, sequence: { $sequence: 'applyBuff_42' } },
    { startFrame: 0, endFrame: 57, sequence: { $sequence: 'hideUi_43' } },
    { startFrame: 0, endFrame: 57, sequence: { $sequence: 'startUltimateTimeDilation_44' } },
    { startFrame: 58, endFrame: 208, sequence: { $sequence: 'checkCondition_49' } },
    { startFrame: 58, endFrame: 208, sequence: { $sequence: 'applyBuff_50' } },
    { startFrame: 63, endFrame: 64, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 65, endFrame: 66, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 66, endFrame: 67, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 69, endFrame: 70, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 71, endFrame: 72, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 74, endFrame: 75, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 75, endFrame: 76, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 77, endFrame: 78, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 78, endFrame: 79, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 80, endFrame: 81, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 83, endFrame: 84, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 84, endFrame: 85, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 87, endFrame: 88, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 88, endFrame: 89, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 90, endFrame: 91, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 92, endFrame: 93, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 94, endFrame: 95, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 96, endFrame: 97, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 97, endFrame: 98, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 99, endFrame: 100, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 102, endFrame: 103, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 103, endFrame: 104, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 106, endFrame: 107, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 108, endFrame: 109, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 111, endFrame: 112, sequence: { $sequence: 'ifElse_59' } },
    { startFrame: 63, endFrame: 131, sequence: { $sequence: 'repeatEachTick_277' } },
  ],
  smartTarget: 'enemy',
  cooldownFrames: 300,
  costs: [{ resource: 'ultimateEnergy', value: 110 }],
  skillType: 'ultimate',
  levelSource: 'ultimate',
  nativeSkillType: 'ultimateSkill',
  actionGraph: rossiChr_0028_wulfa_ultimate_skillActionGraph,
};

export const rossiCommon_character_perfect_dodgeActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const rossiCommon_character_perfect_dodge: SkillDefinition = {
  actionGraph: rossiCommon_character_perfect_dodgeActionGraph,
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

const rossiComboCondition1ActionGraph = {
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
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: [
            'buff_chr_0028_wulfa_combo_usetimer',
            'buff_chr_0028_wulfa_combo_cannottrigger',
          ],
          operator: 'less',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetBuffStackCompare',
          contextKey: 'trigger',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/NoGuard'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiComboCondition1: ComboSkillConditionDefinition = {
  key: 'native-combo:0',
  skillKey: 'chr_0028_wulfa_combo_2_skill',
  event: 'beforeTakeInfliction',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'checkCondition_2' },
  actionGraph: rossiComboCondition1ActionGraph,
};

const rossiComboCondition2ActionGraph = {
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
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_3',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: [
            'buff_chr_0028_wulfa_combo_usetimer',
            'buff_chr_0028_wulfa_combo_cannottrigger',
          ],
          operator: 'less',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetBuffStackCompare',
          contextKey: 'trigger',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetObjectTypeMatch',
          contextKey: 'trigger',
          objectTypes: ['enemy'],
        },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_physical_no_guard'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiComboCondition2: ComboSkillConditionDefinition = {
  key: 'native-combo:1',
  skillKey: 'chr_0028_wulfa_combo_2_skill',
  event: 'addedBuff',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'checkCondition_4' },
  actionGraph: rossiComboCondition2ActionGraph,
};

const rossiBuff1ActionGraph = {
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
        },
        next: null,
      },
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff1: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  triggerIntervalSeconds: { blackboardKey: 'damage_interval' },
  waitFirstTriggerInterval: false,
  maxTriggerCount: { blackboardKey: 'trigger_times' },
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale: 0.3,
    damage_interval: 0.1,
    duration: 1,
    poise: 0,
    posie: 0,
    trigger_times: 3,
  },
  attributeModifiers: [],
  lifecycleSequences: { trigger: { $sequence: 'dealDamage_1' } },
  actionGraph: rossiBuff1ActionGraph,
};

const rossiBuff2ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_combo_2_damage',
                copiedBlackboardAssignments: {
                  atk_scale: 'atk_scale',
                  poise: 'poise',
                  trigger_times: 'trigger_times',
                  damage_interval: 'damage_interval',
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
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff2: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale: 0.3,
    damage_interval: 0.1,
    duration: 3,
    poise: 0,
    posie: 0,
    trigger_times: 3,
  },
  attributeModifiers: [],
  lifecycleSequences: { finish: { $sequence: 'applyBuff_1' } },
  actionGraph: rossiBuff2ActionGraph,
};

const rossiBuff3ActionGraph = {
  main: {
    nodes: {
      modifyActionValue_1: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_Combo_QTE_Trigger',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      showComboRingQte_2: {
        action: {
          kind: 'showComboRingQte',
          parameters: {
            earlyDurationSeconds: { kind: 'valueNode', nodeId: 'data_1' },
            activeDurationSeconds: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: null,
      },
      spawnAbilityEntity_3: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0028_wulfa_combo_qte_timing',
            childSkillId: 'chr_0028_wulfa_absorb_entity_effect_1',
            inheritActionBlackboard: false,
            dieWhenSourceDies: false,
          },
        },
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'spawnAbilityEntity_3',
      },
      spawnAbilityEntity_5: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'owner' },
            abilityEntityId: 'abilityentity_chr_0028_wulfa_combo_qte_timing',
            childSkillId: 'chr_0028_wulfa_absorb_entity_effect_2',
            inheritActionBlackboard: false,
            dieWhenSourceDies: false,
          },
        },
        next: null,
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'spawnAbilityEntity_5',
      },
      finishBuffsById_7: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'owner' },
            buffIds: ['buff_train_output_succbuff_or_failbuff_by_id'],
            reason: 'early',
          },
        },
        next: null,
      },
      applyBuff_8: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                blackboardAssignments: { duration: { kind: 'constant', value: 0.2 } },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'finishBuffsById_7',
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      setCurrentBuffTimePaused_10: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: false } },
        next: null,
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'setCurrentBuffTimePaused_10',
      },
      setCurrentBuffTimePaused_12: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: true } },
        next: null,
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: 'setCurrentBuffTimePaused_12',
      },
      applyBuff_14: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_success',
                blackboardAssignments: { duration: { kind: 'constant', value: 0.2 } },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      modifyActionValue_15: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_Combo_QTE_Trigger',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'applyBuff_14',
      },
      conditional_16: {
        action: {
          kind: 'conditional',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
          whenTrue: { $sequence: 'modifyActionValue_15' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'time_warning' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'time_succeed' } },
      data_3: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_Combo_qte_proto_use', fallback: 0 },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_3' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_3' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0028_wulfa_combo_1_qte_timer'],
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0028_wulfa_powerattack_resumecombo'],
        },
      },
      data_8: {
        type: 'boolean',
        expression: { kind: 'eventSkillIdIn', skillIds: ['chr_0028_wulfa_power_attack'] },
      },
      data_9: {
        type: 'boolean',
        expression: { kind: 'eventSkillTypeIn', skillTypes: ['comboSkill'] },
      },
      data_10: { type: 'boolean', expression: { kind: 'eventComboRingQteSucceeded' } },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'all',
          conditions: [
            { kind: 'conditionNode', nodeId: 'data_9' },
            { kind: 'conditionNode', nodeId: 'data_10' },
          ],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff3: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 6, time_succeed: 0.5, time_warning: 0.5 },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'modifyActionValue_1' } },
    { startFrame: 0, endFrame: 180, sequence: { $sequence: 'showComboRingQte_2' } },
    { startFrame: 3, endFrame: 19, sequence: { $sequence: 'checkCondition_4' } },
    { startFrame: 15, endFrame: 16, sequence: { $sequence: 'checkCondition_6' } },
    { startFrame: 35, endFrame: 38, sequence: { $sequence: 'applyBuff_8' } },
  ],
  abilityEventResponses: [
    { event: 'buffEndsEarly', priority: 0, sequence: { $sequence: 'checkCondition_9' } },
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_11' } },
    { event: 'beforeCastSkill', priority: 0, sequence: { $sequence: 'checkCondition_13' } },
    { event: 'beforeCastSkill', priority: 0, sequence: { $sequence: 'conditional_16' } },
  ],
  actionGraph: rossiBuff3ActionGraph,
};

const rossiBuff4ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff4: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_crit_up',
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
    playStrongInAnimation: true,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'LifeTime',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: {
    critical_damage_inc: 0.15,
    critical_rate: 0.1,
    duration: 10,
    usp_stage_1: 0.35,
    usp_stage_2: 0.7,
    usp_stage_3: 1,
  },
  attributeModifiers: [
    { attribute: 'criticalRate', slot: 'baseAddition', value: { blackboardKey: 'critical_rate' } },
    {
      attribute: 'criticalDamageIncrease',
      slot: 'baseAddition',
      value: { blackboardKey: 'critical_damage_inc' },
    },
  ],
  actionGraph: rossiBuff4ActionGraph,
};

const rossiBuff5ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff5: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 10 },
  attributeModifiers: [],
  actionGraph: rossiBuff5ActionGraph,
};

const rossiBuff6ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff6: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 4,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 10 },
  attributeModifiers: [],
  actionGraph: rossiBuff6ActionGraph,
};

const rossiBuff7ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff7: SkillBuffDefinition = {
  stackingType: 'enhanceAndOverwriteDuration',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: 10,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: rossiBuff7ActionGraph,
};

const rossiBuff8ActionGraph = {
  main: {
    nodes: {
      adjustSkillCooldown_1: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
            operation: 'set',
            basis: 'baseDurationRatio',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'adjustSkillCooldown_1',
      },
      changeSkillSlot_3: {
        action: {
          kind: 'changeSkillSlot',
          parameters: {
            skillSlotKey: 'comboSkill',
            targetSkillKey: 'chr_0028_wulfa_combo_2_skill',
            inheritOriginSkillCooldownProgress: false,
            lifetime: 'infinite',
          },
        },
        next: 'checkCondition_2',
      },
      finishBuffsById_4: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
            reason: 'other',
          },
        },
        next: 'changeSkillSlot_3',
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
      setCurrentBuffTimePaused_7: {
        action: { kind: 'setCurrentBuffTimePaused', parameters: { paused: true } },
        next: null,
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'setCurrentBuffTimePaused_7',
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'need_set_cd', fallback: 0 },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 0.5 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0028_wulfa_powerattack_resumecombo'],
        },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventSkillIdIn', skillIds: ['chr_0028_wulfa_power_attack'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff8: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 6, End_Early: 0, need_set_cd: 1 },
  attributeModifiers: [],
  lifecycleSequences: { finish: { $sequence: 'finishBuffsById_4' } },
  abilityEventResponses: [
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_6' } },
    { event: 'beforeCastSkill', priority: 0, sequence: { $sequence: 'checkCondition_8' } },
  ],
  actionGraph: rossiBuff8ActionGraph,
};

const rossiBuff9ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_normal_bleed_effect' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      dealDamage_2: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'physical',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            takeAttackSnapshot: true,
            tags: [],
            features: ['dot', 'talentDamage'],
          },
        },
        next: 'applyBuff_1',
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0028_wulfa_normal_bleed_crit_extra_damage',
                copiedBlackboardAssignments: {
                  atk_scale: 'extra_atk_scale',
                  damage_cd: 'damage_cd',
                  heal_scale: 'heal_scale',
                  burning_damage_scale: 'talent2_burning_damage_scale',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
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
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'checkCondition_4',
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
        next: null,
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageTagsMatch',
          match: 'hasAny',
          tags: ['normalSkill', 'ultimateSkill', 'comboSkill'],
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'actionInputTargetIdentityMatch',
          other: 'actionSource',
          operator: 'equal',
        },
      },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'talent_2', fallback: 0 } },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_4' },
          operator: 'greater',
          right: { kind: 'constant', value: 0.5 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: { kind: 'eventDamageTypeIn', damageTypes: ['physical'] },
      },
      data_7: { type: 'boolean', expression: { kind: 'eventDamageTypeIn', damageTypes: ['heat'] } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff9: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  triggerIntervalSeconds: { blackboardKey: 'damage_interval' },
  waitFirstTriggerInterval: false,
  maxTriggerCount: -1,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_wulfa_blood',
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
    playStrongInAnimation: true,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'LifeTime',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
    nameKey: 'effects.name.razorClawmark',
  },
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale: 0.3,
    damage_cd: 1.5,
    damage_interval: 1,
    damage_up: 0.12,
    duration: 1,
    extra_atk_scale: 1.5,
    heal_scale: 0.2,
    poise: 0,
    posie: 0,
    talent_2: 0,
    talent2_burning_damage_scale: 1.5,
  },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'defender',
      condition: { $sequence: 'checkCondition_7' },
      processors: [
        {
          kind: 'damageScale',
          side: 'defender',
          zone: 'normal',
          addition: { blackboardKey: 'damage_up' },
        },
      ],
    },
    {
      enabledSide: 'defender',
      condition: { $sequence: 'checkCondition_8' },
      processors: [
        {
          kind: 'damageScale',
          side: 'defender',
          zone: 'normal',
          addition: { blackboardKey: 'damage_up' },
        },
      ],
    },
  ],
  lifecycleSequences: { trigger: { $sequence: 'dealDamage_2' } },
  abilityEventResponses: [
    { event: 'takeCriticalDamage', priority: 0, sequence: { $sequence: 'checkCondition_6' } },
  ],
  actionGraph: rossiBuff9ActionGraph,
};

const rossiBuff10ActionGraph = {
  main: {
    nodes: {
      applyBuff_6: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0028_wulfa_talent2_heal_effect' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'checkCondition_4',
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'applyBuff_6' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      heal_14: {
        action: {
          kind: 'heal',
          parameters: {
            target: 'caster',
            tags: [],
            attribute: 'intellect',
            multiplier: { kind: 'valueNode', nodeId: 'data_3' },
            addition: { kind: 'constant', value: 0 },
          },
        },
        next: 'ifElse_13',
      },
      dealDamage_15: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'heat',
            attackScale: { kind: 'valueNode', nodeId: 'data_4' },
            tags: [],
            features: ['talentDamage'],
          },
        },
        next: 'heal_14',
      },
      calculateActionValue_11: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'heal_scale',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_3' },
            right: { kind: 'valueNode', nodeId: 'data_5' },
          },
        },
        next: 'dealDamage_15',
      },
      calculateActionValue_12: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_4' },
            right: { kind: 'valueNode', nodeId: 'data_5' },
          },
        },
        next: 'calculateActionValue_11',
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      ifElse_16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'calculateActionValue_12' },
          whenFalse: { $sequence: 'dealDamage_15' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'healthCompare',
          target: 'caster',
          valueType: 'ratio',
          operator: 'less',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0028_wulfa_talent2_heal_effect'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'heal_scale' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'burning_damage_scale' } },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'buffOwner',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Burning'],
          operator: 'greater',
          value: { kind: 'constant', value: 0.5 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff10: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale: 0.3,
    burning_damage_scale: 1.5,
    damage_cd: 1.5,
    damage_interval: 1,
    duration: 1.2,
    heal_scale: 0.05,
    poise: 0,
    posie: 0,
  },
  attributeModifiers: [],
  scheduledSequences: [{ startFrame: 0, endFrame: 19, sequence: { $sequence: 'ifElse_16' } }],
  actionGraph: rossiBuff10ActionGraph,
};

const rossiBuff11ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff11: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  timeClock: 'global',
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale: 0.3,
    damage_cd: 1.5,
    damage_interval: 1,
    duration: 0.9,
    extra_atk_scale: 1.5,
    poise: 0,
    posie: 0,
    talent_2: 0,
  },
  attributeModifiers: [],
  actionGraph: rossiBuff11ActionGraph,
};

const rossiBuff12ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff12: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  timeClock: 'global',
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale: 0.3,
    damage_cd: 1.5,
    damage_interval: 1,
    damage_up: 0.12,
    defup: -0.5,
    duration: 5,
    extra_atk_scale: 1.5,
    heal_scale: 0.2,
    poise: 0,
    posie: 0,
    talent_2: 0,
    talent2_burning_damage_scale: 1.5,
  },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'defender',
      processors: [
        {
          kind: 'damageScale',
          side: 'defender',
          zone: 'product',
          addition: { blackboardKey: 'defup' },
        },
      ],
    },
  ],
  actionGraph: rossiBuff12ActionGraph,
};

const rossiBuff13ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff13: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  timeClock: 'global',
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale: 0.3,
    damage_cd: 1.5,
    damage_interval: 1,
    duration: 2,
    extra_atk_scale: 1.5,
    poise: 0,
    posie: 0,
    talent_2: 0,
  },
  attributeModifiers: [],
  actionGraph: rossiBuff13ActionGraph,
};

const rossiBuff14ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff14: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 3 },
  attributeModifiers: [],
  actionGraph: rossiBuff14ActionGraph,
};

const rossiBuff15ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff15: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 10, End_Early: 0 },
  attributeModifiers: [],
  actionGraph: rossiBuff15ActionGraph,
};

const rossiBuff16ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff16: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 0.5, interval: 0.3 },
  attributeModifiers: [],
  actionGraph: rossiBuff16ActionGraph,
};

const rossiBuff17ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff17: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
  attributeModifiers: [],
  actionGraph: rossiBuff17ActionGraph,
};

const rossiBuff18ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff18: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
  attributeModifiers: [],
  actionGraph: rossiBuff18ActionGraph,
};

const rossiBuff19ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff19: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
  attributeModifiers: [],
  actionGraph: rossiBuff19ActionGraph,
};

const rossiBuff20ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff20: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
  attributeModifiers: [],
  actionGraph: rossiBuff20ActionGraph,
};

const rossiBuff21ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff21: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
  attributeModifiers: [],
  actionGraph: rossiBuff21ActionGraph,
};

const rossiBuff22ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff22: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 2 },
  attributeModifiers: [],
  actionGraph: rossiBuff22ActionGraph,
};

const rossiBuff23ActionGraph = {
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
        expression: { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['ultimateSkill'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff23: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 3,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { critical_damage_up_to_bleed: 0.2, duration: 5 },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'attacker',
      condition: { $sequence: 'checkCondition_1' },
      processors: [
        {
          kind: 'instantAttribute',
          targetSide: 'attacker',
          attribute: 'criticalDamageIncrease',
          values: { slot: 'baseAddition', value: { blackboardKey: 'critical_damage_up_to_bleed' } },
          attributeTiming: 'runtime',
        },
      ],
    },
  ],
  actionGraph: rossiBuff23ActionGraph,
};

const rossiBuff24ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff24: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 4,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: ['Status/Immobilized'],
  extendTags: [],
  blackboard: { duration: 1.5, usp_stage_1: 0.35, usp_stage_2: 0.7, usp_stage_3: 1 },
  attributeModifiers: [],
  actionGraph: rossiBuff24ActionGraph,
};

const rossiBuff25ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const rossiBuff25: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 4,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 1.5, usp_stage_1: 0.35, usp_stage_2: 0.7, usp_stage_3: 1 },
  attributeModifiers: [],
  actionGraph: rossiBuff25ActionGraph,
};

export const rossi: OperatorDefinition = {
  slug: 'rossi',
  gameId: 'ROSSI',
  rarity: 6,
  weaponType: 'sword',
  element: 'physical',
  characterTypeId: 'Physical',
  role: 'guard',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [9, 28, 48, 68, 88, 97],
    agility: [23, 55, 90, 124, 159, 176],
    intellect: [14, 36, 59, 83, 106, 118],
    will: [9, 26, 44, 62, 80, 89],
    baseAttack: [30, 93, 159, 225, 291, 323],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      operationType: 'basicAttack',
      skills: [
        rossiChr_0028_wulfa_attack1,
        rossiChr_0028_wulfa_attack2,
        rossiChr_0028_wulfa_attack3,
        rossiChr_0028_wulfa_attack4,
        rossiChr_0028_wulfa_attack5,
      ],
    },
    { key: 'finisher', operationType: 'finisher', skills: rossiChr_0028_wulfa_power_attack },
    {
      key: 'plungingAttack',
      operationType: 'plungingAttack',
      skills: rossiChr_0028_wulfa_plunging_attack_end,
    },
    { key: 'battleSkill', operationType: 'battleSkill', skills: rossiChr_0028_wulfa_normal_skill },
    {
      key: 'comboSkill',
      operationType: 'comboSkill',
      skills: rossiChr_0028_wulfa_combo_2_skill,
      placementSequenceSkillKeys: ['chr_0028_wulfa_combo_2_skill', 'chr_0028_wulfa_combo_3_skill'],
      replacementSkills: [rossiChr_0028_wulfa_combo_3_skill],
    },
    { key: 'ultimate', operationType: 'ultimate', skills: rossiChr_0028_wulfa_ultimate_skill },
  ],
  dodgeSkill: rossiCommon_character_perfect_dodge,
  dashBuffs: [
    { buffId: 'buff_common_dash', blackboard: { dodgeSkillId: 'common_character_perfect_dodge' } },
  ],
  skillSlots: [
    { key: 'battleSkill', baseSkillKey: 'chr_0028_wulfa_normal_skill', replacementSkillKeys: [] },
    {
      key: 'comboSkill',
      baseSkillKey: 'chr_0028_wulfa_combo_2_skill',
      replacementSkillKeys: ['chr_0028_wulfa_combo_3_skill'],
    },
    { key: 'ultimate', baseSkillKey: 'chr_0028_wulfa_ultimate_skill', replacementSkillKeys: [] },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'chr_0028_wulfa_attack1',
        'chr_0028_wulfa_attack2',
        'chr_0028_wulfa_attack3',
        'chr_0028_wulfa_attack4',
        'chr_0028_wulfa_attack5',
        'chr_0028_wulfa_power_attack',
        'chr_0028_wulfa_plunging_attack_end',
      ],
      normalAttackSkillKeys: [
        'chr_0028_wulfa_attack1',
        'chr_0028_wulfa_attack2',
        'chr_0028_wulfa_attack3',
        'chr_0028_wulfa_attack4',
        'chr_0028_wulfa_attack5',
      ],
      defaultSkillKey: 'chr_0028_wulfa_attack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  comboSkillConditions: [rossiComboCondition1, rossiComboCondition2],
  comboSkillPriority: 'default',
  talents: [
    {
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'talent_1_1',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 1,
          maximumUpgradeLevel: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'talent_1_2',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 2,
          maximumUpgradeLevel: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'atk_scale_bleed',
          operation: 'assign',
          value: [0.25, 0.3],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'duration_bleed',
          operation: 'assign',
          value: [15, 25],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'damage_up',
          operation: 'assign',
          value: [0.06, 0.12],
        },
      ],
    },
    {
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'talent_2_1',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 1,
          maximumUpgradeLevel: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'talent_2_2',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 2,
          maximumUpgradeLevel: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'bleed_critical_damage_scale',
          operation: 'assign',
          value: [0.12, 0.24],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'bleed_critical_damage_interval',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'heal_scale',
          operation: 'assign',
          value: [0.04, 0.08],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'talent2_burning_damage_scale',
          operation: 'assign',
          value: [1.5, 1.5],
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
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'potential_upgrade',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'atk_scale_1',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'atk_scale_3',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_combo_2_skill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_combo_3_skill',
          blackboardKey: 'atk_scale_s',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_combo_3_skill',
          blackboardKey: 'atk_scale_f',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_combo_3_skill',
          blackboardKey: 'damage_add',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 20 },
        { kind: 'modifyBasePanelStat', stat: 'criticalRate', operation: 'flat', value: 0.07 },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'bleed_critical_damage_scale',
          operation: 'add',
          value: 0.08,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'bleed_critical_damage_interval',
          operation: 'add',
          value: -0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_normal_skill',
          blackboardKey: 'heal_scale',
          operation: 'add',
          value: 0.04,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillKey: 'chr_0028_wulfa_ultimate_skill',
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
          skillKey: 'chr_0028_wulfa_ultimate_skill',
          blackboardKey: 'potential_5_damage_scale',
          operation: 'assign',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_ultimate_skill',
          blackboardKey: 'potential_5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0028_wulfa_ultimate_skill',
          blackboardKey: 'potential_5_critical_damage',
          operation: 'assign',
          value: 0.3,
        },
      ],
    },
  ],
  entityBlackboard: {
    EntityBB_Combo_qte_proto_use: 1,
    EntityBB_Combo_QTE_Trigger: 0,
    EntityBB_ComboUseCount: 0,
    EntityBB_NormalSkill_wolf_gain_usp: 0,
  },
  buffDefinitions: {
    buff_chr_0028_wulfa_combo_2_damage: rossiBuff1,
    buff_chr_0028_wulfa_combo_2_damagewait: rossiBuff2,
    buff_chr_0028_wulfa_combo_2_qte_timerlistening: rossiBuff3,
    buff_chr_0028_wulfa_combo_criticalrate: rossiBuff4,
    buff_chr_0028_wulfa_combo_hasinflict: rossiBuff5,
    buff_chr_0028_wulfa_combo_inflictnum: rossiBuff6,
    buff_chr_0028_wulfa_combo_usecount: rossiBuff7,
    buff_chr_0028_wulfa_combo_usetimer: rossiBuff8,
    buff_chr_0028_wulfa_normal_bleed: rossiBuff9,
    buff_chr_0028_wulfa_normal_bleed_crit_extra_damage: rossiBuff10,
    buff_chr_0028_wulfa_normal_bleed_effect: rossiBuff11,
    buff_chr_0028_wulfa_normal_defup: rossiBuff12,
    buff_chr_0028_wulfa_normal_smarttarget: rossiBuff13,
    buff_chr_0028_wulfa_normal_wolf_timer: rossiBuff14,
    buff_chr_0028_wulfa_powerattack_resumecombo: rossiBuff15,
    buff_chr_0028_wulfa_talent2_heal_effect: rossiBuff16,
    buff_chr_0028_wulfa_tut_comboskill_failure: rossiBuff17,
    buff_chr_0028_wulfa_tut_comboskill_finish: rossiBuff18,
    buff_chr_0028_wulfa_tut_comboskill_success: rossiBuff19,
    buff_chr_0028_wulfa_tut_normalskill_failure: rossiBuff20,
    buff_chr_0028_wulfa_tut_normalskill_success: rossiBuff21,
    buff_chr_0028_wulfa_ult_addtional_battleshape: rossiBuff22,
    buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed: rossiBuff23,
    buff_chr_0028_wulfa_ult_stopenemy: rossiBuff24,
    buff_chr_0028_wulfa_ult_stopenemy_elite: rossiBuff25,
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0028_wulfa_combo_qte_timing: {
      bornTags: ['Status/UnLockable', 'Status/NonAITarget'],
      lifetime: { kind: 'limited', durationSeconds: 10 },
      deathReleaseDelaySeconds: 0.100000001490116,
      childSkills: {
        chr_0028_wulfa_absorb_entity_effect_1: {
          actionGraph: { main: { nodes: {} }, macros: {} },
          skillId: 'chr_0028_wulfa_absorb_entity_effect_1',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 22,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale: 0, duration: 0 },
          scheduledSequences: [],
        },
        chr_0028_wulfa_absorb_entity_effect_2: {
          actionGraph: {
            main: {
              nodes: {
                startTimeDilation_1: {
                  action: {
                    kind: 'startTimeDilation',
                    parameters: {
                      scope: 'global',
                      durationSeconds: { kind: 'constant', value: 0.4 },
                      slot: 'unassigned',
                      priority: 50,
                      curve: {
                        kind: 'inline',
                        keys: [
                          {
                            time: -0.01169591,
                            value: 1.01995,
                            inTangent: 0,
                            outTangent: 0,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                          {
                            time: 0.251462,
                            value: 0.4,
                            inTangent: 0,
                            outTangent: 0,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                          {
                            time: 0.4853801,
                            value: 0.4,
                            inTangent: 0,
                            outTangent: 0,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                          {
                            time: 1,
                            value: 1,
                            inTangent: 0,
                            outTangent: 0,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                        ],
                      },
                      finishByAction: true,
                      ignoredTargets: [],
                    },
                  },
                  next: null,
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0028_wulfa_absorb_entity_effect_2',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 22,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale: 0, duration: 0 },
          scheduledSequences: [
            { startFrame: 1, endFrame: 16, sequence: { $sequence: 'startTimeDilation_1' } },
          ],
        },
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;

export default rossi;
