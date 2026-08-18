/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const fluoriteGeneratedSource = {
  "slug": "fluorite",
  "buffDefinitions": [
    {
      "buffId": "buff_chr_0022_bounda_normal_skill_onlymark",
      "sourceFile": "buff_chr_0022_bounda_normal_skill_onlymark.json",
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
        "hasStackEffects": false
      },
      "blackboard": [],
      "applyTagIds": [
        -1486085048
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
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
    },
    {
      "buffId": "buff_chr_0022_bounda_potential_4",
      "sourceFile": "buff_chr_0022_bounda_potential_4.json",
      "sourceAvailable": true,
      "lifecycle": {
        "lifeType": "Limited",
        "duration": {
          "value": 10.0,
          "blackboardKey": "duration_potential_4",
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
        "hasStackEffects": false
      },
      "blackboard": [
        {
          "key": "atk_up_potential_4",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration_potential_4",
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
            "blackboardKey": "atk_up_potential_4",
            "levelValues": [
              0.0
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
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
    },
    {
      "buffId": "buff_chr_0022_bounda_talent_1",
      "sourceFile": "buff_chr_0022_bounda_talent_1.json",
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
        "hasStackEffects": false
      },
      "blackboard": [
        {
          "key": "dmg_up",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "applyTagIds": [],
      "extendTagIds": [],
      "attributeModifiers": [],
      "damageModifiers": [
        {
          "enabledSide": "Attacker",
          "targetSource": "Target",
          "targetGroupKey": "",
          "tagQueryType": "hasAny",
          "tagIds": [
            1925762097
          ],
          "processors": [
            {
              "side": "Attacker",
              "zone": "NormalCalcZone",
              "addition": {
                "value": 0.0,
                "blackboardKey": "dmg_up",
                "levelValues": [
                  0.0
                ]
              }
            }
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "eventActions": [],
      "sourceDeathFinish": null,
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
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "SetSuperArmorAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [],
              "priority": 0
            }
          ]
        }
      ],
      "sourceDeathFinish": null,
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
          "createdBuffIds": [],
          "forEachActions": [],
          "targetGroupWrites": [],
          "sequences": [
            {
              "onlyMainOperator": false,
              "onlyGuard": false,
              "orderedActionTypes": [
                "SetSuperArmorAction"
              ],
              "combatActions": [],
              "buffApplications": [],
              "actions": [],
              "priority": 0
            }
          ]
        }
      ],
      "sourceDeathFinish": null,
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
      "sourceDeathFinish": null,
      "resourceGains": [],
      "combatActions": [],
      "unparsedPayloads": [],
      "auraActions": []
    }
  ],
  "skills": [
    {
      "key": "basicAttack1",
      "skillId": "chr_0022_bounda_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0022_bounda_attack1.json",
      "timelineBlockFrames": 22,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 13,
      "allowNextWindows": [
        {
          "startFrame": 22,
          "endFrame": 40,
          "skillIds": [
            "chr_0022_bounda_attack2"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 10,
          "endFrame": 40,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0022_bounda_attack2",
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
          "endFrame": 132,
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
          "endFrame": 77,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 56,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 16,
          "actionTypes": [
            "CameraImpulseAction"
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
          "startFrame": 0,
          "endFrame": 132,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 132,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 49,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 51,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 42,
          "endFrame": 115,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 40,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 22,
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
          "launchFrame": 13,
          "projectileId": "projectile_chr_0022_bounda_attack1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_attack1_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 13,
          "actionOrder": [
            7
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_attack1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_attack1_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_attack1_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
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
      "targetGroupWrites": [
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "emit_pos",
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
      "skillId": "chr_0022_bounda_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0022_bounda_attack2.json",
      "timelineBlockFrames": 15,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 9,
      "allowNextWindows": [
        {
          "startFrame": 15,
          "endFrame": 36,
          "skillIds": [
            "chr_0022_bounda_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 10,
          "endFrame": 36,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0022_bounda_attack3",
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
          "endFrame": 126,
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
          "endFrame": 77,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 15,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 12,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
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
          "endFrame": 126,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 126,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 48,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 47,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 55,
          "endFrame": 102,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 36,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 36,
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
          "projectileId": "projectile_chr_0022_bounda_attack1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_attack2_projhit"
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
            5
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_attack1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_attack2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_attack2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
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
          ],
          "display_atk_scale": [
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
          "startFrame": 9,
          "endFrame": 12,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[4]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "emit_pos",
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
      "skillId": "chr_0022_bounda_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0022_bounda_attack3.json",
      "timelineBlockFrames": 18,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 9,
      "allowNextWindows": [
        {
          "startFrame": 18,
          "endFrame": 24,
          "skillIds": [
            "chr_0022_bounda_attack4"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 30,
          "skillIds": [
            "chr_0022_bounda_attack4_1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 10,
          "endFrame": 24,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0022_bounda_attack4",
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
        },
        {
          "startFrame": 24,
          "endFrame": 30,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0022_bounda_attack4_1",
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
          "endFrame": 6,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 137,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 10,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 19,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 0,
          "endFrame": 42,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 49,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 27,
          "endFrame": 91,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 24,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 30,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 24,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 24,
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
          "launchFrame": 9,
          "projectileId": "projectile_chr_0022_bounda_attack1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_attack3_projhit"
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
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_attack1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_attack3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_attack3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.26,
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
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.26,
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
            0.26,
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
          "targetGroupKey": "emit_pos",
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
      "key": "basicAttack4",
      "skillId": "chr_0022_bounda_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0022_bounda_attack4.json",
      "timelineBlockFrames": 52,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 29,
      "allowNextWindows": [
        {
          "startFrame": 52,
          "endFrame": 71,
          "skillIds": [
            "chr_0022_bounda_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 29,
          "endFrame": 71,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0022_bounda_attack1",
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
          "endFrame": 11,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 153,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 30,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 33,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 29,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 29,
          "actionTypes": [
            "AddCameraControlStateAction"
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
          "startFrame": 29,
          "endFrame": 73,
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
          "startFrame": 14,
          "endFrame": 32,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 29,
          "endFrame": 39,
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
          "startFrame": 0,
          "endFrame": 153,
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
          "startFrame": 63,
          "endFrame": 103,
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
          "startFrame": 29,
          "endFrame": 71,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 52,
          "endFrame": 71,
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
          "launchFrame": 29,
          "projectileId": "projectile_chr_0022_bounda_attack4",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_attack4_projhit"
            },
            {
              "event": "block",
              "skillId": "chr_0022_bounda_attack4_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 29,
          "actionOrder": [
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_attack4",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_attack4_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_attack4_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.6,
                  0.66,
                  0.72,
                  0.78,
                  0.84,
                  0.9,
                  0.96,
                  1.02,
                  1.08,
                  1.16,
                  1.25,
                  1.35
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
                "blackboardKey": "attack_poise",
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
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.6,
                      0.66,
                      0.72,
                      0.78,
                      0.84,
                      0.9,
                      0.96,
                      1.02,
                      1.08,
                      1.16,
                      1.25,
                      1.35
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
                    "blackboardKey": "attack_poise",
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
            0.6,
            0.66,
            0.72,
            0.78,
            0.84,
            0.9,
            0.96,
            1.02,
            1.08,
            1.16,
            1.25,
            1.35
          ],
          "attack_poise": [
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
          "display_atk_scale": [
            1.8,
            1.98,
            2.16,
            2.34,
            2.52,
            2.7,
            2.88,
            3.06,
            3.24,
            3.47,
            3.74,
            4.05
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
        },
        {
          "key": "attack_poise",
          "value": 0.0,
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
          "key": "attack_poise",
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
          "startFrame": 29,
          "endFrame": 30,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "emit_pos",
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
      "key": "basicAttack5",
      "skillId": "chr_0022_bounda_attack4_1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0022_bounda_attack4_1.json",
      "timelineBlockFrames": 49,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 9,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 26,
      "allowNextWindows": [
        {
          "startFrame": 49,
          "endFrame": 70,
          "skillIds": [
            "chr_0022_bounda_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 10,
          "endFrame": 70,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0022_bounda_attack1",
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
          "endFrame": 150,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 11,
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
          "startFrame": 26,
          "endFrame": 27,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 30,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 26,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 26,
          "actionTypes": [
            "AddCameraControlStateAction"
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
          "startFrame": 26,
          "endFrame": 70,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 11,
          "endFrame": 26,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 36,
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
          "endFrame": 150,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 41,
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
          "startFrame": 51,
          "endFrame": 82,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 70,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 49,
          "endFrame": 70,
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
          "launchFrame": 26,
          "projectileId": "projectile_chr_0022_bounda_attack4",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_attack4_projhit"
            },
            {
              "event": "block",
              "skillId": "chr_0022_bounda_attack4_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 26,
          "actionOrder": [
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_attack4",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_attack4_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_attack4_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.6,
                  0.66,
                  0.72,
                  0.78,
                  0.84,
                  0.9,
                  0.96,
                  1.02,
                  1.08,
                  1.16,
                  1.25,
                  1.35
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
                "blackboardKey": "attack_poise",
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
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.6,
                      0.66,
                      0.72,
                      0.78,
                      0.84,
                      0.9,
                      0.96,
                      1.02,
                      1.08,
                      1.16,
                      1.25,
                      1.35
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
                    "blackboardKey": "attack_poise",
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
            0.6,
            0.66,
            0.72,
            0.78,
            0.84,
            0.9,
            0.96,
            1.02,
            1.08,
            1.16,
            1.25,
            1.35
          ],
          "attack_poise": [
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
          "display_atk_scale": [
            1.8,
            1.98,
            2.16,
            2.34,
            2.52,
            2.7,
            2.88,
            3.06,
            3.24,
            3.47,
            3.74,
            4.05
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
        },
        {
          "key": "attack_poise",
          "value": 0.0,
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
          "key": "attack_poise",
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
          "startFrame": 26,
          "endFrame": 27,
          "actionIndex": 3,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "emit_pos",
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
      "skillId": "chr_0022_bounda_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0022_bounda_power_attack.json",
      "timelineBlockFrames": 22,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 4,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 22,
          "endFrame": 45,
          "skillIds": [
            "chr_0022_bounda_normal_skill",
            "chr_0022_bounda_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 45,
          "mappings": [
            {
              "cmdType": "NormalSkill",
              "skillId": "chr_0022_bounda_normal_skill",
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
              "skillId": "chr_0022_bounda_combo_skill",
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
          "endFrame": 127,
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
          "startFrame": 33,
          "endFrame": 44,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 7,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction"
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
          "endFrame": 8,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "GainBreakingAttackAtb",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 23,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 24,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 25,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 24,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 24,
          "actionTypes": [
            "CheckEntityNum",
            "LockCameraAimAction",
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
          "startFrame": 0,
          "endFrame": 45,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 64,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 20,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 34,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 23,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 28,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 45,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 45,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 0,
          "endFrame": 135,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 38,
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
          "startFrame": 20,
          "endFrame": 30,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 20,
          "endFrame": 21,
          "actionIndex": 10,
          "damageUnits": [
            {
              "damageType": "Natural",
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
          "sequenceIndex": 6
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 45,
          "actionIndex": 30,
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
          "sequenceIndex": 13
        },
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionIndex": 36,
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
          "sequenceIndex": 19
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
      "targetGroupWrites": [],
      "targetGroupControlFlowActions": [],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [],
      "timeDilations": []
    },
    {
      "key": "plungingAttack",
      "skillId": "chr_0022_bounda_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0022_bounda_plunging_attack_end.json",
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
          "endFrame": 130,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector"
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
          "startFrame": 0,
          "endFrame": 10,
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
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "CameraImpulseAction",
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
          "endFrame": 20,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "endFrame": 60,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 33,
          "endFrame": 63,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 5,
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
          "sequenceIndex": 5
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[6]"
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[6]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 15,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 2.0,
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
                "spGainSource": "default",
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
          "isDynamic": true
        },
        {
          "key": "cd",
          "value": 15.0,
          "isDynamic": false
        },
        {
          "key": "dmg_scale",
          "value": 2.5,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 5.0,
          "isDynamic": false
        },
        {
          "key": "prob",
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
          "key": "cd",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "dmg_scale",
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
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 12,
          "actionPath": [
            "timelineActions[5]",
            "_sequenceActionData",
            "actionData",
            "[6]"
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
              "actionIndex": 1,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[6]",
                "succeedActions",
                "actionData",
                "[1]"
              ],
              "serverActionIndex": 15,
              "resourceGain": {
                "resource": "sp",
                "amount": {
                  "value": 2.0,
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
                "spGainSource": "default",
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
      "skillId": "chr_0022_bounda_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0022_bounda_normal_skill.json",
      "timelineBlockFrames": 35,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "Atb",
      "costValue": 40.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 101,
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
          "startFrame": 0,
          "endFrame": 2,
          "actionTypes": [
            "SelfRotateAction",
            "DebugPrintAction"
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
          "startFrame": 11,
          "endFrame": 64,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 68,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 10,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CreateBuffAction"
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
          "startFrame": 12,
          "endFrame": 14,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 26,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 17,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 17,
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
          "endFrame": 64,
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
          "startFrame": 48,
          "endFrame": 75,
          "actionTypes": [
            "PlaySoundAction"
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
          "endFrame": 150,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 150,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 20,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0022_bounda_normal_skill_onlymark",
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
          "blackboardAssignments": {},
          "nestedCombatActions": [],
          "buffSourceContextKey": "",
          "sequenceIndex": 7
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 10,
          "projectileId": "projectile_chr_0022_bounda_normal_skill",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_normal_skill_projhit"
            },
            {
              "event": "block",
              "skillId": "chr_0022_bounda_normal_skill_projhit"
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
            19
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_normal_skill",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_normal_skill_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_normal_skill_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 0,
              "actionType": "SpawnAbilityEntity",
              "sourceId": "abilityentity_chr_0022_bounda_normal_skill:chr_0022_bounda_normal_skill_abilityrange",
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
                "IfElseAction",
                "SlowAction",
                "SpellInfliction"
              ],
              "buffSourceContextKey": null,
              "sequenceIndex": 0
            }
          ],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "SlowAction",
            "SpawnAbilityEntity"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [
            {
              "spawnFrame": 10,
              "actionOrder": [
                19,
                0
              ],
              "abilityEntityId": "abilityentity_chr_0022_bounda_normal_skill",
              "skillId": "chr_0022_bounda_normal_skill_abilityrange",
              "sourceFile": "chr_0022_bounda_normal_skill_abilityrange.json",
              "entityBlackboardAssignments": [],
              "spawnPayload": {
                "abilityEntityId": "abilityentity_chr_0022_bounda_normal_skill",
                "skillId": "chr_0022_bounda_normal_skill_abilityrange",
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
              "directDamageHits": [
                {
                  "startFrame": 89,
                  "endFrame": 90,
                  "actionIndex": 6,
                  "damageUnits": [
                    {
                      "damageType": "Natural",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 3.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          1.87,
                          2.06,
                          2.24,
                          2.43,
                          2.62,
                          2.8,
                          2.99,
                          3.18,
                          3.36,
                          3.6,
                          3.88,
                          4.2
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
                  "sequenceIndex": 1
                },
                {
                  "startFrame": 149,
                  "endFrame": 150,
                  "actionIndex": 20,
                  "damageUnits": [
                    {
                      "damageType": "Natural",
                      "attributeType": "Hp",
                      "calculation": "standard",
                      "attackScale": {
                        "value": 3.0,
                        "blackboardKey": "atk_scale",
                        "levelValues": [
                          1.87,
                          2.06,
                          2.24,
                          2.43,
                          2.62,
                          2.8,
                          2.99,
                          3.18,
                          3.36,
                          3.6,
                          3.88,
                          4.2
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
                  "sequenceIndex": 3
                }
              ],
              "intervalDamageHits": [],
              "explicitFinishes": [
                {
                  "startFrame": 90,
                  "endFrame": 90,
                  "actionIndex": 14,
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
                  "sequenceIndex": 2
                },
                {
                  "startFrame": 150,
                  "endFrame": 150,
                  "actionIndex": 28,
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
              "timelineJumps": [
                {
                  "startFrame": 0,
                  "endFrame": 89,
                  "destFrame": 89,
                  "actionIndex": 29,
                  "actionPath": [
                    "timelineActions[5]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]"
                  ],
                  "conditionActionTypes": [
                    "CheckHp"
                  ],
                  "directConditions": [
                    {
                      "sourceType": "CheckHp",
                      "supported": false,
                      "comparison": null,
                      "left": null,
                      "right": null,
                      "skillTypes": [],
                      "health": {
                        "targetSource": "Target",
                        "targetGroupKey": "follow_tar",
                        "comparison": "LE",
                        "isRatio": true,
                        "value": {
                          "value": 0.0,
                          "blackboardKey": null,
                          "levelValues": null
                        }
                      },
                      "damageDecorateMask": null,
                      "contextBuffId": null
                    }
                  ],
                  "directConditionsSupported": true,
                  "isOnlySequenceAction": true,
                  "isOnlyBranchAction": true,
                  "isRootContainerOnlySequenceAction": true,
                  "sequenceIndex": 5
                },
                {
                  "startFrame": 0,
                  "endFrame": 89,
                  "destFrame": 149,
                  "actionIndex": 36,
                  "actionPath": [
                    "timelineActions[11]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]"
                  ],
                  "conditionActionTypes": [
                    "CheckBuffStackNum"
                  ],
                  "directConditions": [
                    {
                      "sourceType": "CheckBuffStackNum",
                      "supported": true,
                      "comparison": null,
                      "left": null,
                      "right": null,
                      "skillTypes": [],
                      "buffStack": {
                        "targetSource": "Target",
                        "targetGroupKey": "follow_tar",
                        "buffCheckType": "Id",
                        "buffIds": [
                          "buff_chr_0022_bounda_ultimate_skill"
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
                      "damageDecorateMask": null,
                      "contextBuffId": null
                    }
                  ],
                  "directConditionsSupported": true,
                  "isOnlySequenceAction": true,
                  "isOnlyBranchAction": true,
                  "isRootContainerOnlySequenceAction": true,
                  "sequenceIndex": 11
                }
              ],
              "conditionalActions": [
                {
                  "startFrame": 89,
                  "endFrame": 90,
                  "actionIndex": 8,
                  "actionPath": [
                    "timelineActions[1]",
                    "_sequenceActionData",
                    "actionData",
                    "[7]"
                  ],
                  "conditions": [
                    {
                      "sourceType": "CompareFloat",
                      "supported": true,
                      "comparison": "GE",
                      "left": {
                        "value": 0.0,
                        "blackboardKey": "potential_lv",
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
                        "value": 3.0,
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
                      "actionType": "SlowAction",
                      "actionIndex": 0,
                      "actionPath": [
                        "timelineActions[1]",
                        "_sequenceActionData",
                        "actionData",
                        "[7]",
                        "succeedActions",
                        "actionData",
                        "[0]"
                      ],
                      "serverActionIndex": 10,
                      "keywordAction": {
                        "startFrame": 89,
                        "endFrame": 90,
                        "actionIndex": 10,
                        "kind": "slow",
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
                        "duration": {
                          "value": 0.0,
                          "blackboardKey": "duration_potential",
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
                        "rate": {
                          "value": 0.0,
                          "blackboardKey": "move_speed_scalar",
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
                            0.3
                          ]
                        },
                        "autoFinishByAction": false,
                        "sequenceIndex": -1
                      }
                    }
                  ],
                  "failActions": []
                },
                {
                  "startFrame": 89,
                  "endFrame": 90,
                  "actionIndex": 11,
                  "actionPath": [
                    "timelineActions[1]",
                    "_sequenceActionData",
                    "actionData",
                    "[8]"
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
                        "timelineActions[1]",
                        "_sequenceActionData",
                        "actionData",
                        "[8]",
                        "succeedActions",
                        "actionData",
                        "[0]"
                      ],
                      "serverActionIndex": 13,
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
                },
                {
                  "startFrame": 149,
                  "endFrame": 150,
                  "actionIndex": 22,
                  "actionPath": [
                    "timelineActions[3]",
                    "_sequenceActionData",
                    "actionData",
                    "[7]"
                  ],
                  "conditions": [
                    {
                      "sourceType": "CompareFloat",
                      "supported": true,
                      "comparison": "GE",
                      "left": {
                        "value": 0.0,
                        "blackboardKey": "potential_lv",
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
                        "value": 3.0,
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
                      "actionType": "SlowAction",
                      "actionIndex": 0,
                      "actionPath": [
                        "timelineActions[3]",
                        "_sequenceActionData",
                        "actionData",
                        "[7]",
                        "succeedActions",
                        "actionData",
                        "[0]"
                      ],
                      "serverActionIndex": 24,
                      "keywordAction": {
                        "startFrame": 149,
                        "endFrame": 150,
                        "actionIndex": 24,
                        "kind": "slow",
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
                        "duration": {
                          "value": 0.0,
                          "blackboardKey": "duration_potential",
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
                        "rate": {
                          "value": 0.0,
                          "blackboardKey": "move_speed_scalar",
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
                            0.3
                          ]
                        },
                        "autoFinishByAction": false,
                        "sequenceIndex": -1
                      }
                    }
                  ],
                  "failActions": []
                },
                {
                  "startFrame": 149,
                  "endFrame": 150,
                  "actionIndex": 25,
                  "actionPath": [
                    "timelineActions[3]",
                    "_sequenceActionData",
                    "actionData",
                    "[8]"
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
                        "timelineActions[3]",
                        "_sequenceActionData",
                        "actionData",
                        "[8]",
                        "succeedActions",
                        "actionData",
                        "[0]"
                      ],
                      "serverActionIndex": 27,
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
                  "startFrame": 89,
                  "endFrame": 90,
                  "actionIndex": 5,
                  "element": "nature",
                  "isExtra": false,
                  "sequenceIndex": 1
                },
                {
                  "startFrame": 149,
                  "endFrame": 150,
                  "actionIndex": 19,
                  "element": "nature",
                  "isExtra": false,
                  "sequenceIndex": 3
                }
              ],
              "auxiliaryActions": [],
              "resourceGains": [],
              "projectileLaunches": [],
              "projectileTriggeredSkills": [],
              "nestedAbilityEntityHits": [],
              "combatActions": [
                "CreateBuffAction",
                "DamageAction",
                "IfElseAction",
                "SlowAction",
                "SpellInfliction"
              ],
              "cycleTruncated": false,
              "inheritsSourceBlackboard": true,
              "declaredBlackboard": [
                {
                  "key": "atk_scale",
                  "value": 1.0,
                  "isDynamic": false
                },
                {
                  "key": "boom_up",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "duration",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "duration_potential",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "move_speed_scalar",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "poise",
                  "value": 20.0,
                  "isDynamic": false
                },
                {
                  "key": "potential_lv",
                  "value": 0.0,
                  "isDynamic": false
                },
                {
                  "key": "usp",
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
          "auraActions": [],
          "keywordActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 2,
              "kind": "slow",
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
              "duration": {
                "value": 3.1,
                "blackboardKey": null,
                "levelValues": null
              },
              "rate": {
                "value": 0.0,
                "blackboardKey": "move_speed_scalar",
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
                  0.3
                ]
              },
              "autoFinishByAction": false,
              "sequenceIndex": 0
            }
          ]
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0022_bounda_normal_skill_onlymark"
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
            1.87,
            2.06,
            2.24,
            2.43,
            2.62,
            2.8,
            2.99,
            3.18,
            3.36,
            3.6,
            3.88,
            4.2
          ],
          "boom_up": [
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
            0.3
          ],
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
          "move_speed_scalar": [
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
            0.3
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
          "key": "boom_up",
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
          "key": "duration_potential",
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
          "key": "move_speed_scalar",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "potential_lv",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "cam_angle",
        "input_angle"
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
          "key": "boom_up",
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
          "key": "duration_potential",
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
          "key": "potential_lv",
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
        "LaunchProjectile"
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
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 17,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "targetGroupKey": "start",
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
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 18,
          "actionPath": [
            "timelineActions[7]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "targetGroupKey": "emitpos",
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
      "key": "comboSkill",
      "skillId": "chr_0022_bounda_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0022_bounda_combo_skill.json",
      "timelineBlockFrames": 17,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 12.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 17,
          "endFrame": 56,
          "skillIds": [
            "chr_0022_bounda_normal_skill"
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
              "skillId": "chr_0022_bounda_normal_skill",
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
          "endFrame": 94,
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
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "SelfRotateAction",
            "Selector"
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
          "endFrame": 15,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionTypes": [
            "SwitchAction",
            "SpellInfliction",
            "SpellInfliction",
            "DamageAction",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "IfElseAction",
            "ObtainCostAction",
            "EnemyHurtAnimAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 20,
          "actionTypes": [
            "EventListenerAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 25,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 11,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 20,
          "actionTypes": [
            "HitStopAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 19,
          "actionTypes": [
            "CheckEntityNum",
            "HitStopAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionTypes": [
            "CameraImpulseAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 19,
          "actionTypes": [
            "AddDynamicCcsAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 19,
          "actionTypes": [
            "LockCameraAimAction",
            "OverrideCameraFollowAction"
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
          "startFrame": 0,
          "endFrame": 13,
          "actionTypes": [
            "TimeDilationAction",
            "Selector"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 14,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 14,
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
          "endFrame": 45,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 17,
          "endFrame": 56,
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
          "endFrame": 130,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 63,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 28,
          "endFrame": 55,
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
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionIndex": 19,
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  1.69,
                  1.86,
                  2.03,
                  2.2,
                  2.37,
                  2.54,
                  2.7,
                  2.87,
                  3.04,
                  3.25,
                  3.51,
                  3.8
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
          "sequenceIndex": 6
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionIndex": 16,
          "actionPath": [
            "timelineActions[6]",
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
                "blackboardKey": "EntityBB_combo_index",
                "levelValues": null
              },
              "right": {
                "value": 2.0,
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
              "actionType": "SpellInfliction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "options",
                "[0]",
                "actionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 17,
              "infliction": {
                "element": "cryo",
                "isExtra": false
              }
            }
          ],
          "failActions": [
            {
              "actionType": "SwitchAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "options",
                "[1]"
              ],
              "serverActionIndex": 16,
              "nestedCondition": {
                "startFrame": 15,
                "endFrame": 18,
                "actionIndex": 16,
                "actionPath": [
                  "timelineActions[6]",
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
                      "blackboardKey": "EntityBB_combo_index",
                      "levelValues": null
                    },
                    "right": {
                      "value": 3.0,
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
                    "actionType": "SpellInfliction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[6]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[1]",
                      "actionData",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 18,
                    "infliction": {
                      "element": "nature",
                      "isExtra": false
                    }
                  }
                ],
                "failActions": []
              }
            }
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionIndex": 20,
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
                "targetSource": "Context",
                "targetGroupKey": "smart_target",
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
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 22,
              "resourceGain": {
                "resource": "ultimateEnergy",
                "amount": {
                  "value": 0.0,
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
      "referencedBuffIds": [
        "buff_chr_0022_bounda_potential_4"
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
          "atk_scale": [
            1.69,
            1.86,
            2.03,
            2.2,
            2.37,
            2.54,
            2.7,
            2.87,
            3.04,
            3.25,
            3.51,
            3.8
          ],
          "atk_scale_add_1": [
            0.4,
            0.45,
            0.5,
            0.55,
            0.6,
            0.65,
            0.7,
            0.75,
            0.8,
            1.0,
            1.2,
            1.2
          ],
          "atk_scale_add_2": [
            0.8,
            0.9,
            1.0,
            1.1,
            1.2,
            1.3,
            1.4,
            1.5,
            1.6,
            2.0,
            2.4,
            2.4
          ],
          "atk_scale_add_3": [
            1.05,
            1.2,
            1.35,
            1.5,
            1.65,
            1.8,
            1.95,
            2.1,
            2.25,
            2.6,
            3.2,
            3.2
          ],
          "atk_scale_add_4": [
            1.33,
            1.5,
            1.67,
            1.83,
            2.0,
            2.18,
            2.35,
            2.52,
            2.69,
            3.33,
            4.15,
            4.15
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
          40.0,
          40.0,
          40.0,
          40.0,
          40.0,
          40.0,
          40.0,
          40.0,
          40.0,
          40.0,
          40.0,
          38.0
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
          "value": 3.0,
          "isDynamic": true
        },
        {
          "key": "atk_scale_add",
          "value": 1.5,
          "isDynamic": true
        },
        {
          "key": "atk_scale_add_1",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_add_2",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_add_3",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_add_4",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale_potential5",
          "value": 1.3,
          "isDynamic": false
        },
        {
          "key": "cam_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cam_angle2",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cam_duration",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "cam_duration2",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "duration",
          "value": 3.0,
          "isDynamic": false
        },
        {
          "key": "infliction_num",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "input_angle2",
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
          "key": "potential_lv",
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
        "EntityBB_combo_index",
        "atk_scale",
        "atk_up_potential_4",
        "cam_angle2",
        "cam_duration2",
        "input_angle2",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
        "select_radius",
        "usp"
      ],
      "blackboardProvenance": [
        {
          "key": "EntityBB_combo_index",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        },
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
          "key": "atk_scale_add",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_add_1",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_add_2",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_add_3",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_add_4",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_scale_potential5",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_up_potential_4",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
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
          "key": "cam_angle2",
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
          "key": "cam_duration2",
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
          "key": "infliction_num",
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
          "key": "input_angle2",
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
        "DamageAction",
        "IfElseAction",
        "ObtainCostAction",
        "SpellInfliction",
        "SwitchAction"
      ],
      "buffHolds": [],
      "targetGroupWrites": [
        {
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
          "targetGroupKey": "smart_target",
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
          "endFrame": 1,
          "actionIndex": 4,
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
          "endFrame": 1,
          "actionIndex": 5,
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
          "startFrame": 0,
          "endFrame": 14,
          "actionIndex": 64,
          "actionPath": [
            "timelineActions[18]",
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
                "targetSource": "Context",
                "targetGroupKey": "smart_target",
                "minimumCount": 1,
                "comparison": "LT",
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
            }
          ],
          "failActions": []
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionIndex": 16,
          "actionPath": [
            "timelineActions[6]",
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
                "blackboardKey": "EntityBB_combo_index",
                "levelValues": null
              },
              "right": {
                "value": 2.0,
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
              "actionType": "SpellInfliction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "options",
                "[0]",
                "actionData",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 17,
              "infliction": {
                "element": "cryo",
                "isExtra": false
              }
            }
          ],
          "failActions": [
            {
              "actionType": "SwitchAction",
              "actionIndex": 0,
              "actionPath": [
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "options",
                "[1]"
              ],
              "serverActionIndex": 16,
              "nestedCondition": {
                "startFrame": 15,
                "endFrame": 18,
                "actionIndex": 16,
                "actionPath": [
                  "timelineActions[6]",
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
                      "blackboardKey": "EntityBB_combo_index",
                      "levelValues": null
                    },
                    "right": {
                      "value": 3.0,
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
                    "actionType": "SpellInfliction",
                    "actionIndex": 0,
                    "actionPath": [
                      "timelineActions[6]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "options",
                      "[1]",
                      "actionData",
                      "actionData",
                      "[0]"
                    ],
                    "serverActionIndex": 18,
                    "infliction": {
                      "element": "nature",
                      "isExtra": false
                    }
                  }
                ],
                "failActions": []
              }
            }
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionIndex": 20,
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
                "targetSource": "Context",
                "targetGroupKey": "smart_target",
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
                "timelineActions[6]",
                "_sequenceActionData",
                "actionData",
                "[2]",
                "succeedActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 22,
              "resourceGain": {
                "resource": "ultimateEnergy",
                "amount": {
                  "value": 0.0,
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
                "onlyMainOperator": true,
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
          "endFrame": 14,
          "actionIndex": 62,
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
                "timelineActions[18]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "failActions",
                "actionData",
                "[0]"
              ],
              "serverActionIndex": 64
            }
          ]
        }
      ],
      "auraActions": [],
      "physicalInflictions": [],
      "eventListeners": [
        {
          "startFrame": 0,
          "endFrame": 20,
          "actionIndex": 27,
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
                  "actionIndex": 30,
                  "payload": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0022_bounda_potential_4",
                        "classification": null,
                        "blackboardAssignments": {
                          "atk_up_potential_4": {
                            "value": 0.0,
                            "blackboardKey": "atk_up_potential_4",
                            "levelValues": null
                          },
                          "duration_potential_4": {
                            "value": 0.0,
                            "blackboardKey": "duration_potential_4",
                            "levelValues": null
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
                        "damageDecorateMask": {
                          "checkType": "HasAll",
                          "mask": 8192
                        },
                        "contextBuffId": null
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
                        "serverActionIndex": 29,
                        "nestedCondition": {
                          "startFrame": 0,
                          "endFrame": 0,
                          "actionIndex": 29,
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
                                "blackboardKey": "atk_up_potential_4",
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
                              "serverActionIndex": 30,
                              "buffApplication": {
                                "buffs": [
                                  {
                                    "buffId": "buff_chr_0022_bounda_potential_4",
                                    "classification": null,
                                    "blackboardAssignments": {
                                      "atk_up_potential_4": {
                                        "value": 0.0,
                                        "blackboardKey": "atk_up_potential_4",
                                        "levelValues": null
                                      },
                                      "duration_potential_4": {
                                        "value": 0.0,
                                        "blackboardKey": "duration_potential_4",
                                        "levelValues": null
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
                          "failActions": []
                        }
                      }
                    ],
                    "failActions": []
                  }
                }
              ],
              "priority": 0
            }
          ],
          "sequenceIndex": 8
        }
      ],
      "timeDilations": [
        {
          "startFrame": 0,
          "endFrame": 13,
          "actionIndex": 61,
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
                "postProcessorTypes": []
              },
              "spawnedObjectType": "AbilityEntity",
              "tagQueries": []
            }
          ],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 17,
          "effectAbilityEntityTargets": []
        }
      ]
    },
    {
      "key": "ultimate",
      "skillId": "chr_0022_bounda_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0022_bounda_ultimate_skill.json",
      "timelineBlockFrames": 77,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 100.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 77,
          "endFrame": 94,
          "skillIds": [
            "chr_0022_bounda_attack1",
            "chr_0022_bounda_normal_skill",
            "chr_0022_bounda_combo_skill"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 68,
          "endFrame": 94,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0022_bounda_attack1",
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
              "skillId": "chr_0022_bounda_normal_skill",
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
              "skillId": "chr_0022_bounda_combo_skill",
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
          "endFrame": 120,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 120,
          "actionTypes": [
            "CustomRootMotionAction"
          ]
        },
        {
          "startFrame": 57,
          "endFrame": 72,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 57,
          "endFrame": 72,
          "actionTypes": [
            "MoveToAction"
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
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 77,
          "actionTypes": [
            "AnimatedCameraAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionTypes": []
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
          "endFrame": 56,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 59,
          "endFrame": 60,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 63,
          "endFrame": 64,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 67,
          "endFrame": 68,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 73,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 68,
          "endFrame": 94,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 77,
          "endFrame": 94,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 77,
          "actionTypes": [
            "ChannelingCastingAction"
          ]
        },
        {
          "startFrame": 58,
          "endFrame": 62,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 63,
          "endFrame": 67,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 67,
          "endFrame": 71,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 76,
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
          "endFrame": 89,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 64,
          "endFrame": 98,
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
          "startFrame": 56,
          "endFrame": 91,
          "actionTypes": [
            "EffectAction"
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
          "startFrame": 1,
          "endFrame": 16,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionIndex": 21,
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
          "sequenceIndex": 8
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 59,
          "projectileId": "projectile_chr_0022_bounda_ultimate_skill_1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_ultimate_skill_1_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 63,
          "projectileId": "projectile_chr_0022_bounda_ultimate_skill_1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_ultimate_skill_2_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 67,
          "projectileId": "projectile_chr_0022_bounda_ultimate_skill_1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_ultimate_skill_3_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        },
        {
          "launchFrame": 72,
          "projectileId": "projectile_chr_0022_bounda_ultimate_skill_1",
          "skillTriggers": [
            {
              "event": "hit",
              "skillId": "chr_0022_bounda_ultimate_skill_4_projhit"
            }
          ],
          "assignBlackboard": true,
          "entityBlackboardAssignments": []
        }
      ],
      "projectileTriggeredSkills": [
        {
          "launchFrame": 59,
          "actionOrder": [
            25
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_ultimate_skill_1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_ultimate_skill_1_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_ultimate_skill_1_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale1",
                "levelValues": [
                  1.11,
                  1.22,
                  1.33,
                  1.44,
                  1.56,
                  1.67,
                  1.78,
                  1.89,
                  2.0,
                  2.14,
                  2.31,
                  2.5
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
                    "blackboardKey": "atk_scale1",
                    "levelValues": [
                      1.11,
                      1.22,
                      1.33,
                      1.44,
                      1.56,
                      1.67,
                      1.78,
                      1.89,
                      2.0,
                      2.14,
                      2.31,
                      2.5
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
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 6,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0022_bounda_ultimate_skill",
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
              "blackboardAssignments": {},
              "nestedCombatActions": [],
              "buffSourceContextKey": "",
              "sequenceIndex": 0
            }
          ],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 63,
          "actionOrder": [
            26
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_ultimate_skill_1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_ultimate_skill_2_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_ultimate_skill_2_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale2",
                "levelValues": [
                  1.11,
                  1.22,
                  1.33,
                  1.44,
                  1.56,
                  1.67,
                  1.78,
                  1.89,
                  2.0,
                  2.14,
                  2.31,
                  2.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 512
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
                    "blackboardKey": "atk_scale2",
                    "levelValues": [
                      1.11,
                      1.22,
                      1.33,
                      1.44,
                      1.56,
                      1.67,
                      1.78,
                      1.89,
                      2.0,
                      2.14,
                      2.31,
                      2.5
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 512
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
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 6,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0022_bounda_ultimate_skill",
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
              "blackboardAssignments": {},
              "nestedCombatActions": [],
              "buffSourceContextKey": "",
              "sequenceIndex": 0
            }
          ],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 67,
          "actionOrder": [
            27
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_ultimate_skill_1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_ultimate_skill_3_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_ultimate_skill_3_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale3",
                "levelValues": [
                  1.11,
                  1.22,
                  1.33,
                  1.44,
                  1.56,
                  1.67,
                  1.78,
                  1.89,
                  2.0,
                  2.14,
                  2.31,
                  2.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 512
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
                    "blackboardKey": "atk_scale3",
                    "levelValues": [
                      1.11,
                      1.22,
                      1.33,
                      1.44,
                      1.56,
                      1.67,
                      1.78,
                      1.89,
                      2.0,
                      2.14,
                      2.31,
                      2.5
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 512
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
              "sequenceIndex": 0
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 6,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0022_bounda_ultimate_skill",
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
              "blackboardAssignments": {},
              "nestedCombatActions": [],
              "buffSourceContextKey": "",
              "sequenceIndex": 0
            }
          ],
          "resourceGains": [],
          "inflictions": [],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileTriggeredSkills": [],
          "abilityEntityHits": [],
          "auraActions": []
        },
        {
          "launchFrame": 72,
          "actionOrder": [
            28
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0022_bounda_ultimate_skill_1",
          "triggerEvent": "hit",
          "triggerSkillId": "chr_0022_bounda_ultimate_skill_4_projhit",
          "excludedByPrimaryTargetMarker": false,
          "sourceFile": "chr_0022_bounda_ultimate_skill_4_projhit.json",
          "damageUnits": [
            {
              "damageType": "Natural",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.9,
                "blackboardKey": "atk_scale4",
                "levelValues": [
                  1.11,
                  1.22,
                  1.33,
                  1.44,
                  1.56,
                  1.67,
                  1.78,
                  1.89,
                  2.0,
                  2.14,
                  2.31,
                  2.5
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null,
              "definiteValue": null,
              "damageDecorateMask": 512
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
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 6,
              "damageUnits": [
                {
                  "damageType": "Natural",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.9,
                    "blackboardKey": "atk_scale4",
                    "levelValues": [
                      1.11,
                      1.22,
                      1.33,
                      1.44,
                      1.56,
                      1.67,
                      1.78,
                      1.89,
                      2.0,
                      2.14,
                      2.31,
                      2.5
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null,
                  "definiteValue": null,
                  "damageDecorateMask": 512
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
                      -1411846745
                    ],
                    "countType": "BuffCount",
                    "comparison": "GE",
                    "value": {
                      "value": 2.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "limitSkillCastId": false
                  },
                  "damageDecorateMask": null,
                  "contextBuffId": null
                }
              ],
              "succeedActions": [
                {
                  "actionType": "SpellInfliction",
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
                  "infliction": {
                    "element": "nature",
                    "isExtra": false
                  }
                }
              ],
              "failActions": [
                {
                  "actionType": "IfElseAction",
                  "actionIndex": 0,
                  "actionPath": [
                    "timelineActions[0]",
                    "_sequenceActionData",
                    "actionData",
                    "[0]",
                    "failActions",
                    "actionData",
                    "[0]"
                  ],
                  "serverActionIndex": 3,
                  "nestedCondition": {
                    "startFrame": 0,
                    "endFrame": 3,
                    "actionIndex": 3,
                    "actionPath": [
                      "timelineActions[0]",
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
                          "targetSource": "Target",
                          "targetGroupKey": "",
                          "buffCheckType": "Tag",
                          "buffIds": [],
                          "tagQueryType": "hasAny",
                          "buffTagIds": [
                            1570888476
                          ],
                          "countType": "BuffCount",
                          "comparison": "GE",
                          "value": {
                            "value": 2.0,
                            "blackboardKey": null,
                            "levelValues": null
                          },
                          "limitSkillCastId": false
                        },
                        "damageDecorateMask": null,
                        "contextBuffId": null
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "SpellInfliction",
                        "actionIndex": 0,
                        "actionPath": [
                          "timelineActions[0]",
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
                        "serverActionIndex": 5,
                        "infliction": {
                          "element": "cryo",
                          "isExtra": false
                        }
                      }
                    ],
                    "failActions": []
                  }
                }
              ]
            }
          ],
          "auxiliaryActions": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 12,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0022_bounda_ultimate_skill",
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
              "blackboardAssignments": {},
              "nestedCombatActions": [],
              "buffSourceContextKey": "",
              "sequenceIndex": 0
            }
          ],
          "resourceGains": [],
          "inflictions": [],
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
          "atk_scale1": [
            1.11,
            1.22,
            1.33,
            1.44,
            1.56,
            1.67,
            1.78,
            1.89,
            2.0,
            2.14,
            2.31,
            2.5
          ],
          "atk_scale2": [
            1.11,
            1.22,
            1.33,
            1.44,
            1.56,
            1.67,
            1.78,
            1.89,
            2.0,
            2.14,
            2.31,
            2.5
          ],
          "atk_scale3": [
            1.11,
            1.22,
            1.33,
            1.44,
            1.56,
            1.67,
            1.78,
            1.89,
            2.0,
            2.14,
            2.31,
            2.5
          ],
          "atk_scale4": [
            1.11,
            1.22,
            1.33,
            1.44,
            1.56,
            1.67,
            1.78,
            1.89,
            2.0,
            2.14,
            2.31,
            2.5
          ],
          "boom_up": [
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
            0.3
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
          "key": "atk_scale1",
          "value": 0.23,
          "isDynamic": false
        },
        {
          "key": "atk_scale2",
          "value": 1.35,
          "isDynamic": false
        },
        {
          "key": "atk_scale3",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale4",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "boom_up",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 12.0,
          "isDynamic": false
        },
        {
          "key": "ex_usp_up",
          "value": 0.3,
          "isDynamic": false
        },
        {
          "key": "has_potential4",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [],
      "blackboardProvenance": [
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
          "key": "boom_up",
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
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "ex_usp_up",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "has_potential4",
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
        "CreateBuffAction",
        "LaunchProjectile"
      ],
      "buffHolds": [],
      "targetGroupWrites": [],
      "targetGroupControlFlowActions": [],
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
          "ignoredAbilityEntityTargets": [],
          "influenceSkillCooldown": null,
          "targetScale": null,
          "sequenceIndex": 4,
          "effectAbilityEntityTargets": []
        },
        {
          "startFrame": 0,
          "endFrame": 56,
          "actionIndex": 23,
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
          "sequenceIndex": 10,
          "effectAbilityEntityTargets": []
        }
      ]
    }
  ]
} as const satisfies GeneratedOperatorSource;
