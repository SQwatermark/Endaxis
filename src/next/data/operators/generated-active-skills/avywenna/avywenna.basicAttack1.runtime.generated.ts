/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const supplementalBuffDefinitions = {} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
  "key": "basicAttack1",
  "sourceSkillId": "chr_0012_avywen_attack1",
  "blackboard": {
    "atb": 0,
    "atk_scale": [
      0.17,
      0.18,
      0.2,
      0.21,
      0.23,
      0.25,
      0.26,
      0.28,
      0.3,
      0.32,
      0.34,
      0.37
    ]
  },
  "timelineBlockFrames": 8,
  "costFrame": 9,
  "scheduledSequences": [
    {
      "startFrame": 7,
      "endFrame": 8,
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
                      "value": 0.06
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
