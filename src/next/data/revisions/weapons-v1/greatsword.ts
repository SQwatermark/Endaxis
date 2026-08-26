/** 083f95c2 的 v1 武器兼容快照；仅供旧存档迁移，不随当前生成结果更新。 */
import type { WeaponDefinition } from '../../../core/game-data/equipmentDefinition';

// prettier-ignore
export default [
  {
    "slug": "darhoff-7",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0010.webp",
    "rarity": 3,
    "weaponType": "greatsword",
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
    "slug": "industry-01",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0003.webp",
    "rarity": 4,
    "weaponType": "greatsword",
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
            "attribute": "strength",
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
    "slug": "quencher",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0009.webp",
    "rarity": 4,
    "weaponType": "greatsword",
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
            "kind": "panelStat",
            "stat": "healthPercent",
            "value": [
              0.06,
              0.10800000000000001,
              0.156,
              0.204,
              0.252,
              0.3,
              0.348,
              0.396,
              0.46799999999999997
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
    "slug": "ancient-canal",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0014.webp",
    "rarity": 5,
    "weaponType": "greatsword",
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
            "stat": "artsIntensity",
            "value": [
              8,
              14,
              20,
              27,
              33,
              40,
              46,
              52,
              62
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
              10,
              12,
              14,
              16,
              18,
              20,
              22,
              24,
              28
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "finishing-call",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0012.webp",
    "rarity": 5,
    "weaponType": "greatsword",
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
            "stat": "healthPercent",
            "value": [
              0.08,
              0.14400000000000002,
              0.20800000000000002,
              0.272,
              0.336,
              0.4,
              0.46399999999999997,
              0.528,
              0.624
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
    "slug": "obj-heavy-burden",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0015.webp",
    "rarity": 5,
    "weaponType": "greatsword",
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
            "stat": "healthPercent",
            "value": [
              0.08,
              0.14400000000000002,
              0.20800000000000002,
              0.272,
              0.336,
              0.4,
              0.46399999999999997,
              0.528,
              0.624
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
    "slug": "seeker-of-dark-lung",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0011.webp",
    "rarity": 5,
    "weaponType": "greatsword",
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
            "kind": "attribute",
            "attribute": "main",
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
    "slug": "amaranthine-tassel",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0017.webp",
    "rarity": 6,
    "weaponType": "greatsword",
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
            "attribute": "strength",
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
    "slug": "exemplar",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0004.webp",
    "rarity": 6,
    "weaponType": "greatsword",
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
            "damageTypes": "physical",
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
    "slug": "former-finery",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0006.webp",
    "rarity": 6,
    "weaponType": "greatsword",
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
            "stat": "healthPercent",
            "value": [
              0.1,
              0.18,
              0.26,
              0.34,
              0.42,
              0.5,
              0.58,
              0.66,
              0.78
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "khravengger",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0013.webp",
    "rarity": 6,
    "weaponType": "greatsword",
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
            "attribute": "strength",
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
            "damageTypes": [
              "physical",
              "true",
              "heat",
              "electric",
              "cryo",
              "nature",
              "ether"
            ],
            "skillTypes": [
              "battleSkill",
              "comboSkill",
              "ultimate"
            ],
            "value": [
              0.2,
              0.24,
              0.28,
              0.32,
              0.36,
              0.4,
              0.44,
              0.48,
              0.56
            ]
          }
        ]
      }
    ]
  },
  {
    "slug": "phantom-pain",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0016.webp",
    "rarity": 6,
    "weaponType": "greatsword",
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
            "attribute": "strength",
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
            "damageTypes": "physical",
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
    "slug": "sundered-prince",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0008.webp",
    "rarity": 6,
    "weaponType": "greatsword",
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
            "attribute": "strength",
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
        "levelCount": 9
      }
    ]
  },
  {
    "slug": "thunderberge",
    "iconPath": "/weapons/greatsword/wpn_greatsword_0007.webp",
    "rarity": 6,
    "weaponType": "greatsword",
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
            "attribute": "strength",
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
            "stat": "healthPercent",
            "value": [
              0.1,
              0.18,
              0.26,
              0.34,
              0.42,
              0.5,
              0.58,
              0.66,
              0.78
            ]
          }
        ]
      },
      {
        "key": "skill3",
        "levelCount": 9
      }
    ]
  }
] as const satisfies readonly WeaponDefinition[];
