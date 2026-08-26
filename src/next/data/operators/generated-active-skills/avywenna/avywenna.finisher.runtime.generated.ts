/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const supplementalBuffDefinitions = {} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
  "key": "finisher",
  "sourceSkillId": "chr_0012_avywen_power_attack",
  "blackboard": {
    "atk_scale": [
      4,
      4.4,
      4.8,
      5.2,
      5.6,
      6,
      6.4,
      6.8,
      7.2,
      7.7,
      8.3,
      9
    ]
  },
  "timelineBlockFrames": 29,
  "costFrame": 0,
  "scheduledSequences": [
    {
      "startFrame": 27,
      "endFrame": 28,
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
              "calculation": "breakingAttack",
              "calculationMultiplier": 0.3,
              "tags": [
                "normalAttack",
                "powerAttack"
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
                  "kind": "gainFinisherSp",
                  "parameters": {
                    "factor": 1,
                    "recipient": "team"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "startFrame": 28,
      "endFrame": 29,
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
              "calculation": "breakingAttack",
              "calculationMultiplier": 0.2,
              "tags": [
                "normalAttack",
                "powerAttack"
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
                      "value": 0.1
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
                  "kind": "changeResourceByActionValue",
                  "parameters": {
                    "resource": "sp",
                    "amount": {
                      "kind": "constant",
                      "value": 0
                    },
                    "coefficient": {
                      "kind": "constant",
                      "value": 1
                    },
                    "recipient": "team",
                    "spGainKind": "gain",
                    "spGainSource": "default"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "startFrame": 29,
      "endFrame": 30,
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
              "calculation": "breakingAttack",
              "calculationMultiplier": 0.5,
              "tags": [
                "normalAttack",
                "powerAttack"
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
                      "value": 0.5
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
                  "kind": "changeResourceByActionValue",
                  "parameters": {
                    "resource": "sp",
                    "amount": {
                      "kind": "constant",
                      "value": 0
                    },
                    "coefficient": {
                      "kind": "constant",
                      "value": 1
                    },
                    "recipient": "team",
                    "spGainKind": "gain",
                    "spGainSource": "default"
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
      "endFrame": 44,
      "sequence": {
        "steps": [
          {
            "kind": "applyBuff",
            "parameters": {
              "buffId": "buff_common_full_immune_medium",
              "target": "caster",
              "inheritSourceSkillCastInfo": true,
              "finishByAction": true
            }
          }
        ]
      }
    },
    {
      "startFrame": 0,
      "endFrame": 29,
      "sequence": {
        "steps": [
          {
            "kind": "applyBuff",
            "parameters": {
              "buffId": "buff_common_power_attack_disable_cast_skill",
              "target": "caster",
              "inheritSourceSkillCastInfo": true,
              "finishByAction": true
            }
          }
        ]
      }
    }
  ]
} as const satisfies SkillDefinition;
