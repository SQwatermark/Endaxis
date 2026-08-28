/** 083f95c2 的 v1 武器兼容快照；仅供旧存档迁移，不随当前生成结果更新。 */
import type { WeaponDefinition } from '../../../core/game-data/equipmentDefinition';

// prettier-ignore
export default [
  {
    "slug": "opero-77",
    "iconPath": "/weapons/polearm/wpn_polearm_0009.webp",
    "rarity": 3,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      29,
      83,
      140,
      197,
      254,
      283
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "main",
            "operation": "flat",
            "value": [
              10,
              18,
              26,
              34,
              42,
              51,
              59,
              67,
              79
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "panelStat",
            "stat": "attackFlat",
            "value": [
              12,
              14,
              17,
              19,
              22,
              24,
              26,
              29,
              34
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "aggeloslayer",
    "iconPath": "/weapons/polearm/wpn_polearm_0008.webp",
    "rarity": 4,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      34,
      100,
      169,
      238,
      307,
      341
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "will",
            "operation": "flat",
            "value": [
              12,
              21,
              31,
              40,
              50,
              60,
              69,
              79,
              93
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": [
              "heat",
              "cryo",
              "electric",
              "nature"
            ],
            "value": [
              0.033,
              0.06,
              0.087,
              0.113,
              0.14,
              0.167,
              0.193,
              0.22,
              0.26
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9
      }
    ]
  },
  {
    "slug": "pathfinders-beacon",
    "iconPath": "/weapons/polearm/wpn_polearm_0003.webp",
    "rarity": 4,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      34,
      100,
      169,
      238,
      307,
      341
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "agility",
            "operation": "flat",
            "value": [
              12,
              21,
              31,
              40,
              50,
              60,
              69,
              79,
              93
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "panelStat",
            "stat": "attackPercent",
            "value": [
              0.03,
              0.054000000000000006,
              0.078,
              0.102,
              0.126,
              0.15,
              0.174,
              0.198,
              0.23399999999999999
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9
      }
    ]
  },
  {
    "slug": "chimeric-justice",
    "iconPath": "/weapons/polearm/wpn_polearm_0004.webp",
    "rarity": 5,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      42,
      120,
      203,
      286,
      369,
      411
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "strength",
            "operation": "flat",
            "value": [
              16,
              28,
              41,
              54,
              67,
              80,
              92,
              105,
              124
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "panelStat",
            "stat": "ultimateEnergyGainEfficiency",
            "value": [
              0.048,
              0.086,
              0.12400000000000001,
              0.162,
              0.2,
              0.23800000000000002,
              0.276,
              0.314,
              0.371
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "panelStat",
            "stat": "criticalRate",
            "value": [
              0.03,
              0.036000000000000004,
              0.042,
              0.048,
              0.054000000000000006,
              0.06,
              0.066,
              0.07200000000000001,
              0.084
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "cohesive-traction",
    "iconPath": "/weapons/polearm/wpn_polearm_0006.webp",
    "rarity": 5,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      42,
      120,
      203,
      286,
      369,
      411
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "will",
            "operation": "flat",
            "value": [
              16,
              28,
              41,
              54,
              67,
              80,
              92,
              105,
              124
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": "electric",
            "value": [
              0.044000000000000004,
              0.08,
              0.11599999999999999,
              0.151,
              0.187,
              0.222,
              0.258,
              0.29300000000000004,
              0.34700000000000003
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": [
              "physical",
              "true",
              "heat",
              "electric",
              "cryo",
              "nature",
              "ether"
            ],
            "skillTypes": "comboSkill",
            "value": [
              0.1,
              0.12,
              0.14,
              0.16,
              0.18,
              0.2,
              0.22,
              0.24,
              0.28
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "obj-razorhorn",
    "iconPath": "/weapons/polearm/wpn_polearm_0013.webp",
    "rarity": 5,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      42,
      120,
      203,
      286,
      369,
      411
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "will",
            "operation": "flat",
            "value": [
              16,
              28,
              41,
              54,
              67,
              80,
              92,
              105,
              124
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": "physical",
            "value": [
              0.044000000000000004,
              0.08,
              0.11599999999999999,
              0.151,
              0.187,
              0.222,
              0.258,
              0.29300000000000004,
              0.34700000000000003
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9
      }
    ]
  },
  {
    "slug": "beacon-of-duty",
    "iconPath": "/weapons/polearm/wpn_polearm_0007.webp",
    "rarity": 6,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      49,
      142,
      240,
      338,
      436,
      485
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "agility",
            "operation": "flat",
            "value": [
              20,
              36,
              52,
              68,
              84,
              100,
              116,
              132,
              156
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "panelStat",
            "stat": "ultimateEnergyGainEfficiency",
            "value": [
              0.06,
              0.107,
              0.155,
              0.20199999999999999,
              0.25,
              0.298,
              0.34500000000000003,
              0.39299999999999996,
              0.46399999999999997
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": "heat",
            "value": [
              0.07,
              0.084,
              0.098,
              0.11199999999999999,
              0.126,
              0.14,
              0.154,
              0.168,
              0.196
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "blessing-of-lustrous-carmine",
    "iconPath": "/weapons/polearm/wpn_polearm_0015.webp",
    "rarity": 6,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      51,
      146,
      247,
      348,
      449,
      500
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "agility",
            "operation": "flat",
            "value": [
              20,
              36,
              52,
              68,
              84,
              100,
              116,
              132,
              156
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": "heat",
            "value": [
              0.055999999999999994,
              0.1,
              0.14400000000000002,
              0.189,
              0.233,
              0.278,
              0.322,
              0.36700000000000005,
              0.433
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "panelStat",
            "stat": "ultimateEnergyGainEfficiency",
            "value": [
              0.18,
              0.21600000000000003,
              0.252,
              0.28800000000000003,
              0.324,
              0.36,
              0.396,
              0.43200000000000005,
              0.504
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "golden-age",
    "iconPath": "/weapons/polearm/wpn_polearm_0016.webp",
    "rarity": 6,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      49,
      142,
      240,
      338,
      436,
      485
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "will",
            "operation": "flat",
            "value": [
              20,
              36,
              52,
              68,
              84,
              100,
              116,
              132,
              156
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": "electric",
            "value": [
              0.06,
              0.07200000000000001,
              0.084,
              0.096,
              0.10800000000000001,
              0.12,
              0.132,
              0.14400000000000002,
              0.168
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "jet",
    "iconPath": "/weapons/polearm/wpn_polearm_0011.webp",
    "rarity": 6,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      51,
      146,
      247,
      348,
      449,
      500
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "main",
            "operation": "flat",
            "value": [
              17,
              30,
              44,
              57,
              71,
              85,
              98,
              112,
              132
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "panelStat",
            "stat": "attackPercent",
            "value": [
              0.05,
              0.09,
              0.13,
              0.17,
              0.21,
              0.25,
              0.29,
              0.33,
              0.39
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": [
              "heat",
              "cryo",
              "electric",
              "nature"
            ],
            "value": [
              0.12,
              0.14400000000000002,
              0.168,
              0.192,
              0.21600000000000003,
              0.24,
              0.264,
              0.28800000000000003,
              0.336
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "mountain-bearer",
    "iconPath": "/weapons/polearm/wpn_polearm_0012.webp",
    "rarity": 6,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      51,
      146,
      247,
      348,
      449,
      500
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "agility",
            "operation": "flat",
            "value": [
              20,
              36,
              52,
              68,
              84,
              100,
              116,
              132,
              156
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": "physical",
            "value": [
              0.055999999999999994,
              0.1,
              0.14400000000000002,
              0.189,
              0.233,
              0.278,
              0.322,
              0.36700000000000005,
              0.433
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9
      }
    ]
  },
  {
    "slug": "valiant",
    "iconPath": "/weapons/polearm/wpn_polearm_0010.webp",
    "rarity": 6,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      50,
      145,
      245,
      345,
      445,
      495
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "agility",
            "operation": "flat",
            "value": [
              20,
              36,
              52,
              68,
              84,
              100,
              116,
              132,
              156
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "damageBonus",
            "damageTypes": "physical",
            "value": [
              0.055999999999999994,
              0.1,
              0.14400000000000002,
              0.189,
              0.233,
              0.278,
              0.322,
              0.36700000000000005,
              0.433
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "panelStat",
            "stat": "attackPercent",
            "value": [
              0.1,
              0.12,
              0.14,
              0.16,
              0.18,
              0.2,
              0.22,
              0.24,
              0.28
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "bedazzling-night-debut",
    "assetSlug": "bedazzling-night-debut",
    "iconPath": "/weapons/polearm/wpn_polearm_0014.webp",
    "rarity": 6,
    "weaponType": "polearm",
    "baseAttackAtLevelNodes": [
      51,
      146,
      247,
      348,
      449,
      500
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "will",
            "operation": "flat",
            "value": [
              20,
              36,
              52,
              68,
              84,
              100,
              116,
              132,
              156
            ]
          }
        ]
      },
      {
        "key": "skill2",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "staticHealingIncrease",
            "target": "output",
            "value": [
              0.05952381,
              0.10714286,
              0.15476191,
              0.20238096,
              0.25,
              0.29761904,
              0.3452381,
              0.39285713,
              0.4642857
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "main",
            "operation": "percent",
            "value": [
              0.16,
              0.192,
              0.224,
              0.256,
              0.288,
              0.32,
              0.352,
              0.384,
              0.448
            ]
          }
        ],
        "eventHandlers": [
          {
            "key": "heal-teammate-attack-up",
            "event": {
              "kind": "operatorHealed",
              "role": "source"
            },
            "condition": {
              "kind": "all",
              "conditions": [
                {
                  "kind": "eventHealTagsMatch",
                  "match": "hasAny",
                  "tags": [
                    "Skill/Character/Common/Heal/NormalSkillHeal",
                    "Skill/Character/Common/Heal/ComboSkillHeal",
                    "Skill/Character/Common/Heal/UltimateSkillHeal"
                  ]
                },
                {
                  "kind": "eventSourceTargetMatch",
                  "operator": "notEqual"
                },
                {
                  "kind": "not",
                  "condition": {
                    "kind": "timedMarkerPresent",
                    "target": "eventTarget",
                    "markerId": "sk_wpn_lance_0014"
                  }
                }
              ]
            },
            "blackboard": {
              "atk_up": [
                0.035,
                0.042,
                0.049,
                0.056,
                0.063,
                0.07,
                0.077,
                0.084,
                0.098
              ],
              "duration2": 20,
              "max_stack": 4
            },
            "sequence": {
              "steps": [
                {
                  "kind": "applyBuff",
                  "parameters": {
                    "buffId": "buff_wpn_lance_0014_damageup",
                    "target": "eventTarget",
                    "definition": {
                      "stackingType": "highPriorityWithMaxStack",
                      "priority": {
                        "blackboardKey": "atk_up"
                      },
                      "maxStackCount": {
                        "blackboardKey": "max_stack"
                      },
                      "durationSeconds": {
                        "blackboardKey": "duration2"
                      },
                      "blackboard": {
                        "atk_up": 0,
                        "duration2": 20,
                        "max_stack": 4
                      },
                      "attributeModifiers": [
                        {
                          "attribute": "Atk",
                          "slot": "baseMultiplier",
                          "value": {
                            "blackboardKey": "atk_up"
                          }
                        }
                      ],
                      "presentation": {
                        "visible": true,
                        "iconId": "icon_battle_buff_atk_up",
                        "iconPath": "/icons/icon_battle_buff_atk_up.webp",
                        "showInHeadBarCommon": false,
                        "showInHeadBarAttached": false,
                        "showInSquadIcon": true,
                        "onlyShowForMainCharacter": false,
                        "iconStyleInSquad": "LifeTime",
                        "abnormalColorType": "Physical",
                        "orderPriority": {
                          "useDirectoryValue": false,
                          "value": 0,
                          "category": "CommonCharBuff"
                        }
                      }
                    },
                    "blackboardAssignments": {
                      "atk_up": {
                        "kind": "blackboard",
                        "key": "atk_up"
                      },
                      "duration2": {
                        "kind": "blackboard",
                        "key": "duration2"
                      },
                      "max_stack": {
                        "kind": "blackboard",
                        "key": "max_stack"
                      }
                    }
                  }
                },
                {
                  "kind": "createTimedMarker",
                  "parameters": {
                    "target": "eventTarget",
                    "markerId": "sk_wpn_lance_0014",
                    "durationSeconds": {
                      "kind": "constant",
                      "value": 0.1
                    },
                    "autoFinishByAction": false
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  }
] as const satisfies readonly WeaponDefinition[];
