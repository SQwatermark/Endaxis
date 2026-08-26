/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const supplementalBuffDefinitions = {} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
  "key": "basicAttack4",
  "sourceSkillId": "chr_0012_avywen_attack4",
  "blackboard": {
    "atb": 0,
    "atk_scale": [
      0.1,
      0.11,
      0.12,
      0.13,
      0.14,
      0.15,
      0.16,
      0.17,
      0.18,
      0.19,
      0.21,
      0.23
    ],
    "atk_scale_2": [
      0.2,
      0.22,
      0.24,
      0.26,
      0.28,
      0.3,
      0.32,
      0.34,
      0.36,
      0.39,
      0.42,
      0.45
    ],
    "display_atk_scale": [
      0.3,
      0.33,
      0.36,
      0.39,
      0.42,
      0.45,
      0.48,
      0.51,
      0.54,
      0.58,
      0.62,
      0.68
    ]
  },
  "timelineBlockFrames": 22,
  "costFrame": 8,
  "scheduledSequences": [
    {
      "startFrame": 5,
      "endFrame": 6,
      "sequence": {
        "steps": [
          {
            "kind": "dealDamage",
            "parameters": {
              "damageType": "physical",
              "attackScale": {
                "kind": "blackboard",
                "key": "atk_scale"
              },
              "tags": [
                "normalAttack"
              ]
            }
          },
          {
            "kind": "conditional",
            "parameters": {
              "condition": {
                "kind": "casterControlled"
              },
              "alwaysNext": true
            },
            "whenTrue": {
              "steps": [
                {
                  "kind": "startTimeDilation",
                  "parameters": {
                    "scope": "entity",
                    "durationSeconds": {
                      "kind": "constant",
                      "value": 0.05
                    },
                    "slot": 1464849466,
                    "priority": 10,
                    "curve": {
                      "kind": "named",
                      "key": "char_normal_attack"
                    },
                    "finishByAction": false,
                    "targets": [
                      "enemy",
                      "caster"
                    ]
                  }
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "casterControlled"
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "changeResourceByActionValue",
                        "parameters": {
                          "resource": "sp",
                          "amount": {
                            "kind": "blackboard",
                            "key": "atb"
                          },
                          "coefficient": {
                            "kind": "constant",
                            "value": 0.5
                          },
                          "recipient": "team",
                          "spGainKind": "gain",
                          "spGainSource": "normalAttack"
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
      "startFrame": 18,
      "endFrame": 19,
      "sequence": {
        "steps": [
          {
            "kind": "dealDamage",
            "parameters": {
              "damageType": "physical",
              "attackScale": {
                "kind": "blackboard",
                "key": "atk_scale_2"
              },
              "tags": [
                "normalAttack"
              ]
            }
          },
          {
            "kind": "conditional",
            "parameters": {
              "condition": {
                "kind": "casterControlled"
              },
              "alwaysNext": true
            },
            "whenTrue": {
              "steps": [
                {
                  "kind": "startTimeDilation",
                  "parameters": {
                    "scope": "entity",
                    "durationSeconds": {
                      "kind": "constant",
                      "value": 0.22
                    },
                    "slot": 1464849466,
                    "priority": 10,
                    "curve": {
                      "kind": "named",
                      "key": "char_hard_stop"
                    },
                    "finishByAction": false,
                    "targets": [
                      "enemy",
                      "caster"
                    ]
                  }
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "casterControlled"
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "changeResourceByActionValue",
                        "parameters": {
                          "resource": "sp",
                          "amount": {
                            "kind": "blackboard",
                            "key": "atb"
                          },
                          "coefficient": {
                            "kind": "constant",
                            "value": 0.5
                          },
                          "recipient": "team",
                          "spGainKind": "gain",
                          "spGainSource": "normalAttack"
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
    }
  ]
} as const satisfies SkillDefinition;
