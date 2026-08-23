/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const snowshineGeneratedSource = {
  "slug": "snowshine",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0014_aurora_combo_skill_heal",
      "sourceFile": "buff_chr_0014_aurora_combo_skill_heal.json",
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
          "value": 999.0,
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
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "heal_scale",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "heal_static_value",
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
            "CheckObjectTypeMatch",
            "EffectAction",
            "HealAction"
          ],
          "combatActions": [
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
                "CheckObjectTypeMatch",
                "EffectAction",
                "HealAction"
              ],
              "combatActions": [
                "HealAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "HealAction",
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
                    "attribute": "Will",
                    "multiplier": {
                      "value": 1.0,
                      "blackboardKey": "heal_scale",
                      "levelValues": [
                        1.0
                      ]
                    },
                    "addition": {
                      "value": 30.0,
                      "blackboardKey": "heal_static_value",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "tagIds": [
                      -1517158118
                    ]
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
      "buffId": "buff_chr_0014_aurora_combo_skill_heal_loop",
      "sourceFile": "buff_chr_0014_aurora_combo_skill_heal_loop.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 2.9,
          "blackboardKey": "duration",
          "levelValues": [
            0.0
          ]
        },
        "triggerInterval": {
          "value": 0.5,
          "blackboardKey": "interval",
          "levelValues": [
            0.0
          ]
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 999.0,
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
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_scale_loop",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_static_value_loop",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "interval",
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
            "CheckObjectTypeMatch",
            "EffectAction",
            "HealAction"
          ],
          "combatActions": [
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
                "CheckObjectTypeMatch",
                "EffectAction",
                "HealAction"
              ],
              "combatActions": [
                "HealAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "HealAction",
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
                    "attribute": "Will",
                    "multiplier": {
                      "value": 1.0,
                      "blackboardKey": "heal_scale_loop",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "addition": {
                      "value": 15.0,
                      "blackboardKey": "heal_static_value_loop",
                      "levelValues": [
                        0.0
                      ]
                    },
                    "tagIds": [
                      -1517158118
                    ]
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
      "buffId": "buff_chr_0014_aurora_combo_skill_tutorial_marker",
      "sourceFile": "buff_chr_0014_aurora_combo_skill_tutorial_marker.json",
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
      "buffId": "buff_chr_0014_aurora_potential_1",
      "sourceFile": "buff_chr_0014_aurora_potential_1.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 9999.0,
          "blackboardKey": "duration",
          "levelValues": [
            0.05
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
          "key": "duration",
          "value": 0.05,
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
            "AddTagAction"
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
                "AddTagAction"
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
      "buffId": "buff_chr_0014_aurora_potential_1_listener",
      "sourceFile": "buff_chr_0014_aurora_potential_1_listener.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 9999.0,
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
          "key": "duration",
          "value": 9999.0,
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
          "event": "OnCharBeforeTakeSpellInfliction",
          "orderedActionTypes": [
            "CheckTagMatch",
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
                    "buffId": "buff_chr_0014_aurora_potential_1",
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
            "buff_chr_0014_aurora_potential_1"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckTagMatch",
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
                        "buffId": "buff_chr_0014_aurora_potential_1",
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
                  "actionType": "CheckTagMatch",
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
                            -1957150384
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
                              "buffId": "buff_chr_0014_aurora_potential_1",
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
      "buffId": "buff_chr_0014_aurora_reduce_damage",
      "sourceFile": "buff_chr_0014_aurora_reduce_damage.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 9999.0,
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
          "key": "duration",
          "value": 9999.0,
          "isDynamic": false
        },
        {
          "key": "potential_1",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "taken_dmg",
          "value": 0.1,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        1483840340
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
            "CompareFloat",
            "AddTagAction",
            "ShelterAction"
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
                "CompareFloat",
                "AddTagAction"
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
                "ShelterAction"
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
                    "buffId": "buff_chr_0014_aurora_reduce_damage_remain",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.5,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "potential_1": {
                        "value": 0.0,
                        "blackboardKey": "potential_1",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "taken_dmg": {
                        "value": 0.0,
                        "blackboardKey": "taken_dmg",
                        "levelValues": [
                          0.1
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
            "buff_chr_0014_aurora_reduce_damage_remain"
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
                  "actionIndex": 4,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0014_aurora_reduce_damage_remain",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.5,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "potential_1": {
                            "value": 0.0,
                            "blackboardKey": "potential_1",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "taken_dmg": {
                            "value": 0.0,
                            "blackboardKey": "taken_dmg",
                            "levelValues": [
                              0.1
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
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0014_aurora_reduce_damage_remain",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.5,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "potential_1": {
                            "value": 0.0,
                            "blackboardKey": "potential_1",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "taken_dmg": {
                            "value": 0.0,
                            "blackboardKey": "taken_dmg",
                            "levelValues": [
                              0.1
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
            "value": 30.0,
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
      "buffId": "buff_chr_0014_aurora_reduce_damage_remain",
      "sourceFile": "buff_chr_0014_aurora_reduce_damage_remain.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 9999.0,
          "blackboardKey": "duration",
          "levelValues": [
            0.5
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
          "key": "duration",
          "value": 0.5,
          "isDynamic": false
        },
        {
          "key": "potential_1",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "taken_dmg",
          "value": 0.1,
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
            "CompareFloat",
            "AddTagAction",
            "ShelterAction"
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
                "CompareFloat",
                "AddTagAction"
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
                "ShelterAction"
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
            "value": 30.0,
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
      "buffId": "buff_chr_0014_aurora_talent_0",
      "sourceFile": "buff_chr_0014_aurora_talent_0.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 9999.0,
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
          "key": "heal_up",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": 0.5,
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
      "eventActions": [],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "healModifiers": [
        {
          "enabledSide": "Healer",
          "targetHealthComparison": {
            "targetSource": "Target",
            "targetGroupKey": "",
            "comparison": "LE",
            "isRatio": true,
            "value": {
              "value": 0.5,
              "blackboardKey": "rate",
              "levelValues": [
                0.5
              ]
            }
          },
          "baseMultiplier": {
            "value": 0.0,
            "blackboardKey": "heal_up",
            "levelValues": [
              0.1
            ]
          },
          "multiplierCount": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          }
        }
      ],
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
      "buffId": "buff_chr_0014_aurora_ultimate_skill_dmg",
      "sourceFile": "buff_chr_0014_aurora_ultimate_skill_dmg.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 5.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "triggerInterval": {
          "value": 0.5,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "HighPriority",
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
          "key": "atk_scale_loop",
          "value": 0.1,
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
              "damageType": "Cryst",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_loop",
                "levelValues": [
                  0.1
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 512
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
                      "damageType": "Cryst",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": "atk_scale_loop",
                        "levelValues": [
                          0.1
                        ]
                      },
                      "calculationMultiplier": null,
                      "poiseValue": null,
                      "definiteValue": null,
                      "damageDecorateMask": 512
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
      "buffId": "buff_chr_0014_aurora_ultimate_skill_frost",
      "sourceFile": "buff_chr_0014_aurora_ultimate_skill_frost.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 5.0,
          "blackboardKey": "duration",
          "levelValues": [
            5.0
          ]
        },
        "triggerInterval": {
          "value": 2.0,
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
          "key": "duration",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "extra_duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "frozen_level",
          "value": 1.0,
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
            "CheckSuperArmor",
            "TimeDilationAction"
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
                "CheckSuperArmor",
                "TimeDilationAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [
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
                    "[1]"
                  ],
                  "serverActionIndex": 1,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "timeDilation": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 1,
                    "kind": "normal",
                    "priority": -361293424,
                    "scope": "entity",
                    "slot": -1855252810,
                    "duration": {
                      "value": 2.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "namedCurve": null,
                    "inlineCurve": [
                      {
                        "time": 0.0,
                        "value": 1.0,
                        "inTangent": -1.0,
                        "outTangent": -1.0,
                        "weightedMode": 0,
                        "inWeight": 0.0,
                        "outWeight": 0.333333343
                      },
                      {
                        "time": 1.0,
                        "value": 0.0,
                        "inTangent": -1.0,
                        "outTangent": -1.0,
                        "weightedMode": 0,
                        "inWeight": 0.333333343,
                        "outWeight": 0.0
                      }
                    ],
                    "finishByAction": true,
                    "ignoredTargets": [],
                    "targets": [
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
                    "buffId": "buff_common_cryst_cryst_frozen_triggered",
                    "classification": null,
                    "blackboardAssignments": {
                      "extra_duration": {
                        "value": 0.0,
                        "blackboardKey": "extra_duration",
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
            "buff_common_cryst_cryst_frozen_triggered"
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
                        "buffId": "buff_common_cryst_cryst_frozen_triggered",
                        "classification": null,
                        "blackboardAssignments": {
                          "extra_duration": {
                            "value": 0.0,
                            "blackboardKey": "extra_duration",
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
                        "buffId": "buff_common_cryst_cryst_frozen_triggered",
                        "classification": null,
                        "blackboardAssignments": {
                          "extra_duration": {
                            "value": 0.0,
                            "blackboardKey": "extra_duration",
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
      "buffId": "buff_common_cryst_cryst_frozen_triggered",
      "sourceFile": "buff_common_cryst_cryst_frozen_triggered.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 3.0,
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
        "stackingType": "Unlimited",
        "stackingKey": "cryst_triggered",
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
          "key": "consumed_layer",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "consumed_type",
          "value": 2.0,
          "isDynamic": true
        },
        {
          "key": "count",
          "value": 1.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "extra_duration",
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
              "actionIndex": 2,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_common_cryst_cryst_frozen_triggered_do",
                    "classification": null,
                    "blackboardAssignments": {
                      "count": {
                        "value": 0.0,
                        "blackboardKey": "count",
                        "levelValues": [
                          1.0
                        ]
                      },
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "consumed_type": {
                        "value": 0.0,
                        "blackboardKey": "consumed_type",
                        "levelValues": [
                          2.0
                        ]
                      },
                      "consumed_layer": {
                        "value": 0.0,
                        "blackboardKey": "consumed_layer",
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
            "buff_common_cryst_cryst_frozen_triggered_do"
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
                  "actionIndex": 2,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_common_cryst_cryst_frozen_triggered_do",
                        "classification": null,
                        "blackboardAssignments": {
                          "count": {
                            "value": 0.0,
                            "blackboardKey": "count",
                            "levelValues": [
                              1.0
                            ]
                          },
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "consumed_type": {
                            "value": 0.0,
                            "blackboardKey": "consumed_type",
                            "levelValues": [
                              2.0
                            ]
                          },
                          "consumed_layer": {
                            "value": 0.0,
                            "blackboardKey": "consumed_layer",
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
                  "serverActionIndex": 1,
                  "blackboardMutation": {
                    "key": "duration",
                    "operation": "Add",
                    "value": {
                      "value": 0.0,
                      "blackboardKey": "extra_duration",
                      "levelValues": [
                        0.0
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
                  "serverActionIndex": 2,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_common_cryst_cryst_frozen_triggered_do",
                        "classification": null,
                        "blackboardAssignments": {
                          "count": {
                            "value": 0.0,
                            "blackboardKey": "count",
                            "levelValues": [
                              1.0
                            ]
                          },
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "consumed_type": {
                            "value": 0.0,
                            "blackboardKey": "consumed_type",
                            "levelValues": [
                              2.0
                            ]
                          },
                          "consumed_layer": {
                            "value": 0.0,
                            "blackboardKey": "consumed_layer",
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
      "buffId": "buff_common_cryst_cryst_frozen_triggered_do",
      "sourceFile": "buff_common_cryst_cryst_frozen_triggered_do.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 6.5,
          "blackboardKey": "duration",
          "levelValues": [
            5.0
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
        "stackingKey": "cryst_triggered",
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
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 5.0,
          "isDynamic": true
        },
        {
          "key": "final_phy_dmg_up",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "phy_dmg_up",
          "value": 0.2,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        1535684437
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
            "PlaySoundAction",
            "CheckSuperArmor",
            "CreateBuffAction",
            "EffectAction",
            "IfElseAction"
          ],
          "combatActions": [
            "CreateBuffAction",
            "IfElseAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 2,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_common_frozen",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 5.0,
                        "blackboardKey": "duration",
                        "levelValues": [
                          5.0
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
            "buff_common_frozen"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "PlaySoundAction",
                "CheckSuperArmor",
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
                        "buffId": "buff_common_frozen",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 5.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              5.0
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
                        "buffId": "buff_common_frozen",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 5.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              5.0
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
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "EffectAction",
                "IfElseAction"
              ],
              "combatActions": [
                "IfElseAction"
              ],
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
              "actionIndex": 8,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_common_cryst_triggered_start",
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
            "buff_common_cryst_triggered_start"
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
                  "actionIndex": 8,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_common_cryst_triggered_start",
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
                        "buffId": "buff_common_cryst_triggered_start",
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
            "StoreAttributeValue",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 10,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_common_cryst_triggered_fx",
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
            "buff_common_cryst_triggered_fx"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "StoreAttributeValue",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 10,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_common_cryst_triggered_fx",
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
                  "serverActionIndex": 9,
                  "storeAttributeValue": {
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "attributeKind": "specific",
                    "attributeKey": "cryoAbnormalDamageIncrease",
                    "stage": "finalNonConverted",
                    "useFloor": false,
                    "divisor": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "multiplier": {
                      "value": 1.0,
                      "blackboardKey": "phy_dmg_up",
                      "levelValues": [
                        0.2
                      ]
                    },
                    "base": {
                      "value": 1.0,
                      "blackboardKey": "phy_dmg_up",
                      "levelValues": [
                        0.2
                      ]
                    },
                    "outputKey": "final_phy_dmg_up"
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                },
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
                  "serverActionIndex": 10,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_common_cryst_triggered_fx",
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
        "spritePath": "icon_battle_frozen",
        "showInHeadBarCommon": true,
        "showInHeadBarAttached": false,
        "showInSquadIcon": false,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "SpellAbnormal",
        "abnormalColorType": "Cryst",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "AttachedAndAbnormal"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_common_cryst_triggered_fx",
      "sourceFile": "buff_common_cryst_triggered_fx.json",
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
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_common_cryst_triggered_start",
      "sourceFile": "buff_common_cryst_triggered_start.json",
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
        "stackingKey": "cryst_triggered",
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
      "buffId": "buff_common_do_frozen",
      "sourceFile": "buff_common_do_frozen.json",
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
          "value": 9999.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        -717418722,
        889346577
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
            "TimeDilationAction"
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
                "TimeDilationAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "TimeDilationAction",
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
                  "timeDilation": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 0,
                    "kind": "normal",
                    "priority": -361293424,
                    "scope": "entity",
                    "slot": -1855252810,
                    "duration": {
                      "value": 0.0,
                      "blackboardKey": "duration",
                      "levelValues": [
                        9999.0
                      ]
                    },
                    "namedCurve": null,
                    "inlineCurve": [
                      {
                        "time": 0.0,
                        "value": 0.0,
                        "inTangent": 0.0,
                        "outTangent": 0.0,
                        "weightedMode": 0,
                        "inWeight": 0.0,
                        "outWeight": 0.333333343
                      },
                      {
                        "time": 1.0,
                        "value": 0.0,
                        "inTangent": 0.0,
                        "outTangent": 0.0,
                        "weightedMode": 0,
                        "inWeight": 0.333333343,
                        "outWeight": 0.0
                      }
                    ],
                    "finishByAction": true,
                    "ignoredTargets": [],
                    "targets": [
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
      "buffId": "buff_common_frozen",
      "sourceFile": "buff_common_frozen.json",
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
          "value": 9999.0,
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
            "ForceTriggerWeakness"
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
                "ForceTriggerWeakness"
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
          "event": "DuringBuffEnable",
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
                    "buffId": "buff_common_do_frozen",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
                        "levelValues": [
                          9999.0
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
            "buff_common_do_frozen"
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
                        "buffId": "buff_common_do_frozen",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              9999.0
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
                        "buffId": "buff_common_do_frozen",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              9999.0
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
    }
  ],
  "skills": [
    {
      "key": "basicAttack1",
      "skillId": "chr_0014_aurora_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0014_aurora_attack1.json",
      "timelineBlockFrames": 32,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 19,
      "allowNextWindows": [
        {
          "startFrame": 32,
          "endFrame": 47,
          "skillIds": [
            "chr_0014_aurora_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 47,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0014_aurora_attack2",
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
          "endFrame": 111,
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
          "startFrame": 0,
          "endFrame": 111,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionTypes": [
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "HitStopAction",
            "ObtainCostAction",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 22,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 73,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 73,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 73,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 49,
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
          "endFrame": 106,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 106,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 46,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 47,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 47,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 4,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
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
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 4
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[4]",
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 8,
              "nestedCondition": {
                "startFrame": 19,
                "endFrame": 20,
                "actionIndex": 8,
                "actionPath": [
                  "timelineActions[4]",
                  "_sequenceActionData",
                  "actionData",
                  "[2]",
                  "succeedActions",
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
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[4]",
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
          "value": 0.42,
          "isDynamic": false
        },
        {
          "key": "env_dmg",
          "value": 20.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale",
        "env_dmg"
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
          "key": "env_dmg",
          "declaredInSkill": true,
          "suppliedByPatch": false,
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
          "startFrame": 19,
          "endFrame": 20,
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
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[4]",
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 8,
              "nestedCondition": {
                "startFrame": 19,
                "endFrame": 20,
                "actionIndex": 8,
                "actionPath": [
                  "timelineActions[4]",
                  "_sequenceActionData",
                  "actionData",
                  "[2]",
                  "succeedActions",
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
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[4]",
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
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "basicAttack2",
      "skillId": "chr_0014_aurora_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0014_aurora_attack2.json",
      "timelineBlockFrames": 28,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 19,
      "allowNextWindows": [
        {
          "startFrame": 28,
          "endFrame": 43,
          "skillIds": [
            "chr_0014_aurora_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 43,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0014_aurora_attack3",
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
          "endFrame": 110,
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
          "startFrame": 0,
          "endFrame": 110,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "ObtainCostAction",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 22,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 57,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 63,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 67,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 31,
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
          "endFrame": 110,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 110,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 47,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 51,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
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
          "startFrame": 19,
          "endFrame": 20,
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
                  0.59,
                  0.64,
                  0.7,
                  0.76,
                  0.82,
                  0.88,
                  0.94,
                  0.99,
                  1.05,
                  1.13,
                  1.21,
                  1.32
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
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[4]",
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 8,
              "nestedCondition": {
                "startFrame": 19,
                "endFrame": 20,
                "actionIndex": 8,
                "actionPath": [
                  "timelineActions[4]",
                  "_sequenceActionData",
                  "actionData",
                  "[2]",
                  "succeedActions",
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
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[2]"
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
            0.59,
            0.64,
            0.7,
            0.76,
            0.82,
            0.88,
            0.94,
            0.99,
            1.05,
            1.13,
            1.21,
            1.32
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
          "value": 0.42,
          "isDynamic": false
        },
        {
          "key": "env_dmg",
          "value": 25.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale",
        "env_dmg"
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
          "key": "env_dmg",
          "declaredInSkill": true,
          "suppliedByPatch": false,
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
          "startFrame": 19,
          "endFrame": 20,
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
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[4]",
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 8,
              "nestedCondition": {
                "startFrame": 19,
                "endFrame": 20,
                "actionIndex": 8,
                "actionPath": [
                  "timelineActions[4]",
                  "_sequenceActionData",
                  "actionData",
                  "[2]",
                  "succeedActions",
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
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[2]"
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
      "skillId": "chr_0014_aurora_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0014_aurora_attack3.json",
      "timelineBlockFrames": 61,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 39,
      "allowNextWindows": [
        {
          "startFrame": 61,
          "endFrame": 75,
          "skillIds": [
            "chr_0014_aurora_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 75,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0014_aurora_attack1",
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
          "endFrame": 131,
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
          "endFrame": 131,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 26,
          "actionTypes": [
            "CheckEntityNum",
            "CustomRootMotionAction"
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
          "startFrame": 22,
          "endFrame": 23,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 24,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 25,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 26,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 27,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 39,
          "endFrame": 40,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 41,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 41,
          "endFrame": 42,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 42,
          "endFrame": 43,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionTypes": [
            "SimpleCalcBBAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 39,
          "endFrame": 39,
          "actionTypes": [
            "SimpleCalcBBAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "DoOnceAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 25,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 39,
          "endFrame": 42,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 65,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 131,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 131,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 75,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 50,
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
          "endFrame": 75,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 61,
          "endFrame": 75,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 33,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 86,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 37,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 39,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 26,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 33,
          "endFrame": 43,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionIndex": 17,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale1",
                "levelValues": null
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 14
        },
        {
          "startFrame": 39,
          "endFrame": 39,
          "actionIndex": 27,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale2",
                "levelValues": null
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
                "value": 20.0,
                "blackboardKey": "poise",
                "levelValues": [
                  23.0,
                  23.0,
                  23.0,
                  23.0,
                  23.0,
                  23.0,
                  23.0,
                  23.0,
                  23.0,
                  23.0,
                  23.0,
                  23.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 15
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 39,
          "endFrame": 39,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[15]",
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 31,
              "nestedCondition": {
                "startFrame": 39,
                "endFrame": 39,
                "actionIndex": 31,
                "actionPath": [
                  "timelineActions[15]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "succeedActions",
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
                    "actionType": "DoOnceAction",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[15]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 35,
                    "onceScopeKey": "do-once:timelineActions[15]._sequenceActionData.actionData.[3].succeedActions.actionData.[0].succeedActions.actionData.[2]",
                    "onceActions": [
                      {
                        "actionType": "ObtainCostAction",
                        "actionIndex": 0,
                        "actionPath": [
                          "timelineActions[15]",
                          "_sequenceActionData",
                          "actionData",
                          "[3]",
                          "succeedActions",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[2]",
                          "sequenceActionData",
                          "actionData",
                          "[0]"
                        ],
                        "serverActionIndex": 36,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "resourceGain": {
                          "resource": "sp",
                          "amount": {
                            "value": 0.0,
                            "blackboardKey": "atb",
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
      "blackboardCalculations": [
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionIndex": 16,
          "key": "atk_scale1",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atk_scale",
            "levelValues": [
              1.0,
              1.1,
              1.2,
              1.3,
              1.4,
              1.5,
              1.6,
              1.7,
              1.8,
              1.93,
              2.08,
              2.25
            ]
          },
          "right": {
            "value": 0.4,
            "blackboardKey": null,
            "levelValues": null
          },
          "addend": null,
          "sequenceIndex": 14
        },
        {
          "startFrame": 39,
          "endFrame": 39,
          "actionIndex": 26,
          "key": "atk_scale2",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atk_scale",
            "levelValues": [
              1.0,
              1.1,
              1.2,
              1.3,
              1.4,
              1.5,
              1.6,
              1.7,
              1.8,
              1.93,
              2.08,
              2.25
            ]
          },
          "right": {
            "value": 0.6,
            "blackboardKey": null,
            "levelValues": null
          },
          "addend": null,
          "sequenceIndex": 15
        }
      ],
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
          "atk_scale": [
            1.0,
            1.1,
            1.2,
            1.3,
            1.4,
            1.5,
            1.6,
            1.7,
            1.8,
            1.93,
            2.08,
            2.25
          ],
          "poise": [
            23.0,
            23.0,
            23.0,
            23.0,
            23.0,
            23.0,
            23.0,
            23.0,
            23.0,
            23.0,
            23.0,
            23.0
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
          "value": 0.42,
          "isDynamic": false
        },
        {
          "key": "atk_scale1",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_scale2",
          "value": 0.8,
          "isDynamic": true
        },
        {
          "key": "env_dmg",
          "value": 25.0,
          "isDynamic": false
        },
        {
          "key": "env_dmg2",
          "value": 30.0,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 20.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale",
        "atk_scale1",
        "atk_scale2",
        "env_dmg",
        "env_dmg2",
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
          "key": "atk_scale1",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": true,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": true,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "env_dmg",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "env_dmg2",
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
        },
        {
          "startFrame": 22,
          "endFrame": 23,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[5]",
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
          "startFrame": 23,
          "endFrame": 24,
          "actionIndex": 7,
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
          "startFrame": 24,
          "endFrame": 25,
          "actionIndex": 8,
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
        },
        {
          "startFrame": 25,
          "endFrame": 26,
          "actionIndex": 9,
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
        },
        {
          "startFrame": 26,
          "endFrame": 27,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[9]",
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
          "startFrame": 39,
          "endFrame": 40,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[10]",
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
          "startFrame": 40,
          "endFrame": 41,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[11]",
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
          "startFrame": 41,
          "endFrame": 42,
          "actionIndex": 13,
          "actionPath": [
            "timelineActions[12]",
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
          "startFrame": 42,
          "endFrame": 43,
          "actionIndex": 14,
          "actionPath": [
            "timelineActions[13]",
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
          "startFrame": 39,
          "endFrame": 39,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[15]",
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 31,
              "nestedCondition": {
                "startFrame": 39,
                "endFrame": 39,
                "actionIndex": 31,
                "actionPath": [
                  "timelineActions[15]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "succeedActions",
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
                    "actionType": "DoOnceAction",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[15]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 35,
                    "onceScopeKey": "do-once:timelineActions[15]._sequenceActionData.actionData.[3].succeedActions.actionData.[0].succeedActions.actionData.[2]",
                    "onceActions": [
                      {
                        "actionType": "ObtainCostAction",
                        "actionIndex": 0,
                        "actionPath": [
                          "timelineActions[15]",
                          "_sequenceActionData",
                          "actionData",
                          "[3]",
                          "succeedActions",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[2]",
                          "sequenceActionData",
                          "actionData",
                          "[0]"
                        ],
                        "serverActionIndex": 36,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "resourceGain": {
                          "resource": "sp",
                          "amount": {
                            "value": 0.0,
                            "blackboardKey": "atb",
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
      "skillId": "chr_0014_aurora_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0014_aurora_power_attack.json",
      "timelineBlockFrames": 41,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 41,
          "endFrame": 75,
          "skillIds": [
            "chr_0014_aurora_normal_skill",
            "chr_0014_aurora_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 75,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0014_aurora_normal_skill",
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
              "skillId": "chr_0014_aurora_combo_skill",
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
          "endFrame": 133,
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
          "endFrame": 133,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 36,
          "actionTypes": [
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 41,
          "endFrame": 43,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 41,
          "endFrame": 43,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "GainBreakingAttackAtb",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 11,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 39,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 39,
          "endFrame": 42,
          "actionTypes": [
            "CameraImpulseAction"
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
          "startFrame": 39,
          "endFrame": 42,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 43,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 63,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 102,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 72,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 76,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 89,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 62,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 95,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 41,
          "endFrame": 75,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 136,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 136,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 59,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 47,
          "actionTypes": [
            "VoiceTriggerAction"
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
          "startFrame": 42,
          "endFrame": 76,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 41,
          "endFrame": 43,
          "actionIndex": 5,
          "damageUnits": [
            {
              "damageType": "Physical",
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
          "sequenceIndex": 5
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionIndex": 39,
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
          "sequenceIndex": 22,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionIndex": 40,
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
          "sequenceIndex": 23,
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
          "value": 0.42,
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
          "startFrame": 41,
          "endFrame": 43,
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
      "skillId": "chr_0014_aurora_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0014_aurora_plunging_attack_end.json",
      "timelineBlockFrames": 21,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 2,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 2,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
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
          "startFrame": 0,
          "endFrame": 38,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 80,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 80,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 23,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 1,
          "endFrame": 2,
          "actionIndex": 2,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
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
          "endFrame": 2,
          "actionIndex": 5,
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
          "value": 0.42,
          "isDynamic": false
        },
        {
          "key": "env_dmg",
          "value": 20.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale",
        "env_dmg"
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
          "key": "env_dmg",
          "declaredInSkill": true,
          "suppliedByPatch": false,
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
          "endFrame": 2,
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
      "skillId": "chr_0014_aurora_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0014_aurora_normal_skill.json",
      "timelineBlockFrames": 135,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 135,
          "endFrame": 145,
          "skillIds": [
            "chr_0014_aurora_normal_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 131,
          "endFrame": 145,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0014_aurora_normal_skill",
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
          "endFrame": 20,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 51,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 51,
          "endFrame": 107,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 208,
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
          "endFrame": 3,
          "actionTypes": [
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 5,
          "actionTypes": [
            "CheckSquadInFight",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 67,
          "endFrame": 70,
          "actionTypes": [
            "MarkCanInterrupt"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 109,
          "actionTypes": [
            "CheckSquadInFight",
            "CreateBuffAction",
            "IfElseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 106,
          "endFrame": 107,
          "actionTypes": [
            "InterruptCurSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 110,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "SelfRotateAction",
            "ConvertToTargetContext",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 122,
          "endFrame": 128,
          "actionTypes": [
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 20,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 51,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 51,
          "endFrame": 107,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 208,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionTypes": [
            "AuraAction",
            "IfElseAction",
            "AuraAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionTypes": [
            "CreateAdditionalBattleShape"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionTypes": [
            "EventListenerAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 121,
          "actionTypes": [
            "CameraImpulseAction",
            "AddCameraControlStateAction",
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 121,
          "endFrame": 151,
          "actionTypes": [
            "AddCameraControlStateAction",
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 108,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 125,
          "endFrame": 127,
          "actionTypes": [
            "ContinuousFindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 108,
          "actionTypes": [
            "CreateBuffAction",
            "InterruptAction",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 125,
          "endFrame": 125,
          "actionTypes": [
            "SpellInfliction",
            "DoOnceAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 131,
          "endFrame": 145,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 135,
          "endFrame": 145,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 110,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 110,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 125,
          "actionTypes": [
            "AuraAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 56,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 58,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 60,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 132,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 154,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 137,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 120,
          "endFrame": 182,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 182,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 65,
          "endFrame": 106,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 156,
          "endFrame": 197,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 74,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 74,
          "endFrame": 107,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 176,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 176,
          "endFrame": 208,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 65,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 65,
          "endFrame": 107,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 107,
          "endFrame": 157,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 157,
          "endFrame": 208,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 55,
          "endFrame": 160,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 88,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 155,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 108,
          "endFrame": 196,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 133,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 107,
          "endFrame": 108,
          "actionIndex": 83,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.01,
                "blackboardKey": null,
                "levelValues": null
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4352
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 24
        },
        {
          "startFrame": 125,
          "endFrame": 125,
          "actionIndex": 89,
          "damageUnits": [
            {
              "damageType": "Cryst",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
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
                "value": 30.0,
                "blackboardKey": "poise",
                "levelValues": [
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
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 25
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 107,
          "endFrame": 109,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[8]",
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
                "blackboardKey": "talent_2_sup",
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
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 22,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "ultimateEnergy",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "talent_2_sup",
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
          "startFrame": 107,
          "endFrame": 110,
          "actionIndex": 25,
          "actionPath": [
            "timelineActions[11]",
            "_sequenceActionData",
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
                  "targetSource": "Context",
                  "targetGroupKey": "Attacker",
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
                "distance": 3.5,
                "lessThan": false,
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
              "actionType": "IfElseAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 30,
              "nestedCondition": {
                "startFrame": 107,
                "endFrame": 110,
                "actionIndex": 30,
                "actionPath": [
                  "timelineActions[11]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "succeedActions",
                  "actionData",
                  "[3]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckTargetAngle",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": null,
                    "targetAngle": {
                      "origin": {
                        "targetSource": "Context",
                        "targetGroupKey": "HitTar",
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
                      "angleType": "TargetForward",
                      "angle": {
                        "value": 180.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
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
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 32,
                    "blackboardMutation": {
                      "key": "is_cam",
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
                "failActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 33,
                    "blackboardMutation": {
                      "key": "is_cam",
                      "operation": "Assign",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
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
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 34,
              "nestedCondition": {
                "startFrame": 107,
                "endFrame": 110,
                "actionIndex": 34,
                "actionPath": [
                  "timelineActions[11]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckTargetAngle",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": null,
                    "targetAngle": {
                      "origin": {
                        "targetSource": "Context",
                        "targetGroupKey": "Attacker",
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
                      "angleType": "TargetForward",
                      "angle": {
                        "value": 180.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
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
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 38,
                    "blackboardMutation": {
                      "key": "is_cam",
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
                "failActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 41,
                    "blackboardMutation": {
                      "key": "is_cam",
                      "operation": "Assign",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
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
            }
          ],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionIndex": 48,
          "actionPath": [
            "timelineActions[17]",
            "_sequenceActionData",
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
                "blackboardKey": "potential_1",
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
              "actionType": "AuraAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[17]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 50,
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
          "startFrame": 125,
          "endFrame": 125,
          "actionIndex": 87,
          "actionPath": [
            "timelineActions[25]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [],
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[25]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 88,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "potential_5_atb",
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
          "alwaysNext": false,
          "onceScopeKey": "do-once:timelineActions[25]._sequenceActionData.actionData.[1]"
        }
      ],
      "inflictions": [
        {
          "startFrame": 125,
          "endFrame": 125,
          "actionIndex": 86,
          "element": "cryo",
          "isExtra": false,
          "sequenceIndex": 25
        }
      ],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 5,
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
          "blackboardAssignments": {
            "ratio": {
              "value": 0.5,
              "blackboardKey": null,
              "levelValues": null
            }
          },
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 6,
          "autoFinishByAction": false
        },
        {
          "startFrame": 107,
          "endFrame": 109,
          "actionIndex": 19,
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
          "blackboardAssignments": {
            "ratio": {
              "value": 0.5,
              "blackboardKey": null,
              "levelValues": null
            }
          },
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 8,
          "autoFinishByAction": false
        },
        {
          "startFrame": 107,
          "endFrame": 108,
          "actionIndex": 81,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0014_aurora_reduce_damage",
          "classification": null,
          "targetSource": "Source",
          "targetGroupKey": "",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionSource",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {
            "duration": {
              "value": 1.0,
              "blackboardKey": null,
              "levelValues": null
            },
            "taken_dmg": {
              "value": 0.0,
              "blackboardKey": "taken_dmg",
              "levelValues": [
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9,
                0.9
              ]
            }
          },
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 24,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 14,
          "resource": "sp",
          "amount": {
            "value": 40.0,
            "blackboardKey": "atb_return_base",
            "levelValues": [
              30.0,
              30.0,
              30.0,
              30.0,
              30.0,
              30.0,
              30.0,
              30.0,
              30.0,
              30.0,
              30.0,
              30.0
            ]
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
          "sequenceIndex": 5
        }
      ],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0014_aurora_potential_1_listener",
        "buff_chr_0014_aurora_reduce_damage",
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
          "atb_return_base": [
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0
          ],
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
          "dmg_reduce": [
            0.9,
            0.9,
            0.9,
            0.9,
            0.9,
            0.9,
            0.9,
            0.9,
            0.9,
            0.9,
            0.9,
            0.9
          ],
          "poise": [
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
          "key": "atb_return_base",
          "value": 40.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.42,
          "isDynamic": false
        },
        {
          "key": "is_cam",
          "value": 1.0,
          "isDynamic": true
        },
        {
          "key": "poise",
          "value": 30.0,
          "isDynamic": false
        },
        {
          "key": "potential_1",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5_atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "taken_dmg",
          "value": 0.9,
          "isDynamic": false
        },
        {
          "key": "talent_2_sup",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb_return_base",
        "atk_scale",
        "is_cam",
        "poise",
        "potential_1",
        "potential_5_atb",
        "talent_2_sup"
      ],
      "blackboardProvenance": [
        {
          "key": "atb_return_base",
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
          "key": "dmg_reduce",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "is_cam",
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
          "key": "potential_1",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_5_atb",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "taken_dmg",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_2_sup",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "AuraAction",
        "CreateBuffAction",
        "DamageAction",
        "IfElseAction",
        "ObtainCostAction",
        "SpellInfliction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
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
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[1]"
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
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "failActions",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "TelePosition",
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
          "endFrame": 3,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "failActions",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "TelePosition",
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
          "startFrame": 107,
          "endFrame": 110,
          "actionIndex": 27,
          "actionPath": [
            "timelineActions[11]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]"
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
          "startFrame": 107,
          "endFrame": 108,
          "actionIndex": 79,
          "actionPath": [
            "timelineActions[22]",
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
          "startFrame": 125,
          "endFrame": 127,
          "actionIndex": 80,
          "actionPath": [
            "timelineActions[23]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "tar",
          "producerType": "ContinuousFindTargetAction",
          "finderType": "HitBoxFinder",
          "finderFactionTarget": "Anti",
          "finderTargetObjectType": "Normal",
          "finderCheckAlive": true,
          "validatorTypes": [],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": 0.0333333351,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[4]",
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
          "succeedActions": [],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 8,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 3,
                "actionIndex": 8,
                "actionPath": [
                  "timelineActions[4]",
                  "_sequenceActionData",
                  "actionData",
                  "[2]",
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
                "succeedActions": [
                  {
                    "actionType": "FindTargetAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[4]",
                      "_sequenceActionData",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 10,
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
                      "timelineActions[4]",
                      "_sequenceActionData",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 12,
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
          "startFrame": 107,
          "endFrame": 109,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[8]",
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
                "blackboardKey": "talent_2_sup",
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
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 22,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "ultimateEnergy",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "talent_2_sup",
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
          "startFrame": 107,
          "endFrame": 110,
          "actionIndex": 25,
          "actionPath": [
            "timelineActions[11]",
            "_sequenceActionData",
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
                  "targetSource": "Context",
                  "targetGroupKey": "Attacker",
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
                "distance": 3.5,
                "lessThan": false,
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
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 27,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 30,
              "nestedCondition": {
                "startFrame": 107,
                "endFrame": 110,
                "actionIndex": 30,
                "actionPath": [
                  "timelineActions[11]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "succeedActions",
                  "actionData",
                  "[3]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckTargetAngle",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": null,
                    "targetAngle": {
                      "origin": {
                        "targetSource": "Context",
                        "targetGroupKey": "HitTar",
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
                      "angleType": "TargetForward",
                      "angle": {
                        "value": 180.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
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
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 32,
                    "blackboardMutation": {
                      "key": "is_cam",
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
                "failActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 33,
                    "blackboardMutation": {
                      "key": "is_cam",
                      "operation": "Assign",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
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
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 34,
              "nestedCondition": {
                "startFrame": 107,
                "endFrame": 110,
                "actionIndex": 34,
                "actionPath": [
                  "timelineActions[11]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckTargetAngle",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": null,
                    "targetAngle": {
                      "origin": {
                        "targetSource": "Context",
                        "targetGroupKey": "Attacker",
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
                      "angleType": "TargetForward",
                      "angle": {
                        "value": 180.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
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
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 38,
                    "blackboardMutation": {
                      "key": "is_cam",
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
                "failActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 41,
                    "blackboardMutation": {
                      "key": "is_cam",
                      "operation": "Assign",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
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
            }
          ],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionIndex": 48,
          "actionPath": [
            "timelineActions[17]",
            "_sequenceActionData",
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
                "blackboardKey": "potential_1",
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
              "actionType": "AuraAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[17]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 50,
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
          "startFrame": 125,
          "endFrame": 125,
          "actionIndex": 87,
          "actionPath": [
            "timelineActions[25]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [],
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[25]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 88,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "potential_5_atb",
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
          "alwaysNext": false,
          "onceScopeKey": "do-once:timelineActions[25]._sequenceActionData.actionData.[1]"
        }
      ],
      "auraActions": [
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionIndex": 47,
          "sourceFile": "chr_0014_aurora_normal_skill.json",
          "activationSource": "timeline",
          "activationEvent": null,
          "actionPath": [
            "timelineActions[17]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "priorityLevel": "Default",
          "priorityOffset": 0,
          "debugName": "",
          "auraType": "RangedAura",
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
            "shapeType": "Sphere",
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
            "radius": 3.0,
            "radiusKey": ""
          },
          "excludeColliderOptions": 0,
          "targetObjectType": 0,
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
              "buffId": "buff_chr_0014_aurora_reduce_damage",
              "classification": null,
              "blackboardAssignments": {
                "taken_dmg": {
                  "value": 0.0,
                  "blackboardKey": "taken_dmg",
                  "levelValues": [
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9
                  ]
                },
                "potential_1": {
                  "value": 0.0,
                  "blackboardKey": "potential_1",
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
        },
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionIndex": 50,
          "sourceFile": "chr_0014_aurora_normal_skill.json",
          "activationSource": "timeline",
          "activationEvent": null,
          "actionPath": [
            "timelineActions[17]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "succeedActions",
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
            "shapeType": "Sphere",
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
            "radius": 3.0,
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
              "buffId": "buff_chr_0014_aurora_potential_1_listener",
              "classification": null,
              "blackboardAssignments": {}
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
        },
        {
          "startFrame": 107,
          "endFrame": 125,
          "actionIndex": 101,
          "sourceFile": "chr_0014_aurora_normal_skill.json",
          "activationSource": "timeline",
          "activationEvent": null,
          "actionPath": [
            "timelineActions[30]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "priorityLevel": "Default",
          "priorityOffset": 0,
          "debugName": "",
          "auraType": "RangedAura",
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
            "shapeType": "Sphere",
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
            "radius": 4.0,
            "radiusKey": ""
          },
          "excludeColliderOptions": 0,
          "targetObjectType": 0,
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
              "buffId": "buff_chr_0014_aurora_reduce_damage",
              "classification": null,
              "blackboardAssignments": {
                "taken_dmg": {
                  "value": 0.0,
                  "blackboardKey": "taken_dmg",
                  "levelValues": [
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9,
                    0.9
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
      "physicalInflictions": [],
      "eventListeners": [
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionIndex": 52,
          "priorityLevel": "Default",
          "priorityOffset": 0,
          "event": "OnBeforeTakeDamage",
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckDamageDecorateMask",
                "ConvertToTargetContext",
                "JumpToAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "CheckDamageDecorateMask",
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
                  "serverActionIndex": 53,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 53,
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
                          "checkType": "ExceptAny",
                          "mask": 805306368
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
                        "actionType": "JumpToAction",
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
                        "serverActionIndex": 56,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "timelineJumpDestinationFrame": 107
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
          "sequenceIndex": 19,
          "obtainAtbValueKeys": []
        },
        {
          "startFrame": 0,
          "endFrame": 51,
          "actionIndex": 52,
          "priorityLevel": "Default",
          "priorityOffset": 0,
          "event": "OnAddedBuff",
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckBuffIdInContext",
                "CheckDistanceCondition",
                "ConvertToTargetContext",
                "JumpToAction"
              ],
              "combatActions": [
                "CheckDistanceCondition"
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
                  "serverActionIndex": 57,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 57,
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
                          "checkType": "Id",
                          "buffIds": [
                            "buff_eny_0018_lbtough_pre_catch"
                          ],
                          "queryType": "HasAny"
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
                        "actionType": "CheckDistanceCondition",
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
                        "serverActionIndex": 58,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 58,
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
                                "distance": 3.0,
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
                              "actionType": "JumpToAction",
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
                              "serverActionIndex": 60,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "timelineJumpDestinationFrame": 107
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
          "sequenceIndex": 19,
          "obtainAtbValueKeys": []
        }
      ],
      "timeDilations": [
        {
          "startFrame": 107,
          "endFrame": 110,
          "actionIndex": 100,
          "kind": "normal",
          "priority": -2059842104,
          "scope": "entity",
          "slot": 1464849466,
          "duration": {
            "value": 0.7,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": null,
          "inlineCurve": [
            {
              "time": 0.0,
              "value": 0.3,
              "inTangent": 0.0,
              "outTangent": 0.0,
              "weightedMode": 0,
              "inWeight": 0.0,
              "outWeight": 0.333333343
            },
            {
              "time": 0.5,
              "value": 0.3,
              "inTangent": 0.0,
              "outTangent": 0.0,
              "weightedMode": 0,
              "inWeight": 0.333333343,
              "outWeight": 0.333333343
            },
            {
              "time": 1.0,
              "value": 1.0,
              "inTangent": 4.596606,
              "outTangent": 4.596606,
              "weightedMode": 0,
              "inWeight": 0.0243593454,
              "outWeight": 0.0
            }
          ],
          "finishByAction": false,
          "ignoredTargets": [],
          "targets": [
            "caster"
          ],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 29,
          "effectAbilityEntityTargets": [
            {
              "reference": {
                "targetSource": "Context",
                "targetGroupKey": "tar",
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
              "spawnedObjectType": null,
              "tagQueries": []
            }
          ]
        }
      ],
      "intervalDamageHits": [],
      "timelineJumps": [
        {
          "startFrame": 0,
          "endFrame": 51,
          "destFrame": 107,
          "actionIndex": 56,
          "actionPath": [
            "timelineActions[19]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "abilityActionMap",
            "[0]",
            "actions",
            "[0]",
            "actionData",
            "[3]"
          ],
          "conditionActionTypes": [],
          "directConditions": [],
          "directConditionNegated": [],
          "directAnyConditions": [],
          "directAnyConditionNegated": [],
          "directConditionsSupported": false,
          "isOnlySequenceAction": false,
          "isOnlyBranchAction": false,
          "isRootContainerOnlySequenceAction": true,
          "sequenceIndex": 19
        },
        {
          "startFrame": 0,
          "endFrame": 51,
          "destFrame": 107,
          "actionIndex": 60,
          "actionPath": [
            "timelineActions[19]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "abilityActionMap",
            "[1]",
            "actions",
            "[0]",
            "actionData",
            "[3]"
          ],
          "conditionActionTypes": [],
          "directConditions": [],
          "directConditionNegated": [],
          "directAnyConditions": [],
          "directAnyConditionNegated": [],
          "directConditionsSupported": false,
          "isOnlySequenceAction": false,
          "isOnlyBranchAction": false,
          "isRootContainerOnlySequenceAction": true,
          "sequenceIndex": 19
        }
      ],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": [
        {
          "startFrame": 106,
          "endFrame": 107,
          "actionIndex": 23,
          "sequenceIndex": 9
        }
      ]
    },
    {
      "key": "comboSkill",
      "skillId": "chr_0014_aurora_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0014_aurora_combo_skill.json",
      "timelineBlockFrames": 15,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 15,
          "endFrame": 60,
          "skillIds": [
            "chr_0014_aurora_normal_skill"
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
              "skillId": "chr_0014_aurora_normal_skill",
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
          "endFrame": 123,
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
            "Selector"
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
          "endFrame": 123,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "SelfRotateAction",
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 15,
          "actionTypes": [
            "CreateBuffAction",
            "ObtainCostAction",
            "FindTargetAction",
            "Selector",
            "LaunchProjectile"
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
          "startFrame": 11,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 11,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 55,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 13,
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
          "endFrame": 17,
          "actionTypes": [
            "OverrideCameraFollowAction"
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
          "startFrame": 15,
          "endFrame": 60,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 0,
          "endFrame": 123,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 123,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 44,
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
          "startFrame": 12,
          "endFrame": 27,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 12,
          "endFrame": 15,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[4]",
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
              "actionType": "LaunchProjectile",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 18,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0014_aurora_combo_skill_bear_out",
                "skillTriggers": [
                  {
                    "event": "reach",
                    "skillId": "chr_0014_aurora_combo_skill_bear_gene"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "BearPos",
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
                  "launchFrame": 12,
                  "actionOrder": [
                    15,
                    1
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0014_aurora_combo_skill_bear_out",
                  "triggerEvent": "reach",
                  "triggerSkillId": "chr_0014_aurora_combo_skill_bear_gene",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0014_aurora_combo_skill_bear_gene.json",
                  "damageUnits": [],
                  "directDamageHits": [],
                  "conditionalActions": [],
                  "auxiliaryActions": [
                    {
                      "startFrame": 0,
                      "endFrame": 2,
                      "actionIndex": 0,
                      "actionType": "SpawnAbilityEntity",
                      "sourceId": "abilityentity_chr_0014_aurora_combo_skill:chr_0014_aurora_combo_skill_abilityrange",
                      "classification": null,
                      "targetSource": "",
                      "targetGroupKey": "",
                      "count": null,
                      "buffSource": null,
                      "inheritSourceSkillCastInfo": null,
                      "blackboardAssignments": {},
                      "nestedCombatActions": [
                        "AuraAction"
                      ],
                      "buffSourceContextKey": null,
                      "sequenceIndex": 0,
                      "autoFinishByAction": null
                    }
                  ],
                  "resourceGains": [],
                  "inflictions": [],
                  "combatActions": [
                    "SpawnAbilityEntity"
                  ],
                  "cycleTruncated": false,
                  "nestedProjectileTriggeredSkills": [],
                  "abilityEntityHits": [
                    {
                      "spawnFrame": 12,
                      "actionOrder": [
                        15,
                        1,
                        0
                      ],
                      "abilityEntityId": "abilityentity_chr_0014_aurora_combo_skill",
                      "skillId": "chr_0014_aurora_combo_skill_abilityrange",
                      "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                      "entityBlackboardAssignments": [],
                      "spawnPayload": {
                        "abilityEntityId": "abilityentity_chr_0014_aurora_combo_skill",
                        "skillId": "chr_0014_aurora_combo_skill_abilityrange",
                        "entityBlackboardAssignments": [],
                        "assignBlackboard": true,
                        "sourceType": "ActionSource",
                        "sourceContextKey": "",
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
                        "overrideDuration": null,
                        "saveToContextKey": null,
                        "dieWhenSourceDies": false,
                        "dieOnEnd": false
                      },
                      "directDamageHits": [],
                      "intervalDamageHits": [],
                      "explicitFinishes": [
                        {
                          "startFrame": 90,
                          "endFrame": 93,
                          "actionIndex": 9,
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
                          "skipDieDisplay": false,
                          "sequenceIndex": 7
                        }
                      ],
                      "timelineJumps": [],
                      "conditionalActions": [],
                      "inflictions": [],
                      "auxiliaryActions": [],
                      "resourceGains": [],
                      "projectileLaunches": [],
                      "projectileTriggeredSkills": [],
                      "nestedAbilityEntityHits": [],
                      "combatActions": [
                        "AuraAction"
                      ],
                      "cycleTruncated": false,
                      "inheritsSourceBlackboard": true,
                      "declaredBlackboard": [
                        {
                          "key": "duration",
                          "value": 0.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_scale",
                          "value": 1.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_scale_loop",
                          "value": 1.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_static_value",
                          "value": 0.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_static_value_loop",
                          "value": 0.0,
                          "isDynamic": false
                        },
                        {
                          "key": "interval",
                          "value": 0.0,
                          "isDynamic": false
                        }
                      ],
                      "blackboardCalculations": [],
                      "blackboardMutations": [],
                      "buffBlackboardReads": [],
                      "buffFinishes": [],
                      "auraActions": [
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 5,
                          "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                          "activationSource": "timeline",
                          "activationEvent": null,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]"
                          ],
                          "priorityLevel": "Default",
                          "priorityOffset": 0,
                          "debugName": "aurora_combo_skill",
                          "auraType": "RangedAura",
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
                            "shapeType": "Sphere",
                            "rotationOffset": {
                              "x": 0.0,
                              "y": 0.0,
                              "z": 0.0
                            },
                            "useExtentKeys": false,
                            "extent": {
                              "x": 2.0,
                              "y": 2.0,
                              "z": 10.0
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
                            "radius": 3.0,
                            "radiusKey": ""
                          },
                          "excludeColliderOptions": 0,
                          "targetObjectType": 0,
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
                          "excludeOwner": true,
                          "includeUnmarkable": false,
                          "limitInfluenceCountPerTarget": true,
                          "maxInfluenceCountPerTarget": 1,
                          "buffSource": "ActionSource",
                          "buffs": [
                            {
                              "buffId": "buff_chr_0014_aurora_combo_skill_heal",
                              "classification": null,
                              "blackboardAssignments": {
                                "heal_scale": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_scale",
                                  "levelValues": [
                                    0.22,
                                    0.27,
                                    0.31,
                                    0.36,
                                    0.38,
                                    0.4,
                                    0.43,
                                    0.45,
                                    0.47,
                                    0.48,
                                    0.49,
                                    0.5
                                  ]
                                },
                                "heal_static_value": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_static_value",
                                  "levelValues": [
                                    96.0,
                                    115.2,
                                    134.4,
                                    153.6,
                                    163.2,
                                    172.8,
                                    182.4,
                                    192.0,
                                    201.6,
                                    206.4,
                                    211.2,
                                    216.0
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
                        },
                        {
                          "startFrame": 0,
                          "endFrame": 900,
                          "actionIndex": 6,
                          "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                          "activationSource": "timeline",
                          "activationEvent": null,
                          "actionPath": [
                            "timelineActions[6]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]"
                          ],
                          "priorityLevel": "Default",
                          "priorityOffset": 0,
                          "debugName": "aurora_combo_skill",
                          "auraType": "RangedAura",
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
                            "shapeType": "Sphere",
                            "rotationOffset": {
                              "x": 0.0,
                              "y": 0.0,
                              "z": 0.0
                            },
                            "useExtentKeys": false,
                            "extent": {
                              "x": 2.0,
                              "y": 2.0,
                              "z": 10.0
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
                            "radius": 3.0,
                            "radiusKey": ""
                          },
                          "excludeColliderOptions": 0,
                          "targetObjectType": 0,
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
                          "excludeOwner": true,
                          "includeUnmarkable": false,
                          "limitInfluenceCountPerTarget": false,
                          "maxInfluenceCountPerTarget": 1,
                          "buffSource": "ActionSource",
                          "buffs": [
                            {
                              "buffId": "buff_chr_0014_aurora_combo_skill_heal_loop",
                              "classification": null,
                              "blackboardAssignments": {
                                "heal_scale_loop": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_scale_loop",
                                  "levelValues": [
                                    0.06,
                                    0.07,
                                    0.08,
                                    0.09,
                                    0.1,
                                    0.1,
                                    0.11,
                                    0.11,
                                    0.12,
                                    0.12,
                                    0.12,
                                    0.13
                                  ]
                                },
                                "heal_static_value_loop": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_static_value_loop",
                                  "levelValues": [
                                    24.0,
                                    28.8,
                                    33.6,
                                    38.4,
                                    40.8,
                                    43.2,
                                    45.6,
                                    48.0,
                                    50.4,
                                    51.6,
                                    52.8,
                                    54.0
                                  ]
                                },
                                "duration": {
                                  "value": 0.0,
                                  "blackboardKey": "duration",
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
                                "interval": {
                                  "value": 0.0,
                                  "blackboardKey": "interval",
                                  "levelValues": [
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5
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
                      "presentationOnlySwitchActionIndexes": []
                    }
                  ],
                  "auraActions": []
                }
              ]
            }
          ],
          "failActions": [
            {
              "actionType": "LaunchProjectile",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 21,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0014_aurora_combo_skill_bear_out",
                "skillTriggers": [
                  {
                    "event": "reach",
                    "skillId": "chr_0014_aurora_combo_skill_bear_gene"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "BearPos",
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
                  "launchFrame": 12,
                  "actionOrder": [
                    15,
                    2
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0014_aurora_combo_skill_bear_out",
                  "triggerEvent": "reach",
                  "triggerSkillId": "chr_0014_aurora_combo_skill_bear_gene",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0014_aurora_combo_skill_bear_gene.json",
                  "damageUnits": [],
                  "directDamageHits": [],
                  "conditionalActions": [],
                  "auxiliaryActions": [
                    {
                      "startFrame": 0,
                      "endFrame": 2,
                      "actionIndex": 0,
                      "actionType": "SpawnAbilityEntity",
                      "sourceId": "abilityentity_chr_0014_aurora_combo_skill:chr_0014_aurora_combo_skill_abilityrange",
                      "classification": null,
                      "targetSource": "",
                      "targetGroupKey": "",
                      "count": null,
                      "buffSource": null,
                      "inheritSourceSkillCastInfo": null,
                      "blackboardAssignments": {},
                      "nestedCombatActions": [
                        "AuraAction"
                      ],
                      "buffSourceContextKey": null,
                      "sequenceIndex": 0,
                      "autoFinishByAction": null
                    }
                  ],
                  "resourceGains": [],
                  "inflictions": [],
                  "combatActions": [
                    "SpawnAbilityEntity"
                  ],
                  "cycleTruncated": false,
                  "nestedProjectileTriggeredSkills": [],
                  "abilityEntityHits": [
                    {
                      "spawnFrame": 12,
                      "actionOrder": [
                        15,
                        2,
                        0
                      ],
                      "abilityEntityId": "abilityentity_chr_0014_aurora_combo_skill",
                      "skillId": "chr_0014_aurora_combo_skill_abilityrange",
                      "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                      "entityBlackboardAssignments": [],
                      "spawnPayload": {
                        "abilityEntityId": "abilityentity_chr_0014_aurora_combo_skill",
                        "skillId": "chr_0014_aurora_combo_skill_abilityrange",
                        "entityBlackboardAssignments": [],
                        "assignBlackboard": true,
                        "sourceType": "ActionSource",
                        "sourceContextKey": "",
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
                        "overrideDuration": null,
                        "saveToContextKey": null,
                        "dieWhenSourceDies": false,
                        "dieOnEnd": false
                      },
                      "directDamageHits": [],
                      "intervalDamageHits": [],
                      "explicitFinishes": [
                        {
                          "startFrame": 90,
                          "endFrame": 93,
                          "actionIndex": 9,
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
                          "skipDieDisplay": false,
                          "sequenceIndex": 7
                        }
                      ],
                      "timelineJumps": [],
                      "conditionalActions": [],
                      "inflictions": [],
                      "auxiliaryActions": [],
                      "resourceGains": [],
                      "projectileLaunches": [],
                      "projectileTriggeredSkills": [],
                      "nestedAbilityEntityHits": [],
                      "combatActions": [
                        "AuraAction"
                      ],
                      "cycleTruncated": false,
                      "inheritsSourceBlackboard": true,
                      "declaredBlackboard": [
                        {
                          "key": "duration",
                          "value": 0.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_scale",
                          "value": 1.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_scale_loop",
                          "value": 1.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_static_value",
                          "value": 0.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_static_value_loop",
                          "value": 0.0,
                          "isDynamic": false
                        },
                        {
                          "key": "interval",
                          "value": 0.0,
                          "isDynamic": false
                        }
                      ],
                      "blackboardCalculations": [],
                      "blackboardMutations": [],
                      "buffBlackboardReads": [],
                      "buffFinishes": [],
                      "auraActions": [
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 5,
                          "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                          "activationSource": "timeline",
                          "activationEvent": null,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]"
                          ],
                          "priorityLevel": "Default",
                          "priorityOffset": 0,
                          "debugName": "aurora_combo_skill",
                          "auraType": "RangedAura",
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
                            "shapeType": "Sphere",
                            "rotationOffset": {
                              "x": 0.0,
                              "y": 0.0,
                              "z": 0.0
                            },
                            "useExtentKeys": false,
                            "extent": {
                              "x": 2.0,
                              "y": 2.0,
                              "z": 10.0
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
                            "radius": 3.0,
                            "radiusKey": ""
                          },
                          "excludeColliderOptions": 0,
                          "targetObjectType": 0,
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
                          "excludeOwner": true,
                          "includeUnmarkable": false,
                          "limitInfluenceCountPerTarget": true,
                          "maxInfluenceCountPerTarget": 1,
                          "buffSource": "ActionSource",
                          "buffs": [
                            {
                              "buffId": "buff_chr_0014_aurora_combo_skill_heal",
                              "classification": null,
                              "blackboardAssignments": {
                                "heal_scale": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_scale",
                                  "levelValues": [
                                    0.22,
                                    0.27,
                                    0.31,
                                    0.36,
                                    0.38,
                                    0.4,
                                    0.43,
                                    0.45,
                                    0.47,
                                    0.48,
                                    0.49,
                                    0.5
                                  ]
                                },
                                "heal_static_value": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_static_value",
                                  "levelValues": [
                                    96.0,
                                    115.2,
                                    134.4,
                                    153.6,
                                    163.2,
                                    172.8,
                                    182.4,
                                    192.0,
                                    201.6,
                                    206.4,
                                    211.2,
                                    216.0
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
                        },
                        {
                          "startFrame": 0,
                          "endFrame": 900,
                          "actionIndex": 6,
                          "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                          "activationSource": "timeline",
                          "activationEvent": null,
                          "actionPath": [
                            "timelineActions[6]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]"
                          ],
                          "priorityLevel": "Default",
                          "priorityOffset": 0,
                          "debugName": "aurora_combo_skill",
                          "auraType": "RangedAura",
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
                            "shapeType": "Sphere",
                            "rotationOffset": {
                              "x": 0.0,
                              "y": 0.0,
                              "z": 0.0
                            },
                            "useExtentKeys": false,
                            "extent": {
                              "x": 2.0,
                              "y": 2.0,
                              "z": 10.0
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
                            "radius": 3.0,
                            "radiusKey": ""
                          },
                          "excludeColliderOptions": 0,
                          "targetObjectType": 0,
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
                          "excludeOwner": true,
                          "includeUnmarkable": false,
                          "limitInfluenceCountPerTarget": false,
                          "maxInfluenceCountPerTarget": 1,
                          "buffSource": "ActionSource",
                          "buffs": [
                            {
                              "buffId": "buff_chr_0014_aurora_combo_skill_heal_loop",
                              "classification": null,
                              "blackboardAssignments": {
                                "heal_scale_loop": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_scale_loop",
                                  "levelValues": [
                                    0.06,
                                    0.07,
                                    0.08,
                                    0.09,
                                    0.1,
                                    0.1,
                                    0.11,
                                    0.11,
                                    0.12,
                                    0.12,
                                    0.12,
                                    0.13
                                  ]
                                },
                                "heal_static_value_loop": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_static_value_loop",
                                  "levelValues": [
                                    24.0,
                                    28.8,
                                    33.6,
                                    38.4,
                                    40.8,
                                    43.2,
                                    45.6,
                                    48.0,
                                    50.4,
                                    51.6,
                                    52.8,
                                    54.0
                                  ]
                                },
                                "duration": {
                                  "value": 0.0,
                                  "blackboardKey": "duration",
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
                                "interval": {
                                  "value": 0.0,
                                  "blackboardKey": "interval",
                                  "levelValues": [
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5
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
                      "presentationOnlySwitchActionIndexes": []
                    }
                  ],
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
                "projectileId": "projectile_chr_0014_aurora_combo_skill_bear_out",
                "skillTriggers": [
                  {
                    "event": "reach",
                    "skillId": "chr_0014_aurora_combo_skill_bear_gene"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "BearPos",
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
                  "launchFrame": 12,
                  "actionOrder": [
                    15,
                    1
                  ],
                  "assumedTravelFrames": 0,
                  "projectileId": "projectile_chr_0014_aurora_combo_skill_bear_out",
                  "triggerEvent": "reach",
                  "triggerSkillId": "chr_0014_aurora_combo_skill_bear_gene",
                  "excludedByPrimaryTargetMarker": false,
                  "sourceFile": "chr_0014_aurora_combo_skill_bear_gene.json",
                  "damageUnits": [],
                  "directDamageHits": [],
                  "conditionalActions": [],
                  "auxiliaryActions": [
                    {
                      "startFrame": 0,
                      "endFrame": 2,
                      "actionIndex": 0,
                      "actionType": "SpawnAbilityEntity",
                      "sourceId": "abilityentity_chr_0014_aurora_combo_skill:chr_0014_aurora_combo_skill_abilityrange",
                      "classification": null,
                      "targetSource": "",
                      "targetGroupKey": "",
                      "count": null,
                      "buffSource": null,
                      "inheritSourceSkillCastInfo": null,
                      "blackboardAssignments": {},
                      "nestedCombatActions": [
                        "AuraAction"
                      ],
                      "buffSourceContextKey": null,
                      "sequenceIndex": 0,
                      "autoFinishByAction": null
                    }
                  ],
                  "resourceGains": [],
                  "inflictions": [],
                  "combatActions": [
                    "SpawnAbilityEntity"
                  ],
                  "cycleTruncated": false,
                  "nestedProjectileTriggeredSkills": [],
                  "abilityEntityHits": [
                    {
                      "spawnFrame": 12,
                      "actionOrder": [
                        15,
                        1,
                        0
                      ],
                      "abilityEntityId": "abilityentity_chr_0014_aurora_combo_skill",
                      "skillId": "chr_0014_aurora_combo_skill_abilityrange",
                      "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                      "entityBlackboardAssignments": [],
                      "spawnPayload": {
                        "abilityEntityId": "abilityentity_chr_0014_aurora_combo_skill",
                        "skillId": "chr_0014_aurora_combo_skill_abilityrange",
                        "entityBlackboardAssignments": [],
                        "assignBlackboard": true,
                        "sourceType": "ActionSource",
                        "sourceContextKey": "",
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
                        "overrideDuration": null,
                        "saveToContextKey": null,
                        "dieWhenSourceDies": false,
                        "dieOnEnd": false
                      },
                      "directDamageHits": [],
                      "intervalDamageHits": [],
                      "explicitFinishes": [
                        {
                          "startFrame": 90,
                          "endFrame": 93,
                          "actionIndex": 9,
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
                          "skipDieDisplay": false,
                          "sequenceIndex": 7
                        }
                      ],
                      "timelineJumps": [],
                      "conditionalActions": [],
                      "inflictions": [],
                      "auxiliaryActions": [],
                      "resourceGains": [],
                      "projectileLaunches": [],
                      "projectileTriggeredSkills": [],
                      "nestedAbilityEntityHits": [],
                      "combatActions": [
                        "AuraAction"
                      ],
                      "cycleTruncated": false,
                      "inheritsSourceBlackboard": true,
                      "declaredBlackboard": [
                        {
                          "key": "duration",
                          "value": 0.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_scale",
                          "value": 1.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_scale_loop",
                          "value": 1.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_static_value",
                          "value": 0.0,
                          "isDynamic": false
                        },
                        {
                          "key": "heal_static_value_loop",
                          "value": 0.0,
                          "isDynamic": false
                        },
                        {
                          "key": "interval",
                          "value": 0.0,
                          "isDynamic": false
                        }
                      ],
                      "blackboardCalculations": [],
                      "blackboardMutations": [],
                      "buffBlackboardReads": [],
                      "buffFinishes": [],
                      "auraActions": [
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 5,
                          "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                          "activationSource": "timeline",
                          "activationEvent": null,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]"
                          ],
                          "priorityLevel": "Default",
                          "priorityOffset": 0,
                          "debugName": "aurora_combo_skill",
                          "auraType": "RangedAura",
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
                            "shapeType": "Sphere",
                            "rotationOffset": {
                              "x": 0.0,
                              "y": 0.0,
                              "z": 0.0
                            },
                            "useExtentKeys": false,
                            "extent": {
                              "x": 2.0,
                              "y": 2.0,
                              "z": 10.0
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
                            "radius": 3.0,
                            "radiusKey": ""
                          },
                          "excludeColliderOptions": 0,
                          "targetObjectType": 0,
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
                          "excludeOwner": true,
                          "includeUnmarkable": false,
                          "limitInfluenceCountPerTarget": true,
                          "maxInfluenceCountPerTarget": 1,
                          "buffSource": "ActionSource",
                          "buffs": [
                            {
                              "buffId": "buff_chr_0014_aurora_combo_skill_heal",
                              "classification": null,
                              "blackboardAssignments": {
                                "heal_scale": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_scale",
                                  "levelValues": [
                                    0.22,
                                    0.27,
                                    0.31,
                                    0.36,
                                    0.38,
                                    0.4,
                                    0.43,
                                    0.45,
                                    0.47,
                                    0.48,
                                    0.49,
                                    0.5
                                  ]
                                },
                                "heal_static_value": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_static_value",
                                  "levelValues": [
                                    96.0,
                                    115.2,
                                    134.4,
                                    153.6,
                                    163.2,
                                    172.8,
                                    182.4,
                                    192.0,
                                    201.6,
                                    206.4,
                                    211.2,
                                    216.0
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
                        },
                        {
                          "startFrame": 0,
                          "endFrame": 900,
                          "actionIndex": 6,
                          "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                          "activationSource": "timeline",
                          "activationEvent": null,
                          "actionPath": [
                            "timelineActions[6]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]"
                          ],
                          "priorityLevel": "Default",
                          "priorityOffset": 0,
                          "debugName": "aurora_combo_skill",
                          "auraType": "RangedAura",
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
                            "shapeType": "Sphere",
                            "rotationOffset": {
                              "x": 0.0,
                              "y": 0.0,
                              "z": 0.0
                            },
                            "useExtentKeys": false,
                            "extent": {
                              "x": 2.0,
                              "y": 2.0,
                              "z": 10.0
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
                            "radius": 3.0,
                            "radiusKey": ""
                          },
                          "excludeColliderOptions": 0,
                          "targetObjectType": 0,
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
                          "excludeOwner": true,
                          "includeUnmarkable": false,
                          "limitInfluenceCountPerTarget": false,
                          "maxInfluenceCountPerTarget": 1,
                          "buffSource": "ActionSource",
                          "buffs": [
                            {
                              "buffId": "buff_chr_0014_aurora_combo_skill_heal_loop",
                              "classification": null,
                              "blackboardAssignments": {
                                "heal_scale_loop": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_scale_loop",
                                  "levelValues": [
                                    0.06,
                                    0.07,
                                    0.08,
                                    0.09,
                                    0.1,
                                    0.1,
                                    0.11,
                                    0.11,
                                    0.12,
                                    0.12,
                                    0.12,
                                    0.13
                                  ]
                                },
                                "heal_static_value_loop": {
                                  "value": 0.0,
                                  "blackboardKey": "heal_static_value_loop",
                                  "levelValues": [
                                    24.0,
                                    28.8,
                                    33.6,
                                    38.4,
                                    40.8,
                                    43.2,
                                    45.6,
                                    48.0,
                                    50.4,
                                    51.6,
                                    52.8,
                                    54.0
                                  ]
                                },
                                "duration": {
                                  "value": 0.0,
                                  "blackboardKey": "duration",
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
                                "interval": {
                                  "value": 0.0,
                                  "blackboardKey": "interval",
                                  "levelValues": [
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5,
                                    0.5
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
                      "presentationOnlySwitchActionIndexes": []
                    }
                  ],
                  "auraActions": []
                }
              ]
            }
          ]
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 12,
          "endFrame": 15,
          "actionIndex": 13,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0014_aurora_combo_skill_tutorial_marker",
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
          "sequenceIndex": 4,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [
        {
          "startFrame": 12,
          "endFrame": 15,
          "actionIndex": 14,
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
          "sequenceIndex": 4
        }
      ],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 12,
          "actionOrder": [
            15,
            1
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0014_aurora_combo_skill_bear_out",
          "triggerEvent": "reach",
          "triggerSkillId": "chr_0014_aurora_combo_skill_bear_gene",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0014_aurora_combo_skill_bear_gene.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 2,
              "actionIndex": 0,
              "actionType": "SpawnAbilityEntity",
              "sourceId": "abilityentity_chr_0014_aurora_combo_skill:chr_0014_aurora_combo_skill_abilityrange",
              "classification": null,
              "targetSource": "",
              "targetGroupKey": "",
              "count": null,
              "buffSource": null,
              "inheritSourceSkillCastInfo": null,
              "blackboardAssignments": {},
              "nestedCombatActions": [
                "AuraAction"
              ],
              "buffSourceContextKey": null,
              "sequenceIndex": 0,
              "autoFinishByAction": null
            }
          ],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "SpawnAbilityEntity"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [
            {
              "spawnFrame": 12,
              "actionOrder": [
                15,
                1,
                0
              ],
              "abilityEntityId": "abilityentity_chr_0014_aurora_combo_skill",
              "skillId": "chr_0014_aurora_combo_skill_abilityrange",
              "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
              "entityBlackboardAssignments": [],
              "spawnPayload": {
                "abilityEntityId": "abilityentity_chr_0014_aurora_combo_skill",
                "skillId": "chr_0014_aurora_combo_skill_abilityrange",
                "entityBlackboardAssignments": [],
                "assignBlackboard": true,
                "sourceType": "ActionSource",
                "sourceContextKey": "",
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
                "overrideDuration": null,
                "saveToContextKey": null,
                "dieWhenSourceDies": false,
                "dieOnEnd": false
              },
              "directDamageHits": [],
              "intervalDamageHits": [],
              "explicitFinishes": [
                {
                  "startFrame": 90,
                  "endFrame": 93,
                  "actionIndex": 9,
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
                  "skipDieDisplay": false,
                  "sequenceIndex": 7
                }
              ],
              "timelineJumps": [],
              "conditionalActions": [],
              "inflictions": [],
              "auxiliaryActions": [],
              "resourceGains": [],
              "projectileLaunches": [],
              "projectileTriggeredSkills": [],
              "nestedAbilityEntityHits": [],
              "combatActions": [
                "AuraAction"
              ],
              "cycleTruncated": false,
              "inheritsSourceBlackboard": true,
              "declaredBlackboard": [
                {
                  "key": "duration",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "heal_scale",
                  "value": 1.0,
                  "isDynamic": false
                },
                {
                  "key": "heal_scale_loop",
                  "value": 1.0,
                  "isDynamic": false
                },
                {
                  "key": "heal_static_value",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "heal_static_value_loop",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "interval",
                  "value": 0.0,
                  "isDynamic": false
                }
              ],
              "blackboardCalculations": [],
              "blackboardMutations": [],
              "buffBlackboardReads": [],
              "buffFinishes": [],
              "auraActions": [
                {
                  "startFrame": 0,
                  "endFrame": 3,
                  "actionIndex": 5,
                  "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                  "activationSource": "timeline",
                  "activationEvent": null,
                  "actionPath": [
                    "timelineActions[5]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]"
                  ],
                  "priorityLevel": "Default",
                  "priorityOffset": 0,
                  "debugName": "aurora_combo_skill",
                  "auraType": "RangedAura",
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
                    "shapeType": "Sphere",
                    "rotationOffset": {
                      "x": 0.0,
                      "y": 0.0,
                      "z": 0.0
                    },
                    "useExtentKeys": false,
                    "extent": {
                      "x": 2.0,
                      "y": 2.0,
                      "z": 10.0
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
                    "radius": 3.0,
                    "radiusKey": ""
                  },
                  "excludeColliderOptions": 0,
                  "targetObjectType": 0,
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
                  "excludeOwner": true,
                  "includeUnmarkable": false,
                  "limitInfluenceCountPerTarget": true,
                  "maxInfluenceCountPerTarget": 1,
                  "buffSource": "ActionSource",
                  "buffs": [
                    {
                      "buffId": "buff_chr_0014_aurora_combo_skill_heal",
                      "classification": null,
                      "blackboardAssignments": {
                        "heal_scale": {
                          "value": 0.0,
                          "blackboardKey": "heal_scale",
                          "levelValues": [
                            0.22,
                            0.27,
                            0.31,
                            0.36,
                            0.38,
                            0.4,
                            0.43,
                            0.45,
                            0.47,
                            0.48,
                            0.49,
                            0.5
                          ]
                        },
                        "heal_static_value": {
                          "value": 0.0,
                          "blackboardKey": "heal_static_value",
                          "levelValues": [
                            96.0,
                            115.2,
                            134.4,
                            153.6,
                            163.2,
                            172.8,
                            182.4,
                            192.0,
                            201.6,
                            206.4,
                            211.2,
                            216.0
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
                },
                {
                  "startFrame": 0,
                  "endFrame": 900,
                  "actionIndex": 6,
                  "sourceFile": "chr_0014_aurora_combo_skill_abilityrange.json",
                  "activationSource": "timeline",
                  "activationEvent": null,
                  "actionPath": [
                    "timelineActions[6]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]"
                  ],
                  "priorityLevel": "Default",
                  "priorityOffset": 0,
                  "debugName": "aurora_combo_skill",
                  "auraType": "RangedAura",
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
                    "shapeType": "Sphere",
                    "rotationOffset": {
                      "x": 0.0,
                      "y": 0.0,
                      "z": 0.0
                    },
                    "useExtentKeys": false,
                    "extent": {
                      "x": 2.0,
                      "y": 2.0,
                      "z": 10.0
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
                    "radius": 3.0,
                    "radiusKey": ""
                  },
                  "excludeColliderOptions": 0,
                  "targetObjectType": 0,
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
                  "excludeOwner": true,
                  "includeUnmarkable": false,
                  "limitInfluenceCountPerTarget": false,
                  "maxInfluenceCountPerTarget": 1,
                  "buffSource": "ActionSource",
                  "buffs": [
                    {
                      "buffId": "buff_chr_0014_aurora_combo_skill_heal_loop",
                      "classification": null,
                      "blackboardAssignments": {
                        "heal_scale_loop": {
                          "value": 0.0,
                          "blackboardKey": "heal_scale_loop",
                          "levelValues": [
                            0.06,
                            0.07,
                            0.08,
                            0.09,
                            0.1,
                            0.1,
                            0.11,
                            0.11,
                            0.12,
                            0.12,
                            0.12,
                            0.13
                          ]
                        },
                        "heal_static_value_loop": {
                          "value": 0.0,
                          "blackboardKey": "heal_static_value_loop",
                          "levelValues": [
                            24.0,
                            28.8,
                            33.6,
                            38.4,
                            40.8,
                            43.2,
                            45.6,
                            48.0,
                            50.4,
                            51.6,
                            52.8,
                            54.0
                          ]
                        },
                        "duration": {
                          "value": 0.0,
                          "blackboardKey": "duration",
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
                        "interval": {
                          "value": 0.0,
                          "blackboardKey": "interval",
                          "levelValues": [
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5,
                            0.5
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
              "presentationOnlySwitchActionIndexes": []
            }
          ],
          "auraActions": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0014_aurora_combo_skill_tutorial_marker"
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
          "heal_scale": [
            0.22,
            0.27,
            0.31,
            0.36,
            0.38,
            0.4,
            0.43,
            0.45,
            0.47,
            0.48,
            0.49,
            0.5
          ],
          "heal_scale_loop": [
            0.06,
            0.07,
            0.08,
            0.09,
            0.1,
            0.1,
            0.11,
            0.11,
            0.12,
            0.12,
            0.12,
            0.13
          ],
          "heal_static_value": [
            96.0,
            115.2,
            134.4,
            153.6,
            163.2,
            172.8,
            182.4,
            192.0,
            201.6,
            206.4,
            211.2,
            216.0
          ],
          "heal_static_value_loop": [
            24.0,
            28.8,
            33.6,
            38.4,
            40.8,
            43.2,
            45.6,
            48.0,
            50.4,
            51.6,
            52.8,
            54.0
          ],
          "interval": [
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5
          ],
          "trigger_hp_ratio": [
            0.6,
            0.6,
            0.6,
            0.6,
            0.6,
            0.6,
            0.6,
            0.6,
            0.6,
            0.6,
            0.6,
            0.6
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
          24.0,
          24.0,
          24.0,
          23.0
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
          "value": 0.42,
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
          "key": "duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_scale",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_scale_loop",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_static_value",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_static_value_loop",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "interval",
          "value": 0.0,
          "isDynamic": false
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
          "key": "usp",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "usp"
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
          "key": "duration",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_scale_loop",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_static_value",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_static_value_loop",
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
          "key": "interval",
          "declaredInSkill": true,
          "suppliedByPatch": true,
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
          "key": "trigger_hp_ratio",
          "declaredInSkill": false,
          "suppliedByPatch": true,
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
          "endFrame": 123,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "TempPos",
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
          "endFrame": 123,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[3]",
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
          "startFrame": 12,
          "endFrame": 15,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "BearPos",
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
          "startFrame": 12,
          "endFrame": 15,
          "actionIndex": 19,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "BearPos",
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
          "endFrame": 15,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[10]",
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
          "endFrame": 123,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[3]",
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
          "succeedActions": [
            {
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[3]",
                "_sequenceActionData",
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
                "timelineActions[3]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 8,
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
          "startFrame": 12,
          "endFrame": 15,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[4]",
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
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 17,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "LaunchProjectile",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 18,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0014_aurora_combo_skill_bear_out",
                "skillTriggers": [
                  {
                    "event": "reach",
                    "skillId": "chr_0014_aurora_combo_skill_bear_gene"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "BearPos",
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
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 19,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "LaunchProjectile",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 21,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "projectileLaunch": {
                "projectileId": "projectile_chr_0014_aurora_combo_skill_bear_out",
                "skillTriggers": [
                  {
                    "event": "reach",
                    "skillId": "chr_0014_aurora_combo_skill_bear_gene"
                  }
                ],
                "assignBlackboard": true,
                "entityBlackboardAssignments": [],
                "target": {
                  "targetSource": "Context",
                  "targetGroupKey": "BearPos",
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
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionIndex": 27,
          "actionPath": [
            "timelineActions[10]",
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
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 29,
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
          "endFrame": 13,
          "actionIndex": 26,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.533,
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
          "sequenceIndex": 9,
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
      "skillId": "chr_0014_aurora_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0014_aurora_ultimate_skill.json",
      "timelineBlockFrames": 71,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 71,
          "endFrame": 90,
          "skillIds": [
            "chr_0014_aurora_normal_skill",
            "chr_0014_aurora_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 90,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0014_aurora_normal_skill",
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
              "skillId": "chr_0014_aurora_combo_skill",
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
          "endFrame": 142,
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
          "endFrame": 3,
          "actionTypes": [
            "TeleportAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "SelfRotateAction"
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
          "startFrame": 62,
          "endFrame": 65,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 62,
          "endFrame": 65,
          "actionTypes": [
            "IfElseAction",
            "InterruptAction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "TakeDownAction"
          ]
        },
        {
          "startFrame": 62,
          "endFrame": 65,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "IfElseAction",
            "SpawnAbilityEntity",
            "SpawnAbilityEntity"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "CreateBuffAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 83,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 82,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 82,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 86,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 86,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 71,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 110,
          "endFrame": 151,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 71,
          "endFrame": 90,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 111,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 111,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 111,
          "endFrame": 143,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 79,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 102,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 62,
          "endFrame": 65,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[6]",
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
              "actionType": "InterruptAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[6]",
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
                  "targetSource": "Context",
                  "targetGroupKey": "tar",
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
                "immobilizedTime": 1.0
              }
            },
            {
              "actionType": "DamageAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 12,
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
              ]
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 62,
          "endFrame": 65,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
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
              "actionType": "SpawnAbilityEntity",
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
              "serverActionIndex": 17,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0014_aurora_ultimate_skill",
                "skillId": "chr_0014_aurora_ultimate_skill_abilityrange_potential2",
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
              "conditionalAbilityEntityHits": [
                {
                  "spawnFrame": 62,
                  "actionOrder": [
                    15,
                    0
                  ],
                  "abilityEntityId": "abilityentity_chr_0014_aurora_ultimate_skill",
                  "skillId": "chr_0014_aurora_ultimate_skill_abilityrange_potential2",
                  "sourceFile": "chr_0014_aurora_ultimate_skill_abilityrange_potential2.json",
                  "entityBlackboardAssignments": [],
                  "spawnPayload": {
                    "abilityEntityId": "abilityentity_chr_0014_aurora_ultimate_skill",
                    "skillId": "chr_0014_aurora_ultimate_skill_abilityrange_potential2",
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
                  "directDamageHits": [],
                  "intervalDamageHits": [],
                  "explicitFinishes": [],
                  "timelineJumps": [],
                  "conditionalActions": [],
                  "inflictions": [],
                  "auxiliaryActions": [],
                  "resourceGains": [],
                  "projectileLaunches": [],
                  "projectileTriggeredSkills": [],
                  "nestedAbilityEntityHits": [],
                  "combatActions": [
                    "AuraAction"
                  ],
                  "cycleTruncated": false,
                  "inheritsSourceBlackboard": true,
                  "declaredBlackboard": [
                    {
                      "key": "atk_scale",
                      "value": 4.0,
                      "isDynamic": false
                    },
                    {
                      "key": "atk_scale_loop",
                      "value": 1.0,
                      "isDynamic": false
                    },
                    {
                      "key": "extra_duration",
                      "value": 0.0,
                      "isDynamic": false
                    },
                    {
                      "key": "frozen_level",
                      "value": 1.0,
                      "isDynamic": false
                    }
                  ],
                  "blackboardCalculations": [],
                  "blackboardMutations": [],
                  "buffBlackboardReads": [],
                  "buffFinishes": [],
                  "auraActions": [
                    {
                      "startFrame": 4,
                      "endFrame": 156,
                      "actionIndex": 2,
                      "sourceFile": "chr_0014_aurora_ultimate_skill_abilityrange_potential2.json",
                      "activationSource": "timeline",
                      "activationEvent": null,
                      "actionPath": [
                        "timelineActions[2]",
                        "_sequenceActionData",
                        "actionData",
                        "[0]"
                      ],
                      "priorityLevel": "Default",
                      "priorityOffset": 0,
                      "debugName": "",
                      "auraType": "RangedAura",
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
                        "shapeType": "Sphere",
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
                        "radius": 6.0,
                        "radiusKey": ""
                      },
                      "excludeColliderOptions": 0,
                      "targetObjectType": 0,
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
                      "buffSource": "ActionSource",
                      "buffs": [
                        {
                          "buffId": "buff_chr_0014_aurora_ultimate_skill_frost",
                          "classification": null,
                          "blackboardAssignments": {
                            "extra_duration": {
                              "value": 0.0,
                              "blackboardKey": "extra_duration",
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
                        },
                        {
                          "buffId": "buff_chr_0014_aurora_ultimate_skill_dmg",
                          "classification": null,
                          "blackboardAssignments": {
                            "atk_scale_loop": {
                              "value": 0.0,
                              "blackboardKey": "atk_scale_loop",
                              "levelValues": [
                                0.29,
                                0.32,
                                0.35,
                                0.37,
                                0.4,
                                0.43,
                                0.46,
                                0.49,
                                0.52,
                                0.55,
                                0.6,
                                0.65
                              ]
                            }
                          }
                        }
                      ],
                      "overrideBuffIconDuration": false,
                      "buffIconDurationSourceType": "AbilityEntity",
                      "buffIconDurationTimedMarkerId": "",
                      "inheritSourceSkillCastId": true,
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
                  "presentationOnlySwitchActionIndexes": []
                }
              ]
            }
          ],
          "failActions": [
            {
              "actionType": "SpawnAbilityEntity",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 18,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0014_aurora_ultimate_skill",
                "skillId": "chr_0014_aurora_ultimate_skill_abilityrange",
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
              "conditionalAbilityEntityHits": [
                {
                  "spawnFrame": 62,
                  "actionOrder": [
                    15,
                    0
                  ],
                  "abilityEntityId": "abilityentity_chr_0014_aurora_ultimate_skill",
                  "skillId": "chr_0014_aurora_ultimate_skill_abilityrange",
                  "sourceFile": "chr_0014_aurora_ultimate_skill_abilityrange.json",
                  "entityBlackboardAssignments": [],
                  "spawnPayload": {
                    "abilityEntityId": "abilityentity_chr_0014_aurora_ultimate_skill",
                    "skillId": "chr_0014_aurora_ultimate_skill_abilityrange",
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
                  "directDamageHits": [],
                  "intervalDamageHits": [],
                  "explicitFinishes": [],
                  "timelineJumps": [],
                  "conditionalActions": [],
                  "inflictions": [],
                  "auxiliaryActions": [],
                  "resourceGains": [],
                  "projectileLaunches": [],
                  "projectileTriggeredSkills": [],
                  "nestedAbilityEntityHits": [],
                  "combatActions": [
                    "AuraAction"
                  ],
                  "cycleTruncated": false,
                  "inheritsSourceBlackboard": true,
                  "declaredBlackboard": [
                    {
                      "key": "atk_scale",
                      "value": 4.0,
                      "isDynamic": false
                    },
                    {
                      "key": "atk_scale_loop",
                      "value": 1.0,
                      "isDynamic": false
                    },
                    {
                      "key": "extra_duration",
                      "value": 0.0,
                      "isDynamic": false
                    },
                    {
                      "key": "frozen_level",
                      "value": 1.0,
                      "isDynamic": false
                    }
                  ],
                  "blackboardCalculations": [],
                  "blackboardMutations": [],
                  "buffBlackboardReads": [],
                  "buffFinishes": [],
                  "auraActions": [
                    {
                      "startFrame": 4,
                      "endFrame": 157,
                      "actionIndex": 2,
                      "sourceFile": "chr_0014_aurora_ultimate_skill_abilityrange.json",
                      "activationSource": "timeline",
                      "activationEvent": null,
                      "actionPath": [
                        "timelineActions[2]",
                        "_sequenceActionData",
                        "actionData",
                        "[0]"
                      ],
                      "priorityLevel": "Default",
                      "priorityOffset": 0,
                      "debugName": "",
                      "auraType": "RangedAura",
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
                        "shapeType": "Sphere",
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
                        "radius": 5.0,
                        "radiusKey": ""
                      },
                      "excludeColliderOptions": 0,
                      "targetObjectType": 0,
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
                      "buffSource": "ActionSource",
                      "buffs": [
                        {
                          "buffId": "buff_chr_0014_aurora_ultimate_skill_frost",
                          "classification": null,
                          "blackboardAssignments": {
                            "extra_duration": {
                              "value": 0.0,
                              "blackboardKey": "extra_duration",
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
                        },
                        {
                          "buffId": "buff_chr_0014_aurora_ultimate_skill_dmg",
                          "classification": null,
                          "blackboardAssignments": {
                            "atk_scale_loop": {
                              "value": 0.0,
                              "blackboardKey": "atk_scale_loop",
                              "levelValues": [
                                0.29,
                                0.32,
                                0.35,
                                0.37,
                                0.4,
                                0.43,
                                0.46,
                                0.49,
                                0.52,
                                0.55,
                                0.6,
                                0.65
                              ]
                            }
                          }
                        }
                      ],
                      "overrideBuffIconDuration": false,
                      "buffIconDurationSourceType": "AbilityEntity",
                      "buffIconDurationTimedMarkerId": "",
                      "inheritSourceSkillCastId": true,
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
                  "presentationOnlySwitchActionIndexes": []
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
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionIndex": 22,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_damage_immune_ult_skill",
          "classification": "incomingDamageProtection",
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
          "sequenceIndex": 11,
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
          "atk_scale_loop": [
            0.29,
            0.32,
            0.35,
            0.37,
            0.4,
            0.43,
            0.46,
            0.49,
            0.52,
            0.55,
            0.6,
            0.65
          ],
          "duration": [
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
          "forst_allow_count": [
            2.0,
            2.0,
            2.0,
            2.0,
            2.0,
            2.0,
            2.0,
            2.0,
            2.0,
            2.0,
            2.0,
            2.0
          ],
          "interval": [
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5,
            0.5
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
          "value": 4.0,
          "isDynamic": false
        },
        {
          "key": "extra_duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "frozen_level",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "potential_2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_2_range",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "poise",
        "potential_2"
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
          "key": "atk_scale_loop",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "duration",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "extra_duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "forst_allow_count",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "frozen_level",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "interval",
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
          "key": "potential_2_range",
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
        "SpawnAbilityEntity"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 62,
          "endFrame": 65,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[5]",
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
          "startFrame": 62,
          "endFrame": 65,
          "actionIndex": 14,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "ult_pos",
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
          "startFrame": 62,
          "endFrame": 65,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[6]",
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
              "actionType": "InterruptAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[6]",
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
                  "targetSource": "Context",
                  "targetGroupKey": "tar",
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
                "immobilizedTime": 1.0
              }
            },
            {
              "actionType": "DamageAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 12,
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
              ]
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 62,
          "endFrame": 65,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
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
              "actionType": "SpawnAbilityEntity",
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
              "serverActionIndex": 17,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0014_aurora_ultimate_skill",
                "skillId": "chr_0014_aurora_ultimate_skill_abilityrange_potential2",
                "entityBlackboardAssignments": [],
                "assignBlackboard": true,
                "sourceType": "ActionSource",
                "sourceContextKey": "",
                "target": null,
                "overrideDuration": null,
                "saveToContextKey": null,
                "dieWhenSourceDies": false,
                "dieOnEnd": false
              }
            }
          ],
          "failActions": [
            {
              "actionType": "SpawnAbilityEntity",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 18,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0014_aurora_ultimate_skill",
                "skillId": "chr_0014_aurora_ultimate_skill_abilityrange",
                "entityBlackboardAssignments": [],
                "assignBlackboard": true,
                "sourceType": "ActionSource",
                "sourceContextKey": "",
                "target": null,
                "overrideDuration": null,
                "saveToContextKey": null,
                "dieWhenSourceDies": false,
                "dieOnEnd": false
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
          "endFrame": 60,
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
          "sequenceIndex": 9,
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
