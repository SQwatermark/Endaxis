/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const mifuGeneratedSource = {
  "slug": "mifu",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0031_mifu_buffpause",
      "sourceFile": "buff_chr_0031_mifu_buffpause.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 8.0,
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
          "key": "def",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "dur",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "prob",
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
        "hasIcon": true,
        "spritePath": "icon_battle_buff_def_down",
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
      "buffId": "buff_chr_0031_mifu_comboprocess",
      "sourceFile": "buff_chr_0031_mifu_comboprocess.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 16.0,
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
      "buffId": "buff_chr_0031_mifu_normalskill_2",
      "sourceFile": "buff_chr_0031_mifu_normalskill_2.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 15.0,
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
          "key": "def",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "dur",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "prob",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        282004889
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
            "ChangeSkillAction"
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
                "ChangeSkillAction"
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
                  "serverActionIndex": 1,
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
                      "buff_chr_0031_mifu_normalskill_3"
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
          "eventSource": "ability",
          "event": "OnAddedBuff",
          "orderedActionTypes": [
            "CheckBuffIdInContextAdvanced",
            "PauseBuffTime",
            "DebugPrintAction"
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
                "CheckBuffIdInContextAdvanced",
                "PauseBuffTime",
                "DebugPrintAction"
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
          "contextBuffIdQueries": [
            [
              "buff_chr_0031_mifu_buffpause"
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
      "skillReplacements": [
        {
          "eventSource": "buff",
          "event": "DuringBuffEnable",
          "actionIndex": 0,
          "skillSource": {
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
          "skillSlot": "NormalSkill",
          "targetSkillId": "chr_0031_mifu_normalskill_2",
          "overrideCacheTime": true,
          "cacheTime": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "lifeTimeType": "FinishByAction",
          "duration": {
            "value": 8.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "inheritOriginSkillCooldownProgress": false,
          "specificRevertedSkillId": true,
          "revertedSkillId": "chr_0031_mifu_normalskill_1"
        }
      ],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "pauseTimeActions": [
        {
          "event": "OnFinishedBuff",
          "priority": 0,
          "paused": false,
          "skillIds": [],
          "buffIds": [
            "buff_chr_0031_mifu_buffpause"
          ]
        }
      ],
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": true,
        "spritePath": "icon_battle_buff_def_up",
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
      "buffId": "buff_chr_0031_mifu_normalskill_3",
      "sourceFile": "buff_chr_0031_mifu_normalskill_3.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 15.0,
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
          "key": "def",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "dur",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "prob",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        1741176079
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
            "ChangeSkillAction"
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
                "ChangeSkillAction"
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
                  "serverActionIndex": 1,
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
                      "buff_chr_0031_mifu_normalskill_2"
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
          "eventSource": "ability",
          "event": "OnAddedBuff",
          "orderedActionTypes": [
            "CheckBuffIdInContextAdvanced",
            "PauseBuffTime",
            "DebugPrintAction"
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
                "CheckBuffIdInContextAdvanced",
                "PauseBuffTime",
                "DebugPrintAction"
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
          "contextBuffIdQueries": [
            [
              "buff_chr_0031_mifu_buffpause"
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
      "skillReplacements": [
        {
          "eventSource": "buff",
          "event": "DuringBuffEnable",
          "actionIndex": 0,
          "skillSource": {
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
          "skillSlot": "NormalSkill",
          "targetSkillId": "chr_0031_mifu_normalskill_3",
          "overrideCacheTime": true,
          "cacheTime": {
            "value": 0.3,
            "blackboardKey": null,
            "levelValues": null
          },
          "lifeTimeType": "FinishByAction",
          "duration": {
            "value": 8.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "inheritOriginSkillCooldownProgress": false,
          "specificRevertedSkillId": true,
          "revertedSkillId": "chr_0031_mifu_normalskill_1"
        }
      ],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "pauseTimeActions": [
        {
          "event": "OnFinishedBuff",
          "priority": 0,
          "paused": false,
          "skillIds": [],
          "buffIds": [
            "buff_chr_0031_mifu_buffpause"
          ]
        }
      ],
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": [],
      "presentation": {
        "hasIcon": true,
        "spritePath": "icon_battle_buff_def_up",
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
      "buffId": "buff_chr_0031_mifu_potential_addattack",
      "sourceFile": "buff_chr_0031_mifu_potential_addattack.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 0.0,
          "blackboardKey": "addattack_duraion",
          "levelValues": [
            0.0
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
          "key": "addattack_duraion",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "addattack_effect",
          "value": 0.0,
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
            "blackboardKey": "addattack_effect",
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
                "buffSource": "ActionOwner",
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
      }
    },
    {
      "buffId": "buff_chr_0031_mifu_shield",
      "sourceFile": "buff_chr_0031_mifu_shield.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 10.0,
          "blackboardKey": "duration",
          "levelValues": [
            8.0
          ]
        },
        "triggerInterval": {
          "value": -1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": -1.0,
          "blackboardKey": "duration",
          "levelValues": [
            8.0
          ]
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
          "key": "FinalShield",
          "value": 1000.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 8.0,
          "isDynamic": false
        },
        {
          "key": "extraattack",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "shelter",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [
        -1757502026
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
      "shields": [
        {
          "infinityValue": false,
          "value": {
            "value": 0.0,
            "blackboardKey": "FinalShield",
            "levelValues": [
              1000.0
            ]
          },
          "damageAbsorptions": [],
          "absorbCount": {
            "value": -1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "absorbAllDamageWhenConsumed": false,
          "removeBuffWhenConsumed": true,
          "priority": "Normal",
          "replaceHitEffect": true
        }
      ],
      "sustainedProtections": [
        {
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
        "hasIcon": true,
        "spritePath": "icon_battle_shield",
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
      "buffId": "buff_chr_0031_mifu_vulnerablephysic_comboskill",
      "sourceFile": "buff_chr_0031_mifu_vulnerablephysic_comboskill.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 8.0,
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
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": 0.25,
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
                "value": 0.15,
                "blackboardKey": "rate",
                "levelValues": [
                  0.25
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
            "VulnerableAction",
            "DebugPrintAction",
            "DebugPrintAction"
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
                "DebugPrintAction",
                "DebugPrintAction"
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
        "spritePath": "icon_battle_buff_def_down",
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
      }
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
      }
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
      }
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
      }
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
      }
    }
  ],
  "skills": [
    {
      "key": "comboSkill",
      "skillId": "chr_0031_mifu_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0031_mifu_combo_skill.json",
      "timelineBlockFrames": 35,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 28.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 35,
          "endFrame": 73,
          "skillIds": [
            "chr_0031_mifu_powerattack"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 73,
          "skillIds": [
            "chr_0031_mifu_normalskill_2",
            "chr_0031_mifu_normalskill_3"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 73,
          "skillIds": [
            "chr_0031_mifu_attack1",
            "chr_0031_mifu_attack2",
            "chr_0031_mifu_attack3",
            "chr_0031_mifu_attack4"
          ]
        }
      ],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 211,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "CheckEntityNum"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 28,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 73,
          "actionTypes": [
            "CreateBuffAction"
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
          "startFrame": 18,
          "endFrame": 27,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 8,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 211,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 13,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 27,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 45,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 9,
          "actionTypes": [
            "CompareFloat",
            "TeleportAction",
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 28,
          "actionTypes": [
            "CheckEntityNum",
            "TeleportAction",
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "IfElseAction",
            "IfElseAction",
            "CreateBuffAction",
            "StoreAttributeValue",
            "ModifyDynamicBlackboard",
            "CreateBuffAction",
            "AddGlobalCDTimer"
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
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 28,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 8,
          "actionTypes": [
            "CheckEntityNum",
            "FindTargetAction",
            "Selector",
            "MoveToAction",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 9,
          "actionTypes": [
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "CheckEntityNum",
            "HitStopAction",
            "CameraImpulseAction",
            "LaunchUpwardAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "CheckEntityNum",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 27,
          "actionTypes": [
            "CheckEntityNum",
            "FindTargetAction",
            "Selector",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 28,
          "actionTypes": [
            "InterruptAction",
            "CheckEntityNum",
            "HitStopAction",
            "EnemyHurtAnimAction",
            "TakeDownAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "CreateBuffAction",
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "IfElseAction",
            "ObtainCostAction",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 33,
          "endFrame": 34,
          "actionTypes": [
            "BlowOffAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 13,
          "actionTypes": [
            "PullAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 28,
          "actionTypes": [
            "ConvertToTargetContext"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 30,
          "actionTypes": [
            "PullAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 8,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 8,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 8,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 8,
          "actionTypes": [
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 73,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 73,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 73,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 7,
          "endFrame": 67,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 26,
          "endFrame": 72,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 88,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 161,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 106,
          "endFrame": 284,
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
          "startFrame": 80,
          "endFrame": 284,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 94,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 71,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 40,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 46,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 16,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 56,
          "endFrame": 111,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 8,
          "endFrame": 9,
          "actionIndex": 43,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale1",
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
              "damageDecorateMask": 12288
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 20
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 49,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale1",
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
              "damageDecorateMask": 12288
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 21
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 71,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale2",
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
          "sequenceIndex": 24
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 23,
          "actionPath": [
            "timelineActions[14]",
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
                "blackboardKey": "talent",
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
              "sourceType": "CheckGlobalCDTimerAction",
              "supported": true,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "poise": null,
              "superArmor": null,
              "twoDirectionAngle": null,
              "targetAngle": null,
              "globalCooldown": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "buffId": "buff_chr_0031_mifu_shield"
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
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 26,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 1,
                "actionIndex": 26,
                "actionPath": [
                  "timelineActions[14]",
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
                    "comparison": "GT",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "potential",
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
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[14]",
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
                    "serverActionIndex": 28,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_chr_0031_mifu_potential_addattack",
                          "classification": null,
                          "blackboardAssignments": {
                            "addattack_effect": {
                              "value": 0.0,
                              "blackboardKey": "potential_addattack_effect",
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
                            "addattack_duraion": {
                              "value": 0.0,
                              "blackboardKey": "potential_addattack_duration",
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
                      "buffSource": "ActionOwner",
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
            },
            {
              "actionType": "StoreAttributeValue",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 29,
              "storeAttributeValue": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "attributeKind": "specific",
                "attributeKey": "maxHealth",
                "stage": "finalNonConverted",
                "useFloor": false,
                "divisor": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "multiplier": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "base": {
                  "value": 0.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "outputKey": "talent_shield_maxhp"
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 30,
              "blackboardMutation": {
                "key": "talent_shield_maxhp",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "talent_shield_hppercent",
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
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 31,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0031_mifu_shield",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "talent_shield_duration",
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
                      "FinalShield": {
                        "value": 0.0,
                        "blackboardKey": "talent_shield_maxhp",
                        "levelValues": null
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
                "buffSource": "ActionOwner",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            },
            {
              "actionType": "AddGlobalCDTimer",
              "actionIndex": 4,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[4]"
              ],
              "serverActionIndex": 32,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "globalCooldownApplication": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "buffId": "buff_chr_0031_mifu_shield",
                "duration": {
                  "value": 0.0,
                  "blackboardKey": "talent_shield_cd",
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
          "failActions": [],
          "conditionNegated": [
            false,
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 65,
          "actionPath": [
            "timelineActions[24]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "Equals",
              "left": {
                "value": 0.0,
                "blackboardKey": "potential",
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
                "timelineActions[24]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 67,
              "blackboardMutation": {
                "key": "final_effect",
                "operation": "Add",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "extra_effect",
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
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[24]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 68,
              "blackboardMutation": {
                "key": "final_time",
                "operation": "Add",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "extra_time",
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
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 72,
          "actionPath": [
            "timelineActions[24]",
            "_sequenceActionData",
            "actionData",
            "[6]"
          ],
          "conditions": [
            {
              "sourceType": "CheckSkillHasHit",
              "supported": true,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "poise": null,
              "superArmor": null,
              "twoDirectionAngle": null,
              "targetAngle": null,
              "skillHasHit": {},
              "damageDecorateMask": null,
              "contextBuffId": null,
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
                "timelineActions[24]",
                "_sequenceActionData",
                "actionData",
                "[6]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 74,
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
      "auxiliaryActions": [
        {
          "startFrame": 27,
          "endFrame": 28,
          "actionIndex": 6,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_normalskill_2",
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
          "sequenceIndex": 2,
          "autoFinishByAction": false
        },
        {
          "startFrame": 35,
          "endFrame": 73,
          "actionIndex": 7,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_comboprocess",
          "classification": null,
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
          "sequenceIndex": 3,
          "autoFinishByAction": true
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 69,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_vulnerablephysic_comboskill",
          "classification": null,
          "targetSource": "Context",
          "targetGroupKey": "targets",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionOwner",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {
            "duration": {
              "value": 0.0,
              "blackboardKey": "final_time",
              "levelValues": null
            },
            "rate": {
              "value": 0.0,
              "blackboardKey": "final_effect",
              "levelValues": null
            }
          },
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 24,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [
        {
          "startFrame": 2,
          "endFrame": 8,
          "actionIndex": 41,
          "key": "Ifmoveto",
          "operation": "Assign",
          "value": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 19
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 63,
          "key": "final_effect",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": "rate",
            "levelValues": [
              0.05,
              0.05,
              0.05,
              0.05,
              0.05,
              0.05,
              0.05,
              0.05,
              0.05,
              0.05,
              0.05,
              0.05
            ]
          },
          "sequenceIndex": 24
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 64,
          "key": "final_time",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": "duration",
            "levelValues": [
              16.0,
              16.0,
              16.0,
              16.0,
              16.0,
              16.0,
              16.0,
              16.0,
              16.0,
              16.0,
              16.0,
              16.0
            ]
          },
          "sequenceIndex": 24
        }
      ],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0031_mifu_comboprocess",
        "buff_chr_0031_mifu_normalskill_2",
        "buff_chr_0031_mifu_potential_addattack",
        "buff_chr_0031_mifu_shield",
        "buff_chr_0031_mifu_vulnerablephysic_comboskill"
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
          "atk_scale1": [
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
          ],
          "atk_scale2": [
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
          "display_atk_scale": [
            1.11,
            1.22,
            1.33,
            1.44,
            1.55,
            1.67,
            1.78,
            1.89,
            2.0,
            2.14,
            2.3,
            2.5
          ],
          "duration": [
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0
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
            0.05,
            0.05,
            0.05,
            0.05,
            0.05,
            0.05,
            0.05,
            0.05,
            0.05,
            0.05,
            0.05,
            0.05
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
          "key": "Ifmoveto",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_scale1",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "distance",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "extra_effect",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "extra_time",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "final_effect",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "final_time",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "movedistance",
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
          "key": "potential",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_addattack_duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_addattack_effect",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "talent",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "talent_shield_cd",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "talent_shield_duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "talent_shield_hppercent",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "talent_shield_maxhp",
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
        "Ifmoveto",
        "atk_scale1",
        "atk_scale2",
        "distance",
        "duration",
        "extra_effect",
        "extra_time",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
        "potential",
        "rate",
        "select_radius",
        "talent",
        "talent_shield_cd",
        "talent_shield_hppercent",
        "usp"
      ],
      "blackboardProvenance": [
        {
          "key": "Ifmoveto",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale1",
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
          "key": "duration",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "extra_effect",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "extra_time",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "final_effect",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "final_time",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "movedistance",
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
          "key": "potential",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_addattack_duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_addattack_effect",
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
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        },
        {
          "key": "talent",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_shield_cd",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_shield_duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_shield_hppercent",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_shield_maxhp",
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
        "AddGlobalCDTimer",
        "CreateBuffAction",
        "DamageAction",
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 8,
          "endFrame": 9,
          "actionIndex": 33,
          "actionPath": [
            "timelineActions[15]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 34,
          "actionPath": [
            "timelineActions[16]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 27,
          "endFrame": 28,
          "actionIndex": 35,
          "actionPath": [
            "timelineActions[17]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 36,
          "actionPath": [
            "timelineActions[18]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 2,
          "endFrame": 8,
          "actionIndex": 39,
          "actionPath": [
            "timelineActions[19]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "targetGroupKey": "pos",
          "producerType": "FindTargetAction",
          "finderType": "SnapPointFinder",
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
          "endFrame": 27,
          "actionIndex": 55,
          "actionPath": [
            "timelineActions[22]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "targetGroupKey": "pos",
          "producerType": "FindTargetAction",
          "finderType": "SnapPointFinder",
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
          "endFrame": 8,
          "actionIndex": 85,
          "actionPath": [
            "timelineActions[32]",
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
          "endFrame": 1,
          "actionIndex": 23,
          "actionPath": [
            "timelineActions[14]",
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
                "blackboardKey": "talent",
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
              "sourceType": "CheckGlobalCDTimerAction",
              "supported": true,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "poise": null,
              "superArmor": null,
              "twoDirectionAngle": null,
              "targetAngle": null,
              "globalCooldown": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "buffId": "buff_chr_0031_mifu_shield"
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
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 26,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 1,
                "actionIndex": 26,
                "actionPath": [
                  "timelineActions[14]",
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
                    "comparison": "GT",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "potential",
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
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[14]",
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
                    "serverActionIndex": 28,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_chr_0031_mifu_potential_addattack",
                          "classification": null,
                          "blackboardAssignments": {
                            "addattack_effect": {
                              "value": 0.0,
                              "blackboardKey": "potential_addattack_effect",
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
                            "addattack_duraion": {
                              "value": 0.0,
                              "blackboardKey": "potential_addattack_duration",
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
                      "buffSource": "ActionOwner",
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
            },
            {
              "actionType": "StoreAttributeValue",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 29,
              "storeAttributeValue": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "attributeKind": "specific",
                "attributeKey": "maxHealth",
                "stage": "finalNonConverted",
                "useFloor": false,
                "divisor": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "multiplier": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "base": {
                  "value": 0.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "outputKey": "talent_shield_maxhp"
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 30,
              "blackboardMutation": {
                "key": "talent_shield_maxhp",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "talent_shield_hppercent",
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
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 31,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0031_mifu_shield",
                    "classification": null,
                    "blackboardAssignments": {
                      "duration": {
                        "value": 0.0,
                        "blackboardKey": "talent_shield_duration",
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
                      "FinalShield": {
                        "value": 0.0,
                        "blackboardKey": "talent_shield_maxhp",
                        "levelValues": null
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
                "buffSource": "ActionOwner",
                "buffSourceContextKey": "",
                "inheritSourceSkillCastInfo": true
              }
            },
            {
              "actionType": "AddGlobalCDTimer",
              "actionIndex": 4,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[4]"
              ],
              "serverActionIndex": 32,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "globalCooldownApplication": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "buffId": "buff_chr_0031_mifu_shield",
                "duration": {
                  "value": 0.0,
                  "blackboardKey": "talent_shield_cd",
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
          "failActions": [],
          "conditionNegated": [
            false,
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 65,
          "actionPath": [
            "timelineActions[24]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "Equals",
              "left": {
                "value": 0.0,
                "blackboardKey": "potential",
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
                "timelineActions[24]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 67,
              "blackboardMutation": {
                "key": "final_effect",
                "operation": "Add",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "extra_effect",
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
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[24]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 68,
              "blackboardMutation": {
                "key": "final_time",
                "operation": "Add",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "extra_time",
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
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 72,
          "actionPath": [
            "timelineActions[24]",
            "_sequenceActionData",
            "actionData",
            "[6]"
          ],
          "conditions": [
            {
              "sourceType": "CheckSkillHasHit",
              "supported": true,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "poise": null,
              "superArmor": null,
              "twoDirectionAngle": null,
              "targetAngle": null,
              "skillHasHit": {},
              "damageDecorateMask": null,
              "contextBuffId": null,
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
                "timelineActions[24]",
                "_sequenceActionData",
                "actionData",
                "[6]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 74,
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
          "endFrame": 8,
          "actionIndex": 83,
          "actionPath": [
            "timelineActions[32]",
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
                "timelineActions[32]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 85,
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
          "endFrame": 8,
          "actionIndex": 82,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.36666,
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
          "sequenceIndex": 31,
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
      "skillId": "chr_0031_mifu_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0031_mifu_attack1.json",
      "timelineBlockFrames": 17,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 11,
      "allowNextWindows": [
        {
          "startFrame": 17,
          "endFrame": 38,
          "skillIds": [
            "chr_0031_mifu_attack2"
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
              "skillId": "chr_0031_mifu_attack2",
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
          "endFrame": 196,
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
          "endFrame": 196,
          "actionTypes": [
            "CustomRootMotionAction"
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
          "startFrame": 12,
          "endFrame": 81,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 83,
          "endFrame": 198,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 5,
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
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
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
          "startFrame": 9,
          "endFrame": 12,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 9,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 49,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 49,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 53,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 106,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 106,
          "endFrame": 196,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 196,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 196,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 65,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 151,
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
          "startFrame": 0,
          "endFrame": 38,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 38,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 9,
          "endFrame": 9,
          "actionIndex": 14,
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
                  0.41,
                  0.44,
                  0.47,
                  0.51,
                  0.54,
                  0.57,
                  0.61,
                  0.65,
                  0.7,
                  0.76
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 11
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 9,
          "endFrame": 9,
          "actionIndex": 16,
          "actionPath": [
            "timelineActions[11]",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 18,
              "blackboardMutation": {
                "key": "hit_target",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionIndex": 31,
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
              "comparison": "GE",
              "left": {
                "value": 0.0,
                "blackboardKey": "hit_target",
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
              "serverActionIndex": 33,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 36,
          "actionPath": [
            "timelineActions[13]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 38,
              "blackboardMutation": {
                "key": "hitstop_times",
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
          "actionIndex": 41,
          "actionPath": [
            "timelineActions[14]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 43,
              "blackboardMutation": {
                "key": "hitstop_times",
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
      "blackboardMutations": [
        {
          "startFrame": 9,
          "endFrame": 12,
          "actionIndex": 11,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 10
        },
        {
          "startFrame": 9,
          "endFrame": 12,
          "actionIndex": 12,
          "key": "hitstop_times",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 10
        },
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionIndex": 34,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 12
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 39,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 13
        },
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionIndex": 44,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 14
        }
      ],
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
            0.41,
            0.44,
            0.47,
            0.51,
            0.54,
            0.57,
            0.61,
            0.65,
            0.7,
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
        },
        {
          "key": "hit_target",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "hitstop_times",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "hit_target",
        "hitstop_times"
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
          "key": "hit_target",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "hitstop_times",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "DamageAction",
        "IfElseAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[9]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "endFrame": 9,
          "actionIndex": 16,
          "actionPath": [
            "timelineActions[11]",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 18,
              "blackboardMutation": {
                "key": "hit_target",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionIndex": 31,
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
              "comparison": "GE",
              "left": {
                "value": 0.0,
                "blackboardKey": "hit_target",
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
              "serverActionIndex": 33,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 36,
          "actionPath": [
            "timelineActions[13]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 38,
              "blackboardMutation": {
                "key": "hitstop_times",
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
          "actionIndex": 41,
          "actionPath": [
            "timelineActions[14]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 43,
              "blackboardMutation": {
                "key": "hitstop_times",
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
      "skillId": "chr_0031_mifu_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0031_mifu_attack2.json",
      "timelineBlockFrames": 21,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 9,
      "allowNextWindows": [
        {
          "startFrame": 21,
          "endFrame": 67,
          "skillIds": [
            "chr_0031_mifu_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 67,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0031_mifu_attack3",
              "cacheEndByAction": false,
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
          "endFrame": 217,
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
          "endFrame": 29,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 16,
          "endFrame": 19,
          "actionTypes": [
            "ContinuousFindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 6,
          "actionTypes": [
            "CheckEntityNum",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 9,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 16,
          "actionTypes": [
            "CheckEntityNum",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 16,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 114,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 217,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 60,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 60,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 52,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 112,
          "endFrame": 217,
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
          "startFrame": 145,
          "endFrame": 238,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 81,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 81,
          "endFrame": 217,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 238,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 238,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 12,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 34,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 74,
          "endFrame": 205,
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
          "startFrame": 0,
          "endFrame": 67,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 67,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 9,
          "endFrame": 9,
          "actionIndex": 9,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale1",
                "levelValues": [
                  0.13,
                  0.15,
                  0.16,
                  0.17,
                  0.19,
                  0.2,
                  0.21,
                  0.23,
                  0.24,
                  0.26,
                  0.27,
                  0.3
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
        },
        {
          "startFrame": 16,
          "endFrame": 16,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale2",
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
          "sequenceIndex": 8
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
          "atk_scale1": [
            0.13,
            0.15,
            0.16,
            0.17,
            0.19,
            0.2,
            0.21,
            0.23,
            0.24,
            0.26,
            0.27,
            0.3
          ],
          "atk_scale2": [
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
          ],
          "display_atk_scale": [
            0.38,
            0.42,
            0.46,
            0.5,
            0.54,
            0.57,
            0.61,
            0.65,
            0.69,
            0.74,
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
          "key": "atk_scale1",
          "value": 0.42,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 0.42,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale1",
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
          "key": "atk_scale1",
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
        "DamageAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 16,
          "endFrame": 19,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
      "skillId": "chr_0031_mifu_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0031_mifu_attack3.json",
      "timelineBlockFrames": 37,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 16,
      "allowNextWindows": [
        {
          "startFrame": 37,
          "endFrame": 76,
          "skillIds": [
            "chr_0031_mifu_attack4"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 76,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0031_mifu_attack4",
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
          "endFrame": 425,
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
          "startFrame": 1,
          "endFrame": 30,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 0,
          "endFrame": 425,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
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
          "startFrame": 12,
          "endFrame": 13,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 18,
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
          "startFrame": 19,
          "endFrame": 20,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 31,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
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
          "startFrame": 10,
          "endFrame": 13,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 20,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 16,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 33,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 30,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 18,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 19,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 31,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 33,
          "actionTypes": [
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 136,
          "endFrame": 214,
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
          "startFrame": 136,
          "endFrame": 214,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 91,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 123,
          "endFrame": 201,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 102,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 63,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 344,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 344,
          "endFrame": 425,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 425,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 425,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 105,
          "endFrame": 276,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 276,
          "endFrame": 425,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 425,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 73,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 22,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 32,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 16,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 68,
          "endFrame": 425,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 76,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 37,
          "endFrame": 76,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale1",
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
          "sequenceIndex": 17
        },
        {
          "startFrame": 16,
          "endFrame": 16,
          "actionIndex": 24,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale1",
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
          "sequenceIndex": 19
        },
        {
          "startFrame": 30,
          "endFrame": 30,
          "actionIndex": 43,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale2",
                "levelValues": [
                  0.31,
                  0.34,
                  0.37,
                  0.4,
                  0.43,
                  0.46,
                  0.49,
                  0.52,
                  0.55,
                  0.59,
                  0.63,
                  0.69
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 21
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 16,
          "endFrame": 16,
          "actionIndex": 26,
          "actionPath": [
            "timelineActions[19]",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[19]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 28,
              "blackboardMutation": {
                "key": "hit_target",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 30,
          "endFrame": 30,
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[21]",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[21]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 47,
              "blackboardMutation": {
                "key": "hit_target",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 58,
          "actionPath": [
            "timelineActions[22]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[22]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 60,
              "blackboardMutation": {
                "key": "hitstop_times",
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
          "actionIndex": 63,
          "actionPath": [
            "timelineActions[23]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[23]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 65,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionIndex": 68,
          "actionPath": [
            "timelineActions[24]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[24]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 70,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionIndex": 73,
          "actionPath": [
            "timelineActions[25]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[25]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 75,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 17,
          "endFrame": 18,
          "actionIndex": 78,
          "actionPath": [
            "timelineActions[26]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[26]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 80,
              "blackboardMutation": {
                "key": "hitstop_times",
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
          "actionIndex": 83,
          "actionPath": [
            "timelineActions[27]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 85,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 88,
          "actionPath": [
            "timelineActions[28]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[28]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 90,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 30,
          "endFrame": 31,
          "actionIndex": 93,
          "actionPath": [
            "timelineActions[29]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[29]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 95,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 98,
          "actionPath": [
            "timelineActions[30]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[30]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 100,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 32,
          "endFrame": 33,
          "actionIndex": 103,
          "actionPath": [
            "timelineActions[31]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[31]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 105,
              "blackboardMutation": {
                "key": "hitstop_times",
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
      "blackboardMutations": [
        {
          "startFrame": 10,
          "endFrame": 13,
          "actionIndex": 16,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 16
        },
        {
          "startFrame": 10,
          "endFrame": 13,
          "actionIndex": 17,
          "key": "hitstop_times",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 16
        },
        {
          "startFrame": 16,
          "endFrame": 20,
          "actionIndex": 21,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 18
        },
        {
          "startFrame": 16,
          "endFrame": 20,
          "actionIndex": 22,
          "key": "hitstop_times",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 18
        },
        {
          "startFrame": 30,
          "endFrame": 33,
          "actionIndex": 40,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 20
        },
        {
          "startFrame": 30,
          "endFrame": 33,
          "actionIndex": 41,
          "key": "hitstop_times",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 20
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 61,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 22
        },
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionIndex": 66,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 23
        },
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionIndex": 71,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 24
        },
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionIndex": 76,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 25
        },
        {
          "startFrame": 17,
          "endFrame": 18,
          "actionIndex": 81,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 26
        },
        {
          "startFrame": 18,
          "endFrame": 19,
          "actionIndex": 86,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 27
        },
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 91,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 28
        },
        {
          "startFrame": 30,
          "endFrame": 31,
          "actionIndex": 96,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 29
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 101,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 30
        },
        {
          "startFrame": 32,
          "endFrame": 33,
          "actionIndex": 106,
          "key": "hit_target",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 31
        }
      ],
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
          "atk_scale1": [
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
            0.31,
            0.34,
            0.37,
            0.4,
            0.43,
            0.46,
            0.49,
            0.52,
            0.55,
            0.59,
            0.63,
            0.69
          ],
          "display_atk_scale": [
            0.61,
            0.67,
            0.73,
            0.79,
            0.85,
            0.91,
            0.97,
            1.03,
            1.09,
            1.16,
            1.26,
            1.36
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
          "key": "atk_scale1",
          "value": 0.68,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "hit_target",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "hitstop_times",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "atk_scale1",
        "atk_scale2",
        "hit_target",
        "hitstop_times"
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
          "key": "atk_scale1",
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
        },
        {
          "key": "hit_target",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "hitstop_times",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "DamageAction",
        "IfElseAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[6]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 12,
          "endFrame": 13,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 16,
          "endFrame": 17,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[9]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 17,
          "endFrame": 18,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[11]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 30,
          "endFrame": 31,
          "actionIndex": 13,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 14,
          "actionPath": [
            "timelineActions[14]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 32,
          "endFrame": 33,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[15]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "endFrame": 16,
          "actionIndex": 26,
          "actionPath": [
            "timelineActions[19]",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[19]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 28,
              "blackboardMutation": {
                "key": "hit_target",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 30,
          "endFrame": 30,
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[21]",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[21]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 47,
              "blackboardMutation": {
                "key": "hit_target",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 58,
          "actionPath": [
            "timelineActions[22]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[22]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 60,
              "blackboardMutation": {
                "key": "hitstop_times",
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
          "actionIndex": 63,
          "actionPath": [
            "timelineActions[23]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[23]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 65,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionIndex": 68,
          "actionPath": [
            "timelineActions[24]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[24]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 70,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionIndex": 73,
          "actionPath": [
            "timelineActions[25]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[25]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 75,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 17,
          "endFrame": 18,
          "actionIndex": 78,
          "actionPath": [
            "timelineActions[26]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[26]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 80,
              "blackboardMutation": {
                "key": "hitstop_times",
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
          "actionIndex": 83,
          "actionPath": [
            "timelineActions[27]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 85,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 88,
          "actionPath": [
            "timelineActions[28]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[28]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 90,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 30,
          "endFrame": 31,
          "actionIndex": 93,
          "actionPath": [
            "timelineActions[29]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[29]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 95,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 31,
          "endFrame": 32,
          "actionIndex": 98,
          "actionPath": [
            "timelineActions[30]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[30]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 100,
              "blackboardMutation": {
                "key": "hitstop_times",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 32,
          "endFrame": 33,
          "actionIndex": 103,
          "actionPath": [
            "timelineActions[31]",
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
                "blackboardKey": "hit_target",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[31]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 105,
              "blackboardMutation": {
                "key": "hitstop_times",
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
      "skillId": "chr_0031_mifu_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0031_mifu_attack4.json",
      "timelineBlockFrames": 38,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 30,
      "allowNextWindows": [
        {
          "startFrame": 38,
          "endFrame": 99,
          "skillIds": [
            "chr_0031_mifu_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 99,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0031_mifu_attack1",
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
          "endFrame": 280,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 24,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 29,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 280,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 54,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 280,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 26,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 30,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 30,
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
          "startFrame": 7,
          "endFrame": 7,
          "actionTypes": []
        },
        {
          "startFrame": 30,
          "endFrame": 30,
          "actionTypes": [
            "CameraImpulseAction",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 7,
          "actionTypes": [
            "CheckEntityNum",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 28,
          "actionTypes": [
            "CheckEntityNum",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 90,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 47,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 73,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 53,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 135,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 135,
          "endFrame": 285,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 285,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 285,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 7,
          "endFrame": 24,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 256,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 101,
          "endFrame": 172,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 99,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 99,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionIndex": 11,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale1",
                "levelValues": [
                  0.05,
                  0.06,
                  0.06,
                  0.07,
                  0.07,
                  0.08,
                  0.08,
                  0.09,
                  0.09,
                  0.1,
                  0.1,
                  0.11
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 10
        },
        {
          "startFrame": 30,
          "endFrame": 30,
          "actionIndex": 17,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale2",
                "levelValues": [
                  0.72,
                  0.79,
                  0.86,
                  0.93,
                  1.0,
                  1.07,
                  1.14,
                  1.22,
                  1.29,
                  1.38,
                  1.48,
                  1.61
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
          "startFrame": 30,
          "endFrame": 30,
          "actionIndex": 19,
          "actionPath": [
            "timelineActions[11]",
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
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
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0
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
            28.0,
            28.0,
            28.0,
            28.0,
            28.0,
            28.0,
            28.0,
            28.0,
            28.0,
            28.0,
            28.0,
            28.0
          ],
          "atk_scale1": [
            0.05,
            0.06,
            0.06,
            0.07,
            0.07,
            0.08,
            0.08,
            0.09,
            0.09,
            0.1,
            0.1,
            0.11
          ],
          "atk_scale2": [
            0.72,
            0.79,
            0.86,
            0.93,
            1.0,
            1.07,
            1.14,
            1.22,
            1.29,
            1.38,
            1.48,
            1.61
          ],
          "display_atk_scale": [
            0.77,
            0.84,
            0.92,
            0.99,
            1.07,
            1.15,
            1.22,
            1.3,
            1.38,
            1.47,
            1.59,
            1.72
          ],
          "poise": [
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
          "key": "atk_scale1",
          "value": 0.58,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 0.0,
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
        "atk_scale1",
        "atk_scale2",
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
          "key": "atk_scale1",
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
          "startFrame": 7,
          "endFrame": 7,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 30,
          "endFrame": 30,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[9]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 30,
          "endFrame": 30,
          "actionIndex": 19,
          "actionPath": [
            "timelineActions[11]",
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
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
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0,
                    28.0
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
      "key": "plungingAttack",
      "skillId": "chr_0031_mifu_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0031_mifu_plunging_attack_end.json",
      "timelineBlockFrames": 12,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 12,
          "endFrame": 21,
          "skillIds": [
            "chr_0009_azrila_attack1"
          ]
        }
      ],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 206,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 6,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 7,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
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
          "startFrame": 12,
          "endFrame": 21,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 206,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 52,
          "endFrame": 206,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 206,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 79,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 125,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 2,
          "endFrame": 7,
          "actionIndex": 3,
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
          "sequenceIndex": 3
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 2,
          "endFrame": 7,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[3]",
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
                "timelineActions[3]",
                "_sequenceActionData",
                "actionData",
                "[2]",
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
          "startFrame": 2,
          "endFrame": 6,
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
      "targetGroupControlFlowActions": [
        {
          "startFrame": 2,
          "endFrame": 7,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[3]",
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
                "timelineActions[3]",
                "_sequenceActionData",
                "actionData",
                "[2]",
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
      "key": "finisher",
      "skillId": "chr_0031_mifu_powerattack",
      "skillType": "finisher",
      "sourceFile": "chr_0031_mifu_powerattack.json",
      "timelineBlockFrames": 38,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 26,
      "allowNextWindows": [
        {
          "startFrame": 38,
          "endFrame": 67,
          "skillIds": [
            "chr_0031_mifu_combo_skill",
            "chr_0031_mifu_normalskill_1",
            "chr_0031_mifu_normalskill_2",
            "chr_0031_mifu_normalskill_3"
          ]
        }
      ],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 282,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 5,
          "actionTypes": [
            "TeleportAction",
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 5,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 6,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 17,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 37,
          "endFrame": 37,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 5,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 17,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 36,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 5,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 5,
          "actionTypes": [
            "InterruptAction",
            "HitStopAction",
            "CameraImpulseAction",
            "EnemyHurtAnimAction",
            "BlowOffAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 6,
          "actionTypes": [
            "IfElseAction",
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 17,
          "actionTypes": [
            "IfElseAction",
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "HitStopAction",
            "CameraImpulseAction",
            "EnemyHurtAnimAction",
            "BlowOffAction",
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 36,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 37,
          "endFrame": 37,
          "actionTypes": [
            "IfElseAction",
            "InterruptAction",
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "HitStopAction",
            "CameraImpulseAction",
            "EnemyHurtAnimAction",
            "TakeDownAction",
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "GainBreakingAttackAtb"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 38,
          "actionTypes": [
            "BlowOffAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 19,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 38,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 282,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 7,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "LockCameraAimAction",
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 19,
          "actionTypes": [
            "LockCameraAimAction",
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 34,
          "actionTypes": [
            "LockCameraAimAction",
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 43,
          "actionTypes": [
            "LockCameraAimAction",
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 53,
          "actionTypes": [
            "CreateBuffAction"
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
          "endFrame": 38,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 38,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 58,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 62,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 24,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 94,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 99,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 50,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 47,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 146,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 146,
          "endFrame": 282,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 282,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 282,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 34,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 60,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 34,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 14,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 52,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 104,
          "endFrame": 161,
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
          "startFrame": 38,
          "endFrame": 67,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 6,
          "endFrame": 6,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckTargetContains",
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
              "contextBuffId": null,
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
                "timelineActions[12]",
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
                    "value": 0.3,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ]
            }
          ],
          "failActions": [
            {
              "actionType": "DamageAction",
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
              "serverActionIndex": 21,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
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
                    "value": 0.3,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
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
          "startFrame": 17,
          "endFrame": 17,
          "actionIndex": 22,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckTargetContains",
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
              "contextBuffId": null,
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
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 24,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
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
                    "value": 0.2,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ]
            }
          ],
          "failActions": [
            {
              "actionType": "DamageAction",
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
              "serverActionIndex": 29,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
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
                    "value": 0.2,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
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
          "startFrame": 37,
          "endFrame": 37,
          "actionIndex": 31,
          "actionPath": [
            "timelineActions[15]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckTargetContains",
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
              "contextBuffId": null,
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
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 33,
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
                  "targetGroupKey": "targets",
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
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
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
                    "value": 0.5,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ]
            }
          ],
          "failActions": [
            {
              "actionType": "DamageAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 39,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
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
                    "value": 0.5,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
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
          "startFrame": 0,
          "endFrame": 7,
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[20]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckTwoDirectionAngle",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "poise": null,
              "superArmor": null,
              "twoDirectionAngle": {
                "dir1Source": {
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
                "dir1Target": {
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
                "dir1DirectionType": "CameraForward",
                "dir2Source": {
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
                "dir2Target": {
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
                "dir2DirectionType": "SourceToTarget",
                "comparison": "LT",
                "value": {
                  "value": 0.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              },
              "targetAngle": null,
              "damageDecorateMask": null,
              "contextBuffId": null,
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
                "timelineActions[20]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 47,
              "blackboardMutation": {
                "key": "ifrightside",
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
          "failActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[20]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 49,
              "blackboardMutation": {
                "key": "ifrightside",
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
          "endFrame": 53,
          "actionIndex": 71,
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
          "sequenceIndex": 24,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 38,
          "actionIndex": 73,
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
          "sequenceIndex": 26,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 38,
          "actionIndex": 74,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_buffpause",
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
        "buff_chr_0031_mifu_buffpause",
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
          "key": "atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.58,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 0.58,
          "isDynamic": false
        },
        {
          "key": "atk_scale3",
          "value": 0.58,
          "isDynamic": false
        },
        {
          "key": "ifrightside",
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
        "atk_scale",
        "atk_scale1",
        "atk_scale2",
        "atk_scale3",
        "distance",
        "ifrightside"
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
        },
        {
          "key": "atk_scale1",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        },
        {
          "key": "atk_scale2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale3",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "distance",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        },
        {
          "key": "ifrightside",
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
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "DamageAction",
        "IfElseAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 5,
          "endFrame": 5,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
          "producerType": "FindTargetAction",
          "finderType": "HitBoxFinder",
          "finderFactionTarget": "Anti",
          "finderTargetObjectType": "Normal",
          "finderCheckAlive": true,
          "validatorTypes": [
            "TargetContainsValidator"
          ],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 6,
          "endFrame": 6,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
          "producerType": "FindTargetAction",
          "finderType": "HitBoxFinder",
          "finderFactionTarget": "Anti",
          "finderTargetObjectType": "Normal",
          "finderCheckAlive": true,
          "validatorTypes": [
            "TargetContainsValidator"
          ],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 17,
          "endFrame": 17,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
          "producerType": "FindTargetAction",
          "finderType": "HitBoxFinder",
          "finderFactionTarget": "Anti",
          "finderTargetObjectType": "Normal",
          "finderCheckAlive": true,
          "validatorTypes": [
            "TargetContainsValidator"
          ],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 37,
          "endFrame": 37,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
          "producerType": "FindTargetAction",
          "finderType": "HitBoxFinder",
          "finderFactionTarget": "Anti",
          "finderTargetObjectType": "Normal",
          "finderCheckAlive": true,
          "validatorTypes": [
            "TargetContainsValidator"
          ],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 1,
          "endFrame": 5,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "pos",
          "producerType": "FindTargetAction",
          "finderType": "SnapPointFinder",
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
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckTargetContains",
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
              "contextBuffId": null,
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
                "timelineActions[12]",
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
                    "value": 0.3,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ]
            }
          ],
          "failActions": [
            {
              "actionType": "DamageAction",
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
              "serverActionIndex": 21,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
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
                    "value": 0.3,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
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
          "startFrame": 17,
          "endFrame": 17,
          "actionIndex": 22,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckTargetContains",
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
              "contextBuffId": null,
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
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 24,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
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
                    "value": 0.2,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ]
            }
          ],
          "failActions": [
            {
              "actionType": "DamageAction",
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
              "serverActionIndex": 29,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
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
                    "value": 0.2,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
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
          "startFrame": 37,
          "endFrame": 37,
          "actionIndex": 31,
          "actionPath": [
            "timelineActions[15]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckTargetContains",
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
              "contextBuffId": null,
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
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 33,
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
                  "targetGroupKey": "targets",
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
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
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
                    "value": 0.5,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
                }
              ]
            }
          ],
          "failActions": [
            {
              "actionType": "DamageAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[15]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 39,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
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
                    "value": 0.5,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 132
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
          "startFrame": 0,
          "endFrame": 7,
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[20]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckTwoDirectionAngle",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": [],
              "poise": null,
              "superArmor": null,
              "twoDirectionAngle": {
                "dir1Source": {
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
                "dir1Target": {
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
                "dir1DirectionType": "CameraForward",
                "dir2Source": {
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
                "dir2Target": {
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
                "dir2DirectionType": "SourceToTarget",
                "comparison": "LT",
                "value": {
                  "value": 0.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              },
              "targetAngle": null,
              "damageDecorateMask": null,
              "contextBuffId": null,
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
                "timelineActions[20]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 47,
              "blackboardMutation": {
                "key": "ifrightside",
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
          "failActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[20]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 49,
              "blackboardMutation": {
                "key": "ifrightside",
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
      "key": "battleSkill1",
      "skillId": "chr_0031_mifu_normalskill_1",
      "skillType": "battleSkill",
      "sourceFile": "chr_0031_mifu_normalskill_1.json",
      "timelineBlockFrames": 11,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 11,
          "endFrame": 30,
          "skillIds": [
            "chr_0031_mifu_normalskill_2"
          ]
        },
        {
          "startFrame": 115,
          "endFrame": 131,
          "skillIds": [
            "chr_0031_mifu_normalskill_2"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 30,
          "skillIds": [
            "chr_0031_mifu_attack2"
          ]
        },
        {
          "startFrame": 115,
          "endFrame": 131,
          "skillIds": [
            "chr_0031_mifu_attack2"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 30,
          "skillIds": [
            "chr_0031_mifu_powerattack"
          ]
        },
        {
          "startFrame": 115,
          "endFrame": 131,
          "skillIds": [
            "chr_0031_mifu_powerattack"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 30,
          "skillIds": [
            "chr_0031_mifu_combo_skill"
          ]
        },
        {
          "startFrame": 115,
          "endFrame": 131,
          "skillIds": [
            "chr_0031_mifu_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 131,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0031_mifu_attack2",
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
          "endFrame": 105,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 203,
          "actionTypes": [
            "PlayAnimationAction"
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
          "startFrame": 105,
          "endFrame": 203,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 8,
          "actionTypes": [
            "CheckEntityNum",
            "AddDynamicCcsAction"
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
            "CameraRotateAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 38,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 156,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
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
          "endFrame": 0,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 4,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionTypes": [
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 7,
          "actionTypes": [
            "CheckEntityNum",
            "InterruptAction",
            "EffectAction",
            "EnemyHurtAnimAction",
            "PullAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 12,
          "actionTypes": [
            "CheckEntityNum",
            "CheckEntityNum",
            "EnemyHurtAnimAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "CreateBuffAction",
            "JumpToAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 31,
          "actionTypes": [
            "MarkCanInterrupt"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 113,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "CheckEntityNum",
            "SaveTargetDistanceAction",
            "FindTargetAction",
            "Selector",
            "SaveTargetDistanceAction",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 104,
          "endFrame": 104,
          "actionTypes": [
            "JumpToAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 25,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 125,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 131,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 30,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 115,
          "endFrame": 131,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 30,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 115,
          "endFrame": 131,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 30,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 115,
          "endFrame": 131,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 30,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 115,
          "endFrame": 131,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 83,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 35,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 120,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 202,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 203,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 64,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 64,
          "endFrame": 105,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 165,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 165,
          "endFrame": 203,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 64,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 64,
          "endFrame": 105,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 165,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 165,
          "endFrame": 203,
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
          "startFrame": 31,
          "endFrame": 131,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 44,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 7,
          "endFrame": 12,
          "actionIndex": 40,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.67,
                  0.73,
                  0.8,
                  0.87,
                  0.93,
                  1.0,
                  1.07,
                  1.13,
                  1.2,
                  1.28,
                  1.38,
                  1.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4352
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 13
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 11,
          "endFrame": 38,
          "actionIndex": 15,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_comboprocess",
          "classification": null,
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
          "sequenceIndex": 6,
          "autoFinishByAction": true
        },
        {
          "startFrame": 105,
          "endFrame": 156,
          "actionIndex": 16,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_comboprocess",
          "classification": null,
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
          "sequenceIndex": 7,
          "autoFinishByAction": true
        },
        {
          "startFrame": 7,
          "endFrame": 12,
          "actionIndex": 41,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_obtain_ultimate_sp",
          "classification": "skillCostUltimateEnergyGain",
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
          "sequenceIndex": 13,
          "autoFinishByAction": false
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 62,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_normalskill_2",
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
          "sequenceIndex": 17,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 61,
          "key": "effect_z_scale",
          "operation": "Divide",
          "value": {
            "value": 8.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 16
        }
      ],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 31,
          "resource": "sp",
          "amount": {
            "value": 50.0,
            "blackboardKey": null,
            "levelValues": null
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 11
        }
      ],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0031_mifu_comboprocess",
        "buff_chr_0031_mifu_normalskill_2",
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
            0.67,
            0.73,
            0.8,
            0.87,
            0.93,
            1.0,
            1.07,
            1.13,
            1.2,
            1.28,
            1.38,
            1.5
          ],
          "display_atk_scale": [
            0.67,
            0.73,
            0.8,
            0.87,
            0.93,
            1.0,
            1.07,
            1.13,
            1.2,
            1.28,
            1.38,
            1.5
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
          "key": "angle",
          "value": 120.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 1.0,
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
          "value": 3.41,
          "isDynamic": true
        },
        {
          "key": "defend_reduct",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 2.0,
          "isDynamic": false
        },
        {
          "key": "effect_z_scale",
          "value": 1.0,
          "isDynamic": true
        },
        {
          "key": "height",
          "value": 4.0,
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
          "key": "prob",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "pulloffset",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "radius",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "usp_everyone",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "usp_self",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "will_additive",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "cam_angle",
        "effect_z_scale",
        "input_angle",
        "pulloffset",
        "select_radius"
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
          "key": "atk_scale",
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
          "key": "defend_reduct",
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
          "key": "effect_z_scale",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
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
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "prob",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "pulloffset",
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
          "key": "usp_everyone",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "usp_self",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "will_additive",
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
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[8]",
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
          "endFrame": 0,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[8]",
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
          "endFrame": 0,
          "actionIndex": 25,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "failActions",
            "actionData",
            "[2]",
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
          "endFrame": 0,
          "actionIndex": 27,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "failActions",
            "actionData",
            "[2]",
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
          "startFrame": 4,
          "endFrame": 4,
          "actionIndex": 30,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "endFrame": 12,
          "actionIndex": 50,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[5]",
            "succeedActions",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]",
            "action",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "pos",
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
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 54,
          "actionPath": [
            "timelineActions[16]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targetpos",
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
          "endFrame": 0,
          "actionIndex": 59,
          "actionPath": [
            "timelineActions[16]",
            "_sequenceActionData",
            "actionData",
            "[3]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targetpos",
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
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 19,
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
          "succeedActions": [],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 23,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 0,
                "actionIndex": 23,
                "actionPath": [
                  "timelineActions[8]",
                  "_sequenceActionData",
                  "actionData",
                  "[2]",
                  "failActions",
                  "actionData",
                  "[2]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LT",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "input_angle",
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
                    "actionType": "FindTargetAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[8]",
                      "_sequenceActionData",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 25,
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
                      "timelineActions[8]",
                      "_sequenceActionData",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 27,
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
          "startFrame": 7,
          "endFrame": 12,
          "actionIndex": 42,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[5]"
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
                "targetGroupKey": "targets",
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
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[5]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 44,
              "nestedCondition": {
                "startFrame": 7,
                "endFrame": 12,
                "actionIndex": 44,
                "actionPath": [
                  "timelineActions[13]",
                  "_sequenceActionData",
                  "actionData",
                  "[5]",
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
                      "targetGroupKey": "",
                      "minimumCount": 1,
                      "comparison": "GE",
                      "containsHittableTarget": false,
                      "excludeDeadEntity": true,
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
                  },
                  {
                    "sourceType": "CheckSuperArmor",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": {
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
                      "comparison": "GE",
                      "value": {
                        "value": 30.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    },
                    "twoDirectionAngle": null,
                    "targetAngle": null,
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
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[13]",
                      "_sequenceActionData",
                      "actionData",
                      "[5]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "action",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 50,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null
                  }
                ],
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
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 57,
          "actionPath": [
            "timelineActions[16]",
            "_sequenceActionData",
            "actionData",
            "[3]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "LE",
              "left": {
                "value": 0.0,
                "blackboardKey": "effect_z_scale",
                "levelValues": null
              },
              "right": {
                "value": 8.0,
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
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[16]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 59,
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
          "startFrame": 7,
          "endFrame": 12,
          "destFrame": 105,
          "actionIndex": 47,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[5]",
            "succeedActions",
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
          "isRootContainerOnlySequenceAction": false,
          "sequenceIndex": 13
        },
        {
          "startFrame": 104,
          "endFrame": 104,
          "destFrame": 204,
          "actionIndex": 66,
          "actionPath": [
            "timelineActions[19]",
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
          "sequenceIndex": 19
        }
      ],
      "timelineJumpControlFlowActions": [
        {
          "startFrame": 7,
          "endFrame": 12,
          "actionIndex": 42,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[5]"
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
                "targetGroupKey": "targets",
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
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[5]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 44,
              "nestedCondition": {
                "startFrame": 7,
                "endFrame": 12,
                "actionIndex": 44,
                "actionPath": [
                  "timelineActions[13]",
                  "_sequenceActionData",
                  "actionData",
                  "[5]",
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
                      "targetGroupKey": "",
                      "minimumCount": 1,
                      "comparison": "GE",
                      "containsHittableTarget": false,
                      "excludeDeadEntity": true,
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
                  },
                  {
                    "sourceType": "CheckSuperArmor",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": {
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
                      "comparison": "GE",
                      "value": {
                        "value": 30.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    },
                    "twoDirectionAngle": null,
                    "targetAngle": null,
                    "damageDecorateMask": null,
                    "contextBuffId": null,
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
                      "timelineActions[13]",
                      "_sequenceActionData",
                      "actionData",
                      "[5]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 47,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "timelineJumpDestinationFrame": 105
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
      "key": "battleSkill2",
      "skillId": "chr_0031_mifu_normalskill_2",
      "skillType": "battleSkill",
      "sourceFile": "chr_0031_mifu_normalskill_2.json",
      "timelineBlockFrames": 28,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 28,
          "endFrame": 62,
          "skillIds": [
            "chr_0031_mifu_normalskill_3"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 62,
          "skillIds": [
            "chr_0031_mifu_powerattack"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 62,
          "skillIds": [
            "chr_0031_mifu_combo_skill"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 62,
          "skillIds": [
            "chr_0031_mifu_attack1",
            "chr_0031_mifu_attack2",
            "chr_0031_mifu_attack3",
            "chr_0031_mifu_attack4"
          ]
        }
      ],
      "inputCacheWindows": [],
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
          "endFrame": 0,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 24,
          "actionTypes": [
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
            "Selector",
            "CurveEvaluateFloat",
            "CameraRotateAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 24,
          "actionTypes": [
            "FinishBuffAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 129,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionTypes": [
            "CheckEntityNum",
            "IfElseAction",
            "FinishBuffAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 29,
          "actionTypes": [
            "CheckEntityNum",
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 3,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 24,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 3,
          "actionTypes": [
            "CheckEntityNum",
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "HitStopAction",
            "EnemyHurtAnimAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionTypes": [
            "CheckEntityNum",
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "HitStopAction",
            "EnemyHurtAnimAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 24,
          "actionTypes": [
            "CheckEntityNum",
            "InterruptAction",
            "ForEachAction",
            "SaveBuffStackNumAdvanced",
            "ModifyDynamicBlackboard",
            "CrushAction",
            "IfElseAction",
            "CreateBuffAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "HitStopAction",
            "EnemyHurtAnimAction",
            "CreateBuffAction",
            "CameraImpulseAction"
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
          "startFrame": 0,
          "endFrame": 34,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 24,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 62,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 62,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 62,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 62,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 1,
          "endFrame": 58,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 57,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 82,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 81,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 66,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 51,
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
          "endFrame": 150,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 87,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 87,
          "endFrame": 150,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 87,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 87,
          "endFrame": 150,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 32,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 65,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 55,
          "endFrame": 126,
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
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 3,
          "endFrame": 3,
          "actionIndex": 33,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 3.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.27,
                  0.3,
                  0.32,
                  0.35,
                  0.38,
                  0.41,
                  0.43,
                  0.46,
                  0.49,
                  0.52,
                  0.56,
                  0.61
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4352
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 11
        },
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionIndex": 39,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 3.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.27,
                  0.3,
                  0.32,
                  0.35,
                  0.38,
                  0.41,
                  0.43,
                  0.46,
                  0.49,
                  0.52,
                  0.56,
                  0.61
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4352
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 12
        },
        {
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 54,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 3.0,
                "blackboardKey": "atk_scale2",
                "levelValues": [
                  0.35,
                  0.39,
                  0.42,
                  0.46,
                  0.49,
                  0.53,
                  0.56,
                  0.6,
                  0.63,
                  0.68,
                  0.73,
                  0.79
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
          "sequenceIndex": 13
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 13,
          "actionPath": [
            "timelineActions[6]",
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
            }
          ],
          "succeedActions": [],
          "failActions": [
            {
              "actionType": "FinishBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 22,
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
                  "buff_chr_0031_mifu_comboprocess"
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
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 47,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "action",
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
                "blackboardKey": "stack",
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": "maxstack",
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
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "action",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 49,
              "blackboardMutation": {
                "key": "maxstack",
                "operation": "Assign",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "stack",
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
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 51,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[4]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GE",
              "left": {
                "value": 0.0,
                "blackboardKey": "maxstack",
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
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 53,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0031_mifu_normalskill_3",
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
                "buffSource": "ActionOwner",
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
          "startFrame": 28,
          "endFrame": 129,
          "actionIndex": 11,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_comboprocess",
          "classification": null,
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
          "sequenceIndex": 5,
          "autoFinishByAction": true
        },
        {
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 57,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_obtain_ultimate_sp",
          "classification": "skillCostUltimateEnergyGain",
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
          "sequenceIndex": 13,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [
        {
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 10,
          "targetSource": "Owner",
          "targetGroupKey": "",
          "buffCheckType": "Id",
          "buffIds": [
            "buff_chr_0031_mifu_normalskill_2"
          ],
          "tagQueryType": "hasAny",
          "buffTagIds": [],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": false,
          "isAbsorbed": false,
          "finishLayerCount": null,
          "sourceActionType": "FinishBuffAction",
          "sequenceIndex": 4
        }
      ],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0031_mifu_comboprocess",
        "buff_chr_0031_mifu_normalskill_3",
        "buff_common_obtain_ultimate_sp",
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
            0.27,
            0.3,
            0.32,
            0.35,
            0.38,
            0.41,
            0.43,
            0.46,
            0.49,
            0.52,
            0.56,
            0.61
          ],
          "atk_scale2": [
            0.35,
            0.39,
            0.42,
            0.46,
            0.49,
            0.53,
            0.56,
            0.6,
            0.63,
            0.68,
            0.73,
            0.79
          ],
          "display_atk_scale": [
            0.89,
            0.98,
            1.07,
            1.16,
            1.25,
            1.34,
            1.43,
            1.51,
            1.6,
            1.72,
            1.85,
            2.0
          ],
          "display_poise": [
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
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "angle",
          "value": 120.0,
          "isDynamic": false
        },
        {
          "key": "atk_heal",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
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
          "value": 3.41,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 2.0,
          "isDynamic": false
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "maxstack",
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
          "key": "potential",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_minuscd",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "prob",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "radius",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "stack",
          "value": 4.0,
          "isDynamic": true
        },
        {
          "key": "usp_everyone",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "usp_self",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "atk_scale2",
        "cam_angle",
        "input_angle",
        "maxstack",
        "poise",
        "select_radius",
        "stack"
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
          "key": "atk_heal",
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
          "key": "display_atk_scale",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "display_poise",
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
          "key": "maxstack",
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
          "key": "potential",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_minuscd",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "prob",
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
          "key": "select_radius",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "stack",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "usp_everyone",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "usp_self",
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
        "CrushAction",
        "DamageAction",
        "FinishBuffAction",
        "IfElseAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 3,
          "endFrame": 3,
          "actionIndex": 28,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 10,
          "endFrame": 10,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[9]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "endFrame": 24,
          "actionIndex": 30,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "endFrame": 0,
          "actionIndex": 13,
          "actionPath": [
            "timelineActions[6]",
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
            }
          ],
          "succeedActions": [],
          "failActions": [
            {
              "actionType": "FinishBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 22,
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
                  "buff_chr_0031_mifu_comboprocess"
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
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 47,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "action",
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
                "blackboardKey": "stack",
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": "maxstack",
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
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "action",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 49,
              "blackboardMutation": {
                "key": "maxstack",
                "operation": "Assign",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "stack",
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
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 51,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[4]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GE",
              "left": {
                "value": 0.0,
                "blackboardKey": "maxstack",
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
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[13]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 53,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0031_mifu_normalskill_3",
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
                "buffSource": "ActionOwner",
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
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 50,
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
              "targetGroupKey": "targets",
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
            "directionType": "SourceForward",
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
              "value": 1.0,
              "blackboardKey": null,
              "levelValues": null
            },
            "ignoreHitEffect": true
          },
          "sequenceIndex": 13
        }
      ],
      "eventListeners": [],
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionIndex": 70,
          "kind": "normal",
          "priority": 513129183,
          "scope": "entity",
          "slot": 257664179,
          "duration": {
            "value": 99999.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": null,
          "inlineCurve": [
            {
              "time": 0.0,
              "value": 1.25,
              "inTangent": 0.0,
              "outTangent": 0.0,
              "weightedMode": 0,
              "inWeight": 0.0,
              "outWeight": 0.333333343
            },
            {
              "time": 1.0,
              "value": 1.25,
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
          "sequenceIndex": 18,
          "effectAbilityEntityTargets": []
        }
      ],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "battleSkill3",
      "skillId": "chr_0031_mifu_normalskill_3",
      "skillType": "battleSkill",
      "sourceFile": "chr_0031_mifu_normalskill_3.json",
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
          "endFrame": 241,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionTypes": [
            "CheckEntityNum",
            "IfElseAction",
            "DebugPrintAction",
            "FinishBuffAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 23,
          "actionTypes": [
            "TeleportAction",
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 23,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 25,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 26,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionTypes": [
            "FinishBuffAdvanced"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 23,
          "actionTypes": [
            "CheckEntityNum",
            "InterruptAction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "BlowOffAction",
            "HitStopAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 25,
          "actionTypes": [
            "BlowOffAction",
            "HitStopAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 26,
          "actionTypes": [
            "BlowOffAction",
            "ForEachAction",
            "ModifyDynamicBlackboard",
            "ReadSkillSettingData",
            "ModifyDynamicBlackboard",
            "DebugPrintAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "DebugPrintAction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 15,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 26,
          "actionTypes": [
            "CameraImpulseAction"
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
          "startFrame": 21,
          "endFrame": 23,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "MoveToAction",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 23,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 241,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 21,
          "actionTypes": [
            "CheckEntityNum",
            "SaveTargetDistanceAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "OverrideCameraFollowAction",
            "LockCameraAimAction",
            "AddDynamicCcsAction",
            "DebugPrintAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 26,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "AddDynamicCcsAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 29,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "AddDynamicCcsAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 76,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction"
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
            "Selector",
            "CurveEvaluateFloat",
            "CameraRotateAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 34,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 49,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 27,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 104,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 235,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 86,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 235,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 86,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 235,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 144,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 59,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 145,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 13,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 23,
          "endFrame": 23,
          "actionIndex": 24,
          "damageUnits": [
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
              "damageDecorateMask": 4096
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 8
        },
        {
          "startFrame": 25,
          "endFrame": 25,
          "actionIndex": 38,
          "damageUnits": [
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
          "sequenceIndex": 9
        },
        {
          "startFrame": 26,
          "endFrame": 26,
          "actionIndex": 55,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 10.0,
                "blackboardKey": "atk_scale_runtime",
                "levelValues": null
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 20480
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 10
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[1]",
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
            }
          ],
          "succeedActions": [],
          "failActions": [
            {
              "actionType": "FinishBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
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
                  "buff_chr_0031_mifu_comboprocess"
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
          "startFrame": 26,
          "endFrame": 26,
          "actionIndex": 40,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [],
          "succeedActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 41,
              "blackboardMutation": {
                "key": "atk_scale_runtime",
                "operation": "Assign",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale",
                  "levelValues": [
                    4.0,
                    4.16,
                    4.32,
                    4.48,
                    4.64,
                    4.8,
                    4.96,
                    5.12,
                    5.28,
                    5.48,
                    5.72,
                    6.0
                  ]
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ReadSkillSettingData",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 42,
              "storeAttributeValue": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "attributeKind": "specific",
                "attributeKey": "PhysicalAndSpellInflictionEnhance",
                "stage": "finalNonConverted",
                "useFloor": false,
                "divisor": {
                  "value": 1,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "multiplier": {
                  "value": 0.01,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "base": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "outputKey": "yuanshi_multi"
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 43,
              "blackboardMutation": {
                "key": "atk_scale_runtime",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "yuanshi_multi",
                  "levelValues": null
                }
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
        {
          "startFrame": 26,
          "endFrame": 26,
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "action",
            "actionData",
            "[4]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
                "value": 0.0,
                "blackboardKey": "talent",
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
              "sourceType": "OrConditionAction",
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
              "probability": null,
              "anyConditionGroups": [
                [
                  {
                    "sourceType": "CheckPoiseValue",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": {
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
                      "returnValueIfMissing": false,
                      "comparison": "Equals",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
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
                [
                  {
                    "sourceType": "CheckBuffStackNumAdvanced",
                    "supported": true,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "buffStack": {
                      "targetSource": "Target",
                      "targetGroupKey": "",
                      "buffCheckType": "Tag",
                      "buffIds": [],
                      "tagQueryType": "hasAny",
                      "buffTagIds": [
                        1066759270
                      ],
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
                ]
              ],
              "anyConditionNegated": [
                [
                  false
                ],
                [
                  false
                ]
              ]
            }
          ],
          "succeedActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 50,
              "blackboardMutation": {
                "key": "crushmulti",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 51,
              "blackboardMutation": {
                "key": "crushmultiadd_talent_runtime",
                "operation": "Assign",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "crushmultiadd_talent",
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
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 52,
              "blackboardMutation": {
                "key": "crushmulti",
                "operation": "Add",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "crushmultiadd_talent_runtime",
                  "levelValues": null
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 53,
              "blackboardMutation": {
                "key": "atk_scale_runtime",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "crushmulti",
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
            false,
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 21,
          "endFrame": 23,
          "actionIndex": 62,
          "actionPath": [
            "timelineActions[14]",
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
                "targetGroupKey": "smart_target",
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
            },
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 67,
              "blackboardMutation": {
                "key": "Ifmoveto",
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
            false,
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 21,
          "actionIndex": 72,
          "actionPath": [
            "timelineActions[18]",
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
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[18]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 75,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 21,
                "actionIndex": 75,
                "actionPath": [
                  "timelineActions[18]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
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
                      "blackboardKey": "distance",
                      "levelValues": null
                    },
                    "right": {
                      "value": 6.0,
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
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 77,
                    "blackboardMutation": {
                      "key": "cam_angle",
                      "operation": "Assign",
                      "value": {
                        "value": 40.0,
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
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[1]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 78,
                    "blackboardMutation": {
                      "key": "cam_angle",
                      "operation": "Assign",
                      "value": {
                        "value": 60.0,
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
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[18]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 79,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 21,
                "actionIndex": 79,
                "actionPath": [
                  "timelineActions[18]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "succeedActions",
                  "actionData",
                  "[2]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckTwoDirectionAngle",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": {
                      "dir1Source": {
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
                      "dir1Target": {
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
                      "dir1DirectionType": "CameraForward",
                      "dir2Source": {
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
                      "dir2Target": {
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
                      "dir2DirectionType": "SourceToTarget",
                      "comparison": "LT",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    },
                    "targetAngle": null,
                    "damageDecorateMask": null,
                    "contextBuffId": null,
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
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 81,
                    "blackboardMutation": {
                      "key": "ifrightside",
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
                "failActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 82,
                    "blackboardMutation": {
                      "key": "ifrightside",
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
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 83,
                    "blackboardMutation": {
                      "key": "cam_angle",
                      "operation": "Multiply",
                      "value": {
                        "value": -1.0,
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
          "startFrame": 26,
          "endFrame": 26,
          "actionIndex": 56,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_obtain_ultimate_sp",
          "classification": "skillCostUltimateEnergyGain",
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
          "sequenceIndex": 10,
          "autoFinishByAction": false
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionIndex": 21,
          "targetSource": "Owner",
          "targetGroupKey": "",
          "buffCheckType": "Id",
          "buffIds": [
            "buff_chr_0031_mifu_normalskill_3"
          ],
          "tagQueryType": "hasAny",
          "buffTagIds": [],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": false,
          "isAbsorbed": false,
          "finishLayerCount": null,
          "sourceActionType": "FinishBuffAdvanced",
          "sequenceIndex": 7
        }
      ],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
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
            4.0,
            4.16,
            4.32,
            4.48,
            4.64,
            4.8,
            4.96,
            5.12,
            5.28,
            5.48,
            5.72,
            6.0
          ],
          "display_poise": [
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
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0,
          50.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "Ifmoveto",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "anglestack",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_scale",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_runtime",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cam_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cam_duration",
          "value": 3.41,
          "isDynamic": true
        },
        {
          "key": "crushmulti",
          "value": 1.0,
          "isDynamic": true
        },
        {
          "key": "crushmultiadd_talent",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "crushmultiadd_talent_runtime",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cure",
          "value": 5.0,
          "isDynamic": true
        },
        {
          "key": "damagemulti",
          "value": 1.0,
          "isDynamic": true
        },
        {
          "key": "distance",
          "value": 4.0,
          "isDynamic": true
        },
        {
          "key": "heal_base",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "ifrightside",
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
          "isDynamic": true
        },
        {
          "key": "potential",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_multi",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "prob",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "talent",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "usp_everyone",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "usp_self",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "yuanshi_multi",
          "value": 1.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "Ifmoveto",
        "atk_scale",
        "atk_scale_runtime",
        "cam_angle",
        "crushmulti",
        "crushmultiadd_talent",
        "crushmultiadd_talent_runtime",
        "distance",
        "ifrightside",
        "input_angle",
        "poise",
        "select_radius",
        "talent",
        "yuanshi_multi"
      ],
      "blackboardProvenance": [
        {
          "key": "Ifmoveto",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "anglestack",
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
          "key": "atk_scale_runtime",
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
          "key": "crushmulti",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "crushmultiadd_talent",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "crushmultiadd_talent_runtime",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "cure",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "damagemulti",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "display_poise",
          "declaredInSkill": false,
          "suppliedByPatch": true,
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
          "key": "heal_base",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "ifrightside",
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
          "key": "potential",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential_multi",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "prob",
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
          "key": "talent",
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
          "key": "usp_everyone",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "usp_self",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "yuanshi_multi",
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
        "IfElseAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 23,
          "endFrame": 23,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "endFrame": 25,
          "actionIndex": 19,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "endFrame": 26,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[6]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 21,
          "endFrame": 23,
          "actionIndex": 65,
          "actionPath": [
            "timelineActions[14]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "pos",
          "producerType": "FindTargetAction",
          "finderType": "SnapPointFinder",
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
          "endFrame": 0,
          "actionIndex": 2,
          "actionPath": [
            "timelineActions[1]",
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
            }
          ],
          "succeedActions": [],
          "failActions": [
            {
              "actionType": "FinishBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "failActions",
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
                  "buff_chr_0031_mifu_comboprocess"
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
          "startFrame": 26,
          "endFrame": 26,
          "actionIndex": 40,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [],
          "succeedActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 41,
              "blackboardMutation": {
                "key": "atk_scale_runtime",
                "operation": "Assign",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "atk_scale",
                  "levelValues": [
                    4.0,
                    4.16,
                    4.32,
                    4.48,
                    4.64,
                    4.8,
                    4.96,
                    5.12,
                    5.28,
                    5.48,
                    5.72,
                    6.0
                  ]
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ReadSkillSettingData",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 42,
              "storeAttributeValue": {
                "targetSource": "Owner",
                "targetGroupKey": "",
                "attributeKind": "specific",
                "attributeKey": "PhysicalAndSpellInflictionEnhance",
                "stage": "finalNonConverted",
                "useFloor": false,
                "divisor": {
                  "value": 1,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "multiplier": {
                  "value": 0.01,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "base": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "outputKey": "yuanshi_multi"
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 43,
              "blackboardMutation": {
                "key": "atk_scale_runtime",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "yuanshi_multi",
                  "levelValues": null
                }
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
        {
          "startFrame": 26,
          "endFrame": 26,
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "action",
            "actionData",
            "[4]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
                "value": 0.0,
                "blackboardKey": "talent",
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
              "sourceType": "OrConditionAction",
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
              "probability": null,
              "anyConditionGroups": [
                [
                  {
                    "sourceType": "CheckPoiseValue",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": {
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
                      "returnValueIfMissing": false,
                      "comparison": "Equals",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
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
                [
                  {
                    "sourceType": "CheckBuffStackNumAdvanced",
                    "supported": true,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "buffStack": {
                      "targetSource": "Target",
                      "targetGroupKey": "",
                      "buffCheckType": "Tag",
                      "buffIds": [],
                      "tagQueryType": "hasAny",
                      "buffTagIds": [
                        1066759270
                      ],
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
                ]
              ],
              "anyConditionNegated": [
                [
                  false
                ],
                [
                  false
                ]
              ]
            }
          ],
          "succeedActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 50,
              "blackboardMutation": {
                "key": "crushmulti",
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
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 51,
              "blackboardMutation": {
                "key": "crushmultiadd_talent_runtime",
                "operation": "Assign",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "crushmultiadd_talent",
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
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 52,
              "blackboardMutation": {
                "key": "crushmulti",
                "operation": "Add",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "crushmultiadd_talent_runtime",
                  "levelValues": null
                }
              },
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "action",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 53,
              "blackboardMutation": {
                "key": "atk_scale_runtime",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "crushmulti",
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
            false,
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 21,
          "endFrame": 23,
          "actionIndex": 62,
          "actionPath": [
            "timelineActions[14]",
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
                "targetGroupKey": "smart_target",
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
            },
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
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 65,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[14]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 67,
              "blackboardMutation": {
                "key": "Ifmoveto",
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
            false,
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 0,
          "endFrame": 21,
          "actionIndex": 72,
          "actionPath": [
            "timelineActions[18]",
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
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[18]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 75,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 21,
                "actionIndex": 75,
                "actionPath": [
                  "timelineActions[18]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
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
                      "blackboardKey": "distance",
                      "levelValues": null
                    },
                    "right": {
                      "value": 6.0,
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
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 77,
                    "blackboardMutation": {
                      "key": "cam_angle",
                      "operation": "Assign",
                      "value": {
                        "value": 40.0,
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
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[1]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 78,
                    "blackboardMutation": {
                      "key": "cam_angle",
                      "operation": "Assign",
                      "value": {
                        "value": 60.0,
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
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[18]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 79,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 21,
                "actionIndex": 79,
                "actionPath": [
                  "timelineActions[18]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "succeedActions",
                  "actionData",
                  "[2]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckTwoDirectionAngle",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "poise": null,
                    "superArmor": null,
                    "twoDirectionAngle": {
                      "dir1Source": {
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
                      "dir1Target": {
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
                      "dir1DirectionType": "CameraForward",
                      "dir2Source": {
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
                      "dir2Target": {
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
                      "dir2DirectionType": "SourceToTarget",
                      "comparison": "LT",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    },
                    "targetAngle": null,
                    "damageDecorateMask": null,
                    "contextBuffId": null,
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
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 81,
                    "blackboardMutation": {
                      "key": "ifrightside",
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
                "failActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 82,
                    "blackboardMutation": {
                      "key": "ifrightside",
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
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 1,
                    "actionPath": [
                      "timelineActions[18]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "failActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 83,
                    "blackboardMutation": {
                      "key": "cam_angle",
                      "operation": "Multiply",
                      "value": {
                        "value": -1.0,
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
      "skillId": "chr_0031_mifu_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0031_mifu_ultimate_skill.json",
      "timelineBlockFrames": 113,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "Atb",
      "costValue": 40.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 113,
          "endFrame": 124,
          "skillIds": [
            "chr_0031_mifu_powerattack"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 124,
          "skillIds": [
            "chr_0031_mifu_normalskill_2"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 124,
          "skillIds": [
            "chr_0031_mifu_normalskill_3"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 124,
          "skillIds": [
            "chr_0031_mifu_combo_skill"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 124,
          "skillIds": [
            "chr_0031_mifu_attack1",
            "chr_0031_mifu_attack2",
            "chr_0031_mifu_attack3",
            "chr_0031_mifu_attack4"
          ]
        }
      ],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 249,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 105,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionTypes": [
            "CheckEntityNum",
            "FindTargetAction",
            "Selector",
            "TeleportAction",
            "Selector",
            "Selector",
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 74,
          "endFrame": 80,
          "actionTypes": [
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction",
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 80,
          "endFrame": 96,
          "actionTypes": [
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction",
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 96,
          "endFrame": 100,
          "actionTypes": [
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction",
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 100,
          "endFrame": 113,
          "actionTypes": [
            "OverrideCameraFollowAction",
            "AddDynamicCcsAction",
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 74,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 74,
          "endFrame": 249,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 66,
          "endFrame": 75,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 95,
          "endFrame": 98,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 96,
          "actionTypes": [
            "AnimatedCameraAction"
          ]
        },
        {
          "startFrame": 102,
          "endFrame": 102,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 75,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 98,
          "endFrame": 98,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 102,
          "endFrame": 102,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 75,
          "actionTypes": [
            "CheckEntityNum",
            "InterruptAction",
            "AirborneAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "HitStopAction",
            "EnemyHurtAnimAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 98,
          "endFrame": 98,
          "actionTypes": [
            "CheckEntityNum",
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "HitStopAction",
            "EnemyHurtAnimAction",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 99,
          "endFrame": 99,
          "actionTypes": [
            "BlowOffAction"
          ]
        },
        {
          "startFrame": 102,
          "endFrame": 102,
          "actionTypes": [
            "TakeDownAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 80,
          "actionTypes": [
            "PullAction"
          ]
        },
        {
          "startFrame": 102,
          "endFrame": 102,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 118,
          "actionTypes": [
            "CreateBuffAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 71,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 71,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 71,
          "actionTypes": [
            "UltimateShowAction"
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
          "startFrame": 0,
          "endFrame": 103,
          "actionTypes": [
            "ChannelingCastingAction"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 124,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 124,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 124,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 124,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 113,
          "endFrame": 124,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 100,
          "endFrame": 260,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 72,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 72,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 104,
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
          "startFrame": 14,
          "endFrame": 48,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 86,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 170,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 160,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 76,
          "endFrame": 190,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 82,
          "endFrame": 214,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 78,
          "endFrame": 206,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 136,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 42,
          "endFrame": 134,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 204,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 202,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 102,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 58,
          "endFrame": 158,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 104,
          "endFrame": 218,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 82,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 96,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 68,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 136,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 262,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 30,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 249,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 30,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 134,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 134,
          "endFrame": 249,
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
          "startFrame": 80,
          "endFrame": 134,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 134,
          "endFrame": 249,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 30,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 30,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 80,
          "endFrame": 80,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 100,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 249,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 87,
          "endFrame": 152,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 98,
          "endFrame": 167,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 102,
          "endFrame": 249,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 123,
          "endFrame": 249,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 75,
          "endFrame": 75,
          "actionIndex": 62,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 3.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.9,
                  0.99,
                  1.08,
                  1.17,
                  1.26,
                  1.35,
                  1.44,
                  1.53,
                  1.62,
                  1.73,
                  1.87,
                  2.03
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 16
        },
        {
          "startFrame": 98,
          "endFrame": 98,
          "actionIndex": 68,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 17
        },
        {
          "startFrame": 102,
          "endFrame": 102,
          "actionIndex": 74,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 3.0,
                "blackboardKey": "atk_scale2",
                "levelValues": [
                  2.21,
                  2.43,
                  2.65,
                  2.87,
                  3.09,
                  3.31,
                  3.54,
                  3.76,
                  3.98,
                  4.25,
                  4.58,
                  4.97
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
                "blackboardKey": "poise2",
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
          "sequenceIndex": 19
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 105,
          "actionIndex": 1,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_buffpause",
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
          "sequenceIndex": 1,
          "autoFinishByAction": true
        },
        {
          "startFrame": 102,
          "endFrame": 102,
          "actionIndex": 55,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0031_mifu_normalskill_2",
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
          "autoFinishByAction": false
        },
        {
          "startFrame": 0,
          "endFrame": 118,
          "actionIndex": 79,
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
          "sequenceIndex": 22,
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
        "buff_chr_0031_mifu_buffpause",
        "buff_chr_0031_mifu_normalskill_2",
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
            0.9,
            0.99,
            1.08,
            1.17,
            1.26,
            1.35,
            1.44,
            1.53,
            1.62,
            1.73,
            1.87,
            2.03
          ],
          "atk_scale2": [
            2.21,
            2.43,
            2.65,
            2.87,
            3.09,
            3.31,
            3.54,
            3.76,
            3.98,
            4.25,
            4.58,
            4.97
          ],
          "display_atk_scale": [
            3.11,
            3.42,
            3.73,
            4.04,
            4.35,
            4.66,
            4.98,
            5.29,
            5.6,
            5.99,
            6.45,
            7.0
          ],
          "display_poise": [
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
          "poise": [
            0.0,
            0.0,
            0.0,
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
          "poise2": [
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
          "key": "FinalShield",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_scale",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "extraattack",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise1",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise_extra",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "rate",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "shelter",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "atk_scale2",
        "poise2"
      ],
      "blackboardProvenance": [
        {
          "key": "FinalShield",
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
          "key": "display_atk_scale",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "display_poise",
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
          "key": "extraattack",
          "declaredInSkill": true,
          "suppliedByPatch": false,
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
        },
        {
          "key": "poise1",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise2",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "poise_extra",
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
          "key": "rate",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "shelter",
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
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "smartpos",
          "producerType": "FindTargetAction",
          "finderType": "SnapPointFinder",
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
          "startFrame": 66,
          "endFrame": 75,
          "actionIndex": 46,
          "actionPath": [
            "timelineActions[9]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "pos",
          "producerType": "FindTargetAction",
          "finderType": "SnapPointFinder",
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
          "startFrame": 95,
          "endFrame": 98,
          "actionIndex": 49,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "pos",
          "producerType": "FindTargetAction",
          "finderType": "SnapPointFinder",
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
          "startFrame": 75,
          "endFrame": 75,
          "actionIndex": 56,
          "actionPath": [
            "timelineActions[13]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 98,
          "endFrame": 98,
          "actionIndex": 57,
          "actionPath": [
            "timelineActions[14]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "startFrame": 102,
          "endFrame": 102,
          "actionIndex": 58,
          "actionPath": [
            "timelineActions[15]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "targets",
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
          "endFrame": 0,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[2]",
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
              "serverActionIndex": 5,
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
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 71,
          "actionIndex": 81,
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
          "sequenceIndex": 24,
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
