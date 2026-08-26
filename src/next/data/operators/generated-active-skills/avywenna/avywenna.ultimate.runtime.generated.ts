/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const supplementalBuffDefinitions = {} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
  "key": "ultimate",
  "sourceSkillId": "chr_0012_avywen_ultimate_skill",
  "blackboard": {
    "atk_scale": [
      4.22,
      4.64,
      5.07,
      5.49,
      5.91,
      6.33,
      6.75,
      7.18,
      7.6,
      8.13,
      8.76,
      9.5
    ],
    "atk_scale_ulti_lance_back": 1,
    "poise": [
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      20,
      20,
      20
    ],
    "poise_lance": 0,
    "potential_2": 0,
    "pulse_vul_duration": 0,
    "pulse_vul_rate": 0,
    "radius": 5,
    "talent0_usp": 0,
    "lance_duration_ult": 30,
    "pulse_resist_down_duration": [
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      6,
      7,
      8
    ],
    "pulse_resist_down_rate": [
      0.3,
      0.32,
      0.32,
      0.32,
      0.32,
      0.34,
      0.34,
      0.34,
      0.34,
      0.36,
      0.38,
      0.4
    ]
  },
  "timelineBlockFrames": 57,
  "costFrame": 0,
  "scheduledSequences": [
    {
      "startFrame": 0,
      "endFrame": 30,
      "sequence": {
        "steps": [
          {
            "kind": "startTimeDilation",
            "parameters": {
              "scope": "entity",
              "durationSeconds": {
                "kind": "constant",
                "value": 1
              },
              "slot": 1464849466,
              "priority": 10,
              "curve": {
                "kind": "named",
                "key": "RESETto1"
              },
              "finishByAction": false,
              "targets": [
                "caster"
              ]
            }
          }
        ]
      }
    },
    {
      "startFrame": 0,
      "endFrame": 45,
      "sequence": {
        "steps": [
          {
            "kind": "startUltimateTimeDilation",
            "parameters": {
              "priority": 100,
              "targetScale": {
                "kind": "constant",
                "value": 0
              },
              "ignoredTargets": []
            }
          }
        ]
      }
    },
    {
      "startFrame": 45,
      "endFrame": 48,
      "sequence": {
        "steps": [
          {
            "kind": "withActionBlackboardScope",
            "parameters": {
              "scopeKey": "SkillData.chr_0012_avywen_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:projectile_chr_0012_avywen_ultimate_skill_lance_out",
              "lifetime": "execution",
              "initialValues": {},
              "inheritParent": true
            },
            "body": {
              "steps": [
                {
                  "kind": "withActionBlackboardScope",
                  "parameters": {
                    "scopeKey": "SkillData.chr_0012_avywen_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:chr_0012_avywen_ultimate_skill_lance_gene",
                    "lifetime": "execution",
                    "alwaysNext": true,
                    "initialValues": {
                      "atk_scale_ulti_lance_back": 0,
                      "potential_2": 0,
                      "radius": 4,
                      "talent_atb_gain_ulti": 0
                    },
                    "inheritParent": true
                  },
                  "body": {
                    "steps": [
                      {
                        "kind": "spawnAbilityEntity",
                        "parameters": {
                          "abilityEntityId": "abilityentity_chr_0012_avywen_ultimate_skill",
                          "inheritActionBlackboard": true,
                          "dieWhenSourceDies": false
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "startFrame": 51,
      "endFrame": 54,
      "sequence": {
        "steps": [
          {
            "kind": "conditional",
            "parameters": {
              "condition": {
                "kind": "actionValueCompare",
                "left": {
                  "kind": "blackboard",
                  "key": "pulse_vul_duration"
                },
                "operator": "greater",
                "right": {
                  "kind": "constant",
                  "value": 0
                }
              },
              "alwaysNext": true
            },
            "whenTrue": {
              "steps": [
                {
                  "kind": "applyBuff",
                  "parameters": {
                    "buffId": "buff_chr_0012_avywen_ultimate_skill_debuff",
                    "target": "enemy",
                    "inheritSourceSkillCastInfo": true,
                    "blackboardAssignments": {
                      "pulse_vul_rate": {
                        "kind": "blackboard",
                        "key": "pulse_vul_rate"
                      },
                      "pulse_vul_duration": {
                        "kind": "blackboard",
                        "key": "pulse_vul_duration"
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            "kind": "dealDamage",
            "parameters": {
              "damageType": "electric",
              "attackScale": {
                "kind": "blackboard",
                "key": "atk_scale"
              },
              "tags": [
                "ultimateSkill"
              ],
              "features": [
                "canBreakWeakness"
              ],
              "stagger": {
                "kind": "blackboard",
                "key": "poise"
              }
            }
          },
          {
            "kind": "conditional",
            "parameters": {
              "condition": {
                "kind": "buffIdStackCompare",
                "target": "caster",
                "buffIds": [
                  "buff_chr_0012_avywen_talent_0"
                ],
                "operator": "greaterOrEqual",
                "value": {
                  "kind": "constant",
                  "value": 1
                }
              }
            },
            "whenTrue": {
              "steps": [
                {
                  "kind": "changeResourceByActionValue",
                  "parameters": {
                    "resource": "ultimateEnergy",
                    "amount": {
                      "kind": "blackboard",
                      "key": "talent0_usp"
                    },
                    "coefficient": {
                      "kind": "constant",
                      "value": 1
                    },
                    "recipient": "caster"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "startFrame": 0,
      "endFrame": 65,
      "sequence": {
        "steps": [
          {
            "kind": "applyBuff",
            "parameters": {
              "buffId": "buff_common_damage_immune_ult_skill",
              "target": "caster",
              "inheritSourceSkillCastInfo": true,
              "finishByAction": true
            }
          }
        ]
      }
    }
  ],
  "cooldownFrames": 300,
  "costs": [
    {
      "resource": "ultimateEnergy",
      "value": 100
    }
  ]
} as const satisfies SkillDefinition;
