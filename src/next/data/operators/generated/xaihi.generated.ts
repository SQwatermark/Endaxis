/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const xaihiGeneratedSource = {
  "slug": "xaihi",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0011_seraph_atk_buff",
      "sourceFile": "buff_chr_0011_seraph_atk_buff.json",
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
          "key": "atk_up",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "final_atkup",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "final_final_atkup",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "wisd_max",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "wisd_up",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [
        {
          "targetType": "Specific",
          "attributeType": "CrystEnhancedDmgIncrease",
          "slot": "BaseAddition",
          "value": {
            "value": 0.0,
            "blackboardKey": "final_final_atkup",
            "levelValues": [
              0.0
            ]
          }
        },
        {
          "targetType": "Specific",
          "attributeType": "NaturalEnhancedDmgIncrease",
          "slot": "BaseAddition",
          "value": {
            "value": 0.0,
            "blackboardKey": "final_final_atkup",
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
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffStart",
          "orderedActionTypes": [
            "StoreAttributeValue",
            "IfElseAction",
            "SimpleCalcBBAction"
          ],
          "combatActions": [
            "IfElseAction"
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
                "StoreAttributeValue",
                "IfElseAction",
                "SimpleCalcBBAction"
              ],
              "combatActions": [
                "IfElseAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "StoreAttributeValue",
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
                  "storeAttributeValue": {
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "attributeKind": "specific",
                    "attributeKey": "intellect",
                    "stage": "finalNonConverted",
                    "useFloor": false,
                    "divisor": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "multiplier": {
                      "value": 1.0,
                      "blackboardKey": "wisd_up",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "base": {
                      "value": 0.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "outputKey": "final_atkup"
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "IfElseAction",
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
                        "sourceType": "CompareFloat",
                        "supported": true,
                        "comparison": "GE",
                        "left": {
                          "value": 0.0,
                          "blackboardKey": "final_atkup",
                          "levelValues": [
                            0.0
                          ]
                        },
                        "right": {
                          "value": 0.0,
                          "blackboardKey": "wisd_max",
                          "levelValues": [
                            0.0
                          ]
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
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[1]",
                          "succeedActions",
                          "actionData",
                          "[0]"
                        ],
                        "serverActionIndex": 3,
                        "blackboardMutation": {
                          "key": "final_final_atkup",
                          "operation": "Assign",
                          "value": {
                            "value": 0.0,
                            "blackboardKey": "wisd_max",
                            "levelValues": [
                              0.0
                            ]
                          }
                        },
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null
                      }
                    ],
                    "failActions": [
                      {
                        "actionType": "ModifyDynamicBlackboard",
                        "actionIndex": 0,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[1]",
                          "failActions",
                          "actionData",
                          "[0]"
                        ],
                        "serverActionIndex": 4,
                        "blackboardMutation": {
                          "key": "final_final_atkup",
                          "operation": "Assign",
                          "value": {
                            "value": 0.0,
                            "blackboardKey": "final_atkup",
                            "levelValues": [
                              0.0
                            ]
                          }
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
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
                {
                  "actionType": "SimpleCalcBBAction",
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
                  "serverActionIndex": 5,
                  "blackboardCalculation": {
                    "key": "final_final_atkup",
                    "operation": "Add",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "final_final_atkup",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "right": {
                      "value": 0.0,
                      "blackboardKey": "atk_up",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "addend": null
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
          "buffId": "buff_chr_0011_seraph_ultimate_effect",
          "presentation": {
            "hasIcon": true,
            "spritePath": "icon_battle_affix_cryst_enhance",
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
          "buffId": "buff_chr_0011_seraph_ultimate_effect_2",
          "presentation": {
            "hasIcon": true,
            "spritePath": "icon_battle_affix_natural_enhance",
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
      "buffId": "buff_chr_0011_seraph_atk_buff_2",
      "sourceFile": "buff_chr_0011_seraph_atk_buff_2.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 0.2,
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
          "isDynamic": false
        },
        {
          "key": "heal_value",
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
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0011_seraph_combo_skill_tutorial_marker",
      "sourceFile": "buff_chr_0011_seraph_combo_skill_tutorial_marker.json",
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
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0011_seraph_finishball_02",
      "sourceFile": "buff_chr_0011_seraph_finishball_02.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
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
        "waitFirstTriggerInterval": false,
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
            "FinishOwnerAction"
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
                "FinishOwnerAction"
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
      "buffId": "buff_chr_0011_seraph_spawnball",
      "sourceFile": "buff_chr_0011_seraph_spawnball.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 2.0,
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
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_up",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "buff_duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_value",
          "value": 30.0,
          "isDynamic": false
        },
        {
          "key": "potential_1",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "will_up",
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
          "event": "OnBuffTrigger",
          "orderedActionTypes": [
            "SpawnAbilityEntity",
            "CheckSquadInFight",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction",
            "SpawnAbilityEntity"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 2,
              "payload": {
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
          "createdBuffIds": [
            "buff_common_obtain_ultimate_sp"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "SpawnAbilityEntity",
                "CheckSquadInFight",
                "CreateBuffAction"
              ],
              "combatActions": [
                "SpawnAbilityEntity",
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 2,
                  "payload": {
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
              "actions": [
                {
                  "actionType": "SpawnAbilityEntity",
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
                  "abilityEntitySpawn": {
                    "abilityEntityId": "abilityentity_chr_0011_seraph_normal_skill",
                    "skillId": "chr_0011_seraph_normal_skill_abentity_onfield",
                    "entityBlackboardAssignments": [],
                    "assignBlackboard": true,
                    "sourceType": "ActionOwner",
                    "sourceContextKey": "",
                    "target": null,
                    "overrideDuration": null,
                    "saveToContextKey": null,
                    "dieWhenSourceDies": false,
                    "dieOnEnd": false
                  }
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
                  "serverActionIndex": 2,
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
      "buffId": "buff_chr_0011_seraph_talent_1_crystup",
      "sourceFile": "buff_chr_0011_seraph_talent_1_crystup.json",
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
          "key": "cryst_up",
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
                "blackboardKey": "cryst_up",
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
            "cryo"
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
                    "buffId": "buff_common_vfx_eny_def_down",
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
            "buff_common_vfx_eny_def_down"
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
                  "actionIndex": 1,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_common_vfx_eny_def_down",
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
                  "serverActionIndex": 1,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_common_vfx_eny_def_down",
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
        "spritePath": "icon_battle_cryst_taken_up",
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
      "buffId": "buff_common_full_immune_medium",
      "sourceFile": "buff_common_full_immune_medium.json",
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
        -808036568,
        -279045144,
        1643653132,
        2056757668,
        195489960,
        2136825092,
        486381712,
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
            "value": 40.0,
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
      "buffId": "buff_common_vfx_eny_def_down",
      "sourceFile": "buff_common_vfx_eny_def_down.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 9999.0,
          "blackboardKey": "duration",
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
        "stackingType": "Stack",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 9999.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": true,
        "stackEffectActionTypes": [
          "EffectAction"
        ]
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
    }
  ],
  "skills": [
    {
      "key": "comboSkill",
      "skillId": "chr_0011_seraph_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0011_seraph_combo_skill.json",
      "timelineBlockFrames": 25,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 35.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 25,
          "endFrame": 60,
          "skillIds": [
            "chr_0011_seraph_normal_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 60,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0011_seraph_normal_skill",
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
          "endFrame": 122,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "DebugPrintAction",
            "FindTargetAction",
            "Selector",
            "Selector",
            "FindTargetAction",
            "Selector",
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 25,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "IfElseAction",
            "LaunchProjectile",
            "Selector",
            "Selector",
            "EffectAction",
            "Selector",
            "CreateBuffAction",
            "FinishBuffAction",
            "Selector",
            "LaunchProjectile",
            "Selector",
            "Selector",
            "EffectAction",
            "Selector",
            "CreateBuffAction",
            "FinishBuffAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "FinishBuffAction"
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
          "endFrame": 75,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": [
            "OverrideCameraFollowAction"
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
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 60,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 122,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 21,
          "actionTypes": [
            "VoiceTriggerAction"
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
          "endFrame": 122,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 24,
          "endFrame": 25,
          "actionIndex": 15,
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
                "targetGroupKey": "ball",
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
              "serverActionIndex": 17,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0011_seraph_combo_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0011_seraph_combo_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "main",
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
                  "launchFrame": 24,
                  "actionOrder": [
                    15,
                    0
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0011_seraph_combo_skill",
                  "triggerEvent": "hit",
                  "triggerSkillId": "chr_0011_seraph_combo_skill_projhit",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0011_seraph_combo_skill_projhit.json",
                  "damageUnits": [
                    {
                      "damageType": "Cryst",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 2.5,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          2.0,
                          2.2,
                          2.4,
                          2.6,
                          2.8,
                          3.0,
                          3.2,
                          3.4,
                          3.6,
                          3.85,
                          4.15,
                          4.5
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 12288
                    },
                    {
                      "damageType": "Cryst",
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
                  "directDamageHits": [
                    {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 15,
                      "damageUnits": [
                        {
                          "damageType": "Cryst",
                          "attributeType": "Hp",
                          "calculation": "standard",
                          "attackScale": {
                            "value": 2.5,
                            "blackboardKey": "atk_scale",
                            "levelValues": [
                              2.0,
                              2.2,
                              2.4,
                              2.6,
                              2.8,
                              3.0,
                              3.2,
                              3.4,
                              3.6,
                              3.85,
                              4.15,
                              4.5
                            ]
                          },
                          "calculationMultiplier": null,
                          "poiseValue": null,
                          "definiteValue": null,
                          "damageDecorateMask": 12288
                        },
                        {
                          "damageType": "Cryst",
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
                      "sequenceIndex": 1
                    }
                  ],
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
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "GE",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "exist_talent_1",
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
                          "actionType": "IfElseAction",
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
                          "nestedCondition": {
                            "startFrame": 0,
                            "endFrame": 3,
                            "actionIndex": 2,
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
                                    1570888476,
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
                                "actionType": "CreateBuffAction",
                                "actionIndex": 0,
                                "actionPath": [
                                  "timelineActions[0]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[0]"
                                ],
                                "serverActionIndex": 4,
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null,
                                "buffApplication": {
                                  "buffs": [
                                    {
                                      "buffId": "buff_chr_0011_seraph_talent_1_crystup",
                                      "classification": null,
                                      "blackboardAssignments": {
                                        "cryst_up": {
                                          "value": 0.0,
                                          "blackboardKey": "cryst_up",
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
                                        "duration": {
                                          "value": 0.0,
                                          "blackboardKey": "duration",
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
                      "endFrame": 3,
                      "actionIndex": 5,
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
                          "comparison": "Equals",
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
                        },
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "Equals",
                          "left": {
                            "value": 1.0,
                            "blackboardKey": "EntityBB_bounced",
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
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 8,
                          "blackboardMutation": {
                            "key": "EntityBB_bounced",
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
                        },
                        {
                          "actionType": "LaunchProjectile",
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[2]"
                          ],
                          "serverActionIndex": 10,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "projectileLaunch": {
                            "projectileId": "projectile_chr_0011_seraph_combo_skill",
                            "skillTriggers": [
                              {
                                "event": "hit",
                                "skillId": "chr_0011_seraph_combo_skill_projhit"
                              }
                            ],
                            "assignBlackboard": true,
                            "entityBlackboardAssignments": [
                              {
                                "targetKey": "EntityBB_bounced",
                                "valueType": "Numeric",
                                "numericValue": 1.0,
                                "stringValue": "",
                                "useDirectValue": true,
                                "inputValueKey": "EntityBB_bounced"
                              }
                            ],
                            "target": {
                              "targetSource": "Context",
                              "targetGroupKey": "extra_target",
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
                              "launchFrame": 24,
                              "actionOrder": [
                                15,
                                0,
                                5,
                                2
                              ],
                              "assumedTravelFrames": 0,
                              "projectileId": "projectile_chr_0011_seraph_combo_skill",
                              "triggerEvent": "hit",
                              "triggerSkillId": "chr_0011_seraph_combo_skill_projhit",
                              "excludedByPrimaryTargetMarker": false,
                              "sourceFile": "chr_0011_seraph_combo_skill_projhit.json",
                              "damageUnits": [
                                {
                                  "damageType": "Cryst",
                                  "attributeType": "Hp",
                                  "calculation": "standard",
                                  "attackScale": {
                                    "value": 2.5,
                                    "blackboardKey": "atk_scale",
                                    "levelValues": [
                                      2.0,
                                      2.2,
                                      2.4,
                                      2.6,
                                      2.8,
                                      3.0,
                                      3.2,
                                      3.4,
                                      3.6,
                                      3.85,
                                      4.15,
                                      4.5
                                    ]
                                  },
                                  "calculationMultiplier": null,
                                  "poiseValue": null,
                                  "definiteValue": null,
                                  "damageDecorateMask": 12288
                                },
                                {
                                  "damageType": "Cryst",
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
                              "directDamageHits": [
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 15,
                                  "damageUnits": [
                                    {
                                      "damageType": "Cryst",
                                      "attributeType": "Hp",
                                      "calculation": "standard",
                                      "attackScale": {
                                        "value": 2.5,
                                        "blackboardKey": "atk_scale",
                                        "levelValues": [
                                          2.0,
                                          2.2,
                                          2.4,
                                          2.6,
                                          2.8,
                                          3.0,
                                          3.2,
                                          3.4,
                                          3.6,
                                          3.85,
                                          4.15,
                                          4.5
                                        ]
                                      },
                                      "calculationMultiplier": null,
                                      "poiseValue": null,
                                      "definiteValue": null,
                                      "damageDecorateMask": 12288
                                    },
                                    {
                                      "damageType": "Cryst",
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
                                  "sequenceIndex": 1
                                }
                              ],
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
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "GE",
                                      "left": {
                                        "value": 0.0,
                                        "blackboardKey": "exist_talent_1",
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
                                      "actionType": "IfElseAction",
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
                                      "nestedCondition": {
                                        "startFrame": 0,
                                        "endFrame": 3,
                                        "actionIndex": 2,
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
                                                1570888476,
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
                                            "actionType": "CreateBuffAction",
                                            "actionIndex": 0,
                                            "actionPath": [
                                              "timelineActions[0]",
                                              "_sequenceActionData",
                                              "actionData",
                                              "[0]",
                                              "succeedActions",
                                              "actionData",
                                              "[0]",
                                              "succeedActions",
                                              "actionData",
                                              "[0]"
                                            ],
                                            "serverActionIndex": 4,
                                            "legacyBuffFinish": null,
                                            "skillCooldownAdjustment": null,
                                            "buffIgnite": null,
                                            "buffApplication": {
                                              "buffs": [
                                                {
                                                  "buffId": "buff_chr_0011_seraph_talent_1_crystup",
                                                  "classification": null,
                                                  "blackboardAssignments": {
                                                    "cryst_up": {
                                                      "value": 0.0,
                                                      "blackboardKey": "cryst_up",
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
                                                    "duration": {
                                                      "value": 0.0,
                                                      "blackboardKey": "duration",
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
                                  "endFrame": 3,
                                  "actionIndex": 5,
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
                                      "comparison": "Equals",
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
                                    },
                                    {
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "Equals",
                                      "left": {
                                        "value": 1.0,
                                        "blackboardKey": "EntityBB_bounced",
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
                                        "[0]",
                                        "succeedActions",
                                        "actionData",
                                        "[0]"
                                      ],
                                      "serverActionIndex": 8,
                                      "blackboardMutation": {
                                        "key": "EntityBB_bounced",
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
                                    },
                                    {
                                      "actionType": "LaunchProjectile",
                                      "actionIndex": 2,
                                      "actionPath": [
                                        "timelineActions[1]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[0]",
                                        "succeedActions",
                                        "actionData",
                                        "[2]"
                                      ],
                                      "serverActionIndex": 10,
                                      "legacyBuffFinish": null,
                                      "skillCooldownAdjustment": null,
                                      "buffIgnite": null,
                                      "projectileLaunch": {
                                        "projectileId": "projectile_chr_0011_seraph_combo_skill",
                                        "skillTriggers": [
                                          {
                                            "event": "hit",
                                            "skillId": "chr_0011_seraph_combo_skill_projhit"
                                          }
                                        ],
                                        "assignBlackboard": true,
                                        "entityBlackboardAssignments": [
                                          {
                                            "targetKey": "EntityBB_bounced",
                                            "valueType": "Numeric",
                                            "numericValue": 1.0,
                                            "stringValue": "",
                                            "useDirectValue": true,
                                            "inputValueKey": "EntityBB_bounced"
                                          }
                                        ],
                                        "target": {
                                          "targetSource": "Context",
                                          "targetGroupKey": "extra_target",
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
                                  "failActions": [],
                                  "conditionNegated": [
                                    false,
                                    false
                                  ],
                                  "alwaysNext": true
                                },
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 17,
                                  "actionPath": [
                                    "timelineActions[1]",
                                    "_sequenceActionData",
                                    "actionData",
                                    "[7]"
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
                                        "timelineActions[1]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[7]",
                                        "succeedActions",
                                        "actionData",
                                        "[1]"
                                      ],
                                      "serverActionIndex": 20,
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
                              "auxiliaryActions": [
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 11,
                                  "actionType": "CreateBuffAction",
                                  "sourceId": "buff_chr_0011_seraph_combo_skill_tutorial_marker",
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
                                  "sequenceIndex": 1,
                                  "autoFinishByAction": false
                                }
                              ],
                              "resourceGains": [],
                              "inflictions": [
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 14,
                                  "element": "cryo",
                                  "isExtra": false,
                                  "sequenceIndex": 1
                                }
                              ],
                              "combatActions": [
                                "CreateBuffAction",
                                "DamageAction",
                                "IfElseAction",
                                "LaunchProjectile",
                                "ObtainCostAction",
                                "SpellInfliction"
                              ],
                              "cycleTruncated": true,
                              "nestedProjectileTriggeredSkills": [],
                              "abilityEntityHits": [],
                              "auraActions": []
                            }
                          ]
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
                      "endFrame": 3,
                      "actionIndex": 17,
                      "actionPath": [
                        "timelineActions[1]",
                        "_sequenceActionData",
                        "actionData",
                        "[7]"
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
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[7]",
                            "succeedActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 20,
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
                  "auxiliaryActions": [
                    {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 11,
                      "actionType": "CreateBuffAction",
                      "sourceId": "buff_chr_0011_seraph_combo_skill_tutorial_marker",
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
                      "sequenceIndex": 1,
                      "autoFinishByAction": false
                    }
                  ],
                  "resourceGains": [],
                  "inflictions": [
                    {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 14,
                      "element": "cryo",
                      "isExtra": false,
                      "sequenceIndex": 1
                    }
                  ],
                  "combatActions": [
                    "CreateBuffAction",
                    "DamageAction",
                    "IfElseAction",
                    "LaunchProjectile",
                    "ObtainCostAction",
                    "SpellInfliction"
                  ],
                  "cycleTruncated": false,
                  "nestedProjectileTriggeredSkills": [],
                  "abilityEntityHits": [],
                  "auraActions": []
                }
              ]
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 19,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0011_seraph_finishball_02",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "ball",
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
              "actionType": "FinishBuffAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 20,
              "legacyBuffFinish": {
                "target": {
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
                  "finderType": "CharacterTeamFinder",
                  "validatorTypes": [],
                  "postProcessorTypes": []
                },
                "buffIds": [
                  "buff_chr_0011_seraph_atk_buff_normal_skill"
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
          "failActions": [
            {
              "actionType": "LaunchProjectile",
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
              "serverActionIndex": 21,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0011_seraph_combo_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0011_seraph_combo_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "main",
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
                  "launchFrame": 24,
                  "actionOrder": [
                    15,
                    0
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0011_seraph_combo_skill",
                  "triggerEvent": "hit",
                  "triggerSkillId": "chr_0011_seraph_combo_skill_projhit",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0011_seraph_combo_skill_projhit.json",
                  "damageUnits": [
                    {
                      "damageType": "Cryst",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 2.5,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          2.0,
                          2.2,
                          2.4,
                          2.6,
                          2.8,
                          3.0,
                          3.2,
                          3.4,
                          3.6,
                          3.85,
                          4.15,
                          4.5
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 12288
                    },
                    {
                      "damageType": "Cryst",
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
                  "directDamageHits": [
                    {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 15,
                      "damageUnits": [
                        {
                          "damageType": "Cryst",
                          "attributeType": "Hp",
                          "calculation": "standard",
                          "attackScale": {
                            "value": 2.5,
                            "blackboardKey": "atk_scale",
                            "levelValues": [
                              2.0,
                              2.2,
                              2.4,
                              2.6,
                              2.8,
                              3.0,
                              3.2,
                              3.4,
                              3.6,
                              3.85,
                              4.15,
                              4.5
                            ]
                          },
                          "calculationMultiplier": null,
                          "poiseValue": null,
                          "definiteValue": null,
                          "damageDecorateMask": 12288
                        },
                        {
                          "damageType": "Cryst",
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
                      "sequenceIndex": 1
                    }
                  ],
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
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "GE",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "exist_talent_1",
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
                          "actionType": "IfElseAction",
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
                          "nestedCondition": {
                            "startFrame": 0,
                            "endFrame": 3,
                            "actionIndex": 2,
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
                                    1570888476,
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
                                "actionType": "CreateBuffAction",
                                "actionIndex": 0,
                                "actionPath": [
                                  "timelineActions[0]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[0]"
                                ],
                                "serverActionIndex": 4,
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null,
                                "buffApplication": {
                                  "buffs": [
                                    {
                                      "buffId": "buff_chr_0011_seraph_talent_1_crystup",
                                      "classification": null,
                                      "blackboardAssignments": {
                                        "cryst_up": {
                                          "value": 0.0,
                                          "blackboardKey": "cryst_up",
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
                                        "duration": {
                                          "value": 0.0,
                                          "blackboardKey": "duration",
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
                      "endFrame": 3,
                      "actionIndex": 5,
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
                          "comparison": "Equals",
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
                        },
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "Equals",
                          "left": {
                            "value": 1.0,
                            "blackboardKey": "EntityBB_bounced",
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
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 8,
                          "blackboardMutation": {
                            "key": "EntityBB_bounced",
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
                        },
                        {
                          "actionType": "LaunchProjectile",
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[2]"
                          ],
                          "serverActionIndex": 10,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "projectileLaunch": {
                            "projectileId": "projectile_chr_0011_seraph_combo_skill",
                            "skillTriggers": [
                              {
                                "event": "hit",
                                "skillId": "chr_0011_seraph_combo_skill_projhit"
                              }
                            ],
                            "assignBlackboard": true,
                            "entityBlackboardAssignments": [
                              {
                                "targetKey": "EntityBB_bounced",
                                "valueType": "Numeric",
                                "numericValue": 1.0,
                                "stringValue": "",
                                "useDirectValue": true,
                                "inputValueKey": "EntityBB_bounced"
                              }
                            ],
                            "target": {
                              "targetSource": "Context",
                              "targetGroupKey": "extra_target",
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
                              "launchFrame": 24,
                              "actionOrder": [
                                15,
                                0,
                                5,
                                2
                              ],
                              "assumedTravelFrames": 0,
                              "projectileId": "projectile_chr_0011_seraph_combo_skill",
                              "triggerEvent": "hit",
                              "triggerSkillId": "chr_0011_seraph_combo_skill_projhit",
                              "excludedByPrimaryTargetMarker": false,
                              "sourceFile": "chr_0011_seraph_combo_skill_projhit.json",
                              "damageUnits": [
                                {
                                  "damageType": "Cryst",
                                  "attributeType": "Hp",
                                  "calculation": "standard",
                                  "attackScale": {
                                    "value": 2.5,
                                    "blackboardKey": "atk_scale",
                                    "levelValues": [
                                      2.0,
                                      2.2,
                                      2.4,
                                      2.6,
                                      2.8,
                                      3.0,
                                      3.2,
                                      3.4,
                                      3.6,
                                      3.85,
                                      4.15,
                                      4.5
                                    ]
                                  },
                                  "calculationMultiplier": null,
                                  "poiseValue": null,
                                  "definiteValue": null,
                                  "damageDecorateMask": 12288
                                },
                                {
                                  "damageType": "Cryst",
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
                              "directDamageHits": [
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 15,
                                  "damageUnits": [
                                    {
                                      "damageType": "Cryst",
                                      "attributeType": "Hp",
                                      "calculation": "standard",
                                      "attackScale": {
                                        "value": 2.5,
                                        "blackboardKey": "atk_scale",
                                        "levelValues": [
                                          2.0,
                                          2.2,
                                          2.4,
                                          2.6,
                                          2.8,
                                          3.0,
                                          3.2,
                                          3.4,
                                          3.6,
                                          3.85,
                                          4.15,
                                          4.5
                                        ]
                                      },
                                      "calculationMultiplier": null,
                                      "poiseValue": null,
                                      "definiteValue": null,
                                      "damageDecorateMask": 12288
                                    },
                                    {
                                      "damageType": "Cryst",
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
                                  "sequenceIndex": 1
                                }
                              ],
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
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "GE",
                                      "left": {
                                        "value": 0.0,
                                        "blackboardKey": "exist_talent_1",
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
                                      "actionType": "IfElseAction",
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
                                      "nestedCondition": {
                                        "startFrame": 0,
                                        "endFrame": 3,
                                        "actionIndex": 2,
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
                                                1570888476,
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
                                            "actionType": "CreateBuffAction",
                                            "actionIndex": 0,
                                            "actionPath": [
                                              "timelineActions[0]",
                                              "_sequenceActionData",
                                              "actionData",
                                              "[0]",
                                              "succeedActions",
                                              "actionData",
                                              "[0]",
                                              "succeedActions",
                                              "actionData",
                                              "[0]"
                                            ],
                                            "serverActionIndex": 4,
                                            "legacyBuffFinish": null,
                                            "skillCooldownAdjustment": null,
                                            "buffIgnite": null,
                                            "buffApplication": {
                                              "buffs": [
                                                {
                                                  "buffId": "buff_chr_0011_seraph_talent_1_crystup",
                                                  "classification": null,
                                                  "blackboardAssignments": {
                                                    "cryst_up": {
                                                      "value": 0.0,
                                                      "blackboardKey": "cryst_up",
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
                                                    "duration": {
                                                      "value": 0.0,
                                                      "blackboardKey": "duration",
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
                                  "endFrame": 3,
                                  "actionIndex": 5,
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
                                      "comparison": "Equals",
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
                                    },
                                    {
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "Equals",
                                      "left": {
                                        "value": 1.0,
                                        "blackboardKey": "EntityBB_bounced",
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
                                        "[0]",
                                        "succeedActions",
                                        "actionData",
                                        "[0]"
                                      ],
                                      "serverActionIndex": 8,
                                      "blackboardMutation": {
                                        "key": "EntityBB_bounced",
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
                                    },
                                    {
                                      "actionType": "LaunchProjectile",
                                      "actionIndex": 2,
                                      "actionPath": [
                                        "timelineActions[1]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[0]",
                                        "succeedActions",
                                        "actionData",
                                        "[2]"
                                      ],
                                      "serverActionIndex": 10,
                                      "legacyBuffFinish": null,
                                      "skillCooldownAdjustment": null,
                                      "buffIgnite": null,
                                      "projectileLaunch": {
                                        "projectileId": "projectile_chr_0011_seraph_combo_skill",
                                        "skillTriggers": [
                                          {
                                            "event": "hit",
                                            "skillId": "chr_0011_seraph_combo_skill_projhit"
                                          }
                                        ],
                                        "assignBlackboard": true,
                                        "entityBlackboardAssignments": [
                                          {
                                            "targetKey": "EntityBB_bounced",
                                            "valueType": "Numeric",
                                            "numericValue": 1.0,
                                            "stringValue": "",
                                            "useDirectValue": true,
                                            "inputValueKey": "EntityBB_bounced"
                                          }
                                        ],
                                        "target": {
                                          "targetSource": "Context",
                                          "targetGroupKey": "extra_target",
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
                                  "failActions": [],
                                  "conditionNegated": [
                                    false,
                                    false
                                  ],
                                  "alwaysNext": true
                                },
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 17,
                                  "actionPath": [
                                    "timelineActions[1]",
                                    "_sequenceActionData",
                                    "actionData",
                                    "[7]"
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
                                        "timelineActions[1]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[7]",
                                        "succeedActions",
                                        "actionData",
                                        "[1]"
                                      ],
                                      "serverActionIndex": 20,
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
                              "auxiliaryActions": [
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 11,
                                  "actionType": "CreateBuffAction",
                                  "sourceId": "buff_chr_0011_seraph_combo_skill_tutorial_marker",
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
                                  "sequenceIndex": 1,
                                  "autoFinishByAction": false
                                }
                              ],
                              "resourceGains": [],
                              "inflictions": [
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 14,
                                  "element": "cryo",
                                  "isExtra": false,
                                  "sequenceIndex": 1
                                }
                              ],
                              "combatActions": [
                                "CreateBuffAction",
                                "DamageAction",
                                "IfElseAction",
                                "LaunchProjectile",
                                "ObtainCostAction",
                                "SpellInfliction"
                              ],
                              "cycleTruncated": true,
                              "nestedProjectileTriggeredSkills": [],
                              "abilityEntityHits": [],
                              "auraActions": []
                            }
                          ]
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
                      "endFrame": 3,
                      "actionIndex": 17,
                      "actionPath": [
                        "timelineActions[1]",
                        "_sequenceActionData",
                        "actionData",
                        "[7]"
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
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[7]",
                            "succeedActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 20,
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
                  "auxiliaryActions": [
                    {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 11,
                      "actionType": "CreateBuffAction",
                      "sourceId": "buff_chr_0011_seraph_combo_skill_tutorial_marker",
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
                      "sequenceIndex": 1,
                      "autoFinishByAction": false
                    }
                  ],
                  "resourceGains": [],
                  "inflictions": [
                    {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 14,
                      "element": "cryo",
                      "isExtra": false,
                      "sequenceIndex": 1
                    }
                  ],
                  "combatActions": [
                    "CreateBuffAction",
                    "DamageAction",
                    "IfElseAction",
                    "LaunchProjectile",
                    "ObtainCostAction",
                    "SpellInfliction"
                  ],
                  "cycleTruncated": false,
                  "nestedProjectileTriggeredSkills": [],
                  "abilityEntityHits": [],
                  "auraActions": []
                }
              ]
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 23,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0011_seraph_finishball_02",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "ball",
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
              "actionType": "FinishBuffAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 24,
              "legacyBuffFinish": {
                "target": {
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
                  "finderType": "CharacterTeamFinder",
                  "validatorTypes": [],
                  "postProcessorTypes": []
                },
                "buffIds": [
                  "buff_chr_0011_seraph_atk_buff_normal_skill"
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
          "conditionNegated": [
            false
          ],
          "alwaysNext": true,
          "projectedProjectileLaunches": [
            {
              "launch": {
                "projectileId": "projectile_chr_0011_seraph_combo_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0011_seraph_combo_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "main",
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
                  "launchFrame": 24,
                  "actionOrder": [
                    15,
                    0
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0011_seraph_combo_skill",
                  "triggerEvent": "hit",
                  "triggerSkillId": "chr_0011_seraph_combo_skill_projhit",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0011_seraph_combo_skill_projhit.json",
                  "damageUnits": [
                    {
                      "damageType": "Cryst",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 2.5,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          2.0,
                          2.2,
                          2.4,
                          2.6,
                          2.8,
                          3.0,
                          3.2,
                          3.4,
                          3.6,
                          3.85,
                          4.15,
                          4.5
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 12288
                    },
                    {
                      "damageType": "Cryst",
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
                  "directDamageHits": [
                    {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 15,
                      "damageUnits": [
                        {
                          "damageType": "Cryst",
                          "attributeType": "Hp",
                          "calculation": "standard",
                          "attackScale": {
                            "value": 2.5,
                            "blackboardKey": "atk_scale",
                            "levelValues": [
                              2.0,
                              2.2,
                              2.4,
                              2.6,
                              2.8,
                              3.0,
                              3.2,
                              3.4,
                              3.6,
                              3.85,
                              4.15,
                              4.5
                            ]
                          },
                          "calculationMultiplier": null,
                          "poiseValue": null,
                          "definiteValue": null,
                          "damageDecorateMask": 12288
                        },
                        {
                          "damageType": "Cryst",
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
                      "sequenceIndex": 1
                    }
                  ],
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
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "GE",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "exist_talent_1",
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
                          "actionType": "IfElseAction",
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
                          "nestedCondition": {
                            "startFrame": 0,
                            "endFrame": 3,
                            "actionIndex": 2,
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
                                    1570888476,
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
                                "actionType": "CreateBuffAction",
                                "actionIndex": 0,
                                "actionPath": [
                                  "timelineActions[0]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[0]"
                                ],
                                "serverActionIndex": 4,
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null,
                                "buffApplication": {
                                  "buffs": [
                                    {
                                      "buffId": "buff_chr_0011_seraph_talent_1_crystup",
                                      "classification": null,
                                      "blackboardAssignments": {
                                        "cryst_up": {
                                          "value": 0.0,
                                          "blackboardKey": "cryst_up",
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
                                        "duration": {
                                          "value": 0.0,
                                          "blackboardKey": "duration",
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
                      "endFrame": 3,
                      "actionIndex": 5,
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
                          "comparison": "Equals",
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
                        },
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "Equals",
                          "left": {
                            "value": 1.0,
                            "blackboardKey": "EntityBB_bounced",
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
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 8,
                          "blackboardMutation": {
                            "key": "EntityBB_bounced",
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
                        },
                        {
                          "actionType": "LaunchProjectile",
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[2]"
                          ],
                          "serverActionIndex": 10,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "projectileLaunch": {
                            "projectileId": "projectile_chr_0011_seraph_combo_skill",
                            "skillTriggers": [
                              {
                                "event": "hit",
                                "skillId": "chr_0011_seraph_combo_skill_projhit"
                              }
                            ],
                            "assignBlackboard": true,
                            "entityBlackboardAssignments": [
                              {
                                "targetKey": "EntityBB_bounced",
                                "valueType": "Numeric",
                                "numericValue": 1.0,
                                "stringValue": "",
                                "useDirectValue": true,
                                "inputValueKey": "EntityBB_bounced"
                              }
                            ],
                            "target": {
                              "targetSource": "Context",
                              "targetGroupKey": "extra_target",
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
                              "launchFrame": 24,
                              "actionOrder": [
                                15,
                                0,
                                5,
                                2
                              ],
                              "assumedTravelFrames": 0,
                              "projectileId": "projectile_chr_0011_seraph_combo_skill",
                              "triggerEvent": "hit",
                              "triggerSkillId": "chr_0011_seraph_combo_skill_projhit",
                              "excludedByPrimaryTargetMarker": false,
                              "sourceFile": "chr_0011_seraph_combo_skill_projhit.json",
                              "damageUnits": [
                                {
                                  "damageType": "Cryst",
                                  "attributeType": "Hp",
                                  "calculation": "standard",
                                  "attackScale": {
                                    "value": 2.5,
                                    "blackboardKey": "atk_scale",
                                    "levelValues": [
                                      2.0,
                                      2.2,
                                      2.4,
                                      2.6,
                                      2.8,
                                      3.0,
                                      3.2,
                                      3.4,
                                      3.6,
                                      3.85,
                                      4.15,
                                      4.5
                                    ]
                                  },
                                  "calculationMultiplier": null,
                                  "poiseValue": null,
                                  "definiteValue": null,
                                  "damageDecorateMask": 12288
                                },
                                {
                                  "damageType": "Cryst",
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
                              "directDamageHits": [
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 15,
                                  "damageUnits": [
                                    {
                                      "damageType": "Cryst",
                                      "attributeType": "Hp",
                                      "calculation": "standard",
                                      "attackScale": {
                                        "value": 2.5,
                                        "blackboardKey": "atk_scale",
                                        "levelValues": [
                                          2.0,
                                          2.2,
                                          2.4,
                                          2.6,
                                          2.8,
                                          3.0,
                                          3.2,
                                          3.4,
                                          3.6,
                                          3.85,
                                          4.15,
                                          4.5
                                        ]
                                      },
                                      "calculationMultiplier": null,
                                      "poiseValue": null,
                                      "definiteValue": null,
                                      "damageDecorateMask": 12288
                                    },
                                    {
                                      "damageType": "Cryst",
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
                                  "sequenceIndex": 1
                                }
                              ],
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
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "GE",
                                      "left": {
                                        "value": 0.0,
                                        "blackboardKey": "exist_talent_1",
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
                                      "actionType": "IfElseAction",
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
                                      "nestedCondition": {
                                        "startFrame": 0,
                                        "endFrame": 3,
                                        "actionIndex": 2,
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
                                                1570888476,
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
                                            "actionType": "CreateBuffAction",
                                            "actionIndex": 0,
                                            "actionPath": [
                                              "timelineActions[0]",
                                              "_sequenceActionData",
                                              "actionData",
                                              "[0]",
                                              "succeedActions",
                                              "actionData",
                                              "[0]",
                                              "succeedActions",
                                              "actionData",
                                              "[0]"
                                            ],
                                            "serverActionIndex": 4,
                                            "legacyBuffFinish": null,
                                            "skillCooldownAdjustment": null,
                                            "buffIgnite": null,
                                            "buffApplication": {
                                              "buffs": [
                                                {
                                                  "buffId": "buff_chr_0011_seraph_talent_1_crystup",
                                                  "classification": null,
                                                  "blackboardAssignments": {
                                                    "cryst_up": {
                                                      "value": 0.0,
                                                      "blackboardKey": "cryst_up",
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
                                                    "duration": {
                                                      "value": 0.0,
                                                      "blackboardKey": "duration",
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
                                  "endFrame": 3,
                                  "actionIndex": 5,
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
                                      "comparison": "Equals",
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
                                    },
                                    {
                                      "sourceType": "CompareFloat",
                                      "supported": true,
                                      "comparison": "Equals",
                                      "left": {
                                        "value": 1.0,
                                        "blackboardKey": "EntityBB_bounced",
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
                                        "[0]",
                                        "succeedActions",
                                        "actionData",
                                        "[0]"
                                      ],
                                      "serverActionIndex": 8,
                                      "blackboardMutation": {
                                        "key": "EntityBB_bounced",
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
                                    },
                                    {
                                      "actionType": "LaunchProjectile",
                                      "actionIndex": 2,
                                      "actionPath": [
                                        "timelineActions[1]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[0]",
                                        "succeedActions",
                                        "actionData",
                                        "[2]"
                                      ],
                                      "serverActionIndex": 10,
                                      "legacyBuffFinish": null,
                                      "skillCooldownAdjustment": null,
                                      "buffIgnite": null,
                                      "projectileLaunch": {
                                        "projectileId": "projectile_chr_0011_seraph_combo_skill",
                                        "skillTriggers": [
                                          {
                                            "event": "hit",
                                            "skillId": "chr_0011_seraph_combo_skill_projhit"
                                          }
                                        ],
                                        "assignBlackboard": true,
                                        "entityBlackboardAssignments": [
                                          {
                                            "targetKey": "EntityBB_bounced",
                                            "valueType": "Numeric",
                                            "numericValue": 1.0,
                                            "stringValue": "",
                                            "useDirectValue": true,
                                            "inputValueKey": "EntityBB_bounced"
                                          }
                                        ],
                                        "target": {
                                          "targetSource": "Context",
                                          "targetGroupKey": "extra_target",
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
                                  "failActions": [],
                                  "conditionNegated": [
                                    false,
                                    false
                                  ],
                                  "alwaysNext": true
                                },
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 17,
                                  "actionPath": [
                                    "timelineActions[1]",
                                    "_sequenceActionData",
                                    "actionData",
                                    "[7]"
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
                                        "timelineActions[1]",
                                        "_sequenceActionData",
                                        "actionData",
                                        "[7]",
                                        "succeedActions",
                                        "actionData",
                                        "[1]"
                                      ],
                                      "serverActionIndex": 20,
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
                              "auxiliaryActions": [
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 11,
                                  "actionType": "CreateBuffAction",
                                  "sourceId": "buff_chr_0011_seraph_combo_skill_tutorial_marker",
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
                                  "sequenceIndex": 1,
                                  "autoFinishByAction": false
                                }
                              ],
                              "resourceGains": [],
                              "inflictions": [
                                {
                                  "startFrame": 0,
                                  "endFrame": 3,
                                  "actionIndex": 14,
                                  "element": "cryo",
                                  "isExtra": false,
                                  "sequenceIndex": 1
                                }
                              ],
                              "combatActions": [
                                "CreateBuffAction",
                                "DamageAction",
                                "IfElseAction",
                                "LaunchProjectile",
                                "ObtainCostAction",
                                "SpellInfliction"
                              ],
                              "cycleTruncated": true,
                              "nestedProjectileTriggeredSkills": [],
                              "abilityEntityHits": [],
                              "auraActions": []
                            }
                          ]
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
                      "endFrame": 3,
                      "actionIndex": 17,
                      "actionPath": [
                        "timelineActions[1]",
                        "_sequenceActionData",
                        "actionData",
                        "[7]"
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
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[7]",
                            "succeedActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 20,
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
                  "auxiliaryActions": [
                    {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 11,
                      "actionType": "CreateBuffAction",
                      "sourceId": "buff_chr_0011_seraph_combo_skill_tutorial_marker",
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
                      "sequenceIndex": 1,
                      "autoFinishByAction": false
                    }
                  ],
                  "resourceGains": [],
                  "inflictions": [
                    {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 14,
                      "element": "cryo",
                      "isExtra": false,
                      "sequenceIndex": 1
                    }
                  ],
                  "combatActions": [
                    "CreateBuffAction",
                    "DamageAction",
                    "IfElseAction",
                    "LaunchProjectile",
                    "ObtainCostAction",
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
      "buffBlackboardReads": [],
      "buffFinishes": [
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 25,
          "targetSource": "Source",
          "targetGroupKey": "",
          "buffCheckType": "Id",
          "buffIds": [
            "buff_chr_0011_seraph_combo_skill_listener",
            "buff_chr_0011_seraph_normal_skill_heal"
          ],
          "tagQueryType": "hasAny",
          "buffTagIds": [],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": false,
          "isAbsorbed": false,
          "finishLayerCount": null,
          "sourceActionType": "FinishBuffAction",
          "sequenceIndex": 3
        }
      ],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 24,
          "actionOrder": [
            15,
            0
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0011_seraph_combo_skill",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0011_seraph_combo_skill_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0011_seraph_combo_skill_projhit.json",
          "damageUnits": [
            {
              "damageType": "Cryst",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 2.5,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  2.0,
                  2.2,
                  2.4,
                  2.6,
                  2.8,
                  3.0,
                  3.2,
                  3.4,
                  3.6,
                  3.85,
                  4.15,
                  4.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 12288
            },
            {
              "damageType": "Cryst",
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
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 15,
              "damageUnits": [
                {
                  "damageType": "Cryst",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 2.5,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      2.0,
                      2.2,
                      2.4,
                      2.6,
                      2.8,
                      3.0,
                      3.2,
                      3.4,
                      3.6,
                      3.85,
                      4.15,
                      4.5
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 12288
                },
                {
                  "damageType": "Cryst",
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
              "sequenceIndex": 1
            }
          ],
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
                  "sourceType": "CompareFloat",
                  "supported": true,
                  "comparison": "GE",
                  "left": {
                    "value": 0.0,
                    "blackboardKey": "exist_talent_1",
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
                  "actionType": "IfElseAction",
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
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 3,
                    "actionIndex": 2,
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
                            1570888476,
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
                        "actionType": "CreateBuffAction",
                        "actionIndex": 0,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[0]"
                        ],
                        "serverActionIndex": 4,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "buffApplication": {
                          "buffs": [
                            {
                              "buffId": "buff_chr_0011_seraph_talent_1_crystup",
                              "classification": null,
                              "blackboardAssignments": {
                                "cryst_up": {
                                  "value": 0.0,
                                  "blackboardKey": "cryst_up",
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
                                "duration": {
                                  "value": 0.0,
                                  "blackboardKey": "duration",
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
              "endFrame": 3,
              "actionIndex": 5,
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
                  "comparison": "Equals",
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
                },
                {
                  "sourceType": "CompareFloat",
                  "supported": true,
                  "comparison": "Equals",
                  "left": {
                    "value": 1.0,
                    "blackboardKey": "EntityBB_bounced",
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
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 8,
                  "blackboardMutation": {
                    "key": "EntityBB_bounced",
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
                },
                {
                  "actionType": "LaunchProjectile",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[1]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 10,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "projectileLaunch": {
                    "projectileId": "projectile_chr_0011_seraph_combo_skill",
                    "skillTriggers": [
                      {
                        "event": "hit",
                        "skillId": "chr_0011_seraph_combo_skill_projhit"
                      }
                    ],
                    "assignBlackboard": true,
                    "entityBlackboardAssignments": [
                      {
                        "targetKey": "EntityBB_bounced",
                        "valueType": "Numeric",
                        "numericValue": 1.0,
                        "stringValue": "",
                        "useDirectValue": true,
                        "inputValueKey": "EntityBB_bounced"
                      }
                    ],
                    "target": {
                      "targetSource": "Context",
                      "targetGroupKey": "extra_target",
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
                      "launchFrame": 24,
                      "actionOrder": [
                        15,
                        0,
                        5,
                        2
                      ],
                      "assumedTravelFrames": 0,
                      "projectileId": "projectile_chr_0011_seraph_combo_skill",
                      "triggerEvent": "hit",
                      "triggerSkillId": "chr_0011_seraph_combo_skill_projhit",
                      "excludedByPrimaryTargetMarker": false,
                      "sourceFile": "chr_0011_seraph_combo_skill_projhit.json",
                      "damageUnits": [
                        {
                          "damageType": "Cryst",
                          "attributeType": "Hp",
                          "calculation": "standard",
                          "attackScale": {
                            "value": 2.5,
                            "blackboardKey": "atk_scale",
                            "levelValues": [
                              2.0,
                              2.2,
                              2.4,
                              2.6,
                              2.8,
                              3.0,
                              3.2,
                              3.4,
                              3.6,
                              3.85,
                              4.15,
                              4.5
                            ]
                          },
                          "calculationMultiplier": null,
                          "poiseValue": null,
                          "definiteValue": null,
                          "damageDecorateMask": 12288
                        },
                        {
                          "damageType": "Cryst",
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
                      "directDamageHits": [
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 15,
                          "damageUnits": [
                            {
                              "damageType": "Cryst",
                              "attributeType": "Hp",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 2.5,
                                "blackboardKey": "atk_scale",
                                "levelValues": [
                                  2.0,
                                  2.2,
                                  2.4,
                                  2.6,
                                  2.8,
                                  3.0,
                                  3.2,
                                  3.4,
                                  3.6,
                                  3.85,
                                  4.15,
                                  4.5
                                ]
                              },
                              "calculationMultiplier": null,
                              "poiseValue": null,
                              "definiteValue": null,
                              "damageDecorateMask": 12288
                            },
                            {
                              "damageType": "Cryst",
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
                          "sequenceIndex": 1
                        }
                      ],
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
                              "sourceType": "CompareFloat",
                              "supported": true,
                              "comparison": "GE",
                              "left": {
                                "value": 0.0,
                                "blackboardKey": "exist_talent_1",
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
                              "actionType": "IfElseAction",
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
                              "nestedCondition": {
                                "startFrame": 0,
                                "endFrame": 3,
                                "actionIndex": 2,
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
                                        1570888476,
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
                                    "actionType": "CreateBuffAction",
                                    "actionIndex": 0,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[0]"
                                    ],
                                    "serverActionIndex": 4,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "buffApplication": {
                                      "buffs": [
                                        {
                                          "buffId": "buff_chr_0011_seraph_talent_1_crystup",
                                          "classification": null,
                                          "blackboardAssignments": {
                                            "cryst_up": {
                                              "value": 0.0,
                                              "blackboardKey": "cryst_up",
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
                                            "duration": {
                                              "value": 0.0,
                                              "blackboardKey": "duration",
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
                          "endFrame": 3,
                          "actionIndex": 5,
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
                              "comparison": "Equals",
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
                            },
                            {
                              "sourceType": "CompareFloat",
                              "supported": true,
                              "comparison": "Equals",
                              "left": {
                                "value": 1.0,
                                "blackboardKey": "EntityBB_bounced",
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
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[0]"
                              ],
                              "serverActionIndex": 8,
                              "blackboardMutation": {
                                "key": "EntityBB_bounced",
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
                            },
                            {
                              "actionType": "LaunchProjectile",
                              "actionIndex": 2,
                              "actionPath": [
                                "timelineActions[1]",
                                "_sequenceActionData",
                                "actionData",
                                "[0]",
                                "succeedActions",
                                "actionData",
                                "[2]"
                              ],
                              "serverActionIndex": 10,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "projectileLaunch": {
                                "projectileId": "projectile_chr_0011_seraph_combo_skill",
                                "skillTriggers": [
                                  {
                                    "event": "hit",
                                    "skillId": "chr_0011_seraph_combo_skill_projhit"
                                  }
                                ],
                                "assignBlackboard": true,
                                "entityBlackboardAssignments": [
                                  {
                                    "targetKey": "EntityBB_bounced",
                                    "valueType": "Numeric",
                                    "numericValue": 1.0,
                                    "stringValue": "",
                                    "useDirectValue": true,
                                    "inputValueKey": "EntityBB_bounced"
                                  }
                                ],
                                "target": {
                                  "targetSource": "Context",
                                  "targetGroupKey": "extra_target",
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
                          "failActions": [],
                          "conditionNegated": [
                            false,
                            false
                          ],
                          "alwaysNext": true
                        },
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 17,
                          "actionPath": [
                            "timelineActions[1]",
                            "_sequenceActionData",
                            "actionData",
                            "[7]"
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
                                "timelineActions[1]",
                                "_sequenceActionData",
                                "actionData",
                                "[7]",
                                "succeedActions",
                                "actionData",
                                "[1]"
                              ],
                              "serverActionIndex": 20,
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
                      "auxiliaryActions": [
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 11,
                          "actionType": "CreateBuffAction",
                          "sourceId": "buff_chr_0011_seraph_combo_skill_tutorial_marker",
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
                          "sequenceIndex": 1,
                          "autoFinishByAction": false
                        }
                      ],
                      "resourceGains": [],
                      "inflictions": [
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 14,
                          "element": "cryo",
                          "isExtra": false,
                          "sequenceIndex": 1
                        }
                      ],
                      "combatActions": [
                        "CreateBuffAction",
                        "DamageAction",
                        "IfElseAction",
                        "LaunchProjectile",
                        "ObtainCostAction",
                        "SpellInfliction"
                      ],
                      "cycleTruncated": true,
                      "nestedProjectileTriggeredSkills": [],
                      "abilityEntityHits": [],
                      "auraActions": []
                    }
                  ]
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
              "endFrame": 3,
              "actionIndex": 17,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[7]"
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
                    "timelineActions[1]",
                    "_sequenceActionData",
                    "actionData",
                    "[7]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 20,
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
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 11,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0011_seraph_combo_skill_tutorial_marker",
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
              "sequenceIndex": 1,
              "autoFinishByAction": false
            }
          ],
          "resourceGains": [],
          "inflictions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 14,
              "element": "cryo",
              "isExtra": false,
              "sequenceIndex": 1
            }
          ],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction",
            "IfElseAction",
            "LaunchProjectile",
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
        "buff_chr_0011_seraph_finishball_02"
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
            2.0,
            2.2,
            2.4,
            2.6,
            2.8,
            3.0,
            3.2,
            3.4,
            3.6,
            3.85,
            4.15,
            4.5
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
          8.0,
          8.0,
          8.0,
          8.0,
          8.0,
          8.0,
          8.0,
          8.0,
          8.0,
          8.0,
          8.0,
          7.0
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
          "key": "count",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cryst_up",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "exist_talent_1",
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
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_3",
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
          "key": "cryst_up",
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
          "key": "exist_talent_1",
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
          "key": "potential_3",
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
        "FinishBuffAction",
        "IfElseAction",
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
          "endFrame": 24,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "main",
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
          "endFrame": 24,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "main",
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
          "endFrame": 24,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[3]"
          ],
          "targetGroupKey": "mainchr",
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
          "endFrame": 24,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[4]"
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
          "startFrame": 24,
          "endFrame": 25,
          "actionIndex": 14,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "ball",
          "producerType": "FindTargetAction",
          "finderType": "OwnerSpawnedEntityFinder",
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [
            "TagValidator"
          ],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "finderSpawnedObjectType": "AbilityEntity",
          "validatorTagQueries": [
            [
              "HasAny",
              [
                -380421959
              ]
            ]
          ],
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionIndex": 31,
          "actionPath": [
            "timelineActions[7]",
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
          "endFrame": 24,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[1]",
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
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 4,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            }
          ],
          "failActions": [
            {
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[1]",
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
          "startFrame": 24,
          "endFrame": 25,
          "actionIndex": 15,
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
                "targetGroupKey": "ball",
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
              "serverActionIndex": 17,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0011_seraph_combo_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0011_seraph_combo_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "main",
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
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 19,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0011_seraph_finishball_02",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "ball",
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
              "actionType": "FinishBuffAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 20,
              "legacyBuffFinish": {
                "target": {
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
                  "finderType": "CharacterTeamFinder",
                  "validatorTypes": [],
                  "postProcessorTypes": []
                },
                "buffIds": [
                  "buff_chr_0011_seraph_atk_buff_normal_skill"
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
          "failActions": [
            {
              "actionType": "LaunchProjectile",
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
              "serverActionIndex": 21,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0011_seraph_combo_skill",
                "skillTriggers": [
                  {
                    "event": "hit",
                    "skillId": "chr_0011_seraph_combo_skill_projhit"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "main",
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
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 23,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0011_seraph_finishball_02",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "ball",
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
              "actionType": "FinishBuffAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 24,
              "legacyBuffFinish": {
                "target": {
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
                  "finderType": "CharacterTeamFinder",
                  "validatorTypes": [],
                  "postProcessorTypes": []
                },
                "buffIds": [
                  "buff_chr_0011_seraph_atk_buff_normal_skill"
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
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[7]",
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
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 31,
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
          "endFrame": 24,
          "actionIndex": 28,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.900000036,
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
          "influenceSkillCooldown": {
            "value": 0.4,
            "blackboardKey": null,
            "levelValues": null
          },
          "targetScale": null,
          "sequenceIndex": 6,
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
      "skillId": "chr_0011_seraph_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0011_seraph_attack1.json",
      "timelineBlockFrames": 13,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 11,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 10,
      "allowNextWindows": [
        {
          "startFrame": 13,
          "endFrame": 25,
          "skillIds": [
            "chr_0011_seraph_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 25,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0011_seraph_attack2",
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
          "endFrame": 117,
          "actionTypes": [
            "PlayAnimationWithStep"
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
          "startFrame": 10,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 117,
          "actionTypes": [
            "MoveToAction"
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
          "startFrame": 0,
          "endFrame": 14,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 117,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 117,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 67,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 117,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 25,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 25,
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
          "projectileId": "projectile_chr_0011_seraph_normal_attack",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0011_seraph_attack1_projhit"
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
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0011_seraph_normal_attack",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0011_seraph_attack1_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0011_seraph_attack1_projhit.json",
          "damageUnits": [
            {
              "damageType": "Cryst",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
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
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Cryst",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
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
              "endFrame": 3,
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
          "value": 0.3,
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
      "key": "basicAttack2",
      "skillId": "chr_0011_seraph_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0011_seraph_attack2.json",
      "timelineBlockFrames": 17,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 7,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 7,
      "allowNextWindows": [
        {
          "startFrame": 17,
          "endFrame": 28,
          "skillIds": [
            "chr_0011_seraph_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 28,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0011_seraph_attack3",
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
          "endFrame": 6,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 121,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 49,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 0,
          "endFrame": 121,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 5,
          "endFrame": 121,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 121,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 28,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 28,
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
          "projectileId": "projectile_chr_0011_seraph_normal_attack2",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0011_seraph_attack2_projhit"
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
            2
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0011_seraph_normal_attack2",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0011_seraph_attack2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0011_seraph_attack2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Cryst",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.16,
                  0.18,
                  0.19,
                  0.21,
                  0.22,
                  0.24,
                  0.26,
                  0.27,
                  0.29,
                  0.31,
                  0.33,
                  0.36
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
                  "damageType": "Cryst",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.16,
                      0.18,
                      0.19,
                      0.21,
                      0.22,
                      0.24,
                      0.26,
                      0.27,
                      0.29,
                      0.31,
                      0.33,
                      0.36
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
            0.16,
            0.18,
            0.19,
            0.21,
            0.22,
            0.24,
            0.26,
            0.27,
            0.29,
            0.31,
            0.33,
            0.36
          ],
          "display_atk_scale": [
            0.16,
            0.18,
            0.19,
            0.21,
            0.22,
            0.24,
            0.26,
            0.27,
            0.29,
            0.31,
            0.33,
            0.36
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
          "value": 0.37,
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
      "skillId": "chr_0011_seraph_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0011_seraph_attack3.json",
      "timelineBlockFrames": 14,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 11,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 8,
      "allowNextWindows": [
        {
          "startFrame": 14,
          "endFrame": 25,
          "skillIds": [
            "chr_0011_seraph_attack4"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 25,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0011_seraph_attack4",
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
          "endFrame": 125,
          "actionTypes": [
            "PlayAnimationWithStep"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 8,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 72,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 52,
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
          "startFrame": 0,
          "endFrame": 14,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 125,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 125,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 125,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 125,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 25,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 25,
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
          "projectileId": "projectile_chr_0011_seraph_normal_attack3_true",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0011_seraph_attack3_projhit"
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
          "projectileId": "projectile_chr_0011_seraph_normal_attack3_true",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0011_seraph_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0011_seraph_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Cryst",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.21,
                  0.23,
                  0.25,
                  0.27,
                  0.29,
                  0.32,
                  0.34,
                  0.36,
                  0.38,
                  0.4,
                  0.44,
                  0.47
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
                  "damageType": "Cryst",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.21,
                      0.23,
                      0.25,
                      0.27,
                      0.29,
                      0.32,
                      0.34,
                      0.36,
                      0.38,
                      0.4,
                      0.44,
                      0.47
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
            0.21,
            0.23,
            0.25,
            0.27,
            0.29,
            0.32,
            0.34,
            0.36,
            0.38,
            0.4,
            0.44,
            0.47
          ],
          "display_atk_scale": [
            0.21,
            0.23,
            0.25,
            0.27,
            0.29,
            0.32,
            0.34,
            0.36,
            0.38,
            0.4,
            0.44,
            0.47
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
          "value": 0.3,
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
      "key": "basicAttack4",
      "skillId": "chr_0011_seraph_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0011_seraph_attack4.json",
      "timelineBlockFrames": 21,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 12,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 12,
      "allowNextWindows": [
        {
          "startFrame": 21,
          "endFrame": 33,
          "skillIds": [
            "chr_0011_seraph_attack5"
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
              "skillId": "chr_0011_seraph_attack5",
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
          "endFrame": 128,
          "actionTypes": [
            "PlayAnimationWithStep"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 128,
          "actionTypes": [
            "CustomRootMotionAction"
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
          "startFrame": 7,
          "endFrame": 7,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 62,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 53,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 128,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 128,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 128,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 128,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 21,
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
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 12,
          "projectileId": "projectile_chr_0011_seraph_normal_attack3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0011_seraph_attack4_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 7,
          "projectileId": "projectile_chr_0011_seraph_normal_attack3_02",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0011_seraph_attack4_projhit"
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
          "projectileId": "projectile_chr_0011_seraph_normal_attack3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0011_seraph_attack4_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0011_seraph_attack4_projhit.json",
          "damageUnits": [
            {
              "damageType": "Cryst",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
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
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 4,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Cryst",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
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
              "endFrame": 4,
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
                      "value": 0.5,
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
          "launchFrame": 7,
          "actionOrder": [
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0011_seraph_normal_attack3_02",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0011_seraph_attack4_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0011_seraph_attack4_projhit.json",
          "damageUnits": [
            {
              "damageType": "Cryst",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
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
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 4,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Cryst",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
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
              "endFrame": 4,
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
                      "value": 0.5,
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
          ],
          "display_atk_scale": [
            0.33,
            0.36,
            0.4,
            0.43,
            0.46,
            0.5,
            0.53,
            0.56,
            0.59,
            0.64,
            0.68,
            0.74
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
          "value": 0.55,
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
      "key": "basicAttack5",
      "skillId": "chr_0011_seraph_attack5",
      "skillType": "basicAttack",
      "sourceFile": "chr_0011_seraph_attack5.json",
      "timelineBlockFrames": 33,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 12,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 19,
      "allowNextWindows": [
        {
          "startFrame": 33,
          "endFrame": 40,
          "skillIds": [
            "chr_0011_seraph_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 40,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0011_seraph_attack1",
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
          "endFrame": 137,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 8,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 8,
          "actionTypes": [
            "DisableRootMotionAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 19,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "Selector",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "CameraImpulseAction",
            "PlaySoundAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 63,
          "actionTypes": [
            "EffectAction",
            "Selector"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 66,
          "actionTypes": [
            "EffectAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 80,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 33,
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
          "endFrame": 137,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 137,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 137,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 137,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 18,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 33,
          "endFrame": 40,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 19,
          "endFrame": 19,
          "actionIndex": 15,
          "damageUnits": [
            {
              "damageType": "Cryst",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 4.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.55,
                  0.61,
                  0.66,
                  0.72,
                  0.77,
                  0.83,
                  0.88,
                  0.94,
                  0.99,
                  1.06,
                  1.14,
                  1.24
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
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 4
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 19,
          "endFrame": 19,
          "actionIndex": 17,
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
            },
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
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 22,
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
            0.55,
            0.61,
            0.66,
            0.72,
            0.77,
            0.83,
            0.88,
            0.94,
            0.99,
            1.06,
            1.14,
            1.24
          ],
          "display_atk_scale": [
            0.55,
            0.61,
            0.66,
            0.72,
            0.77,
            0.83,
            0.88,
            0.94,
            0.99,
            1.06,
            1.14,
            1.24
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
          "value": 0.55,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 0.0,
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
          "key": "display_atk_scale",
          "declaredInSkill": false,
          "suppliedByPatch": true,
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
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target",
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
          "endFrame": 1,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target",
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
          "endFrame": 1,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target",
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
          "endFrame": 1,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "target",
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
          "startFrame": 19,
          "endFrame": 19,
          "actionIndex": 14,
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
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]"
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
              "actionType": "IfElseAction",
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
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 1,
                "actionIndex": 3,
                "actionPath": [
                  "timelineActions[1]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "succeedActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckDistanceCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": null,
                    "targetAngle": null,
                    "distance": {
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
                      "distance": 12.0,
                      "lessThan": true,
                      "includeTargetRadius": false,
                      "containsHittableObject": false
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
                    "actionType": "FindTargetAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[1]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 5,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
                "failActions": [
                  {
                    "actionType": "FindTargetAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[1]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 6,
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
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 7,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 1,
                "actionIndex": 7,
                "actionPath": [
                  "timelineActions[1]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
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
                      "targetSource": "Target",
                      "targetGroupKey": "",
                      "minimumCount": 1,
                      "comparison": "GE",
                      "containsHittableTarget": true,
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
                      "timelineActions[1]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
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
                    "actionType": "FindTargetAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[1]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 10,
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
          "startFrame": 19,
          "endFrame": 19,
          "actionIndex": 17,
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
            },
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
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 22,
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
      "skillId": "chr_0011_seraph_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0011_seraph_power_attack.json",
      "timelineBlockFrames": 34,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 12,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 34,
          "endFrame": 53,
          "skillIds": [
            "chr_0011_seraph_normal_skill",
            "chr_0011_seraph_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 53,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0011_seraph_normal_skill",
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
              "skillId": "chr_0011_seraph_combo_skill",
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
          "endFrame": 160,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "DisableRootMotionAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 35,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 32,
          "actionTypes": [
            "DamageAction",
            "Selector",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "CameraImpulseAction",
            "GainBreakingAttackAtb"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 160,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "AddDynamicCcsAction"
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
          "endFrame": 34,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 53,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 53,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 127,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 127,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 160,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 160,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 73,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 32,
          "endFrame": 32,
          "actionIndex": 7,
          "damageUnits": [
            {
              "damageType": "Cryst",
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
          "sequenceIndex": 4
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionIndex": 24,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_full_immune_medium",
          "classification": null,
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
          "sequenceIndex": 12,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 34,
          "actionIndex": 25,
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
          "sequenceIndex": 13,
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
        "buff_common_full_immune_medium",
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
          "value": 0.55,
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
      "skillId": "chr_0011_seraph_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0011_seraph_plunging_attack_end.json",
      "timelineBlockFrames": 13,
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
          "endFrame": 116,
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
            "PlaySoundAction",
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
          "endFrame": 12,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 116,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 116,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 116,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 3,
          "damageUnits": [
            {
              "damageType": "Cryst",
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
      "resourceGains": [
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 6,
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
          "sequenceIndex": 3
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
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 1,
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
      "skillId": "chr_0011_seraph_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0011_seraph_normal_skill.json",
      "timelineBlockFrames": 31,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 3.0,
      "costFrame": 0,
      "costType": "Atb",
      "costValue": 40.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 145,
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
          "startFrame": 6,
          "endFrame": 6,
          "actionTypes": [
            "IfElseAction",
            "ObtainCostAction",
            "FinishBuffAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 63,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 38,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 25,
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
          "endFrame": 30,
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
          "endFrame": 145,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 145,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 37,
          "endFrame": 145,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 145,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 145,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 6,
          "endFrame": 6,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckBuffStackNum",
              "supported": true,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "buffStack": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0011_seraph_talent_1_atb"
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
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 11,
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
                "spGainSource": "skill",
                "onlyMainOperator": false,
                "isPercentValue": false,
                "useUltimateRecoveryTag": false,
                "ultimateRecoveryTagId": 0,
                "ignoreUltimateGainScalar": false
              }
            },
            {
              "actionType": "FinishBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 12,
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
                  "buff_chr_0011_seraph_talent_1_atb"
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
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 13,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0011_seraph_spawnball",
          "classification": null,
          "targetSource": "Owner",
          "targetGroupKey": "",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionOwner",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {
            "atk_up": {
              "value": 0.0,
              "blackboardKey": "atk_up",
              "levelValues": [
                0.09,
                0.09,
                0.09,
                0.09,
                0.09,
                0.11,
                0.11,
                0.11,
                0.13,
                0.13,
                0.13,
                0.15
              ]
            },
            "atk_scale": {
              "value": 0.0,
              "blackboardKey": "atk_scale",
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
                0.1,
                0.1,
                0.1
              ]
            },
            "heal_value": {
              "value": 0.0,
              "blackboardKey": "heal_value",
              "levelValues": [
                144.0,
                172.8,
                201.6,
                230.4,
                244.8,
                259.2,
                273.6,
                288.0,
                302.4,
                309.6,
                316.8,
                324.0
              ]
            },
            "buff_duration": {
              "value": 0.0,
              "blackboardKey": "buff_duration",
              "levelValues": [
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
                25.0
              ]
            },
            "will_up": {
              "value": 0.0,
              "blackboardKey": "will_up",
              "levelValues": [
                0.336,
                0.4,
                0.47,
                0.54,
                0.57,
                0.6,
                0.64,
                0.67,
                0.71,
                0.72,
                0.74,
                0.76
              ]
            }
          },
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 3,
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
        "buff_chr_0011_seraph_spawnball"
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
          "atk_up": [
            0.09,
            0.09,
            0.09,
            0.09,
            0.09,
            0.11,
            0.11,
            0.11,
            0.13,
            0.13,
            0.13,
            0.15
          ],
          "buff_duration": [
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
            25.0
          ],
          "duration": [
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
          "heal_value": [
            144.0,
            172.8,
            201.6,
            230.4,
            244.8,
            259.2,
            273.6,
            288.0,
            302.4,
            309.6,
            316.8,
            324.0
          ],
          "will_up": [
            0.336,
            0.4,
            0.47,
            0.54,
            0.57,
            0.6,
            0.64,
            0.67,
            0.71,
            0.72,
            0.74,
            0.76
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
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_up",
          "value": 0.5,
          "isDynamic": false
        },
        {
          "key": "buff_duration",
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
          "isDynamic": false
        },
        {
          "key": "heal_value",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "potential_1",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "will_up",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "cam_angle",
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
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
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
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "buff_duration",
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
          "suppliedByPatch": true,
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
          "key": "potential_1",
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
          "key": "usp",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "will_up",
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
        "FinishBuffAction",
        "IfElseAction",
        "ObtainCostAction"
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 6,
          "endFrame": 6,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckBuffStackNum",
              "supported": true,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "buffStack": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0011_seraph_talent_1_atb"
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
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 11,
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
                "spGainSource": "skill",
                "onlyMainOperator": false,
                "isPercentValue": false,
                "useUltimateRecoveryTag": false,
                "ultimateRecoveryTagId": 0,
                "ignoreUltimateGainScalar": false
              }
            },
            {
              "actionType": "FinishBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 12,
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
                  "buff_chr_0011_seraph_talent_1_atb"
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
      "key": "ultimate",
      "skillId": "chr_0011_seraph_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0011_seraph_ultimate_skill.json",
      "timelineBlockFrames": 67,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "Atb",
      "costValue": 40.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 67,
          "endFrame": 100,
          "skillIds": [
            "chr_0011_seraph_normal_skill",
            "chr_0011_seraph_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 100,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0011_seraph_normal_skill",
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
              "skillId": "chr_0011_seraph_combo_skill",
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
          "endFrame": 183,
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
          "endFrame": 45,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 44,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 47,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 45,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "AnimatedCameraAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 80,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 104,
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
          "endFrame": 44,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 43,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 104,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 52,
          "endFrame": 141,
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
          "startFrame": 58,
          "endFrame": 61,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "CreateBuffAction",
            "DispelAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 100,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 67,
          "endFrame": 100,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "ChannelingCastingAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 133,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 133,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 71,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 183,
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
          "endFrame": 80,
          "actionIndex": 18,
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
          "startFrame": 58,
          "endFrame": 61,
          "actionIndex": 28,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0011_seraph_atk_buff",
          "classification": null,
          "targetSource": "Context",
          "targetGroupKey": "tar",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionSource",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {
            "atk_up": {
              "value": 0.0,
              "blackboardKey": "atk_up",
              "levelValues": [
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
                0.22,
                0.24
              ]
            },
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
            "wisd_up": {
              "value": 0.0,
              "blackboardKey": "wisd_up",
              "levelValues": [
                0.00014,
                0.00015,
                0.00016,
                0.00018,
                0.00019,
                0.0002,
                0.00022,
                0.00023,
                0.00024,
                0.00026,
                0.00028,
                0.0003
              ]
            },
            "wisd_max": {
              "value": 0.0,
              "blackboardKey": "wisd_max",
              "levelValues": [
                0.3,
                0.3,
                0.3,
                0.3,
                0.3,
                0.3,
                0.3,
                0.3,
                0.3,
                0.3,
                0.3,
                0.36
              ]
            }
          },
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 17,
          "autoFinishByAction": false
        },
        {
          "startFrame": 58,
          "endFrame": 61,
          "actionIndex": 28,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0011_seraph_atk_buff_2",
          "classification": null,
          "targetSource": "Context",
          "targetGroupKey": "tar",
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
          "sequenceIndex": 17,
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
        "buff_chr_0011_seraph_atk_buff",
        "buff_chr_0011_seraph_atk_buff_2",
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
          "atk_up": [
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
            0.22,
            0.24
          ],
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
          "wisd_max": [
            0.3,
            0.3,
            0.3,
            0.3,
            0.3,
            0.3,
            0.3,
            0.3,
            0.3,
            0.3,
            0.3,
            0.36
          ],
          "wisd_up": [
            0.00014,
            0.00015,
            0.00016,
            0.00018,
            0.00019,
            0.0002,
            0.00022,
            0.00023,
            0.00024,
            0.00026,
            0.00028,
            0.0003
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
          80.0,
          80.0,
          80.0,
          80.0,
          80.0,
          80.0,
          80.0,
          80.0,
          80.0,
          80.0,
          80.0,
          80.0
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
          "key": "duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "exist_talent_2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_value",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "radius",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "wisd_max",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "wisd_up",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "exist_talent_2"
      ],
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
          "suppliedByPatch": true,
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
          "key": "exist_talent_2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
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
          "key": "radius",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "wisd_max",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "wisd_up",
          "declaredInSkill": true,
          "suppliedByPatch": true,
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
          "startFrame": 58,
          "endFrame": 61,
          "actionIndex": 27,
          "actionPath": [
            "timelineActions[17]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
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
          "endFrame": 45,
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
