/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const gilbertaGeneratedSource = {
  "slug": "gilberta",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0013_aglina_combo_skill_tutorial_marker",
      "sourceFile": "buff_chr_0013_aglina_combo_skill_tutorial_marker.json",
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
        "hasStackEffects": false
      },
      "blackboard": [],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
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
      "skillId": "chr_0013_aglina_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0013_aglina_attack1.json",
      "timelineBlockFrames": 18,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 7,
      "allowNextWindows": [
        {
          "startFrame": 18,
          "endFrame": 30,
          "skillIds": [
            "chr_0013_aglina_attack2"
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
              "skillId": "chr_0013_aglina_attack2",
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
          "endFrame": 91,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 7,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction",
            "FAnimationCurve"
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
          "endFrame": 45,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 12,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "endFrame": 17,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 10,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 25,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 91,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 91,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 91,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 18,
          "endFrame": 30,
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
          "projectileId": "projectile_chr_0013_aglina_normal_attack1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0013_aglina_attack1_projhit"
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
          "projectileId": "projectile_chr_0013_aglina_normal_attack1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0013_aglina_attack1_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0013_aglina_attack1_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
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
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
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
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
              "failActions": []
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
          "value": 0.45,
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
      "skillId": "chr_0013_aglina_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0013_aglina_attack2.json",
      "timelineBlockFrames": 22,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 11,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 4,
      "allowNextWindows": [
        {
          "startFrame": 22,
          "endFrame": 29,
          "skillIds": [
            "chr_0013_aglina_attack3"
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
              "skillId": "chr_0013_aglina_attack3",
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
          "endFrame": 118,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 4,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 8,
          "actionTypes": [
            "LaunchProjectile",
            "CameraImpulseAction",
            "FAnimationCurve"
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
          "endFrame": 12,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 75,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 7,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 47,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 51,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 8,
          "endFrame": 67,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 80,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 80,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 19,
          "actionTypes": [
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "startFrame": 8,
          "endFrame": 12,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 8,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 21,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "endFrame": 63,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 94,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 22,
          "endFrame": 29,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 35,
          "actionTypes": [
            "EffectAction"
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
          "launchFrame": 4,
          "projectileId": "projectile_chr_0013_aglina_normal_attack2",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0013_aglina_attack2_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 8,
          "projectileId": "projectile_chr_0013_aglina_normal_attack2",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0013_aglina_attack2_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 4,
          "actionOrder": [
            2
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0013_aglina_normal_attack2",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0013_aglina_attack2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0013_aglina_attack2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
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
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
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
                  "damageDecorateMask": 128
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 2,
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
              "ignoreUltimateGainScalar": false,
              "onceActionValueKey": null,
              "sequenceIndex": 0
            }
          ],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 8,
          "actionOrder": [
            6
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0013_aglina_normal_attack2",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0013_aglina_attack2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0013_aglina_attack2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
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
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.0,
                    "blackboardKey": "atk_scale",
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
                  "damageDecorateMask": 128
                }
              ],
              "timedMarkerGate": null,
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 2,
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
              "ignoreUltimateGainScalar": false,
              "onceActionValueKey": null,
              "sequenceIndex": 0
            }
          ],
          "inflictions": [],
          "combatActions": [
            "DamageAction",
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
          "value": 0.52,
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
          "startFrame": 4,
          "endFrame": 4,
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
      "key": "basicAttack3",
      "skillId": "chr_0013_aglina_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0013_aglina_attack3.json",
      "timelineBlockFrames": 23,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 13,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 7,
      "allowNextWindows": [
        {
          "startFrame": 23,
          "endFrame": 38,
          "skillIds": [
            "chr_0013_aglina_attack4"
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
              "skillId": "chr_0013_aglina_attack4",
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
          "startFrame": 7,
          "endFrame": 8,
          "actionTypes": [
            "LaunchProjectile",
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "LaunchProjectile",
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 15,
          "actionTypes": [
            "LaunchProjectile",
            "CameraImpulseAction",
            "FAnimationCurve"
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
          "endFrame": 80,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 6,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 47,
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
          "startFrame": 8,
          "endFrame": 56,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 68,
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
          "startFrame": 16,
          "endFrame": 75,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 80,
          "endFrame": 129,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 73,
          "endFrame": 126,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 68,
          "endFrame": 123,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 80,
          "endFrame": 138,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 80,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 20,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 10,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 68,
          "endFrame": 138,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 68,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 25,
          "actionTypes": [
            "CharWeaponAnimationAction"
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
          "startFrame": 73,
          "endFrame": 138,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 73,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 33,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 30,
          "actionTypes": [
            "VoiceTriggerAction"
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
          "startFrame": 6,
          "endFrame": 26,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 29,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 33,
          "actionTypes": [
            "PlaySoundAction"
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
        },
        {
          "startFrame": 0,
          "endFrame": 35,
          "actionTypes": [
            "EffectAction"
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
          "projectileId": "projectile_chr_0013_aglina_normal_attack3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0013_aglina_attack3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 10,
          "projectileId": "projectile_chr_0013_aglina_normal_attack3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0013_aglina_attack3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 14,
          "projectileId": "projectile_chr_0013_aglina_normal_attack3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0013_aglina_attack3_projhit"
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
            1
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0013_aglina_normal_attack3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0013_aglina_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0013_aglina_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.14,
                  0.15,
                  0.16,
                  0.18,
                  0.19,
                  0.2,
                  0.22,
                  0.23,
                  0.24,
                  0.26,
                  0.28,
                  0.3
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
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.14,
                      0.15,
                      0.16,
                      0.18,
                      0.19,
                      0.2,
                      0.22,
                      0.23,
                      0.24,
                      0.26,
                      0.28,
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
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                    "onlyMainOperator": true,
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
          "launchFrame": 10,
          "actionOrder": [
            5
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0013_aglina_normal_attack3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0013_aglina_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0013_aglina_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.14,
                  0.15,
                  0.16,
                  0.18,
                  0.19,
                  0.2,
                  0.22,
                  0.23,
                  0.24,
                  0.26,
                  0.28,
                  0.3
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
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.14,
                      0.15,
                      0.16,
                      0.18,
                      0.19,
                      0.2,
                      0.22,
                      0.23,
                      0.24,
                      0.26,
                      0.28,
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
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                    "onlyMainOperator": true,
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
            9
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0013_aglina_normal_attack3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0013_aglina_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0013_aglina_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.14,
                  0.15,
                  0.16,
                  0.18,
                  0.19,
                  0.2,
                  0.22,
                  0.23,
                  0.24,
                  0.26,
                  0.28,
                  0.3
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
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.14,
                      0.15,
                      0.16,
                      0.18,
                      0.19,
                      0.2,
                      0.22,
                      0.23,
                      0.24,
                      0.26,
                      0.28,
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
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                    "onlyMainOperator": true,
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
            0.14,
            0.15,
            0.16,
            0.18,
            0.19,
            0.2,
            0.22,
            0.23,
            0.24,
            0.26,
            0.28,
            0.3
          ],
          "display_atk_scale": [
            0.41,
            0.45,
            0.49,
            0.53,
            0.57,
            0.61,
            0.65,
            0.69,
            0.73,
            0.78,
            0.84,
            0.91
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
          "value": 0.33,
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
      "timeDilations": []
    },
    {
      "key": "basicAttack4",
      "skillId": "chr_0013_aglina_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0013_aglina_attack4.json",
      "timelineBlockFrames": 40,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 13,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 23,
      "allowNextWindows": [
        {
          "startFrame": 40,
          "endFrame": 50,
          "skillIds": [
            "chr_0013_aglina_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 50,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0013_aglina_attack1",
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
          "endFrame": 147,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 23,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 25,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 27,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 13,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 42,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
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
          "startFrame": 19,
          "endFrame": 29,
          "actionTypes": [
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "endFrame": 50,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionTypes": [
            "CheckSquadInFight",
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 92,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 92,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 92,
          "actionTypes": [
            "EffectAction"
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
          "endFrame": 147,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "endFrame": 147,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 19,
          "actionTypes": [
            "CharWeaponAnimationAction"
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
          "endFrame": 147,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 16,
          "endFrame": 19,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 19,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 78,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 87,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 42,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 50,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 4,
          "endFrame": 52,
          "actionTypes": [
            "EffectAction"
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
          "projectileId": "projectile_chr_0013_aglina_normal_attack4",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0013_aglina_attack4_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 25,
          "projectileId": "projectile_chr_0013_aglina_normal_attack4_2",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0013_aglina_attack4_projhit_2"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 27,
          "projectileId": "projectile_chr_0013_aglina_normal_attack4_1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0013_aglina_attack4_projhit_2"
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
            2
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0013_aglina_normal_attack4",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0013_aglina_attack4_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0013_aglina_attack4_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
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
                "blackboardKey": null,
                "levelValues": [
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459,
                  5.440000057220459
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
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
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
                    "blackboardKey": null,
                    "levelValues": [
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459,
                      5.440000057220459
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
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                        16.0,
                        16.0,
                        16.0,
                        16.0,
                        16.0,
                        16.0
                      ]
                    },
                    "coefficient": {
                      "value": 0.3334,
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
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0013_aglina_normal_attack4_2",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0013_aglina_attack4_projhit_2",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0013_aglina_attack4_projhit_2.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
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
                "blackboardKey": null,
                "levelValues": [
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835
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
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
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
                    "blackboardKey": null,
                    "levelValues": [
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835
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
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                        16.0,
                        16.0,
                        16.0,
                        16.0,
                        16.0,
                        16.0
                      ]
                    },
                    "coefficient": {
                      "value": 0.3334,
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
          "launchFrame": 27,
          "actionOrder": [
            6
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0013_aglina_normal_attack4_1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0013_aglina_attack4_projhit_2",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0013_aglina_attack4_projhit_2.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
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
                "blackboardKey": null,
                "levelValues": [
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835,
                  5.28000020980835
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
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
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
                    "blackboardKey": null,
                    "levelValues": [
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835,
                      5.28000020980835
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
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                        16.0,
                        16.0,
                        16.0,
                        16.0,
                        16.0,
                        16.0
                      ]
                    },
                    "coefficient": {
                      "value": 0.3334,
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
            0.37
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
            0.96,
            1.04,
            1.12
          ],
          "poise": [
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
          "endFrame": 23,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 25,
          "endFrame": 25,
          "actionIndex": 3,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 27,
          "endFrame": 27,
          "actionIndex": 5,
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
      "key": "finisher",
      "skillId": "chr_0013_aglina_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0013_aglina_power_attack.json",
      "timelineBlockFrames": 43,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 4,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 43,
          "endFrame": 50,
          "skillIds": [
            "chr_0013_aglina_normal_skill",
            "chr_0013_aglina_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 50,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0013_aglina_normal_skill",
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
              "skillId": "chr_0013_aglina_combo_skill",
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
          "endFrame": 125,
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
          "startFrame": 12,
          "endFrame": 12,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "FAnimationCurve",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 15,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "FAnimationCurve",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 18,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "FAnimationCurve",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "FAnimationCurve",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 24,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "FAnimationCurve",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 29,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "FAnimationCurve",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 52,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "GainBreakingAttackAtb",
            "CameraImpulseAction",
            "FAnimationCurve",
            "PlaySoundAction",
            "EnemyHurtAnimAction",
            "FAnimationCurve"
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
          "startFrame": 2,
          "endFrame": 61,
          "actionTypes": [
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 43,
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
          "endFrame": 4,
          "actionTypes": [
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 46,
          "actionTypes": [
            "MoveToAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "endFrame": 65,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 41,
          "endFrame": 100,
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
          "endFrame": 43,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 50,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 125,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 125,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 125,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 125,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 125,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 125,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 89,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 42,
          "endFrame": 103,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 106,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 0,
          "endFrame": 106,
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
          "startFrame": 0,
          "endFrame": 106,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 12,
          "endFrame": 12,
          "actionIndex": 2,
          "damageUnits": [
            {
              "damageType": "Natural",
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
          "sequenceIndex": 2
        },
        {
          "startFrame": 15,
          "endFrame": 15,
          "actionIndex": 6,
          "damageUnits": [
            {
              "damageType": "Natural",
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
          "sequenceIndex": 3
        },
        {
          "startFrame": 18,
          "endFrame": 18,
          "actionIndex": 10,
          "damageUnits": [
            {
              "damageType": "Natural",
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
          "sequenceIndex": 4
        },
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionIndex": 14,
          "damageUnits": [
            {
              "damageType": "Natural",
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
          "sequenceIndex": 5
        },
        {
          "startFrame": 24,
          "endFrame": 24,
          "actionIndex": 18,
          "damageUnits": [
            {
              "damageType": "Natural",
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
          "sequenceIndex": 6
        },
        {
          "startFrame": 29,
          "endFrame": 29,
          "actionIndex": 22,
          "damageUnits": [
            {
              "damageType": "Natural",
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
          "sequenceIndex": 7
        },
        {
          "startFrame": 43,
          "endFrame": 52,
          "actionIndex": 26,
          "damageUnits": [
            {
              "damageType": "Natural",
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
          "sequenceIndex": 8
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionIndex": 45,
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
          "sequenceIndex": 19
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionIndex": 46,
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
          "sequenceIndex": 20
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
          "value": 0.3,
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
      "timeDilations": []
    },
    {
      "key": "plungingAttack",
      "skillId": "chr_0013_aglina_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0013_aglina_plunging_attack_end.json",
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
          "endFrame": 94,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 4,
          "actionTypes": [
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 5,
          "actionTypes": [
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "PushBackAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "IfElseAction",
            "ObtainCostAction",
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
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
          "endFrame": 30,
          "actionTypes": [
            "EffectAction"
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
          "endFrame": 34,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 0,
          "endFrame": 70,
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
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 0,
          "endFrame": 5,
          "actionIndex": 2,
          "damageUnits": [
            {
              "damageType": "Natural",
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
          "startFrame": 0,
          "endFrame": 5,
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
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 7,
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
          "startFrame": 0,
          "endFrame": 4,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 5,
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
                "timelineActions[2]",
                "_sequenceActionData",
                "actionData",
                "[3]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 7,
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
      "skillId": "chr_0013_aglina_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0013_aglina_normal_skill.json",
      "timelineBlockFrames": 123,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 100.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 123,
          "endFrame": 148,
          "skillIds": [
            "chr_0013_aglina_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 148,
          "mappings": [
            {
              "cmdType": "ComboSkill",
              "skillId": "chr_0013_aglina_combo_skill",
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
          "endFrame": 203,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 12,
          "actionTypes": [
            "ConvertToTargetContext",
            "Selector",
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 108,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 99,
          "actionTypes": [
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionTypes": [
            "SpawnAbilityEntity"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 30,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 46,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 62,
          "endFrame": 62,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 78,
          "endFrame": 78,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 108,
          "endFrame": 109,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "InterruptAction",
            "SpellInfliction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "CameraImpulseAction",
            "FAnimationCurve",
            "PlaySoundAction",
            "HealAction",
            "Selector",
            "Selector",
            "MultiplyAttributeCalculation"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 111,
          "actionTypes": [
            "ChannelingCastingAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 135,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 199,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 179,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 154,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 148,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 165,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 62,
          "endFrame": 181,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 78,
          "endFrame": 197,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 105,
          "endFrame": 209,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 106,
          "endFrame": 140,
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
          "endFrame": 15,
          "actionTypes": [
            "SaveTwoDirectionAngle",
            "CurveEvaluateFloat",
            "FAnimationCurve",
            "CurveEvaluateFloat",
            "FAnimationCurve",
            "CameraRotateAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 148,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 123,
          "endFrame": 148,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 1,
          "endFrame": 46,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 106,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 164,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 164,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 164,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 164,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 29,
          "endFrame": 30,
          "actionIndex": 29,
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_pull",
                "levelValues": [
                  0.24,
                  0.27,
                  0.29,
                  0.32,
                  0.34,
                  0.36,
                  0.39,
                  0.41,
                  0.44,
                  0.47,
                  0.5,
                  0.55
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 256
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 8
        },
        {
          "startFrame": 46,
          "endFrame": 46,
          "actionIndex": 33,
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_pull",
                "levelValues": [
                  0.24,
                  0.27,
                  0.29,
                  0.32,
                  0.34,
                  0.36,
                  0.39,
                  0.41,
                  0.44,
                  0.47,
                  0.5,
                  0.55
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 256
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 9
        },
        {
          "startFrame": 62,
          "endFrame": 62,
          "actionIndex": 36,
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_pull",
                "levelValues": [
                  0.24,
                  0.27,
                  0.29,
                  0.32,
                  0.34,
                  0.36,
                  0.39,
                  0.41,
                  0.44,
                  0.47,
                  0.5,
                  0.55
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 256
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 10
        },
        {
          "startFrame": 78,
          "endFrame": 78,
          "actionIndex": 39,
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_pull",
                "levelValues": [
                  0.24,
                  0.27,
                  0.29,
                  0.32,
                  0.34,
                  0.36,
                  0.39,
                  0.41,
                  0.44,
                  0.47,
                  0.5,
                  0.55
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 256
            }
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 11
        },
        {
          "startFrame": 108,
          "endFrame": 109,
          "actionIndex": 44,
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_explosion",
                "levelValues": [
                  0.58,
                  0.63,
                  0.69,
                  0.75,
                  0.81,
                  0.86,
                  0.92,
                  0.98,
                  1.04,
                  1.11,
                  1.2,
                  1.3
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4352
            },
            {
              "damageType": "Natural",
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
          "sequenceIndex": 12
        }
      ],
      "conditionalActions": [
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
              "damageDecorateMask": null,
              "contextBuffId": null
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
              "serverActionIndex": 3,
              "blackboardMutation": {
                "key": "radius",
                "operation": "Assign",
                "value": {
                  "value": 6.3,
                  "blackboardKey": null,
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
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 4,
              "blackboardMutation": {
                "key": "radius",
                "operation": "Assign",
                "value": {
                  "value": 5.2,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            }
          ]
        }
      ],
      "inflictions": [
        {
          "startFrame": 108,
          "endFrame": 109,
          "actionIndex": 43,
          "element": "nature",
          "isExtra": false,
          "sequenceIndex": 12
        }
      ],
      "auxiliaryActions": [
        {
          "startFrame": 21,
          "endFrame": 21,
          "actionIndex": 27,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0013_aglina_normal_skill:chr_0013_aglina_normal_skill_abilityrange",
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
          "sequenceIndex": 7
        },
        {
          "startFrame": 29,
          "endFrame": 30,
          "actionIndex": 31,
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
          "sequenceIndex": 8
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [
        {
          "spawnFrame": 21,
          "actionOrder": [
            27
          ],
          "abilityEntityId": "abilityentity_chr_0013_aglina_normal_skill",
          "skillId": "chr_0013_aglina_normal_skill_abilityrange",
          "sourceFile": "chr_0013_aglina_normal_skill_abilityrange.json",
          "entityBlackboardAssignments": [],
          "directDamageHits": [],
          "intervalDamageHits": [],
          "conditionalActions": [],
          "inflictions": [],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 93,
              "actionIndex": 4,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0013_aglina_normal_skill_monitor",
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
              "sequenceIndex": 96
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
              "key": "duration",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "hasrecovered",
              "value": 0.0,
              "isDynamic": true
            },
            {
              "key": "move_speed_scalar",
              "value": 1.0,
              "isDynamic": false
            },
            {
              "key": "potential_lv",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "recovercost",
              "value": 5.0,
              "isDynamic": false
            }
          ],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "auraActions": []
        }
      ],
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
          "atk_scale_explosion": [
            0.58,
            0.63,
            0.69,
            0.75,
            0.81,
            0.86,
            0.92,
            0.98,
            1.04,
            1.11,
            1.2,
            1.3
          ],
          "atk_scale_pull": [
            0.24,
            0.27,
            0.29,
            0.32,
            0.34,
            0.36,
            0.39,
            0.41,
            0.44,
            0.47,
            0.5,
            0.55
          ],
          "display_atk_scale_pull": [
            0.97,
            1.07,
            1.17,
            1.26,
            1.36,
            1.46,
            1.56,
            1.65,
            1.75,
            1.87,
            2.02,
            2.19
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
          "key": "atk_scale_explosion",
          "value": 1.25,
          "isDynamic": false
        },
        {
          "key": "atk_scale_pull",
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
          "key": "heal_const",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_scale",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "maxChargeTime",
          "value": 0.0,
          "isDynamic": false
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
          "key": "radius",
          "value": 5.2,
          "isDynamic": true
        },
        {
          "key": "radiusadd_display",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "recovercost",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale_explosion",
        "atk_scale_pull",
        "cam_angle",
        "cam_duration",
        "heal_const",
        "heal_scale",
        "input_angle",
        "poise",
        "potential",
        "radius",
        "select_radius"
      ],
      "blackboardProvenance": [
        {
          "key": "atk_scale_explosion",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_pull",
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
          "key": "display_atk_scale_pull",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_const",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_scale",
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
          "key": "maxChargeTime",
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
          "key": "radius",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "radiusadd_display",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "recovercost",
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
        "DamageAction",
        "SpawnAbilityEntity",
        "SpellInfliction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 12,
          "endFrame": 12,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "succeedActions",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "targetPos",
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
          "startFrame": 12,
          "endFrame": 12,
          "actionIndex": 20,
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
        },
        {
          "startFrame": 12,
          "endFrame": 12,
          "actionIndex": 21,
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
          "targetGroupKey": "targetPos",
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
          "startFrame": 12,
          "endFrame": 12,
          "actionIndex": 22,
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
            "[2]"
          ],
          "targetGroupKey": "targetPos",
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
          "startFrame": 12,
          "endFrame": 12,
          "actionIndex": 23,
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
          "targetGroupKey": "targetPos",
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
          "startFrame": 12,
          "endFrame": 12,
          "actionIndex": 24,
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
            "[1]"
          ],
          "targetGroupKey": "targetPos",
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
          "startFrame": 29,
          "endFrame": 30,
          "actionIndex": 28,
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
        },
        {
          "startFrame": 46,
          "endFrame": 46,
          "actionIndex": 32,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 62,
          "endFrame": 62,
          "actionIndex": 35,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 78,
          "endFrame": 78,
          "actionIndex": 38,
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
          "startFrame": 108,
          "endFrame": 109,
          "actionIndex": 41,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "explo",
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
          "startFrame": 108,
          "endFrame": 109,
          "actionIndex": 54,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[7]",
            "succeedActions",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "CureTarget",
          "producerType": "FindTargetAction",
          "finderType": "CharacterTeamFinder",
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [],
          "postProcessorTypes": [
            "PriorityFilter"
          ],
          "inputTargets": [],
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
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
              "damageDecorateMask": null,
              "contextBuffId": null
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
              "serverActionIndex": 3,
              "blackboardMutation": {
                "key": "radius",
                "operation": "Assign",
                "value": {
                  "value": 6.3,
                  "blackboardKey": null,
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
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 4,
              "blackboardMutation": {
                "key": "radius",
                "operation": "Assign",
                "value": {
                  "value": 5.2,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            }
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 12,
          "actionIndex": 14,
          "actionPath": [
            "timelineActions[4]",
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
                "targetSource": "InstantSearch",
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
              "serverActionIndex": 17
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
              "serverActionIndex": 18,
              "nestedCondition": {
                "startFrame": 12,
                "endFrame": 12,
                "actionIndex": 18,
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
                    "sourceType": "CheckEntityNum",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "entityCount": {
                      "targetSource": "MainCharacter",
                      "targetGroupKey": "",
                      "minimumCount": 1,
                      "comparison": "GE",
                      "containsHittableTarget": false,
                      "excludeDeadEntity": true,
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
                    "serverActionIndex": 20
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
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 21
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
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[2]"
                    ],
                    "serverActionIndex": 22
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
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 23
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
                      "[0]",
                      "failActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 24
                  }
                ]
              }
            }
          ]
        },
        {
          "startFrame": 108,
          "endFrame": 109,
          "actionIndex": 48,
          "actionPath": [
            "timelineActions[12]",
            "_sequenceActionData",
            "actionData",
            "[7]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
                "value": 0.0,
                "blackboardKey": "heal_const",
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
              "damageDecorateMask": null,
              "contextBuffId": null
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
                "targetGroupKey": "explo",
                "minimumCount": 2,
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[12]",
                "_sequenceActionData",
                "actionData",
                "[7]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 51,
              "nestedCondition": {
                "startFrame": 108,
                "endFrame": 109,
                "actionIndex": 51,
                "actionPath": [
                  "timelineActions[12]",
                  "_sequenceActionData",
                  "actionData",
                  "[7]",
                  "succeedActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckHp",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "health": {
                      "targetSource": "InstantSearch",
                      "targetGroupKey": "",
                      "comparison": "LT",
                      "isRatio": true,
                      "value": {
                        "value": 0.99,
                        "blackboardKey": null,
                        "levelValues": null
                      }
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
                      "timelineActions[12]",
                      "_sequenceActionData",
                      "actionData",
                      "[7]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 54
                  }
                ]
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
      "skillId": "chr_0013_aglina_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0013_aglina_combo_skill.json",
      "timelineBlockFrames": 53,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 10.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 53,
          "endFrame": 72,
          "skillIds": [
            "chr_0013_aglina_normal_skill"
          ]
        },
        {
          "startFrame": 53,
          "endFrame": 72,
          "skillIds": [
            "chr_0013_aglina_ultimate_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 72,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0013_aglina_normal_skill",
              "cacheEndByAction": true,
              "clearOffsetTargetSkillIdOnEnd": false,
              "overrideCacheTime": false,
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
          "endFrame": 130,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionTypes": [
            "ConvertToTargetContext",
            "Selector",
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "FindTargetAction",
            "Selector",
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 50,
          "endFrame": 53,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 48,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 50,
          "actionTypes": [
            "CreateBuffAction",
            "FindTargetAction",
            "Selector",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "AirborneAction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "FAnimationCurve",
            "PlaySoundAction",
            "HealAction",
            "Selector",
            "Selector",
            "MultiplyAttributeCalculation",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 92,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 75,
          "actionTypes": [
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 72,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 124,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 164,
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
          "endFrame": 15,
          "actionTypes": [
            "TimeDilationAction",
            "FAnimationCurve",
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
          "startFrame": 0,
          "endFrame": 72,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 53,
          "endFrame": 72,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 53,
          "endFrame": 72,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 22,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 130,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 100,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 100,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 100,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 100,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 48,
          "endFrame": 50,
          "actionIndex": 23,
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 10.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  1.4,
                  1.54,
                  1.68,
                  1.82,
                  1.96,
                  2.1,
                  2.24,
                  2.38,
                  2.52,
                  2.7,
                  2.91,
                  3.15
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 12288
            },
            {
              "damageType": "Natural",
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
          "sequenceIndex": 5
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 48,
          "endFrame": 50,
          "actionIndex": 19,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0013_aglina_combo_skill_tutorial_marker",
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
          "sequenceIndex": 5
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [
        {
          "startFrame": 48,
          "endFrame": 50,
          "actionIndex": 37,
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
        "buff_chr_0013_aglina_combo_skill_tutorial_marker"
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
            1.4,
            1.54,
            1.68,
            1.82,
            1.96,
            2.1,
            2.24,
            2.38,
            2.52,
            2.7,
            2.91,
            3.15
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
          "key": "damage_taken_scale",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_const",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "heal_scale",
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
          "key": "potential_lv",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "radius",
          "value": 3.0,
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
        "heal_const",
        "heal_scale",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
        "radius",
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
          "key": "damage_taken_scale",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_const",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "heal_scale",
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
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 0,
          "endFrame": 0,
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
          "targetGroupKey": "triggerpos",
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
          "endFrame": 0,
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
        },
        {
          "startFrame": 0,
          "endFrame": 0,
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
          "targetGroupKey": "triggerpos",
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
          "endFrame": 0,
          "actionIndex": 7,
          "actionPath": [
            "timelineActions[1]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[2]"
          ],
          "targetGroupKey": "triggerpos",
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
          "endFrame": 3,
          "actionIndex": 8,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionIndex": 9,
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
          "intervalSeconds": null
        },
        {
          "startFrame": 48,
          "endFrame": 50,
          "actionIndex": 20,
          "actionPath": [
            "timelineActions[5]",
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
          "startFrame": 48,
          "endFrame": 50,
          "actionIndex": 32,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[7]",
            "succeedActions",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "CureTarget",
          "producerType": "FindTargetAction",
          "finderType": "CharacterTeamFinder",
          "finderFactionTarget": null,
          "finderTargetObjectType": null,
          "finderCheckAlive": null,
          "validatorTypes": [],
          "postProcessorTypes": [
            "PriorityFilter"
          ],
          "inputTargets": [],
          "intervalSeconds": null
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionIndex": 47,
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
          "startFrame": 0,
          "endFrame": 0,
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
                "targetSource": "InstantSearch",
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
                "[0]"
              ],
              "serverActionIndex": 5
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
              "serverActionIndex": 6
            },
            {
              "actionType": "FindTargetAction",
              "actionIndex": 2,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[2]"
              ],
              "serverActionIndex": 7
            }
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 50,
          "actionIndex": 26,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[7]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "GT",
              "left": {
                "value": 0.0,
                "blackboardKey": "heal_const",
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
              "damageDecorateMask": null,
              "contextBuffId": null
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
                "minimumCount": 2,
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
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[7]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 29,
              "nestedCondition": {
                "startFrame": 48,
                "endFrame": 50,
                "actionIndex": 29,
                "actionPath": [
                  "timelineActions[5]",
                  "_sequenceActionData",
                  "actionData",
                  "[7]",
                  "succeedActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckHp",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "health": {
                      "targetSource": "InstantSearch",
                      "targetGroupKey": "",
                      "comparison": "LT",
                      "isRatio": true,
                      "value": {
                        "value": 0.99,
                        "blackboardKey": null,
                        "levelValues": null
                      }
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
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[7]",
                      "succeedActions",
                      "actionData",
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 32
                  }
                ]
              }
            }
          ],
          "failActions": []
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionIndex": 45,
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
              "serverActionIndex": 47
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
          "actionIndex": 44,
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
      "skillId": "chr_0013_aglina_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0013_aglina_ultimate_skill.json",
      "timelineBlockFrames": 64,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 100.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 64,
          "endFrame": 91,
          "skillIds": [
            "chr_0013_aglina_normal_skill",
            "chr_0013_aglina_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 91,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0013_aglina_normal_skill",
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
              "skillId": "chr_0013_aglina_combo_skill",
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
          "endFrame": 116,
          "actionTypes": [
            "PlayAnimationAction"
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
          "endFrame": 0,
          "actionTypes": [
            "ConvertToTargetContext",
            "Selector",
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 10,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 53,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "UltimateShowAction"
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
          "startFrame": 60,
          "endFrame": 60,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "InterruptAction",
            "SpellInfliction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 65,
          "actionTypes": [
            "StoreAttributeValue",
            "StoreAttributeValue",
            "SpawnAbilityEntity"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 57,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 44,
          "endFrame": 193,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "AnimatedCameraAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": []
        },
        {
          "startFrame": 1,
          "endFrame": 52,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 91,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 64,
          "endFrame": 91,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 98,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 116,
          "actionTypes": [
            "PlaySoundAction"
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
          "endFrame": 116,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 60,
          "endFrame": 60,
          "actionIndex": 25,
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  3.33,
                  3.67,
                  4.0,
                  4.33,
                  4.67,
                  5.0,
                  5.34,
                  5.67,
                  6.0,
                  6.42,
                  6.92,
                  7.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 4608
            },
            {
              "damageType": "Natural",
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
          "sequenceIndex": 8
        }
      ],
      "conditionalActions": [],
      "inflictions": [
        {
          "startFrame": 60,
          "endFrame": 60,
          "actionIndex": 24,
          "element": "nature",
          "isExtra": false,
          "sequenceIndex": 8
        }
      ],
      "auxiliaryActions": [
        {
          "startFrame": 60,
          "endFrame": 65,
          "actionIndex": 29,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0013_aglina_ultimate_skill:chr_0013_aglina_ultimate_skill_abilityrange",
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
          "sequenceIndex": 9
        },
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionIndex": 30,
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
          "sequenceIndex": 10
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileTriggeredSkills": [],
      "abilityEntityHits": [
        {
          "spawnFrame": 60,
          "actionOrder": [
            29
          ],
          "abilityEntityId": "abilityentity_chr_0013_aglina_ultimate_skill",
          "skillId": "chr_0013_aglina_ultimate_skill_abilityrange",
          "sourceFile": "chr_0013_aglina_ultimate_skill_abilityrange.json",
          "entityBlackboardAssignments": [],
          "directDamageHits": [],
          "intervalDamageHits": [],
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
              "key": "BuffStack",
              "value": 0.0,
              "isDynamic": true
            },
            {
              "key": "FinalRate",
              "value": 0.0,
              "isDynamic": true
            },
            {
              "key": "duration",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "final_resistance_scalar",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "final_resistance_scalar_inair",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "move_speed_scalar",
              "value": 1.0,
              "isDynamic": true
            },
            {
              "key": "potential2",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "potential2_onceadd",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "radius",
              "value": 5.0,
              "isDynamic": false
            },
            {
              "key": "resistance_scalar",
              "value": 0.3,
              "isDynamic": false
            },
            {
              "key": "resistance_scalar_inair",
              "value": 0.6,
              "isDynamic": false
            },
            {
              "key": "spell_vulnerable_perstack",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "spell_vulnerable_rate",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "wisd_increase",
              "value": 0.0,
              "isDynamic": false
            },
            {
              "key": "wisd_increase_inair",
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
              "endFrame": 180,
              "actionIndex": 1,
              "sourceFile": "chr_0013_aglina_ultimate_skill_abilityrange.json",
              "activationSource": "timeline",
              "activationEvent": null,
              "actionPath": [
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[0]"
              ],
              "priorityLevel": "Default",
              "priorityOffset": 0,
              "debugName": "aglina_ultimate_aura",
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
                "shapeType": "Capsule",
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
                "height": 4.0,
                "heightKey": "",
                "radius": 0.0,
                "radiusKey": "radius"
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
                  "buffId": "buff_chr_0013_aglina_ultimate_skill",
                  "classification": null,
                  "blackboardAssignments": {
                    "FinalRate": {
                      "value": 0.0,
                      "blackboardKey": "FinalRate",
                      "levelValues": null
                    },
                    "spell_vulnerable_rate": {
                      "value": 0.0,
                      "blackboardKey": "spell_vulnerable_rate",
                      "levelValues": [
                        0.18,
                        0.18,
                        0.18,
                        0.22,
                        0.22,
                        0.22,
                        0.26,
                        0.26,
                        0.26,
                        0.3,
                        0.3,
                        0.3
                      ]
                    },
                    "potential2": {
                      "value": 0.0,
                      "blackboardKey": "potential2",
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
                    "BuffStack": {
                      "value": 0.0,
                      "blackboardKey": "BuffStack",
                      "levelValues": null
                    },
                    "spell_vulnerable_perstack": {
                      "value": 0.0,
                      "blackboardKey": "spell_vulnerable_perstack",
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
                    "move_speed_scalar": {
                      "value": 0.0,
                      "blackboardKey": "move_speed_scalar",
                      "levelValues": [
                        0.8,
                        0.8,
                        0.8,
                        0.8,
                        0.8,
                        0.8,
                        0.8,
                        0.8,
                        0.8,
                        0.8,
                        0.8,
                        0.8
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
              "nestedCombatActions": []
            }
          ]
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
          "atk_scale": [
            3.33,
            3.67,
            4.0,
            4.33,
            4.67,
            5.0,
            5.34,
            5.67,
            6.0,
            6.42,
            6.92,
            7.5
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
          "move_speed_scalar": [
            0.8,
            0.8,
            0.8,
            0.8,
            0.8,
            0.8,
            0.8,
            0.8,
            0.8,
            0.8,
            0.8,
            0.8
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
          ],
          "spell_vulnerable_4stack": [
            0.252,
            0.252,
            0.252,
            0.308,
            0.308,
            0.308,
            0.364,
            0.364,
            0.364,
            0.42,
            0.42,
            0.42
          ],
          "spell_vulnerable_perstack": [
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
          ],
          "spell_vulnerable_rate": [
            0.18,
            0.18,
            0.18,
            0.22,
            0.22,
            0.22,
            0.26,
            0.26,
            0.26,
            0.3,
            0.3,
            0.3
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
          "key": "atk_scale",
          "value": 8.0,
          "isDynamic": false
        },
        {
          "key": "damage_scale",
          "value": 0.5,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 6.0,
          "isDynamic": false
        },
        {
          "key": "final_resistance_scalar",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "final_resistance_scalar_inair",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "move_speed_scalar",
          "value": 0.2,
          "isDynamic": true
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "potential2_onceadd",
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
        },
        {
          "key": "resistance_scalar",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "resistance_scalar_inair",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 10.0,
          "isDynamic": false
        },
        {
          "key": "spell_vulnerable_perstack",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "spell_vulnerable_rate",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "wisd_increase",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "wisd_increase_inair",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "duration",
        "poise",
        "radius",
        "resistance_scalar",
        "resistance_scalar_inair",
        "select_radius",
        "wisd_increase",
        "wisd_increase_inair"
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
          "key": "damage_scale",
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
          "key": "final_resistance_scalar",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "final_resistance_scalar_inair",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "move_speed_scalar",
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
          "key": "potential2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "potential2_onceadd",
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
        },
        {
          "key": "resistance_scalar",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "resistance_scalar_inair",
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
          "key": "spell_vulnerable_4stack",
          "declaredInSkill": false,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "spell_vulnerable_perstack",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "spell_vulnerable_rate",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "wisd_increase",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "wisd_increase_inair",
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
        "SpawnAbilityEntity",
        "SpellInfliction"
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
            "[0]",
            "succeedActions",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "triggerpos",
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
          "endFrame": 0,
          "actionIndex": 8,
          "actionPath": [
            "timelineActions[2]",
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
        },
        {
          "startFrame": 0,
          "endFrame": 0,
          "actionIndex": 9,
          "actionPath": [
            "timelineActions[2]",
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
          "targetGroupKey": "triggerpos",
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
          "endFrame": 0,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[2]",
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
          "targetGroupKey": "triggerpos",
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
          "endFrame": 0,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[2]",
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
          "targetGroupKey": "triggerpos",
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
          "endFrame": 0,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[2]",
            "_sequenceActionData",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[0]",
            "failActions",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "triggerpos",
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
          "startFrame": 60,
          "endFrame": 60,
          "actionIndex": 22,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 0,
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
                "targetSource": "InstantSearch",
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
              "serverActionIndex": 5
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
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 6,
              "nestedCondition": {
                "startFrame": 0,
                "endFrame": 0,
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
                "conditions": [
                  {
                    "sourceType": "CheckEntityNum",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": [],
                    "entityCount": {
                      "targetSource": "MainCharacter",
                      "targetGroupKey": "",
                      "minimumCount": 1,
                      "comparison": "GE",
                      "containsHittableTarget": false,
                      "excludeDeadEntity": true,
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
                      "timelineActions[2]",
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
                    "serverActionIndex": 8
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
                      "[0]",
                      "succeedActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 9
                  },
                  {
                    "actionType": "FindTargetAction",
                    "actionIndex": 2,
                    "actionPath": [
                      "timelineActions[2]",
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
                    "serverActionIndex": 10
                  }
                ],
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
                      "[0]",
                      "failActions",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 11
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
                      "[0]",
                      "failActions",
                      "actionData",
                      "[1]"
                    ],
                    "serverActionIndex": 12
                  }
                ]
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
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 1
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionIndex": 19,
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
          "sequenceIndex": 5
        }
      ]
    }
  ]
} as const satisfies GeneratedOperatorSource;
