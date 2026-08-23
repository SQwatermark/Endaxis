/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const daPanGeneratedSource = {
  "slug": "da-pan",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0018_dapan_combo_skill_tutorial_marker",
      "sourceFile": "buff_chr_0018_dapan_combo_skill_tutorial_marker.json",
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
      "buffId": "buff_chr_0018_dapan_potential_1",
      "sourceFile": "buff_chr_0018_dapan_potential_1.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 10.0,
          "blackboardKey": "duration",
          "levelValues": [
            15.0
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
          "key": "dmg_up",
          "value": 0.15,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 15.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [
        {
          "targetType": "Specific",
          "attributeType": "PhysicalDamageIncrease",
          "slot": "BaseAddition",
          "value": {
            "value": 0.0,
            "blackboardKey": "dmg_up",
            "levelValues": [
              0.15
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
                    "buffId": "buff_common_vfx_char_atk_up",
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
            "buff_common_vfx_char_atk_up"
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
                        "buffId": "buff_common_vfx_char_atk_up",
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
                  "serverActionIndex": 0,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_common_vfx_char_atk_up",
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
        "spritePath": "icon_battle_buff_atk_up",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": true,
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
      "buffId": "buff_chr_0018_dapan_talent_0",
      "sourceFile": "buff_chr_0018_dapan_talent_0.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
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
          "key": "consumedLayer",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "dmg_up",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "stack",
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
          "event": "OnConsumeBuff",
          "orderedActionTypes": [
            "CheckBuffIdInContextAdvanced",
            "CheckConsumeBuffLayer",
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
                    "buffId": "buff_chr_0018_dapan_talent_0_dmg_up",
                    "classification": null,
                    "blackboardAssignments": {
                      "dmg_up": {
                        "value": 0.0,
                        "blackboardKey": "dmg_up",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "duration",
                        "levelValues": [
                          0.0
                        ]
                      },
                      "stack": {
                        "value": 0.0,
                        "blackboardKey": "stack",
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
                  "blackboardKey": "consumedLayer",
                  "levelValues": [
                    0.0
                  ]
                },
                "buffSource": "ActionSource",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            }
          ],
          "createdBuffIds": [
            "buff_chr_0018_dapan_talent_0_dmg_up"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckBuffIdInContextAdvanced",
                "CheckConsumeBuffLayer",
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
                        "buffId": "buff_chr_0018_dapan_talent_0_dmg_up",
                        "classification": null,
                        "blackboardAssignments": {
                          "dmg_up": {
                            "value": 0.0,
                            "blackboardKey": "dmg_up",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "stack": {
                            "value": 0.0,
                            "blackboardKey": "stack",
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
                      "blackboardKey": "consumedLayer",
                      "levelValues": [
                        0.0
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
                        "buffId": "buff_chr_0018_dapan_talent_0_dmg_up",
                        "classification": null,
                        "blackboardAssignments": {
                          "dmg_up": {
                            "value": 0.0,
                            "blackboardKey": "dmg_up",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "duration": {
                            "value": 0.0,
                            "blackboardKey": "duration",
                            "levelValues": [
                              0.0
                            ]
                          },
                          "stack": {
                            "value": 0.0,
                            "blackboardKey": "stack",
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
                      "blackboardKey": "consumedLayer",
                      "levelValues": [
                        0.0
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
          "contextBuffIdQueries": [
            [
              "buff_physical_no_guard"
            ]
          ],
          "consumeBuffLayerChecks": [
            [
              "GE",
              1.0,
              "consumedLayer"
            ]
          ],
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
      "buffId": "buff_chr_0018_dapan_talent_0_dmg_up",
      "sourceFile": "buff_chr_0018_dapan_talent_0_dmg_up.json",
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
        "stackingType": "EnhanceAndRefresh",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 1.0,
          "blackboardKey": "stack",
          "levelValues": [
            0.0
          ]
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "consumedLayer",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "dmg_up",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "stack",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [
        {
          "targetType": "Specific",
          "attributeType": "PhysicalDamageIncrease",
          "slot": "BaseAddition",
          "value": {
            "value": 0.0,
            "blackboardKey": "dmg_up",
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
        "spritePath": "icon_battle_physical_dmg_up",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": true,
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
      "buffId": "buff_chr_0018_dapan_talent_1_cd_reduce",
      "sourceFile": "buff_chr_0018_dapan_talent_1_cd_reduce.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 15.0,
          "blackboardKey": "duration",
          "levelValues": [
            15.0
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
          "value": 2.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "cd_reduce",
          "value": 0.5,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 15.0,
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
            "SkillAffixAction"
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
                "SkillAffixAction"
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
          "eventSource": "ability",
          "event": "OnOutputDamage",
          "orderedActionTypes": [
            "SetSkillCdAtOnce",
            "FinishBuffAction",
            "FinishBuffAction"
          ],
          "combatActions": [
            "FinishBuffAction",
            "SetSkillCdAtOnce"
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
                "SetSkillCdAtOnce",
                "FinishBuffAction",
                "FinishBuffAction"
              ],
              "combatActions": [
                "SetSkillCdAtOnce",
                "FinishBuffAction",
                "FinishBuffAction"
              ],
              "buffApplications": [],
              "actions": [
                {
                  "actionType": "SetSkillCdAtOnce",
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
                    "functionType": "Reduce",
                    "isPercentage": true,
                    "value": {
                      "value": 0.0,
                      "blackboardKey": "cd_reduce",
                      "levelValues": [
                        0.5
                      ]
                    }
                  },
                  "buffIgnite": null
                },
                {
                  "actionType": "FinishBuffAction",
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
                  "serverActionIndex": 2,
                  "legacyBuffFinish": {
                    "target": {
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
                    "buffIds": [
                      "buff_chr_0018_dapan_talent_1_preparation"
                    ],
                    "finishAll": false,
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
                },
                {
                  "actionType": "FinishBuffAction",
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
                  "legacyBuffFinish": {
                    "target": {
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
                    "buffIds": [
                      "buff_chr_0018_dapan_talent_1_cd_reduce"
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
      "buffId": "buff_chr_0018_dapan_talent_1_preparation",
      "sourceFile": "buff_chr_0018_dapan_talent_1_preparation.json",
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
        "stackingType": "EnhanceAndRefresh",
        "stackingKey": "",
        "priority": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 2.0,
          "blackboardKey": "max_stack",
          "levelValues": [
            2.0
          ]
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "duration",
          "value": 15.0,
          "isDynamic": true
        },
        {
          "key": "max_stack",
          "value": 2.0,
          "isDynamic": false
        },
        {
          "key": "talent_1_cd_reduce",
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
          "event": "OnBeforeCastSkill",
          "orderedActionTypes": [
            "CheckSkillType",
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
                    "buffId": "buff_chr_0018_dapan_talent_1_cd_reduce",
                    "classification": null,
                    "blackboardAssignments": {
                      "cd_reduce": {
                        "value": 0.0,
                        "blackboardKey": "talent_1_cd_reduce",
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
            "buff_chr_0018_dapan_talent_1_cd_reduce"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckSkillType",
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
                        "buffId": "buff_chr_0018_dapan_talent_1_cd_reduce",
                        "classification": null,
                        "blackboardAssignments": {
                          "cd_reduce": {
                            "value": 0.0,
                            "blackboardKey": "talent_1_cd_reduce",
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
                        "buffId": "buff_chr_0018_dapan_talent_1_cd_reduce",
                        "classification": null,
                        "blackboardAssignments": {
                          "cd_reduce": {
                            "value": 0.0,
                            "blackboardKey": "talent_1_cd_reduce",
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
        "hasIcon": true,
        "spritePath": "icon_battle_dapan_buff",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": true,
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
      "buffId": "buff_common_vfx_char_atk_up",
      "sourceFile": "buff_common_vfx_char_atk_up.json",
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
      "skillId": "chr_0018_dapan_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0018_dapan_attack1.json",
      "timelineBlockFrames": 15,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 13,
      "allowNextWindows": [
        {
          "startFrame": 15,
          "endFrame": 30,
          "skillIds": [
            "chr_0018_dapan_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 30,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0018_dapan_attack2",
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
          "endFrame": 176,
          "actionTypes": [
            "PlayAnimationAction"
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
          "endFrame": 83,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 14,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
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
          "startFrame": 14,
          "endFrame": 15,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 13,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "CameraImpulseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionTypes": [
            "BreakInteractiveAction",
            "DefiniteValueCalculation",
            "Selector"
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
          "startFrame": 12,
          "endFrame": 64,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 64,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 176,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 20,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 65,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 30,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 30,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 13,
          "endFrame": 13,
          "actionIndex": 8,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.28,
                  0.31,
                  0.34,
                  0.37,
                  0.39,
                  0.42,
                  0.45,
                  0.48,
                  0.51,
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
          "sequenceIndex": 6
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 13,
          "endFrame": 13,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[6]",
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
              "serverActionIndex": 12,
              "nestedCondition": {
                "startFrame": 13,
                "endFrame": 13,
                "actionIndex": 12,
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
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]"
                    ],
                    "serverActionIndex": 17,
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
            0.28,
            0.31,
            0.34,
            0.37,
            0.39,
            0.42,
            0.45,
            0.48,
            0.51,
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
          "value": 0.15,
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
          "startFrame": 13,
          "endFrame": 14,
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
          "startFrame": 14,
          "endFrame": 15,
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
          "startFrame": 13,
          "endFrame": 13,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[6]",
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
              "serverActionIndex": 12,
              "nestedCondition": {
                "startFrame": 13,
                "endFrame": 13,
                "actionIndex": 12,
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
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]"
                    ],
                    "serverActionIndex": 17,
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
      "skillId": "chr_0018_dapan_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0018_dapan_attack2.json",
      "timelineBlockFrames": 20,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 7,
      "allowNextWindows": [
        {
          "startFrame": 20,
          "endFrame": 25,
          "skillIds": [
            "chr_0018_dapan_attack3"
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
              "skillId": "chr_0018_dapan_attack3",
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
          "endFrame": 171,
          "actionTypes": [
            "PlayAnimationAction"
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
          "endFrame": 85,
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
          "endFrame": 8,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "CameraImpulseAction",
            "ObtainCostAction"
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
          "startFrame": 6,
          "endFrame": 56,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 170,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 16,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 95,
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
          "startFrame": 20,
          "endFrame": 25,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 7,
          "endFrame": 8,
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
                  0.34,
                  0.37,
                  0.4,
                  0.44,
                  0.47,
                  0.5,
                  0.54,
                  0.57,
                  0.6,
                  0.64,
                  0.7,
                  0.75
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
          "startFrame": 7,
          "endFrame": 8,
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
              "actionType": "IfElseAction",
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
              "serverActionIndex": 10,
              "nestedCondition": {
                "startFrame": 7,
                "endFrame": 8,
                "actionIndex": 10,
                "actionPath": [
                  "timelineActions[5]",
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
                    "actionIndex": 3,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]"
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
                          0.0,
                          0.0,
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
            0.34,
            0.37,
            0.4,
            0.44,
            0.47,
            0.5,
            0.54,
            0.57,
            0.6,
            0.64,
            0.7,
            0.75
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
          "startFrame": 7,
          "endFrame": 8,
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
          "startFrame": 7,
          "endFrame": 8,
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
              "actionType": "IfElseAction",
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
              "serverActionIndex": 10,
              "nestedCondition": {
                "startFrame": 7,
                "endFrame": 8,
                "actionIndex": 10,
                "actionPath": [
                  "timelineActions[5]",
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
                    "actionIndex": 3,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[3]"
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
                          0.0,
                          0.0,
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
      "skillId": "chr_0018_dapan_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0018_dapan_attack3.json",
      "timelineBlockFrames": 25,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 10,
      "allowNextWindows": [
        {
          "startFrame": 25,
          "endFrame": 40,
          "skillIds": [
            "chr_0018_dapan_attack4"
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
              "skillId": "chr_0018_dapan_attack4",
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
          "endFrame": 193,
          "actionTypes": [
            "PlayAnimationAction"
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
          "endFrame": 14,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 90,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 12,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 13,
          "actionTypes": [
            "ContinuousFindTargetAction",
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
          "startFrame": 10,
          "endFrame": 10,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "CameraImpulseAction",
            "HitStopAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 24,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "CameraImpulseAction",
            "HitStopAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 28,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 38,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 43,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 44,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 32,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 37,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 60,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 193,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 16,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 62,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 74,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 25,
          "endFrame": 40,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 10,
          "endFrame": 10,
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
                  0.17,
                  0.18,
                  0.2,
                  0.22,
                  0.23,
                  0.25,
                  0.27,
                  0.28,
                  0.3,
                  0.32,
                  0.35,
                  0.38
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 7
        },
        {
          "startFrame": 23,
          "endFrame": 24,
          "actionIndex": 18,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.34,
                  0.37,
                  0.4,
                  0.44,
                  0.47,
                  0.5,
                  0.54,
                  0.57,
                  0.6,
                  0.64,
                  0.7,
                  0.75
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 8
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[7]",
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
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 13,
              "nestedCondition": {
                "startFrame": 10,
                "endFrame": 10,
                "actionIndex": 13,
                "actionPath": [
                  "timelineActions[7]",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[7]",
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
                    "serverActionIndex": 17,
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
          "startFrame": 23,
          "endFrame": 24,
          "actionIndex": 20,
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
              "actionType": "IfElseAction",
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
              "nestedCondition": {
                "startFrame": 23,
                "endFrame": 24,
                "actionIndex": 22,
                "actionPath": [
                  "timelineActions[8]",
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
                      "timelineActions[8]",
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
            0.17,
            0.18,
            0.2,
            0.22,
            0.23,
            0.25,
            0.27,
            0.28,
            0.3,
            0.32,
            0.35,
            0.38
          ],
          "atk_scale_2": [
            0.34,
            0.37,
            0.4,
            0.44,
            0.47,
            0.5,
            0.54,
            0.57,
            0.6,
            0.64,
            0.7,
            0.75
          ],
          "display_atk_scale": [
            0.5,
            0.55,
            0.6,
            0.65,
            0.7,
            0.75,
            0.8,
            0.85,
            0.9,
            0.97,
            1.04,
            1.13
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
          "value": 25.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.15,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "env_dmg",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "env_dmg2",
          "value": 15.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale",
        "atk_scale_2",
        "env_dmg",
        "env_dmg2"
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
          "startFrame": 10,
          "endFrame": 13,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[5]",
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
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[7]",
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
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 13,
              "nestedCondition": {
                "startFrame": 10,
                "endFrame": 10,
                "actionIndex": 13,
                "actionPath": [
                  "timelineActions[7]",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[7]",
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
                    "serverActionIndex": 17,
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
          "startFrame": 23,
          "endFrame": 24,
          "actionIndex": 20,
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
              "actionType": "IfElseAction",
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
              "nestedCondition": {
                "startFrame": 23,
                "endFrame": 24,
                "actionIndex": 22,
                "actionPath": [
                  "timelineActions[8]",
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
                      "timelineActions[8]",
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
      "key": "basicAttack4",
      "skillId": "chr_0018_dapan_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0018_dapan_attack4.json",
      "timelineBlockFrames": 45,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 32,
      "allowNextWindows": [
        {
          "startFrame": 45,
          "endFrame": 70,
          "skillIds": [
            "chr_0018_dapan_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 70,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0018_dapan_attack1",
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
          "endFrame": 236,
          "actionTypes": [
            "PlayAnimationAction"
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
          "endFrame": 150,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 10,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 33,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 33,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "HitStopAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 34,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 29,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 52,
          "actionTypes": [
            "AddDynamicCcsAction"
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
          "startFrame": 30,
          "endFrame": 88,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 72,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 6,
          "endFrame": 236,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 70,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 32,
          "endFrame": 33,
          "actionIndex": 7,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.6,
                  0.66,
                  0.72,
                  0.78,
                  0.84,
                  0.9,
                  0.96,
                  1.03,
                  1.09,
                  1.16,
                  1.25,
                  1.36
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
          "sequenceIndex": 5
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 32,
          "endFrame": 33,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[5]",
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
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 11,
              "nestedCondition": {
                "startFrame": 32,
                "endFrame": 33,
                "actionIndex": 11,
                "actionPath": [
                  "timelineActions[5]",
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
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[0]",
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
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0
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
            21.0,
            21.0,
            21.0,
            21.0,
            21.0,
            21.0,
            21.0,
            21.0,
            21.0,
            21.0,
            21.0,
            21.0
          ],
          "atk_scale": [
            0.6,
            0.66,
            0.72,
            0.78,
            0.84,
            0.9,
            0.96,
            1.03,
            1.09,
            1.16,
            1.25,
            1.36
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
          "value": 8.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.15,
          "isDynamic": false
        },
        {
          "key": "env_dmg",
          "value": 50.0,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "talent_heal",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale",
        "env_dmg",
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
          "key": "env_dmg",
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
          "key": "talent_heal",
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
          "startFrame": 32,
          "endFrame": 33,
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
          "startFrame": 32,
          "endFrame": 33,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[5]",
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
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 11,
              "nestedCondition": {
                "startFrame": 32,
                "endFrame": 33,
                "actionIndex": 11,
                "actionPath": [
                  "timelineActions[5]",
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
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[0]",
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
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0,
                          21.0
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
      "key": "finisher",
      "skillId": "chr_0018_dapan_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0018_dapan_power_attack.json",
      "timelineBlockFrames": 35,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 4,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 35,
          "endFrame": 56,
          "skillIds": [
            "chr_0018_dapan_normal_skill",
            "chr_0018_dapan_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 56,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0018_dapan_normal_skill",
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
              "skillId": "chr_0018_dapan_combo_skill",
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
          "endFrame": 215,
          "actionTypes": [
            "PlayAnimationAction"
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
          "startFrame": 19,
          "endFrame": 36,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 215,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
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
          "startFrame": 35,
          "endFrame": 38,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 19,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 38,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction",
            "GainBreakingAttackAtb"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 60,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 17,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 35,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 60,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 88,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 85,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 30,
          "endFrame": 73,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 55,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 89,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 65,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 35,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 56,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 54,
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
          "startFrame": 21,
          "endFrame": 78,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 45,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 215,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 16,
          "endFrame": 19,
          "actionIndex": 6,
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
                "value": 0.4,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 6
        },
        {
          "startFrame": 35,
          "endFrame": 38,
          "actionIndex": 10,
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
                "value": 0.6,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 7
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionIndex": 32,
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
          "sequenceIndex": 19,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 35,
          "actionIndex": 33,
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
        "atk_scale"
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
          "startFrame": 16,
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
        },
        {
          "startFrame": 35,
          "endFrame": 38,
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
      "skillId": "chr_0018_dapan_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0018_dapan_plunging_attack_end.json",
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
          "endFrame": 188,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 188,
          "actionTypes": [
            "CustomRootMotionAction"
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
          "endFrame": 34,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 50,
          "endFrame": 75,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 1,
          "endFrame": 6,
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
          "startFrame": 1,
          "endFrame": 6,
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
          "startFrame": 1,
          "endFrame": 6,
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
      "skillId": "chr_0018_dapan_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0018_dapan_normal_skill.json",
      "timelineBlockFrames": 65,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 65,
          "endFrame": 89,
          "skillIds": [
            "chr_0018_dapan_normal_skill"
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
              "skillId": "chr_0018_dapan_normal_skill",
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
          "endFrame": 30,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 210,
          "actionTypes": [
            "PlayAnimationAction"
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
          "startFrame": 30,
          "endFrame": 47,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 11,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 210,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 42,
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
          "startFrame": 8,
          "endFrame": 11,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 46,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 11,
          "actionTypes": [
            "InterruptAction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 46,
          "actionTypes": [
            "AirborneAction",
            "IfElseAction",
            "CheckTimedMarkerCondition",
            "CheckEntityNum",
            "CreateBuffAction",
            "CreateTimedMarker",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 43,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 46,
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
          "endFrame": 49,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 124,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 70,
          "endFrame": 137,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 74,
          "actionTypes": [
            "ShowHideActorAction"
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
          "startFrame": 65,
          "endFrame": 89,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 71,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 71,
          "endFrame": 212,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 90,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 61,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 97,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 8,
          "endFrame": 11,
          "actionIndex": 30,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_pre",
                "levelValues": [
                  0.18,
                  0.2,
                  0.22,
                  0.23,
                  0.25,
                  0.27,
                  0.29,
                  0.31,
                  0.32,
                  0.35,
                  0.37,
                  0.41
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4352
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 10
        },
        {
          "startFrame": 43,
          "endFrame": 46,
          "actionIndex": 41,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  1.15,
                  1.27,
                  1.38,
                  1.5,
                  1.61,
                  1.73,
                  1.84,
                  1.96,
                  2.07,
                  2.22,
                  2.39,
                  2.59
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
          "sequenceIndex": 11
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 43,
          "endFrame": 46,
          "actionIndex": 35,
          "actionPath": [
            "timelineActions[11]",
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
                "blackboardKey": "potential_5_interval",
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
              "actionType": "CheckTimedMarkerCondition",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 37,
              "nestedCondition": {
                "startFrame": 43,
                "endFrame": 46,
                "actionIndex": 37,
                "actionPath": [
                  "timelineActions[11]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
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
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "markerId": "potential_5_interval",
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
                    "actionType": "CreateBuffAction",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 39,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_physical_no_guard",
                          "classification": null,
                          "blackboardAssignments": {}
                        }
                      ],
                      "targetSource": "Context",
                      "targetGroupKey": "tar",
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
                    "actionIndex": 3,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[3]"
                    ],
                    "serverActionIndex": 40,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "timedMarkerApplication": {
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "markerId": "potential_5_interval",
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "potential_5_interval",
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
                      "autoFinishByAction": false,
                      "useTimeDilationDt": false
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
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 43,
          "endFrame": 46,
          "actionIndex": 45,
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
          "sequenceIndex": 11,
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
        "buff_common_obtain_ultimate_sp",
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
          "airborne_duration": [
            1.8,
            1.8,
            1.8,
            1.8,
            1.8,
            1.8,
            1.8,
            1.8,
            1.8,
            1.8,
            1.8,
            1.8
          ],
          "atk_scale": [
            1.15,
            1.27,
            1.38,
            1.5,
            1.61,
            1.73,
            1.84,
            1.96,
            2.07,
            2.22,
            2.39,
            2.59
          ],
          "atk_scale_pre": [
            0.18,
            0.2,
            0.22,
            0.23,
            0.25,
            0.27,
            0.29,
            0.31,
            0.32,
            0.35,
            0.37,
            0.41
          ],
          "display_atk_scale": [
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
          "key": "airborne_duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 2.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_pre",
          "value": 0.2,
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
          "key": "poise",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "potential_5_interval",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "12",
        "airborne_duration",
        "atk_scale",
        "atk_scale_pre",
        "cam_angle",
        "input_angle",
        "poise",
        "potential_5_interval"
      ],
      "blackboardProvenance": [
        {
          "key": "12",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        },
        {
          "key": "airborne_duration",
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
          "key": "atk_scale_pre",
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
          "key": "display_atk_scale",
          "declaredInSkill": false,
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
          "key": "poise",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_5_interval",
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
        "CreateTimedMarker",
        "DamageAction",
        "IfElseAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 11,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[4]",
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
          "startFrame": 0,
          "endFrame": 11,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
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
          "startFrame": 0,
          "endFrame": 11,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[2]"
          ],
          "targetGroupKey": "TarDummy",
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
          "startFrame": 8,
          "endFrame": 11,
          "actionIndex": 27,
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
          "startFrame": 43,
          "endFrame": 46,
          "actionIndex": 28,
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
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 11,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[4]",
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
                "timelineActions[4]",
                "_sequenceActionData",
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
            },
            {
              "actionType": "FindTargetAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 7,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "FindTargetAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[2]"
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
          "startFrame": 43,
          "endFrame": 46,
          "actionIndex": 35,
          "actionPath": [
            "timelineActions[11]",
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
                "blackboardKey": "potential_5_interval",
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
              "actionType": "CheckTimedMarkerCondition",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 37,
              "nestedCondition": {
                "startFrame": 43,
                "endFrame": 46,
                "actionIndex": 37,
                "actionPath": [
                  "timelineActions[11]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
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
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "markerId": "potential_5_interval",
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
                    "actionType": "CreateBuffAction",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 39,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_physical_no_guard",
                          "classification": null,
                          "blackboardAssignments": {}
                        }
                      ],
                      "targetSource": "Context",
                      "targetGroupKey": "tar",
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
                    "actionIndex": 3,
                    "actionPath": [
                      "timelineActions[11]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[3]"
                    ],
                    "serverActionIndex": 40,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "timedMarkerApplication": {
                      "targetSource": "Owner",
                      "targetGroupKey": "",
                      "markerId": "potential_5_interval",
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "potential_5_interval",
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
                      "autoFinishByAction": false,
                      "useTimeDilationDt": false
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
      "skillId": "chr_0018_dapan_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0018_dapan_combo_skill.json",
      "timelineBlockFrames": 24,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 10.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 24,
          "endFrame": 59,
          "skillIds": [
            "chr_0018_dapan_normal_skill"
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
              "skillId": "chr_0018_dapan_normal_skill",
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
          "endFrame": 146,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": []
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
          "endFrame": 26,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 146,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 26,
          "actionTypes": [
            "MoveToAction"
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
          "startFrame": 23,
          "endFrame": 26,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionTypes": [
            "CreateBuffAction",
            "CheckEntityNum",
            "CrushAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "CameraImpulseAction",
            "HitStopAction",
            "ObtainCostAction"
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
          "startFrame": 21,
          "endFrame": 94,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 65,
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
          "endFrame": 17,
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
          "endFrame": 59,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 59,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 99,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 111,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 23,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 95,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 21,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 5.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  2.89,
                  3.18,
                  3.47,
                  3.75,
                  4.04,
                  4.33,
                  4.62,
                  4.91,
                  5.2,
                  5.56,
                  5.99,
                  6.5
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
          "sequenceIndex": 8
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 18,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0018_dapan_combo_skill_tutorial_marker",
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
          "sequenceIndex": 8,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 25,
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
          "sequenceIndex": 8
        }
      ],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0018_dapan_combo_skill_tutorial_marker",
        "buff_physical_crushed",
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
            2.89,
            3.18,
            3.47,
            3.75,
            4.04,
            4.33,
            4.62,
            4.91,
            5.2,
            5.56,
            5.99,
            6.5
          ],
          "crush_multi": [
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.15,
            1.15,
            1.15,
            1.2
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
          "value": 5.0,
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
          "key": "crush_multi",
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
          "key": "potential_1",
          "value": 0.0,
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
        "crush_multi",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
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
          "key": "crush_multi",
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
        "CrushAction",
        "DamageAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 26,
          "actionIndex": 13,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "failActions",
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
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 17,
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
          "startFrame": 0,
          "endFrame": 16,
          "actionIndex": 33,
          "actionPath": [
            "timelineActions[14]",
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
          "endFrame": 26,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
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
                "distance": 10.0,
                "lessThan": true,
                "includeTargetRadius": true,
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
          "succeedActions": [],
          "failActions": [
            {
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 13,
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
          "endFrame": 16,
          "actionIndex": 31,
          "actionPath": [
            "timelineActions[14]",
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
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 33,
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
      "physicalInflictions": [
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionIndex": 20,
          "payload": {
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
              "value": 3.0,
              "blackboardKey": null,
              "levelValues": null
            },
            "distanceRandomRange": {
              "value": 0.5,
              "blackboardKey": null,
              "levelValues": null
            },
            "overwriteHeight": true,
            "blowOffHeight": {
              "value": 0.5,
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
            "damageMultiplier": {
              "value": 1.5,
              "blackboardKey": "crush_multi",
              "levelValues": [
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.1,
                1.15,
                1.15,
                1.15,
                1.2
              ]
            },
            "ignoreHitEffect": false
          },
          "sequenceIndex": 8
        }
      ],
      "eventListeners": [],
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionIndex": 30,
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
          "sequenceIndex": 13,
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
      "skillId": "chr_0018_dapan_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0018_dapan_ultimate_skill.json",
      "timelineBlockFrames": 86,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 8.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 86,
          "endFrame": 120,
          "skillIds": [
            "chr_0018_dapan_normal_skill",
            "chr_0018_dapan_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 120,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0018_dapan_normal_skill",
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
              "skillId": "chr_0018_dapan_combo_skill",
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
          "endFrame": 235,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "TeleportAction",
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 89,
          "actionTypes": [
            "EventListenerAction"
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
          "startFrame": 42,
          "endFrame": 64,
          "actionTypes": [
            "ContinuousFindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 80,
          "endFrame": 81,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "AirborneAction"
          ]
        },
        {
          "startFrame": 42,
          "endFrame": 64,
          "actionTypes": []
        },
        {
          "startFrame": 42,
          "endFrame": 42,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 46,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 50,
          "endFrame": 50,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 54,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 58,
          "endFrame": 58,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 62,
          "endFrame": 62,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 80,
          "endFrame": 81,
          "actionTypes": [
            "IfElseAction",
            "ForEachAction",
            "CreateBuffAction",
            "KnockDownAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 82,
          "endFrame": 85,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
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
          "endFrame": 78,
          "actionTypes": [
            "AnimatedCameraAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 120,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 120,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "endFrame": 132,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 43,
          "endFrame": 139,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 132,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 132,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 129,
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
          "endFrame": 100,
          "actionTypes": [
            "CreateBuffAction",
            "Selector"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 234,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 132,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 235,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 42,
          "endFrame": 42,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_loop",
                "levelValues": [
                  0.22,
                  0.24,
                  0.26,
                  0.29,
                  0.31,
                  0.33,
                  0.35,
                  0.37,
                  0.4,
                  0.42,
                  0.46,
                  0.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 9
        },
        {
          "startFrame": 46,
          "endFrame": 46,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_loop",
                "levelValues": [
                  0.22,
                  0.24,
                  0.26,
                  0.29,
                  0.31,
                  0.33,
                  0.35,
                  0.37,
                  0.4,
                  0.42,
                  0.46,
                  0.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 10
        },
        {
          "startFrame": 50,
          "endFrame": 50,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_loop",
                "levelValues": [
                  0.22,
                  0.24,
                  0.26,
                  0.29,
                  0.31,
                  0.33,
                  0.35,
                  0.37,
                  0.4,
                  0.42,
                  0.46,
                  0.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 11
        },
        {
          "startFrame": 54,
          "endFrame": 54,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_loop",
                "levelValues": [
                  0.22,
                  0.24,
                  0.26,
                  0.29,
                  0.31,
                  0.33,
                  0.35,
                  0.37,
                  0.4,
                  0.42,
                  0.46,
                  0.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 12
        },
        {
          "startFrame": 58,
          "endFrame": 58,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_loop",
                "levelValues": [
                  0.22,
                  0.24,
                  0.26,
                  0.29,
                  0.31,
                  0.33,
                  0.35,
                  0.37,
                  0.4,
                  0.42,
                  0.46,
                  0.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 13
        },
        {
          "startFrame": 62,
          "endFrame": 62,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_loop",
                "levelValues": [
                  0.22,
                  0.24,
                  0.26,
                  0.29,
                  0.31,
                  0.33,
                  0.35,
                  0.37,
                  0.4,
                  0.42,
                  0.46,
                  0.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 14
        },
        {
          "startFrame": 80,
          "endFrame": 81,
          "actionIndex": 26,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_end",
                "levelValues": [
                  1.78,
                  1.96,
                  2.13,
                  2.31,
                  2.49,
                  2.67,
                  2.84,
                  3.02,
                  3.2,
                  3.42,
                  3.69,
                  4.0
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 15
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 80,
          "endFrame": 81,
          "actionIndex": 21,
          "actionPath": [
            "timelineActions[15]",
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
                "blackboardKey": "talent_1",
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
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]",
                "action",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 24,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0018_dapan_talent_1_preparation",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "talent_1_duration",
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
                      "max_stack": {
                        "value": 0.0,
                        "blackboardKey": "talent_1_stack",
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
                      "talent_1_cd_reduce": {
                        "value": 0.0,
                        "blackboardKey": "talent_1_cd_reduce",
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
          "endFrame": 100,
          "actionIndex": 46,
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
          "sequenceIndex": 31,
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
        "buff_chr_0018_dapan_potential_1",
        "buff_chr_0018_dapan_talent_1_preparation",
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
          "atk_scale_end": [
            1.78,
            1.96,
            2.13,
            2.31,
            2.49,
            2.67,
            2.84,
            3.02,
            3.2,
            3.42,
            3.69,
            4.0
          ],
          "atk_scale_loop": [
            0.22,
            0.24,
            0.26,
            0.29,
            0.31,
            0.33,
            0.35,
            0.37,
            0.4,
            0.42,
            0.46,
            0.5
          ]
        },
        "cooldownSeconds": [
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
          "key": "atk_scale_end",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_loop",
          "value": 0.15,
          "isDynamic": false
        },
        {
          "key": "potential_1_dmg_up",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_1_duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 4.0,
          "isDynamic": false
        },
        {
          "key": "talent_1",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "talent_1_cd_reduce",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "talent_1_duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "talent_1_stack",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale_end",
        "atk_scale_loop",
        "potential_1_dmg_up",
        "select_radius",
        "talent_1"
      ],
      "blackboardProvenance": [
        {
          "key": "atk_scale_end",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_loop",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_1_dmg_up",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_1_duration",
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
          "key": "talent_1",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_1_cd_reduce",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_1_duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_1_stack",
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
        "KnockDownAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "mainChar",
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
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "showPos",
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
          "actionIndex": 13,
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
          "startFrame": 42,
          "endFrame": 64,
          "actionIndex": 14,
          "actionPath": [
            "timelineActions[5]",
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
          "intervalSeconds": 0.13,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 80,
          "endFrame": 81,
          "actionIndex": 15,
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
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[2]",
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
              "serverActionIndex": 6,
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
              "serverActionIndex": 7,
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
          "startFrame": 80,
          "endFrame": 81,
          "actionIndex": 21,
          "actionPath": [
            "timelineActions[15]",
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
                "blackboardKey": "talent_1",
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
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]",
                "action",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 24,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0018_dapan_talent_1_preparation",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "talent_1_duration",
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
                      "max_stack": {
                        "value": 0.0,
                        "blackboardKey": "talent_1_stack",
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
                      "talent_1_cd_reduce": {
                        "value": 0.0,
                        "blackboardKey": "talent_1_cd_reduce",
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
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [
        {
          "startFrame": 0,
          "endFrame": 89,
          "actionIndex": 9,
          "priorityLevel": "Default",
          "priorityOffset": 0,
          "event": "OnAfterKillEntity",
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "CheckDamageDecorateMask",
                "CompareFloat",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 12,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0018_dapan_potential_1",
                        "classification": null,
                        "blackboardAssignments": {
                          "dmg_up": {
                            "value": 0.0,
                            "blackboardKey": "potential_1_dmg_up",
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
                            "blackboardKey": "potential_1_duration",
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
                          "mask": 33280
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
                            "[1]"
                          ],
                          "conditions": [
                            {
                              "sourceType": "CompareFloat",
                              "supported": true,
                              "comparison": "GT",
                              "left": {
                                "value": 0.0,
                                "blackboardKey": "potential_1_dmg_up",
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
                              "serverActionIndex": 12,
                              "legacyBuffFinish": null,
                              "skillCooldownAdjustment": null,
                              "buffIgnite": null,
                              "buffApplication": {
                                "buffs": [
                                  {
                                    "buffId": "buff_chr_0018_dapan_potential_1",
                                    "classification": null,
                                    "blackboardAssignments": {
                                      "dmg_up": {
                                        "value": 0.0,
                                        "blackboardKey": "potential_1_dmg_up",
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
                                        "blackboardKey": "potential_1_duration",
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
              "priority": 0
            }
          ],
          "sequenceIndex": 3,
          "obtainAtbValueKeys": []
        }
      ],
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 1,
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
          "startFrame": 42,
          "endFrame": 42,
          "actionIndex": 20,
          "kind": "normal",
          "priority": -693798243,
          "scope": "entity",
          "slot": 1464849466,
          "duration": {
            "value": 0.034,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": "RESETto1",
          "inlineCurve": [],
          "finishByAction": true,
          "ignoredTargets": [],
          "targets": [
            "caster"
          ],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 9,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 46,
          "endFrame": 46,
          "actionIndex": 20,
          "kind": "normal",
          "priority": -693798243,
          "scope": "entity",
          "slot": 1464849466,
          "duration": {
            "value": 0.034,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": "RESETto1",
          "inlineCurve": [],
          "finishByAction": true,
          "ignoredTargets": [],
          "targets": [
            "caster"
          ],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 10,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 50,
          "endFrame": 50,
          "actionIndex": 20,
          "kind": "normal",
          "priority": -693798243,
          "scope": "entity",
          "slot": 1464849466,
          "duration": {
            "value": 0.034,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": "RESETto1",
          "inlineCurve": [],
          "finishByAction": true,
          "ignoredTargets": [],
          "targets": [
            "caster"
          ],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 11,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 54,
          "endFrame": 54,
          "actionIndex": 20,
          "kind": "normal",
          "priority": -693798243,
          "scope": "entity",
          "slot": 1464849466,
          "duration": {
            "value": 0.034,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": "RESETto1",
          "inlineCurve": [],
          "finishByAction": true,
          "ignoredTargets": [],
          "targets": [
            "caster"
          ],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 12,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 58,
          "endFrame": 58,
          "actionIndex": 20,
          "kind": "normal",
          "priority": -693798243,
          "scope": "entity",
          "slot": 1464849466,
          "duration": {
            "value": 0.034,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": "RESETto1",
          "inlineCurve": [],
          "finishByAction": true,
          "ignoredTargets": [],
          "targets": [
            "caster"
          ],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 13,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 62,
          "endFrame": 62,
          "actionIndex": 20,
          "kind": "normal",
          "priority": -693798243,
          "scope": "entity",
          "slot": 1464849466,
          "duration": {
            "value": 0.034,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": "RESETto1",
          "inlineCurve": [],
          "finishByAction": true,
          "ignoredTargets": [],
          "targets": [
            "caster"
          ],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 14,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionIndex": 29,
          "kind": "normal",
          "priority": -1742631616,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 1.2,
            "blackboardKey": null,
            "levelValues": null
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
          "ignoredTargets": [
            "caster"
          ],
          "targets": [],
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 17,
          "effectAbilityEntityTargets": []
        }
      ],
      "knockDownOutputs": [
        {
          "startFrame": 80,
          "endFrame": 81,
          "actionIndex": 25,
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
          "forceKnockDown": true,
          "duration": {
            "value": 2.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "faceDirectionType": "TargetToSource",
          "immobilizedTime": 2.0,
          "isExtra": false,
          "deadOption": "AllValid",
          "returnTrueWhen": "Always",
          "sequenceIndex": 15,
          "actionPath": [
            "timelineActions[15]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ]
        }
      ],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    }
  ]
} as const satisfies GeneratedOperatorSource;
