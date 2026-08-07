/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { GeneratedOperatorSource } from './generatedOperatorSource';

// prettier-ignore
export const perlicaGeneratedSource = {
  "slug": "perlica",
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
            "CustomRootMotionAction",
            "FAnimationCurve"
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
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_attack1_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 8,
          "rootActionIndex": 3,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack1",
          "hitSkillId": "chr_0004_pelica_attack1_projhit",
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
              "poiseValue": null
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
                  "poiseValue": null
                }
              ]
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
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
              }
            }
          ],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        }
      ],
      "abilityEntityHits": [],
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
      ]
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
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 6,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_attack2_projhit"
        },
        {
          "launchFrame": 12,
          "projectileId": "projectile_chr_0004_pelica_normal_attack2",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_attack2_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 9,
          "rootActionIndex": 1,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack2",
          "hitSkillId": "chr_0004_pelica_attack2_projhit",
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
              "poiseValue": null
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
                  "poiseValue": null
                }
              ]
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 4,
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
              }
            }
          ],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 12,
          "rootActionIndex": 2,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack2",
          "hitSkillId": "chr_0004_pelica_attack2_projhit",
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
              "poiseValue": null
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
                  "poiseValue": null
                }
              ]
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 4,
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
              }
            }
          ],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        }
      ],
      "abilityEntityHits": [],
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
      ]
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
            "CustomRootMotionAction",
            "FAnimationCurve"
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
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 6,
          "actionTypes": [
            "CheckEntityNum",
            "SnapToTargetWithRangeAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_attack3_projhit"
        },
        {
          "launchFrame": 19,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_attack3_projhit"
        },
        {
          "launchFrame": 22,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_attack3_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 16,
          "rootActionIndex": 3,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "hitSkillId": "chr_0004_pelica_attack3_projhit",
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
              "poiseValue": null
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
                  "poiseValue": null
                }
              ]
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 7,
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
              }
            }
          ],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 19,
          "rootActionIndex": 4,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "hitSkillId": "chr_0004_pelica_attack3_projhit",
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
              "poiseValue": null
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
                  "poiseValue": null
                }
              ]
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 7,
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
              }
            }
          ],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 22,
          "rootActionIndex": 5,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack3",
          "hitSkillId": "chr_0004_pelica_attack3_projhit",
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
              "poiseValue": null
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
                  "poiseValue": null
                }
              ]
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 7,
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
              }
            }
          ],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        }
      ],
      "abilityEntityHits": [],
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
      ]
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
            "CustomRootMotionAction",
            "FAnimationCurve"
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
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_attack4_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 27,
          "rootActionIndex": 3,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_normal_attack4",
          "hitSkillId": "chr_0004_pelica_attack4_projhit",
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
              "poiseValue": null
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
              }
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
                  "poiseValue": null
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
                  }
                }
              ]
            }
          ],
          "auxiliaryActions": [],
          "resourceGains": [
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 6,
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
              }
            }
          ],
          "combatActions": [
            "DamageAction",
            "IfElseAction",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        }
      ],
      "abilityEntityHits": [],
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
      ]
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
            "FAnimationCurve",
            "CameraImpulseAction",
            "FAnimationCurve",
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
            "HitStopAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 135,
          "actionTypes": [
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 32,
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
          "endFrame": 45,
          "actionTypes": [
            "SaveTwoDirectionAngle",
            "CurveEvaluateFloat",
            "FAnimationCurve",
            "CurveEvaluateFloat",
            "FAnimationCurve",
            "CameraRotateAction",
            "FAnimationCurve",
            "CurveEvaluateFloat",
            "FAnimationCurve",
            "SaveCameraAngle",
            "CurveEvaluateFloat",
            "FAnimationCurve",
            "AddDynamicCcsAction",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "endFrame": 50,
          "actionIndex": 39,
          "actionType": "CreateBuffAction",
          "sourceId": "buff_common_damage_immune_medium",
          "classification": "incomingDamageProtection",
          "blackboardAssignments": {},
          "nestedCombatActions": []
        },
        {
          "startFrame": 0,
          "endFrame": 35,
          "actionIndex": 46,
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
      "buffBehaviors": [
        {
          "applicationFrame": 0,
          "applicationEvent": null,
          "buffId": "buff_common_damage_immune_medium",
          "sourceFile": "buff_common_damage_immune_medium.json",
          "sourceAvailable": false,
          "lifeType": "",
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
          "lifeType": "",
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
      ]
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
            "FAnimationCurve",
            "ObtainCostAction"
          ]
        },
        {
          "startFrame": 2,
          "endFrame": 7,
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
          }
        }
      ],
      "projectileLaunches": [
        {
          "launchFrame": 1,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_plunging_attack_projhit"
        },
        {
          "launchFrame": 1,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_plunging_attack_projhit"
        },
        {
          "launchFrame": 1,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_plunging_attack_projhit"
        },
        {
          "launchFrame": 1,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_plunging_attack_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 1,
          "rootActionIndex": 14,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "hitSkillId": "chr_0004_pelica_plunging_attack_projhit",
          "sourceFile": "chr_0004_pelica_plunging_attack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 1,
          "rootActionIndex": 15,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "hitSkillId": "chr_0004_pelica_plunging_attack_projhit",
          "sourceFile": "chr_0004_pelica_plunging_attack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 1,
          "rootActionIndex": 16,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "hitSkillId": "chr_0004_pelica_plunging_attack_projhit",
          "sourceFile": "chr_0004_pelica_plunging_attack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        },
        {
          "launchFrame": 1,
          "rootActionIndex": 17,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_plunging_attack",
          "hitSkillId": "chr_0004_pelica_plunging_attack_projhit",
          "sourceFile": "chr_0004_pelica_plunging_attack_projhit.json",
          "damageUnits": [],
          "directDamageHits": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "combatActions": [],
          "cycleTruncated": false,
          "nestedProjectileHits": []
        }
      ],
      "abilityEntityHits": [],
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
      ]
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
            "FAnimationCurve",
            "CameraImpulseAction",
            "FAnimationCurve",
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
            "CustomRootMotionAction",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 27,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 0,
          "endFrame": 12,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
          ]
        },
        {
          "startFrame": 12,
          "endFrame": 27,
          "actionTypes": [
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
            "FAnimationCurve",
            "CurveEvaluateFloat",
            "FAnimationCurve",
            "CameraRotateAction",
            "FAnimationCurve"
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
              "poiseValue": null
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
              }
            }
          ]
        }
      ],
      "conditionalActions": [],
      "inflictions": [
        {
          "startFrame": 13,
          "endFrame": 13,
          "actionIndex": 11,
          "element": "electric",
          "isExtra": false
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
      "buffBehaviors": [
        {
          "applicationFrame": 13,
          "applicationEvent": null,
          "buffId": "buff_common_obtain_ultimate_sp",
          "sourceFile": "buff_common_obtain_ultimate_sp.json",
          "sourceAvailable": false,
          "lifeType": "",
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
      ]
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
            "CustomRootMotionAction",
            "FAnimationCurve"
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
          "endFrame": 22,
          "actionTypes": [
            "TimeDilationAction",
            "FAnimationCurve",
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
            "AddCameraControlStateAction",
            "FAnimationCurve",
            "FAnimationCurve"
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
          "castSkillOnHit": true,
          "hitSkillId": "chr_0004_pelica_combo_skill_projhit"
        }
      ],
      "projectileHits": [
        {
          "launchFrame": 24,
          "rootActionIndex": 7,
          "assumedTravelFrames": 0,
          "projectileId": "projectile_chr_0004_pelica_combo_skill",
          "hitSkillId": "chr_0004_pelica_combo_skill_projhit",
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
              "poiseValue": null
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
              }
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
                  "poiseValue": null
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
                  }
                }
              ]
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
              "blackboardAssignments": {},
              "nestedCombatActions": []
            },
            {
              "startFrame": 0,
              "endFrame": 3,
              "actionIndex": 10,
              "actionType": "CreateBuffAction",
              "sourceId": "buff_common_pulse_pulse_conduct_triggered",
              "classification": "electrificationReaction",
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
                  "levelValues": null
                }
              },
              "nestedCombatActions": []
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
              }
            }
          ],
          "combatActions": [
            "CreateBuffAction",
            "DamageAction",
            "IfElseAction",
            "LaunchProjectile",
            "ObtainCostAction"
          ],
          "cycleTruncated": false,
          "nestedProjectileHits": [
            {
              "launchFrame": 24,
              "rootActionIndex": 7,
              "assumedTravelFrames": 0,
              "projectileId": "projectile_chr_0004_pelica_combo_skill",
              "hitSkillId": "chr_0004_pelica_combo_skill_projhit",
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
                  "poiseValue": null
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
                  }
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
                      "poiseValue": null
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
                      }
                    }
                  ]
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
                  "blackboardAssignments": {},
                  "nestedCombatActions": []
                },
                {
                  "startFrame": 0,
                  "endFrame": 3,
                  "actionIndex": 10,
                  "actionType": "CreateBuffAction",
                  "sourceId": "buff_common_pulse_pulse_conduct_triggered",
                  "classification": "electrificationReaction",
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
                      "levelValues": null
                    }
                  },
                  "nestedCombatActions": []
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
                  }
                }
              ],
              "combatActions": [
                "CreateBuffAction",
                "DamageAction",
                "IfElseAction",
                "LaunchProjectile",
                "ObtainCostAction"
              ],
              "cycleTruncated": true,
              "nestedProjectileHits": []
            }
          ]
        }
      ],
      "abilityEntityHits": [],
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
            "FAnimationCurve",
            "EnemyHurtAnimAction",
            "FAnimationCurve"
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
              "poiseValue": null
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
              }
            }
          ]
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
          "blackboardAssignments": {},
          "nestedCombatActions": []
        },
        {
          "startFrame": 55,
          "endFrame": 58,
          "actionIndex": 22,
          "actionType": "SpawnAbilityEntity",
          "sourceId": "abilityentity_chr_0004_pelica_ultimate_skill:chr_0004_pelica_ultimate_skill_abilityrange",
          "classification": "nonCombatAbilityEntity",
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
      "abilityEntityHits": [
        {
          "spawnFrame": 55,
          "rootActionIndex": 22,
          "abilityEntityId": "abilityentity_chr_0004_pelica_ultimate_skill",
          "skillId": "chr_0004_pelica_ultimate_skill_abilityrange",
          "sourceFile": "chr_0004_pelica_ultimate_skill_abilityrange.json",
          "directDamageHits": [],
          "inflictions": [],
          "auxiliaryActions": [],
          "resourceGains": [],
          "projectileLaunches": [],
          "projectileHits": [],
          "nestedAbilityEntityHits": [],
          "combatActions": [],
          "cycleTruncated": false
        }
      ],
      "buffBehaviors": [
        {
          "applicationFrame": 0,
          "applicationEvent": null,
          "buffId": "buff_common_damage_immune_ult_skill",
          "sourceFile": "buff_common_damage_immune_ult_skill.json",
          "sourceAvailable": false,
          "lifeType": "",
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
      ]
    }
  ]
} as const satisfies GeneratedOperatorSource;
