/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const supplementalBuffDefinitions = {} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
  "key": "plungingAttack",
  "sourceSkillId": "chr_0012_avywen_plunging_attack_end",
  "blackboard": {
    "atb": 0,
    "atk_scale": [
      0.8,
      0.88,
      0.96,
      1.04,
      1.12,
      1.2,
      1.28,
      1.36,
      1.44,
      1.54,
      1.66,
      1.8
    ]
  },
  "timelineBlockFrames": 11,
  "costFrame": 0,
  "scheduledSequences": [
    {
      "startFrame": 1,
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
                "normalAttack",
                "plungingAttack"
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
