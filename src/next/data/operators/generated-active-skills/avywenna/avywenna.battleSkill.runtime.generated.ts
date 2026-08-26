/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';

// prettier-ignore
export const supplementalBuffDefinitions = {
  "buff_chr_0012_avywen_lance_becalled_ready": {
    "stackingType": "unique",
    "priority": 0,
    "maxStackCount": 1,
    "durationSeconds": 2,
    "applyTagIds": [],
    "extendTagIds": [],
    "blackboard": {},
    "attributeModifiers": []
  }
} as const satisfies OperatorBuffDefinitions;

// prettier-ignore
export default {
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
                                                      }
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
                                                      }
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
} as const satisfies SkillDefinition;
