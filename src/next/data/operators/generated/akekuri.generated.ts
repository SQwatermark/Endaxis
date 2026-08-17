/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const akekuriGeneratedSource = {
  "slug": "akekuri",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0019_karin_potential_3",
      "sourceFile": "buff_chr_0019_karin_potential_3.json",
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
        "hasStackEffects": false
      },
      "blackboard": [
        {
          "key": "atk",
          "value": 0.1,
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
            "blackboardKey": "atk",
            "levelValues": [
              0.1
            ]
          }
        }
      ],
      "damageModifiers": [],
      "directDamageHits": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [],
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
    },
    {
      "buffId": "buff_chr_0019_karin_potential_5_combo",
      "sourceFile": "buff_chr_0019_karin_potential_5_combo.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 5.0,
          "blackboardKey": "potential_5_duration",
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
        "hasStackEffects": false
      },
      "blackboard": [
        {
          "key": "potential_5_duration",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffFinish",
          "orderedActionTypes": [
            "FinishBuffAction"
          ],
          "combatActions": [],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": []
        }
      ],
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
    },
    {
      "buffId": "buff_chr_0019_karin_talent_2",
      "sourceFile": "buff_chr_0019_karin_talent_2.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
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
        "hasStackEffects": false
      },
      "blackboard": [
        {
          "key": "potential_5_duration",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [
        {
          "eventSource": "buff",
          "event": "OnBuffFinish",
          "orderedActionTypes": [
            "IfElseAction"
          ],
          "combatActions": [
            "IfElseAction"
          ],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": [
            "buff_chr_0019_karin_potential_5_combo"
          ]
        }
      ],
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
    },
    {
      "buffId": "buff_chr_0019_karin_talent_2_combo",
      "sourceFile": "buff_chr_0019_karin_talent_2_combo.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Infinity",
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
        "hasStackEffects": false
      },
      "blackboard": [
        {
          "key": "duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "imbue_scale",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [],
      "directDamageHits": [],
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
            "CreateGlobalBuffAction"
          ],
          "combatActions": [],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": []
        }
      ],
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
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
        "hasStackEffects": false
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
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [],
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
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
        "hasStackEffects": false
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
            "SetSuperArmorAction"
          ],
          "combatActions": [],
          "damageUnits": [],
          "buffApplications": [],
          "createdBuffIds": []
        }
      ],
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
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
        "hasStackEffects": false
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
          "createdBuffIds": []
        }
      ],
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
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
        "hasStackEffects": false
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
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [],
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
    }
  ],
  "skills": [
    {
      "key": "basicAttack1",
      "skillId": "chr_0019_karin_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0019_karin_attack1.json",
      "timelineBlockFrames": 14,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 9,
      "allowNextWindows": [
        {
          "startFrame": 14,
          "endFrame": 32,
          "skillIds": [
            "chr_0019_karin_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 1,
          "endFrame": 32,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0019_karin_attack2",
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
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
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
          "startFrame": 9,
          "endFrame": 10,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "CameraImpulseAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 17,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 50,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 180,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 180,
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
          "endFrame": 62,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 65,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 32,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 32,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 9,
          "endFrame": 10,
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
          "sequenceIndex": 4
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
          "startFrame": 9,
          "endFrame": 10,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": []
    },
    {
      "key": "basicAttack2",
      "skillId": "chr_0019_karin_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0019_karin_attack2.json",
      "timelineBlockFrames": 22,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 16,
      "allowNextWindows": [
        {
          "startFrame": 22,
          "endFrame": 38,
          "skillIds": [
            "chr_0019_karin_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 13,
          "endFrame": 38,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0019_karin_attack3",
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
          "endFrame": 112,
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
          "endFrame": 112,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
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
          "startFrame": 16,
          "endFrame": 17,
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
            "FAnimationCurve",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 50,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 15,
          "endFrame": 58,
          "actionTypes": [
            "EffectAction"
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
          "endFrame": 23,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 43,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 82,
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
          "startFrame": 13,
          "endFrame": 38,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 38,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 8,
          "endFrame": 9,
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
                  0.13,
                  0.14,
                  0.15,
                  0.16,
                  0.18,
                  0.19,
                  0.2,
                  0.21,
                  0.23,
                  0.24,
                  0.26,
                  0.28
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
          "startFrame": 16,
          "endFrame": 17,
          "actionIndex": 12,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.5,
                "blackboardKey": "atk_scale_2",
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
          "sequenceIndex": 6
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 8,
          "endFrame": 9,
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
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
          "failActions": []
        },
        {
          "startFrame": 16,
          "endFrame": 17,
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
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
          "failActions": []
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
            0.13,
            0.14,
            0.15,
            0.16,
            0.18,
            0.19,
            0.2,
            0.21,
            0.23,
            0.24,
            0.26,
            0.28
          ],
          "atk_scale_2": [
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
            0.28,
            0.3,
            0.33,
            0.36,
            0.39,
            0.41,
            0.44,
            0.47,
            0.5,
            0.53,
            0.57,
            0.62
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
          "key": "atk_scale_2",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb",
        "atk_scale",
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
          "intervalSeconds": null
        },
        {
          "startFrame": 16,
          "endFrame": 17,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 8,
          "endFrame": 9,
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
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
          "failActions": []
        },
        {
          "startFrame": 16,
          "endFrame": 17,
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
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
          "failActions": []
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": []
    },
    {
      "key": "basicAttack3",
      "skillId": "chr_0019_karin_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0019_karin_attack3.json",
      "timelineBlockFrames": 21,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 10,
      "allowNextWindows": [
        {
          "startFrame": 21,
          "endFrame": 36,
          "skillIds": [
            "chr_0019_karin_attack4"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 11,
          "endFrame": 36,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0019_karin_attack4",
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
          "endFrame": 95,
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
          "endFrame": 95,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
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
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve"
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
          "startFrame": 8,
          "endFrame": 30,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "endFrame": 87,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 25,
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
          "startFrame": 11,
          "endFrame": 36,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 36,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 10,
          "endFrame": 11,
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
                  0.33,
                  0.36,
                  0.39,
                  0.42,
                  0.46,
                  0.49,
                  0.52,
                  0.55,
                  0.59,
                  0.63,
                  0.67,
                  0.73
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
          "startFrame": 10,
          "endFrame": 11,
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
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
          "failActions": []
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
            0.33,
            0.36,
            0.39,
            0.42,
            0.46,
            0.49,
            0.52,
            0.55,
            0.59,
            0.63,
            0.67,
            0.73
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
          "startFrame": 10,
          "endFrame": 11,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 10,
          "endFrame": 11,
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
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
          "failActions": []
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": []
    },
    {
      "key": "basicAttack4",
      "skillId": "chr_0019_karin_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0019_karin_attack4.json",
      "timelineBlockFrames": 35,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 19,
      "allowNextWindows": [
        {
          "startFrame": 35,
          "endFrame": 52,
          "skillIds": [
            "chr_0019_karin_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 24,
          "endFrame": 52,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0019_karin_attack1",
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
          "endFrame": 110,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 18,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "startFrame": 19,
          "endFrame": 20,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "CameraImpulseAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve"
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
            "FAnimationCurve",
            "IfElseAction",
            "ObtainCostAction",
            "CameraImpulseAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 36,
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
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 40,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "endFrame": 110,
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
        },
        {
          "startFrame": 21,
          "endFrame": 77,
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
          "startFrame": 24,
          "endFrame": 52,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 52,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 19,
          "endFrame": 20,
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
          "sequenceIndex": 7
        },
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 18,
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
          "sequenceIndex": 8
        },
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 24,
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
          "actionIndex": 26,
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
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
              "serverActionIndex": 28,
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
                "onlyMainOperator": false,
                "isPercentValue": false,
                "useUltimateRecoveryTag": false,
                "ultimateRecoveryTagId": 0,
                "ignoreUltimateGainScalar": false
              }
            }
          ],
          "failActions": []
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
            0.5,
            0.54,
            0.59,
            0.64,
            0.69,
            0.74,
            0.79,
            0.84,
            0.89,
            0.95,
            1.03,
            1.11
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
          "value": 25.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 0.42,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 18.0,
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
          "startFrame": 19,
          "endFrame": 20,
          "actionIndex": 11,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 12,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 13,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 21,
          "endFrame": 22,
          "actionIndex": 26,
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
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
              "serverActionIndex": 28,
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
                "onlyMainOperator": false,
                "isPercentValue": false,
                "useUltimateRecoveryTag": false,
                "ultimateRecoveryTagId": 0,
                "ignoreUltimateGainScalar": false
              }
            }
          ],
          "failActions": []
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": []
    },
    {
      "key": "finisher",
      "skillId": "chr_0019_karin_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0019_karin_power_attack.json",
      "timelineBlockFrames": 37,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 4,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 37,
          "endFrame": 60,
          "skillIds": [
            "chr_0019_karin_normal_skill",
            "chr_0019_karin_combo_skill"
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
              "skillId": "chr_0019_karin_normal_skill",
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
              "skillId": "chr_0019_karin_combo_skill",
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
          "endFrame": 17,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 23,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 32,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 137,
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
          "startFrame": 16,
          "endFrame": 25,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 137,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 20,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 20,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 36,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 27,
          "actionTypes": [
            "CheckEntityNum",
            "DisableRootMotionAction"
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
          "startFrame": 36,
          "endFrame": 37,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve",
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 37,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve",
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "FAnimationCurve",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "GainBreakingAttackAtb"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 43,
          "actionTypes": [
            "HitStopAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 34,
          "endFrame": 53,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 10,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 34,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 10,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 37,
          "actionTypes": [
            "CheckEntityNum",
            "CameraRotateAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 95,
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
          "startFrame": 15,
          "endFrame": 74,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 15,
          "endFrame": 74,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionTypes": [
            "CreateBuffAction"
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
          "startFrame": 37,
          "endFrame": 60,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 192,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 64,
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
          "startFrame": 12,
          "endFrame": 243,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 64,
          "endFrame": 136,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 46,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionIndex": 19,
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
                "value": 0.2,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 132
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 13
        },
        {
          "startFrame": 36,
          "endFrame": 37,
          "actionIndex": 27,
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
          "sequenceIndex": 14
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionIndex": 60,
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
          "sequenceIndex": 24
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionIndex": 64,
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
          "sequenceIndex": 28
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
          "startFrame": 13,
          "endFrame": 14,
          "actionIndex": 17,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 36,
          "endFrame": 37,
          "actionIndex": 18,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": []
    },
    {
      "key": "plungingAttack",
      "skillId": "chr_0019_karin_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0019_karin_plunging_attack_end.json",
      "timelineBlockFrames": 14,
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
          "endFrame": 95,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector",
            "FAnimationCurve"
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
            "FAnimationCurve",
            "IfElseAction",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 5,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
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
          "endFrame": 95,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 58,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 87,
          "actionTypes": [
            "PlaySoundAction"
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
              "mainOperator": {
                "targetSource": "Source",
                "targetGroupKey": "tar"
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
          "failActions": []
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 1,
          "endFrame": 6,
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
              "mainOperator": {
                "targetSource": "Source",
                "targetGroupKey": "tar"
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
          "failActions": []
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": []
    },
    {
      "key": "battleSkill",
      "skillId": "chr_0019_karin_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0019_karin_normal_skill.json",
      "timelineBlockFrames": 41,
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
          "endFrame": 125,
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
          "endFrame": 125,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 21,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 45,
          "actionTypes": [
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 45,
          "actionTypes": [
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
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
            "FAnimationCurve",
            "CurveEvaluateFloat",
            "FAnimationCurve",
            "CameraRotateAction",
            "FAnimationCurve"
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
          "startFrame": 20,
          "endFrame": 21,
          "actionTypes": [
            "SpellInfliction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "BlowOffEnemyAction",
            "CameraImpulseAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionTypes": [
            "IfElseAction",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 20,
          "actionTypes": []
        },
        {
          "startFrame": 8,
          "endFrame": 30,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 40,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 40,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 0,
          "endFrame": 36,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 105,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 122,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 65,
          "damageUnits": [
            {
              "damageType": "Fire",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  1.42,
                  1.56,
                  1.71,
                  1.85,
                  1.99,
                  2.13,
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
          "sequenceIndex": 9
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 70,
          "actionPath": [
            "timelineActions[10]",
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
              "damageDecorateMask": null,
              "contextBuffId": null
            }
          ],
          "succeedActions": [
            {
              "actionType": "CreateBuffAction",
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
              "serverActionIndex": 72,
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
          "failActions": []
        }
      ],
      "inflictions": [
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 64,
          "element": "heat",
          "isExtra": false,
          "sequenceIndex": 9
        }
      ],
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
            1.42,
            1.56,
            1.71,
            1.85,
            1.99,
            2.13,
            2.28,
            2.42,
            2.56,
            2.74,
            2.95,
            3.2
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
          "key": "input_angle",
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
        "cam_angle",
        "input_angle",
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
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "DamageAction",
        "IfElseAction",
        "SpellInfliction"
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
          "intervalSeconds": null
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
          "intervalSeconds": null
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
          "intervalSeconds": null
        },
        {
          "startFrame": 0,
          "endFrame": 125,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 16,
          "endFrame": 21,
          "actionIndex": 28,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 63,
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
          "intervalSeconds": null
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
              "damageDecorateMask": null,
              "contextBuffId": null
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
              "serverActionIndex": 3
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
              "serverActionIndex": 4
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
              "serverActionIndex": 6
            }
          ],
          "failActions": []
        },
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 70,
          "actionPath": [
            "timelineActions[10]",
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
              "damageDecorateMask": null,
              "contextBuffId": null
            }
          ],
          "succeedActions": [
            {
              "actionType": "CreateBuffAction",
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
              "serverActionIndex": 72,
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
          "failActions": []
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": []
    },
    {
      "key": "comboSkill",
      "skillId": "chr_0019_karin_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0019_karin_combo_skill.json",
      "timelineBlockFrames": 38,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 38,
          "endFrame": 71,
          "skillIds": [
            "chr_0019_karin_normal_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 71,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0019_karin_normal_skill",
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
          "endFrame": 136,
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
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "Selector",
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 21,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 136,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 26,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "StoreAttributeValue",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ObtainCostAction",
            "DamageAction",
            "Selector",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "Selector",
            "FAnimationCurve",
            "IfElseAction",
            "HitStopAction",
            "FAnimationCurve",
            "Selector",
            "CameraImpulseAction",
            "FAnimationCurve",
            "ModifyDynamicBlackboard",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 36,
          "actionTypes": [
            "ModifyDynamicBlackboard",
            "FindTargetAction",
            "Selector",
            "IfElseAction",
            "ObtainCostAction",
            "DamageAction",
            "Selector",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "Selector",
            "FAnimationCurve",
            "IfElseAction",
            "ModifyDynamicBlackboard",
            "HitStopAction",
            "FAnimationCurve",
            "Selector",
            "CameraImpulseAction",
            "FAnimationCurve",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 45,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 57,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 30,
          "actionTypes": [
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 30,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "TimeDilationAction",
            "FAnimationCurve",
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
          "endFrame": 21,
          "actionTypes": [
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 71,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 71,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 55,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 0,
          "endFrame": 176,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 100,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 52,
          "endFrame": 100,
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
          "startFrame": 22,
          "endFrame": 26,
          "actionIndex": 27,
          "damageUnits": [
            {
              "damageType": "Physical",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
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
          "sequenceIndex": 6
        },
        {
          "startFrame": 31,
          "endFrame": 36,
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
          "sequenceIndex": 7
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 22,
          "endFrame": 26,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[6]",
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
              "damageDecorateMask": null,
              "contextBuffId": null
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
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 19,
              "blackboardMutation": {
                "key": "sub_ratio",
                "operation": "Divide",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "rate",
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
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 21,
              "blackboardMutation": {
                "key": "max_ratio",
                "operation": "Add",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 22,
              "nestedCondition": {
                "startFrame": 22,
                "endFrame": 26,
                "actionIndex": 22,
                "actionPath": [
                  "timelineActions[6]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "succeedActions",
                  "actionData",
                  "[3]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LT",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "atb_up",
                      "levelValues": null
                    },
                    "right": {
                      "value": 0.0,
                      "blackboardKey": "max_ratio",
                      "levelValues": null
                    },
                    "skillTypes": [],
                    "damageDecorateMask": null,
                    "contextBuffId": null
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
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 24,
                    "blackboardMutation": {
                      "key": "atb",
                      "operation": "Multiply",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": "atb_up",
                        "levelValues": null
                      }
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[6]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 25,
                    "blackboardMutation": {
                      "key": "atb",
                      "operation": "Multiply",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": "max_ratio",
                        "levelValues": null
                      }
                    }
                  }
                ]
              }
            },
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 4,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[4]"
              ],
              "serverActionIndex": 26,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.2,
                  "blackboardKey": "atb",
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
                    7.5,
                    7.5,
                    7.5
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
          "failActions": []
        },
        {
          "startFrame": 22,
          "endFrame": 26,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[6]",
            "_sequenceActionData",
            "actionData",
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
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "skillTypes": [],
              "damageDecorateMask": null,
              "contextBuffId": null
            }
          ],
          "succeedActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 33,
              "blackboardMutation": {
                "key": "count",
                "operation": "Add",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 34,
              "resourceGain": {
                "resource": "ultimateEnergy",
                "amount": {
                  "value": 0.2,
                  "blackboardKey": "usp",
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
          "failActions": []
        },
        {
          "startFrame": 31,
          "endFrame": 36,
          "actionIndex": 37,
          "actionPath": [
            "timelineActions[7]",
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
                "targetGroupKey": "tar",
                "minimumCount": 1,
                "comparison": "GE",
                "containsHittableTarget": false,
                "excludeDeadEntity": false,
                "storeKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
              "serverActionIndex": 39,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.2,
                  "blackboardKey": "atb",
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
                    7.5,
                    7.5,
                    7.5
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
          "failActions": []
        },
        {
          "startFrame": 31,
          "endFrame": 36,
          "actionIndex": 42,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[5]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "Equals",
              "left": {
                "value": 0.0,
                "blackboardKey": "count",
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "skillTypes": [],
              "damageDecorateMask": null,
              "contextBuffId": null
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
                "[5]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 44,
              "blackboardMutation": {
                "key": "count",
                "operation": "Add",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[5]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 47,
              "resourceGain": {
                "resource": "ultimateEnergy",
                "amount": {
                  "value": 0.2,
                  "blackboardKey": "usp",
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
          "failActions": []
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [
        {
          "startFrame": 31,
          "endFrame": 36,
          "actionIndex": 35,
          "key": "count",
          "operation": "Assign",
          "value": {
            "value": 0.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 7
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
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5,
            7.5
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
          ],
          "usp": [
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
          9.0
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
          "isDynamic": true
        },
        {
          "key": "atb_up",
          "value": 1.0,
          "isDynamic": true
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
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "max_ratio",
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
          "key": "rate",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "sub_ratio",
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
        "atb",
        "atb_up",
        "atk_scale",
        "count",
        "max_ratio",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
        "rate",
        "select_radius",
        "sub_ratio",
        "usp"
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
          "key": "atb_up",
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
          "mutatedLocally": true,
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
          "key": "max_ratio",
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
          "key": "sub_ratio",
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
        "IfElseAction",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[3]",
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
          "intervalSeconds": null
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[3]",
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
          "intervalSeconds": null
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 5,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[2]"
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
          "intervalSeconds": null
        },
        {
          "startFrame": 22,
          "endFrame": 26,
          "actionIndex": 16,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 31,
          "endFrame": 36,
          "actionIndex": 36,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[1]"
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
          "intervalSeconds": null
        },
        {
          "startFrame": 0,
          "endFrame": 16,
          "actionIndex": 57,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 22,
          "endFrame": 26,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[6]",
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
              "damageDecorateMask": null,
              "contextBuffId": null
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
                "[1]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 19,
              "blackboardMutation": {
                "key": "sub_ratio",
                "operation": "Divide",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "rate",
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
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 21,
              "blackboardMutation": {
                "key": "max_ratio",
                "operation": "Add",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 22,
              "nestedCondition": {
                "startFrame": 22,
                "endFrame": 26,
                "actionIndex": 22,
                "actionPath": [
                  "timelineActions[6]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "succeedActions",
                  "actionData",
                  "[3]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "LT",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "atb_up",
                      "levelValues": null
                    },
                    "right": {
                      "value": 0.0,
                      "blackboardKey": "max_ratio",
                      "levelValues": null
                    },
                    "skillTypes": [],
                    "damageDecorateMask": null,
                    "contextBuffId": null
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
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[3]",
                      "succeedActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 24,
                    "blackboardMutation": {
                      "key": "atb",
                      "operation": "Multiply",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": "atb_up",
                        "levelValues": null
                      }
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[6]",
                      "_sequenceActionData",
                      "actionData",
                      "[1]",
                      "succeedActions",
                      "actionData",
                      "[3]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 25,
                    "blackboardMutation": {
                      "key": "atb",
                      "operation": "Multiply",
                      "value": {
                        "value": 0.0,
                        "blackboardKey": "max_ratio",
                        "levelValues": null
                      }
                    }
                  }
                ]
              }
            },
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 4,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[4]"
              ],
              "serverActionIndex": 26,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.2,
                  "blackboardKey": "atb",
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
                    7.5,
                    7.5,
                    7.5
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
          "failActions": []
        },
        {
          "startFrame": 22,
          "endFrame": 26,
          "actionIndex": 29,
          "actionPath": [
            "timelineActions[6]",
            "_sequenceActionData",
            "actionData",
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
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "skillTypes": [],
              "damageDecorateMask": null,
              "contextBuffId": null
            }
          ],
          "succeedActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 33,
              "blackboardMutation": {
                "key": "count",
                "operation": "Add",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[4]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 34,
              "resourceGain": {
                "resource": "ultimateEnergy",
                "amount": {
                  "value": 0.2,
                  "blackboardKey": "usp",
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
          "failActions": []
        },
        {
          "startFrame": 31,
          "endFrame": 36,
          "actionIndex": 37,
          "actionPath": [
            "timelineActions[7]",
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
                "targetGroupKey": "tar",
                "minimumCount": 1,
                "comparison": "GE",
                "containsHittableTarget": false,
                "excludeDeadEntity": false,
                "storeKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
              "serverActionIndex": 39,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 0.2,
                  "blackboardKey": "atb",
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
                    7.5,
                    7.5,
                    7.5
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
          "failActions": []
        },
        {
          "startFrame": 31,
          "endFrame": 36,
          "actionIndex": 42,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[5]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "Equals",
              "left": {
                "value": 0.0,
                "blackboardKey": "count",
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "skillTypes": [],
              "damageDecorateMask": null,
              "contextBuffId": null
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
                "[5]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 44,
              "blackboardMutation": {
                "key": "count",
                "operation": "Add",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 3,
              "actionPath": [
                "timelineActions[7]",
                "_sequenceActionData",
                "actionData",
                "[5]",
                "succeedActions",
                "actionData",
                "[3]"
              ],
              "serverActionIndex": 47,
              "resourceGain": {
                "resource": "ultimateEnergy",
                "amount": {
                  "value": 0.2,
                  "blackboardKey": "usp",
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
          "failActions": []
        },
        {
          "startFrame": 0,
          "endFrame": 16,
          "actionIndex": 55,
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
              "mainOperator": {
                "targetSource": "Owner",
                "targetGroupKey": ""
              },
              "damageDecorateMask": null,
              "contextBuffId": null
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
              "serverActionIndex": 57
            }
          ]
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionIndex": 54,
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
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 12
        }
      ]
    },
    {
      "key": "ultimate",
      "skillId": "chr_0019_karin_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0019_karin_ultimate_skill.json",
      "timelineBlockFrames": 129,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 100.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 129,
          "endFrame": 201,
          "skillIds": [
            "chr_0019_karin_normal_skill",
            "chr_0019_karin_attack1",
            "chr_0019_karin_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 120,
          "endFrame": 201,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0019_karin_normal_skill",
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
              "cmdType": "Attack",
              "skillId": "chr_0019_karin_attack1",
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
              "skillId": "chr_0019_karin_combo_skill",
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
          "endFrame": 225,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 225,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 150,
          "actionTypes": [
            "CompareFloat",
            "CreateBuffAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "TimeDilationAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionTypes": [
            "StoreAttributeValue",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 59,
          "endFrame": 83,
          "actionTypes": [
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 115,
          "actionTypes": [
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 119,
          "endFrame": 159,
          "actionTypes": [
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "TeleportPosSelectAction"
          ]
        },
        {
          "startFrame": 59,
          "endFrame": 62,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 89,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 119,
          "endFrame": 122,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 150,
          "actionTypes": [
            "CompareFloat",
            "CreateBuffAction",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 98,
          "actionTypes": [
            "AnimatedCameraAction",
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 57,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 119,
          "actionTypes": [
            "ChannelingCastingAction"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 201,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 129,
          "endFrame": 201,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 83,
          "actionTypes": [
            "CreateBuffAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 55,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 55,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 57,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 57,
          "actionTypes": []
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
          "endFrame": 89,
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
          "startFrame": 0,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 44,
          "endFrame": 98,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 56,
          "endFrame": 122,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 58,
          "endFrame": 136,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 58,
          "endFrame": 136,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 58,
          "endFrame": 136,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 170,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 170,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 86,
          "endFrame": 170,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 119,
          "endFrame": 201,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 119,
          "endFrame": 201,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 119,
          "endFrame": 201,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 181,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 181,
          "endFrame": 225,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 263,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 163,
          "endFrame": 249,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
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
                "blackboardKey": "atb_up",
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": "max_ratio",
                "levelValues": null
              },
              "skillTypes": [],
              "damageDecorateMask": null,
              "contextBuffId": null
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
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 9,
              "blackboardMutation": {
                "key": "atb_1",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "atb_up",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
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
              "serverActionIndex": 10,
              "blackboardMutation": {
                "key": "atb_2",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "atb_up",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 11,
              "blackboardMutation": {
                "key": "atb_3",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "atb_up",
                  "levelValues": null
                }
              }
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
                "[2]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 12,
              "blackboardMutation": {
                "key": "atb_1",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "max_ratio",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 13,
              "blackboardMutation": {
                "key": "atb_2",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "max_ratio",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
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
              "serverActionIndex": 14,
              "blackboardMutation": {
                "key": "atb_3",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "max_ratio",
                  "levelValues": null
                }
              }
            }
          ]
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 150,
          "actionIndex": 3,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0019_karin_potential_3",
          "classification": null,
          "targetSource": "InstantSearch",
          "targetGroupKey": "",
          "count": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "buffSource": "ActionSource",
          "inheritSourceSkillCastInfo": true,
          "blackboardAssignments": {
            "atk": {
              "value": 0.0,
              "blackboardKey": "atk",
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
          "targetFinderType": "CharacterTeamFinder",
          "sequenceIndex": 2
        },
        {
          "startFrame": 1,
          "endFrame": 150,
          "actionIndex": 28,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0019_karin_talent_2",
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
            "potential_5_duration": {
              "value": 0.0,
              "blackboardKey": "potential_5_duration",
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
          "sequenceIndex": 12
        },
        {
          "startFrame": 1,
          "endFrame": 150,
          "actionIndex": 29,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0019_karin_talent_2_combo",
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
            "imbue_scale": {
              "value": 0.0,
              "blackboardKey": "imbue_scale",
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
            }
          },
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 12
        },
        {
          "startFrame": 0,
          "endFrame": 83,
          "actionIndex": 41,
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
          "sequenceIndex": 18
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionIndex": 6,
          "key": "max_ratio",
          "operation": "Add",
          "value": {
            "value": 1.0,
            "blackboardKey": null,
            "levelValues": null
          },
          "sequenceIndex": 4
        }
      ],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [
        {
          "startFrame": 59,
          "endFrame": 83,
          "actionIndex": 15,
          "resource": "sp",
          "amount": {
            "value": 0.0,
            "blackboardKey": "atb_1",
            "levelValues": [
              19.0,
              19.0,
              20.0,
              21.0,
              21.0,
              22.0,
              23.0,
              23.0,
              24.0,
              25.0,
              25.0,
              26.0
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 5
        },
        {
          "startFrame": 86,
          "endFrame": 115,
          "actionIndex": 16,
          "resource": "sp",
          "amount": {
            "value": 0.0,
            "blackboardKey": "atb_2",
            "levelValues": [
              19.0,
              20.0,
              21.0,
              21.0,
              22.0,
              23.0,
              23.0,
              24.0,
              25.0,
              25.0,
              26.0,
              27.0
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 6
        },
        {
          "startFrame": 119,
          "endFrame": 159,
          "actionIndex": 17,
          "resource": "sp",
          "amount": {
            "value": 0.0,
            "blackboardKey": "atb_3",
            "levelValues": [
              20.0,
              21.0,
              21.0,
              22.0,
              23.0,
              23.0,
              24.0,
              25.0,
              25.0,
              26.0,
              27.0,
              27.0
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
          "ignoreUltimateGainScalar": false,
          "onceActionValueKey": null,
          "sequenceIndex": 7
        }
      ],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0019_karin_potential_3",
        "buff_chr_0019_karin_talent_2",
        "buff_chr_0019_karin_talent_2_combo",
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
          "atb_1": [
            19.0,
            19.0,
            20.0,
            21.0,
            21.0,
            22.0,
            23.0,
            23.0,
            24.0,
            25.0,
            25.0,
            26.0
          ],
          "atb_2": [
            19.0,
            20.0,
            21.0,
            21.0,
            22.0,
            23.0,
            23.0,
            24.0,
            25.0,
            25.0,
            26.0,
            27.0
          ],
          "atb_3": [
            20.0,
            21.0,
            21.0,
            22.0,
            23.0,
            23.0,
            24.0,
            25.0,
            25.0,
            26.0,
            27.0,
            27.0
          ],
          "atb_display": [
            58.0,
            60.0,
            62.0,
            64.0,
            66.0,
            68.0,
            70.0,
            72.0,
            74.0,
            76.0,
            78.0,
            80.0
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
          120.0,
          120.0,
          120.0,
          120.0,
          120.0,
          120.0,
          120.0,
          120.0,
          120.0,
          120.0,
          120.0,
          120.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "atb_1",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atb_2",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atb_3",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atb_up",
          "value": 1.0,
          "isDynamic": true
        },
        {
          "key": "atk",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "combo",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "imbue_scale",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "max_ratio",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "potential_3",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential_5_duration",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "sub_ratio",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atb_1",
        "atb_2",
        "atb_3",
        "atb_up",
        "combo",
        "max_ratio",
        "potential_3",
        "sub_ratio"
      ],
      "blackboardProvenance": [
        {
          "key": "atb_1",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb_2",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb_3",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb_display",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atb_up",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "combo",
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
          "key": "imbue_scale",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "max_ratio",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": true,
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
          "key": "potential_5_duration",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "sub_ratio",
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
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "main_char",
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
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
                "blackboardKey": "atb_up",
                "levelValues": null
              },
              "right": {
                "value": 0.0,
                "blackboardKey": "max_ratio",
                "levelValues": null
              },
              "skillTypes": [],
              "damageDecorateMask": null,
              "contextBuffId": null
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
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 9,
              "blackboardMutation": {
                "key": "atb_1",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "atb_up",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
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
              "serverActionIndex": 10,
              "blackboardMutation": {
                "key": "atb_2",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "atb_up",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 11,
              "blackboardMutation": {
                "key": "atb_3",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "atb_up",
                  "levelValues": null
                }
              }
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
                "[2]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 12,
              "blackboardMutation": {
                "key": "atb_1",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "max_ratio",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[4]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "failActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 13,
              "blackboardMutation": {
                "key": "atb_2",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "max_ratio",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
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
              "serverActionIndex": 14,
              "blackboardMutation": {
                "key": "atb_3",
                "operation": "Multiply",
                "value": {
                  "value": 0.0,
                  "blackboardKey": "max_ratio",
                  "levelValues": null
                }
              }
            }
          ]
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
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 3
        },
        {
          "startFrame": 0,
          "endFrame": 55,
          "actionIndex": 43,
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
          "influenceSkillCooldown": null,
          "targetScale": 0.0,
          "sequenceIndex": 20
        }
      ]
    }
  ]
} as const satisfies GeneratedOperatorSource;
