/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const estellaGeneratedSource = {
  "slug": "estella",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0021_whiten_combo_skill_physical_vulnerable",
      "sourceFile": "buff_chr_0021_whiten_combo_skill_physical_vulnerable.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 10.0,
          "blackboardKey": "duration",
          "levelValues": [
            3.0
          ]
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
          "value": 3.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": -0.3,
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
                "blackboardKey": "rate",
                "levelValues": [
                  -0.3
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
          "event": "DuringBuffEnable",
          "orderedActionTypes": [
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
      "buffId": "buff_chr_0021_whiten_potential_5",
      "sourceFile": "buff_chr_0021_whiten_potential_5.json",
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
          "key": "cd",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 5.0,
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
            "buff_chr_0021_whiten_potential_5_inaura"
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
          "sourceFile": "buff_chr_0021_whiten_potential_5.json",
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
          "debugName": "whiten_recover_usp",
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
          "targetObjectType": "EnemyAll",
          "targetFilter": {
            "checkAlive": true,
            "autoSetTargetFaction": true,
            "factionTarget": "Anti",
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
          "buffSource": "ActionOwner",
          "buffs": [
            {
              "buffId": "buff_chr_0021_whiten_potential_5_inaura",
              "classification": null,
              "blackboardAssignments": {
                "usp": {
                  "value": 0.0,
                  "blackboardKey": "usp",
                  "levelValues": [
                    5.0
                  ]
                },
                "cd": {
                  "value": 0.0,
                  "blackboardKey": "cd",
                  "levelValues": [
                    1.0
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
      }
    },
    {
      "buffId": "buff_chr_0021_whiten_potential_5_inaura",
      "sourceFile": "buff_chr_0021_whiten_potential_5_inaura.json",
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
          "key": "cd",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 5.0,
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
          "event": "OnAddedBuff",
          "orderedActionTypes": [
            "CheckBuffIdInContext",
            "CheckTimedMarkerCondition",
            "CreateTimedMarker",
            "ObtainCostAction"
          ],
          "combatActions": [
            "CreateTimedMarker",
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
                "CheckBuffIdInContext",
                "CheckTimedMarkerCondition",
                "CreateTimedMarker",
                "ObtainCostAction"
              ],
              "combatActions": [
                "CreateTimedMarker",
                "ObtainCostAction"
              ],
              "buffApplications": [],
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
                            1535684437
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
                        "actionType": "CheckTimedMarkerCondition",
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
                                "markerId": "buff_chr_0021_whiten_potential_5_cd",
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
                              "actionType": "CreateTimedMarker",
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
                              "timedMarkerApplication": {
                                "targetSource": "Source",
                                "targetGroupKey": "",
                                "markerId": "buff_chr_0021_whiten_potential_5_cd",
                                "duration": {
                                  "value": 0.0,
                                  "blackboardKey": "cd",
                                  "levelValues": [
                                    1.0
                                  ]
                                },
                                "autoFinishByAction": false,
                                "useTimeDilationDt": false
                              }
                            },
                            {
                              "actionType": "ObtainCostAction",
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
                              "resourceGain": {
                                "resource": "ultimateEnergy",
                                "amount": {
                                  "value": 0.0,
                                  "blackboardKey": "usp",
                                  "levelValues": [
                                    5.0
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
      "key": "basicAttack1",
      "skillId": "chr_0021_whiten_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0021_whiten_attack1.json",
      "timelineBlockFrames": 13,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 6,
      "allowNextWindows": [
        {
          "startFrame": 13,
          "endFrame": 28,
          "skillIds": [
            "chr_0021_whiten_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 6,
          "endFrame": 28,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0021_whiten_attack2",
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
          "endFrame": 105,
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
          "endFrame": 105,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 6,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "CameraImpulseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 33,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 105,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 28,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 23,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 90,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 28,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 28,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 6,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.25,
                  0.28,
                  0.3,
                  0.33,
                  0.35,
                  0.38,
                  0.4,
                  0.43,
                  0.45,
                  0.48,
                  0.52,
                  0.56
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 5
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[5]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 13,
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
                "onlyMainOperator": true,
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
            0.25,
            0.28,
            0.3,
            0.33,
            0.35,
            0.38,
            0.4,
            0.43,
            0.45,
            0.48,
            0.52,
            0.56
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
          "value": 0.15,
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
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[4]",
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[5]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 13,
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
                "onlyMainOperator": true,
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
      "skillId": "chr_0021_whiten_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0021_whiten_attack2.json",
      "timelineBlockFrames": 16,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 8,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 6,
      "allowNextWindows": [
        {
          "startFrame": 16,
          "endFrame": 30,
          "skillIds": [
            "chr_0021_whiten_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 7,
          "endFrame": 30,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0021_whiten_attack3",
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
          "endFrame": 123,
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
          "endFrame": 99,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "CameraImpulseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 33,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 9,
          "actionTypes": [
            "CameraImpulseAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 28,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 123,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 26,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 57,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 41,
          "endFrame": 63,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 30,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 30,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 4,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale",
                "levelValues": [
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
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 4
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[4]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 12,
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
                "onlyMainOperator": true,
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
          "value": 0.35,
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
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[3]",
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[4]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 12,
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
                "onlyMainOperator": true,
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
      "skillId": "chr_0021_whiten_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0021_whiten_attack3.json",
      "timelineBlockFrames": 28,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 20,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 7,
      "allowNextWindows": [
        {
          "startFrame": 28,
          "endFrame": 43,
          "skillIds": [
            "chr_0021_whiten_attack4"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 15,
          "endFrame": 43,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0021_whiten_attack4",
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
          "endFrame": 153,
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
          "endFrame": 82,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 19,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "CameraImpulseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 19,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "CameraImpulseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 52,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 53,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 21,
          "actionTypes": [
            "CameraImpulseAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 28,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 27,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 35,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 35,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 36,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 153,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 37,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 59,
          "endFrame": 100,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 55,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 43,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 43,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 5,
          "damageUnits": [
            {
              "damageType": "Physical",
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
          "sequenceIndex": 5
        },
        {
          "startFrame": 18,
          "endFrame": 19,
          "actionIndex": 13,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale2",
                "levelValues": [
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
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 6
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[5]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 12,
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
                "onlyMainOperator": true,
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
        {
          "startFrame": 18,
          "endFrame": 19,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[6]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 20,
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
                "onlyMainOperator": true,
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
          "atk_scale2": [
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
          "value": 0.2,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 0.3,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale",
        "atk_scale2"
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
        },
        {
          "key": "atk_scale2",
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
        "DamageAction",
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[3]",
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
        },
        {
          "startFrame": 18,
          "endFrame": 19,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[4]",
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[5]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 12,
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
                "onlyMainOperator": true,
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
        {
          "startFrame": 18,
          "endFrame": 19,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[6]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 20,
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
                "onlyMainOperator": true,
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
      "skillId": "chr_0021_whiten_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0021_whiten_attack4.json",
      "timelineBlockFrames": 46,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 8,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 21,
      "allowNextWindows": [
        {
          "startFrame": 46,
          "endFrame": 59,
          "skillIds": [
            "chr_0021_whiten_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 24,
          "endFrame": 59,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0021_whiten_attack1",
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
          "endFrame": 7,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 16,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 134,
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
          "endFrame": 7,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 16,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 133,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "HitStopAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 96,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 68,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 134,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 31,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 48,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 50,
          "endFrame": 69,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 59,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 59,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 9,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.4,
                  0.44,
                  0.48,
                  0.52,
                  0.56,
                  0.6,
                  0.64,
                  0.68,
                  0.72,
                  0.77,
                  0.83,
                  0.9
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
                  17.0,
                  17.0,
                  17.0,
                  17.0,
                  17.0,
                  17.0,
                  17.0,
                  17.0,
                  17.0,
                  17.0,
                  17.0,
                  17.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 9
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[9]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[9]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 15,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
                  "levelValues": [
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0
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
            19.0,
            19.0,
            19.0,
            19.0,
            19.0,
            19.0,
            19.0,
            19.0,
            19.0,
            19.0,
            19.0,
            19.0
          ],
          "atk_scale": [
            0.4,
            0.44,
            0.48,
            0.52,
            0.56,
            0.6,
            0.64,
            0.68,
            0.72,
            0.77,
            0.83,
            0.9
          ],
          "poise": [
            17.0,
            17.0,
            17.0,
            17.0,
            17.0,
            17.0,
            17.0,
            17.0,
            17.0,
            17.0,
            17.0,
            17.0
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
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.22,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 15.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale",
        "poise"
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
        "DamageAction",
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[8]",
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[9]",
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
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[9]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 15,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
                  "levelValues": [
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0,
                    19.0
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
      "skillId": "chr_0021_whiten_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0021_whiten_power_attack.json",
      "timelineBlockFrames": 30,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 4,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 30,
          "endFrame": 58,
          "skillIds": [
            "chr_0021_whiten_normal_skill",
            "chr_0021_whiten_combo_skill"
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
              "skillId": "chr_0021_whiten_normal_skill",
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
              "skillId": "chr_0021_whiten_combo_skill",
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
          "endFrame": 151,
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
          "startFrame": 0,
          "endFrame": 23,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 151,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 46,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 46,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 30,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 36,
          "actionTypes": [
            "BreakInteractiveAction",
            "DefiniteValueCalculation",
            "Selector"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 33,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 39,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "EffectAction",
            "EnemyHurtAnimAction",
            "GainBreakingAttackAtb"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 34,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 58,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 64,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "CreateBuffAction"
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
          "endFrame": 58,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 58,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 151,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 59,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 57,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 73,
          "endFrame": 116,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 40,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 30,
          "endFrame": 39,
          "actionIndex": 20,
          "damageUnits": [
            {
              "damageType": "Physical",
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
          "sequenceIndex": 11
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 50,
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
          "sequenceIndex": 17,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 30,
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
          "sequenceIndex": 18,
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
      "skillId": "chr_0021_whiten_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0021_whiten_plunging_attack_end.json",
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
          "endFrame": 175,
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
            "IfElseAction",
            "ObtainCostAction"
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
          "endFrame": 50,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 175,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 34,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 52,
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
              "damageType": "Physical",
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
      "conditionalActions": [
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[2]",
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
                "targetGroupKey": "tar"
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
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 7,
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
                "onlyMainOperator": true,
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
          "value": 0.4,
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
        "IfElseAction",
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[2]",
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
                "targetGroupKey": "tar"
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
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 7,
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
                "onlyMainOperator": true,
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
      "skillId": "chr_0021_whiten_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0021_whiten_normal_skill.json",
      "timelineBlockFrames": 46,
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
          "endFrame": 121,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 7,
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
          "endFrame": 3,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 50,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
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
          "startFrame": 21,
          "endFrame": 24,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionTypes": [
            "CheckBuffStackNumAdvanced",
            "GetTargetBuffBBAdvanced",
            "ObtainCostAction",
            "FinishBuffAdvanced"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionTypes": [
            "EffectAction"
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
          "endFrame": 121,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 90,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 62,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [
            {
              "sourceType": "CheckEntityNum",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "entityCount": {
                "targetSource": "Context",
                "targetGroupKey": "maintar",
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
              "actionType": "LaunchProjectile",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 65,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0021_whiten_normal_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0021_whiten_normal_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "tar_behind",
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
              "projectileTriggeredSkills": [
                {
                  "launchFrame": 21,
                  "actionOrder": [
                    62,
                    1
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0021_whiten_normal_skill",
                  "triggerEvent": "hit",
                  "triggerSkillId": "chr_0021_whiten_normal_skill_projhit",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0021_whiten_normal_skill_projhit.json",
                  "damageUnits": [],
                  "directDamageHits": [],
                  "conditionalActions": [
                    {
                      "startFrame": 0,
                      "endFrame": 0,
                      "actionIndex": 5,
                      "actionPath": [
                        "timelineActions[1]",
                        "_sequenceActionData",
                        "actionData",
                        "[2]",
                        "action",
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
                            "blackboardKey": "EntityBB_first_hit",
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
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 7,
                          "blackboardMutation": {
                            "key": "EntityBB_first_hit",
                            "operation": "Add",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": null,
                              "levelValues": null
                            }
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        },
                        {
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 1,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 8,
                          "blackboardMutation": {
                            "key": "up_atk_scale",
                            "operation": "Assign",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": "atk_scale",
                              "levelValues": [
                                1.56,
                                1.71,
                                1.87,
                                2.02,
                                2.18,
                                2.34,
                                2.49,
                                2.65,
                                2.8,
                                3.0,
                                3.23,
                                3.5
                              ]
                            }
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        },
                        {
                          "actionType": "DamageAction",
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[2]"
                          ],
                          "serverActionIndex": 9,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "damageUnits": [
                            {
                              "damageType": "Cryst",
                              "attributeType": "Hp",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 0.0,
                                "blackboardKey": "up_atk_scale",
                                "levelValues": [
                                  0.0
                                ]
                              },
                              "calculationMultiplier": null,
                              "poiseValue": null,
                              "definiteValue": null,
                              "damageDecorateMask": 4352
                            },
                            {
                              "damageType": "Cryst",
                              "attributeType": "Poise",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 4.0,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  1.56,
                                  1.71,
                                  1.87,
                                  2.02,
                                  2.18,
                                  2.34,
                                  2.49,
                                  2.65,
                                  2.8,
                                  3.0,
                                  3.23,
                                  3.5
                                ]
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
                          ]
                        },
                        {
                          "actionType": "CreateBuffAction",
                          "actionIndex": 4,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[4]"
                          ],
                          "serverActionIndex": 11,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "buffApplication": {
                            "buffs": [
                              {
                                "buffId": "buff_common_obtain_ultimate_sp",
                                "classification": "skillCostUltimateEnergyGain",
                                "blackboardAssignments": {}
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
                      "failActions": [
                        {
                          "actionType": "DamageAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 14,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "damageUnits": [
                            {
                              "damageType": "Cryst",
                              "attributeType": "Hp",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 0.0,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  1.56,
                                  1.71,
                                  1.87,
                                  2.02,
                                  2.18,
                                  2.34,
                                  2.49,
                                  2.65,
                                  2.8,
                                  3.0,
                                  3.23,
                                  3.5
                                ]
                              },
                              "calculationMultiplier": null,
                              "poiseValue": null,
                              "definiteValue": null,
                              "damageDecorateMask": 4352
                            },
                            {
                              "damageType": "Cryst",
                              "attributeType": "Poise",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 4.0,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  1.56,
                                  1.71,
                                  1.87,
                                  2.02,
                                  2.18,
                                  2.34,
                                  2.49,
                                  2.65,
                                  2.8,
                                  3.0,
                                  3.23,
                                  3.5
                                ]
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
                  "inflictions": [
                    {
                      "startFrame": 0,
                      "endFrame": 0,
                      "actionIndex": 3,
                      "element": "cryo",
                      "isExtra": false,
                      "sequenceIndex": 1
                    }
                  ],
                  "combatActions": [
                    "CreateBuffAction",
                    "DamageAction",
                    "IfElseAction",
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
          "failActions": [
            {
              "actionType": "LaunchProjectile",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 67,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0021_whiten_normal_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0021_whiten_normal_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "tar_behind",
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
              "projectileTriggeredSkills": [
                {
                  "launchFrame": 21,
                  "actionOrder": [
                    62,
                    1
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0021_whiten_normal_skill",
                  "triggerEvent": "hit",
                  "triggerSkillId": "chr_0021_whiten_normal_skill_projhit",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0021_whiten_normal_skill_projhit.json",
                  "damageUnits": [],
                  "directDamageHits": [],
                  "conditionalActions": [
                    {
                      "startFrame": 0,
                      "endFrame": 0,
                      "actionIndex": 5,
                      "actionPath": [
                        "timelineActions[1]",
                        "_sequenceActionData",
                        "actionData",
                        "[2]",
                        "action",
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
                            "blackboardKey": "EntityBB_first_hit",
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
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 7,
                          "blackboardMutation": {
                            "key": "EntityBB_first_hit",
                            "operation": "Add",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": null,
                              "levelValues": null
                            }
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        },
                        {
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 1,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 8,
                          "blackboardMutation": {
                            "key": "up_atk_scale",
                            "operation": "Assign",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": "atk_scale",
                              "levelValues": [
                                1.56,
                                1.71,
                                1.87,
                                2.02,
                                2.18,
                                2.34,
                                2.49,
                                2.65,
                                2.8,
                                3.0,
                                3.23,
                                3.5
                              ]
                            }
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        },
                        {
                          "actionType": "DamageAction",
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[2]"
                          ],
                          "serverActionIndex": 9,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "damageUnits": [
                            {
                              "damageType": "Cryst",
                              "attributeType": "Hp",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 0.0,
                                "blackboardKey": "up_atk_scale",
                                "levelValues": [
                                  0.0
                                ]
                              },
                              "calculationMultiplier": null,
                              "poiseValue": null,
                              "definiteValue": null,
                              "damageDecorateMask": 4352
                            },
                            {
                              "damageType": "Cryst",
                              "attributeType": "Poise",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 4.0,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  1.56,
                                  1.71,
                                  1.87,
                                  2.02,
                                  2.18,
                                  2.34,
                                  2.49,
                                  2.65,
                                  2.8,
                                  3.0,
                                  3.23,
                                  3.5
                                ]
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
                          ]
                        },
                        {
                          "actionType": "CreateBuffAction",
                          "actionIndex": 4,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[4]"
                          ],
                          "serverActionIndex": 11,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "buffApplication": {
                            "buffs": [
                              {
                                "buffId": "buff_common_obtain_ultimate_sp",
                                "classification": "skillCostUltimateEnergyGain",
                                "blackboardAssignments": {}
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
                      "failActions": [
                        {
                          "actionType": "DamageAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 14,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "damageUnits": [
                            {
                              "damageType": "Cryst",
                              "attributeType": "Hp",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 0.0,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  1.56,
                                  1.71,
                                  1.87,
                                  2.02,
                                  2.18,
                                  2.34,
                                  2.49,
                                  2.65,
                                  2.8,
                                  3.0,
                                  3.23,
                                  3.5
                                ]
                              },
                              "calculationMultiplier": null,
                              "poiseValue": null,
                              "definiteValue": null,
                              "damageDecorateMask": 4352
                            },
                            {
                              "damageType": "Cryst",
                              "attributeType": "Poise",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 4.0,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  1.56,
                                  1.71,
                                  1.87,
                                  2.02,
                                  2.18,
                                  2.34,
                                  2.49,
                                  2.65,
                                  2.8,
                                  3.0,
                                  3.23,
                                  3.5
                                ]
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
                  "inflictions": [
                    {
                      "startFrame": 0,
                      "endFrame": 0,
                      "actionIndex": 3,
                      "element": "cryo",
                      "isExtra": false,
                      "sequenceIndex": 1
                    }
                  ],
                  "combatActions": [
                    "CreateBuffAction",
                    "DamageAction",
                    "IfElseAction",
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
          "alwaysNext": true,
          "projectedProjectileLaunches": [
            {
              "launch": {
                "projectileId": "projectile_chr_0021_whiten_normal_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0021_whiten_normal_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "tar_behind",
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
              "triggeredSkills": [
                {
                  "launchFrame": 21,
                  "actionOrder": [
                    62,
                    1
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0021_whiten_normal_skill",
                  "triggerEvent": "hit",
                  "triggerSkillId": "chr_0021_whiten_normal_skill_projhit",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0021_whiten_normal_skill_projhit.json",
                  "damageUnits": [],
                  "directDamageHits": [],
                  "conditionalActions": [
                    {
                      "startFrame": 0,
                      "endFrame": 0,
                      "actionIndex": 5,
                      "actionPath": [
                        "timelineActions[1]",
                        "_sequenceActionData",
                        "actionData",
                        "[2]",
                        "action",
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
                            "blackboardKey": "EntityBB_first_hit",
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
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 7,
                          "blackboardMutation": {
                            "key": "EntityBB_first_hit",
                            "operation": "Add",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": null,
                              "levelValues": null
                            }
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        },
                        {
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 1,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 8,
                          "blackboardMutation": {
                            "key": "up_atk_scale",
                            "operation": "Assign",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": "atk_scale",
                              "levelValues": [
                                1.56,
                                1.71,
                                1.87,
                                2.02,
                                2.18,
                                2.34,
                                2.49,
                                2.65,
                                2.8,
                                3.0,
                                3.23,
                                3.5
                              ]
                            }
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        },
                        {
                          "actionType": "DamageAction",
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[2]"
                          ],
                          "serverActionIndex": 9,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "damageUnits": [
                            {
                              "damageType": "Cryst",
                              "attributeType": "Hp",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 0.0,
                                "blackboardKey": "up_atk_scale",
                                "levelValues": [
                                  0.0
                                ]
                              },
                              "calculationMultiplier": null,
                              "poiseValue": null,
                              "definiteValue": null,
                              "damageDecorateMask": 4352
                            },
                            {
                              "damageType": "Cryst",
                              "attributeType": "Poise",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 4.0,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  1.56,
                                  1.71,
                                  1.87,
                                  2.02,
                                  2.18,
                                  2.34,
                                  2.49,
                                  2.65,
                                  2.8,
                                  3.0,
                                  3.23,
                                  3.5
                                ]
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
                          ]
                        },
                        {
                          "actionType": "CreateBuffAction",
                          "actionIndex": 4,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[4]"
                          ],
                          "serverActionIndex": 11,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "buffApplication": {
                            "buffs": [
                              {
                                "buffId": "buff_common_obtain_ultimate_sp",
                                "classification": "skillCostUltimateEnergyGain",
                                "blackboardAssignments": {}
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
                      "failActions": [
                        {
                          "actionType": "DamageAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[2]",
                            "action",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 14,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "damageUnits": [
                            {
                              "damageType": "Cryst",
                              "attributeType": "Hp",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 0.0,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  1.56,
                                  1.71,
                                  1.87,
                                  2.02,
                                  2.18,
                                  2.34,
                                  2.49,
                                  2.65,
                                  2.8,
                                  3.0,
                                  3.23,
                                  3.5
                                ]
                              },
                              "calculationMultiplier": null,
                              "poiseValue": null,
                              "definiteValue": null,
                              "damageDecorateMask": 4352
                            },
                            {
                              "damageType": "Cryst",
                              "attributeType": "Poise",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 4.0,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  1.56,
                                  1.71,
                                  1.87,
                                  2.02,
                                  2.18,
                                  2.34,
                                  2.49,
                                  2.65,
                                  2.8,
                                  3.0,
                                  3.23,
                                  3.5
                                ]
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
                  "inflictions": [
                    {
                      "startFrame": 0,
                      "endFrame": 0,
                      "actionIndex": 3,
                      "element": "cryo",
                      "isExtra": false,
                      "sequenceIndex": 1
                    }
                  ],
                  "combatActions": [
                    "CreateBuffAction",
                    "DamageAction",
                    "IfElseAction",
                    "SpellInfliction"
                  ],
                  "cycleTruncated": false,
                  "nestedProjectileTriggeredSkills": [],
                  "abilityEntityHits": [],
                  "auraActions": []
                }
              ]
            }
          ]
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 69,
          "outputKey": "atb",
          "desiredKey": "atb",
          "targetSource": "Owner",
          "targetGroupKey": "",
          "buffCheckType": "Id",
          "buffIds": [
            "buff_chr_0021_whiten_talent_0_active"
          ],
          "tagQueryType": "hasAny",
          "buffTagIds": [],
          "sequenceIndex": 9
        }
      ],
      "buffFinishes": [
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 71,
          "targetSource": "Owner",
          "targetGroupKey": "",
          "buffCheckType": "Id",
          "buffIds": [
            "buff_chr_0021_whiten_talent_0_active"
          ],
          "tagQueryType": "hasAny",
          "buffTagIds": [],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": false,
          "isAbsorbed": false,
          "finishLayerCount": null,
          "sourceActionType": "FinishBuffAdvanced",
          "sequenceIndex": 9
        }
      ],
      "resourceGains": [
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 70,
          "resource": "sp",
          "amount": {
            "value": 0.0,
            "blackboardKey": "atb",
            "levelValues": null
          },
          "coefficient": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "spGainKind": "refund",
          "spGainSource": "default",
          "onlyMainOperator": false,
          "isPercentValue": false,
          "useUltimateRecoveryTag": false,
          "ultimateRecoveryTagId": 0,
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 9
        }
      ],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 21,
          "actionOrder": [
            62,
            1
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0021_whiten_normal_skill",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0021_whiten_normal_skill_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0021_whiten_normal_skill_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 0,
              "actionIndex": 5,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "action",
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
                    "blackboardKey": "EntityBB_first_hit",
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
                  "actionType": "ModifyDynamicBlackboard",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[1]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "action",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 7,
                  "blackboardMutation": {
                    "key": "EntityBB_first_hit",
                    "operation": "Add",
                    "value": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    }
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "ModifyDynamicBlackboard",
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[1]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "action",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 8,
                  "blackboardMutation": {
                    "key": "up_atk_scale",
                    "operation": "Assign",
                    "value": {
                      "value": 1.0,
                      "blackboardKey": "atk_scale",
                      "levelValues": [
                        1.56,
                        1.71,
                        1.87,
                        2.02,
                        2.18,
                        2.34,
                        2.49,
                        2.65,
                        2.8,
                        3.0,
                        3.23,
                        3.5
                      ]
                    }
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "DamageAction",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[1]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "action",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 9,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Cryst",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": "up_atk_scale",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 4352
                    },
                    {
                      "damageType": "Cryst",
                      "attributeType": "Poise",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 4.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          1.56,
                          1.71,
                          1.87,
                          2.02,
                          2.18,
                          2.34,
                          2.49,
                          2.65,
                          2.8,
                          3.0,
                          3.23,
                          3.5
                        ]
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
                  ]
                },
                {
                  "actionType": "CreateBuffAction",
                  "actionIndex": 4,
                  "actionPath": [
                    "timelineActions[1]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "action",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[4]"
                  ],
                  "serverActionIndex": 11,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_common_obtain_ultimate_sp",
                        "classification": "skillCostUltimateEnergyGain",
                        "blackboardAssignments": {}
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
              "failActions": [
                {
                  "actionType": "DamageAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[1]",
                    "_sequenceActionData",
                    "actionData",
                    "[2]",
                    "action",
                    "actionData",
                    "[0]",
                    "failActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 14,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "damageUnits": [
                    {
                      "damageType": "Cryst",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          1.56,
                          1.71,
                          1.87,
                          2.02,
                          2.18,
                          2.34,
                          2.49,
                          2.65,
                          2.8,
                          3.0,
                          3.23,
                          3.5
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 4352
                    },
                    {
                      "damageType": "Cryst",
                      "attributeType": "Poise",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 4.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          1.56,
                          1.71,
                          1.87,
                          2.02,
                          2.18,
                          2.34,
                          2.49,
                          2.65,
                          2.8,
                          3.0,
                          3.23,
                          3.5
                        ]
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
          "inflictions": [
            {
              "startFrame": 0,
              "endFrame": 0,
              "actionIndex": 3,
              "element": "cryo",
              "isExtra": false,
              "sequenceIndex": 1
            }
          ],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction",
            "IfElseAction",
            "SpellInfliction"
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
          "atk_scale": [
            1.56,
            1.71,
            1.87,
            2.02,
            2.18,
            2.34,
            2.49,
            2.65,
            2.8,
            3.0,
            3.23,
            3.5
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
          "key": "atb",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_scale",
          "value": 1.0,
          "isDynamic": true
        },
        {
          "key": "blow_off_distance",
          "value": 2.0,
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
          "key": "distance",
          "value": 8.0,
          "isDynamic": false
        },
        {
          "key": "distance_random_range",
          "value": 0.2,
          "isDynamic": false
        },
        {
          "key": "dmg_up",
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
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 7.0,
          "isDynamic": false
        },
        {
          "key": "trigger",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "atb",
        "cam_angle",
        "distance",
        "input_angle",
        "select_radius"
      ],
      "blackboardProvenance": [
        {
          "key": "atb",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": true,
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
          "key": "blow_off_distance",
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
          "key": "distance",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "distance_random_range",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "dmg_up",
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
          "key": "trigger",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "LaunchProjectile",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "maintar",
          "producerType": "FindTargetAction",
          "finderType": "MainTargetFinder",
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
          "endFrame": 3,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[1]"
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
          "endFrame": 3,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "front",
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
          "endFrame": 7,
          "actionIndex": 6,
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
          "endFrame": 7,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "succeedActions",
            "actionData",
            "[0]"
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
          "startFrame": 0,
          "endFrame": 7,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "failActions",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]"
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
          "startFrame": 0,
          "endFrame": 90,
          "actionIndex": 27,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "mainTar",
          "producerType": "FindTargetAction",
          "finderType": "MainTargetFinder",
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
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 61,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "maintar",
          "producerType": "FindTargetAction",
          "finderType": "MainTargetFinder",
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
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 64,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar_behind",
          "producerType": "FindTargetAction",
          "finderType": "PointFinder",
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
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 66,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar_behind",
          "producerType": "FindTargetAction",
          "finderType": "PointFinder",
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
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "conditions": [
            {
              "sourceType": "CheckEntityNum",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "entityCount": {
                "targetSource": "Context",
                "targetGroupKey": "maintar",
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
          "succeedActions": [],
          "failActions": [
            {
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 5,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 7,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [
            {
              "sourceType": "CheckEntityNum",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "entityCount": {
                "targetSource": "Context",
                "targetGroupKey": "maintar",
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
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 9,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 15,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 7,
                "actionIndex": 15,
                "actionPath": [
                  "timelineActions[2]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "failActions",
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
                "succeedActions": [],
                "failActions": [
                  {
                    "actionType": "FindTargetAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[2]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 17,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
                "conditionNegated": [
                  false
                ],
                "alwaysNext": true
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionIndex": 62,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [
            {
              "sourceType": "CheckEntityNum",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "entityCount": {
                "targetSource": "Context",
                "targetGroupKey": "maintar",
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
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 64,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "LaunchProjectile",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 65,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0021_whiten_normal_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0021_whiten_normal_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "tar_behind",
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
              }
            }
          ],
          "failActions": [
            {
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 66,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "LaunchProjectile",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 67,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0021_whiten_normal_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0021_whiten_normal_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "tar_behind",
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
              }
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
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "comboSkill",
      "skillId": "chr_0021_whiten_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0021_whiten_combo_skill.json",
      "timelineBlockFrames": 20,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 25.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 20,
          "endFrame": 59,
          "skillIds": [
            "chr_0021_whiten_normal_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 59,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0021_whiten_normal_skill",
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
          "endFrame": 154,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 19,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "ShowHideActorAction",
            "MoveToAction",
            "SelfRotateAction",
            "Selector",
            "SelfRotateAction"
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
            "CurveEvaluateFloat",
            "CurveEvaluateFloat",
            "CameraRotateAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 116,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 115,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 22,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 34,
          "actionTypes": [
            "ForEachAction",
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "CreateBuffAction",
            "AirborneAction",
            "DamageAction",
            "Selector",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "Selector",
            "AirborneAction",
            "DamageAction",
            "Selector",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "Selector",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 22,
          "actionTypes": [
            "CheckEntityNum",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 81,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 63,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 36,
          "actionTypes": [
            "AddDynamicCcsAction"
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
          "endFrame": 16,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 16,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "OverrideCameraFollowAction"
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
          "endFrame": 59,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 59,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 154,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 148,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 83,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 71,
          "endFrame": 126,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 19,
          "endFrame": 34,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "action",
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
                "targetSource": "Target",
                "targetGroupKey": "",
                "tagQueryType": "hasAny",
                "tagIds": [
                  1535684437
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
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "action",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 22,
              "nestedCondition": {
                "startFrame": 19,
                "endFrame": 34,
                "actionIndex": 22,
                "actionPath": [
                  "timelineActions[7]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "action",
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
                      "blackboardKey": "has_potential1",
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
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 24,
                    "blackboardMutation": {
                      "key": "duration",
                      "operation": "Add",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": "rate_plus",
                        "levelValues": [
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1
                        ]
                      }
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  },
                  {
                    "actionType": "CreateBuffAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 25,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_chr_0021_whiten_combo_skill_physical_vulnerable",
                          "classification": null,
                          "blackboardAssignments": {
                            "duration": {
                              "value": 0.0,
                              "blackboardKey": "duration",
                              "levelValues": [
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0
                              ]
                            },
                            "rate": {
                              "value": 0.0,
                              "blackboardKey": "rate",
                              "levelValues": [
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.15,
                                0.15,
                                0.15
                              ]
                            }
                          }
                        }
                      ],
                      "targetSource": "Target",
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
                    "actionType": "DamageAction",
                    "actionIndex": 3,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]"
                    ],
                    "serverActionIndex": 27,
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
                          "blackboardKey": "atk_scale2",
                          "levelValues": [
                            2.8,
                            3.08,
                            3.36,
                            3.64,
                            3.92,
                            4.2,
                            4.48,
                            4.76,
                            5.04,
                            5.39,
                            5.81,
                            6.3
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
                    ]
                  }
                ],
                "failActions": [
                  {
                    "actionType": "CreateBuffAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 29,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_chr_0021_whiten_combo_skill_physical_vulnerable",
                          "classification": null,
                          "blackboardAssignments": {
                            "duration": {
                              "value": 0.0,
                              "blackboardKey": "duration",
                              "levelValues": [
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0
                              ]
                            },
                            "rate": {
                              "value": 0.0,
                              "blackboardKey": "rate",
                              "levelValues": [
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.15,
                                0.15,
                                0.15
                              ]
                            }
                          }
                        }
                      ],
                      "targetSource": "Target",
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
                    "actionType": "DamageAction",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 31,
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
                          "blackboardKey": "atk_scale2",
                          "levelValues": [
                            2.8,
                            3.08,
                            3.36,
                            3.64,
                            3.92,
                            4.2,
                            4.48,
                            4.76,
                            5.04,
                            5.39,
                            5.81,
                            6.3
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
                    ]
                  }
                ],
                "conditionNegated": [
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "action",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 34,
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
              ]
            }
          ],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 19,
          "endFrame": 34,
          "actionIndex": 36,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [
            {
              "sourceType": "CheckEntityNum",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "entityCount": {
                "targetSource": "Context",
                "targetGroupKey": "tar",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 38,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
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
      "referencedBuffIds": [
        "buff_chr_0021_whiten_combo_skill_physical_vulnerable"
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
          "atk_scale2": [
            2.8,
            3.08,
            3.36,
            3.64,
            3.92,
            4.2,
            4.48,
            4.76,
            5.04,
            5.39,
            5.81,
            6.3
          ],
          "duration": [
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0
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
          "rate": [
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.15,
            0.15,
            0.15
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
          17.0
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
          "value": 1.6,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
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
          "key": "cd_reduction",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "count",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 5.0,
          "isDynamic": true
        },
        {
          "key": "has_potential1",
          "value": 0.0,
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
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": -0.2,
          "isDynamic": true
        },
        {
          "key": "rate_plus",
          "value": -0.1,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "atk_scale2",
        "cam_angle",
        "cam_duration",
        "has_potential1",
        "input_angle",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
        "rate_plus",
        "select_radius",
        "usp"
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
          "key": "atk_scale2",
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
          "key": "cd_reduction",
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
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "has_potential1",
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
          "key": "rate",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "rate_plus",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "select_radius",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
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
        "CreateBuffAction",
        "DamageAction",
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 19,
          "endFrame": 22,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[6]",
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
        },
        {
          "startFrame": 0,
          "endFrame": 16,
          "actionIndex": 53,
          "actionPath": [
            "timelineActions[13]",
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
          "startFrame": 19,
          "endFrame": 34,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "action",
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
                "targetSource": "Target",
                "targetGroupKey": "",
                "tagQueryType": "hasAny",
                "tagIds": [
                  1535684437
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
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "action",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 22,
              "nestedCondition": {
                "startFrame": 19,
                "endFrame": 34,
                "actionIndex": 22,
                "actionPath": [
                  "timelineActions[7]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "action",
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
                      "blackboardKey": "has_potential1",
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
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 24,
                    "blackboardMutation": {
                      "key": "duration",
                      "operation": "Add",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": "rate_plus",
                        "levelValues": [
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1,
                          -0.1
                        ]
                      }
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  },
                  {
                    "actionType": "CreateBuffAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 25,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_chr_0021_whiten_combo_skill_physical_vulnerable",
                          "classification": null,
                          "blackboardAssignments": {
                            "duration": {
                              "value": 0.0,
                              "blackboardKey": "duration",
                              "levelValues": [
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0
                              ]
                            },
                            "rate": {
                              "value": 0.0,
                              "blackboardKey": "rate",
                              "levelValues": [
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.15,
                                0.15,
                                0.15
                              ]
                            }
                          }
                        }
                      ],
                      "targetSource": "Target",
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
                    "actionType": "DamageAction",
                    "actionIndex": 3,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]"
                    ],
                    "serverActionIndex": 27,
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
                          "blackboardKey": "atk_scale2",
                          "levelValues": [
                            2.8,
                            3.08,
                            3.36,
                            3.64,
                            3.92,
                            4.2,
                            4.48,
                            4.76,
                            5.04,
                            5.39,
                            5.81,
                            6.3
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
                    ]
                  }
                ],
                "failActions": [
                  {
                    "actionType": "CreateBuffAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 29,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_chr_0021_whiten_combo_skill_physical_vulnerable",
                          "classification": null,
                          "blackboardAssignments": {
                            "duration": {
                              "value": 0.0,
                              "blackboardKey": "duration",
                              "levelValues": [
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0,
                                6.0
                              ]
                            },
                            "rate": {
                              "value": 0.0,
                              "blackboardKey": "rate",
                              "levelValues": [
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.1,
                                0.15,
                                0.15,
                                0.15
                              ]
                            }
                          }
                        }
                      ],
                      "targetSource": "Target",
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
                    "actionType": "DamageAction",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[7]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 31,
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
                          "blackboardKey": "atk_scale2",
                          "levelValues": [
                            2.8,
                            3.08,
                            3.36,
                            3.64,
                            3.92,
                            4.2,
                            4.48,
                            4.76,
                            5.04,
                            5.39,
                            5.81,
                            6.3
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
                    ]
                  }
                ],
                "conditionNegated": [
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "action",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 34,
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
              ]
            }
          ],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 19,
          "endFrame": 34,
          "actionIndex": 36,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [
            {
              "sourceType": "CheckEntityNum",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "entityCount": {
                "targetSource": "Context",
                "targetGroupKey": "tar",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 38,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
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
        {
          "startFrame": 0,
          "endFrame": 16,
          "actionIndex": 51,
          "actionPath": [
            "timelineActions[13]",
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
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 53,
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
          "actionIndex": 50,
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
          "sequenceIndex": 12,
          "effectAbilityEntityTargets": []
        }
      ],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "ultimate",
      "skillId": "chr_0021_whiten_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0021_whiten_ultimate_skill.json",
      "timelineBlockFrames": 60,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 100.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 60,
          "endFrame": 77,
          "skillIds": [
            "chr_0021_whiten_attack1",
            "chr_0021_whiten_normal_skill",
            "chr_0021_whiten_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 51,
          "endFrame": 77,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0021_whiten_attack1",
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
              "skillId": "chr_0021_whiten_normal_skill",
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
              "skillId": "chr_0021_whiten_combo_skill",
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
          "endFrame": 30,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
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
          "endFrame": 54,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 57,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 57,
          "actionTypes": [
            "ForEachAction",
            "CheckTagMatch",
            "AirborneAction",
            "InterruptAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 57,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 77,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 51,
          "endFrame": 77,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 77,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "ChannelingCastingAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 53,
          "endFrame": 191,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 102,
          "endFrame": 156,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 168,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 114,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 92,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 77,
          "endFrame": 129,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 54,
          "endFrame": 57,
          "actionIndex": 29,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_total",
                "levelValues": null
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
                  20.0,
                  20.0,
                  20.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 8
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 77,
          "actionIndex": 32,
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
          "sequenceIndex": 10,
          "autoFinishByAction": true
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [
        {
          "startFrame": 54,
          "endFrame": 57,
          "actionIndex": 27,
          "key": "atk_scale_total",
          "operation": "Add",
          "value": {
            "value": 1.0,
            "blackboardKey": "atk_scale",
            "levelValues": [
              4.89,
              5.38,
              5.86,
              6.35,
              6.84,
              7.33,
              7.82,
              8.31,
              8.8,
              9.41,
              10.14,
              11.0
            ]
          },
          "sequenceIndex": 8
        },
        {
          "startFrame": 54,
          "endFrame": 57,
          "actionIndex": 28,
          "key": "atk_scale_total",
          "operation": "Add",
          "value": {
            "value": 1.0,
            "blackboardKey": "dmg_up_total",
            "levelValues": null
          },
          "sequenceIndex": 8
        }
      ],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
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
          "atk_scale": [
            4.89,
            5.38,
            5.86,
            6.35,
            6.84,
            7.33,
            7.82,
            8.31,
            8.8,
            9.41,
            10.14,
            11.0
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
            20.0,
            20.0,
            20.0
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
          70.0,
          70.0,
          70.0,
          70.0,
          70.0,
          70.0,
          70.0,
          70.0,
          70.0,
          70.0,
          70.0,
          70.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atk_scale",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_total",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "dmg_up",
          "value": 0.5,
          "isDynamic": false
        },
        {
          "key": "dmg_up_total",
          "value": 0.0,
          "isDynamic": true
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
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "atk_scale_total",
        "dmg_up_total",
        "poise",
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
          "key": "atk_scale_total",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "dmg_up",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "dmg_up_total",
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
          "key": "radius",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "select_radius",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "DamageAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "MainChar",
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
          "endFrame": 3,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "MainTar",
          "producerType": "FindTargetAction",
          "finderType": "MainTargetFinder",
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
          "endFrame": 3,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[2]",
            "failActions",
            "actionData",
            "[0]"
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
          "startFrame": 54,
          "endFrame": 57,
          "actionIndex": 22,
          "actionPath": [
            "timelineActions[7]",
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[2]",
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
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 4,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "FindTargetAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 5,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 6,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 3,
                "actionIndex": 6,
                "actionPath": [
                  "timelineActions[2]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[2]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckEntityNum",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "entityCount": {
                      "targetSource": "Context",
                      "targetGroupKey": "MainTar",
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
                "succeedActions": [],
                "failActions": [
                  {
                    "actionType": "FindTargetAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[2]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 11,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
                "conditionNegated": [
                  false
                ],
                "alwaysNext": true
              },
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
          "endFrame": 30,
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
          "endFrame": 54,
          "actionIndex": 20,
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
          "sequenceIndex": 5,
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
