/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const perlicaGeneratedSource = {
  "slug": "perlica",
  "buffDefinitions": [
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
      "skillId": "chr_0004_pelica_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0004_pelica_attack1.json",
      "timelineBlockFrames": 16,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 8,
      "allowNextWindows": [
        {
          "startFrame": 16,
          "endFrame": 27,
          "skillIds": [
            "chr_0004_pelica_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 5,
          "endFrame": 27,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0004_pelica_attack2",
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
          "endFrame": 166,
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
          "endFrame": 166,
          "actionTypes": [
            "CustomRootMotionAction"
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
          "startFrame": 8,
          "endFrame": 38,
          "actionTypes": [
            "EffectAction"
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
          "endFrame": 15,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 166,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 99,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 99,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 99,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 99,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 40,
          "actionTypes": [
            "VoiceTriggerAction"
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
          "startFrame": 5,
          "endFrame": 27,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 27,
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
          "projectileId": "projectile_chr_0004_pelica_normal_attack1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_attack1_projhit"
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
            3
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_attack1_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_attack1_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.25,
                  0.28,
                  0.31,
                  0.33,
                  0.36,
                  0.38,
                  0.41,
                  0.43,
                  0.46,
                  0.49,
                  0.53,
                  0.57
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
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.25,
                      0.28,
                      0.31,
                      0.33,
                      0.36,
                      0.38,
                      0.41,
                      0.43,
                      0.46,
                      0.49,
                      0.53,
                      0.57
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
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
                  "actionIndex": 1,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
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
            0.0,
            0.0,
            0.0,
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
            0.31,
            0.33,
            0.36,
            0.38,
            0.41,
            0.43,
            0.46,
            0.49,
            0.53,
            0.57
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
      "key": "basicAttack2",
      "skillId": "chr_0004_pelica_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0004_pelica_attack2.json",
      "timelineBlockFrames": 18,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 11,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 12,
      "allowNextWindows": [
        {
          "startFrame": 18,
          "endFrame": 28,
          "skillIds": [
            "chr_0004_pelica_attack3"
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
              "skillId": "chr_0004_pelica_attack3",
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
          "endFrame": 168,
          "actionTypes": [
            "PlayAnimationWithStep"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 9,
          "actionTypes": [
            "LaunchProjectile"
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
          "startFrame": 12,
          "endFrame": 55,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 52,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 0,
          "endFrame": 168,
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
          "endFrame": 22,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 168,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 168,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 168,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 0,
          "endFrame": 168,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 55,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 48,
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
          "startFrame": 18,
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
          "launchFrame": 9,
          "projectileId": "projectile_chr_0004_pelica_normal_attack2",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_attack2_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 12,
          "projectileId": "projectile_chr_0004_pelica_normal_attack2",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_attack2_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 9,
          "actionOrder": [
            1
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack2",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_attack2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_attack2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
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
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
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
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
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
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 4,
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
          "launchFrame": 12,
          "actionOrder": [
            2
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack2",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_attack2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_attack2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
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
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
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
              "endFrame": 3,
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[0]",
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
                  "mainOperator": {
                    "targetSource": "Source",
                    "targetGroupKey": ""
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                    "[1]",
                    "succeedActions",
                    "actionData",
                    "[1]"
                  ],
                  "serverActionIndex": 4,
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
          "value": 0.29,
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
      "key": "basicAttack3",
      "skillId": "chr_0004_pelica_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0004_pelica_attack3.json",
      "timelineBlockFrames": 26,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 13,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 22,
      "allowNextWindows": [
        {
          "startFrame": 26,
          "endFrame": 40,
          "skillIds": [
            "chr_0004_pelica_attack4"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 8,
          "endFrame": 40,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0004_pelica_attack4",
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
          "endFrame": 173,
          "actionTypes": [
            "PlayAnimationWithStep"
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
          "startFrame": 0,
          "endFrame": 173,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 16,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 19,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 22,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 59,
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
          "startFrame": 22,
          "endFrame": 65,
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
          "startFrame": 15,
          "endFrame": 36,
          "actionTypes": [
            "AddCameraControlStateAction"
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
          "endFrame": 29,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 81,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 29,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 172,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 29,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 172,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 29,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 172,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 113,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 67,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 113,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 40,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 40,
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
          "launchFrame": 16,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_attack3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 19,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_attack3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 22,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_attack3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 16,
          "actionOrder": [
            3
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.12,
                  0.14,
                  0.15,
                  0.16,
                  0.17,
                  0.19,
                  0.2,
                  0.21,
                  0.22,
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
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.12,
                      0.14,
                      0.15,
                      0.16,
                      0.17,
                      0.19,
                      0.2,
                      0.21,
                      0.22,
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
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 3,
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
          "launchFrame": 19,
          "actionOrder": [
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.12,
                  0.14,
                  0.15,
                  0.16,
                  0.17,
                  0.19,
                  0.2,
                  0.21,
                  0.22,
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
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.12,
                      0.14,
                      0.15,
                      0.16,
                      0.17,
                      0.19,
                      0.2,
                      0.21,
                      0.22,
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
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 3,
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
          "launchFrame": 22,
          "actionOrder": [
            5
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.12,
                  0.14,
                  0.15,
                  0.16,
                  0.17,
                  0.19,
                  0.2,
                  0.21,
                  0.22,
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
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.12,
                      0.14,
                      0.15,
                      0.16,
                      0.17,
                      0.19,
                      0.2,
                      0.21,
                      0.22,
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
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 3,
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
            0.0,
            0.0,
            0.0,
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
            0.12,
            0.14,
            0.15,
            0.16,
            0.17,
            0.19,
            0.2,
            0.21,
            0.22,
            0.24,
            0.26,
            0.28
          ],
          "display_atk_scale": [
            0.37,
            0.41,
            0.45,
            0.48,
            0.52,
            0.56,
            0.59,
            0.63,
            0.67,
            0.71,
            0.77,
            0.84
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
          "value": 0.23,
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
      "skillId": "chr_0004_pelica_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0004_pelica_attack4.json",
      "timelineBlockFrames": 44,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 13,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 27,
      "allowNextWindows": [
        {
          "startFrame": 54,
          "endFrame": 64,
          "skillIds": [
            "chr_0004_pelica_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 29,
          "endFrame": 64,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0004_pelica_attack1",
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
          "endFrame": 269,
          "actionTypes": [
            "PlayAnimationWithStep"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 179,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 27,
          "actionTypes": [
            "LaunchProjectile"
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
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "InheritCCSAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 81,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 76,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 61,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 269,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 269,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 269,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 43,
          "endFrame": 269,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 44,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 61,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 64,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 54,
          "endFrame": 64,
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
          "launchFrame": 27,
          "projectileId": "projectile_chr_0004_pelica_normal_attack4",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_attack4_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 27,
          "actionOrder": [
            3
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack4",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_attack4_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_attack4_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.1,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.57,
                  0.62,
                  0.68,
                  0.73,
                  0.79,
                  0.85,
                  0.9,
                  0.96,
                  1.02,
                  1.09,
                  1.17,
                  1.27
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
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 1.1,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.57,
                      0.62,
                      0.68,
                      0.73,
                      0.79,
                      0.85,
                      0.9,
                      0.96,
                      1.02,
                      1.09,
                      1.17,
                      1.27
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
                  "serverActionIndex": 6,
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
            0.57,
            0.62,
            0.68,
            0.73,
            0.79,
            0.85,
            0.9,
            0.96,
            1.02,
            1.09,
            1.17,
            1.27
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
          "isDynamic": true
        },
        {
          "key": "atk_scale",
          "value": 1.07,
          "isDynamic": true
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": true
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
      "targetGroupWrites": [],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": []
    },
    {
      "key": "finisher",
      "skillId": "chr_0004_pelica_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0004_pelica_power_attack.json",
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
          "endFrame": 58,
          "skillIds": [
            "chr_0004_pelica_normal_skill",
            "chr_0004_pelica_combo_skill"
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
              "skillId": "chr_0004_pelica_normal_skill",
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
              "skillId": "chr_0004_pelica_combo_skill",
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
          "endFrame": 135,
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
          "startFrame": 35,
          "endFrame": 44,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "KnockDownAction",
            "EnemyHurtAnimAction",
            "CameraImpulseAction",
            "GainBreakingAttackAtb",
            "PlaySoundAction"
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
          "startFrame": 35,
          "endFrame": 38,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 135,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 45,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 45,
          "actionTypes": [
            "SaveTwoDirectionAngle",
            "CurveEvaluateFloat",
            "CurveEvaluateFloat",
            "CameraRotateAction",
            "CurveEvaluateFloat",
            "SaveCameraAngle",
            "CurveEvaluateFloat",
            "AddDynamicCcsAction"
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
          "startFrame": 35,
          "endFrame": 58,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 83,
          "actionTypes": [
            "EffectAction",
            "Selector"
          ]
        },
        {
          "startFrame": 31,
          "endFrame": 83,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 84,
          "actionTypes": [
            "EffectAction",
            "Selector"
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
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 93,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 93,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 93,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 93,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 93,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 6,
          "endFrame": 109,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 32,
          "endFrame": 93,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 84,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 35,
          "endFrame": 44,
          "actionIndex": 2,
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "breakingAttack",
              "attackScale": {
                "value": 5.0,
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
          "endFrame": 50,
          "actionIndex": 39,
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
          "sequenceIndex": 15
        },
        {
          "startFrame": 0,
          "endFrame": 35,
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
          "sequenceIndex": 22
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
          "key": "addition_vertical",
          "value": 0.0,
          "isDynamic": true
        },
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
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "look_at_x",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "vertical",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "addition_vertical",
        "atk_scale",
        "cam_angle",
        "input_angle",
        "vertical"
      ],
      "blackboardProvenance": [
        {
          "key": "addition_vertical",
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
          "key": "input_angle",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "look_at_x",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "vertical",
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
      "skillId": "chr_0004_pelica_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0004_pelica_plunging_attack_end.json",
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
          "endFrame": 168,
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
          "startFrame": 1,
          "endFrame": 1,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "LaunchProjectile",
            "LaunchProjectile",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 50,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 50,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 50,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 50,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 69,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 71,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 72,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 114,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 14,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 26,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 114,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 14,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 25,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 114,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 14,
          "actionTypes": [
            "CharWeaponAnimationAction"
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
          "startFrame": 24,
          "endFrame": 114,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 14,
          "actionTypes": [
            "CharWeaponAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 114,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 3,
          "endFrame": 8,
          "actionIndex": 3,
          "damageUnits": [
            {
              "damageType": "Pulse",
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
          "startFrame": 3,
          "endFrame": 8,
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
          "sequenceIndex": 3
        }
      ],
      "projectileLaunches": [
        {
          "launchFrame": 1,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_plunging_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 1,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_plunging_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 1,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_plunging_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 1,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_plunging_attack_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 1,
          "actionOrder": [
            14
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_plunging_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_plunging_attack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 1,
          "actionOrder": [
            15
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_plunging_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_plunging_attack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 1,
          "actionOrder": [
            16
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_plunging_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_plunging_attack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 1,
          "actionOrder": [
            17
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_plunging_attack_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_plunging_attack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [],
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
        "LaunchProjectile",
        "ObtainCostAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
          "startFrame": 3,
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
          "startFrame": 1,
          "endFrame": 1,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[6]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "pos1",
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
          "startFrame": 1,
          "endFrame": 1,
          "actionIndex": 11,
          "actionPath": [
            "timelineActions[6]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "pos2",
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
          "startFrame": 1,
          "endFrame": 1,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[6]",
            "_sequenceActionData",
            "actionData",
            "[2]"
          ],
          "targetGroupKey": "pos3",
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
          "startFrame": 1,
          "endFrame": 1,
          "actionIndex": 13,
          "actionPath": [
            "timelineActions[6]",
            "_sequenceActionData",
            "actionData",
            "[3]"
          ],
          "targetGroupKey": "pos4",
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
      "key": "battleSkill",
      "skillId": "chr_0004_pelica_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0004_pelica_normal_skill.json",
      "timelineBlockFrames": 28,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 3.0,
      "costFrame": 0,
      "costType": "Atb",
      "costValue": 40.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 28,
          "endFrame": 54,
          "skillIds": [
            "chr_0004_pelica_normal_skill"
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
              "skillId": "chr_0004_pelica_normal_skill",
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
          "endFrame": 155,
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
          "startFrame": 11,
          "endFrame": 12,
          "actionTypes": [
            "ConvertToTargetContext"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 13,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "InterruptAction",
            "SpellInfliction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "CameraImpulseAction",
            "CreateBuffAction"
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
          "endFrame": 53,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 53,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 65,
          "actionTypes": [
            "EffectAction",
            "Selector"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 28,
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
          "endFrame": 155,
          "actionTypes": [
            "CustomRootMotionAction"
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
          "startFrame": 0,
          "endFrame": 12,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 27,
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
          "endFrame": 54,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 54,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 65,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 65,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 53,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 155,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 155,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 155,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 155,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 155,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 13,
          "endFrame": 13,
          "actionIndex": 12,
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  1.78,
                  1.96,
                  2.13,
                  2.31,
                  2.49,
                  2.67,
                  2.85,
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
              "damageDecorateMask": 4352
            },
            {
              "damageType": "Pulse",
              "attributeType": "Poise",
              "calculation": "standard",
              "attackScale": {
                "value": 4.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  1.78,
                  1.96,
                  2.13,
                  2.31,
                  2.49,
                  2.67,
                  2.85,
                  3.02,
                  3.2,
                  3.42,
                  3.69,
                  4.0
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
          ],
          "timedMarkerGate": null,
          "sequenceIndex": 3
        }
      ],
      "conditionalActions": [],
      "inflictions": [
        {
          "startFrame": 13,
          "endFrame": 13,
          "actionIndex": 11,
          "element": "electric",
          "isExtra": false,
          "sequenceIndex": 3
        }
      ],
      "auxiliaryActions": [
        {
          "startFrame": 13,
          "endFrame": 13,
          "actionIndex": 15,
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
          "sequenceIndex": 3
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
            1.78,
            1.96,
            2.13,
            2.31,
            2.49,
            2.67,
            2.85,
            3.02,
            3.2,
            3.42,
            3.69,
            4.0
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
          "value": 2.85,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2",
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
          "key": "gained_atb",
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
        },
        {
          "key": "select_radius",
          "value": 10.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "cam_angle",
        "input_angle",
        "poise"
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
          "key": "atk_scale_2",
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
          "key": "consume_cnt",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "gained_atb",
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
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "DamageAction",
        "SpellInfliction"
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
          "intervalSeconds": null
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
          "intervalSeconds": null
        },
        {
          "startFrame": 13,
          "endFrame": 13,
          "actionIndex": 9,
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
      "key": "comboSkill",
      "skillId": "chr_0004_pelica_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0004_pelica_combo_skill.json",
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
          "endFrame": 54,
          "skillIds": [
            "chr_0004_pelica_normal_skill"
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
              "skillId": "chr_0004_pelica_normal_skill",
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
          "endFrame": 115,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 11,
          "actionTypes": [
            "ConvertToTargetContext",
            "Selector"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 24,
          "actionTypes": [
            "EffectAction",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionTypes": [
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 110,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
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
          "endFrame": 22,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 23,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 25,
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
          "endFrame": 45,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 66,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 25,
          "endFrame": 90,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 25,
          "endFrame": 54,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 24,
          "actionTypes": [
            "AddCameraControlStateAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 64,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 65,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 115,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 115,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 115,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 115,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 115,
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
          "launchFrame": 24,
          "projectileId": "projectile_chr_0004_pelica_combo_skill",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0004_pelica_combo_skill_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 24,
          "actionOrder": [
            7
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_combo_skill",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0004_pelica_combo_skill_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0004_pelica_combo_skill_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 2.5,
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
              "actionIndex": 11,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 2.5,
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
              "sequenceIndex": 0
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
                  "comparison": "Equals",
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
                    "value": 1.0,
                    "blackboardKey": null,
                    "levelValues": null
                  },
                  "skillTypes": [],
                  "damageDecorateMask": null,
                  "contextBuffId": null
                },
                {
                  "sourceType": "CheckTagMatch",
                  "supported": true,
                  "comparison": null,
                  "left": null,
                  "right": null,
                  "skillTypes": [],
                  "entityTag": {
                    "targetSource": "Target",
                    "targetGroupKey": "",
                    "tagQueryType": "hasAny",
                    "tagIds": [
                      1075718177
                    ]
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                  "damageDecorateMask": null,
                  "contextBuffId": null
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
                    "[0]"
                  ],
                  "serverActionIndex": 4,
                  "blackboardMutation": {
                    "key": "EntityBB_bounced",
                    "operation": "Assign",
                    "value": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    }
                  }
                },
                {
                  "actionType": "LaunchProjectile",
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
                  "projectileLaunch": {
                    "projectileId": "projectile_chr_0004_pelica_combo_skill",
                    "skillTriggers": [
                      {
                        "event": "hit",
                        "skillId": "chr_0004_pelica_combo_skill_projhit"
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
                        "inputValueKey": ""
                      }
                    ]
                  },
                  "projectileTriggeredSkills": [
                    {
                      "launchFrame": 24,
                      "actionOrder": [
                        7,
                        0,
                        2
                      ],
                      "assumedTravelFrames": 0,
                      "projectileId": "projectile_chr_0004_pelica_combo_skill",
                      "triggerEvent": "hit",
                      "triggerSkillId": "chr_0004_pelica_combo_skill_projhit",
                      "excludedByPrimaryTargetMarker": false,
                      "sourceFile": "chr_0004_pelica_combo_skill_projhit.json",
                      "damageUnits": [
                        {
                          "damageType": "Pulse",
                          "attributeType": "Hp",
                          "calculation": "standard",
                          "attackScale": {
                            "value": 2.5,
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
                          "actionIndex": 11,
                          "damageUnits": [
                            {
                              "damageType": "Pulse",
                              "attributeType": "Hp",
                              "calculation": "standard",
                              "attackScale": {
                                "value": 2.5,
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
                          "sequenceIndex": 0
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
                              "comparison": "Equals",
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
                                "value": 1.0,
                                "blackboardKey": null,
                                "levelValues": null
                              },
                              "skillTypes": [],
                              "damageDecorateMask": null,
                              "contextBuffId": null
                            },
                            {
                              "sourceType": "CheckTagMatch",
                              "supported": true,
                              "comparison": null,
                              "left": null,
                              "right": null,
                              "skillTypes": [],
                              "entityTag": {
                                "targetSource": "Target",
                                "targetGroupKey": "",
                                "tagQueryType": "hasAny",
                                "tagIds": [
                                  1075718177
                                ]
                              },
                              "damageDecorateMask": null,
                              "contextBuffId": null
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
                              "damageDecorateMask": null,
                              "contextBuffId": null
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
                                "[0]"
                              ],
                              "serverActionIndex": 4,
                              "blackboardMutation": {
                                "key": "EntityBB_bounced",
                                "operation": "Assign",
                                "value": {
                                  "value": 1.0,
                                  "blackboardKey": null,
                                  "levelValues": null
                                }
                              }
                            },
                            {
                              "actionType": "LaunchProjectile",
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
                              "projectileLaunch": {
                                "projectileId": "projectile_chr_0004_pelica_combo_skill",
                                "skillTriggers": [
                                  {
                                    "event": "hit",
                                    "skillId": "chr_0004_pelica_combo_skill_projhit"
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
                                    "inputValueKey": ""
                                  }
                                ]
                              }
                            }
                          ],
                          "failActions": []
                        }
                      ],
                      "auxiliaryActions": [
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 9,
                          "actionType": "CreateBuffAction",
                          "sourceId": "buff_chr_0004_pelica_combo_skill_tutorial_marker",
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
                          "sequenceIndex": 0
                        },
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 10,
                          "actionType": "CreateBuffAction",
                          "sourceId": "buff_common_pulse_pulse_conduct_triggered",
                          "classification": "electrificationReaction",
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
                            "duration": {
                              "value": 7.5,
                              "blackboardKey": "duration",
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
                            "extra_scaling": {
                              "value": 0.0,
                              "blackboardKey": "extra_scaling",
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
                            }
                          },
                          "nestedCombatActions": [],
                          "buffSourceContextKey": "",
                          "sequenceIndex": 0
                        }
                      ],
                      "resourceGains": [
                        {
                          "startFrame": 0,
                          "endFrame": 3,
                          "actionIndex": 15,
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
                      "inflictions": [],
                      "combatActions": [
                        "CreateBuffAction",
                        "DamageAction",
                        "IfElseAction",
                        "LaunchProjectile",
                        "ObtainCostAction"
                      ],
                      "cycleTruncated": true,
                      "nestedProjectileTriggeredSkills": [],
                      "abilityEntityHits": [],
                      "auraActions": []
                    }
                  ]
                }
              ],
              "failActions": []
            }
          ],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 9,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0004_pelica_combo_skill_tutorial_marker",
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
              "sequenceIndex": 0
            },
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 10,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_common_pulse_pulse_conduct_triggered",
              "classification": "electrificationReaction",
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
                "duration": {
                  "value": 7.5,
                  "blackboardKey": "duration",
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
                "extra_scaling": {
                  "value": 0.0,
                  "blackboardKey": "extra_scaling",
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
                }
              },
              "nestedCombatActions": [],
              "buffSourceContextKey": "",
              "sequenceIndex": 0
            }
          ],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 15,
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
          "inflictions": [],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction",
            "IfElseAction",
            "LaunchProjectile",
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
          "key": "atb",
          "value": 0.0,
          "isDynamic": false
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
          "key": "duration",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "extra_scaling",
          "value": 1.0,
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
          "key": "select_radius",
          "value": 4.0,
          "isDynamic": false
        },
        {
          "key": "talent2",
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
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
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
          "key": "duration",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "extra_scaling",
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
          "key": "talent2",
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
          "startFrame": 0,
          "endFrame": 11,
          "actionIndex": 4,
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
          "endFrame": 23,
          "actionIndex": 18,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [
        {
          "startFrame": 0,
          "endFrame": 11,
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
              "serverActionIndex": 4
            }
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 23,
          "actionIndex": 16,
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
                "timelineActions[8]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 18
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
          "endFrame": 22,
          "actionIndex": 15,
          "kind": "normal",
          "priority": -593023102,
          "scope": "global",
          "slot": 0,
          "duration": {
            "value": 0.833,
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
                "postProcessorTypes": []
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
      ]
    },
    {
      "key": "ultimate",
      "skillId": "chr_0004_pelica_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0004_pelica_ultimate_skill.json",
      "timelineBlockFrames": 63,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 100.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 63,
          "endFrame": 90,
          "skillIds": [
            "chr_0004_pelica_normal_skill",
            "chr_0004_pelica_combo_skill"
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
              "skillId": "chr_0004_pelica_normal_skill",
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
              "skillId": "chr_0004_pelica_combo_skill",
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
          "endFrame": 114,
          "actionTypes": [
            "PlayAnimationAction"
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
          "endFrame": 50,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 52,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionTypes": [
            "AnimatedCameraAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 47,
          "actionTypes": []
        },
        {
          "startFrame": 58,
          "endFrame": 63,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "InterruptAction",
            "DamageAction",
            "InstantModifyAttribute",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
            "EnemyHurtAnimAction"
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
          "startFrame": 55,
          "endFrame": 58,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector"
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
          "startFrame": 63,
          "endFrame": 90,
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
          "endFrame": 60,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 51,
          "endFrame": 68,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 48,
          "endFrame": 68,
          "actionTypes": []
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
          "endFrame": 47,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 47,
          "actionTypes": []
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
          "endFrame": 60,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 55,
          "endFrame": 100,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 55,
          "endFrame": 94,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 55,
          "endFrame": 94,
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
          "endFrame": 47,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 278,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 278,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 278,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 278,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 9,
          "endFrame": 60,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 57,
          "endFrame": 67,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 58,
          "endFrame": 63,
          "actionIndex": 18,
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 4.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  4.45,
                  4.89,
                  5.34,
                  5.78,
                  6.22,
                  6.67,
                  7.11,
                  7.56,
                  8.0,
                  8.56,
                  9.23,
                  10.0
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
                  4.45,
                  4.89,
                  5.34,
                  5.78,
                  6.22,
                  6.67,
                  7.11,
                  7.56,
                  8.0,
                  8.56,
                  9.23,
                  10.0
                ]
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
          "sequenceIndex": 6
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 85,
          "actionIndex": 21,
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
          "sequenceIndex": 7
        },
        {
          "startFrame": 55,
          "endFrame": 58,
          "actionIndex": 22,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0004_pelica_ultimate_skill:chr_0004_pelica_ultimate_skill_abilityrange",
          "classification": "nonCombatAbilityEntity",
          "targetSource": "",
          "targetGroupKey": "",
          "count": null,
          "buffSource": null,
          "inheritSourceSkillCastInfo": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [],
          "buffSourceContextKey": null,
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
          "spawnFrame": 55,
          "actionOrder": [
            22
          ],
          "abilityEntityId": "abilityentity_chr_0004_pelica_ultimate_skill",
          "skillId": "chr_0004_pelica_ultimate_skill_abilityrange",
          "sourceFile": "chr_0004_pelica_ultimate_skill_abilityrange.json",
          "entityBlackboardAssignments": [],
          "spawnPayload": {
            "abilityEntityId": "abilityentity_chr_0004_pelica_ultimate_skill",
            "skillId": "chr_0004_pelica_ultimate_skill_abilityrange",
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
          "conditionalActions": [],
          "inflictions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileTriggeredSkills": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [],
          "cycleTruncated": false,
          "inheritsSourceBlackboard": true,
          "declaredBlackboard": [],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "auraActions": []
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
            4.45,
            4.89,
            5.34,
            5.78,
            6.22,
            6.67,
            7.11,
            7.56,
            8.0,
            8.56,
            9.23,
            10.0
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
          "value": 8.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_2",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "crit",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "radius",
          "value": 4.0,
          "isDynamic": false
        },
        {
          "key": "select_radius",
          "value": 10.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "crit",
        "poise",
        "radius",
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
          "key": "atk_scale_2",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "crit",
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
        "SpawnAbilityEntity"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
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
          "intervalSeconds": null
        },
        {
          "startFrame": 58,
          "endFrame": 63,
          "actionIndex": 16,
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
          "intervalSeconds": null
        }
      ],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionIndex": 8,
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
          "sequenceIndex": 2,
          "effectAbilityEntityTargets": []
        }
      ]
    }
  ]
} as const satisfies GeneratedOperatorSource;
