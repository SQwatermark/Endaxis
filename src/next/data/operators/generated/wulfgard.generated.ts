/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const wulfgardGeneratedSource = {
  "slug": "wulfgard",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0006_wolfgd_combo_skill_tutorial_marker",
      "sourceFile": "buff_chr_0006_wolfgd_combo_skill_tutorial_marker.json",
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
      }
    },
    {
      "buffId": "buff_chr_0006_wolfgd_talent_0",
      "sourceFile": "buff_chr_0006_wolfgd_talent_0.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 10.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": 1.0,
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
          "key": "add",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
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
          "event": "OnOutputBuff",
          "orderedActionTypes": [
            "CheckBuffIdInContext",
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
                    "buffId": "buff_chr_0006_wolfgd_talent_0_effectbuff",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "add": {
                        "value": 0.0,
                        "blackboardKey": "add",
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
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_chr_0006_wolfgd_talent_0_effectbuff"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckBuffIdInContext",
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
                        "buffId": "buff_chr_0006_wolfgd_talent_0_effectbuff",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "add": {
                            "value": 0.0,
                            "blackboardKey": "add",
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
                    "buffSource": "ActionSource",
                    "buffSourceContextKey": "",
                    "inheritSourceSkillCastInfo": true
                  }
                }
              ],
              "actions": [
                {
                  "actionType": "CheckBuffIdInContext",
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
                        "sourceType": "CheckBuffIdInContext",
                        "supported": false,
                        "comparison": null,
                        "left": null,
                        "right": null,
                        "skillTypes": [],
                        "poise": null,
                        "superArmor": null,
                        "twoDirectionAngle": null,
                        "targetAngle": null,
                        "damageDecorateMask": null,
                        "contextBuffId": {
                          "checkType": "Tag",
                          "buffIds": [],
                          "queryType": "HasAny",
                          "buffTagIds": [
                            -1110095722
                          ]
                        },
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
                              "buffId": "buff_chr_0006_wolfgd_talent_0_effectbuff",
                              "classification": null,
                              "blackboardAssignments": {
                                "duration": {
                                  "value": 0.0,
                                  "blackboardKey": "duration",
                                  "levelValues": [
                                    0.0
                                  ]
                                },
                                "add": {
                                  "value": 0.0,
                                  "blackboardKey": "add",
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
      }
    },
    {
      "buffId": "buff_chr_0006_wolfgd_talent_0_effectbuff",
      "sourceFile": "buff_chr_0006_wolfgd_talent_0_effectbuff.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 10.0,
          "blackboardKey": "duration",
          "levelValues": [
            0.0
          ]
        },
        "triggerInterval": {
          "value": 1.0,
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
        "stackingType": "Refresh",
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
          "key": "add",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [
        {
          "targetType": "Specific",
          "attributeType": "FireDamageIncrease",
          "slot": "BaseAddition",
          "value": {
            "value": 0.0,
            "blackboardKey": "add",
            "levelValues": [
              0.0
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
        "hasIcon": true,
        "spritePath": "icon_battle_wolfgd_talent_1",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": true,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "CommonCharBuff"
      }
    },
    {
      "buffId": "buff_common_burning_status",
      "sourceFile": "buff_common_burning_status.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 11.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 9999.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unique",
        "stackingKey": "fire_triggered",
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
          "key": "burning_atk_scale",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 20.0,
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
          "event": "OnBuffTrigger",
          "orderedActionTypes": [
            "DamageAction"
          ],
          "combatActions": [
            "DamageAction"
          ],
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "burning_atk_scale",
                "levelValues": [
                  0.0
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 335544320
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
                "DamageAction"
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
                      "damageType": "Fire",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": "burning_atk_scale",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 335544320
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
      }
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
      }
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
      }
    },
    {
      "buffId": "buff_common_fire_fire_burning_triggered",
      "sourceFile": "buff_common_fire_fire_burning_triggered.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 16.0,
          "blackboardKey": "duration",
          "levelValues": [
            10.0
          ]
        },
        "triggerInterval": {
          "value": 1.0,
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
        "stackingKey": "fire_triggered",
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
          "key": "burning_atk_scale",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "count",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 10.0,
          "isDynamic": true
        },
        {
          "key": "extra_scaling",
          "value": 1.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        -1110095722
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
          "event": "DuringBuffEnable",
          "orderedActionTypes": [
            "EffectAction",
            "PlaySoundAction",
            "EffectAction",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 3,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_common_burning_status",
                    "classification": null,
                    "blackboardAssignments": {
                      "burning_atk_scale": {
                        "value": 0.0,
                        "blackboardKey": "burning_atk_scale",
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
            "buff_common_burning_status"
          ],
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
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "PlaySoundAction",
                "EffectAction",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 3,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_common_burning_status",
                        "classification": null,
                        "blackboardAssignments": {
                          "burning_atk_scale": {
                            "value": 0.0,
                            "blackboardKey": "burning_atk_scale",
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
                  "serverActionIndex": 3,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_common_burning_status",
                        "classification": null,
                        "blackboardAssignments": {
                          "burning_atk_scale": {
                            "value": 0.0,
                            "blackboardKey": "burning_atk_scale",
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
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "ReadSkillSettingData",
            "ModifyDynamicBlackboard",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 6,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_common_fire_triggered_start",
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
            "buff_common_fire_triggered_start"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "ReadSkillSettingData",
                "ModifyDynamicBlackboard",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 6,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_common_fire_triggered_start",
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
                  "actionType": "ModifyDynamicBlackboard",
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
                  "serverActionIndex": 5,
                  "blackboardMutation": {
                    "key": "burning_atk_scale",
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
                  "serverActionIndex": 6,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_common_fire_triggered_start",
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
              "actionIndex": 7,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_common_fire_triggered_fx",
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
            "buff_common_fire_triggered_fx"
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
                  "actionIndex": 7,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_common_fire_triggered_fx",
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
                  "serverActionIndex": 7,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_common_fire_triggered_fx",
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
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "OnSpellAbnormalStartFinish"
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
                "OnSpellAbnormalStartFinish"
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
            "OnSpellAbnormalStartFinish"
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
                "OnSpellAbnormalStartFinish"
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
        "hasIcon": true,
        "spritePath": "icon_battle_burning",
        "showInHeadBarCommon": true,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "SpellAbnormal",
        "abnormalColorType": "Fire",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "AttachedAndAbnormal"
      }
    },
    {
      "buffId": "buff_common_fire_triggered_fx",
      "sourceFile": "buff_common_fire_triggered_fx.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 5.0,
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
            "EnemyHurtAnimAction",
            "EffectAction",
            "CameraImpulseAction",
            "HitStopAction",
            "PlaySoundAction"
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
                "EnemyHurtAnimAction",
                "EffectAction",
                "CameraImpulseAction",
                "HitStopAction",
                "PlaySoundAction"
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
      }
    },
    {
      "buffId": "buff_common_fire_triggered_start",
      "sourceFile": "buff_common_fire_triggered_start.json",
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
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Unlimited",
        "stackingKey": "fire_triggered",
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
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "IgniteBuffTextAction"
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
                "IgniteBuffTextAction"
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
      }
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
      }
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
      }
    }
  ],
  "skills": [
    {
      "key": "comboSkill",
      "skillId": "chr_0006_wolfgd_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0006_wolfgd_combo_skill.json",
      "timelineBlockFrames": 30,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 35.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 30,
          "endFrame": 65,
          "skillIds": [
            "chr_0006_wolfgd_normal_skill"
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
              "skillId": "chr_0006_wolfgd_normal_skill",
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
          "endFrame": 138,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 16,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 76,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 89,
          "actionTypes": [
            "CustomRootMotionAction"
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
          "endFrame": 27,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 16,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 16,
          "actionTypes": [
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 37,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 30,
          "endFrame": 65,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 138,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 26,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 138,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 138,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "projectileId": "projectile_chr_0006_wolfgd_combo_skill",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_combo_skill_projhit"
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
            2
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_combo_skill",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_combo_skill_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_combo_skill_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 0,
              "actionIndex": 0,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0006_wolfgd_combo_skill_tutorial_marker",
              "classification": "tutorialMarker",
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
              "sequenceIndex": 0,
              "autoFinishByAction": false
            },
            {
              "startFrame": 0,
              "endFrame": 0,
              "actionIndex": 1,
              "actionType": "SpawnAbilityEntity",
              "sourceId": "abilityentity_chr_0006_wolfgd_combo_skill:chr_0006_wolfgd_combo_skill_abilityrange",
              "classification": null,
              "targetSource": "",
              "targetGroupKey": "",
              "count": null,
              "buffSource": null,
              "inheritSourceSkillCastInfo": null,
              "blackboardAssignments": {},
              "nestedCombatActions": [
                "CreateBuffAction",
                "DamageAction",
                "ObtainCostAction",
                "SpellInfliction"
              ],
              "buffSourceContextKey": null,
              "sequenceIndex": 0,
              "autoFinishByAction": null
            }
          ],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "CreateBuffAction",
            "SpawnAbilityEntity"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [
            {
              "spawnFrame": 12,
              "actionOrder": [
                2,
                1
              ],
              "abilityEntityId": "abilityentity_chr_0006_wolfgd_combo_skill",
              "skillId": "chr_0006_wolfgd_combo_skill_abilityrange",
              "sourceFile": "chr_0006_wolfgd_combo_skill_abilityrange.json",
              "entityBlackboardAssignments": [],
              "spawnPayload": {
                "abilityEntityId": "abilityentity_chr_0006_wolfgd_combo_skill",
                "skillId": "chr_0006_wolfgd_combo_skill_abilityrange",
                "entityBlackboardAssignments": [],
                "assignBlackboard": true,
                "sourceType": "ActionSource",
                "sourceContextKey": "",
                "target": null,
                "overrideDuration": null,
                "saveToContextKey": null,
                "dieWhenSourceDies": false,
                "dieOnEnd": false
              },
              "directDamageHits": [
                {
                  "startFrame": 0,
                  "endFrame": 0,
                  "actionIndex": 4,
                  "damageUnits": [
                    {
                      "damageType": "Fire",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 3.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          0.6,
                          0.66,
                          0.72,
                          0.78,
                          0.84,
                          0.9,
                          0.96,
                          1.02,
                          1.08,
                          1.16,
                          1.25,
                          1.35
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
                        "value": 20.0,
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
                  "sequenceIndex": 0
                }
              ],
              "intervalDamageHits": [],
              "explicitFinishes": [],
              "timelineJumps": [],
              "conditionalActions": [],
              "inflictions": [
                {
                  "startFrame": 0,
                  "endFrame": 0,
                  "actionIndex": 3,
                  "element": "heat",
                  "isExtra": false,
                  "sequenceIndex": 0
                }
              ],
              "auxiliaryActions": [
                {
                  "startFrame": 0,
                  "endFrame": 0,
                  "actionIndex": 0,
                  "actionType": "CreateBuffAction",
                  "sourceId": "buff_chr_0006_wolfgd_combo_skill_tutorial_marker",
                  "classification": "tutorialMarker",
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
                  "sequenceIndex": 0,
                  "autoFinishByAction": false
                }
              ],
              "resourceGains": [
                {
                  "startFrame": 0,
                  "endFrame": 0,
                  "actionIndex": 6,
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
                  "sequenceIndex": 0
                }
              ],
              "projectileLaunches": [],
              "projectileTriggeredSkills": [],
              "nestedAbilityEntityHits": [],
              "combatActions": [
                "CreateBuffAction",
                "DamageAction",
                "ObtainCostAction",
                "SpellInfliction"
              ],
              "cycleTruncated": false,
              "inheritsSourceBlackboard": true,
              "declaredBlackboard": [
                {
                  "key": "atk_scale",
                  "value": 5.0,
                  "isDynamic": false
                },
                {
                  "key": "duration",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "move_speed_scalar",
                  "value": 1.0,
                  "isDynamic": false
                },
                {
                  "key": "poise",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "radius",
                  "value": 5.0,
                  "isDynamic": false
                },
                {
                  "key": "usp",
                  "value": 0.0,
                  "isDynamic": false
                }
              ],
              "blackboardCalculations": [],
              "blackboardMutations": [],
              "buffBlackboardReads": [],
              "buffFinishes": [],
              "auraActions": [],
              "presentationOnlySwitchActionIndexes": []
            }
          ],
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
          "atk_scale": [
            0.6,
            0.66,
            0.72,
            0.78,
            0.84,
            0.9,
            0.96,
            1.02,
            1.08,
            1.16,
            1.25,
            1.35
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
          19.0
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
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "select_radius"
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
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 12,
          "endFrame": 16,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "bomb",
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
          "startFrame": 0,
          "endFrame": 15,
          "actionIndex": 23,
          "actionPath": [
            "timelineActions[8]",
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
          "startFrame": 0,
          "endFrame": 15,
          "actionIndex": 21,
          "actionPath": [
            "timelineActions[8]",
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
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 23,
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
          "endFrame": 15,
          "actionIndex": 20,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.6,
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
          "sequenceIndex": 7,
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
      "skillId": "chr_0006_wolfgd_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0006_wolfgd_attack1.json",
      "timelineBlockFrames": 24,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 13,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 7,
      "allowNextWindows": [
        {
          "startFrame": 24,
          "endFrame": 49,
          "skillIds": [
            "chr_0006_wolfgd_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 49,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0006_wolfgd_attack2",
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
          "endFrame": 121,
          "actionTypes": [
            "PlayAnimationWithStep"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 7,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 15,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction"
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
          "startFrame": 7,
          "endFrame": 36,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 44,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 89,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 89,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 96,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 55,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 103,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 49,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 49,
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
          "launchFrame": 7,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_attack1_projhit01"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 14,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_attack1_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 7,
          "actionOrder": [
            3
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_attack1_projhit01",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_attack1_projhit01.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.15,
                  0.17,
                  0.18,
                  0.2,
                  0.21,
                  0.23,
                  0.24,
                  0.26,
                  0.27,
                  0.29,
                  0.31,
                  0.34
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
              "endFrame": 0,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.15,
                      0.17,
                      0.18,
                      0.2,
                      0.21,
                      0.23,
                      0.24,
                      0.26,
                      0.27,
                      0.29,
                      0.31,
                      0.34
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
              "endFrame": 0,
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
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
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 4,
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
                      "value": 0.5,
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
            8
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_attack1_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_attack1_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.15,
                  0.17,
                  0.18,
                  0.2,
                  0.21,
                  0.23,
                  0.24,
                  0.26,
                  0.27,
                  0.29,
                  0.31,
                  0.34
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
              "endFrame": 0,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.15,
                      0.17,
                      0.18,
                      0.2,
                      0.21,
                      0.23,
                      0.24,
                      0.26,
                      0.27,
                      0.29,
                      0.31,
                      0.34
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
              "endFrame": 0,
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
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
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 4,
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
                      "value": 0.5,
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
            0.15,
            0.17,
            0.18,
            0.2,
            0.21,
            0.23,
            0.24,
            0.26,
            0.27,
            0.29,
            0.31,
            0.34
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
          "value": 0.0,
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
      "targetGroupWrites": [
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
          "startFrame": 14,
          "endFrame": 15,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
      "key": "basicAttack2",
      "skillId": "chr_0006_wolfgd_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0006_wolfgd_attack2.json",
      "timelineBlockFrames": 23,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 11,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 10,
      "allowNextWindows": [
        {
          "startFrame": 23,
          "endFrame": 38,
          "skillIds": [
            "chr_0006_wolfgd_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 38,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0006_wolfgd_attack3",
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
          "endFrame": 129,
          "actionTypes": [
            "PlayAnimationWithStep"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 16,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction"
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
          "endFrame": 6,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 89,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 39,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 45,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 35,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 81,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 81,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 92,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 96,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 64,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 38,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 38,
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
          "launchFrame": 10,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_2",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_attack2_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 16,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_2",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_attack2_projhit"
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
            2
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_2",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_attack2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_attack2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.18,
                  0.19,
                  0.21,
                  0.23,
                  0.25,
                  0.26,
                  0.28,
                  0.3,
                  0.32,
                  0.34,
                  0.36,
                  0.39
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
              "endFrame": 0,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.18,
                      0.19,
                      0.21,
                      0.23,
                      0.25,
                      0.26,
                      0.28,
                      0.3,
                      0.32,
                      0.34,
                      0.36,
                      0.39
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
              "endFrame": 0,
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
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
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 4,
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
                      "value": 0.5,
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
            7
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_2",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_attack2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_attack2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.18,
                  0.19,
                  0.21,
                  0.23,
                  0.25,
                  0.26,
                  0.28,
                  0.3,
                  0.32,
                  0.34,
                  0.36,
                  0.39
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
              "endFrame": 0,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.18,
                      0.19,
                      0.21,
                      0.23,
                      0.25,
                      0.26,
                      0.28,
                      0.3,
                      0.32,
                      0.34,
                      0.36,
                      0.39
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
              "endFrame": 0,
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
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
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 4,
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
                      "value": 0.5,
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
            0.18,
            0.19,
            0.21,
            0.23,
            0.25,
            0.26,
            0.28,
            0.3,
            0.32,
            0.34,
            0.36,
            0.39
          ],
          "display_atk_scale": [
            0.35,
            0.39,
            0.42,
            0.46,
            0.49,
            0.53,
            0.56,
            0.6,
            0.63,
            0.67,
            0.73,
            0.79
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
      "targetGroupWrites": [
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
          "startFrame": 16,
          "endFrame": 16,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
      "key": "basicAttack3",
      "skillId": "chr_0006_wolfgd_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0006_wolfgd_attack3.json",
      "timelineBlockFrames": 32,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 12,
      "allowNextWindows": [
        {
          "startFrame": 32,
          "endFrame": 52,
          "skillIds": [
            "chr_0006_wolfgd_attack4"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 52,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0006_wolfgd_attack4",
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
          "endFrame": 146,
          "actionTypes": [
            "PlayAnimationWithStep"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 12,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 18,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 24,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 8,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 97,
          "actionTypes": [
            "CustomRootMotionAction"
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
          "startFrame": 12,
          "endFrame": 41,
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
          "startFrame": 24,
          "endFrame": 53,
          "actionTypes": [
            "EffectAction"
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
          "endFrame": 77,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 77,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 117,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 112,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 106,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 61,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 146,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 52,
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
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_attack3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 18,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_attack3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 24,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_attack3_projhit"
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
            2
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.19,
                  0.2,
                  0.22,
                  0.24,
                  0.26,
                  0.28,
                  0.3,
                  0.31,
                  0.33,
                  0.36,
                  0.38,
                  0.42
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
              "endFrame": 0,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.19,
                      0.2,
                      0.22,
                      0.24,
                      0.26,
                      0.28,
                      0.3,
                      0.31,
                      0.33,
                      0.36,
                      0.38,
                      0.42
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
              "endFrame": 0,
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
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
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 4,
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
                      "value": 0.3333333,
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
            7
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.19,
                  0.2,
                  0.22,
                  0.24,
                  0.26,
                  0.28,
                  0.3,
                  0.31,
                  0.33,
                  0.36,
                  0.38,
                  0.42
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
              "endFrame": 0,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.19,
                      0.2,
                      0.22,
                      0.24,
                      0.26,
                      0.28,
                      0.3,
                      0.31,
                      0.33,
                      0.36,
                      0.38,
                      0.42
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
              "endFrame": 0,
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
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
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 4,
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
                      "value": 0.3333333,
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
          "launchFrame": 24,
          "actionOrder": [
            12
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.19,
                  0.2,
                  0.22,
                  0.24,
                  0.26,
                  0.28,
                  0.3,
                  0.31,
                  0.33,
                  0.36,
                  0.38,
                  0.42
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
              "endFrame": 0,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.19,
                      0.2,
                      0.22,
                      0.24,
                      0.26,
                      0.28,
                      0.3,
                      0.31,
                      0.33,
                      0.36,
                      0.38,
                      0.42
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
              "endFrame": 0,
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
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
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ObtainCostAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 4,
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
                      "value": 0.3333333,
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
            0.19,
            0.2,
            0.22,
            0.24,
            0.26,
            0.28,
            0.3,
            0.31,
            0.33,
            0.36,
            0.38,
            0.42
          ],
          "display_atk_scale": [
            0.56,
            0.61,
            0.67,
            0.72,
            0.78,
            0.83,
            0.89,
            0.94,
            1.0,
            1.07,
            1.15,
            1.25
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
          "value": 0.35,
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
      "targetGroupWrites": [
        {
          "startFrame": 12,
          "endFrame": 12,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
          "startFrame": 18,
          "endFrame": 18,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
      "key": "basicAttack4",
      "skillId": "chr_0006_wolfgd_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0006_wolfgd_attack4.json",
      "timelineBlockFrames": 53,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 23,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 23,
      "allowNextWindows": [],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 10,
          "endFrame": 22,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 10,
          "actionTypes": [
            "PlayAnimationWithStep"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 141,
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
          "startFrame": 23,
          "endFrame": 33,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction"
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
          "startFrame": 23,
          "endFrame": 52,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 10,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 22,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 91,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 67,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 96,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 117,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 141,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 29,
          "actionTypes": [
            "VoiceTriggerAction"
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
          "launchFrame": 23,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_4",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_attack4_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 23,
          "actionOrder": [
            5
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_attack_4",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_attack4_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_attack4_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.68,
                  0.74,
                  0.81,
                  0.88,
                  0.95,
                  1.01,
                  1.08,
                  1.15,
                  1.22,
                  1.3,
                  1.4,
                  1.52
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
                  18.0,
                  18.0,
                  18.0,
                  18.0,
                  18.0,
                  18.0,
                  18.0,
                  18.0,
                  18.0,
                  18.0,
                  18.0,
                  18.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 0,
              "actionIndex": 1,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.68,
                      0.74,
                      0.81,
                      0.88,
                      0.95,
                      1.01,
                      1.08,
                      1.15,
                      1.22,
                      1.3,
                      1.4,
                      1.52
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
                      18.0,
                      18.0,
                      18.0,
                      18.0,
                      18.0,
                      18.0,
                      18.0,
                      18.0,
                      18.0,
                      18.0,
                      18.0,
                      18.0
                    ]
                  },
                  "definiteValue": null,
                  "damageDecorateMask": 0
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 0,
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[3]"
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
                    "[3]",
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
                      "value": 4.0,
                      "blackboardKey": "atb",
                      "levelValues": [
                        18.0,
                        18.0,
                        18.0,
                        18.0,
                        18.0,
                        18.0,
                        18.0,
                        18.0,
                        18.0,
                        18.0,
                        18.0,
                        18.0
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
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0
          ],
          "atk_scale": [
            0.68,
            0.74,
            0.81,
            0.88,
            0.95,
            1.01,
            1.08,
            1.15,
            1.22,
            1.3,
            1.4,
            1.52
          ],
          "poise": [
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0,
            18.0
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
          "value": 0.9,
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
          "key": "poise",
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
      "targetGroupWrites": [
        {
          "startFrame": 23,
          "endFrame": 33,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
      "key": "finisher",
      "skillId": "chr_0006_wolfgd_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0006_wolfgd_power_attack.json",
      "timelineBlockFrames": 34,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 4,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 34,
          "endFrame": 58,
          "skillIds": [
            "chr_0006_wolfgd_normal_skill",
            "chr_0006_wolfgd_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 58,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0006_wolfgd_normal_skill",
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
              "skillId": "chr_0006_wolfgd_combo_skill",
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
          "endFrame": 150,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 5,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 44,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "CameraImpulseAction",
            "GainBreakingAttackAtb"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 10,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 43,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 21,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 43,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 58,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 58,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 21,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 93,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 41,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 68,
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
          "startFrame": 34,
          "endFrame": 93,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 50,
          "endFrame": 64,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 63,
          "endFrame": 77,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 0,
          "endFrame": 34,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 84,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 84,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 44,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 96,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 20,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 34,
          "endFrame": 44,
          "actionIndex": 3,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 4.0,
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
                "value": 1.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
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
          "startFrame": 0,
          "endFrame": 60,
          "actionIndex": 34,
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
          "sequenceIndex": 19,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 34,
          "actionIndex": 35,
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
          "sequenceIndex": 20,
          "autoFinishByAction": true
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
          "key": "atk_scale",
          "value": 0.35,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale"
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
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "DamageAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 34,
          "endFrame": 44,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[2]",
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
      "key": "plungingAttack",
      "skillId": "chr_0006_wolfgd_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0006_wolfgd_plunging_attack_end.json",
      "timelineBlockFrames": 8,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 8,
          "endFrame": 20,
          "skillIds": [
            "chr_0006_wolfgd_attack1"
          ]
        }
      ],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 120,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 34,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 5,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 6,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 20,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 20,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 34,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 2,
          "endFrame": 6,
          "actionIndex": 3,
          "damageUnits": [
            {
              "damageType": "Fire",
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
          "sequenceIndex": 3
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
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
        "DamageAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 2,
          "endFrame": 5,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[2]",
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
      "skillId": "chr_0006_wolfgd_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0006_wolfgd_normal_skill.json",
      "timelineBlockFrames": 32,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 3.0,
      "costFrame": 0,
      "costType": "Atb",
      "costValue": 40.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 32,
          "endFrame": 54,
          "skillIds": [
            "chr_0006_wolfgd_normal_skill"
          ]
        },
        {
          "startFrame": 152,
          "endFrame": 184,
          "skillIds": [
            "chr_0006_wolfgd_normal_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 54,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0006_wolfgd_normal_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": true,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.2,
                "blackboardKey": ""
              }
            }
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 175,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0006_wolfgd_normal_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": true,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.2,
                "blackboardKey": ""
              }
            }
          ]
        }
      ],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 32,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 118,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 247,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 9,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "CameraImpulseAction",
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 20,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "CameraImpulseAction",
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "CameraImpulseAction",
            "IfElseAction",
            "LaunchProjectile",
            "Selector",
            "LaunchProjectile",
            "Selector",
            "CheckSquadInFight",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 128,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 141,
          "endFrame": 146,
          "actionTypes": [
            "CameraImpulseAction",
            "LaunchProjectile",
            "Selector",
            "IfElseAction",
            "DebugPrintAction",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "CreateBuffAction",
            "DebugPrintAction",
            "FindTargetAction",
            "Selector",
            "ModifyDynamicBlackboard",
            "CreateBuffAction"
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
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "EffectAction",
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionTypes": [
            "JumpToAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 51,
          "actionTypes": [
            "MarkCanInterrupt"
          ]
        },
        {
          "startFrame": 117,
          "endFrame": 117,
          "actionTypes": [
            "JumpToAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 20,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 177,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 31,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 153,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 40,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 153,
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
          "startFrame": 138,
          "endFrame": 182,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 44,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 138,
          "endFrame": 184,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 52,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 159,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 64,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 44,
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
          "endFrame": 107,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 107,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 124,
          "endFrame": 138,
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
          "startFrame": 124,
          "endFrame": 143,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 175,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 54,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 152,
          "endFrame": 184,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 272,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 272,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 272,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 272,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 26,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 137,
          "endFrame": 161,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 272,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 272,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GE",
              "left": {
                "value": 0.0,
                "blackboardKey": "SpellInflict",
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
              "actionType": "LaunchProjectile",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 13,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0006_wolfgd_normal_skill_projhit_1"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
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
                  "finderType": "MainTargetFinder",
                  "validatorTypes": [],
                  "postProcessorTypes": []
                }
              },
              "projectileTriggeredSkills": [
                {
                  "launchFrame": 23,
                  "actionOrder": [
                    11,
                    0
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
                  "triggerEvent": "hit",
                  "triggerSkillId": "chr_0006_wolfgd_normal_skill_projhit_1",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0006_wolfgd_normal_skill_projhit_1.json",
                  "damageUnits": [
                    {
                      "damageType": "Fire",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 1.0,
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
                      "damageDecorateMask": 4352
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
                        "blackboardKey": "poise_first_bullet",
                        "levelValues": [
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67
                        ]
                      },
                      "definiteValue": null,
                      "damageDecorateMask": 0
                    }
                  ],
                  "directDamageHits": [
                    {
                      "startFrame": 0,
                      "endFrame": 0,
                      "actionIndex": 0,
                      "damageUnits": [
                        {
                          "damageType": "Fire",
                          "attributeType": "Hp",
                          "calculation": "standard",
                          "attackScale": {
                            "value": 1.0,
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
                          "damageDecorateMask": 4352
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
                            "blackboardKey": "poise_first_bullet",
                            "levelValues": [
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67
                            ]
                          },
                          "definiteValue": null,
                          "damageDecorateMask": 0
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
              ]
            }
          ],
          "failActions": [
            {
              "actionType": "LaunchProjectile",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 14,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0006_wolfgd_normal_skill_projhit_FireSpellInfiction"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
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
                  "finderType": "MainTargetFinder",
                  "validatorTypes": [],
                  "postProcessorTypes": []
                }
              },
              "projectileTriggeredSkills": [
                {
                  "launchFrame": 23,
                  "actionOrder": [
                    11,
                    0
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
                  "triggerEvent": "hit",
                  "triggerSkillId": "chr_0006_wolfgd_normal_skill_projhit_FireSpellInfiction",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0006_wolfgd_normal_skill_projhit_FireSpellInfiction.json",
                  "damageUnits": [
                    {
                      "damageType": "Fire",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 1.0,
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
                      "damageDecorateMask": 4352
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
                        "blackboardKey": "poise_first_bullet",
                        "levelValues": [
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67,
                          1.67
                        ]
                      },
                      "definiteValue": null,
                      "damageDecorateMask": 0
                    }
                  ],
                  "directDamageHits": [
                    {
                      "startFrame": 0,
                      "endFrame": 0,
                      "actionIndex": 1,
                      "damageUnits": [
                        {
                          "damageType": "Fire",
                          "attributeType": "Hp",
                          "calculation": "standard",
                          "attackScale": {
                            "value": 1.0,
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
                          "damageDecorateMask": 4352
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
                            "blackboardKey": "poise_first_bullet",
                            "levelValues": [
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67,
                              1.67
                            ]
                          },
                          "definiteValue": null,
                          "damageDecorateMask": 0
                        }
                      ],
                      "timedMarkerGate": null,
                      "sequenceIndex": 0
                    }
                  ],
                  "conditionalActions": [],
                  "auxiliaryActions": [],
                  "resourceGains": [],
                  "inflictions": [
                    {
                      "startFrame": 0,
                      "endFrame": 0,
                      "actionIndex": 0,
                      "element": "heat",
                      "isExtra": false,
                      "sequenceIndex": 0
                    }
                  ],
                  "combatActions": [
                    "DamageAction",
                    "SpellInfliction"
                  ],
                  "cycleTruncated": false,
                  "nestedProjectileTriggeredSkills": [],
                  "abilityEntityHits": [],
                  "auraActions": []
                }
              ]
            }
          ],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 141,
          "endFrame": 146,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
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
            },
            {
              "sourceType": "CheckBuffStackNumAdvanced",
              "supported": true,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "buffStack": {
                "targetSource": "Source",
                "targetGroupKey": "",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0006_wolfgd_talent_0_effectbuff"
                ],
                "tagQueryType": "hasAny",
                "buffTagIds": [],
                "countType": "BuffCount",
                "comparison": "GE",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "limitSkillCastId": false
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
              "actionType": "GetTargetBuffBBAdvanced",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 24,
              "buffBlackboardRead": {
                "outputKey": "add",
                "desiredKey": "add",
                "targetSource": "Source",
                "targetGroupKey": "",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0006_wolfgd_talent_0"
                ],
                "tagQueryType": "hasAny",
                "buffTagIds": []
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "GetTargetBuffBBAdvanced",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 25,
              "buffBlackboardRead": {
                "outputKey": "duration",
                "desiredKey": "duration",
                "targetSource": "Source",
                "targetGroupKey": "",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0006_wolfgd_talent_0"
                ],
                "tagQueryType": "hasAny",
                "buffTagIds": []
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 26,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0006_wolfgd_talent_0_effectbuff",
                    "classification": null,
                    "blackboardAssignments": {
                      "add": {
                        "value": 0.0,
                        "blackboardKey": "add",
                        "levelValues": null
                      },
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 6,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[6]"
              ],
              "serverActionIndex": 29,
              "blackboardMutation": {
                "key": "teammate_percent",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "add",
                  "levelValues": null
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[7]"
              ],
              "serverActionIndex": 30,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0006_wolfgd_talent_0_effectbuff",
                    "classification": null,
                    "blackboardAssignments": {
                      "add": {
                        "value": 0.0,
                        "blackboardKey": "teammate_percent",
                        "levelValues": null
                      },
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
                        "levelValues": null
                      }
                    }
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "Target",
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
          "conditionNegated": [
            false,
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionIndex": 38,
          "actionPath": [
            "timelineActions[9]",
            "_sequenceActionData",
            "actionData",
            "[0]"
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
                "targetSource": "Context",
                "targetGroupKey": "smart_target",
                "tagQueryType": "hasAny",
                "tagIds": [
                  -1110095722,
                  1466867135
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[9]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 40,
              "blackboardMutation": {
                "key": "SpellInflict",
                "operation": "Assign",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 16,
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
          "sequenceIndex": 5,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 6,
          "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_normal_skill_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 16,
          "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_normal_skill_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 141,
          "projectileId": "projectile_chr_0006_wolfgd_normal_skill_plus",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0006_wolfgd_normal_skill_plus_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 6,
          "actionOrder": [
            5
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_normal_skill_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_normal_skill_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
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
              "damageDecorateMask": 4352
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
                "blackboardKey": "poise_first_bullet",
                "levelValues": [
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 0,
              "actionIndex": 1,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
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
                  "damageDecorateMask": 4352
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
                    "blackboardKey": "poise_first_bullet",
                    "levelValues": [
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67
                    ]
                  },
                  "definiteValue": null,
                  "damageDecorateMask": 0
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
        },
        {
          "launchFrame": 16,
          "actionOrder": [
            8
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_normal_skill_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_normal_skill_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
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
              "damageDecorateMask": 4352
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
                "blackboardKey": "poise_first_bullet",
                "levelValues": [
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67,
                  1.67
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 0,
              "actionIndex": 1,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
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
                  "damageDecorateMask": 4352
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
                    "blackboardKey": "poise_first_bullet",
                    "levelValues": [
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67,
                      1.67
                    ]
                  },
                  "definiteValue": null,
                  "damageDecorateMask": 0
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
        },
        {
          "launchFrame": 141,
          "actionOrder": [
            19
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0006_wolfgd_normal_skill_plus",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0006_wolfgd_normal_skill_plus_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0006_wolfgd_normal_skill_plus_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 0,
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[2]"
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
                    "targetSource": "Target",
                    "targetGroupKey": "smart_target",
                    "tagQueryType": "hasAny",
                    "tagIds": [
                      -1110095722,
                      1466867135
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
                  "actionType": "IfElseAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "succeedActions",
                    "actionData",
                    "[0]"
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
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "conditions": [
                      {
                        "sourceType": "CompareFloat",
                        "supported": true,
                        "comparison": "GT",
                        "left": {
                          "value": 0.0,
                          "blackboardKey": "talent2",
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
                        "actionType": "IfElseAction",
                        "actionIndex": 0,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[2]",
                          "succeedActions",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[0]"
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
                            "[2]",
                            "succeedActions",
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
                              "comparison": "GT",
                              "left": {
                                "value": 0.0,
                                "blackboardKey": "potential_2",
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
                              "actionType": "ModifyDynamicBlackboard",
                              "actionIndex": 0,
                              "actionPath": [
                                "timelineActions[0]",
                                "_sequenceActionData",
                                "actionData",
                                "[2]",
                                "succeedActions",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[0]"
                              ],
                              "serverActionIndex": 8,
                              "blackboardMutation": {
                                "key": "returnskillpower",
                                "operation": "Add",
                                "value": {
                                  "value": 0.0,
                                  "blackboardKey": "potential_skillpower",
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
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null
                            }
                          ],
                          "failActions": [],
                          "conditionNegated": [
                            false
                          ],
                          "alwaysNext": true
                        },
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null
                      },
                      {
                        "actionType": "ObtainCostAction",
                        "actionIndex": 1,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[2]",
                          "succeedActions",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[1]"
                        ],
                        "serverActionIndex": 9,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "resourceGain": {
                          "resource": "sp",
                          "amount": {
                            "value": 40.0,
                            "blackboardKey": "returnskillpower",
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
                    "conditionNegated": [
                      false
                    ],
                    "alwaysNext": true
                  },
                  "legacyBuffFinish": null,
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
                    "[2]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 10,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Fire",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 1.0,
                        "blackboardKey": "atk_scale_plus",
                        "levelValues": [
                          3.78,
                          4.15,
                          4.53,
                          4.91,
                          5.29,
                          5.66,
                          6.04,
                          6.42,
                          6.8,
                          7.27,
                          7.84,
                          8.5
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 4352
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
                        "blackboardKey": "poise_extra_bullet",
                        "levelValues": [
                          5.0,
                          5.0,
                          5.0,
                          5.0,
                          5.0,
                          5.0,
                          5.0,
                          5.0,
                          5.0,
                          5.0,
                          5.0,
                          5.0
                        ]
                      },
                      "definiteValue": null,
                      "damageDecorateMask": 0
                    }
                  ]
                }
              ],
              "failActions": [
                {
                  "actionType": "SpellInfliction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "failActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 11,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "infliction": {
                    "element": "heat",
                    "isExtra": false
                  }
                },
                {
                  "actionType": "DamageAction",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "failActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 12,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Fire",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 1.0,
                        "blackboardKey": "atk_scale_plus_fail",
                        "levelValues": [
                          0.36,
                          0.4,
                          0.43,
                          0.47,
                          0.5,
                          0.54,
                          0.58,
                          0.61,
                          0.65,
                          0.69,
                          0.75,
                          0.81
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 4352
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
                        "blackboardKey": "poise_extra_bullet_fail",
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
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction",
            "SpellInfliction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0006_wolfgd_talent_0_effectbuff",
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
          ],
          "atk_scale_plus": [
            3.78,
            4.15,
            4.53,
            4.91,
            5.29,
            5.66,
            6.04,
            6.42,
            6.8,
            7.27,
            7.84,
            8.5
          ],
          "atk_scale_plus_fail": [
            0.36,
            0.4,
            0.43,
            0.47,
            0.5,
            0.54,
            0.58,
            0.61,
            0.65,
            0.69,
            0.75,
            0.81
          ],
          "display_atk_scale": [
            1.02,
            1.12,
            1.22,
            1.33,
            1.43,
            1.53,
            1.63,
            1.74,
            1.84,
            1.96,
            2.12,
            2.3
          ],
          "poise_extra_bullet": [
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0
          ],
          "poise_extra_bullet_fail": [
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
          "poise_first_bullet": [
            1.67,
            1.67,
            1.67,
            1.67,
            1.67,
            1.67,
            1.67,
            1.67,
            1.67,
            1.67,
            1.67,
            1.67
          ],
          "poise_first_bullet_display": [
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0,
            5.0
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
          "key": "SpellInflict",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "add",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_scale",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_plus",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_plus_fail",
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
          "key": "duration",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "poise_extra_bullet",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise_extra_bullet_fail",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise_first_bullet",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_3",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_skillpower",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "returnskillpower",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "select_radius",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "talent2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "teammate_percent",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "SpellInflict",
        "add",
        "cam_angle",
        "input_angle",
        "potential_3"
      ],
      "blackboardProvenance": [
        {
          "key": "SpellInflict",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "add",
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
          "key": "atk_scale_plus",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_plus_fail",
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
          "key": "consume_cnt",
          "declaredInSkill": true,
          "suppliedByPatch": false,
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
          "key": "poise_extra_bullet",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise_extra_bullet_fail",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise_first_bullet",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise_first_bullet_display",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_2",
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
          "key": "potential_skillpower",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "returnskillpower",
          "declaredInSkill": true,
          "suppliedByPatch": false,
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
          "key": "talent2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "teammate_percent",
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
        "IfElseAction",
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 6,
          "endFrame": 9,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target1",
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
          "startFrame": 16,
          "endFrame": 20,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target1",
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
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target2",
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
          "startFrame": 141,
          "endFrame": 146,
          "actionIndex": 28,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "succeedActions",
            "actionData",
            "[5]"
          ],
          "targetGroupKey": "Target",
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
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionIndex": 31,
          "actionPath": [
            "timelineActions[8]",
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
          "actionIndex": 32,
          "actionPath": [
            "timelineActions[8]",
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GE",
              "left": {
                "value": 0.0,
                "blackboardKey": "SpellInflict",
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
              "actionType": "LaunchProjectile",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 13,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0006_wolfgd_normal_skill_projhit_1"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
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
                  "finderType": "MainTargetFinder",
                  "validatorTypes": [],
                  "postProcessorTypes": []
                }
              }
            }
          ],
          "failActions": [
            {
              "actionType": "LaunchProjectile",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 14,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0006_wolfgd_normal_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0006_wolfgd_normal_skill_projhit_FireSpellInfiction"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
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
                  "finderType": "MainTargetFinder",
                  "validatorTypes": [],
                  "postProcessorTypes": []
                }
              }
            }
          ],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 141,
          "endFrame": 146,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
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
            },
            {
              "sourceType": "CheckBuffStackNumAdvanced",
              "supported": true,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "buffStack": {
                "targetSource": "Source",
                "targetGroupKey": "",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0006_wolfgd_talent_0_effectbuff"
                ],
                "tagQueryType": "hasAny",
                "buffTagIds": [],
                "countType": "BuffCount",
                "comparison": "GE",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "limitSkillCastId": false
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
              "actionType": "GetTargetBuffBBAdvanced",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 24,
              "buffBlackboardRead": {
                "outputKey": "add",
                "desiredKey": "add",
                "targetSource": "Source",
                "targetGroupKey": "",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0006_wolfgd_talent_0"
                ],
                "tagQueryType": "hasAny",
                "buffTagIds": []
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "GetTargetBuffBBAdvanced",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 25,
              "buffBlackboardRead": {
                "outputKey": "duration",
                "desiredKey": "duration",
                "targetSource": "Source",
                "targetGroupKey": "",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0006_wolfgd_talent_0"
                ],
                "tagQueryType": "hasAny",
                "buffTagIds": []
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 26,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0006_wolfgd_talent_0_effectbuff",
                    "classification": null,
                    "blackboardAssignments": {
                      "add": {
                        "value": 0.0,
                        "blackboardKey": "add",
                        "levelValues": null
                      },
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
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
              "actionType": "FindTargetAction",
              "actionIndex": 5,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[5]"
              ],
              "serverActionIndex": 28,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 6,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[6]"
              ],
              "serverActionIndex": 29,
              "blackboardMutation": {
                "key": "teammate_percent",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "add",
                  "levelValues": null
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[7]"
              ],
              "serverActionIndex": 30,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0006_wolfgd_talent_0_effectbuff",
                    "classification": null,
                    "blackboardAssignments": {
                      "add": {
                        "value": 0.0,
                        "blackboardKey": "teammate_percent",
                        "levelValues": null
                      },
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
                        "levelValues": null
                      }
                    }
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "Target",
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
          "conditionNegated": [
            false,
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionIndex": 38,
          "actionPath": [
            "timelineActions[9]",
            "_sequenceActionData",
            "actionData",
            "[0]"
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
                "targetSource": "Context",
                "targetGroupKey": "smart_target",
                "tagQueryType": "hasAny",
                "tagIds": [
                  -1110095722,
                  1466867135
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[9]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 40,
              "blackboardMutation": {
                "key": "SpellInflict",
                "operation": "Assign",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [
        {
          "startFrame": 31,
          "endFrame": 32,
          "destFrame": 118,
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "conditionActionTypes": [],
          "directConditions": [],
          "directConditionNegated": [],
          "directAnyConditions": [],
          "directAnyConditionNegated": [],
          "directConditionsSupported": false,
          "isOnlySequenceAction": false,
          "isOnlyBranchAction": true,
          "isRootContainerOnlySequenceAction": true,
          "sequenceIndex": 10
        },
        {
          "startFrame": 117,
          "endFrame": 117,
          "destFrame": 247,
          "actionIndex": 47,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditionActionTypes": [],
          "directConditions": [],
          "directConditionNegated": [],
          "directAnyConditions": [],
          "directAnyConditionNegated": [],
          "directConditionsSupported": false,
          "isOnlySequenceAction": true,
          "isOnlyBranchAction": true,
          "isRootContainerOnlySequenceAction": true,
          "sequenceIndex": 12
        }
      ],
      "timelineJumpControlFlowActions": [
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 43,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
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
                "blackboardKey": "SpellInflict",
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
              "actionType": "JumpToAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 45,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "timelineJumpDestinationFrame": 118
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        }
      ],
      "timelineFinishes": []
    },
    {
      "key": "ultimate",
      "skillId": "chr_0006_wolfgd_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0006_wolfgd_ultimate_skill.json",
      "timelineBlockFrames": 75,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 30.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 75,
          "endFrame": 89,
          "skillIds": [
            "chr_0006_wolfgd_normal_skill",
            "chr_0006_wolfgd_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 89,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0006_wolfgd_normal_skill",
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
              "skillId": "chr_0006_wolfgd_combo_skill",
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
          "endFrame": 168,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 14,
          "actionTypes": [
            "IfElseAction",
            "SetSkillCdAtOnce"
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
          "startFrame": 45,
          "endFrame": 47,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 50,
          "endFrame": 52,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 56,
          "endFrame": 58,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 61,
          "endFrame": 63,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 47,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 63,
          "endFrame": 65,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 49,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 52,
          "endFrame": 55,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 59,
          "endFrame": 62,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 64,
          "endFrame": 67,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 69,
          "endFrame": 72,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "CheckEntityNum",
            "TeleportAction",
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 72,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 45,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 49,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 52,
          "endFrame": 55,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 59,
          "endFrame": 62,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 65,
          "endFrame": 68,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 75,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 75,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 89,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 89,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "AnimatedCameraAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 39,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 80,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 61,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 29,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 42,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 109,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 109,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 87,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 255,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 255,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 167,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 168,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 46,
          "endFrame": 49,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            },
            {
              "damageType": "Physical",
              "attributeType": "Poise",
              "calculation": "standard",
              "attackScale": {
                "value": 6.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": {
                "value": 20.0,
                "blackboardKey": "poise",
                "levelValues": [
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 9
        },
        {
          "startFrame": 52,
          "endFrame": 55,
          "actionIndex": 23,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            },
            {
              "damageType": "Pulse",
              "attributeType": "Poise",
              "calculation": "standard",
              "attackScale": {
                "value": 6.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": {
                "value": 20.0,
                "blackboardKey": "poise",
                "levelValues": [
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 10
        },
        {
          "startFrame": 59,
          "endFrame": 62,
          "actionIndex": 27,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            },
            {
              "damageType": "Pulse",
              "attributeType": "Poise",
              "calculation": "standard",
              "attackScale": {
                "value": 6.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": {
                "value": 20.0,
                "blackboardKey": "poise",
                "levelValues": [
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 11
        },
        {
          "startFrame": 64,
          "endFrame": 67,
          "actionIndex": 31,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            },
            {
              "damageType": "Physical",
              "attributeType": "Poise",
              "calculation": "standard",
              "attackScale": {
                "value": 6.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": {
                "value": 20.0,
                "blackboardKey": "poise",
                "levelValues": [
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 12
        },
        {
          "startFrame": 69,
          "endFrame": 72,
          "actionIndex": 35,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            },
            {
              "damageType": "Physical",
              "attributeType": "Poise",
              "calculation": "standard",
              "attackScale": {
                "value": 6.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.32,
                  0.35,
                  0.38,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
                  0.54,
                  0.58,
                  0.62,
                  0.66,
                  0.72
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": {
                "value": 20.0,
                "blackboardKey": "poise",
                "levelValues": [
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0,
                  3.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 13
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 0,
          "endFrame": 14,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
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
              "actionType": "SetSkillCdAtOnce",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 3,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": {
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
                "useSkillType": true,
                "skillTypeMask": "ComboSkill",
                "skillId": "",
                "functionType": "Set",
                "isPercentage": false,
                "value": {
                  "value": 0.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              },
              "buffIgnite": null
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 45,
          "endFrame": 45,
          "actionIndex": 48,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_fire_fire_burning_triggered",
          "classification": null,
          "targetSource": "Target",
          "targetGroupKey": "target1",
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
          "sequenceIndex": 16,
          "autoFinishByAction": false
        },
        {
          "startFrame": 0,
          "endFrame": 80,
          "actionIndex": 68,
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
          "sequenceIndex": 30,
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
          "launchFrame": 45,
          "projectileId": "projectile_chr_0006_wolfgd_UltimateWolf",
          "skillTriggers": [],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 50,
          "projectileId": "projectile_chr_0006_wolfgd_UltimateWolf",
          "skillTriggers": [],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 56,
          "projectileId": "projectile_chr_0006_wolfgd_UltimateWolf",
          "skillTriggers": [],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 61,
          "projectileId": "projectile_chr_0006_wolfgd_UltimateWolf",
          "skillTriggers": [],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 45,
          "projectileId": "projectile_chr_0006_wolfgd_UltimateWolf",
          "skillTriggers": [],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 63,
          "projectileId": "projectile_chr_0006_wolfgd_UltimateWolf",
          "skillTriggers": [],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_common_damage_immune_ult_skill",
        "buff_common_fire_fire_burning_triggered"
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
            0.32,
            0.35,
            0.38,
            0.42,
            0.45,
            0.48,
            0.51,
            0.54,
            0.58,
            0.62,
            0.66,
            0.72
          ],
          "display_atk_scale": [
            1.6,
            1.76,
            1.92,
            2.08,
            2.24,
            2.4,
            2.56,
            2.72,
            2.88,
            3.08,
            3.32,
            3.6
          ],
          "poise": [
            3.0,
            3.0,
            3.0,
            3.0,
            3.0,
            3.0,
            3.0,
            3.0,
            3.0,
            3.0,
            3.0,
            3.0
          ],
          "poise_display": [
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
          90.0,
          90.0,
          90.0,
          90.0,
          90.0,
          90.0,
          90.0,
          90.0,
          90.0,
          90.0,
          90.0,
          90.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "CamAngle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "angle",
          "value": 360.0,
          "isDynamic": false
        },
        {
          "key": "atk_duration",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 1.5,
          "isDynamic": false
        },
        {
          "key": "atk_scale_plus",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_up",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "dmg_increase",
          "value": 0.3,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_lv",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "radius",
          "value": 5.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "angle",
        "atk_scale",
        "poise",
        "potential_5"
      ],
      "blackboardProvenance": [
        {
          "key": "CamAngle",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "angle",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_duration",
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
          "key": "atk_scale_plus",
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
          "key": "display_atk_scale",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "dmg_increase",
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
          "key": "poise",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise_display",
          "declaredInSkill": false,
          "suppliedByPatch": true,
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
          "key": "potential_lv",
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
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "DamageAction",
        "IfElseAction",
        "LaunchProjectile",
        "SetSkillCdAtOnce"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 45,
          "endFrame": 47,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targetpoint",
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
          "startFrame": 50,
          "endFrame": 52,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targetpoint",
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
          "startFrame": 56,
          "endFrame": 58,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targetpoint",
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
          "startFrame": 61,
          "endFrame": 63,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[6]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targetpoint",
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
          "startFrame": 45,
          "endFrame": 47,
          "actionIndex": 13,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targetpoint",
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
          "startFrame": 63,
          "endFrame": 65,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targetpoint",
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
          "startFrame": 46,
          "endFrame": 49,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[9]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target1",
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
        },
        {
          "startFrame": 52,
          "endFrame": 55,
          "actionIndex": 21,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target2",
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
        },
        {
          "startFrame": 59,
          "endFrame": 62,
          "actionIndex": 25,
          "actionPath": [
            "timelineActions[11]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target3",
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
        },
        {
          "startFrame": 64,
          "endFrame": 67,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target4",
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
        },
        {
          "startFrame": 69,
          "endFrame": 72,
          "actionIndex": 33,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target5",
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
        },
        {
          "startFrame": 45,
          "endFrame": 72,
          "actionIndex": 46,
          "actionPath": [
            "timelineActions[15]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target",
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 14,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
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
              "actionType": "SetSkillCdAtOnce",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 3,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": {
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
                "useSkillType": true,
                "skillTypeMask": "ComboSkill",
                "skillId": "",
                "functionType": "Set",
                "isPercentage": false,
                "value": {
                  "value": 0.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              },
              "buffIgnite": null
            }
          ],
          "failActions": [],
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
          "endFrame": 3,
          "actionIndex": 4,
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
          "sequenceIndex": 2,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionIndex": 61,
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
          "sequenceIndex": 27,
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
