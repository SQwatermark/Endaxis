/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const supplementalBuffDefinitions = {} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
  "key": "comboSkill",
  "sourceSkillId": "chr_0012_avywen_combo_skill",
  "blackboard": {
    "atk_scale": [
      1.69,
      1.86,
      2.03,
      2.19,
      2.36,
      2.53,
      2.7,
      2.87,
      3.04,
      3.25,
      3.5,
      3.8
    ],
    "atk_scale_lance_back": 1,
    "poise": 10,
    "poise_lance": 0,
    "potential_2": 0,
    "radius": 4,
    "talent0_usp": 0,
    "usp": 10,
    "lance_duration": 30
  },
  "timelineBlockFrames": 21,
  "costFrame": 0,
  "scheduledSequences": [
    {
      "startFrame": 14,
      "endFrame": 15,
      "sequence": {
        "steps": [
          {
            "kind": "withActionBlackboardScope",
            "parameters": {
              "scopeKey": "SkillData.chr_0012_avywen_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[4]:projectile_chr_0012_avywen_combo_skill_lance_out",
              "lifetime": "execution",
              "initialValues": {},
              "inheritParent": true
            },
            "body": {
              "steps": [
                {
                  "kind": "withActionBlackboardScope",
                  "parameters": {
                    "scopeKey": "SkillData.chr_0012_avywen_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[4]:chr_0012_avywen_combo_skill_lance_gene",
                    "lifetime": "execution",
                    "alwaysNext": true,
                    "initialValues": {
                      "atk_scale_lance_back": 1,
                      "potential_2": 0,
                      "radius": 4,
                      "talent_atb_gain": 0
                    },
                    "inheritParent": true
                  },
                  "body": {
                    "steps": [
                      {
                        "kind": "spawnAbilityEntity",
                        "parameters": {
                          "abilityEntityId": "abilityentity_chr_0012_avywen_combo_skill_lance",
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
      "startFrame": 14,
      "endFrame": 15,
      "sequence": {
        "steps": [
          {
            "kind": "dealDamage",
            "parameters": {
              "damageType": "electric",
              "attackScale": {
                "kind": "blackboard",
                "key": "atk_scale"
              },
              "tags": [
                "comboSkill"
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
      "endFrame": 12,
      "sequence": {
        "steps": [
          {
            "kind": "startTimeDilation",
            "parameters": {
              "scope": "global",
              "durationSeconds": {
                "kind": "constant",
                "value": 0.5
              },
              "slot": 0,
              "priority": 30,
              "curve": {
                "kind": "named",
                "key": "ComboSkill"
              },
              "finishByAction": false,
              "ignoredTargets": [
                "caster"
              ],
              "ignoredAbilityEntityTargets": [
                {
                  "kind": "ownerSpawned"
                }
              ]
            }
          }
        ]
      }
    }
  ],
  "cooldownFrames": [
    390,
    390,
    390,
    390,
    390,
    390,
    390,
    390,
    390,
    390,
    390,
    360
  ]
} as const satisfies SkillDefinition;
