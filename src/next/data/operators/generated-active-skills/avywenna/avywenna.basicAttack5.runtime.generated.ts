/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const supplementalBuffDefinitions = {} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
  "key": "basicAttack5",
  "sourceSkillId": "chr_0012_avywen_attack5",
  "blackboard": {
    "atb": 19,
    "atk_scale": [
      0.5,
      0.55,
      0.6,
      0.65,
      0.7,
      0.75,
      0.8,
      0.85,
      0.9,
      0.96,
      1.04,
      1.13
    ],
    "poise": 17
  },
  "timelineBlockFrames": 45,
  "costFrame": 12,
  "scheduledSequences": [
    {
      "startFrame": 24,
      "endFrame": 25,
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
                "normalAttack",
                "normalAttackLastCombo"
              ],
              "stagger": {
                "kind": "blackboard",
                "key": "poise"
              },
              "staggerOnlyWhenCasterControlled": true
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
                      "value": 0.3
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
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "constant",
                        "value": 1
                      },
                      "operator": "greaterOrEqual",
                      "right": {
                        "kind": "constant",
                        "value": 1
                      }
                    },
                    "alwaysNext": true
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
                            "value": 1
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
