/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const camilleGeneratedSource = {
  "slug": "camille",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0033_camille_normal_skill_bat_duration_icon",
      "sourceFile": "buff_chr_0033_camille_normal_skill_bat_duration_icon.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 999.0,
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
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": false,
        "stackEffectActionTypes": []
      },
      "blackboard": [
        {
          "key": "bat_duration",
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
      "presentationOnlySwitchActionIndexes": []
    },
    {
      "buffId": "buff_chr_0033_camille_normal_skill_bateffect",
      "sourceFile": "buff_chr_0033_camille_normal_skill_bateffect.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
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
          "value": 3.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "hasStackEffects": true,
        "stackEffectActionTypes": [
          "EffectAction",
          "EffectAction",
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
      "presentationOnlySwitchActionIndexes": []
    },
    {
      "buffId": "buff_chr_0033_camille_talent1_atkup",
      "sourceFile": "buff_chr_0033_camille_talent1_atkup.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": -1.0,
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
        "waitFirstTriggerInterval": true,
        "maxTriggerCount": {
          "value": 0.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "stackingIdentifierType": "Id",
        "stackingType": "Stack",
        "stackingKey": "NormalSkillCtrl",
        "priority": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 3.0,
          "blackboardKey": "max_stack",
          "levelValues": [
            5.0
          ]
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
          "key": "max_stack",
          "value": 5.0,
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
            "blackboardKey": "atk_up",
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
      "presentationOnlySwitchActionIndexes": []
    },
    {
      "buffId": "buff_chr_0033_camille_ult_effect",
      "sourceFile": "buff_chr_0033_camille_ult_effect.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
        "duration": {
          "value": 1.0,
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
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "DuringBuffEnable",
          "orderedActionTypes": [
            "ShowHideActorAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
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
                "ShowHideActorAction",
                "EffectAction",
                "EffectAction",
                "EffectAction",
                "EffectAction",
                "EffectAction",
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
      "presentationOnlySwitchActionIndexes": []
    },
    {
      "buffId": "buff_chr_0033_camille_ult_henshin_end_1",
      "sourceFile": "buff_chr_0033_camille_ult_henshin_end_1.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 1.0,
          "blackboardKey": "duration",
          "levelValues": [
            0.55
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
          "key": "duration",
          "value": 0.55,
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
          "event": "OnBuffEnable",
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
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        },
        {
          "eventSource": "buff",
          "event": "OnBuffFinish",
          "orderedActionTypes": [
            "ShowHideActorAction"
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
                "ShowHideActorAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
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
      "useTimeDilationDt": true,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": []
    },
    {
      "buffId": "buff_chr_0033_camille_ult_henshin_end_2",
      "sourceFile": "buff_chr_0033_camille_ult_henshin_end_2.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 1.0,
          "blackboardKey": "duration",
          "levelValues": [
            0.35
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
          "key": "duration",
          "value": 0.35,
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
          "event": "OnBuffEnable",
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
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        },
        {
          "eventSource": "buff",
          "event": "OnBuffFinish",
          "orderedActionTypes": [
            "ShowHideActorAction"
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
                "ShowHideActorAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [],
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
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
      "useTimeDilationDt": true,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": []
    },
    {
      "buffId": "buff_chr_0033_camille_ult_henshin_state",
      "sourceFile": "buff_chr_0033_camille_ult_henshin_state.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 1.0,
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
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffEnable",
          "orderedActionTypes": [
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
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
                "ModifyDynamicBlackboard",
                "ModifyDynamicBlackboard"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [
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
                    "[0]"
                  ],
                  "serverActionIndex": 0,
                  "blackboardMutation": {
                    "key": "EntityBB_henshin",
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
                    "key": "EntityBB_ult_combo_count",
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
              "priority": 0
            }
          ],
          "finishAfterIgnited": false,
          "runtimeTargetGroupWrites": [],
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        },
        {
          "eventSource": "buff",
          "event": "DuringBuffEnable",
          "orderedActionTypes": [
            "ChangeSkillAction",
            "ShowHideActorAction",
            "ShowHideActorAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
            "EffectAction",
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
                "ChangeSkillAction",
                "ShowHideActorAction",
                "ShowHideActorAction",
                "EffectAction",
                "EffectAction",
                "EffectAction",
                "EffectAction",
                "EffectAction",
                "EffectAction",
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
          "contextBuffIdQueries": [],
          "collectedBuffReactionModifier": null
        },
        {
          "eventSource": "buff",
          "event": "OnBuffFinish",
          "orderedActionTypes": [
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "CreateBuffAction",
            "CreateBuffAction"
          ],
          "combatActions": [
            "CreateBuffAction"
          ],
          "damageUnits": [],
          "buffApplications": [
            {
              "actionIndex": 15,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0033_camille_ult_henshin_end_1",
                    "classification": null,
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
            },
            {
              "actionIndex": 16,
              "payload": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0033_camille_ult_henshin_end_2",
                    "classification": null,
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
            "buff_chr_0033_camille_ult_henshin_end_1",
            "buff_chr_0033_camille_ult_henshin_end_2"
          ],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "ModifyDynamicBlackboard",
                "ModifyDynamicBlackboard",
                "CreateBuffAction",
                "CreateBuffAction"
              ],
              "combatActions": [
                "CreateBuffAction",
                "CreateBuffAction"
              ],
              "buffApplications": [
                {
                  "actionIndex": 15,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0033_camille_ult_henshin_end_1",
                        "classification": null,
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
                },
                {
                  "actionIndex": 16,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0033_camille_ult_henshin_end_2",
                        "classification": null,
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
                  "actionType": "ModifyDynamicBlackboard",
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
                  "serverActionIndex": 13,
                  "blackboardMutation": {
                    "key": "EntityBB_henshin",
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
                },
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
                  "serverActionIndex": 14,
                  "blackboardMutation": {
                    "key": "EntityBB_ult_combo_count",
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
                  "serverActionIndex": 15,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0033_camille_ult_henshin_end_1",
                        "classification": null,
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
                  "serverActionIndex": 16,
                  "legacyBuffFinish": null,
                  "skillCooldownAdjustment": null,
                  "buffIgnite": null,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0033_camille_ult_henshin_end_2",
                        "classification": null,
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
      "skillReplacements": [
        {
          "eventSource": "buff",
          "event": "DuringBuffEnable",
          "actionIndex": 2,
          "skillSource": {
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
          "skillSlot": "NormalSkill",
          "targetSkillId": "chr_0033_camille_normal_skill_2",
          "overrideCacheTime": false,
          "cacheTime": {
            "value": 0.1,
            "blackboardKey": null,
            "levelValues": null
          },
          "lifeTimeType": "FinishByAction",
          "duration": {
            "value": 10.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "inheritOriginSkillCooldownProgress": false,
          "specificRevertedSkillId": false,
          "revertedSkillId": ""
        }
      ],
      "runtimeSkillSlotReplacements": [],
      "attributeModifiersConverted": false,
      "useTimeDilationDt": false,
      "onlyUseSelfTimeDilation": false,
      "shields": [],
      "sustainedProtections": [],
      "animationEndBuffApplications": [],
      "projectileLaunches": [],
      "presentationOnlySwitchActionIndexes": []
    },
    {
      "buffId": "buff_chr_0033_camille_ult_hit",
      "sourceFile": "buff_chr_0033_camille_ult_hit.json",
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
        "stackingType": "Unique",
        "stackingKey": "NormalSkillCtrl",
        "priority": {
          "value": 1.0,
          "blackboardKey": null,
          "levelValues": null
        },
        "negatePriority": false,
        "maxStackCount": {
          "value": 3.0,
          "blackboardKey": "max_stack",
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
      "presentationOnlySwitchActionIndexes": []
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
      "presentationOnlySwitchActionIndexes": []
    },
    {
      "buffId": "buff_common_full_immune",
      "sourceFile": "buff_common_full_immune.json",
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
        -1706530655,
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
      "presentationOnlySwitchActionIndexes": []
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
      "presentationOnlySwitchActionIndexes": []
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
      "presentationOnlySwitchActionIndexes": []
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
      "presentationOnlySwitchActionIndexes": []
    }
  ],
  "skills": [
    {
      "key": "basicAttack1",
      "skillId": "chr_0033_camille_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0033_camille_attack1.json",
      "timelineBlockFrames": 12,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 5,
      "allowNextWindows": [
        {
          "startFrame": 12,
          "endFrame": 29,
          "skillIds": [
            "chr_0033_camille_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 29,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0033_camille_attack2",
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
          "endFrame": 3,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 118,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 6,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 12,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 6,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 12,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 13,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
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
        },
        {
          "startFrame": 0,
          "endFrame": 118,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 32,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 38,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 32,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 5,
          "endFrame": 34,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 6,
          "endFrame": 23,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 4,
          "endFrame": 6,
          "actionIndex": 5,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_1",
                "levelValues": [
                  0.125,
                  0.138,
                  0.15,
                  0.163,
                  0.175,
                  0.188,
                  0.2,
                  0.213,
                  0.225,
                  0.241,
                  0.259,
                  0.281
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
          "startFrame": 10,
          "endFrame": 12,
          "actionIndex": 12,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.125,
                  0.138,
                  0.15,
                  0.163,
                  0.175,
                  0.188,
                  0.2,
                  0.213,
                  0.225,
                  0.241,
                  0.259,
                  0.281
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
          "startFrame": 4,
          "endFrame": 6,
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
          "startFrame": 10,
          "endFrame": 12,
          "actionIndex": 14,
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
              "serverActionIndex": 16,
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
          "atk_scale_1": [
            0.125,
            0.138,
            0.15,
            0.163,
            0.175,
            0.188,
            0.2,
            0.213,
            0.225,
            0.241,
            0.259,
            0.281
          ],
          "atk_scale_2": [
            0.125,
            0.138,
            0.15,
            0.163,
            0.175,
            0.188,
            0.2,
            0.213,
            0.225,
            0.241,
            0.259,
            0.281
          ],
          "display_atk_scale": [
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
          "key": "atk_scale_1",
          "value": 0.2,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale_1",
        "atk_scale_2"
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
          "key": "atk_scale_1",
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
          "startFrame": 4,
          "endFrame": 6,
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
          "startFrame": 10,
          "endFrame": 12,
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
          "startFrame": 4,
          "endFrame": 6,
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
          "startFrame": 10,
          "endFrame": 12,
          "actionIndex": 14,
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
              "serverActionIndex": 16,
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
      "key": "basicAttack2",
      "skillId": "chr_0033_camille_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0033_camille_attack2.json",
      "timelineBlockFrames": 15,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 10,
      "allowNextWindows": [
        {
          "startFrame": 15,
          "endFrame": 34,
          "skillIds": [
            "chr_0033_camille_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 34,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0033_camille_attack3",
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
          "endFrame": 124,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 12,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
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
          "startFrame": 14,
          "endFrame": 16,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 16,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 19,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 57,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 57,
          "endFrame": 61,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 61,
          "endFrame": 124,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 34,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 34,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 9,
          "endFrame": 38,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 42,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 42,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 83,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 22,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 7,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_1",
                "levelValues": [
                  0.1,
                  0.11,
                  0.12,
                  0.13,
                  0.14,
                  0.15,
                  0.16,
                  0.17,
                  0.18,
                  0.193,
                  0.208,
                  0.225
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
          "startFrame": 14,
          "endFrame": 16,
          "actionIndex": 15,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.1,
                  0.11,
                  0.12,
                  0.13,
                  0.14,
                  0.15,
                  0.16,
                  0.17,
                  0.18,
                  0.193,
                  0.208,
                  0.225
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
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 10,
          "endFrame": 11,
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
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
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
          "startFrame": 14,
          "endFrame": 16,
          "actionIndex": 17,
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
              "actionType": "ObtainCostAction",
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
          "atk_scale_1": [
            0.1,
            0.11,
            0.12,
            0.13,
            0.14,
            0.15,
            0.16,
            0.17,
            0.18,
            0.193,
            0.208,
            0.225
          ],
          "atk_scale_2": [
            0.1,
            0.11,
            0.12,
            0.13,
            0.14,
            0.15,
            0.16,
            0.17,
            0.18,
            0.193,
            0.208,
            0.225
          ],
          "display_atk_scale": [
            0.2,
            0.22,
            0.24,
            0.26,
            0.28,
            0.3,
            0.32,
            0.34,
            0.36,
            0.385,
            0.415,
            0.45
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
          "key": "atk_scale_1",
          "value": 0.2,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2",
          "value": 0.2,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale_1",
        "atk_scale_2"
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
          "key": "atk_scale_1",
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
          "endFrame": 11,
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
          "endFrame": 16,
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
          "startFrame": 10,
          "endFrame": 11,
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
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
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
          "startFrame": 14,
          "endFrame": 16,
          "actionIndex": 17,
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
              "actionType": "ObtainCostAction",
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
      "key": "basicAttack3",
      "skillId": "chr_0033_camille_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0033_camille_attack3.json",
      "timelineBlockFrames": 13,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 7,
      "allowNextWindows": [
        {
          "startFrame": 13,
          "endFrame": 30,
          "skillIds": [
            "chr_0033_camille_attack4"
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
              "skillId": "chr_0033_camille_attack4",
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
          "endFrame": 130,
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
          "endFrame": 130,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 6,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "AddDynamicCcsAction"
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
          "startFrame": 8,
          "endFrame": 9,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
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
          "startFrame": 12,
          "endFrame": 13,
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
          "startFrame": 14,
          "endFrame": 15,
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
          "startFrame": 20,
          "endFrame": 21,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
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
          "startFrame": 7,
          "endFrame": 7,
          "actionTypes": [
            "DamageAction",
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
          "endFrame": 8,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction"
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
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction"
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
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 19,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 33,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 33,
          "endFrame": 130,
          "actionTypes": [
            "ModifyWeaponMountPoint"
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
          "startFrame": 13,
          "endFrame": 30,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 130,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 8,
          "endFrame": 37,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 49,
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
          "endFrame": 59,
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
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionIndex": 22,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.075,
                  0.083,
                  0.09,
                  0.098,
                  0.105,
                  0.113,
                  0.12,
                  0.128,
                  0.135,
                  0.144,
                  0.156,
                  0.169
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 20
        },
        {
          "startFrame": 8,
          "endFrame": 8,
          "actionIndex": 22,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.075,
                  0.083,
                  0.09,
                  0.098,
                  0.105,
                  0.113,
                  0.12,
                  0.128,
                  0.135,
                  0.144,
                  0.156,
                  0.169
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
        },
        {
          "startFrame": 9,
          "endFrame": 9,
          "actionIndex": 22,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.075,
                  0.083,
                  0.09,
                  0.098,
                  0.105,
                  0.113,
                  0.12,
                  0.128,
                  0.135,
                  0.144,
                  0.156,
                  0.169
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 22
        },
        {
          "startFrame": 10,
          "endFrame": 10,
          "actionIndex": 22,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.075,
                  0.083,
                  0.09,
                  0.098,
                  0.105,
                  0.113,
                  0.12,
                  0.128,
                  0.135,
                  0.144,
                  0.156,
                  0.169
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 23
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[20]",
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
                "timelineActions[20]",
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
          "startFrame": 8,
          "endFrame": 8,
          "actionIndex": 24,
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
              "actionType": "ObtainCostAction",
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
          "startFrame": 9,
          "endFrame": 9,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[22]",
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
                "timelineActions[22]",
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
          "startFrame": 10,
          "endFrame": 10,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[23]",
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
                "timelineActions[23]",
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
            0.075,
            0.083,
            0.09,
            0.098,
            0.105,
            0.113,
            0.12,
            0.128,
            0.135,
            0.144,
            0.156,
            0.169
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
          "value": 0.2,
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
          "startFrame": 8,
          "endFrame": 9,
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
          "startFrame": 9,
          "endFrame": 10,
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
          "startFrame": 10,
          "endFrame": 11,
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
          "startFrame": 11,
          "endFrame": 12,
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
          "startFrame": 12,
          "endFrame": 13,
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
          "startFrame": 13,
          "endFrame": 14,
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
          "startFrame": 14,
          "endFrame": 15,
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
          "startFrame": 15,
          "endFrame": 16,
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
        },
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[14]",
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
          "startFrame": 17,
          "endFrame": 18,
          "actionIndex": 16,
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
        },
        {
          "startFrame": 18,
          "endFrame": 19,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[16]",
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
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[17]",
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
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 19,
          "actionPath": [
            "timelineActions[18]",
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
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[19]",
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
          "endFrame": 7,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[20]",
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
                "timelineActions[20]",
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
          "startFrame": 8,
          "endFrame": 8,
          "actionIndex": 24,
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
              "actionType": "ObtainCostAction",
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
          "startFrame": 9,
          "endFrame": 9,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[22]",
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
                "timelineActions[22]",
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
          "startFrame": 10,
          "endFrame": 10,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[23]",
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
                "timelineActions[23]",
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
      "skillId": "chr_0033_camille_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0033_camille_attack4.json",
      "timelineBlockFrames": 22,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 12,
      "allowNextWindows": [
        {
          "startFrame": 22,
          "endFrame": 34,
          "skillIds": [
            "chr_0033_camille_attack5"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 34,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0033_camille_attack5",
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
          "endFrame": 187,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 4,
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
          "endFrame": 33,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 10,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 31,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 15,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 15,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "HitStopAction"
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
          "startFrame": 13,
          "endFrame": 19,
          "actionTypes": [
            "ShowHideActorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 34,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 34,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 148,
          "endFrame": 187,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 148,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 5,
          "endFrame": 34,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 49,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 62,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 62,
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
          "startFrame": 20,
          "endFrame": 30,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 30,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 148,
          "endFrame": 224,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 19,
          "endFrame": 69,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 20,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 11,
          "endFrame": 15,
          "actionIndex": 9,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_1",
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
                  0.385,
                  0.415,
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
          "sequenceIndex": 8
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 11,
          "endFrame": 15,
          "actionIndex": 11,
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
      "projectileLaunches": [
        {
          "launchFrame": 20,
          "projectileId": "projectile_chr_0033_camille_attack4",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0033_camille_attack4_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 20,
          "actionOrder": [
            7
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0033_camille_attack4",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0033_camille_attack4_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0033_camille_attack4_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.02,
                  0.022,
                  0.024,
                  0.026,
                  0.028,
                  0.03,
                  0.032,
                  0.034,
                  0.036,
                  0.039,
                  0.042,
                  0.045
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            },
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.02,
                  0.022,
                  0.024,
                  0.026,
                  0.028,
                  0.03,
                  0.032,
                  0.034,
                  0.036,
                  0.039,
                  0.042,
                  0.045
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            },
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.02,
                  0.022,
                  0.024,
                  0.026,
                  0.028,
                  0.03,
                  0.032,
                  0.034,
                  0.036,
                  0.039,
                  0.042,
                  0.045
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            },
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.02,
                  0.022,
                  0.024,
                  0.026,
                  0.028,
                  0.03,
                  0.032,
                  0.034,
                  0.036,
                  0.039,
                  0.042,
                  0.045
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            },
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.02,
                  0.022,
                  0.024,
                  0.026,
                  0.028,
                  0.03,
                  0.032,
                  0.034,
                  0.036,
                  0.039,
                  0.042,
                  0.045
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            },
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.02,
                  0.022,
                  0.024,
                  0.026,
                  0.028,
                  0.03,
                  0.032,
                  0.034,
                  0.036,
                  0.039,
                  0.042,
                  0.045
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 128
            },
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.02,
                  0.022,
                  0.024,
                  0.026,
                  0.028,
                  0.03,
                  0.032,
                  0.034,
                  0.036,
                  0.039,
                  0.042,
                  0.045
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
              "endFrame": 1,
              "actionIndex": 7,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 40.0,
                    "blackboardKey": "atk_scale_2",
                    "levelValues": [
                      0.02,
                      0.022,
                      0.024,
                      0.026,
                      0.028,
                      0.03,
                      0.032,
                      0.034,
                      0.036,
                      0.039,
                      0.042,
                      0.045
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
              "startFrame": 2,
              "endFrame": 3,
              "actionIndex": 12,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 40.0,
                    "blackboardKey": "atk_scale_2",
                    "levelValues": [
                      0.02,
                      0.022,
                      0.024,
                      0.026,
                      0.028,
                      0.03,
                      0.032,
                      0.034,
                      0.036,
                      0.039,
                      0.042,
                      0.045
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
            },
            {
              "startFrame": 4,
              "endFrame": 5,
              "actionIndex": 17,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 40.0,
                    "blackboardKey": "atk_scale_2",
                    "levelValues": [
                      0.02,
                      0.022,
                      0.024,
                      0.026,
                      0.028,
                      0.03,
                      0.032,
                      0.034,
                      0.036,
                      0.039,
                      0.042,
                      0.045
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 128
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 9
            },
            {
              "startFrame": 6,
              "endFrame": 7,
              "actionIndex": 22,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 40.0,
                    "blackboardKey": "atk_scale_2",
                    "levelValues": [
                      0.02,
                      0.022,
                      0.024,
                      0.026,
                      0.028,
                      0.03,
                      0.032,
                      0.034,
                      0.036,
                      0.039,
                      0.042,
                      0.045
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
              "startFrame": 8,
              "endFrame": 9,
              "actionIndex": 27,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 40.0,
                    "blackboardKey": "atk_scale_2",
                    "levelValues": [
                      0.02,
                      0.022,
                      0.024,
                      0.026,
                      0.028,
                      0.03,
                      0.032,
                      0.034,
                      0.036,
                      0.039,
                      0.042,
                      0.045
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
            },
            {
              "startFrame": 10,
              "endFrame": 11,
              "actionIndex": 32,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 40.0,
                    "blackboardKey": "atk_scale_2",
                    "levelValues": [
                      0.02,
                      0.022,
                      0.024,
                      0.026,
                      0.028,
                      0.03,
                      0.032,
                      0.034,
                      0.036,
                      0.039,
                      0.042,
                      0.045
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 128
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 12
            },
            {
              "startFrame": 12,
              "endFrame": 13,
              "actionIndex": 37,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 40.0,
                    "blackboardKey": "atk_scale_2",
                    "levelValues": [
                      0.02,
                      0.022,
                      0.024,
                      0.026,
                      0.028,
                      0.03,
                      0.032,
                      0.034,
                      0.036,
                      0.039,
                      0.042,
                      0.045
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 128
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 13
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
          "atk_scale_1": [
            0.2,
            0.22,
            0.24,
            0.26,
            0.28,
            0.3,
            0.32,
            0.34,
            0.36,
            0.385,
            0.415,
            0.45
          ],
          "atk_scale_2": [
            0.02,
            0.022,
            0.024,
            0.026,
            0.028,
            0.03,
            0.032,
            0.034,
            0.036,
            0.039,
            0.042,
            0.045
          ],
          "display_atk_scale": [
            0.34,
            0.374,
            0.408,
            0.442,
            0.476,
            0.51,
            0.544,
            0.578,
            0.612,
            0.655,
            0.706,
            0.765
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
          "key": "atk_scale_1",
          "value": 0.2,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2",
          "value": 0.2,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale_1"
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
          "key": "atk_scale_1",
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
        }
      ],
      "unresolvedCombatActions": [
        "DamageAction",
        "IfElseAction",
        "LaunchProjectile",
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
          "startFrame": 11,
          "endFrame": 15,
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
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 11,
          "endFrame": 15,
          "actionIndex": 11,
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
      "key": "basicAttack5",
      "skillId": "chr_0033_camille_attack5",
      "skillType": "basicAttack",
      "sourceFile": "chr_0033_camille_attack5.json",
      "timelineBlockFrames": 42,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 21,
      "allowNextWindows": [],
      "inputCacheWindows": [],
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
          "endFrame": 4,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 21,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 55,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 55,
          "endFrame": 171,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 14,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 17,
          "actionTypes": [
            "AddDynamicCcsAction"
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
          "startFrame": 21,
          "endFrame": 33,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 23,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 23,
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
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 15,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 19,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 48,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 171,
          "actionTypes": [
            "ModifyWeaponMountPoint"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 28,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 47,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 47,
          "endFrame": 171,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 76,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 76,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 8,
          "endFrame": 67,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 97,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 46,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 76,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 124,
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
          "startFrame": 48,
          "endFrame": 137,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 20,
          "endFrame": 81,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 73,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 30,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 21,
          "endFrame": 23,
          "actionIndex": 13,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 40.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.5,
                  0.55,
                  0.6,
                  0.65,
                  0.7,
                  0.75,
                  0.8,
                  0.85,
                  0.9,
                  0.96,
                  1.04,
                  1.13
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
          "sequenceIndex": 10
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 21,
          "endFrame": 23,
          "actionIndex": 15,
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
            0.5,
            0.55,
            0.6,
            0.65,
            0.7,
            0.75,
            0.8,
            0.85,
            0.9,
            0.96,
            1.04,
            1.13
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
          "value": 0.2,
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
          "endFrame": 23,
          "actionIndex": 12,
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
          "startFrame": 21,
          "endFrame": 23,
          "actionIndex": 15,
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
      "timeDilations": [
        {
          "startFrame": 12,
          "endFrame": 15,
          "actionIndex": 21,
          "kind": "normal",
          "priority": -361293424,
          "scope": "entity",
          "slot": -1855252810,
          "duration": {
            "value": 0.08,
            "blackboardKey": null,
            "levelValues": null
          },
          "namedCurve": null,
          "inlineCurve": [
            {
              "time": 0.0,
              "value": 0.2,
              "inTangent": 0.6,
              "outTangent": 0.6,
              "weightedMode": 0,
              "inWeight": 0.0,
              "outWeight": 0.333333343
            },
            {
              "time": 1.0,
              "value": 0.8,
              "inTangent": 0.6,
              "outTangent": 0.6,
              "weightedMode": 0,
              "inWeight": 0.333333343,
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
      "key": "finisher",
      "skillId": "chr_0033_camille_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0033_camille_power_attack.json",
      "timelineBlockFrames": 39,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 4,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 39,
          "endFrame": 46,
          "skillIds": [
            "chr_0033_camille_normal_skill",
            "chr_0033_camille_normal_skill_2",
            "chr_0033_camille_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 46,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0033_camille_normal_skill",
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
              "skillId": "chr_0033_camille_normal_skill_2",
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
              "skillId": "chr_0033_camille_combo_skill",
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
          "endFrame": 230,
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
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 14,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 25,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 8,
          "actionTypes": [
            "CheckEntityNum",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 38,
          "actionTypes": [
            "CheckEntityNum",
            "LaunchUpwardAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 44,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "BlowOffAction",
            "TimeDilationAction",
            "GainBreakingAttackAtb"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 48,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 38,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 4,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 5,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 9,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 4,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 8,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 38,
          "actionTypes": [
            "BoneAttachAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 43,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 50,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 7,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 36,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 42,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 42,
          "endFrame": 59,
          "actionTypes": [
            "AddDynamicCcsAction"
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
          "startFrame": 0,
          "endFrame": 45,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 59,
          "actionTypes": [
            "OverrideCameraFollowAction",
            "LockCameraAimAction",
            "Selector"
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
          "endFrame": 46,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 39,
          "endFrame": 46,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 36,
          "actionTypes": [
            "ShowHideActorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 195,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 195,
          "endFrame": 230,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 74,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 131,
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
          "startFrame": 20,
          "endFrame": 43,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 5,
          "endFrame": 94,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 99,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 106,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 106,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 84,
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
        },
        {
          "startFrame": 44,
          "endFrame": 82,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 196,
          "endFrame": 272,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 43,
          "endFrame": 44,
          "actionIndex": 17,
          "damageUnits": [
            {
              "damageType": "Fire",
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
                "value": 0.65,
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
      "conditionalActions": [
        {
          "startFrame": 43,
          "endFrame": 44,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[7]",
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
              "actionType": "TimeDilationAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 21,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "timeDilation": {
                "startFrame": 43,
                "endFrame": 44,
                "actionIndex": 21,
                "kind": "normal",
                "priority": -2059842104,
                "scope": "entity",
                "slot": 257664179,
                "duration": {
                  "value": 0.3,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "namedCurve": null,
                "inlineCurve": [
                  {
                    "time": 0.0,
                    "value": 1.5,
                    "inTangent": 0.0,
                    "outTangent": 0.0,
                    "weightedMode": 0,
                    "inWeight": 0.0,
                    "outWeight": 0.0
                  },
                  {
                    "time": 1.0,
                    "value": 1.5,
                    "inTangent": 0.0,
                    "outTangent": 0.0,
                    "weightedMode": 0,
                    "inWeight": 0.0,
                    "outWeight": 0.0
                  }
                ],
                "finishByAction": false,
                "ignoredTargets": [],
                "targets": [
                  "enemy"
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
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 40,
          "endFrame": 43,
          "actionIndex": 35,
          "actionPath": [
            "timelineActions[18]",
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
              "actionType": "TimeDilationAction",
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
              "serverActionIndex": 37,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "timeDilation": {
                "startFrame": 40,
                "endFrame": 43,
                "actionIndex": 37,
                "kind": "normal",
                "priority": 513129183,
                "scope": "entity",
                "slot": 257664179,
                "duration": {
                  "value": 0.1,
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
                    "outWeight": 0.0
                  },
                  {
                    "time": 1.0,
                    "value": 1.0,
                    "inTangent": 2.0,
                    "outTangent": 2.0,
                    "weightedMode": 0,
                    "inWeight": 0.0,
                    "outWeight": 0.0
                  }
                ],
                "finishByAction": false,
                "ignoredTargets": [],
                "targets": [
                  "enemy",
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
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 46,
          "endFrame": 50,
          "actionIndex": 38,
          "actionPath": [
            "timelineActions[19]",
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
              "actionType": "TimeDilationAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[19]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 40,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "timeDilation": {
                "startFrame": 46,
                "endFrame": 50,
                "actionIndex": 40,
                "kind": "normal",
                "priority": 513129183,
                "scope": "global",
                "slot": 257664179,
                "duration": {
                  "value": 0.25,
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
                    "outWeight": 0.0
                  },
                  {
                    "time": 1.0,
                    "value": 1.0,
                    "inTangent": 2.0,
                    "outTangent": 2.0,
                    "weightedMode": 0,
                    "inWeight": 0.0,
                    "outWeight": 0.0
                  }
                ],
                "finishByAction": false,
                "ignoredTargets": [],
                "targets": [
                  "enemy",
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
          "endFrame": 50,
          "actionIndex": 57,
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
          "sequenceIndex": 28,
          "autoFinishByAction": true
        },
        {
          "startFrame": 0,
          "endFrame": 46,
          "actionIndex": 58,
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
          "sequenceIndex": 29,
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
          "launchFrame": 3,
          "projectileId": "projectile_chr_0033_camille_power_attack",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0033_camille_power_attack_projhit_witheff"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 4,
          "projectileId": "projectile_chr_0033_camille_power_attack_R_blue",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0033_camille_power_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 6,
          "projectileId": "projectile_chr_0033_camille_power_attack_R_red",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0033_camille_power_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 8,
          "projectileId": "projectile_chr_0033_camille_power_attack_R_blue",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0033_camille_power_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 3,
          "projectileId": "projectile_chr_0033_camille_power_attack_L_red",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0033_camille_power_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 5,
          "projectileId": "projectile_chr_0033_camille_power_attack_L_blue",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0033_camille_power_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 7,
          "projectileId": "projectile_chr_0033_camille_power_attack_L_red",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0033_camille_power_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 3,
          "actionOrder": [
            25
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0033_camille_power_attack",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0033_camille_power_attack_projhit_witheff",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0033_camille_power_attack_projhit_witheff.json",
          "damageUnits": [
            {
              "damageType": "Fire",
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
                "value": 0.05,
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
                  "damageType": "Fire",
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
                    "value": 0.05,
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
        },
        {
          "launchFrame": 4,
          "actionOrder": [
            26
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0033_camille_power_attack_R_blue",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0033_camille_power_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0033_camille_power_attack_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
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
                "value": 0.05,
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
                  "damageType": "Fire",
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
                    "value": 0.05,
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
        },
        {
          "launchFrame": 6,
          "actionOrder": [
            27
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0033_camille_power_attack_R_red",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0033_camille_power_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0033_camille_power_attack_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
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
                "value": 0.05,
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
                  "damageType": "Fire",
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
                    "value": 0.05,
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
        },
        {
          "launchFrame": 8,
          "actionOrder": [
            28
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0033_camille_power_attack_R_blue",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0033_camille_power_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0033_camille_power_attack_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
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
                "value": 0.05,
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
                  "damageType": "Fire",
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
                    "value": 0.05,
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
        },
        {
          "launchFrame": 3,
          "actionOrder": [
            29
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0033_camille_power_attack_L_red",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0033_camille_power_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0033_camille_power_attack_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
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
                "value": 0.05,
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
                  "damageType": "Fire",
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
                    "value": 0.05,
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
        },
        {
          "launchFrame": 5,
          "actionOrder": [
            30
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0033_camille_power_attack_L_blue",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0033_camille_power_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0033_camille_power_attack_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
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
                "value": 0.05,
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
                  "damageType": "Fire",
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
                    "value": 0.05,
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
        },
        {
          "launchFrame": 7,
          "actionOrder": [
            31
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0033_camille_power_attack_L_red",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0033_camille_power_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0033_camille_power_attack_projhit.json",
          "damageUnits": [
            {
              "damageType": "Fire",
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
                "value": 0.05,
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
                  "damageType": "Fire",
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
                    "value": 0.05,
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
          ],
          "display_atk_scale": [
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
          "value": 1.0,
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
        "CreateBuffAction",
        "DamageAction",
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 38,
          "endFrame": 39,
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[24]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "camera_point_2",
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
          "startFrame": 43,
          "endFrame": 44,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[7]",
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
              "actionType": "TimeDilationAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 21,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "timeDilation": {
                "startFrame": 43,
                "endFrame": 44,
                "actionIndex": 21,
                "kind": "normal",
                "priority": -2059842104,
                "scope": "entity",
                "slot": 257664179,
                "duration": {
                  "value": 0.3,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "namedCurve": null,
                "inlineCurve": [
                  {
                    "time": 0.0,
                    "value": 1.5,
                    "inTangent": 0.0,
                    "outTangent": 0.0,
                    "weightedMode": 0,
                    "inWeight": 0.0,
                    "outWeight": 0.0
                  },
                  {
                    "time": 1.0,
                    "value": 1.5,
                    "inTangent": 0.0,
                    "outTangent": 0.0,
                    "weightedMode": 0,
                    "inWeight": 0.0,
                    "outWeight": 0.0
                  }
                ],
                "finishByAction": false,
                "ignoredTargets": [],
                "targets": [
                  "enemy"
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
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 40,
          "endFrame": 43,
          "actionIndex": 35,
          "actionPath": [
            "timelineActions[18]",
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
              "actionType": "TimeDilationAction",
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
              "serverActionIndex": 37,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "timeDilation": {
                "startFrame": 40,
                "endFrame": 43,
                "actionIndex": 37,
                "kind": "normal",
                "priority": 513129183,
                "scope": "entity",
                "slot": 257664179,
                "duration": {
                  "value": 0.1,
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
                    "outWeight": 0.0
                  },
                  {
                    "time": 1.0,
                    "value": 1.0,
                    "inTangent": 2.0,
                    "outTangent": 2.0,
                    "weightedMode": 0,
                    "inWeight": 0.0,
                    "outWeight": 0.0
                  }
                ],
                "finishByAction": false,
                "ignoredTargets": [],
                "targets": [
                  "enemy",
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
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 46,
          "endFrame": 50,
          "actionIndex": 38,
          "actionPath": [
            "timelineActions[19]",
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
              "actionType": "TimeDilationAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[19]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 40,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "timeDilation": {
                "startFrame": 46,
                "endFrame": 50,
                "actionIndex": 40,
                "kind": "normal",
                "priority": 513129183,
                "scope": "global",
                "slot": 257664179,
                "duration": {
                  "value": 0.25,
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
                    "outWeight": 0.0
                  },
                  {
                    "time": 1.0,
                    "value": 1.0,
                    "inTangent": 2.0,
                    "outTangent": 2.0,
                    "weightedMode": 0,
                    "inWeight": 0.0,
                    "outWeight": 0.0
                  }
                ],
                "finishByAction": false,
                "ignoredTargets": [],
                "targets": [
                  "enemy",
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
      "skillId": "chr_0033_camille_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0033_camille_plunging_attack_end.json",
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
          "endFrame": 149,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 149,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 3,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 3,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 3,
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
          "endFrame": 149,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 44,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 61,
          "endFrame": 102,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 1,
          "endFrame": 3,
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
      "conditionalActions": [
        {
          "startFrame": 1,
          "endFrame": 3,
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
          ],
          "display_atk_scale": [
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
          "startFrame": 1,
          "endFrame": 3,
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
          "startFrame": 1,
          "endFrame": 3,
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
      "skillId": "chr_0033_camille_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0033_camille_normal_skill.json",
      "timelineBlockFrames": 18,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "Atb",
      "costValue": 40.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 18,
          "endFrame": 34,
          "skillIds": [
            "chr_0033_camille_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 34,
          "mappings": [
            {
              "cmdType": "ComboSkill",
              "skillId": "chr_0033_camille_combo_skill",
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
          "endFrame": 192,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
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
          "endFrame": 1,
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
          "endFrame": 26,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 34,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
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
          "endFrame": 34,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 34,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 158,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 158,
          "endFrame": 192,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "endFrame": 59,
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
          "startFrame": 0,
          "endFrame": 89,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 95,
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
          "startFrame": 0,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 158,
          "endFrame": 232,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 114,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 84,
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
          "projectileId": "projectile_chr_0033_camille_normal_skill",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0033_camille_normal_skill_projhit"
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
            10
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0033_camille_normal_skill",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0033_camille_normal_skill_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0033_camille_normal_skill_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 2,
              "actionType": "SpawnAbilityEntity",
              "sourceId": "abilityentity_chr_0033_camille_normal_skill:chr_0033_camille_normal_skill_abilityrange_first",
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
                "SpellInfliction"
              ],
              "buffSourceContextKey": null,
              "sequenceIndex": 0,
              "autoFinishByAction": null
            },
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 4,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0033_camille_normal_skill_bateffect",
              "classification": null,
              "targetSource": "Context",
              "targetGroupKey": "Camille_Bat",
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
              "endFrame": 1,
              "actionIndex": 11,
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
              "sequenceIndex": 0,
              "autoFinishByAction": false
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
                10,
                2
              ],
              "abilityEntityId": "abilityentity_chr_0033_camille_normal_skill",
              "skillId": "chr_0033_camille_normal_skill_abilityrange_first",
              "sourceFile": "chr_0033_camille_normal_skill_abilityrange_first.json",
              "entityBlackboardAssignments": [
                {
                  "targetKey": "EntityBB_bat_duration",
                  "valueType": "Numeric",
                  "numericValue": 0.0,
                  "stringValue": "",
                  "useDirectValue": false,
                  "inputValueKey": "bat_duration"
                },
                {
                  "targetKey": "EntityBB_bat_atk_scale",
                  "valueType": "Numeric",
                  "numericValue": 0.0,
                  "stringValue": "",
                  "useDirectValue": false,
                  "inputValueKey": "bat_atk_scale"
                },
                {
                  "targetKey": "EntityBB_atk_scale",
                  "valueType": "Numeric",
                  "numericValue": 0.0,
                  "stringValue": "",
                  "useDirectValue": false,
                  "inputValueKey": "atk_scale"
                },
                {
                  "targetKey": "EntityBB_poise",
                  "valueType": "Numeric",
                  "numericValue": 0.0,
                  "stringValue": "",
                  "useDirectValue": false,
                  "inputValueKey": "poise"
                },
                {
                  "targetKey": "EntityBB_weak_scale",
                  "valueType": "Numeric",
                  "numericValue": 0.0,
                  "stringValue": "",
                  "useDirectValue": false,
                  "inputValueKey": "weak_scale"
                },
                {
                  "targetKey": "EntityBB_vulnerable_scale",
                  "valueType": "Numeric",
                  "numericValue": 0.0,
                  "stringValue": "",
                  "useDirectValue": false,
                  "inputValueKey": "vulnerable_scale"
                }
              ],
              "spawnPayload": {
                "abilityEntityId": "abilityentity_chr_0033_camille_normal_skill",
                "skillId": "chr_0033_camille_normal_skill_abilityrange_first",
                "entityBlackboardAssignments": [
                  {
                    "targetKey": "EntityBB_bat_duration",
                    "valueType": "Numeric",
                    "numericValue": 0.0,
                    "stringValue": "",
                    "useDirectValue": false,
                    "inputValueKey": "bat_duration"
                  },
                  {
                    "targetKey": "EntityBB_bat_atk_scale",
                    "valueType": "Numeric",
                    "numericValue": 0.0,
                    "stringValue": "",
                    "useDirectValue": false,
                    "inputValueKey": "bat_atk_scale"
                  },
                  {
                    "targetKey": "EntityBB_atk_scale",
                    "valueType": "Numeric",
                    "numericValue": 0.0,
                    "stringValue": "",
                    "useDirectValue": false,
                    "inputValueKey": "atk_scale"
                  },
                  {
                    "targetKey": "EntityBB_poise",
                    "valueType": "Numeric",
                    "numericValue": 0.0,
                    "stringValue": "",
                    "useDirectValue": false,
                    "inputValueKey": "poise"
                  },
                  {
                    "targetKey": "EntityBB_weak_scale",
                    "valueType": "Numeric",
                    "numericValue": 0.0,
                    "stringValue": "",
                    "useDirectValue": false,
                    "inputValueKey": "weak_scale"
                  },
                  {
                    "targetKey": "EntityBB_vulnerable_scale",
                    "valueType": "Numeric",
                    "numericValue": 0.0,
                    "stringValue": "",
                    "useDirectValue": false,
                    "inputValueKey": "vulnerable_scale"
                  }
                ],
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
                "saveToContextKey": "Camille_Bat",
                "dieWhenSourceDies": false,
                "dieOnEnd": false
              },
              "directDamageHits": [
                {
                  "startFrame": 0,
                  "endFrame": 1,
                  "actionIndex": 6,
                  "damageUnits": [
                    {
                      "damageType": "Fire",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 0.0,
                        "blackboardKey": "EntityBB_atk_scale",
                        "levelValues": [
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
                        "blackboardKey": "EntityBB_poise",
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
              "intervalDamageHits": [],
              "explicitFinishes": [],
              "timelineJumps": [],
              "conditionalActions": [],
              "inflictions": [
                {
                  "startFrame": 0,
                  "endFrame": 1,
                  "actionIndex": 5,
                  "element": "heat",
                  "isExtra": false,
                  "sequenceIndex": 5
                }
              ],
              "auxiliaryActions": [
                {
                  "startFrame": 0,
                  "endFrame": 36,
                  "actionIndex": 0,
                  "actionType": "CreateBuffAction",
                  "sourceId": "buff_common_full_immune",
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
                  "sequenceIndex": 0,
                  "autoFinishByAction": false
                },
                {
                  "startFrame": 0,
                  "endFrame": 2000,
                  "actionIndex": 1,
                  "actionType": "CreateBuffAction",
                  "sourceId": "buff_chr_0033_camille_normal_skill_weak",
                  "classification": null,
                  "targetSource": "Target",
                  "targetGroupKey": "",
                  "count": {
                    "value": 1.0,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "buffSource": "ActionSource",
                  "inheritSourceSkillCastInfo": true,
                  "blackboardAssignments": {
                    "weak_scale": {
                      "value": 0.0,
                      "blackboardKey": "EntityBB_weak_scale",
                      "levelValues": [
                        0.05,
                        0.05,
                        0.05,
                        0.055,
                        0.055,
                        0.055,
                        0.06,
                        0.06,
                        0.06,
                        0.065,
                        0.065,
                        0.07
                      ]
                    },
                    "vulnerable_scale": {
                      "value": 0.0,
                      "blackboardKey": "EntityBB_vulnerable_scale",
                      "levelValues": [
                        0.05,
                        0.05,
                        0.05,
                        0.055,
                        0.055,
                        0.055,
                        0.06,
                        0.06,
                        0.06,
                        0.065,
                        0.065,
                        0.07
                      ]
                    },
                    "duration": {
                      "value": 0.0,
                      "blackboardKey": "EntityBB_bat_duration",
                      "levelValues": [
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0
                      ]
                    }
                  },
                  "nestedCombatActions": [],
                  "buffSourceContextKey": "",
                  "sequenceIndex": 1,
                  "autoFinishByAction": true
                },
                {
                  "startFrame": 0,
                  "endFrame": 2000,
                  "actionIndex": 2,
                  "actionType": "CreateBuffAction",
                  "sourceId": "buff_chr_0033_camille_normal_skill_listen_target_dead",
                  "classification": null,
                  "targetSource": "Target",
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
                  "autoFinishByAction": true
                },
                {
                  "startFrame": 3,
                  "endFrame": 6,
                  "actionIndex": 3,
                  "actionType": "CreateBuffAction",
                  "sourceId": "buff_chr_0033_camille_normal_skill_bat_duration_icon",
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
                    "bat_duration": {
                      "value": 0.0,
                      "blackboardKey": "EntityBB_bat_duration",
                      "levelValues": [
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0,
                        45.0
                      ]
                    }
                  },
                  "nestedCombatActions": [],
                  "buffSourceContextKey": "",
                  "sequenceIndex": 3,
                  "autoFinishByAction": false
                }
              ],
              "resourceGains": [],
              "projectileLaunches": [],
              "projectileTriggeredSkills": [],
              "nestedAbilityEntityHits": [],
              "combatActions": [
                "CreateBuffAction",
                "DamageAction",
                "SpellInfliction"
              ],
              "cycleTruncated": false,
              "inheritsSourceBlackboard": true,
              "declaredBlackboard": [
                {
                  "key": "atk_scale",
                  "value": 0.1,
                  "isDynamic": false
                },
                {
                  "key": "obtain_count",
                  "value": 0.0,
                  "isDynamic": true
                },
                {
                  "key": "poise",
                  "value": 10.0,
                  "isDynamic": false
                },
                {
                  "key": "weak_scale",
                  "value": 0.2,
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
          "bat_atk_scale": [
            0.45,
            0.49,
            0.54,
            0.58,
            0.62,
            0.67,
            0.71,
            0.76,
            0.8,
            0.86,
            0.93,
            1.0
          ],
          "bat_duration": [
            45.0,
            45.0,
            45.0,
            45.0,
            45.0,
            45.0,
            45.0,
            45.0,
            45.0,
            45.0,
            45.0,
            45.0
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
          "vulnerable_scale": [
            0.05,
            0.05,
            0.05,
            0.055,
            0.055,
            0.055,
            0.06,
            0.06,
            0.06,
            0.065,
            0.065,
            0.07
          ],
          "weak_scale": [
            0.05,
            0.05,
            0.05,
            0.055,
            0.055,
            0.055,
            0.06,
            0.06,
            0.06,
            0.065,
            0.065,
            0.07
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
          "key": "atb_obtain",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_scale",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "bat_atk_scale",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "bat_duration",
          "value": 45.0,
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
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "vulnerable_scale",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "weak_scale",
          "value": 1.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "cam_angle",
        "input_angle",
        "select_radius"
      ],
      "blackboardProvenance": [
        {
          "key": "atb_obtain",
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
          "key": "bat_atk_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "bat_duration",
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
        },
        {
          "key": "vulnerable_scale",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "weak_scale",
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
          "startFrame": 0,
          "endFrame": 0,
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
          "endFrame": 0,
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
      "key": "comboSkill1",
      "skillId": "chr_0033_camille_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0033_camille_combo_skill.json",
      "timelineBlockFrames": 51,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 51,
          "endFrame": 63,
          "skillIds": [
            "chr_0033_camille_normal_skill",
            "chr_0033_camille_normal_skill_2"
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
              "skillId": "chr_0033_camille_normal_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": false,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.3,
                "blackboardKey": ""
              }
            },
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0033_camille_normal_skill_2",
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
          "endFrame": 191,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 37,
          "actionTypes": [
            "CheckEntityNum",
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 19,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 23,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 19,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
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
          "endFrame": 28,
          "actionTypes": [
            "MoveToAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 48,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
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
          "endFrame": 25,
          "actionTypes": [
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
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
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 45,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 102,
          "actionTypes": [
            "AddDynamicCcsAction"
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
          "startFrame": 20,
          "endFrame": 21,
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
          "startFrame": 28,
          "endFrame": 29,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 47,
          "endFrame": 48,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 49,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 50,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 19,
          "actionTypes": [
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 27,
          "actionTypes": [
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "LaunchUpwardAction",
            "HitStopAction",
            "CameraImpulseAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 47,
          "endFrame": 47,
          "actionTypes": [
            "InterruptAction",
            "IfElseAction",
            "FindTargetAction",
            "Selector",
            "Selector",
            "CreateBuffAction",
            "ComboAction",
            "DoOnceAction",
            "ObtainCostAction",
            "IfElseAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "HealAction",
            "Selector",
            "Selector",
            "MultiplyAttributeCalculation",
            "HitStopAction",
            "CameraImpulseAction",
            "AddDynamicCcsAction",
            "CompareFloat",
            "ObtainCostAction",
            "ModifyDynamicBlackboard",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "IfElseAction",
            "HealAction",
            "Selector",
            "Selector",
            "MultiplyAttributeCalculation",
            "HitStopAction",
            "CameraImpulseAction",
            "AddDynamicCcsAction",
            "CompareFloat",
            "ObtainCostAction",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 63,
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
          "startFrame": 51,
          "endFrame": 63,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 0,
          "endFrame": 191,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "endFrame": 44,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 91,
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
          "startFrame": 18,
          "endFrame": 47,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 55,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 54,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 73,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 42,
          "endFrame": 91,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 94,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 80,
          "endFrame": 109,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 44,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 62,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 24,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 19,
          "endFrame": 19,
          "actionIndex": 51,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale_1_1",
                "levelValues": [
                  0.27,
                  0.29,
                  0.32,
                  0.35,
                  0.37,
                  0.4,
                  0.43,
                  0.45,
                  0.48,
                  0.51,
                  0.55,
                  0.6
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 12288
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 25
        },
        {
          "startFrame": 27,
          "endFrame": 27,
          "actionIndex": 60,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale_1_2",
                "levelValues": [
                  0.27,
                  0.29,
                  0.32,
                  0.35,
                  0.37,
                  0.4,
                  0.43,
                  0.45,
                  0.48,
                  0.51,
                  0.55,
                  0.6
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 12288
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 26
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 47,
          "endFrame": 47,
          "actionIndex": 70,
          "actionPath": [
            "timelineActions[27]",
            "_sequenceActionData",
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
                "targetSource": "Target",
                "targetGroupKey": "tar",
                "tagQueryType": "hasAny",
                "tagIds": [
                  2079142122
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
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 73,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0033_camille_normal_skill_bateffect",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "Camille_Bat",
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
        {
          "startFrame": 47,
          "endFrame": 47,
          "actionIndex": 77,
          "actionPath": [
            "timelineActions[27]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "conditions": [],
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 78,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
                  "levelValues": [
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    18.0,
                    18.0,
                    18.0,
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
          "onceScopeKey": "do-once:timelineActions[27]._sequenceActionData.actionData.[2]"
        },
        {
          "startFrame": 47,
          "endFrame": 47,
          "actionIndex": 79,
          "actionPath": [
            "timelineActions[27]",
            "_sequenceActionData",
            "actionData",
            "[3]"
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
                "second": {
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
              "actionType": "DamageAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 81,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.5,
                    "blackboardKey": "atk_scale_1_3",
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
              ]
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 83,
              "nestedCondition": {
                "startFrame": 47,
                "endFrame": 47,
                "actionIndex": 83,
                "actionPath": [
                  "timelineActions[27]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "succeedActions",
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
                      "targetGroupKey": "tar",
                      "tagQueryType": "hasAny",
                      "tagIds": [
                        2079142122
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
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 85,
                    "nestedCondition": {
                      "startFrame": 47,
                      "endFrame": 47,
                      "actionIndex": 85,
                      "actionPath": [
                        "timelineActions[27]",
                        "_sequenceActionData",
                        "actionData",
                        "[3]",
                        "succeedActions",
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
                          "comparison": "GE",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "talent_0",
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
                          "actionType": "HealAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[27]",
                            "_sequenceActionData",
                            "actionData",
                            "[3]",
                            "succeedActions",
                            "actionData",
                            "[2]",
                            "succeedActions",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 87,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "heal": {
                            "healType": "Normal",
                            "healer": "ActionSource",
                            "alwaysNext": true,
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
                              "finderType": "CharacterTeamFinder",
                              "validatorTypes": [
                                "MainCharacterValidator"
                              ],
                              "postProcessorTypes": []
                            },
                            "attribute": "Wisd",
                            "multiplier": {
                              "value": 1.0,
                              "blackboardKey": "heal_sub_multi",
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
                            "addition": {
                              "value": 0.0,
                              "blackboardKey": "heal_base",
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
                            "tagIds": [
                              -1517158118
                            ]
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
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CompareFloat",
              "actionIndex": 6,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[6]"
              ],
              "serverActionIndex": 93,
              "nestedCondition": {
                "startFrame": 47,
                "endFrame": 47,
                "actionIndex": 93,
                "actionPath": [
                  "timelineActions[27]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "succeedActions",
                  "actionData",
                  "[6]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LE",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "usp_gained",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 7,
                    "actionPath": [
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[7]"
                    ],
                    "serverActionIndex": 94,
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
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 8,
                    "actionPath": [
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[8]"
                    ],
                    "serverActionIndex": 95,
                    "blackboardMutation": {
                      "key": "usp_gained",
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
                "conditionNegated": [],
                "alwaysNext": false
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
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 96,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.5,
                    "blackboardKey": "atk_scale_1_3",
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
              ]
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 98,
              "nestedCondition": {
                "startFrame": 47,
                "endFrame": 47,
                "actionIndex": 98,
                "actionPath": [
                  "timelineActions[27]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "failActions",
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
                      "targetGroupKey": "tar",
                      "tagQueryType": "hasAny",
                      "tagIds": [
                        2079142122
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
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 100,
                    "nestedCondition": {
                      "startFrame": 47,
                      "endFrame": 47,
                      "actionIndex": 100,
                      "actionPath": [
                        "timelineActions[27]",
                        "_sequenceActionData",
                        "actionData",
                        "[3]",
                        "failActions",
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
                          "comparison": "GE",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "talent_0",
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
                          "actionType": "HealAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[27]",
                            "_sequenceActionData",
                            "actionData",
                            "[3]",
                            "failActions",
                            "actionData",
                            "[2]",
                            "succeedActions",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 102,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "heal": {
                            "healType": "Normal",
                            "healer": "ActionSource",
                            "alwaysNext": true,
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
                              "finderType": "CharacterTeamFinder",
                              "validatorTypes": [
                                "MainCharacterValidator"
                              ],
                              "postProcessorTypes": []
                            },
                            "attribute": "Wisd",
                            "multiplier": {
                              "value": 1.0,
                              "blackboardKey": "heal_sub_multi",
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
                            "addition": {
                              "value": 0.0,
                              "blackboardKey": "heal_base",
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
                            "tagIds": [
                              -1517158118
                            ]
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
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CompareFloat",
              "actionIndex": 6,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "failActions",
                "actionData",
                "[6]"
              ],
              "serverActionIndex": 108,
              "nestedCondition": {
                "startFrame": 47,
                "endFrame": 47,
                "actionIndex": 108,
                "actionPath": [
                  "timelineActions[27]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "failActions",
                  "actionData",
                  "[6]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LE",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "usp_gained",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 7,
                    "actionPath": [
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[7]"
                    ],
                    "serverActionIndex": 109,
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
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 8,
                    "actionPath": [
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[8]"
                    ],
                    "serverActionIndex": 110,
                    "blackboardMutation": {
                      "key": "usp_gained",
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
                "conditionNegated": [],
                "alwaysNext": false
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
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0033_camille_normal_skill_bateffect"
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
          "atb": [
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            18.0,
            18.0,
            18.0,
            20.0,
            20.0,
            20.0
          ],
          "atk_scale_1_1": [
            0.27,
            0.29,
            0.32,
            0.35,
            0.37,
            0.4,
            0.43,
            0.45,
            0.48,
            0.51,
            0.55,
            0.6
          ],
          "atk_scale_1_2": [
            0.27,
            0.29,
            0.32,
            0.35,
            0.37,
            0.4,
            0.43,
            0.45,
            0.48,
            0.51,
            0.55,
            0.6
          ],
          "atk_scale_1_3": [
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
          19.0,
          19.0,
          19.0,
          18.0
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
          "key": "atb_ex",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_1_1",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_1_2",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_1_3",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2_1",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2_2",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2_3",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2_4",
          "value": 0.1,
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
          "key": "combo_duration",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "heal_base",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_sub_multi",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "last_hit",
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
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "poise_2",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "talent_0",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "usp_gained",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale_1_1",
        "atk_scale_1_2",
        "atk_scale_1_3",
        "cam_angle",
        "combo_duration",
        "heal_base",
        "heal_sub_multi",
        "input_angle",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
        "talent_0",
        "usp",
        "usp_gained"
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
          "key": "atb_ex",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_1_1",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_1_2",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_1_3",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_2_1",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_2_2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_2_3",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_2_4",
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
          "key": "combo_duration",
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
          "key": "heal_base",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_sub_multi",
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
          "key": "last_hit",
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
          "key": "poise_2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_0",
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
        },
        {
          "key": "usp_gained",
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
        "HealAction",
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 13,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "atk_pnt",
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
          "endFrame": 15,
          "actionIndex": 19,
          "actionPath": [
            "timelineActions[11]",
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
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 42,
          "actionPath": [
            "timelineActions[18]",
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
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 43,
          "actionPath": [
            "timelineActions[19]",
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
          "startFrame": 27,
          "endFrame": 28,
          "actionIndex": 44,
          "actionPath": [
            "timelineActions[20]",
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
          "actionIndex": 45,
          "actionPath": [
            "timelineActions[21]",
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
          "startFrame": 47,
          "endFrame": 48,
          "actionIndex": 46,
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
          "startFrame": 48,
          "endFrame": 49,
          "actionIndex": 47,
          "actionPath": [
            "timelineActions[23]",
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
          "startFrame": 49,
          "endFrame": 50,
          "actionIndex": 48,
          "actionPath": [
            "timelineActions[24]",
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
          "startFrame": 47,
          "endFrame": 47,
          "actionIndex": 72,
          "actionPath": [
            "timelineActions[27]",
            "_sequenceActionData",
            "actionData",
            "[1]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "Camille_Bat",
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
                -1505402826
              ]
            ]
          ],
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[11]",
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
                "timelineActions[11]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 19,
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
          "startFrame": 47,
          "endFrame": 47,
          "actionIndex": 70,
          "actionPath": [
            "timelineActions[27]",
            "_sequenceActionData",
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
                "targetSource": "Target",
                "targetGroupKey": "tar",
                "tagQueryType": "hasAny",
                "tagIds": [
                  2079142122
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
              "actionType": "FindTargetAction",
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
              "serverActionIndex": 72,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 73,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0033_camille_normal_skill_bateffect",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "Camille_Bat",
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
        {
          "startFrame": 47,
          "endFrame": 47,
          "actionIndex": 77,
          "actionPath": [
            "timelineActions[27]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "conditions": [],
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 78,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
                  "levelValues": [
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    18.0,
                    18.0,
                    18.0,
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
          "onceScopeKey": "do-once:timelineActions[27]._sequenceActionData.actionData.[2]"
        },
        {
          "startFrame": 47,
          "endFrame": 47,
          "actionIndex": 79,
          "actionPath": [
            "timelineActions[27]",
            "_sequenceActionData",
            "actionData",
            "[3]"
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
                "second": {
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
              "actionType": "DamageAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 81,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.5,
                    "blackboardKey": "atk_scale_1_3",
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
              ]
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 83,
              "nestedCondition": {
                "startFrame": 47,
                "endFrame": 47,
                "actionIndex": 83,
                "actionPath": [
                  "timelineActions[27]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "succeedActions",
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
                      "targetGroupKey": "tar",
                      "tagQueryType": "hasAny",
                      "tagIds": [
                        2079142122
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
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 85,
                    "nestedCondition": {
                      "startFrame": 47,
                      "endFrame": 47,
                      "actionIndex": 85,
                      "actionPath": [
                        "timelineActions[27]",
                        "_sequenceActionData",
                        "actionData",
                        "[3]",
                        "succeedActions",
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
                          "comparison": "GE",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "talent_0",
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
                          "actionType": "HealAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[27]",
                            "_sequenceActionData",
                            "actionData",
                            "[3]",
                            "succeedActions",
                            "actionData",
                            "[2]",
                            "succeedActions",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 87,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "heal": {
                            "healType": "Normal",
                            "healer": "ActionSource",
                            "alwaysNext": true,
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
                              "finderType": "CharacterTeamFinder",
                              "validatorTypes": [
                                "MainCharacterValidator"
                              ],
                              "postProcessorTypes": []
                            },
                            "attribute": "Wisd",
                            "multiplier": {
                              "value": 1.0,
                              "blackboardKey": "heal_sub_multi",
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
                            "addition": {
                              "value": 0.0,
                              "blackboardKey": "heal_base",
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
                            "tagIds": [
                              -1517158118
                            ]
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
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CompareFloat",
              "actionIndex": 6,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[6]"
              ],
              "serverActionIndex": 93,
              "nestedCondition": {
                "startFrame": 47,
                "endFrame": 47,
                "actionIndex": 93,
                "actionPath": [
                  "timelineActions[27]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "succeedActions",
                  "actionData",
                  "[6]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LE",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "usp_gained",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 7,
                    "actionPath": [
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[7]"
                    ],
                    "serverActionIndex": 94,
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
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 8,
                    "actionPath": [
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[8]"
                    ],
                    "serverActionIndex": 95,
                    "blackboardMutation": {
                      "key": "usp_gained",
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
                "conditionNegated": [],
                "alwaysNext": false
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
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 96,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.5,
                    "blackboardKey": "atk_scale_1_3",
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
              ]
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 98,
              "nestedCondition": {
                "startFrame": 47,
                "endFrame": 47,
                "actionIndex": 98,
                "actionPath": [
                  "timelineActions[27]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "failActions",
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
                      "targetGroupKey": "tar",
                      "tagQueryType": "hasAny",
                      "tagIds": [
                        2079142122
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
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 100,
                    "nestedCondition": {
                      "startFrame": 47,
                      "endFrame": 47,
                      "actionIndex": 100,
                      "actionPath": [
                        "timelineActions[27]",
                        "_sequenceActionData",
                        "actionData",
                        "[3]",
                        "failActions",
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
                          "comparison": "GE",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "talent_0",
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
                          "actionType": "HealAction",
                          "actionIndex": 0,
                          "actionPath": [
                            "timelineActions[27]",
                            "_sequenceActionData",
                            "actionData",
                            "[3]",
                            "failActions",
                            "actionData",
                            "[2]",
                            "succeedActions",
                            "actionData",
                            "[0]",
                            "succeedActions",
                            "actionData",
                            "[0]"
                          ],
                          "serverActionIndex": 102,
                          "legacyBuffFinish": null,
                          "skillCooldownAdjustment": null,
                          "buffIgnite": null,
                          "heal": {
                            "healType": "Normal",
                            "healer": "ActionSource",
                            "alwaysNext": true,
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
                              "finderType": "CharacterTeamFinder",
                              "validatorTypes": [
                                "MainCharacterValidator"
                              ],
                              "postProcessorTypes": []
                            },
                            "attribute": "Wisd",
                            "multiplier": {
                              "value": 1.0,
                              "blackboardKey": "heal_sub_multi",
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
                            "addition": {
                              "value": 0.0,
                              "blackboardKey": "heal_base",
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
                            "tagIds": [
                              -1517158118
                            ]
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
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CompareFloat",
              "actionIndex": 6,
              "actionPath": [
                "timelineActions[27]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "failActions",
                "actionData",
                "[6]"
              ],
              "serverActionIndex": 108,
              "nestedCondition": {
                "startFrame": 47,
                "endFrame": 47,
                "actionIndex": 108,
                "actionPath": [
                  "timelineActions[27]",
                  "_sequenceActionData",
                  "actionData",
                  "[3]",
                  "failActions",
                  "actionData",
                  "[6]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LE",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "usp_gained",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 7,
                    "actionPath": [
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[7]"
                    ],
                    "serverActionIndex": 109,
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
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 8,
                    "actionPath": [
                      "timelineActions[27]",
                      "_sequenceActionData",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[8]"
                    ],
                    "serverActionIndex": 110,
                    "blackboardMutation": {
                      "key": "usp_gained",
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
                "conditionNegated": [],
                "alwaysNext": false
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
          "endFrame": 15,
          "actionIndex": 16,
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
          "sequenceIndex": 10,
          "effectAbilityEntityTargets": []
        }
      ],
      "intervalDamageHits": [],
      "timelineJumps": [],
      "timelineJumpControlFlowActions": [],
      "timelineFinishes": []
    },
    {
      "key": "comboSkill2",
      "skillId": "chr_0033_camille_combo_skill_2",
      "skillType": "comboSkill",
      "sourceFile": "chr_0033_camille_combo_skill_2.json",
      "timelineBlockFrames": 79,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 79,
          "endFrame": 127,
          "skillIds": [
            "chr_0033_camille_normal_skill",
            "chr_0033_camille_normal_skill_2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 127,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0033_camille_normal_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": false,
              "cacheTime": {
                "useBlackboardKey": false,
                "value": 0.3,
                "blackboardKey": ""
              }
            },
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0033_camille_normal_skill_2",
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
          "endFrame": 213,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "FinishBuffAdvanced"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 44,
          "actionTypes": [
            "CheckEntityNum",
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 19,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 53,
          "actionTypes": [
            "CheckEntityNum",
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 18,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 26,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "TeleportAction",
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 48,
          "actionTypes": [
            "CheckEntityNum",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 49,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "TeleportAction"
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
          "startFrame": 28,
          "endFrame": 32,
          "actionTypes": [
            "CheckEntityNum",
            "MoveToAction"
          ]
        },
        {
          "startFrame": 67,
          "endFrame": 71,
          "actionTypes": [
            "CheckEntityNum",
            "CustomRootMotionAction",
            "Selector"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 26,
          "actionTypes": [
            "ShowHideActorAction"
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
          "startFrame": 52,
          "endFrame": 67,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
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
          "startFrame": 33,
          "endFrame": 34,
          "actionTypes": [
            "SaveTwoDirectionAngle",
            "CurveEvaluateFloat"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 43,
          "actionTypes": [
            "CameraRotateAction"
          ]
        },
        {
          "startFrame": 53,
          "endFrame": 66,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 49,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 73,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 73,
          "endFrame": 97,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
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
          "startFrame": 33,
          "endFrame": 34,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 35,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 36,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 50,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 50,
          "endFrame": 51,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 70,
          "endFrame": 71,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 71,
          "endFrame": 72,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 73,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 20,
          "actionTypes": [
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 33,
          "endFrame": 33,
          "actionTypes": [
            "InterruptAction",
            "DoOnceAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "CameraImpulseAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 49,
          "actionTypes": [
            "InterruptAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "LaunchUpwardAction",
            "HitStopAction",
            "CameraImpulseAction",
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 70,
          "endFrame": 70,
          "actionTypes": [
            "InterruptAction",
            "DoOnceAction",
            "ComboAction",
            "IfElseAction",
            "FindTargetAction",
            "Selector",
            "Selector",
            "CreateBuffAction",
            "DoOnceAction",
            "ObtainCostAction",
            "IfElseAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "HealAction",
            "Selector",
            "Selector",
            "MultiplyAttributeCalculation",
            "HitStopAction",
            "CameraImpulseAction",
            "AddDynamicCcsAction",
            "CompareFloat",
            "ObtainCostAction",
            "ModifyDynamicBlackboard",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "IfElseAction",
            "HealAction",
            "Selector",
            "Selector",
            "MultiplyAttributeCalculation",
            "HitStopAction",
            "CameraImpulseAction",
            "AddDynamicCcsAction",
            "CompareFloat",
            "ObtainCostAction",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 86,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 127,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 79,
          "endFrame": 127,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 213,
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
          "startFrame": 123,
          "endFrame": 213,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "CharWeaponAnimationAction"
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
          "startFrame": 16,
          "endFrame": 75,
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
          "startFrame": 17,
          "endFrame": 46,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 62,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 89,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 42,
          "endFrame": 101,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 68,
          "endFrame": 127,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 58,
          "endFrame": 117,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 149,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 145,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 71,
          "endFrame": 130,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 117,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 88,
          "endFrame": 177,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 49,
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
          "startFrame": 54,
          "endFrame": 83,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 214,
          "endFrame": 250,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 272,
          "endFrame": 287,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 70,
          "endFrame": 111,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 226,
          "endFrame": 256,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 284,
          "endFrame": 314,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 95,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 260,
          "endFrame": 289,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 102,
          "endFrame": 135,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 247,
          "endFrame": 290,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 316,
          "endFrame": 349,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 39,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 20,
          "endFrame": 20,
          "actionIndex": 92,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale_2_1",
                "levelValues": [
                  0.27,
                  0.29,
                  0.32,
                  0.35,
                  0.37,
                  0.4,
                  0.43,
                  0.45,
                  0.48,
                  0.51,
                  0.55,
                  0.6
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 12288
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 39
        },
        {
          "startFrame": 33,
          "endFrame": 33,
          "actionIndex": 103,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale_2_2",
                "levelValues": [
                  0.27,
                  0.29,
                  0.32,
                  0.35,
                  0.37,
                  0.4,
                  0.43,
                  0.45,
                  0.48,
                  0.51,
                  0.55,
                  0.6
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
          "sequenceIndex": 40
        },
        {
          "startFrame": 49,
          "endFrame": 49,
          "actionIndex": 112,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale_2_3",
                "levelValues": [
                  0.27,
                  0.29,
                  0.32,
                  0.35,
                  0.37,
                  0.4,
                  0.43,
                  0.45,
                  0.48,
                  0.51,
                  0.55,
                  0.6
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 12288
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 41
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 33,
          "endFrame": 33,
          "actionIndex": 101,
          "actionPath": [
            "timelineActions[40]",
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
                "timelineActions[40]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 102,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
                  "levelValues": [
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    18.0,
                    18.0,
                    18.0,
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
          "onceScopeKey": "do-once:timelineActions[40]._sequenceActionData.actionData.[1]"
        },
        {
          "startFrame": 70,
          "endFrame": 70,
          "actionIndex": 126,
          "actionPath": [
            "timelineActions[42]",
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
                "targetGroupKey": "tar",
                "tagQueryType": "hasAny",
                "tagIds": [
                  2079142122
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
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 129,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0033_camille_normal_skill_bateffect",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "Camille_Bat",
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
        {
          "startFrame": 70,
          "endFrame": 70,
          "actionIndex": 130,
          "actionPath": [
            "timelineActions[42]",
            "_sequenceActionData",
            "actionData",
            "[3]"
          ],
          "conditions": [],
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 131,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb_ex",
                  "levelValues": [
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    18.0,
                    18.0,
                    18.0,
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
          "onceScopeKey": "do-once:timelineActions[42]._sequenceActionData.actionData.[3]"
        },
        {
          "startFrame": 70,
          "endFrame": 70,
          "actionIndex": 132,
          "actionPath": [
            "timelineActions[42]",
            "_sequenceActionData",
            "actionData",
            "[4]"
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
                "second": {
                  "targetSource": "MainTarget",
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
              "actionType": "DamageAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 134,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.5,
                    "blackboardKey": "atk_scale_2_4",
                    "levelValues": [
                      1.42,
                      1.57,
                      1.71,
                      1.85,
                      1.99,
                      2.14,
                      2.28,
                      2.42,
                      2.56,
                      2.74,
                      2.95,
                      3.2
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
                    "blackboardKey": "poise_2",
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
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 136,
              "nestedCondition": {
                "startFrame": 70,
                "endFrame": 70,
                "actionIndex": 136,
                "actionPath": [
                  "timelineActions[42]",
                  "_sequenceActionData",
                  "actionData",
                  "[4]",
                  "succeedActions",
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
                      "blackboardKey": "talent_0",
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
                    "actionType": "HealAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 138,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "heal": {
                      "healType": "Normal",
                      "healer": "ActionSource",
                      "alwaysNext": true,
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
                        "finderType": "CharacterTeamFinder",
                        "validatorTypes": [
                          "MainCharacterValidator"
                        ],
                        "postProcessorTypes": []
                      },
                      "attribute": "Wisd",
                      "multiplier": {
                        "value": 1.0,
                        "blackboardKey": "heal_sub_multi",
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
                      "addition": {
                        "value": 0.0,
                        "blackboardKey": "heal_base",
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
                      "tagIds": [
                        -1517158118
                      ]
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
              "actionType": "CompareFloat",
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[7]"
              ],
              "serverActionIndex": 144,
              "nestedCondition": {
                "startFrame": 70,
                "endFrame": 70,
                "actionIndex": 144,
                "actionPath": [
                  "timelineActions[42]",
                  "_sequenceActionData",
                  "actionData",
                  "[4]",
                  "succeedActions",
                  "actionData",
                  "[7]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LE",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "usp_gained",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 8,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "succeedActions",
                      "actionData",
                      "[8]"
                    ],
                    "serverActionIndex": 145,
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
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 9,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "succeedActions",
                      "actionData",
                      "[9]"
                    ],
                    "serverActionIndex": 146,
                    "blackboardMutation": {
                      "key": "usp_gained",
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
                "conditionNegated": [],
                "alwaysNext": false
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
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 147,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.5,
                    "blackboardKey": "atk_scale_2_4",
                    "levelValues": [
                      1.42,
                      1.57,
                      1.71,
                      1.85,
                      1.99,
                      2.14,
                      2.28,
                      2.42,
                      2.56,
                      2.74,
                      2.95,
                      3.2
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
                    "blackboardKey": "poise_2",
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
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 149,
              "nestedCondition": {
                "startFrame": 70,
                "endFrame": 70,
                "actionIndex": 149,
                "actionPath": [
                  "timelineActions[42]",
                  "_sequenceActionData",
                  "actionData",
                  "[4]",
                  "failActions",
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
                      "blackboardKey": "talent_0",
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
                    "actionType": "HealAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "failActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 151,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "heal": {
                      "healType": "Normal",
                      "healer": "ActionSource",
                      "alwaysNext": true,
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
                        "finderType": "CharacterTeamFinder",
                        "validatorTypes": [
                          "MainCharacterValidator"
                        ],
                        "postProcessorTypes": []
                      },
                      "attribute": "Wisd",
                      "multiplier": {
                        "value": 1.0,
                        "blackboardKey": "heal_sub_multi",
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
                      "addition": {
                        "value": 0.0,
                        "blackboardKey": "heal_base",
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
                      "tagIds": [
                        -1517158118
                      ]
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
              "actionType": "CompareFloat",
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "failActions",
                "actionData",
                "[7]"
              ],
              "serverActionIndex": 157,
              "nestedCondition": {
                "startFrame": 70,
                "endFrame": 70,
                "actionIndex": 157,
                "actionPath": [
                  "timelineActions[42]",
                  "_sequenceActionData",
                  "actionData",
                  "[4]",
                  "failActions",
                  "actionData",
                  "[7]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LE",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "usp_gained",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 8,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "failActions",
                      "actionData",
                      "[8]"
                    ],
                    "serverActionIndex": 158,
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
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 9,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "failActions",
                      "actionData",
                      "[9]"
                    ],
                    "serverActionIndex": 159,
                    "blackboardMutation": {
                      "key": "usp_gained",
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
                "conditionNegated": [],
                "alwaysNext": false
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
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 1,
          "targetSource": "Source",
          "targetGroupKey": "",
          "buffCheckType": "Id",
          "buffIds": [
            "buff_chr_0033_camille_ult_henshin_state"
          ],
          "tagQueryType": "hasAny",
          "buffTagIds": [],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": true,
          "isAbsorbed": false,
          "finishLayerCount": null,
          "sourceActionType": "FinishBuffAdvanced",
          "sequenceIndex": 1
        }
      ],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0033_camille_normal_skill_bateffect"
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
          "atb": [
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            18.0,
            18.0,
            18.0,
            20.0,
            20.0,
            20.0
          ],
          "atb_ex": [
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            16.0,
            18.0,
            18.0,
            18.0,
            20.0,
            20.0,
            20.0
          ],
          "atk_scale_2_1": [
            0.27,
            0.29,
            0.32,
            0.35,
            0.37,
            0.4,
            0.43,
            0.45,
            0.48,
            0.51,
            0.55,
            0.6
          ],
          "atk_scale_2_2": [
            0.27,
            0.29,
            0.32,
            0.35,
            0.37,
            0.4,
            0.43,
            0.45,
            0.48,
            0.51,
            0.55,
            0.6
          ],
          "atk_scale_2_3": [
            0.27,
            0.29,
            0.32,
            0.35,
            0.37,
            0.4,
            0.43,
            0.45,
            0.48,
            0.51,
            0.55,
            0.6
          ],
          "atk_scale_2_4": [
            1.42,
            1.57,
            1.71,
            1.85,
            1.99,
            2.14,
            2.28,
            2.42,
            2.56,
            2.74,
            2.95,
            3.2
          ],
          "display_atk_scale_2": [
            2.22,
            2.44,
            2.67,
            2.89,
            3.11,
            3.33,
            3.56,
            3.78,
            4.0,
            4.28,
            4.61,
            5.0
          ],
          "display_poise_ex": [
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
          "poise_2": [
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
          0.0,
          0.0,
          0.0,
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
          "key": "atb_ex",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_1_1",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_1_2",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_1_3",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2_1",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2_2",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2_3",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2_4",
          "value": 0.1,
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
          "key": "combo_duration",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "heal_base",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_sub_multi",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "last_hit",
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
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "poise_2",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "talent_0",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "usp",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "usp_gained",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "atb",
        "atb_ex",
        "atk_scale_2_1",
        "atk_scale_2_2",
        "atk_scale_2_3",
        "atk_scale_2_4",
        "cam_angle",
        "combo_duration",
        "heal_base",
        "heal_sub_multi",
        "input_angle",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
        "poise_2",
        "talent_0",
        "usp",
        "usp_gained"
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
          "key": "atb_ex",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_1_1",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_1_2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_1_3",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_2_1",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_2_2",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_2_3",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_2_4",
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
          "key": "combo_duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "display_atk_scale_2",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "display_poise_ex",
          "declaredInSkill": false,
          "suppliedByPatch": true,
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
          "key": "heal_sub_multi",
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
          "key": "last_hit",
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
          "key": "poise_2",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "talent_0",
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
        },
        {
          "key": "usp_gained",
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
        "HealAction",
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 25,
          "endFrame": 26,
          "actionIndex": 15,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]"
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
          "startFrame": 48,
          "endFrame": 49,
          "actionIndex": 22,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "atkpos",
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
          "startFrame": 27,
          "endFrame": 28,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[11]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "atk_pnt",
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
          "endFrame": 24,
          "actionIndex": 33,
          "actionPath": [
            "timelineActions[16]",
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
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 79,
          "actionPath": [
            "timelineActions[28]",
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
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 80,
          "actionPath": [
            "timelineActions[29]",
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
          "actionIndex": 81,
          "actionPath": [
            "timelineActions[30]",
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
          "startFrame": 33,
          "endFrame": 34,
          "actionIndex": 82,
          "actionPath": [
            "timelineActions[31]",
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
          "startFrame": 34,
          "endFrame": 35,
          "actionIndex": 83,
          "actionPath": [
            "timelineActions[32]",
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
          "endFrame": 36,
          "actionIndex": 84,
          "actionPath": [
            "timelineActions[33]",
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
          "startFrame": 49,
          "endFrame": 50,
          "actionIndex": 85,
          "actionPath": [
            "timelineActions[34]",
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
          "startFrame": 50,
          "endFrame": 51,
          "actionIndex": 86,
          "actionPath": [
            "timelineActions[35]",
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
          "startFrame": 70,
          "endFrame": 71,
          "actionIndex": 87,
          "actionPath": [
            "timelineActions[36]",
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
          "startFrame": 71,
          "endFrame": 72,
          "actionIndex": 88,
          "actionPath": [
            "timelineActions[37]",
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
          "startFrame": 72,
          "endFrame": 73,
          "actionIndex": 89,
          "actionPath": [
            "timelineActions[38]",
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
          "startFrame": 70,
          "endFrame": 70,
          "actionIndex": 128,
          "actionPath": [
            "timelineActions[42]",
            "_sequenceActionData",
            "actionData",
            "[2]",
            "succeedActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "Camille_Bat",
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
                -1505402826
              ]
            ]
          ],
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 48,
          "endFrame": 49,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[10]",
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
                  "targetSource": "Target",
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
                "distance": 3.0,
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
                "timelineActions[10]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 22,
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
          "endFrame": 24,
          "actionIndex": 31,
          "actionPath": [
            "timelineActions[16]",
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
                "timelineActions[16]",
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
        },
        {
          "startFrame": 33,
          "endFrame": 33,
          "actionIndex": 101,
          "actionPath": [
            "timelineActions[40]",
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
                "timelineActions[40]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 102,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
                  "levelValues": [
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    18.0,
                    18.0,
                    18.0,
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
          "onceScopeKey": "do-once:timelineActions[40]._sequenceActionData.actionData.[1]"
        },
        {
          "startFrame": 70,
          "endFrame": 70,
          "actionIndex": 126,
          "actionPath": [
            "timelineActions[42]",
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
                "targetGroupKey": "tar",
                "tagQueryType": "hasAny",
                "tagIds": [
                  2079142122
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
              "actionType": "FindTargetAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 128,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 129,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0033_camille_normal_skill_bateffect",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Context",
                "targetGroupKey": "Camille_Bat",
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
        {
          "startFrame": 70,
          "endFrame": 70,
          "actionIndex": 130,
          "actionPath": [
            "timelineActions[42]",
            "_sequenceActionData",
            "actionData",
            "[3]"
          ],
          "conditions": [],
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 131,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb_ex",
                  "levelValues": [
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    16.0,
                    18.0,
                    18.0,
                    18.0,
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
          "onceScopeKey": "do-once:timelineActions[42]._sequenceActionData.actionData.[3]"
        },
        {
          "startFrame": 70,
          "endFrame": 70,
          "actionIndex": 132,
          "actionPath": [
            "timelineActions[42]",
            "_sequenceActionData",
            "actionData",
            "[4]"
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
                "second": {
                  "targetSource": "MainTarget",
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
              "actionType": "DamageAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 134,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.5,
                    "blackboardKey": "atk_scale_2_4",
                    "levelValues": [
                      1.42,
                      1.57,
                      1.71,
                      1.85,
                      1.99,
                      2.14,
                      2.28,
                      2.42,
                      2.56,
                      2.74,
                      2.95,
                      3.2
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
                    "blackboardKey": "poise_2",
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
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 136,
              "nestedCondition": {
                "startFrame": 70,
                "endFrame": 70,
                "actionIndex": 136,
                "actionPath": [
                  "timelineActions[42]",
                  "_sequenceActionData",
                  "actionData",
                  "[4]",
                  "succeedActions",
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
                      "blackboardKey": "talent_0",
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
                    "actionType": "HealAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "succeedActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 138,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "heal": {
                      "healType": "Normal",
                      "healer": "ActionSource",
                      "alwaysNext": true,
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
                        "finderType": "CharacterTeamFinder",
                        "validatorTypes": [
                          "MainCharacterValidator"
                        ],
                        "postProcessorTypes": []
                      },
                      "attribute": "Wisd",
                      "multiplier": {
                        "value": 1.0,
                        "blackboardKey": "heal_sub_multi",
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
                      "addition": {
                        "value": 0.0,
                        "blackboardKey": "heal_base",
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
                      "tagIds": [
                        -1517158118
                      ]
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
              "actionType": "CompareFloat",
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[7]"
              ],
              "serverActionIndex": 144,
              "nestedCondition": {
                "startFrame": 70,
                "endFrame": 70,
                "actionIndex": 144,
                "actionPath": [
                  "timelineActions[42]",
                  "_sequenceActionData",
                  "actionData",
                  "[4]",
                  "succeedActions",
                  "actionData",
                  "[7]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LE",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "usp_gained",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 8,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "succeedActions",
                      "actionData",
                      "[8]"
                    ],
                    "serverActionIndex": 145,
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
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 9,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "succeedActions",
                      "actionData",
                      "[9]"
                    ],
                    "serverActionIndex": 146,
                    "blackboardMutation": {
                      "key": "usp_gained",
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
                "conditionNegated": [],
                "alwaysNext": false
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
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 147,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "damageUnits": [
                {
                  "damageType": "Fire",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.5,
                    "blackboardKey": "atk_scale_2_4",
                    "levelValues": [
                      1.42,
                      1.57,
                      1.71,
                      1.85,
                      1.99,
                      2.14,
                      2.28,
                      2.42,
                      2.56,
                      2.74,
                      2.95,
                      3.2
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
                    "blackboardKey": "poise_2",
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
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 149,
              "nestedCondition": {
                "startFrame": 70,
                "endFrame": 70,
                "actionIndex": 149,
                "actionPath": [
                  "timelineActions[42]",
                  "_sequenceActionData",
                  "actionData",
                  "[4]",
                  "failActions",
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
                      "blackboardKey": "talent_0",
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
                    "actionType": "HealAction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "failActions",
                      "actionData",
                      "[2]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 151,
                    "legacyBuffFinish": null,
                    "skillCooldownAdjustment": null,
                    "buffIgnite": null,
                    "heal": {
                      "healType": "Normal",
                      "healer": "ActionSource",
                      "alwaysNext": true,
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
                        "finderType": "CharacterTeamFinder",
                        "validatorTypes": [
                          "MainCharacterValidator"
                        ],
                        "postProcessorTypes": []
                      },
                      "attribute": "Wisd",
                      "multiplier": {
                        "value": 1.0,
                        "blackboardKey": "heal_sub_multi",
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
                      "addition": {
                        "value": 0.0,
                        "blackboardKey": "heal_base",
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
                      "tagIds": [
                        -1517158118
                      ]
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
              "actionType": "CompareFloat",
              "actionIndex": 7,
              "actionPath": [
                "timelineActions[42]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "failActions",
                "actionData",
                "[7]"
              ],
              "serverActionIndex": 157,
              "nestedCondition": {
                "startFrame": 70,
                "endFrame": 70,
                "actionIndex": 157,
                "actionPath": [
                  "timelineActions[42]",
                  "_sequenceActionData",
                  "actionData",
                  "[4]",
                  "failActions",
                  "actionData",
                  "[7]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LE",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "usp_gained",
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
                    "actionType": "ObtainCostAction",
                    "actionIndex": 8,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "failActions",
                      "actionData",
                      "[8]"
                    ],
                    "serverActionIndex": 158,
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
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 9,
                    "actionPath": [
                      "timelineActions[42]",
                      "_sequenceActionData",
                      "actionData",
                      "[4]",
                      "failActions",
                      "actionData",
                      "[9]"
                    ],
                    "serverActionIndex": 159,
                    "blackboardMutation": {
                      "key": "usp_gained",
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
                "conditionNegated": [],
                "alwaysNext": false
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
          "endFrame": 24,
          "actionIndex": 30,
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
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 15,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 52,
          "endFrame": 67,
          "actionIndex": 45,
          "kind": "normal",
          "priority": -1742631616,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.5,
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
          "omittedAbilityEntityTargets": 0,
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 19,
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
      "skillId": "chr_0033_camille_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0033_camille_ultimate_skill.json",
      "timelineBlockFrames": 125,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 8.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 125,
          "endFrame": 150,
          "skillIds": [
            "chr_0033_camille_normal_skill",
            "chr_0033_camille_normal_skill_2",
            "chr_0033_camille_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 150,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0033_camille_normal_skill",
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
              "skillId": "chr_0033_camille_normal_skill_2",
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
              "skillId": "chr_0033_camille_combo_skill",
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
          "endFrame": 236,
          "actionTypes": [
            "PlayAnimationAction"
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
          "endFrame": 69,
          "actionTypes": [
            "TimeDilationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionTypes": [
            "AnimatedCameraAction"
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
          "startFrame": 75,
          "endFrame": 76,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 76,
          "endFrame": 77,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 77,
          "endFrame": 78,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 78,
          "endFrame": 79,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 79,
          "endFrame": 80,
          "actionTypes": [
            "FindTargetAction",
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
          "startFrame": 81,
          "endFrame": 82,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 82,
          "endFrame": 83,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 83,
          "endFrame": 84,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 84,
          "endFrame": 85,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 85,
          "endFrame": 86,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 87,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 87,
          "endFrame": 88,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 88,
          "endFrame": 89,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 89,
          "endFrame": 90,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 90,
          "endFrame": 91,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 104,
          "endFrame": 108,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 124,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 75,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 77,
          "endFrame": 77,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 79,
          "endFrame": 79,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 81,
          "endFrame": 81,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 83,
          "endFrame": 83,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 85,
          "endFrame": 85,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 87,
          "endFrame": 87,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 104,
          "endFrame": 104,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 120,
          "actionTypes": [
            "IfElseAction",
            "SpellInfliction",
            "CreateBuffAction",
            "DoOnceAction",
            "ObtainCostAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "HitStopAction",
            "BlowOffAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 91,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 104,
          "endFrame": 108,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 124,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 69,
          "endFrame": 90,
          "actionTypes": [
            "ShowHideActorAction"
          ]
        },
        {
          "startFrame": 90,
          "endFrame": 118,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 119,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "ShowHideActorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 118,
          "actionTypes": [
            "ShowHideActorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 133,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 122,
          "actionTypes": [
            "ChannelingCastingAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 122,
          "actionTypes": [
            "AddTagAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 150,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 125,
          "endFrame": 150,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 80,
          "endFrame": 108,
          "actionTypes": [
            "ModifyWeaponMountPoint"
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
          "startFrame": 108,
          "endFrame": 236,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "endFrame": 242,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 108,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 108,
          "endFrame": 236,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "endFrame": 90,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 21,
          "endFrame": 37,
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
          "startFrame": 33,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 33,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 33,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 69,
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
          "startFrame": 0,
          "endFrame": 44,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 61,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 71,
          "endFrame": 160,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 71,
          "endFrame": 160,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 102,
          "endFrame": 191,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 101,
          "endFrame": 190,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 101,
          "endFrame": 160,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 71,
          "endFrame": 160,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 117,
          "endFrame": 206,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 97,
          "endFrame": 186,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 85,
          "endFrame": 114,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 85,
          "endFrame": 114,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 118,
          "endFrame": 147,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 80,
          "endFrame": 144,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 90,
          "endFrame": 149,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 119,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 114,
          "endFrame": 203,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 114,
          "endFrame": 173,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 114,
          "endFrame": 173,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 114,
          "endFrame": 173,
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
          "startFrame": 135,
          "endFrame": 194,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 300,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 194,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 75,
          "endFrame": 75,
          "actionIndex": 36,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_1",
                "levelValues": [
                  0.178,
                  0.196,
                  0.213,
                  0.231,
                  0.249,
                  0.267,
                  0.284,
                  0.302,
                  0.32,
                  0.342,
                  0.369,
                  0.4
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 25
        },
        {
          "startFrame": 77,
          "endFrame": 77,
          "actionIndex": 36,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_1",
                "levelValues": [
                  0.178,
                  0.196,
                  0.213,
                  0.231,
                  0.249,
                  0.267,
                  0.284,
                  0.302,
                  0.32,
                  0.342,
                  0.369,
                  0.4
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 26
        },
        {
          "startFrame": 79,
          "endFrame": 79,
          "actionIndex": 36,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_1",
                "levelValues": [
                  0.178,
                  0.196,
                  0.213,
                  0.231,
                  0.249,
                  0.267,
                  0.284,
                  0.302,
                  0.32,
                  0.342,
                  0.369,
                  0.4
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 27
        },
        {
          "startFrame": 81,
          "endFrame": 81,
          "actionIndex": 36,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_1",
                "levelValues": [
                  0.178,
                  0.196,
                  0.213,
                  0.231,
                  0.249,
                  0.267,
                  0.284,
                  0.302,
                  0.32,
                  0.342,
                  0.369,
                  0.4
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 28
        },
        {
          "startFrame": 83,
          "endFrame": 83,
          "actionIndex": 36,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_1",
                "levelValues": [
                  0.178,
                  0.196,
                  0.213,
                  0.231,
                  0.249,
                  0.267,
                  0.284,
                  0.302,
                  0.32,
                  0.342,
                  0.369,
                  0.4
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 29
        },
        {
          "startFrame": 85,
          "endFrame": 85,
          "actionIndex": 36,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_1",
                "levelValues": [
                  0.178,
                  0.196,
                  0.213,
                  0.231,
                  0.249,
                  0.267,
                  0.284,
                  0.302,
                  0.32,
                  0.342,
                  0.369,
                  0.4
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 30
        },
        {
          "startFrame": 87,
          "endFrame": 87,
          "actionIndex": 36,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_1",
                "levelValues": [
                  0.178,
                  0.196,
                  0.213,
                  0.231,
                  0.249,
                  0.267,
                  0.284,
                  0.302,
                  0.32,
                  0.342,
                  0.369,
                  0.4
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 31
        },
        {
          "startFrame": 104,
          "endFrame": 104,
          "actionIndex": 40,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_2",
                "levelValues": [
                  0.533,
                  0.587,
                  0.64,
                  0.693,
                  0.747,
                  0.8,
                  0.853,
                  0.907,
                  0.96,
                  1.027,
                  1.106,
                  1.2
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 32
        },
        {
          "startFrame": 120,
          "endFrame": 120,
          "actionIndex": 50,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_3",
                "levelValues": [
                  0.889,
                  0.978,
                  1.067,
                  1.156,
                  1.245,
                  1.334,
                  1.423,
                  1.512,
                  1.601,
                  1.712,
                  1.845,
                  2.001
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
          "sequenceIndex": 33
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 120,
          "endFrame": 120,
          "actionIndex": 44,
          "actionPath": [
            "timelineActions[33]",
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
                "targetSource": "Target",
                "targetGroupKey": "tar",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0033_camille_ult_hit"
                ],
                "tagQueryType": "hasAny",
                "buffTagIds": [],
                "countType": "BuffCount",
                "comparison": "LE",
                "value": {
                  "value": 0.0,
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
              "actionType": "SpellInfliction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[33]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 46,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "infliction": {
                "element": "heat",
                "isExtra": false
              }
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[33]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 47,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0033_camille_ult_hit",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Target",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 120,
          "endFrame": 120,
          "actionIndex": 48,
          "actionPath": [
            "timelineActions[33]",
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
                "timelineActions[33]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 49,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
                  "levelValues": [
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    36.0,
                    36.0,
                    36.0,
                    40.0
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
          "alwaysNext": false,
          "onceScopeKey": "do-once:timelineActions[33]._sequenceActionData.actionData.[1]"
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 90,
          "endFrame": 118,
          "actionIndex": 58,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0033_camille_ult_effect",
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
          "sequenceIndex": 38,
          "autoFinishByAction": true
        },
        {
          "startFrame": 118,
          "endFrame": 119,
          "actionIndex": 59,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0033_camille_ult_henshin_state",
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
              "value": 0.0,
              "blackboardKey": "duration",
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
          "sequenceIndex": 39,
          "autoFinishByAction": false
        },
        {
          "startFrame": 0,
          "endFrame": 133,
          "actionIndex": 62,
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
          "sequenceIndex": 42,
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
        "buff_chr_0033_camille_ult_effect",
        "buff_chr_0033_camille_ult_henshin_state",
        "buff_chr_0033_camille_ult_hit",
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
          "atb": [
            32.0,
            32.0,
            32.0,
            32.0,
            32.0,
            32.0,
            32.0,
            32.0,
            36.0,
            36.0,
            36.0,
            40.0
          ],
          "atk_scale_1": [
            0.178,
            0.196,
            0.213,
            0.231,
            0.249,
            0.267,
            0.284,
            0.302,
            0.32,
            0.342,
            0.369,
            0.4
          ],
          "atk_scale_2": [
            0.533,
            0.587,
            0.64,
            0.693,
            0.747,
            0.8,
            0.853,
            0.907,
            0.96,
            1.027,
            1.106,
            1.2
          ],
          "atk_scale_3": [
            0.889,
            0.978,
            1.067,
            1.156,
            1.245,
            1.334,
            1.423,
            1.512,
            1.601,
            1.712,
            1.845,
            2.001
          ],
          "display_atk_scale": [
            2.667,
            2.933,
            3.2,
            3.467,
            3.733,
            4.0,
            4.267,
            4.533,
            4.8,
            5.133,
            5.533,
            6.0
          ],
          "duration": [
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
          130.0,
          130.0,
          130.0,
          130.0,
          130.0,
          130.0,
          130.0,
          130.0,
          130.0,
          130.0,
          130.0,
          130.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atb",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_1",
          "value": 0.1,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_3",
          "value": 1.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 15.0,
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
        "atk_scale_1",
        "atk_scale_2",
        "atk_scale_3",
        "poise",
        "select_radius"
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
          "key": "atk_scale_1",
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
          "key": "atk_scale_3",
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
          "key": "duration",
          "declaredInSkill": true,
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
        "IfElseAction",
        "ObtainCostAction",
        "SpellInfliction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 2,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[1]",
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
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[1]",
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
          "startFrame": 75,
          "endFrame": 76,
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
          "startFrame": 76,
          "endFrame": 77,
          "actionIndex": 18,
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
          "startFrame": 77,
          "endFrame": 78,
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
          "finderCheckAlive": true,
          "validatorTypes": [],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 78,
          "endFrame": 79,
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
          "finderCheckAlive": true,
          "validatorTypes": [],
          "postProcessorTypes": [],
          "inputTargets": [],
          "intervalSeconds": null,
          "pickIndexValue": null,
          "pickIndexBlackboardKey": null
        },
        {
          "startFrame": 79,
          "endFrame": 80,
          "actionIndex": 21,
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
          "startFrame": 80,
          "endFrame": 81,
          "actionIndex": 22,
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
          "startFrame": 81,
          "endFrame": 82,
          "actionIndex": 23,
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
        },
        {
          "startFrame": 82,
          "endFrame": 83,
          "actionIndex": 24,
          "actionPath": [
            "timelineActions[14]",
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
          "startFrame": 83,
          "endFrame": 84,
          "actionIndex": 25,
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
        },
        {
          "startFrame": 84,
          "endFrame": 85,
          "actionIndex": 26,
          "actionPath": [
            "timelineActions[16]",
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
          "startFrame": 85,
          "endFrame": 86,
          "actionIndex": 27,
          "actionPath": [
            "timelineActions[17]",
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
          "startFrame": 86,
          "endFrame": 87,
          "actionIndex": 28,
          "actionPath": [
            "timelineActions[18]",
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
          "startFrame": 87,
          "endFrame": 88,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[19]",
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
          "startFrame": 88,
          "endFrame": 89,
          "actionIndex": 30,
          "actionPath": [
            "timelineActions[20]",
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
          "startFrame": 89,
          "endFrame": 90,
          "actionIndex": 31,
          "actionPath": [
            "timelineActions[21]",
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
          "startFrame": 90,
          "endFrame": 91,
          "actionIndex": 32,
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
          "startFrame": 104,
          "endFrame": 108,
          "actionIndex": 33,
          "actionPath": [
            "timelineActions[23]",
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
          "startFrame": 120,
          "endFrame": 124,
          "actionIndex": 34,
          "actionPath": [
            "timelineActions[24]",
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
          "actionIndex": 1,
          "actionPath": [
            "timelineActions[1]",
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
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 5,
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
                "failActions",
                "actionData",
                "[1]"
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
        {
          "startFrame": 120,
          "endFrame": 120,
          "actionIndex": 44,
          "actionPath": [
            "timelineActions[33]",
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
                "targetSource": "Target",
                "targetGroupKey": "tar",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0033_camille_ult_hit"
                ],
                "tagQueryType": "hasAny",
                "buffTagIds": [],
                "countType": "BuffCount",
                "comparison": "LE",
                "value": {
                  "value": 0.0,
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
              "actionType": "SpellInfliction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[33]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 46,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "infliction": {
                "element": "heat",
                "isExtra": false
              }
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[33]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 47,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0033_camille_ult_hit",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ],
                "targetSource": "Target",
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
            }
          ],
          "failActions": [],
          "conditionNegated": [
            false
          ],
          "alwaysNext": true
        },
        {
          "startFrame": 120,
          "endFrame": 120,
          "actionIndex": 48,
          "actionPath": [
            "timelineActions[33]",
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
                "timelineActions[33]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "sequenceActionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 49,
              "legacyBuffFinish": null,
              "skillCooldownAdjustment": null,
              "buffIgnite": null,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.0,
                  "blackboardKey": "atb",
                  "levelValues": [
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    32.0,
                    36.0,
                    36.0,
                    36.0,
                    40.0
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
          "alwaysNext": false,
          "onceScopeKey": "do-once:timelineActions[33]._sequenceActionData.actionData.[1]"
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 69,
          "actionIndex": 9,
          "kind": "normal",
          "priority": -1742631616,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 2.77,
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
          "sequenceIndex": 2,
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
