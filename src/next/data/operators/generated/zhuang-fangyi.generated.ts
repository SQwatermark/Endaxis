/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const zhuangFangyiGeneratedSource = {
  "slug": "zhuang-fangyi",
  "skills": [
    {
      "key": "basicAttack1",
      "skillId": "chr_0030_zhuangfy_attack1",
      "skillType": "basicAttack",
      "sourceFile": "chr_0030_zhuangfy_attack1.json",
      "timelineBlockFrames": 15,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 6,
      "allowNextWindows": [
        {
          "startFrame": 15,
          "endFrame": 30,
          "skillIds": [
            "chr_0030_zhuangfy_attack2"
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
              "skillId": "chr_0030_zhuangfy_attack2",
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
          "endFrame": 122,
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
          "endFrame": 123,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionTypes": [
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 9,
          "actionTypes": [
            "LaunchProjectile",
            "Selector"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 26,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 23,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 0,
          "endFrame": 29,
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
        },
        {
          "startFrame": 8,
          "endFrame": 18,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 123,
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
          "launchFrame": 6,
          "projectileId": "projectile_chr_0030_zhuangfy_attack1",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0030_zhuangfy_attack1_projhit"
        },
        {
          "launchFrame": 8,
          "projectileId": "projectile_chr_0030_zhuangfy_attack1",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0030_zhuangfy_attack1_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 6,
          "actionOrder": [
            3
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0030_zhuangfy_attack1",
          "hitSkillId": "chr_0030_zhuangfy_attack1_projhit",
          "sourceFile": "chr_0030_zhuangfy_attack1_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.12,
                  0.13,
                  0.14,
                  0.14,
                  0.15,
                  0.17,
                  0.18
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.08,
                      0.09,
                      0.1,
                      0.1,
                      0.11,
                      0.12,
                      0.13,
                      0.14,
                      0.14,
                      0.15,
                      0.17,
                      0.18
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null
                }
              ]
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 8,
          "actionOrder": [
            4
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0030_zhuangfy_attack1",
          "hitSkillId": "chr_0030_zhuangfy_attack1_projhit",
          "sourceFile": "chr_0030_zhuangfy_attack1_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.12,
                  0.13,
                  0.14,
                  0.14,
                  0.15,
                  0.17,
                  0.18
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale",
                    "levelValues": [
                      0.08,
                      0.09,
                      0.1,
                      0.1,
                      0.11,
                      0.12,
                      0.13,
                      0.14,
                      0.14,
                      0.15,
                      0.17,
                      0.18
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null
                }
              ]
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "buffBehaviors": [],
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
            0.08,
            0.09,
            0.1,
            0.1,
            0.11,
            0.12,
            0.13,
            0.14,
            0.14,
            0.15,
            0.17,
            0.18
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
          "value": 0.25,
          "isDynamic": false
        },
        {
          "key": "atk_scale_sword",
          "value": 0.2,
          "isDynamic": false
        },
        {
          "key": "sword_dist",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [],
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
          "key": "atk_scale_sword",
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
          "key": "sword_dist",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "LaunchProjectile"
      ]
    },
    {
      "key": "basicAttack2",
      "skillId": "chr_0030_zhuangfy_attack2",
      "skillType": "basicAttack",
      "sourceFile": "chr_0030_zhuangfy_attack2.json",
      "timelineBlockFrames": 15,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 15,
      "allowNextWindows": [
        {
          "startFrame": 15,
          "endFrame": 36,
          "skillIds": [
            "chr_0030_zhuangfy_attack3"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 36,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0030_zhuangfy_attack3",
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
          "endFrame": 320,
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
          "endFrame": 320,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 3,
          "actionTypes": [
            "SaveTargetDistanceAction",
            "ModifyDynamicBlackboard",
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 3,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "LaunchProjectile",
            "Selector"
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
          "startFrame": 15,
          "endFrame": 18,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "SpawnAbilityEntity"
          ]
        },
        {
          "startFrame": 1,
          "endFrame": 23,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 32,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 72,
          "endFrame": 254,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 320,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "endFrame": 43,
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
        },
        {
          "startFrame": 8,
          "endFrame": 18,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 15,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 2,
          "endFrame": 3,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "LE",
              "left": {
                "value": 0.0,
                "blackboardKey": "sword_dist",
                "levelValues": null
              },
              "right": {
                "value": 10.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "skillTypes": []
            }
          ],
          "succeedActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "blackboardMutation": {
                "key": "sword_dist",
                "operation": "Add",
                "value": {
                  "value": 3.0,
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
              "blackboardMutation": {
                "key": "sword_dist",
                "operation": "Assign",
                "value": {
                  "value": 14.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            }
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionIndex": 13,
          "actionPath": [
            "timelineActions[6]",
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
              "skillTypes": []
            }
          ],
          "succeedActions": [
            {
              "actionType": "SpawnAbilityEntity",
              "actionIndex": 2,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack2",
                "skillId": "chr_0030_zhuangfy_attack2_abilityrange"
              }
            }
          ],
          "failActions": [
            {
              "actionType": "SpawnAbilityEntity",
              "actionIndex": 2,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack2",
                "skillId": "chr_0030_zhuangfy_attack2_abilityrange"
              }
            }
          ]
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
          "launchFrame": 2,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_1",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0030_zhuangfy_attack2_sword_projhit"
        },
        {
          "launchFrame": 2,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_2",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0030_zhuangfy_attack2_sword_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 2,
          "actionOrder": [
            10
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_1",
          "hitSkillId": "chr_0030_zhuangfy_attack2_sword_projhit",
          "sourceFile": "chr_0030_zhuangfy_attack2_sword_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_sword",
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
              "poiseValue": null
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale_sword",
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
                  "poiseValue": null
                }
              ]
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 2,
          "actionOrder": [
            11
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_2",
          "hitSkillId": "chr_0030_zhuangfy_attack2_sword_projhit",
          "sourceFile": "chr_0030_zhuangfy_attack2_sword_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_sword",
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
              "poiseValue": null
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale_sword",
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
                  "poiseValue": null
                }
              ]
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "buffBehaviors": [],
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
            0.04,
            0.04,
            0.04,
            0.05,
            0.05,
            0.05,
            0.06,
            0.06,
            0.06,
            0.07,
            0.07,
            0.08
          ],
          "atk_scale_sword": [
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
          "display_atk_scale": [
            0.24,
            0.26,
            0.29,
            0.31,
            0.34,
            0.36,
            0.38,
            0.41,
            0.43,
            0.46,
            0.5,
            0.54
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
          "value": 0.6,
          "isDynamic": false
        },
        {
          "key": "atk_scale_sword",
          "value": 0.4,
          "isDynamic": false
        },
        {
          "key": "sword_dist",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "sword_dist"
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
          "key": "atk_scale_sword",
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
          "key": "sword_dist",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "LaunchProjectile",
        "SpawnAbilityEntity"
      ]
    },
    {
      "key": "basicAttack3",
      "skillId": "chr_0030_zhuangfy_attack3",
      "skillType": "basicAttack",
      "sourceFile": "chr_0030_zhuangfy_attack3.json",
      "timelineBlockFrames": 26,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 14,
      "allowNextWindows": [
        {
          "startFrame": 26,
          "endFrame": 39,
          "skillIds": [
            "chr_0030_zhuangfy_attack4"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 39,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0030_zhuangfy_attack4",
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
          "endFrame": 105,
          "actionTypes": [
            "PlayAnimationAction"
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
          "endFrame": 105,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 15,
          "actionTypes": [
            "SaveTargetDistanceAction",
            "ModifyDynamicBlackboard",
            "FindTargetAction",
            "Selector"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 15,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "Selector",
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 17,
          "actionTypes": [
            "LaunchProjectile",
            "Selector",
            "Selector",
            "LaunchProjectile",
            "Selector",
            "Selector"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 18,
          "actionTypes": [
            "ShowHideActorAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 33,
          "actionTypes": [
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 37,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 46,
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
          "endFrame": 105,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 78,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 98,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 8,
          "endFrame": 23,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 39,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 39,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 21,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 25,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 14,
          "endFrame": 15,
          "actionIndex": 4,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[1]"
          ],
          "conditions": [
            {
              "sourceType": "CompareFloat",
              "supported": true,
              "comparison": "LE",
              "left": {
                "value": 0.0,
                "blackboardKey": "sword_dist",
                "levelValues": null
              },
              "right": {
                "value": 10.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "skillTypes": []
            }
          ],
          "succeedActions": [
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 0,
              "blackboardMutation": {
                "key": "sword_dist",
                "operation": "Add",
                "value": {
                  "value": 3.0,
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
              "blackboardMutation": {
                "key": "sword_dist",
                "operation": "Assign",
                "value": {
                  "value": 14.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            }
          ]
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
          "launchFrame": 14,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_1",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0030_zhuangfy_attack3_sword_projhit"
        },
        {
          "launchFrame": 14,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_2",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0030_zhuangfy_attack3_sword_projhit"
        },
        {
          "launchFrame": 16,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_2",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0030_zhuangfy_attack3_sword_projhit"
        },
        {
          "launchFrame": 16,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_1",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0030_zhuangfy_attack3_sword_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 14,
          "actionOrder": [
            10
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_1",
          "hitSkillId": "chr_0030_zhuangfy_attack3_sword_projhit",
          "sourceFile": "chr_0030_zhuangfy_attack3_sword_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_sword",
                "levelValues": [
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.12,
                  0.13,
                  0.14,
                  0.14,
                  0.15,
                  0.17,
                  0.18
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale_sword",
                    "levelValues": [
                      0.08,
                      0.09,
                      0.1,
                      0.1,
                      0.11,
                      0.12,
                      0.13,
                      0.14,
                      0.14,
                      0.15,
                      0.17,
                      0.18
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null
                }
              ]
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 14,
          "actionOrder": [
            11
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_2",
          "hitSkillId": "chr_0030_zhuangfy_attack3_sword_projhit",
          "sourceFile": "chr_0030_zhuangfy_attack3_sword_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_sword",
                "levelValues": [
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.12,
                  0.13,
                  0.14,
                  0.14,
                  0.15,
                  0.17,
                  0.18
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale_sword",
                    "levelValues": [
                      0.08,
                      0.09,
                      0.1,
                      0.1,
                      0.11,
                      0.12,
                      0.13,
                      0.14,
                      0.14,
                      0.15,
                      0.17,
                      0.18
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null
                }
              ]
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 16,
          "actionOrder": [
            12
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_2",
          "hitSkillId": "chr_0030_zhuangfy_attack3_sword_projhit",
          "sourceFile": "chr_0030_zhuangfy_attack3_sword_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_sword",
                "levelValues": [
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.12,
                  0.13,
                  0.14,
                  0.14,
                  0.15,
                  0.17,
                  0.18
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale_sword",
                    "levelValues": [
                      0.08,
                      0.09,
                      0.1,
                      0.1,
                      0.11,
                      0.12,
                      0.13,
                      0.14,
                      0.14,
                      0.15,
                      0.17,
                      0.18
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null
                }
              ]
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 16,
          "actionOrder": [
            13
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0030_zhuangfy_attack_sword_1",
          "hitSkillId": "chr_0030_zhuangfy_attack3_sword_projhit",
          "sourceFile": "chr_0030_zhuangfy_attack3_sword_projhit.json",
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 0.0,
                "blackboardKey": "atk_scale_sword",
                "levelValues": [
                  0.08,
                  0.09,
                  0.1,
                  0.1,
                  0.11,
                  0.12,
                  0.13,
                  0.14,
                  0.14,
                  0.15,
                  0.17,
                  0.18
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null
            }
          ],
          "directDamageHits": [
            {
              "startFrame": 0,
              "endFrame": 1,
              "actionIndex": 0,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale_sword",
                    "levelValues": [
                      0.08,
                      0.09,
                      0.1,
                      0.1,
                      0.11,
                      0.12,
                      0.13,
                      0.14,
                      0.14,
                      0.15,
                      0.17,
                      0.18
                    ]
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null
                }
              ]
            }
          ],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [
            "DamageAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "buffBehaviors": [],
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
          "atk_scale_sword": [
            0.08,
            0.09,
            0.1,
            0.1,
            0.11,
            0.12,
            0.13,
            0.14,
            0.14,
            0.15,
            0.17,
            0.18
          ],
          "display_atk_scale": [
            0.32,
            0.35,
            0.39,
            0.42,
            0.45,
            0.48,
            0.52,
            0.55,
            0.58,
            0.62,
            0.67,
            0.72
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
          "key": "atk_scale_sword",
          "value": 0.23,
          "isDynamic": false
        },
        {
          "key": "sword_dist",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "sword_dist"
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
          "key": "atk_scale_sword",
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
          "key": "sword_dist",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        }
      ],
      "unresolvedCombatActions": [
        "LaunchProjectile"
      ]
    },
    {
      "key": "basicAttack4",
      "skillId": "chr_0030_zhuangfy_attack4",
      "skillType": "basicAttack",
      "sourceFile": "chr_0030_zhuangfy_attack4.json",
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
          "endFrame": 33,
          "skillIds": [
            "chr_0030_zhuangfy_attack5"
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
              "skillId": "chr_0030_zhuangfy_attack5",
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
          "endFrame": 170,
          "actionTypes": [
            "PlayAnimationAction"
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
          "endFrame": 170,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 11,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 14,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "SpawnAbilityEntity"
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
          "startFrame": 0,
          "endFrame": 23,
          "actionTypes": [
            "SetSuperArmorAction"
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
          "startFrame": 0,
          "endFrame": 39,
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
          "endFrame": 33,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 33,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 2,
          "endFrame": 12,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 46,
          "endFrame": 125,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 11,
          "endFrame": 14,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[4]",
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
              "skillTypes": []
            }
          ],
          "succeedActions": [
            {
              "actionType": "SpawnAbilityEntity",
              "actionIndex": 2,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack2",
                "skillId": "chr_0030_zhuangfy_attack2_abilityrange"
              }
            }
          ],
          "failActions": [
            {
              "actionType": "SpawnAbilityEntity",
              "actionIndex": 2,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack2",
                "skillId": "chr_0030_zhuangfy_attack2_abilityrange"
              }
            }
          ]
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
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "buffBehaviors": [],
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
            0.11,
            0.12,
            0.14,
            0.15,
            0.16,
            0.17,
            0.18,
            0.19,
            0.2,
            0.22,
            0.23,
            0.25
          ],
          "display_atk_scale": [
            0.45,
            0.5,
            0.54,
            0.59,
            0.63,
            0.68,
            0.72,
            0.77,
            0.81,
            0.87,
            0.93,
            1.01
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
          "value": 1.07,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [],
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
        "SpawnAbilityEntity"
      ]
    },
    {
      "key": "basicAttack5",
      "skillId": "chr_0030_zhuangfy_attack5",
      "skillType": "basicAttack",
      "sourceFile": "chr_0030_zhuangfy_attack5.json",
      "timelineBlockFrames": 50,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 20,
      "allowNextWindows": [
        {
          "startFrame": 50,
          "endFrame": 60,
          "skillIds": [
            "chr_0030_zhuangfy_attack1"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 21,
          "endFrame": 60,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0030_zhuangfy_attack1",
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
          "endFrame": 165,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 20,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 165,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 23,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "SpawnAbilityEntity"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 22,
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
          "endFrame": 55,
          "actionTypes": [
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 165,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 43,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 70,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 60,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 50,
          "endFrame": 60,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 128,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 90,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 18,
          "endFrame": 84,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 123,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 40,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 4,
          "endFrame": 28,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 20,
          "endFrame": 23,
          "actionIndex": 6,
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
                "targetSource": "Target",
                "targetGroupKey": "",
                "minimumCount": 1,
                "comparison": "GE",
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 20,
                "endFrame": 23,
                "actionIndex": 8,
                "actionPath": [
                  "timelineActions[4]",
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
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "IfElseAction",
                    "actionIndex": 0,
                    "nestedCondition": {
                      "startFrame": 20,
                      "endFrame": 23,
                      "actionIndex": 10,
                      "actionPath": [
                        "timelineActions[4]",
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
                      "conditions": [
                        {
                          "sourceType": "CheckDistanceCondition",
                          "supported": false,
                          "comparison": null,
                          "left": null,
                          "right": null,
                          "skillTypes": []
                        }
                      ],
                      "succeedActions": [
                        {
                          "actionType": "SpawnAbilityEntity",
                          "actionIndex": 2,
                          "abilityEntitySpawn": {
                            "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack5",
                            "skillId": "chr_0030_zhuangfy_attack5_abilityrange"
                          }
                        }
                      ],
                      "failActions": [
                        {
                          "actionType": "SpawnAbilityEntity",
                          "actionIndex": 2,
                          "abilityEntitySpawn": {
                            "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack5",
                            "skillId": "chr_0030_zhuangfy_attack5_abilityrange"
                          }
                        }
                      ]
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 2,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack5",
                      "skillId": "chr_0030_zhuangfy_attack5_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "SpawnAbilityEntity",
              "actionIndex": 2,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack5",
                "skillId": "chr_0030_zhuangfy_attack5_abilityrange"
              }
            }
          ]
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
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "buffBehaviors": [],
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
          ],
          "atk_scale": [
            0.48,
            0.53,
            0.58,
            0.62,
            0.67,
            0.72,
            0.77,
            0.82,
            0.86,
            0.92,
            1.0,
            1.08
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
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 1.07,
          "isDynamic": true
        },
        {
          "key": "poise",
          "value": 15.0,
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
        "SpawnAbilityEntity"
      ]
    },
    {
      "key": "enhancedBasicAttack1",
      "skillId": "chr_0030_zhuangfy_attack1_ult",
      "skillType": "basicAttack",
      "sourceFile": "chr_0030_zhuangfy_attack1_ult.json",
      "timelineBlockFrames": 22,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 14,
      "allowNextWindows": [
        {
          "startFrame": 22,
          "endFrame": 60,
          "skillIds": [
            "chr_0030_zhuangfy_attack2_ult"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 135,
          "skillIds": [
            "chr_0030_zhuangfy_attack1_ult"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 60,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0030_zhuangfy_attack2_ult",
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
          "endFrame": 160,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "endFrame": 160,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 160,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 22,
          "actionTypes": [
            "ExtendBuffAction"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector"
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 15,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 16,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionTypes": [
            "CheckMainCharacterCondition",
            "CameraImpulseAction",
            "FAnimationCurve"
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
          "endFrame": 42,
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
          "startFrame": 12,
          "endFrame": 22,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 22,
          "endFrame": 60,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 135,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 20,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 12,
          "endFrame": 16,
          "actionIndex": 55,
          "damageUnits": []
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionIndex": 11,
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
                "targetSource": "Target",
                "targetGroupKey": "",
                "minimumCount": 1,
                "comparison": "GE",
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 12,
                "endFrame": 13,
                "actionIndex": 13,
                "actionPath": [
                  "timelineActions[6]",
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
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_1_abilityrange"
                    }
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 1,
                    "blackboardMutation": {
                      "key": "target_in_range",
                      "operation": "Assign",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_1_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 12,
                "endFrame": 13,
                "actionIndex": 18,
                "actionPath": [
                  "timelineActions[6]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckMainCharacterCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_1_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_1_abilityrange"
                    }
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 1,
                    "blackboardMutation": {
                      "key": "target_in_range",
                      "operation": "Assign",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionIndex": 23,
          "actionPath": [
            "timelineActions[7]",
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
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 13,
                "endFrame": 14,
                "actionIndex": 25,
                "actionPath": [
                  "timelineActions[7]",
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
                      "blackboardKey": "target_in_range",
                      "levelValues": null
                    },
                    "right": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_2_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_2_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 13,
                "endFrame": 14,
                "actionIndex": 29,
                "actionPath": [
                  "timelineActions[7]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckMainCharacterCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_2_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_2_abilityrange"
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          "startFrame": 14,
          "endFrame": 15,
          "actionIndex": 33,
          "actionPath": [
            "timelineActions[8]",
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
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 14,
                "endFrame": 15,
                "actionIndex": 35,
                "actionPath": [
                  "timelineActions[8]",
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
                      "blackboardKey": "target_in_range",
                      "levelValues": null
                    },
                    "right": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_3_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_3_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 14,
                "endFrame": 15,
                "actionIndex": 39,
                "actionPath": [
                  "timelineActions[8]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckMainCharacterCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_3_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_3_abilityrange"
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 16,
          "actionIndex": 43,
          "actionPath": [
            "timelineActions[9]",
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
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 15,
                "endFrame": 16,
                "actionIndex": 45,
                "actionPath": [
                  "timelineActions[9]",
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
                      "blackboardKey": "target_in_range",
                      "levelValues": null
                    },
                    "right": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_4_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_4_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 15,
                "endFrame": 16,
                "actionIndex": 49,
                "actionPath": [
                  "timelineActions[9]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckMainCharacterCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_4_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_4_abilityrange"
                    }
                  }
                ]
              }
            }
          ]
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
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "buffBehaviors": [],
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
            0.86,
            0.93,
            1.0,
            1.06,
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
          "key": "sword_dist",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "target_in_range",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "target_in_range"
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
          "key": "sword_dist",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "target_in_range",
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
        "SpawnAbilityEntity"
      ]
    },
    {
      "key": "enhancedBasicAttack2",
      "skillId": "chr_0030_zhuangfy_attack2_ult",
      "skillType": "basicAttack",
      "sourceFile": "chr_0030_zhuangfy_attack2_ult.json",
      "timelineBlockFrames": 27,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 12,
      "allowNextWindows": [
        {
          "startFrame": 27,
          "endFrame": 60,
          "skillIds": [
            "chr_0030_zhuangfy_attack3_ult"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 120,
          "skillIds": [
            "chr_0030_zhuangfy_attack1_ult"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 60,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0030_zhuangfy_attack3_ult",
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
          "endFrame": 155,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "endFrame": 155,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 155,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector",
            "ModifyDynamicBlackboard"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 14,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "FindTargetAction",
            "Selector",
            "Selector",
            "DamageAction",
            "DefiniteValueCalculation"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 17,
          "actionTypes": [
            "ExtendBuffAction"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 16,
          "actionTypes": [
            "CheckMainCharacterCondition",
            "CameraImpulseAction",
            "FAnimationCurve"
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
          "endFrame": 48,
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
        },
        {
          "startFrame": 10,
          "endFrame": 24,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 27,
          "endFrame": 60,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 120,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 15,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 10,
          "endFrame": 14,
          "actionIndex": 54,
          "damageUnits": []
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 10,
          "endFrame": 11,
          "actionIndex": 10,
          "actionPath": [
            "timelineActions[5]",
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
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 10,
                "endFrame": 11,
                "actionIndex": 12,
                "actionPath": [
                  "timelineActions[5]",
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
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_1_abilityrange"
                    }
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 1,
                    "blackboardMutation": {
                      "key": "target_in_range",
                      "operation": "Assign",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_1_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 10,
                "endFrame": 11,
                "actionIndex": 17,
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
                    "sourceType": "CheckMainCharacterCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_1_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_1_abilityrange"
                    }
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 1,
                    "blackboardMutation": {
                      "key": "target_in_range",
                      "operation": "Assign",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 12,
          "actionIndex": 22,
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
                "targetSource": "Target",
                "targetGroupKey": "",
                "minimumCount": 1,
                "comparison": "GE",
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 11,
                "endFrame": 12,
                "actionIndex": 24,
                "actionPath": [
                  "timelineActions[6]",
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
                      "blackboardKey": "target_in_range",
                      "levelValues": null
                    },
                    "right": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_2_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_2_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 11,
                "endFrame": 12,
                "actionIndex": 28,
                "actionPath": [
                  "timelineActions[6]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckMainCharacterCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_2_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_2_abilityrange"
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 13,
          "actionIndex": 32,
          "actionPath": [
            "timelineActions[7]",
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
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 12,
                "endFrame": 13,
                "actionIndex": 34,
                "actionPath": [
                  "timelineActions[7]",
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
                      "blackboardKey": "target_in_range",
                      "levelValues": null
                    },
                    "right": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_3_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_3_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 12,
                "endFrame": 13,
                "actionIndex": 38,
                "actionPath": [
                  "timelineActions[7]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckMainCharacterCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_3_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_3_abilityrange"
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 14,
          "actionIndex": 42,
          "actionPath": [
            "timelineActions[8]",
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
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 13,
                "endFrame": 14,
                "actionIndex": 44,
                "actionPath": [
                  "timelineActions[8]",
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
                      "blackboardKey": "target_in_range",
                      "levelValues": null
                    },
                    "right": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_4_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_4_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 13,
                "endFrame": 14,
                "actionIndex": 48,
                "actionPath": [
                  "timelineActions[8]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckMainCharacterCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_4_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack_ult",
                      "skillId": "chr_0030_zhuangfy_attack1_ult_4_abilityrange"
                    }
                  }
                ]
              }
            }
          ]
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
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "buffBehaviors": [],
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
            0.94,
            1.03,
            1.12,
            1.22,
            1.31,
            1.4,
            1.5,
            1.59,
            1.68,
            1.8,
            1.94,
            2.1
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
          "value": 0.6,
          "isDynamic": false
        },
        {
          "key": "sword_dist",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "target_in_range",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "target_in_range"
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
          "key": "sword_dist",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "target_in_range",
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
        "SpawnAbilityEntity"
      ]
    },
    {
      "key": "enhancedBasicAttack3",
      "skillId": "chr_0030_zhuangfy_attack3_ult",
      "skillType": "basicAttack",
      "sourceFile": "chr_0030_zhuangfy_attack3_ult.json",
      "timelineBlockFrames": 60,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 33,
      "allowNextWindows": [
        {
          "startFrame": 60,
          "endFrame": 140,
          "skillIds": [
            "chr_0030_zhuangfy_attack1_ult"
          ]
        }
      ],
      "inputCacheWindows": [
        {
          "startFrame": 0,
          "endFrame": 140,
          "mappings": [
            {
              "cmdType": "Attack",
              "skillId": "chr_0030_zhuangfy_attack1_ult",
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
          "endFrame": 179,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "endFrame": 179,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 179,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 31,
          "actionTypes": [
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 6,
          "actionTypes": [
            "SpawnAbilityEntity",
            "Selector"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 179,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 35,
          "actionTypes": [
            "ExtendBuffAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 46,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 179,
          "actionTypes": [
            "CharWeaponVisibleAction"
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
          "startFrame": 5,
          "endFrame": 20,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 140,
          "actionTypes": [
            "ComboCacheAction"
          ]
        },
        {
          "startFrame": 60,
          "endFrame": 140,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "endFrame": 30,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 3,
          "endFrame": 6,
          "actionIndex": 11,
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
                "targetSource": "Target",
                "targetGroupKey": "",
                "minimumCount": 1,
                "comparison": "GE",
                "containsHittableTarget": true,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 3,
                "endFrame": 6,
                "actionIndex": 13,
                "actionPath": [
                  "timelineActions[6]",
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
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack3_ult",
                      "skillId": "chr_0030_zhuangfy_attack3_ult_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack3_ult",
                      "skillId": "chr_0030_zhuangfy_attack3_ult_abilityrange"
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 3,
                "endFrame": 6,
                "actionIndex": 17,
                "actionPath": [
                  "timelineActions[6]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "failActions",
                  "actionData",
                  "[0]"
                ],
                "conditions": [
                  {
                    "sourceType": "CheckMainCharacterCondition",
                    "supported": false,
                    "comparison": null,
                    "left": null,
                    "right": null,
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack3_ult",
                      "skillId": "chr_0030_zhuangfy_attack3_ult_abilityrange"
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "SpawnAbilityEntity",
                    "actionIndex": 0,
                    "abilityEntitySpawn": {
                      "abilityEntityId": "abilityentity_chr_0030_zhuangfy_attack3_ult",
                      "skillId": "chr_0030_zhuangfy_attack3_ult_abilityrange"
                    }
                  }
                ]
              }
            }
          ]
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 3,
          "endFrame": 179,
          "actionIndex": 21,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0030_zhuangfy_attack3_ult_cancel",
          "classification": null,
          "blackboardAssignments": {},
          "nestedCombatActions": []
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0030_zhuangfy_attack3_ult_cancel"
      ],
      "buffBehaviors": [
        {
          "applicationFrame": 3,
          "applicationEvent": null,
          "buffId": "buff_chr_0030_zhuangfy_attack3_ult_cancel",
          "sourceFile": "buff_chr_0030_zhuangfy_attack3_ult_cancel.json",
          "sourceAvailable": true,
          "lifecycle": {
            "lifeType": "Infinity",
            "duration": {
              "value": 1.0,
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
            "stackingKey": "NormalSkillCtrl",
            "priority": {
              "value": 1.0,
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
          "directDamageHits": [],
          "conditionalActions": [],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "eventActions": [
            {
              "event": "OnBuffFinish",
              "combatActions": [],
              "damageUnits": [],
              "createdBuffIds": [],
              "createdBuffBehaviors": []
            }
          ],
          "resourceGains": [],
          "nestedBuffBehaviors": [],
          "combatActions": [],
          "cycleTruncated": false
        }
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
            1.34,
            1.47,
            1.6,
            1.74,
            1.87,
            2.0,
            2.14,
            2.27,
            2.4,
            2.57,
            2.77,
            3.0
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
          "value": 0.6,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "thunderIndex",
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
        },
        {
          "key": "thunderIndex",
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
        "SpawnAbilityEntity"
      ]
    },
    {
      "key": "finisher",
      "skillId": "chr_0030_zhuangfy_power_attack",
      "skillType": "finisher",
      "sourceFile": "chr_0030_zhuangfy_power_attack.json",
      "timelineBlockFrames": 41,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 41,
          "endFrame": 45,
          "skillIds": [
            "chr_0030_zhuangfy_attack1",
            "chr_0030_zhuangfy_combo_skill",
            "chr_0030_zhuangfy_normal_skill"
          ]
        }
      ],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 9,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 153,
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
          "startFrame": 9,
          "endFrame": 153,
          "actionTypes": [
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 9,
          "actionTypes": [
            "MoveToAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 153,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 9,
          "actionTypes": [
            "ShowHideActorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 9,
          "actionTypes": [
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 37,
          "actionTypes": [
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 37,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 14,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 43,
          "actionTypes": [
            "DamageAction",
            "BreakingAttackCalculation",
            "DefiniteValueCalculation",
            "GainBreakingAttackAtb",
            "BlowOffAction",
            "HitStopAction",
            "FAnimationCurve",
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 11,
          "endFrame": 61,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 35,
          "endFrame": 79,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 3,
          "endFrame": 39,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 36,
          "endFrame": 75,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 41,
          "endFrame": 45,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 0,
          "endFrame": 41,
          "actionTypes": [
            "CreateBuffAction"
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
          "startFrame": 2,
          "endFrame": 54,
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
          "startFrame": 39,
          "endFrame": 102,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 11,
          "endFrame": 14,
          "actionIndex": 10,
          "damageUnits": [
            {
              "damageType": "Pulse",
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
                "value": 0.1,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null
            }
          ]
        },
        {
          "startFrame": 40,
          "endFrame": 43,
          "actionIndex": 13,
          "damageUnits": [
            {
              "damageType": "Pulse",
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
                "value": 0.9,
                "blackboardKey": null,
                "levelValues": null
              },
              "poiseValue": null
            }
          ]
        }
      ],
      "conditionalActions": [],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 45,
          "actionIndex": 24,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_damage_immune_medium",
          "classification": "incomingDamageProtection",
          "blackboardAssignments": {},
          "nestedCombatActions": []
        },
        {
          "startFrame": 0,
          "endFrame": 41,
          "actionIndex": 25,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_power_attack_disable_cast_skill",
          "classification": "inputLock",
          "blackboardAssignments": {},
          "nestedCombatActions": []
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_common_damage_immune_medium",
        "buff_common_power_attack_disable_cast_skill"
      ],
      "buffBehaviors": [
        {
          "applicationFrame": 0,
          "applicationEvent": null,
          "buffId": "buff_common_damage_immune_medium",
          "sourceFile": "buff_common_damage_immune_medium.json",
          "sourceAvailable": false,
          "lifecycle": null,
          "directDamageHits": [],
          "conditionalActions": [],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "eventActions": [],
          "resourceGains": [],
          "nestedBuffBehaviors": [],
          "combatActions": [],
          "cycleTruncated": false
        },
        {
          "applicationFrame": 0,
          "applicationEvent": null,
          "buffId": "buff_common_power_attack_disable_cast_skill",
          "sourceFile": "buff_common_power_attack_disable_cast_skill.json",
          "sourceAvailable": false,
          "lifecycle": null,
          "directDamageHits": [],
          "conditionalActions": [],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "eventActions": [],
          "resourceGains": [],
          "nestedBuffBehaviors": [],
          "combatActions": [],
          "cycleTruncated": false
        }
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
          "value": 0.35,
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
      ]
    },
    {
      "key": "plungingAttack",
      "skillId": "chr_0030_zhuangfy_plunging_attack_end",
      "skillType": "plungingAttack",
      "sourceFile": "chr_0030_zhuangfy_plunging_attack_end.json",
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
          "endFrame": 170,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 170,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 45,
          "actionTypes": [
            "EffectAction",
            "EffectAction"
          ]
        },
        {
          "startFrame": 125,
          "endFrame": 128,
          "actionTypes": [
            "InterruptCurSkillAction"
          ]
        },
        {
          "startFrame": 8,
          "endFrame": 125,
          "actionTypes": [
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "BlockMoveInterruptSkill"
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
          "endFrame": 5,
          "actionTypes": []
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
          "endFrame": 6,
          "actionTypes": [
            "InheritBuffAction"
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
          "startFrame": 0,
          "endFrame": 34,
          "actionTypes": [
            "PlaySoundAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 1,
          "endFrame": 6,
          "actionIndex": 16,
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
              "poiseValue": null
            }
          ]
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
          "actionIndex": 18,
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
      ],
      "projectileLaunches": [],
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [],
      "buffBehaviors": [],
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
        "ObtainCostAction"
      ]
    },
    {
      "key": "battleSkill",
      "skillId": "chr_0030_zhuangfy_normal_skill",
      "skillType": "battleSkill",
      "sourceFile": "chr_0030_zhuangfy_normal_skill.json",
      "timelineBlockFrames": 45,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 45,
          "endFrame": 116,
          "skillIds": [
            "chr_0030_zhuangfy_attack1",
            "chr_0030_zhuangfy_attack2",
            "chr_0030_zhuangfy_attack3",
            "chr_0030_zhuangfy_attack4",
            "chr_0030_zhuangfy_attack5",
            "chr_0030_zhuangfy_normal_skill",
            "chr_0030_zhuangfy_power_attack"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 147,
          "skillIds": [
            "chr_0030_zhuangfy_attack1",
            "chr_0030_zhuangfy_attack2",
            "chr_0030_zhuangfy_attack3",
            "chr_0030_zhuangfy_attack4",
            "chr_0030_zhuangfy_attack5",
            "chr_0030_zhuangfy_normal_skill",
            "chr_0030_zhuangfy_power_attack"
          ]
        }
      ],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 26,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 119,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 116,
          "endFrame": 290,
          "actionTypes": [
            "PlayAnimationAction"
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
          "actionTypes": []
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
            "FAnimationCurve",
            "CameraRotateAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 26,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 116,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 116,
          "endFrame": 290,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 26,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 26,
          "endFrame": 116,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "SelfRotateAction"
          ]
        },
        {
          "startFrame": 116,
          "endFrame": 136,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "ForEachAction",
            "CheckAbilityEntityCurDuration",
            "SetAbilityEntityDuration"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionTypes": [
            "FinishBuffAdvanced",
            "IfElseAction",
            "CreateBuffAction",
            "IfElseAction",
            "GetTargetBuffBBAdvanced",
            "FinishBuffAdvanced",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ObtainCostAction",
            "ModifyDynamicBlackboard",
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction",
            "CreateBuffAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction",
            "CreateBuffAction",
            "SpawnAbilityEntity"
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 16,
          "actionTypes": [
            "IfElseAction",
            "SimpleCalcBBAction",
            "ModifyDynamicBlackboard",
            "SimpleCalcBBAction",
            "SimpleCalcBBAction",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 123,
          "endFrame": 126,
          "actionTypes": [
            "CheckMainCharacterCondition",
            "CheckEntityNum",
            "HitStopAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 123,
          "endFrame": 126,
          "actionTypes": [
            "CheckMainCharacterCondition",
            "CheckEntityNum",
            "HitStopAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "CheckEntityNum",
            "EffectAction",
            "EffectAction"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 116,
          "actionTypes": [
            "JumpToAction",
            "OrConditionAction",
            "CheckTimedMarkerCondition",
            "CompareFloat"
          ]
        },
        {
          "startFrame": 19,
          "endFrame": 126,
          "actionTypes": [
            "CheckMainCharacterCondition",
            "CheckEntityNum",
            "CompareFloat",
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 14,
          "actionTypes": [
            "AddTagAction"
          ]
        },
        {
          "startFrame": 45,
          "endFrame": 116,
          "actionTypes": [
            "AllowNextSkillAction"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 147,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 0,
          "endFrame": 119,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 296,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 107,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 120,
          "endFrame": 153,
          "actionTypes": [
            "VoiceInterruptAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 61,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 112,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 112,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 116,
          "endFrame": 174,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 112,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 39,
          "actionPath": [
            "timelineActions[13]",
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
                  "buff_chr_0030_zhuangfy_normal_skill_trigger_sword"
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
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "FinishBuffAdvanced",
              "actionIndex": 0,
              "buffFinish": {
                "targetSource": "Source",
                "targetGroupKey": "",
                "buffCheckType": "Id",
                "buffIds": [
                  "buff_chr_0030_zhuangfy_normal_skill_trigger_sword"
                ],
                "tagQueryType": "hasAny",
                "buffTagIds": [],
                "finishAll": true,
                "limitSource": false,
                "isFinishedEarly": false,
                "isAbsorbed": false
              }
            }
          ],
          "failActions": []
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 42,
          "actionPath": [
            "timelineActions[13]",
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
                "targetGroupKey": "smart_target",
                "minimumCount": 1,
                "comparison": "GE",
                "containsHittableTarget": false,
                "excludeDeadEntity": true,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ]
              }
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 1,
              "nestedCondition": {
                "startFrame": 6,
                "endFrame": 7,
                "actionIndex": 45,
                "actionPath": [
                  "timelineActions[13]",
                  "_sequenceActionData",
                  "actionData",
                  "[1]",
                  "succeedActions",
                  "actionData",
                  "[1]"
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
                      "targetSource": "Context",
                      "targetGroupKey": "smart_target",
                      "buffCheckType": "Tag",
                      "buffIds": [],
                      "tagQueryType": "hasAny",
                      "buffTagIds": [
                        1466867135
                      ],
                      "countType": "BuffCount",
                      "comparison": "GE",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "limitSkillCastId": false
                    }
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "GetTargetBuffBBAdvanced",
                    "actionIndex": 0,
                    "buffBlackboardRead": {
                      "outputKey": "conductCnt",
                      "desiredKey": "count",
                      "targetSource": "Context",
                      "targetGroupKey": "smart_target",
                      "buffCheckType": "Tag",
                      "buffIds": [],
                      "tagQueryType": "hasAny",
                      "buffTagIds": [
                        1466867135
                      ]
                    }
                  },
                  {
                    "actionType": "FinishBuffAdvanced",
                    "actionIndex": 1,
                    "buffFinish": {
                      "targetSource": "Context",
                      "targetGroupKey": "smart_target",
                      "buffCheckType": "Tag",
                      "buffIds": [],
                      "tagQueryType": "hasAny",
                      "buffTagIds": [
                        1466867135
                      ],
                      "finishAll": true,
                      "limitSource": false,
                      "isFinishedEarly": true,
                      "isAbsorbed": false
                    }
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 2,
                    "blackboardMutation": {
                      "key": "sword_gene_num",
                      "operation": "Add",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": "conductCnt",
                        "levelValues": null
                      }
                    }
                  },
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 3,
                    "blackboardMutation": {
                      "key": "sword_gene_num",
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
                    "actionIndex": 4,
                    "nestedCondition": {
                      "startFrame": 6,
                      "endFrame": 7,
                      "actionIndex": 51,
                      "actionPath": [
                        "timelineActions[13]",
                        "_sequenceActionData",
                        "actionData",
                        "[1]",
                        "succeedActions",
                        "actionData",
                        "[1]",
                        "succeedActions",
                        "actionData",
                        "[4]"
                      ],
                      "conditions": [
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "LE",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "sword_gene_num",
                            "levelValues": null
                          },
                          "right": {
                            "value": 3.0,
                            "blackboardKey": "max_conduct_sword",
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
                          "skillTypes": []
                        }
                      ],
                      "succeedActions": [],
                      "failActions": [
                        {
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "blackboardMutation": {
                            "key": "sword_gene_num",
                            "operation": "Assign",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": "max_conduct_sword",
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
                            }
                          }
                        }
                      ]
                    }
                  },
                  {
                    "actionType": "ObtainCostAction",
                    "actionIndex": 5,
                    "resourceGain": {
                      "resource": "sp",
                      "amount": {
                        "value": 0.0,
                        "blackboardKey": "atb_return",
                        "levelValues": null
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
                      "ignoreUltimateGainScalar": false
                    }
                  },
                  {
                    "actionType": "IfElseAction",
                    "actionIndex": 6,
                    "nestedCondition": {
                      "startFrame": 6,
                      "endFrame": 7,
                      "actionIndex": 55,
                      "actionPath": [
                        "timelineActions[13]",
                        "_sequenceActionData",
                        "actionData",
                        "[1]",
                        "succeedActions",
                        "actionData",
                        "[1]",
                        "succeedActions",
                        "actionData",
                        "[6]"
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
                              "buff_chr_0030_zhuangfy_potential1_more_sword"
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
                          }
                        }
                      ],
                      "succeedActions": [
                        {
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "blackboardMutation": {
                            "key": "sword_gene_num",
                            "operation": "Add",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": null,
                              "levelValues": null
                            }
                          }
                        }
                      ],
                      "failActions": []
                    }
                  },
                  {
                    "actionType": "LaunchProjectile",
                    "actionIndex": 8,
                    "projectileLaunch": {
                      "projectileId": "projectile_chr_0030_zhuangfy_normal_skill_gene_sword",
                      "castSkillOnHit": false,
                      "hitSkillId": null
                    }
                  },
                  {
                    "actionType": "CreateBuffAction",
                    "actionIndex": 10,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_common_obtain_ultimate_sp",
                          "classification": "skillCostUltimateEnergyGain",
                          "blackboardAssignments": {}
                        }
                      ]
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "IfElseAction",
                    "actionIndex": 0,
                    "nestedCondition": {
                      "startFrame": 6,
                      "endFrame": 7,
                      "actionIndex": 62,
                      "actionPath": [
                        "timelineActions[13]",
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
                      "conditions": [
                        {
                          "sourceType": "CompareFloat",
                          "supported": true,
                          "comparison": "LT",
                          "left": {
                            "value": 0.0,
                            "blackboardKey": "EntityBB_SwordNum",
                            "levelValues": null
                          },
                          "right": {
                            "value": 0.0,
                            "blackboardKey": "free_sword_limit",
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
                          "skillTypes": []
                        }
                      ],
                      "succeedActions": [
                        {
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "blackboardMutation": {
                            "key": "sword_gene_num",
                            "operation": "Add",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": null,
                              "levelValues": null
                            }
                          }
                        }
                      ],
                      "failActions": []
                    }
                  },
                  {
                    "actionType": "IfElseAction",
                    "actionIndex": 1,
                    "nestedCondition": {
                      "startFrame": 6,
                      "endFrame": 7,
                      "actionIndex": 65,
                      "actionPath": [
                        "timelineActions[13]",
                        "_sequenceActionData",
                        "actionData",
                        "[1]",
                        "succeedActions",
                        "actionData",
                        "[1]",
                        "failActions",
                        "actionData",
                        "[1]"
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
                              "buff_chr_0030_zhuangfy_potential1_more_sword"
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
                          }
                        }
                      ],
                      "succeedActions": [
                        {
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 0,
                          "blackboardMutation": {
                            "key": "sword_gene_num",
                            "operation": "Add",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": null,
                              "levelValues": null
                            }
                          }
                        }
                      ],
                      "failActions": []
                    }
                  },
                  {
                    "actionType": "LaunchProjectile",
                    "actionIndex": 3,
                    "projectileLaunch": {
                      "projectileId": "projectile_chr_0030_zhuangfy_normal_skill_gene_sword",
                      "castSkillOnHit": false,
                      "hitSkillId": null
                    }
                  },
                  {
                    "actionType": "CreateBuffAction",
                    "actionIndex": 5,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_common_obtain_ultimate_sp",
                          "classification": "skillCostUltimateEnergyGain",
                          "blackboardAssignments": {}
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "SpawnAbilityEntity",
              "actionIndex": 0,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0030_zhuangfy_normal_skill_fake_target",
                "skillId": null
              }
            }
          ]
        },
        {
          "startFrame": 13,
          "endFrame": 16,
          "actionIndex": 73,
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
              "comparison": "GE",
              "left": {
                "value": 0.0,
                "blackboardKey": "EntityBB_SwordNum",
                "levelValues": null
              },
              "right": {
                "value": 1.0,
                "blackboardKey": null,
                "levelValues": null
              },
              "skillTypes": []
            }
          ],
          "succeedActions": [
            {
              "actionType": "SimpleCalcBBAction",
              "actionIndex": 0,
              "blackboardCalculation": {
                "key": "swordTriggerInterval",
                "operation": "Divide",
                "left": {
                  "value": 0.0,
                  "blackboardKey": "EntityBB_SwordNum",
                  "levelValues": null
                },
                "right": {
                  "value": 90.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 1,
              "blackboardMutation": {
                "key": "swordTriggerInterval",
                "operation": "Multiply",
                "value": {
                  "value": -1.0,
                  "blackboardKey": null,
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "SimpleCalcBBAction",
              "actionIndex": 2,
              "blackboardCalculation": {
                "key": "swordTriggerInterval",
                "operation": "Add",
                "left": {
                  "value": 0.3,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "right": {
                  "value": 90.0,
                  "blackboardKey": "swordTriggerInterval",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "SimpleCalcBBAction",
              "actionIndex": 3,
              "blackboardCalculation": {
                "key": "atk_up_final",
                "operation": "Multiply",
                "left": {
                  "value": 0.0,
                  "blackboardKey": "atk_up_per_conduct",
                  "levelValues": [
                    0.03,
                    0.04,
                    0.04,
                    0.04,
                    0.05,
                    0.05,
                    0.05,
                    0.06,
                    0.06,
                    0.07,
                    0.08,
                    0.09
                  ]
                },
                "right": {
                  "value": 0.0,
                  "blackboardKey": "conductCnt",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 4,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0030_zhuangfy_normal_skill_trigger_sword",
                    "classification": null,
                    "blackboardAssignments": {
                      "interval": {
                        "value": 0.0,
                        "blackboardKey": "swordTriggerInterval",
                        "levelValues": null
                      },
                      "sword_range": {
                        "value": 0.0,
                        "blackboardKey": "sword_range",
                        "levelValues": [
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
                      "atk_scale": {
                        "value": 0.0,
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
                      "poise": {
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
                      "usp_extra": {
                        "value": 0.0,
                        "blackboardKey": "usp_extra",
                        "levelValues": [
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0
                        ]
                      },
                      "atk_up_final": {
                        "value": 0.0,
                        "blackboardKey": "atk_up_final",
                        "levelValues": null
                      },
                      "remain_sword_limit": {
                        "value": 0.0,
                        "blackboardKey": "remain_sword_limit",
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
                      "final_rate": {
                        "value": 0.0,
                        "blackboardKey": "final_rate",
                        "levelValues": [
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0,
                          6.0
                        ]
                      }
                    }
                  }
                ]
              }
            }
          ],
          "failActions": []
        },
        {
          "startFrame": 6,
          "endFrame": 7,
          "actionIndex": 83,
          "actionPath": [
            "timelineActions[16]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckSquadInFight",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": []
            }
          ],
          "succeedActions": [
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0030_zhuangfy_talent1",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 6,
                "endFrame": 7,
                "actionIndex": 86,
                "actionPath": [
                  "timelineActions[16]",
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
                      "targetSource": "Context",
                      "targetGroupKey": "smart_target",
                      "minimumCount": 1,
                      "comparison": "GE",
                      "containsHittableTarget": false,
                      "excludeDeadEntity": false,
                      "storeKey": ""
                    }
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "CreateBuffAction",
                    "actionIndex": 0,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_chr_0030_zhuangfy_talent1",
                          "classification": null,
                          "blackboardAssignments": {}
                        }
                      ]
                    }
                  }
                ],
                "failActions": []
              }
            }
          ]
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
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0030_zhuangfy_normal_skill_trigger_sword",
        "buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar",
        "buff_chr_0030_zhuangfy_talent1",
        "buff_common_obtain_ultimate_sp"
      ],
      "buffBehaviors": [],
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
          ],
          "atk_up_per_conduct": [
            0.03,
            0.04,
            0.04,
            0.04,
            0.05,
            0.05,
            0.05,
            0.06,
            0.06,
            0.07,
            0.08,
            0.09
          ],
          "final_rate": [
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0
          ],
          "free_sword_limit": [
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
          "max_conduct_sword": [
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
          "remain_sword_limit": [
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
          "sword_duration": [
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0
          ],
          "sword_range": [
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
          ],
          "usp_extra": [
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0
          ],
          "usp_extra_limit": [
            54.0,
            54.0,
            54.0,
            54.0,
            54.0,
            54.0,
            54.0,
            54.0,
            54.0,
            54.0,
            54.0,
            54.0
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
          "key": "atb_return",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 2.85,
          "isDynamic": false
        },
        {
          "key": "atk_up_final",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_up_per_conduct",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "cam_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "conductCnt",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "final_rate",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "free_sword_limit",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "max_conduct_sword",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "remain_sword_limit",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "swordTriggerInterval",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "sword_duration",
          "value": 40.0,
          "isDynamic": false
        },
        {
          "key": "sword_gene_num",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "sword_range",
          "value": 20.0,
          "isDynamic": false
        },
        {
          "key": "usp_extra",
          "value": 0.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "EntityBB_SwordNum",
        "atb_return",
        "atk_up_per_conduct",
        "cam_angle",
        "conductCnt",
        "free_sword_limit",
        "input_angle",
        "max_conduct_sword",
        "swordTriggerInterval",
        "sword_gene_num"
      ],
      "blackboardProvenance": [
        {
          "key": "EntityBB_SwordNum",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
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
          "key": "atk_up_final",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_up_per_conduct",
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
          "key": "conductCnt",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "final_rate",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "free_sword_limit",
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
          "key": "max_conduct_sword",
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
          "key": "remain_sword_limit",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "swordTriggerInterval",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "sword_duration",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "sword_gene_num",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "sword_range",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "usp_extra",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "usp_extra_limit",
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
        "IfElseAction",
        "LaunchProjectile",
        "ObtainCostAction",
        "SpawnAbilityEntity"
      ]
    },
    {
      "key": "enhancedBattleSkill",
      "skillId": "chr_0030_zhuangfy_normal_skill_ult",
      "skillType": "battleSkill",
      "sourceFile": "chr_0030_zhuangfy_normal_skill_ult.json",
      "timelineBlockFrames": 30,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 30,
          "endFrame": 143,
          "skillIds": [
            "chr_0030_zhuangfy_attack1_ult",
            "chr_0030_zhuangfy_attack2_ult",
            "chr_0030_zhuangfy_attack3_ult",
            "chr_0030_zhuangfy_normal_skill_ult"
          ]
        }
      ],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 103,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 100,
          "endFrame": 210,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 1,
          "actionTypes": []
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
            "FAnimationCurve",
            "CameraRotateAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 210,
          "actionTypes": [
            "CustomRootMotionAction",
            "Selector",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 210,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 143,
          "endFrame": 210,
          "actionTypes": [
            "BlockMoveInterruptSkill"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "Selector",
            "ForEachAction",
            "CheckAbilityEntityCurDuration",
            "SetAbilityEntityDuration"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionTypes": [
            "IfElseAction",
            "CreateBuffAction",
            "IfElseAction",
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction",
            "FinishBuffAdvanced",
            "IfElseAction",
            "GetTargetBuffBBAdvanced",
            "FinishBuffAdvanced",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ObtainCostAction",
            "ModifyDynamicBlackboard",
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction",
            "CreateBuffAction",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "FindTargetAction",
            "Selector",
            "LaunchProjectile",
            "CameraImpulseAction",
            "CreateBuffAction",
            "SpawnAbilityEntity"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionTypes": [
            "SimpleCalcBBAction",
            "FindTargetAction",
            "Selector",
            "SpawnAbilityEntity"
          ]
        },
        {
          "startFrame": 100,
          "endFrame": 103,
          "actionTypes": [
            "CheckBuffStackNumAdvanced",
            "FinishBuffAdvanced"
          ]
        },
        {
          "startFrame": 16,
          "endFrame": 100,
          "actionTypes": [
            "JumpToAction",
            "OrConditionAction",
            "CheckTimedMarkerCondition",
            "CompareFloat"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 15,
          "actionTypes": [
            "CheckEntityNum",
            "EffectAction",
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 18,
          "actionTypes": [
            "ExtendBuffAction"
          ]
        },
        {
          "startFrame": 21,
          "endFrame": 77,
          "actionTypes": [
            "CheckMainCharacterCondition",
            "CheckEntityNum",
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 16,
          "actionTypes": [
            "AddTagAction"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 143,
          "actionTypes": [
            "AllowNextSkillAction"
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
          "startFrame": 13,
          "endFrame": 56,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 36,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 20,
          "endFrame": 112,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 102,
          "endFrame": 160,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 102,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 23,
          "endFrame": 99,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionIndex": 30,
          "actionPath": [
            "timelineActions[9]",
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
                "excludeDeadEntity": true,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ]
              }
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 1,
              "nestedCondition": {
                "startFrame": 5,
                "endFrame": 6,
                "actionIndex": 33,
                "actionPath": [
                  "timelineActions[9]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "succeedActions",
                  "actionData",
                  "[1]"
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
                        "buff_chr_0030_zhuangfy_ult_skill_free"
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
                    }
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "IfElseAction",
                    "actionIndex": 0,
                    "nestedCondition": {
                      "startFrame": 5,
                      "endFrame": 6,
                      "actionIndex": 35,
                      "actionPath": [
                        "timelineActions[9]",
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
                              "buff_chr_0030_zhuangfy_potential1_more_sword"
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
                          }
                        }
                      ],
                      "succeedActions": [
                        {
                          "actionType": "LaunchProjectile",
                          "actionIndex": 1,
                          "projectileLaunch": {
                            "projectileId": "projectile_chr_0030_zhuangfy_normal_skill_gene_sword",
                            "castSkillOnHit": false,
                            "hitSkillId": null
                          }
                        },
                        {
                          "actionType": "FinishBuffAdvanced",
                          "actionIndex": 3,
                          "buffFinish": {
                            "targetSource": "Source",
                            "targetGroupKey": "",
                            "buffCheckType": "Id",
                            "buffIds": [
                              "buff_chr_0030_zhuangfy_ult_skill_free"
                            ],
                            "tagQueryType": "hasAny",
                            "buffTagIds": [],
                            "finishAll": true,
                            "limitSource": false,
                            "isFinishedEarly": false,
                            "isAbsorbed": false
                          }
                        }
                      ],
                      "failActions": [
                        {
                          "actionType": "LaunchProjectile",
                          "actionIndex": 1,
                          "projectileLaunch": {
                            "projectileId": "projectile_chr_0030_zhuangfy_normal_skill_gene_sword",
                            "castSkillOnHit": false,
                            "hitSkillId": null
                          }
                        },
                        {
                          "actionType": "FinishBuffAdvanced",
                          "actionIndex": 3,
                          "buffFinish": {
                            "targetSource": "Source",
                            "targetGroupKey": "",
                            "buffCheckType": "Id",
                            "buffIds": [
                              "buff_chr_0030_zhuangfy_ult_skill_free"
                            ],
                            "tagQueryType": "hasAny",
                            "buffTagIds": [],
                            "finishAll": true,
                            "limitSource": false,
                            "isFinishedEarly": false,
                            "isAbsorbed": false
                          }
                        }
                      ]
                    }
                  }
                ],
                "failActions": [
                  {
                    "actionType": "IfElseAction",
                    "actionIndex": 0,
                    "nestedCondition": {
                      "startFrame": 5,
                      "endFrame": 6,
                      "actionIndex": 45,
                      "actionPath": [
                        "timelineActions[9]",
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
                      "conditions": [
                        {
                          "sourceType": "CheckBuffStackNumAdvanced",
                          "supported": true,
                          "comparison": null,
                          "left": null,
                          "right": null,
                          "skillTypes": [],
                          "buffStack": {
                            "targetSource": "Context",
                            "targetGroupKey": "smart_target",
                            "buffCheckType": "Tag",
                            "buffIds": [],
                            "tagQueryType": "hasAny",
                            "buffTagIds": [
                              1466867135
                            ],
                            "countType": "BuffCount",
                            "comparison": "GE",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": null,
                              "levelValues": null
                            },
                            "limitSkillCastId": false
                          }
                        }
                      ],
                      "succeedActions": [
                        {
                          "actionType": "GetTargetBuffBBAdvanced",
                          "actionIndex": 0,
                          "buffBlackboardRead": {
                            "outputKey": "conductCnt",
                            "desiredKey": "count",
                            "targetSource": "Context",
                            "targetGroupKey": "smart_target",
                            "buffCheckType": "Tag",
                            "buffIds": [],
                            "tagQueryType": "hasAny",
                            "buffTagIds": [
                              1466867135
                            ]
                          }
                        },
                        {
                          "actionType": "FinishBuffAdvanced",
                          "actionIndex": 1,
                          "buffFinish": {
                            "targetSource": "Context",
                            "targetGroupKey": "smart_target",
                            "buffCheckType": "Tag",
                            "buffIds": [],
                            "tagQueryType": "hasAny",
                            "buffTagIds": [
                              1466867135
                            ],
                            "finishAll": true,
                            "limitSource": false,
                            "isFinishedEarly": true,
                            "isAbsorbed": false
                          }
                        },
                        {
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 2,
                          "blackboardMutation": {
                            "key": "sword_gene_num",
                            "operation": "Add",
                            "value": {
                              "value": 1.0,
                              "blackboardKey": "conductCnt",
                              "levelValues": null
                            }
                          }
                        },
                        {
                          "actionType": "ModifyDynamicBlackboard",
                          "actionIndex": 3,
                          "blackboardMutation": {
                            "key": "sword_gene_num",
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
                          "actionIndex": 4,
                          "nestedCondition": {
                            "startFrame": 5,
                            "endFrame": 6,
                            "actionIndex": 51,
                            "actionPath": [
                              "timelineActions[9]",
                              "_sequenceActionData",
                              "actionData",
                              "[0]",
                              "succeedActions",
                              "actionData",
                              "[1]",
                              "failActions",
                              "actionData",
                              "[0]",
                              "succeedActions",
                              "actionData",
                              "[4]"
                            ],
                            "conditions": [
                              {
                                "sourceType": "CompareFloat",
                                "supported": true,
                                "comparison": "LE",
                                "left": {
                                  "value": 0.0,
                                  "blackboardKey": "sword_gene_num",
                                  "levelValues": null
                                },
                                "right": {
                                  "value": 3.0,
                                  "blackboardKey": "max_conduct_sword",
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
                                "skillTypes": []
                              }
                            ],
                            "succeedActions": [],
                            "failActions": [
                              {
                                "actionType": "ModifyDynamicBlackboard",
                                "actionIndex": 0,
                                "blackboardMutation": {
                                  "key": "sword_gene_num",
                                  "operation": "Assign",
                                  "value": {
                                    "value": 1.0,
                                    "blackboardKey": "max_conduct_sword",
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
                                  }
                                }
                              }
                            ]
                          }
                        },
                        {
                          "actionType": "ObtainCostAction",
                          "actionIndex": 5,
                          "resourceGain": {
                            "resource": "sp",
                            "amount": {
                              "value": 0.0,
                              "blackboardKey": "atb_return",
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
                            "spGainSource": "default",
                            "onlyMainOperator": false,
                            "isPercentValue": false,
                            "useUltimateRecoveryTag": false,
                            "ultimateRecoveryTagId": 0,
                            "ignoreUltimateGainScalar": false
                          }
                        },
                        {
                          "actionType": "IfElseAction",
                          "actionIndex": 6,
                          "nestedCondition": {
                            "startFrame": 5,
                            "endFrame": 6,
                            "actionIndex": 55,
                            "actionPath": [
                              "timelineActions[9]",
                              "_sequenceActionData",
                              "actionData",
                              "[0]",
                              "succeedActions",
                              "actionData",
                              "[1]",
                              "failActions",
                              "actionData",
                              "[0]",
                              "succeedActions",
                              "actionData",
                              "[6]"
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
                                    "buff_chr_0030_zhuangfy_potential1_more_sword"
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
                                }
                              }
                            ],
                            "succeedActions": [
                              {
                                "actionType": "ModifyDynamicBlackboard",
                                "actionIndex": 0,
                                "blackboardMutation": {
                                  "key": "sword_gene_num",
                                  "operation": "Add",
                                  "value": {
                                    "value": 1.0,
                                    "blackboardKey": null,
                                    "levelValues": null
                                  }
                                }
                              }
                            ],
                            "failActions": []
                          }
                        },
                        {
                          "actionType": "LaunchProjectile",
                          "actionIndex": 8,
                          "projectileLaunch": {
                            "projectileId": "projectile_chr_0030_zhuangfy_normal_skill_gene_sword",
                            "castSkillOnHit": false,
                            "hitSkillId": null
                          }
                        },
                        {
                          "actionType": "CreateBuffAction",
                          "actionIndex": 10,
                          "buffApplication": {
                            "buffs": [
                              {
                                "buffId": "buff_common_obtain_ultimate_sp",
                                "classification": "skillCostUltimateEnergyGain",
                                "blackboardAssignments": {}
                              }
                            ]
                          }
                        }
                      ],
                      "failActions": [
                        {
                          "actionType": "IfElseAction",
                          "actionIndex": 0,
                          "nestedCondition": {
                            "startFrame": 5,
                            "endFrame": 6,
                            "actionIndex": 62,
                            "actionPath": [
                              "timelineActions[9]",
                              "_sequenceActionData",
                              "actionData",
                              "[0]",
                              "succeedActions",
                              "actionData",
                              "[1]",
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
                                "comparison": "LT",
                                "left": {
                                  "value": 0.0,
                                  "blackboardKey": "EntityBB_SwordNum",
                                  "levelValues": null
                                },
                                "right": {
                                  "value": 0.0,
                                  "blackboardKey": "free_sword_limit",
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
                                "skillTypes": []
                              }
                            ],
                            "succeedActions": [
                              {
                                "actionType": "ModifyDynamicBlackboard",
                                "actionIndex": 0,
                                "blackboardMutation": {
                                  "key": "sword_gene_num",
                                  "operation": "Add",
                                  "value": {
                                    "value": 1.0,
                                    "blackboardKey": null,
                                    "levelValues": null
                                  }
                                }
                              }
                            ],
                            "failActions": []
                          }
                        },
                        {
                          "actionType": "IfElseAction",
                          "actionIndex": 1,
                          "nestedCondition": {
                            "startFrame": 5,
                            "endFrame": 6,
                            "actionIndex": 65,
                            "actionPath": [
                              "timelineActions[9]",
                              "_sequenceActionData",
                              "actionData",
                              "[0]",
                              "succeedActions",
                              "actionData",
                              "[1]",
                              "failActions",
                              "actionData",
                              "[0]",
                              "failActions",
                              "actionData",
                              "[1]"
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
                                    "buff_chr_0030_zhuangfy_potential1_more_sword"
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
                                }
                              }
                            ],
                            "succeedActions": [
                              {
                                "actionType": "ModifyDynamicBlackboard",
                                "actionIndex": 0,
                                "blackboardMutation": {
                                  "key": "sword_gene_num",
                                  "operation": "Add",
                                  "value": {
                                    "value": 1.0,
                                    "blackboardKey": null,
                                    "levelValues": null
                                  }
                                }
                              }
                            ],
                            "failActions": []
                          }
                        },
                        {
                          "actionType": "LaunchProjectile",
                          "actionIndex": 3,
                          "projectileLaunch": {
                            "projectileId": "projectile_chr_0030_zhuangfy_normal_skill_gene_sword",
                            "castSkillOnHit": false,
                            "hitSkillId": null
                          }
                        },
                        {
                          "actionType": "CreateBuffAction",
                          "actionIndex": 5,
                          "buffApplication": {
                            "buffs": [
                              {
                                "buffId": "buff_common_obtain_ultimate_sp",
                                "classification": "skillCostUltimateEnergyGain",
                                "blackboardAssignments": {}
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "SpawnAbilityEntity",
              "actionIndex": 0,
              "abilityEntitySpawn": {
                "abilityEntityId": "abilityentity_chr_0030_zhuangfy_normal_skill_fake_target",
                "skillId": null
              }
            }
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 6,
          "actionIndex": 73,
          "actionPath": [
            "timelineActions[10]",
            "_sequenceActionData",
            "actionData",
            "[0]"
          ],
          "conditions": [
            {
              "sourceType": "CheckSquadInFight",
              "supported": false,
              "comparison": null,
              "left": null,
              "right": null,
              "skillTypes": []
            }
          ],
          "succeedActions": [
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0030_zhuangfy_talent1",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ]
              }
            }
          ],
          "failActions": [
            {
              "actionType": "IfElseAction",
              "actionIndex": 0,
              "nestedCondition": {
                "startFrame": 5,
                "endFrame": 6,
                "actionIndex": 76,
                "actionPath": [
                  "timelineActions[10]",
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
                      "targetSource": "Context",
                      "targetGroupKey": "smart_target",
                      "minimumCount": 1,
                      "comparison": "GE",
                      "containsHittableTarget": false,
                      "excludeDeadEntity": false,
                      "storeKey": ""
                    }
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "CreateBuffAction",
                    "actionIndex": 0,
                    "buffApplication": {
                      "buffs": [
                        {
                          "buffId": "buff_chr_0030_zhuangfy_talent1",
                          "classification": null,
                          "blackboardAssignments": {}
                        }
                      ]
                    }
                  }
                ],
                "failActions": []
              }
            }
          ]
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionIndex": 81,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange",
          "classification": null,
          "blackboardAssignments": {},
          "nestedCombatActions": [
            "CreateBuffAction",
            "DamageAction",
            "IfElseAction",
            "SpellInfliction"
          ]
        }
      ],
      "blackboardCalculations": [
        {
          "startFrame": 15,
          "endFrame": 18,
          "actionIndex": 79,
          "key": "atk_up_final",
          "operation": "Multiply",
          "left": {
            "value": 0.0,
            "blackboardKey": "conductCnt",
            "levelValues": null
          },
          "right": {
            "value": 0.0,
            "blackboardKey": "atk_up_per_conduct",
            "levelValues": [
              0.08,
              0.09,
              0.1,
              0.11,
              0.11,
              0.12,
              0.13,
              0.14,
              0.15,
              0.16,
              0.17,
              0.18
            ]
          }
        }
      ],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [
        {
          "startFrame": 100,
          "endFrame": 103,
          "actionIndex": 83,
          "targetSource": "Source",
          "targetGroupKey": "",
          "buffCheckType": "Id",
          "buffIds": [
            "buff_chr_0030_zhuangfy_ult_skill_free"
          ],
          "tagQueryType": "hasAny",
          "buffTagIds": [],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": false,
          "isAbsorbed": false
        }
      ],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileHits": [],
      "abilityEntityHits": [
        {
          "spawnFrame": 15,
          "actionOrder": [
            81
          ],
          "abilityEntityId": "abilityentity_chr_0030_zhuangfy_normal_skill_ult",
          "skillId": "chr_0030_zhuangfy_normal_skill_ult_abilityrange",
          "sourceFile": "chr_0030_zhuangfy_normal_skill_ult_abilityrange.json",
          "directDamageHits": [
            {
              "startFrame": 69,
              "endFrame": 70,
              "actionIndex": 28,
              "damageUnits": [
                {
                  "damageType": "Pulse",
                  "attributeType": "Hp",
                  "calculation": "standard",
                  "attackScale": {
                    "value": 0.0,
                    "blackboardKey": "atk_scale_final",
                    "levelValues": null
                  },
                  "calculationMultiplier": null,
                  "poiseValue": null
                },
                {
                  "damageType": "Pulse",
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
                  }
                }
              ]
            }
          ],
          "conditionalActions": [
            {
              "startFrame": 12,
              "endFrame": 64,
              "actionIndex": 11,
              "actionPath": [
                "timelineActions[5]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "actionOnTick",
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
                    "blackboardKey": "tick_index",
                    "levelValues": null
                  },
                  "right": {
                    "value": 0.0,
                    "blackboardKey": "EntityBB_SwordNum",
                    "levelValues": null
                  },
                  "skillTypes": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "CreateBuffAction",
                  "actionIndex": 0,
                  "buffApplication": {
                    "buffs": [
                      {
                        "buffId": "buff_chr_0030_zhuangfy_talent1_mark",
                        "classification": null,
                        "blackboardAssignments": {}
                      }
                    ]
                  }
                },
                {
                  "actionType": "IfElseAction",
                  "actionIndex": 2,
                  "nestedCondition": {
                    "startFrame": 12,
                    "endFrame": 64,
                    "actionIndex": 15,
                    "actionPath": [
                      "timelineActions[5]",
                      "_sequenceActionData",
                      "actionData",
                      "[0]",
                      "actionOnTick",
                      "actionData",
                      "[0]",
                      "succeedActions",
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
                          "blackboardKey": "tick_index",
                          "levelValues": null
                        },
                        "right": {
                          "value": 1.0,
                          "blackboardKey": null,
                          "levelValues": null
                        },
                        "skillTypes": []
                      }
                    ],
                    "succeedActions": [
                      {
                        "actionType": "DamageAction",
                        "actionIndex": 0
                      }
                    ],
                    "failActions": [
                      {
                        "actionType": "DamageAction",
                        "actionIndex": 0
                      }
                    ]
                  }
                },
                {
                  "actionType": "ModifyDynamicBlackboard",
                  "actionIndex": 3,
                  "blackboardMutation": {
                    "key": "tick_index",
                    "operation": "Add",
                    "value": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    }
                  }
                }
              ],
              "failActions": []
            },
            {
              "startFrame": 12,
              "endFrame": 64,
              "actionIndex": 37,
              "actionPath": [
                "timelineActions[9]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "actionOnTick",
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
                    "blackboardKey": "sword_index",
                    "levelValues": null
                  },
                  "right": {
                    "value": 0.0,
                    "blackboardKey": "EntityBB_SwordNum",
                    "levelValues": null
                  },
                  "skillTypes": []
                }
              ],
              "succeedActions": [
                {
                  "actionType": "ModifyDynamicBlackboard",
                  "actionIndex": 3,
                  "blackboardMutation": {
                    "key": "sword_index",
                    "operation": "Add",
                    "value": {
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    }
                  }
                }
              ],
              "failActions": []
            }
          ],
          "inflictions": [
            {
              "startFrame": 69,
              "endFrame": 70,
              "actionIndex": 26,
              "element": "electric",
              "isExtra": false
            }
          ],
          "auxiliaryActions": [
            {
              "startFrame": 69,
              "endFrame": 70,
              "actionIndex": 24,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_chr_0030_zhuangfy_talent1_mark",
              "classification": null,
              "blackboardAssignments": {},
              "nestedCombatActions": []
            }
          ],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileHits": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction",
            "IfElseAction",
            "SpellInfliction"
          ],
          "cycleTruncated": false
        }
      ],
      "referencedBuffIds": [
        "buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar",
        "buff_chr_0030_zhuangfy_talent1",
        "buff_common_obtain_ultimate_sp"
      ],
      "buffBehaviors": [],
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
          "atb_return": [
            0.0,
            0.0,
            0.0,
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
          ],
          "atk_up_per_conduct": [
            0.08,
            0.09,
            0.1,
            0.11,
            0.11,
            0.12,
            0.13,
            0.14,
            0.15,
            0.16,
            0.17,
            0.18
          ],
          "final_rate": [
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0,
            6.0
          ],
          "free_sword_limit": [
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
          "max_conduct_sword": [
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
          "remain_sword_limit": [
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
          "sword_duration": [
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0,
            36.0
          ],
          "sword_range": [
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
          "key": "atb_return",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "atk_scale",
          "value": 2.85,
          "isDynamic": false
        },
        {
          "key": "atk_up_final",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "atk_up_per_conduct",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "cam_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "conductCnt",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "final_rate",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "free_sword_limit",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "input_angle",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "max_conduct_sword",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "poise",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "remain_sword_limit",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "swordTriggerInterval",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "sword_duration",
          "value": 40.0,
          "isDynamic": false
        },
        {
          "key": "sword_gene_num",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "sword_range",
          "value": 20.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "EntityBB_SwordNum",
        "atb_return",
        "atk_up_per_conduct",
        "cam_angle",
        "conductCnt",
        "free_sword_limit",
        "input_angle",
        "max_conduct_sword",
        "sword_gene_num"
      ],
      "blackboardProvenance": [
        {
          "key": "EntityBB_SwordNum",
          "declaredInSkill": false,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": true
        },
        {
          "key": "atb_return",
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
          "key": "atk_up_final",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": true,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "atk_up_per_conduct",
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
          "key": "conductCnt",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "final_rate",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "free_sword_limit",
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
          "key": "max_conduct_sword",
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
          "key": "remain_sword_limit",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "swordTriggerInterval",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "sword_duration",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "sword_gene_num",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "sword_range",
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
        "IfElseAction",
        "LaunchProjectile",
        "ObtainCostAction",
        "SpawnAbilityEntity"
      ]
    },
    {
      "key": "comboSkill",
      "skillId": "chr_0030_zhuangfy_combo_skill",
      "skillType": "comboSkill",
      "sourceFile": "chr_0030_zhuangfy_combo_skill.json",
      "timelineBlockFrames": 25,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 30.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 25,
          "endFrame": 60,
          "skillIds": [
            "chr_0030_zhuangfy_normal_skill",
            "chr_0030_zhuangfy_power_attack",
            "chr_0030_zhuangfy_attack1",
            "chr_0030_zhuangfy_attack2",
            "chr_0030_zhuangfy_attack3",
            "chr_0030_zhuangfy_attack4",
            "chr_0030_zhuangfy_attack5"
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
              "skillId": "chr_0030_zhuangfy_normal_skill",
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
          "endFrame": 210,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 6,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "SelfRotateAction"
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
          "endFrame": 21,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 21,
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
          "endFrame": 210,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 33,
          "actionTypes": [
            "CheckMainCharacterCondition",
            "CheckEntityNum",
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 21,
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
          "endFrame": 24,
          "actionTypes": [
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionTypes": [
            "IfElseAction",
            "SaveBuffStackNumAdvanced",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionTypes": [
            "InterruptAction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "FinishBuffAdvanced",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "CameraImpulseAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve",
            "IfElseAction",
            "ObtainCostAction",
            "SimpleCalcBBAction",
            "ObtainCostAction"
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
          "startFrame": 21,
          "endFrame": 68,
          "actionTypes": [
            "EffectAction",
            "Selector"
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
          "endFrame": 200,
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
          "startFrame": 2,
          "endFrame": 17,
          "actionTypes": [
            "VoiceTriggerAction"
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
          "startFrame": 20,
          "endFrame": 30,
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
          "startFrame": 0,
          "endFrame": 30,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionIndex": 49,
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  1.6,
                  1.76,
                  1.92,
                  2.08,
                  2.24,
                  2.4,
                  2.56,
                  2.72,
                  2.88,
                  3.08,
                  3.32,
                  3.6
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null
            },
            {
              "damageType": "Pulse",
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
              }
            }
          ]
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionIndex": 37,
          "actionPath": [
            "timelineActions[11]",
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
                "targetSource": "Context",
                "targetGroupKey": "smart_target",
                "buffCheckType": "Tag",
                "buffIds": [],
                "tagQueryType": "hasAny",
                "buffTagIds": [
                  2123008650
                ],
                "countType": "BuffCount",
                "comparison": "GE",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "limitSkillCastId": false
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "SaveBuffStackNumAdvanced",
              "actionIndex": 0,
              "buffStackRead": {
                "outputKey": "inflictCnt",
                "targetSource": "Context",
                "targetGroupKey": "smart_target",
                "buffCheckType": "Tag",
                "buffIds": [],
                "tagQueryType": "hasAny",
                "buffTagIds": [
                  2123008650
                ],
                "countType": "BuffCount",
                "limitSkillCastId": false
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 1,
              "blackboardMutation": {
                "key": "conductCnt",
                "operation": "Assign",
                "value": {
                  "value": 1.0,
                  "blackboardKey": "inflictCnt",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "nestedCondition": {
                "startFrame": 24,
                "endFrame": 27,
                "actionIndex": 41,
                "actionPath": [
                  "timelineActions[11]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "succeedActions",
                  "actionData",
                  "[2]"
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
                      "targetSource": "Context",
                      "targetGroupKey": "smart_target",
                      "buffCheckType": "Tag",
                      "buffIds": [],
                      "tagQueryType": "hasAny",
                      "buffTagIds": [
                        1466867135
                      ],
                      "countType": "BuffCount",
                      "comparison": "GE",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "limitSkillCastId": false
                    }
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "blackboardMutation": {
                      "key": "conductCnt",
                      "operation": "Add",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    }
                  }
                ],
                "failActions": []
              }
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 3,
              "nestedCondition": {
                "startFrame": 24,
                "endFrame": 27,
                "actionIndex": 44,
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
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "GT",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "conductCnt",
                      "levelValues": null
                    },
                    "right": {
                      "value": 4.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "blackboardMutation": {
                      "key": "conductCnt",
                      "operation": "Assign",
                      "value": {
                        "value": 4.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    }
                  }
                ],
                "failActions": []
              }
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 4,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_common_pulse_pulse_conduct_triggered",
                    "classification": "electrificationReaction",
                    "blackboardAssignments": {
                      "count": {
                        "value": 0.0,
                        "blackboardKey": "conductCnt",
                        "levelValues": null
                      }
                    }
                  }
                ]
              }
            }
          ],
          "failActions": []
        },
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionIndex": 54,
          "actionPath": [
            "timelineActions[12]",
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
                "targetGroupKey": "smart_target",
                "minimumCount": 1,
                "comparison": "GE",
                "containsHittableTarget": false,
                "excludeDeadEntity": false,
                "storeKey": ""
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 0,
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
              "actionType": "SimpleCalcBBAction",
              "actionIndex": 1,
              "blackboardCalculation": {
                "key": "usp_extra",
                "operation": "Multiply",
                "left": {
                  "value": 0.0,
                  "blackboardKey": "usp_extra",
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
                "right": {
                  "value": 0.0,
                  "blackboardKey": "inflictCnt",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "ObtainCostAction",
              "actionIndex": 2,
              "resourceGain": {
                "resource": "ultimateEnergy",
                "amount": {
                  "value": 0.2,
                  "blackboardKey": "usp_extra",
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
          "failActions": []
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionIndex": 50,
          "targetSource": "Context",
          "targetGroupKey": "smart_target",
          "buffCheckType": "Tag",
          "buffIds": [],
          "tagQueryType": "hasAny",
          "buffTagIds": [
            2123008650
          ],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": true,
          "isAbsorbed": false
        }
      ],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_common_pulse_pulse_conduct_triggered"
      ],
      "buffBehaviors": [],
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
            1.6,
            1.76,
            1.92,
            2.08,
            2.24,
            2.4,
            2.56,
            2.72,
            2.88,
            3.08,
            3.32,
            3.6
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
          ],
          "usp_extra": [
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
          "key": "atk_scale",
          "value": 1.43,
          "isDynamic": false
        },
        {
          "key": "conductCnt",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "consumedInflict",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "inflictCnt",
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
          "key": "usp",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "usp_extra",
          "value": 0.0,
          "isDynamic": true
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "conductCnt",
        "inflictCnt",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
        "poise",
        "usp",
        "usp_extra"
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
          "key": "conductCnt",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "consumedInflict",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "inflictCnt",
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
          "key": "usp",
          "declaredInSkill": true,
          "suppliedByPatch": true,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "usp_extra",
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
        "IfElseAction",
        "ObtainCostAction"
      ]
    },
    {
      "key": "enhancedComboSkill",
      "skillId": "chr_0030_zhuangfy_combo_skill_ult",
      "skillType": "comboSkill",
      "sourceFile": "chr_0030_zhuangfy_combo_skill_ult.json",
      "timelineBlockFrames": 25,
      "blockBoundarySource": "AllowNextSkillAction.startFrame",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 0.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [
        {
          "startFrame": 25,
          "endFrame": 54,
          "skillIds": [
            "chr_0030_zhuangfy_normal_skill_ult",
            "chr_0030_zhuangfy_attack1_ult",
            "chr_0030_zhuangfy_attack2_ult",
            "chr_0030_zhuangfy_attack3_ult"
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
              "skillId": "chr_0030_zhuangfy_normal_skill_ult",
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
          "endFrame": 197,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 3,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 6,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "SelfRotateAction"
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
          "endFrame": 21,
          "actionTypes": []
        },
        {
          "startFrame": 0,
          "endFrame": 21,
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
          "endFrame": 197,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 6,
          "endFrame": 197,
          "actionTypes": [
            "TogglableAction",
            "CheckHasMoveInput",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 30,
          "endFrame": 197,
          "actionTypes": [
            "BlockMoveInterruptSkill"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 50,
          "actionTypes": [
            "CheckMainCharacterCondition",
            "CheckEntityNum",
            "LockCameraAimAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 21,
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
          "endFrame": 24,
          "actionTypes": [
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionTypes": [
            "IfElseAction",
            "SaveBuffStackNumAdvanced",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "ModifyDynamicBlackboard",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionTypes": [
            "InterruptAction",
            "DamageAction",
            "AtkScaleCalculation",
            "DefiniteValueCalculation",
            "DefiniteValueCalculation",
            "FinishBuffAdvanced",
            "EnemyHurtAnimAction",
            "FAnimationCurve",
            "CameraImpulseAction",
            "FAnimationCurve",
            "HitStopAction",
            "FAnimationCurve",
            "CreateTimedMarker"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionTypes": [
            "LaunchProjectile"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 28,
          "actionTypes": [
            "ExtendBuffAction"
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
          "startFrame": 21,
          "endFrame": 68,
          "actionTypes": [
            "EffectAction",
            "Selector"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 36,
          "actionTypes": [
            "EffectAction",
            "Selector"
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
          "startFrame": 0,
          "endFrame": 60,
          "actionTypes": [
            "PlaySoundAction"
          ]
        },
        {
          "startFrame": 24,
          "endFrame": 86,
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
          "startFrame": 5,
          "endFrame": 15,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 5,
          "endFrame": 15,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionIndex": 51,
          "damageUnits": [
            {
              "damageType": "Pulse",
              "attributeType": "Hp",
              "calculation": "standard",
              "attackScale": {
                "value": 1.0,
                "blackboardKey": "atk_scale",
                "levelValues": [
                  2.4,
                  2.64,
                  2.88,
                  3.12,
                  3.36,
                  3.6,
                  3.84,
                  4.08,
                  4.32,
                  4.62,
                  4.98,
                  5.4
                ]
              },
              "calculationMultiplier": null,
              "poiseValue": null
            },
            {
              "damageType": "Pulse",
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
              }
            }
          ]
        }
      ],
      "conditionalActions": [
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionIndex": 39,
          "actionPath": [
            "timelineActions[13]",
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
                "targetSource": "Context",
                "targetGroupKey": "smart_target",
                "buffCheckType": "Tag",
                "buffIds": [],
                "tagQueryType": "hasAny",
                "buffTagIds": [
                  2123008650
                ],
                "countType": "BuffCount",
                "comparison": "GE",
                "value": {
                  "value": 1.0,
                  "blackboardKey": null,
                  "levelValues": null
                },
                "limitSkillCastId": false
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "SaveBuffStackNumAdvanced",
              "actionIndex": 0,
              "buffStackRead": {
                "outputKey": "inflictCnt",
                "targetSource": "Context",
                "targetGroupKey": "smart_target",
                "buffCheckType": "Tag",
                "buffIds": [],
                "tagQueryType": "hasAny",
                "buffTagIds": [
                  2123008650
                ],
                "countType": "BuffCount",
                "limitSkillCastId": false
              }
            },
            {
              "actionType": "ModifyDynamicBlackboard",
              "actionIndex": 1,
              "blackboardMutation": {
                "key": "conductCnt",
                "operation": "Assign",
                "value": {
                  "value": 1.0,
                  "blackboardKey": "inflictCnt",
                  "levelValues": null
                }
              }
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 2,
              "nestedCondition": {
                "startFrame": 24,
                "endFrame": 27,
                "actionIndex": 43,
                "actionPath": [
                  "timelineActions[13]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "succeedActions",
                  "actionData",
                  "[2]"
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
                      "targetSource": "Context",
                      "targetGroupKey": "smart_target",
                      "buffCheckType": "Tag",
                      "buffIds": [],
                      "tagQueryType": "hasAny",
                      "buffTagIds": [
                        1466867135
                      ],
                      "countType": "BuffCount",
                      "comparison": "GE",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": null,
                        "levelValues": null
                      },
                      "limitSkillCastId": false
                    }
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "blackboardMutation": {
                      "key": "conductCnt",
                      "operation": "Add",
                      "value": {
                        "value": 1.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    }
                  }
                ],
                "failActions": []
              }
            },
            {
              "actionType": "IfElseAction",
              "actionIndex": 3,
              "nestedCondition": {
                "startFrame": 24,
                "endFrame": 27,
                "actionIndex": 46,
                "actionPath": [
                  "timelineActions[13]",
                  "_sequenceActionData",
                  "actionData",
                  "[0]",
                  "succeedActions",
                  "actionData",
                  "[3]"
                ],
                "conditions": [
                  {
                    "sourceType": "CompareFloat",
                    "supported": true,
                    "comparison": "GT",
                    "left": {
                      "value": 0.0,
                      "blackboardKey": "conductCnt",
                      "levelValues": null
                    },
                    "right": {
                      "value": 4.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "skillTypes": []
                  }
                ],
                "succeedActions": [
                  {
                    "actionType": "ModifyDynamicBlackboard",
                    "actionIndex": 0,
                    "blackboardMutation": {
                      "key": "conductCnt",
                      "operation": "Assign",
                      "value": {
                        "value": 4.0,
                        "blackboardKey": null,
                        "levelValues": null
                      }
                    }
                  }
                ],
                "failActions": []
              }
            },
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 4,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_common_pulse_pulse_conduct_triggered",
                    "classification": "electrificationReaction",
                    "blackboardAssignments": {
                      "count": {
                        "value": 0.0,
                        "blackboardKey": "conductCnt",
                        "levelValues": null
                      }
                    }
                  }
                ]
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
      "buffFinishes": [
        {
          "startFrame": 24,
          "endFrame": 27,
          "actionIndex": 52,
          "targetSource": "Context",
          "targetGroupKey": "smart_target",
          "buffCheckType": "Tag",
          "buffIds": [],
          "tagQueryType": "hasAny",
          "buffTagIds": [
            2123008650
          ],
          "finishAll": true,
          "limitSource": false,
          "isFinishedEarly": true,
          "isAbsorbed": false
        }
      ],
      "resourceGains": [],
      "projectileLaunches": [
        {
          "launchFrame": 24,
          "projectileId": "projectile_chr_0030_zhuangfy_combo_skill_ring",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0030_zhuangfy_combo_skill_ring_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 24,
          "actionOrder": [
            57
          ],
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0030_zhuangfy_combo_skill_ring",
          "hitSkillId": "chr_0030_zhuangfy_combo_skill_ring_projhit",
          "sourceFile": "chr_0030_zhuangfy_combo_skill_ring_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "conditionalActions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [
            "CreateBuffAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        }
      ],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_common_pulse_pulse_conduct_triggered"
      ],
      "buffBehaviors": [],
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
            2.4,
            2.64,
            2.88,
            3.12,
            3.36,
            3.6,
            3.84,
            4.08,
            4.32,
            4.62,
            4.98,
            5.4
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
          "key": "atk_scale",
          "value": 1.43,
          "isDynamic": false
        },
        {
          "key": "conductCnt",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "consumedInflict",
          "value": 0.0,
          "isDynamic": true
        },
        {
          "key": "inflictCnt",
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
        }
      ],
      "blackboardKeys": [
        "atk_scale",
        "conductCnt",
        "inflictCnt",
        "owner_mainchar_alpha",
        "owner_mainchar_distance",
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
          "key": "conductCnt",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "consumedInflict",
          "declaredInSkill": true,
          "suppliedByPatch": false,
          "calculatedLocally": false,
          "mutatedLocally": false,
          "readFromBuff": false,
          "externalRuntimeInput": false
        },
        {
          "key": "inflictCnt",
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
        }
      ],
      "unresolvedCombatActions": [
        "CreateBuffAction",
        "DamageAction",
        "IfElseAction",
        "LaunchProjectile"
      ]
    },
    {
      "key": "ultimate",
      "skillId": "chr_0030_zhuangfy_ultimate_skill",
      "skillType": "ultimate",
      "sourceFile": "chr_0030_zhuangfy_ultimate_skill.json",
      "timelineBlockFrames": 91,
      "blockBoundarySource": "exclusiveFrame+1",
      "cooldownSeconds": 0.0,
      "costFrame": 0,
      "costType": "UltimateSp",
      "costValue": 8.0,
      "offsetRecordFrame": 0,
      "allowNextWindows": [],
      "inputCacheWindows": [],
      "timelineActions": [
        {
          "startFrame": 0,
          "endFrame": 79,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 79,
          "endFrame": 208,
          "actionTypes": [
            "PlayAnimationAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "UltimateShowAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 17,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "SpawnAbilityEntity",
            "ChangeSpecificLayerAction",
            "IfElseAction",
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "FindTargetAction",
            "Selector",
            "SpawnAbilityEntity",
            "ChangeSpecificLayerAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 29,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 78,
          "endFrame": 81,
          "actionTypes": [
            "CameraImpulseAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 78,
          "endFrame": 81,
          "actionTypes": [
            "CreateBuffAction"
          ]
        },
        {
          "startFrame": 90,
          "endFrame": 208,
          "actionTypes": [
            "BlockMoveInterruptSkill",
            "ReceiveMoveInputAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 88,
          "actionTypes": [
            "AnimatedCameraAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 17,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 78,
          "actionTypes": [
            "ShowHideActorAction"
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
          "endFrame": 78,
          "actionTypes": [
            "UltimateTimeAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "HideUIAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionTypes": [
            "CreateBuffAction",
            "Selector",
            "SetSuperArmorAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 9,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 22,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 38,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 44,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 44,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 56,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 78,
          "endFrame": 158,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 17,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 78,
          "endFrame": 121,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 78,
          "endFrame": 134,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 58,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 57,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 208,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 208,
          "actionTypes": [
            "CharWeaponVisibleAction"
          ]
        },
        {
          "startFrame": 7,
          "endFrame": 132,
          "actionTypes": [
            "VoiceTriggerAction"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 152,
          "actionTypes": [
            "PlaySoundAction"
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
          "startFrame": 10,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 10,
          "endFrame": 59,
          "actionTypes": [
            "EffectAction"
          ]
        },
        {
          "startFrame": 75,
          "endFrame": 78,
          "actionTypes": [
            "EffectAction"
          ]
        }
      ],
      "directDamageHits": [],
      "conditionalActions": [
        {
          "startFrame": 0,
          "endFrame": 17,
          "actionIndex": 6,
          "actionPath": [
            "timelineActions[3]",
            "_sequenceActionData",
            "actionData",
            "[3]"
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
                  "buff_chr_0030_zhuangfy_potential5_vfx"
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
              }
            }
          ],
          "succeedActions": [
            {
              "actionType": "CreateBuffAction",
              "actionIndex": 0,
              "buffApplication": {
                "buffs": [
                  {
                    "buffId": "buff_chr_0030_zhuangfy_potential5_vfx",
                    "classification": null,
                    "blackboardAssignments": {}
                  }
                ]
              }
            }
          ],
          "failActions": []
        }
      ],
      "inflictions": [],
      "auxiliaryActions": [
        {
          "startFrame": 0,
          "endFrame": 17,
          "actionIndex": 4,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0030_zhuangfy_ult_mirror",
          "classification": "nonCombatAbilityEntity",
          "blackboardAssignments": {},
          "nestedCombatActions": []
        },
        {
          "startFrame": 0,
          "endFrame": 78,
          "actionIndex": 10,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0030_zhuangfy_ult",
          "classification": "nonCombatAbilityEntity",
          "blackboardAssignments": {},
          "nestedCombatActions": []
        },
        {
          "startFrame": 78,
          "endFrame": 81,
          "actionIndex": 14,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_chr_0030_zhuangfy_ult_base",
          "classification": null,
          "blackboardAssignments": {
            "duration": {
              "value": 60.0,
              "blackboardKey": "duration",
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
            "combo_cd_rate": {
              "value": 0.0,
              "blackboardKey": "combo_cd_rate",
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
            }
          },
          "nestedCombatActions": []
        },
        {
          "startFrame": 0,
          "endFrame": 90,
          "actionIndex": 26,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_damage_immune_ult_skill",
          "classification": "incomingDamageProtection",
          "blackboardAssignments": {},
          "nestedCombatActions": []
        }
      ],
      "blackboardCalculations": [],
      "blackboardMutations": [],
      "buffBlackboardReads": [],
      "buffFinishes": [],
      "resourceGains": [],
      "projectileLaunches": [],
      "projectileHits": [],
      "abilityEntityHits": [],
      "referencedBuffIds": [
        "buff_chr_0030_zhuangfy_potential5_vfx",
        "buff_chr_0030_zhuangfy_ult_base",
        "buff_common_damage_immune_ult_skill"
      ],
      "buffBehaviors": [
        {
          "applicationFrame": 78,
          "applicationEvent": null,
          "buffId": "buff_chr_0030_zhuangfy_ult_base",
          "sourceFile": "buff_chr_0030_zhuangfy_ult_base.json",
          "sourceAvailable": true,
          "lifecycle": {
            "lifeType": "Limited",
            "duration": {
              "value": 1.5,
              "blackboardKey": "duration",
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
            "triggerInterval": {
              "value": -1.0,
              "blackboardKey": null,
              "levelValues": null
            },
            "waitFirstTriggerInterval": false,
            "maxTriggerCount": {
              "value": 99.0,
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
              "value": 1.0,
              "blackboardKey": null,
              "levelValues": null
            },
            "hasStackEffects": false
          },
          "directDamageHits": [],
          "conditionalActions": [],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "eventActions": [
            {
              "event": "DuringBuffEnable",
              "combatActions": [],
              "damageUnits": [],
              "createdBuffIds": [],
              "createdBuffBehaviors": []
            },
            {
              "event": "DuringBuffEnable",
              "combatActions": [
                "CreateBuffAction"
              ],
              "damageUnits": [],
              "createdBuffIds": [
                "buff_chr_0030_zhuangfy_ult_hide_model_holder"
              ],
              "createdBuffBehaviors": [
                {
                  "applicationFrame": null,
                  "applicationEvent": "DuringBuffEnable",
                  "buffId": "buff_chr_0030_zhuangfy_ult_hide_model_holder",
                  "sourceFile": "buff_chr_0030_zhuangfy_ult_hide_model_holder.json",
                  "sourceAvailable": true,
                  "lifecycle": {
                    "lifeType": "Infinity",
                    "duration": {
                      "value": 0.033,
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
                      "value": 99.0,
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
                      "value": 1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "hasStackEffects": false
                  },
                  "directDamageHits": [],
                  "conditionalActions": [],
                  "blackboardCalculations": [],
                  "blackboardMutations": [],
                  "buffBlackboardReads": [],
                  "buffFinishes": [],
                  "eventActions": [
                    {
                      "event": "OnBuffFinish",
                      "combatActions": [
                        "CreateBuffAction"
                      ],
                      "damageUnits": [],
                      "createdBuffIds": [
                        "buff_chr_0030_zhuangfy_ult_hide_model"
                      ],
                      "createdBuffBehaviors": [
                        {
                          "applicationFrame": null,
                          "applicationEvent": "OnBuffFinish",
                          "buffId": "buff_chr_0030_zhuangfy_ult_hide_model",
                          "sourceFile": "buff_chr_0030_zhuangfy_ult_hide_model.json",
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
                              "value": 99.0,
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
                              "value": 1.0,
                              "blackboardKey": null,
                              "levelValues": null
                            },
                            "hasStackEffects": false
                          },
                          "directDamageHits": [],
                          "conditionalActions": [],
                          "blackboardCalculations": [],
                          "blackboardMutations": [],
                          "buffBlackboardReads": [],
                          "buffFinishes": [],
                          "eventActions": [
                            {
                              "event": "DuringBuffEnable",
                              "combatActions": [],
                              "damageUnits": [],
                              "createdBuffIds": [],
                              "createdBuffBehaviors": []
                            }
                          ],
                          "resourceGains": [],
                          "nestedBuffBehaviors": [],
                          "combatActions": [],
                          "cycleTruncated": false
                        }
                      ]
                    }
                  ],
                  "resourceGains": [],
                  "nestedBuffBehaviors": [],
                  "combatActions": [],
                  "cycleTruncated": false
                }
              ]
            },
            {
              "event": "DuringBuffEnable",
              "combatActions": [],
              "damageUnits": [],
              "createdBuffIds": [],
              "createdBuffBehaviors": []
            },
            {
              "event": "DuringBuffEnable",
              "combatActions": [
                "CreateBuffAction"
              ],
              "damageUnits": [],
              "createdBuffIds": [
                "buff_chr_0030_zhuangfy_ult_env_vfx",
                "buff_chr_0030_zhuangfy_ult_body_vfx"
              ],
              "createdBuffBehaviors": [
                {
                  "applicationFrame": null,
                  "applicationEvent": "DuringBuffEnable",
                  "buffId": "buff_chr_0030_zhuangfy_ult_env_vfx",
                  "sourceFile": "buff_chr_0030_zhuangfy_ult_env_vfx.json",
                  "sourceAvailable": true,
                  "lifecycle": {
                    "lifeType": "Infinity",
                    "duration": {
                      "value": 1.5,
                      "blackboardKey": "duration",
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
                    "triggerInterval": {
                      "value": -1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "waitFirstTriggerInterval": true,
                    "maxTriggerCount": {
                      "value": 999.0,
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
                      "value": 0.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "hasStackEffects": false
                  },
                  "directDamageHits": [],
                  "conditionalActions": [],
                  "blackboardCalculations": [],
                  "blackboardMutations": [],
                  "buffBlackboardReads": [],
                  "buffFinishes": [],
                  "eventActions": [
                    {
                      "event": "DuringBuffEnable",
                      "combatActions": [],
                      "damageUnits": [],
                      "createdBuffIds": [],
                      "createdBuffBehaviors": []
                    }
                  ],
                  "resourceGains": [],
                  "nestedBuffBehaviors": [],
                  "combatActions": [],
                  "cycleTruncated": false
                },
                {
                  "applicationFrame": null,
                  "applicationEvent": "DuringBuffEnable",
                  "buffId": "buff_chr_0030_zhuangfy_ult_body_vfx",
                  "sourceFile": "buff_chr_0030_zhuangfy_ult_body_vfx.json",
                  "sourceAvailable": true,
                  "lifecycle": {
                    "lifeType": "Infinity",
                    "duration": {
                      "value": 1.5,
                      "blackboardKey": "duration",
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
                    "triggerInterval": {
                      "value": -1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "waitFirstTriggerInterval": true,
                    "maxTriggerCount": {
                      "value": 999.0,
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
                      "value": 0.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "hasStackEffects": false
                  },
                  "directDamageHits": [],
                  "conditionalActions": [],
                  "blackboardCalculations": [],
                  "blackboardMutations": [],
                  "buffBlackboardReads": [],
                  "buffFinishes": [],
                  "eventActions": [
                    {
                      "event": "DuringBuffEnable",
                      "combatActions": [],
                      "damageUnits": [],
                      "createdBuffIds": [],
                      "createdBuffBehaviors": []
                    }
                  ],
                  "resourceGains": [],
                  "nestedBuffBehaviors": [],
                  "combatActions": [],
                  "cycleTruncated": false
                }
              ]
            },
            {
              "event": "OnBuffFinish",
              "combatActions": [
                "IfElseAction"
              ],
              "damageUnits": [],
              "createdBuffIds": [],
              "createdBuffBehaviors": []
            },
            {
              "event": "OnBuffStart",
              "combatActions": [
                "CreateBuffAction"
              ],
              "damageUnits": [],
              "createdBuffIds": [
                "buff_chr_0030_zhuangfy_ult_skill_free"
              ],
              "createdBuffBehaviors": [
                {
                  "applicationFrame": null,
                  "applicationEvent": "OnBuffStart",
                  "buffId": "buff_chr_0030_zhuangfy_ult_skill_free",
                  "sourceFile": "buff_chr_0030_zhuangfy_ult_skill_free.json",
                  "sourceAvailable": true,
                  "lifecycle": {
                    "lifeType": "Infinity",
                    "duration": {
                      "value": 1.5,
                      "blackboardKey": "duration",
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
                    "triggerInterval": {
                      "value": -1.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "waitFirstTriggerInterval": true,
                    "maxTriggerCount": {
                      "value": 999.0,
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
                      "value": 0.0,
                      "blackboardKey": null,
                      "levelValues": null
                    },
                    "hasStackEffects": false
                  },
                  "directDamageHits": [],
                  "conditionalActions": [],
                  "blackboardCalculations": [],
                  "blackboardMutations": [],
                  "buffBlackboardReads": [],
                  "buffFinishes": [],
                  "eventActions": [],
                  "resourceGains": [],
                  "nestedBuffBehaviors": [],
                  "combatActions": [],
                  "cycleTruncated": false
                }
              ]
            }
          ],
          "resourceGains": [],
          "nestedBuffBehaviors": [],
          "combatActions": [],
          "cycleTruncated": false
        },
        {
          "applicationFrame": 0,
          "applicationEvent": null,
          "buffId": "buff_common_damage_immune_ult_skill",
          "sourceFile": "buff_common_damage_immune_ult_skill.json",
          "sourceAvailable": false,
          "lifecycle": null,
          "directDamageHits": [],
          "conditionalActions": [],
          "blackboardCalculations": [],
          "blackboardMutations": [],
          "buffBlackboardReads": [],
          "buffFinishes": [],
          "eventActions": [],
          "resourceGains": [],
          "nestedBuffBehaviors": [],
          "combatActions": [],
          "cycleTruncated": false
        }
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
          "combo_cd_rate": [
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
          "duration": [
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
          "duration_extra": [
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
          240.0,
          240.0,
          240.0,
          240.0,
          240.0,
          240.0,
          240.0,
          240.0,
          240.0,
          240.0,
          240.0,
          240.0
        ]
      },
      "declaredBlackboard": [
        {
          "key": "combo_cd_rate",
          "value": 0.0,
          "isDynamic": false
        },
        {
          "key": "duration",
          "value": 10.0,
          "isDynamic": false
        }
      ],
      "blackboardKeys": [
        "select_radius"
      ],
      "blackboardProvenance": [
        {
          "key": "combo_cd_rate",
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
          "key": "duration_extra",
          "declaredInSkill": false,
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
        "IfElseAction",
        "SpawnAbilityEntity"
      ]
    }
  ]
} as const satisfies GeneratedOperatorSource;
