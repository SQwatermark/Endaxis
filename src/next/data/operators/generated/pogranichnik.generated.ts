/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const pogranichnikGeneratedSource = {
  "slug": "pogranichnik",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0029_pograni_talent1",
      "sourceFile": "buff_chr_0029_pograni_talent1.json",
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
        "stackingType": "HighPriorityWithMaxStack",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": -1.0,
          "blackboardKey": "max_stack",
          "levelValues": [
            3.0
          ]
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "atk_up",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "max_stack",
          "value": 3.0,
          "isDynamic": false
        },
        {
          "key": "physpell_up",
          "value": 10.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [
        {
          "targetType": "Specific",
          "attributeType": "Atk",
          "slot": "BaseMultiplier",
          "value": {
            "value": 0.0,
            "blackboardKey": "atk_up",
            "levelValues": [
              0.1
            ]
          }
        },
        {
          "targetType": "Specific",
          "attributeType": "PhysicalAndSpellInflictionEnhance",
          "slot": "BaseAddition",
          "value": {
            "value": 0.0,
            "blackboardKey": "physpell_up",
            "levelValues": [
              10.0
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
        "spritePath": "icon_battle_pograni_talent_1",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": true,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "LifeTime",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "AttentionDebuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0029_pograni_talent1_exist",
      "sourceFile": "buff_chr_0029_pograni_talent1_exist.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 20.0,
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
          "value": -1.0,
          "blackboardKey": "max_stack",
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
          "key": "max_stack_owner",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "max_stack_team",
          "value": 3.0,
          "isDynamic": false
        },
        {
          "key": "physpell_up",
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
        "iconStyleInSquad": "LifeTime",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "AttentionDebuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0029_pograni_talent2",
      "sourceFile": "buff_chr_0029_pograni_talent2.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 20.0,
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
          "value": -1.0,
          "blackboardKey": "max_stack",
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
        "iconStyleInSquad": "LifeTime",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "AttentionDebuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0029_pograni_ultimate_skill",
      "sourceFile": "buff_chr_0029_pograni_ultimate_skill.json",
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
          "key": "atb_final",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atb_trigger",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_final",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_rush",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_trigger",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "count",
          "value": 5.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "poise_final",
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
          "event": "DuringBuffEnable",
          "orderedActionTypes": [
            "AuraAction",
            "EffectAction"
          ],
          "combatActions": [
            "AuraAction"
          ],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [
            "buff_chr_0029_pograni_ultimate_skill_abilityentity_inaura"
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
            },
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
              "actionIndex": 2,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0029_pograni_ultimate_skill_count",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
                        "levelValues": [
                          20.0
                        ]
                      }
                    }
                  }
                ],
                "targetSource": "Source",
                "targetGroupKey": "",
                "count": {
                  "value": 4.0,
                  "blackboardKey": "count",
                  "levelValues": [
                    5.0
                  ]
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_chr_0029_pograni_ultimate_skill_count"
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
                        "buffId": "buff_chr_0029_pograni_ultimate_skill_count",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              20.0
                            ]
                          }
                        }
                      }
                    ],
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "count": {
                      "value": 4.0,
                      "blackboardKey": "count",
                      "levelValues": [
                        5.0
                      ]
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
                        "buffId": "buff_chr_0029_pograni_ultimate_skill_count",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              20.0
                            ]
                          }
                        }
                      }
                    ],
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "count": {
                      "value": 4.0,
                      "blackboardKey": "count",
                      "levelValues": [
                        5.0
                      ]
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
          "event": "OnBuffFinish",
          "orderedActionTypes": [
            "FinishBuffAdvanced"
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
                "FinishBuffAdvanced"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "FinishBuffAdvanced",
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
                  "buffFinish": {
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "buffCheckType": "Id",
                    "buffIds": [
                      "buff_chr_0029_pograni_ultimate_skill_effect_layer"
                    ],
                    "tagQueryType": "hasAny",
                    "buffTagIds": [],
                    "finishAll": true,
                    "limitSource": false,
                    "isFinishedEarly": false,
                    "isAbsorbed": false,
                    "finishLayerCount": null
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
      "auraActions": [
        {
          "startFrame": null,
          "endFrame": null,
          "actionIndex": 0,
          "sourceFile": "buff_chr_0029_pograni_ultimate_skill.json",
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
          "debugName": "pograni_ultimate",
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
            "radius": 50.0,
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
              "buffId": "buff_chr_0029_pograni_ultimate_skill_abilityentity_inaura",
              "classification": null,
              "blackboardAssignments": {
                "duration": {
                  "value": 0.0,
                  "blackboardKey": "duration",
                  "levelValues": [
                    20.0
                  ]
                },
                "atk_scale_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_trigger",
                  "levelValues": [
                    0.0
                  ]
                },
                "atk_scale_final": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_final",
                  "levelValues": [
                    0.0
                  ]
                },
                "atb_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atb_trigger",
                  "levelValues": [
                    0.0
                  ]
                },
                "atb_final": {
                  "value": 0.0,
                  "blackboardKey": "atb_final",
                  "levelValues": [
                    0.0
                  ]
                },
                "poise_final": {
                  "value": 0.0,
                  "blackboardKey": "poise_final",
                  "levelValues": [
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
      "buffId": "buff_chr_0029_pograni_ultimate_skill_abilityentity_inaura",
      "sourceFile": "buff_chr_0029_pograni_ultimate_skill_abilityentity_inaura.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 1.0,
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
          "value": -1.0,
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
      "blackboard": [
        {
          "key": "atb_final",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atb_trigger",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_final",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_trigger",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_up_temp",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "duration_temp",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "interval",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "max_stack_owner_temp",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "max_stack_team_temp",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "physpell_up_temp",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "poise_final",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "radius",
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
          "event": "OnBeforeTakePhysicalInfliction",
          "orderedActionTypes": [
            "CheckTimedMarkerCondition",
            "CheckBuffStackNumAdvanced",
            "FinishBuffAdvanced",
            "CreateBuffAction",
            "CreateTimedMarker",
            "CheckBuffStackNumAdvanced",
            "CheckBuffStackNumAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "IfElseAction",
            "CheckTimedMarkerCondition",
            "CheckBuffStackNumAdvanced",
            "SpawnAbilityEntity",
            "FinishBuffAdvanced",
            "CreateTimedMarker",
            "CheckBuffStackNumAdvanced",
            "CheckBuffStackNumAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "IfElseAction"
          ],
          "combatActions": [
            "CreateBuffAction",
            "CreateTimedMarker",
            "IfElseAction",
            "SpawnAbilityEntity"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 3,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0029_pograni_ultimate_skill_finall_rush",
                    "classification": null,
                    "blackboardAssignments": {
                      "atk_scale_final": {
                        "value": 0.0,
                        "blackboardKey": "atk_scale_final",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "atb_final": {
                        "value": 0.0,
                        "blackboardKey": "atb_final",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "poise_final": {
                        "value": 0.0,
                        "blackboardKey": "poise_final",
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
            "buff_chr_0029_pograni_talent1",
            "buff_chr_0029_pograni_ultimate_skill_finall_rush"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckTimedMarkerCondition",
                "CheckBuffStackNumAdvanced",
                "FinishBuffAdvanced",
                "CreateBuffAction",
                "CreateTimedMarker",
                "CheckBuffStackNumAdvanced",
                "CheckBuffStackNumAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "IfElseAction"
              ],
              "combatActions": [
                "CreateBuffAction",
                "CreateTimedMarker",
                "IfElseAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 3,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0029_pograni_ultimate_skill_finall_rush",
                        "classification": null,
                        "blackboardAssignments": {
                          "atk_scale_final": {
                            "value": 0.0,
                            "blackboardKey": "atk_scale_final",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "atb_final": {
                            "value": 0.0,
                            "blackboardKey": "atb_final",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "poise_final": {
                            "value": 0.0,
                            "blackboardKey": "poise_final",
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
                  "actionType": "CheckTimedMarkerCondition",
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
                          "markerId": "chr_0029_pograni_soldier_attacked",
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
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_ultimate_skill_count"
                          ],
                          "tagQueryType": "hasAny",
                          "buffTagIds": [],
                          "finishAll": false,
                          "limitSource": false,
                          "isFinishedEarly": false,
                          "isAbsorbed": false,
                          "finishLayerCount": {
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
                              "buffId": "buff_chr_0029_pograni_ultimate_skill_finall_rush",
                              "classification": null,
                              "blackboardAssignments": {
                                "atk_scale_final": {
                                  "value": 0.0,
                                  "blackboardKey": "atk_scale_final",
                                  "levelValues": [
                                    0.0
                                  ]
                                },
                                "atb_final": {
                                  "value": 0.0,
                                  "blackboardKey": "atb_final",
                                  "levelValues": [
                                    0.0
                                  ]
                                },
                                "poise_final": {
                                  "value": 0.0,
                                  "blackboardKey": "poise_final",
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
                        "actionType": "CreateTimedMarker",
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
                        "timedMarkerApplication": {
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "markerId": "chr_0029_pograni_soldier_attacked",
                          "duration": {
                            "value": 0.1,
                            "blackboardKey": "interval",
                            "levelValues": [
                              0.1
                            ]
                          },
                          "autoFinishByAction": false,
                          "useTimeDilationDt": false
                        }
                      },
                      {
                        "actionType": "GetTargetBuffBBAdvanced",
                        "actionIndex": 7,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[7]"
                        ],
                        "serverActionIndex": 7,
                        "buffBlackboardRead": {
                          "outputKey": "duration_temp",
                          "desiredKey": "duration",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent2"
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
                        "actionIndex": 8,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[8]"
                        ],
                        "serverActionIndex": 8,
                        "buffBlackboardRead": {
                          "outputKey": "atk_up_temp",
                          "desiredKey": "atk_up",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent1_exist"
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
                        "actionIndex": 9,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[9]"
                        ],
                        "serverActionIndex": 9,
                        "buffBlackboardRead": {
                          "outputKey": "physpell_up_temp",
                          "desiredKey": "physpell_up",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent1_exist"
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
                        "actionIndex": 10,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[10]"
                        ],
                        "serverActionIndex": 10,
                        "buffBlackboardRead": {
                          "outputKey": "max_stack_owner_temp",
                          "desiredKey": "max_stack_owner",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent1_exist"
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
                        "actionIndex": 11,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[11]"
                        ],
                        "serverActionIndex": 11,
                        "buffBlackboardRead": {
                          "outputKey": "max_stack_team_temp",
                          "desiredKey": "max_stack_team",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent1_exist"
                          ],
                          "tagQueryType": "hasAny",
                          "buffTagIds": []
                        },
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null
                      },
                      {
                        "actionType": "IfElseAction",
                        "actionIndex": 12,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[12]"
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
                            "[12]"
                          ],
                          "conditions": [
                            {
                              "sourceType": "CheckTargetsEqual",
                              "supported": false,
                              "comparison": null,
                              "left": null,
                              "right": null,
                              "skillTypes": [],
                              "poise": null,
                              "superArmor": null,
                              "twoDirectionAngle": null,
                              "targetAngle": null,
                              "targetIdentity": {
                                "first": {
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
                                "second": {
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
                                "[12]",
                                "succeedActions",
                                "actionData",
                                "[0]"
                              ],
                              "serverActionIndex": 14,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "buffApplication": {
                                "buffs": [
                                  {
                                    "buffId": "buff_chr_0029_pograni_talent1",
                                    "classification": null,
                                    "blackboardAssignments": {
                                      "duration": {
                                        "value": 0.0,
                                        "blackboardKey": "duration_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "atk_up": {
                                        "value": 0.0,
                                        "blackboardKey": "atk_up_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "physpell_up": {
                                        "value": 0.0,
                                        "blackboardKey": "physpell_up_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "max_stack": {
                                        "value": 0.0,
                                        "blackboardKey": "max_stack_owner_temp",
                                        "levelValues": [
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
                          "failActions": [
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
                                "[12]",
                                "failActions",
                                "actionData",
                                "[0]"
                              ],
                              "serverActionIndex": 15,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "buffApplication": {
                                "buffs": [
                                  {
                                    "buffId": "buff_chr_0029_pograni_talent1",
                                    "classification": null,
                                    "blackboardAssignments": {
                                      "duration": {
                                        "value": 0.0,
                                        "blackboardKey": "duration_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "atk_up": {
                                        "value": 0.0,
                                        "blackboardKey": "atk_up_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "physpell_up": {
                                        "value": 0.0,
                                        "blackboardKey": "physpell_up_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "max_stack": {
                                        "value": 0.0,
                                        "blackboardKey": "max_stack_team_temp",
                                        "levelValues": [
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
                    "conditionNegated": [],
                    "alwaysNext": false
                  },
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null
                }
              ],
              "priority": 0
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckTimedMarkerCondition",
                "CheckBuffStackNumAdvanced",
                "SpawnAbilityEntity",
                "FinishBuffAdvanced",
                "CreateTimedMarker",
                "CheckBuffStackNumAdvanced",
                "CheckBuffStackNumAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "IfElseAction"
              ],
              "combatActions": [
                "SpawnAbilityEntity",
                "CreateTimedMarker",
                "IfElseAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "CheckTimedMarkerCondition",
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
                  "serverActionIndex": 16,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 16,
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
                          "markerId": "chr_0029_pograni_soldier_attacked",
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
                        "actionType": "SpawnAbilityEntity",
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
                        "serverActionIndex": 18,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "abilityEntitySpawn": {
                          "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
                          "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_attack2",
                          "entityBlackboardAssignments": [],
                          "assignBlackboard": true,
                          "sourceType": "ActionSource",
                          "sourceContextKey": "",
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
                          "overrideDuration": null,
                          "saveToContextKey": null,
                          "dieWhenSourceDies": false,
                          "dieOnEnd": false
                        }
                      },
                      {
                        "actionType": "FinishBuffAdvanced",
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
                        "serverActionIndex": 19,
                        "buffFinish": {
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_ultimate_skill_count"
                          ],
                          "tagQueryType": "hasAny",
                          "buffTagIds": [],
                          "finishAll": false,
                          "limitSource": false,
                          "isFinishedEarly": false,
                          "isAbsorbed": false,
                          "finishLayerCount": {
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
                        "actionType": "CreateTimedMarker",
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
                        "serverActionIndex": 20,
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null,
                        "timedMarkerApplication": {
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "markerId": "chr_0029_pograni_soldier_attacked",
                          "duration": {
                            "value": 0.1,
                            "blackboardKey": "interval",
                            "levelValues": [
                              0.1
                            ]
                          },
                          "autoFinishByAction": false,
                          "useTimeDilationDt": false
                        }
                      },
                      {
                        "actionType": "GetTargetBuffBBAdvanced",
                        "actionIndex": 7,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[7]"
                        ],
                        "serverActionIndex": 23,
                        "buffBlackboardRead": {
                          "outputKey": "duration_temp",
                          "desiredKey": "duration",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent2"
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
                        "actionIndex": 8,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[8]"
                        ],
                        "serverActionIndex": 24,
                        "buffBlackboardRead": {
                          "outputKey": "atk_up_temp",
                          "desiredKey": "atk_up",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent1_exist"
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
                        "actionIndex": 9,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[9]"
                        ],
                        "serverActionIndex": 25,
                        "buffBlackboardRead": {
                          "outputKey": "physpell_up_temp",
                          "desiredKey": "physpell_up",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent1_exist"
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
                        "actionIndex": 10,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[10]"
                        ],
                        "serverActionIndex": 26,
                        "buffBlackboardRead": {
                          "outputKey": "max_stack_owner_temp",
                          "desiredKey": "max_stack_owner",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent1_exist"
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
                        "actionIndex": 11,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[11]"
                        ],
                        "serverActionIndex": 27,
                        "buffBlackboardRead": {
                          "outputKey": "max_stack_team_temp",
                          "desiredKey": "max_stack_team",
                          "targetSource": "Source",
                          "targetGroupKey": "",
                          "buffCheckType": "Id",
                          "buffIds": [
                            "buff_chr_0029_pograni_talent1_exist"
                          ],
                          "tagQueryType": "hasAny",
                          "buffTagIds": []
                        },
                        "legacyBuffFinish": null,
                        "skillCooldownAdjustment": null,
                        "buffIgnite": null
                      },
                      {
                        "actionType": "IfElseAction",
                        "actionIndex": 12,
                        "actionPath": [
                          "timelineActions[0]",
                          "_sequenceActionData",
                          "actionData",
                          "[0]",
                          "succeedActions",
                          "actionData",
                          "[12]"
                        ],
                        "serverActionIndex": 28,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 28,
                          "actionPath": [
                            "timelineActions[0]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[12]"
                          ],
                          "conditions": [
                            {
                              "sourceType": "CheckTargetsEqual",
                              "supported": false,
                              "comparison": null,
                              "left": null,
                              "right": null,
                              "skillTypes": [],
                              "poise": null,
                              "superArmor": null,
                              "twoDirectionAngle": null,
                              "targetAngle": null,
                              "targetIdentity": {
                                "first": {
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
                                "second": {
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
                                "[12]",
                                "succeedActions",
                                "actionData",
                                "[0]"
                              ],
                              "serverActionIndex": 30,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "buffApplication": {
                                "buffs": [
                                  {
                                    "buffId": "buff_chr_0029_pograni_talent1",
                                    "classification": null,
                                    "blackboardAssignments": {
                                      "duration": {
                                        "value": 0.0,
                                        "blackboardKey": "duration_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "atk_up": {
                                        "value": 0.0,
                                        "blackboardKey": "atk_up_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "physpell_up": {
                                        "value": 0.0,
                                        "blackboardKey": "physpell_up_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "max_stack": {
                                        "value": 0.0,
                                        "blackboardKey": "max_stack_owner_temp",
                                        "levelValues": [
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
                          "failActions": [
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
                                "[12]",
                                "failActions",
                                "actionData",
                                "[0]"
                              ],
                              "serverActionIndex": 31,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "buffApplication": {
                                "buffs": [
                                  {
                                    "buffId": "buff_chr_0029_pograni_talent1",
                                    "classification": null,
                                    "blackboardAssignments": {
                                      "duration": {
                                        "value": 0.0,
                                        "blackboardKey": "duration_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "atk_up": {
                                        "value": 0.0,
                                        "blackboardKey": "atk_up_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "physpell_up": {
                                        "value": 0.0,
                                        "blackboardKey": "physpell_up_temp",
                                        "levelValues": [
                                          0.0
                                        ]
                                      },
                                      "max_stack": {
                                        "value": 0.0,
                                        "blackboardKey": "max_stack_team_temp",
                                        "levelValues": [
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
          "event": "OnBeforeTakeDamage",
          "orderedActionTypes": [
            "CheckTimedMarkerCondition",
            "CheckTargetsEqual",
            "CheckBuffStackNumAdvanced",
            "CheckDamageDecorateMask",
            "FinishBuffAdvanced",
            "CreateBuffAction",
            "CreateTimedMarker",
            "CheckBuffStackNumAdvanced",
            "CheckBuffStackNumAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "CreateBuffAction",
            "CheckTimedMarkerCondition",
            "CheckTargetsEqual",
            "CheckBuffStackNumAdvanced",
            "CheckDamageDecorateMask",
            "SpawnAbilityEntity",
            "FinishBuffAdvanced",
            "CreateTimedMarker",
            "CheckBuffStackNumAdvanced",
            "CheckBuffStackNumAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "GetTargetBuffBBAdvanced",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CheckTargetsEqual",
            "CreateBuffAction",
            "CreateTimedMarker",
            "SpawnAbilityEntity"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 37,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0029_pograni_ultimate_skill_finall_rush",
                    "classification": null,
                    "blackboardAssignments": {
                      "atk_scale_final": {
                        "value": 0.0,
                        "blackboardKey": "atk_scale_final",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "atb_final": {
                        "value": 0.0,
                        "blackboardKey": "atb_final",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "poise_final": {
                        "value": 0.0,
                        "blackboardKey": "poise_final",
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
              "actionIndex": 45,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0029_pograni_talent1",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration_temp",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "atk_up": {
                        "value": 0.0,
                        "blackboardKey": "atk_up_temp",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "physpell_up": {
                        "value": 0.0,
                        "blackboardKey": "physpell_up_temp",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "max_stack": {
                        "value": 0.0,
                        "blackboardKey": "max_stack_owner_temp",
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
            },
            {
              "actionIndex": 59,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0029_pograni_talent1",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration_temp",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "atk_up": {
                        "value": 0.0,
                        "blackboardKey": "atk_up_temp",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "physpell_up": {
                        "value": 0.0,
                        "blackboardKey": "physpell_up_temp",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "max_stack": {
                        "value": 0.0,
                        "blackboardKey": "max_stack_owner_temp",
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
            "buff_chr_0029_pograni_talent1",
            "buff_chr_0029_pograni_ultimate_skill_finall_rush"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckTimedMarkerCondition",
                "CheckTargetsEqual",
                "CheckBuffStackNumAdvanced",
                "CheckDamageDecorateMask",
                "FinishBuffAdvanced",
                "CreateBuffAction",
                "CreateTimedMarker",
                "CheckBuffStackNumAdvanced",
                "CheckBuffStackNumAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CheckTargetsEqual",
                "CreateBuffAction",
                "CreateTimedMarker",
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 37,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0029_pograni_ultimate_skill_finall_rush",
                        "classification": null,
                        "blackboardAssignments": {
                          "atk_scale_final": {
                            "value": 0.0,
                            "blackboardKey": "atk_scale_final",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "atb_final": {
                            "value": 0.0,
                            "blackboardKey": "atb_final",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "poise_final": {
                            "value": 0.0,
                            "blackboardKey": "poise_final",
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
                  "actionIndex": 45,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0029_pograni_talent1",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration_temp",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "atk_up": {
                            "value": 0.0,
                            "blackboardKey": "atk_up_temp",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "physpell_up": {
                            "value": 0.0,
                            "blackboardKey": "physpell_up_temp",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "max_stack": {
                            "value": 0.0,
                            "blackboardKey": "max_stack_owner_temp",
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
                  "actionType": "CheckTimedMarkerCondition",
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
                  "serverActionIndex": 32,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 32,
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
                          "markerId": "chr_0029_pograni_soldier_attacked",
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
                        "actionType": "CheckTargetsEqual",
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
                        "serverActionIndex": 33,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 33,
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
                              "sourceType": "CheckTargetsEqual",
                              "supported": false,
                              "comparison": null,
                              "left": null,
                              "right": null,
                              "skillTypes": [],
                              "poise": null,
                              "superArmor": null,
                              "twoDirectionAngle": null,
                              "targetAngle": null,
                              "targetIdentity": {
                                "first": {
                                  "targetSource": "InstantSearch",
                                  "targetGroupKey": "",
                                  "selectorOwner": "ActionSource",
                                  "ownerContextKey": "",
                                  "centerType": "ActionSource",
                                  "centerContextKey": "",
                                  "centerToGround": false,
                                  "target": "ActionSource",
                                  "targetContextKey": "",
                                  "enableAdvancedDirection": false,
                                  "selectorDirection": "SourceForward",
                                  "finderType": "SourceFinder",
                                  "validatorTypes": [],
                                  "postProcessorTypes": []
                                },
                                "second": {
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
                              "actionType": "CheckDamageDecorateMask",
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
                              "serverActionIndex": 35,
                              "nestedCondition": {
                                "startFrame": 0,
                                "endFrame": 0,
                                "actionIndex": 35,
                                "actionPath": [
                                  "timelineActions[0]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[3]"
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
                                      "checkType": "HasAll",
                                      "mask": 8192
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
                                    "actionType": "FinishBuffAdvanced",
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
                                    "serverActionIndex": 36,
                                    "buffFinish": {
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_ultimate_skill_count"
                                      ],
                                      "tagQueryType": "hasAny",
                                      "buffTagIds": [],
                                      "finishAll": false,
                                      "limitSource": false,
                                      "isFinishedEarly": false,
                                      "isAbsorbed": false,
                                      "finishLayerCount": {
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
                                    "actionType": "CreateBuffAction",
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
                                    "serverActionIndex": 37,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "buffApplication": {
                                      "buffs": [
                                        {
                                          "buffId": "buff_chr_0029_pograni_ultimate_skill_finall_rush",
                                          "classification": null,
                                          "blackboardAssignments": {
                                            "atk_scale_final": {
                                              "value": 0.0,
                                              "blackboardKey": "atk_scale_final",
                                              "levelValues": [
                                                0.0
                                              ]
                                            },
                                            "atb_final": {
                                              "value": 0.0,
                                              "blackboardKey": "atb_final",
                                              "levelValues": [
                                                0.0
                                              ]
                                            },
                                            "poise_final": {
                                              "value": 0.0,
                                              "blackboardKey": "poise_final",
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
                                    "actionType": "CreateTimedMarker",
                                    "actionIndex": 6,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[6]"
                                    ],
                                    "serverActionIndex": 38,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "timedMarkerApplication": {
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "markerId": "chr_0029_pograni_soldier_attacked",
                                      "duration": {
                                        "value": 0.1,
                                        "blackboardKey": "interval",
                                        "levelValues": [
                                          0.1
                                        ]
                                      },
                                      "autoFinishByAction": false,
                                      "useTimeDilationDt": false
                                    }
                                  },
                                  {
                                    "actionType": "GetTargetBuffBBAdvanced",
                                    "actionIndex": 9,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[9]"
                                    ],
                                    "serverActionIndex": 41,
                                    "buffBlackboardRead": {
                                      "outputKey": "duration_temp",
                                      "desiredKey": "duration",
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_talent2"
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
                                    "actionIndex": 10,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[10]"
                                    ],
                                    "serverActionIndex": 42,
                                    "buffBlackboardRead": {
                                      "outputKey": "atk_up_temp",
                                      "desiredKey": "atk_up",
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_talent1_exist"
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
                                    "actionIndex": 11,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[11]"
                                    ],
                                    "serverActionIndex": 43,
                                    "buffBlackboardRead": {
                                      "outputKey": "physpell_up_temp",
                                      "desiredKey": "physpell_up",
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_talent1_exist"
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
                                    "actionIndex": 12,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[12]"
                                    ],
                                    "serverActionIndex": 44,
                                    "buffBlackboardRead": {
                                      "outputKey": "max_stack_owner_temp",
                                      "desiredKey": "max_stack_owner",
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_talent1_exist"
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
                                    "actionIndex": 13,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[13]"
                                    ],
                                    "serverActionIndex": 45,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "buffApplication": {
                                      "buffs": [
                                        {
                                          "buffId": "buff_chr_0029_pograni_talent1",
                                          "classification": null,
                                          "blackboardAssignments": {
                                            "duration": {
                                              "value": 0.0,
                                              "blackboardKey": "duration_temp",
                                              "levelValues": [
                                                0.0
                                              ]
                                            },
                                            "atk_up": {
                                              "value": 0.0,
                                              "blackboardKey": "atk_up_temp",
                                              "levelValues": [
                                                0.0
                                              ]
                                            },
                                            "physpell_up": {
                                              "value": 0.0,
                                              "blackboardKey": "physpell_up_temp",
                                              "levelValues": [
                                                0.0
                                              ]
                                            },
                                            "max_stack": {
                                              "value": 0.0,
                                              "blackboardKey": "max_stack_owner_temp",
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
            },
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckTimedMarkerCondition",
                "CheckTargetsEqual",
                "CheckBuffStackNumAdvanced",
                "CheckDamageDecorateMask",
                "SpawnAbilityEntity",
                "FinishBuffAdvanced",
                "CreateTimedMarker",
                "CheckBuffStackNumAdvanced",
                "CheckBuffStackNumAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "GetTargetBuffBBAdvanced",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CheckTargetsEqual",
                "SpawnAbilityEntity",
                "CreateTimedMarker",
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 59,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0029_pograni_talent1",
                        "classification": null,
                        "blackboardAssignments": {
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration_temp",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "atk_up": {
                            "value": 0.0,
                            "blackboardKey": "atk_up_temp",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "physpell_up": {
                            "value": 0.0,
                            "blackboardKey": "physpell_up_temp",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "max_stack": {
                            "value": 0.0,
                            "blackboardKey": "max_stack_owner_temp",
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
                  "actionType": "CheckTimedMarkerCondition",
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
                  "serverActionIndex": 46,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 0,
                    "actionIndex": 46,
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
                          "markerId": "chr_0029_pograni_soldier_attacked",
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
                        "actionType": "CheckTargetsEqual",
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
                        "serverActionIndex": 47,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 47,
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
                              "sourceType": "CheckTargetsEqual",
                              "supported": false,
                              "comparison": null,
                              "left": null,
                              "right": null,
                              "skillTypes": [],
                              "poise": null,
                              "superArmor": null,
                              "twoDirectionAngle": null,
                              "targetAngle": null,
                              "targetIdentity": {
                                "first": {
                                  "targetSource": "InstantSearch",
                                  "targetGroupKey": "",
                                  "selectorOwner": "ActionSource",
                                  "ownerContextKey": "",
                                  "centerType": "ActionSource",
                                  "centerContextKey": "",
                                  "centerToGround": false,
                                  "target": "ActionSource",
                                  "targetContextKey": "",
                                  "enableAdvancedDirection": false,
                                  "selectorDirection": "SourceForward",
                                  "finderType": "SourceFinder",
                                  "validatorTypes": [],
                                  "postProcessorTypes": []
                                },
                                "second": {
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
                              "actionType": "CheckDamageDecorateMask",
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
                              "serverActionIndex": 49,
                              "nestedCondition": {
                                "startFrame": 0,
                                "endFrame": 0,
                                "actionIndex": 49,
                                "actionPath": [
                                  "timelineActions[0]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "succeedActions",
                                  "actionData",
                                  "[3]"
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
                                      "checkType": "HasAll",
                                      "mask": 8192
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
                                    "actionType": "SpawnAbilityEntity",
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
                                    "serverActionIndex": 50,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "abilityEntitySpawn": {
                                      "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
                                      "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_attack2",
                                      "entityBlackboardAssignments": [],
                                      "assignBlackboard": true,
                                      "sourceType": "ActionSource",
                                      "sourceContextKey": "",
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
                                      "overrideDuration": null,
                                      "saveToContextKey": null,
                                      "dieWhenSourceDies": false,
                                      "dieOnEnd": false
                                    }
                                  },
                                  {
                                    "actionType": "FinishBuffAdvanced",
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
                                    "serverActionIndex": 51,
                                    "buffFinish": {
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_ultimate_skill_count"
                                      ],
                                      "tagQueryType": "hasAny",
                                      "buffTagIds": [],
                                      "finishAll": false,
                                      "limitSource": false,
                                      "isFinishedEarly": false,
                                      "isAbsorbed": false,
                                      "finishLayerCount": {
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
                                    "actionType": "CreateTimedMarker",
                                    "actionIndex": 6,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[6]"
                                    ],
                                    "serverActionIndex": 52,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "timedMarkerApplication": {
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "markerId": "chr_0029_pograni_soldier_attacked",
                                      "duration": {
                                        "value": 0.1,
                                        "blackboardKey": "interval",
                                        "levelValues": [
                                          0.1
                                        ]
                                      },
                                      "autoFinishByAction": false,
                                      "useTimeDilationDt": false
                                    }
                                  },
                                  {
                                    "actionType": "GetTargetBuffBBAdvanced",
                                    "actionIndex": 9,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[9]"
                                    ],
                                    "serverActionIndex": 55,
                                    "buffBlackboardRead": {
                                      "outputKey": "duration_temp",
                                      "desiredKey": "duration",
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_talent2"
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
                                    "actionIndex": 10,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[10]"
                                    ],
                                    "serverActionIndex": 56,
                                    "buffBlackboardRead": {
                                      "outputKey": "atk_up_temp",
                                      "desiredKey": "atk_up",
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_talent1_exist"
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
                                    "actionIndex": 11,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[11]"
                                    ],
                                    "serverActionIndex": 57,
                                    "buffBlackboardRead": {
                                      "outputKey": "physpell_up_temp",
                                      "desiredKey": "physpell_up",
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_talent1_exist"
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
                                    "actionIndex": 12,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[12]"
                                    ],
                                    "serverActionIndex": 58,
                                    "buffBlackboardRead": {
                                      "outputKey": "max_stack_owner_temp",
                                      "desiredKey": "max_stack_owner",
                                      "targetSource": "Source",
                                      "targetGroupKey": "",
                                      "buffCheckType": "Id",
                                      "buffIds": [
                                        "buff_chr_0029_pograni_talent1_exist"
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
                                    "actionIndex": 13,
                                    "actionPath": [
                                      "timelineActions[0]",
                                      "_sequenceActionData",
                                      "actionData",
                                      "[0]",
                                      "succeedActions",
                                      "actionData",
                                      "[13]"
                                    ],
                                    "serverActionIndex": 59,
                                    "legacyBuffFinish": null,
                                    "skillCooldownAdjustment": null,
                                    "buffIgnite": null,
                                    "buffApplication": {
                                      "buffs": [
                                        {
                                          "buffId": "buff_chr_0029_pograni_talent1",
                                          "classification": null,
                                          "blackboardAssignments": {
                                            "duration": {
                                              "value": 0.0,
                                              "blackboardKey": "duration_temp",
                                              "levelValues": [
                                                0.0
                                              ]
                                            },
                                            "atk_up": {
                                              "value": 0.0,
                                              "blackboardKey": "atk_up_temp",
                                              "levelValues": [
                                                0.0
                                              ]
                                            },
                                            "physpell_up": {
                                              "value": 0.0,
                                              "blackboardKey": "physpell_up_temp",
                                              "levelValues": [
                                                0.0
                                              ]
                                            },
                                            "max_stack": {
                                              "value": 0.0,
                                              "blackboardKey": "max_stack_owner_temp",
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
      "buffId": "buff_chr_0029_pograni_ultimate_skill_count",
      "sourceFile": "buff_chr_0029_pograni_ultimate_skill_count.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 20.0,
          "blackboardKey": "duration",
          "levelValues": [
            30.0
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
          "value": 99.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "count",
          "value": 4.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 30.0,
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
        "spritePath": "icon_battle_pograni_buff",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": true,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "LifeTime",
        "abnormalColorType": "Physical",
        "orderUseDirectoryValue": false,
        "orderPriorityValue": 0,
        "orderPriorityEnum": "AttentionDebuff"
      },
      "keywordEnhancements": []
    },
    {
      "buffId": "buff_chr_0029_pograni_ultimate_skill_finall_rush",
      "sourceFile": "buff_chr_0029_pograni_ultimate_skill_finall_rush.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 1.2,
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
          "key": "atb_final",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_final",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "count",
          "value": 4.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "poise_final",
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
      "eventActions": [],
      "igniteEventActions": [],
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [
        "SpawnAbilityEntity"
      ],
      "unparsedPayloads": [],
      "auraActions": [],
      "abilityEntityHits": [
        {
          "spawnFrame": 0,
          "actionOrder": [
            0
          ],
          "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
          "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_finish4",
          "sourceFile": "chr_0029_pograni_ultimate_skill_abilityentity_finish4.json",
          "entityBlackboardAssignments": [],
          "spawnPayload": {
            "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
            "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_finish4",
            "entityBlackboardAssignments": [],
            "assignBlackboard": true,
            "sourceType": "ActionSource",
            "sourceContextKey": "",
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
            "overrideDuration": null,
            "saveToContextKey": null,
            "dieWhenSourceDies": false,
            "dieOnEnd": false
          },
          "directDamageHits": [],
          "intervalDamageHits": [],
          "explicitFinishes": [
            {
              "startFrame": 75,
              "endFrame": 78,
              "actionIndex": 4,
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
              "sequenceIndex": 4
            }
          ],
          "timelineJumps": [],
          "conditionalActions": [
            {
              "startFrame": 25,
              "endFrame": 52,
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[7]",
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
                    "markerId": "chr_0029_pograni_ultimate_finalhit",
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
                  "actionType": "ObtainCostAction",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 11,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb_final",
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
                    "spGainSource": "skill",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                },
                {
                  "actionType": "CreateTimedMarker",
                  "actionIndex": 3,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[3]"
                  ],
                  "serverActionIndex": 12,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "timedMarkerApplication": {
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "markerId": "chr_0029_pograni_ultimate_finalhit",
                    "duration": {
                      "value": 0.1,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "autoFinishByAction": false,
                    "useTimeDilationDt": false
                  }
                },
                {
                  "actionType": "DamageAction",
                  "actionIndex": 4,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[4]"
                  ],
                  "serverActionIndex": 13,
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
                        "blackboardKey": "atk_scale_final",
                        "levelValues": [
                          0.0
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
                        "blackboardKey": "poise_final",
                        "levelValues": [
                          0.0
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
            }
          ],
          "inflictions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileTriggeredSkills": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "inheritsSourceBlackboard": true,
          "declaredBlackboard": [
            {
              "key": "atb_final",
              "value": 50.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_final",
              "value": 1.0,
              "isDynamic": false
            },
            {
              "key": "minAngle",
              "value": 0.0,
              "isDynamic": true
            },
            {
              "key": "number",
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
              "key": "poise_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 5.0,
              "isDynamic": false
            }
          ],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [
            {
              "startFrame": 31,
              "endFrame": 38,
              "actionIndex": 5,
              "targetSource": "Source",
              "targetGroupKey": "",
              "buffCheckType": "Id",
              "buffIds": [
                "buff_chr_0029_pograni_ultimate_skill"
              ],
              "tagQueryType": "hasAny",
              "buffTagIds": [],
              "finishAll": true,
              "limitSource": false,
              "isFinishedEarly": false,
              "isAbsorbed": false,
              "finishLayerCount": null,
              "sourceActionType": "FinishBuffAdvanced",
              "sequenceIndex": 5
            }
          ],
          "auraActions": [],
          "presentationOnlySwitchActionIndexes": []
        },
        {
          "spawnFrame": 0,
          "actionOrder": [
            1
          ],
          "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
          "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_finish4",
          "sourceFile": "chr_0029_pograni_ultimate_skill_abilityentity_finish4.json",
          "entityBlackboardAssignments": [],
          "spawnPayload": {
            "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
            "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_finish4",
            "entityBlackboardAssignments": [],
            "assignBlackboard": true,
            "sourceType": "ActionSource",
            "sourceContextKey": "",
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
            "overrideDuration": null,
            "saveToContextKey": null,
            "dieWhenSourceDies": false,
            "dieOnEnd": false
          },
          "directDamageHits": [],
          "intervalDamageHits": [],
          "explicitFinishes": [
            {
              "startFrame": 75,
              "endFrame": 78,
              "actionIndex": 4,
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
              "sequenceIndex": 4
            }
          ],
          "timelineJumps": [],
          "conditionalActions": [
            {
              "startFrame": 25,
              "endFrame": 52,
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[7]",
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
                    "markerId": "chr_0029_pograni_ultimate_finalhit",
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
                  "actionType": "ObtainCostAction",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 11,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb_final",
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
                    "spGainSource": "skill",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                },
                {
                  "actionType": "CreateTimedMarker",
                  "actionIndex": 3,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[3]"
                  ],
                  "serverActionIndex": 12,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "timedMarkerApplication": {
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "markerId": "chr_0029_pograni_ultimate_finalhit",
                    "duration": {
                      "value": 0.1,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "autoFinishByAction": false,
                    "useTimeDilationDt": false
                  }
                },
                {
                  "actionType": "DamageAction",
                  "actionIndex": 4,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[4]"
                  ],
                  "serverActionIndex": 13,
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
                        "blackboardKey": "atk_scale_final",
                        "levelValues": [
                          0.0
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
                        "blackboardKey": "poise_final",
                        "levelValues": [
                          0.0
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
            }
          ],
          "inflictions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileTriggeredSkills": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "inheritsSourceBlackboard": true,
          "declaredBlackboard": [
            {
              "key": "atb_final",
              "value": 50.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_final",
              "value": 1.0,
              "isDynamic": false
            },
            {
              "key": "minAngle",
              "value": 0.0,
              "isDynamic": true
            },
            {
              "key": "number",
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
              "key": "poise_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 5.0,
              "isDynamic": false
            }
          ],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [
            {
              "startFrame": 31,
              "endFrame": 38,
              "actionIndex": 5,
              "targetSource": "Source",
              "targetGroupKey": "",
              "buffCheckType": "Id",
              "buffIds": [
                "buff_chr_0029_pograni_ultimate_skill"
              ],
              "tagQueryType": "hasAny",
              "buffTagIds": [],
              "finishAll": true,
              "limitSource": false,
              "isFinishedEarly": false,
              "isAbsorbed": false,
              "finishLayerCount": null,
              "sourceActionType": "FinishBuffAdvanced",
              "sequenceIndex": 5
            }
          ],
          "auraActions": [],
          "presentationOnlySwitchActionIndexes": []
        },
        {
          "spawnFrame": 0,
          "actionOrder": [
            2
          ],
          "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
          "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_finish4",
          "sourceFile": "chr_0029_pograni_ultimate_skill_abilityentity_finish4.json",
          "entityBlackboardAssignments": [],
          "spawnPayload": {
            "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
            "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_finish4",
            "entityBlackboardAssignments": [],
            "assignBlackboard": true,
            "sourceType": "ActionSource",
            "sourceContextKey": "",
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
            "overrideDuration": null,
            "saveToContextKey": null,
            "dieWhenSourceDies": false,
            "dieOnEnd": false
          },
          "directDamageHits": [],
          "intervalDamageHits": [],
          "explicitFinishes": [
            {
              "startFrame": 75,
              "endFrame": 78,
              "actionIndex": 4,
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
              "sequenceIndex": 4
            }
          ],
          "timelineJumps": [],
          "conditionalActions": [
            {
              "startFrame": 25,
              "endFrame": 52,
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[7]",
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
                    "markerId": "chr_0029_pograni_ultimate_finalhit",
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
                  "actionType": "ObtainCostAction",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 11,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb_final",
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
                    "spGainSource": "skill",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                },
                {
                  "actionType": "CreateTimedMarker",
                  "actionIndex": 3,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[3]"
                  ],
                  "serverActionIndex": 12,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "timedMarkerApplication": {
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "markerId": "chr_0029_pograni_ultimate_finalhit",
                    "duration": {
                      "value": 0.1,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "autoFinishByAction": false,
                    "useTimeDilationDt": false
                  }
                },
                {
                  "actionType": "DamageAction",
                  "actionIndex": 4,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[4]"
                  ],
                  "serverActionIndex": 13,
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
                        "blackboardKey": "atk_scale_final",
                        "levelValues": [
                          0.0
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
                        "blackboardKey": "poise_final",
                        "levelValues": [
                          0.0
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
            }
          ],
          "inflictions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileTriggeredSkills": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "inheritsSourceBlackboard": true,
          "declaredBlackboard": [
            {
              "key": "atb_final",
              "value": 50.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_final",
              "value": 1.0,
              "isDynamic": false
            },
            {
              "key": "minAngle",
              "value": 0.0,
              "isDynamic": true
            },
            {
              "key": "number",
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
              "key": "poise_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 5.0,
              "isDynamic": false
            }
          ],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [
            {
              "startFrame": 31,
              "endFrame": 38,
              "actionIndex": 5,
              "targetSource": "Source",
              "targetGroupKey": "",
              "buffCheckType": "Id",
              "buffIds": [
                "buff_chr_0029_pograni_ultimate_skill"
              ],
              "tagQueryType": "hasAny",
              "buffTagIds": [],
              "finishAll": true,
              "limitSource": false,
              "isFinishedEarly": false,
              "isAbsorbed": false,
              "finishLayerCount": null,
              "sourceActionType": "FinishBuffAdvanced",
              "sequenceIndex": 5
            }
          ],
          "auraActions": [],
          "presentationOnlySwitchActionIndexes": []
        },
        {
          "spawnFrame": 0,
          "actionOrder": [
            3
          ],
          "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
          "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_finish4",
          "sourceFile": "chr_0029_pograni_ultimate_skill_abilityentity_finish4.json",
          "entityBlackboardAssignments": [],
          "spawnPayload": {
            "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
            "skillId": "chr_0029_pograni_ultimate_skill_abilityentity_finish4",
            "entityBlackboardAssignments": [],
            "assignBlackboard": true,
            "sourceType": "ActionSource",
            "sourceContextKey": "",
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
            "overrideDuration": null,
            "saveToContextKey": null,
            "dieWhenSourceDies": false,
            "dieOnEnd": false
          },
          "directDamageHits": [],
          "intervalDamageHits": [],
          "explicitFinishes": [
            {
              "startFrame": 75,
              "endFrame": 78,
              "actionIndex": 4,
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
              "sequenceIndex": 4
            }
          ],
          "timelineJumps": [],
          "conditionalActions": [
            {
              "startFrame": 25,
              "endFrame": 52,
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[7]",
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
                    "markerId": "chr_0029_pograni_ultimate_finalhit",
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
                  "actionType": "ObtainCostAction",
                  "actionIndex": 2,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[2]"
                  ],
                  "serverActionIndex": 11,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "resourceGain": {
                    "resource": "sp",
                    "amount": {
                      "value": 0.0,
                      "blackboardKey": "atb_final",
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
                    "spGainSource": "skill",
                    "onlyMainOperator": false,
                    "isPercentValue": false,
                    "useUltimateRecoveryTag": false,
                    "ultimateRecoveryTagId": 0,
                    "ignoreUltimateGainScalar": false
                  }
                },
                {
                  "actionType": "CreateTimedMarker",
                  "actionIndex": 3,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[3]"
                  ],
                  "serverActionIndex": 12,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "timedMarkerApplication": {
                    "targetSource": "Source",
                    "targetGroupKey": "",
                    "markerId": "chr_0029_pograni_ultimate_finalhit",
                    "duration": {
                      "value": 0.1,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "autoFinishByAction": false,
                    "useTimeDilationDt": false
                  }
                },
                {
                  "actionType": "DamageAction",
                  "actionIndex": 4,
                  "actionPath": [
                    "timelineActions[7]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "succeedActions",
                    "actionData",
                    "[4]"
                  ],
                  "serverActionIndex": 13,
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
                        "blackboardKey": "atk_scale_final",
                        "levelValues": [
                          0.0
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
                        "blackboardKey": "poise_final",
                        "levelValues": [
                          0.0
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
            }
          ],
          "inflictions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileTriggeredSkills": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "inheritsSourceBlackboard": true,
          "declaredBlackboard": [
            {
              "key": "atb_final",
              "value": 50.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_final",
              "value": 1.0,
              "isDynamic": false
            },
            {
              "key": "minAngle",
              "value": 0.0,
              "isDynamic": true
            },
            {
              "key": "number",
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
              "key": "poise_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 5.0,
              "isDynamic": false
            }
          ],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [
            {
              "startFrame": 31,
              "endFrame": 38,
              "actionIndex": 5,
              "targetSource": "Source",
              "targetGroupKey": "",
              "buffCheckType": "Id",
              "buffIds": [
                "buff_chr_0029_pograni_ultimate_skill"
              ],
              "tagQueryType": "hasAny",
              "buffTagIds": [],
              "finishAll": true,
              "limitSource": false,
              "isFinishedEarly": false,
              "isAbsorbed": false,
              "finishLayerCount": null,
              "sourceActionType": "FinishBuffAdvanced",
              "sequenceIndex": 5
            }
          ],
          "auraActions": [],
          "presentationOnlySwitchActionIndexes": []
        }
      ],
      "invokedAbilityEntitySkills": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 0,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity_finish4",
          "classification": null,
          "targetSource": "",
          "targetGroupKey": "",
          "count": null,
          "buffSource": null,
          "inheritSourceSkillCastInfo": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "buffSourceContextKey": null,
          "sequenceIndex": 0,
          "autoFinishByAction": null
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 1,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity_finish4",
          "classification": null,
          "targetSource": "",
          "targetGroupKey": "",
          "count": null,
          "buffSource": null,
          "inheritSourceSkillCastInfo": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "buffSourceContextKey": null,
          "sequenceIndex": 1,
          "autoFinishByAction": null
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 2,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity_finish4",
          "classification": null,
          "targetSource": "",
          "targetGroupKey": "",
          "count": null,
          "buffSource": null,
          "inheritSourceSkillCastInfo": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "buffSourceContextKey": null,
          "sequenceIndex": 2,
          "autoFinishByAction": null
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 3,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity_finish4",
          "classification": null,
          "targetSource": "",
          "targetGroupKey": "",
          "count": null,
          "buffSource": null,
          "inheritSourceSkillCastInfo": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [
            "CreateTimedMarker",
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "buffSourceContextKey": null,
          "sequenceIndex": 3,
          "autoFinishByAction": null
        }
      ],
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
      "key": "basicAttack1",
      "skillId": "chr_0029_pograni_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0029_pograni_attack1.json",
      "timelineBlockFrames": 12,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 8,
      "allowNextWindows": [
        {
          "startFrame": 12,
          "endFrame": 29,
          "skillIds": [
            "chr_0029_pograni_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 7,
          "endFrame": 29,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0029_pograni_attack2",
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
          "endFrame": 118,
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
          "endFrame": 118,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 9,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 9,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 51,
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
          "endFrame": 118,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 32,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 28,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 109,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 29,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 29,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 8,
          "endFrame": 9,
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
          "sequenceIndex": 4
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 8,
          "endFrame": 9,
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
              "actionType": "ObtainCostAction",
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
          "value": 0.42,
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
          "startFrame": 8,
          "endFrame": 9,
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
          "startFrame": 8,
          "endFrame": 9,
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
              "actionType": "ObtainCostAction",
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
      "skillId": "chr_0029_pograni_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0029_pograni_attack2.json",
      "timelineBlockFrames": 19,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 8,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 7,
      "allowNextWindows": [
        {
          "startFrame": 19,
          "endFrame": 39,
          "skillIds": [
            "chr_0029_pograni_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 7,
          "endFrame": 39,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0029_pograni_attack3",
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
          "endFrame": 124,
          "actionTypes": [
            "PlayAnimationWithStep"
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
          "endFrame": 95,
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
          "startFrame": 14,
          "endFrame": 15,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 13,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 20,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 48,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 56,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 58,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "endFrame": 51,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 39,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 37,
          "endFrame": 92,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 39,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 39,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 7,
          "endFrame": 13,
          "actionIndex": 5,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.14,
                  0.15,
                  0.17,
                  0.18,
                  0.2,
                  0.21,
                  0.22,
                  0.24,
                  0.25,
                  0.27,
                  0.29,
                  0.32
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
          "startFrame": 14,
          "endFrame": 20,
          "actionIndex": 13,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.14,
                  0.15,
                  0.17,
                  0.18,
                  0.2,
                  0.21,
                  0.22,
                  0.24,
                  0.25,
                  0.27,
                  0.29,
                  0.32
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
          "endFrame": 13,
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[5]",
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
        {
          "startFrame": 14,
          "endFrame": 20,
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[6]",
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
            0.14,
            0.15,
            0.17,
            0.18,
            0.2,
            0.21,
            0.22,
            0.24,
            0.25,
            0.27,
            0.29,
            0.32
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
          "value": 0.5,
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
          "startFrame": 14,
          "endFrame": 15,
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
          "endFrame": 13,
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[5]",
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
        {
          "startFrame": 14,
          "endFrame": 20,
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[6]",
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
      "skillId": "chr_0029_pograni_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0029_pograni_attack3.json",
      "timelineBlockFrames": 19,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 12,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 9,
      "allowNextWindows": [
        {
          "startFrame": 19,
          "endFrame": 37,
          "skillIds": [
            "chr_0029_pograni_attack4"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 11,
          "endFrame": 37,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0029_pograni_attack4",
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
          "endFrame": 175,
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
          "startFrame": 11,
          "endFrame": 15,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 9,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 29,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 48,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 48,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 29,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 3,
          "endFrame": 39,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 45,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 135,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 37,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 37,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionIndex": 10,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
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
                  0.0,
                  0.0,
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
          "sequenceIndex": 8
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionIndex": 17,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
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
                  0.0,
                  0.0,
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
          "sequenceIndex": 9
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[8]",
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
              "serverActionIndex": 14,
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
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionIndex": 19,
          "actionPath": [
            "timelineActions[9]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[9]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 21,
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
          "value": 0.56,
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
          "startFrame": 9,
          "endFrame": 10,
          "actionIndex": 8,
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
          "startFrame": 15,
          "endFrame": 16,
          "actionIndex": 9,
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
          "startFrame": 9,
          "endFrame": 10,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[8]",
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
              "serverActionIndex": 14,
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
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionIndex": 19,
          "actionPath": [
            "timelineActions[9]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[9]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 21,
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
      "skillId": "chr_0029_pograni_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0029_pograni_attack4.json",
      "timelineBlockFrames": 18,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 8,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 3,
      "allowNextWindows": [
        {
          "startFrame": 18,
          "endFrame": 33,
          "skillIds": [
            "chr_0029_pograni_attack5"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 10,
          "endFrame": 33,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0029_pograni_attack5",
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
          "endFrame": 1,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionTypes": [
            "DisableRootMotionAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 4,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
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
          "startFrame": 3,
          "endFrame": 4,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 20,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 13,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 17,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 39,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 39,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 39,
          "actionTypes": [
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 63,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 43,
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
          "startFrame": 12,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 25,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 25,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 25,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 27,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 27,
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
          "endFrame": 26,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 37,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 62,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 41,
          "endFrame": 115,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 33,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 33,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 3,
          "endFrame": 4,
          "actionIndex": 8,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.06,
                  0.07,
                  0.08,
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.11,
                  0.12,
                  0.13,
                  0.14
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
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
                  0.0,
                  0.0,
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
          "sequenceIndex": 8
        },
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionIndex": 15,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.06,
                  0.07,
                  0.08,
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.11,
                  0.12,
                  0.13,
                  0.14
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
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
                  0.0,
                  0.0,
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
          "sequenceIndex": 9
        },
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 22,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.06,
                  0.07,
                  0.08,
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.11,
                  0.12,
                  0.13,
                  0.14
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
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
                  0.0,
                  0.0,
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
          "sequenceIndex": 10
        },
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionIndex": 31,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.06,
                  0.07,
                  0.08,
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.11,
                  0.12,
                  0.13,
                  0.14
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
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
                  0.0,
                  0.0,
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
          "sequenceIndex": 13
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionIndex": 38,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.06,
                  0.07,
                  0.08,
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.11,
                  0.12,
                  0.13,
                  0.14
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
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
                  0.0,
                  0.0,
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
          "sequenceIndex": 14
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionIndex": 50,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.06,
                  0.07,
                  0.08,
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.11,
                  0.12,
                  0.13,
                  0.14
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
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
                  0.0,
                  0.0,
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
          "sequenceIndex": 17
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 3,
          "endFrame": 4,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[8]",
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
                  "value": 0.167,
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
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[9]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[9]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 19,
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
                  "value": 0.167,
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
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[10]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 26,
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
                  "value": 0.167,
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
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionIndex": 33,
          "actionPath": [
            "timelineActions[13]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 35,
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
                  "value": 0.167,
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
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionIndex": 40,
          "actionPath": [
            "timelineActions[14]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 42,
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
                  "value": 0.167,
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
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionIndex": 52,
          "actionPath": [
            "timelineActions[17]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[17]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 54,
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
                  "value": 0.167,
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
            0.06,
            0.07,
            0.08,
            0.08,
            0.09,
            0.1,
            0.1,
            0.11,
            0.11,
            0.12,
            0.13,
            0.14
          ],
          "display_atk_scale": [
            0.38,
            0.42,
            0.46,
            0.5,
            0.53,
            0.57,
            0.61,
            0.65,
            0.69,
            0.73,
            0.79,
            0.86
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
          "value": 0.32,
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
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "point",
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
          "startFrame": 3,
          "endFrame": 4,
          "actionIndex": 5,
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
          "startFrame": 5,
          "endFrame": 6,
          "actionIndex": 6,
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
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 7,
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
          "startFrame": 11,
          "endFrame": 12,
          "actionIndex": 29,
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
          "startFrame": 13,
          "endFrame": 14,
          "actionIndex": 30,
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
          "startFrame": 15,
          "endFrame": 16,
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[15]",
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
          "startFrame": 3,
          "endFrame": 4,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[8]",
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
                  "value": 0.167,
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
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[9]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[9]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 19,
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
                  "value": 0.167,
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
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[10]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 26,
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
                  "value": 0.167,
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
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionIndex": 33,
          "actionPath": [
            "timelineActions[13]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 35,
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
                  "value": 0.167,
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
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionIndex": 40,
          "actionPath": [
            "timelineActions[14]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 42,
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
                  "value": 0.167,
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
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionIndex": 52,
          "actionPath": [
            "timelineActions[17]",
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
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[17]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 54,
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
                  "value": 0.167,
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
      "skillId": "chr_0029_pograni_attack5",
      "skillType": "basicAttack",
      "sourceFile": "chr_0029_pograni_attack5.json",
      "timelineBlockFrames": 24,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 12,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 16,
      "allowNextWindows": [
        {
          "startFrame": 24,
          "endFrame": 32,
          "skillIds": [
            "chr_0029_pograni_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 15,
          "endFrame": 32,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0029_pograni_attack1",
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
          "endFrame": 124,
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
          "endFrame": 16,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 124,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 7,
          "actionTypes": []
        },
        {
          "startFrame": 16,
          "endFrame": 19,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 21,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 19,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 14,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 30,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 32,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 0,
          "endFrame": 63,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 56,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 56,
          "actionTypes": [
            "EffectAction"
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
          "endFrame": 52,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 70,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 108,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 17,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 32,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 32,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionIndex": 7,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.43,
                  0.47,
                  0.52,
                  0.56,
                  0.6,
                  0.65,
                  0.69,
                  0.73,
                  0.77,
                  0.83,
                  0.89,
                  0.97
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
          "sequenceIndex": 6
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionIndex": 9,
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 11,
              "nestedCondition": {
                "startFrame": 16,
                "endFrame": 17,
                "actionIndex": 11,
                "actionPath": [
                  "timelineActions[6]",
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
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[6]",
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
                    "serverActionIndex": 13,
                    "blackboardMutation": {
                      "key": "isHitbyMain",
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
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 14,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
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
          "atk_scale": [
            0.43,
            0.47,
            0.52,
            0.56,
            0.6,
            0.65,
            0.69,
            0.73,
            0.77,
            0.83,
            0.89,
            0.97
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
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.7,
          "isDynamic": false
        },
        {
          "key": "isHitbyMain",
          "value": 0.0,
          "isDynamic": true
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
        "isHitbyMain",
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
          "key": "isHitbyMain",
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
          "startFrame": 16,
          "endFrame": 19,
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
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionIndex": 9,
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 11,
              "nestedCondition": {
                "startFrame": 16,
                "endFrame": 17,
                "actionIndex": 11,
                "actionPath": [
                  "timelineActions[6]",
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
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[6]",
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
                    "serverActionIndex": 13,
                    "blackboardMutation": {
                      "key": "isHitbyMain",
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
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 14,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
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
      "skillId": "chr_0029_pograni_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0029_pograni_power_attack.json",
      "timelineBlockFrames": 27,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 4,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 27,
          "endFrame": 49,
          "skillIds": [
            "chr_0029_pograni_normal_skill",
            "chr_0029_pograni_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 49,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0029_pograni_normal_skill",
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
              "skillId": "chr_0029_pograni_combo_skill",
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
          "endFrame": 145,
          "actionTypes": [
            "PlayAnimationAction"
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
          "startFrame": 2,
          "endFrame": 7,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 14,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 28,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 107,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 7,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
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
          "startFrame": 7,
          "endFrame": 10,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "CameraImpulseAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 15,
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
          "startFrame": 14,
          "endFrame": 17,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "CameraImpulseAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 27,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "BlowOffAction",
            "EnemyHurtAnimAction",
            "CameraImpulseAction",
            "GainBreakingAttackAtb"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 28,
          "actionTypes": [
            "CheckEntityNum",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 29,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 40,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 40,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 47,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 47,
          "actionTypes": [
            "CreateBuffAction"
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
          "endFrame": 68,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 68,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 60,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 79,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 120,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 79,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "CreateBuffAction"
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
          "startFrame": 27,
          "endFrame": 49,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 88,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 88,
          "endFrame": 145,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 68,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 68,
          "endFrame": 145,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 68,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 56,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 74,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 58,
          "endFrame": 121,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 35,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 7,
          "endFrame": 10,
          "actionIndex": 12,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 1.0,
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
                "value": 0.1,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 8
        },
        {
          "startFrame": 14,
          "endFrame": 17,
          "actionIndex": 21,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 1.0,
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
                "value": 0.1,
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
        },
        {
          "startFrame": 25,
          "endFrame": 27,
          "actionIndex": 28,
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
                "value": 0.8,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 12
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 47,
          "actionIndex": 48,
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
          "sequenceIndex": 18,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionIndex": 57,
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
          "sequenceIndex": 27,
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
          "value": 4.0,
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
          "startFrame": 7,
          "endFrame": 8,
          "actionIndex": 11,
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
          "finderCheckAlive": false,
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
          "actionIndex": 19,
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
          "finderCheckAlive": false,
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
          "actionIndex": 20,
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
          "finderCheckAlive": false,
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
      "skillId": "chr_0029_pograni_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0029_pograni_plunging_attack_end.json",
      "timelineBlockFrames": 21,
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
          "endFrame": 93,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 93,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 35,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 7,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 8,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 7,
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
          "endFrame": 68,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 93,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 35,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 3,
          "endFrame": 8,
          "actionIndex": 4,
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
          "sequenceIndex": 4
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 3,
          "endFrame": 8,
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
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 9,
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
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 3,
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
          "startFrame": 3,
          "endFrame": 8,
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
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 9,
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
      "skillId": "chr_0029_pograni_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0029_pograni_normal_skill.json",
      "timelineBlockFrames": 45,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 48,
          "endFrame": 55,
          "skillIds": [
            "chr_0029_pograni_attack1",
            "chr_0029_pograni_attack2",
            "chr_0029_pograni_attack3",
            "chr_0029_pograni_attack4",
            "chr_0029_pograni_attack5"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 55,
          "skillIds": [
            "chr_0029_pograni_normal_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 55,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0029_pograni_normal_skill",
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
          "endFrame": 218,
          "actionTypes": [
            "PlayAnimationAction"
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
            "Selector",
            "CheckEntityNum",
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
          "endFrame": 157,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 28,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 157,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 47,
          "actionTypes": []
        },
        {
          "startFrame": 9,
          "endFrame": 51,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 51,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 20,
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
          "startFrame": 28,
          "endFrame": 29,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 38,
          "actionTypes": [
            "SaveBuffStackNumAdvanced",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionTypes": [
            "SwitchAction",
            "ObtainCostAction",
            "ObtainCostAction",
            "ObtainCostAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 29,
          "actionTypes": [
            "MergeTargetAction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionTypes": [
            "MergeTargetAction",
            "IfElseAction",
            "CompareFloat",
            "ObtainCostAction",
            "FractureAction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 31,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 41,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionTypes": [
            "IfElseAction",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 55,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 53,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 55,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 55,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 75,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 77,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 120,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 120,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 37,
          "endFrame": 76,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 61,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 50,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 120,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 143,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 143,
          "endFrame": 218,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 129,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 129,
          "endFrame": 218,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 129,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 40,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 39,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 75,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 70,
          "endFrame": 178,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 28,
          "endFrame": 29,
          "actionIndex": 78,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.86,
                  0.94,
                  1.03,
                  1.11,
                  1.2,
                  1.28,
                  1.37,
                  1.45,
                  1.54,
                  1.65,
                  1.77,
                  1.92
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
                "value": 2.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "calculationMultiplier": null,
              "poiseValue": {
                "value": 20.0,
                "blackboardKey": "poise",
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
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 14
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 88,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale2",
                "levelValues": [
                  1.06,
                  1.16,
                  1.27,
                  1.37,
                  1.48,
                  1.58,
                  1.69,
                  1.8,
                  1.9,
                  2.03,
                  2.19,
                  2.38
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
                "value": 2.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "calculationMultiplier": null,
              "poiseValue": {
                "value": 20.0,
                "blackboardKey": "poise",
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
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 15
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 38,
          "endFrame": 38,
          "actionIndex": 69,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
                "value": 0.0,
                "blackboardKey": "num_1",
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": "num",
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
                "timelineActions[12]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 71,
              "blackboardMutation": {
                "key": "num",
                "operation": "Assign",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "num_1",
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
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 72,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
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
                "blackboardKey": "num",
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
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "options",
                "[0]",
                "actionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 73,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 25.0,
                  "blackboardKey": "atb1",
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
            }
          ],
          "failActions": [
            {
              "actionType": "SwitchAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "options",
                "[1]"
              ],
              "serverActionIndex": 72,
              "nestedCondition": {
                "startFrame": 38,
                "endFrame": 39,
                "actionIndex": 72,
                "actionPath": [
                  "timelineActions[13]",
                  "_sequenceActionData",
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
                      "blackboardKey": "num",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[13]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[1]",
                      "actionData",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 74,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "resourceGain": {
                      "resource": "sp",
                      "amount": {
                        "value": 35.0,
                        "blackboardKey": "atb2",
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
                      "spGainSource": "skill",
                      "onlyMainOperator": false,
                      "isPercentValue": false,
                      "useUltimateRecoveryTag": false,
                      "ultimateRecoveryTagId": 0,
                      "ignoreUltimateGainScalar": false
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SwitchAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[13]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[2]"
                    ],
                    "serverActionIndex": 72,
                    "nestedCondition": {
                      "startFrame": 38,
                      "endFrame": 39,
                      "actionIndex": 72,
                      "actionPath": [
                        "timelineActions[13]",
                        "_sequenceActionData",
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
                            "blackboardKey": "num",
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
                          "actionType": "ObtainCostAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[13]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[2]",
                            "actionData",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 75,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "resourceGain": {
                            "resource": "sp",
                            "amount": {
                              "value": 45.0,
                              "blackboardKey": "atb3",
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
                            "spGainSource": "skill",
                            "onlyMainOperator": false,
                            "isPercentValue": false,
                            "useUltimateRecoveryTag": false,
                            "ultimateRecoveryTagId": 0,
                            "ignoreUltimateGainScalar": false
                          }
                        }
                      ],
                      "failActions": [
                        {
                          "actionType": "SwitchAction",
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[13]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[3]"
                          ],
                          "serverActionIndex": 72,
                          "nestedCondition": {
                            "startFrame": 38,
                            "endFrame": 39,
                            "actionIndex": 72,
                            "actionPath": [
                              "timelineActions[13]",
                              "_sequenceActionData",
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
                                  "blackboardKey": "num",
                                  "levelValues": null
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
                                "actionType": "ObtainCostAction",
                                "actionIndex": 0,
                                "actionPath": [
                                  "timelineActions[13]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[3]",
                                  "actionData",
                                  "actionData",
                                  "[0]"
                                ],
                                "serverActionIndex": 76,
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null,
                                "resourceGain": {
                                  "resource": "sp",
                                  "amount": {
                                    "value": 55.0,
                                    "blackboardKey": "atb4",
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
                                      35.0,
                                      35.0,
                                      35.0
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
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 83,
          "actionPath": [
            "timelineActions[15]",
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
                "targetGroupKey": "total_tar",
                "minimumCount": 2,
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
              "actionType": "CompareFloat",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 85,
              "nestedCondition": {
                "startFrame": 38,
                "endFrame": 39,
                "actionIndex": 85,
                "actionPath": [
                  "timelineActions[15]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[15]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 86,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "resourceGain": {
                      "resource": "sp",
                      "amount": {
                        "value": 15.0,
                        "blackboardKey": "atb_return",
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
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 94,
          "actionPath": [
            "timelineActions[18]",
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
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[18]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 96,
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
        "buff_common_obtain_ultimate_sp",
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
          "atb1": [
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
          "atb2": [
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            10.0,
            15.0,
            15.0,
            15.0
          ],
          "atb3": [
            20.0,
            20.0,
            20.0,
            20.0,
            20.0,
            20.0,
            20.0,
            20.0,
            20.0,
            25.0,
            25.0,
            25.0
          ],
          "atb4": [
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            35.0,
            35.0,
            35.0
          ],
          "atk_scale": [
            0.86,
            0.94,
            1.03,
            1.11,
            1.2,
            1.28,
            1.37,
            1.45,
            1.54,
            1.65,
            1.77,
            1.92
          ],
          "atk_scale2": [
            1.06,
            1.16,
            1.27,
            1.37,
            1.48,
            1.58,
            1.69,
            1.8,
            1.9,
            2.03,
            2.19,
            2.38
          ],
          "poise": [
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
          "key": "atb1",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "atb2",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "atb3",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "atb4",
          "value": 30.0,
          "isDynamic": false
        },
        {
          "key": "atb_return",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.6,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 1.2,
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
          "key": "num",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "num_1",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb1",
        "atb2",
        "atb3",
        "atb4",
        "atb_return",
        "atk_scale",
        "atk_scale2",
        "cam_angle",
        "has_potential1",
        "input_angle",
        "num",
        "num_1",
        "poise",
        "select_radius"
      ],
      "blackboardProvenance": [
        {
          "key": "atb1",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb2",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb3",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb4",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb_return",
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
          "key": "num",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "num_1",
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
        "DamageAction",
        "FractureAction",
        "IfElseAction",
        "ObtainCostAction",
        "SwitchAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 7,
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
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[1]"
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
          "endFrame": 7,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[3]"
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
          "endFrame": 157,
          "actionIndex": 23,
          "actionPath": [
            "timelineActions[3]",
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
          "startFrame": 0,
          "endFrame": 28,
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
          "startFrame": 28,
          "endFrame": 157,
          "actionIndex": 31,
          "actionPath": [
            "timelineActions[5]",
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
          "startFrame": 28,
          "endFrame": 29,
          "actionIndex": 65,
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
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 66,
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
          "startFrame": 28,
          "endFrame": 29,
          "actionIndex": 77,
          "actionPath": [
            "timelineActions[14]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "total_tar",
          "producerType": "MergeTargetAction",
          "finderType": null,
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [],
          "postProcessorTypes": [],
          "inputTargets": [
            {
              "targetSource": "Context",
              "targetGroupKey": "tar",
              "finderType": null,
              "finderFactionTarget": null,
              "finderTargetObjectType": null,
              "finderCheckAlive": null,
              "validatorTypes": [],
              "postProcessorTypes": []
            }
          ],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 82,
          "actionPath": [
            "timelineActions[15]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "total_tar",
          "producerType": "MergeTargetAction",
          "finderType": null,
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [],
          "postProcessorTypes": [],
          "inputTargets": [
            {
              "targetSource": "Context",
              "targetGroupKey": "tar",
              "finderType": null,
              "finderFactionTarget": null,
              "finderTargetObjectType": null,
              "finderCheckAlive": null,
              "validatorTypes": [],
              "postProcessorTypes": []
            },
            {
              "targetSource": "Context",
              "targetGroupKey": "total_tar",
              "finderType": null,
              "finderFactionTarget": null,
              "finderTargetObjectType": null,
              "finderCheckAlive": null,
              "validatorTypes": [],
              "postProcessorTypes": []
            }
          ],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 7,
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
              "actionType": "FindTargetAction",
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
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "FindTargetAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[1]",
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
              "buffIgnite": null
            },
            {
              "actionType": "FindTargetAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 6,
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
          "startFrame": 38,
          "endFrame": 38,
          "actionIndex": 69,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
                "value": 0.0,
                "blackboardKey": "num_1",
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": "num",
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
                "timelineActions[12]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 71,
              "blackboardMutation": {
                "key": "num",
                "operation": "Assign",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "num_1",
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
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 72,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
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
                "blackboardKey": "num",
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
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "options",
                "[0]",
                "actionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 73,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 25.0,
                  "blackboardKey": "atb1",
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
            }
          ],
          "failActions": [
            {
              "actionType": "SwitchAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "options",
                "[1]"
              ],
              "serverActionIndex": 72,
              "nestedCondition": {
                "startFrame": 38,
                "endFrame": 39,
                "actionIndex": 72,
                "actionPath": [
                  "timelineActions[13]",
                  "_sequenceActionData",
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
                      "blackboardKey": "num",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[13]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[1]",
                      "actionData",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 74,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "resourceGain": {
                      "resource": "sp",
                      "amount": {
                        "value": 35.0,
                        "blackboardKey": "atb2",
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
                      "spGainSource": "skill",
                      "onlyMainOperator": false,
                      "isPercentValue": false,
                      "useUltimateRecoveryTag": false,
                      "ultimateRecoveryTagId": 0,
                      "ignoreUltimateGainScalar": false
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SwitchAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[13]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[2]"
                    ],
                    "serverActionIndex": 72,
                    "nestedCondition": {
                      "startFrame": 38,
                      "endFrame": 39,
                      "actionIndex": 72,
                      "actionPath": [
                        "timelineActions[13]",
                        "_sequenceActionData",
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
                            "blackboardKey": "num",
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
                          "actionType": "ObtainCostAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[13]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[2]",
                            "actionData",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 75,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "resourceGain": {
                            "resource": "sp",
                            "amount": {
                              "value": 45.0,
                              "blackboardKey": "atb3",
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
                            "spGainSource": "skill",
                            "onlyMainOperator": false,
                            "isPercentValue": false,
                            "useUltimateRecoveryTag": false,
                            "ultimateRecoveryTagId": 0,
                            "ignoreUltimateGainScalar": false
                          }
                        }
                      ],
                      "failActions": [
                        {
                          "actionType": "SwitchAction",
                          "actionIndex": 2,
                          "actionPath": [
                            "timelineActions[13]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "options",
                            "[3]"
                          ],
                          "serverActionIndex": 72,
                          "nestedCondition": {
                            "startFrame": 38,
                            "endFrame": 39,
                            "actionIndex": 72,
                            "actionPath": [
                              "timelineActions[13]",
                              "_sequenceActionData",
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
                                  "blackboardKey": "num",
                                  "levelValues": null
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
                                "actionType": "ObtainCostAction",
                                "actionIndex": 0,
                                "actionPath": [
                                  "timelineActions[13]",
                                  "_sequenceActionData",
                                  "actionData",
                                  "[0]",
                                  "options",
                                  "[3]",
                                  "actionData",
                                  "actionData",
                                  "[0]"
                                ],
                                "serverActionIndex": 76,
                                "legacyBuffFinish": null,
                                "skillCooldownAdjustment": null,
                                "buffIgnite": null,
                                "resourceGain": {
                                  "resource": "sp",
                                  "amount": {
                                    "value": 55.0,
                                    "blackboardKey": "atb4",
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
                                      35.0,
                                      35.0,
                                      35.0
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
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 83,
          "actionPath": [
            "timelineActions[15]",
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
                "targetGroupKey": "total_tar",
                "minimumCount": 2,
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
              "actionType": "CompareFloat",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 85,
              "nestedCondition": {
                "startFrame": 38,
                "endFrame": 39,
                "actionIndex": 85,
                "actionPath": [
                  "timelineActions[15]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[15]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 86,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "resourceGain": {
                      "resource": "sp",
                      "amount": {
                        "value": 15.0,
                        "blackboardKey": "atb_return",
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
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 94,
          "actionPath": [
            "timelineActions[18]",
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
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[18]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 96,
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
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        }
      ],
      "auraActions": [],
      "physicalInflictions": [
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 87,
          "payload": {
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
            "blowOffDistance": {
              "value": 3.8,
              "blackboardKey": null,
              "levelValues": null
            },
            "distanceRandomRange": {
              "value": 0.4,
              "blackboardKey": null,
              "levelValues": null
            },
            "overwriteHeight": true,
            "blowOffHeight": {
              "value": 1.5,
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
              "value": 0.0,
              "blackboardKey": null,
              "levelValues": null
            },
            "isExtra": false,
            "deadOption": "AllValid",
            "immobilizedTime": 0.0,
            "damageMultiplier": null,
            "ignoreHitEffect": false
          },
          "sequenceIndex": 15
        }
      ],
      "eventListeners": [],
      "timeDilations": [],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "comboSkill",
      "skillId": "chr_0029_pograni_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0029_pograni_combo_skill.json",
      "timelineBlockFrames": 66,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 10.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 66,
          "endFrame": 96,
          "skillIds": [
            "chr_0029_pograni_normal_skill"
          ]
        },
        {
          "startFrame": 266,
          "endFrame": 296,
          "skillIds": [
            "chr_0029_pograni_normal_skill"
          ]
        },
        {
          "startFrame": 442,
          "endFrame": 460,
          "skillIds": [
            "chr_0029_pograni_normal_skill"
          ]
        },
        {
          "startFrame": 628,
          "endFrame": 660,
          "skillIds": [
            "chr_0029_pograni_normal_skill"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 96,
          "skillIds": [
            "chr_0029_pograni_attack1",
            "chr_0029_pograni_attack2",
            "chr_0029_pograni_attack3",
            "chr_0029_pograni_attack4",
            "chr_0029_pograni_attack5"
          ]
        },
        {
          "startFrame": 272,
          "endFrame": 296,
          "skillIds": [
            "chr_0029_pograni_attack1",
            "chr_0029_pograni_attack2",
            "chr_0029_pograni_attack3",
            "chr_0029_pograni_attack4",
            "chr_0029_pograni_attack5"
          ]
        },
        {
          "startFrame": 446,
          "endFrame": 460,
          "skillIds": [
            "chr_0029_pograni_attack1",
            "chr_0029_pograni_attack2",
            "chr_0029_pograni_attack3",
            "chr_0029_pograni_attack4",
            "chr_0029_pograni_attack5"
          ]
        },
        {
          "startFrame": 632,
          "endFrame": 660,
          "skillIds": [
            "chr_0029_pograni_attack1",
            "chr_0029_pograni_attack2",
            "chr_0029_pograni_attack3",
            "chr_0029_pograni_attack4",
            "chr_0029_pograni_attack5"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 96,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0029_pograni_normal_skill",
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
        },
        {
          "startFrame": 200,
          "endFrame": 296,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0029_pograni_normal_skill",
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
        },
        {
          "startFrame": 400,
          "endFrame": 460,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0029_pograni_normal_skill",
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
        },
        {
          "startFrame": 600,
          "endFrame": 660,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0029_pograni_normal_skill",
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
          "endFrame": 191,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 200,
          "endFrame": 391,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 545,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 728,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "FinishBuffAction",
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "FinishBuffAction",
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "FinishBuffAction",
            "ModifyDynamicBlackboard",
            "FinishBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "JumpToAction"
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
            "Selector",
            "ConvertToTargetContext",
            "Selector"
          ]
        },
        {
          "startFrame": 200,
          "endFrame": 201,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "FindTargetAction",
            "Selector",
            "ConvertToTargetContext",
            "Selector"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 401,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "FindTargetAction",
            "Selector",
            "ConvertToTargetContext",
            "Selector"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 601,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "FindTargetAction",
            "Selector",
            "ConvertToTargetContext",
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
          "startFrame": 28,
          "endFrame": 31,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 50,
          "endFrame": 53,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 200,
          "endFrame": 203,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 230,
          "endFrame": 233,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 252,
          "endFrame": 255,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 403,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 421,
          "endFrame": 424,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 603,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 80,
          "endFrame": 83,
          "actionTypes": [
            "MarkCanInterrupt"
          ]
        },
        {
          "startFrame": 191,
          "endFrame": 194,
          "actionTypes": [
            "InterruptCurSkillAction"
          ]
        },
        {
          "startFrame": 280,
          "endFrame": 283,
          "actionTypes": [
            "MarkCanInterrupt"
          ]
        },
        {
          "startFrame": 391,
          "endFrame": 394,
          "actionTypes": [
            "InterruptCurSkillAction"
          ]
        },
        {
          "startFrame": 450,
          "endFrame": 453,
          "actionTypes": [
            "MarkCanInterrupt"
          ]
        },
        {
          "startFrame": 545,
          "endFrame": 548,
          "actionTypes": [
            "InterruptCurSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 61,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 61,
          "endFrame": 69,
          "actionTypes": [
            "DisableRootMotionAction"
          ]
        },
        {
          "startFrame": 69,
          "endFrame": 191,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 200,
          "endFrame": 261,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 261,
          "endFrame": 269,
          "actionTypes": [
            "DisableRootMotionAction"
          ]
        },
        {
          "startFrame": 269,
          "endFrame": 391,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 545,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 728,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 200,
          "endFrame": 270,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 463,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 663,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 25,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 37,
          "endFrame": 39,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 61,
          "endFrame": 63,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 223,
          "endFrame": 225,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 237,
          "endFrame": 239,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 261,
          "endFrame": 263,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 423,
          "endFrame": 425,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 437,
          "endFrame": 439,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 623,
          "endFrame": 625,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionTypes": [
            "InterruptAction",
            "SimpleCalcBBAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "Selector",
            "CameraImpulseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 37,
          "endFrame": 40,
          "actionTypes": [
            "InterruptAction",
            "SimpleCalcBBAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "Selector",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 61,
          "endFrame": 64,
          "actionTypes": [
            "InterruptAction",
            "SimpleCalcBBAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "BlowOffAction",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "Selector",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 223,
          "endFrame": 226,
          "actionTypes": [
            "InterruptAction",
            "SimpleCalcBBAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "Selector",
            "CameraImpulseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 237,
          "endFrame": 240,
          "actionTypes": [
            "InterruptAction",
            "SimpleCalcBBAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "Selector",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 261,
          "endFrame": 264,
          "actionTypes": [
            "InterruptAction",
            "SimpleCalcBBAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "BlowOffAction",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "Selector",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 423,
          "endFrame": 426,
          "actionTypes": [
            "InterruptAction",
            "SimpleCalcBBAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "Selector",
            "CameraImpulseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 437,
          "endFrame": 440,
          "actionTypes": [
            "InterruptAction",
            "SimpleCalcBBAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "Selector",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 623,
          "endFrame": 626,
          "actionTypes": [
            "InterruptAction",
            "SimpleCalcBBAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "Selector",
            "CameraImpulseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 74,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 207,
          "endFrame": 274,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 407,
          "endFrame": 437,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 607,
          "endFrame": 651,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 96,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 200,
          "endFrame": 296,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 460,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 660,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 66,
          "endFrame": 96,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 266,
          "endFrame": 296,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 442,
          "endFrame": 460,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 628,
          "endFrame": 660,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 96,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 272,
          "endFrame": 296,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 446,
          "endFrame": 460,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 632,
          "endFrame": 660,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 21,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 57,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 58,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 58,
          "actionTypes": [
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 200,
          "endFrame": 221,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 200,
          "endFrame": 257,
          "actionTypes": []
        },
        {
          "startFrame": 200,
          "endFrame": 258,
          "actionTypes": []
        },
        {
          "startFrame": 200,
          "endFrame": 258,
          "actionTypes": [
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 418,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 436,
          "actionTypes": []
        },
        {
          "startFrame": 400,
          "endFrame": 437,
          "actionTypes": []
        },
        {
          "startFrame": 400,
          "endFrame": 437,
          "actionTypes": [
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 619,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 620,
          "actionTypes": []
        },
        {
          "startFrame": 600,
          "endFrame": 621,
          "actionTypes": []
        },
        {
          "startFrame": 600,
          "endFrame": 622,
          "actionTypes": [
            "OverrideCameraFollowAction"
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
          "startFrame": 200,
          "endFrame": 246,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 446,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 646,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 46,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 210,
          "endFrame": 246,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 410,
          "endFrame": 446,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 610,
          "endFrame": 646,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 65,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 222,
          "endFrame": 265,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 422,
          "endFrame": 465,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 622,
          "endFrame": 665,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 63,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 220,
          "endFrame": 263,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 420,
          "endFrame": 463,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 620,
          "endFrame": 663,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 65,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 222,
          "endFrame": 265,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 422,
          "endFrame": 465,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 622,
          "endFrame": 665,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 30,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 202,
          "endFrame": 230,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 402,
          "endFrame": 430,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 602,
          "endFrame": 630,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 236,
          "endFrame": 270,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 436,
          "endFrame": 470,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 234,
          "endFrame": 268,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 434,
          "endFrame": 468,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 236,
          "endFrame": 270,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 436,
          "endFrame": 470,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 250,
          "endFrame": 272,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 95,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 260,
          "endFrame": 295,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 95,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 260,
          "endFrame": 295,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 56,
          "endFrame": 91,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 258,
          "endFrame": 293,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 82,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 191,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 199,
          "endFrame": 391,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 545,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 728,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 191,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 199,
          "endFrame": 391,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 545,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 728,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 38,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 200,
          "endFrame": 238,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 438,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 638,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 59,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 210,
          "endFrame": 259,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 410,
          "endFrame": 459,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 610,
          "endFrame": 659,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 67,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 225,
          "endFrame": 267,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 425,
          "endFrame": 467,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 110,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 240,
          "endFrame": 310,
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
          "startFrame": 200,
          "endFrame": 216,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 400,
          "endFrame": 426,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 600,
          "endFrame": 629,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 123,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.42,
                  0.46,
                  0.5,
                  0.55,
                  0.59,
                  0.63,
                  0.67,
                  0.71,
                  0.76,
                  0.81,
                  0.87,
                  0.95
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
                "blackboardKey": "poise1",
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
          "sequenceIndex": 46
        },
        {
          "startFrame": 37,
          "endFrame": 40,
          "actionIndex": 131,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale2",
                "levelValues": [
                  0.54,
                  0.59,
                  0.65,
                  0.7,
                  0.76,
                  0.81,
                  0.86,
                  0.92,
                  0.97,
                  1.04,
                  1.12,
                  1.22
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
                "blackboardKey": "poise1",
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
          "sequenceIndex": 47
        },
        {
          "startFrame": 61,
          "endFrame": 64,
          "actionIndex": 138,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale4",
                "levelValues": [
                  1.32,
                  1.45,
                  1.58,
                  1.72,
                  1.85,
                  1.98,
                  2.11,
                  2.24,
                  2.38,
                  2.54,
                  2.74,
                  2.97
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
                "blackboardKey": "poise4",
                "levelValues": [
                  9.0,
                  9.0,
                  9.0,
                  9.0,
                  9.0,
                  9.0,
                  9.0,
                  9.0,
                  9.0,
                  9.0,
                  9.0,
                  9.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 48
        },
        {
          "startFrame": 223,
          "endFrame": 226,
          "actionIndex": 146,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.42,
                  0.46,
                  0.5,
                  0.55,
                  0.59,
                  0.63,
                  0.67,
                  0.71,
                  0.76,
                  0.81,
                  0.87,
                  0.95
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
                "blackboardKey": "poise1",
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
          "sequenceIndex": 49
        },
        {
          "startFrame": 237,
          "endFrame": 240,
          "actionIndex": 154,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale2",
                "levelValues": [
                  0.54,
                  0.59,
                  0.65,
                  0.7,
                  0.76,
                  0.81,
                  0.86,
                  0.92,
                  0.97,
                  1.04,
                  1.12,
                  1.22
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
                "blackboardKey": "poise1",
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
          "sequenceIndex": 50
        },
        {
          "startFrame": 261,
          "endFrame": 264,
          "actionIndex": 161,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale3",
                "levelValues": [
                  0.66,
                  0.73,
                  0.79,
                  0.86,
                  0.92,
                  0.99,
                  1.06,
                  1.12,
                  1.19,
                  1.27,
                  1.37,
                  1.49
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
                "blackboardKey": "poise3",
                "levelValues": [
                  4.0,
                  4.0,
                  4.0,
                  4.0,
                  4.0,
                  4.0,
                  4.0,
                  4.0,
                  4.0,
                  4.0,
                  4.0,
                  4.0
                ]
              },
              "definiteValue": null,
              "damageDecorateMask": 0
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 51
        },
        {
          "startFrame": 423,
          "endFrame": 426,
          "actionIndex": 169,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.42,
                  0.46,
                  0.5,
                  0.55,
                  0.59,
                  0.63,
                  0.67,
                  0.71,
                  0.76,
                  0.81,
                  0.87,
                  0.95
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
                "blackboardKey": "poise1",
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
          "sequenceIndex": 52
        },
        {
          "startFrame": 437,
          "endFrame": 440,
          "actionIndex": 177,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale2",
                "levelValues": [
                  0.54,
                  0.59,
                  0.65,
                  0.7,
                  0.76,
                  0.81,
                  0.86,
                  0.92,
                  0.97,
                  1.04,
                  1.12,
                  1.22
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
                "blackboardKey": "poise1",
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
          "sequenceIndex": 53
        },
        {
          "startFrame": 623,
          "endFrame": 626,
          "actionIndex": 184,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.42,
                  0.46,
                  0.5,
                  0.55,
                  0.59,
                  0.63,
                  0.67,
                  0.71,
                  0.76,
                  0.81,
                  0.87,
                  0.95
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
                "blackboardKey": "poise1",
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
          "sequenceIndex": 54
        }
      ],
      "conditionalActions": [
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
          "conditions": [
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
                  "buff_chr_0029_pograni_combo_skill_count4"
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 6,
              "blackboardMutation": {
                "key": "EntityBB_noguard_count",
                "operation": "Assign",
                "value": {
                  "value": 4.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "FinishBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 7,
              "legacyBuffFinish": {
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
                "buffIds": [
                  "buff_chr_0029_pograni_combo_skill_count1",
                  "buff_chr_0029_pograni_combo_skill_count2",
                  "buff_chr_0029_pograni_combo_skill_count3",
                  "buff_chr_0029_pograni_combo_skill_count4"
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[0]",
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
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
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
                        "buff_chr_0029_pograni_combo_skill_count3"
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
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[4]",
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
                    "serverActionIndex": 10,
                    "blackboardMutation": {
                      "key": "EntityBB_noguard_count",
                      "operation": "Assign",
                      "value": {
                        "value": 3.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  },
                  {
                    "actionType": "FinishBuffAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[4]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 11,
                    "legacyBuffFinish": {
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
                      "buffIds": [
                        "buff_chr_0029_pograni_combo_skill_count1",
                        "buff_chr_0029_pograni_combo_skill_count2",
                        "buff_chr_0029_pograni_combo_skill_count3",
                        "buff_chr_0029_pograni_combo_skill_count4"
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
                    "actionType": "IfElseAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[4]",
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
                    "serverActionIndex": 12,
                    "nestedCondition": {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 12,
                      "actionPath": [
                        "timelineActions[4]",
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
                      "conditions": [
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
                              "buff_chr_0029_pograni_combo_skill_count2"
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
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[4]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 14,
                          "blackboardMutation": {
                            "key": "EntityBB_noguard_count",
                            "operation": "Assign",
                            "value": {
                              "value": 2.0,
                              "blackboardKey": null,
                              "levelValues": null
                            }
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        },
                        {
                          "actionType": "FinishBuffAction",
                          "actionIndex": 1,
                          "actionPath": [
                            "timelineActions[4]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 15,
                          "legacyBuffFinish": {
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
                            "buffIds": [
                              "buff_chr_0029_pograni_combo_skill_count1",
                              "buff_chr_0029_pograni_combo_skill_count2",
                              "buff_chr_0029_pograni_combo_skill_count3",
                              "buff_chr_0029_pograni_combo_skill_count4"
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
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[4]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 16,
                          "blackboardMutation": {
                            "key": "EntityBB_noguard_count",
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
                          "actionType": "FinishBuffAction",
                          "actionIndex": 1,
                          "actionPath": [
                            "timelineActions[4]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 17,
                          "legacyBuffFinish": {
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
                            "buffIds": [
                              "buff_chr_0029_pograni_combo_skill_count1",
                              "buff_chr_0029_pograni_combo_skill_count2",
                              "buff_chr_0029_pograni_combo_skill_count3",
                              "buff_chr_0029_pograni_combo_skill_count4"
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
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 121,
          "key": "calc_atb1",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atb1",
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
          "right": {
            "value": 0.0,
            "blackboardKey": "atb_ratio",
            "levelValues": [
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0
            ]
          },
          "addend": null,
          "sequenceIndex": 46
        },
        {
          "startFrame": 37,
          "endFrame": 40,
          "actionIndex": 129,
          "key": "calc_atb2",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atb2",
            "levelValues": [
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0
            ]
          },
          "right": {
            "value": 0.0,
            "blackboardKey": "atb_ratio",
            "levelValues": [
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0
            ]
          },
          "addend": null,
          "sequenceIndex": 47
        },
        {
          "startFrame": 61,
          "endFrame": 64,
          "actionIndex": 136,
          "key": "calc_atb4",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atb4",
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
          "right": {
            "value": 0.0,
            "blackboardKey": "atb_ratio",
            "levelValues": [
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0
            ]
          },
          "addend": null,
          "sequenceIndex": 48
        },
        {
          "startFrame": 223,
          "endFrame": 226,
          "actionIndex": 144,
          "key": "calc_atb1",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atb1",
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
          "right": {
            "value": 0.0,
            "blackboardKey": "atb_ratio",
            "levelValues": [
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0
            ]
          },
          "addend": null,
          "sequenceIndex": 49
        },
        {
          "startFrame": 237,
          "endFrame": 240,
          "actionIndex": 152,
          "key": "calc_atb2",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atb2",
            "levelValues": [
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0
            ]
          },
          "right": {
            "value": 0.0,
            "blackboardKey": "atb_ratio",
            "levelValues": [
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0
            ]
          },
          "addend": null,
          "sequenceIndex": 50
        },
        {
          "startFrame": 261,
          "endFrame": 264,
          "actionIndex": 159,
          "key": "calc_atb3",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atb3",
            "levelValues": [
              13.0,
              13.0,
              13.0,
              13.0,
              13.0,
              13.0,
              13.0,
              13.0,
              13.0,
              13.0,
              13.0,
              13.0
            ]
          },
          "right": {
            "value": 0.0,
            "blackboardKey": "atb_ratio",
            "levelValues": [
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0
            ]
          },
          "addend": null,
          "sequenceIndex": 51
        },
        {
          "startFrame": 423,
          "endFrame": 426,
          "actionIndex": 167,
          "key": "calc_atb1",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atb1",
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
          "right": {
            "value": 0.0,
            "blackboardKey": "atb_ratio",
            "levelValues": [
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0
            ]
          },
          "addend": null,
          "sequenceIndex": 52
        },
        {
          "startFrame": 437,
          "endFrame": 440,
          "actionIndex": 175,
          "key": "calc_atb2",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atb2",
            "levelValues": [
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0,
              7.0
            ]
          },
          "right": {
            "value": 0.0,
            "blackboardKey": "atb_ratio",
            "levelValues": [
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0
            ]
          },
          "addend": null,
          "sequenceIndex": 53
        },
        {
          "startFrame": 623,
          "endFrame": 626,
          "actionIndex": 182,
          "key": "calc_atb1",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "atb1",
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
          "right": {
            "value": 0.0,
            "blackboardKey": "atb_ratio",
            "levelValues": [
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0,
              1.0
            ]
          },
          "addend": null,
          "sequenceIndex": 54
        }
      ],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 122,
          "resource": "sp",
          "amount": {
            "value": 20.0,
            "blackboardKey": "calc_atb1",
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 46
        },
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 127,
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
          "sequenceIndex": 46
        },
        {
          "startFrame": 37,
          "endFrame": 40,
          "actionIndex": 130,
          "resource": "sp",
          "amount": {
            "value": 20.0,
            "blackboardKey": "calc_atb2",
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 47
        },
        {
          "startFrame": 61,
          "endFrame": 64,
          "actionIndex": 137,
          "resource": "sp",
          "amount": {
            "value": 20.0,
            "blackboardKey": "calc_atb4",
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 48
        },
        {
          "startFrame": 223,
          "endFrame": 226,
          "actionIndex": 145,
          "resource": "sp",
          "amount": {
            "value": 20.0,
            "blackboardKey": "calc_atb1",
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 49
        },
        {
          "startFrame": 223,
          "endFrame": 226,
          "actionIndex": 150,
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
          "sequenceIndex": 49
        },
        {
          "startFrame": 237,
          "endFrame": 240,
          "actionIndex": 153,
          "resource": "sp",
          "amount": {
            "value": 20.0,
            "blackboardKey": "calc_atb2",
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 50
        },
        {
          "startFrame": 261,
          "endFrame": 264,
          "actionIndex": 160,
          "resource": "sp",
          "amount": {
            "value": 20.0,
            "blackboardKey": "calc_atb3",
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 51
        },
        {
          "startFrame": 423,
          "endFrame": 426,
          "actionIndex": 168,
          "resource": "sp",
          "amount": {
            "value": 20.0,
            "blackboardKey": "calc_atb1",
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 52
        },
        {
          "startFrame": 423,
          "endFrame": 426,
          "actionIndex": 173,
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
          "sequenceIndex": 52
        },
        {
          "startFrame": 437,
          "endFrame": 440,
          "actionIndex": 176,
          "resource": "sp",
          "amount": {
            "value": 20.0,
            "blackboardKey": "calc_atb2",
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 53
        },
        {
          "startFrame": 623,
          "endFrame": 626,
          "actionIndex": 183,
          "resource": "sp",
          "amount": {
            "value": 20.0,
            "blackboardKey": "calc_atb1",
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 54
        },
        {
          "startFrame": 623,
          "endFrame": 626,
          "actionIndex": 188,
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
          "sequenceIndex": 54
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
          "atb1": [
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
          "atb2": [
            7.0,
            7.0,
            7.0,
            7.0,
            7.0,
            7.0,
            7.0,
            7.0,
            7.0,
            7.0,
            7.0,
            7.0
          ],
          "atb3": [
            13.0,
            13.0,
            13.0,
            13.0,
            13.0,
            13.0,
            13.0,
            13.0,
            13.0,
            13.0,
            13.0,
            13.0
          ],
          "atb4": [
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
          ],
          "atk_scale": [
            0.42,
            0.46,
            0.5,
            0.55,
            0.59,
            0.63,
            0.67,
            0.71,
            0.76,
            0.81,
            0.87,
            0.95
          ],
          "atk_scale2": [
            0.54,
            0.59,
            0.65,
            0.7,
            0.76,
            0.81,
            0.86,
            0.92,
            0.97,
            1.04,
            1.12,
            1.22
          ],
          "atk_scale3": [
            0.66,
            0.73,
            0.79,
            0.86,
            0.92,
            0.99,
            1.06,
            1.12,
            1.19,
            1.27,
            1.37,
            1.49
          ],
          "atk_scale4": [
            1.32,
            1.45,
            1.58,
            1.72,
            1.85,
            1.98,
            2.11,
            2.24,
            2.38,
            2.54,
            2.74,
            2.97
          ],
          "poise1": [
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
          "poise3": [
            4.0,
            4.0,
            4.0,
            4.0,
            4.0,
            4.0,
            4.0,
            4.0,
            4.0,
            4.0,
            4.0,
            4.0
          ],
          "poise4": [
            9.0,
            9.0,
            9.0,
            9.0,
            9.0,
            9.0,
            9.0,
            9.0,
            9.0,
            9.0,
            9.0,
            9.0
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
          "key": "atb1",
          "value": 6.0,
          "isDynamic": false
        },
        {
          "key": "atb2",
          "value": 9.0,
          "isDynamic": false
        },
        {
          "key": "atb3",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "atb4",
          "value": 21.0,
          "isDynamic": false
        },
        {
          "key": "atb_ratio",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.9,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 1.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale3",
          "value": 2.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale4",
          "value": 2.5,
          "isDynamic": false
        },
        {
          "key": "calc_atb1",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "calc_atb2",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "calc_atb3",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "calc_atb4",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 4.0,
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
          "key": "poise1",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "poise2",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "poise3",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "poise4",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 7.0,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "EntityBB_noguard_count",
        "atb1",
        "atb2",
        "atb3",
        "atb4",
        "atb_ratio",
        "atk_scale",
        "atk_scale2",
        "atk_scale3",
        "atk_scale4",
        "calc_atb1",
        "calc_atb2",
        "calc_atb3",
        "calc_atb4",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise1",
        "poise3",
        "poise4",
        "select_radius",
        "usp"
      ],
      "blackboardProvenance": [
        {
          "key": "EntityBB_noguard_count",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        },
        {
          "key": "atb1",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb2",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb3",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb4",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb_ratio",
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
          "key": "atk_scale2",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale3",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale4",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "calc_atb1",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": true,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "calc_atb2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": true,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "calc_atb3",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": true,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "calc_atb4",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": true,
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
          "key": "poise1",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise3",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise4",
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
        "DamageAction",
        "FinishBuffAction",
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[6]",
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
          "actionIndex": 30,
          "actionPath": [
            "timelineActions[6]",
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
          "startFrame": 200,
          "endFrame": 201,
          "actionIndex": 38,
          "actionPath": [
            "timelineActions[7]",
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
          "startFrame": 200,
          "endFrame": 201,
          "actionIndex": 39,
          "actionPath": [
            "timelineActions[7]",
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
          "startFrame": 400,
          "endFrame": 401,
          "actionIndex": 47,
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
          "startFrame": 400,
          "endFrame": 401,
          "actionIndex": 48,
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
        },
        {
          "startFrame": 600,
          "endFrame": 601,
          "actionIndex": 56,
          "actionPath": [
            "timelineActions[9]",
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
          "startFrame": 600,
          "endFrame": 601,
          "actionIndex": 57,
          "actionPath": [
            "timelineActions[9]",
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
          "startFrame": 23,
          "endFrame": 25,
          "actionIndex": 111,
          "actionPath": [
            "timelineActions[37]",
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
        },
        {
          "startFrame": 37,
          "endFrame": 39,
          "actionIndex": 112,
          "actionPath": [
            "timelineActions[38]",
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
        },
        {
          "startFrame": 61,
          "endFrame": 63,
          "actionIndex": 113,
          "actionPath": [
            "timelineActions[39]",
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
        },
        {
          "startFrame": 223,
          "endFrame": 225,
          "actionIndex": 114,
          "actionPath": [
            "timelineActions[40]",
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
        },
        {
          "startFrame": 237,
          "endFrame": 239,
          "actionIndex": 115,
          "actionPath": [
            "timelineActions[41]",
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
        },
        {
          "startFrame": 261,
          "endFrame": 263,
          "actionIndex": 116,
          "actionPath": [
            "timelineActions[42]",
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
        },
        {
          "startFrame": 423,
          "endFrame": 425,
          "actionIndex": 117,
          "actionPath": [
            "timelineActions[43]",
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
        },
        {
          "startFrame": 437,
          "endFrame": 439,
          "actionIndex": 118,
          "actionPath": [
            "timelineActions[44]",
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
        },
        {
          "startFrame": 623,
          "endFrame": 625,
          "actionIndex": 119,
          "actionPath": [
            "timelineActions[45]",
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
        },
        {
          "startFrame": 0,
          "endFrame": 57,
          "actionIndex": 208,
          "actionPath": [
            "timelineActions[72]",
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
        },
        {
          "startFrame": 200,
          "endFrame": 257,
          "actionIndex": 223,
          "actionPath": [
            "timelineActions[76]",
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
        },
        {
          "startFrame": 400,
          "endFrame": 436,
          "actionIndex": 238,
          "actionPath": [
            "timelineActions[80]",
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
        },
        {
          "startFrame": 600,
          "endFrame": 620,
          "actionIndex": 253,
          "actionPath": [
            "timelineActions[84]",
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
          "endFrame": 3,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
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
                  "buff_chr_0029_pograni_combo_skill_count4"
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 6,
              "blackboardMutation": {
                "key": "EntityBB_noguard_count",
                "operation": "Assign",
                "value": {
                  "value": 4.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "FinishBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 7,
              "legacyBuffFinish": {
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
                "buffIds": [
                  "buff_chr_0029_pograni_combo_skill_count1",
                  "buff_chr_0029_pograni_combo_skill_count2",
                  "buff_chr_0029_pograni_combo_skill_count3",
                  "buff_chr_0029_pograni_combo_skill_count4"
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[0]",
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
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
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
                        "buff_chr_0029_pograni_combo_skill_count3"
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
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[4]",
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
                    "serverActionIndex": 10,
                    "blackboardMutation": {
                      "key": "EntityBB_noguard_count",
                      "operation": "Assign",
                      "value": {
                        "value": 3.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    },
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  },
                  {
                    "actionType": "FinishBuffAction",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[4]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 11,
                    "legacyBuffFinish": {
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
                      "buffIds": [
                        "buff_chr_0029_pograni_combo_skill_count1",
                        "buff_chr_0029_pograni_combo_skill_count2",
                        "buff_chr_0029_pograni_combo_skill_count3",
                        "buff_chr_0029_pograni_combo_skill_count4"
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
                    "actionType": "IfElseAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[4]",
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
                    "serverActionIndex": 12,
                    "nestedCondition": {
                      "startFrame": 0,
                      "endFrame": 3,
                      "actionIndex": 12,
                      "actionPath": [
                        "timelineActions[4]",
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
                      "conditions": [
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
                              "buff_chr_0029_pograni_combo_skill_count2"
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
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[4]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 14,
                          "blackboardMutation": {
                            "key": "EntityBB_noguard_count",
                            "operation": "Assign",
                            "value": {
                              "value": 2.0,
                              "blackboardKey": null,
                              "levelValues": null
                            }
                          },
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null
                        },
                        {
                          "actionType": "FinishBuffAction",
                          "actionIndex": 1,
                          "actionPath": [
                            "timelineActions[4]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 15,
                          "legacyBuffFinish": {
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
                            "buffIds": [
                              "buff_chr_0029_pograni_combo_skill_count1",
                              "buff_chr_0029_pograni_combo_skill_count2",
                              "buff_chr_0029_pograni_combo_skill_count3",
                              "buff_chr_0029_pograni_combo_skill_count4"
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
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[4]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 16,
                          "blackboardMutation": {
                            "key": "EntityBB_noguard_count",
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
                          "actionType": "FinishBuffAction",
                          "actionIndex": 1,
                          "actionPath": [
                            "timelineActions[4]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[1]"
                          ],
                          "serverActionIndex": 17,
                          "legacyBuffFinish": {
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
                            "buffIds": [
                              "buff_chr_0029_pograni_combo_skill_count1",
                              "buff_chr_0029_pograni_combo_skill_count2",
                              "buff_chr_0029_pograni_combo_skill_count3",
                              "buff_chr_0029_pograni_combo_skill_count4"
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
          "endFrame": 57,
          "actionIndex": 206,
          "actionPath": [
            "timelineActions[72]",
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
                "timelineActions[72]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 208,
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
          "startFrame": 200,
          "endFrame": 257,
          "actionIndex": 221,
          "actionPath": [
            "timelineActions[76]",
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
                "timelineActions[76]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 223,
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
          "startFrame": 400,
          "endFrame": 436,
          "actionIndex": 236,
          "actionPath": [
            "timelineActions[80]",
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
                "timelineActions[80]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 238,
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
          "startFrame": 600,
          "endFrame": 620,
          "actionIndex": 251,
          "actionPath": [
            "timelineActions[84]",
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
                "timelineActions[84]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 253,
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
          "endFrame": 21,
          "actionIndex": 205,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.8,
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
          "sequenceIndex": 71,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 200,
          "endFrame": 221,
          "actionIndex": 220,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.8,
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
          "sequenceIndex": 75,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 400,
          "endFrame": 418,
          "actionIndex": 235,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.700000048,
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
          "sequenceIndex": 79,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 600,
          "endFrame": 619,
          "actionIndex": 250,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.73300004,
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
          "sequenceIndex": 83,
          "effectAbilityEntityTargets": []
        }
      ],
      "intervalDamageHits": [],
      "timelineJumps": [
        {
          "startFrame": 0,
          "endFrame": 1,
          "destFrame": 600,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[5]",
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
          "sequenceIndex": 5
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "destFrame": 400,
          "actionIndex": 23,
          "actionPath": [
            "timelineActions[5]",
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
          "conditionActionTypes": [],
          "directConditions": [],
          "directConditionNegated": [],
          "directAnyConditions": [],
          "directAnyConditionNegated": [],
          "directConditionsSupported": false,
          "isOnlySequenceAction": false,
          "isOnlyBranchAction": true,
          "isRootContainerOnlySequenceAction": true,
          "sequenceIndex": 5
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "destFrame": 200,
          "actionIndex": 26,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]",
            "failActions",
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
          "sequenceIndex": 5
        }
      ],
      "timelineJumpControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "LE",
              "left": {
                "value": 0.0,
                "blackboardKey": "EntityBB_noguard_count",
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
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 20,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "timelineJumpDestinationFrame": 600
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 21,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 1,
                "actionIndex": 21,
                "actionPath": [
                  "timelineActions[5]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LE",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "EntityBB_noguard_count",
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
                    "actionType": "JumpToAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[5]",
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
                    "serverActionIndex": 23,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "timelineJumpDestinationFrame": 400
                  }
                ],
                "failActions": [
                  {
                    "actionType": "IfElseAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[5]",
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
                    "serverActionIndex": 24,
                    "nestedCondition": {
                      "startFrame": 0,
                      "endFrame": 1,
                      "actionIndex": 24,
                      "actionPath": [
                        "timelineActions[5]",
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
                      "conditions": [
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "LE",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "EntityBB_noguard_count",
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
                          "actionType": "JumpToAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[5]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "failActions",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 26,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "timelineJumpDestinationFrame": 200
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
      "timelineFinishes": [
        {
          "startFrame": 191,
          "endFrame": 194,
          "actionIndex": 94,
          "sequenceIndex": 20
        },
        {
          "startFrame": 391,
          "endFrame": 394,
          "actionIndex": 96,
          "sequenceIndex": 22
        },
        {
          "startFrame": 545,
          "endFrame": 548,
          "actionIndex": 98,
          "sequenceIndex": 24
        }
      ]
    },
    {
      "key": "ultimate",
      "skillId": "chr_0029_pograni_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0029_pograni_ultimate_skill.json",
      "timelineBlockFrames": 91,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 100.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 210,
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
            "CheckEntityNum",
            "Selector",
            "FindTargetAction",
            "Selector",
            "Selector",
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "AnimatedCameraAction",
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 210,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 69,
          "endFrame": 100,
          "actionTypes": [
            "IgnoreModelIntervalCheck"
          ]
        },
        {
          "startFrame": 74,
          "endFrame": 77,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector",
            "Selector",
            "SpawnAbilityEntity",
            "Selector",
            "Selector",
            "SpawnAbilityEntity",
            "Selector",
            "Selector",
            "SpawnAbilityEntity",
            "Selector",
            "Selector",
            "SetIgnoreGlobalTimeScaleAction",
            "SetIgnoreGlobalTimeScaleAction",
            "SetIgnoreGlobalTimeScaleAction",
            "SetIgnoreGlobalTimeScaleAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 77,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 76,
          "endFrame": 79,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 76,
          "endFrame": 79,
          "actionTypes": [
            "ConvertToTargetContext",
            "Selector",
            "PullAction"
          ]
        },
        {
          "startFrame": 76,
          "endFrame": 82,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "InterruptAction",
            "BlowOffAction",
            "EnemyHurtAnimAction"
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
          "endFrame": 75,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "FinishOwnerAction",
            "FinishBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 150,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 80,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 210,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 79,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 210,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 210,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 75,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 210,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 75,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 210,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 75,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 210,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 75,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 210,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 75,
          "actionTypes": [
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 72,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 72,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 72,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 72,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 82,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 84,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 77,
          "endFrame": 167,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 76,
          "endFrame": 82,
          "actionIndex": 29,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_rush",
                "levelValues": [
                  1.33,
                  1.47,
                  1.6,
                  1.73,
                  1.86,
                  2.0,
                  2.13,
                  2.26,
                  2.4,
                  2.56,
                  2.76,
                  3.0
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
                "blackboardKey": "poise_rush",
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
          "sequenceIndex": 10
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 74,
          "endFrame": 77,
          "actionIndex": 17,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity",
          "classification": null,
          "targetSource": "",
          "targetGroupKey": "",
          "count": null,
          "buffSource": null,
          "inheritSourceSkillCastInfo": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [
            "CreateBuffAction"
          ],
          "buffSourceContextKey": null,
          "sequenceIndex": 6,
          "autoFinishByAction": null
        },
        {
          "startFrame": 74,
          "endFrame": 77,
          "actionIndex": 18,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity",
          "classification": null,
          "targetSource": "",
          "targetGroupKey": "",
          "count": null,
          "buffSource": null,
          "inheritSourceSkillCastInfo": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [
            "CreateBuffAction"
          ],
          "buffSourceContextKey": null,
          "sequenceIndex": 6,
          "autoFinishByAction": null
        },
        {
          "startFrame": 74,
          "endFrame": 77,
          "actionIndex": 19,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity",
          "classification": null,
          "targetSource": "",
          "targetGroupKey": "",
          "count": null,
          "buffSource": null,
          "inheritSourceSkillCastInfo": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [
            "CreateBuffAction"
          ],
          "buffSourceContextKey": null,
          "sequenceIndex": 6,
          "autoFinishByAction": null
        },
        {
          "startFrame": 74,
          "endFrame": 77,
          "actionIndex": 20,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity",
          "classification": null,
          "targetSource": "",
          "targetGroupKey": "",
          "count": null,
          "buffSource": null,
          "inheritSourceSkillCastInfo": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [
            "CreateBuffAction"
          ],
          "buffSourceContextKey": null,
          "sequenceIndex": 6,
          "autoFinishByAction": null
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionIndex": 33,
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
      "buffFinishes": [
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 39,
          "targetSource": "Source",
          "targetGroupKey": "",
          "buffCheckType": "Id",
          "buffIds": [
            "buff_chr_0029_pograni_ultimate_skill"
          ],
          "tagQueryType": "hasAny",
          "buffTagIds": [],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": false,
          "isAbsorbed": false,
          "finishLayerCount": null,
          "sourceActionType": "FinishBuffAction",
          "sequenceIndex": 15
        }
      ],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [
        {
          "spawnFrame": 74,
          "actionOrder": [
            17
          ],
          "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
          "skillId": "chr_0029_pograni_ultimate_skill_abilityentity",
          "sourceFile": "chr_0029_pograni_ultimate_skill_abilityentity.json",
          "entityBlackboardAssignments": [],
          "spawnPayload": {
            "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
            "skillId": "chr_0029_pograni_ultimate_skill_abilityentity",
            "entityBlackboardAssignments": [],
            "assignBlackboard": true,
            "sourceType": "ActionOwner",
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
            "saveToContextKey": "ae1",
            "dieWhenSourceDies": false,
            "dieOnEnd": false
          },
          "directDamageHits": [],
          "intervalDamageHits": [],
          "explicitFinishes": [
            {
              "startFrame": 50,
              "endFrame": 53,
              "actionIndex": 3,
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
              "skipDieDisplay": true,
              "sequenceIndex": 3
            }
          ],
          "timelineJumps": [],
          "conditionalActions": [],
          "inflictions": [],
          "auxiliaryActions": [
            {
              "startFrame": 3,
              "endFrame": 17,
              "actionIndex": 5,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0029_pograni_ultimate_skill",
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
                  "value": 60.0,
                  "blackboardKey": "duration",
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
                "atk_scale_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_trigger",
                  "levelValues": [
                    0.45,
                    0.49,
                    0.53,
                    0.58,
                    0.62,
                    0.67,
                    0.71,
                    0.76,
                    0.8,
                    0.86,
                    0.92,
                    1.0
                  ]
                },
                "atk_scale_final": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_final",
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
                "atb_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atb_trigger",
                  "levelValues": [
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    10.0,
                    10.0,
                    10.0
                  ]
                },
                "atb_final": {
                  "value": 0.0,
                  "blackboardKey": "atb_final",
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
                    40.0,
                    40.0,
                    40.0
                  ]
                },
                "poise_final": {
                  "value": 0.0,
                  "blackboardKey": "poise_final",
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
                }
              },
              "nestedCombatActions": [],
              "buffSourceContextKey": "",
              "sequenceIndex": 4,
              "autoFinishByAction": false
            }
          ],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileTriggeredSkills": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [
            "CreateBuffAction"
          ],
          "cycleTruncated": false,
          "inheritsSourceBlackboard": true,
          "declaredBlackboard": [
            {
              "key": "atb_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "atb_trigger",
              "value": 4.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_rush",
              "value": 1.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_trigger",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "duration",
              "value": 20.0,
              "isDynamic": false
            },
            {
              "key": "poise_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 5.0,
              "isDynamic": false
            }
          ],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "auraActions": [],
          "presentationOnlySwitchActionIndexes": []
        },
        {
          "spawnFrame": 74,
          "actionOrder": [
            18
          ],
          "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
          "skillId": "chr_0029_pograni_ultimate_skill_abilityentity",
          "sourceFile": "chr_0029_pograni_ultimate_skill_abilityentity.json",
          "entityBlackboardAssignments": [],
          "spawnPayload": {
            "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
            "skillId": "chr_0029_pograni_ultimate_skill_abilityentity",
            "entityBlackboardAssignments": [],
            "assignBlackboard": true,
            "sourceType": "ActionOwner",
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
            "saveToContextKey": "ae2",
            "dieWhenSourceDies": false,
            "dieOnEnd": false
          },
          "directDamageHits": [],
          "intervalDamageHits": [],
          "explicitFinishes": [
            {
              "startFrame": 50,
              "endFrame": 53,
              "actionIndex": 3,
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
              "skipDieDisplay": true,
              "sequenceIndex": 3
            }
          ],
          "timelineJumps": [],
          "conditionalActions": [],
          "inflictions": [],
          "auxiliaryActions": [
            {
              "startFrame": 3,
              "endFrame": 17,
              "actionIndex": 5,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0029_pograni_ultimate_skill",
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
                  "value": 60.0,
                  "blackboardKey": "duration",
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
                "atk_scale_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_trigger",
                  "levelValues": [
                    0.45,
                    0.49,
                    0.53,
                    0.58,
                    0.62,
                    0.67,
                    0.71,
                    0.76,
                    0.8,
                    0.86,
                    0.92,
                    1.0
                  ]
                },
                "atk_scale_final": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_final",
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
                "atb_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atb_trigger",
                  "levelValues": [
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    10.0,
                    10.0,
                    10.0
                  ]
                },
                "atb_final": {
                  "value": 0.0,
                  "blackboardKey": "atb_final",
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
                    40.0,
                    40.0,
                    40.0
                  ]
                },
                "poise_final": {
                  "value": 0.0,
                  "blackboardKey": "poise_final",
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
                }
              },
              "nestedCombatActions": [],
              "buffSourceContextKey": "",
              "sequenceIndex": 4,
              "autoFinishByAction": false
            }
          ],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileTriggeredSkills": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [
            "CreateBuffAction"
          ],
          "cycleTruncated": false,
          "inheritsSourceBlackboard": true,
          "declaredBlackboard": [
            {
              "key": "atb_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "atb_trigger",
              "value": 4.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_rush",
              "value": 1.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_trigger",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "duration",
              "value": 20.0,
              "isDynamic": false
            },
            {
              "key": "poise_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 5.0,
              "isDynamic": false
            }
          ],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "auraActions": [],
          "presentationOnlySwitchActionIndexes": []
        },
        {
          "spawnFrame": 74,
          "actionOrder": [
            19
          ],
          "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
          "skillId": "chr_0029_pograni_ultimate_skill_abilityentity",
          "sourceFile": "chr_0029_pograni_ultimate_skill_abilityentity.json",
          "entityBlackboardAssignments": [],
          "spawnPayload": {
            "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
            "skillId": "chr_0029_pograni_ultimate_skill_abilityentity",
            "entityBlackboardAssignments": [],
            "assignBlackboard": true,
            "sourceType": "ActionOwner",
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
            "saveToContextKey": "ae3",
            "dieWhenSourceDies": false,
            "dieOnEnd": false
          },
          "directDamageHits": [],
          "intervalDamageHits": [],
          "explicitFinishes": [
            {
              "startFrame": 50,
              "endFrame": 53,
              "actionIndex": 3,
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
              "skipDieDisplay": true,
              "sequenceIndex": 3
            }
          ],
          "timelineJumps": [],
          "conditionalActions": [],
          "inflictions": [],
          "auxiliaryActions": [
            {
              "startFrame": 3,
              "endFrame": 17,
              "actionIndex": 5,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0029_pograni_ultimate_skill",
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
                  "value": 60.0,
                  "blackboardKey": "duration",
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
                "atk_scale_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_trigger",
                  "levelValues": [
                    0.45,
                    0.49,
                    0.53,
                    0.58,
                    0.62,
                    0.67,
                    0.71,
                    0.76,
                    0.8,
                    0.86,
                    0.92,
                    1.0
                  ]
                },
                "atk_scale_final": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_final",
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
                "atb_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atb_trigger",
                  "levelValues": [
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    10.0,
                    10.0,
                    10.0
                  ]
                },
                "atb_final": {
                  "value": 0.0,
                  "blackboardKey": "atb_final",
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
                    40.0,
                    40.0,
                    40.0
                  ]
                },
                "poise_final": {
                  "value": 0.0,
                  "blackboardKey": "poise_final",
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
                }
              },
              "nestedCombatActions": [],
              "buffSourceContextKey": "",
              "sequenceIndex": 4,
              "autoFinishByAction": false
            }
          ],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileTriggeredSkills": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [
            "CreateBuffAction"
          ],
          "cycleTruncated": false,
          "inheritsSourceBlackboard": true,
          "declaredBlackboard": [
            {
              "key": "atb_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "atb_trigger",
              "value": 4.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_rush",
              "value": 1.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_trigger",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "duration",
              "value": 20.0,
              "isDynamic": false
            },
            {
              "key": "poise_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 5.0,
              "isDynamic": false
            }
          ],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "auraActions": [],
          "presentationOnlySwitchActionIndexes": []
        },
        {
          "spawnFrame": 74,
          "actionOrder": [
            20
          ],
          "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
          "skillId": "chr_0029_pograni_ultimate_skill_abilityentity",
          "sourceFile": "chr_0029_pograni_ultimate_skill_abilityentity.json",
          "entityBlackboardAssignments": [],
          "spawnPayload": {
            "abilityEntityId": "abilityentity_chr_0029_pograni_ultimate_skill",
            "skillId": "chr_0029_pograni_ultimate_skill_abilityentity",
            "entityBlackboardAssignments": [],
            "assignBlackboard": true,
            "sourceType": "ActionOwner",
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
            "saveToContextKey": "ae4",
            "dieWhenSourceDies": false,
            "dieOnEnd": false
          },
          "directDamageHits": [],
          "intervalDamageHits": [],
          "explicitFinishes": [
            {
              "startFrame": 50,
              "endFrame": 53,
              "actionIndex": 3,
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
              "skipDieDisplay": true,
              "sequenceIndex": 3
            }
          ],
          "timelineJumps": [],
          "conditionalActions": [],
          "inflictions": [],
          "auxiliaryActions": [
            {
              "startFrame": 3,
              "endFrame": 17,
              "actionIndex": 5,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0029_pograni_ultimate_skill",
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
                  "value": 60.0,
                  "blackboardKey": "duration",
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
                "atk_scale_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_trigger",
                  "levelValues": [
                    0.45,
                    0.49,
                    0.53,
                    0.58,
                    0.62,
                    0.67,
                    0.71,
                    0.76,
                    0.8,
                    0.86,
                    0.92,
                    1.0
                  ]
                },
                "atk_scale_final": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale_final",
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
                "atb_trigger": {
                  "value": 0.0,
                  "blackboardKey": "atb_trigger",
                  "levelValues": [
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    7.5,
                    10.0,
                    10.0,
                    10.0
                  ]
                },
                "atb_final": {
                  "value": 0.0,
                  "blackboardKey": "atb_final",
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
                    40.0,
                    40.0,
                    40.0
                  ]
                },
                "poise_final": {
                  "value": 0.0,
                  "blackboardKey": "poise_final",
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
                }
              },
              "nestedCombatActions": [],
              "buffSourceContextKey": "",
              "sequenceIndex": 4,
              "autoFinishByAction": false
            }
          ],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileTriggeredSkills": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [
            "CreateBuffAction"
          ],
          "cycleTruncated": false,
          "inheritsSourceBlackboard": true,
          "declaredBlackboard": [
            {
              "key": "atb_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "atb_trigger",
              "value": 4.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_rush",
              "value": 1.0,
              "isDynamic": false
            },
            {
              "key": "atk_scale_trigger",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "duration",
              "value": 20.0,
              "isDynamic": false
            },
            {
              "key": "poise_final",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 5.0,
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
          "atb_final": [
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            30.0,
            40.0,
            40.0,
            40.0
          ],
          "atb_trigger": [
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            10.0,
            10.0,
            10.0
          ],
          "atk_scale_final": [
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
          "atk_scale_rush": [
            1.33,
            1.47,
            1.6,
            1.73,
            1.86,
            2.0,
            2.13,
            2.26,
            2.4,
            2.56,
            2.76,
            3.0
          ],
          "atk_scale_trigger": [
            0.45,
            0.49,
            0.53,
            0.58,
            0.62,
            0.67,
            0.71,
            0.76,
            0.8,
            0.86,
            0.92,
            1.0
          ],
          "duration": [
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
          "poise_final": [
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
          "poise_rush": [
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
          "key": "angle",
          "value": 120.0,
          "isDynamic": false
        },
        {
          "key": "atb_final",
          "value": 50.0,
          "isDynamic": false
        },
        {
          "key": "atb_trigger",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_final",
          "value": 4.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_rush",
          "value": 4.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_trigger",
          "value": 2.0,
          "isDynamic": false
        },
        {
          "key": "center_radius",
          "value": 6.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 30.0,
          "isDynamic": false
        },
        {
          "key": "height",
          "value": 4.0,
          "isDynamic": false
        },
        {
          "key": "poise_final",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "poise_rush",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "radius",
          "value": 5.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale_rush",
        "center_radius",
        "poise_rush"
      ],
      "blackboardProvenance": [
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
          "key": "atb_final",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb_trigger",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_final",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_rush",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_trigger",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "center_radius",
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
          "key": "height",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise_final",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise_rush",
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
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "DamageAction",
        "FinishBuffAction",
        "SpawnAbilityEntity"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
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
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[2]"
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
          "endFrame": 1,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[3]"
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
          "startFrame": 76,
          "endFrame": 79,
          "actionIndex": 26,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "centerRange",
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
          "endFrame": 3,
          "actionIndex": 37,
          "actionPath": [
            "timelineActions[15]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "soldiers",
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
                963241770
              ]
            ]
          ],
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
          "endFrame": 75,
          "actionIndex": 35,
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
          "sequenceIndex": 13,
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
