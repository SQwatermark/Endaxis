/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const supplementalBuffDefinitions = {} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
  "key": "basicAttack3",
  "sourceSkillId": "chr_0012_avywen_attack3",
  "blackboard": {
    "atb": 0,
    "atk_scale": [
      0.21,
      0.23,
      0.25,
      0.27,
      0.29,
      0.31,
      0.33,
      0.35,
      0.37,
      0.39,
      0.43,
      0.46
    ]
  },
  "timelineBlockFrames": 10,
  "costFrame": 12,
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
