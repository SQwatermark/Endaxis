/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */

import type { ActionGraphResourceDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import type { SkillDefinition } from '../../../packages/game-data-contract/src/skills';
import type { SkillBuffDefinition } from '../../../packages/game-data-contract/src/buffs';
import type {
  OperatorPassiveSkillDefinition,
  ComboSkillConditionDefinition,
} from '../../../packages/game-data-contract/src/operators';
import type { OperatorDefinition } from '../../../packages/game-data-contract/src/operators';
export const yvonneChr_0017_yvonne_attack1ActionGraph = {
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
                skillId: 'chr_0017_yvonne_attack1_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atb: 0, atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
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
                            onlyMainOperator: true,
                            spGainKind: 'gain',
                            spGainSource: 'normalAttack',
                          },
                        },
                        next: null,
                      },
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_2' },
                          whenTrue: { $sequence: 'changeResource_3' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_4' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
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
                      data_2: { type: 'boolean', expression: { kind: 'casterControlled' } },
                      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
                      data_4: {
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
      reachSkillOperableBoundary_2: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_attack2'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_3: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_attack5'] },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_attack1: SkillDefinition = {
  key: 'chr_0017_yvonne_attack1',
  element: 'cryo',
  blackboard: {
    atb: 0,
    atk_scale: [0.24, 0.26, 0.28, 0.31, 0.33, 0.35, 0.38, 0.4, 0.42, 0.45, 0.49, 0.53],
  },
  timelineBlockFrames: 16,
  naturalDurationFrames: 121,
  exclusiveFrame: 20,
  offsetRecordFrame: 11,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 27,
        input: 'basicAttack',
        targetSkillId: 'chr_0017_yvonne_attack2',
      },
    ],
    allowedNextSkills: [
      { startFrame: 16, endFrame: 27, skillIds: ['chr_0017_yvonne_attack2'] },
      { startFrame: 0, endFrame: 27, skillIds: ['chr_0017_yvonne_attack5'] },
    ],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 11, endFrame: 11, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 16, endFrame: 27, sequence: { $sequence: 'reachSkillOperableBoundary_2' } },
    { startFrame: 0, endFrame: 27, sequence: { $sequence: 'reachSkillOperableBoundary_3' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_attack2',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_attack1ActionGraph,
};

export const yvonneChr_0017_yvonne_attack2ActionGraph = {
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
                skillId: 'chr_0017_yvonne_attack2_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atb: 0, atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
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
                            coefficient: { kind: 'constant', value: 0.5 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                            onlyMainOperator: true,
                            spGainKind: 'gain',
                            spGainSource: 'normalAttack',
                          },
                        },
                        next: null,
                      },
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_2' },
                          whenTrue: { $sequence: 'changeResource_3' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_4' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
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
                      data_2: { type: 'boolean', expression: { kind: 'casterControlled' } },
                      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
                      data_4: {
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
      launchProjectile_2: {
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
                skillId: 'chr_0017_yvonne_attack2_robot_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atb: 0, atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
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
                            coefficient: { kind: 'constant', value: 0.5 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                            onlyMainOperator: true,
                            spGainKind: 'gain',
                            spGainSource: 'normalAttack',
                          },
                        },
                        next: null,
                      },
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_2' },
                          whenTrue: { $sequence: 'changeResource_3' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_4' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
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
                      data_2: { type: 'boolean', expression: { kind: 'casterControlled' } },
                      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
                      data_4: {
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
      reachSkillOperableBoundary_3: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_attack3'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_4: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_attack5'] },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_attack2: SkillDefinition = {
  key: 'chr_0017_yvonne_attack2',
  element: 'cryo',
  blackboard: {
    atb: 0,
    atk_scale: [0.13, 0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.21, 0.23, 0.24, 0.26, 0.28],
  },
  timelineBlockFrames: 14,
  naturalDurationFrames: 126,
  exclusiveFrame: 20,
  offsetRecordFrame: 11,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 28,
        input: 'basicAttack',
        targetSkillId: 'chr_0017_yvonne_attack3',
      },
    ],
    allowedNextSkills: [
      { startFrame: 14, endFrame: 28, skillIds: ['chr_0017_yvonne_attack3'] },
      { startFrame: 0, endFrame: 28, skillIds: ['chr_0017_yvonne_attack5'] },
    ],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 11, endFrame: 11, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 14, endFrame: 14, sequence: { $sequence: 'launchProjectile_2' } },
    { startFrame: 14, endFrame: 28, sequence: { $sequence: 'reachSkillOperableBoundary_3' } },
    { startFrame: 0, endFrame: 28, sequence: { $sequence: 'reachSkillOperableBoundary_4' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_attack3',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_attack2ActionGraph,
};

export const yvonneChr_0017_yvonne_attack3ActionGraph = {
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
                skillId: 'chr_0017_yvonne_attack3_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atb: 0, atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
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
                            coefficient: { kind: 'constant', value: 0.3333333 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                            onlyMainOperator: true,
                            spGainKind: 'gain',
                            spGainSource: 'normalAttack',
                          },
                        },
                        next: null,
                      },
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_2' },
                          whenTrue: { $sequence: 'changeResource_3' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_4' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
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
                      data_2: { type: 'boolean', expression: { kind: 'casterControlled' } },
                      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
                      data_4: {
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
      reachSkillOperableBoundary_4: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_attack4'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_5: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_attack5'] },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_attack3: SkillDefinition = {
  key: 'chr_0017_yvonne_attack3',
  element: 'cryo',
  blackboard: {
    atb: 0,
    atk_scale: [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.22, 0.24],
  },
  timelineBlockFrames: 20,
  naturalDurationFrames: 127,
  exclusiveFrame: 21,
  offsetRecordFrame: 6,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 34,
        input: 'basicAttack',
        targetSkillId: 'chr_0017_yvonne_attack4',
      },
    ],
    allowedNextSkills: [
      { startFrame: 20, endFrame: 34, skillIds: ['chr_0017_yvonne_attack4'] },
      { startFrame: 0, endFrame: 34, skillIds: ['chr_0017_yvonne_attack5'] },
    ],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 6, endFrame: 6, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 9, endFrame: 9, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 12, endFrame: 12, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 20, endFrame: 34, sequence: { $sequence: 'reachSkillOperableBoundary_4' } },
    { startFrame: 0, endFrame: 34, sequence: { $sequence: 'reachSkillOperableBoundary_5' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_attack4',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_attack3ActionGraph,
};

export const yvonneChr_0017_yvonne_attack4ActionGraph = {
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
                skillId: 'chr_0017_yvonne_attack4_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atb: 0, atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
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
                            onlyMainOperator: true,
                            spGainKind: 'gain',
                            spGainSource: 'normalAttack',
                          },
                        },
                        next: null,
                      },
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_2' },
                          whenTrue: { $sequence: 'changeResource_3' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_4' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
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
                      data_2: { type: 'boolean', expression: { kind: 'casterControlled' } },
                      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
                      data_4: {
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
      reachSkillOperableBoundary_2: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_attack5'] },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_attack4: SkillDefinition = {
  key: 'chr_0017_yvonne_attack4',
  element: 'cryo',
  blackboard: {
    atb: 0,
    atk_scale: [0.41, 0.45, 0.49, 0.53, 0.58, 0.62, 0.66, 0.7, 0.74, 0.79, 0.85, 0.92],
  },
  timelineBlockFrames: 24,
  naturalDurationFrames: 156,
  exclusiveFrame: 25,
  offsetRecordFrame: 11,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 38,
        input: 'basicAttack',
        targetSkillId: 'chr_0017_yvonne_attack5',
      },
    ],
    allowedNextSkills: [{ startFrame: 24, endFrame: 38, skillIds: ['chr_0017_yvonne_attack5'] }],
    hasConditionalActions: true,
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 11, endFrame: 11, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 24, endFrame: 38, sequence: { $sequence: 'reachSkillOperableBoundary_2' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_attack5',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_attack4ActionGraph,
};

export const yvonneChr_0017_yvonne_attack5ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: { key: 'cnt', operation: 'add', value: { kind: 'constant', value: 1 } },
        },
        next: null,
      },
      changeResource_4: {
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
        next: 'modifyActionValue_3',
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'changeResource_4',
      },
      dealStagger_6: {
        action: {
          kind: 'dealStagger',
          parameters: { value: { kind: 'valueNode', nodeId: 'data_5' } },
        },
        next: 'checkCondition_5',
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      ifElse_7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'dealStagger_6' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_8: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_7' },
            tags: ['normalAttack', 'normalAttackLastCombo'],
          },
        },
        next: 'ifElse_7',
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
              targetTriggerIntervalSeconds: 0.1,
            },
          },
          body: { $sequence: 'dealDamage_8' },
        },
        next: null,
      },
      ifElse_10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: 'repeatEachTick_9',
      },
      finishBuffsById_11: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_talent_1_valid'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      reachSkillOperableBoundary_15: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_ult_attack2_1'] },
        },
        next: null,
      },
      checkCondition_14: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      ifElse_18: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_14' },
          whenTrue: { $sequence: 'reachSkillOperableBoundary_15' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_19: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: 'reachSkillOperableBoundary_15' },
          whenFalse: { $sequence: 'ifElse_18' },
        },
        next: null,
      },
      reachSkillOperableBoundary_21: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_attack1'] },
        },
        next: null,
      },
      ifElse_23: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_14' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'reachSkillOperableBoundary_21' },
        },
        next: null,
      },
      ifElse_24: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_23' },
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
          buffIds: ['buff_chr_0017_yvonne_talent_1_valid'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'cnt', fallback: 0 } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_3' },
          operator: 'less',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_6: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_end'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_attack5: SkillDefinition = {
  key: 'chr_0017_yvonne_attack5',
  element: 'cryo',
  blackboard: {
    atb: 17,
    atk_scale: [0.56, 0.62, 0.67, 0.73, 0.79, 0.84, 0.9, 0.96, 1.01, 1.08, 1.17, 1.26],
    cnt: 0,
    poise: 17,
  },
  timelineBlockFrames: 37,
  naturalDurationFrames: 145,
  exclusiveFrame: 37,
  offsetRecordFrame: 21,
  inputWindows: {
    hasConditionalActions: true,
    allowedNextSkills: [{ startFrame: 37, endFrame: 60, skillIds: ['chr_0017_yvonne_attack1'] }],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 21, endFrame: 23, sequence: { $sequence: 'ifElse_10' } },
    { startFrame: 21, endFrame: 24, sequence: { $sequence: 'finishBuffsById_11' } },
    { startFrame: 0, endFrame: 60, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 34, endFrame: 60, sequence: { $sequence: 'ifElse_19' } },
    { startFrame: 37, endFrame: 60, sequence: { $sequence: 'ifElse_24' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_attack1',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_attack5ActionGraph,
};

export const yvonneChr_0017_yvonne_ult_attack1_1ActionGraph = {
  main: {
    nodes: {
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0017_yvonne_ult_attack2_1',
              'chr_0017_yvonne_ult_attack_end',
            ],
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
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'applyBuff_2' },
        },
        next: null,
      },
      finishBuffsById_4: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
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
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
                copiedBlackboardAssignments: {
                  crit_rate_up: 'crit_rate_up',
                  normal_dmg_up: 'normal_dmg_up',
                },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      launchProjectile_8: {
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
                skillId: 'chr_0017_yvonne_ult_attack1_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
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
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: null },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'probability',
                          probability: { kind: 'constant', value: 0.125 },
                        },
                      },
                      data_2: {
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
      applyBuff_11: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_start' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack2_1'],
          },
        },
        next: null,
      },
      reachSkillOperableBoundary_12: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: {
            skillIds: ['chr_0017_yvonne_ult_attack2_1', 'chr_0017_yvonne_ult_attack_end'],
          },
        },
        next: null,
      },
      reachSkillOperableBoundary_13: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'] },
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
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_ult_attack1_1: SkillDefinition = {
  key: 'chr_0017_yvonne_ult_attack1_1',
  element: 'cryo',
  blackboard: {
    atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
    crit_rate_up: 0.06,
    normal_dmg_up: 0.03,
  },
  timelineBlockFrames: 21,
  naturalDurationFrames: 77,
  exclusiveFrame: 28,
  offsetRecordFrame: 9,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 26,
        input: 'basicAttack',
        targetSkillId: 'chr_0017_yvonne_ult_attack2_1',
      },
    ],
    allowedNextSkills: [
      {
        startFrame: 21,
        endFrame: 26,
        skillIds: ['chr_0017_yvonne_ult_attack2_1', 'chr_0017_yvonne_ult_attack_end'],
      },
      {
        startFrame: 0,
        endFrame: 26,
        skillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'],
      },
      { startFrame: 21, endFrame: 26, skillIds: ['chr_0017_yvonne_ult_attack2_1'] },
    ],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 0, endFrame: 37, sequence: { $sequence: 'ifElse_3' } },
    { startFrame: 37, endFrame: 40, sequence: { $sequence: 'finishBuffsById_4' } },
    { startFrame: 9, endFrame: 12, sequence: { $sequence: 'applyBuff_5' } },
    { startFrame: 15, endFrame: 18, sequence: { $sequence: 'applyBuff_5' } },
    { startFrame: 21, endFrame: 24, sequence: { $sequence: 'applyBuff_5' } },
    { startFrame: 9, endFrame: 9, sequence: { $sequence: 'launchProjectile_8' } },
    { startFrame: 15, endFrame: 15, sequence: { $sequence: 'launchProjectile_8' } },
    { startFrame: 21, endFrame: 21, sequence: { $sequence: 'launchProjectile_8' } },
    { startFrame: 11, endFrame: 23, sequence: { $sequence: 'applyBuff_11' } },
    { startFrame: 21, endFrame: 26, sequence: { $sequence: 'reachSkillOperableBoundary_12' } },
    { startFrame: 0, endFrame: 26, sequence: { $sequence: 'reachSkillOperableBoundary_13' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_ult_attack2_1',
  skillType: 'basicAttack',
  levelSource: 'ultimate',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_ult_attack1_1ActionGraph,
};

export const yvonneChr_0017_yvonne_ult_attack2_1ActionGraph = {
  main: {
    nodes: {
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0017_yvonne_ult_attack2_2',
              'chr_0017_yvonne_ult_attack_end',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_2: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
            inheritToNextSkillIds: [
              'chr_0017_yvonne_ult_attack2_2',
              'chr_0017_yvonne_ult_attack_end',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
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
      ifElse_4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'inheritBuffById_2' },
          whenFalse: { $sequence: 'applyBuff_3' },
        },
        next: null,
      },
      finishBuffsById_5: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          },
        },
        next: null,
      },
      findTargets_6: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'maintar',
          },
        },
        next: null,
      },
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
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
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'applyBuff_12' },
          whenFalse: { $sequence: 'applyBuff_12' },
        },
        next: null,
      },
      applyBuff_32: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.6 } },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_33: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'applyBuff_32' },
          whenFalse: { $sequence: 'applyBuff_32' },
        },
        next: null,
      },
      launchProjectile_36: {
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
                skillId: 'chr_0017_yvonne_ult_attack2_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
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
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: null },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'probability',
                          probability: { kind: 'constant', value: 0.125 },
                        },
                      },
                      data_2: {
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
      findTargets_37: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'maintar',
          },
        },
        next: 'launchProjectile_36',
      },
      checkCondition_34: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_38: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_34' },
          whenTrue: { $sequence: 'launchProjectile_36' },
          whenFalse: { $sequence: 'findTargets_37' },
        },
        next: null,
      },
      ifElse_39: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'ifElse_38' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      launchProjectile_42: {
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
                skillId: 'chr_0017_yvonne_ult_attack1_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
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
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: null },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'probability',
                          probability: { kind: 'constant', value: 0.125 },
                        },
                      },
                      data_2: {
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
      findTargets_43: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'maintar',
          },
        },
        next: 'launchProjectile_42',
      },
      ifElse_44: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_34' },
          whenTrue: { $sequence: 'launchProjectile_42' },
          whenFalse: { $sequence: 'findTargets_43' },
        },
        next: null,
      },
      ifElse_45: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'ifElse_44' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      inheritBuffById_59: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_start',
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack2_2'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_58: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_60: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_58' },
          whenTrue: { $sequence: 'inheritBuffById_59' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      reachSkillOperableBoundary_61: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: {
            skillIds: ['chr_0017_yvonne_ult_attack2_2', 'chr_0017_yvonne_ult_attack_end'],
          },
        },
        next: null,
      },
      reachSkillOperableBoundary_62: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'] },
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
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'healthCompare',
          target: 'enemy',
          valueType: 'ratio',
          operator: 'greater',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_start'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_ult_attack2_1: SkillDefinition = {
  key: 'chr_0017_yvonne_ult_attack2_1',
  element: 'cryo',
  blackboard: {
    atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
  },
  timelineBlockFrames: 23,
  naturalDurationFrames: 133,
  exclusiveFrame: 31,
  offsetRecordFrame: 11,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 30,
        input: 'basicAttack',
        targetSkillId: 'chr_0017_yvonne_ult_attack2_2',
      },
    ],
    allowedNextSkills: [
      {
        startFrame: 23,
        endFrame: 30,
        skillIds: ['chr_0017_yvonne_ult_attack2_2', 'chr_0017_yvonne_ult_attack_end'],
      },
      {
        startFrame: 0,
        endFrame: 30,
        skillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'],
      },
      { startFrame: 23, endFrame: 30, skillIds: ['chr_0017_yvonne_ult_attack2_2'] },
    ],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 0, endFrame: 32, sequence: { $sequence: 'ifElse_4' } },
    { startFrame: 32, endFrame: 35, sequence: { $sequence: 'finishBuffsById_5' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findTargets_6' } },
    { startFrame: 11, endFrame: 14, sequence: { $sequence: 'applyBuff_7' } },
    { startFrame: 14, endFrame: 17, sequence: { $sequence: 'applyBuff_7' } },
    { startFrame: 17, endFrame: 20, sequence: { $sequence: 'applyBuff_7' } },
    { startFrame: 5, endFrame: 8, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 8, endFrame: 11, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 11, endFrame: 14, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 14, endFrame: 17, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 17, endFrame: 20, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 21, endFrame: 24, sequence: { $sequence: 'ifElse_33' } },
    { startFrame: 11, endFrame: 11, sequence: { $sequence: 'ifElse_39' } },
    { startFrame: 14, endFrame: 14, sequence: { $sequence: 'ifElse_45' } },
    { startFrame: 17, endFrame: 17, sequence: { $sequence: 'ifElse_39' } },
    { startFrame: 21, endFrame: 21, sequence: { $sequence: 'ifElse_45' } },
    { startFrame: 0, endFrame: 24, sequence: { $sequence: 'ifElse_60' } },
    { startFrame: 23, endFrame: 30, sequence: { $sequence: 'reachSkillOperableBoundary_61' } },
    { startFrame: 0, endFrame: 30, sequence: { $sequence: 'reachSkillOperableBoundary_62' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_ult_attack2_2',
  skillType: 'basicAttack',
  levelSource: 'ultimate',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_ult_attack2_1ActionGraph,
};

export const yvonneChr_0017_yvonne_ult_attack2_2ActionGraph = {
  main: {
    nodes: {
      findTargets_1: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'maintar',
          },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
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
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              },
            ],
            target: 'caster',
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
        next: null,
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'applyBuff_7' },
          whenFalse: { $sequence: 'applyBuff_7' },
        },
        next: null,
      },
      applyBuff_19: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.6 } },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_20: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'applyBuff_19' },
          whenFalse: { $sequence: 'applyBuff_19' },
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
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0017_yvonne_ult_attack1_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
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
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: null },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'probability',
                          probability: { kind: 'constant', value: 0.125 },
                        },
                      },
                      data_2: {
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
      findTargets_24: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'maintar',
          },
        },
        next: 'launchProjectile_23',
      },
      checkCondition_21: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_25: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_21' },
          whenTrue: { $sequence: 'launchProjectile_23' },
          whenFalse: { $sequence: 'findTargets_24' },
        },
        next: null,
      },
      ifElse_26: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'ifElse_25' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_47: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0017_yvonne_ult_attack3_1',
              'chr_0017_yvonne_ult_attack_end',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_46: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
            inheritToNextSkillIds: [
              'chr_0017_yvonne_ult_attack3_1',
              'chr_0017_yvonne_ult_attack_end',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_45: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_48: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_45' },
          whenTrue: { $sequence: 'inheritBuffById_46' },
          whenFalse: { $sequence: 'applyBuff_47' },
        },
        next: null,
      },
      finishBuffsById_49: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          },
        },
        next: null,
      },
      inheritBuffById_51: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_start',
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_1'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_50: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_52: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_50' },
          whenTrue: { $sequence: 'inheritBuffById_51' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      reachSkillOperableBoundary_53: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: {
            skillIds: ['chr_0017_yvonne_ult_attack3_1', 'chr_0017_yvonne_ult_attack_end'],
          },
        },
        next: null,
      },
      reachSkillOperableBoundary_54: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'] },
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
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'healthCompare',
          target: 'enemy',
          valueType: 'ratio',
          operator: 'greater',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_start'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_ult_attack2_2: SkillDefinition = {
  key: 'chr_0017_yvonne_ult_attack2_2',
  element: 'cryo',
  blackboard: {
    atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
  },
  timelineBlockFrames: 12,
  naturalDurationFrames: 123,
  exclusiveFrame: 22,
  offsetRecordFrame: 1,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 20,
        input: 'basicAttack',
        targetSkillId: 'chr_0017_yvonne_ult_attack3_1',
      },
    ],
    allowedNextSkills: [
      {
        startFrame: 12,
        endFrame: 20,
        skillIds: ['chr_0017_yvonne_ult_attack3_1', 'chr_0017_yvonne_ult_attack_end'],
      },
      {
        startFrame: 0,
        endFrame: 20,
        skillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'],
      },
      { startFrame: 12, endFrame: 20, skillIds: ['chr_0017_yvonne_ult_attack3_1'] },
    ],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findTargets_1' } },
    { startFrame: 1, endFrame: 4, sequence: { $sequence: 'applyBuff_2' } },
    { startFrame: 4, endFrame: 7, sequence: { $sequence: 'applyBuff_2' } },
    { startFrame: 7, endFrame: 10, sequence: { $sequence: 'applyBuff_2' } },
    { startFrame: 1, endFrame: 4, sequence: { $sequence: 'ifElse_8' } },
    { startFrame: 4, endFrame: 7, sequence: { $sequence: 'ifElse_8' } },
    { startFrame: 7, endFrame: 10, sequence: { $sequence: 'ifElse_8' } },
    { startFrame: 11, endFrame: 14, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 1, endFrame: 1, sequence: { $sequence: 'ifElse_26' } },
    { startFrame: 4, endFrame: 4, sequence: { $sequence: 'ifElse_26' } },
    { startFrame: 7, endFrame: 7, sequence: { $sequence: 'ifElse_26' } },
    { startFrame: 11, endFrame: 11, sequence: { $sequence: 'ifElse_26' } },
    { startFrame: 0, endFrame: 21, sequence: { $sequence: 'ifElse_48' } },
    { startFrame: 21, endFrame: 24, sequence: { $sequence: 'finishBuffsById_49' } },
    { startFrame: 0, endFrame: 13, sequence: { $sequence: 'ifElse_52' } },
    { startFrame: 12, endFrame: 20, sequence: { $sequence: 'reachSkillOperableBoundary_53' } },
    { startFrame: 0, endFrame: 20, sequence: { $sequence: 'reachSkillOperableBoundary_54' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_ult_attack3_1',
  skillType: 'basicAttack',
  levelSource: 'ultimate',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_ult_attack2_2ActionGraph,
};

export const yvonneChr_0017_yvonne_ult_attack3_1ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      applyBuff_11: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'applyBuff_11' },
          whenFalse: { $sequence: 'applyBuff_11' },
        },
        next: null,
      },
      applyBuff_39: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.5 } },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_40: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'applyBuff_39' },
          whenFalse: { $sequence: 'applyBuff_39' },
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
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0017_yvonne_ult_attack1_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
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
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: null },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'probability',
                          probability: { kind: 'constant', value: 0.125 },
                        },
                      },
                      data_2: {
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
      launchProjectile_42: {
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
                skillId: 'chr_0017_yvonne_ult_attack2_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
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
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: null },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'probability',
                          probability: { kind: 'constant', value: 0.125 },
                        },
                      },
                      data_2: {
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
      applyBuff_51: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0017_yvonne_ult_attack3_2',
              'chr_0017_yvonne_ult_attack_end',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_50: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
            inheritToNextSkillIds: [
              'chr_0017_yvonne_ult_attack3_2',
              'chr_0017_yvonne_ult_attack_end',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_49: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_52: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_49' },
          whenTrue: { $sequence: 'inheritBuffById_50' },
          whenFalse: { $sequence: 'applyBuff_51' },
        },
        next: null,
      },
      finishBuffsById_53: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          },
        },
        next: null,
      },
      inheritBuffById_55: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_start',
            inheritToNextSkillIds: [],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_54: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_56: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_54' },
          whenTrue: { $sequence: 'inheritBuffById_55' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      inheritBuffById_59: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short',
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_58: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
          },
        },
        next: null,
      },
      checkCondition_57: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_62: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_57' },
          whenTrue: { $sequence: 'applyBuff_58' },
          whenFalse: { $sequence: 'inheritBuffById_59' },
        },
        next: null,
      },
      inheritBuffById_61: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice',
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_60: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_68: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_60' },
          whenTrue: { $sequence: 'inheritBuffById_61' },
          whenFalse: { $sequence: 'ifElse_62' },
        },
        next: null,
      },
      applyBuff_66: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
          },
        },
        next: null,
      },
      createTimedMarker_67: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            target: 'caster',
            markerId: 'chr_0017_yvonne_voice_cd',
            durationSeconds: { kind: 'constant', value: 5 },
            autoFinishByAction: false,
          },
        },
        next: 'applyBuff_66',
      },
      checkCondition_64: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'checkCondition_57',
      },
      checkCondition_65: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: 'checkCondition_64',
      },
      ifElse_69: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_65' },
          whenTrue: { $sequence: 'createTimedMarker_67' },
          whenFalse: { $sequence: 'ifElse_68' },
        },
        next: null,
      },
      reachSkillOperableBoundary_70: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: {
            skillIds: ['chr_0017_yvonne_ult_attack3_2', 'chr_0017_yvonne_ult_attack_end'],
          },
        },
        next: null,
      },
      reachSkillOperableBoundary_71: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'] },
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
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_start'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'timedMarkerPresent',
          target: 'caster',
          markerId: 'chr_0017_yvonne_voice_cd',
        },
      },
      data_8: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_7' } },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_ult_attack3_1: SkillDefinition = {
  key: 'chr_0017_yvonne_ult_attack3_1',
  element: 'cryo',
  blackboard: {
    atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
  },
  timelineBlockFrames: 28,
  naturalDurationFrames: 163,
  exclusiveFrame: 45,
  offsetRecordFrame: 13,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 36,
        input: 'basicAttack',
        targetSkillId: 'chr_0017_yvonne_ult_attack3_2',
      },
    ],
    allowedNextSkills: [
      {
        startFrame: 28,
        endFrame: 36,
        skillIds: ['chr_0017_yvonne_ult_attack3_2', 'chr_0017_yvonne_ult_attack_end'],
      },
      {
        startFrame: 0,
        endFrame: 36,
        skillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'],
      },
      { startFrame: 28, endFrame: 36, skillIds: ['chr_0017_yvonne_ult_attack3_2'] },
    ],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 13, endFrame: 15, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 15, endFrame: 17, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 17, endFrame: 19, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 19, endFrame: 21, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 21, endFrame: 23, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 23, endFrame: 25, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 25, endFrame: 27, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 27, endFrame: 29, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 13, endFrame: 15, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 15, endFrame: 17, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 17, endFrame: 19, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 19, endFrame: 21, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 21, endFrame: 23, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 23, endFrame: 25, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 25, endFrame: 27, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 27, endFrame: 29, sequence: { $sequence: 'ifElse_40' } },
    { startFrame: 13, endFrame: 13, sequence: { $sequence: 'launchProjectile_41' } },
    { startFrame: 15, endFrame: 15, sequence: { $sequence: 'launchProjectile_42' } },
    { startFrame: 17, endFrame: 17, sequence: { $sequence: 'launchProjectile_41' } },
    { startFrame: 19, endFrame: 19, sequence: { $sequence: 'launchProjectile_42' } },
    { startFrame: 21, endFrame: 21, sequence: { $sequence: 'launchProjectile_41' } },
    { startFrame: 23, endFrame: 23, sequence: { $sequence: 'launchProjectile_42' } },
    { startFrame: 25, endFrame: 25, sequence: { $sequence: 'launchProjectile_41' } },
    { startFrame: 27, endFrame: 27, sequence: { $sequence: 'launchProjectile_42' } },
    { startFrame: 0, endFrame: 50, sequence: { $sequence: 'ifElse_52' } },
    { startFrame: 50, endFrame: 53, sequence: { $sequence: 'finishBuffsById_53' } },
    { startFrame: 0, endFrame: 12, sequence: { $sequence: 'ifElse_56' } },
    { startFrame: 12, endFrame: 32, sequence: { $sequence: 'ifElse_69' } },
    { startFrame: 28, endFrame: 36, sequence: { $sequence: 'reachSkillOperableBoundary_70' } },
    { startFrame: 0, endFrame: 36, sequence: { $sequence: 'reachSkillOperableBoundary_71' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_ult_attack3_2',
  skillType: 'basicAttack',
  levelSource: 'ultimate',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_ult_attack3_1ActionGraph,
};

export const yvonneChr_0017_yvonne_ult_attack3_2ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
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
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0017_yvonne_ult_attack1_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
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
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: null },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'probability',
                          probability: { kind: 'constant', value: 0.125 },
                        },
                      },
                      data_2: {
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
      launchProjectile_10: {
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
                skillId: 'chr_0017_yvonne_ult_attack2_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'dealDamage_opt2' } },
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
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: null },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      dealDamage_opt2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'ifElse_opt1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'probability',
                          probability: { kind: 'constant', value: 0.125 },
                        },
                      },
                      data_2: {
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
      applyBuff_19: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_20: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'applyBuff_19' },
          whenFalse: { $sequence: 'applyBuff_19' },
        },
        next: null,
      },
      applyBuff_47: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.5 } },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_48: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'applyBuff_47' },
          whenFalse: { $sequence: 'applyBuff_47' },
        },
        next: null,
      },
      applyBuff_51: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0017_yvonne_ult_attack3_2',
              'chr_0017_yvonne_ult_attack_end',
            ],
          },
        },
        next: null,
      },
      inheritBuffById_50: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
            inheritToNextSkillIds: [
              'chr_0017_yvonne_ult_attack3_2',
              'chr_0017_yvonne_ult_attack_end',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_49: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_52: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_49' },
          whenTrue: { $sequence: 'inheritBuffById_50' },
          whenFalse: { $sequence: 'applyBuff_51' },
        },
        next: null,
      },
      finishBuffsById_53: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          },
        },
        next: null,
      },
      reachSkillOperableBoundary_54: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_attack5'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_55: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0017_yvonne_ult_attack_end'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_56: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: {
            skillIds: ['chr_0017_yvonne_ult_attack3_2', 'chr_0017_yvonne_ult_attack_end'],
          },
        },
        next: null,
      },
      inheritBuffById_59: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short',
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      applyBuff_58: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
          },
        },
        next: null,
      },
      checkCondition_57: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_62: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_57' },
          whenTrue: { $sequence: 'applyBuff_58' },
          whenFalse: { $sequence: 'inheritBuffById_59' },
        },
        next: null,
      },
      inheritBuffById_61: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice',
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_60: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_68: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_60' },
          whenTrue: { $sequence: 'inheritBuffById_61' },
          whenFalse: { $sequence: 'ifElse_62' },
        },
        next: null,
      },
      applyBuff_66: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
          },
        },
        next: null,
      },
      createTimedMarker_67: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            target: 'caster',
            markerId: 'chr_0017_yvonne_voice_cd',
            durationSeconds: { kind: 'constant', value: 5 },
            autoFinishByAction: false,
          },
        },
        next: 'applyBuff_66',
      },
      checkCondition_64: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'checkCondition_57',
      },
      checkCondition_65: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'checkCondition_64',
      },
      ifElse_69: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_65' },
          whenTrue: { $sequence: 'createTimedMarker_67' },
          whenFalse: { $sequence: 'ifElse_68' },
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
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'timedMarkerPresent',
          target: 'caster',
          markerId: 'chr_0017_yvonne_voice_cd',
        },
      },
      data_7: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_6' } },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_ult_attack3_2: SkillDefinition = {
  key: 'chr_0017_yvonne_ult_attack3_2',
  element: 'cryo',
  blackboard: {
    atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
  },
  timelineBlockFrames: 16,
  naturalDurationFrames: 151,
  exclusiveFrame: 28,
  offsetRecordFrame: 150,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 24,
        input: 'basicAttack',
        targetSkillId: 'chr_0017_yvonne_ult_attack3_2',
      },
    ],
    allowedNextSkills: [
      { startFrame: 0, endFrame: 24, skillIds: ['chr_0017_yvonne_attack5'] },
      { startFrame: 0, endFrame: 28, skillIds: ['chr_0017_yvonne_ult_attack_end'] },
      {
        startFrame: 16,
        endFrame: 24,
        skillIds: ['chr_0017_yvonne_ult_attack3_2', 'chr_0017_yvonne_ult_attack_end'],
      },
      { startFrame: 16, endFrame: 24, skillIds: ['chr_0017_yvonne_ult_attack_end'] },
    ],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 1, endFrame: 3, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 3, endFrame: 5, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 5, endFrame: 7, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 7, endFrame: 9, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 9, endFrame: 11, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 11, endFrame: 13, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 13, endFrame: 15, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 15, endFrame: 17, sequence: { $sequence: 'applyBuff_1' } },
    { startFrame: 1, endFrame: 1, sequence: { $sequence: 'launchProjectile_9' } },
    { startFrame: 3, endFrame: 3, sequence: { $sequence: 'launchProjectile_10' } },
    { startFrame: 5, endFrame: 5, sequence: { $sequence: 'launchProjectile_9' } },
    { startFrame: 7, endFrame: 7, sequence: { $sequence: 'launchProjectile_10' } },
    { startFrame: 9, endFrame: 9, sequence: { $sequence: 'launchProjectile_9' } },
    { startFrame: 11, endFrame: 11, sequence: { $sequence: 'launchProjectile_10' } },
    { startFrame: 13, endFrame: 13, sequence: { $sequence: 'launchProjectile_9' } },
    { startFrame: 15, endFrame: 15, sequence: { $sequence: 'launchProjectile_10' } },
    { startFrame: 1, endFrame: 3, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 3, endFrame: 5, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 5, endFrame: 7, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 7, endFrame: 9, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 9, endFrame: 11, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 11, endFrame: 13, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 13, endFrame: 15, sequence: { $sequence: 'ifElse_20' } },
    { startFrame: 15, endFrame: 17, sequence: { $sequence: 'ifElse_48' } },
    { startFrame: 0, endFrame: 37, sequence: { $sequence: 'ifElse_52' } },
    { startFrame: 37, endFrame: 40, sequence: { $sequence: 'finishBuffsById_53' } },
    { startFrame: 0, endFrame: 24, sequence: { $sequence: 'reachSkillOperableBoundary_54' } },
    { startFrame: 0, endFrame: 28, sequence: { $sequence: 'reachSkillOperableBoundary_55' } },
    { startFrame: 16, endFrame: 24, sequence: { $sequence: 'reachSkillOperableBoundary_56' } },
    { startFrame: 0, endFrame: 18, sequence: { $sequence: 'ifElse_69' } },
  ],
  timelineContinuationSkillId: 'chr_0017_yvonne_ult_attack_end',
  skillType: 'basicAttack',
  levelSource: 'ultimate',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_ult_attack3_2ActionGraph,
};

export const yvonneChr_0017_yvonne_ult_attack_endActionGraph = {
  main: {
    nodes: {
      finishBuffsByTag_6: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
            reason: 'early',
          },
        },
        next: null,
      },
      dealDamage_7: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['normalAttack'],
            instantAttributeModifiers: [
              {
                targetSide: 'attacker',
                attribute: 'criticalRate',
                slot: 'baseAddition',
                value: { kind: 'valueNode', nodeId: 'data_2' },
                attributeTiming: 'runtime',
              },
              {
                targetSide: 'attacker',
                attribute: 'criticalDamageIncrease',
                slot: 'baseAddition',
                value: { kind: 'valueNode', nodeId: 'data_3' },
                attributeTiming: 'runtime',
              },
              {
                targetSide: 'attacker',
                attribute: 'Atk',
                slot: 'baseMultiplier',
                value: { kind: 'valueNode', nodeId: 'data_4' },
                attributeTiming: 'runtime',
              },
              {
                targetSide: 'attacker',
                attribute: 'criticalDamageIncrease',
                slot: 'baseAddition',
                value: { kind: 'valueNode', nodeId: 'data_5' },
                attributeTiming: 'runtime',
              },
            ],
          },
        },
        next: 'finishBuffsByTag_6',
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'dealDamage_7' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      forEachContextTarget_12: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_8' },
        },
        next: null,
      },
      dealDamage_13: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_7' },
            tags: ['normalAttack', 'normalAttackLastCombo'],
            features: ['canBreakWeakness'],
            instantAttributeModifiers: [
              {
                targetSide: 'attacker',
                attribute: 'criticalRate',
                slot: 'baseAddition',
                value: { kind: 'valueNode', nodeId: 'data_8' },
                attributeTiming: 'runtime',
              },
              {
                targetSide: 'attacker',
                attribute: 'criticalDamageIncrease',
                slot: 'baseAddition',
                value: { kind: 'valueNode', nodeId: 'data_9' },
                attributeTiming: 'runtime',
              },
              {
                targetSide: 'attacker',
                attribute: 'Atk',
                slot: 'baseMultiplier',
                value: { kind: 'valueNode', nodeId: 'data_10' },
                attributeTiming: 'runtime',
              },
              {
                targetSide: 'attacker',
                attribute: 'criticalDamageIncrease',
                slot: 'baseAddition',
                value: { kind: 'valueNode', nodeId: 'data_11' },
                attributeTiming: 'runtime',
              },
            ],
            stagger: { kind: 'valueNode', nodeId: 'data_12' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'forEachContextTarget_12',
      },
      dealDamage_3: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_13' },
            tags: ['normalAttack'],
          },
        },
        next: 'finishBuffsByTag_6',
      },
      ifElse_4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'dealDamage_3' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      forEachContextTarget_10: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_4' },
        },
        next: null,
      },
      dealDamage_11: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_14' },
            tags: ['normalAttack', 'normalAttackLastCombo'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_15' },
            staggerOnlyWhenCasterControlled: true,
          },
        },
        next: 'forEachContextTarget_10',
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
        },
        next: null,
      },
      ifElse_14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'dealDamage_11' },
          whenFalse: { $sequence: 'dealDamage_13' },
        },
        next: null,
      },
      finishBuffsById_15: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer_effect'],
            reason: 'other',
          },
        },
        next: null,
      },
      startTimeDilation_16: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.1 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_17' } },
        },
        next: 'startTimeDilation_16',
      },
      applyBuff_18: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      finishBuffsById_19: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: [
              'buff_chr_0017_yvonne_ultimate_skill_end',
              'buff_chr_0017_yvonne_ultimate_skill_layer',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      calculateActionValue_21: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_up_true',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_18' },
            right: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      calculateActionValue_22: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'crit_dmg_up_true',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_19' },
            right: { kind: 'constant', value: 0 },
          },
        },
        next: 'calculateActionValue_21',
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_20' } },
        },
        next: null,
      },
      ifElse_23: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_20' },
          whenTrue: { $sequence: 'calculateActionValue_22' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      readBuffBlackboard_24: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'] },
            desiredKey: 'crit_rate_up_dynamic',
            outputKey: 'crit_rate_up',
          },
        },
        next: 'ifElse_23',
      },
      modifyActionValue_25: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'normal_dmg_up',
            operation: 'multiply',
            value: { kind: 'valueNode', nodeId: 'data_21' },
          },
        },
        next: 'readBuffBlackboard_24',
      },
      readBuffStackCount_26: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'stack',
            query: { kind: 'id', buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'] },
          },
        },
        next: 'modifyActionValue_25',
      },
      readBuffBlackboard_27: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'] },
            desiredKey: 'normal_dmg_up',
            outputKey: 'normal_dmg_up',
          },
        },
        next: 'readBuffStackCount_26',
      },
      applyBuff_28: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end' }],
            target: 'currentAbilityEntity',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      forEachContextTarget_29: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'robots' } },
          body: { $sequence: 'applyBuff_28' },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_30: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'robots',
            abilityEntityIds: [
              'abilityentity_chr_0017_yvonne_ultimate_skill',
              'abilityentity_chr_0017_yvonne_ultimate_skill2',
              'abilityentity_chr_0017_yvonne_ultimate_skill3',
            ],
            maxTargets: 1,
          },
        },
        next: 'forEachContextTarget_29',
      },
      applyBuff_38: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      checkCondition_37: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_22' } },
        },
        next: null,
      },
      ifElse_41: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_37' },
          whenTrue: { $sequence: 'applyBuff_38' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      inheritBuffById_40: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
            inheritToNextSkillIds: [],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      checkCondition_39: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_23' } },
        },
        next: null,
      },
      ifElse_42: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_39' },
          whenTrue: { $sequence: 'inheritBuffById_40' },
          whenFalse: { $sequence: 'ifElse_41' },
        },
        next: null,
      },
      finishBuffsById_43: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_extra' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'normal_dmg_up' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'crit_rate_up' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'atk_up_true' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'crit_dmg_up_true' } },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'normal_dmg_up' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'crit_rate_up' } },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'atk_up_true' } },
      data_11: { type: 'number', expression: { kind: 'blackboard', key: 'crit_dmg_up_true' } },
      data_12: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_extra' } },
      data_14: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_15: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_16: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_end'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_17: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_18: { type: 'number', expression: { kind: 'blackboard', key: 'atk_up' } },
      data_19: { type: 'number', expression: { kind: 'blackboard', key: 'crit_dmg_up' } },
      data_20: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_potential_5_effect'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_21: { type: 'number', expression: { kind: 'blackboard', key: 'stack' } },
      data_22: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 12,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_23: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_ult_attack_end: SkillDefinition = {
  key: 'chr_0017_yvonne_ult_attack_end',
  element: 'cryo',
  blackboard: {
    atk_scale: [1.33, 1.47, 1.6, 1.73, 1.86, 2, 2.13, 2.26, 2.4, 2.56, 2.76, 3],
    atk_scale_extra: [2.67, 2.94, 3.2, 3.47, 3.74, 4, 4.27, 4.54, 4.8, 5.14, 5.54, 6],
    atk_up: 0.3,
    atk_up_true: 0,
    crit_dmg_up: 0.15,
    crit_dmg_up_true: 0,
    crit_rate_up: 0,
    normal_dmg_up: 0,
    poise: 20,
    stack: 0,
  },
  timelineBlockFrames: 61,
  naturalDurationFrames: 161,
  exclusiveFrame: 60,
  offsetRecordFrame: 28,
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 28, endFrame: 60, sequence: { $sequence: 'ifElse_14' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_15' } },
    { startFrame: 29, endFrame: 32, sequence: { $sequence: 'checkCondition_17' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'applyBuff_18' } },
    { startFrame: 28, endFrame: 31, sequence: { $sequence: 'finishBuffsById_19' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'readBuffBlackboard_27' } },
    { startFrame: 7, endFrame: 8, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_30' } },
    { startFrame: 12, endFrame: 13, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_30' } },
    { startFrame: 17, endFrame: 18, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_30' } },
    { startFrame: 0, endFrame: 67, sequence: { $sequence: 'ifElse_42' } },
    { startFrame: 67, endFrame: 70, sequence: { $sequence: 'finishBuffsById_43' } },
  ],
  skillType: 'basicAttack',
  levelSource: 'ultimate',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_ult_attack_endActionGraph,
};

export const yvonneChr_0017_yvonne_power_attackActionGraph = {
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
            hit: { onReach: true, finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0017_yvonne_power_attack_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_2' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      applyBuff_1: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_chr_0017_yvonne_power_attack' }],
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      dealDamage_2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            calculation: 'breakingAttack',
                            calculationMultiplier: 0.1,
                            tags: ['normalAttack', 'powerAttack'],
                          },
                        },
                        next: 'applyBuff_1',
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
      finishBuffsById_2: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'enemy',
            buffIds: ['buff_chr_0017_yvonne_power_attack'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'finishBuffsById_2',
      },
      gainFinisherSp_4: {
        action: { kind: 'gainFinisherSp', parameters: { factor: 1, recipient: 'team' } },
        next: 'checkCondition_3',
      },
      dealDamage_5: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            calculation: 'breakingAttack',
            calculationMultiplier: 0.9,
            tags: ['normalAttack', 'powerAttack'],
          },
        },
        next: 'gainFinisherSp_4',
      },
      startTimeDilation_6: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.7,
                  inTangent: -8.311591,
                  outTangent: -8.311591,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1,
                  value: 0.04752808,
                  inTangent: -0.01381588,
                  outTangent: -0.01381588,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 2.675379,
                  outTangent: 5.233175,
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
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'startTimeDilation_6',
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_7',
      },
      applyBuff_9: {
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
      applyBuff_10: {
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
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'enemy',
          buffIds: ['buff_chr_0017_yvonne_power_attack'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_3: {
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
      data_4: { type: 'boolean', expression: { kind: 'casterControlled' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_power_attack: SkillDefinition = {
  key: 'chr_0017_yvonne_power_attack',
  element: 'cryo',
  blackboard: { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
  timelineBlockFrames: 46,
  naturalDurationFrames: 135,
  exclusiveFrame: 45,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 29,
        endFrame: 47,
        skillIds: ['chr_0017_yvonne_normal_skill', 'chr_0017_yvonne_combo_skill'],
      },
    ],
  },
  costFrame: 4,
  scheduledSequences: [
    { startFrame: 8, endFrame: 11, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 28, endFrame: 30, sequence: { $sequence: 'dealDamage_5' } },
    { startFrame: 29, endFrame: 30, sequence: { $sequence: 'checkCondition_8' } },
    { startFrame: 0, endFrame: 45, sequence: { $sequence: 'applyBuff_9' } },
    { startFrame: 0, endFrame: 29, sequence: { $sequence: 'applyBuff_10' } },
  ],
  skillType: 'finisher',
  levelSource: 'basicAttack',
  nativeSkillType: 'breakingAttack',
  actionGraph: yvonneChr_0017_yvonne_power_attackActionGraph,
};

export const yvonneChr_0017_yvonne_plunging_attack_endActionGraph = {
  main: {
    nodes: {
      changeResource_16: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_1' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            onlyMainOperator: true,
            spGainKind: 'gain',
            spGainSource: 'default',
          },
        },
        next: null,
      },
      ifElse_19: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'changeResource_16' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_20: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            tags: ['normalAttack', 'plungingAttack'],
          },
        },
        next: 'ifElse_19',
      },
      dealDamage_3: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_3' },
            tags: ['normalAttack', 'plungingAttack'],
            stagger: { kind: 'valueNode', nodeId: 'data_4' },
          },
        },
        next: 'ifElse_19',
      },
      applyBuff_4: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_potential_5_cd',
                copiedBlackboardAssignments: { cd: 'cd' },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'dealDamage_3',
      },
      modifyActionValue_5: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'valueNode', nodeId: 'data_5' },
          },
        },
        next: 'applyBuff_4',
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'modifyActionValue_5' },
          whenFalse: { $sequence: null },
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
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'ifElse_8' },
          whenFalse: { $sequence: 'dealDamage_20' },
        },
        next: null,
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      ifElse_18: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: 'ifElse_13' },
          whenFalse: { $sequence: 'dealDamage_20' },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      ifElse_21: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'ifElse_18' },
          whenFalse: { $sequence: 'dealDamage_20' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_scale' } },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_potential_5_cd'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'prob' } },
      data_8: {
        type: 'boolean',
        expression: { kind: 'probability', probability: { kind: 'valueNode', nodeId: 'data_7' } },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_potential_5'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_plunging_attack_end: SkillDefinition = {
  key: 'chr_0017_yvonne_plunging_attack_end',
  element: 'cryo',
  blackboard: {
    atb: 0,
    atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    cd: 15,
    dmg_scale: 2.5,
    poise: 5,
    prob: 0.5,
  },
  timelineBlockFrames: 2,
  naturalDurationFrames: 130,
  exclusiveFrame: 20,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 2,
        endFrame: 20,
        skillIds: [
          'chr_0017_yvonne_ult_attack3_1',
          'chr_0017_yvonne_ult_attack3_2',
          'chr_0017_yvonne_ult_attack_end',
          'chr_0017_yvonne_ult_attack2_1',
          'chr_0017_yvonne_ult_attack2_2',
          'chr_0017_yvonne_attack5',
          'chr_0017_yvonne_attack4',
          'chr_0017_yvonne_attack3',
          'chr_0017_yvonne_attack2',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [{ startFrame: 1, endFrame: 6, sequence: { $sequence: 'ifElse_21' } }],
  skillType: 'plungingAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: yvonneChr_0017_yvonne_plunging_attack_endActionGraph,
};

export const yvonneChr_0017_yvonne_normal_skillActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_normal_skill_projectile',
                copiedBlackboardAssignments: {
                  atk_scale: 'atk_scale',
                  poise: 'poise',
                  consume_cnt: 'consume_cnt',
                  gained_atb: 'gained_atb',
                  has_potential2: 'has_potential2',
                  atb_return: 'atb_return',
                  count: 'count',
                  atk_scale_layer: 'atk_scale_layer',
                  usp_base: 'usp_base',
                  usp_layer: 'usp_layer',
                  atk_scale2: 'atk_scale2',
                },
              },
            ],
            target: 'caster',
            source: 'enemy',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      ifElse_2: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'applyBuff_1' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_normal_skill_listener',
                copiedBlackboardAssignments: { crit_up: 'crit_up', atk_scale2: 'atk_scale2' },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_7: {
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
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: null },
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
      ifElse_11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_8' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_9' },
        },
        next: null,
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'ifElse_11' },
          whenFalse: { $sequence: 'ifElse_11' },
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
      ifElse_15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_13' },
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
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_normal_skill: SkillDefinition = {
  key: 'chr_0017_yvonne_normal_skill',
  element: 'cryo',
  blackboard: {
    atb_return: 10,
    atk_scale: [1.11, 1.22, 1.33, 1.44, 1.55, 1.67, 1.78, 1.89, 2, 2.14, 2.3, 2.5],
    atk_scale_layer: [0.89, 0.98, 1.07, 1.16, 1.24, 1.33, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
    atk_scale2: [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    consume_cnt: 0,
    count: 0,
    crit_up: 0,
    gained_atb: 0,
    has_potential2: 0,
    poise: 10,
    usp_base: 10,
    usp_layer: 30,
  },
  timelineBlockFrames: 35,
  naturalDurationFrames: 150,
  exclusiveFrame: 34,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 34, endFrame: 56, skillIds: ['chr_0017_yvonne_normal_skill'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 5, endFrame: 17, sequence: { $sequence: 'ifElse_2' } },
    { startFrame: 0, endFrame: 2, sequence: { $sequence: 'applyBuff_3' } },
    { startFrame: 0, endFrame: 26, sequence: { $sequence: 'ifElse_15' } },
    { startFrame: 0, endFrame: 16, sequence: { $sequence: 'ifElse_opt1' } },
  ],
  smartTarget: 'enemy',
  costs: [{ resource: 'sp', value: 100 }],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: yvonneChr_0017_yvonne_normal_skillActionGraph,
};

export const yvonneChr_0017_yvonne_ultimate_skillActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: [
              'buff_chr_0017_yvonne_ultimate_skill',
              'buff_chr_0017_yvonne_ultimate_skill_end',
            ],
            reason: 'other',
          },
        },
        next: null,
      },
      startTimeDilation_2: {
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
      finishBuffsById_3: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_dash_attack'],
            reason: 'other',
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
                buffId: 'buff_chr_0017_yvonne_ultimate_skill',
                copiedBlackboardAssignments: {
                  duration: 'duration',
                  has_potential4: 'has_potential4',
                  ex_usp_up: 'ex_usp_up',
                  has_potential5: 'has_potential5',
                  atk_up: 'atk_up',
                  crit_dmg_up: 'crit_dmg_up',
                },
              },
            ],
            target: 'caster',
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
      ifElse_7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'applyBuff_6' },
          whenFalse: { $sequence: 'applyBuff_6' },
        },
        next: null,
      },
      spawnAbilityEntity_8: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill3',
            childSkillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
        next: null,
      },
      spawnAbilityEntity_9: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill2',
            childSkillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
        next: 'spawnAbilityEntity_8',
      },
      spawnAbilityEntity_10: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill',
            childSkillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
        next: 'spawnAbilityEntity_9',
      },
      applyBuff_11: {
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
      hideUi_12: { action: { kind: 'hideUi', parameters: { onlyBlockInput: false } }, next: null },
      startUltimateTimeDilation_13: {
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
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0017_yvonne_potential_4'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_ultimate_skill: SkillDefinition = {
  key: 'chr_0017_yvonne_ultimate_skill',
  element: 'cryo',
  blackboard: {
    atk_scale1: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
    atk_scale2: [1.33, 1.47, 1.6, 1.73, 1.86, 2, 2.13, 2.26, 2.4, 2.56, 2.76, 3],
    atk_up: 0.3,
    crit_dmg_up: 0.15,
    duration: 7,
    ex_usp_up: 0.3,
    has_potential4: 0,
    has_potential5: 0,
    poise: 20,
  },
  timelineBlockFrames: 65,
  naturalDurationFrames: 126,
  exclusiveFrame: 64,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 16, sequence: { $sequence: 'finishBuffsById_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'startTimeDilation_2' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_3' } },
    { startFrame: 61, endFrame: 80, sequence: { $sequence: 'ifElse_7' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'spawnAbilityEntity_10' } },
    { startFrame: 0, endFrame: 64, sequence: { $sequence: 'applyBuff_11' } },
    { startFrame: 0, endFrame: 61, sequence: { $sequence: 'hideUi_12' } },
    { startFrame: 0, endFrame: 61, sequence: { $sequence: 'startUltimateTimeDilation_13' } },
  ],
  cooldownFrames: 300,
  costs: [{ resource: 'ultimateEnergy', value: 220 }],
  enhancementStateBuffId: 'buff_chr_0017_yvonne_ultimate_skill',
  skillType: 'ultimate',
  levelSource: 'ultimate',
  nativeSkillType: 'ultimateSkill',
  actionGraph: yvonneChr_0017_yvonne_ultimate_skillActionGraph,
};

export const yvonneChr_0017_yvonne_combo_skillActionGraph = {
  main: {
    nodes: {
      findCharacterTeamTargets_1: {
        action: {
          kind: 'findCharacterTeamTargets',
          parameters: { saveToContextKey: 'mainchar', selection: { kind: 'controlledOperator' } },
        },
        next: null,
      },
      spawnAbilityEntity_opt1: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'cent' },
            abilityEntityId: 'abilityentity_chr_0017_yvonne_combo_skill',
            childSkillId: 'chr_0017_yvonne_combo_skill_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
        next: null,
      },
      ifElse_opt2: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'spawnAbilityEntity_opt1' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      startTimeDilation_9: {
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
      modifyActionValue_11: {
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
      findCharacterTeamTargets_12: {
        action: {
          kind: 'findCharacterTeamTargets',
          parameters: { saveToContextKey: 'mainchar', selection: { kind: 'controlledOperator' } },
        },
        next: 'modifyActionValue_11',
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'findCharacterTeamTargets_12' },
        },
        next: null,
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
    dataNodes: { data_1: { type: 'boolean', expression: { kind: 'casterControlled' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneChr_0017_yvonne_combo_skill: SkillDefinition = {
  key: 'chr_0017_yvonne_combo_skill',
  element: 'cryo',
  blackboard: {
    atk_scale_boom: [0.89, 0.98, 1.07, 1.16, 1.25, 1.34, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
    atk_scale_tick: [0.45, 0.49, 0.54, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.93, 1],
    duration: 3,
    has_potential1: 0,
    interval: 0.75,
    maxcnt: 4,
    owner_mainchar_distance: 0,
    poise: 10,
    radius: 4,
    usp: 10,
    usp_extra: 10,
  },
  timelineBlockFrames: 25,
  naturalDurationFrames: 130,
  exclusiveFrame: 24,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 19, endFrame: 56, skillIds: ['chr_0017_yvonne_normal_skill'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'findCharacterTeamTargets_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_opt2' } },
    { startFrame: 0, endFrame: 15, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 0, endFrame: 17, sequence: { $sequence: 'startTimeDilation_9' } },
    { startFrame: 0, endFrame: 18, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 0, endFrame: 5, sequence: { $sequence: 'startTimeDilation_14' } },
  ],
  smartTarget: 'trigger',
  cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 570, 570, 570, 540],
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'comboSkill',
  actionGraph: yvonneChr_0017_yvonne_combo_skillActionGraph,
};

export const yvonneCommon_character_perfect_dodgeActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const yvonneCommon_character_perfect_dodge: SkillDefinition = {
  actionGraph: yvonneCommon_character_perfect_dodgeActionGraph,
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

const yvonnePassive1ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_talent_1',
                blackboardAssignments: { dmg_up: { kind: 'valueNode', nodeId: 'data_1' } },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'dmg_up' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonnePassive1: OperatorPassiveSkillDefinition = {
  key: 'chr_0017_yvonne_talent_1',
  blackboard: { dmg_up: [0, 0.5] },
  enableSequence: { $sequence: 'applyBuff_1' },
  actionGraph: yvonnePassive1ActionGraph,
};

const yvonnePassive2ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_talent_0',
                blackboardAssignments: {
                  inflict_up: { kind: 'valueNode', nodeId: 'data_1' },
                  status_up: { kind: 'valueNode', nodeId: 'data_2' },
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
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'inflict_up' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'status_up' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonnePassive2: OperatorPassiveSkillDefinition = {
  key: 'chr_0017_yvonne_talent_0',
  blackboard: { inflict_up: [0.1, 0.2], status_up: [0.2, 0.4] },
  enableSequence: { $sequence: 'applyBuff_1' },
  actionGraph: yvonnePassive2ActionGraph,
};

const yvonneComboCondition1ActionGraph = {
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
          kind: 'contextTargetObjectTypeMatch',
          contextKey: 'trigger',
          objectTypes: ['enemy'],
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetEntityTagMatch',
          contextKey: 'trigger',
          tagQueryType: 'hasAny',
          tags: ['Skill/Character/Common/SpellStatus/Frozen'],
        },
      },
      data_3: { type: 'boolean', expression: { kind: 'eventSourceControlled' } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageTagsMatch',
          match: 'hasAll',
          tags: ['normalAttackLastCombo'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneComboCondition1: ComboSkillConditionDefinition = {
  key: 'native-combo:0',
  skillKey: 'chr_0017_yvonne_combo_skill',
  event: 'beforeTakeDamage',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'checkCondition_4' },
  actionGraph: yvonneComboCondition1ActionGraph,
};

const yvonneBuff1ActionGraph = {
  main: {
    nodes: {
      dealDamage_3: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
            tags: ['comboSkill'],
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
          whenTrue: { $sequence: 'dealDamage_3' },
          whenFalse: { $sequence: 'dealDamage_3' },
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
          whenTrue: { $sequence: 'dealDamage_3' },
          whenFalse: { $sequence: 'ifElse_6' },
        },
        next: null,
      },
      changeResource_10: {
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
      modifyActionValue_11: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'has_added_usp',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'changeResource_10',
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'checkCondition_8',
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'modifyActionValue_11' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      forEachContextTarget_13: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_7' },
        },
        next: 'ifElse_12',
      },
      modifyActionValue_14: {
        action: {
          kind: 'modifyActionValue',
          parameters: { key: 'count', operation: 'add', value: { kind: 'constant', value: 1 } },
        },
        next: null,
      },
      withActionBlackboardScope_16: {
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
          body: { $sequence: 'modifyActionValue_14' },
        },
        next: null,
      },
      withActionBlackboardScope_17: {
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
          body: { $sequence: 'forEachContextTarget_13' },
        },
        next: 'withActionBlackboardScope_16',
      },
      applyBuff_15: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_combo_skill_finish',
                copiedBlackboardAssignments: {
                  atk_scale_boom: 'atk_scale_boom',
                  radius: 'radius',
                  has_potential1: 'has_potential1',
                  poise: 'poise',
                  had_added_usp: 'has_added_usp',
                  usp: 'usp',
                },
              },
            ],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_tick' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'enemy',
          buffIds: ['buff_common_energy_shard_attached_cryst'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'enemy',
          tagQueryType: 'hasAny',
          tags: ['Skill/Character/Common/SpellStatus/Frozen'],
        },
      },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
      data_5: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'has_added_usp', fallback: 0 },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_5' },
          operator: 'less',
          right: { kind: 'constant', value: 1 },
        },
      },
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
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff1: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 0,
  durationSeconds: { blackboardKey: 'duration' },
  triggerIntervalSeconds: { blackboardKey: 'interval' },
  waitFirstTriggerInterval: false,
  maxTriggerCount: { blackboardKey: 'maxcnt' },
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_multiplier: 1.5,
    atk_scale_boom: 0,
    atk_scale_tick: 0,
    count: 2,
    duration: 0,
    has_added_usp: 0,
    has_potential1: 0,
    interval: 0.75,
    maxcnt: 4,
    poise: 0,
    radius: 0,
    usp: 10,
  },
  attributeModifiers: [],
  lifecycleSequences: {
    trigger: { $sequence: 'withActionBlackboardScope_17' },
    finish: { $sequence: 'applyBuff_15' },
  },
  actionGraph: yvonneBuff1ActionGraph,
};

const yvonneBuff2ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      invertNextResult_2: {
        action: { kind: 'invertNextResult', parameters: {} },
        next: 'checkCondition_1',
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'invertNextResult_2',
      },
      changeResource_4: {
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
      ifElse_5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_3' },
          whenTrue: { $sequence: 'changeResource_4' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_6: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'cryo',
            attackScale: { kind: 'valueNode', nodeId: 'data_5' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_6' },
          },
        },
        next: 'ifElse_5',
      },
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_cryst_cryst_frozen_triggered',
                blackboardAssignments: {
                  count: { kind: 'constant', value: 1 },
                  extra_duration: { kind: 'constant', value: 2 },
                },
              },
            ],
            target: 'enemy',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'dealDamage_6',
      },
      finishOwner_8: {
        action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'had_added_usp', fallback: 0 },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
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
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_boom' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff2: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 0,
  durationSeconds: 0.72,
  triggerIntervalSeconds: 0.5,
  waitFirstTriggerInterval: true,
  maxTriggerCount: 999,
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale_boom: 0,
    atk_scale_tick: 0,
    count: 0,
    duration: 0,
    had_added_usp: 0,
    has_potential1: 0,
    poise: 0,
    radius: 0,
    usp: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: {
    trigger: { $sequence: 'applyBuff_7' },
    finish: { $sequence: 'finishOwner_8' },
  },
  actionGraph: yvonneBuff2ActionGraph,
};

const yvonneBuff3ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff3: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 1,
  triggerIntervalSeconds: 0.5,
  waitFirstTriggerInterval: true,
  maxTriggerCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale2: 1, crit_up: 0.7 },
  attributeModifiers: [],
  actionGraph: yvonneBuff3ActionGraph,
};

const yvonneBuff4ActionGraph = {
  main: {
    nodes: {
      skillAffix_1: { action: { kind: 'skillAffix', parameters: {} }, next: null },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_normal_skill_frozen',
                copiedBlackboardAssignments: { crit_up: 'crit_up', atk_scale2: 'atk_scale2' },
              },
            ],
            target: 'eventTarget',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'applyBuff_2',
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'checkCondition_3',
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'eventSkillCastMatchesBuffSource' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff4: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  triggerIntervalSeconds: 0,
  waitFirstTriggerInterval: false,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale2: 0, crit_up: 0 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'skillAffix_1' } },
  abilityEventResponses: [
    { event: 'beforeOutputBuff', priority: 0, sequence: { $sequence: 'checkCondition_4' } },
  ],
  actionGraph: yvonneBuff4ActionGraph,
};

const yvonneBuff5ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_2: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      launchProjectile_3: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 5,
            source: 'actionOwner',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0017_yvonne_normal_skill_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb_return: 10,
                  atk_scale: 0,
                  atk_scale_final: 0,
                  atk_scale_layer: 0,
                  atk_scale2: 2,
                  count: 0,
                  crit_up: 0.7,
                  has_potential2: 0,
                  max_count: 0,
                  poise: 30,
                  usp_base: 20,
                  usp_final: 0,
                  usp_layer: 10,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_opt1' } },
                  { startFrame: 0, endFrame: 60, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 60, sequence: { $sequence: null } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      modifyActionValue_51: {
                        action: {
                          kind: 'modifyActionValue',
                          parameters: {
                            key: 'max_count',
                            operation: 'assign',
                            value: { kind: 'valueNode', nodeId: 'data_1' },
                          },
                        },
                        next: null,
                      },
                      checkCondition_52: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                        },
                        next: 'modifyActionValue_51',
                      },
                      dealDamage_53: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'cryo',
                            attackScale: { kind: 'valueNode', nodeId: 'data_5' },
                            tags: ['normalSkill'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'valueNode', nodeId: 'data_6' },
                          },
                        },
                        next: 'checkCondition_52',
                      },
                      modifyActionValue_54: {
                        action: {
                          kind: 'modifyActionValue',
                          parameters: {
                            key: 'atk_scale_final',
                            operation: 'assign',
                            value: { kind: 'valueNode', nodeId: 'data_7' },
                          },
                        },
                        next: 'dealDamage_53',
                      },
                      modifyActionValue_44: {
                        action: {
                          kind: 'modifyActionValue',
                          parameters: {
                            key: 'atk_scale_final',
                            operation: 'add',
                            value: { kind: 'valueNode', nodeId: 'data_8' },
                          },
                        },
                        next: 'dealDamage_53',
                      },
                      modifyActionValue_45: {
                        action: {
                          kind: 'modifyActionValue',
                          parameters: {
                            key: 'atk_scale_final',
                            operation: 'add',
                            value: { kind: 'valueNode', nodeId: 'data_9' },
                          },
                        },
                        next: 'modifyActionValue_44',
                      },
                      calculateActionValue_46: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale_final',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_10' },
                            right: { kind: 'valueNode', nodeId: 'data_11' },
                          },
                        },
                        next: 'modifyActionValue_45',
                      },
                      forceSpellStatus_47: {
                        action: {
                          kind: 'forceSpellStatus',
                          parameters: {
                            target: 'enemy',
                            element: 'cryo',
                            consumedElement: 'nature',
                            consumedLayers: { kind: 'valueNode', nodeId: 'data_12' },
                            count: { kind: 'valueNode', nodeId: 'data_13' },
                            isExtra: false,
                          },
                        },
                        next: 'calculateActionValue_46',
                      },
                      readBuffStackCount_48: {
                        action: {
                          kind: 'readBuffStackCount',
                          parameters: {
                            target: 'enemy',
                            outputKey: 'count',
                            query: {
                              kind: 'tag',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                            },
                          },
                        },
                        next: 'forceSpellStatus_47',
                      },
                      forceSpellStatus_39: {
                        action: {
                          kind: 'forceSpellStatus',
                          parameters: {
                            target: 'enemy',
                            element: 'cryo',
                            consumedElement: 'cryo',
                            consumedLayers: { kind: 'valueNode', nodeId: 'data_14' },
                            count: { kind: 'valueNode', nodeId: 'data_15' },
                            isExtra: false,
                          },
                        },
                        next: 'calculateActionValue_46',
                      },
                      readBuffStackCount_40: {
                        action: {
                          kind: 'readBuffStackCount',
                          parameters: {
                            target: 'enemy',
                            outputKey: 'count',
                            query: {
                              kind: 'tag',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                            },
                          },
                        },
                        next: 'forceSpellStatus_39',
                      },
                      checkCondition_32: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
                        },
                        next: null,
                      },
                      ifElse_50: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_32' },
                          whenTrue: { $sequence: 'readBuffStackCount_40' },
                          whenFalse: { $sequence: 'readBuffStackCount_48' },
                        },
                        next: null,
                      },
                      checkCondition_49: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_17' } },
                        },
                        next: null,
                      },
                      ifElse_55: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_49' },
                          whenTrue: { $sequence: 'ifElse_50' },
                          whenFalse: { $sequence: 'modifyActionValue_54' },
                        },
                        next: null,
                      },
                      changeResource_57: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'valueNode', nodeId: 'data_18' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                          },
                        },
                        next: null,
                      },
                      modifyActionValue_58: {
                        action: {
                          kind: 'modifyActionValue',
                          parameters: {
                            key: 'usp_final',
                            operation: 'add',
                            value: { kind: 'valueNode', nodeId: 'data_19' },
                          },
                        },
                        next: 'changeResource_57',
                      },
                      calculateActionValue_59: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'usp_final',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_20' },
                            right: { kind: 'valueNode', nodeId: 'data_21' },
                          },
                        },
                        next: 'modifyActionValue_58',
                      },
                      checkCondition_56: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_23' } },
                        },
                        next: null,
                      },
                      ifElse_65: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_56' },
                          whenTrue: { $sequence: 'calculateActionValue_59' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      gainSquadUltimateEnergyFromSkillCost_66: {
                        action: {
                          kind: 'gainSquadUltimateEnergyFromSkillCost',
                          parameters: { coefficient: 1 },
                        },
                        next: 'ifElse_65',
                      },
                      forEachContextTarget_67: {
                        action: {
                          kind: 'forEachContextTarget',
                          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                          body: { $sequence: 'ifElse_55' },
                        },
                        next: 'gainSquadUltimateEnergyFromSkillCost_66',
                      },
                      changeResource_25: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'sp',
                            amount: { kind: 'valueNode', nodeId: 'data_24' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                            spGainKind: 'refund',
                            spGainSource: 'skill',
                          },
                        },
                        next: 'dealDamage_53',
                      },
                      modifyActionValue_26: {
                        action: {
                          kind: 'modifyActionValue',
                          parameters: {
                            key: 'atk_scale_final',
                            operation: 'assign',
                            value: { kind: 'valueNode', nodeId: 'data_25' },
                          },
                        },
                        next: 'changeResource_25',
                      },
                      modifyActionValue_15: {
                        action: {
                          kind: 'modifyActionValue',
                          parameters: {
                            key: 'atk_scale_final',
                            operation: 'add',
                            value: { kind: 'valueNode', nodeId: 'data_26' },
                          },
                        },
                        next: 'changeResource_25',
                      },
                      modifyActionValue_16: {
                        action: {
                          kind: 'modifyActionValue',
                          parameters: {
                            key: 'atk_scale_final',
                            operation: 'add',
                            value: { kind: 'valueNode', nodeId: 'data_27' },
                          },
                        },
                        next: 'modifyActionValue_15',
                      },
                      calculateActionValue_17: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale_final',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_28' },
                            right: { kind: 'valueNode', nodeId: 'data_29' },
                          },
                        },
                        next: 'modifyActionValue_16',
                      },
                      forceSpellStatus_18: {
                        action: {
                          kind: 'forceSpellStatus',
                          parameters: {
                            target: 'enemy',
                            element: 'cryo',
                            consumedElement: 'nature',
                            consumedLayers: { kind: 'valueNode', nodeId: 'data_30' },
                            count: { kind: 'valueNode', nodeId: 'data_31' },
                            isExtra: false,
                          },
                        },
                        next: 'calculateActionValue_17',
                      },
                      readBuffStackCount_19: {
                        action: {
                          kind: 'readBuffStackCount',
                          parameters: {
                            target: 'enemy',
                            outputKey: 'count',
                            query: {
                              kind: 'tag',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                            },
                          },
                        },
                        next: 'forceSpellStatus_18',
                      },
                      forceSpellStatus_9: {
                        action: {
                          kind: 'forceSpellStatus',
                          parameters: {
                            target: 'enemy',
                            element: 'cryo',
                            consumedElement: 'cryo',
                            consumedLayers: { kind: 'valueNode', nodeId: 'data_32' },
                            count: { kind: 'valueNode', nodeId: 'data_33' },
                            isExtra: false,
                          },
                        },
                        next: 'calculateActionValue_17',
                      },
                      readBuffStackCount_10: {
                        action: {
                          kind: 'readBuffStackCount',
                          parameters: {
                            target: 'enemy',
                            outputKey: 'count',
                            query: {
                              kind: 'tag',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                            },
                          },
                        },
                        next: 'forceSpellStatus_9',
                      },
                      ifElse_21: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_32' },
                          whenTrue: { $sequence: 'readBuffStackCount_10' },
                          whenFalse: { $sequence: 'readBuffStackCount_19' },
                        },
                        next: null,
                      },
                      ifElse_27: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_49' },
                          whenTrue: { $sequence: 'ifElse_21' },
                          whenFalse: { $sequence: 'modifyActionValue_26' },
                        },
                        next: null,
                      },
                      forEachContextTarget_64: {
                        action: {
                          kind: 'forEachContextTarget',
                          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                          body: { $sequence: 'ifElse_27' },
                        },
                        next: 'gainSquadUltimateEnergyFromSkillCost_66',
                      },
                      checkCondition_60: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_34' } },
                        },
                        next: null,
                      },
                      checkCondition_61: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_36' } },
                        },
                        next: 'checkCondition_60',
                      },
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_61' },
                          whenTrue: { $sequence: 'forEachContextTarget_64' },
                          whenFalse: { $sequence: 'forEachContextTarget_67' },
                        },
                        next: null,
                      },
                    },
                    dataNodes: {
                      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'count', fallback: 0 },
                      },
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'max_count', fallback: 0 },
                      },
                      data_4: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_2' },
                          operator: 'greater',
                          right: { kind: 'valueNode', nodeId: 'data_3' },
                        },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_final' },
                      },
                      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
                      data_7: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale' },
                      },
                      data_8: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale2' },
                      },
                      data_9: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale' },
                      },
                      data_10: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_layer' },
                      },
                      data_11: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_12: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_14: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_15: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_16: {
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
                      data_17: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTags: [
                            'Skill/Character/Common/SpellInflict/CrystInflict',
                            'Skill/Character/Common/SpellInflict/NaturalInflict',
                          ],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_18: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'usp_final' },
                      },
                      data_19: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'usp_base' },
                      },
                      data_20: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'usp_layer' },
                      },
                      data_21: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'max_count' },
                      },
                      data_22: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'max_count', fallback: 0 },
                      },
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
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atb_return' },
                      },
                      data_25: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale' },
                      },
                      data_26: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale2' },
                      },
                      data_27: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale' },
                      },
                      data_28: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_layer' },
                      },
                      data_29: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_30: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_31: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_32: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_33: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
                      data_34: {
                        type: 'boolean',
                        expression: {
                          kind: 'entityCountCompare',
                          target: { kind: 'fixed', target: 'enemy' },
                          containsHittableTarget: false,
                          excludeDeadEntity: false,
                          operator: 'equal',
                          value: 1,
                        },
                      },
                      data_35: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'has_potential2', fallback: 0 },
                      },
                      data_36: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_35' },
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
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'launchProjectile_3',
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'buffSourceMatchesOwner' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'buffOwner',
          tagQueryType: 'exceptAny',
          tags: [
            'Status/Immobilized',
            'Status/InCommonInteraction',
            'GameplayState/Interacting/BambooRaft/OnBoat',
            'Status/Ability/Skill/CantCastAnySkill',
            'GameplayState/Interacting/Bomb/Create',
            'Status/InCommonInteractionCanMove',
            'Status/Silence',
            'Status/DisableNormalSkill',
          ],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff5: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    atb_return: 0,
    atk_scale: 0,
    atk_scale_layer: 0,
    atk_scale2: 0,
    consume_cnt: 0,
    count: 0,
    gained_atb: 0,
    has_potential2: 0,
    poise: 0,
    usp_base: 0,
    usp_layer: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'ifElse_2' },
    finish: { $sequence: 'checkCondition_4' },
  },
  actionGraph: yvonneBuff5ActionGraph,
};

const yvonneBuff6ActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0017_yvonne_potential_5_effect'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_potential_5_effect' }],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff6: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'cd' },
  applyTags: [],
  extendTags: [],
  blackboard: { cd: 0 },
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'finishBuffsById_1' },
    finish: { $sequence: 'applyBuff_2' },
  },
  actionGraph: yvonneBuff6ActionGraph,
};

const yvonneBuff7ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff7: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: yvonneBuff7ActionGraph,
};

const yvonneBuff8ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff8: SkillBuffDefinition = {
  stackingType: 'highPriority',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_up: 0, crit_dmg_up: 0 },
  attributeModifiers: [
    { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
    {
      attribute: 'criticalDamageIncrease',
      slot: 'baseAddition',
      value: { blackboardKey: 'crit_dmg_up' },
    },
  ],
  actionGraph: yvonneBuff8ActionGraph,
};

const yvonneBuff9ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff9: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: yvonneBuff9ActionGraph,
};

const yvonneBuff10ActionGraph = {
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
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_3',
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'actionInputTarget',
          tagQueryType: 'exceptAny',
          tags: ['Skill/Character/Common/SpellStatus/Frozen'],
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'actionInputTarget',
          tagQueryType: 'hasAny',
          tags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'actionInputTarget',
          tagQueryType: 'exceptAny',
          tags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'actionInputTarget',
          tagQueryType: 'hasAny',
          tags: ['Skill/Character/Common/SpellStatus/Frozen'],
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'actionInputTarget',
          tagQueryType: 'hasAll',
          tags: [
            'Skill/Character/Common/SpellInflict/CrystInflict',
            'Skill/Character/Common/SpellStatus/Frozen',
          ],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff10: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { inflict_up: 0, status_up: 0 },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'attacker',
      condition: { $sequence: 'checkCondition_2' },
      processors: [
        {
          kind: 'instantAttribute',
          targetSide: 'attacker',
          attribute: 'criticalDamageIncrease',
          values: { slot: 'baseAddition', value: { blackboardKey: 'inflict_up' } },
          attributeTiming: 'runtime',
        },
      ],
    },
    {
      enabledSide: 'attacker',
      condition: { $sequence: 'checkCondition_4' },
      processors: [
        {
          kind: 'instantAttribute',
          targetSide: 'attacker',
          attribute: 'criticalDamageIncrease',
          values: { slot: 'baseAddition', value: { blackboardKey: 'status_up' } },
          attributeTiming: 'runtime',
        },
      ],
    },
    {
      enabledSide: 'attacker',
      condition: { $sequence: 'checkCondition_5' },
      processors: [
        {
          kind: 'instantAttribute',
          targetSide: 'attacker',
          attribute: 'criticalDamageIncrease',
          values: { slot: 'baseAddition', value: { blackboardKey: 'status_up' } },
          attributeTiming: 'runtime',
        },
      ],
    },
  ],
  actionGraph: yvonneBuff10ActionGraph,
};

const yvonneBuff11ActionGraph = {
  main: {
    nodes: {
      createTimedMarker_1: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            target: 'buffOwner',
            markerId: 'chr_0017_yvonne_talent_1',
            durationSeconds: { kind: 'constant', value: 0.1 },
            autoFinishByAction: false,
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
                buffId: 'buff_chr_0017_yvonne_talent_1_valid',
                copiedBlackboardAssignments: { dmg_up: 'dmg_up' },
              },
            ],
            target: 'buffSource',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'createTimedMarker_1',
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_2',
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'checkCondition_3',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'timedMarkerPresent',
          target: 'buffOwner',
          markerId: 'chr_0017_yvonne_talent_1',
        },
      },
      data_2: {
        type: 'boolean',
        expression: { kind: 'not', condition: { kind: 'conditionNode', nodeId: 'data_1' } },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0017_yvonne_normal_skill_frozen'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff11: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { dmg_up: 0.5 },
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'outputBuff', priority: 0, sequence: { $sequence: 'checkCondition_4' } },
  ],
  actionGraph: yvonneBuff11ActionGraph,
};

const yvonneBuff12ActionGraph = {
  main: {
    nodes: {
      overrideBasicAttackMapping_1: {
        action: {
          kind: 'overrideBasicAttackMapping',
          parameters: { skillIds: ['chr_0017_yvonne_attack5'] },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_talent_1_valid_up',
                copiedBlackboardAssignments: { dmg_up: 'dmg_up' },
              },
            ],
            target: 'eventTarget',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            lifetimeOwner: 'currentCastSkill',
          },
        },
        next: null,
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'applyBuff_2',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: { kind: 'eventSkillIdIn', skillIds: ['chr_0017_yvonne_attack5'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff12: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 4,
  durationSeconds: 15,
  applyTags: [],
  extendTags: [],
  blackboard: { dmg_up: 0.5 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'overrideBasicAttackMapping_1' } },
  abilityEventResponses: [
    { event: 'beforeCastSkill', priority: 0, sequence: { $sequence: 'checkCondition_3' } },
  ],
  actionGraph: yvonneBuff12ActionGraph,
};

const yvonneBuff13ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff13: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 4,
  applyTags: [],
  extendTags: [],
  blackboard: { dmg_up: 0.5 },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'attacker',
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
  actionGraph: yvonneBuff13ActionGraph,
};

const yvonneBuff14ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_potential4_valid',
                copiedBlackboardAssignments: { ex_usp_up: 'ex_usp_up' },
              },
            ],
            target: 'buffSource',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
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
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_potential_5_new',
                copiedBlackboardAssignments: { atk_up: 'atk_up', crit_dmg_up: 'crit_dmg_up' },
              },
            ],
            target: 'buffSource',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'applyBuff_3',
      },
      changePlayerActionMode_5: {
        action: {
          kind: 'changePlayerActionMode',
          parameters: { modeId: 'ult', lifetime: 'finishByAction' },
        },
        next: null,
      },
      restrictUltimateEnergyRecovery_6: {
        action: {
          kind: 'restrictUltimateEnergyRecovery',
          parameters: {
            target: 'caster',
            allowedRecoveryTags: ['Skill/Character/chr_0017_yvonne/UltimateEndUsp'],
            clearUltimateEnergyOnEnd: false,
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
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_end',
                copiedBlackboardAssignments: {
                  atk_up: 'atk_up',
                  crit_dmg_up: 'crit_dmg_up',
                  has_potential5: 'has_potential5',
                },
              },
            ],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
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
          body: { $sequence: 'checkCondition_4' },
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
          body: { $sequence: 'checkCondition_2' },
        },
        next: 'withActionBlackboardScope_8',
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
          body: { $sequence: 'restrictUltimateEnergyRecovery_6' },
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
          body: { $sequence: 'changePlayerActionMode_5' },
        },
        next: 'withActionBlackboardScope_10',
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'has_potential4', fallback: 0 },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'has_potential5', fallback: 0 },
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
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff14: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_yvonne_buff',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: true,
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
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: ['Status/DisableBreakingAttack'],
  extendTags: [],
  blackboard: {
    atk_up: 0,
    crit_dmg_up: 0,
    duration: 0,
    ex_usp_up: 0,
    has_potential4: 0,
    has_potential5: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'withActionBlackboardScope_9' },
    enable: { $sequence: 'withActionBlackboardScope_11' },
    finish: { $sequence: 'applyBuff_7' },
  },
  actionGraph: yvonneBuff14ActionGraph,
};

const yvonneBuff15ActionGraph = {
  main: {
    nodes: {
      findTargets_1: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'real_tar',
          },
        },
        next: null,
      },
      finishBuffsById_2: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera_child'],
            reason: 'other',
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
            saveToContextKey: 'real_tar',
          },
        },
        next: 'finishBuffsById_2',
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'findTargets_3',
      },
      invertNextResult_5: {
        action: { kind: 'invertNextResult', parameters: {} },
        next: 'checkCondition_4',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'constant', value: 1 },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff15: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  triggerIntervalSeconds: 0.033,
  waitFirstTriggerInterval: true,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'findTargets_1' },
    trigger: { $sequence: 'invertNextResult_5' },
  },
  actionGraph: yvonneBuff15ActionGraph,
};

const yvonneBuff16ActionGraph = {
  main: {
    nodes: {
      applyBuff_13: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0017_yvonne_potential_5_new',
                copiedBlackboardAssignments: { atk_up: 'atk_up', crit_dmg_up: 'crit_dmg_up' },
              },
            ],
            target: 'buffSource',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
      checkCondition_14: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_13',
      },
      finishBuffsById_15: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer_effect'],
            reason: 'other',
          },
        },
        next: null,
      },
      withActionBlackboardScope_16: {
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
          body: { $sequence: 'finishBuffsById_15' },
        },
        next: null,
      },
      withActionBlackboardScope_17: {
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
          body: { $sequence: 'checkCondition_14' },
        },
        next: 'withActionBlackboardScope_16',
      },
      overrideBasicAttackMapping_1: {
        action: {
          kind: 'overrideBasicAttackMapping',
          parameters: { skillIds: ['chr_0017_yvonne_ult_attack_end'] },
        },
        next: null,
      },
      restrictUltimateEnergyRecovery_2: {
        action: {
          kind: 'restrictUltimateEnergyRecovery',
          parameters: {
            target: 'caster',
            allowedRecoveryTags: ['Skill/Character/chr_0017_yvonne/UltimateEndUsp'],
            clearUltimateEnergyOnEnd: false,
          },
        },
        next: null,
      },
      withActionBlackboardScope_18: {
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
          body: { $sequence: 'restrictUltimateEnergyRecovery_2' },
        },
        next: null,
      },
      withActionBlackboardScope_19: {
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
          body: { $sequence: 'overrideBasicAttackMapping_1' },
        },
        next: 'withActionBlackboardScope_18',
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end' }],
            target: 'currentAbilityEntity',
            source: 'buffOwner',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      forEachContextTarget_4: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'robots' } },
          body: { $sequence: 'applyBuff_3' },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_5: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'robots',
            abilityEntityIds: [
              'abilityentity_chr_0017_yvonne_ultimate_skill',
              'abilityentity_chr_0017_yvonne_ultimate_skill2',
              'abilityentity_chr_0017_yvonne_ultimate_skill3',
            ],
          },
        },
        next: 'forEachContextTarget_4',
      },
      finishBuffsById_7: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'buffOwner',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'],
            reason: 'other',
          },
        },
        next: 'finishBuffsById_15',
      },
      finishBuffsById_8: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_full_effect'],
            reason: 'other',
          },
        },
        next: 'finishBuffsById_7',
      },
      finishBuffsById_9: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_potential4_valid'],
            reason: 'other',
          },
        },
        next: 'finishBuffsById_8',
      },
      finishBuffsById_10: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_environment'],
            reason: 'other',
          },
        },
        next: 'finishBuffsById_9',
      },
      finishBuffsById_11: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
            reason: 'other',
          },
        },
        next: 'finishBuffsById_10',
      },
      adjustSkillCooldown_12: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'type', skillType: 'ultimate' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'constant', value: 10 },
          },
        },
        next: null,
      },
      withActionBlackboardScope_20: {
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
          body: { $sequence: 'adjustSkillCooldown_12' },
        },
        next: null,
      },
      withActionBlackboardScope_21: {
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
          body: { $sequence: 'finishBuffsById_11' },
        },
        next: 'withActionBlackboardScope_20',
      },
      withActionBlackboardScope_22: {
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
          body: { $sequence: 'findOwnerSpawnedAbilityEntities_5' },
        },
        next: 'withActionBlackboardScope_21',
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'has_potential5', fallback: 0 },
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
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff16: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration_end' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_yvonne_buff',
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
    iconStyleInSquad: 'LifeTime',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: ['Status/DisableBreakingAttack'],
  extendTags: [],
  blackboard: { atk_up: 0, crit_dmg_up: 0, duration_end: 3, has_potential5: 0 },
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'withActionBlackboardScope_17' },
    enable: { $sequence: 'withActionBlackboardScope_19' },
    finish: { $sequence: 'withActionBlackboardScope_22' },
  },
  actionGraph: yvonneBuff16ActionGraph,
};

const yvonneBuff17ActionGraph = {
  main: {
    nodes: {
      refreshCurrentBuffAttributeModifiers_1: {
        action: { kind: 'refreshCurrentBuffAttributeModifiers', parameters: {} },
        next: null,
      },
      modifyActionValue_2: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'crit_rate_up_dynamic',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: 'refreshCurrentBuffAttributeModifiers_1',
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'modifyActionValue_2',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'crit_rate_up' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 10 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff17: SkillBuffDefinition = {
  stackingType: 'enhanceAndRefresh',
  priority: 0,
  maxStackCount: 10,
  durationSeconds: { blackboardKey: 'recycle_time' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_yvonne_buff',
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
  blackboard: { crit_rate_up: 0.06, crit_rate_up_dynamic: 0, normal_dmg_up: 0.03, recycle_time: 4 },
  attributeModifiers: [
    { attribute: 'criticalRate', slot: 'baseAddition', value: { blackboardKey: 'normal_dmg_up' } },
    {
      attribute: 'criticalDamageIncrease',
      slot: 'baseAddition',
      value: { blackboardKey: 'crit_rate_up_dynamic' },
    },
  ],
  lifecycleSequences: { enhanceChanged: { $sequence: 'checkCondition_3' } },
  actionGraph: yvonneBuff17ActionGraph,
};

const yvonneBuff18ActionGraph = {
  main: {
    nodes: {
      changeResource_1: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_1' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            isPercentValue: true,
            ultimateRecoveryTag: 'Skill/Character/chr_0017_yvonne/UltimateEndUsp',
          },
        },
        next: null,
      },
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'changeResource_1',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'ex_usp_up' } },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'is_recover', fallback: 0 },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff18: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { ex_usp_up: 0, is_recover: 0 },
  attributeModifiers: [],
  lifecycleSequences: { finish: { $sequence: 'checkCondition_2' } },
  actionGraph: yvonneBuff18ActionGraph,
};

const yvonneBuff19ActionGraph = {
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

const yvonneBuff19: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'finishOwner_1' } },
  actionGraph: yvonneBuff19ActionGraph,
};

const yvonneBuff20ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff20: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'effect_duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { effect_duration: 0 },
  attributeModifiers: [],
  actionGraph: yvonneBuff20ActionGraph,
};

const yvonneBuff21ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff21: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 9 },
  attributeModifiers: [],
  actionGraph: yvonneBuff21ActionGraph,
};

const yvonneBuff22ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff22: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 3.5 },
  attributeModifiers: [],
  actionGraph: yvonneBuff22ActionGraph,
};

const yvonneBuff23ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const yvonneBuff23: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { duration: 9 },
  attributeModifiers: [],
  actionGraph: yvonneBuff23ActionGraph,
};

export const yvonne: OperatorDefinition = {
  slug: 'yvonne',
  gameId: 'YVONNE',
  rarity: 6,
  weaponType: 'pistol',
  element: 'cryo',
  characterTypeId: 'Cryst',
  role: 'striker',
  mainAttribute: 'intellect',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [8, 24, 40, 57, 74, 82],
    agility: [14, 38, 64, 89, 115, 128],
    intellect: [24, 57, 91, 125, 159, 176],
    will: [10, 30, 52, 73, 94, 105],
    baseAttack: [30, 92, 157, 223, 288, 321],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      operationType: 'basicAttack',
      skills: [
        yvonneChr_0017_yvonne_attack1,
        yvonneChr_0017_yvonne_attack2,
        yvonneChr_0017_yvonne_attack3,
        yvonneChr_0017_yvonne_attack4,
        yvonneChr_0017_yvonne_attack5,
      ],
    },
    {
      key: 'enhancedBasicAttack',
      operationType: 'basicAttack',
      placementPolicy: {
        kind: 'recursiveInput',
        firstSkillKey: 'chr_0017_yvonne_ult_attack1_1',
        terminalSkillKey: 'chr_0017_yvonne_ult_attack_end',
        maxSegments: 24,
        fallback: 'sequence',
      },
      nameKey: 'skillNames.enhanced',
      skills: [
        yvonneChr_0017_yvonne_ult_attack1_1,
        yvonneChr_0017_yvonne_ult_attack2_1,
        yvonneChr_0017_yvonne_ult_attack2_2,
        yvonneChr_0017_yvonne_ult_attack3_1,
        yvonneChr_0017_yvonne_ult_attack3_2,
        yvonneChr_0017_yvonne_ult_attack_end,
      ],
    },
    { key: 'finisher', operationType: 'finisher', skills: yvonneChr_0017_yvonne_power_attack },
    {
      key: 'plungingAttack',
      operationType: 'plungingAttack',
      skills: yvonneChr_0017_yvonne_plunging_attack_end,
    },
    {
      key: 'battleSkill',
      operationType: 'battleSkill',
      skills: yvonneChr_0017_yvonne_normal_skill,
    },
    { key: 'ultimate', operationType: 'ultimate', skills: yvonneChr_0017_yvonne_ultimate_skill },
    { key: 'comboSkill', operationType: 'comboSkill', skills: yvonneChr_0017_yvonne_combo_skill },
  ],
  dodgeSkill: yvonneCommon_character_perfect_dodge,
  dashBuffs: [
    { buffId: 'buff_common_dash', blackboard: { dodgeSkillId: 'common_character_perfect_dodge' } },
  ],
  skillSlots: [
    { key: 'battleSkill', baseSkillKey: 'chr_0017_yvonne_normal_skill', replacementSkillKeys: [] },
    { key: 'comboSkill', baseSkillKey: 'chr_0017_yvonne_combo_skill', replacementSkillKeys: [] },
    { key: 'ultimate', baseSkillKey: 'chr_0017_yvonne_ultimate_skill', replacementSkillKeys: [] },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'chr_0017_yvonne_attack1',
        'chr_0017_yvonne_attack2',
        'chr_0017_yvonne_attack3',
        'chr_0017_yvonne_attack4',
        'chr_0017_yvonne_attack5',
        'chr_0017_yvonne_plunging_attack_end',
        'chr_0017_yvonne_power_attack',
        'chr_0017_yvonne_ult_attack1_1',
        'chr_0017_yvonne_ult_attack2_1',
        'chr_0017_yvonne_ult_attack2_2',
        'chr_0017_yvonne_ult_attack3_1',
        'chr_0017_yvonne_ult_attack3_2',
        'chr_0017_yvonne_ult_attack_end',
      ],
      normalAttackSkillKeys: [
        'chr_0017_yvonne_attack1',
        'chr_0017_yvonne_attack2',
        'chr_0017_yvonne_attack3',
        'chr_0017_yvonne_attack4',
        'chr_0017_yvonne_attack5',
      ],
      defaultSkillKey: 'chr_0017_yvonne_attack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  playerActionModes: [
    {
      modeId: 'ult',
      modeLayer: 'default',
      defaultEnabled: false,
      normalAttackSkillKeys: [
        'chr_0017_yvonne_ult_attack1_1',
        'chr_0017_yvonne_ult_attack2_1',
        'chr_0017_yvonne_ult_attack2_2',
        'chr_0017_yvonne_ult_attack3_1',
        'chr_0017_yvonne_ult_attack3_2',
      ],
      commandMappings: { basicAttack: { skillId: 'chr_0017_yvonne_ult_attack1_1' } },
    },
    {
      modeId: 'ult_end',
      modeLayer: 'default',
      defaultEnabled: false,
      commandMappings: { basicAttack: { skillId: 'chr_0017_yvonne_ult_attack3_2' } },
    },
    {
      modeId: 'talent_1',
      modeLayer: 'default',
      defaultEnabled: false,
      commandMappings: { basicAttack: { skillId: 'chr_0017_yvonne_attack5' } },
    },
  ],
  comboSkillConditions: [yvonneComboCondition1],
  comboSkillPriority: 'default',
  talents: [
    { levels: 2, passiveSkills: [yvonnePassive1] },
    { levels: 2, passiveSkills: [yvonnePassive2] },
  ],
  potentials: [
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_combo_skill',
          blackboardKey: 'has_potential1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_combo_skill',
          blackboardKey: 'radius',
          operation: 'assign',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_combo_skill',
          blackboardKey: 'interval',
          operation: 'assign',
          value: 0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_combo_skill',
          blackboardKey: 'maxcnt',
          operation: 'assign',
          value: 6,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_combo_skill',
          blackboardKey: 'usp_extra',
          operation: 'assign',
          value: 25,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 20 },
        { kind: 'modifyBasePanelStat', stat: 'criticalRate', operation: 'flat', value: 0.07 },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0017_yvonne_talent_0',
          blackboardKey: 'inflict_up',
          operation: 'add',
          value: 0.1,
        },
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0017_yvonne_talent_0',
          blackboardKey: 'status_up',
          operation: 'add',
          value: 0.2,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_normal_skill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_normal_skill',
          blackboardKey: 'has_potential2',
          operation: 'assign',
          value: 1,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_ultimate_skill',
          blackboardKey: 'has_potential5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_ultimate_skill',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_ultimate_skill',
          blackboardKey: 'crit_dmg_up',
          operation: 'assign',
          value: 0.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_ult_attack_end',
          blackboardKey: 'crit_dmg_up',
          operation: 'assign',
          value: 0.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0017_yvonne_ult_attack_end',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.1,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0017_yvonne_combo_skill: yvonneBuff1,
    buff_chr_0017_yvonne_combo_skill_finish: yvonneBuff2,
    buff_chr_0017_yvonne_normal_skill_frozen: yvonneBuff3,
    buff_chr_0017_yvonne_normal_skill_listener: yvonneBuff4,
    buff_chr_0017_yvonne_normal_skill_projectile: yvonneBuff5,
    buff_chr_0017_yvonne_potential_5_cd: yvonneBuff6,
    buff_chr_0017_yvonne_potential_5_effect: yvonneBuff7,
    buff_chr_0017_yvonne_potential_5_new: yvonneBuff8,
    buff_chr_0017_yvonne_power_attack: yvonneBuff9,
    buff_chr_0017_yvonne_talent_0: yvonneBuff10,
    buff_chr_0017_yvonne_talent_1: yvonneBuff11,
    buff_chr_0017_yvonne_talent_1_valid: yvonneBuff12,
    buff_chr_0017_yvonne_talent_1_valid_up: yvonneBuff13,
    buff_chr_0017_yvonne_ultimate_skill: yvonneBuff14,
    buff_chr_0017_yvonne_ultimate_skill_camera: yvonneBuff15,
    buff_chr_0017_yvonne_ultimate_skill_end: yvonneBuff16,
    buff_chr_0017_yvonne_ultimate_skill_layer: yvonneBuff17,
    buff_chr_0017_yvonne_ultimate_skill_potential4_valid: yvonneBuff18,
    buff_chr_0017_yvonne_ultimate_skill_robot_end: yvonneBuff19,
    buff_chr_0017_yvonne_ultimate_skill_shield: yvonneBuff20,
    buff_chr_0017_yvonne_ultimate_skill_voice: yvonneBuff21,
    buff_chr_0017_yvonne_ultimate_skill_voice_short: yvonneBuff22,
    buff_chr_0017_yvonne_ultimate_skill_voice_start: yvonneBuff23,
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0017_yvonne_combo_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      childSkill: {
        skillId: 'chr_0017_yvonne_combo_skill_abilityrange',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 3000,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: {
          atk_scale_boom: 0,
          atk_scale_tick: 0,
          duration: 0,
          has_potential1: 0,
          interval: 0.75,
          maxcnt: 6,
          poise: 10,
          radius: 0,
          usp: 0,
          usp_extra: 0,
        },
        scheduledSequences: [{ startFrame: 19, endFrame: 20, sequence: { $sequence: 'ifElse_4' } }],
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
              changeResource_2: {
                action: {
                  kind: 'changeResource',
                  parameters: {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'valueNode', nodeId: 'data_2' },
                    coefficient: { kind: 'constant', value: 1 },
                    source: { kind: 'source' },
                    targets: { kind: 'source' },
                  },
                },
                next: null,
              },
              applyBuff_3: {
                action: {
                  kind: 'applyBuff',
                  parameters: {
                    buffs: [
                      {
                        buffId: 'buff_chr_0017_yvonne_combo_skill',
                        copiedBlackboardAssignments: {
                          radius: 'radius',
                          atk_scale_tick: 'atk_scale_tick',
                          duration: 'duration',
                          atk_scale_boom: 'atk_scale_boom',
                          poise: 'poise',
                          has_potential1: 'has_potential1',
                          interval: 'interval',
                          maxcnt: 'maxcnt',
                          usp: 'usp_extra',
                        },
                      },
                    ],
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  },
                },
                next: null,
              },
              ifElse_4: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_1' },
                  whenTrue: { $sequence: 'changeResource_2' },
                  whenFalse: { $sequence: null },
                },
                next: 'applyBuff_3',
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
              data_2: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
            },
          },
          macros: {},
        },
      },
    },
    abilityentity_chr_0017_yvonne_ultimate_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0017_yvonne/UltimateAbilityEntity',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      maxStackingCount: 1,
      childSkill: {
        actionGraph: { main: { nodes: {} }, macros: {} },
        skillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 3000,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atk_scale_boom: 0, atk_scale_tick: 0, duration: 0, radius: 0 },
        scheduledSequences: [],
      },
    },
    abilityentity_chr_0017_yvonne_ultimate_skill2: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0017_yvonne/UltimateAbilityEntity',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      maxStackingCount: 1,
      childSkill: {
        actionGraph: { main: { nodes: {} }, macros: {} },
        skillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 3000,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atk_scale_boom: 0, atk_scale_tick: 0, duration: 0, radius: 0 },
        scheduledSequences: [],
      },
    },
    abilityentity_chr_0017_yvonne_ultimate_skill3: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0017_yvonne/UltimateAbilityEntity',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      maxStackingCount: 1,
      childSkill: {
        actionGraph: { main: { nodes: {} }, macros: {} },
        skillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 3000,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atk_scale_boom: 0, atk_scale_tick: 0, duration: 0, radius: 0 },
        scheduledSequences: [],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;

export default yvonne;
