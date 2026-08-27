/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type { OperatorDefinition, OperatorBuffDefinitions } from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const commonBuffDefinitions = {
  "buff_common_affixes_vulnerable_pulse": {
    "stackingType": "unlimited",
    "priority": {
      "blackboardKey": "rate"
    },
    "maxStackCount": 0,
    "durationSeconds": {
      "blackboardKey": "duration"
    },
    "applyTagIds": [
      -881002460,
      1427729990,
      -1640994543
    ],
    "extendTagIds": [],
    "blackboard": {
      "child_buff_id": "buff_common_affixes_vulnerable_pulse_default_child",
      "duration": 0.8,
      "rate": 0.2
    },
    "attributeModifiers": [
      {
        "attribute": "electricVulnerabilityIncrease",
        "slot": "baseAddition",
        "value": {
          "blackboardKey": "rate"
        }
      }
    ],
    "lifecycleSequences": {
      "enable": {
        "steps": [
          {
            "kind": "applyBuff",
            "parameters": {
              "buffId": {
                "blackboardKey": "child_buff_id"
              },
              "target": "buffOwner",
              "source": "buffOwner",
              "inheritSourceSkillCastInfo": true,
              "finishByAction": true,
              "asChildBuff": true,
              "blackboardAssignments": {
                "rate": {
                  "kind": "blackboard",
                  "key": "rate"
                },
                "duration": {
                  "kind": "blackboard",
                  "key": "duration"
                }
              }
            }
          }
        ]
      }
    }
  },
  "buff_common_affixes_vulnerable_pulse_default_child": {
    "stackingType": "unlimited",
    "priority": {
      "blackboardKey": "rate"
    },
    "maxStackCount": 0,
    "durationSeconds": {
      "blackboardKey": "duration"
    },
    "presentation": {
      "visible": true,
      "iconId": "icon_battle_affix_pulse_vulnerable",
      "iconPath": "/icons/icon_battle_affix_pulse_vulnerable.webp",
      "showInHeadBarCommon": true,
      "showInHeadBarAttached": false,
      "showInSquadIcon": true,
      "onlyShowForMainCharacter": false,
      "iconStyleInSquad": "LifeTime",
      "abnormalColorType": "Physical",
      "orderPriority": {
        "useDirectoryValue": false,
        "value": 0,
        "category": "KeywordDebuff"
      }
    },
    "applyTagIds": [],
    "extendTagIds": [],
    "blackboard": {
      "duration": 0,
      "rate": 0.2
    },
    "attributeModifiers": []
  },
  "buff_common_damage_immune_ult_skill": {
    "stackingType": "unlimited",
    "priority": 0,
    "maxStackCount": 0,
    "durationSeconds": {
      "blackboardKey": "duration"
    },
    "applyTagIds": [
      782082172,
      -104052028,
      -886962248
    ],
    "extendTagIds": [],
    "blackboard": {
      "duration": 9999
    },
    "attributeModifiers": []
  },
  "buff_common_full_immune_medium": {
    "stackingType": "unlimited",
    "priority": 0,
    "maxStackCount": 0,
    "durationSeconds": {
      "blackboardKey": "duration"
    },
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
    "blackboard": {
      "duration": 9999
    },
    "attributeModifiers": []
  },
  "buff_common_power_attack_disable_cast_skill": {
    "stackingType": "unlimited",
    "priority": 0,
    "maxStackCount": 0,
    "applyTagIds": [
      -1601691447,
      817018340,
      -1486085048,
      -496376350,
      2002680355
    ],
    "extendTagIds": [],
    "blackboard": {},
    "attributeModifiers": []
  }
} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
  "slug": "avywenna",
  "gameId": "AVYWENNA",
  "rarity": 5,
  "weaponType": "polearm",
  "element": "electric",
  "role": "striker",
  "mainAttribute": "will",
  "secondaryAttribute": "agility",
  "attributes": {
    "strength": [
      12,
      33,
      54,
      75,
      96,
      107
    ],
    "agility": [
      10,
      31,
      52,
      74,
      95,
      106
    ],
    "intellect": [
      14,
      34,
      56,
      78,
      99,
      110
    ],
    "will": [
      15,
      43,
      73,
      103,
      133,
      148
    ],
    "baseAttack": [
      30,
      90,
      153,
      217,
      280,
      312
    ],
    "baseHealth": [
      500,
      1566,
      2689,
      3811,
      4934,
      5495
    ]
  },
  "skillGroups": [
    {
      "key": "basicAttack",
      "skillType": "basicAttack",
      "levelSource": "basicAttack",
      "skills": [
        {
          "key": "basicAttack1",
          "sourceSkillId": "chr_0012_avywen_attack1",
          "blackboard": {
            "atb": 0,
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
            ]
          },
          "timelineBlockFrames": 8,
          "costFrame": 9,
          "scheduledSequences": [
            {
              "startFrame": 7,
              "endFrame": 8,
              "sequence": {
                "steps": [
                  {
                    "kind": "dealDamage",
                    "parameters": {
                      "damageType": "physical",
                      "attackScale": {
                        "kind": "blackboard",
                        "key": "atk_scale"
                      },
                      "tags": [
                        "normalAttack"
                      ]
                    },
                    "key": "chr_0012_avywen_attack1:/scheduledSequences/0/sequence/steps/0"
                  },
                  {
                    "kind": "conditional",
                    "parameters": {
                      "condition": {
                        "kind": "casterControlled"
                      },
                      "alwaysNext": true
                    },
                    "whenTrue": {
                      "steps": [
                        {
                          "kind": "startTimeDilation",
                          "parameters": {
                            "scope": "entity",
                            "durationSeconds": {
                              "kind": "constant",
                              "value": 0.06
                            },
                            "slot": 1464849466,
                            "priority": 10,
                            "curve": {
                              "kind": "named",
                              "key": "char_normal_attack"
                            },
                            "finishByAction": false,
                            "targets": [
                              "enemy",
                              "caster"
                            ]
                          }
                        },
                        {
                          "kind": "conditional",
                          "parameters": {
                            "condition": {
                              "kind": "casterControlled"
                            }
                          },
                          "whenTrue": {
                            "steps": [
                              {
                                "kind": "changeResourceByActionValue",
                                "parameters": {
                                  "resource": "sp",
                                  "amount": {
                                    "kind": "blackboard",
                                    "key": "atb"
                                  },
                                  "coefficient": {
                                    "kind": "constant",
                                    "value": 1
                                  },
                                  "recipient": "team",
                                  "spGainKind": "gain",
                                  "spGainSource": "normalAttack"
                                }
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
          ]
        },
        {
          "key": "basicAttack2",
          "sourceSkillId": "chr_0012_avywen_attack2",
          "blackboard": {
            "atb": 0,
            "atk_scale": [
              0.22,
              0.24,
              0.26,
              0.28,
              0.3,
              0.32,
              0.34,
              0.37,
              0.39,
              0.41,
              0.45,
              0.48
            ]
          },
          "timelineBlockFrames": 14,
          "costFrame": 8,
          "scheduledSequences": [
            {
              "startFrame": 7,
              "endFrame": 8,
              "sequence": {
                "steps": [
                  {
                    "kind": "dealDamage",
                    "parameters": {
                      "damageType": "physical",
                      "attackScale": {
                        "kind": "blackboard",
                        "key": "atk_scale"
                      },
                      "tags": [
                        "normalAttack"
                      ]
                    },
                    "key": "chr_0012_avywen_attack2:/scheduledSequences/0/sequence/steps/0"
                  },
                  {
                    "kind": "conditional",
                    "parameters": {
                      "condition": {
                        "kind": "casterControlled"
                      },
                      "alwaysNext": true
                    },
                    "whenTrue": {
                      "steps": [
                        {
                          "kind": "startTimeDilation",
                          "parameters": {
                            "scope": "entity",
                            "durationSeconds": {
                              "kind": "constant",
                              "value": 0.07
                            },
                            "slot": 1464849466,
                            "priority": 10,
                            "curve": {
                              "kind": "named",
                              "key": "char_normal_attack"
                            },
                            "finishByAction": false,
                            "targets": [
                              "enemy",
                              "caster"
                            ]
                          }
                        },
                        {
                          "kind": "conditional",
                          "parameters": {
                            "condition": {
                              "kind": "casterControlled"
                            }
                          },
                          "whenTrue": {
                            "steps": [
                              {
                                "kind": "changeResourceByActionValue",
                                "parameters": {
                                  "resource": "sp",
                                  "amount": {
                                    "kind": "blackboard",
                                    "key": "atb"
                                  },
                                  "coefficient": {
                                    "kind": "constant",
                                    "value": 1
                                  },
                                  "recipient": "team",
                                  "spGainKind": "gain",
                                  "spGainSource": "normalAttack"
                                }
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
          ]
        },
        {
          "key": "basicAttack3",
          "sourceSkillId": "chr_0012_avywen_attack3",
          "blackboard": {
            "atb": 0,
            "atk_scale": [
              0.21,
              0.23,
              0.25,
              0.27,
              0.29,
              0.31,
              0.33,
              0.35,
              0.37,
              0.39,
              0.43,
              0.46
            ]
          },
          "timelineBlockFrames": 10,
          "costFrame": 12,
          "scheduledSequences": [
            {
              "startFrame": 7,
              "endFrame": 8,
              "sequence": {
                "steps": [
                  {
                    "kind": "dealDamage",
                    "parameters": {
                      "damageType": "physical",
                      "attackScale": {
                        "kind": "blackboard",
                        "key": "atk_scale"
                      },
                      "tags": [
                        "normalAttack"
                      ]
                    },
                    "key": "chr_0012_avywen_attack3:/scheduledSequences/0/sequence/steps/0"
                  },
                  {
                    "kind": "conditional",
                    "parameters": {
                      "condition": {
                        "kind": "casterControlled"
                      },
                      "alwaysNext": true
                    },
                    "whenTrue": {
                      "steps": [
                        {
                          "kind": "conditional",
                          "parameters": {
                            "condition": {
                              "kind": "casterControlled"
                            }
                          },
                          "whenTrue": {
                            "steps": [
                              {
                                "kind": "changeResourceByActionValue",
                                "parameters": {
                                  "resource": "sp",
                                  "amount": {
                                    "kind": "blackboard",
                                    "key": "atb"
                                  },
                                  "coefficient": {
                                    "kind": "constant",
                                    "value": 1
                                  },
                                  "recipient": "team",
                                  "spGainKind": "gain",
                                  "spGainSource": "normalAttack"
                                }
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
          ]
        },
        {
          "key": "basicAttack4",
          "sourceSkillId": "chr_0012_avywen_attack4",
          "blackboard": {
            "atb": 0,
            "atk_scale": [
              0.1,
              0.11,
              0.12,
              0.13,
              0.14,
              0.15,
              0.16,
              0.17,
              0.18,
              0.19,
              0.21,
              0.23
            ],
            "atk_scale_2": [
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
          "timelineBlockFrames": 22,
          "costFrame": 8,
          "scheduledSequences": [
            {
              "startFrame": 5,
              "endFrame": 6,
              "sequence": {
                "steps": [
                  {
                    "kind": "dealDamage",
                    "parameters": {
                      "damageType": "physical",
                      "attackScale": {
                        "kind": "blackboard",
                        "key": "atk_scale"
                      },
                      "tags": [
                        "normalAttack"
                      ]
                    },
                    "key": "chr_0012_avywen_attack4:/scheduledSequences/0/sequence/steps/0"
                  },
                  {
                    "kind": "conditional",
                    "parameters": {
                      "condition": {
                        "kind": "casterControlled"
                      },
                      "alwaysNext": true
                    },
                    "whenTrue": {
                      "steps": [
                        {
                          "kind": "startTimeDilation",
                          "parameters": {
                            "scope": "entity",
                            "durationSeconds": {
                              "kind": "constant",
                              "value": 0.05
                            },
                            "slot": 1464849466,
                            "priority": 10,
                            "curve": {
                              "kind": "named",
                              "key": "char_normal_attack"
                            },
                            "finishByAction": false,
                            "targets": [
                              "enemy",
                              "caster"
                            ]
                          }
                        },
                        {
                          "kind": "conditional",
                          "parameters": {
                            "condition": {
                              "kind": "casterControlled"
                            }
                          },
                          "whenTrue": {
                            "steps": [
                              {
                                "kind": "changeResourceByActionValue",
                                "parameters": {
                                  "resource": "sp",
                                  "amount": {
                                    "kind": "blackboard",
                                    "key": "atb"
                                  },
                                  "coefficient": {
                                    "kind": "constant",
                                    "value": 0.5
                                  },
                                  "recipient": "team",
                                  "spGainKind": "gain",
                                  "spGainSource": "normalAttack"
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "startFrame": 18,
              "endFrame": 19,
              "sequence": {
                "steps": [
                  {
                    "kind": "dealDamage",
                    "parameters": {
                      "damageType": "physical",
                      "attackScale": {
                        "kind": "blackboard",
                        "key": "atk_scale_2"
                      },
                      "tags": [
                        "normalAttack"
                      ]
                    },
                    "key": "chr_0012_avywen_attack4:/scheduledSequences/1/sequence/steps/0"
                  },
                  {
                    "kind": "conditional",
                    "parameters": {
                      "condition": {
                        "kind": "casterControlled"
                      },
                      "alwaysNext": true
                    },
                    "whenTrue": {
                      "steps": [
                        {
                          "kind": "startTimeDilation",
                          "parameters": {
                            "scope": "entity",
                            "durationSeconds": {
                              "kind": "constant",
                              "value": 0.22
                            },
                            "slot": 1464849466,
                            "priority": 10,
                            "curve": {
                              "kind": "named",
                              "key": "char_hard_stop"
                            },
                            "finishByAction": false,
                            "targets": [
                              "enemy",
                              "caster"
                            ]
                          }
                        },
                        {
                          "kind": "conditional",
                          "parameters": {
                            "condition": {
                              "kind": "casterControlled"
                            }
                          },
                          "whenTrue": {
                            "steps": [
                              {
                                "kind": "changeResourceByActionValue",
                                "parameters": {
                                  "resource": "sp",
                                  "amount": {
                                    "kind": "blackboard",
                                    "key": "atb"
                                  },
                                  "coefficient": {
                                    "kind": "constant",
                                    "value": 0.5
                                  },
                                  "recipient": "team",
                                  "spGainKind": "gain",
                                  "spGainSource": "normalAttack"
                                }
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
          ]
        },
        {
          "key": "basicAttack5",
          "sourceSkillId": "chr_0012_avywen_attack5",
          "blackboard": {
            "atb": 19,
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
            "poise": 17
          },
          "timelineBlockFrames": 45,
          "costFrame": 12,
          "scheduledSequences": [
            {
              "startFrame": 24,
              "endFrame": 25,
              "sequence": {
                "steps": [
                  {
                    "kind": "dealDamage",
                    "parameters": {
                      "damageType": "physical",
                      "attackScale": {
                        "kind": "blackboard",
                        "key": "atk_scale"
                      },
                      "tags": [
                        "normalAttack",
                        "normalAttackLastCombo"
                      ],
                      "stagger": {
                        "kind": "blackboard",
                        "key": "poise"
                      },
                      "staggerOnlyWhenCasterControlled": true
                    },
                    "key": "chr_0012_avywen_attack5:/scheduledSequences/0/sequence/steps/0"
                  },
                  {
                    "kind": "conditional",
                    "parameters": {
                      "condition": {
                        "kind": "casterControlled"
                      },
                      "alwaysNext": true
                    },
                    "whenTrue": {
                      "steps": [
                        {
                          "kind": "startTimeDilation",
                          "parameters": {
                            "scope": "entity",
                            "durationSeconds": {
                              "kind": "constant",
                              "value": 0.3
                            },
                            "slot": 1464849466,
                            "priority": 10,
                            "curve": {
                              "kind": "named",
                              "key": "char_normal_attack"
                            },
                            "finishByAction": false,
                            "targets": [
                              "enemy",
                              "caster"
                            ]
                          }
                        },
                        {
                          "kind": "conditional",
                          "parameters": {
                            "condition": {
                              "kind": "actionValueCompare",
                              "left": {
                                "kind": "constant",
                                "value": 1
                              },
                              "operator": "greaterOrEqual",
                              "right": {
                                "kind": "constant",
                                "value": 1
                              }
                            },
                            "alwaysNext": true
                          },
                          "whenTrue": {
                            "steps": [
                              {
                                "kind": "changeResourceByActionValue",
                                "parameters": {
                                  "resource": "sp",
                                  "amount": {
                                    "kind": "blackboard",
                                    "key": "atb"
                                  },
                                  "coefficient": {
                                    "kind": "constant",
                                    "value": 1
                                  },
                                  "recipient": "team",
                                  "spGainKind": "gain",
                                  "spGainSource": "normalAttack"
                                }
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
          ]
        }
      ]
    },
    {
      "key": "finisher",
      "skillType": "finisher",
      "levelSource": "basicAttack",
      "skills": {
        "key": "finisher",
        "sourceSkillId": "chr_0012_avywen_power_attack",
        "blackboard": {
          "atk_scale": [
            4,
            4.4,
            4.8,
            5.2,
            5.6,
            6,
            6.4,
            6.8,
            7.2,
            7.7,
            8.3,
            9
          ]
        },
        "timelineBlockFrames": 29,
        "costFrame": 0,
        "scheduledSequences": [
          {
            "startFrame": 27,
            "endFrame": 28,
            "sequence": {
              "steps": [
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "physical",
                    "attackScale": {
                      "kind": "blackboard",
                      "key": "atk_scale"
                    },
                    "calculation": "breakingAttack",
                    "calculationMultiplier": 0.3,
                    "tags": [
                      "normalAttack",
                      "powerAttack"
                    ]
                  },
                  "key": "chr_0012_avywen_power_attack:/scheduledSequences/0/sequence/steps/0"
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "casterControlled"
                    },
                    "alwaysNext": true
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "gainFinisherSp",
                        "parameters": {
                          "factor": 1,
                          "recipient": "team"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 28,
            "endFrame": 29,
            "sequence": {
              "steps": [
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "physical",
                    "attackScale": {
                      "kind": "blackboard",
                      "key": "atk_scale"
                    },
                    "calculation": "breakingAttack",
                    "calculationMultiplier": 0.2,
                    "tags": [
                      "normalAttack",
                      "powerAttack"
                    ]
                  },
                  "key": "chr_0012_avywen_power_attack:/scheduledSequences/1/sequence/steps/0"
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "casterControlled"
                    },
                    "alwaysNext": true
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "startTimeDilation",
                        "parameters": {
                          "scope": "entity",
                          "durationSeconds": {
                            "kind": "constant",
                            "value": 0.1
                          },
                          "slot": 1464849466,
                          "priority": 10,
                          "curve": {
                            "kind": "named",
                            "key": "char_normal_attack"
                          },
                          "finishByAction": false,
                          "targets": [
                            "enemy",
                            "caster"
                          ]
                        }
                      },
                      {
                        "kind": "changeResourceByActionValue",
                        "parameters": {
                          "resource": "sp",
                          "amount": {
                            "kind": "constant",
                            "value": 0
                          },
                          "coefficient": {
                            "kind": "constant",
                            "value": 1
                          },
                          "recipient": "team",
                          "spGainKind": "gain",
                          "spGainSource": "default"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 29,
            "endFrame": 30,
            "sequence": {
              "steps": [
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "physical",
                    "attackScale": {
                      "kind": "blackboard",
                      "key": "atk_scale"
                    },
                    "calculation": "breakingAttack",
                    "calculationMultiplier": 0.5,
                    "tags": [
                      "normalAttack",
                      "powerAttack"
                    ]
                  },
                  "key": "chr_0012_avywen_power_attack:/scheduledSequences/2/sequence/steps/0"
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "casterControlled"
                    },
                    "alwaysNext": true
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "startTimeDilation",
                        "parameters": {
                          "scope": "entity",
                          "durationSeconds": {
                            "kind": "constant",
                            "value": 0.5
                          },
                          "slot": 1464849466,
                          "priority": 10,
                          "curve": {
                            "kind": "named",
                            "key": "char_normal_attack"
                          },
                          "finishByAction": false,
                          "targets": [
                            "enemy",
                            "caster"
                          ]
                        }
                      },
                      {
                        "kind": "changeResourceByActionValue",
                        "parameters": {
                          "resource": "sp",
                          "amount": {
                            "kind": "constant",
                            "value": 0
                          },
                          "coefficient": {
                            "kind": "constant",
                            "value": 1
                          },
                          "recipient": "team",
                          "spGainKind": "gain",
                          "spGainSource": "default"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 0,
            "endFrame": 44,
            "sequence": {
              "steps": [
                {
                  "kind": "applyBuff",
                  "parameters": {
                    "buffId": "buff_common_full_immune_medium",
                    "target": "caster",
                    "inheritSourceSkillCastInfo": true,
                    "finishByAction": true
                  }
                }
              ]
            }
          },
          {
            "startFrame": 0,
            "endFrame": 29,
            "sequence": {
              "steps": [
                {
                  "kind": "applyBuff",
                  "parameters": {
                    "buffId": "buff_common_power_attack_disable_cast_skill",
                    "target": "caster",
                    "inheritSourceSkillCastInfo": true,
                    "finishByAction": true
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "key": "plungingAttack",
      "skillType": "plungingAttack",
      "levelSource": "basicAttack",
      "skills": {
        "key": "plungingAttack",
        "sourceSkillId": "chr_0012_avywen_plunging_attack_end",
        "blackboard": {
          "atb": 0,
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
        "timelineBlockFrames": 11,
        "costFrame": 0,
        "scheduledSequences": [
          {
            "startFrame": 1,
            "endFrame": 6,
            "sequence": {
              "steps": [
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "physical",
                    "attackScale": {
                      "kind": "blackboard",
                      "key": "atk_scale"
                    },
                    "tags": [
                      "normalAttack",
                      "plungingAttack"
                    ]
                  },
                  "key": "chr_0012_avywen_plunging_attack_end:/scheduledSequences/0/sequence/steps/0"
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "casterControlled"
                    },
                    "alwaysNext": true
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "conditional",
                        "parameters": {
                          "condition": {
                            "kind": "casterControlled"
                          }
                        },
                        "whenTrue": {
                          "steps": [
                            {
                              "kind": "changeResourceByActionValue",
                              "parameters": {
                                "resource": "sp",
                                "amount": {
                                  "kind": "blackboard",
                                  "key": "atb"
                                },
                                "coefficient": {
                                  "kind": "constant",
                                  "value": 1
                                },
                                "recipient": "team",
                                "spGainKind": "gain",
                                "spGainSource": "normalAttack"
                              }
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
        ]
      }
    },
    {
      "key": "battleSkill",
      "skillType": "battleSkill",
      "levelSource": "battleSkill",
      "skills": {
        "key": "battleSkill",
        "sourceSkillId": "chr_0012_avywen_normal_skill",
        "blackboard": {
          "atk_scale": [
            0.67,
            0.73,
            0.8,
            0.87,
            0.93,
            1,
            1.07,
            1.13,
            1.2,
            1.28,
            1.38,
            1.5
          ],
          "atk_scale_lance": [
            0.75,
            0.82,
            0.9,
            0.97,
            1.04,
            1.12,
            1.19,
            1.27,
            1.34,
            1.44,
            1.55,
            1.68
          ],
          "atk_scale_lance_ult": [
            1.92,
            2.11,
            2.3,
            2.5,
            2.69,
            2.88,
            3.07,
            3.26,
            3.46,
            3.7,
            3.98,
            4.32
          ],
          "cam_angle": 0,
          "cam_duration": 0.3,
          "input_angle": 0,
          "lance_count": 0,
          "poise": 5,
          "poise_lance": 5,
          "poise_lance_ult": 10,
          "potential_5_rate": 0,
          "talent0_usp": 0
        },
        "timelineBlockFrames": 34,
        "costFrame": 0,
        "scheduledSequences": [
          {
            "startFrame": 0,
            "endFrame": 3,
            "sequence": {
              "steps": [
                {
                  "kind": "findOwnerSpawnedAbilityEntities",
                  "parameters": {
                    "saveToContextKey": "lances",
                    "abilityEntityIds": [
                      "abilityentity_chr_0012_avywen_combo_skill_lance",
                      "abilityentity_chr_0012_avywen_ultimate_skill"
                    ]
                  }
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "contextTargetCountCompare",
                      "contextKey": "lances",
                      "operator": "greaterOrEqual",
                      "value": 1
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "lance_count",
                          "operation": "assign",
                          "value": {
                            "kind": "constant",
                            "value": 1
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 18,
            "endFrame": 21,
            "sequence": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "constant",
                        "value": 1
                      },
                      "operator": "equal",
                      "right": {
                        "kind": "constant",
                        "value": 1
                      }
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "gainSquadUltimateEnergyFromSkillCost",
                        "parameters": {
                          "coefficient": 1
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 18,
            "endFrame": 21,
            "sequence": {
              "steps": [
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "electric",
                    "attackScale": {
                      "kind": "blackboard",
                      "key": "atk_scale"
                    },
                    "tags": [
                      "normalSkill"
                    ],
                    "features": [
                      "canBreakWeakness"
                    ],
                    "stagger": {
                      "kind": "blackboard",
                      "key": "poise"
                    }
                  },
                  "key": "chr_0012_avywen_normal_skill:/scheduledSequences/2/sequence/steps/0"
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "constant",
                        "value": 1
                      },
                      "operator": "greaterOrEqual",
                      "right": {
                        "kind": "constant",
                        "value": 1
                      }
                    },
                    "alwaysNext": true
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "conditional",
                        "parameters": {
                          "condition": {
                            "kind": "casterControlled"
                          },
                          "alwaysNext": true
                        },
                        "whenTrue": {
                          "steps": [
                            {
                              "kind": "startTimeDilation",
                              "parameters": {
                                "scope": "entity",
                                "durationSeconds": {
                                  "kind": "constant",
                                  "value": 0.15
                                },
                                "slot": 1464849466,
                                "priority": 10,
                                "curve": {
                                  "kind": "named",
                                  "key": "char_hard_stop"
                                },
                                "finishByAction": false,
                                "targets": [
                                  "enemy",
                                  "caster"
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 0,
            "endFrame": 6,
            "sequence": {
              "steps": [
                {
                  "kind": "findOwnerSpawnedAbilityEntities",
                  "parameters": {
                    "saveToContextKey": "lances",
                    "abilityEntityIds": [
                      "abilityentity_chr_0012_avywen_combo_skill_lance",
                      "abilityentity_chr_0012_avywen_ultimate_skill"
                    ]
                  }
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "contextTargetCountCompare",
                      "contextKey": "lances",
                      "operator": "greaterOrEqual",
                      "value": 1
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "lance_count",
                          "operation": "assign",
                          "value": {
                            "kind": "constant",
                            "value": 1
                          }
                        }
                      },
                      {
                        "kind": "forEachContextTarget",
                        "parameters": {
                          "contextKey": "lances"
                        },
                        "body": {
                          "steps": [
                            {
                              "kind": "conditional",
                              "parameters": {
                                "condition": {
                                  "kind": "actionValueCompare",
                                  "left": {
                                    "kind": "constant",
                                    "value": 0
                                  },
                                  "operator": "lessOrEqual",
                                  "right": {
                                    "kind": "constant",
                                    "value": 50
                                  }
                                }
                              },
                              "whenTrue": {
                                "steps": [
                                  {
                                    "kind": "applyBuff",
                                    "parameters": {
                                      "buffId": "buff_chr_0012_avywen_lance_becalled_ready",
                                      "target": "currentAbilityEntity",
                                      "inheritSourceSkillCastInfo": true
                                    }
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
              ]
            }
          },
          {
            "startFrame": 7,
            "endFrame": 10,
            "sequence": {
              "steps": [
                {
                  "kind": "findOwnerSpawnedAbilityEntities",
                  "parameters": {
                    "saveToContextKey": "ComboLances",
                    "abilityEntityIds": [
                      "abilityentity_chr_0012_avywen_combo_skill_lance"
                    ]
                  }
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "contextTargetCountCompare",
                      "contextKey": "ComboLances",
                      "operator": "greaterOrEqual",
                      "value": 1
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "lance_count",
                          "operation": "assign",
                          "value": {
                            "kind": "constant",
                            "value": 1
                          }
                        }
                      },
                      {
                        "kind": "forEachContextTarget",
                        "parameters": {
                          "contextKey": "ComboLances"
                        },
                        "body": {
                          "steps": [
                            {
                              "kind": "conditional",
                              "parameters": {
                                "condition": {
                                  "kind": "actionValueCompare",
                                  "left": {
                                    "kind": "constant",
                                    "value": 0
                                  },
                                  "operator": "lessOrEqual",
                                  "right": {
                                    "kind": "constant",
                                    "value": 50
                                  }
                                }
                              },
                              "whenTrue": {
                                "steps": [
                                  {
                                    "kind": "applyBuff",
                                    "parameters": {
                                      "buffId": "buff_chr_0012_avywen_lance_becalled",
                                      "target": "currentAbilityEntity",
                                      "inheritSourceSkillCastInfo": true
                                    }
                                  },
                                  {
                                    "kind": "withActionBlackboardScope",
                                    "parameters": {
                                      "scopeKey": "SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[9]._sequenceActionData.actionData[3].action.actionData[3]:projectile_chr_0012_avywen_combo_skill_lance_back",
                                      "lifetime": "execution",
                                      "initialValues": {},
                                      "inheritParent": true,
                                      "entityInitialValues": {
                                        "EntityBB_talent0": 0
                                      }
                                    },
                                    "body": {
                                      "steps": [
                                        {
                                          "kind": "withActionBlackboardScope",
                                          "parameters": {
                                            "scopeKey": "SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[9]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_combo_skill_lance_back",
                                            "lifetime": "execution",
                                            "alwaysNext": true,
                                            "initialValues": {
                                              "atk_scale_lance": 3,
                                              "poise_lance": 0,
                                              "potential_5_rate": 0,
                                              "radius": 4,
                                              "talent0_usp": 0
                                            },
                                            "inheritParent": true
                                          },
                                          "body": {
                                            "steps": [
                                              {
                                                "kind": "conditional",
                                                "parameters": {
                                                  "condition": {
                                                    "kind": "actionValueCompare",
                                                    "left": {
                                                      "kind": "constant",
                                                      "value": 1
                                                    },
                                                    "operator": "greaterOrEqual",
                                                    "right": {
                                                      "kind": "constant",
                                                      "value": 1
                                                    }
                                                  }
                                                },
                                                "whenTrue": {
                                                  "steps": [
                                                    {
                                                      "kind": "modifyActionValue",
                                                      "parameters": {
                                                        "key": "EntityBB_talent0",
                                                        "operation": "assign",
                                                        "value": {
                                                          "kind": "blackboard",
                                                          "key": "talent0_usp"
                                                        }
                                                      }
                                                    },
                                                    {
                                                      "kind": "conditional",
                                                      "parameters": {
                                                        "condition": {
                                                          "kind": "all",
                                                          "conditions": [
                                                            {
                                                              "kind": "actionValueCompare",
                                                              "left": {
                                                                "kind": "blackboard",
                                                                "key": "potential_5_rate"
                                                              },
                                                              "operator": "greater",
                                                              "right": {
                                                                "kind": "constant",
                                                                "value": 0
                                                              }
                                                            },
                                                            {
                                                              "kind": "buffStackCompare",
                                                              "target": "enemy",
                                                              "tagQueryType": "hasAny",
                                                              "buffTagIds": [
                                                                -1640994543
                                                              ],
                                                              "operator": "greaterOrEqual",
                                                              "value": {
                                                                "kind": "constant",
                                                                "value": 1
                                                              }
                                                            }
                                                          ]
                                                        },
                                                        "alwaysNext": true
                                                      },
                                                      "whenTrue": {
                                                        "steps": [
                                                          {
                                                            "kind": "modifyActionValue",
                                                            "parameters": {
                                                              "key": "atk_scale_lance",
                                                              "operation": "multiply",
                                                              "value": {
                                                                "kind": "blackboard",
                                                                "key": "potential_5_rate"
                                                              }
                                                            }
                                                          },
                                                          {
                                                            "kind": "dealDamage",
                                                            "parameters": {
                                                              "damageType": "electric",
                                                              "attackScale": {
                                                                "kind": "blackboard",
                                                                "key": "atk_scale_lance"
                                                              },
                                                              "tags": [
                                                                "normalSkill"
                                                              ],
                                                              "features": [
                                                                "canBreakWeakness"
                                                              ],
                                                              "stagger": {
                                                                "kind": "blackboard",
                                                                "key": "poise_lance"
                                                              }
                                                            },
                                                            "key": "chr_0012_avywen_normal_skill:/scheduledSequences/4/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/1/whenTrue/steps/1"
                                                          }
                                                        ]
                                                      },
                                                      "whenFalse": {
                                                        "steps": [
                                                          {
                                                            "kind": "dealDamage",
                                                            "parameters": {
                                                              "damageType": "electric",
                                                              "attackScale": {
                                                                "kind": "blackboard",
                                                                "key": "atk_scale_lance"
                                                              },
                                                              "tags": [
                                                                "normalSkill"
                                                              ],
                                                              "features": [
                                                                "canBreakWeakness"
                                                              ],
                                                              "stagger": {
                                                                "kind": "blackboard",
                                                                "key": "poise_lance"
                                                              }
                                                            },
                                                            "key": "chr_0012_avywen_normal_skill:/scheduledSequences/4/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/1/whenFalse/steps/0"
                                                          }
                                                        ]
                                                      }
                                                    }
                                                  ]
                                                }
                                              }
                                            ]
                                          }
                                        },
                                        {
                                          "kind": "withActionBlackboardScope",
                                          "parameters": {
                                            "scopeKey": "SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[9]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_combo_skill_lance_back_reach",
                                            "lifetime": "execution",
                                            "alwaysNext": true,
                                            "initialValues": {
                                              "atk_scale": 3,
                                              "radius": 4
                                            },
                                            "inheritParent": true
                                          },
                                          "body": {
                                            "steps": [
                                              {
                                                "kind": "conditional",
                                                "parameters": {
                                                  "condition": {
                                                    "kind": "actionValueCompare",
                                                    "left": {
                                                      "kind": "constant",
                                                      "value": 0
                                                    },
                                                    "operator": "equal",
                                                    "right": {
                                                      "kind": "constant",
                                                      "value": 1
                                                    }
                                                  },
                                                  "alwaysNext": true
                                                },
                                                "whenTrue": {
                                                  "steps": [
                                                    {
                                                      "kind": "startTimeDilation",
                                                      "parameters": {
                                                        "scope": "global",
                                                        "durationSeconds": {
                                                          "kind": "constant",
                                                          "value": 0.2
                                                        },
                                                        "slot": 1464849466,
                                                        "priority": 10,
                                                        "curve": {
                                                          "kind": "inline",
                                                          "keys": [
                                                            {
                                                              "time": 0,
                                                              "value": 0.2,
                                                              "inTangent": 0.04379496,
                                                              "outTangent": 0.04379496,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            },
                                                            {
                                                              "time": 0.8847446,
                                                              "value": 0.2387474,
                                                              "inTangent": 0.04379496,
                                                              "outTangent": 6.604918,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            },
                                                            {
                                                              "time": 1,
                                                              "value": 1,
                                                              "inTangent": 6.604918,
                                                              "outTangent": 6.604918,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            }
                                                          ]
                                                        },
                                                        "finishByAction": false,
                                                        "ignoredTargets": [
                                                          "controlled"
                                                        ]
                                                      }
                                                    }
                                                  ]
                                                },
                                                "whenFalse": {
                                                  "steps": [
                                                    {
                                                      "kind": "startTimeDilation",
                                                      "parameters": {
                                                        "scope": "global",
                                                        "durationSeconds": {
                                                          "kind": "constant",
                                                          "value": 0.2
                                                        },
                                                        "slot": 1464849466,
                                                        "priority": 10,
                                                        "curve": {
                                                          "kind": "inline",
                                                          "keys": [
                                                            {
                                                              "time": 0,
                                                              "value": 0.2,
                                                              "inTangent": 0.04379496,
                                                              "outTangent": 0.04379496,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            },
                                                            {
                                                              "time": 0.8847446,
                                                              "value": 0.2387474,
                                                              "inTangent": 0.04379496,
                                                              "outTangent": 6.604918,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            },
                                                            {
                                                              "time": 1,
                                                              "value": 1,
                                                              "inTangent": 6.604918,
                                                              "outTangent": 6.604918,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            }
                                                          ]
                                                        },
                                                        "finishByAction": false,
                                                        "ignoredTargets": [
                                                          "controlled"
                                                        ]
                                                      }
                                                    }
                                                  ]
                                                }
                                              },
                                              {
                                                "kind": "conditional",
                                                "parameters": {
                                                  "condition": {
                                                    "kind": "actionValueCompare",
                                                    "left": {
                                                      "kind": "blackboard",
                                                      "key": "EntityBB_talent0"
                                                    },
                                                    "operator": "greater",
                                                    "right": {
                                                      "kind": "constant",
                                                      "value": 0
                                                    }
                                                  }
                                                },
                                                "whenTrue": {
                                                  "steps": [
                                                    {
                                                      "kind": "conditional",
                                                      "parameters": {
                                                        "condition": {
                                                          "kind": "buffIdStackCompare",
                                                          "target": "caster",
                                                          "buffIds": [
                                                            "buff_chr_0012_avywen_talent_0"
                                                          ],
                                                          "operator": "greaterOrEqual",
                                                          "value": {
                                                            "kind": "constant",
                                                            "value": 1
                                                          }
                                                        }
                                                      },
                                                      "whenTrue": {
                                                        "steps": [
                                                          {
                                                            "kind": "changeResourceByActionValue",
                                                            "parameters": {
                                                              "resource": "ultimateEnergy",
                                                              "amount": {
                                                                "kind": "blackboard",
                                                                "key": "EntityBB_talent0"
                                                              },
                                                              "coefficient": {
                                                                "kind": "constant",
                                                                "value": 1
                                                              },
                                                              "recipient": "caster"
                                                            }
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
                                      ]
                                    }
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
              ]
            }
          },
          {
            "startFrame": 7,
            "endFrame": 10,
            "sequence": {
              "steps": [
                {
                  "kind": "findOwnerSpawnedAbilityEntities",
                  "parameters": {
                    "saveToContextKey": "UltiLances",
                    "abilityEntityIds": [
                      "abilityentity_chr_0012_avywen_ultimate_skill"
                    ]
                  }
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "contextTargetCountCompare",
                      "contextKey": "UltiLances",
                      "operator": "greaterOrEqual",
                      "value": 1
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "lance_count",
                          "operation": "assign",
                          "value": {
                            "kind": "constant",
                            "value": 1
                          }
                        }
                      },
                      {
                        "kind": "forEachContextTarget",
                        "parameters": {
                          "contextKey": "UltiLances"
                        },
                        "body": {
                          "steps": [
                            {
                              "kind": "conditional",
                              "parameters": {
                                "condition": {
                                  "kind": "actionValueCompare",
                                  "left": {
                                    "kind": "constant",
                                    "value": 0
                                  },
                                  "operator": "lessOrEqual",
                                  "right": {
                                    "kind": "constant",
                                    "value": 50
                                  }
                                }
                              },
                              "whenTrue": {
                                "steps": [
                                  {
                                    "kind": "applyBuff",
                                    "parameters": {
                                      "buffId": "buff_chr_0012_avywen_lance_becalled",
                                      "target": "currentAbilityEntity",
                                      "inheritSourceSkillCastInfo": true
                                    }
                                  },
                                  {
                                    "kind": "withActionBlackboardScope",
                                    "parameters": {
                                      "scopeKey": "SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[10]._sequenceActionData.actionData[3].action.actionData[3]:projectile_chr_0012_avywen_ultimate_skill_lance_back",
                                      "lifetime": "execution",
                                      "initialValues": {},
                                      "inheritParent": true,
                                      "entityInitialValues": {
                                        "EntityBB_talent0": 0
                                      }
                                    },
                                    "body": {
                                      "steps": [
                                        {
                                          "kind": "withActionBlackboardScope",
                                          "parameters": {
                                            "scopeKey": "SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[10]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_ultimate_skill_lance_back",
                                            "lifetime": "execution",
                                            "alwaysNext": true,
                                            "initialValues": {
                                              "atk_scale_lance_ult": 3,
                                              "poise_lance": 0,
                                              "poise_lance_ult": 0,
                                              "potential_5_rate": 0,
                                              "radius": 4,
                                              "talent0_usp": 0
                                            },
                                            "inheritParent": true
                                          },
                                          "body": {
                                            "steps": [
                                              {
                                                "kind": "conditional",
                                                "parameters": {
                                                  "condition": {
                                                    "kind": "actionValueCompare",
                                                    "left": {
                                                      "kind": "constant",
                                                      "value": 1
                                                    },
                                                    "operator": "greaterOrEqual",
                                                    "right": {
                                                      "kind": "constant",
                                                      "value": 1
                                                    }
                                                  }
                                                },
                                                "whenTrue": {
                                                  "steps": [
                                                    {
                                                      "kind": "applyBuff",
                                                      "parameters": {
                                                        "buffId": "buff_chr_0012_avywen_lance_pulse_check",
                                                        "target": "enemy",
                                                        "inheritSourceSkillCastInfo": true
                                                      }
                                                    },
                                                    {
                                                      "kind": "modifyActionValue",
                                                      "parameters": {
                                                        "key": "EntityBB_talent0",
                                                        "operation": "assign",
                                                        "value": {
                                                          "kind": "blackboard",
                                                          "key": "talent0_usp"
                                                        }
                                                      }
                                                    },
                                                    {
                                                      "kind": "conditional",
                                                      "parameters": {
                                                        "condition": {
                                                          "kind": "all",
                                                          "conditions": [
                                                            {
                                                              "kind": "actionValueCompare",
                                                              "left": {
                                                                "kind": "blackboard",
                                                                "key": "potential_5_rate"
                                                              },
                                                              "operator": "greater",
                                                              "right": {
                                                                "kind": "constant",
                                                                "value": 0
                                                              }
                                                            },
                                                            {
                                                              "kind": "buffStackCompare",
                                                              "target": "enemy",
                                                              "tagQueryType": "hasAny",
                                                              "buffTagIds": [
                                                                -1640994543
                                                              ],
                                                              "operator": "greaterOrEqual",
                                                              "value": {
                                                                "kind": "constant",
                                                                "value": 1
                                                              }
                                                            }
                                                          ]
                                                        },
                                                        "alwaysNext": true
                                                      },
                                                      "whenTrue": {
                                                        "steps": [
                                                          {
                                                            "kind": "modifyActionValue",
                                                            "parameters": {
                                                              "key": "atk_scale_lance_ult",
                                                              "operation": "multiply",
                                                              "value": {
                                                                "kind": "blackboard",
                                                                "key": "potential_5_rate"
                                                              }
                                                            }
                                                          },
                                                          {
                                                            "kind": "dealDamage",
                                                            "parameters": {
                                                              "damageType": "electric",
                                                              "attackScale": {
                                                                "kind": "blackboard",
                                                                "key": "atk_scale_lance_ult"
                                                              },
                                                              "tags": [
                                                                "normalSkill"
                                                              ],
                                                              "features": [
                                                                "canBreakWeakness"
                                                              ],
                                                              "stagger": {
                                                                "kind": "blackboard",
                                                                "key": "poise_lance_ult"
                                                              }
                                                            },
                                                            "key": "chr_0012_avywen_normal_skill:/scheduledSequences/5/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/2/whenTrue/steps/1"
                                                          },
                                                          {
                                                            "kind": "startTimeDilation",
                                                            "parameters": {
                                                              "scope": "entity",
                                                              "durationSeconds": {
                                                                "kind": "constant",
                                                                "value": 0.4
                                                              },
                                                              "slot": 1464849466,
                                                              "priority": 10,
                                                              "curve": {
                                                                "kind": "named",
                                                                "key": "interrupt_weakness"
                                                              },
                                                              "finishByAction": false,
                                                              "targets": [
                                                                "enemy",
                                                                "caster"
                                                              ]
                                                            }
                                                          }
                                                        ]
                                                      },
                                                      "whenFalse": {
                                                        "steps": [
                                                          {
                                                            "kind": "dealDamage",
                                                            "parameters": {
                                                              "damageType": "electric",
                                                              "attackScale": {
                                                                "kind": "blackboard",
                                                                "key": "atk_scale_lance_ult"
                                                              },
                                                              "tags": [
                                                                "normalSkill"
                                                              ],
                                                              "features": [
                                                                "canBreakWeakness"
                                                              ],
                                                              "stagger": {
                                                                "kind": "blackboard",
                                                                "key": "poise_lance_ult"
                                                              }
                                                            },
                                                            "key": "chr_0012_avywen_normal_skill:/scheduledSequences/5/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/2/whenFalse/steps/0"
                                                          },
                                                          {
                                                            "kind": "startTimeDilation",
                                                            "parameters": {
                                                              "scope": "entity",
                                                              "durationSeconds": {
                                                                "kind": "constant",
                                                                "value": 0.4
                                                              },
                                                              "slot": 1464849466,
                                                              "priority": 10,
                                                              "curve": {
                                                                "kind": "named",
                                                                "key": "interrupt_weakness"
                                                              },
                                                              "finishByAction": false,
                                                              "targets": [
                                                                "enemy",
                                                                "caster"
                                                              ]
                                                            }
                                                          }
                                                        ]
                                                      }
                                                    }
                                                  ]
                                                }
                                              }
                                            ]
                                          }
                                        },
                                        {
                                          "kind": "withActionBlackboardScope",
                                          "parameters": {
                                            "scopeKey": "SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[10]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_combo_skill_lance_back_reach",
                                            "lifetime": "execution",
                                            "alwaysNext": true,
                                            "initialValues": {
                                              "atk_scale": 3,
                                              "radius": 4
                                            },
                                            "inheritParent": true
                                          },
                                          "body": {
                                            "steps": [
                                              {
                                                "kind": "conditional",
                                                "parameters": {
                                                  "condition": {
                                                    "kind": "actionValueCompare",
                                                    "left": {
                                                      "kind": "constant",
                                                      "value": 0
                                                    },
                                                    "operator": "equal",
                                                    "right": {
                                                      "kind": "constant",
                                                      "value": 1
                                                    }
                                                  },
                                                  "alwaysNext": true
                                                },
                                                "whenTrue": {
                                                  "steps": [
                                                    {
                                                      "kind": "startTimeDilation",
                                                      "parameters": {
                                                        "scope": "global",
                                                        "durationSeconds": {
                                                          "kind": "constant",
                                                          "value": 0.2
                                                        },
                                                        "slot": 1464849466,
                                                        "priority": 10,
                                                        "curve": {
                                                          "kind": "inline",
                                                          "keys": [
                                                            {
                                                              "time": 0,
                                                              "value": 0.2,
                                                              "inTangent": 0.04379496,
                                                              "outTangent": 0.04379496,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            },
                                                            {
                                                              "time": 0.8847446,
                                                              "value": 0.2387474,
                                                              "inTangent": 0.04379496,
                                                              "outTangent": 6.604918,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            },
                                                            {
                                                              "time": 1,
                                                              "value": 1,
                                                              "inTangent": 6.604918,
                                                              "outTangent": 6.604918,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            }
                                                          ]
                                                        },
                                                        "finishByAction": false,
                                                        "ignoredTargets": [
                                                          "controlled"
                                                        ]
                                                      }
                                                    }
                                                  ]
                                                },
                                                "whenFalse": {
                                                  "steps": [
                                                    {
                                                      "kind": "startTimeDilation",
                                                      "parameters": {
                                                        "scope": "global",
                                                        "durationSeconds": {
                                                          "kind": "constant",
                                                          "value": 0.2
                                                        },
                                                        "slot": 1464849466,
                                                        "priority": 10,
                                                        "curve": {
                                                          "kind": "inline",
                                                          "keys": [
                                                            {
                                                              "time": 0,
                                                              "value": 0.2,
                                                              "inTangent": 0.04379496,
                                                              "outTangent": 0.04379496,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            },
                                                            {
                                                              "time": 0.8847446,
                                                              "value": 0.2387474,
                                                              "inTangent": 0.04379496,
                                                              "outTangent": 6.604918,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            },
                                                            {
                                                              "time": 1,
                                                              "value": 1,
                                                              "inTangent": 6.604918,
                                                              "outTangent": 6.604918,
                                                              "weightedMode": 0,
                                                              "inWeight": 0,
                                                              "outWeight": 0
                                                            }
                                                          ]
                                                        },
                                                        "finishByAction": false,
                                                        "ignoredTargets": [
                                                          "controlled"
                                                        ]
                                                      }
                                                    }
                                                  ]
                                                }
                                              },
                                              {
                                                "kind": "conditional",
                                                "parameters": {
                                                  "condition": {
                                                    "kind": "actionValueCompare",
                                                    "left": {
                                                      "kind": "blackboard",
                                                      "key": "EntityBB_talent0"
                                                    },
                                                    "operator": "greater",
                                                    "right": {
                                                      "kind": "constant",
                                                      "value": 0
                                                    }
                                                  }
                                                },
                                                "whenTrue": {
                                                  "steps": [
                                                    {
                                                      "kind": "conditional",
                                                      "parameters": {
                                                        "condition": {
                                                          "kind": "buffIdStackCompare",
                                                          "target": "caster",
                                                          "buffIds": [
                                                            "buff_chr_0012_avywen_talent_0"
                                                          ],
                                                          "operator": "greaterOrEqual",
                                                          "value": {
                                                            "kind": "constant",
                                                            "value": 1
                                                          }
                                                        }
                                                      },
                                                      "whenTrue": {
                                                        "steps": [
                                                          {
                                                            "kind": "changeResourceByActionValue",
                                                            "parameters": {
                                                              "resource": "ultimateEnergy",
                                                              "amount": {
                                                                "kind": "blackboard",
                                                                "key": "EntityBB_talent0"
                                                              },
                                                              "coefficient": {
                                                                "kind": "constant",
                                                                "value": 1
                                                              },
                                                              "recipient": "caster"
                                                            }
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
                                      ]
                                    }
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
              ]
            }
          }
        ],
        "costs": [
          {
            "resource": "sp",
            "value": 100
          }
        ]
      }
    },
    {
      "key": "comboSkill",
      "skillType": "comboSkill",
      "levelSource": "comboSkill",
      "skills": {
        "key": "comboSkill",
        "sourceSkillId": "chr_0012_avywen_combo_skill",
        "blackboard": {
          "atk_scale": [
            1.69,
            1.86,
            2.03,
            2.19,
            2.36,
            2.53,
            2.7,
            2.87,
            3.04,
            3.25,
            3.5,
            3.8
          ],
          "atk_scale_lance_back": 1,
          "cam_angle": 0,
          "cam_duration": 0,
          "input_angle": 0,
          "owner_mainchar_alpha": 0,
          "owner_mainchar_distance": 0,
          "poise": 10,
          "poise_lance": 0,
          "potential_2": 0,
          "radius": 4,
          "talent0_usp": 0,
          "usp": 10,
          "lance_duration": 30
        },
        "timelineBlockFrames": 21,
        "costFrame": 0,
        "scheduledSequences": [
          {
            "startFrame": 14,
            "endFrame": 15,
            "sequence": {
              "steps": [
                {
                  "kind": "withActionBlackboardScope",
                  "parameters": {
                    "scopeKey": "SkillData.chr_0012_avywen_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[4]:projectile_chr_0012_avywen_combo_skill_lance_out",
                    "lifetime": "execution",
                    "initialValues": {},
                    "inheritParent": true
                  },
                  "body": {
                    "steps": [
                      {
                        "kind": "withActionBlackboardScope",
                        "parameters": {
                          "scopeKey": "SkillData.chr_0012_avywen_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[4]:chr_0012_avywen_combo_skill_lance_gene",
                          "lifetime": "execution",
                          "alwaysNext": true,
                          "initialValues": {
                            "atk_scale_lance_back": 1,
                            "potential_2": 0,
                            "radius": 4,
                            "talent_atb_gain": 0
                          },
                          "inheritParent": true
                        },
                        "body": {
                          "steps": [
                            {
                              "kind": "spawnAbilityEntity",
                              "parameters": {
                                "abilityEntityId": "abilityentity_chr_0012_avywen_combo_skill_lance",
                                "inheritActionBlackboard": true,
                                "dieWhenSourceDies": false
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 14,
            "endFrame": 15,
            "sequence": {
              "steps": [
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "electric",
                    "attackScale": {
                      "kind": "blackboard",
                      "key": "atk_scale"
                    },
                    "tags": [
                      "comboSkill"
                    ],
                    "features": [
                      "canBreakWeakness"
                    ],
                    "stagger": {
                      "kind": "blackboard",
                      "key": "poise"
                    }
                  },
                  "key": "chr_0012_avywen_combo_skill:/scheduledSequences/1/sequence/steps/0"
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "buffIdStackCompare",
                      "target": "caster",
                      "buffIds": [
                        "buff_chr_0012_avywen_talent_0"
                      ],
                      "operator": "greaterOrEqual",
                      "value": {
                        "kind": "constant",
                        "value": 1
                      }
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "changeResourceByActionValue",
                        "parameters": {
                          "resource": "ultimateEnergy",
                          "amount": {
                            "kind": "blackboard",
                            "key": "talent0_usp"
                          },
                          "coefficient": {
                            "kind": "constant",
                            "value": 1
                          },
                          "recipient": "caster"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 0,
            "endFrame": 12,
            "sequence": {
              "steps": [
                {
                  "kind": "startTimeDilation",
                  "parameters": {
                    "scope": "global",
                    "durationSeconds": {
                      "kind": "constant",
                      "value": 0.5
                    },
                    "slot": 0,
                    "priority": 30,
                    "curve": {
                      "kind": "named",
                      "key": "ComboSkill"
                    },
                    "finishByAction": false,
                    "ignoredTargets": [
                      "caster"
                    ],
                    "ignoredAbilityEntityTargets": [
                      {
                        "kind": "ownerSpawned"
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        "cooldownFrames": [
          390,
          390,
          390,
          390,
          390,
          390,
          390,
          390,
          390,
          390,
          390,
          360
        ]
      }
    },
    {
      "key": "ultimate",
      "skillType": "ultimate",
      "levelSource": "ultimate",
      "skills": {
        "key": "ultimate",
        "sourceSkillId": "chr_0012_avywen_ultimate_skill",
        "blackboard": {
          "atk_scale": [
            4.22,
            4.64,
            5.07,
            5.49,
            5.91,
            6.33,
            6.75,
            7.18,
            7.6,
            8.13,
            8.76,
            9.5
          ],
          "atk_scale_ulti_lance_back": 1,
          "poise": [
            15,
            15,
            15,
            15,
            15,
            15,
            15,
            15,
            15,
            20,
            20,
            20
          ],
          "poise_lance": 0,
          "potential_2": 0,
          "pulse_vul_duration": 0,
          "pulse_vul_rate": 0,
          "radius": 5,
          "talent0_usp": 0,
          "lance_duration_ult": 30,
          "pulse_resist_down_duration": [
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            5,
            6,
            7,
            8
          ],
          "pulse_resist_down_rate": [
            0.3,
            0.32,
            0.32,
            0.32,
            0.32,
            0.34,
            0.34,
            0.34,
            0.34,
            0.36,
            0.38,
            0.4
          ]
        },
        "timelineBlockFrames": 57,
        "costFrame": 0,
        "scheduledSequences": [
          {
            "startFrame": 0,
            "endFrame": 30,
            "sequence": {
              "steps": [
                {
                  "kind": "startTimeDilation",
                  "parameters": {
                    "scope": "entity",
                    "durationSeconds": {
                      "kind": "constant",
                      "value": 1
                    },
                    "slot": 1464849466,
                    "priority": 10,
                    "curve": {
                      "kind": "named",
                      "key": "RESETto1"
                    },
                    "finishByAction": false,
                    "targets": [
                      "caster"
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 0,
            "endFrame": 45,
            "sequence": {
              "steps": [
                {
                  "kind": "startUltimateTimeDilation",
                  "parameters": {
                    "priority": 100,
                    "targetScale": {
                      "kind": "constant",
                      "value": 0
                    },
                    "ignoredTargets": []
                  }
                }
              ]
            }
          },
          {
            "startFrame": 45,
            "endFrame": 48,
            "sequence": {
              "steps": [
                {
                  "kind": "withActionBlackboardScope",
                  "parameters": {
                    "scopeKey": "SkillData.chr_0012_avywen_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:projectile_chr_0012_avywen_ultimate_skill_lance_out",
                    "lifetime": "execution",
                    "initialValues": {},
                    "inheritParent": true
                  },
                  "body": {
                    "steps": [
                      {
                        "kind": "withActionBlackboardScope",
                        "parameters": {
                          "scopeKey": "SkillData.chr_0012_avywen_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:chr_0012_avywen_ultimate_skill_lance_gene",
                          "lifetime": "execution",
                          "alwaysNext": true,
                          "initialValues": {
                            "atk_scale_ulti_lance_back": 0,
                            "potential_2": 0,
                            "radius": 4,
                            "talent_atb_gain_ulti": 0
                          },
                          "inheritParent": true
                        },
                        "body": {
                          "steps": [
                            {
                              "kind": "spawnAbilityEntity",
                              "parameters": {
                                "abilityEntityId": "abilityentity_chr_0012_avywen_ultimate_skill",
                                "inheritActionBlackboard": true,
                                "dieWhenSourceDies": false
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 51,
            "endFrame": 54,
            "sequence": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "blackboard",
                        "key": "pulse_vul_duration"
                      },
                      "operator": "greater",
                      "right": {
                        "kind": "constant",
                        "value": 0
                      }
                    },
                    "alwaysNext": true
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "applyBuff",
                        "parameters": {
                          "buffId": "buff_chr_0012_avywen_ultimate_skill_debuff",
                          "target": "enemy",
                          "inheritSourceSkillCastInfo": true,
                          "blackboardAssignments": {
                            "pulse_vul_rate": {
                              "kind": "blackboard",
                              "key": "pulse_vul_rate"
                            },
                            "pulse_vul_duration": {
                              "kind": "blackboard",
                              "key": "pulse_vul_duration"
                            }
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "electric",
                    "attackScale": {
                      "kind": "blackboard",
                      "key": "atk_scale"
                    },
                    "tags": [
                      "ultimateSkill"
                    ],
                    "features": [
                      "canBreakWeakness"
                    ],
                    "stagger": {
                      "kind": "blackboard",
                      "key": "poise"
                    }
                  },
                  "key": "chr_0012_avywen_ultimate_skill:/scheduledSequences/3/sequence/steps/1"
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "buffIdStackCompare",
                      "target": "caster",
                      "buffIds": [
                        "buff_chr_0012_avywen_talent_0"
                      ],
                      "operator": "greaterOrEqual",
                      "value": {
                        "kind": "constant",
                        "value": 1
                      }
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "changeResourceByActionValue",
                        "parameters": {
                          "resource": "ultimateEnergy",
                          "amount": {
                            "kind": "blackboard",
                            "key": "talent0_usp"
                          },
                          "coefficient": {
                            "kind": "constant",
                            "value": 1
                          },
                          "recipient": "caster"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 0,
            "endFrame": 65,
            "sequence": {
              "steps": [
                {
                  "kind": "applyBuff",
                  "parameters": {
                    "buffId": "buff_common_damage_immune_ult_skill",
                    "target": "caster",
                    "inheritSourceSkillCastInfo": true,
                    "finishByAction": true
                  }
                }
              ]
            }
          }
        ],
        "cooldownFrames": 300,
        "costs": [
          {
            "resource": "ultimateEnergy",
            "value": 100
          }
        ]
      }
    }
  ],
  "talents": [
    {
      "key": "talent1",
      "levels": 2,
      "modifiers": [
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "battleSkill",
          "blackboardKey": "talent0_usp",
          "operation": "assign",
          "value": [
            3,
            4
          ]
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "comboSkill",
          "blackboardKey": "talent0_usp",
          "operation": "assign",
          "value": [
            3,
            4
          ]
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "talent0_usp",
          "operation": "assign",
          "value": [
            3,
            4
          ]
        }
      ],
      "initializationSequence": {
        "steps": [
          {
            "kind": "applyBuff",
            "parameters": {
              "buffId": "buff_chr_0012_avywen_talent_0",
              "target": "caster",
              "inheritSourceSkillCastInfo": false
            }
          }
        ]
      }
    },
    {
      "key": "talent2",
      "levels": 2,
      "modifiers": [
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "pulse_vul_rate",
          "operation": "assign",
          "value": [
            0.06,
            0.1
          ]
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "pulse_vul_duration",
          "operation": "assign",
          "value": [
            10,
            10
          ]
        }
      ]
    }
  ],
  "potentials": [
    {
      "key": "potential1",
      "levels": 1,
      "modifiers": [
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "battleSkill",
          "blackboardKey": "talent0_usp",
          "operation": "add",
          "value": 2
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "comboSkill",
          "blackboardKey": "talent0_usp",
          "operation": "add",
          "value": 2
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "talent0_usp",
          "operation": "add",
          "value": 2
        }
      ]
    },
    {
      "key": "potential2",
      "levels": 1,
      "modifiers": [
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "comboSkill",
          "blackboardKey": "potential_2",
          "operation": "assign",
          "value": 20
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "potential_2",
          "operation": "assign",
          "value": 20
        }
      ]
    },
    {
      "key": "potential3",
      "levels": 1,
      "modifiers": [
        {
          "kind": "addBuildAttribute",
          "attributes": [
            "will"
          ],
          "value": 15
        },
        {
          "kind": "addStaticDamageIncrease",
          "target": "electric",
          "value": 0.08
        }
      ]
    },
    {
      "key": "potential4",
      "levels": 1,
      "modifiers": [
        {
          "kind": "multiplySkillCost",
          "skillGroupKey": "ultimate",
          "resource": "ultimateEnergy",
          "multiplier": 0.85
        }
      ]
    },
    {
      "key": "potential5",
      "levels": 1,
      "modifiers": [
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "battleSkill",
          "blackboardKey": "potential_5_rate",
          "operation": "assign",
          "value": 1.15
        }
      ]
    }
  ],
  "buffDefinitions": {
    "buff_chr_0012_avywen_lance_becalled": {
      "stackingType": "unique",
      "priority": 0,
      "maxStackCount": 1,
      "durationSeconds": 2,
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {},
      "attributeModifiers": []
    },
    "buff_chr_0012_avywen_lance_becalled_ready": {
      "stackingType": "unique",
      "priority": 0,
      "maxStackCount": 1,
      "durationSeconds": 2,
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {},
      "attributeModifiers": []
    },
    "buff_chr_0012_avywen_lance_pulse_check": {
      "stackingType": "unique",
      "priority": 1,
      "maxStackCount": 1,
      "durationSeconds": 0.3,
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {},
      "attributeModifiers": [],
      "lifecycleSequences": {
        "start": {
          "steps": [
            {
              "kind": "conditional",
              "parameters": {
                "condition": {
                  "kind": "buffIdStackCompare",
                  "target": "buffOwner",
                  "buffIds": [
                    "buff_chr_0012_avywen_lance_pulse_check"
                  ],
                  "operator": "lessOrEqual",
                  "value": {
                    "kind": "constant",
                    "value": 0
                  }
                }
              },
              "whenTrue": {
                "steps": [
                  {
                    "kind": "applyElementalInfliction",
                    "parameters": {
                      "element": "electric",
                      "isExtra": false,
                      "target": "buffOwner"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    },
    "buff_chr_0012_avywen_talent_0": {
      "stackingType": "unique",
      "priority": 0,
      "maxStackCount": 1,
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {},
      "attributeModifiers": []
    },
    "buff_chr_0012_avywen_ultimate_skill_debuff": {
      "stackingType": "stack",
      "priority": 0,
      "maxStackCount": 1,
      "durationSeconds": {
        "blackboardKey": "pulse_vul_duration"
      },
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {
        "pulse_vul_duration": 10,
        "pulse_vul_rate": 0.3
      },
      "attributeModifiers": [],
      "lifecycleSequences": {
        "enable": {
          "steps": [
            {
              "kind": "applyBuff",
              "parameters": {
                "buffId": "buff_common_affixes_vulnerable_pulse",
                "target": "buffOwner",
                "inheritSourceSkillCastInfo": true,
                "asChildBuff": true,
                "blackboardAssignments": {
                  "duration": {
                    "kind": "blackboard",
                    "key": "pulse_vul_duration"
                  },
                  "rate": {
                    "kind": "blackboard",
                    "key": "pulse_vul_rate"
                  }
                }
              }
            }
          ]
        }
      }
    }
  },
  "abilityEntityDefinitions": {
    "abilityentity_chr_0012_avywen_combo_skill_lance": {
      "lifetime": {
        "kind": "limited",
        "durationSeconds": 62
      },
      "childSkill": {
        "skillId": "chr_0012_avywen_combo_skill_lance",
        "blackboard": {
          "atk_scale_lance": 1,
          "poise_lance": 0,
          "potential_2": 0,
          "talent_atb_gain": 0
        },
        "scheduledSequences": [
          {
            "startFrame": 0,
            "endFrame": 1500,
            "sequence": {
              "steps": [
                {
                  "kind": "jumpTimeline",
                  "parameters": {
                    "destinationFrame": 1500,
                    "condition": {
                      "kind": "buffIdStackCompare",
                      "target": "currentAbilityEntity",
                      "buffIds": [
                        "buff_chr_0012_avywen_lance_becalled"
                      ],
                      "operator": "greaterOrEqual",
                      "value": {
                        "kind": "constant",
                        "value": 1
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            "startFrame": 1500,
            "endFrame": 1501,
            "sequence": {
              "steps": [
                {
                  "kind": "finishCurrentAbilityEntity",
                  "parameters": {}
                }
              ]
            }
          },
          {
            "startFrame": 900,
            "endFrame": 901,
            "sequence": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "blackboard",
                        "key": "potential_2"
                      },
                      "operator": "less",
                      "right": {
                        "kind": "constant",
                        "value": 1
                      }
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "finishCurrentAbilityEntity",
                        "parameters": {}
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 1500,
            "endFrame": 1501,
            "sequence": {
              "steps": [
                {
                  "kind": "finishCurrentAbilityEntity",
                  "parameters": {}
                }
              ]
            }
          }
        ]
      }
    },
    "abilityentity_chr_0012_avywen_ultimate_skill": {
      "lifetime": {
        "kind": "limited",
        "durationSeconds": 62
      },
      "childSkill": {
        "skillId": "chr_0012_avywen_ultimate_skill_lance",
        "blackboard": {
          "atk_scale_lance_ult": 1,
          "poise_lance_ult": 0,
          "potential_2": 0,
          "talent_atb_gain_ulti": 0
        },
        "scheduledSequences": [
          {
            "startFrame": 0,
            "endFrame": 1500,
            "sequence": {
              "steps": [
                {
                  "kind": "jumpTimeline",
                  "parameters": {
                    "destinationFrame": 1500,
                    "condition": {
                      "kind": "buffIdStackCompare",
                      "target": "currentAbilityEntity",
                      "buffIds": [
                        "buff_chr_0012_avywen_lance_becalled"
                      ],
                      "operator": "greaterOrEqual",
                      "value": {
                        "kind": "constant",
                        "value": 1
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            "startFrame": 1500,
            "endFrame": 1501,
            "sequence": {
              "steps": [
                {
                  "kind": "finishCurrentAbilityEntity",
                  "parameters": {}
                }
              ]
            }
          },
          {
            "startFrame": 900,
            "endFrame": 901,
            "sequence": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "blackboard",
                        "key": "potential_2"
                      },
                      "operator": "less",
                      "right": {
                        "kind": "constant",
                        "value": 1
                      }
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "finishCurrentAbilityEntity",
                        "parameters": {}
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            "startFrame": 1500,
            "endFrame": 1501,
            "sequence": {
              "steps": [
                {
                  "kind": "finishCurrentAbilityEntity",
                  "parameters": {}
                }
              ]
            }
          }
        ]
      }
    }
  },
  "conversionSupport": {
    "completeness": "complete",
    "missingCapabilities": []
  }
} as const satisfies OperatorDefinition;
