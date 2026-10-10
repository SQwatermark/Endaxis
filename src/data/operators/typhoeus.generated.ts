/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */

import type { ActionGraphResourceDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import type { SkillDefinition } from '../../../packages/game-data-contract/src/skills';
import type { SkillBuffDefinition } from '../../../packages/game-data-contract/src/buffs';
import type {
  OperatorPassiveSkillDefinition,
  ComboSkillConditionDefinition,
} from '../../../packages/game-data-contract/src/operators';
import type { OperatorDefinition } from '../../../packages/game-data-contract/src/operators';
export const typhoeusChr_0034_typhoea_attack1ActionGraph = {
  main: {
    nodes: {
      calculateActionValue_1: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_1' },
            right: { kind: 'constant', value: 2 },
          },
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
                skillId: 'chr_0034_typhoea_attack1_01_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atb: 0, atk_scale: 0, duration: 0, hit_index: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_2' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      spawnAbilityEntity_1: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'fixed', target: 'enemy' },
                            abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
                            childSkillId: 'chr_0034_typhoea_attack_deadarrow',
                            inheritActionBlackboard: false,
                            inheritSourceSkillCastInfo: false,
                            dieWhenSourceDies: false,
                            target: 'enemy',
                            overrideDurationSeconds: { kind: 'constant', value: 3 },
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
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'spawnAbilityEntity_1',
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
      reachSkillOperableBoundary_6: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_attack2'] },
        },
        next: null,
      },
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_attack1: SkillDefinition = {
  key: 'chr_0034_typhoea_attack1',
  element: 'nature',
  blackboard: {
    atk_scale: [0.21, 0.23, 0.25, 0.27, 0.29, 0.31, 0.33, 0.35, 0.37, 0.39, 0.43, 0.46],
  },
  timelineBlockFrames: 9,
  naturalDurationFrames: 150,
  exclusiveFrame: 15,
  offsetRecordFrame: 7,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 3,
        endFrame: 43,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_attack2',
      },
    ],
    allowedNextSkills: [{ startFrame: 9, endFrame: 43, skillIds: ['chr_0034_typhoea_attack2'] }],
  },
  costFrame: 13,
  scheduledSequences: [
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'calculateActionValue_1' } },
    { startFrame: 5, endFrame: 5, sequence: { $sequence: 'launchProjectile_2' } },
    { startFrame: 8, endFrame: 8, sequence: { $sequence: 'launchProjectile_2' } },
    { startFrame: 9, endFrame: 43, sequence: { $sequence: 'reachSkillOperableBoundary_6' } },
  ],
  timelineContinuationSkillId: 'chr_0034_typhoea_attack2',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_attack1ActionGraph,
};

export const typhoeusChr_0034_typhoea_attack2ActionGraph = {
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
                skillId: 'chr_0034_typhoea_attack1_01_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atb: 0, atk_scale: 0, duration: 0, hit_index: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_2' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      spawnAbilityEntity_1: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'fixed', target: 'enemy' },
                            abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
                            childSkillId: 'chr_0034_typhoea_attack_deadarrow',
                            inheritActionBlackboard: false,
                            inheritSourceSkillCastInfo: false,
                            dieWhenSourceDies: false,
                            target: 'enemy',
                            overrideDurationSeconds: { kind: 'constant', value: 3 },
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
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'spawnAbilityEntity_1',
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
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passive_increase_attackrange' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            isExtra: true,
          },
        },
        next: null,
      },
      reachSkillOperableBoundary_3: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_attack3'] },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_attack2: SkillDefinition = {
  key: 'chr_0034_typhoea_attack2',
  element: 'nature',
  blackboard: { atk_scale: [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56] },
  timelineBlockFrames: 12,
  naturalDurationFrames: 182,
  exclusiveFrame: 13,
  offsetRecordFrame: 8,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 3,
        endFrame: 29,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_attack3',
      },
    ],
    allowedNextSkills: [{ startFrame: 12, endFrame: 29, skillIds: ['chr_0034_typhoea_attack3'] }],
  },
  costFrame: 11,
  scheduledSequences: [
    { startFrame: 9, endFrame: 9, sequence: { $sequence: 'launchProjectile_1' } },
    { startFrame: 0, endFrame: 41, sequence: { $sequence: 'applyBuff_2' } },
    { startFrame: 12, endFrame: 29, sequence: { $sequence: 'reachSkillOperableBoundary_3' } },
  ],
  timelineContinuationSkillId: 'chr_0034_typhoea_attack3',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_attack2ActionGraph,
};

const typhoeusChr_0034_typhoea_attack3ActionGraphCallback1 = {
  skillId: 'chr_0034_typhoea_attack3_01_projhit',
  nativeSkillType: 'normalSkill',
  naturalDurationFrames: 5,
  castResource: {
    costFrame: 0,
    cooldownSeconds: 0,
    maxChargeTime: 1,
    cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
  },
  blackboard: { atb: 0, atk_scale: 0, atk_scale_once: 0, duration: 0, hit_index: 0, hit_times: 0 },
  scheduledSequences: [{ startFrame: 0, endFrame: 1, sequence: { $sequence: 'checkCondition_3' } }],
  actionGraph: {
    main: {
      nodes: {
        applyBuff_1: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_attack_3_1_damagetaken' }],
              targets: { kind: 'fixed', target: 'enemy' },
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
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_1' },
              tags: ['normalAttack'],
            },
          },
          next: 'applyBuff_1',
        },
        checkCondition_3: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
          },
          next: 'dealDamage_2',
        },
      },
      dataNodes: {
        data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
        data_2: {
          type: 'boolean',
          expression: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0034_typhoea_attack_3_1_damagetaken'],
            operator: 'equal',
            value: { kind: 'constant', value: 0 },
          },
        },
      },
    },
    macros: {},
  },
} as const;

const typhoeusChr_0034_typhoea_attack3ActionGraphCallback2 = {
  skillId: 'chr_0034_typhoea_attack3_02_projhit',
  nativeSkillType: 'normalSkill',
  naturalDurationFrames: 5,
  castResource: {
    costFrame: 0,
    cooldownSeconds: 0,
    maxChargeTime: 1,
    cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
  },
  blackboard: { atb: 0, atk_scale: 0, atk_scale_once: 0, duration: 0, hit_index: 0, hit_times: 0 },
  scheduledSequences: [{ startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_3' } }],
  actionGraph: {
    main: {
      nodes: {
        applyBuff_1: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_attack_3_2_damagetaken' }],
              targets: { kind: 'fixed', target: 'enemy' },
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
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_1' },
              tags: ['normalAttack'],
            },
          },
          next: 'applyBuff_1',
        },
        checkCondition_3: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
          },
          next: 'dealDamage_2',
        },
      },
      dataNodes: {
        data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
        data_2: {
          type: 'boolean',
          expression: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0034_typhoea_attack_3_2_damagetaken'],
            operator: 'equal',
            value: { kind: 'constant', value: 0 },
          },
        },
      },
    },
    macros: {},
  },
} as const;

export const typhoeusChr_0034_typhoea_attack3ActionGraph = {
  main: {
    nodes: {
      calculateActionValue_1: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_1' },
            right: { kind: 'constant', value: 2 },
          },
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
            recycleDelaySeconds: 0.16666667163372,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_attack3ActionGraphCallback1 },
          ],
        },
        next: null,
      },
      launchProjectile_3: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.16666667163372,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_attack3ActionGraphCallback1 },
          ],
        },
        next: 'launchProjectile_2',
      },
      launchProjectile_4: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.16666667163372,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_attack3ActionGraphCallback1 },
          ],
        },
        next: 'launchProjectile_3',
      },
      launchProjectile_5: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.16666667163372,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_attack3ActionGraphCallback2 },
          ],
        },
        next: null,
      },
      launchProjectile_6: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.16666667163372,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_attack3ActionGraphCallback2 },
          ],
        },
        next: 'launchProjectile_5',
      },
      launchProjectile_7: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.16666667163372,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_attack3ActionGraphCallback2 },
          ],
        },
        next: 'launchProjectile_6',
      },
      applyBuff_8: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passive_increase_attackrange' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            isExtra: true,
          },
        },
        next: null,
      },
      reachSkillOperableBoundary_9: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_attack4'] },
        },
        next: null,
      },
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_attack3: SkillDefinition = {
  key: 'chr_0034_typhoea_attack3',
  element: 'nature',
  blackboard: {
    atk_scale: [0.38, 0.42, 0.46, 0.49, 0.53, 0.57, 0.61, 0.65, 0.68, 0.73, 0.79, 0.86],
  },
  timelineBlockFrames: 20,
  naturalDurationFrames: 185,
  exclusiveFrame: 28,
  offsetRecordFrame: 10,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 8,
        endFrame: 44,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_attack4',
      },
    ],
    allowedNextSkills: [{ startFrame: 20, endFrame: 44, skillIds: ['chr_0034_typhoea_attack4'] }],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'calculateActionValue_1' } },
    { startFrame: 5, endFrame: 8, sequence: { $sequence: 'launchProjectile_4' } },
    { startFrame: 14, endFrame: 17, sequence: { $sequence: 'launchProjectile_7' } },
    { startFrame: 0, endFrame: 41, sequence: { $sequence: 'applyBuff_8' } },
    { startFrame: 20, endFrame: 44, sequence: { $sequence: 'reachSkillOperableBoundary_9' } },
  ],
  timelineContinuationSkillId: 'chr_0034_typhoea_attack4',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_attack3ActionGraph,
};

export const typhoeusChr_0034_typhoea_attack4ActionGraph = {
  main: {
    nodes: {
      calculateActionValue_1: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_2',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_1' },
            right: { kind: 'constant', value: 0.13 },
          },
        },
        next: null,
      },
      calculateActionValue_2: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atk_scale_1',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_1' },
            right: { kind: 'constant', value: 0.35 },
          },
        },
        next: 'calculateActionValue_1',
      },
      launchProjectile_3: {
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
                skillId: 'chr_0034_typhoea_attack4_01_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb: 0,
                  atk_scale: 0,
                  atk_scale_1: 0,
                  atk_scale_2: 0,
                  duration: 0,
                  hit_index: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_2' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      spawnAbilityEntity_1: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'fixed', target: 'enemy' },
                            abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
                            childSkillId: 'chr_0034_typhoea_attack_deadarrow',
                            inheritActionBlackboard: false,
                            inheritSourceSkillCastInfo: false,
                            dieWhenSourceDies: false,
                            target: 'enemy',
                            overrideDurationSeconds: { kind: 'constant', value: 3 },
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
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'spawnAbilityEntity_1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_1' },
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
      launchProjectile_4: {
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
                skillId: 'chr_0034_typhoea_attack4_02_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb: 0,
                  atk_scale: 0,
                  atk_scale_1: 0,
                  atk_scale_2: 0,
                  duration: 0,
                  hit_index: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'dealDamage_2' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      spawnAbilityEntity_1: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'fixed', target: 'enemy' },
                            abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
                            childSkillId: 'chr_0034_typhoea_attack_deadarrow',
                            inheritActionBlackboard: false,
                            inheritSourceSkillCastInfo: false,
                            dieWhenSourceDies: false,
                            target: 'enemy',
                            overrideDurationSeconds: { kind: 'constant', value: 3 },
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
                            tags: ['normalAttack'],
                          },
                        },
                        next: 'spawnAbilityEntity_1',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_2' },
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
      applyBuff_9: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_attack_4_addtionalbattleshape_onenemy' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
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
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passive_increase_attackrange' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            isExtra: true,
          },
        },
        next: null,
      },
      reachSkillOperableBoundary_11: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_attack5'] },
        },
        next: null,
      },
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_attack4: SkillDefinition = {
  key: 'chr_0034_typhoea_attack4',
  element: 'nature',
  blackboard: {
    atk_scale: [0.42, 0.46, 0.5, 0.55, 0.59, 0.63, 0.67, 0.71, 0.76, 0.81, 0.87, 0.95],
    atk_scale_1: 0,
    atk_scale_2: 0,
  },
  timelineBlockFrames: 27,
  naturalDurationFrames: 170,
  exclusiveFrame: 34,
  offsetRecordFrame: 21,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 15,
        endFrame: 51,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_attack5',
      },
    ],
    allowedNextSkills: [{ startFrame: 27, endFrame: 51, skillIds: ['chr_0034_typhoea_attack5'] }],
  },
  costFrame: 9,
  scheduledSequences: [
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'calculateActionValue_2' } },
    { startFrame: 5, endFrame: 5, sequence: { $sequence: 'launchProjectile_3' } },
    { startFrame: 15, endFrame: 15, sequence: { $sequence: 'launchProjectile_4' } },
    { startFrame: 18, endFrame: 18, sequence: { $sequence: 'launchProjectile_4' } },
    { startFrame: 21, endFrame: 21, sequence: { $sequence: 'launchProjectile_4' } },
    { startFrame: 24, endFrame: 24, sequence: { $sequence: 'launchProjectile_4' } },
    { startFrame: 27, endFrame: 27, sequence: { $sequence: 'launchProjectile_4' } },
    { startFrame: 14, endFrame: 28, sequence: { $sequence: 'applyBuff_9' } },
    { startFrame: 0, endFrame: 41, sequence: { $sequence: 'applyBuff_10' } },
    { startFrame: 27, endFrame: 51, sequence: { $sequence: 'reachSkillOperableBoundary_11' } },
  ],
  timelineContinuationSkillId: 'chr_0034_typhoea_attack5',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_attack4ActionGraph,
};

export const typhoeusChr_0034_typhoea_attack5ActionGraph = {
  main: {
    nodes: {
      modifyActionValue_1: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_heavyattack_atb_recover',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      launchProjectile_2: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 5,
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0034_typhoea_attack5_01_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atb: 12, atk_scale: 0.5, duration: 0, poise: 15 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_8' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      modifyActionValue_3: {
                        action: {
                          kind: 'modifyActionValue',
                          parameters: {
                            key: 'EntityBB_heavyattack_atb_recover',
                            operation: 'assign',
                            value: { kind: 'constant', value: 1 },
                          },
                        },
                        next: null,
                      },
                      changeResource_4: {
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
                        next: 'modifyActionValue_3',
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
                        },
                        next: null,
                      },
                      checkCondition_2: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                        },
                        next: 'checkCondition_1',
                      },
                      applyBuff_5: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_chr_0034_typhoea_attack_5_damagetaken' }],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                            count: { kind: 'constant', value: 0.3 },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      dealDamage_6: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'nature',
                            attackScale: { kind: 'valueNode', nodeId: 'data_5' },
                            tags: ['normalAttack', 'normalAttackLastCombo'],
                            stagger: { kind: 'valueNode', nodeId: 'data_6' },
                            staggerOnlyWhenCasterControlled: true,
                          },
                        },
                        next: 'applyBuff_5',
                      },
                      ifElse_7: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_2' },
                          whenTrue: { $sequence: 'changeResource_4' },
                          whenFalse: { $sequence: null },
                        },
                        next: 'dealDamage_6',
                      },
                      checkCondition_8: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                        },
                        next: 'ifElse_7',
                      },
                    },
                    dataNodes: {
                      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
                      data_2: {
                        type: 'number',
                        expression: {
                          kind: 'blackboard',
                          key: 'EntityBB_heavyattack_atb_recover',
                          fallback: 0,
                        },
                      },
                      data_3: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_2' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 0 },
                        },
                      },
                      data_4: { type: 'boolean', expression: { kind: 'casterControlled' } },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale' },
                      },
                      data_6: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
                      data_7: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0034_typhoea_attack_5_damagetaken'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 0 },
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
      reachSkillOperableBoundary_3: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_attack1'] },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_attack5: SkillDefinition = {
  key: 'chr_0034_typhoea_attack5',
  element: 'nature',
  blackboard: {
    atb: 21,
    atk_scale: [0.56, 0.61, 0.67, 0.72, 0.78, 0.83, 0.89, 0.94, 1, 1.07, 1.15, 1.25],
    poise: 17,
  },
  timelineBlockFrames: 45,
  naturalDurationFrames: 150,
  exclusiveFrame: 44,
  offsetRecordFrame: 22,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 19,
        endFrame: 62,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_attack1',
      },
    ],
    allowedNextSkills: [{ startFrame: 46, endFrame: 62, skillIds: ['chr_0034_typhoea_attack1'] }],
  },
  costFrame: 23,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'modifyActionValue_1' } },
    { startFrame: 22, endFrame: 28, sequence: { $sequence: 'launchProjectile_2' } },
    { startFrame: 46, endFrame: 62, sequence: { $sequence: 'reachSkillOperableBoundary_3' } },
  ],
  timelineContinuationSkillId: 'chr_0034_typhoea_attack1',
  skillType: 'basicAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_attack5ActionGraph,
};

const typhoeusChr_0034_typhoea_floating_attack1ActionGraphCallback1 = {
  skillId: 'chr_0034_typhoea_floating_attack1_01_projhit',
  nativeSkillType: 'normalSkill',
  naturalDurationFrames: 1,
  castResource: {
    costFrame: 0,
    cooldownSeconds: 0,
    maxChargeTime: 1,
    cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
  },
  blackboard: {
    atb: 0,
    atk_scale_base: 0.5,
    atk_scale_enhence: 1,
    atk_scale_total: 0,
    buff_stack: 0,
    duration: 0,
    enchence_burst_damage_rate: 1.5,
    enhence_arrow: 0,
    hit_index: 0,
    naturalnflict_damageadd: 0.4,
    potential_damage_rate: 1,
    random_float: 0,
    total_damage_rate: 1,
    usp_recover: 5,
  },
  scheduledSequences: [
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_25' } },
  ],
  actionGraph: {
    main: {
      nodes: {
        applyBuff_9: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_2' }],
              targets: { kind: 'source' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: null,
        },
        changeResource_10: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'applyBuff_9',
        },
        finishBuffsByTag_11: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_10',
        },
        checkCondition_8: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
          },
          next: null,
        },
        ifElse_14: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_11' },
            whenFalse: { $sequence: null },
          },
          next: null,
        },
        applyBuff_7: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [
                {
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
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
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'applyBuff_9',
        },
        calculateActionValue_4: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_3' },
              right: { kind: 'valueNode', nodeId: 'data_4' },
            },
          },
          next: 'applyBuff_3',
        },
        changeResource_5: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'calculateActionValue_4',
        },
        finishBuffsByTag_6: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_5',
        },
        ifElse_13: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_6' },
            whenFalse: { $sequence: 'applyBuff_7' },
          },
          next: null,
        },
        checkCondition_12: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
          },
          next: null,
        },
        dealDamage_17: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_7' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        dealDamage_16: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_8' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        spawnAbilityEntity_18: {
          action: {
            kind: 'spawnAbilityEntity',
            parameters: {
              bornAt: { kind: 'fixed', target: 'enemy' },
              abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
              childSkillId: 'chr_0034_typhoea_attack_deadarrow',
              source: 'currentAbilityEntity',
              inheritActionBlackboard: false,
              dieWhenSourceDies: false,
              target: 'enemy',
              overrideDurationSeconds: { kind: 'constant', value: 3 },
            },
          },
          next: null,
        },
        applyBuff_19: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_floatingattack_damagetaken' }],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'spawnAbilityEntity_18',
        },
        ifElse_20: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'dealDamage_16' },
            whenFalse: { $sequence: 'dealDamage_17' },
          },
          next: 'applyBuff_19',
        },
        ifElse_21: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'ifElse_13' },
            whenFalse: { $sequence: 'ifElse_14' },
          },
          next: 'ifElse_20',
        },
        calculateActionValue_22: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_9' },
              right: { kind: 'constant', value: 1 },
            },
          },
          next: 'ifElse_21',
        },
        calculateActionValue_23: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'atk_scale_total',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_7' },
              right: { kind: 'valueNode', nodeId: 'data_10' },
            },
          },
          next: 'calculateActionValue_22',
        },
        readBuffStackCount_24: {
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
          next: 'calculateActionValue_23',
        },
        checkCondition_25: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
          },
          next: 'readBuffStackCount_24',
        },
      },
      dataNodes: {
        data_1: { type: 'number', expression: { kind: 'blackboard', key: 'usp_recover' } },
        data_2: {
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
        data_3: { type: 'number', expression: { kind: 'blackboard', key: 'total_damage_rate' } },
        data_4: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enchence_burst_damage_rate' },
        },
        data_5: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enhence_arrow', fallback: 0 },
        },
        data_6: {
          type: 'boolean',
          expression: {
            kind: 'actionValueCompare',
            left: { kind: 'valueNode', nodeId: 'data_5' },
            operator: 'equal',
            right: { kind: 'constant', value: 1 },
          },
        },
        data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_base' } },
        data_8: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_total' } },
        data_9: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'potential_damage_rate' },
        },
        data_10: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_enhence' } },
        data_11: {
          type: 'boolean',
          expression: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0034_typhoea_floatingattack_damagetaken'],
            operator: 'equal',
            value: { kind: 'constant', value: 0 },
          },
        },
      },
    },
    macros: {},
  },
} as const;

export const typhoeusChr_0034_typhoea_floating_attack1ActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0034_typhoea_floatingmode',
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      jumpTimeline_3: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 75 },
          condition: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_4: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'have_move_input',
            operation: 'assign',
            value: { kind: 'constant', value: 2 },
          },
        },
        next: 'jumpTimeline_3',
      },
      checkCondition_2: {
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
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'modifyActionValue_4' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      jumpTimeline_6: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 45 },
          condition: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_7: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'have_move_input',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'jumpTimeline_6',
      },
      checkCondition_5: {
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
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'modifyActionValue_7' },
          whenFalse: { $sequence: 'ifElse_8' },
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
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'checkCondition_11' },
        },
        next: null,
      },
      castSkillDuringAction_18: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack2',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
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
      castSkillDuringAction_15: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_normal_skill_floating_loop',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      checkCondition_13: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      ifElse_20: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'castSkillDuringAction_15' },
          whenFalse: { $sequence: 'castSkillDuringAction_15' },
        },
        next: null,
      },
      interruptCurrentSkill_24: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      findTargets_76: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: {
              kind: 'enemyByTags',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/chr_0034_typhoea/Locked'],
            },
            saveToContextKey: 'tar1',
          },
        },
        next: null,
      },
      switch_78: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_7' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: 'findTargets_76' } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'findTargets_76' } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: 'findTargets_76' } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: 'findTargets_76' } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: 'findTargets_76' } },
          ],
        },
        next: null,
      },
      ifElse_79: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'switch_78' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      launchProjectile_206: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack1ActionGraphCallback1 },
          ],
        },
        next: null,
      },
      launchProjectile_207: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack1ActionGraphCallback1 },
          ],
        },
        next: 'launchProjectile_206',
      },
      checkCondition_196: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      checkCondition_214: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      checkCondition_219: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: null,
      },
      modifyActionValue_682: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      switch_688: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_7' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      checkCondition_687: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      ifElse_689: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_687' },
          whenTrue: { $sequence: 'switch_688' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_699: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_combo_skill_canusefloatingskill' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      switch_707: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_13' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      readBuffStackCount_708: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'] },
          },
        },
        next: 'switch_707',
      },
      readBuffStackCount_706: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: {
              kind: 'id',
              buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            },
          },
        },
        next: 'switch_707',
      },
      ifElse_709: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_214' },
          whenTrue: { $sequence: 'readBuffStackCount_706' },
          whenFalse: { $sequence: 'readBuffStackCount_708' },
        },
        next: null,
      },
      reachSkillOperableBoundary_741: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_floating_attack2'] },
        },
        next: null,
      },
      switch_745: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_13' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 0 },
              sequence: { $sequence: 'reachSkillOperableBoundary_741' },
            },
            {
              value: { kind: 'constant', value: 1 },
              sequence: { $sequence: 'reachSkillOperableBoundary_741' },
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'reachSkillOperableBoundary_741' },
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'reachSkillOperableBoundary_741' },
            },
          ],
        },
        next: null,
      },
      readBuffStackCount_746: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'] },
          },
        },
        next: 'switch_745',
      },
      readBuffStackCount_744: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: {
              kind: 'id',
              buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            },
          },
        },
        next: 'switch_745',
      },
      ifElse_747: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_214' },
          whenTrue: { $sequence: 'readBuffStackCount_744' },
          whenFalse: { $sequence: 'readBuffStackCount_746' },
        },
        next: null,
      },
      finishBuffsById_804: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_805: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_arrowshow' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_806: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
        },
        next: 'applyBuff_805',
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'castSkillDuringAction_18' },
          whenFalse: { $sequence: 'castSkillDuringAction_18' },
        },
        next: null,
      },
      findTargets_opt2: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'mainTar',
          },
        },
        next: 'ifElse_opt1',
      },
      ifElse_opt3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_20' },
          whenFalse: { $sequence: 'findTargets_opt2' },
        },
        next: null,
      },
      ifElse_opt4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_206' },
          whenFalse: { $sequence: 'launchProjectile_206' },
        },
        next: null,
      },
      forEachContextTarget_opt5: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'tar1' } },
          body: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
      forEachContextTarget_opt6: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
      ifElse_opt7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_207' },
          whenFalse: { $sequence: 'launchProjectile_207' },
        },
        next: null,
      },
      ifElse_opt8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_16' },
          whenTrue: { $sequence: 'forEachContextTarget_opt6' },
          whenFalse: { $sequence: 'ifElse_opt7' },
        },
        next: null,
      },
      ifElse_opt9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_196' },
          whenTrue: { $sequence: 'forEachContextTarget_opt5' },
          whenFalse: { $sequence: 'ifElse_opt8' },
        },
        next: null,
      },
      ifElse_opt10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_opt9' },
          whenFalse: { $sequence: 'ifElse_opt8' },
        },
        next: null,
      },
      modifyActionValue_opt11: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'enhence_arrow',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt10',
      },
      finishBuffsById_opt12: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
            reason: 'other',
            count: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_opt11',
      },
      finishBuffsById_opt13: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            reason: 'other',
            count: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_opt11',
      },
      ifElse_opt14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_214' },
          whenTrue: { $sequence: 'finishBuffsById_opt13' },
          whenFalse: { $sequence: 'ifElse_opt10' },
        },
        next: null,
      },
      ifElse_opt15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_219' },
          whenTrue: { $sequence: 'finishBuffsById_opt12' },
          whenFalse: { $sequence: 'ifElse_opt14' },
        },
        next: null,
      },
      calculateActionValue_opt16: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_times',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_15' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt15',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'fixed', target: 'enemy' },
          distance: 4,
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
          target: { kind: 'fixed', target: 'enemy' },
          distance: 12,
          lessThan: false,
          includeTargetRadius: false,
          containsHittableObject: false,
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
      data_4: { type: 'boolean', expression: { kind: 'casterControlled' } },
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
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'have_move_input' } },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'context', key: 'tar1' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_11: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'have_move_input', fallback: 0 },
      },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_11' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'arrow_num' } },
      data_14: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_15: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_floating_attack_times' },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_floating_attack1: SkillDefinition = {
  key: 'chr_0034_typhoea_floating_attack1',
  element: 'nature',
  blackboard: {
    arrow_num: 0,
    atk_scale_base: [0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.46, 0.49, 0.52, 0.55, 0.6, 0.65],
    atk_scale_enhence: 1.6,
    enchence_burst_damage_rate: [1.1, 1.1, 1.1, 1.15, 1.15, 1.15, 1.2, 1.2, 1.2, 1.25, 1.25, 1.3],
    enhence_arrow: 0,
    have_move_input: 0,
    potential_damage_rate: 1,
    usp_recover: 12,
  },
  timelineBlockFrames: 18,
  naturalDurationFrames: 160,
  exclusiveFrame: 999,
  offsetRecordFrame: 7,
  inputWindows: {
    hasConditionalActions: true,
    allowedNextSkills: [
      { startFrame: 18, endFrame: 25, skillIds: ['chr_0034_typhoea_floating_attack2'] },
      { startFrame: 63, endFrame: 70, skillIds: ['chr_0034_typhoea_floating_attack2'] },
      { startFrame: 93, endFrame: 100, skillIds: ['chr_0034_typhoea_floating_attack2'] },
      { startFrame: 123, endFrame: 130, skillIds: ['chr_0034_typhoea_floating_attack2'] },
      { startFrame: 153, endFrame: 160, skillIds: ['chr_0034_typhoea_floating_attack2'] },
    ],
  },
  costFrame: 13,
  scheduledSequences: [
    { startFrame: 0, endFrame: 160, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 22, endFrame: 25, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 25, endFrame: 28, sequence: { $sequence: 'interruptCurrentSkill_24' } },
    { startFrame: 67, endFrame: 70, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 70, endFrame: 73, sequence: { $sequence: 'interruptCurrentSkill_24' } },
    { startFrame: 97, endFrame: 100, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 100, endFrame: 103, sequence: { $sequence: 'interruptCurrentSkill_24' } },
    { startFrame: 127, endFrame: 130, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 130, endFrame: 133, sequence: { $sequence: 'interruptCurrentSkill_24' } },
    { startFrame: 157, endFrame: 160, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'ifElse_79' } },
    { startFrame: 45, endFrame: 46, sequence: { $sequence: 'ifElse_79' } },
    { startFrame: 75, endFrame: 76, sequence: { $sequence: 'ifElse_79' } },
    { startFrame: 105, endFrame: 106, sequence: { $sequence: 'ifElse_79' } },
    { startFrame: 135, endFrame: 136, sequence: { $sequence: 'ifElse_79' } },
    { startFrame: 1, endFrame: 1, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 46, endFrame: 46, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 76, endFrame: 76, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 106, endFrame: 106, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 136, endFrame: 136, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 0, endFrame: 6, sequence: { $sequence: 'modifyActionValue_682' } },
    { startFrame: 45, endFrame: 51, sequence: { $sequence: 'modifyActionValue_682' } },
    { startFrame: 75, endFrame: 81, sequence: { $sequence: 'modifyActionValue_682' } },
    { startFrame: 105, endFrame: 111, sequence: { $sequence: 'modifyActionValue_682' } },
    { startFrame: 135, endFrame: 141, sequence: { $sequence: 'modifyActionValue_682' } },
    { startFrame: 45, endFrame: 63, sequence: { $sequence: 'ifElse_689' } },
    { startFrame: 75, endFrame: 93, sequence: { $sequence: 'ifElse_689' } },
    { startFrame: 105, endFrame: 123, sequence: { $sequence: 'ifElse_689' } },
    { startFrame: 135, endFrame: 153, sequence: { $sequence: 'ifElse_689' } },
    { startFrame: 0, endFrame: 25, sequence: { $sequence: 'applyBuff_699' } },
    { startFrame: 45, endFrame: 70, sequence: { $sequence: 'applyBuff_699' } },
    { startFrame: 75, endFrame: 100, sequence: { $sequence: 'applyBuff_699' } },
    { startFrame: 105, endFrame: 130, sequence: { $sequence: 'applyBuff_699' } },
    { startFrame: 135, endFrame: 160, sequence: { $sequence: 'applyBuff_699' } },
    { startFrame: 4, endFrame: 25, sequence: { $sequence: 'ifElse_709' } },
    { startFrame: 49, endFrame: 70, sequence: { $sequence: 'ifElse_709' } },
    { startFrame: 79, endFrame: 100, sequence: { $sequence: 'ifElse_709' } },
    { startFrame: 109, endFrame: 130, sequence: { $sequence: 'ifElse_709' } },
    { startFrame: 139, endFrame: 160, sequence: { $sequence: 'ifElse_709' } },
    { startFrame: 18, endFrame: 25, sequence: { $sequence: 'ifElse_747' } },
    { startFrame: 63, endFrame: 70, sequence: { $sequence: 'ifElse_747' } },
    { startFrame: 93, endFrame: 100, sequence: { $sequence: 'ifElse_747' } },
    { startFrame: 123, endFrame: 130, sequence: { $sequence: 'ifElse_747' } },
    { startFrame: 153, endFrame: 160, sequence: { $sequence: 'ifElse_747' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_804' } },
    { startFrame: 14, endFrame: 17, sequence: { $sequence: 'checkCondition_806' } },
    { startFrame: 45, endFrame: 48, sequence: { $sequence: 'finishBuffsById_804' } },
    { startFrame: 59, endFrame: 62, sequence: { $sequence: 'checkCondition_806' } },
    { startFrame: 75, endFrame: 78, sequence: { $sequence: 'finishBuffsById_804' } },
    { startFrame: 89, endFrame: 92, sequence: { $sequence: 'checkCondition_806' } },
    { startFrame: 105, endFrame: 108, sequence: { $sequence: 'finishBuffsById_804' } },
    { startFrame: 119, endFrame: 122, sequence: { $sequence: 'checkCondition_806' } },
    { startFrame: 135, endFrame: 138, sequence: { $sequence: 'finishBuffsById_804' } },
    { startFrame: 149, endFrame: 152, sequence: { $sequence: 'checkCondition_806' } },
  ],
  timelineContinuationSkillId: 'chr_0034_typhoea_floating_attack2',
  skillType: 'basicAttack',
  levelSource: 'battleSkill',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_floating_attack1ActionGraph,
};

const typhoeusChr_0034_typhoea_floating_attack2ActionGraphCallback1 = {
  skillId: 'chr_0034_typhoea_floating_attack1_01_projhit',
  nativeSkillType: 'normalSkill',
  naturalDurationFrames: 1,
  castResource: {
    costFrame: 0,
    cooldownSeconds: 0,
    maxChargeTime: 1,
    cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
  },
  blackboard: {
    atb: 0,
    atk_scale_base: 0.5,
    atk_scale_enhence: 1,
    atk_scale_total: 0,
    buff_stack: 0,
    duration: 0,
    enchence_burst_damage_rate: 1.5,
    enhence_arrow: 0,
    hit_index: 0,
    naturalnflict_damageadd: 0.4,
    potential_damage_rate: 1,
    random_float: 0,
    total_damage_rate: 1,
    usp_recover: 5,
  },
  scheduledSequences: [
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_25' } },
  ],
  actionGraph: {
    main: {
      nodes: {
        applyBuff_9: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_2' }],
              targets: { kind: 'source' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: null,
        },
        changeResource_10: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'applyBuff_9',
        },
        finishBuffsByTag_11: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_10',
        },
        checkCondition_8: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
          },
          next: null,
        },
        ifElse_14: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_11' },
            whenFalse: { $sequence: null },
          },
          next: null,
        },
        applyBuff_7: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [
                {
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
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
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'applyBuff_9',
        },
        calculateActionValue_4: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_3' },
              right: { kind: 'valueNode', nodeId: 'data_4' },
            },
          },
          next: 'applyBuff_3',
        },
        changeResource_5: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'calculateActionValue_4',
        },
        finishBuffsByTag_6: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_5',
        },
        ifElse_13: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_6' },
            whenFalse: { $sequence: 'applyBuff_7' },
          },
          next: null,
        },
        checkCondition_12: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
          },
          next: null,
        },
        dealDamage_17: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_7' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        dealDamage_16: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_8' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        spawnAbilityEntity_18: {
          action: {
            kind: 'spawnAbilityEntity',
            parameters: {
              bornAt: { kind: 'fixed', target: 'enemy' },
              abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
              childSkillId: 'chr_0034_typhoea_attack_deadarrow',
              source: 'currentAbilityEntity',
              inheritActionBlackboard: false,
              dieWhenSourceDies: false,
              target: 'enemy',
              overrideDurationSeconds: { kind: 'constant', value: 3 },
            },
          },
          next: null,
        },
        applyBuff_19: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_floatingattack_damagetaken' }],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'spawnAbilityEntity_18',
        },
        ifElse_20: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'dealDamage_16' },
            whenFalse: { $sequence: 'dealDamage_17' },
          },
          next: 'applyBuff_19',
        },
        ifElse_21: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'ifElse_13' },
            whenFalse: { $sequence: 'ifElse_14' },
          },
          next: 'ifElse_20',
        },
        calculateActionValue_22: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_9' },
              right: { kind: 'constant', value: 1 },
            },
          },
          next: 'ifElse_21',
        },
        calculateActionValue_23: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'atk_scale_total',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_7' },
              right: { kind: 'valueNode', nodeId: 'data_10' },
            },
          },
          next: 'calculateActionValue_22',
        },
        readBuffStackCount_24: {
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
          next: 'calculateActionValue_23',
        },
        checkCondition_25: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
          },
          next: 'readBuffStackCount_24',
        },
      },
      dataNodes: {
        data_1: { type: 'number', expression: { kind: 'blackboard', key: 'usp_recover' } },
        data_2: {
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
        data_3: { type: 'number', expression: { kind: 'blackboard', key: 'total_damage_rate' } },
        data_4: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enchence_burst_damage_rate' },
        },
        data_5: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enhence_arrow', fallback: 0 },
        },
        data_6: {
          type: 'boolean',
          expression: {
            kind: 'actionValueCompare',
            left: { kind: 'valueNode', nodeId: 'data_5' },
            operator: 'equal',
            right: { kind: 'constant', value: 1 },
          },
        },
        data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_base' } },
        data_8: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_total' } },
        data_9: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'potential_damage_rate' },
        },
        data_10: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_enhence' } },
        data_11: {
          type: 'boolean',
          expression: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0034_typhoea_floatingattack_damagetaken'],
            operator: 'equal',
            value: { kind: 'constant', value: 0 },
          },
        },
      },
    },
    macros: {},
  },
} as const;

export const typhoeusChr_0034_typhoea_floating_attack2ActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0034_typhoea_floatingmode',
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      jumpTimeline_3: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 75 },
          condition: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_4: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'have_move_input',
            operation: 'assign',
            value: { kind: 'constant', value: 2 },
          },
        },
        next: 'jumpTimeline_3',
      },
      checkCondition_2: {
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
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'modifyActionValue_4' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      jumpTimeline_6: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 45 },
          condition: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_7: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'have_move_input',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'jumpTimeline_6',
      },
      checkCondition_5: {
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
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'modifyActionValue_7' },
          whenFalse: { $sequence: 'ifElse_8' },
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
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'checkCondition_11' },
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
      castSkillDuringAction_19: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack3',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      castSkillDuringAction_16: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_normal_skill_floating_loop',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      ifElse_21: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'castSkillDuringAction_16' },
          whenFalse: { $sequence: 'castSkillDuringAction_16' },
        },
        next: null,
      },
      interruptCurrentSkill_25: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      findTargets_77: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: {
              kind: 'enemyByTags',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/chr_0034_typhoea/Locked'],
            },
            saveToContextKey: 'tar1',
          },
        },
        next: null,
      },
      switch_79: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_7' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'findTargets_77' } },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: 'findTargets_77' } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: 'findTargets_77' } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: 'findTargets_77' } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: 'findTargets_77' } },
          ],
        },
        next: null,
      },
      ifElse_80: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'switch_79' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      launchProjectile_175: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack2ActionGraphCallback1 },
          ],
        },
        next: null,
      },
      launchProjectile_176: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack2ActionGraphCallback1 },
          ],
        },
        next: 'launchProjectile_175',
      },
      checkCondition_165: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      checkCondition_183: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      checkCondition_188: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: null,
      },
      modifyActionValue_683: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 2 },
          },
        },
        next: null,
      },
      switch_689: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_7' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      checkCondition_688: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      ifElse_690: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_688' },
          whenTrue: { $sequence: 'switch_689' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_700: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_combo_skill_canusefloatingskill' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      switch_708: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_13' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      readBuffStackCount_709: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'] },
          },
        },
        next: 'switch_708',
      },
      readBuffStackCount_707: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: {
              kind: 'id',
              buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            },
          },
        },
        next: 'switch_708',
      },
      ifElse_710: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_183' },
          whenTrue: { $sequence: 'readBuffStackCount_707' },
          whenFalse: { $sequence: 'readBuffStackCount_709' },
        },
        next: null,
      },
      reachSkillOperableBoundary_744: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_floating_attack1'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_743: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_floating_attack2'] },
        },
        next: null,
      },
      reachSkillOperableBoundary_742: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_floating_attack3'] },
        },
        next: null,
      },
      switch_748: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_13' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 0 },
              sequence: { $sequence: 'reachSkillOperableBoundary_742' },
            },
            {
              value: { kind: 'constant', value: 1 },
              sequence: { $sequence: 'reachSkillOperableBoundary_742' },
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'reachSkillOperableBoundary_742' },
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'reachSkillOperableBoundary_743' },
            },
            {
              value: { kind: 'constant', value: 4 },
              sequence: { $sequence: 'reachSkillOperableBoundary_744' },
            },
          ],
        },
        next: null,
      },
      readBuffStackCount_749: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'] },
          },
        },
        next: 'switch_748',
      },
      readBuffStackCount_747: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: {
              kind: 'id',
              buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            },
          },
        },
        next: 'switch_748',
      },
      ifElse_750: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_183' },
          whenTrue: { $sequence: 'readBuffStackCount_747' },
          whenFalse: { $sequence: 'readBuffStackCount_749' },
        },
        next: null,
      },
      finishBuffsById_815: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_816: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_arrowshow' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_817: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
        },
        next: 'applyBuff_816',
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'castSkillDuringAction_19' },
          whenFalse: { $sequence: 'castSkillDuringAction_19' },
        },
        next: null,
      },
      findTargets_opt2: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'mainTar',
          },
        },
        next: 'ifElse_opt1',
      },
      ifElse_opt3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_21' },
          whenFalse: { $sequence: 'findTargets_opt2' },
        },
        next: null,
      },
      ifElse_opt4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_175' },
          whenFalse: { $sequence: 'launchProjectile_175' },
        },
        next: null,
      },
      forEachContextTarget_opt5: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'tar1' } },
          body: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
      forEachContextTarget_opt6: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
      ifElse_opt7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_176' },
          whenFalse: { $sequence: 'launchProjectile_176' },
        },
        next: null,
      },
      ifElse_opt8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'forEachContextTarget_opt6' },
          whenFalse: { $sequence: 'ifElse_opt7' },
        },
        next: null,
      },
      ifElse_opt9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_165' },
          whenTrue: { $sequence: 'forEachContextTarget_opt5' },
          whenFalse: { $sequence: 'ifElse_opt8' },
        },
        next: null,
      },
      ifElse_opt10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_opt9' },
          whenFalse: { $sequence: 'ifElse_opt8' },
        },
        next: null,
      },
      modifyActionValue_opt11: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'enhence_arrow',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt10',
      },
      finishBuffsById_opt12: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
            reason: 'other',
            count: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_opt11',
      },
      finishBuffsById_opt13: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            reason: 'other',
            count: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_opt11',
      },
      ifElse_opt14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_183' },
          whenTrue: { $sequence: 'finishBuffsById_opt13' },
          whenFalse: { $sequence: 'ifElse_opt10' },
        },
        next: null,
      },
      ifElse_opt15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_188' },
          whenTrue: { $sequence: 'finishBuffsById_opt12' },
          whenFalse: { $sequence: 'ifElse_opt14' },
        },
        next: null,
      },
      calculateActionValue_opt16: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_times',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_15' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt15',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'fixed', target: 'enemy' },
          distance: 4,
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
          target: { kind: 'fixed', target: 'enemy' },
          distance: 12,
          lessThan: false,
          includeTargetRadius: false,
          containsHittableObject: false,
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
      data_4: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_6: {
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
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'have_move_input' } },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'context', key: 'tar1' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_11: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'have_move_input', fallback: 0 },
      },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_11' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'arrow_num' } },
      data_14: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_15: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_floating_attack_times' },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_floating_attack2: SkillDefinition = {
  key: 'chr_0034_typhoea_floating_attack2',
  element: 'nature',
  blackboard: {
    arrow_num: 0,
    atk_scale_base: [0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.46, 0.49, 0.52, 0.55, 0.6, 0.65],
    atk_scale_enhence: 1.6,
    enchence_burst_damage_rate: [1.1, 1.1, 1.1, 1.15, 1.15, 1.15, 1.2, 1.2, 1.2, 1.25, 1.25, 1.3],
    enhence_arrow: 0,
    have_move_input: 0,
    potential_damage_rate: 1,
    usp_recover: 12,
  },
  timelineBlockFrames: 18,
  naturalDurationFrames: 160,
  exclusiveFrame: 999,
  offsetRecordFrame: 7,
  inputWindows: {
    hasConditionalActions: true,
    allowedNextSkills: [
      { startFrame: 18, endFrame: 25, skillIds: ['chr_0034_typhoea_floating_attack3'] },
      { startFrame: 63, endFrame: 70, skillIds: ['chr_0034_typhoea_floating_attack3'] },
      { startFrame: 93, endFrame: 100, skillIds: ['chr_0034_typhoea_floating_attack3'] },
      { startFrame: 123, endFrame: 130, skillIds: ['chr_0034_typhoea_floating_attack3'] },
      { startFrame: 153, endFrame: 160, skillIds: ['chr_0034_typhoea_floating_attack3'] },
    ],
  },
  costFrame: 13,
  scheduledSequences: [
    { startFrame: 0, endFrame: 160, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_13' } },
    { startFrame: 22, endFrame: 25, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 25, endFrame: 28, sequence: { $sequence: 'interruptCurrentSkill_25' } },
    { startFrame: 67, endFrame: 70, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 70, endFrame: 73, sequence: { $sequence: 'interruptCurrentSkill_25' } },
    { startFrame: 97, endFrame: 100, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 100, endFrame: 103, sequence: { $sequence: 'interruptCurrentSkill_25' } },
    { startFrame: 127, endFrame: 130, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 130, endFrame: 133, sequence: { $sequence: 'interruptCurrentSkill_25' } },
    { startFrame: 157, endFrame: 160, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 1, endFrame: 1, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 45, endFrame: 46, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 46, endFrame: 46, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 75, endFrame: 76, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 76, endFrame: 76, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 105, endFrame: 106, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 106, endFrame: 106, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 135, endFrame: 136, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 136, endFrame: 136, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 0, endFrame: 6, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 45, endFrame: 51, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 75, endFrame: 81, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 105, endFrame: 111, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 135, endFrame: 141, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 45, endFrame: 63, sequence: { $sequence: 'ifElse_690' } },
    { startFrame: 75, endFrame: 93, sequence: { $sequence: 'ifElse_690' } },
    { startFrame: 105, endFrame: 123, sequence: { $sequence: 'ifElse_690' } },
    { startFrame: 135, endFrame: 153, sequence: { $sequence: 'ifElse_690' } },
    { startFrame: 0, endFrame: 25, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 45, endFrame: 70, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 75, endFrame: 100, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 105, endFrame: 130, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 135, endFrame: 160, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 4, endFrame: 25, sequence: { $sequence: 'ifElse_710' } },
    { startFrame: 49, endFrame: 70, sequence: { $sequence: 'ifElse_710' } },
    { startFrame: 79, endFrame: 100, sequence: { $sequence: 'ifElse_710' } },
    { startFrame: 109, endFrame: 130, sequence: { $sequence: 'ifElse_710' } },
    { startFrame: 139, endFrame: 160, sequence: { $sequence: 'ifElse_710' } },
    { startFrame: 18, endFrame: 25, sequence: { $sequence: 'ifElse_750' } },
    { startFrame: 63, endFrame: 70, sequence: { $sequence: 'ifElse_750' } },
    { startFrame: 93, endFrame: 100, sequence: { $sequence: 'ifElse_750' } },
    { startFrame: 123, endFrame: 130, sequence: { $sequence: 'ifElse_750' } },
    { startFrame: 153, endFrame: 160, sequence: { $sequence: 'ifElse_750' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_815' } },
    { startFrame: 14, endFrame: 17, sequence: { $sequence: 'checkCondition_817' } },
    { startFrame: 45, endFrame: 48, sequence: { $sequence: 'finishBuffsById_815' } },
    { startFrame: 59, endFrame: 62, sequence: { $sequence: 'checkCondition_817' } },
    { startFrame: 75, endFrame: 78, sequence: { $sequence: 'finishBuffsById_815' } },
    { startFrame: 89, endFrame: 92, sequence: { $sequence: 'checkCondition_817' } },
    { startFrame: 105, endFrame: 108, sequence: { $sequence: 'finishBuffsById_815' } },
    { startFrame: 119, endFrame: 122, sequence: { $sequence: 'checkCondition_817' } },
    { startFrame: 135, endFrame: 138, sequence: { $sequence: 'finishBuffsById_815' } },
    { startFrame: 149, endFrame: 152, sequence: { $sequence: 'checkCondition_817' } },
  ],
  timelineContinuationSkillId: 'chr_0034_typhoea_floating_attack3',
  skillType: 'basicAttack',
  levelSource: 'battleSkill',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_floating_attack2ActionGraph,
};

const typhoeusChr_0034_typhoea_floating_attack3ActionGraphCallback1 = {
  skillId: 'chr_0034_typhoea_floating_attack1_01_projhit',
  nativeSkillType: 'normalSkill',
  naturalDurationFrames: 1,
  castResource: {
    costFrame: 0,
    cooldownSeconds: 0,
    maxChargeTime: 1,
    cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
  },
  blackboard: {
    atb: 0,
    atk_scale_base: 0.5,
    atk_scale_enhence: 1,
    atk_scale_total: 0,
    buff_stack: 0,
    duration: 0,
    enchence_burst_damage_rate: 1.5,
    enhence_arrow: 0,
    hit_index: 0,
    naturalnflict_damageadd: 0.4,
    potential_damage_rate: 1,
    random_float: 0,
    total_damage_rate: 1,
    usp_recover: 5,
  },
  scheduledSequences: [
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_25' } },
  ],
  actionGraph: {
    main: {
      nodes: {
        applyBuff_9: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_2' }],
              targets: { kind: 'source' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: null,
        },
        changeResource_10: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'applyBuff_9',
        },
        finishBuffsByTag_11: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_10',
        },
        checkCondition_8: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
          },
          next: null,
        },
        ifElse_14: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_11' },
            whenFalse: { $sequence: null },
          },
          next: null,
        },
        applyBuff_7: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [
                {
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
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
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'applyBuff_9',
        },
        calculateActionValue_4: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_3' },
              right: { kind: 'valueNode', nodeId: 'data_4' },
            },
          },
          next: 'applyBuff_3',
        },
        changeResource_5: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'calculateActionValue_4',
        },
        finishBuffsByTag_6: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_5',
        },
        ifElse_13: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_6' },
            whenFalse: { $sequence: 'applyBuff_7' },
          },
          next: null,
        },
        checkCondition_12: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
          },
          next: null,
        },
        dealDamage_17: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_7' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        dealDamage_16: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_8' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        spawnAbilityEntity_18: {
          action: {
            kind: 'spawnAbilityEntity',
            parameters: {
              bornAt: { kind: 'fixed', target: 'enemy' },
              abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
              childSkillId: 'chr_0034_typhoea_attack_deadarrow',
              source: 'currentAbilityEntity',
              inheritActionBlackboard: false,
              dieWhenSourceDies: false,
              target: 'enemy',
              overrideDurationSeconds: { kind: 'constant', value: 3 },
            },
          },
          next: null,
        },
        applyBuff_19: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_floatingattack_damagetaken' }],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'spawnAbilityEntity_18',
        },
        ifElse_20: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'dealDamage_16' },
            whenFalse: { $sequence: 'dealDamage_17' },
          },
          next: 'applyBuff_19',
        },
        ifElse_21: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'ifElse_13' },
            whenFalse: { $sequence: 'ifElse_14' },
          },
          next: 'ifElse_20',
        },
        calculateActionValue_22: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_9' },
              right: { kind: 'constant', value: 1 },
            },
          },
          next: 'ifElse_21',
        },
        calculateActionValue_23: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'atk_scale_total',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_7' },
              right: { kind: 'valueNode', nodeId: 'data_10' },
            },
          },
          next: 'calculateActionValue_22',
        },
        readBuffStackCount_24: {
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
          next: 'calculateActionValue_23',
        },
        checkCondition_25: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
          },
          next: 'readBuffStackCount_24',
        },
      },
      dataNodes: {
        data_1: { type: 'number', expression: { kind: 'blackboard', key: 'usp_recover' } },
        data_2: {
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
        data_3: { type: 'number', expression: { kind: 'blackboard', key: 'total_damage_rate' } },
        data_4: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enchence_burst_damage_rate' },
        },
        data_5: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enhence_arrow', fallback: 0 },
        },
        data_6: {
          type: 'boolean',
          expression: {
            kind: 'actionValueCompare',
            left: { kind: 'valueNode', nodeId: 'data_5' },
            operator: 'equal',
            right: { kind: 'constant', value: 1 },
          },
        },
        data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_base' } },
        data_8: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_total' } },
        data_9: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'potential_damage_rate' },
        },
        data_10: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_enhence' } },
        data_11: {
          type: 'boolean',
          expression: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0034_typhoea_floatingattack_damagetaken'],
            operator: 'equal',
            value: { kind: 'constant', value: 0 },
          },
        },
      },
    },
    macros: {},
  },
} as const;

export const typhoeusChr_0034_typhoea_floating_attack3ActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0034_typhoea_floatingmode',
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      jumpTimeline_3: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 75 },
          condition: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_4: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'have_move_input',
            operation: 'assign',
            value: { kind: 'constant', value: 2 },
          },
        },
        next: 'jumpTimeline_3',
      },
      checkCondition_2: {
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
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'modifyActionValue_4' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      jumpTimeline_6: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 45 },
          condition: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_7: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'have_move_input',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'jumpTimeline_6',
      },
      checkCondition_5: {
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
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'modifyActionValue_7' },
          whenFalse: { $sequence: 'ifElse_8' },
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
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'checkCondition_11' },
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
      castSkillDuringAction_19: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack4',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      castSkillDuringAction_16: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_normal_skill_floating_loop',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      ifElse_21: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'castSkillDuringAction_16' },
          whenFalse: { $sequence: 'castSkillDuringAction_16' },
        },
        next: null,
      },
      interruptCurrentSkill_25: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      findTargets_77: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: {
              kind: 'enemyByTags',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/chr_0034_typhoea/Locked'],
            },
            saveToContextKey: 'tar1',
          },
        },
        next: null,
      },
      switch_79: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_7' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'findTargets_77' } },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: 'findTargets_77' } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: 'findTargets_77' } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: 'findTargets_77' } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: 'findTargets_77' } },
          ],
        },
        next: null,
      },
      ifElse_80: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'switch_79' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      launchProjectile_175: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack3ActionGraphCallback1 },
          ],
        },
        next: null,
      },
      launchProjectile_176: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack3ActionGraphCallback1 },
          ],
        },
        next: 'launchProjectile_175',
      },
      checkCondition_165: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      checkCondition_183: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      checkCondition_188: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: null,
      },
      modifyActionValue_683: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 3 },
          },
        },
        next: null,
      },
      switch_689: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_7' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      checkCondition_688: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      ifElse_690: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_688' },
          whenTrue: { $sequence: 'switch_689' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_700: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_combo_skill_canusefloatingskill' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      switch_705: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_13' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      readBuffStackCount_706: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'] },
          },
        },
        next: 'switch_705',
      },
      reachSkillOperableBoundary_717: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_floating_attack4'] },
        },
        next: null,
      },
      ifElse_718: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_13' },
          whenTrue: { $sequence: 'reachSkillOperableBoundary_717' },
          whenFalse: { $sequence: 'reachSkillOperableBoundary_717' },
        },
        next: null,
      },
      finishBuffsById_735: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_736: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_arrowshow' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_737: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
        },
        next: 'applyBuff_736',
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'castSkillDuringAction_19' },
          whenFalse: { $sequence: 'castSkillDuringAction_19' },
        },
        next: null,
      },
      findTargets_opt2: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'mainTar',
          },
        },
        next: 'ifElse_opt1',
      },
      ifElse_opt3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_21' },
          whenFalse: { $sequence: 'findTargets_opt2' },
        },
        next: null,
      },
      ifElse_opt4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_175' },
          whenFalse: { $sequence: 'launchProjectile_175' },
        },
        next: null,
      },
      forEachContextTarget_opt5: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'tar1' } },
          body: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
      forEachContextTarget_opt6: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
      ifElse_opt7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_176' },
          whenFalse: { $sequence: 'launchProjectile_176' },
        },
        next: null,
      },
      ifElse_opt8: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_17' },
          whenTrue: { $sequence: 'forEachContextTarget_opt6' },
          whenFalse: { $sequence: 'ifElse_opt7' },
        },
        next: null,
      },
      ifElse_opt9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_165' },
          whenTrue: { $sequence: 'forEachContextTarget_opt5' },
          whenFalse: { $sequence: 'ifElse_opt8' },
        },
        next: null,
      },
      ifElse_opt10: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_opt9' },
          whenFalse: { $sequence: 'ifElse_opt8' },
        },
        next: null,
      },
      modifyActionValue_opt11: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'enhence_arrow',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt10',
      },
      finishBuffsById_opt12: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
            reason: 'other',
            count: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_opt11',
      },
      finishBuffsById_opt13: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            reason: 'other',
            count: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_opt11',
      },
      ifElse_opt14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_183' },
          whenTrue: { $sequence: 'finishBuffsById_opt13' },
          whenFalse: { $sequence: 'ifElse_opt10' },
        },
        next: null,
      },
      ifElse_opt15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_188' },
          whenTrue: { $sequence: 'finishBuffsById_opt12' },
          whenFalse: { $sequence: 'ifElse_opt14' },
        },
        next: null,
      },
      calculateActionValue_opt16: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_times',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_15' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt15',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'targetDistance',
          source: { kind: 'owner' },
          target: { kind: 'fixed', target: 'enemy' },
          distance: 4,
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
          target: { kind: 'fixed', target: 'enemy' },
          distance: 12,
          lessThan: false,
          includeTargetRadius: false,
          containsHittableObject: false,
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
      data_4: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_6: {
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
      data_7: { type: 'number', expression: { kind: 'blackboard', key: 'have_move_input' } },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'context', key: 'tar1' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_11: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'have_move_input', fallback: 0 },
      },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_11' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'arrow_num' } },
      data_14: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_15: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_floating_attack_times' },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_floating_attack3: SkillDefinition = {
  key: 'chr_0034_typhoea_floating_attack3',
  element: 'nature',
  blackboard: {
    arrow_num: 0,
    atk_scale_base: [0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.46, 0.49, 0.52, 0.55, 0.6, 0.65],
    atk_scale_enhence: 1.6,
    enchence_burst_damage_rate: [1.1, 1.1, 1.1, 1.15, 1.15, 1.15, 1.2, 1.2, 1.2, 1.25, 1.25, 1.3],
    enhence_arrow: 0,
    have_move_input: 0,
    potential_damage_rate: 1,
    usp_recover: 12,
  },
  timelineBlockFrames: 18,
  naturalDurationFrames: 160,
  exclusiveFrame: 999,
  offsetRecordFrame: 7,
  inputWindows: {
    hasConditionalActions: true,
    allowedNextSkills: [
      { startFrame: 18, endFrame: 26, skillIds: ['chr_0034_typhoea_floating_attack4'] },
      { startFrame: 63, endFrame: 70, skillIds: ['chr_0034_typhoea_floating_attack4'] },
      { startFrame: 93, endFrame: 100, skillIds: ['chr_0034_typhoea_floating_attack4'] },
      { startFrame: 123, endFrame: 130, skillIds: ['chr_0034_typhoea_floating_attack4'] },
      { startFrame: 153, endFrame: 160, skillIds: ['chr_0034_typhoea_floating_attack4'] },
    ],
  },
  costFrame: 13,
  scheduledSequences: [
    { startFrame: 0, endFrame: 160, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_13' } },
    { startFrame: 23, endFrame: 26, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 26, endFrame: 29, sequence: { $sequence: 'interruptCurrentSkill_25' } },
    { startFrame: 67, endFrame: 70, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 70, endFrame: 73, sequence: { $sequence: 'interruptCurrentSkill_25' } },
    { startFrame: 97, endFrame: 100, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 100, endFrame: 103, sequence: { $sequence: 'interruptCurrentSkill_25' } },
    { startFrame: 127, endFrame: 130, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 130, endFrame: 133, sequence: { $sequence: 'interruptCurrentSkill_25' } },
    { startFrame: 157, endFrame: 160, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 1, endFrame: 1, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 45, endFrame: 46, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 46, endFrame: 46, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 75, endFrame: 76, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 76, endFrame: 76, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 105, endFrame: 106, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 106, endFrame: 106, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 135, endFrame: 136, sequence: { $sequence: 'ifElse_80' } },
    { startFrame: 136, endFrame: 136, sequence: { $sequence: 'calculateActionValue_opt16' } },
    { startFrame: 0, endFrame: 6, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 45, endFrame: 51, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 75, endFrame: 81, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 105, endFrame: 111, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 135, endFrame: 141, sequence: { $sequence: 'modifyActionValue_683' } },
    { startFrame: 45, endFrame: 63, sequence: { $sequence: 'ifElse_690' } },
    { startFrame: 75, endFrame: 93, sequence: { $sequence: 'ifElse_690' } },
    { startFrame: 105, endFrame: 123, sequence: { $sequence: 'ifElse_690' } },
    { startFrame: 135, endFrame: 153, sequence: { $sequence: 'ifElse_690' } },
    { startFrame: 0, endFrame: 26, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 45, endFrame: 70, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 75, endFrame: 100, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 105, endFrame: 130, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 135, endFrame: 160, sequence: { $sequence: 'applyBuff_700' } },
    { startFrame: 4, endFrame: 26, sequence: { $sequence: 'readBuffStackCount_706' } },
    { startFrame: 49, endFrame: 70, sequence: { $sequence: 'readBuffStackCount_706' } },
    { startFrame: 79, endFrame: 100, sequence: { $sequence: 'readBuffStackCount_706' } },
    { startFrame: 109, endFrame: 130, sequence: { $sequence: 'readBuffStackCount_706' } },
    { startFrame: 139, endFrame: 160, sequence: { $sequence: 'readBuffStackCount_706' } },
    { startFrame: 18, endFrame: 26, sequence: { $sequence: 'ifElse_718' } },
    { startFrame: 63, endFrame: 70, sequence: { $sequence: 'ifElse_718' } },
    { startFrame: 93, endFrame: 100, sequence: { $sequence: 'ifElse_718' } },
    { startFrame: 123, endFrame: 130, sequence: { $sequence: 'ifElse_718' } },
    { startFrame: 153, endFrame: 160, sequence: { $sequence: 'ifElse_718' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_735' } },
    { startFrame: 15, endFrame: 18, sequence: { $sequence: 'checkCondition_737' } },
    { startFrame: 45, endFrame: 48, sequence: { $sequence: 'finishBuffsById_735' } },
    { startFrame: 60, endFrame: 63, sequence: { $sequence: 'checkCondition_737' } },
    { startFrame: 75, endFrame: 78, sequence: { $sequence: 'finishBuffsById_735' } },
    { startFrame: 90, endFrame: 93, sequence: { $sequence: 'checkCondition_737' } },
    { startFrame: 105, endFrame: 108, sequence: { $sequence: 'finishBuffsById_735' } },
    { startFrame: 120, endFrame: 123, sequence: { $sequence: 'checkCondition_737' } },
    { startFrame: 135, endFrame: 138, sequence: { $sequence: 'finishBuffsById_735' } },
    { startFrame: 150, endFrame: 153, sequence: { $sequence: 'checkCondition_737' } },
  ],
  timelineContinuationSkillId: 'chr_0034_typhoea_floating_attack4',
  skillType: 'basicAttack',
  levelSource: 'battleSkill',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_floating_attack3ActionGraph,
};

const typhoeusChr_0034_typhoea_floating_attack4ActionGraphCallback1 = {
  skillId: 'chr_0034_typhoea_floating_attack1_01_projhit',
  nativeSkillType: 'normalSkill',
  naturalDurationFrames: 1,
  castResource: {
    costFrame: 0,
    cooldownSeconds: 0,
    maxChargeTime: 1,
    cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
  },
  blackboard: {
    atb: 0,
    atk_scale_base: 0.5,
    atk_scale_enhence: 1,
    atk_scale_total: 0,
    buff_stack: 0,
    duration: 0,
    enchence_burst_damage_rate: 1.5,
    enhence_arrow: 0,
    hit_index: 0,
    naturalnflict_damageadd: 0.4,
    potential_damage_rate: 1,
    random_float: 0,
    total_damage_rate: 1,
    usp_recover: 5,
  },
  scheduledSequences: [
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_25' } },
  ],
  actionGraph: {
    main: {
      nodes: {
        applyBuff_9: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_2' }],
              targets: { kind: 'source' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: null,
        },
        changeResource_10: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'applyBuff_9',
        },
        finishBuffsByTag_11: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_10',
        },
        checkCondition_8: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
          },
          next: null,
        },
        ifElse_14: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_11' },
            whenFalse: { $sequence: null },
          },
          next: null,
        },
        applyBuff_7: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [
                {
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
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
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'applyBuff_9',
        },
        calculateActionValue_4: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_3' },
              right: { kind: 'valueNode', nodeId: 'data_4' },
            },
          },
          next: 'applyBuff_3',
        },
        changeResource_5: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'calculateActionValue_4',
        },
        finishBuffsByTag_6: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_5',
        },
        ifElse_13: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_6' },
            whenFalse: { $sequence: 'applyBuff_7' },
          },
          next: null,
        },
        checkCondition_12: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
          },
          next: null,
        },
        dealDamage_17: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_7' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        dealDamage_16: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_8' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        spawnAbilityEntity_18: {
          action: {
            kind: 'spawnAbilityEntity',
            parameters: {
              bornAt: { kind: 'fixed', target: 'enemy' },
              abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
              childSkillId: 'chr_0034_typhoea_attack_deadarrow',
              source: 'currentAbilityEntity',
              inheritActionBlackboard: false,
              dieWhenSourceDies: false,
              target: 'enemy',
              overrideDurationSeconds: { kind: 'constant', value: 3 },
            },
          },
          next: null,
        },
        applyBuff_19: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_floatingattack_damagetaken' }],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'spawnAbilityEntity_18',
        },
        ifElse_20: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'dealDamage_16' },
            whenFalse: { $sequence: 'dealDamage_17' },
          },
          next: 'applyBuff_19',
        },
        ifElse_21: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'ifElse_13' },
            whenFalse: { $sequence: 'ifElse_14' },
          },
          next: 'ifElse_20',
        },
        calculateActionValue_22: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_9' },
              right: { kind: 'constant', value: 1 },
            },
          },
          next: 'ifElse_21',
        },
        calculateActionValue_23: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'atk_scale_total',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_7' },
              right: { kind: 'valueNode', nodeId: 'data_10' },
            },
          },
          next: 'calculateActionValue_22',
        },
        readBuffStackCount_24: {
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
          next: 'calculateActionValue_23',
        },
        checkCondition_25: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
          },
          next: 'readBuffStackCount_24',
        },
      },
      dataNodes: {
        data_1: { type: 'number', expression: { kind: 'blackboard', key: 'usp_recover' } },
        data_2: {
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
        data_3: { type: 'number', expression: { kind: 'blackboard', key: 'total_damage_rate' } },
        data_4: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enchence_burst_damage_rate' },
        },
        data_5: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enhence_arrow', fallback: 0 },
        },
        data_6: {
          type: 'boolean',
          expression: {
            kind: 'actionValueCompare',
            left: { kind: 'valueNode', nodeId: 'data_5' },
            operator: 'equal',
            right: { kind: 'constant', value: 1 },
          },
        },
        data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_base' } },
        data_8: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_total' } },
        data_9: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'potential_damage_rate' },
        },
        data_10: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_enhence' } },
        data_11: {
          type: 'boolean',
          expression: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0034_typhoea_floatingattack_damagetaken'],
            operator: 'equal',
            value: { kind: 'constant', value: 0 },
          },
        },
      },
    },
    macros: {},
  },
} as const;

export const typhoeusChr_0034_typhoea_floating_attack4ActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0034_typhoea_floatingmode',
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      jumpTimeline_3: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 300 },
          condition: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_4: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'have_move_input',
            operation: 'assign',
            value: { kind: 'constant', value: 2 },
          },
        },
        next: 'jumpTimeline_3',
      },
      checkCondition_2: {
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
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'modifyActionValue_4' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      jumpTimeline_6: {
        action: {
          kind: 'jumpTimeline',
          parameters: { destinationFrame: 150 },
          condition: { $sequence: null },
        },
        next: null,
      },
      modifyActionValue_7: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'have_move_input',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'jumpTimeline_6',
      },
      checkCondition_5: {
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
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'modifyActionValue_7' },
          whenFalse: { $sequence: 'ifElse_8' },
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
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'checkCondition_11' },
        },
        next: null,
      },
      applyBuff_13: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_aimmedenemy_all' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      forEachContextTarget_14: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'applyBuff_13' },
        },
        next: null,
      },
      findTargets_27: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: {
              kind: 'enemyByTags',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/chr_0034_typhoea/Locked'],
            },
            saveToContextKey: 'tar1',
          },
        },
        next: null,
      },
      switch_29: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_5' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'findTargets_27' } },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: 'findTargets_27' } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: 'findTargets_27' } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: 'findTargets_27' } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: 'findTargets_27' } },
          ],
        },
        next: null,
      },
      ifElse_30: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'switch_29' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      launchProjectile_125: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack4ActionGraphCallback1 },
          ],
        },
        next: null,
      },
      launchProjectile_126: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack4ActionGraphCallback1 },
          ],
        },
        next: 'launchProjectile_125',
      },
      checkCondition_127: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      checkCondition_115: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      checkCondition_133: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      checkCondition_138: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      modifyActionValue_633: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 4 },
          },
        },
        next: null,
      },
      checkCondition_638: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: null,
      },
      castSkillDuringAction_641: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack5',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      modifyActionValue_647: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      finishBuffsById_648: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_floatingmode'],
            reason: 'other',
          },
        },
        next: 'modifyActionValue_647',
      },
      ifElse_649: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'finishBuffsById_648' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_652: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'castSkillDuringAction_641' },
        },
        next: null,
      },
      ifElse_657: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'finishBuffsById_648' },
          whenFalse: { $sequence: 'castSkillDuringAction_641' },
        },
        next: null,
      },
      markCurrentSkillCanInterrupt_682: {
        action: { kind: 'markCurrentSkillCanInterrupt', parameters: {} },
        next: null,
      },
      interruptCurrentSkill_683: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      switch_693: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_5' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      checkCondition_692: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: null,
      },
      ifElse_694: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_692' },
          whenTrue: { $sequence: 'switch_693' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      applyBuff_704: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_combo_skill_canusefloatingskill' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      checkCondition_710: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_13' } },
        },
        next: null,
      },
      forEachContextTarget_711: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'tar1' } },
          body: { $sequence: 'checkCondition_710' },
        },
        next: null,
      },
      checkCondition_712: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
        },
        next: 'forEachContextTarget_711',
      },
      reachSkillOperableBoundary_731: {
        action: {
          kind: 'reachSkillOperableBoundary',
          parameters: { skillIds: ['chr_0034_typhoea_floating_attack5'] },
        },
        next: null,
      },
      ifElse_732: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_638' },
          whenTrue: { $sequence: 'reachSkillOperableBoundary_731' },
          whenFalse: { $sequence: 'reachSkillOperableBoundary_731' },
        },
        next: null,
      },
      finishBuffsById_749: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_750: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_arrowshow' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_751: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_15' } },
        },
        next: 'applyBuff_750',
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_125' },
          whenFalse: { $sequence: 'launchProjectile_125' },
        },
        next: null,
      },
      forEachContextTarget_opt2: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'tar1' } },
          body: { $sequence: 'ifElse_opt1' },
        },
        next: null,
      },
      forEachContextTarget_opt3: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt1' },
        },
        next: null,
      },
      ifElse_opt4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_126' },
          whenFalse: { $sequence: 'launchProjectile_126' },
        },
        next: null,
      },
      ifElse_opt5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_127' },
          whenTrue: { $sequence: 'forEachContextTarget_opt3' },
          whenFalse: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
      ifElse_opt6: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_115' },
          whenTrue: { $sequence: 'forEachContextTarget_opt2' },
          whenFalse: { $sequence: 'ifElse_opt5' },
        },
        next: null,
      },
      ifElse_opt7: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'ifElse_opt6' },
          whenFalse: { $sequence: 'ifElse_opt5' },
        },
        next: null,
      },
      modifyActionValue_opt8: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'enhence_arrow',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt7',
      },
      finishBuffsById_opt9: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
            reason: 'other',
            count: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_opt8',
      },
      finishBuffsById_opt10: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            reason: 'other',
            count: { kind: 'constant', value: 1 },
          },
        },
        next: 'modifyActionValue_opt8',
      },
      ifElse_opt11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_133' },
          whenTrue: { $sequence: 'finishBuffsById_opt10' },
          whenFalse: { $sequence: 'ifElse_opt7' },
        },
        next: null,
      },
      ifElse_opt12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_138' },
          whenTrue: { $sequence: 'finishBuffsById_opt9' },
          whenFalse: { $sequence: 'ifElse_opt11' },
        },
        next: null,
      },
      calculateActionValue_opt13: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_times',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_16' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'ifElse_opt12',
      },
      ifElse_opt14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'castSkillDuringAction_641' },
          whenFalse: { $sequence: 'castSkillDuringAction_641' },
        },
        next: null,
      },
      findTargets_opt15: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'mainTar',
          },
        },
        next: 'ifElse_opt14',
      },
      ifElse_opt16: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'findTargets_opt15' },
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
          target: { kind: 'fixed', target: 'enemy' },
          distance: 4,
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
          target: { kind: 'fixed', target: 'enemy' },
          distance: 12,
          lessThan: false,
          includeTargetRadius: false,
          containsHittableObject: false,
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
      data_4: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'have_move_input' } },
      data_6: {
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
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'context', key: 'tar1' },
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
          buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_10: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_11: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'have_move_input', fallback: 0 },
      },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_11' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
      data_13: { type: 'boolean', expression: { kind: 'enemyRankIn', ranks: ['boss'] } },
      data_14: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_15: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_16: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_floating_attack_times' },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_floating_attack4: SkillDefinition = {
  key: 'chr_0034_typhoea_floating_attack4',
  element: 'nature',
  blackboard: {
    atk_scale_base: [0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.46, 0.49, 0.52, 0.55, 0.6, 0.65],
    atk_scale_enhence: 1.6,
    enchence_burst_damage_rate: [1.1, 1.1, 1.1, 1.15, 1.15, 1.15, 1.2, 1.2, 1.2, 1.25, 1.25, 1.3],
    enhence_arrow: 0,
    have_move_input: 0,
    potential_damage_rate: 1,
    usp_recover: 12,
  },
  timelineBlockFrames: 28,
  naturalDurationFrames: 740,
  exclusiveFrame: 999,
  offsetRecordFrame: 7,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 8,
        endFrame: 42,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_floating_attack5',
      },
      {
        startFrame: 150,
        endFrame: 197,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_floating_attack5',
      },
      {
        startFrame: 300,
        endFrame: 347,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_floating_attack5',
      },
      {
        startFrame: 450,
        endFrame: 497,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_floating_attack5',
      },
      {
        startFrame: 603,
        endFrame: 650,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_floating_attack5',
      },
    ],
    hasConditionalActions: true,
    allowedNextSkills: [
      { startFrame: 28, endFrame: 42, skillIds: ['chr_0034_typhoea_floating_attack5'] },
      { startFrame: 178, endFrame: 193, skillIds: ['chr_0034_typhoea_floating_attack5'] },
      { startFrame: 328, endFrame: 342, skillIds: ['chr_0034_typhoea_floating_attack5'] },
      { startFrame: 478, endFrame: 492, skillIds: ['chr_0034_typhoea_floating_attack5'] },
      { startFrame: 628, endFrame: 642, skillIds: ['chr_0034_typhoea_floating_attack5'] },
    ],
  },
  costFrame: 13,
  scheduledSequences: [
    { startFrame: 0, endFrame: 739, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'forEachContextTarget_14' } },
    { startFrame: 150, endFrame: 153, sequence: { $sequence: 'forEachContextTarget_14' } },
    { startFrame: 300, endFrame: 303, sequence: { $sequence: 'forEachContextTarget_14' } },
    { startFrame: 450, endFrame: 453, sequence: { $sequence: 'forEachContextTarget_14' } },
    { startFrame: 600, endFrame: 603, sequence: { $sequence: 'forEachContextTarget_14' } },
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'ifElse_30' } },
    { startFrame: 1, endFrame: 1, sequence: { $sequence: 'calculateActionValue_opt13' } },
    { startFrame: 150, endFrame: 151, sequence: { $sequence: 'ifElse_30' } },
    { startFrame: 151, endFrame: 151, sequence: { $sequence: 'calculateActionValue_opt13' } },
    { startFrame: 300, endFrame: 301, sequence: { $sequence: 'ifElse_30' } },
    { startFrame: 301, endFrame: 301, sequence: { $sequence: 'calculateActionValue_opt13' } },
    { startFrame: 450, endFrame: 451, sequence: { $sequence: 'ifElse_30' } },
    { startFrame: 451, endFrame: 451, sequence: { $sequence: 'calculateActionValue_opt13' } },
    { startFrame: 600, endFrame: 601, sequence: { $sequence: 'ifElse_30' } },
    { startFrame: 601, endFrame: 601, sequence: { $sequence: 'calculateActionValue_opt13' } },
    { startFrame: 0, endFrame: 6, sequence: { $sequence: 'modifyActionValue_633' } },
    { startFrame: 150, endFrame: 156, sequence: { $sequence: 'modifyActionValue_633' } },
    { startFrame: 300, endFrame: 306, sequence: { $sequence: 'modifyActionValue_633' } },
    { startFrame: 450, endFrame: 456, sequence: { $sequence: 'modifyActionValue_633' } },
    { startFrame: 600, endFrame: 606, sequence: { $sequence: 'modifyActionValue_633' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_638' } },
    { startFrame: 35, endFrame: 38, sequence: { $sequence: 'ifElse_opt16' } },
    { startFrame: 45, endFrame: 81, sequence: { $sequence: 'ifElse_649' } },
    { startFrame: 185, endFrame: 188, sequence: { $sequence: 'ifElse_652' } },
    { startFrame: 195, endFrame: 229, sequence: { $sequence: 'ifElse_657' } },
    { startFrame: 335, endFrame: 338, sequence: { $sequence: 'ifElse_652' } },
    { startFrame: 345, endFrame: 379, sequence: { $sequence: 'ifElse_657' } },
    { startFrame: 485, endFrame: 488, sequence: { $sequence: 'ifElse_652' } },
    { startFrame: 495, endFrame: 590, sequence: { $sequence: 'ifElse_657' } },
    { startFrame: 635, endFrame: 638, sequence: { $sequence: 'ifElse_652' } },
    { startFrame: 645, endFrame: 679, sequence: { $sequence: 'ifElse_657' } },
    { startFrame: 58, endFrame: 139, sequence: { $sequence: 'markCurrentSkillCanInterrupt_682' } },
    { startFrame: 139, endFrame: 140, sequence: { $sequence: 'interruptCurrentSkill_683' } },
    { startFrame: 210, endFrame: 289, sequence: { $sequence: 'markCurrentSkillCanInterrupt_682' } },
    { startFrame: 289, endFrame: 290, sequence: { $sequence: 'interruptCurrentSkill_683' } },
    { startFrame: 359, endFrame: 439, sequence: { $sequence: 'markCurrentSkillCanInterrupt_682' } },
    { startFrame: 439, endFrame: 440, sequence: { $sequence: 'interruptCurrentSkill_683' } },
    { startFrame: 509, endFrame: 589, sequence: { $sequence: 'markCurrentSkillCanInterrupt_682' } },
    { startFrame: 589, endFrame: 590, sequence: { $sequence: 'interruptCurrentSkill_683' } },
    { startFrame: 659, endFrame: 739, sequence: { $sequence: 'markCurrentSkillCanInterrupt_682' } },
    { startFrame: 739, endFrame: 740, sequence: { $sequence: 'interruptCurrentSkill_683' } },
    { startFrame: 150, endFrame: 174, sequence: { $sequence: 'ifElse_694' } },
    { startFrame: 300, endFrame: 324, sequence: { $sequence: 'ifElse_694' } },
    { startFrame: 450, endFrame: 474, sequence: { $sequence: 'ifElse_694' } },
    { startFrame: 600, endFrame: 624, sequence: { $sequence: 'ifElse_694' } },
    { startFrame: 0, endFrame: 45, sequence: { $sequence: 'applyBuff_704' } },
    { startFrame: 150, endFrame: 197, sequence: { $sequence: 'applyBuff_704' } },
    { startFrame: 300, endFrame: 347, sequence: { $sequence: 'applyBuff_704' } },
    { startFrame: 450, endFrame: 497, sequence: { $sequence: 'applyBuff_704' } },
    { startFrame: 600, endFrame: 647, sequence: { $sequence: 'applyBuff_704' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_712' } },
    { startFrame: 150, endFrame: 153, sequence: { $sequence: 'checkCondition_712' } },
    { startFrame: 300, endFrame: 303, sequence: { $sequence: 'checkCondition_712' } },
    { startFrame: 450, endFrame: 453, sequence: { $sequence: 'checkCondition_712' } },
    { startFrame: 600, endFrame: 603, sequence: { $sequence: 'checkCondition_712' } },
    { startFrame: 28, endFrame: 42, sequence: { $sequence: 'ifElse_732' } },
    { startFrame: 178, endFrame: 193, sequence: { $sequence: 'ifElse_732' } },
    { startFrame: 328, endFrame: 342, sequence: { $sequence: 'ifElse_732' } },
    { startFrame: 478, endFrame: 492, sequence: { $sequence: 'ifElse_732' } },
    { startFrame: 628, endFrame: 642, sequence: { $sequence: 'ifElse_732' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_749' } },
    { startFrame: 7, endFrame: 10, sequence: { $sequence: 'checkCondition_751' } },
    { startFrame: 45, endFrame: 48, sequence: { $sequence: 'finishBuffsById_749' } },
    { startFrame: 151, endFrame: 154, sequence: { $sequence: 'finishBuffsById_749' } },
    { startFrame: 158, endFrame: 161, sequence: { $sequence: 'checkCondition_751' } },
    { startFrame: 195, endFrame: 198, sequence: { $sequence: 'finishBuffsById_749' } },
    { startFrame: 300, endFrame: 303, sequence: { $sequence: 'finishBuffsById_749' } },
    { startFrame: 307, endFrame: 310, sequence: { $sequence: 'checkCondition_751' } },
    { startFrame: 346, endFrame: 349, sequence: { $sequence: 'finishBuffsById_749' } },
    { startFrame: 450, endFrame: 453, sequence: { $sequence: 'finishBuffsById_749' } },
    { startFrame: 457, endFrame: 460, sequence: { $sequence: 'checkCondition_751' } },
    { startFrame: 495, endFrame: 498, sequence: { $sequence: 'finishBuffsById_749' } },
    { startFrame: 600, endFrame: 603, sequence: { $sequence: 'finishBuffsById_749' } },
    { startFrame: 607, endFrame: 610, sequence: { $sequence: 'checkCondition_751' } },
    { startFrame: 645, endFrame: 648, sequence: { $sequence: 'finishBuffsById_749' } },
  ],
  timelineContinuationSkillId: 'chr_0034_typhoea_floating_attack5',
  skillType: 'basicAttack',
  levelSource: 'battleSkill',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_floating_attack4ActionGraph,
};

const typhoeusChr_0034_typhoea_floating_attack5ActionGraphCallback1 = {
  skillId: 'chr_0034_typhoea_floating_attack1_01_projhit',
  nativeSkillType: 'normalSkill',
  naturalDurationFrames: 1,
  castResource: {
    costFrame: 0,
    cooldownSeconds: 0,
    maxChargeTime: 1,
    cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
  },
  blackboard: {
    atb: 0,
    atk_scale_base: 0.5,
    atk_scale_enhence: 1,
    atk_scale_total: 0,
    buff_stack: 0,
    duration: 0,
    enchence_burst_damage_rate: 1.5,
    enhence_arrow: 0,
    hit_index: 0,
    naturalnflict_damageadd: 0.4,
    potential_damage_rate: 1,
    random_float: 0,
    total_damage_rate: 1,
    usp_recover: 5,
  },
  scheduledSequences: [
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_25' } },
  ],
  actionGraph: {
    main: {
      nodes: {
        applyBuff_9: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_2' }],
              targets: { kind: 'source' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: null,
        },
        changeResource_10: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'applyBuff_9',
        },
        finishBuffsByTag_11: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_10',
        },
        checkCondition_8: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
          },
          next: null,
        },
        ifElse_14: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_11' },
            whenFalse: { $sequence: null },
          },
          next: null,
        },
        applyBuff_7: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [
                {
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
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
                  buffId: 'buff_common_natural_natural_triggered_typhoea',
                  copiedBlackboardAssignments: { damage_enhence: 'total_damage_rate' },
                },
              ],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'applyBuff_9',
        },
        calculateActionValue_4: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_3' },
              right: { kind: 'valueNode', nodeId: 'data_4' },
            },
          },
          next: 'applyBuff_3',
        },
        changeResource_5: {
          action: {
            kind: 'changeResource',
            parameters: {
              resource: 'ultimateEnergy',
              amount: { kind: 'valueNode', nodeId: 'data_1' },
              coefficient: { kind: 'constant', value: 1 },
              source: { kind: 'source' },
              targets: { kind: 'source' },
            },
          },
          next: 'calculateActionValue_4',
        },
        finishBuffsByTag_6: {
          action: {
            kind: 'finishBuffsByTag',
            parameters: {
              targets: { kind: 'fixed', target: 'enemy' },
              finishSource: { kind: 'source' },
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
              reason: 'early',
              count: { kind: 'constant', value: 1 },
            },
          },
          next: 'changeResource_5',
        },
        ifElse_13: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_8' },
            whenTrue: { $sequence: 'finishBuffsByTag_6' },
            whenFalse: { $sequence: 'applyBuff_7' },
          },
          next: null,
        },
        checkCondition_12: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
          },
          next: null,
        },
        dealDamage_17: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_7' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        dealDamage_16: {
          action: {
            kind: 'dealDamage',
            parameters: {
              damageType: 'nature',
              attackScale: { kind: 'valueNode', nodeId: 'data_8' },
              tags: ['normalAttack'],
              gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
            },
          },
          next: null,
        },
        spawnAbilityEntity_18: {
          action: {
            kind: 'spawnAbilityEntity',
            parameters: {
              bornAt: { kind: 'fixed', target: 'enemy' },
              abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
              childSkillId: 'chr_0034_typhoea_attack_deadarrow',
              source: 'currentAbilityEntity',
              inheritActionBlackboard: false,
              dieWhenSourceDies: false,
              target: 'enemy',
              overrideDurationSeconds: { kind: 'constant', value: 3 },
            },
          },
          next: null,
        },
        applyBuff_19: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_floatingattack_damagetaken' }],
              targets: { kind: 'fixed', target: 'enemy' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'spawnAbilityEntity_18',
        },
        ifElse_20: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'dealDamage_16' },
            whenFalse: { $sequence: 'dealDamage_17' },
          },
          next: 'applyBuff_19',
        },
        ifElse_21: {
          action: {
            kind: 'ifElse',
            parameters: { alwaysNext: true },
            condition: { $sequence: 'checkCondition_12' },
            whenTrue: { $sequence: 'ifElse_13' },
            whenFalse: { $sequence: 'ifElse_14' },
          },
          next: 'ifElse_20',
        },
        calculateActionValue_22: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'total_damage_rate',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_9' },
              right: { kind: 'constant', value: 1 },
            },
          },
          next: 'ifElse_21',
        },
        calculateActionValue_23: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'atk_scale_total',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_7' },
              right: { kind: 'valueNode', nodeId: 'data_10' },
            },
          },
          next: 'calculateActionValue_22',
        },
        readBuffStackCount_24: {
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
          next: 'calculateActionValue_23',
        },
        checkCondition_25: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
          },
          next: 'readBuffStackCount_24',
        },
      },
      dataNodes: {
        data_1: { type: 'number', expression: { kind: 'blackboard', key: 'usp_recover' } },
        data_2: {
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
        data_3: { type: 'number', expression: { kind: 'blackboard', key: 'total_damage_rate' } },
        data_4: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enchence_burst_damage_rate' },
        },
        data_5: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'enhence_arrow', fallback: 0 },
        },
        data_6: {
          type: 'boolean',
          expression: {
            kind: 'actionValueCompare',
            left: { kind: 'valueNode', nodeId: 'data_5' },
            operator: 'equal',
            right: { kind: 'constant', value: 1 },
          },
        },
        data_7: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_base' } },
        data_8: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_total' } },
        data_9: {
          type: 'number',
          expression: { kind: 'blackboard', key: 'potential_damage_rate' },
        },
        data_10: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_enhence' } },
        data_11: {
          type: 'boolean',
          expression: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0034_typhoea_floatingattack_damagetaken'],
            operator: 'equal',
            value: { kind: 'constant', value: 0 },
          },
        },
      },
    },
    macros: {},
  },
} as const;

export const typhoeusChr_0034_typhoea_floating_attack5ActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0034_typhoea_floatingmode',
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      launchProjectile_105: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack5ActionGraphCallback1 },
          ],
        },
        next: null,
      },
      launchProjectile_106: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: false },
          },
          callbacks: [
            { event: 'hit', skill: typhoeusChr_0034_typhoea_floating_attack5ActionGraphCallback1 },
          ],
        },
        next: 'launchProjectile_105',
      },
      checkCondition_107: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      modifyActionValue_80: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'trigger_arrow_recover',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      checkCondition_77: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      checkCondition_78: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_77',
      },
      checkCondition_79: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'checkCondition_78',
      },
      ifElse_84: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_79' },
          whenTrue: { $sequence: 'modifyActionValue_80' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      launchProjectile_85: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.200000002980232,
            hit: { finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0034_typhoea_floating_attack5_01_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 6,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb: 0,
                  atk_scale_base: 0.5,
                  atk_scale_enhence: 1,
                  atk_scale_total: 0,
                  buff_stack: 0,
                  duration: 0,
                  enchence_burst_damage_rate: 1.5,
                  enhence_arrow: 0,
                  hit_index: 0,
                  naturalnflict_damageadd: 0.4,
                  poise: 0,
                  potential_damage_rate: 1,
                  random_float: 0,
                  total_damage_rate: 1,
                  usp_recover: 5,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_28' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_30' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      applyBuff_9: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_2',
                              },
                            ],
                            targets: { kind: 'source' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      changeResource_10: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'valueNode', nodeId: 'data_1' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                          },
                        },
                        next: 'applyBuff_9',
                      },
                      finishBuffsByTag_11: {
                        action: {
                          kind: 'finishBuffsByTag',
                          parameters: {
                            targets: { kind: 'fixed', target: 'enemy' },
                            finishSource: { kind: 'source' },
                            tagQueryType: 'hasAny',
                            buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                            reason: 'early',
                            count: { kind: 'constant', value: 1 },
                          },
                        },
                        next: 'changeResource_10',
                      },
                      checkCondition_8: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
                        },
                        next: null,
                      },
                      ifElse_14: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_8' },
                          whenTrue: { $sequence: 'finishBuffsByTag_11' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      applyBuff_7: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_common_natural_natural_triggered_typhoea',
                                copiedBlackboardAssignments: {
                                  damage_enhence: 'total_damage_rate',
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
                      applyBuff_3: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_common_natural_natural_triggered_typhoea',
                                copiedBlackboardAssignments: {
                                  damage_enhence: 'total_damage_rate',
                                },
                              },
                            ],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: 'applyBuff_9',
                      },
                      calculateActionValue_4: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'total_damage_rate',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_3' },
                            right: { kind: 'valueNode', nodeId: 'data_4' },
                          },
                        },
                        next: 'applyBuff_3',
                      },
                      changeResource_5: {
                        action: {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'valueNode', nodeId: 'data_1' },
                            coefficient: { kind: 'constant', value: 1 },
                            source: { kind: 'source' },
                            targets: { kind: 'source' },
                          },
                        },
                        next: 'calculateActionValue_4',
                      },
                      finishBuffsByTag_6: {
                        action: {
                          kind: 'finishBuffsByTag',
                          parameters: {
                            targets: { kind: 'fixed', target: 'enemy' },
                            finishSource: { kind: 'source' },
                            tagQueryType: 'hasAny',
                            buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                            reason: 'early',
                            count: { kind: 'constant', value: 1 },
                          },
                        },
                        next: 'changeResource_5',
                      },
                      ifElse_13: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_8' },
                          whenTrue: { $sequence: 'finishBuffsByTag_6' },
                          whenFalse: { $sequence: 'applyBuff_7' },
                        },
                        next: null,
                      },
                      checkCondition_12: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                        },
                        next: null,
                      },
                      applyBuff_16: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [
                              {
                                buffId: 'buff_chr_0034_typhoea_normal_attack5_atb_recovered',
                                copiedBlackboardAssignments: { atb: 'atb' },
                              },
                            ],
                            targets: { kind: 'source' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      checkCondition_15: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
                        },
                        next: null,
                      },
                      dealDamage_19: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'nature',
                            attackScale: { kind: 'valueNode', nodeId: 'data_8' },
                            tags: ['normalAttack', 'normalAttackLastCombo'],
                            gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Weak'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'valueNode', nodeId: 'data_9' },
                            staggerOnlyWhenCasterControlled: true,
                          },
                        },
                        next: null,
                      },
                      dealDamage_18: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'nature',
                            attackScale: { kind: 'valueNode', nodeId: 'data_10' },
                            tags: ['normalAttack', 'normalAttackLastCombo'],
                            gameplayTags: ['Damage/TyphoeaSkill/FloatingHit_Heavy'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'valueNode', nodeId: 'data_9' },
                            staggerOnlyWhenCasterControlled: true,
                          },
                        },
                        next: null,
                      },
                      spawnAbilityEntity_20: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'fixed', target: 'enemy' },
                            abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
                            childSkillId: 'chr_0034_typhoea_attack_deadarrow',
                            source: 'currentAbilityEntity',
                            inheritActionBlackboard: false,
                            dieWhenSourceDies: false,
                            target: 'enemy',
                            overrideDurationSeconds: { kind: 'constant', value: 3 },
                          },
                        },
                        next: null,
                      },
                      applyBuff_21: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_chr_0034_typhoea_floatingattack_damagetaken' }],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: 'spawnAbilityEntity_20',
                      },
                      ifElse_22: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_12' },
                          whenTrue: { $sequence: 'dealDamage_18' },
                          whenFalse: { $sequence: 'dealDamage_19' },
                        },
                        next: 'applyBuff_21',
                      },
                      ifElse_23: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_15' },
                          whenTrue: { $sequence: 'applyBuff_16' },
                          whenFalse: { $sequence: null },
                        },
                        next: 'ifElse_22',
                      },
                      ifElse_24: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_12' },
                          whenTrue: { $sequence: 'ifElse_13' },
                          whenFalse: { $sequence: 'ifElse_14' },
                        },
                        next: 'ifElse_23',
                      },
                      calculateActionValue_25: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'total_damage_rate',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_11' },
                            right: { kind: 'constant', value: 1 },
                          },
                        },
                        next: 'ifElse_24',
                      },
                      calculateActionValue_26: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale_total',
                            operation: 'multiply',
                            left: { kind: 'valueNode', nodeId: 'data_8' },
                            right: { kind: 'valueNode', nodeId: 'data_12' },
                          },
                        },
                        next: 'calculateActionValue_25',
                      },
                      readBuffStackCount_27: {
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
                        next: 'calculateActionValue_26',
                      },
                      checkCondition_28: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_13' } },
                        },
                        next: 'readBuffStackCount_27',
                      },
                      applyBuff_29: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_hitstop' }],
                            targets: { kind: 'source' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: null,
                      },
                      checkCondition_30: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_14' } },
                        },
                        next: 'applyBuff_29',
                      },
                    },
                    dataNodes: {
                      data_1: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'usp_recover' },
                      },
                      data_2: {
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
                      data_3: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'total_damage_rate' },
                      },
                      data_4: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'enchence_burst_damage_rate' },
                      },
                      data_5: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'enhence_arrow', fallback: 0 },
                      },
                      data_6: {
                        type: 'boolean',
                        expression: {
                          kind: 'actionValueCompare',
                          left: { kind: 'valueNode', nodeId: 'data_5' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 1 },
                        },
                      },
                      data_7: { type: 'boolean', expression: { kind: 'casterControlled' } },
                      data_8: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_base' },
                      },
                      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
                      data_10: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_total' },
                      },
                      data_11: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'potential_damage_rate' },
                      },
                      data_12: {
                        type: 'number',
                        expression: { kind: 'blackboard', key: 'atk_scale_enhence' },
                      },
                      data_13: {
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0034_typhoea_floatingattack_damagetaken'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 0 },
                        },
                      },
                      data_14: { type: 'boolean', expression: { kind: 'casterControlled' } },
                    },
                  },
                  macros: {},
                },
              },
            },
          ],
        },
        next: 'ifElse_84',
      },
      checkCondition_95: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      checkCondition_110: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      checkCondition_116: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: null,
      },
      modifyActionValue_125: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 5 },
          },
        },
        next: null,
      },
      modifyActionValue_126: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      finishBuffsById_127: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_floatingmode'],
            reason: 'other',
          },
        },
        next: 'modifyActionValue_126',
      },
      checkCondition_128: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: null,
      },
      ifElse_129: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_128' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      checkCondition_130: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_11' } },
        },
        next: 'ifElse_129',
      },
      applyBuff_131: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_combo_skill_canusefloatingskill' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      modifyActionValue_132: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_can_use_floating_skill',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      modifyActionValue_133: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_heavyattack_atb_recover',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      applyBuff_134: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_arrowshow' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_135: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_12' } },
        },
        next: 'applyBuff_134',
      },
      finishBuffsById_136: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
            reason: 'other',
          },
        },
        next: null,
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_85' },
          whenFalse: { $sequence: 'launchProjectile_85' },
        },
        next: null,
      },
      forEachContextTarget_opt2: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'tar1' } },
          body: { $sequence: 'ifElse_opt1' },
        },
        next: null,
      },
      forEachContextTarget_opt3: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt1' },
        },
        next: null,
      },
      ifElse_opt4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_106' },
          whenFalse: { $sequence: 'launchProjectile_106' },
        },
        next: null,
      },
      ifElse_opt5: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_107' },
          whenTrue: { $sequence: 'forEachContextTarget_opt3' },
          whenFalse: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
      ifElse_opt6: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_95' },
          whenTrue: { $sequence: 'forEachContextTarget_opt2' },
          whenFalse: { $sequence: 'ifElse_opt5' },
        },
        next: null,
      },
      findTargets_opt7: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: {
              kind: 'enemyByTags',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/chr_0034_typhoea/Locked'],
            },
            saveToContextKey: 'tar1',
          },
        },
        next: 'ifElse_opt6',
      },
      modifyActionValue_opt8: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'enhence_arrow',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: 'findTargets_opt7',
      },
      ifElse_opt9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_105' },
          whenFalse: { $sequence: 'launchProjectile_105' },
        },
        next: null,
      },
      forEachContextTarget_opt10: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'ifElse_opt9' },
        },
        next: null,
      },
      ifElse_opt11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_107' },
          whenTrue: { $sequence: 'forEachContextTarget_opt10' },
          whenFalse: { $sequence: 'ifElse_opt4' },
        },
        next: null,
      },
      modifyActionValue_opt12: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'enhence_arrow',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'ifElse_opt11',
      },
      ifElse_opt13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_110' },
          whenTrue: { $sequence: 'modifyActionValue_opt8' },
          whenFalse: { $sequence: 'modifyActionValue_opt12' },
        },
        next: null,
      },
      ifElse_opt14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_116' },
          whenTrue: { $sequence: 'ifElse_opt13' },
          whenFalse: { $sequence: 'ifElse_opt13' },
        },
        next: null,
      },
      modifyActionValue_opt15: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'ifElse_opt14',
      },
      calculateActionValue_opt16: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'poise_end',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_13' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'modifyActionValue_opt15',
      },
      calculateActionValue_opt17: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'atb_end',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_15' },
            right: { kind: 'valueNode', nodeId: 'data_14' },
          },
        },
        next: 'calculateActionValue_opt16',
      },
      calculateActionValue_opt18: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_times',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_14' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'calculateActionValue_opt17',
      },
      modifyActionValue_opt19: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_heavyattack_atb_recover',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'calculateActionValue_opt18',
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
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'buffStackCompare',
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 4 },
        },
      },
      data_3: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'enhence_arrow', fallback: 0 },
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
        type: 'number',
        expression: { kind: 'blackboard', key: 'trigger_arrow_recover', fallback: 0 },
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
          target: { kind: 'context', key: 'tar1' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_8: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_10: { type: 'boolean', expression: { kind: 'enemyRankIn', ranks: ['boss'] } },
      data_11: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_12: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_13: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
      data_14: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_floating_attack_times' },
      },
      data_15: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_floating_attack5: SkillDefinition = {
  key: 'chr_0034_typhoea_floating_attack5',
  element: 'nature',
  blackboard: {
    atb: 23,
    atb_end: 0,
    atk_scale_base: [0.44, 0.49, 0.53, 0.58, 0.62, 0.66, 0.71, 0.75, 0.8, 0.85, 0.92, 1],
    atk_scale_enhence: 1.6,
    enchence_burst_damage_rate: [1.1, 1.1, 1.1, 1.15, 1.15, 1.15, 1.2, 1.2, 1.2, 1.25, 1.25, 1.3],
    enhence_arrow: 0,
    poise: 20,
    poise_end: 0,
    potential_damage_rate: 1,
    trigger_arrow_recover: 0,
    usp_recover: 12,
  },
  timelineBlockFrames: 36,
  naturalDurationFrames: 250,
  exclusiveFrame: 35,
  offsetRecordFrame: 7,
  costFrame: 13,
  scheduledSequences: [
    { startFrame: 0, endFrame: 250, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'modifyActionValue_opt19' } },
    { startFrame: 0, endFrame: 6, sequence: { $sequence: 'modifyActionValue_125' } },
    { startFrame: 15, endFrame: 18, sequence: { $sequence: 'finishBuffsById_127' } },
    { startFrame: 0, endFrame: 17, sequence: { $sequence: 'checkCondition_130' } },
    { startFrame: 0, endFrame: 23, sequence: { $sequence: 'applyBuff_131' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'modifyActionValue_132' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'modifyActionValue_133' } },
    { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_135' } },
    { startFrame: 1, endFrame: 2, sequence: { $sequence: 'finishBuffsById_136' } },
  ],
  skillType: 'basicAttack',
  levelSource: 'battleSkill',
  nativeSkillType: 'attack',
  actionGraph: typhoeusChr_0034_typhoea_floating_attack5ActionGraph,
};

export const typhoeusChr_0034_typhoea_power_attackActionGraph = {
  main: {
    nodes: {
      gainFinisherSp_1: {
        action: { kind: 'gainFinisherSp', parameters: { factor: 1, recipient: 'team' } },
        next: null,
      },
      launchProjectile_2: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.16666667163372,
          },
          callbacks: [
            {
              event: 'reach',
              skill: {
                skillId: 'chr_0034_typhoea_power_attack_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 5,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { atb: 0, atk_scale: 0, duration: 0 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'forEachContextTarget_5' } },
                  {
                    startFrame: 1,
                    endFrame: 4,
                    sequence: { $sequence: 'forEachContextTarget_10' },
                  },
                  { startFrame: 1, endFrame: 3, sequence: { $sequence: null } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_2: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'nature',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            calculation: 'breakingAttack',
                            calculationMultiplier: 1,
                            tags: ['normalAttack', 'powerAttack'],
                          },
                        },
                        next: null,
                      },
                      mergeContextTargets_3: {
                        action: {
                          kind: 'mergeContextTargets',
                          parameters: {
                            saveToContextKey: 'maintar',
                            sources: [{ kind: 'target', target: 'enemy' }],
                          },
                        },
                        next: 'dealDamage_2',
                      },
                      checkCondition_1: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
                        },
                        next: null,
                      },
                      ifElse_4: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'mergeContextTargets_3' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      forEachContextTarget_5: {
                        action: {
                          kind: 'forEachContextTarget',
                          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                          body: { $sequence: 'ifElse_4' },
                        },
                        next: null,
                      },
                      finishBuffsById_7: {
                        action: {
                          kind: 'finishBuffsById',
                          parameters: {
                            targets: { kind: 'fixed', target: 'enemy' },
                            finishSource: { kind: 'source' },
                            buffIds: ['buff_chr_0034_typhoea_power_attack_maintarget'],
                            reason: 'other',
                          },
                        },
                        next: null,
                      },
                      startTimeDilation_8: {
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
                                  time: -0.004907977,
                                  value: 0.4,
                                  inTangent: -1.27497,
                                  outTangent: -1.27497,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 0.25,
                                  value: 0.075,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 0.6871345,
                                  value: 0.075,
                                  inTangent: 0,
                                  outTangent: 0,
                                  weightedMode: 0,
                                  inWeight: 0,
                                  outWeight: 0,
                                },
                                {
                                  time: 1,
                                  value: 0.4,
                                  inTangent: 0.5041389,
                                  outTangent: 0.5041389,
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
                        next: 'finishBuffsById_7',
                      },
                      ifElse_9: {
                        action: {
                          kind: 'ifElse',
                          parameters: { alwaysNext: true },
                          condition: { $sequence: 'checkCondition_1' },
                          whenTrue: { $sequence: 'startTimeDilation_8' },
                          whenFalse: { $sequence: null },
                        },
                        next: null,
                      },
                      forEachContextTarget_10: {
                        action: {
                          kind: 'forEachContextTarget',
                          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                          body: { $sequence: 'ifElse_9' },
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
                        type: 'boolean',
                        expression: {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0034_typhoea_power_attack_maintarget'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
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
        next: 'gainFinisherSp_1',
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_power_attack_maintarget' }],
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'launchProjectile_2',
      },
      findTargets_4: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'mainTar',
          },
        },
        next: null,
      },
      applyBuff_5: {
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
      applyBuff_6: {
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
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_power_attack: SkillDefinition = {
  key: 'chr_0034_typhoea_power_attack',
  element: 'nature',
  blackboard: { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
  timelineBlockFrames: 73,
  naturalDurationFrames: 180,
  exclusiveFrame: 72,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 40,
        endFrame: 99,
        skillIds: ['chr_0034_typhoea_normal_skill_floating_start', 'chr_0034_typhoea_combo_skill'],
      },
    ],
  },
  costFrame: 4,
  scheduledSequences: [
    { startFrame: 38, endFrame: 41, sequence: { $sequence: 'applyBuff_3' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findTargets_4' } },
    { startFrame: 0, endFrame: 72, sequence: { $sequence: 'applyBuff_5' } },
    { startFrame: 0, endFrame: 40, sequence: { $sequence: 'applyBuff_6' } },
  ],
  skillType: 'finisher',
  levelSource: 'basicAttack',
  nativeSkillType: 'breakingAttack',
  actionGraph: typhoeusChr_0034_typhoea_power_attackActionGraph,
};

export const typhoeusChr_0034_typhoea_plunging_attack_endActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_attack_plunging_onground'],
            reason: 'other',
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
            tags: ['normalAttack', 'plungingAttack'],
          },
        },
        next: null,
      },
      finishOwner_3: {
        action: { kind: 'finishOwner', parameters: { targets: { kind: 'context', key: 'rune' } } },
        next: 'dealDamage_2',
      },
      findOwnerSpawnedAbilityEntities_4: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'rune',
            abilityEntityIds: [
              'abilityentity_chr_0034_typhoea_arrow_onground',
              'abilityentity_chr_0034_typhoea_combo_arrowfloating_1',
              'abilityentity_chr_0034_typhoea_rune_1_onground',
            ],
          },
        },
        next: 'finishOwner_3',
      },
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_plunging_attack_end: SkillDefinition = {
  actionGraph: typhoeusChr_0034_typhoea_plunging_attack_endActionGraph,
  key: 'chr_0034_typhoea_plunging_attack_end',
  element: 'nature',
  blackboard: { atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8] },
  timelineBlockFrames: 18,
  naturalDurationFrames: 120,
  exclusiveFrame: 17,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 1, sequence: { $sequence: 'finishBuffsById_1' } },
    { startFrame: 0, endFrame: 4, sequence: { $sequence: 'findOwnerSpawnedAbilityEntities_4' } },
  ],
  skillType: 'plungingAttack',
  levelSource: 'basicAttack',
  nativeSkillType: 'attack',
};

const typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraphCallback1 = {
  skillId: 'chr_0034_typhoea_normal_skill_attack1_projhit',
  nativeSkillType: 'normalSkill',
  naturalDurationFrames: 1,
  castResource: {
    costFrame: 0,
    cooldownSeconds: 0,
    maxChargeTime: 1,
    cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
  },
  blackboard: {
    atb: 0,
    atk_scale: 0.2,
    atk_scale_total: 0,
    buff_stack: 0,
    duration: 0,
    hit_index: 0,
    spellinflict_damage_add: 0.3,
  },
  scheduledSequences: [{ startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_5' } }],
  actionGraph: {
    main: {
      nodes: {
        spawnAbilityEntity_1: {
          action: {
            kind: 'spawnAbilityEntity',
            parameters: {
              bornAt: { kind: 'fixed', target: 'enemy' },
              abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
              childSkillId: 'chr_0034_typhoea_attack_deadarrow',
              source: 'currentAbilityEntity',
              inheritActionBlackboard: false,
              dieWhenSourceDies: false,
              target: 'enemy',
              overrideDurationSeconds: { kind: 'constant', value: 3 },
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
              tags: ['normalSkill'],
            },
          },
          next: 'spawnAbilityEntity_1',
        },
        applyBuff_3: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_start_hittimes' }],
              targets: { kind: 'source' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'dealDamage_2',
        },
        calculateActionValue_4: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'atk_scale',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_1' },
              right: { kind: 'constant', value: 0.5 },
            },
          },
          next: 'applyBuff_3',
        },
        checkCondition_5: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
          },
          next: 'calculateActionValue_4',
        },
      },
      dataNodes: {
        data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
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
      },
    },
    macros: {},
  },
} as const;

const typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraphCallback2 = {
  skillId: 'chr_0034_typhoea_normal_skill_attack2_projhit',
  nativeSkillType: 'normalSkill',
  naturalDurationFrames: 1,
  castResource: {
    costFrame: 0,
    cooldownSeconds: 0,
    maxChargeTime: 1,
    cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
  },
  blackboard: { atb: 0, atk_scale: 0, duration: 0, hit_index: 0 },
  scheduledSequences: [{ startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_5' } }],
  actionGraph: {
    main: {
      nodes: {
        spawnAbilityEntity_1: {
          action: {
            kind: 'spawnAbilityEntity',
            parameters: {
              bornAt: { kind: 'fixed', target: 'enemy' },
              abilityEntityId: 'abilityentity_chr_0034_typhoea_arrow',
              childSkillId: 'chr_0034_typhoea_attack_deadarrow',
              source: 'currentAbilityEntity',
              inheritActionBlackboard: false,
              dieWhenSourceDies: false,
              target: 'enemy',
              overrideDurationSeconds: { kind: 'constant', value: 3 },
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
              tags: ['normalSkill'],
            },
          },
          next: 'spawnAbilityEntity_1',
        },
        applyBuff_3: {
          action: {
            kind: 'applyBuff',
            parameters: {
              buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_start_hittimes' }],
              targets: { kind: 'source' },
              source: { kind: 'source' },
              inheritSourceSkillCastInfo: true,
            },
          },
          next: 'dealDamage_2',
        },
        calculateActionValue_4: {
          action: {
            kind: 'calculateActionValue',
            parameters: {
              key: 'atk_scale',
              operation: 'multiply',
              left: { kind: 'valueNode', nodeId: 'data_1' },
              right: { kind: 'constant', value: 0.5 },
            },
          },
          next: 'applyBuff_3',
        },
        checkCondition_5: {
          action: {
            kind: 'checkCondition',
            parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
          },
          next: 'calculateActionValue_4',
        },
      },
      dataNodes: {
        data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale' } },
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
      },
    },
    macros: {},
  },
} as const;

export const typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraph = {
  main: {
    nodes: {
      changeResource_1: {
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
      checkCondition_2: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'changeResource_1',
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0034_typhoea_floatingmode',
                copiedBlackboardAssignments: {
                  potential_atkup: 'potential_atkup',
                  atk_up: 'atk_up',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
            ],
          },
        },
        next: null,
      },
      finishBuffsById_4: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_normal_start_hittimes'],
            reason: 'other',
          },
        },
        next: null,
      },
      modifyActionValue_5: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'finishBuffsById_4',
      },
      modifyActionValue_6: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'modifyActionValue_5',
      },
      createSpatialPointTargets_9: {
        action: {
          kind: 'createSpatialPointTargets',
          parameters: { saveToContextKey: 'tar2', count: { kind: 'constant', value: 1 } },
        },
        next: null,
      },
      mergeContextTargets_8: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'tar2', sources: [{ kind: 'target', target: 'enemy' }] },
        },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      ifElse_11: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'mergeContextTargets_8' },
          whenFalse: { $sequence: 'createSpatialPointTargets_9' },
        },
        next: null,
      },
      checkCondition_10: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_11' },
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
            hit: { finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraphCallback1,
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
            hit: { finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraphCallback1,
            },
          ],
        },
        next: 'launchProjectile_21',
      },
      launchProjectile_18: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            onlyHitTargets: { kind: 'inputTarget' },
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraphCallback1,
            },
          ],
        },
        next: null,
      },
      forEachContextTarget_20: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'tar2' } },
          body: { $sequence: 'launchProjectile_18' },
        },
        next: null,
      },
      checkCondition_19: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      ifElse_25: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_19' },
          whenTrue: { $sequence: 'forEachContextTarget_20' },
          whenFalse: { $sequence: 'launchProjectile_22' },
        },
        next: null,
      },
      forEachContextTarget_15: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'launchProjectile_21' },
        },
        next: null,
      },
      ifElse_24: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'forEachContextTarget_15' },
          whenFalse: { $sequence: 'launchProjectile_22' },
        },
        next: null,
      },
      ifElse_26: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'ifElse_24' },
          whenFalse: { $sequence: 'ifElse_25' },
        },
        next: null,
      },
      launchProjectile_35: {
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
              skill: typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraphCallback2,
            },
          ],
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
              skill: typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraphCallback2,
            },
          ],
        },
        next: 'launchProjectile_35',
      },
      launchProjectile_32: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            onlyHitTargets: { kind: 'inputTarget' },
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { finishOnHit: true },
          },
          callbacks: [
            {
              event: 'hit',
              skill: typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraphCallback2,
            },
          ],
        },
        next: null,
      },
      forEachContextTarget_34: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'context', key: 'tar2' } },
          body: { $sequence: 'launchProjectile_32' },
        },
        next: null,
      },
      ifElse_39: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_19' },
          whenTrue: { $sequence: 'forEachContextTarget_34' },
          whenFalse: { $sequence: 'launchProjectile_36' },
        },
        next: null,
      },
      forEachContextTarget_29: {
        action: {
          kind: 'forEachContextTarget',
          parameters: { targets: { kind: 'fixed', target: 'enemy' } },
          body: { $sequence: 'launchProjectile_35' },
        },
        next: null,
      },
      ifElse_38: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'forEachContextTarget_29' },
          whenFalse: { $sequence: 'launchProjectile_36' },
        },
        next: null,
      },
      ifElse_40: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: 'ifElse_38' },
          whenFalse: { $sequence: 'ifElse_39' },
        },
        next: null,
      },
      gainSquadUltimateEnergyFromSkillCost_43: {
        action: { kind: 'gainSquadUltimateEnergyFromSkillCost', parameters: { coefficient: 1 } },
        next: 'finishBuffsById_4',
      },
      checkCondition_41: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      ifElse_45: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_41' },
          whenTrue: { $sequence: 'gainSquadUltimateEnergyFromSkillCost_43' },
          whenFalse: { $sequence: 'finishBuffsById_4' },
        },
        next: null,
      },
      castSkillDuringAction_48: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack1',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_53: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_normal_skill_floating_loop',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      modifyActionValue_54: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_can_use_floating_skill',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      applyBuff_55: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_arrowshow' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'castSkillDuringAction_48' },
          whenFalse: { $sequence: 'castSkillDuringAction_48' },
        },
        next: null,
      },
      findTargets_opt2: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'mainTar',
          },
        },
        next: 'ifElse_opt1',
      },
      ifElse_opt3: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_10' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'findTargets_opt2' },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atb_return' } },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'atb_return', fallback: 0 },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_2' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
      },
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
      data_5: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'context', key: 'tar2' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_start_hittimes'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_normal_skill_floating_start: SkillDefinition = {
  key: 'chr_0034_typhoea_normal_skill_floating_start',
  element: 'nature',
  blackboard: {
    atb_return: 0,
    atk_scale: [0.22, 0.25, 0.27, 0.29, 0.31, 0.33, 0.36, 0.38, 0.4, 0.43, 0.46, 0.5],
    atk_up: 0.08,
    potential_atkup: 0,
  },
  timelineBlockFrames: 26,
  naturalDurationFrames: 40,
  exclusiveFrame: 99,
  offsetRecordFrame: 0,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 21,
        endFrame: 40,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_floating_attack1',
      },
    ],
    allowedNextSkills: [
      {
        startFrame: 26,
        endFrame: 40,
        skillIds: [
          'chr_0034_typhoea_floating_attack1',
          'chr_0034_typhoea_normal_skill_floating_end',
        ],
      },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_2' } },
    { startFrame: 0, endFrame: 40, sequence: { $sequence: 'applyBuff_3' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'modifyActionValue_6' } },
    { startFrame: 1, endFrame: 10, sequence: { $sequence: 'ifElse_12' } },
    { startFrame: 2, endFrame: 5, sequence: { $sequence: 'ifElse_26' } },
    { startFrame: 7, endFrame: 10, sequence: { $sequence: 'ifElse_40' } },
    { startFrame: 12, endFrame: 18, sequence: { $sequence: 'ifElse_45' } },
    { startFrame: 32, endFrame: 35, sequence: { $sequence: 'ifElse_opt3' } },
    { startFrame: 37, endFrame: 40, sequence: { $sequence: 'castSkillDuringAction_53' } },
    { startFrame: 21, endFrame: 24, sequence: { $sequence: 'modifyActionValue_54' } },
    { startFrame: 13, endFrame: 16, sequence: { $sequence: 'applyBuff_55' } },
  ],
  costs: [{ resource: 'sp', value: 100 }],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'normalSkill',
  actionGraph: typhoeusChr_0034_typhoea_normal_skill_floating_startActionGraph,
};

export const typhoeusChr_0034_typhoea_normal_skill_floating_loopActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0034_typhoea_floatingmode',
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
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
            skillId: 'chr_0034_typhoea_normal_skill_floating_end',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: true,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      switch_6: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_1' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      switch_8: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_2' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: 'switch_6' } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'switch_6' } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: 'switch_6' } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: 'switch_6' } },
            {
              value: { kind: 'constant', value: 5 },
              sequence: { $sequence: 'castSkillDuringAction_2' },
            },
          ],
        },
        next: null,
      },
      readBuffStackCount_9: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'] },
          },
        },
        next: 'switch_8',
      },
      switch_12: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_1' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      switch_13: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_2' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: 'switch_6' } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: 'switch_6' } },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 5 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: 'switch_12' } },
          ],
        },
        next: null,
      },
      readBuffStackCount_14: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'] },
          },
        },
        next: 'switch_13',
      },
      applyBuff_15: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_combo_skill_canusefloatingskill' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      applyBuff_16: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_arrowshow' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: 'applyBuff_16',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'arrow_num' } },
      data_2: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_floating_attack_index' },
      },
      data_3: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_normal_skill_floating_loop: SkillDefinition = {
  key: 'chr_0034_typhoea_normal_skill_floating_loop',
  element: 'nature',
  blackboard: { arrow_num: 0 },
  timelineBlockFrames: 31,
  naturalDurationFrames: 30,
  exclusiveFrame: 30,
  offsetRecordFrame: 0,
  inputWindows: { hasConditionalActions: true },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 30, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 27, endFrame: 30, sequence: { $sequence: 'castSkillDuringAction_2' } },
    { startFrame: 0, endFrame: 30, sequence: { $sequence: 'readBuffStackCount_9' } },
    { startFrame: 0, endFrame: 30, sequence: { $sequence: 'readBuffStackCount_14' } },
    { startFrame: 0, endFrame: 30, sequence: { $sequence: 'applyBuff_15' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_17' } },
  ],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'extraActiveSkill',
  actionGraph: typhoeusChr_0034_typhoea_normal_skill_floating_loopActionGraph,
};

export const typhoeusChr_0034_typhoea_normal_skill_floating_endActionGraph = {
  main: {
    nodes: {
      inheritBuffById_1: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0034_typhoea_floatingmode',
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      modifyActionValue_2: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
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
            buffIds: ['buff_chr_0034_typhoea_floatingmode'],
            reason: 'other',
          },
        },
        next: null,
      },
      modifyActionValue_4: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_can_use_floating_skill',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      finishBuffsById_5: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
            reason: 'other',
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_normal_skill_floating_end: SkillDefinition = {
  actionGraph: typhoeusChr_0034_typhoea_normal_skill_floating_endActionGraph,
  key: 'chr_0034_typhoea_normal_skill_floating_end',
  element: 'nature',
  blackboard: {},
  timelineBlockFrames: 26,
  naturalDurationFrames: 100,
  exclusiveFrame: 25,
  offsetRecordFrame: 0,
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 8, sequence: { $sequence: 'inheritBuffById_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'modifyActionValue_2' } },
    { startFrame: 8, endFrame: 14, sequence: { $sequence: 'finishBuffsById_3' } },
    { startFrame: 6, endFrame: 9, sequence: { $sequence: 'modifyActionValue_4' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_5' } },
  ],
  skillType: 'battleSkill',
  levelSource: 'battleSkill',
  nativeSkillType: 'extraActiveSkill',
};

export const typhoeusChr_0034_typhoea_combo_skillActionGraph = {
  main: {
    nodes: {
      findTargets_2: {
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
          whenTrue: { $sequence: 'findTargets_2' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      findTargets_4: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'maintar',
          },
        },
        next: 'ifElse_3',
      },
      adjustSkillCooldown_5: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0034_typhoea_combo_skillfloating' },
            operation: 'set',
            basis: 'baseDurationRatio',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      startTimeDilation_6: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.833 },
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
      launchProjectile_9: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { onReach: true, finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0034_typhoea_combo_02_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb: 0,
                  atk_scale: 0,
                  atk_scale_persistent: 0,
                  hit_index: 0,
                  naturalinflect_stack: 0,
                  persistent_naturalburst_increase: 0,
                  persistent_slow: 0,
                  persistent_time: 0,
                  recover_bufftime: 12,
                  usp: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'calculateActionValue_2' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'nature',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['comboSkill'],
                          },
                        },
                        next: null,
                      },
                      calculateActionValue_2: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale',
                            operation: 'divide',
                            left: { kind: 'valueNode', nodeId: 'data_1' },
                            right: { kind: 'constant', value: 7 },
                          },
                        },
                        next: 'dealDamage_1',
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
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_9' },
          whenFalse: { $sequence: 'launchProjectile_9' },
        },
        next: null,
      },
      launchProjectile_35: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.433333337306976,
            hit: { onReach: true, finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0034_typhoea_combo_01_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 13,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb: 0,
                  atk_scale: 0,
                  atk_scale_persistent: 0,
                  hit_index: 0,
                  naturalinflect_stack: 0,
                  persistent_naturalburst_increase: 0,
                  persistent_slow: 0,
                  persistent_time: 0,
                  poise: 10,
                  recover_bufftime: 12,
                  usp: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_4' } },
                  { startFrame: 0, endFrame: 2, sequence: { $sequence: 'spawnAbilityEntity_5' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
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
                        next: null,
                      },
                      calculateActionValue_2: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale',
                            operation: 'divide',
                            left: { kind: 'valueNode', nodeId: 'data_1' },
                            right: { kind: 'constant', value: 7 },
                          },
                        },
                        next: 'dealDamage_1',
                      },
                      applyBuff_3: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_chr_0034_typhoea_combo_skill_arrow_hittimes' }],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: 'calculateActionValue_2',
                      },
                      checkCondition_4: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
                        },
                        next: 'applyBuff_3',
                      },
                      spawnAbilityEntity_5: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'fixed', target: 'enemy' },
                            abilityEntityId: 'abilityentity_chr_0034_typhoea_combo_presistdamage',
                            childSkillId: 'chr_0034_typhoea_combo_persistentdamage',
                            inheritActionBlackboard: true,
                            dieWhenSourceDies: false,
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
                      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
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
      changeResource_40: {
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
      checkCondition_41: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: 'changeResource_40',
      },
      applyBuff_42: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_func_arrowreload' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      markCurrentSkillCanInterrupt_43: {
        action: { kind: 'markCurrentSkillCanInterrupt', parameters: {} },
        next: null,
      },
      ifElse_opt2: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_35' },
          whenFalse: { $sequence: 'launchProjectile_35' },
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
          distance: 15,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_combo_skill: SkillDefinition = {
  key: 'chr_0034_typhoea_combo_skill',
  element: 'nature',
  blackboard: {
    atb: 0,
    atk_scale: [0.89, 0.98, 1.07, 1.16, 1.25, 1.34, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
    atk_scale_persistent: [0.45, 0.49, 0.54, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.93, 1],
    bullet_energy: 0,
    count: 3,
    duration: 5,
    energy_to_bullet_ratio: 2,
    owner_mainchar_distance: 0,
    persistent_naturalburst_increase: [
      0.06, 0.06, 0.06, 0.07, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1,
    ],
    persistent_slow: 0.6,
    poise: 10,
    usp: 10,
  },
  timelineBlockFrames: 60,
  naturalDurationFrames: 241,
  exclusiveFrame: 60,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      { startFrame: 48, endFrame: 99, skillIds: ['chr_0034_typhoea_normal_skill_floating_start'] },
    ],
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'findTargets_4' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'adjustSkillCooldown_5' } },
    { startFrame: 0, endFrame: 22, sequence: { $sequence: 'startTimeDilation_6' } },
    { startFrame: 40, endFrame: 43, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 43, endFrame: 46, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 44, endFrame: 47, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 45, endFrame: 48, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 47, endFrame: 50, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 49, endFrame: 52, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 35, endFrame: 54, sequence: { $sequence: 'ifElse_opt2' } },
    { startFrame: 35, endFrame: 50, sequence: { $sequence: 'checkCondition_41' } },
    { startFrame: 35, endFrame: 38, sequence: { $sequence: 'applyBuff_42' } },
    { startFrame: 60, endFrame: 241, sequence: { $sequence: 'markCurrentSkillCanInterrupt_43' } },
  ],
  cooldownFrames: [630, 630, 630, 630, 630, 630, 630, 630, 630, 600, 600, 570],
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'comboSkill',
  actionGraph: typhoeusChr_0034_typhoea_combo_skillActionGraph,
};

export const typhoeusChr_0034_typhoea_combo_skillfloatingActionGraph = {
  main: {
    nodes: {
      interruptCurrentSkill_1: {
        action: { kind: 'interruptCurrentSkill', parameters: { targets: { kind: 'owner' } } },
        next: null,
      },
      createSpatialPointTargets_8: {
        action: {
          kind: 'createSpatialPointTargets',
          parameters: { saveToContextKey: 'tar', count: { kind: 'constant', value: 1 } },
        },
        next: null,
      },
      findTargets_7: {
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
          whenTrue: { $sequence: 'findTargets_7' },
          whenFalse: { $sequence: 'createSpatialPointTargets_8' },
        },
        next: null,
      },
      findTargets_13: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: { kind: 'mainTarget', owner: { kind: 'owner' } },
            saveToContextKey: 'maintar',
          },
        },
        next: 'ifElse_12',
      },
      pickContextTarget_3: {
        action: {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'tar1',
            saveToContextKey: 'tar',
            index: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      mergeContextTargets_4: {
        action: {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: 'tar1', sources: [{ kind: 'target', target: 'enemy' }] },
        },
        next: 'pickContextTarget_3',
      },
      checkCondition_2: {
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
          condition: { $sequence: 'checkCondition_2' },
          whenTrue: { $sequence: 'mergeContextTargets_4' },
          whenFalse: { $sequence: 'createSpatialPointTargets_8' },
        },
        next: null,
      },
      findTargets_11: {
        action: {
          kind: 'findTargets',
          parameters: {
            owner: { kind: 'owner' },
            query: {
              kind: 'enemyByTags',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/chr_0034_typhoea/Locked'],
            },
            saveToContextKey: 'tar1',
          },
        },
        next: 'ifElse_10',
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
        },
        next: null,
      },
      ifElse_14: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: 'findTargets_11' },
          whenFalse: { $sequence: 'findTargets_13' },
        },
        next: null,
      },
      inheritBuffById_15: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0034_typhoea_floatingmode',
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          },
        },
        next: null,
      },
      adjustSkillCooldown_16: {
        action: {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0034_typhoea_combo_skill' },
            operation: 'set',
            basis: 'baseDurationRatio',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      castSkillDuringAction_22: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_normal_skill_floating_end',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_21: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_normal_skill_floating_loop',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      switch_23: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_4' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 0 },
              sequence: { $sequence: 'castSkillDuringAction_21' },
            },
            {
              value: { kind: 'constant', value: 1 },
              sequence: { $sequence: 'castSkillDuringAction_21' },
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'castSkillDuringAction_21' },
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'castSkillDuringAction_21' },
            },
            {
              value: { kind: 'constant', value: 4 },
              sequence: { $sequence: 'castSkillDuringAction_21' },
            },
            {
              value: { kind: 'constant', value: 5 },
              sequence: { $sequence: 'castSkillDuringAction_22' },
            },
          ],
        },
        next: null,
      },
      startTimeDilation_24: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.833 },
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
      launchProjectile_27: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.0333333350718021,
            hit: { onReach: true, finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0034_typhoea_combo_02_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 1,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb: 0,
                  atk_scale: 0,
                  atk_scale_persistent: 0,
                  hit_index: 0,
                  naturalinflect_stack: 0,
                  persistent_naturalburst_increase: 0,
                  persistent_slow: 0,
                  persistent_time: 0,
                  recover_bufftime: 12,
                  usp: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'calculateActionValue_2' } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
                        action: {
                          kind: 'dealDamage',
                          parameters: {
                            damageType: 'nature',
                            attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                            tags: ['comboSkill'],
                          },
                        },
                        next: null,
                      },
                      calculateActionValue_2: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale',
                            operation: 'divide',
                            left: { kind: 'valueNode', nodeId: 'data_1' },
                            right: { kind: 'constant', value: 7 },
                          },
                        },
                        next: 'dealDamage_1',
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
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_27' },
          whenFalse: { $sequence: 'launchProjectile_27' },
        },
        next: null,
      },
      launchProjectile_53: {
        action: {
          kind: 'launchProjectile',
          parameters: {
            inheritActionBlackboard: true,
            entityInitialValues: {},
            finish: 'firstTickReach',
            recycleDelaySeconds: 0.433333337306976,
            hit: { onReach: true, finishOnHit: false },
          },
          callbacks: [
            {
              event: 'hit',
              skill: {
                skillId: 'chr_0034_typhoea_combo_01_projhit',
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 13,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: {
                  atb: 0,
                  atk_scale: 0,
                  atk_scale_persistent: 0,
                  hit_index: 0,
                  naturalinflect_stack: 0,
                  persistent_naturalburst_increase: 0,
                  persistent_slow: 0,
                  persistent_time: 0,
                  poise: 10,
                  recover_bufftime: 12,
                  usp: 0,
                },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 0, sequence: { $sequence: 'checkCondition_4' } },
                  { startFrame: 0, endFrame: 2, sequence: { $sequence: 'spawnAbilityEntity_5' } },
                  { startFrame: 0, endFrame: 3, sequence: { $sequence: null } },
                  { startFrame: 0, endFrame: 10, sequence: { $sequence: null } },
                ],
                actionGraph: {
                  main: {
                    nodes: {
                      dealDamage_1: {
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
                        next: null,
                      },
                      calculateActionValue_2: {
                        action: {
                          kind: 'calculateActionValue',
                          parameters: {
                            key: 'atk_scale',
                            operation: 'divide',
                            left: { kind: 'valueNode', nodeId: 'data_1' },
                            right: { kind: 'constant', value: 7 },
                          },
                        },
                        next: 'dealDamage_1',
                      },
                      applyBuff_3: {
                        action: {
                          kind: 'applyBuff',
                          parameters: {
                            buffs: [{ buffId: 'buff_chr_0034_typhoea_combo_skill_arrow_hittimes' }],
                            targets: { kind: 'fixed', target: 'enemy' },
                            source: { kind: 'source' },
                            inheritSourceSkillCastInfo: true,
                          },
                        },
                        next: 'calculateActionValue_2',
                      },
                      checkCondition_4: {
                        action: {
                          kind: 'checkCondition',
                          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_3' } },
                        },
                        next: 'applyBuff_3',
                      },
                      spawnAbilityEntity_5: {
                        action: {
                          kind: 'spawnAbilityEntity',
                          parameters: {
                            bornAt: { kind: 'fixed', target: 'enemy' },
                            abilityEntityId: 'abilityentity_chr_0034_typhoea_combo_presistdamage',
                            childSkillId: 'chr_0034_typhoea_combo_persistentdamage',
                            inheritActionBlackboard: true,
                            dieWhenSourceDies: false,
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
                      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
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
      changeResource_55: {
        action: {
          kind: 'changeResource',
          parameters: {
            resource: 'ultimateEnergy',
            amount: { kind: 'valueNode', nodeId: 'data_5' },
            coefficient: { kind: 'constant', value: 1 },
            source: { kind: 'source' },
            targets: { kind: 'source' },
          },
        },
        next: null,
      },
      checkCondition_56: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: 'changeResource_55',
      },
      applyBuff_57: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_func_arrowreload' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      modifyActionValue_58: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      readBuffStackCount_59: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'] },
          },
        },
        next: null,
      },
      castSkillDuringAction_60: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack1',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      ifElse_62: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'castSkillDuringAction_60' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_63: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_9' },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: 'ifElse_62' },
        },
        next: null,
      },
      readBuffStackCount_64: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'arrow_num',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_num'] },
          },
        },
        next: 'ifElse_63',
      },
      finishBuffsById_65: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_66: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_arrowshow' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_67: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'applyBuff_66',
      },
      ifElse_opt2: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'launchProjectile_53' },
          whenFalse: { $sequence: 'launchProjectile_53' },
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
          distance: 15,
          lessThan: true,
          includeTargetRadius: false,
          containsHittableObject: false,
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'entityCountCompare',
          target: { kind: 'context', key: 'tar1' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_3: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_4: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_floating_attack_index' },
      },
      data_5: { type: 'number', expression: { kind: 'blackboard', key: 'usp' } },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_combo_skillfloating: SkillDefinition = {
  key: 'chr_0034_typhoea_combo_skillfloating',
  element: 'nature',
  blackboard: {
    arrow_num: 0,
    atb: 0,
    atk_scale: [0.89, 0.98, 1.07, 1.16, 1.25, 1.34, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
    atk_scale_persistent: [0.45, 0.49, 0.54, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.93, 1],
    bullet_energy: 0,
    count: 3,
    duration: 5,
    energy_to_bullet_ratio: 2,
    owner_mainchar_distance: 0,
    persistent_naturalburst_increase: [
      0.06, 0.06, 0.06, 0.07, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1,
    ],
    persistent_slow: 0.6,
    poise: 10,
    usp: 10,
  },
  timelineBlockFrames: 57,
  naturalDurationFrames: 70,
  exclusiveFrame: 999,
  offsetRecordFrame: 0,
  inputWindows: {
    commandMappings: [
      {
        startFrame: 40,
        endFrame: 70,
        input: 'basicAttack',
        targetSkillId: 'chr_0034_typhoea_floating_attack1',
      },
    ],
    hasConditionalActions: true,
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 180, endFrame: 181, sequence: { $sequence: 'interruptCurrentSkill_1' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'ifElse_14' } },
    { startFrame: 0, endFrame: 70, sequence: { $sequence: 'inheritBuffById_15' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'adjustSkillCooldown_16' } },
    { startFrame: 67, endFrame: 70, sequence: { $sequence: 'switch_23' } },
    { startFrame: 0, endFrame: 22, sequence: { $sequence: 'startTimeDilation_24' } },
    { startFrame: 39, endFrame: 42, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 43, endFrame: 46, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 44, endFrame: 47, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 45, endFrame: 48, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 47, endFrame: 50, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 49, endFrame: 52, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 35, endFrame: 54, sequence: { $sequence: 'ifElse_opt2' } },
    { startFrame: 35, endFrame: 38, sequence: { $sequence: 'checkCondition_56' } },
    { startFrame: 35, endFrame: 38, sequence: { $sequence: 'applyBuff_57' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'modifyActionValue_58' } },
    { startFrame: 40, endFrame: 70, sequence: { $sequence: 'readBuffStackCount_59' } },
    { startFrame: 57, endFrame: 74, sequence: { $sequence: 'readBuffStackCount_64' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_65' } },
    { startFrame: 57, endFrame: 60, sequence: { $sequence: 'checkCondition_67' } },
  ],
  smartTarget: 'trigger',
  cooldownFrames: [630, 630, 630, 630, 630, 630, 630, 630, 630, 600, 600, 570],
  skillType: 'comboSkill',
  levelSource: 'comboSkill',
  nativeSkillType: 'comboSkill',
  actionGraph: typhoeusChr_0034_typhoea_combo_skillfloatingActionGraph,
};

export const typhoeusChr_0034_typhoea_ultimate_skillfloatingActionGraph = {
  main: {
    nodes: {
      inheritBuffById_3: {
        action: {
          kind: 'inheritBuffById',
          parameters: {
            target: 'caster',
            buffId: 'buff_chr_0034_typhoea_floatingmode',
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
            ],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
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
                buffId: 'buff_chr_0034_typhoea_floatingmode',
                copiedBlackboardAssignments: {
                  potential_atkup: 'potential_atkup',
                  atk_up: 'atk_up',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: [
              'chr_0034_typhoea_normal_skill_floating_loop',
              'chr_0034_typhoea_normal_skill_floating_end',
              'chr_0034_typhoea_floating_attack1',
              'chr_0034_typhoea_floating_attack2',
              'chr_0034_typhoea_floating_attack3',
              'chr_0034_typhoea_floating_attack4',
              'chr_0034_typhoea_floating_attack5',
              'chr_0034_typhoea_combo_skillfloating',
              'chr_0034_typhoea_ultimate_skillfloating',
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
      ifElse_4: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'applyBuff_2' },
          whenFalse: { $sequence: 'inheritBuffById_3' },
        },
        next: null,
      },
      startTimeDilation_5: {
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
      startUltimateTimeDilation_6: {
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
      hideUi_7: { action: { kind: 'hideUi', parameters: { onlyBlockInput: false } }, next: null },
      modifyActionValue_8: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      modifyActionValue_13: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_floating_attack_index',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: null,
      },
      applyBuff_14: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passive_arrowrecover_exitfight' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            count: { kind: 'valueNode', nodeId: 'data_2' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'modifyActionValue_13',
      },
      applyBuff_12: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_num' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            count: { kind: 'valueNode', nodeId: 'data_2' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'modifyActionValue_13',
      },
      checkCondition_9: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: null,
      },
      readBuffBlackboard_10: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover'] },
            desiredKey: 'truly_exit_fight',
            outputKey: 'truly_exit_fight',
          },
        },
        next: 'checkCondition_9',
      },
      ifElse_15: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'readBuffBlackboard_10' },
          whenTrue: { $sequence: 'applyBuff_12' },
          whenFalse: { $sequence: 'applyBuff_14' },
        },
        next: null,
      },
      modifyActionValue_16: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_can_trigger_combo',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          },
        },
        next: 'ifElse_15',
      },
      modifyActionValue_17: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_can_trigger_combo',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      spawnAbilityEntity_20: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'context', key: 'pos' },
            abilityEntityId: 'abilityentity_chr_0034_typhoea_ultimateskill_arrowrain',
            childSkillId: 'chr_0034_typhoea_ultimate_skill_arrowrain',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
        next: null,
      },
      switch_23: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_5' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 5 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      ifElse_24: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_1' },
          whenTrue: { $sequence: 'switch_23' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      switch_26: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_5' }, alwaysNext: true },
          options: [
            { value: { kind: 'constant', value: 2 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 1 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 3 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 0 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 4 }, sequence: { $sequence: null } },
            { value: { kind: 'constant', value: 5 }, sequence: { $sequence: null } },
          ],
        },
        next: null,
      },
      checkCondition_25: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: null,
      },
      ifElse_27: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_25' },
          whenTrue: { $sequence: 'switch_26' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      castSkillDuringAction_39: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_normal_skill_floating_end',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_38: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack5',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_37: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack4',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_36: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack3',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_35: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack2',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      castSkillDuringAction_34: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_floating_attack1',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      switch_43: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_5' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 0 },
              sequence: { $sequence: 'castSkillDuringAction_34' },
            },
            {
              value: { kind: 'constant', value: 1 },
              sequence: { $sequence: 'castSkillDuringAction_35' },
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'castSkillDuringAction_36' },
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'castSkillDuringAction_37' },
            },
            {
              value: { kind: 'constant', value: 4 },
              sequence: { $sequence: 'castSkillDuringAction_38' },
            },
            {
              value: { kind: 'constant', value: 5 },
              sequence: { $sequence: 'castSkillDuringAction_39' },
            },
          ],
        },
        next: null,
      },
      castSkillDuringAction_32: {
        action: {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0034_typhoea_normal_skill_floating_loop',
            target: 'enemy',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
            interruptCurrentSkillOnlyWhenTargetCastable: true,
          },
        },
        next: null,
      },
      switch_41: {
        action: {
          kind: 'switch',
          parameters: { choice: { kind: 'valueNode', nodeId: 'data_5' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 0 },
              sequence: { $sequence: 'castSkillDuringAction_32' },
            },
            {
              value: { kind: 'constant', value: 1 },
              sequence: { $sequence: 'castSkillDuringAction_32' },
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: { $sequence: 'castSkillDuringAction_32' },
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: { $sequence: 'castSkillDuringAction_32' },
            },
            {
              value: { kind: 'constant', value: 4 },
              sequence: { $sequence: 'castSkillDuringAction_32' },
            },
            {
              value: { kind: 'constant', value: 5 },
              sequence: { $sequence: 'castSkillDuringAction_39' },
            },
          ],
        },
        next: null,
      },
      checkCondition_42: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'switch_41',
      },
      checkCondition_40: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: null,
      },
      ifElse_44: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_40' },
          whenTrue: { $sequence: 'checkCondition_42' },
          whenFalse: { $sequence: 'switch_43' },
        },
        next: null,
      },
      applyBuff_45: {
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
      finishBuffsById_46: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_47: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_common_arrowshow' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_48: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_9' } },
        },
        next: 'applyBuff_47',
      },
      ifElse_opt1: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: null },
          whenTrue: { $sequence: 'spawnAbilityEntity_20' },
          whenFalse: { $sequence: 'spawnAbilityEntity_20' },
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
          buffIds: ['buff_chr_0034_typhoea_floatingmode'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'arrow_num_given' } },
      data_3: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'truly_exit_fight', fallback: 0 },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_3' },
          operator: 'less',
          right: { kind: 'constant', value: 0.5 },
        },
      },
      data_5: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_floating_attack_index' },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_floatingmode'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_floatingmode'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_8: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_9: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusChr_0034_typhoea_ultimate_skillfloating: SkillDefinition = {
  key: 'chr_0034_typhoea_ultimate_skillfloating',
  element: 'nature',
  blackboard: {
    arrow_num_given: 2,
    atk_scale_2: 0,
    atk_scale_center: [
      0.889, 0.978, 1.067, 1.155, 1.244, 1.333, 1.422, 1.511, 1.6, 1.711, 1.844, 2,
    ],
    atk_scale_main: [1.333, 1.467, 1.6, 1.733, 1.867, 2, 2.133, 2.267, 2.4, 2.567, 2.767, 3],
    atk_scale_outer: [0.333, 0.367, 0.4, 0.433, 0.467, 0.5, 0.534, 0.567, 0.6, 0.642, 0.692, 0.75],
    atk_up: 0.08,
    poise: 20,
    potential_atkup: 0,
    potential_damge_up: 1,
    radius: 4,
    truly_exit_fight: 0,
  },
  timelineBlockFrames: 83,
  naturalDurationFrames: 92,
  exclusiveFrame: 105,
  offsetRecordFrame: 0,
  inputWindows: {
    allowedNextSkills: [
      {
        startFrame: 100,
        endFrame: 158,
        skillIds: ['chr_0004_pelica_normal_skill', 'chr_0004_pelica_combo_skill'],
      },
    ],
    hasConditionalActions: true,
  },
  costFrame: 0,
  scheduledSequences: [
    { startFrame: 0, endFrame: 92, sequence: { $sequence: 'ifElse_4' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'startTimeDilation_5' } },
    { startFrame: 0, endFrame: 62, sequence: { $sequence: 'startUltimateTimeDilation_6' } },
    { startFrame: 0, endFrame: 62, sequence: { $sequence: 'hideUi_7' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'modifyActionValue_8' } },
    { startFrame: 61, endFrame: 62, sequence: { $sequence: 'modifyActionValue_16' } },
    { startFrame: 62, endFrame: 63, sequence: { $sequence: 'modifyActionValue_17' } },
    { startFrame: 61, endFrame: 62, sequence: { $sequence: 'ifElse_opt1' } },
    { startFrame: 47, endFrame: 92, sequence: { $sequence: 'ifElse_24' } },
    { startFrame: 83, endFrame: 92, sequence: { $sequence: 'ifElse_27' } },
    { startFrame: 89, endFrame: 92, sequence: { $sequence: 'ifElse_44' } },
    { startFrame: 0, endFrame: 105, sequence: { $sequence: 'applyBuff_45' } },
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'finishBuffsById_46' } },
    { startFrame: 87, endFrame: 90, sequence: { $sequence: 'checkCondition_48' } },
  ],
  cooldownFrames: 600,
  costs: [{ resource: 'ultimateEnergy', value: 200 }],
  skillType: 'ultimate',
  levelSource: 'ultimate',
  nativeSkillType: 'ultimateSkill',
  actionGraph: typhoeusChr_0034_typhoea_ultimate_skillfloatingActionGraph,
};

export const typhoeusCommon_character_perfect_dodgeActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

export const typhoeusCommon_character_perfect_dodge: SkillDefinition = {
  actionGraph: typhoeusCommon_character_perfect_dodgeActionGraph,
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

const typhoeusPassive1ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passive' }],
            targets: { kind: 'fixed', target: 'caster' },
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusPassive1: OperatorPassiveSkillDefinition = {
  key: 'chr_0034_typhoea_passive',
  enableSequence: { $sequence: 'applyBuff_1' },
  actionGraph: typhoeusPassive1ActionGraph,
};

const typhoeusPassive2ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passive_increase_attackrange' }],
            targets: { kind: 'fixed', target: 'caster' },
            inheritSourceSkillCastInfo: false,
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusPassive2: OperatorPassiveSkillDefinition = {
  key: 'chr_0034_typhoea_passive_increase_attackrange',
  enableSequence: { $sequence: 'applyBuff_1' },
  actionGraph: typhoeusPassive2ActionGraph,
};

const typhoeusComboCondition1ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
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
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_2',
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_can_trigger_combo', fallback: 0 },
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
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_energy'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 8 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffIdMatch',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_energy'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusComboCondition1: ComboSkillConditionDefinition = {
  key: 'native-combo:0',
  skillKey: 'chr_0034_typhoea_combo_skill',
  event: 'addedBuff',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'checkCondition_3' },
  actionGraph: typhoeusComboCondition1ActionGraph,
};

const typhoeusComboCondition2ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
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
      checkCondition_3: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'checkCondition_2',
      },
      checkCondition_4: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'checkCondition_3',
      },
      invertNextResult_5: {
        action: { kind: 'invertNextResult', parameters: {} },
        next: 'checkCondition_4',
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'EntityBB_can_trigger_combo', fallback: 0 },
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
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_energy'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 8 },
        },
      },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'contextTargetIdentityMatch',
          contextKey: 'trigger',
          other: 'controlledOperator',
          operator: 'equal',
        },
      },
      data_5: { type: 'boolean', expression: { kind: 'casterComboPending' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusComboCondition2: ComboSkillConditionDefinition = {
  key: 'native-combo:1',
  skillKey: 'chr_0034_typhoea_combo_skill',
  event: 'beforeOutputDamage',
  immediately: false,
  initialValues: null,
  sequence: { $sequence: 'invertNextResult_5' },
  actionGraph: typhoeusComboCondition2ActionGraph,
};

const typhoeusBuff1ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff1: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 10,
  durationSeconds: 0.2,
  applyTags: [],
  extendTags: [],
  blackboard: { count: 0 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff1ActionGraph,
};

const typhoeusBuff2ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff2: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 10,
  durationSeconds: 0.2,
  applyTags: [],
  extendTags: [],
  blackboard: { count: 0 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff2ActionGraph,
};

const typhoeusBuff3ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff3: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { count: 0 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff3ActionGraph,
};

const typhoeusBuff4ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff4: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { count: 0 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff4ActionGraph,
};

const typhoeusBuff5ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_common_affixes_slow',
                blackboardAssignments: {
                  duration: { kind: 'constant', value: 20 },
                  rate: { kind: 'valueNode', nodeId: 'data_1' },
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            finishByAction: true,
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
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'slow_down' } },
      data_2: {
        type: 'boolean',
        expression: { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['natureBurst'] },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff5: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { damage_up: 0.1, slow_down: 0.5 },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'defender',
      condition: { $sequence: 'checkCondition_2' },
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
  lifecycleSequences: { enable: { $sequence: 'applyBuff_1' } },
  actionGraph: typhoeusBuff5ActionGraph,
};

const typhoeusBuff6ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff6: SkillBuffDefinition = {
  stackingType: 'enhanceAndRefresh',
  priority: 0,
  maxStackCount: 5,
  durationSeconds: 2,
  applyTags: ['Skill/Character/chr_0034_typhoea/CanUseFloatingSkill'],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: typhoeusBuff6ActionGraph,
};

const typhoeusBuff7ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff7: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 20,
  applyTags: ['Skill/Character/chr_0034_typhoea/CanUseFloatingSkill'],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: typhoeusBuff7ActionGraph,
};

const typhoeusBuff8ActionGraph = {
  main: {
    nodes: {
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
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
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0034_typhoea_floatingmode'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff8: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  triggerIntervalSeconds: 0.1,
  waitFirstTriggerInterval: false,
  maxTriggerCount: -1,
  applyTags: [],
  extendTags: [],
  blackboard: { damageup: 0.1 },
  attributeModifiers: [],
  lifecycleSequences: { trigger: { $sequence: 'checkCondition_2' } },
  actionGraph: typhoeusBuff8ActionGraph,
};

const typhoeusBuff9ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_num' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            count: { kind: 'valueNode', nodeId: 'data_1' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      finishBuffsById_2: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_energy'],
            reason: 'other',
          },
        },
        next: 'applyBuff_1',
      },
      calculateActionValue_3: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'bullet_energy',
            operation: 'divide',
            left: { kind: 'valueNode', nodeId: 'data_1' },
            right: { kind: 'valueNode', nodeId: 'data_2' },
          },
        },
        next: 'finishBuffsById_2',
      },
      calculateActionValue_4: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'bullet_energy',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_1' },
            right: { kind: 'constant', value: -1 },
          },
        },
        next: 'calculateActionValue_3',
      },
      readBuffStackCount_5: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'buffOwner',
            outputKey: 'bullet_energy',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_energy'] },
          },
        },
        next: 'calculateActionValue_4',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'bullet_energy' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'energy_to_bullet_ratio' } },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff9: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { bullet_energy: 0, count: 0, energy_to_bullet_ratio: 2 },
  attributeModifiers: [],
  scheduledSequences: [
    { startFrame: 0, endFrame: 3, sequence: { $sequence: 'readBuffStackCount_5' } },
  ],
  actionGraph: typhoeusBuff9ActionGraph,
};

const typhoeusBuff10ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff10: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: 0.2,
  applyTags: [],
  extendTags: [],
  blackboard: { count: 0 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff10ActionGraph,
};

const typhoeusBuff11ActionGraph = {
  main: {
    nodes: {
      checkCondition_23: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      finishBuffsById_1: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_passive_increase_attackrange'],
            reason: 'other',
          },
        },
        next: null,
      },
      changePlayerActionMode_2: {
        action: {
          kind: 'changePlayerActionMode',
          parameters: { modeId: 'floating', lifetime: 'finishByAction' },
        },
        next: null,
      },
      inheritSkillCastInfoForBasicAttack_3: {
        action: { kind: 'inheritSkillCastInfoForBasicAttack', parameters: {} },
        next: null,
      },
      applyBuff_4: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_targetfind' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          },
        },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'applyBuff_4',
      },
      applyBuff_6: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [
              {
                buffId: 'buff_chr_0034_typhoea_potential_atkup',
                copiedBlackboardAssignments: { atk_up: 'atk_up' },
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
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'applyBuff_6',
      },
      withActionBlackboardScope_24: {
        action: {
          kind: 'withActionBlackboardScope',
          parameters: {
            scopeKey: 'native-buff-callback:3',
            lifetime: 'execution',
            alwaysNext: true,
            shareParentBlackboard: true,
            initialValues: {},
            inheritParent: true,
          },
          body: { $sequence: 'checkCondition_7' },
        },
        next: null,
      },
      withActionBlackboardScope_25: {
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
        next: 'withActionBlackboardScope_24',
      },
      withActionBlackboardScope_26: {
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
          body: { $sequence: 'inheritSkillCastInfoForBasicAttack_3' },
        },
        next: 'withActionBlackboardScope_25',
      },
      withActionBlackboardScope_27: {
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
          body: { $sequence: 'changePlayerActionMode_2' },
        },
        next: 'withActionBlackboardScope_26',
      },
      finishBuffsById_8: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_normal_skill_targetfind'],
            reason: 'other',
          },
        },
        next: null,
      },
      applyBuff_9: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passive_increase_attackrange' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'finishBuffsById_8',
      },
      finishOwner_10: {
        action: { kind: 'finishOwner', parameters: { targets: { kind: 'context', key: 'tar' } } },
        next: null,
      },
      checkCondition_11: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'finishOwner_10',
      },
      findOwnerSpawnedAbilityEntities_12: {
        action: {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'tar',
            abilityEntityIds: ['abilityentity_chr_0034_typhoea_ultimateskill_arrowrain'],
          },
        },
        next: 'checkCondition_11',
      },
      finishBuffsById_13: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_common_arrowshow'],
            reason: 'other',
          },
        },
        next: null,
      },
      withActionBlackboardScope_28: {
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
          body: { $sequence: 'finishBuffsById_13' },
        },
        next: null,
      },
      withActionBlackboardScope_29: {
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
          body: { $sequence: 'findOwnerSpawnedAbilityEntities_12' },
        },
        next: 'withActionBlackboardScope_28',
      },
      withActionBlackboardScope_30: {
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
          body: { $sequence: 'applyBuff_9' },
        },
        next: 'withActionBlackboardScope_29',
      },
      finishBuffsById_14: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_floatingmode'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_15: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'finishBuffsById_14',
      },
      checkCondition_17: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: 'finishBuffsById_14',
      },
      invertNextResult_18: {
        action: { kind: 'invertNextResult', parameters: {} },
        next: 'checkCondition_17',
      },
      finishBuffsById_19: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_talent_linken_sphere_enable'],
            reason: 'other',
          },
        },
        next: null,
      },
      triggerCustomAbilityEvent_20: {
        action: {
          kind: 'triggerCustomAbilityEvent',
          parameters: {
            eventName: 'sheild_broken',
            eventParam: 0,
            target: 'caster',
            source: 'caster',
          },
        },
        next: 'finishBuffsById_19',
      },
      applyBuff_21: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_talent_linken_sphere_superarmour' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'triggerCustomAbilityEvent_20',
      },
      checkCondition_22: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_8' } },
        },
        next: 'applyBuff_21',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: { kind: 'eventDamageFeaturesMatch', match: 'hasAll', features: ['remainArea'] },
      },
      data_2: { type: 'boolean', expression: { kind: 'casterControlled' } },
      data_3: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'potential_atkup', fallback: 0 },
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
          kind: 'entityCountCompare',
          target: { kind: 'context', key: 'tar' },
          containsHittableTarget: false,
          excludeDeadEntity: false,
          operator: 'greaterOrEqual',
          value: 1,
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTags: ['Status/Immobilized'],
        },
      },
      data_7: {
        type: 'boolean',
        expression: { kind: 'skillInterruptReasonIn', reasons: ['castNextSkill'] },
      },
      data_8: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0034_typhoea_talent_linken_sphere_enable'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff11: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [
    'Status/Unjumpable',
    'Status/DisableDash',
    'Status/DisableBreakingAttack',
    'Status/CantSwitchOutCenter',
    'Status/Ability/Skill/CantSwitchTocCenter',
    'Status/DisableNormalSkill',
    'Status/IgnoreEnemyCollision',
    'Skill/Character/chr_0034_typhoea/FloatingMode',
    'AI/Status/CanAIForceDontTeleport',
  ],
  extendTags: [],
  blackboard: { atk_up: 0, potential_atkup: 0 },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'defender',
      condition: { $sequence: 'checkCondition_23' },
      processors: [{ kind: 'damageScale', side: 'defender', zone: 'product', addition: -1 }],
    },
  ],
  lifecycleSequences: {
    start: { $sequence: 'finishBuffsById_1' },
    enable: { $sequence: 'withActionBlackboardScope_27' },
    finish: { $sequence: 'withActionBlackboardScope_30' },
  },
  abilityEventResponses: [
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'checkCondition_15' } },
    { event: 'skillInterrupted', priority: 0, sequence: { $sequence: 'invertNextResult_18' } },
    { event: 'takeDamage', priority: 0, sequence: { $sequence: 'checkCondition_22' } },
  ],
  skillSlotReplacements: [
    {
      skillSlotKey: 'comboSkill',
      targetSkillKey: 'chr_0034_typhoea_combo_skillfloating',
      revertedSkillKey: 'chr_0034_typhoea_combo_skill',
      inheritOriginSkillCooldownProgress: false,
    },
  ],
  actionGraph: typhoeusBuff11ActionGraph,
};

const typhoeusBuff12ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff12: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 1,
  applyTags: [
    'Status/Unjumpable',
    'Status/DisableDash',
    'Status/DisableBreakingAttack',
    'Status/CantSwitchOutCenter',
    'Status/Ability/Skill/CantSwitchTocCenter',
    'Status/DisableNormalSkill',
  ],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: typhoeusBuff12ActionGraph,
};

const typhoeusBuff13ActionGraph = {
  main: {
    nodes: {
      changeResource_1: {
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
    },
    dataNodes: { data_1: { type: 'number', expression: { kind: 'blackboard', key: 'atb' } } },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff13: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: 0.2,
  applyTags: [],
  extendTags: [],
  blackboard: { atb: 0, count: 0 },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'changeResource_1' } },
  actionGraph: typhoeusBuff13ActionGraph,
};

const typhoeusBuff14ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff14: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: ['Skill/Character/chr_0034_typhoea/EnemyInArea'],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: typhoeusBuff14ActionGraph,
};

const typhoeusBuff15ActionGraph = {
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
          target: 'buffOwner',
          buffIds: ['buff_chr_0034_typhoea_normal_skill_arrow_energy'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 8 },
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff15: SkillBuffDefinition = {
  stackingType: 'enhance',
  priority: 0,
  maxStackCount: 8,
  presentation: {
    visible: true,
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: false,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: true,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'NoLifeTime',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { auto_enhance_rate: 1, count: 0, recover_time: 24 },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'checkCondition_1' } },
  actionGraph: typhoeusBuff15ActionGraph,
};

const typhoeusBuff16ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy' }],
            targets: { kind: 'owner' },
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

const typhoeusBuff16: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 10,
  addingCooldownSeconds: 0.2,
  durationSeconds: 3,
  applyTags: [],
  extendTags: [],
  blackboard: { auto_enhance_rate: 1, count: 0, recover_time: 24 },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'applyBuff_1' } },
  actionGraph: typhoeusBuff16ActionGraph,
};

const typhoeusBuff17ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy' }],
            targets: { kind: 'owner' },
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

const typhoeusBuff17: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 10,
  addingCooldownSeconds: 0.2,
  durationSeconds: 3,
  applyTags: [],
  extendTags: [],
  blackboard: { auto_enhance_rate: 1, count: 0, recover_time: 24 },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'applyBuff_1' } },
  actionGraph: typhoeusBuff17ActionGraph,
};

const typhoeusBuff18ActionGraph = {
  main: {
    nodes: {
      applyBuff_1: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy' }],
            targets: { kind: 'owner' },
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

const typhoeusBuff18: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 10,
  addingCooldownSeconds: 0.2,
  durationSeconds: 3,
  applyTags: [],
  extendTags: [],
  blackboard: { auto_enhance_rate: 1, count: 0, recover_time: 24 },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'applyBuff_1' } },
  actionGraph: typhoeusBuff18ActionGraph,
};

const typhoeusBuff19ActionGraph = {
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
          kind: 'eventCustomAbilityNameMatch',
          eventName: 'arrowrecover_speedup',
          outputKey: 'auto_enhance_rate',
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff19: SkillBuffDefinition = {
  stackingType: 'enhance',
  priority: 0,
  maxStackCount: 4,
  presentation: {
    visible: true,
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: false,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: true,
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
    iconStyleInSquad: 'NoLifeTime',
    abnormalColorType: 'Physical',
    orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
  },
  applyTags: [],
  extendTags: [],
  blackboard: { auto_enhance_rate: 1, count: 0, recover_time: 24 },
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'customAbilityEvent', priority: 0, sequence: { $sequence: 'checkCondition_1' } },
  ],
  actionGraph: typhoeusBuff19ActionGraph,
};

const typhoeusBuff20ActionGraph = {
  main: {
    nodes: {
      startTimeDilation_1: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.35 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 50,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.135,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0.333333343,
                },
                {
                  time: 0.25494957,
                  value: 0.135,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0.333333343,
                },
                {
                  time: 0.75,
                  value: 0.135,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0.333333343,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0.333333343,
                },
              ],
            },
            finishByAction: false,
            ignoredTargets: [],
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff20: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: 2,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  lifecycleSequences: { enable: { $sequence: 'startTimeDilation_1' } },
  actionGraph: typhoeusBuff20ActionGraph,
};

const typhoeusBuff21ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff21: SkillBuffDefinition = {
  stackingType: 'highPriority',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: typhoeusBuff21ActionGraph,
};

const typhoeusBuff22ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff22: SkillBuffDefinition = {
  stackingType: 'enhance',
  priority: 0,
  maxStackCount: 4,
  durationSeconds: 0.5,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: typhoeusBuff22ActionGraph,
};

const typhoeusBuff23ActionGraph = {
  main: {
    nodes: {
      checkCondition_1: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
        },
        next: null,
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_1' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      applyBuff_3: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_3' }],
            targets: { kind: 'source' },
            source: { kind: 'source' },
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
          whenTrue: { $sequence: 'applyBuff_2' },
          whenFalse: { $sequence: 'applyBuff_3' },
        },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: 'ifElse_4',
      },
    },
    dataNodes: {
      data_1: {
        type: 'boolean',
        expression: {
          kind: 'entityTagMatch',
          target: 'actionInputTarget',
          tagQueryType: 'hasAny',
          tags: ['Skill/Character/chr_0034_typhoea'],
        },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellBurst/NaturalBurst'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff23: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 10,
  applyTags: [],
  extendTags: [],
  blackboard: { auto_enhance_rate: 1, count: 0, recover_time: 24 },
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'addedBuff', priority: 0, sequence: { $sequence: 'checkCondition_5' } },
  ],
  actionGraph: typhoeusBuff23ActionGraph,
};

const typhoeusBuff24ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff24: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
  actionGraph: typhoeusBuff24ActionGraph,
};

const typhoeusBuff25ActionGraph = {
  main: {
    nodes: {
      applyBuff_6: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_num' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            count: { kind: 'constant', value: 4 },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: true } },
        },
        next: null,
      },
      modifyActionValue_10: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'truly_exit_fight',
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
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            count: { kind: 'valueNode', nodeId: 'data_1' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'modifyActionValue_10',
      },
      ifElse_12: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'applyBuff_6' },
          whenFalse: { $sequence: null },
        },
        next: 'applyBuff_11',
      },
      finishBuffsById_3: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            reason: 'other',
            count: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      applyBuff_4: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passive_arrowrecover_exitfight' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'finishBuffsById_3',
      },
      applyBuff_2: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passive_arrowrecover_exitfight' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            count: { kind: 'constant', value: 4 },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      modifyActionValue_8: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'truly_exit_fight',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          },
        },
        next: null,
      },
      ifElse_9: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_5' },
          whenTrue: { $sequence: 'applyBuff_2' },
          whenFalse: { $sequence: 'applyBuff_4' },
        },
        next: 'modifyActionValue_8',
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'constant', value: false } },
        },
        next: null,
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_7' },
          whenTrue: { $sequence: 'ifElse_9' },
          whenFalse: { $sequence: 'ifElse_12' },
        },
        next: null,
      },
      aura_14: {
        action: {
          kind: 'aura',
          parameters: {
            targets: { kind: 'fixed', target: 'enemy' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: false,
            buffs: [{ buffId: 'buff_chr_0034_typhoea_passitive_enemy_listennaturalspellbrust' }],
          },
          onEnter: { $sequence: null },
          onExit: { $sequence: null },
        },
        next: null,
      },
      finishBuffsById_16: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            reason: 'other',
          },
        },
        next: 'modifyActionValue_10',
      },
      applyBuff_17: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_num' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            count: { kind: 'valueNode', nodeId: 'data_2' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'finishBuffsById_16',
      },
      readBuffStackCount_18: {
        action: {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'buffOwner',
            outputKey: 'arrow_num',
            query: {
              kind: 'id',
              buffIds: ['buff_chr_0034_typhoea_passive_arrowrecover_exitfight'],
            },
          },
        },
        next: 'applyBuff_17',
      },
      applyBuff_19: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            count: { kind: 'valueNode', nodeId: 'data_1' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'readBuffStackCount_18',
      },
      finishBuffsById_20: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: [
              'buff_chr_0034_typhoea_normal_skill_arrow_num',
              'buff_chr_0034_typhoea_normal_skill_arrow_energy',
            ],
            reason: 'other',
          },
        },
        next: 'applyBuff_19',
      },
      checkCondition_21: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
        },
        next: 'finishBuffsById_20',
      },
      finishBuffsById_22: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_normal_skill_show_arrowui'],
            reason: 'other',
          },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'energy_enterfight' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'arrow_num' } },
      data_3: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'truly_exit_fight', fallback: 0 },
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
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff25: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  applyTags: [],
  extendTags: [],
  blackboard: {
    arrow_num: 0,
    arrow_recover_time: 25,
    energy_enterfight: 6,
    max_arrow: 5,
    truly_exit_fight: 1,
  },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'ifElse_13' }, enable: { $sequence: 'aura_14' } },
  abilityEventResponses: [
    { event: 'enterFight', priority: 0, sequence: { $sequence: 'checkCondition_21' } },
    { event: 'ownerSwitchToGuard', priority: 0, sequence: { $sequence: 'finishBuffsById_22' } },
  ],
  actionGraph: typhoeusBuff25ActionGraph,
};

const typhoeusBuff26ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff26: SkillBuffDefinition = {
  stackingType: 'timedGrowingEnhance',
  priority: 0,
  maxStackCount: 4,
  durationSeconds: { blackboardKey: 'arrow_recover_time' },
  presentation: {
    visible: true,
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: false,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: true,
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
  blackboard: { arrow_recover_time: 3, max_arrow: 5 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff26ActionGraph,
};

const typhoeusBuff27ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff27: SkillBuffDefinition = {
  stackingType: 'stack',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { count: 0 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff27ActionGraph,
};

const typhoeusBuff28ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff28: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { atk_up: 0.08 },
  attributeModifiers: [
    { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
  ],
  actionGraph: typhoeusBuff28ActionGraph,
};

const typhoeusBuff29ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff29: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { decrease_cd: -3 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff29ActionGraph,
};

const typhoeusBuff30ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff30: SkillBuffDefinition = {
  stackingType: 'refresh',
  priority: 0,
  maxStackCount: 10,
  durationSeconds: 1,
  applyTags: [],
  extendTags: [],
  blackboard: { count: 0 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff30ActionGraph,
};

const typhoeusBuff31ActionGraph = {
  main: {
    nodes: {
      calculateActionValue_1: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'damage_resist',
            operation: 'add',
            left: { kind: 'constant', value: 1 },
            right: { kind: 'valueNode', nodeId: 'data_1' },
          },
        },
        next: null,
      },
      calculateActionValue_2: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'param1',
            operation: 'multiply',
            left: { kind: 'valueNode', nodeId: 'data_2' },
            right: { kind: 'constant', value: -1 },
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
                buffId: 'buff_chr_0034_typhoea_talent_linken_sphere_enable',
                copiedBlackboardAssignments: {
                  protect_times: 'protect_times',
                  damage_resist: 'param1',
                },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            count: { kind: 'valueNode', nodeId: 'data_3' },
            inheritSourceSkillCastInfo: true,
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
      checkCondition_5: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: 'checkCondition_4',
      },
      finishBuffsById_6: {
        action: {
          kind: 'finishBuffsById',
          parameters: {
            targets: { kind: 'owner' },
            finishSource: { kind: 'source' },
            buffIds: ['buff_chr_0034_typhoea_talent_linken_sphere_enable'],
            reason: 'other',
          },
        },
        next: null,
      },
      checkCondition_7: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'finishBuffsById_6',
      },
      checkCondition_8: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      calculateActionValue_9: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'param2',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_8' },
            right: { kind: 'valueNode', nodeId: 'data_9' },
          },
        },
        next: null,
      },
      readBuffBlackboard_10: {
        action: {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'buffOwner',
            query: { kind: 'id', buffIds: ['buff_chr_0034_typhoea_potential_decrease_sheildcd'] },
            desiredKey: 'decrease_cd',
            outputKey: 'param3',
          },
        },
        next: 'calculateActionValue_9',
      },
      modifyActionValue_11: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'param2',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'data_8' },
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
                buffId: 'buff_chr_0034_typhoea_talent_linken_sphere_cd',
                copiedBlackboardAssignments: { sheild_cd: 'param2' },
              },
            ],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: null,
      },
      ifElse_13: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_8' },
          whenTrue: { $sequence: 'readBuffBlackboard_10' },
          whenFalse: { $sequence: 'modifyActionValue_11' },
        },
        next: 'applyBuff_12',
      },
      checkCondition_14: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_10' } },
        },
        next: 'ifElse_13',
      },
    },
    dataNodes: {
      data_1: { type: 'number', expression: { kind: 'blackboard', key: 'param1' } },
      data_2: { type: 'number', expression: { kind: 'blackboard', key: 'damage_resist' } },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'protect_times' } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0034_typhoea_talent_linken_sphere_cd'],
          operator: 'less',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'eventSkillIdIn',
          skillIds: [
            'chr_0034_typhoea_normal_skill_floating_start',
            'chr_0034_typhoea_ultimate_skillfloating',
          ],
        },
      },
      data_6: {
        type: 'boolean',
        expression: { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0034_typhoea_floatingmode'] },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0034_typhoea_potential_decrease_sheildcd'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_8: { type: 'number', expression: { kind: 'blackboard', key: 'sheild_cd' } },
      data_9: { type: 'number', expression: { kind: 'blackboard', key: 'param3' } },
      data_10: {
        type: 'boolean',
        expression: { kind: 'eventCustomAbilityNameMatch', eventName: 'sheild_broken' },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff31: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    damage_resist: 0.3,
    param1: 0,
    param2: 0,
    param3: 0,
    protect_times: 1,
    sheild_cd: 18,
  },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'calculateActionValue_2' } },
  abilityEventResponses: [
    { event: 'beforeCastSkill', priority: 0, sequence: { $sequence: 'checkCondition_5' } },
    { event: 'finishedBuff', priority: 0, sequence: { $sequence: 'checkCondition_7' } },
    { event: 'customAbilityEvent', priority: 0, sequence: { $sequence: 'checkCondition_14' } },
  ],
  actionGraph: typhoeusBuff31ActionGraph,
};

const typhoeusBuff32ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff32: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 1,
  durationSeconds: { blackboardKey: 'sheild_cd' },
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_typhoea_sheild_broken',
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
  applyTags: [],
  extendTags: [],
  blackboard: { damage_resist: 0.3, param1: 0, protect_times: 1, sheild_cd: 18 },
  attributeModifiers: [],
  actionGraph: typhoeusBuff32ActionGraph,
};

const typhoeusBuff33ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff33: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 5,
  presentation: {
    visible: true,
    icon: 'endaxis:icons/icon_battle_buff_typhoea_sheild',
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
  blackboard: { damage_resist: -0.3, protect_times: 1 },
  attributeModifiers: [],
  damageModifiers: [
    {
      enabledSide: 'defender',
      processors: [
        {
          kind: 'damageScale',
          side: 'defender',
          zone: 'product',
          addition: { blackboardKey: 'damage_resist' },
        },
      ],
    },
  ],
  actionGraph: typhoeusBuff33ActionGraph,
};

const typhoeusBuff34ActionGraph = {
  main: {
    nodes: {
      startTimeDilation_1: {
        action: {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.3 },
            slot: 'unassigned',
            priority: 50,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: -0.00245398539,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0.333333343,
                },
                {
                  time: 0.8000001,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0.333333343,
                },
                {
                  time: 0.9975461,
                  value: 0.326683253,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343,
                  outWeight: 0.333333343,
                },
              ],
            },
            finishByAction: false,
            ignoredTargets: [],
          },
        },
        next: null,
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff34: SkillBuffDefinition = {
  stackingType: 'unlimited',
  priority: 0,
  maxStackCount: 5,
  durationSeconds: 0.1,
  applyTags: [],
  extendTags: [],
  blackboard: { protect_times: 1, sheild_cd: 18 },
  attributeModifiers: [],
  lifecycleSequences: { start: { $sequence: 'startTimeDilation_1' } },
  actionGraph: typhoeusBuff34ActionGraph,
};

const typhoeusBuff35ActionGraph = {
  main: {
    nodes: {
      spawnAbilityEntity_17: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'fixed', target: 'enemy' },
            abilityEntityId: 'abilityentity_chr_0034_typhoea_ultimateskill_arrowrain_sub',
            childSkillId: 'chr_0034_typhoea_ultimate_skill_arrowrain_sub2',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
        next: null,
      },
      spawnAbilityEntity_16: {
        action: {
          kind: 'spawnAbilityEntity',
          parameters: {
            bornAt: { kind: 'fixed', target: 'enemy' },
            abilityEntityId: 'abilityentity_chr_0034_typhoea_ultimateskill_arrowrain_sub',
            childSkillId: 'chr_0034_typhoea_ultimate_skill_arrowrain_sub1',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
        next: null,
      },
      checkCondition_15: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_2' } },
        },
        next: null,
      },
      ifElse_22: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_15' },
          whenTrue: { $sequence: 'spawnAbilityEntity_16' },
          whenFalse: { $sequence: 'spawnAbilityEntity_17' },
        },
        next: null,
      },
      applyBuff_20: {
        action: {
          kind: 'applyBuff',
          parameters: {
            buffs: [{ buffId: 'buff_chr_0034_typhoea_ultimate_skill_cause_subarrowrain_timer' }],
            targets: { kind: 'owner' },
            source: { kind: 'source' },
            inheritSourceSkillCastInfo: true,
          },
        },
        next: 'ifElse_22',
      },
      calculateActionValue_21: {
        action: {
          kind: 'calculateActionValue',
          parameters: {
            key: 'trigger_times',
            operation: 'add',
            left: { kind: 'valueNode', nodeId: 'data_3' },
            right: { kind: 'constant', value: 1 },
          },
        },
        next: 'applyBuff_20',
      },
      checkCondition_18: {
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
          condition: { $sequence: 'checkCondition_18' },
          whenTrue: { $sequence: 'calculateActionValue_21' },
          whenFalse: { $sequence: 'ifElse_22' },
        },
        next: null,
      },
      checkCondition_23: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_5' } },
        },
        next: null,
      },
      checkCondition_24: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
        },
        next: 'checkCondition_23',
      },
      ifElse_28: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_24' },
          whenTrue: { $sequence: 'ifElse_25' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      ifElse_30: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_15' },
          whenTrue: { $sequence: 'ifElse_25' },
          whenFalse: { $sequence: 'ifElse_28' },
        },
        next: null,
      },
      checkCondition_29: {
        action: {
          kind: 'checkCondition',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'data_7' } },
        },
        next: null,
      },
      ifElse_31: {
        action: {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition: { $sequence: 'checkCondition_29' },
          whenTrue: { $sequence: 'ifElse_30' },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
    },
    dataNodes: {
      data_1: {
        type: 'number',
        expression: { kind: 'blackboard', key: 'trigger_times', fallback: 0 },
      },
      data_2: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'less',
          right: { kind: 'constant', value: 5 },
        },
      },
      data_3: { type: 'number', expression: { kind: 'blackboard', key: 'trigger_times' } },
      data_4: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0034_typhoea_ultimate_skill_cause_subarrowrain_timer'],
          operator: 'equal',
          value: { kind: 'constant', value: 0 },
        },
      },
      data_5: {
        type: 'boolean',
        expression: {
          kind: 'buffIdStackCompare',
          target: 'buffOwner',
          buffIds: ['buff_chr_0034_typhoea_ultimate_skill_cause_subarrowrain_timer'],
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
        },
      },
      data_6: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'data_1' },
          operator: 'equal',
          right: { kind: 'constant', value: 5 },
        },
      },
      data_7: {
        type: 'boolean',
        expression: {
          kind: 'eventDamageGameplayTagsMatch',
          match: 'hasAny',
          tags: ['Damage/TyphoeaSkill/FloatingHit_Weak', 'Damage/TyphoeaSkill/FloatingHit_Heavy'],
        },
      },
    },
  },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff35: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  triggerIntervalSeconds: 0,
  waitFirstTriggerInterval: true,
  maxTriggerCount: 1,
  applyTags: [],
  extendTags: [],
  blackboard: {
    arrow_energy_given: 1,
    arrow_num_given: 2,
    atb: 10,
    atk_scale_center: 0.5,
    atk_scale_main: 1,
    atk_scale_outer: 0.1,
    is_floating_mode: 0,
    poise: 0,
    prama1: 0,
    trigger_times: 0,
  },
  attributeModifiers: [],
  abilityEventResponses: [
    { event: 'beforeOutputDamage', priority: 0, sequence: { $sequence: 'ifElse_31' } },
  ],
  actionGraph: typhoeusBuff35ActionGraph,
};

const typhoeusBuff36ActionGraph = {
  main: { nodes: {} },
  macros: {},
} as const satisfies ActionGraphResourceDefinition;

const typhoeusBuff36: SkillBuffDefinition = {
  stackingType: 'unique',
  priority: 0,
  maxStackCount: 999,
  durationSeconds: 0.2,
  applyTags: [],
  extendTags: [],
  blackboard: {
    arrow_energy_given: 1,
    arrow_num_given: 2,
    atb: 10,
    atk_scale_center: 0.5,
    atk_scale_main: 1,
    atk_scale_outer: 0.1,
    is_floating_mode: 0,
    poise: 0,
    prama1: 0,
    trigger_times: 0,
  },
  attributeModifiers: [],
  actionGraph: typhoeusBuff36ActionGraph,
};

export const typhoeus: OperatorDefinition = {
  slug: 'typhoeus',
  gameId: 'TYPHOEUS',
  rarity: 6,
  weaponType: 'funnel',
  element: 'nature',
  characterTypeId: 'Natural',
  role: 'striker',
  mainAttribute: 'agility',
  secondaryAttribute: 'will',
  attributes: {
    strength: [9, 28, 48, 68, 88, 97],
    agility: [21, 54, 88, 123, 157, 174],
    intellect: [10, 29, 49, 69, 89, 99],
    will: [14, 37, 60, 84, 107, 119],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  passiveUi: {
    kind: 'buffCounters',
    appearance: 'typhoeaArrows',
    reserveArrowBuffId: 'buff_chr_0034_typhoea_passive_arrowrecover_exitfight',
    battleArrowBuffId: 'buff_chr_0034_typhoea_normal_skill_arrow_num',
    pointBuffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy',
    maximumArrows: 4,
    maximumPoints: 8,
  },
  skillGroups: [
    {
      key: 'basicAttack',
      operationType: 'basicAttack',
      skills: [
        typhoeusChr_0034_typhoea_attack1,
        typhoeusChr_0034_typhoea_attack2,
        typhoeusChr_0034_typhoea_attack3,
        typhoeusChr_0034_typhoea_attack4,
        typhoeusChr_0034_typhoea_attack5,
      ],
    },
    {
      key: 'enhancedBasicAttack',
      operationType: 'basicAttack',
      nameKey: 'skillNames.floating',
      skills: [
        typhoeusChr_0034_typhoea_floating_attack1,
        typhoeusChr_0034_typhoea_floating_attack2,
        typhoeusChr_0034_typhoea_floating_attack3,
        typhoeusChr_0034_typhoea_floating_attack4,
        typhoeusChr_0034_typhoea_floating_attack5,
      ],
    },
    { key: 'finisher', operationType: 'finisher', skills: typhoeusChr_0034_typhoea_power_attack },
    {
      key: 'plungingAttack',
      operationType: 'plungingAttack',
      skills: typhoeusChr_0034_typhoea_plunging_attack_end,
    },
    {
      key: 'battleSkill',
      operationType: 'battleSkill',
      skills: typhoeusChr_0034_typhoea_normal_skill_floating_start,
      replacementSkills: [
        typhoeusChr_0034_typhoea_normal_skill_floating_loop,
        typhoeusChr_0034_typhoea_normal_skill_floating_end,
      ],
      replacementSkillPlacements: {
        chr_0034_typhoea_normal_skill_floating_loop: 'internal',
        chr_0034_typhoea_normal_skill_floating_end: 'internal',
      },
    },
    {
      key: 'comboSkill',
      operationType: 'comboSkill',
      skills: typhoeusChr_0034_typhoea_combo_skill,
    },
    {
      key: 'floatingComboSkill',
      operationType: 'comboSkill',
      nameKey: 'skillNames.floating',
      skills: typhoeusChr_0034_typhoea_combo_skillfloating,
    },
    {
      key: 'ultimate',
      operationType: 'ultimate',
      skills: typhoeusChr_0034_typhoea_ultimate_skillfloating,
    },
  ],
  dodgeSkill: typhoeusCommon_character_perfect_dodge,
  dashBuffs: [
    { buffId: 'buff_common_dash', blackboard: { dodgeSkillId: 'common_character_perfect_dodge' } },
  ],
  skillSlots: [
    {
      key: 'battleSkill',
      baseSkillKey: 'chr_0034_typhoea_normal_skill_floating_start',
      replacementSkillKeys: [],
    },
    {
      key: 'comboSkill',
      baseSkillKey: 'chr_0034_typhoea_combo_skill',
      replacementSkillKeys: ['chr_0034_typhoea_combo_skillfloating'],
    },
    {
      key: 'ultimate',
      baseSkillKey: 'chr_0034_typhoea_ultimate_skillfloating',
      replacementSkillKeys: [],
    },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'chr_0034_typhoea_attack1',
        'chr_0034_typhoea_attack2',
        'chr_0034_typhoea_attack3',
        'chr_0034_typhoea_attack4',
        'chr_0034_typhoea_attack5',
        'chr_0034_typhoea_power_attack',
        'chr_0034_typhoea_plunging_attack_end',
        'chr_0034_typhoea_floating_attack1',
        'chr_0034_typhoea_floating_attack2',
        'chr_0034_typhoea_floating_attack3',
        'chr_0034_typhoea_floating_attack4',
        'chr_0034_typhoea_floating_attack5',
      ],
      normalAttackSkillKeys: [
        'chr_0034_typhoea_attack1',
        'chr_0034_typhoea_attack2',
        'chr_0034_typhoea_attack3',
        'chr_0034_typhoea_attack4',
        'chr_0034_typhoea_attack5',
      ],
      defaultSkillKey: 'chr_0034_typhoea_attack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  playerActionModes: [
    {
      modeId: 'floating',
      modeLayer: 'floating',
      defaultEnabled: false,
      normalAttackSkillKeys: [
        'chr_0034_typhoea_floating_attack1',
        'chr_0034_typhoea_floating_attack2',
        'chr_0034_typhoea_floating_attack3',
        'chr_0034_typhoea_floating_attack4',
        'chr_0034_typhoea_floating_attack5',
      ],
      commandMappings: {
        basicAttack: { skillId: 'chr_0034_typhoea_floating_attack1' },
        comboSkill: { skillId: 'chr_0034_typhoea_combo_skillfloating' },
      },
    },
  ],
  comboSkillConditions: [typhoeusComboCondition1, typhoeusComboCondition2],
  comboSkillPriority: 'default',
  talents: [
    {
      levels: 3,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack1',
          blackboardKey: 'atk_scale_enhence',
          operation: 'assign',
          value: [1.2, 1.4, 1.6],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack2',
          blackboardKey: 'atk_scale_enhence',
          operation: 'assign',
          value: [1.2, 1.4, 1.6],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack3',
          blackboardKey: 'atk_scale_enhence',
          operation: 'assign',
          value: [1.2, 1.4, 1.6],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack4',
          blackboardKey: 'atk_scale_enhence',
          operation: 'assign',
          value: [1.2, 1.4, 1.6],
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack5',
          blackboardKey: 'atk_scale_enhence',
          operation: 'assign',
          value: [1.2, 1.4, 1.6],
        },
      ],
      attachedBuffs: [
        {
          buffId: 'buff_chr_0034_typhoea_passive_arrowrecover',
          blackboardAssignments: { arrow_recover_time: 3, energy_enterfight: [1, 2, 4] },
        },
      ],
    },
    {
      levels: 2,
      attachedBuffs: [
        {
          buffId: 'buff_chr_0034_typhoea_talent_linken_sphere',
          blackboardAssignments: { damage_resist: [0.15, 0.3], sheild_cd: [30, 18] },
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
          skillKey: 'chr_0034_typhoea_floating_attack1',
          blackboardKey: 'atk_scale_base',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack2',
          blackboardKey: 'atk_scale_base',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack3',
          blackboardKey: 'atk_scale_base',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack4',
          blackboardKey: 'atk_scale_base',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack5',
          blackboardKey: 'atk_scale_base',
          operation: 'multiply',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_normal_skill_floating_start',
          blackboardKey: 'potential_atkup',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_normal_skill_floating_start',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.18,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_ultimate_skillfloating',
          blackboardKey: 'potential_atkup',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_ultimate_skillfloating',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.18,
        },
      ],
      attachedBuffs: [
        {
          buffId: 'buff_chr_0034_typhoea_potential_decrease_sheildcd',
          blackboardAssignments: { decrease_cd: -3 },
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 20 },
        { kind: 'modifyBasePanelStat', stat: 'artsIntensity', operation: 'flat', value: 16 },
      ],
    },
    {
      levels: 1,
      modifiers: [
        { kind: 'addSkillCooldownFrames', skillKey: 'chr_0034_typhoea_combo_skill', frames: -60 },
        {
          kind: 'addSkillCooldownFrames',
          skillKey: 'chr_0034_typhoea_combo_skillfloating',
          frames: -60,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_combo_skill',
          blackboardKey: 'persistent_naturalburst_increase',
          operation: 'add',
          value: 0.06,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_combo_skillfloating',
          blackboardKey: 'persistent_naturalburst_increase',
          operation: 'add',
          value: 0.06,
        },
      ],
    },
    {
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillKey: 'chr_0034_typhoea_ultimate_skillfloating',
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
          skillKey: 'chr_0034_typhoea_ultimate_skillfloating',
          blackboardKey: 'arrow_num_given',
          operation: 'add',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack1',
          blackboardKey: 'potential_damage_rate',
          operation: 'assign',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack2',
          blackboardKey: 'potential_damage_rate',
          operation: 'assign',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack3',
          blackboardKey: 'potential_damage_rate',
          operation: 'assign',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack4',
          blackboardKey: 'potential_damage_rate',
          operation: 'assign',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_floating_attack5',
          blackboardKey: 'potential_damage_rate',
          operation: 'assign',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillKey: 'chr_0034_typhoea_ultimate_skillfloating',
          blackboardKey: 'potential_damge_up',
          operation: 'assign',
          value: 1.2,
        },
      ],
    },
  ],
  entityBlackboard: {
    EntityBB_can_trigger_combo: 1,
    EntityBB_can_use_floating_skill: 0,
    EntityBB_consumed_type: 0,
    EntityBB_floating_attack_index: 0,
    EntityBB_floating_attack_times: 0,
    EntityBB_heavyattack_atb_recover: 0,
    EntityBB_normalskill_hittimes: 0,
  },
  passiveSkills: [typhoeusPassive1, typhoeusPassive2],
  buffDefinitions: {
    buff_chr_0034_typhoea_attack_3_1_damagetaken: typhoeusBuff1,
    buff_chr_0034_typhoea_attack_3_2_damagetaken: typhoeusBuff2,
    buff_chr_0034_typhoea_attack_4_addtionalbattleshape_onenemy: typhoeusBuff3,
    buff_chr_0034_typhoea_attack_5_damagetaken: typhoeusBuff4,
    buff_chr_0034_typhoea_combo_enemy_debuff: typhoeusBuff5,
    buff_chr_0034_typhoea_combo_skill_arrow_hittimes: typhoeusBuff6,
    buff_chr_0034_typhoea_combo_skill_canusefloatingskill: typhoeusBuff7,
    buff_chr_0034_typhoea_common_arrowshow: typhoeusBuff8,
    buff_chr_0034_typhoea_common_func_arrowreload: typhoeusBuff9,
    buff_chr_0034_typhoea_floatingattack_damagetaken: typhoeusBuff10,
    buff_chr_0034_typhoea_floatingmode: typhoeusBuff11,
    buff_chr_0034_typhoea_floatingmode_blowoff_ccs: typhoeusBuff12,
    buff_chr_0034_typhoea_normal_attack5_atb_recovered: typhoeusBuff13,
    buff_chr_0034_typhoea_normal_skill_aimmedenemy_all: typhoeusBuff14,
    buff_chr_0034_typhoea_normal_skill_arrow_energy: typhoeusBuff15,
    buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_1: typhoeusBuff16,
    buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_2: typhoeusBuff17,
    buff_chr_0034_typhoea_normal_skill_arrow_energy_buffer_3: typhoeusBuff18,
    buff_chr_0034_typhoea_normal_skill_arrow_num: typhoeusBuff19,
    buff_chr_0034_typhoea_normal_skill_hitstop: typhoeusBuff20,
    buff_chr_0034_typhoea_normal_skill_targetfind: typhoeusBuff21,
    buff_chr_0034_typhoea_normal_start_hittimes: typhoeusBuff22,
    buff_chr_0034_typhoea_passitive_enemy_listennaturalspellbrust: typhoeusBuff23,
    buff_chr_0034_typhoea_passive: typhoeusBuff24,
    buff_chr_0034_typhoea_passive_arrowrecover: typhoeusBuff25,
    buff_chr_0034_typhoea_passive_arrowrecover_exitfight: typhoeusBuff26,
    buff_chr_0034_typhoea_passive_increase_attackrange: typhoeusBuff27,
    buff_chr_0034_typhoea_potential_atkup: typhoeusBuff28,
    buff_chr_0034_typhoea_potential_decrease_sheildcd: typhoeusBuff29,
    buff_chr_0034_typhoea_power_attack_maintarget: typhoeusBuff30,
    buff_chr_0034_typhoea_talent_linken_sphere: typhoeusBuff31,
    buff_chr_0034_typhoea_talent_linken_sphere_cd: typhoeusBuff32,
    buff_chr_0034_typhoea_talent_linken_sphere_enable: typhoeusBuff33,
    buff_chr_0034_typhoea_talent_linken_sphere_superarmour: typhoeusBuff34,
    buff_chr_0034_typhoea_ultimate_skill_cause_subarrowrain: typhoeusBuff35,
    buff_chr_0034_typhoea_ultimate_skill_cause_subarrowrain_timer: typhoeusBuff36,
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0034_typhoea_arrow: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'limited', durationSeconds: 3 },
      maxStackingCount: 1,
      childSkill: {
        actionGraph: { main: { nodes: {} }, macros: {} },
        skillId: 'chr_0034_typhoea_attack_deadarrow',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 4,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: { atb: 0, atk_scale: 0, duration: 0, hit_index: 0 },
        scheduledSequences: [],
      },
    },
    abilityentity_chr_0034_typhoea_combo_presistdamage: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'limited', durationSeconds: 10 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0034_typhoea_combo_persistentdamage',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 180,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: {
          atb: 0,
          atk_scale: 0,
          atk_scale_persistent: 0,
          hit_index: 0,
          naturalinflect_stack: 0,
          persistent_naturalburst_increase: 0,
          persistent_slow: 0,
          persistent_time: 0,
          recover_bufftime: 12,
          usp: 0,
        },
        scheduledSequences: [
          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'calculateActionValue_1' } },
          { startFrame: 0, endFrame: 180, sequence: { $sequence: 'repeatEachTick_3' } },
          { startFrame: 0, endFrame: 180, sequence: { $sequence: 'aura_4' } },
        ],
        actionGraph: {
          main: {
            nodes: {
              calculateActionValue_1: {
                action: {
                  kind: 'calculateActionValue',
                  parameters: {
                    key: 'atk_scale_persistent',
                    operation: 'divide',
                    left: { kind: 'valueNode', nodeId: 'data_1' },
                    right: { kind: 'constant', value: 18 },
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
                  },
                  key: 'abilityentity_chr_0034_typhoea_combo_presistdamage:chr_0034_typhoea_combo_persistentdamage:/childSkill/actionGraph/main/nodes/dealDamage_2/action',
                },
                next: null,
              },
              repeatEachTick_3: {
                action: {
                  kind: 'repeatEachTick',
                  parameters: {
                    nativeChanneling: {
                      target: { kind: 'fixed', target: 'enemy' },
                      executeEachFrame: true,
                      triggerIntervalSeconds: 0.3333333,
                      maxCountPerTarget: 18,
                      targetTriggerIntervalSeconds: 0.33,
                    },
                  },
                  body: { $sequence: 'dealDamage_2' },
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
                        buffId: 'buff_chr_0034_typhoea_combo_enemy_debuff',
                        blackboardAssignments: {
                          damage_up: { kind: 'valueNode', nodeId: 'data_2' },
                          slow_down: { kind: 'valueNode', nodeId: 'data_3' },
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
              data_1: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_persistent' },
              },
              data_2: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'persistent_naturalburst_increase' },
              },
              data_3: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'persistent_slow' },
              },
            },
          },
          macros: {},
        },
      },
      presentation: {
        icon: 'endaxis:operators/typhoeus/combo_01',
        nameKey: 'effects.name.barrageArray',
        placement: 'enemy',
      },
    },
    abilityentity_chr_0034_typhoea_ultimateskill_arrowrain: {
      bornTags: [
        'SelectCategory/Unmarkable',
        'Immune/Damage',
        'Skill/Character/chr_0034_typhoea/ArrowRain_Main',
      ],
      lifetime: { kind: 'limited', durationSeconds: 10 },
      maxStackingCount: 1,
      childSkill: {
        actionGraph: {
          main: {
            nodes: {
              modifyActionValue_1: {
                action: {
                  kind: 'modifyActionValue',
                  parameters: {
                    key: 'is_floating_mode',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
                  },
                },
                next: null,
              },
              checkCondition_2: {
                action: {
                  kind: 'checkCondition',
                  parameters: { condition: { kind: 'conditionNode', nodeId: 'data_1' } },
                },
                next: 'modifyActionValue_1',
              },
              calculateActionValue_3: {
                action: {
                  kind: 'calculateActionValue',
                  parameters: {
                    key: 'atk_scale_outer',
                    operation: 'multiply',
                    left: { kind: 'valueNode', nodeId: 'data_2' },
                    right: { kind: 'valueNode', nodeId: 'data_3' },
                  },
                },
                next: null,
              },
              calculateActionValue_4: {
                action: {
                  kind: 'calculateActionValue',
                  parameters: {
                    key: 'atk_scale_center',
                    operation: 'multiply',
                    left: { kind: 'valueNode', nodeId: 'data_4' },
                    right: { kind: 'valueNode', nodeId: 'data_3' },
                  },
                },
                next: 'calculateActionValue_3',
              },
              calculateActionValue_5: {
                action: {
                  kind: 'calculateActionValue',
                  parameters: {
                    key: 'atk_scale_main',
                    operation: 'multiply',
                    left: { kind: 'valueNode', nodeId: 'data_5' },
                    right: { kind: 'valueNode', nodeId: 'data_3' },
                  },
                },
                next: 'calculateActionValue_4',
              },
              dealDamage_6: {
                action: {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'nature',
                    attackScale: { kind: 'valueNode', nodeId: 'data_5' },
                    tags: ['ultimateSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'valueNode', nodeId: 'data_6' },
                  },
                  key: 'abilityentity_chr_0034_typhoea_ultimateskill_arrowrain:chr_0034_typhoea_ultimate_skill_arrowrain:/childSkill/actionGraph/main/nodes/dealDamage_6/action',
                },
                next: null,
              },
              forEachContextTarget_7: {
                action: {
                  kind: 'forEachContextTarget',
                  parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                  body: { $sequence: 'dealDamage_6' },
                },
                next: null,
              },
              applyBuff_8: {
                action: {
                  kind: 'applyBuff',
                  parameters: {
                    buffs: [
                      {
                        buffId: 'buff_chr_0034_typhoea_ultimate_skill_cause_subarrowrain',
                        copiedBlackboardAssignments: {
                          atk_scale_center: 'atk_scale_center',
                          atk_scale_main: 'atk_scale_main',
                          atk_scale_outer: 'atk_scale_outer',
                        },
                      },
                    ],
                    targets: { kind: 'source' },
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
                type: 'boolean',
                expression: {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0034_typhoea_floatingmode'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              },
              data_2: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_outer' },
              },
              data_3: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'potential_damge_up' },
              },
              data_4: {
                type: 'number',
                expression: { kind: 'blackboard', key: 'atk_scale_center' },
              },
              data_5: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_main' } },
              data_6: { type: 'number', expression: { kind: 'blackboard', key: 'poise' } },
            },
          },
          macros: {},
        },
        skillId: 'chr_0034_typhoea_ultimate_skill_arrowrain',
        nativeSkillType: 'normalSkill',
        naturalDurationFrames: 600,
        castResource: {
          costFrame: 0,
          cooldownSeconds: 0,
          maxChargeTime: 1,
          cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
        },
        blackboard: {
          arrow_energy_given: 1,
          arrow_num_given: 2,
          atb: 10,
          atk_scale_center: 0.5,
          atk_scale_main: 1,
          atk_scale_outer: 0.1,
          is_floating_mode: 0,
          poise: 0,
          potential_damge_up: 1,
          prama1: 0,
        },
        scheduledSequences: [
          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'checkCondition_2' } },
          { startFrame: 0, endFrame: 3, sequence: { $sequence: 'calculateActionValue_5' } },
          { startFrame: 1, endFrame: 3, sequence: { $sequence: 'forEachContextTarget_7' } },
          { startFrame: 0, endFrame: 600, sequence: { $sequence: 'applyBuff_8' } },
        ],
      },
    },
    abilityentity_chr_0034_typhoea_ultimateskill_arrowrain_sub: {
      bornTags: ['SelectCategory/Unmarkable', 'Immune/Damage'],
      lifetime: { kind: 'limited', durationSeconds: 3 },
      maxStackingCount: 1,
      childSkills: {
        chr_0034_typhoea_ultimate_skill_arrowrain_sub1: {
          actionGraph: {
            main: {
              nodes: {
                calculateActionValue_1: {
                  action: {
                    kind: 'calculateActionValue',
                    parameters: {
                      key: 'atk_scale_outer',
                      operation: 'divide',
                      left: { kind: 'valueNode', nodeId: 'data_1' },
                      right: { kind: 'constant', value: 3 },
                    },
                  },
                  next: null,
                },
                calculateActionValue_2: {
                  action: {
                    kind: 'calculateActionValue',
                    parameters: {
                      key: 'atk_scale_center',
                      operation: 'divide',
                      left: { kind: 'valueNode', nodeId: 'data_2' },
                      right: { kind: 'constant', value: 3 },
                    },
                  },
                  next: 'calculateActionValue_1',
                },
                dealDamage_3: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'nature',
                      attackScale: { kind: 'valueNode', nodeId: 'data_1' },
                      tags: ['ultimateSkill'],
                    },
                    key: 'abilityentity_chr_0034_typhoea_ultimateskill_arrowrain_sub:chr_0034_typhoea_ultimate_skill_arrowrain_sub1|chr_0034_typhoea_ultimate_skill_arrowrain_sub2:/childSkills/chr_0034_typhoea_ultimate_skill_arrowrain_sub1/actionGraph/main/nodes/dealDamage_3/action',
                  },
                  next: null,
                },
                repeatEachTick_4: {
                  action: {
                    kind: 'repeatEachTick',
                    parameters: {
                      nativeChanneling: {
                        target: { kind: 'fixed', target: 'enemy' },
                        executeEachFrame: true,
                        triggerIntervalSeconds: 0.033,
                        maxCountPerTarget: 3,
                        targetTriggerIntervalSeconds: 0.1,
                      },
                    },
                    body: { $sequence: 'dealDamage_3' },
                  },
                  next: null,
                },
                finishOwner_5: {
                  action: {
                    kind: 'finishOwner',
                    parameters: { targets: { kind: 'context', key: 'tar' } },
                  },
                  next: null,
                },
                findOwnerSpawnedAbilityEntities_6: {
                  action: {
                    kind: 'findOwnerSpawnedAbilityEntities',
                    parameters: {
                      saveToContextKey: 'tar',
                      abilityEntityIds: ['abilityentity_chr_0034_typhoea_ultimateskill_arrowrain'],
                    },
                  },
                  next: 'finishOwner_5',
                },
                checkCondition_7: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_4' } },
                  },
                  next: 'findOwnerSpawnedAbilityEntities_6',
                },
              },
              dataNodes: {
                data_1: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_outer' },
                },
                data_2: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_center' },
                },
                data_3: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'trigger_times', fallback: 0 },
                },
                data_4: {
                  type: 'boolean',
                  expression: {
                    kind: 'actionValueCompare',
                    left: { kind: 'valueNode', nodeId: 'data_3' },
                    operator: 'greaterOrEqual',
                    right: { kind: 'constant', value: 5 },
                  },
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0034_typhoea_ultimate_skill_arrowrain_sub1',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 15,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: {
            arrow_energy_given: 1,
            arrow_num_given: 2,
            atb: 10,
            atk_scale_center: 0.5,
            atk_scale_main: 1,
            atk_scale_outer: 0.1,
            is_floating_mode: 0,
            poise: 0,
            prama1: 0,
            trigger_times: 0,
          },
          scheduledSequences: [
            { startFrame: 0, endFrame: 2, sequence: { $sequence: 'calculateActionValue_2' } },
            { startFrame: 6, endFrame: 15, sequence: { $sequence: 'repeatEachTick_4' } },
            { startFrame: 14, endFrame: 15, sequence: { $sequence: 'checkCondition_7' } },
          ],
        },
        chr_0034_typhoea_ultimate_skill_arrowrain_sub2: {
          actionGraph: {
            main: {
              nodes: {
                calculateActionValue_1: {
                  action: {
                    kind: 'calculateActionValue',
                    parameters: {
                      key: 'atk_scale_outer',
                      operation: 'divide',
                      left: { kind: 'valueNode', nodeId: 'data_1' },
                      right: { kind: 'constant', value: 5 },
                    },
                  },
                  next: null,
                },
                calculateActionValue_2: {
                  action: {
                    kind: 'calculateActionValue',
                    parameters: {
                      key: 'atk_scale_center',
                      operation: 'divide',
                      left: { kind: 'valueNode', nodeId: 'data_2' },
                      right: { kind: 'constant', value: 3 },
                    },
                  },
                  next: 'calculateActionValue_1',
                },
                calculateActionValue_3: {
                  action: {
                    kind: 'calculateActionValue',
                    parameters: {
                      key: 'atk_scale_2',
                      operation: 'multiply',
                      left: { kind: 'valueNode', nodeId: 'data_2' },
                      right: { kind: 'constant', value: 0.08 },
                    },
                  },
                  next: 'calculateActionValue_2',
                },
                calculateActionValue_4: {
                  action: {
                    kind: 'calculateActionValue',
                    parameters: {
                      key: 'atk_scale_1',
                      operation: 'multiply',
                      left: { kind: 'valueNode', nodeId: 'data_2' },
                      right: { kind: 'constant', value: 0.6 },
                    },
                  },
                  next: 'calculateActionValue_3',
                },
                dealDamage_5: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'nature',
                      attackScale: { kind: 'valueNode', nodeId: 'data_3' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                    },
                    key: 'abilityentity_chr_0034_typhoea_ultimateskill_arrowrain_sub:chr_0034_typhoea_ultimate_skill_arrowrain_sub1|chr_0034_typhoea_ultimate_skill_arrowrain_sub2:/childSkills/chr_0034_typhoea_ultimate_skill_arrowrain_sub2/actionGraph/main/nodes/dealDamage_5/action',
                  },
                  next: null,
                },
                repeatEachTick_6: {
                  action: {
                    kind: 'repeatEachTick',
                    parameters: {
                      nativeChanneling: {
                        target: { kind: 'fixed', target: 'enemy' },
                        executeEachFrame: true,
                        triggerIntervalSeconds: 0.033,
                        maxCountPerTarget: 5,
                        targetTriggerIntervalSeconds: 0.06,
                      },
                    },
                    body: { $sequence: 'dealDamage_5' },
                  },
                  next: null,
                },
                dealDamage_7: {
                  action: {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'nature',
                      attackScale: { kind: 'valueNode', nodeId: 'data_4' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                    },
                    key: 'abilityentity_chr_0034_typhoea_ultimateskill_arrowrain_sub:chr_0034_typhoea_ultimate_skill_arrowrain_sub1|chr_0034_typhoea_ultimate_skill_arrowrain_sub2:/childSkills/chr_0034_typhoea_ultimate_skill_arrowrain_sub2/actionGraph/main/nodes/dealDamage_7/action',
                  },
                  next: null,
                },
                repeatEachTick_8: {
                  action: {
                    kind: 'repeatEachTick',
                    parameters: {
                      nativeChanneling: {
                        target: { kind: 'fixed', target: 'enemy' },
                        executeEachFrame: true,
                        triggerIntervalSeconds: 0.033,
                        maxCountPerTarget: 1,
                        targetTriggerIntervalSeconds: 0.03333,
                      },
                    },
                    body: { $sequence: 'dealDamage_7' },
                  },
                  next: null,
                },
                finishOwner_9: {
                  action: {
                    kind: 'finishOwner',
                    parameters: { targets: { kind: 'fixed', target: 'enemy' } },
                  },
                  next: null,
                },
                findOwnerSpawnedAbilityEntities_10: {
                  action: {
                    kind: 'findOwnerSpawnedAbilityEntities',
                    parameters: {
                      saveToContextKey: 'tar',
                      abilityEntityIds: ['abilityentity_chr_0034_typhoea_ultimateskill_arrowrain'],
                    },
                  },
                  next: 'finishOwner_9',
                },
                checkCondition_11: {
                  action: {
                    kind: 'checkCondition',
                    parameters: { condition: { kind: 'conditionNode', nodeId: 'data_6' } },
                  },
                  next: 'findOwnerSpawnedAbilityEntities_10',
                },
              },
              dataNodes: {
                data_1: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_outer' },
                },
                data_2: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'atk_scale_center' },
                },
                data_3: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_2' } },
                data_4: { type: 'number', expression: { kind: 'blackboard', key: 'atk_scale_1' } },
                data_5: {
                  type: 'number',
                  expression: { kind: 'blackboard', key: 'trigger_times', fallback: 0 },
                },
                data_6: {
                  type: 'boolean',
                  expression: {
                    kind: 'actionValueCompare',
                    left: { kind: 'valueNode', nodeId: 'data_5' },
                    operator: 'greaterOrEqual',
                    right: { kind: 'constant', value: 5 },
                  },
                },
              },
            },
            macros: {},
          },
          skillId: 'chr_0034_typhoea_ultimate_skill_arrowrain_sub2',
          nativeSkillType: 'normalSkill',
          naturalDurationFrames: 50,
          castResource: {
            costFrame: 0,
            cooldownSeconds: 0,
            maxChargeTime: 1,
            cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
          },
          blackboard: {
            arrow_energy_given: 1,
            arrow_num_given: 2,
            atb: 10,
            atk_scale_1: 0,
            atk_scale_2: 0,
            atk_scale_center: 0.5,
            atk_scale_main: 1,
            atk_scale_outer: 0.1,
            is_floating_mode: 0,
            poise: 0,
            prama1: 0,
            trigger_times: 0,
          },
          scheduledSequences: [
            { startFrame: 0, endFrame: 2, sequence: { $sequence: 'calculateActionValue_4' } },
            { startFrame: 6, endFrame: 21, sequence: { $sequence: 'repeatEachTick_6' } },
            { startFrame: 30, endFrame: 33, sequence: { $sequence: 'repeatEachTick_8' } },
            { startFrame: 49, endFrame: 50, sequence: { $sequence: 'checkCondition_11' } },
          ],
        },
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;

export default typhoeus;
