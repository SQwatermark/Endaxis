/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */

import type { ActionGraphResourceDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import type { SkillDefinition } from '../../../packages/game-data-contract/src/skills';
import type { SkillBuffDefinition } from '../../../packages/game-data-contract/src/buffs';
import type {
  OperatorPassiveSkillDefinition,
  ComboSkillConditionDefinition,
} from '../../../packages/game-data-contract/src/operators';
import type { OperatorDefinition } from '../../../packages/game-data-contract/src/operators';
export const zhuangFangyiChr_0030_zhuangfy_attack1ActionGraph = {
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
                skillId: 'chr_0030_zhuangfy_attack1_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 1 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'dealDamage_1' } },
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
      reachSkillOperableBoundary_3: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack2'] },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_attack1: SkillDefinition = {
  key: 'chr_0030_zhuangfy_attack1',
  element: 'electric',
  blackboard: { atk_scale: [0.08, 0.09, 0.1, 0.1, 0.11, 0.12, 0.13, 0.14, 0.14, 0.15, 0.17, 0.18] },
  timelineBlockFrames: 15,
  naturalDurationFrames: 123,
  exclusiveFrame: 23,
  offsetRecordFrame: 6,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 30,
        input: 'basicAttack',
        targetSkillId: 'chr_0030_zhuangfy_attack2',
      },
    ],
    allowedNextSkills: [{ startFrame: 15, endFrame: 30, skillIds: ['chr_0030_zhuangfy_attack2'] }],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 6, endFrame: 7, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 8, endFrame: 9, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 15, endFrame: 30, sequence: { $sequence: 'reachSkillOperableBoundary_3' } },
  ],
  timelineContinuationSkillId: 'chr_0030_zhuangfy_attack2',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_attack1ActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_attack2ActionGraph = {
  main: {
    nodes: {
      launchProjectile_6: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 2,
            recycleDelaySeconds: 0.100000001490116,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0030_zhuangfy_attack2_sword_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 3,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale_sword: 1 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'dealDamage_1' } },
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
                        expression: { kind: 'blackboard', key: 'atk_scale_sword' },
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
            finish: 2,
            recycleDelaySeconds: 0.100000001490116,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0030_zhuangfy_attack2_sword_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 3,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale_sword: 1 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'dealDamage_1' } },
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
                        expression: { kind: 'blackboard', key: 'atk_scale_sword' },
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
      spawnAbilityEntity_10: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'thunderPos' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack2',
            childSkillId: 'chr_0030_zhuangfy_attack2_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
        next: null,
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      ifElse_11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_8' },
          whenTrue: { $sequence: 'spawnAbilityEntity_10' },
          whenFalse: { $sequence: 'spawnAbilityEntity_10' },
        },
        next: null,
      },
      reachSkillOperableBoundary_12: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack3'] },
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
          target: { kind: 'inputTarget' },
          distance: 10,
          lessThan: true,
          includeTargetRadius: true,
          containsHittableObject: false,
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_attack2: SkillDefinition = {
  key: 'chr_0030_zhuangfy_attack2',
  element: 'electric',
  blackboard: {
    atk_scale: [0.04, 0.04, 0.04, 0.05, 0.05, 0.05, 0.06, 0.06, 0.06, 0.07, 0.07, 0.08],
    atk_scale_sword: [0.05, 0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.11],
  },
  timelineBlockFrames: 15,
  naturalDurationFrames: 320,
  exclusiveFrame: 27,
  offsetRecordFrame: 15,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 36,
        input: 'basicAttack',
        targetSkillId: 'chr_0030_zhuangfy_attack3',
      },
    ],
    allowedNextSkills: [{ startFrame: 15, endFrame: 36, skillIds: ['chr_0030_zhuangfy_attack3'] }],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 2, endFrame: 3, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 2, endFrame: 3, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 15, endFrame: 18, sequence: { $sequence: 'ifElse_11' } },
    { startFrame: 15, endFrame: 36, sequence: { $sequence: 'reachSkillOperableBoundary_12' } },
  ],
  timelineContinuationSkillId: 'chr_0030_zhuangfy_attack3',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_attack2ActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_attack3ActionGraph = {
  main: {
    nodes: {
      launchProjectile_6: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 2,
            recycleDelaySeconds: 0.100000001490116,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0030_zhuangfy_attack3_sword_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 3,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale_sword: 0.3 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'dealDamage_1' } },
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
                        expression: { kind: 'blackboard', key: 'atk_scale_sword' },
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
            finish: 2,
            recycleDelaySeconds: 0.100000001490116,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0030_zhuangfy_attack3_sword_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 3,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale_sword: 0.3 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'dealDamage_1' } },
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
                        expression: { kind: 'blackboard', key: 'atk_scale_sword' },
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
      reachSkillOperableBoundary_10: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack4'] },
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
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_attack3: SkillDefinition = {
  key: 'chr_0030_zhuangfy_attack3',
  element: 'electric',
  blackboard: {
    atk_scale_sword: [0.08, 0.09, 0.1, 0.1, 0.11, 0.12, 0.13, 0.14, 0.14, 0.15, 0.17, 0.18],
  },
  timelineBlockFrames: 26,
  naturalDurationFrames: 105,
  exclusiveFrame: 29,
  offsetRecordFrame: 14,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 39,
        input: 'basicAttack',
        targetSkillId: 'chr_0030_zhuangfy_attack4',
      },
    ],
    allowedNextSkills: [{ startFrame: 26, endFrame: 39, skillIds: ['chr_0030_zhuangfy_attack4'] }],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 14, endFrame: 15, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 14, endFrame: 15, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 16, endFrame: 17, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 26, endFrame: 39, sequence: { $sequence: 'reachSkillOperableBoundary_10' } },
  ],
  timelineContinuationSkillId: 'chr_0030_zhuangfy_attack4',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_attack3ActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_attack4ActionGraph = {
  main: {
    nodes: {
      spawnAbilityEntity_3: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'thunderPos' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack2',
            childSkillId: 'chr_0030_zhuangfy_attack2_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
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
          whenTrue: { $sequence: 'spawnAbilityEntity_3' },
          whenFalse: { $sequence: 'spawnAbilityEntity_3' },
        },
        next: null,
      },
      reachSkillOperableBoundary_5: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack5'] },
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
          target: { kind: 'inputTarget' },
          distance: 10,
          lessThan: true,
          includeTargetRadius: true,
          containsHittableObject: false,
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_attack4: SkillDefinition = {
  key: 'chr_0030_zhuangfy_attack4',
  element: 'electric',
  blackboard: {
    atk_scale: [0.11, 0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.22, 0.23, 0.25],
  },
  timelineBlockFrames: 17,
  naturalDurationFrames: 170,
  exclusiveFrame: 23,
  offsetRecordFrame: 11,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 33,
        input: 'basicAttack',
        targetSkillId: 'chr_0030_zhuangfy_attack5',
      },
    ],
    allowedNextSkills: [{ startFrame: 17, endFrame: 33, skillIds: ['chr_0030_zhuangfy_attack5'] }],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 11, endFrame: 14, sequence: { $sequence: 'ifElse_4' } },
    { startFrame: 17, endFrame: 33, sequence: { $sequence: 'reachSkillOperableBoundary_5' } },
  ],
  timelineContinuationSkillId: 'chr_0030_zhuangfy_attack5',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_attack4ActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_attack5ActionGraph = {
  main: {
    nodes: {
      spawnAbilityEntity_9: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'abiPos' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack5',
            childSkillId: 'chr_0030_zhuangfy_attack5_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
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
          whenTrue: { $sequence: 'spawnAbilityEntity_9' },
          whenFalse: { $sequence: 'spawnAbilityEntity_9' },
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
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'ifElse_5' },
          whenFalse: { $sequence: 'spawnAbilityEntity_9' },
        },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'ifElse_8' },
          whenFalse: { $sequence: 'spawnAbilityEntity_9' },
        },
        next: null,
      },
      reachSkillOperableBoundary_11: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack1'] },
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
          target: { kind: 'inputTarget' },
          distance: 10,
          lessThan: false,
          includeTargetRadius: true,
          containsHittableObject: false,
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 3,
          lessThan: false,
          includeTargetRadius: true,
          containsHittableObject: true,
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'inputTarget' },
          containsHittableTarget: true,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_attack5: SkillDefinition = {
  key: 'chr_0030_zhuangfy_attack5',
  element: 'electric',
  blackboard: {
    atb: 18,
    atk_scale: [0.48, 0.53, 0.58, 0.62, 0.67, 0.72, 0.77, 0.82, 0.86, 0.92, 1, 1.08],
    poise: 18,
  },
  timelineBlockFrames: 50,
  naturalDurationFrames: 165,
  exclusiveFrame: 55,
  offsetRecordFrame: 20,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 21,
        endFrame: 60,
        input: 'basicAttack',
        targetSkillId: 'chr_0030_zhuangfy_attack1',
      },
    ],
    allowedNextSkills: [{ startFrame: 50, endFrame: 60, skillIds: ['chr_0030_zhuangfy_attack1'] }],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 20, endFrame: 23, sequence: { $sequence: 'ifElse_10' } },
    { startFrame: 50, endFrame: 60, sequence: { $sequence: 'reachSkillOperableBoundary_11' } },
  ],
  timelineContinuationSkillId: 'chr_0030_zhuangfy_attack1',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_attack5ActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_power_attackActionGraph = {
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
      startTimeDilation_2: {
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
      gainFinisherSp_3: {
        action: { kind: 'gainFinisherSp', parameters: { factor: 1, recipient: 'team' } },
        next: 'startTimeDilation_2',
      },
      dealDamage_4: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_2' },
            calculation: 'breakingAttack',
            calculationMultiplier: 0.9,
            tags: ['normalAttack', 'powerAttack'],
          },
        },
        next: 'gainFinisherSp_3',
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
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_power_attack: SkillDefinition = {
  actionGraph: zhuangFangyiChr_0030_zhuangfy_power_attackActionGraph,
  key: 'chr_0030_zhuangfy_power_attack',
  element: 'electric',
  blackboard: { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
  timelineBlockFrames: 41,
  naturalDurationFrames: 153,
  exclusiveFrame: 45,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 41,
        endFrame: 45,
        skillIds: [
          'chr_0030_zhuangfy_attack1',
          'chr_0030_zhuangfy_combo_skill',
          'chr_0030_zhuangfy_normal_skill',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 11, endFrame: 14, sequence: { $sequence: 'dealDamage_1' } },
    { startFrame: 40, endFrame: 43, sequence: { $sequence: 'dealDamage_4' } },
    { startFrame: 0, endFrame: 45, sequence: { $sequence: 'applyBuff_5' } },
    { startFrame: 0, endFrame: 41, sequence: { $sequence: 'applyBuff_6' } },
  ],
  skillType: 'finisher',
  levelSource: 'basicAttack',
  nativeSkillType: 'breakingAttack',
};

export const zhuangFangyiChr_0030_zhuangfy_plunging_attack_endActionGraph = {
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
      interruptCurrentSkill_4: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      ifElse_5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'interruptCurrentSkill_4' },
          whenFalse: { $sequence: null },
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
            onlyMainOperator: true,
            spGainKind: 'gain',
            spGainSource: 'normalAttack',
          },
        },
        next: null,
      },
      dealDamage_9: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_3' },
            tags: ['normalAttack', 'plungingAttack'],
          },
        },
        next: 'changeResource_8',
      },
      finishOwner_11: {
        action: {
          kind: 'finishOwner',
          parameters: { targets: { kind: 'context', key: 'airSword' } },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_12: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'airSword',
            abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_air_attack'],
          },
        },
        next: 'finishOwner_11',
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'findOwnerSpawnedAbilityEntities_12' },
        },
        next: null,
      },
      inheritBuffById_14: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0030_zhuangfy_air_attack_ult_extend_buff',
            inheritToNextSkillIds: [],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
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
          buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_plunging_attack_end: SkillDefinition = {
  key: 'chr_0030_zhuangfy_plunging_attack_end',
  element: 'electric',
  blackboard: {
    atb: 0,
    atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
  timelineBlockFrames: 21,
  naturalDurationFrames: 170,
  exclusiveFrame: 20,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 45, sequence: { $sequence: 'ifElse_2' } },
    { startFrame: 125, endFrame: 128, sequence: { $sequence: 'ifElse_5' } },
    { startFrame: 8, endFrame: 125, sequence: { $sequence: 'ifElse_2' } },
    { startFrame: 1, endFrame: 6, sequence: { $sequence: 'dealDamage_9' } },
    { startFrame: 0, endFrame: 5, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 0, endFrame: 6, sequence: { $sequence: 'inheritBuffById_14' } },
    { startFrame: 0, endFrame: 170, sequence: { $sequence: 'ifElse_2' } },
  ],
  skillType: 'plungingAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_plunging_attack_endActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_normal_skillActionGraph = {
  main: {
    nodes: {
      setAbilityEntityRemainingDuration_6: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: { value: { kind: 'constant', value: 3 } },
        },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'setAbilityEntityRemainingDuration_6',
      },
      forEachContextTarget_8: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'swordsForExtend' } },
          body: { $sequence: 'checkCondition_7' },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_9: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'swordsForExtend',
            abilityEntityIds: [
              'abilityentity_chr_0030_zhuangfy_normal_skill_sword',
              'abilityentity_chr_0030_zhuangfy_normal_skill_sword_ult',
            ],
          },
        },
        next: 'forEachContextTarget_8',
      },
      finishBuffsById_11: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_normal_skill_trigger_sword'],
            reason: 'other',
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
      spawnAbilityEntity_39: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_fake_target',
            inheritActionBlackboard: true,
            dieWhenSourceDies: true,
          },
        },
        next: null,
      },
      modifyActionValue_17: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'sword_gene_num',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      checkCondition_16: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      checkCondition_18: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      gainSquadUltimateEnergyFromSkillCost_opt1: {
        action: { kind: 'gainSquadUltimateEnergyFromSkillCost', parameters: { coefficient: 1 } },
        next: null,
      },
      launchProjectile_opt2: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: { reachAfterTicks: 1, maxDurationSeconds: 2, finishOnReach: false },
            recycleDelaySeconds: 0.0333333350718021,
            targets: { kind: 'count', count: { kind: 'valueNode', nodeId: 'data_7' } },
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0030_zhuangfy_normal_skill_gene_sword_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { remain_sword_limit: 0, sword_duration: 0, swordsForLimit: 0 },
                scheduledSequences: [
                  {
                    startFrame: 0,
                    endFrame: 1,
                    sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_opt3' },
                  },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      spawnAbilityEntity_6: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'inputTarget' },
                            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_sword',
                            childSkillId: 'chr_0030_zhuangfy_normal_skill_sword',
                            inheritActionBlackboard: true,
                            dieWhenSourceDies: true,
                            blackboardAssignments: {
                              EntityBB_swordDuration: { kind: 'valueNode', nodeId: 'data_1' },
                              EntityBB_swordLimit: { kind: 'valueNode', nodeId: 'data_2' },
                            },
                          },
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
                      ifElse_11: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_4' },
                          whenTrue: { $sequence: 'spawnAbilityEntity_6' },
                          whenFalse: { $sequence: 'spawnAbilityEntity_6' },
                        },
                        next: null,
                      },
                      finishOwner_9: {
                        action: {
                          kind: 'finishOwner',
                          parameters: { targets: { kind: 'context', key: 'swordToDie' } },
                        },
                        next: 'ifElse_11',
                      },
                      pickContextTarget_10: {
                        action: {
                          kind: 'pickContextTarget',
                          parameters: {
                            sourceContextKey: 'swords',
                            saveToContextKey: 'swordToDie',
                            index: { kind: 'constant', value: 0 },
                          },
                        },
                        next: 'finishOwner_9',
                      },
                      checkCondition_7: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_7' },
                          whenTrue: { $sequence: 'pickContextTarget_10' },
                          whenFalse: { $sequence: 'ifElse_11' },
                        },
                        next: null,
                      },
                      checkCondition_opt2: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                        },
                        next: 'ifElse_opt1',
                      },
                      findOwnerSpawnedAbilityEntities_opt3: {
                        action: {
                          kind: 'findOwnerSpawnedAbilityEntities',
                          parameters: {
                            saveToContextKey: 'swords',
                            abilityEntityIds: [
                              'abilityentity_chr_0030_zhuangfy_normal_skill_sword',
                              'abilityentity_chr_0030_zhuangfy_normal_skill_sword_ult',
                            ],
                          },
                        },
                        next: 'checkCondition_opt2',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'sword_duration' },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'remain_sword_limit' },
                      },
                      data_3: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_4: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'swordsForLimit', fallback: 0 },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'remain_sword_limit', fallback: 0 },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_4' },
                          operator: 'greaterOrEqual',
                          right: { kind: 'valueNode', nodeId: 'data_5' },
                        },
                      },
                      data_7: {
                        type: 'boolean',
                        expression: {
                          kind: 'entityCountCompare',
                          target: { kind: 'context', key: 'swords' },
                          containsHittableTarget: false,
                          excludeDeadEntity: false,
                          operator: 'greaterOrEqual',
                          value: 0,
                          outputKey: 'swordsForLimit',
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
        next: 'gainSquadUltimateEnergyFromSkillCost_opt1',
      },
      createSpatialPointTargets_opt3: {
        action: {
          kind: 'createSpatialPointTargets',
          parameters: {
            saveToContextKey: 'swordPos',
            count: { kind: 'valueNode', nodeId: 'data_8' },
          },
        },
        next: 'launchProjectile_opt2',
      },
      ifElse_opt11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_18' },
          whenTrue: { $sequence: 'modifyActionValue_17' },
          whenFalse: { $sequence: null },
        },
        next: 'createSpatialPointTargets_opt3',
      },
      ifElse_opt12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_16' },
          whenTrue: { $sequence: 'modifyActionValue_17' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_opt11',
      },
      modifyActionValue_13: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'sword_gene_num',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_9' },
          },
        },
        next: null,
      },
      checkCondition_12: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      changeResource_opt5: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_13' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'default',
          },
        },
        next: 'ifElse_opt11',
      },
      ifElse_opt6: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_12' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'modifyActionValue_13' },
        },
        next: 'changeResource_opt5',
      },
      modifyActionValue_opt7: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'sword_gene_num',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt6',
      },
      modifyActionValue_opt8: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'sword_gene_num',
            operation: 'add',
            value: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'modifyActionValue_opt7',
      },
      finishBuffsByTag_opt9: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
            reason: 'early',
          },
        },
        next: 'modifyActionValue_opt8',
      },
      readBuffBlackboard_opt10: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'enemy',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
            },
            desiredKey: 'count',
            outputKey: 'conductCnt',
          },
        },
        next: 'finishBuffsByTag_opt9',
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
        },
        next: null,
      },
      ifElse_opt13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_20' },
          whenTrue: { $sequence: 'readBuffBlackboard_opt10' },
          whenFalse: { $sequence: 'ifElse_opt12' },
        },
        next: null,
      },
      applyBuff_opt14: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar' }],
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'ifElse_opt13',
      },
      checkCondition_36: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
        },
        next: null,
      },
      ifElse_opt15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_36' },
          whenTrue: { $sequence: 'applyBuff_opt14' },
          whenFalse: { $sequence: 'spawnAbilityEntity_39' },
        },
        next: null,
      },
      ifElse_opt16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'finishBuffsById_11' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_opt15',
      },
      applyBuff_43: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0030_zhuangfy_normal_skill_trigger_sword',
                copiedBlackboardAssignments: {
                  interval: 'swordTriggerInterval',
                  sword_range: 'sword_range',
                  atk_scale: 'atk_scale',
                  poise: 'poise',
                  usp_extra: 'usp_extra',
                  atk_up_final: 'atk_up_final',
                  remain_sword_limit: 'remain_sword_limit',
                  final_rate: 'final_rate',
                },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      calculateActionValue_44: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_up_final',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_17' },
            right: { kind: 'valueNode', nodeId: 'data_18' },
          },
        },
        next: 'applyBuff_43',
      },
      calculateActionValue_45: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'swordTriggerInterval',
            operation: 'add',
            left: { kind: 'constant', value: 0.3 },
            right: { kind: 'valueNode', nodeId: 'data_19' },
          },
        },
        next: 'calculateActionValue_44',
      },
      modifyActionValue_46: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'swordTriggerInterval',
            operation: 'multiply',
            value: { kind: 'constant', value: -1 },
          },
        },
        next: 'calculateActionValue_45',
      },
      calculateActionValue_47: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'swordTriggerInterval',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_20' },
            right: { kind: 'constant', value: 90 },
          },
        },
        next: 'modifyActionValue_46',
      },
      checkCondition_42: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_22' } },
        },
        next: null,
      },
      ifElse_48: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_42' },
          whenTrue: { $sequence: 'calculateActionValue_47' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      startTimeDilation_49: {
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
                  time: 0,
                  value: 0.01,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.7704785,
                  value: 0.01,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 4.313321,
                  outTangent: 4.313321,
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
      checkCondition_50: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_23' } },
        },
        next: 'startTimeDilation_49',
      },
      checkCondition_51: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_24' } },
        },
        next: 'checkCondition_50',
      },
      applyBuff_52: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_talent1' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_55: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'applyBuff_52' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_53: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: null,
      },
      ifElse_56: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_53' },
          whenTrue: { $sequence: 'applyBuff_52' },
          whenFalse: { $sequence: 'ifElse_55' },
        },
        next: null,
      },
      ifElse_61: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_20' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_62: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_25' } },
        },
        next: 'ifElse_61',
      },
      checkCondition_64: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_27' } },
        },
        next: null,
      },
      checkCondition_63: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_28' } },
        },
        next: null,
      },
      anyCondition_65: {
        action: {
          kind: 'anyCondition',
          parameters: {},
          conditions: [{ $sequence: 'checkCondition_63' }, { $sequence: 'checkCondition_64' }],
        },
        next: null,
      },
      jumpTimeline_66: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 116 },
          condition: { $sequence: 'anyCondition_65' },
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
          kind: 'abilityEntityRemainingDurationCompare',
          operator: 'less',
          value: { kind: 'constant', value: 3 },
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0030_zhuangfy_normal_skill_trigger_sword'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_SwordNum', fallback: 0 },
      },
      data_4: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'free_sword_limit', fallback: 0 },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_3' },
          operator: 'less',
          right: { kind: 'valueNode', nodeId: 'data_4' },
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0030_zhuangfy_potential1_more_sword'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'sword_gene_num' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'sword_gene_num' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'max_conduct_sword' } },
      data_10: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'sword_gene_num', fallback: 0 },
      },
      data_11: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'max_conduct_sword', fallback: 0 },
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
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return' } },
      data_14: { type: 'number', expression: { kind: 'blackboard', key: 'conductCnt' } },
      data_15: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
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
          excludeDeadEntity: true,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_17: { type: 'number', expression: { kind: 'blackboard', key: 'atk_up_per_conduct' } },
      data_18: { type: 'number', expression: { kind: 'blackboard', key: 'conductCnt' } },
      data_19: { type: 'number', expression: { kind: 'blackboard', key: 'swordTriggerInterval' } },
      data_20: { type: 'number', expression: { kind: 'blackboard', key: 'EntityBB_SwordNum' } },
      data_21: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_SwordNum', fallback: 0 },
      },
      data_22: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_21' },
          operator: 'greaterOrEqual',
          right: { kind: 'constant', value: 1 },
        },
      },
      data_23: {
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
      data_24: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_25: {
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
      data_26: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_SwordNum', fallback: 0 },
      },
      data_27: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_26' },
          operator: 'equal',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_28: {
        type: 'boolean',
        expression: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'skillEnd' },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_normal_skill: SkillDefinition = {
  key: 'chr_0030_zhuangfy_normal_skill',
  element: 'electric',
  blackboard: {
    atb_return: 0,
    atk_scale: [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
    atk_up_final: 0,
    atk_up_per_conduct: [0.03, 0.04, 0.04, 0.04, 0.05, 0.05, 0.05, 0.06, 0.06, 0.07, 0.08, 0.09],
    conductCnt: 0,
    final_rate: 6,
    free_sword_limit: 3,
    max_conduct_sword: 3,
    poise: 15,
    remain_sword_limit: 9,
    sword_duration: 36,
    sword_gene_num: 0,
    sword_range: 50,
    swordTriggerInterval: 0,
    usp_extra: 6,
  },
  timelineBlockFrames: 45,
  naturalDurationFrames: 290,
  exclusiveFrame: 135,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 45,
        endFrame: 116,
        skillIds: [
          'chr_0030_zhuangfy_attack1',
          'chr_0030_zhuangfy_attack2',
          'chr_0030_zhuangfy_attack3',
          'chr_0030_zhuangfy_attack4',
          'chr_0030_zhuangfy_attack5',
          'chr_0030_zhuangfy_normal_skill',
          'chr_0030_zhuangfy_power_attack',
        ],
      },
      {
        startFrame: 120,
        endFrame: 147,
        skillIds: [
          'chr_0030_zhuangfy_attack1',
          'chr_0030_zhuangfy_attack2',
          'chr_0030_zhuangfy_attack3',
          'chr_0030_zhuangfy_attack4',
          'chr_0030_zhuangfy_attack5',
          'chr_0030_zhuangfy_normal_skill',
          'chr_0030_zhuangfy_power_attack',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 12, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_9' } },
    { startFrame: 6, endFrame: 7, sequence: { $sequence: 'ifElse_opt16' } },
    { startFrame: 13, endFrame: 16, sequence: { $sequence: 'ifElse_48' } },
    { startFrame: 123, endFrame: 126, sequence: { $sequence: 'checkCondition_51' } },
    { startFrame: 6, endFrame: 7, sequence: { $sequence: 'ifElse_56' } },
    { startFrame: 123, endFrame: 126, sequence: { $sequence: 'checkCondition_51' } },
    { startFrame: 0, endFrame: 15, sequence: { $sequence: 'checkCondition_62' } },
    { startFrame: 16, endFrame: 116, sequence: { $sequence: 'jumpTimeline_66' } },
  ],
  smartTarget: 'enemy',
  costs: [{ resource: 'sp', value: 100 }],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_normal_skillActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_normal_skill_ultActionGraph = {
  main: {
    nodes: {
      setAbilityEntityRemainingDuration_6: {
        action: {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: { value: { kind: 'constant', value: 3 } },
        },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: 'setAbilityEntityRemainingDuration_6',
      },
      forEachContextTarget_8: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'swordsForExtend' } },
          body: { $sequence: 'checkCondition_7' },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_9: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'swordsForExtend',
            abilityEntityIds: [
              'abilityentity_chr_0030_zhuangfy_normal_skill_sword',
              'abilityentity_chr_0030_zhuangfy_normal_skill_sword_ult',
            ],
          },
        },
        next: 'forEachContextTarget_8',
      },
      spawnAbilityEntity_51: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_fake_target',
            inheritActionBlackboard: true,
            dieWhenSourceDies: true,
          },
        },
        next: null,
      },
      modifyActionValue_24: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'sword_gene_num',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
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
      checkCondition_25: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      gainSquadUltimateEnergyFromSkillCost_opt1: {
        action: { kind: 'gainSquadUltimateEnergyFromSkillCost', parameters: { coefficient: 1 } },
        next: null,
      },
      launchProjectile_opt2: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: { reachAfterTicks: 1, maxDurationSeconds: 2, finishOnReach: false },
            recycleDelaySeconds: 0.0333333350718021,
            targets: { kind: 'count', count: { kind: 'valueNode', nodeId: 'data_6' } },
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0030_zhuangfy_normal_skill_gene_sword_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { remain_sword_limit: 0, sword_duration: 0, swordsForLimit: 0 },
                scheduledSequences: [
                  {
                    startFrame: 0,
                    endFrame: 1,
                    sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_opt3' },
                  },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      spawnAbilityEntity_6: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'inputTarget' },
                            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_sword',
                            childSkillId: 'chr_0030_zhuangfy_normal_skill_sword',
                            inheritActionBlackboard: true,
                            dieWhenSourceDies: true,
                            blackboardAssignments: {
                              EntityBB_swordDuration: { kind: 'valueNode', nodeId: 'data_1' },
                              EntityBB_swordLimit: { kind: 'valueNode', nodeId: 'data_2' },
                            },
                          },
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
                      ifElse_11: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_4' },
                          whenTrue: { $sequence: 'spawnAbilityEntity_6' },
                          whenFalse: { $sequence: 'spawnAbilityEntity_6' },
                        },
                        next: null,
                      },
                      finishOwner_9: {
                        action: {
                          kind: 'finishOwner',
                          parameters: { targets: { kind: 'context', key: 'swordToDie' } },
                        },
                        next: 'ifElse_11',
                      },
                      pickContextTarget_10: {
                        action: {
                          kind: 'pickContextTarget',
                          parameters: {
                            sourceContextKey: 'swords',
                            saveToContextKey: 'swordToDie',
                            index: { kind: 'constant', value: 0 },
                          },
                        },
                        next: 'finishOwner_9',
                      },
                      checkCondition_7: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_7' },
                          whenTrue: { $sequence: 'pickContextTarget_10' },
                          whenFalse: { $sequence: 'ifElse_11' },
                        },
                        next: null,
                      },
                      checkCondition_opt2: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                        },
                        next: 'ifElse_opt1',
                      },
                      findOwnerSpawnedAbilityEntities_opt3: {
                        action: {
                          kind: 'findOwnerSpawnedAbilityEntities',
                          parameters: {
                            saveToContextKey: 'swords',
                            abilityEntityIds: [
                              'abilityentity_chr_0030_zhuangfy_normal_skill_sword',
                              'abilityentity_chr_0030_zhuangfy_normal_skill_sword_ult',
                            ],
                          },
                        },
                        next: 'checkCondition_opt2',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'sword_duration' },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'remain_sword_limit' },
                      },
                      data_3: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_4: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'swordsForLimit', fallback: 0 },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'remain_sword_limit', fallback: 0 },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_4' },
                          operator: 'greaterOrEqual',
                          right: { kind: 'valueNode', nodeId: 'data_5' },
                        },
                      },
                      data_7: {
                        type: 'boolean',
                        expression: {
                          kind: 'entityCountCompare',
                          target: { kind: 'context', key: 'swords' },
                          containsHittableTarget: false,
                          excludeDeadEntity: false,
                          operator: 'greaterOrEqual',
                          value: 0,
                          outputKey: 'swordsForLimit',
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
        next: 'gainSquadUltimateEnergyFromSkillCost_opt1',
      },
      createSpatialPointTargets_opt3: {
        action: {
          kind: 'createSpatialPointTargets',
          parameters: {
            saveToContextKey: 'swordPos',
            count: { kind: 'valueNode', nodeId: 'data_7' },
          },
        },
        next: 'launchProjectile_opt2',
      },
      modifyActionValue_opt4: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: '__endaxis_target_group_count:swordPos',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_8' },
          },
        },
        next: 'createSpatialPointTargets_opt3',
      },
      ifElse_opt12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_25' },
          whenTrue: { $sequence: 'modifyActionValue_24' },
          whenFalse: { $sequence: null },
        },
        next: 'modifyActionValue_opt4',
      },
      ifElse_opt13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_23' },
          whenTrue: { $sequence: 'modifyActionValue_24' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_opt12',
      },
      modifyActionValue_20: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'sword_gene_num',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_9' },
          },
        },
        next: null,
      },
      checkCondition_19: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      changeResource_opt6: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'sp',
            amount: { kind: 'valueNode', nodeId: 'data_13' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
            spGainKind: 'refund',
            spGainSource: 'default',
          },
        },
        next: 'ifElse_opt12',
      },
      ifElse_opt7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_19' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'modifyActionValue_20' },
        },
        next: 'changeResource_opt6',
      },
      modifyActionValue_opt8: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'sword_gene_num',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt7',
      },
      modifyActionValue_opt9: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'sword_gene_num',
            operation: 'add',
            value: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'modifyActionValue_opt8',
      },
      finishBuffsByTag_opt10: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
            reason: 'early',
          },
        },
        next: 'modifyActionValue_opt9',
      },
      readBuffBlackboard_opt11: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'enemy',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
            },
            desiredKey: 'count',
            outputKey: 'conductCnt',
          },
        },
        next: 'finishBuffsByTag_opt10',
      },
      checkCondition_27: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
        },
        next: null,
      },
      ifElse_opt14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_27' },
          whenTrue: { $sequence: 'readBuffBlackboard_opt11' },
          whenFalse: { $sequence: 'ifElse_opt13' },
        },
        next: null,
      },
      finishBuffsById_15: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_skill_free'],
            reason: 'other',
          },
        },
        next: null,
      },
      launchProjectile_16: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: { reachAfterTicks: 1, maxDurationSeconds: 2, finishOnReach: false },
            recycleDelaySeconds: 0.0333333350718021,
            targets: { kind: 'count', count: { kind: 'valueNode', nodeId: 'data_16' } },
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0030_zhuangfy_normal_skill_gene_sword_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { remain_sword_limit: 0, sword_duration: 0, swordsForLimit: 0 },
                scheduledSequences: [
                  {
                    startFrame: 0,
                    endFrame: 1,
                    sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_opt3' },
                  },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      spawnAbilityEntity_6: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'inputTarget' },
                            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_sword',
                            childSkillId: 'chr_0030_zhuangfy_normal_skill_sword',
                            inheritActionBlackboard: true,
                            dieWhenSourceDies: true,
                            blackboardAssignments: {
                              EntityBB_swordDuration: { kind: 'valueNode', nodeId: 'data_1' },
                              EntityBB_swordLimit: { kind: 'valueNode', nodeId: 'data_2' },
                            },
                          },
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
                      ifElse_11: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_4' },
                          whenTrue: { $sequence: 'spawnAbilityEntity_6' },
                          whenFalse: { $sequence: 'spawnAbilityEntity_6' },
                        },
                        next: null,
                      },
                      finishOwner_9: {
                        action: {
                          kind: 'finishOwner',
                          parameters: { targets: { kind: 'context', key: 'swordToDie' } },
                        },
                        next: 'ifElse_11',
                      },
                      pickContextTarget_10: {
                        action: {
                          kind: 'pickContextTarget',
                          parameters: {
                            sourceContextKey: 'swords',
                            saveToContextKey: 'swordToDie',
                            index: { kind: 'constant', value: 0 },
                          },
                        },
                        next: 'finishOwner_9',
                      },
                      checkCondition_7: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      ifElse_opt1: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_7' },
                          whenTrue: { $sequence: 'pickContextTarget_10' },
                          whenFalse: { $sequence: 'ifElse_11' },
                        },
                        next: null,
                      },
                      checkCondition_opt2: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                        },
                        next: 'ifElse_opt1',
                      },
                      findOwnerSpawnedAbilityEntities_opt3: {
                        action: {
                          kind: 'findOwnerSpawnedAbilityEntities',
                          parameters: {
                            saveToContextKey: 'swords',
                            abilityEntityIds: [
                              'abilityentity_chr_0030_zhuangfy_normal_skill_sword',
                              'abilityentity_chr_0030_zhuangfy_normal_skill_sword_ult',
                            ],
                          },
                        },
                        next: 'checkCondition_opt2',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'sword_duration' },
                      },
                      data_2: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'remain_sword_limit' },
                      },
                      data_3: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                      },
                      data_4: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'swordsForLimit', fallback: 0 },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'remain_sword_limit', fallback: 0 },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_4' },
                          operator: 'greaterOrEqual',
                          right: { kind: 'valueNode', nodeId: 'data_5' },
                        },
                      },
                      data_7: {
                        type: 'boolean',
                        expression: {
                          kind: 'entityCountCompare',
                          target: { kind: 'context', key: 'swords' },
                          containsHittableTarget: false,
                          excludeDeadEntity: false,
                          operator: 'greaterOrEqual',
                          value: 0,
                          outputKey: 'swordsForLimit',
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
        next: 'finishBuffsById_15',
      },
      createSpatialPointTargets_17: {
        action: {
          kind: 'createSpatialPointTargets',
          parameters: { saveToContextKey: 'swordPos', count: { kind: 'constant', value: 3 } },
        },
        next: 'launchProjectile_16',
      },
      modifyActionValue_18: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: '__endaxis_target_group_count:swordPos',
            operation: 'assign',
            value: { kind: 'constant', value: 3 },
          },
        },
        next: 'createSpatialPointTargets_17',
      },
      createSpatialPointTargets_13: {
        action: {
          kind: 'createSpatialPointTargets',
          parameters: { saveToContextKey: 'swordPos', count: { kind: 'constant', value: 4 } },
        },
        next: 'launchProjectile_16',
      },
      modifyActionValue_14: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: '__endaxis_target_group_count:swordPos',
            operation: 'assign',
            value: { kind: 'constant', value: 4 },
          },
        },
        next: 'createSpatialPointTargets_13',
      },
      ifElse_46: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_25' },
          whenTrue: { $sequence: 'modifyActionValue_14' },
          whenFalse: { $sequence: 'modifyActionValue_18' },
        },
        next: null,
      },
      checkCondition_45: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_17' } },
        },
        next: null,
      },
      ifElse_opt15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_45' },
          whenTrue: { $sequence: 'ifElse_46' },
          whenFalse: { $sequence: 'ifElse_opt14' },
        },
        next: null,
      },
      applyBuff_opt16: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar' }],
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'ifElse_opt15',
      },
      checkCondition_48: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_18' } },
        },
        next: null,
      },
      ifElse_opt17: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_48' },
          whenTrue: { $sequence: 'applyBuff_opt16' },
          whenFalse: { $sequence: 'spawnAbilityEntity_51' },
        },
        next: null,
      },
      applyBuff_53: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_talent1' }],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_56: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'applyBuff_53' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_54: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: null,
      },
      ifElse_57: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_54' },
          whenTrue: { $sequence: 'applyBuff_53' },
          whenFalse: { $sequence: 'ifElse_56' },
        },
        next: null,
      },
      spawnAbilityEntity_58: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'thunderPos' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_ult',
            childSkillId: 'chr_0030_zhuangfy_normal_skill_ult_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: true,
            blackboardAssignments: { EntityBB_SwordNum: { kind: 'valueNode', nodeId: 'data_19' } },
          },
        },
        next: null,
      },
      calculateActionValue_59: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_up_final',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_20' },
            right: { kind: 'valueNode', nodeId: 'data_21' },
          },
        },
        next: 'spawnAbilityEntity_58',
      },
      checkCondition_61: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_22' } },
        },
        next: 'finishBuffsById_15',
      },
      checkCondition_63: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_24' } },
        },
        next: null,
      },
      checkCondition_62: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_25' } },
        },
        next: null,
      },
      anyCondition_64: {
        action: {
          kind: 'anyCondition',
          parameters: {},
          conditions: [{ $sequence: 'checkCondition_62' }, { $sequence: 'checkCondition_63' }],
        },
        next: null,
      },
      jumpTimeline_65: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 100 },
          condition: { $sequence: 'anyCondition_64' },
        },
        next: null,
      },
      ifElse_68: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_45' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_70: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_23' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_68' },
        },
        next: null,
      },
      ifElse_71: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_27' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_70' },
        },
        next: null,
      },
      checkCondition_72: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_26' } },
        },
        next: 'ifElse_71',
      },
      holdBuffsById_73: {
        action: {
          kind: 'holdBuffsById',
          parameters: { target: 'caster', buffIds: ['buff_chr_0030_zhuangfy_ult_base'] },
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
          kind: 'abilityEntityRemainingDurationCompare',
          operator: 'less',
          value: { kind: 'constant', value: 3 },
        },
      },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_SwordNum', fallback: 0 },
      },
      data_3: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'free_sword_limit', fallback: 0 },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'less',
          right: { kind: 'valueNode', nodeId: 'data_3' },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0030_zhuangfy_potential1_more_sword'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_6: {
        type: 'number',
        expression: { kind: 'blackboard', key: '__endaxis_target_group_count:swordPos' },
      },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'sword_gene_num' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'sword_gene_num' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'max_conduct_sword' } },
      data_10: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'sword_gene_num', fallback: 0 },
      },
      data_11: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'max_conduct_sword', fallback: 0 },
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
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return' } },
      data_14: { type: 'number', expression: { kind: 'blackboard', key: 'conductCnt' } },
      data_15: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_16: {
        type: 'number',
        expression: { kind: 'blackboard', key: '__endaxis_target_group_count:swordPos' },
      },
      data_17: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0030_zhuangfy_ult_skill_free'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
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
      data_19: { type: 'number', expression: { kind: 'blackboard', key: 'EntityBB_SwordNum' } },
      data_20: { type: 'number', expression: { kind: 'blackboard', key: 'conductCnt' } },
      data_21: { type: 'number', expression: { kind: 'blackboard', key: 'atk_up_per_conduct' } },
      data_22: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0030_zhuangfy_ult_skill_free'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_23: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_SwordNum', fallback: 0 },
      },
      data_24: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_23' },
          operator: 'equal',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_25: {
        type: 'boolean',
        expression: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'skillEnd' },
      },
      data_26: {
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

export const zhuangFangyiChr_0030_zhuangfy_normal_skill_ult: SkillDefinition = {
  key: 'chr_0030_zhuangfy_normal_skill_ult',
  element: 'electric',
  blackboard: {
    atb_return: 0,
    atk_scale: [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
    atk_up_final: 0,
    atk_up_per_conduct: [0.08, 0.09, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18],
    conductCnt: 0,
    final_rate: 6,
    free_sword_limit: 3,
    max_conduct_sword: 3,
    poise: 15,
    remain_sword_limit: 9,
    sword_duration: 36,
    sword_gene_num: 0,
  },
  timelineBlockFrames: 30,
  naturalDurationFrames: 210,
  exclusiveFrame: 143,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 30,
        endFrame: 143,
        skillIds: [
          'chr_0030_zhuangfy_attack1_ult',
          'chr_0030_zhuangfy_attack2_ult',
          'chr_0030_zhuangfy_attack3_ult',
          'chr_0030_zhuangfy_normal_skill_ult',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 12, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_9' } },
    { startFrame: 5, endFrame: 6, sequence: { $sequence: 'ifElse_opt17' } },
    { startFrame: 5, endFrame: 6, sequence: { $sequence: 'ifElse_57' } },
    { startFrame: 15, endFrame: 18, sequence: { $sequence: 'calculateActionValue_59' } },
    { startFrame: 100, endFrame: 103, sequence: { $sequence: 'checkCondition_61' } },
    { startFrame: 16, endFrame: 100, sequence: { $sequence: 'jumpTimeline_65' } },
    { startFrame: 0, endFrame: 15, sequence: { $sequence: 'checkCondition_72' } },
    { startFrame: 0, endFrame: 18, sequence: { $sequence: 'holdBuffsById_73' } },
  ],
  smartTarget: 'enemy',
  costs: [{ resource: 'sp', value: 100 }],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_normal_skill_ultActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_combo_skillActionGraph = {
  main: {
    nodes: {
      startTimeDilation_1: {
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
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'conductCnt',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
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
      modifyActionValue_5: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'conductCnt',
            operation: 'assign',
            value: { kind: 'constant', value: 4 },
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
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_pulse_pulse_conduct_triggered',
                copiedBlackboardAssignments: { count: 'conductCnt' },
              },
            ],
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'modifyActionValue_5' },
          whenFalse: { $sequence: null },
        },
        next: 'applyBuff_7',
      },
      ifElse_9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'modifyActionValue_3' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_8',
      },
      modifyActionValue_10: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'conductCnt',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_5' },
          },
        },
        next: 'ifElse_9',
      },
      readBuffStackCount_11: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'enemy',
            outputKey: 'inflictCnt',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
            },
          },
        },
        next: 'modifyActionValue_10',
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'readBuffStackCount_11' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      changeResource_13: {
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
      calculateActionValue_14: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'usp_extra',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_7' },
            right: { kind: 'valueNode', nodeId: 'data_8' },
          },
        },
        next: 'changeResource_13',
      },
      changeResource_15: {
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
        next: 'calculateActionValue_14',
      },
      ifElse_16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'changeResource_15' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      startTimeDilation_17: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.3 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: 'ifElse_16',
      },
      finishBuffsByTag_18: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
            reason: 'early',
          },
        },
        next: 'startTimeDilation_17',
      },
      dealDamage_19: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_10' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_11' },
          },
        },
        next: 'finishBuffsByTag_18',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'conductCnt', fallback: 0 },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'greater',
          right: { kind: 'constant', value: 4 },
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
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'inflictCnt' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'usp_extra' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'usp_extra' } },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'inflictCnt' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
      data_10: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_11: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_combo_skill: SkillDefinition = {
  key: 'chr_0030_zhuangfy_combo_skill',
  element: 'electric',
  blackboard: {
    atk_scale: [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    conductCnt: 0,
    inflictCnt: 0,
    poise: 10,
    usp: 10,
    usp_extra: 10,
  },
  timelineBlockFrames: 25,
  naturalDurationFrames: 210,
  exclusiveFrame: 60,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 25,
        endFrame: 60,
        skillIds: [
          'chr_0030_zhuangfy_normal_skill',
          'chr_0030_zhuangfy_power_attack',
          'chr_0030_zhuangfy_attack1',
          'chr_0030_zhuangfy_attack2',
          'chr_0030_zhuangfy_attack3',
          'chr_0030_zhuangfy_attack4',
          'chr_0030_zhuangfy_attack5',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 15, sequence: { $sequence: 'startTimeDilation_1' } },
    { startFrame: 24, endFrame: 27, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 24, endFrame: 27, sequence: { $sequence: 'dealDamage_19' } },
  ],
  smartTarget: 'enemy',
  cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'comboSkill',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_combo_skillActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_combo_skill_ultActionGraph = {
  main: {
    nodes: {
      startTimeDilation_1: {
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
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'conductCnt',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
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
      modifyActionValue_5: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'conductCnt',
            operation: 'assign',
            value: { kind: 'constant', value: 4 },
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
      applyBuff_7: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_pulse_pulse_conduct_triggered',
                copiedBlackboardAssignments: { count: 'conductCnt' },
              },
            ],
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'modifyActionValue_5' },
          whenFalse: { $sequence: null },
        },
        next: 'applyBuff_7',
      },
      ifElse_9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'modifyActionValue_3' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_8',
      },
      modifyActionValue_10: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'conductCnt',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_5' },
          },
        },
        next: 'ifElse_9',
      },
      readBuffStackCount_11: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'enemy',
            outputKey: 'inflictCnt',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
            },
          },
        },
        next: 'modifyActionValue_10',
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'readBuffStackCount_11' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      createTimedMarker_13: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            target: 'enemy',
            markerId: 'zhuangfy_combo_ult_tar',
            durationSeconds: { kind: 'constant', value: 0.5 },
            autoFinishByAction: false,
          },
        },
        next: null,
      },
      startTimeDilation_14: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.3 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: 'createTimedMarker_13',
      },
      finishBuffsByTag_15: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
            reason: 'early',
          },
        },
        next: 'startTimeDilation_14',
      },
      dealDamage_16: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_6' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_7' },
          },
        },
        next: 'finishBuffsByTag_15',
      },
      launchProjectile_17: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 0.5,
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0030_zhuangfy_combo_skill_ring_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atk_scale: 1.43, poise: 0, swordNum: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { $sequence: 'forEachContextTarget_3' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      applyBuff_1: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0030_zhuangfy_combo_skill_ring_hit',
                                copiedBlackboardAssignments: {
                                  atk_scale: 'atk_scale',
                                  poise: 'poise',
                                },
                              },
                            ],
                            target: 'enemy',
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
                      forEachContextTarget_3: {
                        action: {
                          kind: 'forEachContextTarget',
                          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                          body: { $sequence: 'checkCondition_2' },
                        },
                        next: null,
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'boolean',
                        expression: {
                          kind: 'timedMarkerPresent',
                          target: 'enemy',
                          markerId: 'zhuangfy_combo_ult_tar',
                        },
                      },
                      data_2: {
                        type: 'boolean',
                        expression: {
                          kind: 'not',
                          condition: { kind: 'conditionNode', nodeId: 'data_1' },
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
      holdBuffsById_18: {
        action: {
          kind: 'holdBuffsById',
          parameters: { target: 'caster', buffIds: ['buff_chr_0030_zhuangfy_ult_base'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'conductCnt', fallback: 0 },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'greater',
          right: { kind: 'constant', value: 4 },
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
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'inflictCnt' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_combo_skill_ult: SkillDefinition = {
  key: 'chr_0030_zhuangfy_combo_skill_ult',
  element: 'electric',
  blackboard: {
    atk_scale: [2.4, 2.64, 2.88, 3.12, 3.36, 3.6, 3.84, 4.08, 4.32, 4.62, 4.98, 5.4],
    conductCnt: 0,
    inflictCnt: 0,
    poise: 10,
  },
  timelineBlockFrames: 25,
  naturalDurationFrames: 197,
  exclusiveFrame: 30,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 25,
        endFrame: 54,
        skillIds: [
          'chr_0030_zhuangfy_normal_skill_ult',
          'chr_0030_zhuangfy_attack1_ult',
          'chr_0030_zhuangfy_attack2_ult',
          'chr_0030_zhuangfy_attack3_ult',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 15, sequence: { $sequence: 'startTimeDilation_1' } },
    { startFrame: 24, endFrame: 27, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 24, endFrame: 27, sequence: { $sequence: 'dealDamage_16' } },
    { startFrame: 24, endFrame: 27, sequence: { $sequence: 'launchProjectile_17' } },
    { startFrame: 0, endFrame: 28, sequence: { $sequence: 'holdBuffsById_18' } },
  ],
  smartTarget: 'enemy',
  cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_combo_skill_ultActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_ultimate_skillActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_potential5_vfx' }],
            target: 'currentAbilityEntity',
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
        next: null,
      },
      forEachContextTarget_3: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'ult_postmodel_mirror' } },
          body: { $sequence: 'applyBuff_1' },
        },
        next: null,
      },
      ifElse_4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'forEachContextTarget_3' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      spawnAbilityEntity_5: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'abPosMirror' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_ult_mirror',
            inheritActionBlackboard: true,
            dieWhenSourceDies: true,
            finishByAction: true,
            overrideDurationSeconds: { kind: 'constant', value: 0.83 },
            saveToContextKey: 'ult_postmodel_mirror',
          },
        },
        next: 'ifElse_4',
      },
      spawnAbilityEntity_6: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'abPosMirror' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_ult',
            inheritActionBlackboard: true,
            dieWhenSourceDies: true,
            finishByAction: true,
            overrideDurationSeconds: { kind: 'constant', value: 2.7 },
            saveToContextKey: 'ult_postmodel',
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
                buffId: 'buff_chr_0030_zhuangfy_ult_base',
                copiedBlackboardAssignments: {
                  duration: 'duration',
                  combo_cd_rate: 'combo_cd_rate',
                },
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      startTimeDilation_8: {
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
      startUltimateTimeDilation_9: {
        action: {
          kind: 'startUltimateTimeDilation',
          parameters: {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
            ignoredAbilityEntityTargets: [
              { kind: 'context', contextKey: 'ult_postmodel_mirror' },
              { kind: 'context', contextKey: 'ult_postmodel' },
            ],
          },
        },
        next: null,
      },
      hideUi_10: { action: { kind: 'hideUi', parameters: { onlyBlockInput: false } }, next: null },
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
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0030_zhuangfy_potential5_vfx'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_ultimate_skill: SkillDefinition = {
  key: 'chr_0030_zhuangfy_ultimate_skill',
  element: 'electric',
  blackboard: { combo_cd_rate: 4, duration: 25 },
  timelineBlockFrames: 91,
  naturalDurationFrames: 208,
  exclusiveFrame: 90,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 17, sequence: { $sequence: 'spawnAbilityEntity_5' } },
    { startFrame: 0, endFrame: 78, sequence: { $sequence: 'spawnAbilityEntity_6' } },
    { startFrame: 78, endFrame: 81, sequence: { $sequence: 'applyBuff_7' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'startTimeDilation_8' } },
    { startFrame: 0, endFrame: 78, sequence: { $sequence: 'startUltimateTimeDilation_9' } },
    { startFrame: 0, endFrame: 78, sequence: { $sequence: 'hideUi_10' } },
    { startFrame: 0, endFrame: 90, sequence: { $sequence: 'applyBuff_11' } },
  ],
  cooldownFrames: 450,
  costs: [{ resource: 'ultimateEnergy', value: 240 }],
  enhancementStateBuffId: 'buff_chr_0030_zhuangfy_ult_base',
  skillType: 'ultimate',
  levelSource: 'ultimate',
  nativeSkillType: 'ultimateSkill',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_ultimate_skillActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_ultimate_skill_endActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_hide_model'],
            reason: 'other',
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_ultimate_skill_end: SkillDefinition = {
  actionGraph: zhuangFangyiChr_0030_zhuangfy_ultimate_skill_endActionGraph,
  key: 'chr_0030_zhuangfy_ultimate_skill_end',
  element: 'physical',
  blackboard: { atk_scale: 0.7 },
  timelineBlockFrames: 21,
  naturalDurationFrames: 189,
  exclusiveFrame: 20,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_1' } },
  ],
  skillType: 'ultimate',
  levelSource: 'ultimate',
  nativeSkillType: 'normalSkill',
};

export const zhuangFangyiChr_0030_zhuangfy_attack1_ultActionGraph = {
  main: {
    nodes: {
      holdBuffsById_1: {
        action: {
          kind: 'holdBuffsById',
          parameters: { target: 'caster', buffIds: ['buff_chr_0030_zhuangfy_ult_base'] },
        },
        next: null,
      },
      modifyActionValue_8: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'target_in_range',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      spawnAbilityEntity_9: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: {
              kind: 'fixedPoint',
              owner: { kind: 'owner' },
              directionTarget: { kind: 'inputTarget' },
              center: { kind: 'inputTarget' },
            },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_1_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: 'modifyActionValue_8',
      },
      spawnAbilityEntity_7: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_1_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
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
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'spawnAbilityEntity_7' },
          whenFalse: { $sequence: 'spawnAbilityEntity_9' },
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
      ifElse_11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'spawnAbilityEntity_9' },
          whenFalse: { $sequence: 'spawnAbilityEntity_7' },
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
          whenTrue: { $sequence: 'ifElse_11' },
          whenFalse: { $sequence: 'ifElse_12' },
        },
        next: null,
      },
      spawnAbilityEntity_19: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: {
              kind: 'fixedPoint',
              owner: { kind: 'owner' },
              directionTarget: { kind: 'inputTarget' },
              center: { kind: 'inputTarget' },
            },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_2_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      spawnAbilityEntity_18: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_2_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      ifElse_22: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'spawnAbilityEntity_18' },
          whenFalse: { $sequence: 'spawnAbilityEntity_19' },
        },
        next: null,
      },
      checkCondition_14: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_21: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_14' },
          whenTrue: { $sequence: 'spawnAbilityEntity_19' },
          whenFalse: { $sequence: 'spawnAbilityEntity_18' },
        },
        next: null,
      },
      ifElse_23: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'ifElse_21' },
          whenFalse: { $sequence: 'ifElse_22' },
        },
        next: null,
      },
      spawnAbilityEntity_29: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: {
              kind: 'fixedPoint',
              owner: { kind: 'owner' },
              directionTarget: { kind: 'inputTarget' },
              center: { kind: 'inputTarget' },
            },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_3_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      spawnAbilityEntity_28: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_3_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      ifElse_32: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'spawnAbilityEntity_28' },
          whenFalse: { $sequence: 'spawnAbilityEntity_29' },
        },
        next: null,
      },
      ifElse_31: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_14' },
          whenTrue: { $sequence: 'spawnAbilityEntity_29' },
          whenFalse: { $sequence: 'spawnAbilityEntity_28' },
        },
        next: null,
      },
      ifElse_33: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'ifElse_31' },
          whenFalse: { $sequence: 'ifElse_32' },
        },
        next: null,
      },
      spawnAbilityEntity_39: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: {
              kind: 'fixedPoint',
              owner: { kind: 'owner' },
              directionTarget: { kind: 'inputTarget' },
              center: { kind: 'inputTarget' },
            },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_4_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      spawnAbilityEntity_38: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_4_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      ifElse_42: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_6' },
          whenTrue: { $sequence: 'spawnAbilityEntity_38' },
          whenFalse: { $sequence: 'spawnAbilityEntity_39' },
        },
        next: null,
      },
      ifElse_41: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_14' },
          whenTrue: { $sequence: 'spawnAbilityEntity_39' },
          whenFalse: { $sequence: 'spawnAbilityEntity_38' },
        },
        next: null,
      },
      ifElse_43: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'ifElse_41' },
          whenFalse: { $sequence: 'ifElse_42' },
        },
        next: null,
      },
      reachSkillOperableBoundary_44: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack2_ult'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_45: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack1_ult'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 12,
          lessThan: true,
          includeTargetRadius: true,
          containsHittableObject: true,
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'inputTarget' },
          containsHittableTarget: true,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_4: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'target_in_range', fallback: 0 },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_4' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_attack1_ult: SkillDefinition = {
  key: 'chr_0030_zhuangfy_attack1_ult',
  element: 'electric',
  blackboard: {
    atb: 0,
    atk_scale: [0.67, 0.73, 0.8, 0.86, 0.93, 1, 1.06, 1.13, 1.2, 1.28, 1.38, 1.5],
    target_in_range: 0,
  },
  timelineBlockFrames: 22,
  naturalDurationFrames: 160,
  exclusiveFrame: 135,
  offsetRecordFrame: 14,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 60,
        input: 'basicAttack',
        targetSkillId: 'chr_0030_zhuangfy_attack2_ult',
      },
    ],
    allowedNextSkills: [
      { startFrame: 22, endFrame: 60, skillIds: ['chr_0030_zhuangfy_attack2_ult'] },
      { startFrame: 60, endFrame: 135, skillIds: ['chr_0030_zhuangfy_attack1_ult'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 22, sequence: { $sequence: 'holdBuffsById_1' } },
    { startFrame: 12, endFrame: 13, sequence: { $sequence: 'ifElse_13' } },
    { startFrame: 13, endFrame: 14, sequence: { $sequence: 'ifElse_23' } },
    { startFrame: 14, endFrame: 15, sequence: { $sequence: 'ifElse_33' } },
    { startFrame: 15, endFrame: 16, sequence: { $sequence: 'ifElse_43' } },
    { startFrame: 22, endFrame: 60, sequence: { $sequence: 'reachSkillOperableBoundary_44' } },
    { startFrame: 60, endFrame: 135, sequence: { $sequence: 'reachSkillOperableBoundary_45' } },
  ],
  timelineContinuationSkillId: 'chr_0030_zhuangfy_attack2_ult',
  skillType: 'basicAttack',
  levelSource: 'ultimate',
  nativeSkillType: 'attack',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_attack1_ultActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_attack2_ultActionGraph = {
  main: {
    nodes: {
      modifyActionValue_7: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'target_in_range',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      spawnAbilityEntity_8: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: {
              kind: 'fixedPoint',
              owner: { kind: 'owner' },
              directionTarget: { kind: 'inputTarget' },
              center: { kind: 'inputTarget' },
            },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_1_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: 'modifyActionValue_7',
      },
      spawnAbilityEntity_6: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_1_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
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
      ifElse_11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'spawnAbilityEntity_6' },
          whenFalse: { $sequence: 'spawnAbilityEntity_8' },
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
      ifElse_10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'spawnAbilityEntity_8' },
          whenFalse: { $sequence: 'spawnAbilityEntity_6' },
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
          whenTrue: { $sequence: 'ifElse_10' },
          whenFalse: { $sequence: 'ifElse_11' },
        },
        next: null,
      },
      spawnAbilityEntity_18: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: {
              kind: 'fixedPoint',
              owner: { kind: 'owner' },
              directionTarget: { kind: 'inputTarget' },
              center: { kind: 'inputTarget' },
            },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_2_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      spawnAbilityEntity_17: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_2_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      ifElse_21: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'spawnAbilityEntity_17' },
          whenFalse: { $sequence: 'spawnAbilityEntity_18' },
        },
        next: null,
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_20: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'spawnAbilityEntity_18' },
          whenFalse: { $sequence: 'spawnAbilityEntity_17' },
        },
        next: null,
      },
      ifElse_22: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_20' },
          whenFalse: { $sequence: 'ifElse_21' },
        },
        next: null,
      },
      spawnAbilityEntity_28: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: {
              kind: 'fixedPoint',
              owner: { kind: 'owner' },
              directionTarget: { kind: 'inputTarget' },
              center: { kind: 'inputTarget' },
            },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_3_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      spawnAbilityEntity_27: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_3_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      ifElse_31: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'spawnAbilityEntity_27' },
          whenFalse: { $sequence: 'spawnAbilityEntity_28' },
        },
        next: null,
      },
      ifElse_30: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'spawnAbilityEntity_28' },
          whenFalse: { $sequence: 'spawnAbilityEntity_27' },
        },
        next: null,
      },
      ifElse_32: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_30' },
          whenFalse: { $sequence: 'ifElse_31' },
        },
        next: null,
      },
      spawnAbilityEntity_38: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: {
              kind: 'fixedPoint',
              owner: { kind: 'owner' },
              directionTarget: { kind: 'inputTarget' },
              center: { kind: 'inputTarget' },
            },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_4_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      spawnAbilityEntity_37: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack_ult',
            childSkillId: 'chr_0030_zhuangfy_attack1_ult_4_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
          },
        },
        next: null,
      },
      ifElse_41: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'spawnAbilityEntity_37' },
          whenFalse: { $sequence: 'spawnAbilityEntity_38' },
        },
        next: null,
      },
      ifElse_40: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'spawnAbilityEntity_38' },
          whenFalse: { $sequence: 'spawnAbilityEntity_37' },
        },
        next: null,
      },
      ifElse_42: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_40' },
          whenFalse: { $sequence: 'ifElse_41' },
        },
        next: null,
      },
      holdBuffsById_43: {
        action: {
          kind: 'holdBuffsById',
          parameters: { target: 'caster', buffIds: ['buff_chr_0030_zhuangfy_ult_base'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_44: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack3_ult'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_45: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack1_ult'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 12,
          lessThan: true,
          includeTargetRadius: true,
          containsHittableObject: true,
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'inputTarget' },
          containsHittableTarget: true,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_4: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'target_in_range', fallback: 0 },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_4' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_attack2_ult: SkillDefinition = {
  key: 'chr_0030_zhuangfy_attack2_ult',
  element: 'electric',
  blackboard: {
    atk_scale: [0.94, 1.03, 1.12, 1.22, 1.31, 1.4, 1.5, 1.59, 1.68, 1.8, 1.94, 2.1],
    target_in_range: 0,
  },
  timelineBlockFrames: 27,
  naturalDurationFrames: 155,
  exclusiveFrame: 120,
  offsetRecordFrame: 12,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 60,
        input: 'basicAttack',
        targetSkillId: 'chr_0030_zhuangfy_attack3_ult',
      },
    ],
    allowedNextSkills: [
      { startFrame: 27, endFrame: 60, skillIds: ['chr_0030_zhuangfy_attack3_ult'] },
      { startFrame: 60, endFrame: 120, skillIds: ['chr_0030_zhuangfy_attack1_ult'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 10, endFrame: 11, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 11, endFrame: 12, sequence: { $sequence: 'ifElse_22' } },
    { startFrame: 12, endFrame: 13, sequence: { $sequence: 'ifElse_32' } },
    { startFrame: 13, endFrame: 14, sequence: { $sequence: 'ifElse_42' } },
    { startFrame: 0, endFrame: 17, sequence: { $sequence: 'holdBuffsById_43' } },
    { startFrame: 27, endFrame: 60, sequence: { $sequence: 'reachSkillOperableBoundary_44' } },
    { startFrame: 60, endFrame: 120, sequence: { $sequence: 'reachSkillOperableBoundary_45' } },
  ],
  timelineContinuationSkillId: 'chr_0030_zhuangfy_attack3_ult',
  skillType: 'basicAttack',
  levelSource: 'ultimate',
  nativeSkillType: 'attack',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_attack2_ultActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_attack3_ultActionGraph = {
  main: {
    nodes: {
      spawnAbilityEntity_6: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: {
              kind: 'fixedPoint',
              owner: { kind: 'owner' },
              directionTarget: { kind: 'source' },
              center: { kind: 'inputTarget' },
            },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack3_ult',
            childSkillId: 'chr_0030_zhuangfy_attack3_ult_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            saveToContextKey: 'thunder',
          },
        },
        next: null,
      },
      spawnAbilityEntity_5: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'source' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack3_ult',
            childSkillId: 'chr_0030_zhuangfy_attack3_ult_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            saveToContextKey: 'thunder',
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
      ifElse_9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'spawnAbilityEntity_5' },
          whenFalse: { $sequence: 'spawnAbilityEntity_6' },
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
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'spawnAbilityEntity_6' },
          whenFalse: { $sequence: 'spawnAbilityEntity_5' },
        },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'ifElse_8' },
          whenFalse: { $sequence: 'ifElse_9' },
        },
        next: null,
      },
      applyBuff_11: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_attack3_ult_cancel' }],
            target: 'currentAbilityEntity',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0030_zhuangfy_attack1_ult'],
          },
        },
        next: null,
      },
      forEachContextTarget_12: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'thunder' } },
          body: { $sequence: 'applyBuff_11' },
        },
        next: null,
      },
      holdBuffsById_13: {
        action: {
          kind: 'holdBuffsById',
          parameters: { target: 'caster', buffIds: ['buff_chr_0030_zhuangfy_ult_base'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_14: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0030_zhuangfy_attack1_ult'] },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'inputTarget' },
          distance: 12,
          lessThan: true,
          includeTargetRadius: true,
          containsHittableObject: true,
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'inputTarget' },
          containsHittableTarget: true,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_attack3_ult: SkillDefinition = {
  key: 'chr_0030_zhuangfy_attack3_ult',
  element: 'electric',
  blackboard: {
    atb: 20,
    atk_scale: [1.34, 1.47, 1.6, 1.74, 1.87, 2, 2.14, 2.27, 2.4, 2.57, 2.77, 3],
    poise: 18,
  },
  timelineBlockFrames: 60,
  naturalDurationFrames: 179,
  exclusiveFrame: 140,
  offsetRecordFrame: 33,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 0,
        endFrame: 140,
        input: 'basicAttack',
        targetSkillId: 'chr_0030_zhuangfy_attack1_ult',
      },
    ],
    allowedNextSkills: [
      { startFrame: 60, endFrame: 140, skillIds: ['chr_0030_zhuangfy_attack1_ult'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 3, endFrame: 6, sequence: { $sequence: 'ifElse_10' } },
    { startFrame: 3, endFrame: 179, sequence: { $sequence: 'forEachContextTarget_12' } },
    { startFrame: 0, endFrame: 35, sequence: { $sequence: 'holdBuffsById_13' } },
    { startFrame: 60, endFrame: 140, sequence: { $sequence: 'reachSkillOperableBoundary_14' } },
  ],
  timelineContinuationSkillId: 'chr_0030_zhuangfy_attack1_ult',
  skillType: 'basicAttack',
  levelSource: 'ultimate',
  nativeSkillType: 'attack',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_attack3_ultActionGraph,
};

export const zhuangFangyiChr_0030_zhuangfy_perfect_dodgeActionGraph = {
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
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const zhuangFangyiChr_0030_zhuangfy_perfect_dodge: SkillDefinition = {
  key: 'chr_0030_zhuangfy_perfect_dodge',
  blackboard: {},
  timelineBlockFrames: 16,
  naturalDurationFrames: 15,
  exclusiveFrame: 15,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_2' } },
    { startFrame: 0, endFrame: 4, sequence: { $sequence: 'ifElse_2' } },
    { startFrame: 0, endFrame: 9, sequence: { $sequence: 'ifElse_2' } },
    { startFrame: 0, endFrame: 11, sequence: { $sequence: 'ifElse_2' } },
  ],
  skillType: 'dodge',
  nativeSkillType: 'dodge',
  actionGraph: zhuangFangyiChr_0030_zhuangfy_perfect_dodgeActionGraph,
};

const zhuangFangyiPassive1ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0030_zhuangfy_passive_check_sword',
                blackboardAssignments: { swordRange: { kind: 'valueNode', nodeId: 'data_1' } },
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
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'swordRange' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiPassive1: OperatorPassiveSkillDefinition = {
  key: 'chr_0030_zhuangfy_check_sword_passive',
  blackboard: { swordRange: 50 },
  enableSequence: { $sequence: 'applyBuff_1' },
  actionGraph: zhuangFangyiPassive1ActionGraph,
};

const zhuangFangyiPassive2ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0030_zhuangfy_talent1_base',
                copiedBlackboardAssignments: {
                  duration: 'duration',
                  base_rate: 'base_rate',
                  enhance_rate: 'enhance_rate',
                },
              },
            ],
            target: 'caster',
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
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0030_zhuangfy_talent1'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiPassive2: OperatorPassiveSkillDefinition = {
  key: 'chr_0030_zhuangfy_talent1',
  blackboard: { base_rate: [0.09, 0.18], duration: [5, 5], enhance_rate: [0.01, 0.02] },
  enableSequence: { $sequence: null },
  actionGraph: zhuangFangyiPassive2ActionGraph,
  abilityEventResponses: [
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'checkCondition_2' } },
  ],
};

const zhuangFangyiPassive3ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiPassive3: OperatorPassiveSkillDefinition = {
  key: 'chr_0030_zhuangfy_talent2',
  blackboard: {
    base_rate: [0.09, 0.09],
    duration: [99, 99],
    heal: [0.09, 0.18],
    sword_rate: [0.01, 0.01],
  },
  enableSequence: { $sequence: null },
  actionGraph: zhuangFangyiPassive3ActionGraph,
};

const zhuangFangyiComboCondition1ActionGraph = {
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
        expression: { kind: 'actionInputTargetObjectTypeMatch', objectTypes: ['enemy'] },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'actionInputTarget',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetIdentityMatch',
          contextKey: 'trigger',
          other: 'controlledOperator',
          operator: 'equal',
        },
      },
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

const zhuangFangyiComboCondition1: ComboSkillConditionDefinition = {
  key: 'native-combo:0',
  skillKey: 'chr_0030_zhuangfy_combo_skill',
  event: 'beforeOutputDamage',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'checkCondition_4' },
  actionGraph: zhuangFangyiComboCondition1ActionGraph,
};

const zhuangFangyiComboCondition2ActionGraph = {
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
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'checkCondition_4',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: { kind: 'actionInputTargetObjectTypeMatch', objectTypes: ['enemy'] },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'actionInputTarget',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetIdentityMatch',
          contextKey: 'trigger',
          other: 'controlledOperator',
          operator: 'equal',
        },
      },
      data_4: {
        type: 'boolean',
        expression: { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['powerAttack'] },
      },
      data_5: {
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

const zhuangFangyiComboCondition2: ComboSkillConditionDefinition = {
  key: 'native-combo:1',
  skillKey: 'chr_0030_zhuangfy_combo_skill',
  event: 'beforeOutputDamage',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'checkCondition_5' },
  actionGraph: zhuangFangyiComboCondition2ActionGraph,
};

const zhuangFangyiBuff1ActionGraph = {
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

const zhuangFangyiBuff1: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 1,
  maxStackCount: 1,
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
  blackboard: { cancel_mark: 0 },
  attributeModifiers: [],
  lifecycleSequences: { finish: { $sequence: 'finishOwner_1' } },
  actionGraph: zhuangFangyiBuff1ActionGraph,
};

const zhuangFangyiBuff2ActionGraph = {
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
            key: 'conductCnt',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      modifyActionValue_4: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'conductCnt',
            operation: 'assign',
            value: { kind: 'constant', value: 4 },
          },
        },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      applyBuff_6: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_pulse_pulse_conduct_triggered',
                copiedBlackboardAssignments: { count: 'conductCnt' },
              },
            ],
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_3' },
          whenTrue: { $sequence: 'modifyActionValue_4' },
          whenFalse: { $sequence: null },
        },
        next: 'applyBuff_6',
      },
      ifElse_8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'modifyActionValue_2' },
          whenFalse: { $sequence: null },
        },
        next: 'ifElse_7',
      },
      modifyActionValue_9: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'conductCnt',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_5' },
          },
        },
        next: 'ifElse_8',
      },
      readBuffStackCount_10: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'buffOwner',
            outputKey: 'inflictCnt',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
            },
          },
        },
        next: 'modifyActionValue_9',
      },
      ifElse_11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'readBuffStackCount_10' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      startTimeDilation_12: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.3 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          },
        },
        next: null,
      },
      finishBuffsByTag_13: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            target: 'buffOwner',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
            reason: 'other',
          },
        },
        next: 'startTimeDilation_12',
      },
      dealDamage_14: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_6' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_7' },
          },
        },
        next: 'finishBuffsByTag_13',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'buffOwner',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'conductCnt', fallback: 0 },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'greater',
          right: { kind: 'constant', value: 4 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'buffOwner',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'inflictCnt' } },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff2: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 5,
  durationSeconds: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_scale: 0, conductCnt: 0, inflictCnt: 0, poise: 0 },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 12, endFrame: 15, sequence: { $sequence: 'ifElse_11' } },
    { startFrame: 12, endFrame: 15, sequence: { $sequence: 'dealDamage_14' } },
  ],
  actionGraph: zhuangFangyiBuff2ActionGraph,
};

const zhuangFangyiBuff3ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_2: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'swordTar',
            abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_fake_target'],
          },
        },
        next: null,
      },
      findOwnerSpawnedAbilityEntities_3: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'sword',
            abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_sword'],
            maxTargets: 128,
          },
        },
        next: null,
      },
      ifElse_4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'findOwnerSpawnedAbilityEntities_2' },
          whenFalse: { $sequence: null },
        },
        next: 'findOwnerSpawnedAbilityEntities_3',
      },
      calculateActionValue_5: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_2' },
            right: { kind: 'valueNode', nodeId: 'data_3' },
          },
        },
        next: 'ifElse_4',
      },
      applyBuff_6: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0030_zhuangfy_sword_triggerd',
                copiedBlackboardAssignments: {
                  swordIndex: 'swordIndex',
                  swordCnt: 'EntityBB_SwordNum',
                  atk_scale: 'atk_scale',
                  poise: 'poise',
                  usp_extra: 'usp_extra',
                  remain_sword_limit: 'remain_sword_limit',
                  final_rate: 'final_rate',
                },
              },
            ],
            target: 'currentAbilityEntity',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      modifyActionValue_7: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'swordIndex',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      forEachContextTarget_8: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'swordInst' } },
          body: { $sequence: 'applyBuff_6' },
        },
        next: 'modifyActionValue_7',
      },
      pickContextTarget_9: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'sword',
            saveToContextKey: 'swordInst',
            index: { kind: 'valueNode', nodeId: 'data_4' },
          },
        },
        next: 'forEachContextTarget_8',
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'pickContextTarget_9',
      },
      finishBuffsByTag_11: {
        action: {
          kind: 'finishBuffsByTag',
          parameters: {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/chr_0030_zhuangfy/SwordTar'],
            reason: 'other',
          },
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
          operator: 'equal',
          value: 0,
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atk_up_final' } },
      data_4: { type: 'number', expression: { kind: 'blackboard', key: 'swordIndex' } },
      data_5: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'swordIndex', fallback: 0 },
      },
      data_6: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_SwordNum', fallback: 0 },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_5' },
          operator: 'less',
          right: { kind: 'valueNode', nodeId: 'data_6' },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff3: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 3,
  triggerIntervalSeconds: { blackboardKey: 'interval' },
  waitFirstTriggerInterval: true,
  maxTriggerCount: 50,
  applyTags: ['Status/DisableNormalSkill'],
  extendTags: [],
  blackboard: {
    atb_return: 0,
    atk_scale: 0,
    atk_up_final: 0,
    final_rate: 0,
    interval: 0.3,
    isUlt: 0,
    poise: 0,
    remain_sword_limit: 0,
    sword_range: 20,
    swordCnt: 0,
    swordIndex: 0,
    usp_extra: 0,
  },
  attributeModifiers: [],
  lifecycleSequences: {
    start: { $sequence: 'calculateActionValue_5' },
    trigger: { $sequence: 'checkCondition_10' },
    finish: { $sequence: 'finishBuffsByTag_11' },
  },
  actionGraph: zhuangFangyiBuff3ActionGraph,
};

const zhuangFangyiBuff4ActionGraph = {
  main: {
    nodes: {
      spawnAbilityEntity_1: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'fakePos' },
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_fake_target',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff4: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 3,
  applyTags: ['Skill/Character/chr_0030_zhuangfy/SwordTar'],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'spawnAbilityEntity_1' } },
  actionGraph: zhuangFangyiBuff4ActionGraph,
};

const zhuangFangyiBuff5ActionGraph = {
  main: {
    nodes: {
      modifyActionValue_1: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_SwordNum',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: null,
      },
      setCharacterPassiveUiValue_2: {
        action: {
          kind: 'setCharacterPassiveUiValue',
          parameters: { target: 'caster', value: { kind: 'valueNode', nodeId: 'data_2' } },
        },
        next: 'modifyActionValue_1',
      },
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'setCharacterPassiveUiValue_2',
      },
      findOwnerSpawnedAbilityEntities_4: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'swordsInRange',
            abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_sword'],
          },
        },
        next: 'checkCondition_3',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'swordsNum' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'swordsNum' } },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'context', key: 'swordsInRange' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 0,
          outputKey: 'swordsNum',
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff5: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  triggerIntervalSeconds: 0.03,
  waitFirstTriggerInterval: false,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: { swordRange: 50, swordsNum: 0 },
  attributeModifiers: [],
  lifecycleSequences: { trigger: { $sequence: 'findOwnerSpawnedAbilityEntities_4' } },
  actionGraph: zhuangFangyiBuff5ActionGraph,
};

const zhuangFangyiBuff6ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_potential1_more_sword' }],
            target: 'buffSource',
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

const zhuangFangyiBuff6: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 1,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'enterFight', priority: 0, sequence: { $sequence: 'applyBuff_1' } },
  ],
  actionGraph: zhuangFangyiBuff6ActionGraph,
};

const zhuangFangyiBuff7ActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_potential1_more_sword'],
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
        expression: { kind: 'eventSkillTypeIn', skillTypes: ['battleSkill'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff7: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 1,
  maxStackCount: 9,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'skillEnd', priority: 0, sequence: { $sequence: 'checkCondition_2' } },
  ],
  actionGraph: zhuangFangyiBuff7ActionGraph,
};

const zhuangFangyiBuff8ActionGraph = {
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
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff8: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { ignore_pulse_resist: 0 },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'attacker',
      condition: { $sequence: 'checkCondition_1' },
      processors: [
        {
          kind: 'instantAttribute',
          targetSide: 'defender',
          attribute: 'PulseResistance',
          values: { slot: 'baseAddition', value: { blackboardKey: 'ignore_pulse_resist' } },
          attributeTiming: 'runtime',
        },
      ],
    },
  ],
  actionGraph: zhuangFangyiBuff8ActionGraph,
};

const zhuangFangyiBuff9ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff9: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: zhuangFangyiBuff9ActionGraph,
};

const zhuangFangyiBuff10ActionGraph = {
  main: {
    nodes: {
      findOwnerSpawnedAbilityEntities_2: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'thunderTar',
            abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_fake_target'],
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
      modifyActionValue_3: {
        action: {
          kind: 'modifyActionValue',
          parameters: { key: 'swordCnt', operation: 'add', value: { kind: 'constant', value: -1 } },
        },
        next: null,
      },
      ifElse_4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'findOwnerSpawnedAbilityEntities_2' },
          whenFalse: { $sequence: null },
        },
        next: 'modifyActionValue_3',
      },
      createTimedMarker_5: {
        action: {
          kind: 'createTimedMarker',
          parameters: {
            target: 'caster',
            markerId: 'skillEnd',
            durationSeconds: { kind: 'constant', value: 0.1 },
            autoFinishByAction: false,
          },
        },
        next: null,
      },
      checkCondition_6: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'createTimedMarker_5',
      },
      finishBuffsById_7: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_normal_skill_trigger_sword'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'finishBuffsById_7',
      },
      changeResource_12: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_8' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: null,
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: null,
      },
      ifElse_16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_11' },
          whenTrue: { $sequence: 'changeResource_12' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_17: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_12' },
            tags: ['normalSkill'],
          },
        },
        next: 'ifElse_16',
      },
      dealDamage_15: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_13' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          },
        },
        next: 'ifElse_16',
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
        },
        next: null,
      },
      ifElse_18: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'dealDamage_15' },
          whenFalse: { $sequence: 'dealDamage_17' },
        },
        next: null,
      },
      applyBuff_19: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_talent1_mark' }],
            target: 'buffSource',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'ifElse_18',
      },
      checkCondition_20: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
        },
        next: 'applyBuff_19',
      },
      checkCondition_21: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
        },
        next: 'checkCondition_20',
      },
      startTimeDilation_23: {
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
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_20' } },
        },
        next: null,
      },
      ifElse_25: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_22' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'startTimeDilation_23' },
        },
        next: null,
      },
      changeResource_26: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_21' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: 'ifElse_25',
      },
      ifElse_27: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_11' },
          whenTrue: { $sequence: 'changeResource_26' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      dealDamage_28: {
        action: {
          kind: 'dealDamage',
          parameters: {
            damageType: 'electric',
            attackScale: { kind: 'valueNode', nodeId: 'data_22' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'valueNode', nodeId: 'data_23' },
          },
        },
        next: 'ifElse_27',
      },
      calculateActionValue_29: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_final',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_24' },
            right: { kind: 'valueNode', nodeId: 'data_25' },
          },
        },
        next: 'dealDamage_28',
      },
      applyBuff_30: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_talent1_mark' }],
            target: 'buffSource',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'calculateActionValue_29',
      },
      checkCondition_31: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_26' } },
        },
        next: 'applyBuff_30',
      },
      checkCondition_32: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_29' } },
        },
        next: 'checkCondition_31',
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
          operator: 'equal',
          value: 0,
        },
      },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'swordIndex', fallback: 0 },
      },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'swordCnt', fallback: 0 } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'equal',
          right: { kind: 'valueNode', nodeId: 'data_3' },
        },
      },
      data_5: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'swordIndex', fallback: 0 },
      },
      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'swordCnt', fallback: 0 } },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_5' },
          operator: 'equal',
          right: { kind: 'valueNode', nodeId: 'data_6' },
        },
      },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'usp_extra' } },
      data_9: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'swordIndex', fallback: 0 },
      },
      data_10: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'remain_sword_limit', fallback: 0 },
      },
      data_11: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_9' },
          operator: 'less',
          right: { kind: 'valueNode', nodeId: 'data_10' },
        },
      },
      data_12: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_14: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'swordIndex', fallback: 0 },
      },
      data_15: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_14' },
          operator: 'equal',
          right: { kind: 'constant', value: 0 },
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
        expression: { kind: 'blackboard', key: 'swordIndex', fallback: 0 },
      },
      data_18: { type: 'number', expression: { kind: 'blackboard', key: 'swordCnt', fallback: 0 } },
      data_19: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_17' },
          operator: 'less',
          right: { kind: 'valueNode', nodeId: 'data_18' },
        },
      },
      data_20: {
        type: 'boolean',
        expression: { kind: 'currentSkillTypeIn', target: 'caster', skillTypes: ['battleSkill'] },
      },
      data_21: { type: 'number', expression: { kind: 'blackboard', key: 'usp_extra' } },
      data_22: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_final' } },
      data_23: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_24: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
      data_25: { type: 'number', expression: { kind: 'blackboard', key: 'final_rate' } },
      data_26: {
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
      data_27: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'swordIndex', fallback: 0 },
      },
      data_28: { type: 'number', expression: { kind: 'blackboard', key: 'swordCnt', fallback: 0 } },
      data_29: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_27' },
          operator: 'equal',
          right: { kind: 'valueNode', nodeId: 'data_28' },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff10: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 0,
  durationSeconds: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    atk_scale: 1,
    atk_scale_final: 0,
    final_rate: 0,
    poise: 0,
    randomVFX: 0,
    remain_sword_limit: 0,
    swordCnt: 0,
    swordIndex: 0,
    usp_extra: 0,
  },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_4' } },
    { startFrame: 3, endFrame: 6, sequence: { $sequence: 'checkCondition_6' } },
    { startFrame: 9, endFrame: 12, sequence: { $sequence: 'checkCondition_8' } },
    { startFrame: 3, endFrame: 6, sequence: { $sequence: 'checkCondition_21' } },
    { startFrame: 6, endFrame: 9, sequence: { $sequence: 'checkCondition_32' } },
  ],
  actionGraph: zhuangFangyiBuff10ActionGraph,
};

const zhuangFangyiBuff11ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff11: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 1,
  maxStackCount: { blackboardKey: 'max_stack' },
  durationSeconds: 0.1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: zhuangFangyiBuff11ActionGraph,
};

const zhuangFangyiBuff12ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
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
                keywordEnhancements: [
                  {
                    triggerBuffIds: ['buff_chr_0030_zhuangfy_talent1_mark'],
                    operation: 'add',
                    value: { kind: 'valueNode', nodeId: 'data_3' },
                  },
                ],
              },
            ],
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'duration' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'base_rate' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'enhance_rate' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff12: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 1,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  applyTags: [],
  extendTags: [],
  blackboard: { base_rate: 0, duration: 0, enhance_rate: 0 },
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: zhuangFangyiBuff12ActionGraph,
};

const zhuangFangyiBuff13ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff13: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 1,
  maxStackCount: { blackboardKey: 'max_stack' },
  durationSeconds: 0.1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: zhuangFangyiBuff13ActionGraph,
};

const zhuangFangyiBuff14ActionGraph = {
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
      overrideMultiDashLimit_2: {
        action: {
          kind: 'overrideMultiDashLimit',
          parameters: { dashCount: { kind: 'constant', value: -1 } },
        },
        next: 'restrictUltimateEnergyRecovery_1',
      },
      changePlayerActionMode_3: {
        action: {
          kind: 'changePlayerActionMode',
          parameters: { modeId: 'UltMode', lifetime: 'finishByAction' },
        },
        next: 'overrideMultiDashLimit_2',
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      castSkillDuringAction_5: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0030_zhuangfy_ultimate_skill_end',
            target: 'caster',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
      changeNativeSkillType_6: {
        action: {
          kind: 'changeNativeSkillType',
          parameters: {
            targetSkillKey: 'chr_0030_zhuangfy_ultimate_skill_end',
            nativeSkillType: 'attachSkill',
          },
        },
        next: 'castSkillDuringAction_5',
      },
      interruptCurrentSkill_7: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      adjustSkillCooldown_8: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'type', skillType: 'ultimate' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'constant', value: 15 },
          },
        },
        next: null,
      },
      ifElse_9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_4' },
          whenTrue: { $sequence: 'changeNativeSkillType_6' },
          whenFalse: { $sequence: 'interruptCurrentSkill_7' },
        },
        next: 'adjustSkillCooldown_8',
      },
      applyBuff_10: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0030_zhuangfy_ult_skill_free' }],
            target: 'buffSource',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
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
          target: 'buffOwner',
          buffIds: ['buff_common_interrupt_henshin_no_exit_effect'],
          operator: 'lessOrEqual',
          value: { kind: 'constant', value: 0 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff14: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 1,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'duration' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_atk_up',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: false,
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
    iconStyleInSquad: 'Default',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
  },
  applyTags: ['Status/DisableBreakingAttack', '3C/PostmodelChanged'],
  extendTags: ['Status/DisableNormalSkill', 'Status/DisableCastComboSkill'],
  blackboard: { combo_cd_rate: 3, duration: 10 },
  attributeModifiers: [
    {
      attribute: 'ComboSkillCooldownRecoveryScalar',
      slot: 'baseMultiplier',
      value: { blackboardKey: 'combo_cd_rate' },
    },
  ],
  lifecycleSequences: {
    start: { $sequence: 'applyBuff_10' },
    enable: { $sequence: 'changePlayerActionMode_3' },
    finish: { $sequence: 'ifElse_9' },
  },
  skillSlotReplacements: [
    {
      skillSlotKey: 'battleSkill',
      targetSkillKey: 'chr_0030_zhuangfy_normal_skill_ult',
      revertedSkillKey: 'chr_0030_zhuangfy_normal_skill',
      inheritOriginSkillCooldownProgress: false,
    },
    {
      skillSlotKey: 'comboSkill',
      targetSkillKey: 'chr_0030_zhuangfy_combo_skill_ult',
      revertedSkillKey: 'chr_0030_zhuangfy_combo_skill',
      inheritOriginSkillCooldownProgress: true,
    },
  ],
  actionGraph: zhuangFangyiBuff14ActionGraph,
};

const zhuangFangyiBuff15ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const zhuangFangyiBuff15: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 1,
  maxStackCount: 0,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_zhuangfy_debuff_01',
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
  blackboard: {},
  attributeModifiers: [{ attribute: 'AtbCostAddition', slot: 'baseAddition', value: -100 }],
  actionGraph: zhuangFangyiBuff15ActionGraph,
};

export const zhuangFangyi: OperatorDefinition = {
  slug: 'zhuang-fangyi',
  gameId: 'ZHUANGFANGYI',
  rarity: 6,
  weaponType: 'funnel',
  element: 'electric',
  characterTypeId: 'Pulse',
  role: 'striker',
  mainAttribute: 'will',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [10, 29, 49, 69, 89, 99],
    agility: [10, 29, 49, 69, 89, 99],
    intellect: [17, 39, 63, 87, 111, 123],
    will: [24, 58, 94, 130, 166, 184],
    baseAttack: [30, 93, 160, 227, 293, 326],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  passiveUi: { kind: 'numeric', appearance: 'zhuangFangyiThunder', maximum: 9, activeAt: 9 },
  skillGroups: [
    {
      key: 'basicAttack',
      operationType: 'basicAttack',
      skills: [
        zhuangFangyiChr_0030_zhuangfy_attack1,
        zhuangFangyiChr_0030_zhuangfy_attack2,
        zhuangFangyiChr_0030_zhuangfy_attack3,
        zhuangFangyiChr_0030_zhuangfy_attack4,
        zhuangFangyiChr_0030_zhuangfy_attack5,
      ],
    },
    {
      key: 'finisher',
      operationType: 'finisher',
      skills: zhuangFangyiChr_0030_zhuangfy_power_attack,
    },
    {
      key: 'plungingAttack',
      operationType: 'plungingAttack',
      skills: zhuangFangyiChr_0030_zhuangfy_plunging_attack_end,
    },
    {
      key: 'battleSkill',
      operationType: 'battleSkill',
      skills: zhuangFangyiChr_0030_zhuangfy_normal_skill,
    },
    {
      key: 'enhancedBattleSkill',
      operationType: 'battleSkill',
      nameKey: 'skillNames.enhanced',
      skills: zhuangFangyiChr_0030_zhuangfy_normal_skill_ult,
    },
    {
      key: 'comboSkill',
      operationType: 'comboSkill',
      skills: zhuangFangyiChr_0030_zhuangfy_combo_skill,
    },
    {
      key: 'enhancedComboSkill',
      operationType: 'comboSkill',
      nameKey: 'skillNames.enhanced',
      skills: zhuangFangyiChr_0030_zhuangfy_combo_skill_ult,
    },
    {
      key: 'ultimate',
      operationType: 'ultimate',
      skills: zhuangFangyiChr_0030_zhuangfy_ultimate_skill,
      replacementSkills: [zhuangFangyiChr_0030_zhuangfy_ultimate_skill_end],
      replacementSkillPlacements: { chr_0030_zhuangfy_ultimate_skill_end: 'internal' },
    },
    {
      key: 'enhancedBasicAttack',
      operationType: 'basicAttack',
      nameKey: 'skillNames.enhanced',
      skills: [
        zhuangFangyiChr_0030_zhuangfy_attack1_ult,
        zhuangFangyiChr_0030_zhuangfy_attack2_ult,
        zhuangFangyiChr_0030_zhuangfy_attack3_ult,
      ],
    },
  ],
  dodgeSkill: zhuangFangyiChr_0030_zhuangfy_perfect_dodge,
  dashBuffs: [
    { buffId: 'buff_common_dash', blackboard: { dodgeSkillId: 'chr_0030_zhuangfy_perfect_dodge' } },
  ],
  skillSlots: [
    {
      key: 'battleSkill',
      baseSkillKey: 'chr_0030_zhuangfy_normal_skill',
      replacementSkillKeys: ['chr_0030_zhuangfy_normal_skill_ult'],
    },
    {
      key: 'comboSkill',
      baseSkillKey: 'chr_0030_zhuangfy_combo_skill',
      replacementSkillKeys: ['chr_0030_zhuangfy_combo_skill_ult'],
    },
    { key: 'ultimate', baseSkillKey: 'chr_0030_zhuangfy_ultimate_skill', replacementSkillKeys: [] },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'chr_0030_zhuangfy_attack1',
        'chr_0030_zhuangfy_attack2',
        'chr_0030_zhuangfy_attack3',
        'chr_0030_zhuangfy_attack4',
        'chr_0030_zhuangfy_attack5',
        'chr_0030_zhuangfy_plunging_attack_end',
        'chr_0030_zhuangfy_power_attack',
        'chr_0030_zhuangfy_attack1_ult',
        'chr_0030_zhuangfy_attack2_ult',
        'chr_0030_zhuangfy_attack3_ult',
      ],
      normalAttackSkillKeys: [
        'chr_0030_zhuangfy_attack1',
        'chr_0030_zhuangfy_attack2',
        'chr_0030_zhuangfy_attack3',
        'chr_0030_zhuangfy_attack4',
        'chr_0030_zhuangfy_attack5',
      ],
      defaultSkillKey: 'chr_0030_zhuangfy_attack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  playerActionModes: [
    {
      modeId: 'UltMode',
      modeLayer: 'UltMode',
      defaultEnabled: false,
      normalAttackSkillKeys: [
        'chr_0030_zhuangfy_attack1_ult',
        'chr_0030_zhuangfy_attack2_ult',
        'chr_0030_zhuangfy_attack3_ult',
      ],
      commandMappings: { basicAttack: { skillId: 'chr_0030_zhuangfy_attack1_ult' } },
    },
  ],
  comboSkillConditions: [zhuangFangyiComboCondition1, zhuangFangyiComboCondition2],
  comboSkillPriority: 'default',
  talents: [
    { levels: 2, passiveSkills: [zhuangFangyiPassive2] },
    { levels: 2, passiveSkills: [zhuangFangyiPassive3] },
  ],
  potentials: [
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0030_zhuangfy_normal_skill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0030_zhuangfy_normal_skill',
          blackboardKey: 'atk_up_per_conduct',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0030_zhuangfy_normal_skill_ult',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0030_zhuangfy_normal_skill_ult',
          blackboardKey: 'atk_up_per_conduct',
          operation: 'multiply',
          value: 1.15,
        },
      ],
      attachedBuffs: [{ buffId: 'buff_chr_0030_zhuangfy_potential1' }],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['will'], value: 20 },
        { kind: 'addStaticDamageIncrease', target: 'battleSkill', value: 0.15 },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0030_zhuangfy_normal_skill',
          blackboardKey: 'sword_duration',
          operation: 'add',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0030_zhuangfy_normal_skill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0030_zhuangfy_normal_skill_ult',
          blackboardKey: 'sword_duration',
          operation: 'add',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0030_zhuangfy_normal_skill_ult',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillKey: 'chr_0030_zhuangfy_ultimate_skill',
          resource: 'ultimateEnergy',
          multiplier: 0.85,
        },
      ],
    },
    {
      levels: 1,
      attachedBuffs: [
        {
          buffId: 'buff_chr_0030_zhuangfy_potential5',
          blackboardAssignments: { ignore_pulse_resist: -15 },
        },
      ],
    },
  ],
  entityBlackboard: { EntityBB_SwordNum: 0 },
  passiveSkills: [zhuangFangyiPassive1],
  buffDefinitions: {
    buff_chr_0030_zhuangfy_attack3_ult_cancel: zhuangFangyiBuff1,
    buff_chr_0030_zhuangfy_combo_skill_ring_hit: zhuangFangyiBuff2,
    buff_chr_0030_zhuangfy_normal_skill_trigger_sword: zhuangFangyiBuff3,
    buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar: zhuangFangyiBuff4,
    buff_chr_0030_zhuangfy_passive_check_sword: zhuangFangyiBuff5,
    buff_chr_0030_zhuangfy_potential1: zhuangFangyiBuff6,
    buff_chr_0030_zhuangfy_potential1_more_sword: zhuangFangyiBuff7,
    buff_chr_0030_zhuangfy_potential5: zhuangFangyiBuff8,
    buff_chr_0030_zhuangfy_potential5_vfx: zhuangFangyiBuff9,
    buff_chr_0030_zhuangfy_sword_triggerd: zhuangFangyiBuff10,
    buff_chr_0030_zhuangfy_talent1: zhuangFangyiBuff11,
    buff_chr_0030_zhuangfy_talent1_base: zhuangFangyiBuff12,
    buff_chr_0030_zhuangfy_talent1_mark: zhuangFangyiBuff13,
    buff_chr_0030_zhuangfy_ult_base: zhuangFangyiBuff14,
    buff_chr_0030_zhuangfy_ult_skill_free: zhuangFangyiBuff15,
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0030_zhuangfy_attack2: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'limited', durationSeconds: 1 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0030_zhuangfy_attack2_abilityrange',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 30,
        castResource: {
          costFrame: 9,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atk_scale: 0.2, thunderPosIndex: 0 },
        scheduledSequences: [
          { startFrame: 0, endFrame: 1, sequence: { $sequence: 'dealDamage_1' } },
          { startFrame: 9, endFrame: 16, sequence: { $sequence: 'repeatEachTick_8' } },
          { startFrame: 897, endFrame: 900, sequence: { $sequence: 'finishOwner_9' } },
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
                  key: 'abilityentity_chr_0030_zhuangfy_attack2:chr_0030_zhuangfy_attack2_abilityrange:/childSkill/actionGraph/main/nodes/dealDamage_1/action',
                },
                next: null,
              },
              modifyActionValue_5: {
                action: {
                  kind: 'modifyActionValue',
                  parameters: {
                    key: 'thunderPosIndex',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  },
                },
                next: null,
              },
              dealDamage_6: {
                action: {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'electric',
                    attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                    tags: ['normalAttack'],
                  },
                  key: 'abilityentity_chr_0030_zhuangfy_attack2:chr_0030_zhuangfy_attack2_abilityrange:/childSkill/actionGraph/main/nodes/dealDamage_6/action',
                },
                next: 'modifyActionValue_5',
              },
              dealDamage_4: {
                action: {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'electric',
                    attackScale: { kind: 'valueNode', nodeId: 'data_3' },
                    tags: ['normalAttack'],
                  },
                  key: 'abilityentity_chr_0030_zhuangfy_attack2:chr_0030_zhuangfy_attack2_abilityrange:/childSkill/actionGraph/main/nodes/dealDamage_4/action',
                },
                next: 'modifyActionValue_5',
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
                  whenTrue: { $sequence: 'dealDamage_4' },
                  whenFalse: { $sequence: 'dealDamage_6' },
                },
                next: null,
              },
              repeatEachTick_8: {
                action: {
                  kind: 'repeatEachTick',
                  parameters: {
                    nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 },
                  },
                  body: { $sequence: 'ifElse_7' },
                },
                next: null,
              },
              finishOwner_9: {
                action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                next: null,
              },
            },
            dataNodes: {
              data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
              data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
              data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
              data_4: {
                type: 'boolean',
                expression: { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
              },
            },
          },
          macros: {},
        },
      },
    },
    abilityentity_chr_0030_zhuangfy_attack5: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'limited', durationSeconds: 1 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0030_zhuangfy_attack5_abilityrange',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 30,
        castResource: {
          costFrame: 9,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atb: 20, atk_scale: 0.2, effectZ: 2, hasGainAtb: 0, poise: 15 },
        scheduledSequences: [
          { startFrame: 897, endFrame: 900, sequence: { $sequence: 'finishOwner_1' } },
          { startFrame: 897, endFrame: 900, sequence: { $sequence: 'finishOwner_1' } },
          { startFrame: 0, endFrame: 12, sequence: { $sequence: 'repeatEachTick_6' } },
          { startFrame: 0, endFrame: 2, sequence: { $sequence: 'checkCondition_10' } },
          { startFrame: 4, endFrame: 6, sequence: { $sequence: 'checkCondition_10' } },
          { startFrame: 8, endFrame: 10, sequence: { $sequence: 'checkCondition_10' } },
        ],
        actionGraph: {
          main: {
            nodes: {
              finishOwner_1: {
                action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                next: null,
              },
              startTimeDilation_3: {
                action: {
                  kind: 'startTimeDilation',
                  parameters: {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.1 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy'],
                    abilityEntityTargets: [{ kind: 'current' }],
                  },
                },
                next: null,
              },
              checkCondition_4: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                },
                next: 'startTimeDilation_3',
              },
              dealDamage_5: {
                action: {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'electric',
                    attackScale: { kind: 'valueNode', nodeId: 'data_2' },
                    tags: ['normalAttack', 'normalAttackLastCombo'],
                    stagger: { kind: 'valueNode', nodeId: 'data_3' },
                    staggerOnlyWhenCasterControlled: true,
                  },
                  key: 'abilityentity_chr_0030_zhuangfy_attack5:chr_0030_zhuangfy_attack5_abilityrange:/childSkill/actionGraph/main/nodes/dealDamage_5/action',
                },
                next: 'checkCondition_4',
              },
              repeatEachTick_6: {
                action: {
                  kind: 'repeatEachTick',
                  parameters: {
                    nativeChanneling: {
                      target: { kind: 'fixed', target: 'enemy' },
                      executeEachFrame: true,
                      triggerIntervalSeconds: 0.033,
                      maxCountPerTarget: 1,
                      targetTriggerIntervalSeconds: 0.27,
                    },
                  },
                  body: { $sequence: 'dealDamage_5' },
                },
                next: null,
              },
              modifyActionValue_7: {
                action: {
                  kind: 'modifyActionValue',
                  parameters: {
                    key: 'hasGainAtb',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
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
                    coefficient: { kind: 'constant', value: 1 },
                    source: { kind: 'source' },
                    targets: { kind: 'source' },
                    onlyMainOperator: true,
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  },
                },
                next: 'modifyActionValue_7',
              },
              checkCondition_9: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                },
                next: 'changeResource_8',
              },
              checkCondition_10: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                },
                next: 'checkCondition_9',
              },
            },
            dataNodes: {
              data_1: { type: 'boolean', expression: { kind: 'casterControlled' } },
              data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
              data_3: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
              data_4: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
              data_5: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'hasGainAtb', fallback: 0 },
              },
              data_6: {
                type: 'boolean',
                expression: {
                  kind: 'actionValueCompare',
                  left: { kind: 'valueNode', nodeId: 'data_5' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
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
        },
      },
    },
    abilityentity_chr_0030_zhuangfy_attack_ult: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      blackboard: { EntityBB_hitedMark: '#' },
      lifetime: { kind: 'limited', durationSeconds: 1.5 },
      childSkills: {
        chr_0030_zhuangfy_attack1_ult_1_abilityrange: {
          actionGraph: {
            main: {
              nodes: {
                createTimedMarker_1: {
                  action: {
                    kind: 'createTimedMarker',
                    parameters: {
                      target: 'enemy',
                      markerId: { kind: 'stringNode', nodeId: 'data_1' },
                      durationSeconds: { kind: 'constant', value: 0.4 },
                      autoFinishByAction: false,
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
                      tags: ['normalAttack'],
                    },
                    key: 'abilityentity_chr_0030_zhuangfy_attack_ult:chr_0030_zhuangfy_attack1_ult_1_abilityrange|chr_0030_zhuangfy_attack1_ult_2_abilityrange|chr_0030_zhuangfy_attack1_ult_3_abilityrange|chr_0030_zhuangfy_attack1_ult_4_abilityrange:/childSkills/chr_0030_zhuangfy_attack1_ult_1_abilityrange/actionGraph/main/nodes/dealDamage_2/action',
                  },
                  next: 'createTimedMarker_1',
                },
                checkCondition_3: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
                  },
                  next: 'dealDamage_2',
                },
                forEachContextTarget_4: {
                  action: {
                    kind: 'forEachContextTarget',
                    parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                    body: { $sequence: 'checkCondition_3' },
                  },
                  next: null,
                },
                finishOwner_5: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
              },
              dataNodes: {
                data_1: { type: 'string', expression: { blackboardKey: 'EntityBB_hitedMark' } },
                data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
                data_3: { type: 'string', expression: { blackboardKey: 'EntityBB_hitedMark' } },
                data_4: {
                  type: 'boolean',
                  expression: {
                    kind: 'timedMarkerPresent',
                    target: 'enemy',
                    markerId: { kind: 'stringNode', nodeId: 'data_3' },
                  },
                },
                data_5: {
                  type: 'boolean',
                  expression: {
                    kind: 'not',
                    condition: { kind: 'conditionNode', nodeId: 'data_4' },
                  },
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0030_zhuangfy_attack1_ult_1_abilityrange',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 21,
          castResource: {
            costFrame: 9,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale: 0.2, randomRotate: 0, thunderPosIndex: 0 },
          scheduledSequences: [
            { startFrame: 3, endFrame: 4, sequence: { $sequence: 'forEachContextTarget_4' } },
            { startFrame: 897, endFrame: 900, sequence: { $sequence: 'finishOwner_5' } },
          ],
        },
        chr_0030_zhuangfy_attack1_ult_2_abilityrange: {
          actionGraph: {
            main: {
              nodes: {
                createTimedMarker_1: {
                  action: {
                    kind: 'createTimedMarker',
                    parameters: {
                      target: 'enemy',
                      markerId: { kind: 'stringNode', nodeId: 'data_1' },
                      durationSeconds: { kind: 'constant', value: 0.4 },
                      autoFinishByAction: false,
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
                      tags: ['normalAttack'],
                    },
                    key: 'abilityentity_chr_0030_zhuangfy_attack_ult:chr_0030_zhuangfy_attack1_ult_1_abilityrange|chr_0030_zhuangfy_attack1_ult_2_abilityrange|chr_0030_zhuangfy_attack1_ult_3_abilityrange|chr_0030_zhuangfy_attack1_ult_4_abilityrange:/childSkills/chr_0030_zhuangfy_attack1_ult_2_abilityrange/actionGraph/main/nodes/dealDamage_2/action',
                  },
                  next: 'createTimedMarker_1',
                },
                checkCondition_3: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
                  },
                  next: 'dealDamage_2',
                },
                forEachContextTarget_4: {
                  action: {
                    kind: 'forEachContextTarget',
                    parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                    body: { $sequence: 'checkCondition_3' },
                  },
                  next: null,
                },
                finishOwner_5: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
              },
              dataNodes: {
                data_1: { type: 'string', expression: { blackboardKey: 'EntityBB_hitedMark' } },
                data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
                data_3: { type: 'string', expression: { blackboardKey: 'EntityBB_hitedMark' } },
                data_4: {
                  type: 'boolean',
                  expression: {
                    kind: 'timedMarkerPresent',
                    target: 'enemy',
                    markerId: { kind: 'stringNode', nodeId: 'data_3' },
                  },
                },
                data_5: {
                  type: 'boolean',
                  expression: {
                    kind: 'not',
                    condition: { kind: 'conditionNode', nodeId: 'data_4' },
                  },
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0030_zhuangfy_attack1_ult_2_abilityrange',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 21,
          castResource: {
            costFrame: 9,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale: 0.2, randomRotate: 0, thunderPosIndex: 0 },
          scheduledSequences: [
            { startFrame: 3, endFrame: 4, sequence: { $sequence: 'forEachContextTarget_4' } },
            { startFrame: 897, endFrame: 900, sequence: { $sequence: 'finishOwner_5' } },
          ],
        },
        chr_0030_zhuangfy_attack1_ult_3_abilityrange: {
          actionGraph: {
            main: {
              nodes: {
                createTimedMarker_1: {
                  action: {
                    kind: 'createTimedMarker',
                    parameters: {
                      target: 'enemy',
                      markerId: { kind: 'stringNode', nodeId: 'data_1' },
                      durationSeconds: { kind: 'constant', value: 0.4 },
                      autoFinishByAction: false,
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
                      tags: ['normalAttack'],
                    },
                    key: 'abilityentity_chr_0030_zhuangfy_attack_ult:chr_0030_zhuangfy_attack1_ult_1_abilityrange|chr_0030_zhuangfy_attack1_ult_2_abilityrange|chr_0030_zhuangfy_attack1_ult_3_abilityrange|chr_0030_zhuangfy_attack1_ult_4_abilityrange:/childSkills/chr_0030_zhuangfy_attack1_ult_3_abilityrange/actionGraph/main/nodes/dealDamage_2/action',
                  },
                  next: 'createTimedMarker_1',
                },
                checkCondition_3: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
                  },
                  next: 'dealDamage_2',
                },
                forEachContextTarget_4: {
                  action: {
                    kind: 'forEachContextTarget',
                    parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                    body: { $sequence: 'checkCondition_3' },
                  },
                  next: null,
                },
                finishOwner_5: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
              },
              dataNodes: {
                data_1: { type: 'string', expression: { blackboardKey: 'EntityBB_hitedMark' } },
                data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
                data_3: { type: 'string', expression: { blackboardKey: 'EntityBB_hitedMark' } },
                data_4: {
                  type: 'boolean',
                  expression: {
                    kind: 'timedMarkerPresent',
                    target: 'enemy',
                    markerId: { kind: 'stringNode', nodeId: 'data_3' },
                  },
                },
                data_5: {
                  type: 'boolean',
                  expression: {
                    kind: 'not',
                    condition: { kind: 'conditionNode', nodeId: 'data_4' },
                  },
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0030_zhuangfy_attack1_ult_3_abilityrange',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 21,
          castResource: {
            costFrame: 9,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale: 0.2, randomRotate: 0, thunderPosIndex: 0 },
          scheduledSequences: [
            { startFrame: 3, endFrame: 4, sequence: { $sequence: 'forEachContextTarget_4' } },
            { startFrame: 897, endFrame: 900, sequence: { $sequence: 'finishOwner_5' } },
          ],
        },
        chr_0030_zhuangfy_attack1_ult_4_abilityrange: {
          actionGraph: {
            main: {
              nodes: {
                createTimedMarker_1: {
                  action: {
                    kind: 'createTimedMarker',
                    parameters: {
                      target: 'enemy',
                      markerId: { kind: 'stringNode', nodeId: 'data_1' },
                      durationSeconds: { kind: 'constant', value: 0.4 },
                      autoFinishByAction: false,
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
                      tags: ['normalAttack'],
                    },
                    key: 'abilityentity_chr_0030_zhuangfy_attack_ult:chr_0030_zhuangfy_attack1_ult_1_abilityrange|chr_0030_zhuangfy_attack1_ult_2_abilityrange|chr_0030_zhuangfy_attack1_ult_3_abilityrange|chr_0030_zhuangfy_attack1_ult_4_abilityrange:/childSkills/chr_0030_zhuangfy_attack1_ult_4_abilityrange/actionGraph/main/nodes/dealDamage_2/action',
                  },
                  next: 'createTimedMarker_1',
                },
                checkCondition_3: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
                  },
                  next: 'dealDamage_2',
                },
                forEachContextTarget_4: {
                  action: {
                    kind: 'forEachContextTarget',
                    parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                    body: { $sequence: 'checkCondition_3' },
                  },
                  next: null,
                },
                finishOwner_5: {
                  action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                  next: null,
                },
              },
              dataNodes: {
                data_1: { type: 'string', expression: { blackboardKey: 'EntityBB_hitedMark' } },
                data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
                data_3: { type: 'string', expression: { blackboardKey: 'EntityBB_hitedMark' } },
                data_4: {
                  type: 'boolean',
                  expression: {
                    kind: 'timedMarkerPresent',
                    target: 'enemy',
                    markerId: { kind: 'stringNode', nodeId: 'data_3' },
                  },
                },
                data_5: {
                  type: 'boolean',
                  expression: {
                    kind: 'not',
                    condition: { kind: 'conditionNode', nodeId: 'data_4' },
                  },
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0030_zhuangfy_attack1_ult_4_abilityrange',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 21,
          castResource: {
            costFrame: 9,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: { atk_scale: 0.2, randomRotate: 0, thunderPosIndex: 0 },
          scheduledSequences: [
            { startFrame: 3, endFrame: 4, sequence: { $sequence: 'forEachContextTarget_4' } },
            { startFrame: 897, endFrame: 900, sequence: { $sequence: 'finishOwner_5' } },
          ],
        },
      },
    },
    abilityentity_chr_0030_zhuangfy_attack3_ult: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'limited', durationSeconds: 2 },
      childSkill: {
        actionGraph: {
          main: {
            nodes: {
              dealDamage_1: {
                action: {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'electric',
                    attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                    tags: ['normalAttack', 'normalAttackLastCombo'],
                    stagger: { kind: 'valueNode', nodeId: 'data_2' },
                    staggerOnlyWhenCasterControlled: true,
                  },
                  key: 'abilityentity_chr_0030_zhuangfy_attack3_ult:chr_0030_zhuangfy_attack3_ult_abilityrange:/childSkill/actionGraph/main/nodes/dealDamage_1/action',
                },
                next: null,
              },
              changeResource_2: {
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
              checkCondition_3: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                },
                next: 'changeResource_2',
              },
              repeatEachTick_4: {
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
                  body: { $sequence: 'dealDamage_1' },
                },
                next: 'checkCondition_3',
              },
            },
            dataNodes: {
              data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
              data_2: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
              data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
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
            },
          },
          macros: {},
        },
        skillId: 'chr_0030_zhuangfy_attack3_ult_abilityrange',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 75,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atb: 0, atk_scale: 0.2, poise: 0, randomRotate: 0, thunderPosIndex: 0 },
        scheduledSequences: [
          { startFrame: 30, endFrame: 33, sequence: { $sequence: 'repeatEachTick_4' } },
        ],
      },
    },
    abilityentity_chr_0030_zhuangfy_normal_skill_fake_target: {
      bornTags: [
        'SelectCategory/Unmarkable',
        'Immune/Damage',
        'Skill/Character/chr_0030_zhuangfy/ThunderAura',
      ],
      lifetime: { kind: 'limited', durationSeconds: 3 },
      maxStackingCount: 10,
    },
    abilityentity_chr_0030_zhuangfy_normal_skill_sword: {
      bornTags: [
        'SelectCategory/Unmarkable',
        'Immune/Damage',
        'Skill/Character/chr_0030_zhuangfy/ActivedSword',
      ],
      blackboard: { EntityBB_swordDuration: 0, EntityBB_swordLimit: 0 },
      lifetime: {
        kind: 'limited',
        durationSeconds: { blackboardKey: 'EntityBB_swordDuration', fallback: 0 },
      },
      maxStackingCount: { blackboardKey: 'EntityBB_swordLimit', fallback: 5 },
      childSkill: {
        skillId: 'chr_0030_zhuangfy_normal_skill_sword',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 3000,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atk_scale: 0.2, potential_n: 0, randomRotate: 0, randomVFX: 0 },
        scheduledSequences: [
          { startFrame: 0, endFrame: 3000, sequence: { $sequence: 'ifElse_2' } },
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
            },
            dataNodes: {
              data_1: {
                type: 'boolean',
                expression: { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
              },
            },
          },
          macros: {},
        },
      },
    },
    abilityentity_chr_0030_zhuangfy_normal_skill_ult: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      blackboard: { EntityBB_SwordNum: 0 },
      lifetime: { kind: 'limited', durationSeconds: 3 },
      childSkill: {
        skillId: 'chr_0030_zhuangfy_normal_skill_ult_abilityrange',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 104,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: {
          atk_scale: 0,
          atk_scale_final: 0,
          atk_up_final: 0,
          final_rate: 0,
          poise: 0,
          randomVFX: 0,
          sword_index: 0,
          sword_range: 0,
          tick_index: 1,
        },
        scheduledSequences: [
          { startFrame: 0, endFrame: 12, sequence: { $sequence: 'calculateActionValue_1' } },
          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_4' } },
          { startFrame: 12, endFrame: 64, sequence: { $sequence: 'repeatEachTick_14' } },
          { startFrame: 69, endFrame: 70, sequence: { $sequence: 'checkCondition_20' } },
          { startFrame: 12, endFrame: 64, sequence: { $sequence: 'repeatEachTick_21' } },
          { startFrame: 12, endFrame: 64, sequence: { $sequence: 'repeatEachTick_25' } },
          { startFrame: 15, endFrame: 64, sequence: { $sequence: 'repeatEachTick_21' } },
          { startFrame: 67, endFrame: 71, sequence: { $sequence: 'repeatEachTick_21' } },
          { startFrame: 67, endFrame: 70, sequence: { $sequence: 'createTimedMarker_28' } },
        ],
        actionGraph: {
          main: {
            nodes: {
              calculateActionValue_1: {
                action: {
                  kind: 'calculateActionValue',
                  parameters: {
                    key: 'atk_scale_final',
                    operation: 'add',
                    left: { kind: 'valueNode', nodeId: 'data_1' },
                    right: { kind: 'valueNode', nodeId: 'data_2' },
                  },
                },
                next: null,
              },
              finishOwner_3: {
                action: { kind: 'finishOwner', parameters: { targets: { kind: 'owner' } } },
                next: null,
              },
              checkCondition_2: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                },
                next: null,
              },
              ifElse_4: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_2' },
                  whenTrue: { $sequence: 'finishOwner_3' },
                  whenFalse: { $sequence: null },
                },
                next: null,
              },
              jumpTimeline_12: {
                action: {
                  kind: 'jumpTimeline',
                  parameters: { destinationFrame: 64 },
                  condition: { $sequence: null },
                },
                next: null,
              },
              dealDamage_7: {
                action: {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'electric',
                    attackScale: { kind: 'valueNode', nodeId: 'data_5' },
                    tags: ['normalSkill'],
                  },
                  key: 'abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange:/childSkill/actionGraph/main/nodes/dealDamage_7/action',
                },
                next: null,
              },
              dealDamage_6: {
                action: {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'electric',
                    attackScale: { kind: 'valueNode', nodeId: 'data_6' },
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                  },
                  key: 'abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange:/childSkill/actionGraph/main/nodes/dealDamage_6/action',
                },
                next: null,
              },
              checkCondition_5: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
                },
                next: null,
              },
              modifyActionValue_9: {
                action: {
                  kind: 'modifyActionValue',
                  parameters: {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  },
                },
                next: null,
              },
              ifElse_10: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_5' },
                  whenTrue: { $sequence: 'dealDamage_6' },
                  whenFalse: { $sequence: 'dealDamage_7' },
                },
                next: 'modifyActionValue_9',
              },
              applyBuff_11: {
                action: {
                  kind: 'applyBuff',
                  parameters: {
                    buffs: [{ buffId: 'buff_chr_0030_zhuangfy_talent1_mark' }],
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  },
                },
                next: 'ifElse_10',
              },
              checkCondition_8: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
                },
                next: null,
              },
              ifElse_13: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_8' },
                  whenTrue: { $sequence: 'applyBuff_11' },
                  whenFalse: { $sequence: 'jumpTimeline_12' },
                },
                next: null,
              },
              repeatEachTick_14: {
                action: {
                  kind: 'repeatEachTick',
                  parameters: {
                    nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.2 },
                  },
                  body: { $sequence: 'ifElse_13' },
                },
                next: null,
              },
              startTimeDilation_15: {
                action: {
                  kind: 'startTimeDilation',
                  parameters: {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.4 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy'],
                    abilityEntityTargets: [{ kind: 'current' }],
                  },
                },
                next: null,
              },
              dealDamage_16: {
                action: {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'electric',
                    attackScale: { kind: 'valueNode', nodeId: 'data_12' },
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'valueNode', nodeId: 'data_13' },
                  },
                  key: 'abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange:/childSkill/actionGraph/main/nodes/dealDamage_16/action',
                },
                next: 'startTimeDilation_15',
              },
              applyElementalInfliction_17: {
                action: {
                  kind: 'applyElementalInfliction',
                  parameters: { element: 'electric', isExtra: false },
                },
                next: 'dealDamage_16',
              },
              calculateActionValue_18: {
                action: {
                  kind: 'calculateActionValue',
                  parameters: {
                    key: 'atk_scale_final',
                    operation: 'multiply',
                    left: { kind: 'valueNode', nodeId: 'data_14' },
                    right: { kind: 'valueNode', nodeId: 'data_15' },
                  },
                },
                next: 'applyElementalInfliction_17',
              },
              applyBuff_19: {
                action: {
                  kind: 'applyBuff',
                  parameters: {
                    buffs: [{ buffId: 'buff_chr_0030_zhuangfy_talent1_mark' }],
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  },
                },
                next: 'calculateActionValue_18',
              },
              checkCondition_20: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_16' } },
                },
                next: 'applyBuff_19',
              },
              repeatEachTick_21: {
                action: {
                  kind: 'repeatEachTick',
                  parameters: {
                    nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.2 },
                  },
                  body: { $sequence: null },
                },
                next: null,
              },
              modifyActionValue_23: {
                action: {
                  kind: 'modifyActionValue',
                  parameters: {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  },
                },
                next: null,
              },
              checkCondition_22: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_19' } },
                },
                next: null,
              },
              ifElse_24: {
                action: {
                  kind: 'ifElse',
                  parameters: { alwaysNext: true },
                  condition: { $sequence: 'checkCondition_22' },
                  whenTrue: { $sequence: 'modifyActionValue_23' },
                  whenFalse: { $sequence: null },
                },
                next: null,
              },
              repeatEachTick_25: {
                action: {
                  kind: 'repeatEachTick',
                  parameters: {
                    nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.2 },
                  },
                  body: { $sequence: 'ifElse_24' },
                },
                next: null,
              },
              createTimedMarker_28: {
                action: {
                  kind: 'createTimedMarker',
                  parameters: {
                    target: 'caster',
                    markerId: 'skillEnd',
                    durationSeconds: { kind: 'constant', value: 0.1 },
                    autoFinishByAction: false,
                  },
                },
                next: null,
              },
            },
            dataNodes: {
              data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
              data_2: { type: 'number', expression: { kind: 'blackboard', key: 'atk_up_final' } },
              data_3: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'EntityBB_SwordNum', fallback: 0 },
              },
              data_4: {
                type: 'boolean',
                expression: {
                  kind: 'actionValueCompare',
                  left: { kind: 'valueNode', nodeId: 'data_3' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
              },
              data_5: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_final' },
              },
              data_6: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_final' },
              },
              data_7: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'tick_index', fallback: 0 },
              },
              data_8: {
                type: 'boolean',
                expression: {
                  kind: 'actionValueCompare',
                  left: { kind: 'valueNode', nodeId: 'data_7' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
              },
              data_9: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'tick_index', fallback: 0 },
              },
              data_10: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'EntityBB_SwordNum', fallback: 0 },
              },
              data_11: {
                type: 'boolean',
                expression: {
                  kind: 'actionValueCompare',
                  left: { kind: 'valueNode', nodeId: 'data_9' },
                  operator: 'less',
                  right: { kind: 'valueNode', nodeId: 'data_10' },
                },
              },
              data_12: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_final' },
              },
              data_13: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
              data_14: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_final' },
              },
              data_15: { type: 'number', expression: { kind: 'blackboard', key: 'final_rate' } },
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
                expression: { kind: 'blackboard', key: 'sword_index', fallback: 0 },
              },
              data_18: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'EntityBB_SwordNum', fallback: 0 },
              },
              data_19: {
                type: 'boolean',
                expression: {
                  kind: 'actionValueCompare',
                  left: { kind: 'valueNode', nodeId: 'data_17' },
                  operator: 'less',
                  right: { kind: 'valueNode', nodeId: 'data_18' },
                },
              },
            },
          },
          macros: {},
        },
      },
    },
    abilityentity_chr_0030_zhuangfy_ult_mirror: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'limited', durationSeconds: 3 },
      maxStackingCount: 1,
    },
    abilityentity_chr_0030_zhuangfy_ult: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'limited', durationSeconds: 3 },
      maxStackingCount: 1,
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;

export default zhuangFangyi;
