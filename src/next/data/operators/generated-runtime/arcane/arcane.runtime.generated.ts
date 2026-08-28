/** 由 tools/game-data-compiler 生成的角色常驻运行定义；不要手工编辑。 */
import type { OperatorRuntimeDefinition } from '../../../../core/game-data/operatorRuntimeDefinition';

// prettier-ignore
export default {
  "operatorSlug": "arcane",
  "entityBlackboard": {
    "EntityBB_consumed_layer": 0,
    "EntityBB_consumed_type": 0,
    "EntityBB_ult_hit": 0,
    "EntityBB_wisd_greater_will": 1
  },
  "comboSkillConditions": [
    {
      "key": "native-combo:0",
      "skillGroupKey": "comboSkill",
      "event": "beforeTakeInfliction",
      "initialValues": {
        "consumed_layer": 0,
        "consumed_type": 0
      },
      "sequence": {
        "steps": [
          {
            "kind": "conditional",
            "parameters": {
              "condition": {
                "kind": "contextTargetObjectTypeMatch",
                "contextKey": "trigger",
                "objectTypeMask": 16
              }
            },
            "whenTrue": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "eventInflictionElementIn",
                      "elements": [
                        "nature"
                      ]
                    }
                  },
                  "whenTrue": {
                    "steps": []
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "key": "native-combo:1",
      "skillGroupKey": "comboSkill",
      "event": "beforeTakeInfliction",
      "initialValues": {
        "consumed_layer": 0,
        "consumed_type": 0
      },
      "sequence": {
        "steps": [
          {
            "kind": "conditional",
            "parameters": {
              "condition": {
                "kind": "contextTargetObjectTypeMatch",
                "contextKey": "trigger",
                "objectTypeMask": 16
              }
            },
            "whenTrue": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "eventInflictionElementIn",
                      "elements": [
                        "heat"
                      ]
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "conditional",
                        "parameters": {
                          "condition": {
                            "kind": "contextTargetBuffStackCompare",
                            "contextKey": "trigger",
                            "tagQueryType": "hasAny",
                            "buffTags": [
                              "Skill/Character/Common/SpellInflict/FireInflict"
                            ],
                            "operator": "greaterOrEqual",
                            "value": {
                              "kind": "constant",
                              "value": 1
                            }
                          }
                        },
                        "whenTrue": {
                          "steps": []
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
      "key": "native-combo:2",
      "skillGroupKey": "comboSkill",
      "event": "beforeTakeInfliction",
      "initialValues": {
        "consumed_layer": 0,
        "consumed_type": 0
      },
      "sequence": {
        "steps": [
          {
            "kind": "conditional",
            "parameters": {
              "condition": {
                "kind": "contextTargetObjectTypeMatch",
                "contextKey": "trigger",
                "objectTypeMask": 16
              }
            },
            "whenTrue": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "eventInflictionElementIn",
                      "elements": [
                        "electric"
                      ]
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "conditional",
                        "parameters": {
                          "condition": {
                            "kind": "contextTargetBuffStackCompare",
                            "contextKey": "trigger",
                            "tagQueryType": "hasAny",
                            "buffTags": [
                              "Skill/Character/Common/SpellInflict/PulseInflict"
                            ],
                            "operator": "greaterOrEqual",
                            "value": {
                              "kind": "constant",
                              "value": 1
                            }
                          }
                        },
                        "whenTrue": {
                          "steps": []
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
      "key": "native-combo:3",
      "skillGroupKey": "comboSkill",
      "event": "beforeTakeInfliction",
      "initialValues": {
        "consumed_layer": 0,
        "consumed_type": 0
      },
      "sequence": {
        "steps": [
          {
            "kind": "conditional",
            "parameters": {
              "condition": {
                "kind": "contextTargetObjectTypeMatch",
                "contextKey": "trigger",
                "objectTypeMask": 16
              }
            },
            "whenTrue": {
              "steps": [
                {
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "eventInflictionElementIn",
                      "elements": [
                        "cryo"
                      ]
                    }
                  },
                  "whenTrue": {
                    "steps": [
                      {
                        "kind": "conditional",
                        "parameters": {
                          "condition": {
                            "kind": "contextTargetBuffStackCompare",
                            "contextKey": "trigger",
                            "tagQueryType": "hasAny",
                            "buffTags": [
                              "Skill/Character/Common/SpellInflict/CrystInflict"
                            ],
                            "operator": "greaterOrEqual",
                            "value": {
                              "kind": "constant",
                              "value": 1
                            }
                          }
                        },
                        "whenTrue": {
                          "steps": []
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
      "key": "native-combo:4",
      "skillGroupKey": "comboSkill",
      "event": "beforeTakeInfliction",
      "initialValues": {
        "consumed_layer": 0,
        "consumed_type": 0
      },
      "sequence": {
        "steps": [
          {
            "kind": "conditional",
            "parameters": {
              "condition": {
                "kind": "actionValueCompare",
                "left": {
                  "kind": "blackboard",
                  "key": "EntityBB_wisd_greater_will"
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
                  "kind": "conditional",
                  "parameters": {
                    "condition": {
                      "kind": "eventInflictionElementIn",
                      "elements": [
                        "heat",
                        "electric",
                        "cryo",
                        "nature"
                      ],
                      "outputKey": "EntityBB_consumed_type"
                    }
                  },
                  "whenTrue": {
                    "steps": []
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ],
  "skillMetadata": [
    {
      "skillGroupKey": "comboSkill",
      "sourceSkillId": "chr_0032_lizhiyan_combo_skill",
      "costFrame": 0,
      "smartTarget": "trigger"
    }
  ]
} as const satisfies OperatorRuntimeDefinition;
