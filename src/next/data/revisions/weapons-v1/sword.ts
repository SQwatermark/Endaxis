/** 083f95c2 的 v1 武器兼容快照；仅供旧存档迁移，不随当前生成结果更新。 */
import type { WeaponDefinition } from '../../../core/game-data/equipmentDefinition';

// prettier-ignore
export default [
  {
    "slug": "tarr-11",
    "iconPath": "/weapons/sword/wpn_sword_0003.webp",
    "rarity": 3,
    "weaponType": "sword",
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
    "slug": "prominent-edge",
    "iconPath": "/weapons/sword/wpn_sword_0008.webp",
    "rarity": 4,
    "weaponType": "sword",
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
            "kind": "damageBonus",
            "damageTypes": "physical",
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
    "slug": "wave-tide",
    "iconPath": "/weapons/sword/wpn_sword_0009.webp",
    "rarity": 4,
    "weaponType": "sword",
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
            "attribute": "intellect",
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
    "slug": "aspirant",
    "iconPath": "/weapons/sword/wpn_sword_0015.webp",
    "rarity": 5,
    "weaponType": "sword",
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
            "attribute": "agility",
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
            "skillTypes": "ultimate",
            "value": [
              0.16,
              0.192,
              0.22399999999999998,
              0.256,
              0.28800000000000003,
              0.32,
              0.35200000000000004,
              0.384,
              0.44799999999999995
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "finchaser-30",
    "iconPath": "/weapons/sword/wpn_sword_0020.webp",
    "rarity": 5,
    "weaponType": "sword",
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
            "kind": "damageBonus",
            "damageTypes": "cryo",
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
            "kind": "panelStat",
            "stat": "attackPercent",
            "value": [
              0.05,
              0.06,
              0.07,
              0.08,
              0.09,
              0.1,
              0.11,
              0.12,
              0.14
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "fortmaker",
    "iconPath": "/weapons/sword/wpn_sword_0007.webp",
    "rarity": 5,
    "weaponType": "sword",
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
            "attribute": "intellect",
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
            "stat": "attackPercent",
            "value": [
              0.05,
              0.06,
              0.07,
              0.08,
              0.09,
              0.1,
              0.11,
              0.12,
              0.14
            ]
          },
          {
            "kind": "panelStat",
            "stat": "artsIntensity",
            "value": [
              25,
              30,
              35,
              40,
              45,
              50,
              55,
              60,
              70
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "obj-edge-of-lightness",
    "iconPath": "/weapons/sword/wpn_sword_0019.webp",
    "rarity": 5,
    "weaponType": "sword",
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
            "attribute": "agility",
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
            "stat": "attackPercent",
            "value": [
              0.04,
              0.07200000000000001,
              0.10400000000000001,
              0.136,
              0.168,
              0.2,
              0.23199999999999998,
              0.264,
              0.312
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
            "attribute": "secondary",
            "operation": "percent",
            "value": [
              0.05,
              0.06,
              0.07,
              0.08,
              0.09,
              0.1,
              0.11,
              0.12,
              0.14
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "sundering-steel",
    "iconPath": "/weapons/sword/wpn_sword_0005.webp",
    "rarity": 5,
    "weaponType": "sword",
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
            "attribute": "agility",
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
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "panelStat",
            "stat": "attackPercent",
            "value": [
              0.05,
              0.06,
              0.07,
              0.08,
              0.09,
              0.1,
              0.11,
              0.12,
              0.14
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "twelve-questions",
    "iconPath": "/weapons/sword/wpn_sword_0018.webp",
    "rarity": 5,
    "weaponType": "sword",
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
            "attribute": "agility",
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
            "stat": "attackPercent",
            "value": [
              0.04,
              0.07200000000000001,
              0.10400000000000001,
              0.136,
              0.168,
              0.2,
              0.23199999999999998,
              0.264,
              0.312
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
            "attribute": "secondary",
            "operation": "percent",
            "value": [
              0.05,
              0.06,
              0.07,
              0.08,
              0.09,
              0.1,
              0.11,
              0.12,
              0.14
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "eminent-repute",
    "iconPath": "/weapons/sword/wpn_sword_0013.webp",
    "rarity": 6,
    "weaponType": "sword",
    "baseAttackAtLevelNodes": [
      50,
      144,
      243,
      342,
      441,
      490
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
    "slug": "farsight",
    "iconPath": "/weapons/sword/wpn_sword_0026.webp",
    "rarity": 6,
    "weaponType": "sword",
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
            "stat": "artsIntensity",
            "value": [
              10,
              18,
              26,
              34,
              42,
              50,
              58,
              66,
              78
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
    "slug": "forgeborn-scathe",
    "iconPath": "/weapons/sword/wpn_sword_0006.webp",
    "rarity": 6,
    "weaponType": "sword",
    "baseAttackAtLevelNodes": [
      52,
      149,
      252,
      355,
      458,
      510
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "intellect",
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
            "damageTypes": "heat",
            "value": [
              0.16,
              0.192,
              0.22399999999999998,
              0.256,
              0.28800000000000003,
              0.32,
              0.35200000000000004,
              0.384,
              0.44799999999999995
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "glorious-memory",
    "iconPath": "/weapons/sword/wpn_sword_0017.webp",
    "rarity": 6,
    "weaponType": "sword",
    "baseAttackAtLevelNodes": [
      50,
      144,
      243,
      342,
      441,
      490
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
            "stat": "criticalRate",
            "value": [
              0.025,
              0.045,
              0.065,
              0.085,
              0.105,
              0.125,
              0.145,
              0.165,
              0.195
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
    "slug": "grand-vision",
    "iconPath": "/weapons/sword/wpn_sword_0021.webp",
    "rarity": 6,
    "weaponType": "sword",
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
            "kind": "panelStat",
            "stat": "artsIntensity",
            "value": [
              30,
              36,
              42,
              48,
              54,
              60,
              66,
              72,
              84
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "lupine-scarlet",
    "iconPath": "/weapons/sword/wpn_sword_0022.webp",
    "rarity": 6,
    "weaponType": "sword",
    "baseAttackAtLevelNodes": [
      51,
      148,
      250,
      352,
      454,
      505
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
            "stat": "criticalRate",
            "value": [
              0.025,
              0.045,
              0.065,
              0.085,
              0.105,
              0.125,
              0.145,
              0.165,
              0.195
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
              0.16,
              0.192,
              0.22399999999999998,
              0.256,
              0.28800000000000003,
              0.32,
              0.35200000000000004,
              0.384,
              0.44799999999999995
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "never-rest",
    "iconPath": "/weapons/sword/wpn_sword_0016.webp",
    "rarity": 6,
    "weaponType": "sword",
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
            "damageTypes": "physical",
            "value": [
              0.16,
              0.192,
              0.22399999999999998,
              0.256,
              0.28800000000000003,
              0.32,
              0.35200000000000004,
              0.384,
              0.44799999999999995
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "rapid-ascent",
    "iconPath": "/weapons/sword/wpn_sword_0011.webp",
    "rarity": 6,
    "weaponType": "sword",
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
            "stat": "criticalRate",
            "value": [
              0.025,
              0.045,
              0.065,
              0.085,
              0.105,
              0.125,
              0.145,
              0.165,
              0.195
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
            "damageTypes": "physical",
            "skillTypes": [
              "battleSkill",
              "ultimate"
            ],
            "value": [
              0.15,
              0.18,
              0.21,
              0.24,
              0.27,
              0.3,
              0.33,
              0.36,
              0.42
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "thermite-cutter",
    "iconPath": "/weapons/sword/wpn_sword_0012.webp",
    "rarity": 6,
    "weaponType": "sword",
    "baseAttackAtLevelNodes": [
      50,
      144,
      243,
      342,
      441,
      490
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
    "slug": "umbral-torch",
    "iconPath": "/weapons/sword/wpn_sword_0010.webp",
    "rarity": 6,
    "weaponType": "sword",
    "baseAttackAtLevelNodes": [
      50,
      144,
      243,
      342,
      441,
      490
    ],
    "traits": [
      {
        "key": "skill1",
        "levelCount": 9,
        "modifiers": [
          {
            "kind": "attribute",
            "attribute": "intellect",
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
            "stat": "attackPercent",
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
    "slug": "white-night-nova",
    "iconPath": "/weapons/sword/wpn_sword_0014.webp",
    "rarity": 6,
    "weaponType": "sword",
    "baseAttackAtLevelNodes": [
      51,
      148,
      250,
      352,
      454,
      505
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
            "stat": "artsIntensity",
            "value": [
              10,
              18,
              26,
              34,
              42,
              50,
              58,
              66,
              78
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
  }
] as const satisfies readonly WeaponDefinition[];
