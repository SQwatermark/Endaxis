/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  OperatorBuffDefinitions,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const commonBuffDefinitions = {
  "buff_common_affixes_combo_trigger": {
    "stackingType": "unlimited",
    "priority": {
      "blackboardKey": "imbue_scale",
      "negate": true
    },
    "maxStackCount": 99,
    "triggerIntervalSeconds": 0,
    "waitFirstTriggerInterval": true,
    "maxTriggerCount": 1,
    "applyTagIds": [],
    "extendTagIds": [],
    "blackboard": {
      "imbue_scale": 0
    },
    "attributeModifiers": [],
    "abilityEventResponses": [
      {
        "event": "beforeCastSkill",
        "priority": 0,
        "sequence": {
          "steps": [
            {
              "kind": "conditional",
              "parameters": {
                "condition": {
                  "kind": "eventSkillTypeIn",
                  "skillTypes": [
                    "battleSkill",
                    "ultimate"
                  ]
                }
              },
              "whenTrue": {
                "steps": [
                  {
                    "kind": "applyBuff",
                    "parameters": {
                      "buffId": "buff_common_affixes_skillimbue",
                      "target": "buffOwner",
                      "source": "eventSource",
                      "inheritSourceSkillCastInfo": true,
                      "blackboardAssignments": {
                        "imbue_scale": {
                          "kind": "blackboard",
                          "key": "imbue_scale"
                        }
                      }
                    }
                  },
                  {
                    "kind": "finishParentGlobalBuff",
                    "parameters": {
                      "reason": "early"
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
  "buff_common_affixes_skillimbue": {
    "stackingType": "unlimited",
    "priority": {
      "blackboardKey": "imbue_scale",
      "negate": true
    },
    "maxStackCount": 4,
    "triggerIntervalSeconds": 0,
    "waitFirstTriggerInterval": true,
    "maxTriggerCount": 1,
    "applyTagIds": [
      949770213
    ],
    "extendTagIds": [],
    "blackboard": {
      "duration": 0,
      "imbue_scale": 0.3,
      "trigger_num": 0
    },
    "attributeModifiers": [],
    "lifecycleSequences": {
      "enable": {
        "steps": [
          {
            "kind": "applyBuff",
            "parameters": {
              "buffId": "buff_common_affixes_skillimbue_atk",
              "target": "buffOwner",
              "inheritSourceSkillCastInfo": true,
              "finishByAction": true
            }
          }
        ]
      }
    },
    "abilityEventResponses": [
      {
        "event": "skillEnd",
        "priority": 0,
        "sequence": {
          "steps": [
            {
              "kind": "conditional",
              "parameters": {
                "condition": {
                  "kind": "eventSkillCastMatchesBuffSource"
                }
              },
              "whenTrue": {
                "steps": [
                  {
                    "kind": "finishCurrentBuff",
                    "parameters": {
                      "reason": "other"
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
  "buff_common_affixes_skillimbue_atk": {
    "stackingType": "unlimited",
    "priority": {
      "blackboardKey": "imbue_scale",
      "negate": true
    },
    "maxStackCount": 4,
    "triggerIntervalSeconds": 0,
    "waitFirstTriggerInterval": true,
    "maxTriggerCount": 1,
    "applyTagIds": [],
    "extendTagIds": [],
    "blackboard": {
      "count": 0,
      "imbue_scale": 0
    },
    "attributeModifiers": [],
    "damageModifiers": [
      {
        "enabledSide": "attacker",
        "condition": {
          "kind": "all",
          "conditions": [
            {
              "kind": "sourceSkillCastMatch"
            },
            {
              "kind": "eventDamageTagsMatch",
              "match": "hasAny",
              "tags": [
                "normalSkill",
                "ultimateSkill"
              ]
            }
          ]
        },
        "processors": [
          {
            "kind": "damageScale",
            "side": "attacker",
            "zone": "combo",
            "addition": {
              "blackboardKey": "imbue_scale"
            }
          }
        ]
      }
    ],
    "abilityEventResponses": [
      {
        "event": "beforeCalculateDamage",
        "priority": 0,
        "sequence": {
          "steps": [
            {
              "kind": "readBuffStackCount",
              "parameters": {
                "target": "buffOwner",
                "outputKey": "count",
                "query": {
                  "kind": "id",
                  "buffIds": [
                    "buff_common_affixes_skillimbue_atk"
                  ]
                }
              }
            },
            {
              "kind": "conditional",
              "parameters": {
                "condition": {
                  "kind": "actionValueCompare",
                  "left": {
                    "kind": "blackboard",
                    "key": "count"
                  },
                  "operator": "greater",
                  "right": {
                    "kind": "constant",
                    "value": 4
                  }
                },
                "alwaysNext": true
              },
              "whenTrue": {
                "steps": [
                  {
                    "kind": "modifyActionValue",
                    "parameters": {
                      "key": "count",
                      "operation": "assign",
                      "value": {
                        "kind": "constant",
                        "value": 4
                      }
                    }
                  }
                ]
              }
            },
            {
              "kind": "readSkillSettingData",
              "parameters": {
                "items": [
                  {
                    "values": [
                      0.2,
                      0.15,
                      0.1333,
                      0.125
                    ],
                    "column": {
                      "kind": "blackboard",
                      "key": "count"
                    },
                    "storeKey": "imbue_scale"
                  }
                ]
              }
            },
            {
              "kind": "conditional",
              "parameters": {
                "condition": {
                  "kind": "eventDamageTagsMatch",
                  "match": "hasAll",
                  "tags": [
                    "normalSkill"
                  ]
                },
                "alwaysNext": true
              },
              "whenTrue": {
                "steps": [
                  {
                    "kind": "modifyActionValue",
                    "parameters": {
                      "key": "imbue_scale",
                      "operation": "multiply",
                      "value": {
                        "kind": "constant",
                        "value": 1.5
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
        "event": "skillEnd",
        "priority": 0,
        "sequence": {
          "steps": [
            {
              "kind": "conditional",
              "parameters": {
                "condition": {
                  "kind": "eventSkillCastMatchesBuffSource"
                }
              },
              "whenTrue": {
                "steps": [
                  {
                    "kind": "finishCurrentBuff",
                    "parameters": {
                      "reason": "other"
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
  "buff_common_damage_immune_medium": {
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
  "slug": "akekuri",
  "gameId": "AKEKURI",
  "rarity": 4,
  "weaponType": "sword",
  "element": "heat",
  "role": "vanguard",
  "mainAttribute": "agility",
  "secondaryAttribute": "intellect",
  "attributes": {
    "strength": [
      13,
      34,
      55,
      77,
      99,
      110
    ],
    "agility": [
      15,
      42,
      70,
      98,
      126,
      140
    ],
    "intellect": [
      12,
      32,
      53,
      75,
      96,
      106
    ],
    "will": [
      9,
      30,
      52,
      74,
      96,
      108
    ],
    "baseAttack": [
      30,
      92,
      157,
      222,
      287,
      319
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
          "sourceSkillId": "chr_0019_karin_attack1",
          "blackboard": {
            "atb": 0,
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
          "timelineBlockFrames": 14,
          "costFrame": 9,
          "scheduledSequences": [
            {
              "startFrame": 9,
              "endFrame": 10,
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
                    "key": "chr_0019_karin_attack1:/scheduledSequences/0/sequence/steps/0"
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
                              "value": 0.08
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
        },
        {
          "key": "basicAttack2",
          "sourceSkillId": "chr_0019_karin_attack2",
          "blackboard": {
            "atb": 0,
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
          "timelineBlockFrames": 22,
          "costFrame": 9,
          "scheduledSequences": [
            {
              "startFrame": 8,
              "endFrame": 9,
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
                    "key": "chr_0019_karin_attack2:/scheduledSequences/0/sequence/steps/0"
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
            },
            {
              "startFrame": 16,
              "endFrame": 17,
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
                    "key": "chr_0019_karin_attack2:/scheduledSequences/1/sequence/steps/0"
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
                        },
                        {
                          "kind": "startTimeDilation",
                          "parameters": {
                            "scope": "entity",
                            "durationSeconds": {
                              "kind": "constant",
                              "value": 0.08
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
        },
        {
          "key": "basicAttack3",
          "sourceSkillId": "chr_0019_karin_attack3",
          "blackboard": {
            "atb": 0,
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
          "timelineBlockFrames": 21,
          "costFrame": 9,
          "scheduledSequences": [
            {
              "startFrame": 10,
              "endFrame": 11,
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
                    "key": "chr_0019_karin_attack3:/scheduledSequences/0/sequence/steps/0"
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
                        },
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
        },
        {
          "key": "basicAttack4",
          "sourceSkillId": "chr_0019_karin_attack4",
          "blackboard": {
            "atb": 19,
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
            "poise": 17,
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
            ]
          },
          "timelineBlockFrames": 35,
          "costFrame": 9,
          "scheduledSequences": [
            {
              "startFrame": 19,
              "endFrame": 20,
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
                    "key": "chr_0019_karin_attack4:/scheduledSequences/0/sequence/steps/0"
                  }
                ]
              }
            },
            {
              "startFrame": 20,
              "endFrame": 21,
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
                    "key": "chr_0019_karin_attack4:/scheduledSequences/1/sequence/steps/0"
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
                              "value": 0.02
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
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "startFrame": 21,
              "endFrame": 22,
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
                    "key": "chr_0019_karin_attack4:/scheduledSequences/2/sequence/steps/0"
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
                        },
                        {
                          "kind": "startTimeDilation",
                          "parameters": {
                            "scope": "entity",
                            "durationSeconds": {
                              "kind": "constant",
                              "value": 0.35
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
        "sourceSkillId": "chr_0019_karin_power_attack",
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
        "timelineBlockFrames": 37,
        "costFrame": 4,
        "scheduledSequences": [
          {
            "startFrame": 13,
            "endFrame": 14,
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
                  "key": "chr_0019_karin_power_attack:/scheduledSequences/0/sequence/steps/0"
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
                            "value": 0.16
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
          },
          {
            "startFrame": 36,
            "endFrame": 37,
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
                    "calculationMultiplier": 0.8,
                    "tags": [
                      "normalAttack",
                      "powerAttack"
                    ]
                  },
                  "key": "chr_0019_karin_power_attack:/scheduledSequences/1/sequence/steps/0"
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
            "startFrame": 40,
            "endFrame": 43,
            "sequence": {
              "steps": [
                {
                  "kind": "startTimeDilation",
                  "parameters": {
                    "scope": "entity",
                    "durationSeconds": {
                      "kind": "constant",
                      "value": 0.35
                    },
                    "slot": 1464849466,
                    "priority": 10,
                    "curve": {
                      "kind": "named",
                      "key": "common"
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
          },
          {
            "startFrame": 0,
            "endFrame": 60,
            "sequence": {
              "steps": [
                {
                  "kind": "applyBuff",
                  "parameters": {
                    "buffId": "buff_common_damage_immune_medium",
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
            "endFrame": 36,
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
        "sourceSkillId": "chr_0019_karin_plunging_attack_end",
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
        "timelineBlockFrames": 14,
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
                  "key": "chr_0019_karin_plunging_attack_end:/scheduledSequences/0/sequence/steps/0"
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
    },
    {
      "key": "battleSkill",
      "skillType": "battleSkill",
      "levelSource": "battleSkill",
      "skills": {
        "key": "battleSkill",
        "sourceSkillId": "chr_0019_karin_normal_skill",
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
          "cam_angle": 0,
          "cam_duration": 0,
          "input_angle": 0,
          "poise": 10
        },
        "timelineBlockFrames": 41,
        "costFrame": 0,
        "scheduledSequences": [
          {
            "startFrame": 20,
            "endFrame": 21,
            "sequence": {
              "steps": [
                {
                  "kind": "applyElementalInfliction",
                  "parameters": {
                    "element": "heat",
                    "isExtra": false
                  }
                },
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "heat",
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
                  "key": "chr_0019_karin_normal_skill:/scheduledSequences/0/sequence/steps/1"
                },
                {
                  "kind": "startTimeDilation",
                  "parameters": {
                    "scope": "entity",
                    "durationSeconds": {
                      "kind": "constant",
                      "value": 0.2
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
          },
          {
            "startFrame": 20,
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
      "key": "ultimate",
      "skillType": "ultimate",
      "levelSource": "ultimate",
      "skills": {
        "key": "ultimate",
        "sourceSkillId": "chr_0019_karin_ultimate_skill",
        "blackboard": {
          "atb_1": [
            19,
            19,
            20,
            21,
            21,
            22,
            23,
            23,
            24,
            25,
            25,
            26
          ],
          "atb_2": [
            19,
            20,
            21,
            21,
            22,
            23,
            23,
            24,
            25,
            25,
            26,
            27
          ],
          "atb_3": [
            20,
            21,
            21,
            22,
            23,
            23,
            24,
            25,
            25,
            26,
            27,
            27
          ],
          "atb_up": 1,
          "atk": 0,
          "combo": 0,
          "duration": 10,
          "imbue_scale": 0,
          "max_ratio": 0,
          "potential_3": 0,
          "potential_5_duration": 0,
          "sub_ratio": 0,
          "atb_display": [
            58,
            60,
            62,
            64,
            66,
            68,
            70,
            72,
            74,
            76,
            78,
            80
          ]
        },
        "timelineBlockFrames": 129,
        "costFrame": 0,
        "scheduledSequences": [
          {
            "startFrame": 0,
            "endFrame": 150,
            "sequence": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "blackboard",
                        "key": "potential_3"
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
                        "kind": "applyBuff",
                        "parameters": {
                          "buffId": "buff_chr_0019_karin_potential_3",
                          "target": "party",
                          "inheritSourceSkillCastInfo": true,
                          "finishByAction": true,
                          "blackboardAssignments": {
                            "atk": {
                              "kind": "blackboard",
                              "key": "atk"
                            }
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
            "startFrame": 0,
            "endFrame": 3,
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
            "endFrame": 12,
            "sequence": {
              "steps": [
                {
                  "kind": "storeSourceAttributeValue",
                  "parameters": {
                    "attribute": {
                      "kind": "secondary"
                    },
                    "stage": "finalNonConverted",
                    "useFloor": false,
                    "divisor": {
                      "kind": "constant",
                      "value": 1
                    },
                    "multiplier": {
                      "kind": "blackboard",
                      "key": "sub_ratio"
                    },
                    "base": {
                      "kind": "constant",
                      "value": 1
                    },
                    "targetKey": "atb_up"
                  }
                },
                {
                  "kind": "modifyActionValue",
                  "parameters": {
                    "key": "max_ratio",
                    "operation": "add",
                    "value": {
                      "kind": "constant",
                      "value": 1
                    }
                  }
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "blackboard",
                        "key": "atb_up"
                      },
                      "operator": "less",
                      "right": {
                        "kind": "blackboard",
                        "key": "max_ratio"
                      }
                    },
                    "alwaysNext": true
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "atb_1",
                          "operation": "multiply",
                          "value": {
                            "kind": "blackboard",
                            "key": "atb_up"
                          }
                        }
                      },
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "atb_2",
                          "operation": "multiply",
                          "value": {
                            "kind": "blackboard",
                            "key": "atb_up"
                          }
                        }
                      },
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "atb_3",
                          "operation": "multiply",
                          "value": {
                            "kind": "blackboard",
                            "key": "atb_up"
                          }
                        }
                      }
                    ]
                  },
                  "whenFalse": {
                    "steps": [
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "atb_1",
                          "operation": "multiply",
                          "value": {
                            "kind": "blackboard",
                            "key": "max_ratio"
                          }
                        }
                      },
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "atb_2",
                          "operation": "multiply",
                          "value": {
                            "kind": "blackboard",
                            "key": "max_ratio"
                          }
                        }
                      },
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "atb_3",
                          "operation": "multiply",
                          "value": {
                            "kind": "blackboard",
                            "key": "max_ratio"
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
            "startFrame": 59,
            "endFrame": 83,
            "sequence": {
              "steps": [
                {
                  "kind": "changeResourceByActionValue",
                  "parameters": {
                    "resource": "sp",
                    "amount": {
                      "kind": "blackboard",
                      "key": "atb_1"
                    },
                    "coefficient": {
                      "kind": "constant",
                      "value": 1
                    },
                    "recipient": "team",
                    "spGainKind": "gain",
                    "spGainSource": "skill"
                  }
                }
              ]
            }
          },
          {
            "startFrame": 86,
            "endFrame": 115,
            "sequence": {
              "steps": [
                {
                  "kind": "changeResourceByActionValue",
                  "parameters": {
                    "resource": "sp",
                    "amount": {
                      "kind": "blackboard",
                      "key": "atb_2"
                    },
                    "coefficient": {
                      "kind": "constant",
                      "value": 1
                    },
                    "recipient": "team",
                    "spGainKind": "gain",
                    "spGainSource": "skill"
                  }
                }
              ]
            }
          },
          {
            "startFrame": 119,
            "endFrame": 159,
            "sequence": {
              "steps": [
                {
                  "kind": "changeResourceByActionValue",
                  "parameters": {
                    "resource": "sp",
                    "amount": {
                      "kind": "blackboard",
                      "key": "atb_3"
                    },
                    "coefficient": {
                      "kind": "constant",
                      "value": 1
                    },
                    "recipient": "team",
                    "spGainKind": "gain",
                    "spGainSource": "skill"
                  }
                }
              ]
            }
          },
          {
            "startFrame": 1,
            "endFrame": 150,
            "sequence": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "blackboard",
                        "key": "combo"
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
                          "buffId": "buff_chr_0019_karin_talent_2",
                          "target": "caster",
                          "inheritSourceSkillCastInfo": true,
                          "finishByAction": true,
                          "blackboardAssignments": {
                            "potential_5_duration": {
                              "kind": "blackboard",
                              "key": "potential_5_duration"
                            }
                          }
                        }
                      },
                      {
                        "kind": "applyBuff",
                        "parameters": {
                          "buffId": "buff_chr_0019_karin_talent_2_combo",
                          "target": "caster",
                          "inheritSourceSkillCastInfo": true,
                          "blackboardAssignments": {
                            "imbue_scale": {
                              "kind": "blackboard",
                              "key": "imbue_scale"
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
              ]
            }
          },
          {
            "startFrame": 0,
            "endFrame": 83,
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
          },
          {
            "startFrame": 0,
            "endFrame": 55,
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
          }
        ],
        "cooldownFrames": 600,
        "costs": [
          {
            "resource": "ultimateEnergy",
            "value": 120
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
        "sourceSkillId": "chr_0019_karin_combo_skill",
        "blackboard": {
          "atb": 7.5,
          "atb_up": 1,
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
          "cam_angle": 0,
          "cam_duration": 0,
          "count": 0,
          "input_angle": 0,
          "max_ratio": 0,
          "owner_mainchar_alpha": 0,
          "owner_mainchar_distance": 0,
          "poise": 5,
          "rate": 10,
          "sub_ratio": 0,
          "usp": 5
        },
        "timelineBlockFrames": 38,
        "costFrame": 0,
        "scheduledSequences": [
          {
            "startFrame": 22,
            "endFrame": 26,
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
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "sub_ratio",
                          "operation": "divide",
                          "value": {
                            "kind": "blackboard",
                            "key": "rate"
                          }
                        }
                      },
                      {
                        "kind": "storeSourceAttributeValue",
                        "parameters": {
                          "attribute": {
                            "kind": "secondary"
                          },
                          "stage": "finalNonConverted",
                          "useFloor": false,
                          "divisor": {
                            "kind": "constant",
                            "value": 1
                          },
                          "multiplier": {
                            "kind": "blackboard",
                            "key": "sub_ratio"
                          },
                          "base": {
                            "kind": "constant",
                            "value": 1
                          },
                          "targetKey": "atb_up"
                        }
                      },
                      {
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "max_ratio",
                          "operation": "add",
                          "value": {
                            "kind": "constant",
                            "value": 1
                          }
                        }
                      },
                      {
                        "kind": "conditional",
                        "parameters": {
                          "condition": {
                            "kind": "actionValueCompare",
                            "left": {
                              "kind": "blackboard",
                              "key": "atb_up"
                            },
                            "operator": "less",
                            "right": {
                              "kind": "blackboard",
                              "key": "max_ratio"
                            }
                          },
                          "alwaysNext": true
                        },
                        "whenTrue": {
                          "steps": [
                            {
                              "kind": "modifyActionValue",
                              "parameters": {
                                "key": "atb",
                                "operation": "multiply",
                                "value": {
                                  "kind": "blackboard",
                                  "key": "atb_up"
                                }
                              }
                            }
                          ]
                        },
                        "whenFalse": {
                          "steps": [
                            {
                              "kind": "modifyActionValue",
                              "parameters": {
                                "key": "atb",
                                "operation": "multiply",
                                "value": {
                                  "kind": "blackboard",
                                  "key": "max_ratio"
                                }
                              }
                            }
                          ]
                        }
                      },
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
                          "spGainSource": "skill"
                        }
                      }
                    ]
                  }
                },
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "physical",
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
                  "key": "chr_0019_karin_combo_skill:/scheduledSequences/0/sequence/steps/1"
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "blackboard",
                        "key": "count"
                      },
                      "operator": "equal",
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
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "count",
                          "operation": "add",
                          "value": {
                            "kind": "constant",
                            "value": 1
                          }
                        }
                      },
                      {
                        "kind": "changeResourceByActionValue",
                        "parameters": {
                          "resource": "ultimateEnergy",
                          "amount": {
                            "kind": "blackboard",
                            "key": "usp"
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
            "startFrame": 31,
            "endFrame": 36,
            "sequence": {
              "steps": [
                {
                  "kind": "modifyActionValue",
                  "parameters": {
                    "key": "count",
                    "operation": "assign",
                    "value": {
                      "kind": "constant",
                      "value": 0
                    }
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
                          "spGainSource": "skill"
                        }
                      }
                    ]
                  }
                },
                {
                  "kind": "dealDamage",
                  "parameters": {
                    "damageType": "physical",
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
                  "key": "chr_0019_karin_combo_skill:/scheduledSequences/1/sequence/steps/2"
                },
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "actionValueCompare",
                      "left": {
                        "kind": "blackboard",
                        "key": "count"
                      },
                      "operator": "equal",
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
                        "kind": "modifyActionValue",
                        "parameters": {
                          "key": "count",
                          "operation": "add",
                          "value": {
                            "kind": "constant",
                            "value": 1
                          }
                        }
                      },
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
                          "resource": "ultimateEnergy",
                          "amount": {
                            "kind": "blackboard",
                            "key": "usp"
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
            "endFrame": 15,
            "sequence": {
              "steps": [
                {
                  "kind": "startTimeDilation",
                  "parameters": {
                    "scope": "global",
                    "durationSeconds": {
                      "kind": "constant",
                      "value": 0.6
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
          300,
          300,
          300,
          300,
          300,
          300,
          300,
          300,
          300,
          300,
          300,
          270
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
          "skillGroupKey": "comboSkill",
          "blackboardKey": "sub_ratio",
          "operation": "assign",
          "value": [
            0.01,
            0.015
          ]
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "comboSkill",
          "blackboardKey": "max_ratio",
          "operation": "assign",
          "value": [
            0.5,
            0.75
          ]
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "comboSkill",
          "blackboardKey": "rate",
          "operation": "assign",
          "value": [
            10,
            10
          ]
        }
      ]
    },
    {
      "key": "talent2",
      "levels": 1,
      "modifiers": [
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "combo",
          "operation": "assign",
          "value": 1
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "imbue_scale",
          "operation": "assign",
          "value": 0.2
        }
      ]
    }
  ],
  "potentials": [
    {
      "key": "potential1",
      "levels": 1,
      "initializationSequence": {
        "steps": [
          {
            "kind": "applyBuff",
            "parameters": {
              "buffId": "buff_chr_0019_karin_potential_1",
              "target": "caster",
              "inheritSourceSkillCastInfo": false,
              "blackboardAssignments": {
                "atk_up": {
                  "kind": "constant",
                  "value": 0.1
                },
                "duration": {
                  "kind": "constant",
                  "value": 10
                },
                "max_stack": {
                  "kind": "constant",
                  "value": 5
                }
              }
            }
          }
        ]
      }
    },
    {
      "key": "potential2",
      "levels": 1,
      "modifiers": [
        {
          "kind": "addBuildAttribute",
          "attributes": [
            "agility"
          ],
          "value": 10
        },
        {
          "kind": "addBuildAttribute",
          "attributes": [
            "intellect"
          ],
          "value": 10
        }
      ]
    },
    {
      "key": "potential3",
      "levels": 1,
      "modifiers": [
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "potential_3",
          "operation": "assign",
          "value": 1
        },
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "atk",
          "operation": "assign",
          "value": 0.1
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
          "multiplier": 0.9
        }
      ]
    },
    {
      "key": "potential5",
      "levels": 1,
      "modifiers": [
        {
          "kind": "patchSkillBlackboard",
          "skillGroupKey": "ultimate",
          "blackboardKey": "potential_5_duration",
          "operation": "assign",
          "value": 5
        }
      ],
      "initializationSequence": {
        "steps": [
          {
            "kind": "applyBuff",
            "parameters": {
              "buffId": "buff_chr_0019_karin_potential_5",
              "target": "caster",
              "inheritSourceSkillCastInfo": false
            }
          }
        ]
      }
    }
  ],
  "buffDefinitions": {
    "buff_chr_0019_karin_potential_1": {
      "stackingType": "unique",
      "priority": 0,
      "maxStackCount": 1,
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {
        "atk_up": 0,
        "duration": 0,
        "max_stack": 1
      },
      "attributeModifiers": [],
      "abilityEventResponses": [
        {
          "event": "skillSpGained",
          "priority": 0,
          "sequence": {
            "steps": [
              {
                "kind": "conditional",
                "parameters": {
                  "condition": {
                    "kind": "eventSpGainMatch",
                    "sources": [
                      "skill"
                    ],
                    "gainKinds": [
                      "gain"
                    ]
                  }
                },
                "whenTrue": {
                  "steps": [
                    {
                      "kind": "applyBuff",
                      "parameters": {
                        "buffId": "buff_chr_0019_karin_potential_1_1",
                        "target": "buffOwner",
                        "inheritSourceSkillCastInfo": true,
                        "blackboardAssignments": {
                          "duration": {
                            "kind": "blackboard",
                            "key": "duration"
                          },
                          "atk_up": {
                            "kind": "blackboard",
                            "key": "atk_up"
                          }
                        }
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
    "buff_chr_0019_karin_potential_1_1": {
      "stackingType": "enhanceAndRefresh",
      "priority": 0,
      "maxStackCount": 5,
      "durationSeconds": {
        "blackboardKey": "duration"
      },
      "presentation": {
        "visible": true,
        "iconId": "icon_battle_buff_atk_up",
        "iconPath": "/icons/icon_battle_buff_atk_up.webp",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": true,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderPriority": {
          "useDirectoryValue": false,
          "value": 0,
          "category": "CommonCharBuff"
        }
      },
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {
        "atk_up": 0,
        "duration": 5,
        "max_stack": 1
      },
      "attributeModifiers": [
        {
          "attribute": "Atk",
          "slot": "baseMultiplier",
          "value": {
            "blackboardKey": "atk_up"
          }
        }
      ]
    },
    "buff_chr_0019_karin_potential_3": {
      "stackingType": "unlimited",
      "priority": 0,
      "maxStackCount": 1,
      "presentation": {
        "visible": true,
        "iconId": "icon_battle_buff_atk_up",
        "iconPath": "/icons/icon_battle_buff_atk_up.webp",
        "showInHeadBarCommon": false,
        "showInHeadBarAttached": false,
        "showInSquadIcon": true,
        "onlyShowForMainCharacter": false,
        "iconStyleInSquad": "Default",
        "abnormalColorType": "Physical",
        "orderPriority": {
          "useDirectoryValue": false,
          "value": 0,
          "category": "CommonCharBuff"
        }
      },
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {
        "atk": 0.1
      },
      "attributeModifiers": [
        {
          "attribute": "Atk",
          "slot": "baseMultiplier",
          "value": {
            "blackboardKey": "atk"
          }
        }
      ]
    },
    "buff_chr_0019_karin_potential_5": {
      "stackingType": "unlimited",
      "priority": 0,
      "maxStackCount": 1,
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {},
      "attributeModifiers": []
    },
    "buff_chr_0019_karin_potential_5_combo": {
      "stackingType": "unlimited",
      "priority": 0,
      "maxStackCount": 1,
      "durationSeconds": {
        "blackboardKey": "potential_5_duration"
      },
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {
        "potential_5_duration": 0
      },
      "attributeModifiers": [],
      "lifecycleSequences": {
        "finish": {
          "steps": [
            {
              "kind": "finishBuffsById",
              "parameters": {
                "target": "buffOwner",
                "buffIds": [
                  "buff_chr_0019_karin_talent_2_combo"
                ],
                "reason": "other"
              }
            }
          ]
        }
      }
    },
    "buff_chr_0019_karin_talent_2": {
      "stackingType": "unlimited",
      "priority": 0,
      "maxStackCount": 1,
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {
        "potential_5_duration": 0
      },
      "attributeModifiers": [],
      "lifecycleSequences": {
        "finish": {
          "steps": [
            {
              "kind": "conditional",
              "parameters": {
                "condition": {
                  "kind": "buffIdStackCompare",
                  "target": "buffOwner",
                  "buffIds": [
                    "buff_chr_0019_karin_potential_5"
                  ],
                  "operator": "greaterOrEqual",
                  "value": {
                    "kind": "constant",
                    "value": 1
                  }
                },
                "alwaysNext": true
              },
              "whenTrue": {
                "steps": [
                  {
                    "kind": "applyBuff",
                    "parameters": {
                      "buffId": "buff_chr_0019_karin_potential_5_combo",
                      "target": "buffOwner",
                      "source": "eventSource",
                      "inheritSourceSkillCastInfo": true,
                      "blackboardAssignments": {
                        "potential_5_duration": {
                          "kind": "blackboard",
                          "key": "potential_5_duration"
                        }
                      }
                    }
                  }
                ]
              },
              "whenFalse": {
                "steps": [
                  {
                    "kind": "finishBuffsById",
                    "parameters": {
                      "target": "buffOwner",
                      "buffIds": [
                        "buff_chr_0019_karin_talent_2_combo"
                      ],
                      "reason": "other"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    },
    "buff_chr_0019_karin_talent_2_combo": {
      "stackingType": "unlimited",
      "priority": 0,
      "maxStackCount": 1,
      "applyTagIds": [],
      "extendTagIds": [],
      "blackboard": {
        "duration": 0,
        "imbue_scale": 0
      },
      "attributeModifiers": [],
      "lifecycleSequences": {
        "enable": {
          "steps": [
            {
              "kind": "createGlobalBuff",
              "parameters": {
                "globalBuffId": "global_buff_combo_trigger",
                "definition": {
                  "stackingType": "stack",
                  "maxStackCount": 4,
                  "durationSeconds": {
                    "blackboardKey": "duration"
                  },
                  "blackboard": {
                    "duration": 0,
                    "imbue_scale": 0
                  },
                  "children": [
                    {
                      "buffId": "buff_common_affixes_combo_trigger",
                      "blackboardAssignments": {
                        "imbue_scale": {
                          "kind": "blackboard",
                          "key": "imbue_scale"
                        }
                      }
                    }
                  ]
                },
                "source": "buffOwner",
                "finishByAction": true,
                "blackboardAssignments": {
                  "duration": {
                    "kind": "blackboard",
                    "key": "duration"
                  },
                  "imbue_scale": {
                    "kind": "blackboard",
                    "key": "imbue_scale"
                  }
                }
              }
            }
          ]
        }
      }
    }
  },
  "abilityEntityDefinitions": {},
  "conversionSupport": {
    "completeness": "complete",
    "missingCapabilities": []
  }
} as const satisfies OperatorDefinition;
