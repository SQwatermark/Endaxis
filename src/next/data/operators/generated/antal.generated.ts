/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const antalGeneratedSource = {
  "slug": "antal",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0023_antal_normal_skill",
      "sourceFile": "buff_chr_0023_antal_normal_skill.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 60.0,
          "blackboardKey": "duration",
          "levelValues": [
            60.0
          ]
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": false,
        "maxTriggerCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unique",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 2.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": true,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "delay_time",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 60.0,
          "isDynamic": false
        },
        {
          "key": "potential_3",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_3_atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5_rate",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": 0.2,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 0,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0023_antal_tageffect",
                    "classification": null,
                    "blackboardAssignments": {
                      "rate": {
                        "value": 0.0,
                        "blackboardKey": "rate",
                        "levelValues": [
                          0.2
                        ]
                      },
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
                        "levelValues": [
                          60.0
                        ]
                      },
                      "potential_3": {
                        "value": 0.0,
                        "blackboardKey": "potential_3",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "potential_3_atb": {
                        "value": 0.0,
                        "blackboardKey": "potential_3_atb",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "potential_5_rate": {
                        "value": 0.0,
                        "blackboardKey": "potential_5_rate",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "potential_5": {
                        "value": 0.0,
                        "blackboardKey": "potential_5",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "delay_time": {
                        "value": 0.0,
                        "blackboardKey": "delay_time",
                        "levelValues": [
                          0.0
                        ]
                      }
                    }
                  }
                ],
                "targetSource": "Source",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionOwner",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_chr_0023_antal_tageffect"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 0,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0023_antal_tageffect",
                        "classification": null,
                        "blackboardAssignments": {
                          "rate": {
                            "value": 0.0,
                            "blackboardKey": "rate",
                            "levelValues": [
                              0.2
                            ]
                          },
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              60.0
                            ]
                          },
                          "potential_3": {
                            "value": 0.0,
                            "blackboardKey": "potential_3",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "potential_3_atb": {
                            "value": 0.0,
                            "blackboardKey": "potential_3_atb",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "potential_5_rate": {
                            "value": 0.0,
                            "blackboardKey": "potential_5_rate",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "potential_5": {
                            "value": 0.0,
                            "blackboardKey": "potential_5",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "delay_time": {
                            "value": 0.0,
                            "blackboardKey": "delay_time",
                            "levelValues": [
                              0.0
                            ]
                          }
                        }
                      }
                    ],
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionOwner",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CreateBuffAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 0,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0023_antal_tageffect",
                        "classification": null,
                        "blackboardAssignments": {
                          "rate": {
                            "value": 0.0,
                            "blackboardKey": "rate",
                            "levelValues": [
                              0.2
                            ]
                          },
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              60.0
                            ]
                          },
                          "potential_3": {
                            "value": 0.0,
                            "blackboardKey": "potential_3",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "potential_3_atb": {
                            "value": 0.0,
                            "blackboardKey": "potential_3_atb",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "potential_5_rate": {
                            "value": 0.0,
                            "blackboardKey": "potential_5_rate",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "potential_5": {
                            "value": 0.0,
                            "blackboardKey": "potential_5",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "delay_time": {
                            "value": 0.0,
                            "blackboardKey": "delay_time",
                            "levelValues": [
                              0.0
                            ]
                          }
                        }
                      }
                    ],
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionOwner",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0023_antal_tageffect",
      "sourceFile": "buff_chr_0023_antal_tageffect.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 12.0,
          "blackboardKey": "duration",
          "levelValues": [
            0.0
          ]
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": "delay_time",
          "levelValues": [
            0.0
          ]
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Stack",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": true,
        "stackEffectActionTypes": [
          "EffectAction"
        ]
      },
      "blackboard": [
        {
          "key": "delay_time",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_3",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_3_atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5_rate",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "rate_add",
          "value": 0.05,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [
        {
          "enabledSide": "Defender",
          "targetSource": "Owner",
          "targetGroupKey": "",
          "tagQueryType": "hasAny",
          "tagIds": [],
          "processors": [
            {
              "side": "Defender",
              "zone": "VulnerableDmgIncreace",
              "addition": {
                "value": 0.0,
                "blackboardKey": "__keyword_rate_0_0_0",
                "levelValues": [
                  0.0
                ]
              }
            }
          ],
          "tagConditions": [],
          "ownerControlled": false,
          "damageTagMatch": null,
          "damageTags": [],
          "damageFeatureMatch": null,
          "damageFeatures": [],
          "damageTypes": [
            "electric"
          ],
          "numberComparisons": [],
          "healthComparisons": [],
          "buffCountComparisons": []
        },
        {
          "enabledSide": "Defender",
          "targetSource": "Owner",
          "targetGroupKey": "",
          "tagQueryType": "hasAny",
          "tagIds": [],
          "processors": [
            {
              "side": "Defender",
              "zone": "VulnerableDmgIncreace",
              "addition": {
                "value": 0.0,
                "blackboardKey": "__keyword_rate_0_0_1",
                "levelValues": [
                  0.0
                ]
              }
            }
          ],
          "tagConditions": [],
          "ownerControlled": false,
          "damageTagMatch": null,
          "damageTags": [],
          "damageFeatureMatch": null,
          "damageFeatures": [],
          "damageTypes": [
            "heat"
          ],
          "numberComparisons": [],
          "healthComparisons": [],
          "buffCountComparisons": []
        }
      ],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "VulnerableAction",
            "VulnerableAction"
          ],
          "combatActions": [],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "VulnerableAction",
                "VulnerableAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        },
        {
          "eventSource": "buff",
          "event": "OnBuffFinish",
          "orderedActionTypes": [
            "FinishBuffAction"
          ],
          "combatActions": [
            "FinishBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "FinishBuffAction"
              ],
              "combatActions": [
                "FinishBuffAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "FinishBuffAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 2,
                  "legacyBuffFinish": {
                    "target": {
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "buffIds": [
                      "buff_chr_0023_antal_talent_1_combotrigger"
                    ],
                    "finishAll": true,
                    "finishLayerCount": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "limitSource": false,
                    "buffSource": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "isFinishedEarly": false,
                    "finishSource": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    }
                  },
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        },
        {
          "eventSource": "buff",
          "event": "OnBuffTrigger",
          "orderedActionTypes": [
            "CompareFloat",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 4,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0023_antal_talent_1_combotrigger",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Owner",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_chr_0023_antal_talent_1_combotrigger"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CompareFloat",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 4,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0023_antal_talent_1_combotrigger",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CompareFloat",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 3,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 3,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CompareFloat",
                        "supported": true,
                        "comparison": "Equals",
                        "left": {
                          "value": 0.0,
                          "blackboardKey": "potential_5",
                          "levelValues": [
                            0.0
                          ]
                        },
                        "right": {
                          "value": 1.0,
                          "blackboardKey": null,
                          "levelValues": null
                        },
                        "skillTypes": [],
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "CreateBuffAction",
                        "actionIndex": 1,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[1]"
                        ],
                        "serverActionIndex": 4,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "buffApplication": {
                          "buffs": [
                            {
                              "buffId": "buff_chr_0023_antal_talent_1_combotrigger",
                              "classification": null,
                              "blackboardAssignments": {}
                            }
                          ],
                          "targetSource": "Owner",
                          "targetGroupKey": "",
                          "count": {
                            "value": 1.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "buffSource": "ActionSource",
                          "buffSourceContextKey": "",
                          "inheritSourceSkillCastInfo": true
                        }
                      }
                    ],
                    "failActions": [],
                    "conditionNegated": [],
                    "alwaysNext": false
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        },
        {
          "eventSource": "ability",
          "event": "OnOwnerDead",
          "orderedActionTypes": [
            "CompareFloat",
            "ObtainCostAction"
          ],
          "combatActions": [
            "ObtainCostAction"
          ],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CompareFloat",
                "ObtainCostAction"
              ],
              "combatActions": [
                "ObtainCostAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "CompareFloat",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 5,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 5,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CompareFloat",
                        "supported": true,
                        "comparison": "GE",
                        "left": {
                          "value": 0.0,
                          "blackboardKey": "potential_3",
                          "levelValues": [
                            0.0
                          ]
                        },
                        "right": {
                          "value": 1.0,
                          "blackboardKey": null,
                          "levelValues": null
                        },
                        "skillTypes": [],
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "ObtainCostAction",
                        "actionIndex": 1,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[1]"
                        ],
                        "serverActionIndex": 6,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "resourceGain": {
                          "resource": "sp",
                          "amount": {
                            "value": 0.0,
                            "blackboardKey": "potential_3_atb",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "coefficient": {
                            "value": 1.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "spGainKind": "refund",
                          "spGainSource": "skill",
                          "onlyMainOperator": false,
                          "isPercentValue": false,
                          "useUltimateRecoveryTag": false,
                          "ultimateRecoveryTagId": 0,
                          "ignoreUltimateGainScalar": false
                        }
                      }
                    ],
                    "failActions": [],
                    "conditionNegated": [],
                    "alwaysNext": false
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": true,
        "spritePath": "icon_battle_antal_buff",
        "showInHeadBarCommon": true,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": [
        {
          "triggerBuffIds": [
            "buff_chr_0023_antal_talent_1_combotrigger"
          ],
          "operation": "Add",
          "targetKey": "__keyword_rate_0_0_0",
          "initialValue": {
            "value": 0.0,
            "blackboardKey": "rate",
            "levelValues": [
              0.0
            ]
          },
          "value": {
            "value": 0.0,
            "blackboardKey": "potential_5_rate",
            "levelValues": [
              0.0
            ]
          }
        },
        {
          "triggerBuffIds": [
            "buff_chr_0023_antal_talent_1_combotrigger"
          ],
          "operation": "Add",
          "targetKey": "__keyword_rate_0_0_1",
          "initialValue": {
            "value": 0.0,
            "blackboardKey": "rate",
            "levelValues": [
              0.0
            ]
          },
          "value": {
            "value": 0.0,
            "blackboardKey": "potential_5_rate",
            "levelValues": [
              0.0
            ]
          }
        }
      ]
    },
    {
      "buffId": "buff_chr_0023_antal_talent_1",
      "sourceFile": "buff_chr_0023_antal_talent_1.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 60.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": false,
        "maxTriggerCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unique",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 2.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": true,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "cd",
          "value": 30.0,
          "isDynamic": false
        },
        {
          "key": "healvalue",
          "value": 300.0,
          "isDynamic": false
        },
        {
          "key": "multiplier",
          "value": 3.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "DuringBuffEnable",
          "orderedActionTypes": [
            "AuraAction"
          ],
          "combatActions": [
            "AuraAction"
          ],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [
            "buff_chr_0023_antal_talent_1_heal_trigger"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "AuraAction"
              ],
              "combatActions": [
                "AuraAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "AuraAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 0,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [
        {
          "startFrame": null,
          "endFrame": null,
          "actionIndex": 0,
          "sourceFile": "buff_chr_0023_antal_talent_1.json",
          "activationSource": "buffEvent",
          "activationEvent": "DuringBuffEnable",
          "actionPath": [
            "buffEventAction[0]",
            "actions[0]",
            "actionData",
            "[0]"
          ],
          "priorityLevel": "Default",
          "priorityOffset": 0,
          "debugName": "",
          "auraType": "GlobalAura",
          "root": {
            "targetSource": "Owner",
            "targetGroupKey": "",
            "selectorOwner": "ActionOwner",
            "ownerContextKey": "",
            "centerType": "ActionSource",
            "centerContextKey": "",
            "centerToGround": false,
            "target": "ActionSource",
            "targetContextKey": "",
            "enableAdvancedDirection": false,
            "selectorDirection": "SourceForward",
            "finderType": null,
            "validatorTypes": [],
            "postProcessorTypes": []
          },
          "fixedWhenStart": false,
          "shape": {
            "shapeType": "Box",
            "rotationOffset": {
              "x": 0.0,
              "y": 0.0,
              "z": 0.0
            },
            "useExtentKeys": false,
            "extent": {
              "x": 0.0,
              "y": 0.0,
              "z": 0.0
            },
            "extentKeys": [
              "",
              "",
              ""
            ],
            "useCenterKeys": false,
            "center": {
              "x": 0.0,
              "y": 0.0,
              "z": 0.0
            },
            "centerKeys": [
              "",
              "",
              ""
            ],
            "height": 0.0,
            "heightKey": "",
            "radius": 0.0,
            "radiusKey": ""
          },
          "excludeColliderOptions": 0,
          "targetObjectType": "Character",
          "targetFilter": {
            "checkAlive": true,
            "autoSetTargetFaction": true,
            "factionTarget": "Ally",
            "factionTargetType": 0,
            "filterObjectType": false,
            "objectType": "All",
            "filterSlot": false,
            "slotIndex": 0,
            "filterGameplayTag": false,
            "tagQueryType": "HasAny",
            "tagIds": []
          },
          "excludeOwner": false,
          "includeUnmarkable": false,
          "limitInfluenceCountPerTarget": false,
          "maxInfluenceCountPerTarget": 1,
          "buffSource": "ActionSource",
          "buffs": [
            {
              "buffId": "buff_chr_0023_antal_talent_1_heal_trigger",
              "classification": null,
              "blackboardAssignments": {
                "healvalue": {
                  "value": 0.0,
                  "blackboardKey": "healvalue",
                  "levelValues": [
                    300.0
                  ]
                },
                "cd": {
                  "value": 0.0,
                  "blackboardKey": "cd",
                  "levelValues": [
                    30.0
                  ]
                },
                "multiplier": {
                  "value": 0.0,
                  "blackboardKey": "multiplier",
                  "levelValues": [
                    3.0
                  ]
                }
              }
            }
          ],
          "overrideBuffIconDuration": false,
          "buffIconDurationSourceType": "AbilityEntity",
          "buffIconDurationTimedMarkerId": "",
          "inheritSourceSkillCastId": false,
          "actionInAuraOnlyMainOperator": false,
          "actionInAuraOnlyGuard": false,
          "actionInAuraTypes": [],
          "actionWhenExitAuraOnlyMainOperator": false,
          "actionWhenExitAuraOnlyGuard": false,
          "actionWhenExitAuraTypes": [],
          "nestedCombatActions": [],
          "airborneOutputs": [],
          "actionInAuraBuffFinishes": [],
          "actionWhenExitAuraBuffFinishes": [],
          "actionWhenExitAuraBuffApplications": []
        }
      ],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0023_antal_talent_1_combotrigger",
      "sourceFile": "buff_chr_0023_antal_talent_1_combotrigger.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 0.1,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": false,
        "maxTriggerCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Stack",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0023_antal_talent_1_heal_trigger",
      "sourceFile": "buff_chr_0023_antal_talent_1_heal_trigger.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 60.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": false,
        "maxTriggerCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unique",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 2.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": true,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "cd",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "healvalue",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "multiplier",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "ability",
          "event": "OnOutputDamage",
          "orderedActionTypes": [
            "CheckGlobalCDTimerAction",
            "CheckTagMatch",
            "CheckDamageDecorateMask",
            "HealAction",
            "AddGlobalCDTimer"
          ],
          "combatActions": [
            "AddGlobalCDTimer",
            "HealAction"
          ],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckGlobalCDTimerAction",
                "CheckTagMatch",
                "CheckDamageDecorateMask",
                "HealAction",
                "AddGlobalCDTimer"
              ],
              "combatActions": [
                "HealAction",
                "AddGlobalCDTimer"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "CheckTagMatch",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 1,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CheckTagMatch",
                        "supported": true,
                        "comparison": null,
                        "left": null,
                        "right": null,
                        "skillTypes": [],
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "entityTag": {
                          "targetSource": "Owner",
                          "targetGroupKey": "",
                          "tagQueryType": "hasAny",
                          "tagIds": [
                            -1748167886
                          ]
                        },
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "CheckDamageDecorateMask",
                        "actionIndex": 2,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[2]"
                        ],
                        "serverActionIndex": 2,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[0]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[2]"
                          ],
                          "conditions": [
                            {
                              "sourceType": "CheckDamageDecorateMask",
                              "supported": false,
                              "comparison": null,
                              "left": null,
                              "right": null,
                              "skillTypes": [],
                              "poise": null,
                              "superArmor": null,
                              "twoDirectionAngle": null,
                              "targetAngle": null,
                              "damageDecorateMask": {
                                "checkType": "HasAny",
                                "mask": 8960
                              },
                              "contextBuffId": null,
                              "objectTypeMatch": null,
                              "deckAttributeCompare": null,
                              "probability": null,
                              "anyConditionGroups": [],
                              "anyConditionNegated": []
                            }
                          ],
                          "succeedActions": [
                            {
                              "actionType": "HealAction",
                              "actionIndex": 3,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[3]"
                              ],
                              "serverActionIndex": 3,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "heal": {
                                "healType": "Normal",
                                "healer": "ActionSource",
                                "alwaysNext": true,
                                "target": {
                                  "targetSource": "Owner",
                                  "targetGroupKey": "",
                                  "selectorOwner": "ActionOwner",
                                  "ownerContextKey": "",
                                  "centerType": "ActionSource",
                                  "centerContextKey": "",
                                  "centerToGround": false,
                                  "target": "ActionSource",
                                  "targetContextKey": "",
                                  "enableAdvancedDirection": false,
                                  "selectorDirection": "SourceForward",
                                  "finderType": null,
                                  "validatorTypes": [],
                                  "postProcessorTypes": []
                                },
                                "attribute": "Str",
                                "multiplier": {
                                  "value": 3.0,
                                  "blackboardKey": "multiplier",
                                  "levelValues": [
                                    0.0
                                  ]
                                },
                                "addition": {
                                  "value": 0.0,
                                  "blackboardKey": "healvalue",
                                  "levelValues": [
                                    0.0
                                  ]
                                },
                                "tagIds": []
                              }
                            },
                            {
                              "actionType": "AddGlobalCDTimer",
                              "actionIndex": 4,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[4]"
                              ],
                              "serverActionIndex": 4,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "globalCooldownApplication": {
                                "targetSource": "Owner",
                                "targetGroupKey": "",
                                "buffId": "buff_chr_0023_antal_talent_1_heal_trigger",
                                "duration": {
                                  "value": 0.0,
                                  "blackboardKey": "cd",
                                  "levelValues": [
                                    0.0
                                  ]
                                }
                              }
                            }
                          ],
                          "failActions": [],
                          "conditionNegated": [],
                          "alwaysNext": false
                        },
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null
                      }
                    ],
                    "failActions": [],
                    "conditionNegated": [],
                    "alwaysNext": false
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0023_antal_talent_2",
      "sourceFile": "buff_chr_0023_antal_talent_2.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 10.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": false,
        "maxTriggerCount": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unique",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "heal_scale",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "healvalue",
          "value": 300.0,
          "isDynamic": false
        },
        {
          "key": "probability",
          "value": 0.3,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "ability",
          "event": "OnBeforeTakeDamage",
          "orderedActionTypes": [
            "CheckBuffStackNumAdvanced",
            "CheckDamageType",
            "Probablity",
            "CreateBuffAction",
            "EffectAction",
            "HealAction",
            "PlaySoundAction"
          ],
          "combatActions": [
            "CreateBuffAction",
            "HealAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 3,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_common_damage_immune_talent",
                    "classification": "incomingDamageProtection",
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.01,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    }
                  }
                ],
                "targetSource": "Source",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_common_damage_immune_talent"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckBuffStackNumAdvanced",
                "CheckDamageType",
                "Probablity",
                "CreateBuffAction",
                "EffectAction",
                "HealAction",
                "PlaySoundAction"
              ],
              "combatActions": [
                "CreateBuffAction",
                "HealAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 3,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_common_damage_immune_talent",
                        "classification": "incomingDamageProtection",
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.01,
                            "blackboardKey": null,
                            "levelValues": null
                          }
                        }
                      }
                    ],
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CheckDamageType",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 1,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CheckDamageType",
                        "supported": true,
                        "comparison": null,
                        "left": null,
                        "right": null,
                        "skillTypes": [],
                        "damageType": "physical",
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "Probablity",
                        "actionIndex": 2,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[2]"
                        ],
                        "serverActionIndex": 2,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[0]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[2]"
                          ],
                          "conditions": [
                            {
                              "sourceType": "Probablity",
                              "supported": true,
                              "comparison": null,
                              "left": null,
                              "right": null,
                              "skillTypes": [],
                              "poise": null,
                              "superArmor": null,
                              "twoDirectionAngle": null,
                              "targetAngle": null,
                              "damageDecorateMask": null,
                              "contextBuffId": null,
                              "objectTypeMatch": null,
                              "deckAttributeCompare": null,
                              "probability": {
                                "value": 1.0,
                                "blackboardKey": "probability",
                                "levelValues": [
                                  0.3
                                ]
                              },
                              "anyConditionGroups": [],
                              "anyConditionNegated": []
                            }
                          ],
                          "succeedActions": [
                            {
                              "actionType": "CreateBuffAction",
                              "actionIndex": 3,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[3]"
                              ],
                              "serverActionIndex": 3,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "buffApplication": {
                                "buffs": [
                                  {
                                    "buffId": "buff_common_damage_immune_talent",
                                    "classification": "incomingDamageProtection",
                                    "blackboardAssignments": {
                                      "duration": {
                                        "value": 0.01,
                                        "blackboardKey": null,
                                        "levelValues": null
                                      }
                                    }
                                  }
                                ],
                                "targetSource": "Source",
                                "targetGroupKey": "",
                                "count": {
                                  "value": 1.0,
                                  "blackboardKey": null,
                                  "levelValues": null
                                },
                                "buffSource": "ActionSource",
                                "buffSourceContextKey": "",
                                "inheritSourceSkillCastInfo": true
                              }
                            },
                            {
                              "actionType": "HealAction",
                              "actionIndex": 5,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[5]"
                              ],
                              "serverActionIndex": 5,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "heal": {
                                "healType": "Normal",
                                "healer": "ActionSource",
                                "alwaysNext": true,
                                "target": {
                                  "targetSource": "Owner",
                                  "targetGroupKey": "",
                                  "selectorOwner": "ActionOwner",
                                  "ownerContextKey": "",
                                  "centerType": "ActionSource",
                                  "centerContextKey": "",
                                  "centerToGround": false,
                                  "target": "ActionSource",
                                  "targetContextKey": "",
                                  "enableAdvancedDirection": false,
                                  "selectorDirection": "SourceForward",
                                  "finderType": null,
                                  "validatorTypes": [],
                                  "postProcessorTypes": []
                                },
                                "attribute": "Str",
                                "multiplier": {
                                  "value": 1.0,
                                  "blackboardKey": "heal_scale",
                                  "levelValues": [
                                    0.1
                                  ]
                                },
                                "addition": {
                                  "value": 0.0,
                                  "blackboardKey": "healvalue",
                                  "levelValues": [
                                    300.0
                                  ]
                                },
                                "tagIds": []
                              }
                            }
                          ],
                          "failActions": [],
                          "conditionNegated": [],
                          "alwaysNext": false
                        },
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null
                      }
                    ],
                    "failActions": [],
                    "conditionNegated": [],
                    "alwaysNext": false
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0023_antal_utimate_skill",
      "sourceFile": "buff_chr_0023_antal_utimate_skill.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 20.0,
          "blackboardKey": "duration",
          "levelValues": [
            20.0
          ]
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": false,
        "maxTriggerCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Stack",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "duration",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "healvalue",
          "value": 500.0,
          "isDynamic": false
        },
        {
          "key": "multiplier",
          "value": 3.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": 0.4,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [
        {
          "targetType": "Specific",
          "attributeType": "PulseEnhancedDmgIncrease",
          "slot": "BaseAddition",
          "value": {
            "value": 0.0,
            "blackboardKey": "rate",
            "levelValues": [
              0.4
            ]
          }
        },
        {
          "targetType": "Specific",
          "attributeType": "FireEnhancedDmgIncrease",
          "slot": "BaseAddition",
          "value": {
            "value": 0.0,
            "blackboardKey": "rate",
            "levelValues": [
              0.4
            ]
          }
        }
      ],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "DuringBuffEnable",
          "orderedActionTypes": [
            "EffectAction"
          ],
          "combatActions": [],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "EffectAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "childPresentations": [
        {
          "buffId": "buff_chr_0023_antal_ultimate_icon_2",
          "presentation": {
            "hasIcon": true,
            "spritePath": "icon_battle_affix_pulse_enhance",
            "showInHeadBarCommon": true,
            "showInHeadBarAttached": false,
            "showInSquadIcon": true,
            "onlyShowForMainCharacter": false,
            "iconStyleInSquad": "LifeTime",
            "abnormalColorType": "Physical",
            "orderUseDirectoryValue": false,
            "orderPriorityValue": 0,
            "orderPriorityEnum": "KeywordDebuff"
          }
        },
        {
          "buffId": "buff_chr_0023_antal_ultimate_icon",
          "presentation": {
            "hasIcon": true,
            "spritePath": "icon_battle_affix_fire_enhance",
            "showInHeadBarCommon": true,
            "showInHeadBarAttached": false,
            "showInSquadIcon": true,
            "onlyShowForMainCharacter": false,
            "iconStyleInSquad": "LifeTime",
            "abnormalColorType": "Physical",
            "orderUseDirectoryValue": false,
            "orderPriorityValue": 0,
            "orderPriorityEnum": "KeywordDebuff"
          }
        }
      ],
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_common_cryst_triggered_physical_break",
      "sourceFile": "buff_common_cryst_triggered_physical_break.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 5.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unlimited",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "atk_scale",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "applyTagIds": [
        -615023885
      ],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "DamageAction",
            "EffectAction",
            "PlaySoundAction",
            "IgniteBuffTextAction"
          ],
          "combatActions": [
            "DamageAction"
          ],
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.0
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 134217728
            }
          ],
          "buffApplications": [],
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "DamageAction",
                "EffectAction",
                "PlaySoundAction",
                "IgniteBuffTextAction"
              ],
              "combatActions": [
                "DamageAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "DamageAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 0,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Physical",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 134217728
                    }
                  ]
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_common_damage_immune_medium",
      "sourceFile": "buff_common_damage_immune_medium.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 2.0,
          "blackboardKey": "duration",
          "levelValues": [
            9999.0
          ]
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unlimited",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "duration",
          "value": 9999.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        782082172,
        -104052028,
        -886962248
      ],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_common_damage_immune_talent",
      "sourceFile": "buff_common_damage_immune_talent.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 2.0,
          "blackboardKey": "duration",
          "levelValues": [
            9999.0
          ]
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unlimited",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "duration",
          "value": 9999.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        782082172,
        -104052028,
        -1128398902
      ],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "ImmuneTextAction"
          ],
          "combatActions": [],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "ImmuneTextAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [
        {
          "target": {
            "targetSource": "Owner",
            "targetGroupKey": "",
            "selectorOwner": "ActionOwner",
            "ownerContextKey": "",
            "centerType": "ActionSource",
            "centerContextKey": "",
            "centerToGround": false,
            "target": "ActionSource",
            "targetContextKey": "",
            "enableAdvancedDirection": false,
            "selectorDirection": "SourceForward",
            "finderType": null,
            "validatorTypes": [],
            "postProcessorTypes": []
          },
          "superArmor": {
            "value": 35.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "impactResistance": {
            "value": 100.0,
            "blackboardKey": null,
            "levelValues": null
          }
        }
      ],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_common_damage_immune_ult_skill",
      "sourceFile": "buff_common_damage_immune_ult_skill.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 2.0,
          "blackboardKey": "duration",
          "levelValues": [
            9999.0
          ]
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unlimited",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "duration",
          "value": 9999.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        782082172,
        -104052028,
        -886962248
      ],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [
        {
          "target": {
            "targetSource": "Owner",
            "targetGroupKey": "",
            "selectorOwner": "ActionOwner",
            "ownerContextKey": "",
            "centerType": "ActionSource",
            "centerContextKey": "",
            "centerToGround": false,
            "target": "ActionSource",
            "targetContextKey": "",
            "enableAdvancedDirection": false,
            "selectorDirection": "SourceForward",
            "finderType": null,
            "validatorTypes": [],
            "postProcessorTypes": []
          },
          "superArmor": {
            "value": 50.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "impactResistance": {
            "value": 100.0,
            "blackboardKey": null,
            "levelValues": null
          }
        }
      ],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_common_obtain_ultimate_sp",
      "sourceFile": "buff_common_obtain_ultimate_sp.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unlimited",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "ratio",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "usp_everyone",
          "value": 6.5,
          "isDynamic": false
        },
        {
          "key": "usp_self",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "ObtainUspInNormalSkill"
          ],
          "combatActions": [],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "ObtainUspInNormalSkill"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_common_power_attack_disable_cast_skill",
      "sourceFile": "buff_common_power_attack_disable_cast_skill.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unlimited",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [],
      "applyTagIds": [
        -1601691447,
        817018340,
        -1486085048,
        -496376350,
        2002680355
      ],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_physical_crushed",
      "sourceFile": "buff_physical_crushed.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 3.0,
          "blackboardKey": "duration",
          "levelValues": [
            3.0
          ]
        },
        "triggerInterval": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "StackingKey",
        "stackingType": "Stack",
        "stackingKey": "physical",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "atk_scale",
          "value": 1.0,
          "isDynamic": true
        },
        {
          "key": "count",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "dmg_multiplier",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 3.0,
          "isDynamic": false
        },
        {
          "key": "ignore_hit_effect",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        -168668661
      ],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "StoreBuffCount",
            "ReadSkillSettingData",
            "ModifyDynamicBlackboard",
            "FinishBuffAction",
            "DamageAction",
            "InterruptAction",
            "PlaySoundAction",
            "EffectAction",
            "CreateBuffAction",
            "IgniteAction",
            "CompareFloat",
            "SwitchAction"
          ],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction",
            "FinishBuffAction",
            "IgniteAction",
            "SwitchAction"
          ],
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  1.0
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 16384
            }
          ],
          "buffApplications": [
            {
              "actionIndex": 8,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_physical_handle_cryst_break",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Owner",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_physical_handle_cryst_break"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "StoreBuffCount",
                "ReadSkillSettingData",
                "ModifyDynamicBlackboard",
                "FinishBuffAction",
                "DamageAction",
                "InterruptAction",
                "PlaySoundAction",
                "EffectAction"
              ],
              "combatActions": [
                "FinishBuffAction",
                "DamageAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "ModifyDynamicBlackboard",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 2,
                  "blackboardMutation": {
                    "key": "atk_scale",
                    "operation": "Multiply",
                    "value": {
                      "value": 0.0,
                      "blackboardKey": "dmg_multiplier",
                      "levelValues": [
                        1.0
                      ]
                    }
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "FinishBuffAction",
                  "actionIndex": 3,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[3]"
                  ],
                  "serverActionIndex": 3,
                  "legacyBuffFinish": {
                    "target": {
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "buffIds": [
                      "buff_physical_no_guard"
                    ],
                    "finishAll": true,
                    "finishLayerCount": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "limitSource": false,
                    "buffSource": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "isFinishedEarly": true,
                    "finishSource": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    }
                  },
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "DamageAction",
                  "actionIndex": 4,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[4]"
                  ],
                  "serverActionIndex": 4,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Physical",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          1.0
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 16384
                    }
                  ]
                },
                {
                  "actionType": "InterruptAction",
                  "actionIndex": 5,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[5]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "interrupt": {
                    "attacker": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "defender": {
                      "targetSource": "Target",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "overrideSuperArmorLimit": -1.0,
                    "immobilizedTime": 2.0
                  }
                }
              ],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 8,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_handle_cryst_break",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CreateBuffAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 8,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_handle_cryst_break",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "IgniteAction"
              ],
              "combatActions": [
                "IgniteAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "IgniteAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 9,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": {
                    "source": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "target": {
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "igniteType": "PhysicalStatus",
                    "successTargetContextKey": ""
                  }
                }
              ],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CompareFloat",
                "SwitchAction"
              ],
              "combatActions": [
                "SwitchAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "CompareFloat",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 10,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 10,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CompareFloat",
                        "supported": true,
                        "comparison": "LT",
                        "left": {
                          "value": 0.0,
                          "blackboardKey": "ignore_hit_effect",
                          "levelValues": [
                            0.0
                          ]
                        },
                        "right": {
                          "value": 0.5,
                          "blackboardKey": null,
                          "levelValues": null
                        },
                        "skillTypes": [],
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "SwitchAction",
                        "actionIndex": 1,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[1]"
                        ],
                        "serverActionIndex": 11,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 11,
                          "actionPath": [
                            "timelineActions[0]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[1]",
                            "options",
                            "[0]"
                          ],
                          "conditions": [
                            {
                              "sourceType": "CompareFloat",
                              "supported": true,
                              "comparison": "Equals",
                              "left": {
                                "value": 0.0,
                                "blackboardKey": "count",
                                "levelValues": [
                                  0.0
                                ]
                              },
                              "right": {
                                "value": 0.0,
                                "blackboardKey": null,
                                "levelValues": null
                              },
                              "skillTypes": [],
                              "poise": null,
                              "superArmor": null,
                              "twoDirectionAngle": null,
                              "targetAngle": null,
                              "damageDecorateMask": null,
                              "contextBuffId": null,
                              "objectTypeMatch": null,
                              "deckAttributeCompare": null,
                              "probability": null,
                              "anyConditionGroups": [],
                              "anyConditionNegated": []
                            }
                          ],
                          "succeedActions": [
                            {
                              "actionType": "TimeDilationAction",
                              "actionIndex": 1,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[1]",
                                "options",
                                "[0]",
                                "actionData",
                                "actionData",
                                "[1]"
                              ],
                              "serverActionIndex": 13,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "timeDilation": {
                                "startFrame": 0,
                                "endFrame": 0,
                                "actionIndex": 13,
                                "kind": "normal",
                                "priority": -693798243,
                                "scope": "entity",
                                "slot": 1464849466,
                                "duration": {
                                  "value": 0.1,
                                  "blackboardKey": null,
                                  "levelValues": null
                                },
                                "namedCurve": "interrupt_weakness",
                                "inlineCurve": [],
                                "finishByAction": false,
                                "ignoredTargets": [],
                                "targets": [
                                  "caster",
                                  "caster"
                                ],
                                "omittedAbilityEntityTargets": 0,
                                "ignoredAbilityEntityTargets": [],
                                "influenceSkillCooldown": null,
                                "targetScale": null,
                                "sequenceIndex": -1,
                                "effectAbilityEntityTargets": []
                              }
                            }
                          ],
                          "failActions": [
                            {
                              "actionType": "SwitchAction",
                              "actionIndex": 0,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[1]",
                                "options",
                                "[1]"
                              ],
                              "serverActionIndex": 11,
                              "nestedCondition": {
                                "startFrame": 0,
                                "endFrame": 0,
                                "actionIndex": 11,
                                "actionPath": [
                                  "timelineActions[0]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[1]",
                                  "options",
                                  "[1]"
                                ],
                                "conditions": [
                                  {
                                    "sourceType": "CompareFloat",
                                    "supported": true,
                                    "comparison": "Equals",
                                    "left": {
                                      "value": 0.0,
                                      "blackboardKey": "count",
                                      "levelValues": [
                                        0.0
                                      ]
                                    },
                                    "right": {
                                      "value": 1.0,
                                      "blackboardKey": null,
                                      "levelValues": null
                                    },
                                    "skillTypes": [],
                                    "poise": null,
                                    "superArmor": null,
                                    "twoDirectionAngle": null,
                                    "targetAngle": null,
                                    "damageDecorateMask": null,
                                    "contextBuffId": null,
                                    "objectTypeMatch": null,
                                    "deckAttributeCompare": null,
                                    "probability": null,
                                    "anyConditionGroups": [],
                                    "anyConditionNegated": []
                                  }
                                ],
                                "succeedActions": [
                                  {
                                    "actionType": "TimeDilationAction",
                                    "actionIndex": 1,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[1]",
                                      "options",
                                      "[1]",
                                      "actionData",
                                      "actionData",
                                      "[1]"
                                    ],
                                    "serverActionIndex": 15,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "timeDilation": {
                                      "startFrame": 0,
                                      "endFrame": 0,
                                      "actionIndex": 15,
                                      "kind": "normal",
                                      "priority": -2059842104,
                                      "scope": "entity",
                                      "slot": 1464849466,
                                      "duration": {
                                        "value": 0.1,
                                        "blackboardKey": null,
                                        "levelValues": null
                                      },
                                      "namedCurve": "interrupt_weakness",
                                      "inlineCurve": [],
                                      "finishByAction": false,
                                      "ignoredTargets": [],
                                      "targets": [
                                        "caster",
                                        "caster"
                                      ],
                                      "omittedAbilityEntityTargets": 0,
                                      "ignoredAbilityEntityTargets": [],
                                      "influenceSkillCooldown": null,
                                      "targetScale": null,
                                      "sequenceIndex": -1,
                                      "effectAbilityEntityTargets": []
                                    }
                                  }
                                ],
                                "failActions": [
                                  {
                                    "actionType": "SwitchAction",
                                    "actionIndex": 1,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[1]",
                                      "options",
                                      "[2]"
                                    ],
                                    "serverActionIndex": 11,
                                    "nestedCondition": {
                                      "startFrame": 0,
                                      "endFrame": 0,
                                      "actionIndex": 11,
                                      "actionPath": [
                                        "timelineActions[0]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[0]",
                                        "succeedActions",
                                        "actionData",
                                        "[1]",
                                        "options",
                                        "[2]"
                                      ],
                                      "conditions": [
                                        {
                                          "sourceType": "CompareFloat",
                                          "supported": true,
                                          "comparison": "Equals",
                                          "left": {
                                            "value": 0.0,
                                            "blackboardKey": "count",
                                            "levelValues": [
                                              0.0
                                            ]
                                          },
                                          "right": {
                                            "value": 2.0,
                                            "blackboardKey": null,
                                            "levelValues": null
                                          },
                                          "skillTypes": [],
                                          "poise": null,
                                          "superArmor": null,
                                          "twoDirectionAngle": null,
                                          "targetAngle": null,
                                          "damageDecorateMask": null,
                                          "contextBuffId": null,
                                          "objectTypeMatch": null,
                                          "deckAttributeCompare": null,
                                          "probability": null,
                                          "anyConditionGroups": [],
                                          "anyConditionNegated": []
                                        }
                                      ],
                                      "succeedActions": [
                                        {
                                          "actionType": "TimeDilationAction",
                                          "actionIndex": 1,
                                          "actionPath": [
                                            "timelineActions[0]",
                                            "_sequenceActionData",
                                            "actionData",
                                            "[0]",
                                            "succeedActions",
                                            "actionData",
                                            "[1]",
                                            "options",
                                            "[2]",
                                            "actionData",
                                            "actionData",
                                            "[1]"
                                          ],
                                          "serverActionIndex": 17,
                                          "legacyBuffFinish": null,
                                          "skillCooldownAdjustment": null,
                                          "buffIgnite": null,
                                          "timeDilation": {
                                            "startFrame": 0,
                                            "endFrame": 0,
                                            "actionIndex": 17,
                                            "kind": "normal",
                                            "priority": 1798502681,
                                            "scope": "entity",
                                            "slot": 1464849466,
                                            "duration": {
                                              "value": 0.25,
                                              "blackboardKey": null,
                                              "levelValues": null
                                            },
                                            "namedCurve": "interrupt_weakness",
                                            "inlineCurve": [],
                                            "finishByAction": false,
                                            "ignoredTargets": [],
                                            "targets": [
                                              "caster",
                                              "caster"
                                            ],
                                            "omittedAbilityEntityTargets": 0,
                                            "ignoredAbilityEntityTargets": [],
                                            "influenceSkillCooldown": null,
                                            "targetScale": null,
                                            "sequenceIndex": -1,
                                            "effectAbilityEntityTargets": []
                                          }
                                        }
                                      ],
                                      "failActions": [
                                        {
                                          "actionType": "SwitchAction",
                                          "actionIndex": 2,
                                          "actionPath": [
                                            "timelineActions[0]",
                                            "_sequenceActionData",
                                            "actionData",
                                            "[0]",
                                            "succeedActions",
                                            "actionData",
                                            "[1]",
                                            "options",
                                            "[3]"
                                          ],
                                          "serverActionIndex": 11,
                                          "nestedCondition": {
                                            "startFrame": 0,
                                            "endFrame": 0,
                                            "actionIndex": 11,
                                            "actionPath": [
                                              "timelineActions[0]",
                                              "_sequenceActionData",
                                              "actionData",
                                              "[0]",
                                              "succeedActions",
                                              "actionData",
                                              "[1]",
                                              "options",
                                              "[3]"
                                            ],
                                            "conditions": [
                                              {
                                                "sourceType": "CompareFloat",
                                                "supported": true,
                                                "comparison": "Equals",
                                                "left": {
                                                  "value": 0.0,
                                                  "blackboardKey": "count",
                                                  "levelValues": [
                                                    0.0
                                                  ]
                                                },
                                                "right": {
                                                  "value": 3.0,
                                                  "blackboardKey": null,
                                                  "levelValues": null
                                                },
                                                "skillTypes": [],
                                                "poise": null,
                                                "superArmor": null,
                                                "twoDirectionAngle": null,
                                                "targetAngle": null,
                                                "damageDecorateMask": null,
                                                "contextBuffId": null,
                                                "objectTypeMatch": null,
                                                "deckAttributeCompare": null,
                                                "probability": null,
                                                "anyConditionGroups": [],
                                                "anyConditionNegated": []
                                              }
                                            ],
                                            "succeedActions": [
                                              {
                                                "actionType": "TimeDilationAction",
                                                "actionIndex": 1,
                                                "actionPath": [
                                                  "timelineActions[0]",
                                                  "_sequenceActionData",
                                                  "actionData",
                                                  "[0]",
                                                  "succeedActions",
                                                  "actionData",
                                                  "[1]",
                                                  "options",
                                                  "[3]",
                                                  "actionData",
                                                  "actionData",
                                                  "[1]"
                                                ],
                                                "serverActionIndex": 19,
                                                "legacyBuffFinish": null,
                                                "skillCooldownAdjustment": null,
                                                "buffIgnite": null,
                                                "timeDilation": {
                                                  "startFrame": 0,
                                                  "endFrame": 0,
                                                  "actionIndex": 19,
                                                  "kind": "normal",
                                                  "priority": 1798502681,
                                                  "scope": "entity",
                                                  "slot": 1464849466,
                                                  "duration": {
                                                    "value": 0.5,
                                                    "blackboardKey": null,
                                                    "levelValues": null
                                                  },
                                                  "namedCurve": "interrupt_weakness",
                                                  "inlineCurve": [],
                                                  "finishByAction": false,
                                                  "ignoredTargets": [],
                                                  "targets": [
                                                    "caster",
                                                    "caster"
                                                  ],
                                                  "omittedAbilityEntityTargets": 0,
                                                  "ignoredAbilityEntityTargets": [],
                                                  "influenceSkillCooldown": null,
                                                  "targetScale": null,
                                                  "sequenceIndex": -1,
                                                  "effectAbilityEntityTargets": []
                                                }
                                              }
                                            ],
                                            "failActions": [
                                              {
                                                "actionType": "SwitchAction",
                                                "actionIndex": 3,
                                                "actionPath": [
                                                  "timelineActions[0]",
                                                  "_sequenceActionData",
                                                  "actionData",
                                                  "[0]",
                                                  "succeedActions",
                                                  "actionData",
                                                  "[1]",
                                                  "options",
                                                  "[4]"
                                                ],
                                                "serverActionIndex": 11,
                                                "nestedCondition": {
                                                  "startFrame": 0,
                                                  "endFrame": 0,
                                                  "actionIndex": 11,
                                                  "actionPath": [
                                                    "timelineActions[0]",
                                                    "_sequenceActionData",
                                                    "actionData",
                                                    "[0]",
                                                    "succeedActions",
                                                    "actionData",
                                                    "[1]",
                                                    "options",
                                                    "[4]"
                                                  ],
                                                  "conditions": [
                                                    {
                                                      "sourceType": "CompareFloat",
                                                      "supported": true,
                                                      "comparison": "Equals",
                                                      "left": {
                                                        "value": 0.0,
                                                        "blackboardKey": "count",
                                                        "levelValues": [
                                                          0.0
                                                        ]
                                                      },
                                                      "right": {
                                                        "value": 4.0,
                                                        "blackboardKey": null,
                                                        "levelValues": null
                                                      },
                                                      "skillTypes": [],
                                                      "poise": null,
                                                      "superArmor": null,
                                                      "twoDirectionAngle": null,
                                                      "targetAngle": null,
                                                      "damageDecorateMask": null,
                                                      "contextBuffId": null,
                                                      "objectTypeMatch": null,
                                                      "deckAttributeCompare": null,
                                                      "probability": null,
                                                      "anyConditionGroups": [],
                                                      "anyConditionNegated": []
                                                    }
                                                  ],
                                                  "succeedActions": [
                                                    {
                                                      "actionType": "TimeDilationAction",
                                                      "actionIndex": 1,
                                                      "actionPath": [
                                                        "timelineActions[0]",
                                                        "_sequenceActionData",
                                                        "actionData",
                                                        "[0]",
                                                        "succeedActions",
                                                        "actionData",
                                                        "[1]",
                                                        "options",
                                                        "[4]",
                                                        "actionData",
                                                        "actionData",
                                                        "[1]"
                                                      ],
                                                      "serverActionIndex": 21,
                                                      "legacyBuffFinish": null,
                                                      "skillCooldownAdjustment": null,
                                                      "buffIgnite": null,
                                                      "timeDilation": {
                                                        "startFrame": 0,
                                                        "endFrame": 0,
                                                        "actionIndex": 21,
                                                        "kind": "normal",
                                                        "priority": 1798502681,
                                                        "scope": "entity",
                                                        "slot": 1464849466,
                                                        "duration": {
                                                          "value": 0.65,
                                                          "blackboardKey": null,
                                                          "levelValues": null
                                                        },
                                                        "namedCurve": "interrupt_weakness",
                                                        "inlineCurve": [],
                                                        "finishByAction": false,
                                                        "ignoredTargets": [],
                                                        "targets": [
                                                          "caster",
                                                          "caster"
                                                        ],
                                                        "omittedAbilityEntityTargets": 0,
                                                        "ignoredAbilityEntityTargets": [],
                                                        "influenceSkillCooldown": null,
                                                        "targetScale": null,
                                                        "sequenceIndex": -1,
                                                        "effectAbilityEntityTargets": []
                                                      }
                                                    }
                                                  ],
                                                  "failActions": [],
                                                  "conditionNegated": [],
                                                  "alwaysNext": false
                                                },
                                                "legacyBuffFinish": null,
                                                "skillCooldownAdjustment": null,
                                                "buffIgnite": null
                                              }
                                            ],
                                            "conditionNegated": [],
                                            "alwaysNext": false
                                          },
                                          "legacyBuffFinish": null,
                                          "skillCooldownAdjustment": null,
                                          "buffIgnite": null
                                        }
                                      ],
                                      "conditionNegated": [],
                                      "alwaysNext": false
                                    },
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null
                                  }
                                ],
                                "conditionNegated": [],
                                "alwaysNext": false
                              },
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null
                            }
                          ],
                          "conditionNegated": [],
                          "alwaysNext": true
                        },
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null
                      }
                    ],
                    "failActions": [],
                    "conditionNegated": [],
                    "alwaysNext": false
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": true,
        "spritePath": "knockback",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_physical_do_fracture",
      "sourceFile": "buff_physical_do_fracture.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 15.0,
          "blackboardKey": "duration",
          "levelValues": [
            15.0
          ]
        },
        "triggerInterval": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": false,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "StackingKey",
        "stackingType": "Stack",
        "stackingKey": "fracture",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "atk_scale",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "count",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 15.0,
          "isDynamic": true
        },
        {
          "key": "extra_scaling",
          "value": 1.0,
          "isDynamic": true
        },
        {
          "key": "physical_res_down",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "applyTagIds": [
        -430063731
      ],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [
        {
          "enabledSide": "Defender",
          "targetSource": "",
          "targetGroupKey": "",
          "tagQueryType": "hasAny",
          "tagIds": [],
          "processors": [
            {
              "side": "Defender",
              "zone": "NormalCalcZone",
              "addition": {
                "value": 0.0,
                "blackboardKey": "physical_res_down",
                "levelValues": [
                  0.0
                ]
              }
            }
          ],
          "tagConditions": [],
          "ownerControlled": false,
          "damageTagMatch": null,
          "damageTags": [],
          "damageFeatureMatch": null,
          "damageFeatures": [],
          "damageTypes": [
            "physical"
          ],
          "numberComparisons": [],
          "healthComparisons": [],
          "buffCountComparisons": []
        }
      ],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "StoreBuffCount",
            "ReadSkillSettingData",
            "ModifyDynamicBlackboard",
            "RefreshBuffAttrModifierValue",
            "InterruptAction",
            "PlaySoundAction",
            "EffectAction",
            "CreateBuffAction",
            "IgniteAction",
            "FinishBuffAction",
            "DamageAction",
            "SwitchAction"
          ],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction",
            "FinishBuffAction",
            "IgniteAction",
            "SwitchAction"
          ],
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.0
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 1073741824
            }
          ],
          "buffApplications": [
            {
              "actionIndex": 8,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_physical_handle_cryst_break",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Owner",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_physical_handle_cryst_break"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "StoreBuffCount",
                "ReadSkillSettingData",
                "ModifyDynamicBlackboard",
                "RefreshBuffAttrModifierValue",
                "InterruptAction",
                "PlaySoundAction",
                "EffectAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "ModifyDynamicBlackboard",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 3,
                  "blackboardMutation": {
                    "key": "physical_res_down",
                    "operation": "Multiply",
                    "value": {
                      "value": 0.0,
                      "blackboardKey": "extra_scaling",
                      "levelValues": [
                        1.0
                      ]
                    }
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "InterruptAction",
                  "actionIndex": 4,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[4]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "interrupt": {
                    "attacker": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "defender": {
                      "targetSource": "Target",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "overrideSuperArmorLimit": -1.0,
                    "immobilizedTime": 2.0
                  }
                }
              ],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 8,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_handle_cryst_break",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CreateBuffAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 8,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_handle_cryst_break",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "IgniteAction"
              ],
              "combatActions": [
                "IgniteAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "IgniteAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 9,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": {
                    "source": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "target": {
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "igniteType": "PhysicalStatus",
                    "successTargetContextKey": ""
                  }
                }
              ],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "FinishBuffAction",
                "DamageAction"
              ],
              "combatActions": [
                "FinishBuffAction",
                "DamageAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "FinishBuffAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 10,
                  "legacyBuffFinish": {
                    "target": {
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "buffIds": [
                      "buff_physical_no_guard"
                    ],
                    "finishAll": true,
                    "finishLayerCount": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "limitSource": false,
                    "buffSource": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "isFinishedEarly": true,
                    "finishSource": {
                      "targetSource": "Source",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    }
                  },
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "DamageAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 11,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Physical",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 1073741824
                    }
                  ]
                }
              ],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "SwitchAction"
              ],
              "combatActions": [
                "SwitchAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "SwitchAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 12,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 12,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "options",
                      "[0]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CompareFloat",
                        "supported": true,
                        "comparison": "Equals",
                        "left": {
                          "value": 0.0,
                          "blackboardKey": "count",
                          "levelValues": [
                            0.0
                          ]
                        },
                        "right": {
                          "value": 0.0,
                          "blackboardKey": null,
                          "levelValues": null
                        },
                        "skillTypes": [],
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "TimeDilationAction",
                        "actionIndex": 1,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[0]",
                          "options",
                          "[0]",
                          "actionData",
                          "actionData",
                          "[1]"
                        ],
                        "serverActionIndex": 14,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "timeDilation": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 14,
                          "kind": "normal",
                          "priority": -693798243,
                          "scope": "entity",
                          "slot": 1464849466,
                          "duration": {
                            "value": 0.1,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "namedCurve": "interrupt_weakness",
                          "inlineCurve": [],
                          "finishByAction": false,
                          "ignoredTargets": [],
                          "targets": [
                            "caster",
                            "caster"
                          ],
                          "omittedAbilityEntityTargets": 0,
                          "ignoredAbilityEntityTargets": [],
                          "influenceSkillCooldown": null,
                          "targetScale": null,
                          "sequenceIndex": -1,
                          "effectAbilityEntityTargets": []
                        }
                      }
                    ],
                    "failActions": [
                      {
                        "actionType": "SwitchAction",
                        "actionIndex": 0,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[0]",
                          "options",
                          "[1]"
                        ],
                        "serverActionIndex": 12,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 12,
                          "actionPath": [
                            "timelineActions[0]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]",
                            "options",
                            "[1]"
                          ],
                          "conditions": [
                            {
                              "sourceType": "CompareFloat",
                              "supported": true,
                              "comparison": "Equals",
                              "left": {
                                "value": 0.0,
                                "blackboardKey": "count",
                                "levelValues": [
                                  0.0
                                ]
                              },
                              "right": {
                                "value": 1.0,
                                "blackboardKey": null,
                                "levelValues": null
                              },
                              "skillTypes": [],
                              "poise": null,
                              "superArmor": null,
                              "twoDirectionAngle": null,
                              "targetAngle": null,
                              "damageDecorateMask": null,
                              "contextBuffId": null,
                              "objectTypeMatch": null,
                              "deckAttributeCompare": null,
                              "probability": null,
                              "anyConditionGroups": [],
                              "anyConditionNegated": []
                            }
                          ],
                          "succeedActions": [
                            {
                              "actionType": "TimeDilationAction",
                              "actionIndex": 1,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[0]",
                                "options",
                                "[1]",
                                "actionData",
                                "actionData",
                                "[1]"
                              ],
                              "serverActionIndex": 16,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "timeDilation": {
                                "startFrame": 0,
                                "endFrame": 0,
                                "actionIndex": 16,
                                "kind": "normal",
                                "priority": -2059842104,
                                "scope": "entity",
                                "slot": 1464849466,
                                "duration": {
                                  "value": 0.1,
                                  "blackboardKey": null,
                                  "levelValues": null
                                },
                                "namedCurve": "interrupt_weakness",
                                "inlineCurve": [],
                                "finishByAction": false,
                                "ignoredTargets": [],
                                "targets": [
                                  "caster",
                                  "caster"
                                ],
                                "omittedAbilityEntityTargets": 0,
                                "ignoredAbilityEntityTargets": [],
                                "influenceSkillCooldown": null,
                                "targetScale": null,
                                "sequenceIndex": -1,
                                "effectAbilityEntityTargets": []
                              }
                            }
                          ],
                          "failActions": [
                            {
                              "actionType": "SwitchAction",
                              "actionIndex": 1,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[0]",
                                "options",
                                "[2]"
                              ],
                              "serverActionIndex": 12,
                              "nestedCondition": {
                                "startFrame": 0,
                                "endFrame": 0,
                                "actionIndex": 12,
                                "actionPath": [
                                  "timelineActions[0]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[2]"
                                ],
                                "conditions": [
                                  {
                                    "sourceType": "CompareFloat",
                                    "supported": true,
                                    "comparison": "Equals",
                                    "left": {
                                      "value": 0.0,
                                      "blackboardKey": "count",
                                      "levelValues": [
                                        0.0
                                      ]
                                    },
                                    "right": {
                                      "value": 2.0,
                                      "blackboardKey": null,
                                      "levelValues": null
                                    },
                                    "skillTypes": [],
                                    "poise": null,
                                    "superArmor": null,
                                    "twoDirectionAngle": null,
                                    "targetAngle": null,
                                    "damageDecorateMask": null,
                                    "contextBuffId": null,
                                    "objectTypeMatch": null,
                                    "deckAttributeCompare": null,
                                    "probability": null,
                                    "anyConditionGroups": [],
                                    "anyConditionNegated": []
                                  }
                                ],
                                "succeedActions": [
                                  {
                                    "actionType": "TimeDilationAction",
                                    "actionIndex": 1,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[0]",
                                      "options",
                                      "[2]",
                                      "actionData",
                                      "actionData",
                                      "[1]"
                                    ],
                                    "serverActionIndex": 18,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "timeDilation": {
                                      "startFrame": 0,
                                      "endFrame": 0,
                                      "actionIndex": 18,
                                      "kind": "normal",
                                      "priority": 1798502681,
                                      "scope": "entity",
                                      "slot": 1464849466,
                                      "duration": {
                                        "value": 0.25,
                                        "blackboardKey": null,
                                        "levelValues": null
                                      },
                                      "namedCurve": "interrupt_weakness",
                                      "inlineCurve": [],
                                      "finishByAction": false,
                                      "ignoredTargets": [],
                                      "targets": [
                                        "caster",
                                        "caster"
                                      ],
                                      "omittedAbilityEntityTargets": 0,
                                      "ignoredAbilityEntityTargets": [],
                                      "influenceSkillCooldown": null,
                                      "targetScale": null,
                                      "sequenceIndex": -1,
                                      "effectAbilityEntityTargets": []
                                    }
                                  }
                                ],
                                "failActions": [
                                  {
                                    "actionType": "SwitchAction",
                                    "actionIndex": 2,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[0]",
                                      "options",
                                      "[3]"
                                    ],
                                    "serverActionIndex": 12,
                                    "nestedCondition": {
                                      "startFrame": 0,
                                      "endFrame": 0,
                                      "actionIndex": 12,
                                      "actionPath": [
                                        "timelineActions[0]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[0]",
                                        "succeedActions",
                                        "actionData",
                                        "[0]",
                                        "options",
                                        "[3]"
                                      ],
                                      "conditions": [
                                        {
                                          "sourceType": "CompareFloat",
                                          "supported": true,
                                          "comparison": "Equals",
                                          "left": {
                                            "value": 0.0,
                                            "blackboardKey": "count",
                                            "levelValues": [
                                              0.0
                                            ]
                                          },
                                          "right": {
                                            "value": 3.0,
                                            "blackboardKey": null,
                                            "levelValues": null
                                          },
                                          "skillTypes": [],
                                          "poise": null,
                                          "superArmor": null,
                                          "twoDirectionAngle": null,
                                          "targetAngle": null,
                                          "damageDecorateMask": null,
                                          "contextBuffId": null,
                                          "objectTypeMatch": null,
                                          "deckAttributeCompare": null,
                                          "probability": null,
                                          "anyConditionGroups": [],
                                          "anyConditionNegated": []
                                        }
                                      ],
                                      "succeedActions": [
                                        {
                                          "actionType": "TimeDilationAction",
                                          "actionIndex": 1,
                                          "actionPath": [
                                            "timelineActions[0]",
                                            "_sequenceActionData",
                                            "actionData",
                                            "[0]",
                                            "succeedActions",
                                            "actionData",
                                            "[0]",
                                            "options",
                                            "[3]",
                                            "actionData",
                                            "actionData",
                                            "[1]"
                                          ],
                                          "serverActionIndex": 20,
                                          "legacyBuffFinish": null,
                                          "skillCooldownAdjustment": null,
                                          "buffIgnite": null,
                                          "timeDilation": {
                                            "startFrame": 0,
                                            "endFrame": 0,
                                            "actionIndex": 20,
                                            "kind": "normal",
                                            "priority": 1798502681,
                                            "scope": "entity",
                                            "slot": 1464849466,
                                            "duration": {
                                              "value": 0.5,
                                              "blackboardKey": null,
                                              "levelValues": null
                                            },
                                            "namedCurve": "interrupt_weakness",
                                            "inlineCurve": [],
                                            "finishByAction": false,
                                            "ignoredTargets": [],
                                            "targets": [
                                              "caster",
                                              "caster"
                                            ],
                                            "omittedAbilityEntityTargets": 0,
                                            "ignoredAbilityEntityTargets": [],
                                            "influenceSkillCooldown": null,
                                            "targetScale": null,
                                            "sequenceIndex": -1,
                                            "effectAbilityEntityTargets": []
                                          }
                                        }
                                      ],
                                      "failActions": [
                                        {
                                          "actionType": "SwitchAction",
                                          "actionIndex": 3,
                                          "actionPath": [
                                            "timelineActions[0]",
                                            "_sequenceActionData",
                                            "actionData",
                                            "[0]",
                                            "succeedActions",
                                            "actionData",
                                            "[0]",
                                            "options",
                                            "[4]"
                                          ],
                                          "serverActionIndex": 12,
                                          "nestedCondition": {
                                            "startFrame": 0,
                                            "endFrame": 0,
                                            "actionIndex": 12,
                                            "actionPath": [
                                              "timelineActions[0]",
                                              "_sequenceActionData",
                                              "actionData",
                                              "[0]",
                                              "succeedActions",
                                              "actionData",
                                              "[0]",
                                              "options",
                                              "[4]"
                                            ],
                                            "conditions": [
                                              {
                                                "sourceType": "CompareFloat",
                                                "supported": true,
                                                "comparison": "Equals",
                                                "left": {
                                                  "value": 0.0,
                                                  "blackboardKey": "count",
                                                  "levelValues": [
                                                    0.0
                                                  ]
                                                },
                                                "right": {
                                                  "value": 4.0,
                                                  "blackboardKey": null,
                                                  "levelValues": null
                                                },
                                                "skillTypes": [],
                                                "poise": null,
                                                "superArmor": null,
                                                "twoDirectionAngle": null,
                                                "targetAngle": null,
                                                "damageDecorateMask": null,
                                                "contextBuffId": null,
                                                "objectTypeMatch": null,
                                                "deckAttributeCompare": null,
                                                "probability": null,
                                                "anyConditionGroups": [],
                                                "anyConditionNegated": []
                                              }
                                            ],
                                            "succeedActions": [
                                              {
                                                "actionType": "TimeDilationAction",
                                                "actionIndex": 1,
                                                "actionPath": [
                                                  "timelineActions[0]",
                                                  "_sequenceActionData",
                                                  "actionData",
                                                  "[0]",
                                                  "succeedActions",
                                                  "actionData",
                                                  "[0]",
                                                  "options",
                                                  "[4]",
                                                  "actionData",
                                                  "actionData",
                                                  "[1]"
                                                ],
                                                "serverActionIndex": 22,
                                                "legacyBuffFinish": null,
                                                "skillCooldownAdjustment": null,
                                                "buffIgnite": null,
                                                "timeDilation": {
                                                  "startFrame": 0,
                                                  "endFrame": 0,
                                                  "actionIndex": 22,
                                                  "kind": "normal",
                                                  "priority": 1798502681,
                                                  "scope": "entity",
                                                  "slot": 1464849466,
                                                  "duration": {
                                                    "value": 0.65,
                                                    "blackboardKey": null,
                                                    "levelValues": null
                                                  },
                                                  "namedCurve": "interrupt_weakness",
                                                  "inlineCurve": [],
                                                  "finishByAction": false,
                                                  "ignoredTargets": [],
                                                  "targets": [
                                                    "caster",
                                                    "caster"
                                                  ],
                                                  "omittedAbilityEntityTargets": 0,
                                                  "ignoredAbilityEntityTargets": [],
                                                  "influenceSkillCooldown": null,
                                                  "targetScale": null,
                                                  "sequenceIndex": -1,
                                                  "effectAbilityEntityTargets": []
                                                }
                                              }
                                            ],
                                            "failActions": [],
                                            "conditionNegated": [],
                                            "alwaysNext": false
                                          },
                                          "legacyBuffFinish": null,
                                          "skillCooldownAdjustment": null,
                                          "buffIgnite": null
                                        }
                                      ],
                                      "conditionNegated": [],
                                      "alwaysNext": false
                                    },
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null
                                  }
                                ],
                                "conditionNegated": [],
                                "alwaysNext": false
                              },
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null
                            }
                          ],
                          "conditionNegated": [],
                          "alwaysNext": false
                        },
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null
                      }
                    ],
                    "conditionNegated": [],
                    "alwaysNext": true
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": true,
        "spritePath": "icon_battle_fracture",
        "showInHeadBarCommon": true,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "SpellAbnormal",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "AttachedAndAbnormal"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_physical_fracture",
      "sourceFile": "buff_physical_fracture.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 3.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": false,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unlimited",
        "stackingKey": "fracture",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "count",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 15.0,
          "isDynamic": true
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "StoreBuffCount",
            "ReadSkillSettingData",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 2,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_physical_do_fracture",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
                        "levelValues": [
                          15.0
                        ]
                      }
                    }
                  }
                ],
                "targetSource": "Owner",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_physical_do_fracture"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "StoreBuffCount",
                "ReadSkillSettingData",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 2,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_do_fracture",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              15.0
                            ]
                          }
                        }
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CreateBuffAction",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 2,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_do_fracture",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              15.0
                            ]
                          }
                        }
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_physical_handle_cryst_break",
      "sourceFile": "buff_physical_handle_cryst_break.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 10.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Stack",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "atk_scale",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "count",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "GetTargetBuffBBAdvanced",
            "ReadSkillSettingData",
            "FinishBuffAdvanced",
            "CreateBuffAction",
            "SwitchAction"
          ],
          "combatActions": [
            "CreateBuffAction",
            "SwitchAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 3,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_common_cryst_triggered_physical_break",
                    "classification": null,
                    "blackboardAssignments": {
                      "atk_scale": {
                        "value": 4.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          0.0
                        ]
                      }
                    }
                  }
                ],
                "targetSource": "Owner",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_common_cryst_triggered_physical_break"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "GetTargetBuffBBAdvanced",
                "ReadSkillSettingData",
                "FinishBuffAdvanced",
                "CreateBuffAction",
                "SwitchAction"
              ],
              "combatActions": [
                "CreateBuffAction",
                "SwitchAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 3,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_common_cryst_triggered_physical_break",
                        "classification": null,
                        "blackboardAssignments": {
                          "atk_scale": {
                            "value": 4.0,
                            "blackboardKey": "atk_scale",
                            "levelValues": [
                              0.0
                            ]
                          }
                        }
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "GetTargetBuffBBAdvanced",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 0,
                  "buffBlackboardRead": {
                    "outputKey": "count",
                    "desiredKey": "count",
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "buffCheckType": "Tag",
                    "buffIds": [],
                    "tagQueryType": "hasAny",
                    "buffTagIds": [
                      1535684437
                    ]
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "FinishBuffAdvanced",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 2,
                  "buffFinish": {
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "buffCheckType": "Tag",
                    "buffIds": [],
                    "tagQueryType": "hasAny",
                    "buffTagIds": [
                      1535684437
                    ],
                    "finishAll": true,
                    "limitSource": false,
                    "isFinishedEarly": true,
                    "isAbsorbed": false,
                    "finishLayerCount": null
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "CreateBuffAction",
                  "actionIndex": 3,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[3]"
                  ],
                  "serverActionIndex": 3,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_common_cryst_triggered_physical_break",
                        "classification": null,
                        "blackboardAssignments": {
                          "atk_scale": {
                            "value": 4.0,
                            "blackboardKey": "atk_scale",
                            "levelValues": [
                              0.0
                            ]
                          }
                        }
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                },
                {
                  "actionType": "SwitchAction",
                  "actionIndex": 4,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[4]"
                  ],
                  "serverActionIndex": 4,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 4,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[4]",
                      "options",
                      "[0]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CompareFloat",
                        "supported": true,
                        "comparison": "Equals",
                        "left": {
                          "value": 0.0,
                          "blackboardKey": "count",
                          "levelValues": [
                            0.0
                          ]
                        },
                        "right": {
                          "value": 0.0,
                          "blackboardKey": null,
                          "levelValues": null
                        },
                        "skillTypes": [],
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "TimeDilationAction",
                        "actionIndex": 1,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[4]",
                          "options",
                          "[0]",
                          "actionData",
                          "actionData",
                          "[1]"
                        ],
                        "serverActionIndex": 6,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "timeDilation": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 6,
                          "kind": "normal",
                          "priority": -693798243,
                          "scope": "entity",
                          "slot": 1464849466,
                          "duration": {
                            "value": 0.1,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "namedCurve": "interrupt_weakness",
                          "inlineCurve": [],
                          "finishByAction": false,
                          "ignoredTargets": [],
                          "targets": [
                            "caster",
                            "caster"
                          ],
                          "omittedAbilityEntityTargets": 0,
                          "ignoredAbilityEntityTargets": [],
                          "influenceSkillCooldown": null,
                          "targetScale": null,
                          "sequenceIndex": -1,
                          "effectAbilityEntityTargets": []
                        }
                      }
                    ],
                    "failActions": [
                      {
                        "actionType": "SwitchAction",
                        "actionIndex": 0,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[4]",
                          "options",
                          "[1]"
                        ],
                        "serverActionIndex": 4,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 4,
                          "actionPath": [
                            "timelineActions[0]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[4]",
                            "options",
                            "[1]"
                          ],
                          "conditions": [
                            {
                              "sourceType": "CompareFloat",
                              "supported": true,
                              "comparison": "Equals",
                              "left": {
                                "value": 0.0,
                                "blackboardKey": "count",
                                "levelValues": [
                                  0.0
                                ]
                              },
                              "right": {
                                "value": 1.0,
                                "blackboardKey": null,
                                "levelValues": null
                              },
                              "skillTypes": [],
                              "poise": null,
                              "superArmor": null,
                              "twoDirectionAngle": null,
                              "targetAngle": null,
                              "damageDecorateMask": null,
                              "contextBuffId": null,
                              "objectTypeMatch": null,
                              "deckAttributeCompare": null,
                              "probability": null,
                              "anyConditionGroups": [],
                              "anyConditionNegated": []
                            }
                          ],
                          "succeedActions": [
                            {
                              "actionType": "TimeDilationAction",
                              "actionIndex": 1,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[4]",
                                "options",
                                "[1]",
                                "actionData",
                                "actionData",
                                "[1]"
                              ],
                              "serverActionIndex": 8,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "timeDilation": {
                                "startFrame": 0,
                                "endFrame": 0,
                                "actionIndex": 8,
                                "kind": "normal",
                                "priority": -2059842104,
                                "scope": "entity",
                                "slot": 1464849466,
                                "duration": {
                                  "value": 0.1,
                                  "blackboardKey": null,
                                  "levelValues": null
                                },
                                "namedCurve": "interrupt_weakness",
                                "inlineCurve": [],
                                "finishByAction": false,
                                "ignoredTargets": [],
                                "targets": [
                                  "caster",
                                  "caster"
                                ],
                                "omittedAbilityEntityTargets": 0,
                                "ignoredAbilityEntityTargets": [],
                                "influenceSkillCooldown": null,
                                "targetScale": null,
                                "sequenceIndex": -1,
                                "effectAbilityEntityTargets": []
                              }
                            }
                          ],
                          "failActions": [
                            {
                              "actionType": "SwitchAction",
                              "actionIndex": 1,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[4]",
                                "options",
                                "[2]"
                              ],
                              "serverActionIndex": 4,
                              "nestedCondition": {
                                "startFrame": 0,
                                "endFrame": 0,
                                "actionIndex": 4,
                                "actionPath": [
                                  "timelineActions[0]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[4]",
                                  "options",
                                  "[2]"
                                ],
                                "conditions": [
                                  {
                                    "sourceType": "CompareFloat",
                                    "supported": true,
                                    "comparison": "Equals",
                                    "left": {
                                      "value": 0.0,
                                      "blackboardKey": "count",
                                      "levelValues": [
                                        0.0
                                      ]
                                    },
                                    "right": {
                                      "value": 2.0,
                                      "blackboardKey": null,
                                      "levelValues": null
                                    },
                                    "skillTypes": [],
                                    "poise": null,
                                    "superArmor": null,
                                    "twoDirectionAngle": null,
                                    "targetAngle": null,
                                    "damageDecorateMask": null,
                                    "contextBuffId": null,
                                    "objectTypeMatch": null,
                                    "deckAttributeCompare": null,
                                    "probability": null,
                                    "anyConditionGroups": [],
                                    "anyConditionNegated": []
                                  }
                                ],
                                "succeedActions": [
                                  {
                                    "actionType": "TimeDilationAction",
                                    "actionIndex": 1,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[4]",
                                      "options",
                                      "[2]",
                                      "actionData",
                                      "actionData",
                                      "[1]"
                                    ],
                                    "serverActionIndex": 10,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "timeDilation": {
                                      "startFrame": 0,
                                      "endFrame": 0,
                                      "actionIndex": 10,
                                      "kind": "normal",
                                      "priority": 1798502681,
                                      "scope": "entity",
                                      "slot": 1464849466,
                                      "duration": {
                                        "value": 0.25,
                                        "blackboardKey": null,
                                        "levelValues": null
                                      },
                                      "namedCurve": "interrupt_weakness",
                                      "inlineCurve": [],
                                      "finishByAction": false,
                                      "ignoredTargets": [],
                                      "targets": [
                                        "caster",
                                        "caster"
                                      ],
                                      "omittedAbilityEntityTargets": 0,
                                      "ignoredAbilityEntityTargets": [],
                                      "influenceSkillCooldown": null,
                                      "targetScale": null,
                                      "sequenceIndex": -1,
                                      "effectAbilityEntityTargets": []
                                    }
                                  }
                                ],
                                "failActions": [
                                  {
                                    "actionType": "SwitchAction",
                                    "actionIndex": 2,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[4]",
                                      "options",
                                      "[3]"
                                    ],
                                    "serverActionIndex": 4,
                                    "nestedCondition": {
                                      "startFrame": 0,
                                      "endFrame": 0,
                                      "actionIndex": 4,
                                      "actionPath": [
                                        "timelineActions[0]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[0]",
                                        "succeedActions",
                                        "actionData",
                                        "[4]",
                                        "options",
                                        "[3]"
                                      ],
                                      "conditions": [
                                        {
                                          "sourceType": "CompareFloat",
                                          "supported": true,
                                          "comparison": "Equals",
                                          "left": {
                                            "value": 0.0,
                                            "blackboardKey": "count",
                                            "levelValues": [
                                              0.0
                                            ]
                                          },
                                          "right": {
                                            "value": 3.0,
                                            "blackboardKey": null,
                                            "levelValues": null
                                          },
                                          "skillTypes": [],
                                          "poise": null,
                                          "superArmor": null,
                                          "twoDirectionAngle": null,
                                          "targetAngle": null,
                                          "damageDecorateMask": null,
                                          "contextBuffId": null,
                                          "objectTypeMatch": null,
                                          "deckAttributeCompare": null,
                                          "probability": null,
                                          "anyConditionGroups": [],
                                          "anyConditionNegated": []
                                        }
                                      ],
                                      "succeedActions": [
                                        {
                                          "actionType": "TimeDilationAction",
                                          "actionIndex": 1,
                                          "actionPath": [
                                            "timelineActions[0]",
                                            "_sequenceActionData",
                                            "actionData",
                                            "[0]",
                                            "succeedActions",
                                            "actionData",
                                            "[4]",
                                            "options",
                                            "[3]",
                                            "actionData",
                                            "actionData",
                                            "[1]"
                                          ],
                                          "serverActionIndex": 12,
                                          "legacyBuffFinish": null,
                                          "skillCooldownAdjustment": null,
                                          "buffIgnite": null,
                                          "timeDilation": {
                                            "startFrame": 0,
                                            "endFrame": 0,
                                            "actionIndex": 12,
                                            "kind": "normal",
                                            "priority": 1798502681,
                                            "scope": "entity",
                                            "slot": 1464849466,
                                            "duration": {
                                              "value": 0.5,
                                              "blackboardKey": null,
                                              "levelValues": null
                                            },
                                            "namedCurve": "interrupt_weakness",
                                            "inlineCurve": [],
                                            "finishByAction": false,
                                            "ignoredTargets": [],
                                            "targets": [
                                              "caster",
                                              "caster"
                                            ],
                                            "omittedAbilityEntityTargets": 0,
                                            "ignoredAbilityEntityTargets": [],
                                            "influenceSkillCooldown": null,
                                            "targetScale": null,
                                            "sequenceIndex": -1,
                                            "effectAbilityEntityTargets": []
                                          }
                                        }
                                      ],
                                      "failActions": [
                                        {
                                          "actionType": "SwitchAction",
                                          "actionIndex": 3,
                                          "actionPath": [
                                            "timelineActions[0]",
                                            "_sequenceActionData",
                                            "actionData",
                                            "[0]",
                                            "succeedActions",
                                            "actionData",
                                            "[4]",
                                            "options",
                                            "[4]"
                                          ],
                                          "serverActionIndex": 4,
                                          "nestedCondition": {
                                            "startFrame": 0,
                                            "endFrame": 0,
                                            "actionIndex": 4,
                                            "actionPath": [
                                              "timelineActions[0]",
                                              "_sequenceActionData",
                                              "actionData",
                                              "[0]",
                                              "succeedActions",
                                              "actionData",
                                              "[4]",
                                              "options",
                                              "[4]"
                                            ],
                                            "conditions": [
                                              {
                                                "sourceType": "CompareFloat",
                                                "supported": true,
                                                "comparison": "Equals",
                                                "left": {
                                                  "value": 0.0,
                                                  "blackboardKey": "count",
                                                  "levelValues": [
                                                    0.0
                                                  ]
                                                },
                                                "right": {
                                                  "value": 4.0,
                                                  "blackboardKey": null,
                                                  "levelValues": null
                                                },
                                                "skillTypes": [],
                                                "poise": null,
                                                "superArmor": null,
                                                "twoDirectionAngle": null,
                                                "targetAngle": null,
                                                "damageDecorateMask": null,
                                                "contextBuffId": null,
                                                "objectTypeMatch": null,
                                                "deckAttributeCompare": null,
                                                "probability": null,
                                                "anyConditionGroups": [],
                                                "anyConditionNegated": []
                                              }
                                            ],
                                            "succeedActions": [
                                              {
                                                "actionType": "TimeDilationAction",
                                                "actionIndex": 1,
                                                "actionPath": [
                                                  "timelineActions[0]",
                                                  "_sequenceActionData",
                                                  "actionData",
                                                  "[0]",
                                                  "succeedActions",
                                                  "actionData",
                                                  "[4]",
                                                  "options",
                                                  "[4]",
                                                  "actionData",
                                                  "actionData",
                                                  "[1]"
                                                ],
                                                "serverActionIndex": 14,
                                                "legacyBuffFinish": null,
                                                "skillCooldownAdjustment": null,
                                                "buffIgnite": null,
                                                "timeDilation": {
                                                  "startFrame": 0,
                                                  "endFrame": 0,
                                                  "actionIndex": 14,
                                                  "kind": "normal",
                                                  "priority": 1798502681,
                                                  "scope": "entity",
                                                  "slot": 1464849466,
                                                  "duration": {
                                                    "value": 0.65,
                                                    "blackboardKey": null,
                                                    "levelValues": null
                                                  },
                                                  "namedCurve": "interrupt_weakness",
                                                  "inlineCurve": [],
                                                  "finishByAction": false,
                                                  "ignoredTargets": [],
                                                  "targets": [
                                                    "caster",
                                                    "caster"
                                                  ],
                                                  "omittedAbilityEntityTargets": 0,
                                                  "ignoredAbilityEntityTargets": [],
                                                  "influenceSkillCooldown": null,
                                                  "targetScale": null,
                                                  "sequenceIndex": -1,
                                                  "effectAbilityEntityTargets": []
                                                }
                                              }
                                            ],
                                            "failActions": [],
                                            "conditionNegated": [],
                                            "alwaysNext": false
                                          },
                                          "legacyBuffFinish": null,
                                          "skillCooldownAdjustment": null,
                                          "buffIgnite": null
                                        }
                                      ],
                                      "conditionNegated": [],
                                      "alwaysNext": false
                                    },
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null
                                  }
                                ],
                                "conditionNegated": [],
                                "alwaysNext": false
                              },
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null
                            }
                          ],
                          "conditionNegated": [],
                          "alwaysNext": false
                        },
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null
                      }
                    ],
                    "conditionNegated": [],
                    "alwaysNext": true
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_physical_no_guard",
      "sourceFile": "buff_physical_no_guard.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 20.0,
          "blackboardKey": "duration",
          "levelValues": [
            20.0
          ]
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "EnhanceAndRefresh",
        "stackingKey": "common_debuff",
        "priority": {
          "value": 100.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 4.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "atk_scale",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "count",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "skip_handle_cryst_break",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        1075718177
      ],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "CompareFloat",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 1,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_physical_handle_cryst_break",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Owner",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_physical_handle_cryst_break"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CompareFloat",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 1,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_handle_cryst_break",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CompareFloat",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 0,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CompareFloat",
                        "supported": true,
                        "comparison": "Equals",
                        "left": {
                          "value": 0.0,
                          "blackboardKey": "skip_handle_cryst_break",
                          "levelValues": [
                            0.0
                          ]
                        },
                        "right": {
                          "value": 0.0,
                          "blackboardKey": null,
                          "levelValues": null
                        },
                        "skillTypes": [],
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "CreateBuffAction",
                        "actionIndex": 1,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[1]"
                        ],
                        "serverActionIndex": 1,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "buffApplication": {
                          "buffs": [
                            {
                              "buffId": "buff_physical_handle_cryst_break",
                              "classification": null,
                              "blackboardAssignments": {}
                            }
                          ],
                          "targetSource": "Owner",
                          "targetGroupKey": "",
                          "count": {
                            "value": 1.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "buffSource": "ActionSource",
                          "buffSourceContextKey": "",
                          "inheritSourceSkillCastInfo": true
                        }
                      }
                    ],
                    "failActions": [],
                    "conditionNegated": [],
                    "alwaysNext": false
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        },
        {
          "eventSource": "buff",
          "event": "OnBuffFinish",
          "orderedActionTypes": [
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 2,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_physical_no_guard_fake",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Owner",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_physical_no_guard_fake"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 2,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_no_guard_fake",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CreateBuffAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 2,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_no_guard_fake",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        },
        {
          "eventSource": "buff",
          "event": "OnBuffAfterTryEnhanced",
          "orderedActionTypes": [
            "OnPhysicalNoGuardStart",
            "IgniteAction",
            "CheckBuffStackNumAdvanced",
            "CompareFloat",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction",
            "IgniteAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 7,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_physical_handle_cryst_break",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Owner",
                "targetGroupKey": "",
                "count": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_physical_handle_cryst_break"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "OnPhysicalNoGuardStart"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "IgniteAction"
              ],
              "combatActions": [
                "IgniteAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "IgniteAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 4,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": {
                    "source": {
                      "targetSource": "Target",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "target": {
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "selectorOwner": "ActionOwner",
                      "ownerContextKey": "",
                      "centerType": "ActionSource",
                      "centerContextKey": "",
                      "centerToGround": false,
                      "target": "ActionSource",
                      "targetContextKey": "",
                      "enableAdvancedDirection": false,
                      "selectorDirection": "SourceForward",
                      "finderType": null,
                      "validatorTypes": [],
                      "postProcessorTypes": []
                    },
                    "igniteType": "NoGuard",
                    "successTargetContextKey": ""
                  }
                }
              ],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckBuffStackNumAdvanced",
                "CompareFloat",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 7,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_physical_handle_cryst_break",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ],
                    "targetSource": "Owner",
                    "targetGroupKey": "",
                    "count": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CompareFloat",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 6,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 6,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CompareFloat",
                        "supported": true,
                        "comparison": "Equals",
                        "left": {
                          "value": 0.0,
                          "blackboardKey": "skip_handle_cryst_break",
                          "levelValues": [
                            0.0
                          ]
                        },
                        "right": {
                          "value": 0.0,
                          "blackboardKey": null,
                          "levelValues": null
                        },
                        "skillTypes": [],
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "CreateBuffAction",
                        "actionIndex": 2,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[2]"
                        ],
                        "serverActionIndex": 7,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "buffApplication": {
                          "buffs": [
                            {
                              "buffId": "buff_physical_handle_cryst_break",
                              "classification": null,
                              "blackboardAssignments": {}
                            }
                          ],
                          "targetSource": "Owner",
                          "targetGroupKey": "",
                          "count": {
                            "value": 1.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "buffSource": "ActionSource",
                          "buffSourceContextKey": "",
                          "inheritSourceSkillCastInfo": true
                        }
                      }
                    ],
                    "failActions": [],
                    "conditionNegated": [],
                    "alwaysNext": false
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "obtainAtbValueKeys": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        }
      ],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": true,
        "spritePath": "icon_shadow_attribute_penetrate",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": true,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_physical_no_guard_fake",
      "sourceFile": "buff_physical_no_guard_fake.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 1.0,
          "blackboardKey": "duration",
          "levelValues": [
            1.0
          ]
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Refresh",
        "stackingKey": "common_debuff",
        "priority": {
          "value": 100.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "duration",
          "value": 1.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        -508362979
      ],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "inflictions": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [],
      "targetGroupWrites": [],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": false,
        "spritePath": "",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      },
      "keywordEnhancements": []
    }
  ],
  "skills": [
    {
      "key": "comboSkill",
      "skillId": "chr_0023_antal_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0023_antal_combo_skill.json",
      "timelineBlockFrames": 24,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 35.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 24,
          "endFrame": 63,
          "skillIds": [
            "chr_0023_antal_normal_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 63,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0023_antal_normal_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": false,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.3,
                "blackboardKey": ""
              }
            }
          ]
        }
      ],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 7,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 44,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 75,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionTypes": [
            "InterruptAction",
            "SwitchAction",
            "SwitchAction",
            "FractureAction",
            "AirborneAction",
            "KnockDownAction",
            "CrushAction",
            "SwitchAction",
            "SpellInfliction",
            "SpellInfliction",
            "SpellInfliction",
            "SpellInfliction",
            "DebugPrintAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 25,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 31,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 17,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 20,
          "actionTypes": [
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 31,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 45,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 63,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 63,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 65,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 127,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 22,
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 2.5,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  1.51,
                  1.66,
                  1.81,
                  1.96,
                  2.11,
                  2.27,
                  2.42,
                  2.57,
                  2.72,
                  2.91,
                  3.13,
                  3.4
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 12288
            },
            {
              "damageType": "Physical",
              "attributeType": "Poise",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "calculationMultiplier": null,
              "poiseValue": {
                "value": 0.0,
                "blackboardKey": "poise",
                "levelValues": [
                  10.0,
                  10.0,
                  10.0,
                  10.0,
                  10.0,
                  10.0,
                  10.0,
                  10.0,
                  10.0,
                  10.0,
                  10.0,
                  10.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 5
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "options",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "Equals",
              "left": {
                "value": 0.0,
                "blackboardKey": "EntityBB_combo_type",
                "levelValues": null
              },
              "right": {
                "value": 1.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "skillTypes": [],
              "poise": null,
              "superArmor": null,
              "twoDirectionAngle": null,
              "targetAngle": null,
              "damageDecorateMask": null,
              "contextBuffId": null,
              "objectTypeMatch": null,
              "deckAttributeCompare": null,
              "probability": null,
              "anyConditionGroups": [],
              "anyConditionNegated": []
            }
          ],
          "succeedActions": [
            {
              "actionType": "SwitchAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "options",
                "[0]",
                "actionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 11,
              "nestedCondition": {
                "startFrame": 21,
                "endFrame": 24,
                "actionIndex": 11,
                "actionPath": [
                  "timelineActions[5]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "options",
                  "[0]",
                  "actionData",
                  "actionData",
                  "[0]",
                  "options",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "Equals",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "EntityBB_combo_index",
                      "levelValues": null
                    },
                    "right": {
                      "value": 2.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": null,
                    "targetAngle": null,
                    "damageDecorateMask": null,
                    "contextBuffId": null,
                    "objectTypeMatch": null,
                    "deckAttributeCompare": null,
                    "probability": null,
                    "anyConditionGroups": [],
                    "anyConditionNegated": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "FractureAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "options",
                      "[0]",
                      "actionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[0]",
                      "actionData",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 12,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "physicalInfliction": {
                      "physicalType": "fracture",
                      "attackerTarget": {
                        "targetSource": "Owner",
                        "targetGroupKey": "",
                        "selectorOwner": "ActionOwner",
                        "ownerContextKey": "",
                        "centerType": "ActionSource",
                        "centerContextKey": "",
                        "centerToGround": false,
                        "target": "ActionSource",
                        "targetContextKey": "",
                        "enableAdvancedDirection": false,
                        "selectorDirection": "SourceForward",
                        "finderType": null,
                        "validatorTypes": [],
                        "postProcessorTypes": []
                      },
                      "target": {
                        "targetSource": "Context",
                        "targetGroupKey": "smart_target",
                        "selectorOwner": "ActionOwner",
                        "ownerContextKey": "",
                        "centerType": "ActionSource",
                        "centerContextKey": "",
                        "centerToGround": false,
                        "target": "ActionSource",
                        "targetContextKey": "",
                        "enableAdvancedDirection": false,
                        "selectorDirection": "SourceForward",
                        "finderType": null,
                        "validatorTypes": [],
                        "postProcessorTypes": []
                      },
                      "blowOffDistance": {
                        "value": 3.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "distanceRandomRange": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "overwriteHeight": false,
                      "blowOffHeight": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "directionType": "SourceToTarget",
                      "sourceMountPoint": "None",
                      "targetMountPoint": "None",
                      "customSourceAndTarget": false,
                      "clampToXZ": true,
                      "invertDirection": false,
                      "totalTime": {
                        "value": 3.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "isExtra": false,
                      "deadOption": "AllValid",
                      "immobilizedTime": 0.0,
                      "damageMultiplier": null,
                      "ignoreHitEffect": false
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SwitchAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "options",
                      "[0]",
                      "actionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[1]"
                    ],
                    "serverActionIndex": 11,
                    "nestedCondition": {
                      "startFrame": 21,
                      "endFrame": 24,
                      "actionIndex": 11,
                      "actionPath": [
                        "timelineActions[5]",
                        "_sequenceActionData",
                        "actionData",
                        "[1]",
                        "options",
                        "[0]",
                        "actionData",
                        "actionData",
                        "[0]",
                        "options",
                        "[1]"
                      ],
                      "conditions": [
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "Equals",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "EntityBB_combo_index",
                            "levelValues": null
                          },
                          "right": {
                            "value": 0.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "skillTypes": [],
                          "poise": null,
                          "superArmor": null,
                          "twoDirectionAngle": null,
                          "targetAngle": null,
                          "damageDecorateMask": null,
                          "contextBuffId": null,
                          "objectTypeMatch": null,
                          "deckAttributeCompare": null,
                          "probability": null,
                          "anyConditionGroups": [],
                          "anyConditionNegated": []
                        }
                      ],
                      "succeedActions": [],
                      "failActions": [
                        {
                          "actionType": "SwitchAction",
                          "actionIndex": 1,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[1]",
                            "options",
                            "[0]",
                            "actionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[2]"
                          ],
                          "serverActionIndex": 11,
                          "nestedCondition": {
                            "startFrame": 21,
                            "endFrame": 24,
                            "actionIndex": 11,
                            "actionPath": [
                              "timelineActions[5]",
                              "_sequenceActionData",
                              "actionData",
                              "[1]",
                              "options",
                              "[0]",
                              "actionData",
                              "actionData",
                              "[0]",
                              "options",
                              "[2]"
                            ],
                            "conditions": [
                              {
                                "sourceType": "CompareFloat",
                                "supported": true,
                                "comparison": "Equals",
                                "left": {
                                  "value": 0.0,
                                  "blackboardKey": "EntityBB_combo_index",
                                  "levelValues": null
                                },
                                "right": {
                                  "value": 1.0,
                                  "blackboardKey": null,
                                  "levelValues": null
                                },
                                "skillTypes": [],
                                "poise": null,
                                "superArmor": null,
                                "twoDirectionAngle": null,
                                "targetAngle": null,
                                "damageDecorateMask": null,
                                "contextBuffId": null,
                                "objectTypeMatch": null,
                                "deckAttributeCompare": null,
                                "probability": null,
                                "anyConditionGroups": [],
                                "anyConditionNegated": []
                              }
                            ],
                            "succeedActions": [
                              {
                                "actionType": "KnockDownAction",
                                "actionIndex": 0,
                                "actionPath": [
                                  "timelineActions[5]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[1]",
                                  "options",
                                  "[0]",
                                  "actionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[2]",
                                  "actionData",
                                  "actionData",
                                  "[0]"
                                ],
                                "serverActionIndex": 14,
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null,
                                "knockDownOutput": {
                                  "startFrame": 21,
                                  "endFrame": 24,
                                  "actionIndex": 14,
                                  "source": {
                                    "targetSource": "Owner",
                                    "targetGroupKey": "",
                                    "selectorOwner": "ActionOwner",
                                    "ownerContextKey": "",
                                    "centerType": "ActionSource",
                                    "centerContextKey": "",
                                    "centerToGround": false,
                                    "target": "ActionSource",
                                    "targetContextKey": "",
                                    "enableAdvancedDirection": false,
                                    "selectorDirection": "SourceForward",
                                    "finderType": null,
                                    "validatorTypes": [],
                                    "postProcessorTypes": []
                                  },
                                  "target": {
                                    "targetSource": "Context",
                                    "targetGroupKey": "smart_target",
                                    "selectorOwner": "ActionOwner",
                                    "ownerContextKey": "",
                                    "centerType": "ActionSource",
                                    "centerContextKey": "",
                                    "centerToGround": false,
                                    "target": "ActionSource",
                                    "targetContextKey": "",
                                    "enableAdvancedDirection": false,
                                    "selectorDirection": "SourceForward",
                                    "finderType": null,
                                    "validatorTypes": [],
                                    "postProcessorTypes": []
                                  },
                                  "forceKnockDown": false,
                                  "duration": {
                                    "value": 2.0,
                                    "blackboardKey": null,
                                    "levelValues": null
                                  },
                                  "faceDirectionType": "TargetToSource",
                                  "immobilizedTime": 1.0,
                                  "isExtra": false,
                                  "deadOption": "AllValid",
                                  "returnTrueWhen": "Always",
                                  "sequenceIndex": -1,
                                  "actionPath": [
                                    "timelineActions[5]",
                                    "_sequenceActionData",
                                    "actionData",
                                    "[1]",
                                    "options",
                                    "[0]",
                                    "actionData",
                                    "actionData",
                                    "[0]",
                                    "options",
                                    "[2]",
                                    "actionData",
                                    "actionData",
                                    "[0]"
                                  ]
                                }
                              }
                            ],
                            "failActions": [
                              {
                                "actionType": "SwitchAction",
                                "actionIndex": 2,
                                "actionPath": [
                                  "timelineActions[5]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[1]",
                                  "options",
                                  "[0]",
                                  "actionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[3]"
                                ],
                                "serverActionIndex": 11,
                                "nestedCondition": {
                                  "startFrame": 21,
                                  "endFrame": 24,
                                  "actionIndex": 11,
                                  "actionPath": [
                                    "timelineActions[5]",
                                    "_sequenceActionData",
                                    "actionData",
                                    "[1]",
                                    "options",
                                    "[0]",
                                    "actionData",
                                    "actionData",
                                    "[0]",
                                    "options",
                                    "[3]"
                                  ],
                                  "conditions": [
                                    {
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "Equals",
                                      "left": {
                                        "value": 0.0,
                                        "blackboardKey": "EntityBB_combo_index",
                                        "levelValues": null
                                      },
                                      "right": {
                                        "value": 3.0,
                                        "blackboardKey": null,
                                        "levelValues": null
                                      },
                                      "skillTypes": [],
                                      "poise": null,
                                      "superArmor": null,
                                      "twoDirectionAngle": null,
                                      "targetAngle": null,
                                      "damageDecorateMask": null,
                                      "contextBuffId": null,
                                      "objectTypeMatch": null,
                                      "deckAttributeCompare": null,
                                      "probability": null,
                                      "anyConditionGroups": [],
                                      "anyConditionNegated": []
                                    }
                                  ],
                                  "succeedActions": [
                                    {
                                      "actionType": "CrushAction",
                                      "actionIndex": 0,
                                      "actionPath": [
                                        "timelineActions[5]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[1]",
                                        "options",
                                        "[0]",
                                        "actionData",
                                        "actionData",
                                        "[0]",
                                        "options",
                                        "[3]",
                                        "actionData",
                                        "actionData",
                                        "[0]"
                                      ],
                                      "serverActionIndex": 15,
                                      "legacyBuffFinish": null,
                                      "skillCooldownAdjustment": null,
                                      "buffIgnite": null,
                                      "physicalInfliction": {
                                        "physicalType": "crush",
                                        "attackerTarget": {
                                          "targetSource": "Owner",
                                          "targetGroupKey": "",
                                          "selectorOwner": "ActionOwner",
                                          "ownerContextKey": "",
                                          "centerType": "ActionSource",
                                          "centerContextKey": "",
                                          "centerToGround": false,
                                          "target": "ActionSource",
                                          "targetContextKey": "",
                                          "enableAdvancedDirection": false,
                                          "selectorDirection": "SourceForward",
                                          "finderType": null,
                                          "validatorTypes": [],
                                          "postProcessorTypes": []
                                        },
                                        "target": {
                                          "targetSource": "Context",
                                          "targetGroupKey": "smart_target",
                                          "selectorOwner": "ActionOwner",
                                          "ownerContextKey": "",
                                          "centerType": "ActionSource",
                                          "centerContextKey": "",
                                          "centerToGround": false,
                                          "target": "ActionSource",
                                          "targetContextKey": "",
                                          "enableAdvancedDirection": false,
                                          "selectorDirection": "SourceForward",
                                          "finderType": null,
                                          "validatorTypes": [],
                                          "postProcessorTypes": []
                                        },
                                        "blowOffDistance": {
                                          "value": 3.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "distanceRandomRange": {
                                          "value": 0.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "overwriteHeight": false,
                                        "blowOffHeight": {
                                          "value": 0.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "directionType": "SourceToTarget",
                                        "sourceMountPoint": "None",
                                        "targetMountPoint": "None",
                                        "customSourceAndTarget": false,
                                        "clampToXZ": true,
                                        "invertDirection": false,
                                        "totalTime": {
                                          "value": 3.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "isExtra": false,
                                        "deadOption": "AllValid",
                                        "immobilizedTime": 0.0,
                                        "damageMultiplier": {
                                          "value": 1.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "ignoreHitEffect": false
                                      }
                                    }
                                  ],
                                  "failActions": [],
                                  "conditionNegated": [],
                                  "alwaysNext": false
                                },
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null
                              }
                            ],
                            "conditionNegated": [],
                            "alwaysNext": false
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        }
                      ],
                      "conditionNegated": [],
                      "alwaysNext": false
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
                "conditionNegated": [],
                "alwaysNext": true
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "failActions": [
            {
              "actionType": "SwitchAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "options",
                "[1]"
              ],
              "serverActionIndex": 10,
              "nestedCondition": {
                "startFrame": 21,
                "endFrame": 24,
                "actionIndex": 10,
                "actionPath": [
                  "timelineActions[5]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "options",
                  "[1]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "Equals",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "EntityBB_combo_type",
                      "levelValues": null
                    },
                    "right": {
                      "value": 0.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": null,
                    "targetAngle": null,
                    "damageDecorateMask": null,
                    "contextBuffId": null,
                    "objectTypeMatch": null,
                    "deckAttributeCompare": null,
                    "probability": null,
                    "anyConditionGroups": [],
                    "anyConditionNegated": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SwitchAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "options",
                      "[1]",
                      "actionData",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 16,
                    "nestedCondition": {
                      "startFrame": 21,
                      "endFrame": 24,
                      "actionIndex": 16,
                      "actionPath": [
                        "timelineActions[5]",
                        "_sequenceActionData",
                        "actionData",
                        "[1]",
                        "options",
                        "[1]",
                        "actionData",
                        "actionData",
                        "[0]",
                        "options",
                        "[0]"
                      ],
                      "conditions": [
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "Equals",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "EntityBB_combo_index",
                            "levelValues": null
                          },
                          "right": {
                            "value": 0.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "skillTypes": [],
                          "poise": null,
                          "superArmor": null,
                          "twoDirectionAngle": null,
                          "targetAngle": null,
                          "damageDecorateMask": null,
                          "contextBuffId": null,
                          "objectTypeMatch": null,
                          "deckAttributeCompare": null,
                          "probability": null,
                          "anyConditionGroups": [],
                          "anyConditionNegated": []
                        }
                      ],
                      "succeedActions": [
                        {
                          "actionType": "SpellInfliction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[1]",
                            "options",
                            "[1]",
                            "actionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[0]",
                            "actionData",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 17,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "infliction": {
                            "element": "heat",
                            "isExtra": false
                          }
                        }
                      ],
                      "failActions": [
                        {
                          "actionType": "SwitchAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[1]",
                            "options",
                            "[1]",
                            "actionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[1]"
                          ],
                          "serverActionIndex": 16,
                          "nestedCondition": {
                            "startFrame": 21,
                            "endFrame": 24,
                            "actionIndex": 16,
                            "actionPath": [
                              "timelineActions[5]",
                              "_sequenceActionData",
                              "actionData",
                              "[1]",
                              "options",
                              "[1]",
                              "actionData",
                              "actionData",
                              "[0]",
                              "options",
                              "[1]"
                            ],
                            "conditions": [
                              {
                                "sourceType": "CompareFloat",
                                "supported": true,
                                "comparison": "Equals",
                                "left": {
                                  "value": 0.0,
                                  "blackboardKey": "EntityBB_combo_index",
                                  "levelValues": null
                                },
                                "right": {
                                  "value": 2.0,
                                  "blackboardKey": null,
                                  "levelValues": null
                                },
                                "skillTypes": [],
                                "poise": null,
                                "superArmor": null,
                                "twoDirectionAngle": null,
                                "targetAngle": null,
                                "damageDecorateMask": null,
                                "contextBuffId": null,
                                "objectTypeMatch": null,
                                "deckAttributeCompare": null,
                                "probability": null,
                                "anyConditionGroups": [],
                                "anyConditionNegated": []
                              }
                            ],
                            "succeedActions": [
                              {
                                "actionType": "SpellInfliction",
                                "actionIndex": 0,
                                "actionPath": [
                                  "timelineActions[5]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[1]",
                                  "options",
                                  "[1]",
                                  "actionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[1]",
                                  "actionData",
                                  "actionData",
                                  "[0]"
                                ],
                                "serverActionIndex": 18,
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null,
                                "infliction": {
                                  "element": "cryo",
                                  "isExtra": false
                                }
                              }
                            ],
                            "failActions": [
                              {
                                "actionType": "SwitchAction",
                                "actionIndex": 1,
                                "actionPath": [
                                  "timelineActions[5]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[1]",
                                  "options",
                                  "[1]",
                                  "actionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[2]"
                                ],
                                "serverActionIndex": 16,
                                "nestedCondition": {
                                  "startFrame": 21,
                                  "endFrame": 24,
                                  "actionIndex": 16,
                                  "actionPath": [
                                    "timelineActions[5]",
                                    "_sequenceActionData",
                                    "actionData",
                                    "[1]",
                                    "options",
                                    "[1]",
                                    "actionData",
                                    "actionData",
                                    "[0]",
                                    "options",
                                    "[2]"
                                  ],
                                  "conditions": [
                                    {
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "Equals",
                                      "left": {
                                        "value": 0.0,
                                        "blackboardKey": "EntityBB_combo_index",
                                        "levelValues": null
                                      },
                                      "right": {
                                        "value": 1.0,
                                        "blackboardKey": null,
                                        "levelValues": null
                                      },
                                      "skillTypes": [],
                                      "poise": null,
                                      "superArmor": null,
                                      "twoDirectionAngle": null,
                                      "targetAngle": null,
                                      "damageDecorateMask": null,
                                      "contextBuffId": null,
                                      "objectTypeMatch": null,
                                      "deckAttributeCompare": null,
                                      "probability": null,
                                      "anyConditionGroups": [],
                                      "anyConditionNegated": []
                                    }
                                  ],
                                  "succeedActions": [
                                    {
                                      "actionType": "SpellInfliction",
                                      "actionIndex": 0,
                                      "actionPath": [
                                        "timelineActions[5]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[1]",
                                        "options",
                                        "[1]",
                                        "actionData",
                                        "actionData",
                                        "[0]",
                                        "options",
                                        "[2]",
                                        "actionData",
                                        "actionData",
                                        "[0]"
                                      ],
                                      "serverActionIndex": 19,
                                      "legacyBuffFinish": null,
                                      "skillCooldownAdjustment": null,
                                      "buffIgnite": null,
                                      "infliction": {
                                        "element": "electric",
                                        "isExtra": false
                                      }
                                    }
                                  ],
                                  "failActions": [
                                    {
                                      "actionType": "SwitchAction",
                                      "actionIndex": 2,
                                      "actionPath": [
                                        "timelineActions[5]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[1]",
                                        "options",
                                        "[1]",
                                        "actionData",
                                        "actionData",
                                        "[0]",
                                        "options",
                                        "[3]"
                                      ],
                                      "serverActionIndex": 16,
                                      "nestedCondition": {
                                        "startFrame": 21,
                                        "endFrame": 24,
                                        "actionIndex": 16,
                                        "actionPath": [
                                          "timelineActions[5]",
                                          "_sequenceActionData",
                                          "actionData",
                                          "[1]",
                                          "options",
                                          "[1]",
                                          "actionData",
                                          "actionData",
                                          "[0]",
                                          "options",
                                          "[3]"
                                        ],
                                        "conditions": [
                                          {
                                            "sourceType": "CompareFloat",
                                            "supported": true,
                                            "comparison": "Equals",
                                            "left": {
                                              "value": 0.0,
                                              "blackboardKey": "EntityBB_combo_index",
                                              "levelValues": null
                                            },
                                            "right": {
                                              "value": 3.0,
                                              "blackboardKey": null,
                                              "levelValues": null
                                            },
                                            "skillTypes": [],
                                            "poise": null,
                                            "superArmor": null,
                                            "twoDirectionAngle": null,
                                            "targetAngle": null,
                                            "damageDecorateMask": null,
                                            "contextBuffId": null,
                                            "objectTypeMatch": null,
                                            "deckAttributeCompare": null,
                                            "probability": null,
                                            "anyConditionGroups": [],
                                            "anyConditionNegated": []
                                          }
                                        ],
                                        "succeedActions": [
                                          {
                                            "actionType": "SpellInfliction",
                                            "actionIndex": 0,
                                            "actionPath": [
                                              "timelineActions[5]",
                                              "_sequenceActionData",
                                              "actionData",
                                              "[1]",
                                              "options",
                                              "[1]",
                                              "actionData",
                                              "actionData",
                                              "[0]",
                                              "options",
                                              "[3]",
                                              "actionData",
                                              "actionData",
                                              "[0]"
                                            ],
                                            "serverActionIndex": 20,
                                            "legacyBuffFinish": null,
                                            "skillCooldownAdjustment": null,
                                            "buffIgnite": null,
                                            "infliction": {
                                              "element": "nature",
                                              "isExtra": false
                                            }
                                          }
                                        ],
                                        "failActions": [],
                                        "conditionNegated": [],
                                        "alwaysNext": false
                                      },
                                      "legacyBuffFinish": null,
                                      "skillCooldownAdjustment": null,
                                      "buffIgnite": null
                                    }
                                  ],
                                  "conditionNegated": [],
                                  "alwaysNext": false
                                },
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null
                              }
                            ],
                            "conditionNegated": [],
                            "alwaysNext": false
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        }
                      ],
                      "conditionNegated": [],
                      "alwaysNext": true
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SwitchAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "options",
                      "[2]"
                    ],
                    "serverActionIndex": 10,
                    "nestedCondition": {
                      "startFrame": 21,
                      "endFrame": 24,
                      "actionIndex": 10,
                      "actionPath": [
                        "timelineActions[5]",
                        "_sequenceActionData",
                        "actionData",
                        "[1]",
                        "options",
                        "[2]"
                      ],
                      "conditions": [
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "Equals",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "EntityBB_combo_type",
                            "levelValues": null
                          },
                          "right": {
                            "value": 2.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "skillTypes": [],
                          "poise": null,
                          "superArmor": null,
                          "twoDirectionAngle": null,
                          "targetAngle": null,
                          "damageDecorateMask": null,
                          "contextBuffId": null,
                          "objectTypeMatch": null,
                          "deckAttributeCompare": null,
                          "probability": null,
                          "anyConditionGroups": [],
                          "anyConditionNegated": []
                        }
                      ],
                      "succeedActions": [],
                      "failActions": [],
                      "conditionNegated": [],
                      "alwaysNext": false
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
                "conditionNegated": [],
                "alwaysNext": false
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "conditionNegated": [],
          "alwaysNext": true
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 24,
          "resource": "ultimateEnergy",
          "amount": {
            "value": 0.2,
            "blackboardKey": "usp",
            "levelValues": [
              10.0,
              10.0,
              10.0,
              10.0,
              10.0,
              10.0,
              10.0,
              10.0,
              10.0,
              10.0,
              10.0,
              10.0
            ]
          },
          "coefficient": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "spGainKind": null,
          "spGainSource": null,
          "onlyMainOperator": false,
          "isPercentValue": false,
          "useUltimateRecoveryTag": false,
          "ultimateRecoveryTagId": 0,
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 5
        }
      ],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_physical_crushed",
        "buff_physical_fracture",
        "buff_physical_no_guard"
      ],
      "patch": {
        "levels": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "blackboard": {
          "atk_scale": [
            1.51,
            1.66,
            1.81,
            1.96,
            2.11,
            2.27,
            2.42,
            2.57,
            2.72,
            2.91,
            3.13,
            3.4
          ],
          "poise": [
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0
          ],
          "usp": [
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0
          ]
        },
        "cooldownSeconds": [
          25.0,
          25.0,
          25.0,
          25.0,
          25.0,
          25.0,
          25.0,
          25.0,
          25.0,
          25.0,
          25.0,
          24.0
        ],
        "costTypes": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "costValues": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 2.85,
          "isDynamic": false
        },
        {
          "key": "cam_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cam_duration",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "count",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "owner_mainchar_alpha",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "owner_mainchar_distance",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 4.0,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "EntityBB_combo_index",
        "EntityBB_combo_type",
        "atk_scale",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
        "select_radius",
        "usp"
      ],
      "blackboardProvenance": [
        {
          "key": "EntityBB_combo_index",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        },
        {
          "key": "EntityBB_combo_type",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        },
        {
          "key": "atb",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "cam_angle",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "cam_duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "count",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "input_angle",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "owner_mainchar_alpha",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "owner_mainchar_distance",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "select_radius",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "usp",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "CrushAction",
        "DamageAction",
        "FractureAction",
        "KnockDownAction",
        "ObtainCostAction",
        "SpellInfliction",
        "SwitchAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionIndex": 40,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "mainchar",
          "producerType": "FindTargetAction",
          "finderType": "CharacterTeamFinder",
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [
            "MainCharacterValidator"
          ],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "characterTeamSelectionRole": "controlledOperator",
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "options",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "Equals",
              "left": {
                "value": 0.0,
                "blackboardKey": "EntityBB_combo_type",
                "levelValues": null
              },
              "right": {
                "value": 1.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "skillTypes": [],
              "poise": null,
              "superArmor": null,
              "twoDirectionAngle": null,
              "targetAngle": null,
              "damageDecorateMask": null,
              "contextBuffId": null,
              "objectTypeMatch": null,
              "deckAttributeCompare": null,
              "probability": null,
              "anyConditionGroups": [],
              "anyConditionNegated": []
            }
          ],
          "succeedActions": [
            {
              "actionType": "SwitchAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "options",
                "[0]",
                "actionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 11,
              "nestedCondition": {
                "startFrame": 21,
                "endFrame": 24,
                "actionIndex": 11,
                "actionPath": [
                  "timelineActions[5]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "options",
                  "[0]",
                  "actionData",
                  "actionData",
                  "[0]",
                  "options",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "Equals",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "EntityBB_combo_index",
                      "levelValues": null
                    },
                    "right": {
                      "value": 2.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": null,
                    "targetAngle": null,
                    "damageDecorateMask": null,
                    "contextBuffId": null,
                    "objectTypeMatch": null,
                    "deckAttributeCompare": null,
                    "probability": null,
                    "anyConditionGroups": [],
                    "anyConditionNegated": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "FractureAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "options",
                      "[0]",
                      "actionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[0]",
                      "actionData",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 12,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "physicalInfliction": {
                      "physicalType": "fracture",
                      "attackerTarget": {
                        "targetSource": "Owner",
                        "targetGroupKey": "",
                        "selectorOwner": "ActionOwner",
                        "ownerContextKey": "",
                        "centerType": "ActionSource",
                        "centerContextKey": "",
                        "centerToGround": false,
                        "target": "ActionSource",
                        "targetContextKey": "",
                        "enableAdvancedDirection": false,
                        "selectorDirection": "SourceForward",
                        "finderType": null,
                        "validatorTypes": [],
                        "postProcessorTypes": []
                      },
                      "target": {
                        "targetSource": "Context",
                        "targetGroupKey": "smart_target",
                        "selectorOwner": "ActionOwner",
                        "ownerContextKey": "",
                        "centerType": "ActionSource",
                        "centerContextKey": "",
                        "centerToGround": false,
                        "target": "ActionSource",
                        "targetContextKey": "",
                        "enableAdvancedDirection": false,
                        "selectorDirection": "SourceForward",
                        "finderType": null,
                        "validatorTypes": [],
                        "postProcessorTypes": []
                      },
                      "blowOffDistance": {
                        "value": 3.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "distanceRandomRange": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "overwriteHeight": false,
                      "blowOffHeight": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "directionType": "SourceToTarget",
                      "sourceMountPoint": "None",
                      "targetMountPoint": "None",
                      "customSourceAndTarget": false,
                      "clampToXZ": true,
                      "invertDirection": false,
                      "totalTime": {
                        "value": 3.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "isExtra": false,
                      "deadOption": "AllValid",
                      "immobilizedTime": 0.0,
                      "damageMultiplier": null,
                      "ignoreHitEffect": false
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SwitchAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "options",
                      "[0]",
                      "actionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[1]"
                    ],
                    "serverActionIndex": 11,
                    "nestedCondition": {
                      "startFrame": 21,
                      "endFrame": 24,
                      "actionIndex": 11,
                      "actionPath": [
                        "timelineActions[5]",
                        "_sequenceActionData",
                        "actionData",
                        "[1]",
                        "options",
                        "[0]",
                        "actionData",
                        "actionData",
                        "[0]",
                        "options",
                        "[1]"
                      ],
                      "conditions": [
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "Equals",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "EntityBB_combo_index",
                            "levelValues": null
                          },
                          "right": {
                            "value": 0.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "skillTypes": [],
                          "poise": null,
                          "superArmor": null,
                          "twoDirectionAngle": null,
                          "targetAngle": null,
                          "damageDecorateMask": null,
                          "contextBuffId": null,
                          "objectTypeMatch": null,
                          "deckAttributeCompare": null,
                          "probability": null,
                          "anyConditionGroups": [],
                          "anyConditionNegated": []
                        }
                      ],
                      "succeedActions": [],
                      "failActions": [
                        {
                          "actionType": "SwitchAction",
                          "actionIndex": 1,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[1]",
                            "options",
                            "[0]",
                            "actionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[2]"
                          ],
                          "serverActionIndex": 11,
                          "nestedCondition": {
                            "startFrame": 21,
                            "endFrame": 24,
                            "actionIndex": 11,
                            "actionPath": [
                              "timelineActions[5]",
                              "_sequenceActionData",
                              "actionData",
                              "[1]",
                              "options",
                              "[0]",
                              "actionData",
                              "actionData",
                              "[0]",
                              "options",
                              "[2]"
                            ],
                            "conditions": [
                              {
                                "sourceType": "CompareFloat",
                                "supported": true,
                                "comparison": "Equals",
                                "left": {
                                  "value": 0.0,
                                  "blackboardKey": "EntityBB_combo_index",
                                  "levelValues": null
                                },
                                "right": {
                                  "value": 1.0,
                                  "blackboardKey": null,
                                  "levelValues": null
                                },
                                "skillTypes": [],
                                "poise": null,
                                "superArmor": null,
                                "twoDirectionAngle": null,
                                "targetAngle": null,
                                "damageDecorateMask": null,
                                "contextBuffId": null,
                                "objectTypeMatch": null,
                                "deckAttributeCompare": null,
                                "probability": null,
                                "anyConditionGroups": [],
                                "anyConditionNegated": []
                              }
                            ],
                            "succeedActions": [
                              {
                                "actionType": "KnockDownAction",
                                "actionIndex": 0,
                                "actionPath": [
                                  "timelineActions[5]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[1]",
                                  "options",
                                  "[0]",
                                  "actionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[2]",
                                  "actionData",
                                  "actionData",
                                  "[0]"
                                ],
                                "serverActionIndex": 14,
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null,
                                "knockDownOutput": {
                                  "startFrame": 21,
                                  "endFrame": 24,
                                  "actionIndex": 14,
                                  "source": {
                                    "targetSource": "Owner",
                                    "targetGroupKey": "",
                                    "selectorOwner": "ActionOwner",
                                    "ownerContextKey": "",
                                    "centerType": "ActionSource",
                                    "centerContextKey": "",
                                    "centerToGround": false,
                                    "target": "ActionSource",
                                    "targetContextKey": "",
                                    "enableAdvancedDirection": false,
                                    "selectorDirection": "SourceForward",
                                    "finderType": null,
                                    "validatorTypes": [],
                                    "postProcessorTypes": []
                                  },
                                  "target": {
                                    "targetSource": "Context",
                                    "targetGroupKey": "smart_target",
                                    "selectorOwner": "ActionOwner",
                                    "ownerContextKey": "",
                                    "centerType": "ActionSource",
                                    "centerContextKey": "",
                                    "centerToGround": false,
                                    "target": "ActionSource",
                                    "targetContextKey": "",
                                    "enableAdvancedDirection": false,
                                    "selectorDirection": "SourceForward",
                                    "finderType": null,
                                    "validatorTypes": [],
                                    "postProcessorTypes": []
                                  },
                                  "forceKnockDown": false,
                                  "duration": {
                                    "value": 2.0,
                                    "blackboardKey": null,
                                    "levelValues": null
                                  },
                                  "faceDirectionType": "TargetToSource",
                                  "immobilizedTime": 1.0,
                                  "isExtra": false,
                                  "deadOption": "AllValid",
                                  "returnTrueWhen": "Always",
                                  "sequenceIndex": -1,
                                  "actionPath": [
                                    "timelineActions[5]",
                                    "_sequenceActionData",
                                    "actionData",
                                    "[1]",
                                    "options",
                                    "[0]",
                                    "actionData",
                                    "actionData",
                                    "[0]",
                                    "options",
                                    "[2]",
                                    "actionData",
                                    "actionData",
                                    "[0]"
                                  ]
                                }
                              }
                            ],
                            "failActions": [
                              {
                                "actionType": "SwitchAction",
                                "actionIndex": 2,
                                "actionPath": [
                                  "timelineActions[5]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[1]",
                                  "options",
                                  "[0]",
                                  "actionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[3]"
                                ],
                                "serverActionIndex": 11,
                                "nestedCondition": {
                                  "startFrame": 21,
                                  "endFrame": 24,
                                  "actionIndex": 11,
                                  "actionPath": [
                                    "timelineActions[5]",
                                    "_sequenceActionData",
                                    "actionData",
                                    "[1]",
                                    "options",
                                    "[0]",
                                    "actionData",
                                    "actionData",
                                    "[0]",
                                    "options",
                                    "[3]"
                                  ],
                                  "conditions": [
                                    {
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "Equals",
                                      "left": {
                                        "value": 0.0,
                                        "blackboardKey": "EntityBB_combo_index",
                                        "levelValues": null
                                      },
                                      "right": {
                                        "value": 3.0,
                                        "blackboardKey": null,
                                        "levelValues": null
                                      },
                                      "skillTypes": [],
                                      "poise": null,
                                      "superArmor": null,
                                      "twoDirectionAngle": null,
                                      "targetAngle": null,
                                      "damageDecorateMask": null,
                                      "contextBuffId": null,
                                      "objectTypeMatch": null,
                                      "deckAttributeCompare": null,
                                      "probability": null,
                                      "anyConditionGroups": [],
                                      "anyConditionNegated": []
                                    }
                                  ],
                                  "succeedActions": [
                                    {
                                      "actionType": "CrushAction",
                                      "actionIndex": 0,
                                      "actionPath": [
                                        "timelineActions[5]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[1]",
                                        "options",
                                        "[0]",
                                        "actionData",
                                        "actionData",
                                        "[0]",
                                        "options",
                                        "[3]",
                                        "actionData",
                                        "actionData",
                                        "[0]"
                                      ],
                                      "serverActionIndex": 15,
                                      "legacyBuffFinish": null,
                                      "skillCooldownAdjustment": null,
                                      "buffIgnite": null,
                                      "physicalInfliction": {
                                        "physicalType": "crush",
                                        "attackerTarget": {
                                          "targetSource": "Owner",
                                          "targetGroupKey": "",
                                          "selectorOwner": "ActionOwner",
                                          "ownerContextKey": "",
                                          "centerType": "ActionSource",
                                          "centerContextKey": "",
                                          "centerToGround": false,
                                          "target": "ActionSource",
                                          "targetContextKey": "",
                                          "enableAdvancedDirection": false,
                                          "selectorDirection": "SourceForward",
                                          "finderType": null,
                                          "validatorTypes": [],
                                          "postProcessorTypes": []
                                        },
                                        "target": {
                                          "targetSource": "Context",
                                          "targetGroupKey": "smart_target",
                                          "selectorOwner": "ActionOwner",
                                          "ownerContextKey": "",
                                          "centerType": "ActionSource",
                                          "centerContextKey": "",
                                          "centerToGround": false,
                                          "target": "ActionSource",
                                          "targetContextKey": "",
                                          "enableAdvancedDirection": false,
                                          "selectorDirection": "SourceForward",
                                          "finderType": null,
                                          "validatorTypes": [],
                                          "postProcessorTypes": []
                                        },
                                        "blowOffDistance": {
                                          "value": 3.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "distanceRandomRange": {
                                          "value": 0.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "overwriteHeight": false,
                                        "blowOffHeight": {
                                          "value": 0.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "directionType": "SourceToTarget",
                                        "sourceMountPoint": "None",
                                        "targetMountPoint": "None",
                                        "customSourceAndTarget": false,
                                        "clampToXZ": true,
                                        "invertDirection": false,
                                        "totalTime": {
                                          "value": 3.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "isExtra": false,
                                        "deadOption": "AllValid",
                                        "immobilizedTime": 0.0,
                                        "damageMultiplier": {
                                          "value": 1.0,
                                          "blackboardKey": null,
                                          "levelValues": null
                                        },
                                        "ignoreHitEffect": false
                                      }
                                    }
                                  ],
                                  "failActions": [],
                                  "conditionNegated": [],
                                  "alwaysNext": false
                                },
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null
                              }
                            ],
                            "conditionNegated": [],
                            "alwaysNext": false
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        }
                      ],
                      "conditionNegated": [],
                      "alwaysNext": false
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
                "conditionNegated": [],
                "alwaysNext": true
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "failActions": [
            {
              "actionType": "SwitchAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "options",
                "[1]"
              ],
              "serverActionIndex": 10,
              "nestedCondition": {
                "startFrame": 21,
                "endFrame": 24,
                "actionIndex": 10,
                "actionPath": [
                  "timelineActions[5]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "options",
                  "[1]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "Equals",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "EntityBB_combo_type",
                      "levelValues": null
                    },
                    "right": {
                      "value": 0.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": null,
                    "targetAngle": null,
                    "damageDecorateMask": null,
                    "contextBuffId": null,
                    "objectTypeMatch": null,
                    "deckAttributeCompare": null,
                    "probability": null,
                    "anyConditionGroups": [],
                    "anyConditionNegated": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SwitchAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "options",
                      "[1]",
                      "actionData",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 16,
                    "nestedCondition": {
                      "startFrame": 21,
                      "endFrame": 24,
                      "actionIndex": 16,
                      "actionPath": [
                        "timelineActions[5]",
                        "_sequenceActionData",
                        "actionData",
                        "[1]",
                        "options",
                        "[1]",
                        "actionData",
                        "actionData",
                        "[0]",
                        "options",
                        "[0]"
                      ],
                      "conditions": [
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "Equals",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "EntityBB_combo_index",
                            "levelValues": null
                          },
                          "right": {
                            "value": 0.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "skillTypes": [],
                          "poise": null,
                          "superArmor": null,
                          "twoDirectionAngle": null,
                          "targetAngle": null,
                          "damageDecorateMask": null,
                          "contextBuffId": null,
                          "objectTypeMatch": null,
                          "deckAttributeCompare": null,
                          "probability": null,
                          "anyConditionGroups": [],
                          "anyConditionNegated": []
                        }
                      ],
                      "succeedActions": [
                        {
                          "actionType": "SpellInfliction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[1]",
                            "options",
                            "[1]",
                            "actionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[0]",
                            "actionData",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 17,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "infliction": {
                            "element": "heat",
                            "isExtra": false
                          }
                        }
                      ],
                      "failActions": [
                        {
                          "actionType": "SwitchAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[1]",
                            "options",
                            "[1]",
                            "actionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[1]"
                          ],
                          "serverActionIndex": 16,
                          "nestedCondition": {
                            "startFrame": 21,
                            "endFrame": 24,
                            "actionIndex": 16,
                            "actionPath": [
                              "timelineActions[5]",
                              "_sequenceActionData",
                              "actionData",
                              "[1]",
                              "options",
                              "[1]",
                              "actionData",
                              "actionData",
                              "[0]",
                              "options",
                              "[1]"
                            ],
                            "conditions": [
                              {
                                "sourceType": "CompareFloat",
                                "supported": true,
                                "comparison": "Equals",
                                "left": {
                                  "value": 0.0,
                                  "blackboardKey": "EntityBB_combo_index",
                                  "levelValues": null
                                },
                                "right": {
                                  "value": 2.0,
                                  "blackboardKey": null,
                                  "levelValues": null
                                },
                                "skillTypes": [],
                                "poise": null,
                                "superArmor": null,
                                "twoDirectionAngle": null,
                                "targetAngle": null,
                                "damageDecorateMask": null,
                                "contextBuffId": null,
                                "objectTypeMatch": null,
                                "deckAttributeCompare": null,
                                "probability": null,
                                "anyConditionGroups": [],
                                "anyConditionNegated": []
                              }
                            ],
                            "succeedActions": [
                              {
                                "actionType": "SpellInfliction",
                                "actionIndex": 0,
                                "actionPath": [
                                  "timelineActions[5]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[1]",
                                  "options",
                                  "[1]",
                                  "actionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[1]",
                                  "actionData",
                                  "actionData",
                                  "[0]"
                                ],
                                "serverActionIndex": 18,
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null,
                                "infliction": {
                                  "element": "cryo",
                                  "isExtra": false
                                }
                              }
                            ],
                            "failActions": [
                              {
                                "actionType": "SwitchAction",
                                "actionIndex": 1,
                                "actionPath": [
                                  "timelineActions[5]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[1]",
                                  "options",
                                  "[1]",
                                  "actionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[2]"
                                ],
                                "serverActionIndex": 16,
                                "nestedCondition": {
                                  "startFrame": 21,
                                  "endFrame": 24,
                                  "actionIndex": 16,
                                  "actionPath": [
                                    "timelineActions[5]",
                                    "_sequenceActionData",
                                    "actionData",
                                    "[1]",
                                    "options",
                                    "[1]",
                                    "actionData",
                                    "actionData",
                                    "[0]",
                                    "options",
                                    "[2]"
                                  ],
                                  "conditions": [
                                    {
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "Equals",
                                      "left": {
                                        "value": 0.0,
                                        "blackboardKey": "EntityBB_combo_index",
                                        "levelValues": null
                                      },
                                      "right": {
                                        "value": 1.0,
                                        "blackboardKey": null,
                                        "levelValues": null
                                      },
                                      "skillTypes": [],
                                      "poise": null,
                                      "superArmor": null,
                                      "twoDirectionAngle": null,
                                      "targetAngle": null,
                                      "damageDecorateMask": null,
                                      "contextBuffId": null,
                                      "objectTypeMatch": null,
                                      "deckAttributeCompare": null,
                                      "probability": null,
                                      "anyConditionGroups": [],
                                      "anyConditionNegated": []
                                    }
                                  ],
                                  "succeedActions": [
                                    {
                                      "actionType": "SpellInfliction",
                                      "actionIndex": 0,
                                      "actionPath": [
                                        "timelineActions[5]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[1]",
                                        "options",
                                        "[1]",
                                        "actionData",
                                        "actionData",
                                        "[0]",
                                        "options",
                                        "[2]",
                                        "actionData",
                                        "actionData",
                                        "[0]"
                                      ],
                                      "serverActionIndex": 19,
                                      "legacyBuffFinish": null,
                                      "skillCooldownAdjustment": null,
                                      "buffIgnite": null,
                                      "infliction": {
                                        "element": "electric",
                                        "isExtra": false
                                      }
                                    }
                                  ],
                                  "failActions": [
                                    {
                                      "actionType": "SwitchAction",
                                      "actionIndex": 2,
                                      "actionPath": [
                                        "timelineActions[5]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[1]",
                                        "options",
                                        "[1]",
                                        "actionData",
                                        "actionData",
                                        "[0]",
                                        "options",
                                        "[3]"
                                      ],
                                      "serverActionIndex": 16,
                                      "nestedCondition": {
                                        "startFrame": 21,
                                        "endFrame": 24,
                                        "actionIndex": 16,
                                        "actionPath": [
                                          "timelineActions[5]",
                                          "_sequenceActionData",
                                          "actionData",
                                          "[1]",
                                          "options",
                                          "[1]",
                                          "actionData",
                                          "actionData",
                                          "[0]",
                                          "options",
                                          "[3]"
                                        ],
                                        "conditions": [
                                          {
                                            "sourceType": "CompareFloat",
                                            "supported": true,
                                            "comparison": "Equals",
                                            "left": {
                                              "value": 0.0,
                                              "blackboardKey": "EntityBB_combo_index",
                                              "levelValues": null
                                            },
                                            "right": {
                                              "value": 3.0,
                                              "blackboardKey": null,
                                              "levelValues": null
                                            },
                                            "skillTypes": [],
                                            "poise": null,
                                            "superArmor": null,
                                            "twoDirectionAngle": null,
                                            "targetAngle": null,
                                            "damageDecorateMask": null,
                                            "contextBuffId": null,
                                            "objectTypeMatch": null,
                                            "deckAttributeCompare": null,
                                            "probability": null,
                                            "anyConditionGroups": [],
                                            "anyConditionNegated": []
                                          }
                                        ],
                                        "succeedActions": [
                                          {
                                            "actionType": "SpellInfliction",
                                            "actionIndex": 0,
                                            "actionPath": [
                                              "timelineActions[5]",
                                              "_sequenceActionData",
                                              "actionData",
                                              "[1]",
                                              "options",
                                              "[1]",
                                              "actionData",
                                              "actionData",
                                              "[0]",
                                              "options",
                                              "[3]",
                                              "actionData",
                                              "actionData",
                                              "[0]"
                                            ],
                                            "serverActionIndex": 20,
                                            "legacyBuffFinish": null,
                                            "skillCooldownAdjustment": null,
                                            "buffIgnite": null,
                                            "infliction": {
                                              "element": "nature",
                                              "isExtra": false
                                            }
                                          }
                                        ],
                                        "failActions": [],
                                        "conditionNegated": [],
                                        "alwaysNext": false
                                      },
                                      "legacyBuffFinish": null,
                                      "skillCooldownAdjustment": null,
                                      "buffIgnite": null
                                    }
                                  ],
                                  "conditionNegated": [],
                                  "alwaysNext": false
                                },
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null
                              }
                            ],
                            "conditionNegated": [],
                            "alwaysNext": false
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        }
                      ],
                      "conditionNegated": [],
                      "alwaysNext": true
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SwitchAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "options",
                      "[2]"
                    ],
                    "serverActionIndex": 10,
                    "nestedCondition": {
                      "startFrame": 21,
                      "endFrame": 24,
                      "actionIndex": 10,
                      "actionPath": [
                        "timelineActions[5]",
                        "_sequenceActionData",
                        "actionData",
                        "[1]",
                        "options",
                        "[2]"
                      ],
                      "conditions": [
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "Equals",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "EntityBB_combo_type",
                            "levelValues": null
                          },
                          "right": {
                            "value": 2.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "skillTypes": [],
                          "poise": null,
                          "superArmor": null,
                          "twoDirectionAngle": null,
                          "targetAngle": null,
                          "damageDecorateMask": null,
                          "contextBuffId": null,
                          "objectTypeMatch": null,
                          "deckAttributeCompare": null,
                          "probability": null,
                          "anyConditionGroups": [],
                          "anyConditionNegated": []
                        }
                      ],
                      "succeedActions": [],
                      "failActions": [],
                      "conditionNegated": [],
                      "alwaysNext": false
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
                "conditionNegated": [],
                "alwaysNext": false
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "conditionNegated": [],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionIndex": 38,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckMainCharacterCondition",
              "supported": true,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "poise": null,
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "superArmor": null,
              "twoDirectionAngle": null,
              "targetAngle": null,
              "damageDecorateMask": null,
              "contextBuffId": null,
              "objectTypeMatch": null,
              "deckAttributeCompare": null,
              "probability": null,
              "anyConditionGroups": [],
              "anyConditionNegated": []
            }
          ],
          "succeedActions": [],
          "failActions": [
            {
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[12]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 40,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 17,
          "actionIndex": 37,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.667,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": "ComboSkill",
          "inlineCurve": [],
          "finishByAction": false,
          "ignoredTargets": [
            "caster"
          ],
          "targets": [],
          "omittedAbilityEntityTargets": 1,
          "ignoredAbilityEntityTargets": [
            {
              "reference": {
                "targetSource": "InstantSearch",
                "targetGroupKey": "",
                "selectorOwner": "ActionOwner",
                "ownerContextKey": "",
                "centerType": "ActionSource",
                "centerContextKey": "",
                "centerToGround": false,
                "target": "ActionSource",
                "targetContextKey": "",
                "enableAdvancedDirection": false,
                "selectorDirection": "SourceForward",
                "finderType": "OwnerSpawnedEntityFinder",
                "validatorTypes": [],
                "postProcessorTypes": [],
                "finderSpawnedObjectType": "AbilityEntity"
              },
              "spawnedObjectType": "AbilityEntity",
              "tagQueries": []
            }
          ],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 11,
          "effectAbilityEntityTargets": []
        }
      ],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "basicAttack1",
      "skillId": "chr_0023_antal_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0023_antal_attack1.json",
      "timelineBlockFrames": 15,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 8,
      "allowNextWindows": [
        {
          "startFrame": 15,
          "endFrame": 26,
          "skillIds": [
            "chr_0023_antal_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 26,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0023_antal_attack2",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": false,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.0,
                "blackboardKey": ""
              }
            }
          ]
        }
      ],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 6,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 67,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 8,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 35,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 15,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 21,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 7,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 69,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 43,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 55,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 26,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 26,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 8,
          "projectileId": "projectile_chr_0023_antal_normal_attack1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_attack1_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 8,
          "actionOrder": [
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_normal_attack1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_attack1_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_attack1_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.23,
                  0.25,
                  0.28,
                  0.3,
                  0.32,
                  0.35,
                  0.37,
                  0.39,
                  0.41,
                  0.44,
                  0.48,
                  0.52
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.23,
                      0.25,
                      0.28,
                      0.3,
                      0.32,
                      0.35,
                      0.37,
                      0.39,
                      0.41,
                      0.44,
                      0.48,
                      0.52
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 128
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckMainCharacterCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                },
                {
                  "sourceType": "CheckEntityNum",
                  "supported": false,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityCount": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": false,
                    "excludeDeadEntity": false,
                    "storeKey": ""
                  },
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0
                      ]
                    },
                    "coefficient": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "spGainKind": "gain",
                    "spGainSource": "normalAttack",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                }
              ],
              "failActions": [],
              "conditionNegated": [
                false,
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "patch": {
        "levels": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "blackboard": {
          "atb": [
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0
          ],
          "atk_scale": [
            0.23,
            0.25,
            0.28,
            0.3,
            0.32,
            0.35,
            0.37,
            0.39,
            0.41,
            0.44,
            0.48,
            0.52
          ]
        },
        "cooldownSeconds": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ],
        "costTypes": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "costValues": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.25,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [],
      "blackboardProvenance": [
        {
          "key": "atb",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "basicAttack2",
      "skillId": "chr_0023_antal_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0023_antal_attack2.json",
      "timelineBlockFrames": 20,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 12,
      "allowNextWindows": [
        {
          "startFrame": 20,
          "endFrame": 31,
          "skillIds": [
            "chr_0023_antal_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 31,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0023_antal_attack3",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": false,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.0,
                "blackboardKey": ""
              }
            }
          ]
        }
      ],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 6,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 12,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 101,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 34,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 31,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 86,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 24,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 31,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 31,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 12,
          "projectileId": "projectile_chr_0023_antal_normal_attack2",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_attack2_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 12,
          "actionOrder": [
            3
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_normal_attack2",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_attack2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_attack2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.28,
                  0.31,
                  0.34,
                  0.36,
                  0.39,
                  0.42,
                  0.45,
                  0.48,
                  0.5,
                  0.54,
                  0.58,
                  0.63
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.28,
                      0.31,
                      0.34,
                      0.36,
                      0.39,
                      0.42,
                      0.45,
                      0.48,
                      0.5,
                      0.54,
                      0.58,
                      0.63
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 128
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckMainCharacterCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                },
                {
                  "sourceType": "CheckEntityNum",
                  "supported": false,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityCount": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": false,
                    "excludeDeadEntity": false,
                    "storeKey": ""
                  },
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0
                      ]
                    },
                    "coefficient": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "spGainKind": "gain",
                    "spGainSource": "normalAttack",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                }
              ],
              "failActions": [],
              "conditionNegated": [
                false,
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "patch": {
        "levels": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "blackboard": {
          "atb": [
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0
          ],
          "atk_scale": [
            0.28,
            0.31,
            0.34,
            0.36,
            0.39,
            0.42,
            0.45,
            0.48,
            0.5,
            0.54,
            0.58,
            0.63
          ],
          "display_atk_scale": [
            0.28,
            0.31,
            0.34,
            0.36,
            0.39,
            0.42,
            0.45,
            0.48,
            0.5,
            0.54,
            0.58,
            0.63
          ]
        },
        "cooldownSeconds": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ],
        "costTypes": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "costValues": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.25,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [],
      "blackboardProvenance": [
        {
          "key": "atb",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "display_atk_scale",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "basicAttack3",
      "skillId": "chr_0023_antal_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0023_antal_attack3.json",
      "timelineBlockFrames": 22,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 14,
      "allowNextWindows": [
        {
          "startFrame": 22,
          "endFrame": 33,
          "skillIds": [
            "chr_0023_antal_attack4"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 33,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0023_antal_attack4",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": false,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.0,
                "blackboardKey": ""
              }
            }
          ]
        }
      ],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 107,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 6,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 107,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 14,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 18,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 44,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 94,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 21,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 24,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 77,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 73,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 33,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 16,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 25,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 107,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 107,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 13,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 25,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 107,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 107,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 107,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 102,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 24,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 33,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 33,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [
        {
          "startFrame": 14,
          "endFrame": 14,
          "actionIndex": 3,
          "key": "atk_scale",
          "operation": "Multiply",
          "value": {
            "value": 0.5,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 3
        }
      ],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 14,
          "projectileId": "projectile_chr_0023_antal_normal_attack3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_attack3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 18,
          "projectileId": "projectile_chr_0023_antal_normal_attack3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_attack3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 14,
          "actionOrder": [
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_normal_attack3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.34,
                  0.37,
                  0.41,
                  0.44,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.61,
                  0.65,
                  0.71,
                  0.77
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.34,
                      0.37,
                      0.41,
                      0.44,
                      0.48,
                      0.51,
                      0.54,
                      0.58,
                      0.61,
                      0.65,
                      0.71,
                      0.77
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 128
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckMainCharacterCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                },
                {
                  "sourceType": "CheckEntityNum",
                  "supported": false,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityCount": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": false,
                    "excludeDeadEntity": false,
                    "storeKey": ""
                  },
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0
                      ]
                    },
                    "coefficient": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "spGainKind": "gain",
                    "spGainSource": "normalAttack",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                }
              ],
              "failActions": [],
              "conditionNegated": [
                false,
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 18,
          "actionOrder": [
            5
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_normal_attack3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.34,
                  0.37,
                  0.41,
                  0.44,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.61,
                  0.65,
                  0.71,
                  0.77
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.34,
                      0.37,
                      0.41,
                      0.44,
                      0.48,
                      0.51,
                      0.54,
                      0.58,
                      0.61,
                      0.65,
                      0.71,
                      0.77
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 128
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckMainCharacterCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                },
                {
                  "sourceType": "CheckEntityNum",
                  "supported": false,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityCount": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": false,
                    "excludeDeadEntity": false,
                    "storeKey": ""
                  },
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        0.0
                      ]
                    },
                    "coefficient": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "spGainKind": "gain",
                    "spGainSource": "normalAttack",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                }
              ],
              "failActions": [],
              "conditionNegated": [
                false,
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "patch": {
        "levels": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "blackboard": {
          "atb": [
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0
          ],
          "atk_scale": [
            0.34,
            0.37,
            0.41,
            0.44,
            0.48,
            0.51,
            0.54,
            0.58,
            0.61,
            0.65,
            0.71,
            0.77
          ]
        },
        "cooldownSeconds": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ],
        "costTypes": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "costValues": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.25,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [],
      "blackboardProvenance": [
        {
          "key": "atb",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "basicAttack4",
      "skillId": "chr_0023_antal_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0023_antal_attack4.json",
      "timelineBlockFrames": 38,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 27,
      "allowNextWindows": [
        {
          "startFrame": 38,
          "endFrame": 48,
          "skillIds": [
            "chr_0023_antal_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 48,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0023_antal_attack1",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": false,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.0,
                "blackboardKey": ""
              }
            }
          ]
        }
      ],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 109,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 6,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 109,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 27,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "LaunchProjectile",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 30,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 89,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 34,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 34,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 86,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 86,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 109,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 109,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 109,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 109,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 109,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 47,
          "endFrame": 107,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 19,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 48,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 48,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [
        {
          "startFrame": 27,
          "endFrame": 27,
          "actionIndex": 3,
          "key": "atk_scale",
          "operation": "Multiply",
          "value": {
            "value": 0.5,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 3
        }
      ],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 27,
          "projectileId": "projectile_chr_0023_antal_normal_attack4",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_attack4_powerattack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 27,
          "projectileId": "projectile_chr_0023_antal_normal_attack4",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_attack4_powerattack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 27,
          "actionOrder": [
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_normal_attack4",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_attack4_powerattack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_attack4_powerattack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[0]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckTimedMarkerCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "timedMarker": {
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "markerId": "have_recovered",
                    "blackboardKey": "",
                    "useBlackboardKey": false,
                    "returnTrueIfNotExists": true
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "DamageAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 2,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Pulse",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 1.1,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          0.51,
                          0.56,
                          0.61,
                          0.66,
                          0.71,
                          0.77,
                          0.82,
                          0.87,
                          0.92,
                          0.98,
                          1.06,
                          1.15
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 2097280
                    },
                    {
                      "damageType": "Physical",
                      "attributeType": "Poise",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "calculationMultiplier": null,
                      "poiseValue": {
                        "value": 0.0,
                        "blackboardKey": "poise",
                        "levelValues": [
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0
                        ]
                      },
                      "definiteValue": null,
                      "damageDecorateMask": 0
                    }
                  ]
                },
                {
                  "actionType": "IfElseAction",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 4,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 3,
                    "actionIndex": 4,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[2]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CheckMainCharacterCondition",
                        "supported": true,
                        "comparison": null,
                        "left": null,
                        "right": null,
                        "skillTypes": [],
                        "poise": null,
                        "mainOperator": {
                          "targetSource": "Source",
                          "targetGroupKey": ""
                        },
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      },
                      {
                        "sourceType": "CheckEntityNum",
                        "supported": false,
                        "comparison": null,
                        "left": null,
                        "right": null,
                        "skillTypes": [],
                        "entityCount": {
                          "targetSource": "Target",
                          "targetGroupKey": "",
                          "minimumCount": 1,
                          "comparison": "GE",
                          "containsHittableTarget": false,
                          "excludeDeadEntity": false,
                          "storeKey": ""
                        },
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "ObtainCostAction",
                        "actionIndex": 1,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[2]",
                          "succeedActions",
                          "actionData",
                          "[1]"
                        ],
                        "serverActionIndex": 8,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "resourceGain": {
                          "resource": "sp",
                          "amount": {
                            "value": 0.0,
                            "blackboardKey": "atb",
                            "levelValues": [
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0
                            ]
                          },
                          "coefficient": {
                            "value": 1.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "spGainKind": "gain",
                          "spGainSource": "normalAttack",
                          "onlyMainOperator": false,
                          "isPercentValue": false,
                          "useUltimateRecoveryTag": false,
                          "ultimateRecoveryTagId": 0,
                          "ignoreUltimateGainScalar": false
                        }
                      },
                      {
                        "actionType": "CreateTimedMarker",
                        "actionIndex": 2,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[2]",
                          "succeedActions",
                          "actionData",
                          "[2]"
                        ],
                        "serverActionIndex": 9,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "timedMarkerApplication": {
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "markerId": "have_recovered",
                          "duration": {
                            "value": 0.5,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "autoFinishByAction": false,
                          "useTimeDilationDt": false
                        }
                      }
                    ],
                    "failActions": [],
                    "conditionNegated": [
                      false,
                      false
                    ],
                    "alwaysNext": true
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "failActions": [
                {
                  "actionType": "DamageAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "failActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 10,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Pulse",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 1.1,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          0.51,
                          0.56,
                          0.61,
                          0.66,
                          0.71,
                          0.77,
                          0.82,
                          0.87,
                          0.92,
                          0.98,
                          1.06,
                          1.15
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 128
                    }
                  ]
                }
              ],
              "conditionNegated": [
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 27,
          "actionOrder": [
            5
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_normal_attack4",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_attack4_powerattack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_attack4_powerattack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[0]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckTimedMarkerCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "timedMarker": {
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "markerId": "have_recovered",
                    "blackboardKey": "",
                    "useBlackboardKey": false,
                    "returnTrueIfNotExists": true
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "DamageAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 2,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Pulse",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 1.1,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          0.51,
                          0.56,
                          0.61,
                          0.66,
                          0.71,
                          0.77,
                          0.82,
                          0.87,
                          0.92,
                          0.98,
                          1.06,
                          1.15
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 2097280
                    },
                    {
                      "damageType": "Physical",
                      "attributeType": "Poise",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "calculationMultiplier": null,
                      "poiseValue": {
                        "value": 0.0,
                        "blackboardKey": "poise",
                        "levelValues": [
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0,
                          15.0
                        ]
                      },
                      "definiteValue": null,
                      "damageDecorateMask": 0
                    }
                  ]
                },
                {
                  "actionType": "IfElseAction",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 4,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 3,
                    "actionIndex": 4,
                    "actionPath": [
                      "timelineActions[0]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[2]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CheckMainCharacterCondition",
                        "supported": true,
                        "comparison": null,
                        "left": null,
                        "right": null,
                        "skillTypes": [],
                        "poise": null,
                        "mainOperator": {
                          "targetSource": "Source",
                          "targetGroupKey": ""
                        },
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      },
                      {
                        "sourceType": "CheckEntityNum",
                        "supported": false,
                        "comparison": null,
                        "left": null,
                        "right": null,
                        "skillTypes": [],
                        "entityCount": {
                          "targetSource": "Target",
                          "targetGroupKey": "",
                          "minimumCount": 1,
                          "comparison": "GE",
                          "containsHittableTarget": false,
                          "excludeDeadEntity": false,
                          "storeKey": ""
                        },
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": null,
                        "objectTypeMatch": null,
                        "deckAttributeCompare": null,
                        "probability": null,
                        "anyConditionGroups": [],
                        "anyConditionNegated": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "ObtainCostAction",
                        "actionIndex": 1,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[2]",
                          "succeedActions",
                          "actionData",
                          "[1]"
                        ],
                        "serverActionIndex": 8,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "resourceGain": {
                          "resource": "sp",
                          "amount": {
                            "value": 0.0,
                            "blackboardKey": "atb",
                            "levelValues": [
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0,
                              15.0
                            ]
                          },
                          "coefficient": {
                            "value": 1.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "spGainKind": "gain",
                          "spGainSource": "normalAttack",
                          "onlyMainOperator": false,
                          "isPercentValue": false,
                          "useUltimateRecoveryTag": false,
                          "ultimateRecoveryTagId": 0,
                          "ignoreUltimateGainScalar": false
                        }
                      },
                      {
                        "actionType": "CreateTimedMarker",
                        "actionIndex": 2,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[2]",
                          "succeedActions",
                          "actionData",
                          "[2]"
                        ],
                        "serverActionIndex": 9,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "timedMarkerApplication": {
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "markerId": "have_recovered",
                          "duration": {
                            "value": 0.5,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "autoFinishByAction": false,
                          "useTimeDilationDt": false
                        }
                      }
                    ],
                    "failActions": [],
                    "conditionNegated": [
                      false,
                      false
                    ],
                    "alwaysNext": true
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "failActions": [
                {
                  "actionType": "DamageAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "failActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 10,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Pulse",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 1.1,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          0.51,
                          0.56,
                          0.61,
                          0.66,
                          0.71,
                          0.77,
                          0.82,
                          0.87,
                          0.92,
                          0.98,
                          1.06,
                          1.15
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 128
                    }
                  ]
                }
              ],
              "conditionNegated": [
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "patch": {
        "levels": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "blackboard": {
          "atb": [
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0
          ],
          "atk_scale": [
            0.51,
            0.56,
            0.61,
            0.66,
            0.71,
            0.77,
            0.82,
            0.87,
            0.92,
            0.98,
            1.06,
            1.15
          ],
          "poise": [
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0,
            15.0
          ]
        },
        "cooldownSeconds": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ],
        "costTypes": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "costValues": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.25,
          "isDynamic": true
        },
        {
          "key": "poise",
          "value": 8.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [],
      "blackboardProvenance": [
        {
          "key": "atb",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "finisher",
      "skillId": "chr_0023_antal_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0023_antal_power_attack.json",
      "timelineBlockFrames": 32,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 4,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 32,
          "endFrame": 48,
          "skillIds": [
            "chr_0023_antal_normal_skill",
            "chr_0023_antal_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 48,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0023_antal_normal_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": true,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.3,
                "blackboardKey": ""
              }
            },
            {
              "cmdType": "ComboSkill",
              "skillId": "chr_0023_antal_combo_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": true,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.3,
                "blackboardKey": ""
              }
            }
          ]
        }
      ],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 28,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 124,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 23,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 28,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 124,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 28,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 34,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 34,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 12,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 14,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 15,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 16,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 26,
          "actionTypes": [
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 25,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 71,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 73,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 74,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 75,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 64,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 30,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 124,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 124,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 124,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 124,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 124,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 48,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 48,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 103,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 33,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 14,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 15,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 18,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 42,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 128,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 30,
          "actionIndex": 34,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_power_attack_disable_cast_skill",
          "classification": "inputLock",
          "targetSource": "Owner",
          "targetGroupKey": "",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionOwner",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {},
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 25,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionIndex": 36,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_damage_immune_medium",
          "classification": "incomingDamageProtection",
          "targetSource": "Owner",
          "targetGroupKey": "",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionOwner",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {},
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 27,
          "autoFinishByAction": true
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 10,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_power_attack02_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 12,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_power_attack02_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 14,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_power_attack02_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 15,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_power_attack02_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 16,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_power_attack02_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 25,
          "projectileId": "projectile_chr_0023_antal_power_attack",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0023_antal_power_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 10,
          "actionOrder": [
            18
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_power_attack02_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_power_attack02_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  4.0,
                  4.4,
                  4.8,
                  5.2,
                  5.6,
                  6.0,
                  6.4,
                  6.8,
                  7.2,
                  7.7,
                  8.3,
                  9.0
                ]
              },
              "calculationMultiplier": {
                "value": 0.06,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "breakingAttack",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      4.0,
                      4.4,
                      4.8,
                      5.2,
                      5.6,
                      6.0,
                      6.4,
                      6.8,
                      7.2,
                      7.7,
                      8.3,
                      9.0
                    ]
                  },
                  "calculationMultiplier": {
                    "value": 0.06,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckMainCharacterCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                },
                {
                  "sourceType": "CheckEntityNum",
                  "supported": false,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityCount": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": false,
                    "excludeDeadEntity": false,
                    "storeKey": ""
                  },
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "coefficient": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "spGainKind": "gain",
                    "spGainSource": "normalAttack",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                }
              ],
              "failActions": [],
              "conditionNegated": [
                false,
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 12,
          "actionOrder": [
            19
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_power_attack02_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_power_attack02_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  4.0,
                  4.4,
                  4.8,
                  5.2,
                  5.6,
                  6.0,
                  6.4,
                  6.8,
                  7.2,
                  7.7,
                  8.3,
                  9.0
                ]
              },
              "calculationMultiplier": {
                "value": 0.06,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "breakingAttack",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      4.0,
                      4.4,
                      4.8,
                      5.2,
                      5.6,
                      6.0,
                      6.4,
                      6.8,
                      7.2,
                      7.7,
                      8.3,
                      9.0
                    ]
                  },
                  "calculationMultiplier": {
                    "value": 0.06,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckMainCharacterCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                },
                {
                  "sourceType": "CheckEntityNum",
                  "supported": false,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityCount": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": false,
                    "excludeDeadEntity": false,
                    "storeKey": ""
                  },
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "coefficient": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "spGainKind": "gain",
                    "spGainSource": "normalAttack",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                }
              ],
              "failActions": [],
              "conditionNegated": [
                false,
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 14,
          "actionOrder": [
            20
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_power_attack02_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_power_attack02_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  4.0,
                  4.4,
                  4.8,
                  5.2,
                  5.6,
                  6.0,
                  6.4,
                  6.8,
                  7.2,
                  7.7,
                  8.3,
                  9.0
                ]
              },
              "calculationMultiplier": {
                "value": 0.06,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "breakingAttack",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      4.0,
                      4.4,
                      4.8,
                      5.2,
                      5.6,
                      6.0,
                      6.4,
                      6.8,
                      7.2,
                      7.7,
                      8.3,
                      9.0
                    ]
                  },
                  "calculationMultiplier": {
                    "value": 0.06,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckMainCharacterCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                },
                {
                  "sourceType": "CheckEntityNum",
                  "supported": false,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityCount": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": false,
                    "excludeDeadEntity": false,
                    "storeKey": ""
                  },
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "coefficient": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "spGainKind": "gain",
                    "spGainSource": "normalAttack",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                }
              ],
              "failActions": [],
              "conditionNegated": [
                false,
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 15,
          "actionOrder": [
            21
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_power_attack02_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_power_attack02_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  4.0,
                  4.4,
                  4.8,
                  5.2,
                  5.6,
                  6.0,
                  6.4,
                  6.8,
                  7.2,
                  7.7,
                  8.3,
                  9.0
                ]
              },
              "calculationMultiplier": {
                "value": 0.06,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "breakingAttack",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      4.0,
                      4.4,
                      4.8,
                      5.2,
                      5.6,
                      6.0,
                      6.4,
                      6.8,
                      7.2,
                      7.7,
                      8.3,
                      9.0
                    ]
                  },
                  "calculationMultiplier": {
                    "value": 0.06,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckMainCharacterCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                },
                {
                  "sourceType": "CheckEntityNum",
                  "supported": false,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityCount": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": false,
                    "excludeDeadEntity": false,
                    "storeKey": ""
                  },
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "coefficient": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "spGainKind": "gain",
                    "spGainSource": "normalAttack",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                }
              ],
              "failActions": [],
              "conditionNegated": [
                false,
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 16,
          "actionOrder": [
            22
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_power_attack02",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_power_attack02_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_power_attack02_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  4.0,
                  4.4,
                  4.8,
                  5.2,
                  5.6,
                  6.0,
                  6.4,
                  6.8,
                  7.2,
                  7.7,
                  8.3,
                  9.0
                ]
              },
              "calculationMultiplier": {
                "value": 0.06,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "breakingAttack",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      4.0,
                      4.4,
                      4.8,
                      5.2,
                      5.6,
                      6.0,
                      6.4,
                      6.8,
                      7.2,
                      7.7,
                      8.3,
                      9.0
                    ]
                  },
                  "calculationMultiplier": {
                    "value": 0.06,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]"
              ],
              "conditions": [
                {
                  "sourceType": "CheckMainCharacterCondition",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "poise": null,
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                },
                {
                  "sourceType": "CheckEntityNum",
                  "supported": false,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityCount": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": false,
                    "excludeDeadEntity": false,
                    "storeKey": ""
                  },
                  "poise": null,
                  "superArmor": null,
                  "twoDirectionAngle": null,
                  "targetAngle": null,
                  "damageDecorateMask": null,
                  "contextBuffId": null,
                  "objectTypeMatch": null,
                  "deckAttributeCompare": null,
                  "probability": null,
                  "anyConditionGroups": [],
                  "anyConditionNegated": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 5,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "coefficient": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "spGainKind": "gain",
                    "spGainSource": "normalAttack",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                }
              ],
              "failActions": [],
              "conditionNegated": [
                false,
                false
              ],
              "alwaysNext": true
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 25,
          "actionOrder": [
            27
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0023_antal_power_attack",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0023_antal_power_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0023_antal_power_attack_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  4.0,
                  4.4,
                  4.8,
                  5.2,
                  5.6,
                  6.0,
                  6.4,
                  6.8,
                  7.2,
                  7.7,
                  8.3,
                  9.0
                ]
              },
              "calculationMultiplier": {
                "value": 0.7,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 1,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "breakingAttack",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      4.0,
                      4.4,
                      4.8,
                      5.2,
                      5.6,
                      6.0,
                      6.4,
                      6.8,
                      7.2,
                      7.7,
                      8.3,
                      9.0
                    ]
                  },
                  "calculationMultiplier": {
                    "value": 0.7,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_common_damage_immune_medium",
        "buff_common_power_attack_disable_cast_skill"
      ],
      "patch": {
        "levels": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "blackboard": {
          "atk_scale": [
            4.0,
            4.4,
            4.8,
            5.2,
            5.6,
            6.0,
            6.4,
            6.8,
            7.2,
            7.7,
            8.3,
            9.0
          ]
        },
        "cooldownSeconds": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ],
        "costTypes": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "costValues": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "addition_vertical",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_scale",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "cam_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cam_duration",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "look_at_x",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "vertical",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [],
      "blackboardProvenance": [
        {
          "key": "addition_vertical",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "cam_angle",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "cam_duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "input_angle",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "look_at_x",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "vertical",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "plungingAttack",
      "skillId": "chr_0023_antal_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0023_antal_plunging_attack_end.json",
      "timelineBlockFrames": 16,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 5,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 5,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 89,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 2,
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
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
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 1152
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 2
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 4,
          "resource": "sp",
          "amount": {
            "value": 0.0,
            "blackboardKey": "atb",
            "levelValues": [
              0.0,
              0.0,
              0.0,
              0.0,
              0.0,
              0.0,
              0.0,
              0.0,
              0.0,
              0.0,
              0.0,
              0.0
            ]
          },
          "coefficient": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "spGainKind": "gain",
          "spGainSource": "normalAttack",
          "onlyMainOperator": true,
          "isPercentValue": false,
          "useUltimateRecoveryTag": false,
          "ultimateRecoveryTagId": 0,
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 2
        }
      ],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "patch": {
        "levels": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "blackboard": {
          "atb": [
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0
          ],
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
        "cooldownSeconds": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ],
        "costTypes": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "costValues": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.7,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale"
      ],
      "blackboardProvenance": [
        {
          "key": "atb",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "DamageAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 1,
          "endFrame": 5,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
          "producerType": "FindTargetAction",
          "finderType": "HitBoxFinder",
          "finderFactionTarget": "Anti",
          "finderTargetObjectType": "Normal",
          "finderCheckAlive": true,
          "validatorTypes": [],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        }
      ],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "battleSkill",
      "skillId": "chr_0023_antal_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0023_antal_normal_skill.json",
      "timelineBlockFrames": 31,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "Atb",
      "costValue": 40.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 20,
          "actionTypes": [
            "InterruptAction",
            "FinishBuffAction",
            "CreateBuffAction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "CameraImpulseAction",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 23,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 44,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 29,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 47,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 29,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 30,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 20,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 31,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionTypes": [
            "SaveTwoDirectionAngle",
            "Selector",
            "Selector",
            "Selector",
            "Selector",
            "Selector",
            "CurveEvaluateFloat",
            "CurveEvaluateFloat",
            "CameraRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 64,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 53,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 134,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 20,
          "endFrame": 20,
          "actionIndex": 11,
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.89,
                  0.98,
                  1.07,
                  1.16,
                  1.24,
                  1.33,
                  1.42,
                  1.51,
                  1.6,
                  1.71,
                  1.85,
                  2.0
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4352
            },
            {
              "damageType": "Pulse",
              "attributeType": "Poise",
              "calculation": "standard",
              "attackScale": {
                "value": 4.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.89,
                  0.98,
                  1.07,
                  1.16,
                  1.24,
                  1.33,
                  1.42,
                  1.51,
                  1.6,
                  1.71,
                  1.85,
                  2.0
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": {
                "value": 0.0,
                "blackboardKey": "poise",
                "levelValues": [
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0,
                  0.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 2
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 20,
          "endFrame": 20,
          "actionIndex": 10,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0023_antal_normal_skill",
          "classification": null,
          "targetSource": "Owner",
          "targetGroupKey": "",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "InputTarget",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {
            "rate": {
              "value": 0.0,
              "blackboardKey": "rate",
              "levelValues": [
                0.05,
                0.05,
                0.06,
                0.06,
                0.07,
                0.07,
                0.08,
                0.08,
                0.08,
                0.09,
                0.09,
                0.1
              ]
            },
            "duration": {
              "value": 0.0,
              "blackboardKey": "duration",
              "levelValues": [
                60.0,
                60.0,
                60.0,
                60.0,
                60.0,
                60.0,
                60.0,
                60.0,
                60.0,
                60.0,
                60.0,
                60.0
              ]
            },
            "potential_3": {
              "value": 0.0,
              "blackboardKey": "potential_3",
              "levelValues": [
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0
              ]
            },
            "potential_3_atb": {
              "value": 0.0,
              "blackboardKey": "potential_3_atb",
              "levelValues": [
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0
              ]
            },
            "potential_5": {
              "value": 0.0,
              "blackboardKey": "potential_5",
              "levelValues": [
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0
              ]
            },
            "delay_time": {
              "value": 0.0,
              "blackboardKey": "delay_time",
              "levelValues": [
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0
              ]
            },
            "potential_5_rate": {
              "value": 0.0,
              "blackboardKey": "potential_5_rate",
              "levelValues": [
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0
              ]
            }
          },
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 2,
          "autoFinishByAction": false
        },
        {
          "startFrame": 20,
          "endFrame": 20,
          "actionIndex": 14,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_obtain_ultimate_sp",
          "classification": "skillCostUltimateEnergyGain",
          "targetSource": "Source",
          "targetGroupKey": "",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionSource",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {},
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 2,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [
        {
          "startFrame": 20,
          "endFrame": 20,
          "actionIndex": 9,
          "targetSource": "Owner",
          "targetGroupKey": "",
          "buffCheckType": "Id",
          "buffIds": [
            "buff_chr_0023_antal_normal_skill"
          ],
          "tagQueryType": "hasAny",
          "buffTagIds": [],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": false,
          "isAbsorbed": false,
          "finishLayerCount": null,
          "sourceActionType": "FinishBuffAction",
          "sequenceIndex": 2
        }
      ],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0023_antal_normal_skill",
        "buff_common_obtain_ultimate_sp"
      ],
      "patch": {
        "levels": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "blackboard": {
          "atk_scale": [
            0.89,
            0.98,
            1.07,
            1.16,
            1.24,
            1.33,
            1.42,
            1.51,
            1.6,
            1.71,
            1.85,
            2.0
          ],
          "duration": [
            60.0,
            60.0,
            60.0,
            60.0,
            60.0,
            60.0,
            60.0,
            60.0,
            60.0,
            60.0,
            60.0,
            60.0
          ],
          "rate": [
            0.05,
            0.05,
            0.06,
            0.06,
            0.07,
            0.07,
            0.08,
            0.08,
            0.08,
            0.09,
            0.09,
            0.1
          ]
        },
        "cooldownSeconds": [
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0
        ],
        "costTypes": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ],
        "costValues": [
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atk_scale",
          "value": 2.85,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "cam_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cam_duration",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "consume_cnt",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "delay_time",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 60.0,
          "isDynamic": false
        },
        {
          "key": "gained_atb",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_3",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_3_atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5_rate",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": 0.2,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 10.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "cam_angle",
        "input_angle",
        "poise"
      ],
      "blackboardProvenance": [
        {
          "key": "atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "cam_angle",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "cam_duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "consume_cnt",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "delay_time",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "duration",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "gained_atb",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "input_angle",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_3",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_3_atb",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_5",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_5_rate",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "rate",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "select_radius",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "DamageAction",
        "FinishBuffAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "mainchar",
          "producerType": "FindTargetAction",
          "finderType": "CharacterTeamFinder",
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [
            "MainCharacterValidator"
          ],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "characterTeamSelectionRole": "controlledOperator",
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "pos",
          "producerType": "FindTargetAction",
          "finderType": "FixedPointFinder",
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        }
      ],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "ultimate",
      "skillId": "chr_0023_antal_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0023_antal_ultimate_skill.json",
      "timelineBlockFrames": 56,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "Atb",
      "costValue": 40.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 56,
          "endFrame": 73,
          "skillIds": [
            "chr_0023_antal_attack1",
            "chr_0023_antal_normal_skill",
            "chr_0023_antal_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 47,
          "endFrame": 73,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0023_antal_attack1",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": true,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.3,
                "blackboardKey": ""
              }
            },
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0023_antal_normal_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": true,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.3,
                "blackboardKey": ""
              }
            },
            {
              "cmdType": "ComboSkill",
              "skillId": "chr_0023_antal_combo_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": true,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.3,
                "blackboardKey": ""
              }
            }
          ]
        }
      ],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 112,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 44,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "AnimatedCameraAction",
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 105,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 51,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "EffectAction",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 47,
          "endFrame": 73,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 56,
          "endFrame": 73,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionTypes": [
            "ChannelingCastingAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 105,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 77,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 77,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 138,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 115,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 115,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 115,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 70,
          "endFrame": 112,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 122,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 70,
          "endFrame": 112,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 70,
          "endFrame": 112,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 112,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 74,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 112,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 65,
          "endFrame": 119,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionIndex": 20,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_damage_immune_ult_skill",
          "classification": "incomingDamageProtection",
          "targetSource": "Owner",
          "targetGroupKey": "",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionOwner",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {},
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 8,
          "autoFinishByAction": true
        },
        {
          "startFrame": 49,
          "endFrame": 51,
          "actionIndex": 24,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0023_antal_utimate_skill",
          "classification": null,
          "targetSource": "Context",
          "targetGroupKey": "team",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionSource",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {
            "duration": {
              "value": 0.0,
              "blackboardKey": "duration",
              "levelValues": [
                12.0,
                12.0,
                12.0,
                12.0,
                12.0,
                12.0,
                12.0,
                12.0,
                12.0,
                12.0,
                12.0,
                12.0
              ]
            },
            "rate": {
              "value": 0.0,
              "blackboardKey": "rate",
              "levelValues": [
                0.08,
                0.09,
                0.1,
                0.11,
                0.12,
                0.13,
                0.14,
                0.15,
                0.16,
                0.17,
                0.18,
                0.2
              ]
            }
          },
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 10,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0023_antal_utimate_skill",
        "buff_common_damage_immune_ult_skill"
      ],
      "patch": {
        "levels": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "blackboard": {
          "duration": [
            12.0,
            12.0,
            12.0,
            12.0,
            12.0,
            12.0,
            12.0,
            12.0,
            12.0,
            12.0,
            12.0,
            12.0
          ],
          "rate": [
            0.08,
            0.09,
            0.1,
            0.11,
            0.12,
            0.13,
            0.14,
            0.15,
            0.16,
            0.17,
            0.18,
            0.2
          ]
        },
        "cooldownSeconds": [
          20.0,
          20.0,
          20.0,
          20.0,
          20.0,
          20.0,
          20.0,
          20.0,
          20.0,
          20.0,
          20.0,
          20.0
        ],
        "costTypes": [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        "costValues": [
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0,
          100.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atk_scale",
          "value": 1.5,
          "isDynamic": false
        },
        {
          "key": "atk_up",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "cd",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "heal_value",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "healvalue",
          "value": 500.0,
          "isDynamic": false
        },
        {
          "key": "multiplier",
          "value": 3.0,
          "isDynamic": false
        },
        {
          "key": "radius",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": 0.4,
          "isDynamic": false
        },
        {
          "key": "talent_1",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [],
      "blackboardProvenance": [
        {
          "key": "atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_up",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "cd",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "duration",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_value",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "healvalue",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "multiplier",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "radius",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "rate",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_1",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "mainchar",
          "producerType": "FindTargetAction",
          "finderType": "CharacterTeamFinder",
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [
            "MainCharacterValidator"
          ],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "characterTeamSelectionRole": "controlledOperator",
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "pos",
          "producerType": "FindTargetAction",
          "finderType": "FixedPointFinder",
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 49,
          "endFrame": 51,
          "actionIndex": 22,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "team",
          "producerType": "FindTargetAction",
          "finderType": "CharacterTeamFinder",
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        }
      ],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 1,
          "kind": "normal",
          "priority": -2059842104,
          "scope": "entity",
          "slot": 1464849466,
          "duration": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": "RESETto1",
          "inlineCurve": [],
          "finishByAction": false,
          "ignoredTargets": [],
          "targets": [
            "caster"
          ],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 1,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionIndex": 9,
          "kind": "ultimate",
          "priority": -1742631616,
          "scope": null,
          "slot": null,
          "duration": null,
          "namedCurve": null,
          "inlineCurve": [],
          "finishByAction": true,
          "ignoredTargets": [],
          "targets": [],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": 0.0,
          "sequenceIndex": 3,
          "effectAbilityEntityTargets": []
        }
      ],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    }
  ]
} as const satisfies GeneratedOperatorSource;
