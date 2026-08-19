/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const lastRiteBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    timelineBlockFrames: 20,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([30, 33, 36, 39, 42, 45, 48, 51, 54, 58, 62, 68]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct25:chr_0026_lastrite_attack111:actionOrder1:8'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const lastRiteBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    timelineBlockFrames: 29,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([28, 30, 33, 36, 39, 41, 44, 47, 50, 53, 57, 62]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct25:chr_0026_lastrite_attack211:actionOrder1:5'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([28, 30, 33, 36, 39, 41, 44, 47, 50, 53, 57, 62]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct25:chr_0026_lastrite_attack211:actionOrder2:14'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.28, 0.3, 0.33, 0.36, 0.39, 0.41, 0.44, 0.47, 0.5, 0.53, 0.57, 0.62],
    'display_atk_scale': [0.55, 0.61, 0.66, 0.72, 0.77, 0.83, 0.88, 0.94, 0.99, 1.06, 1.14, 1.24],
  },
);

export const lastRiteBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    timelineBlockFrames: 36,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([34, 37, 41, 44, 48, 51, 54, 58, 61, 65, 71, 77]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct25:chr_0026_lastrite_attack311:actionOrder1:5'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([34, 37, 41, 44, 48, 51, 54, 58, 61, 65, 71, 77]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct25:chr_0026_lastrite_attack311:actionOrder2:14'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.34, 0.37, 0.41, 0.44, 0.48, 0.51, 0.54, 0.58, 0.61, 0.65, 0.71, 0.77],
    'display_atk_scale': [0.68, 0.75, 0.82, 0.88, 0.95, 1.02, 1.09, 1.16, 1.22, 1.31, 1.41, 1.53],
  },
);

export const lastRiteBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    timelineBlockFrames: 46,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                { kind: 'casterControlled' },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'isBuffed',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        17,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                { kind: 'casterControlled' },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'isBuffed',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([90, 99, 108, 117, 126, 135, 144, 153, 162, 173, 187, 203]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 25,
          }, '12:basicAttack46:direct25:chr_0026_lastrite_attack411:actionOrder2:12'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'isBuffed': 0,
    'atb': 30,
    'atk_scale': [0.9, 0.99, 1.08, 1.17, 1.26, 1.35, 1.44, 1.53, 1.62, 1.73, 1.87, 2.03],
    'poise': 25,
  },
);

export const lastRiteFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    timelineBlockFrames: 40,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_power_attack_disable_cast_skill',
            definition: {
              stackingType: 'unlimited',
              priority: 0,
              maxStackCount: 0,
              applyTagIds: [-1601691447, 817018340, -1486085048, -496376350, 2002680355],
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_medium',
            definition: {
              stackingType: 'unlimited',
              priority: 0,
              maxStackCount: 0,
              durationSeconds: { blackboardKey: 'duration' },
              applyTagIds: [782082172, -104052028, -886962248],
              blackboard: {
                'duration': 9999,
              },
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        40,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
          }, '8:finisher6:direct30:chr_0026_lastrite_power_attack11:actionOrder2:20'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const lastRitePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct37:chr_0026_lastrite_plunging_attack_end11:actionOrder1:2'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const lastRiteBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    timelineBlockFrames: 34,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'constant', value: 0.5 },
          }),
          step('modifyActionValue', {
            key: 'EntityBB_ns_atkscale1',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'atk_scale' },
          }),
          step('modifyActionValue', {
            key: 'EntityBB_ns_atkscale2',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'atk_scale' },
          }),
          step('modifyActionValue', {
            key: 'EntityBB_ns_atb',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'atb' },
          }),
        ),
      ),
      scheduled(
        6,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0026_lastrite_normal_skill_main_start',
            definition: {
              stackingType: 'stack',
              priority: 0,
              maxStackCount: 1,
              durationSeconds: 1.5,
              blackboard: {
                'atb': 0,
                'atk_scale': 0,
                'atk_up': 0,
                'duration': 0,
                'potential_1': 0,
                'usp': 0,
              },
              scheduledSequences: [
                scheduled(
                  26,
                  sequence(
                    step('finishBuffsById', {
                      target: 'party',
                      buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
                      reason: 'other',
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0026_lastrite_normal_skill_self',
                      definition: {
                        stackingType: 'stack',
                        priority: 0,
                        maxStackCount: 1,
                        durationSeconds: { blackboardKey: 'duration' },
                        blackboard: {
                          'atb': 0,
                          'atk_scale': 0,
                          'atk_up': 0,
                          'duration': 0,
                          'poise': 0,
                          'potential_1': 0,
                        },
                        lifecycleSequences: {
                          start: sequence(
                            step('applyBuff', {
                              buffId: 'buff_chr_0026_lastrite_normal_skill',
                              definition: {
                                stackingType: 'stack',
                                priority: 0,
                                maxStackCount: 1,
                                durationSeconds: { blackboardKey: 'duration' },
                                blackboard: {
                                  'atb': 30,
                                  'atk_scale': 3,
                                  'atk_up': 0,
                                  'duration': 15,
                                  'poise': 0,
                                  'potential_1': 0,
                                },
                                damageModifiers: [
                                  {
                                    enabledSide: 'attacker',
                                    condition: {
                                      kind: 'all',
                                      conditions: [
                                        {
                                          kind: 'casterControlled',
                                        },
                                        {
                                          kind: 'eventDamageTagsMatch',
                                          match: 'hasAny',
                                          tags: ['normalAttackLastCombo'],
                                        },
                                        {
                                          kind: 'buffBlackboardCompare',
                                          left: { blackboardKey: 'potential_1' },
                                          operator: 'equal',
                                          right: 1,
                                        },
                                      ],
                                    },
                                    processors: [
                                      {
                                        kind: 'damageScale',
                                        side: 'attacker',
                                        zone: 'normal',
                                        addition: { blackboardKey: 'atk_up' },
                                      },
                                    ],
                                  },
                                ],
                                abilityEventResponses: [
                                  {
                                    event: 'outputDamage',
                                    priority: 0,
                                    sequence:
                                      sequence(
                                        branch(
                                          {
                                            kind: 'eventDamageTagsMatch',
                                            match: 'hasAny',
                                            tags: ['normalAttackLastCombo'],
                                          },
                                          sequence(
                                            branch(
                                              { kind: 'casterControlled' },
                                              sequence(
                                                branch(
                                                  {
                                                    kind: 'actionValueCompare',
                                                    left: { kind: 'blackboard', key: 'potential_1' },
                                                    operator: 'equal',
                                                    right: { kind: 'constant', value: 1 },
                                                  },
                                                  sequence(
                                                    step('dealStagger', {
                                                      value: { kind: 'blackboard', key: 'poise' },
                                                    }),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                  },
                                  {
                                    event: 'outputDamage',
                                    priority: 0,
                                    sequence:
                                      sequence(
                                        branch(
                                          {
                                            kind: 'eventDamageTagsMatch',
                                            match: 'hasAny',
                                            tags: ['normalAttackLastCombo'],
                                          },
                                          sequence(
                                            branch(
                                              { kind: 'casterControlled' },
                                              sequence(
                                                branch(
                                                  {
                                                    kind: 'entityTagMatch',
                                                    target: 'caster',
                                                    tagQueryType: 'hasAny',
                                                    tagIds: [264623624],
                                                  },
                                                  sequence(
                                                    step('applyBuff', {
                                                      buffId: 'buff_chr_0026_lastrite_normal_skill_phantom_main',
                                                      definition: {
                                                        stackingType: 'unlimited',
                                                        priority: 0,
                                                        maxStackCount: 2,
                                                        durationSeconds: 3,
                                                        blackboard: {
                                                          'atk_scale1': 0,
                                                          'atk_scale2': 0,
                                                        },
                                                        scheduledSequences: [
                                                          scheduled(
                                                            21,
                                                            sequence(
                                                              step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                                                              step('dealDamage', {
                                                                damageType: 'cryo',
                                                                attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                                                                tags: ['normalSkill'],
                                                                features: ['canBreakWeakness'],
                                                              }, '48:buff_chr_0026_lastrite_normal_skill_phantom_main4:buff48:buff_chr_0026_lastrite_normal_skill_phantom_main11:actionOrder2:12'),
                                                            ),
                                                          ),
                                                          scheduled(
                                                            21,
                                                            sequence(
                                                              step('dealDamage', {
                                                                damageType: 'cryo',
                                                                attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                                                                tags: ['normalSkill'],
                                                                features: ['canBreakWeakness'],
                                                              }, '48:buff_chr_0026_lastrite_normal_skill_phantom_main4:buff48:buff_chr_0026_lastrite_normal_skill_phantom_main11:actionOrder2:15'),
                                                            ),
                                                          ),
                                                        ],
                                                      },
                                                      target: 'enemy',
                                                      inheritSourceSkillCastInfo: true,
                                                      blackboardAssignments: {
                                                        'atk_scale1': { kind: 'blackboard', key: 'atk_scale' },
                                                      },
                                                    }),
                                                    step('applyBuff', {
                                                      buffId: 'buff_chr_0026_lastrite_normal_skill_tag',
                                                      definition: {
                                                        stackingType: 'stack',
                                                        priority: 0,
                                                        maxStackCount: 1,
                                                        abilityEventResponses: [
                                                          {
                                                            event: 'addedBuff',
                                                            priority: 0,
                                                            sequence:
                                                              sequence(
                                                                step('finishBuffsById', {
                                                                  target: 'party',
                                                                  buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                                                                  reason: 'other',
                                                                }),
                                                                step('finishBuffsById', {
                                                                  target: 'caster',
                                                                  buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
                                                                  reason: 'other',
                                                                }),
                                                              ),
                                                          },
                                                        ],
                                                      },
                                                      target: 'caster',
                                                      inheritSourceSkillCastInfo: true,
                                                    }),
                                                  ),
                                                  sequence(
                                                    step('applyBuff', {
                                                      buffId: 'buff_chr_0026_lastrite_normal_skill_phantom',
                                                      definition: {
                                                        stackingType: 'unlimited',
                                                        priority: 0,
                                                        maxStackCount: 2,
                                                        durationSeconds: 3,
                                                        blackboard: {
                                                          'atk_scale': 0,
                                                        },
                                                        scheduledSequences: [
                                                          scheduled(
                                                            9,
                                                            sequence(
                                                              step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                                                              step('dealDamage', {
                                                                damageType: 'cryo',
                                                                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                                                tags: ['normalSkill'],
                                                                features: ['canBreakWeakness'],
                                                              }, '43:buff_chr_0026_lastrite_normal_skill_phantom4:buff43:buff_chr_0026_lastrite_normal_skill_phantom11:actionOrder1:7'),
                                                            ),
                                                          ),
                                                          scheduled(
                                                            9,
                                                            sequence(
                                                              step('dealDamage', {
                                                                damageType: 'cryo',
                                                                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                                                tags: ['normalSkill'],
                                                                features: ['canBreakWeakness'],
                                                              }, '43:buff_chr_0026_lastrite_normal_skill_phantom4:buff43:buff_chr_0026_lastrite_normal_skill_phantom11:actionOrder2:10'),
                                                            ),
                                                          ),
                                                        ],
                                                      },
                                                      target: 'enemy',
                                                      inheritSourceSkillCastInfo: true,
                                                      blackboardAssignments: {
                                                        'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                                                      },
                                                    }),
                                                    step('applyBuff', {
                                                      buffId: 'buff_chr_0026_lastrite_normal_skill_tag',
                                                      definition: {
                                                        stackingType: 'stack',
                                                        priority: 0,
                                                        maxStackCount: 1,
                                                        abilityEventResponses: [
                                                          {
                                                            event: 'addedBuff',
                                                            priority: 0,
                                                            sequence:
                                                              sequence(
                                                                step('finishBuffsById', {
                                                                  target: 'party',
                                                                  buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                                                                  reason: 'other',
                                                                }),
                                                                step('finishBuffsById', {
                                                                  target: 'caster',
                                                                  buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
                                                                  reason: 'other',
                                                                }),
                                                              ),
                                                          },
                                                        ],
                                                      },
                                                      target: 'caster',
                                                      inheritSourceSkillCastInfo: true,
                                                    }),
                                                  ),
                                                ),
                                                step('createTimedMarker', {
                                                  target: 'caster',
                                                  markerId: 'buff_chr_0026_lastrite_normal_skill_marker',
                                                  durationSeconds: { kind: 'constant', value: 0.1 },
                                                  autoFinishByAction: false,
                                                }),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                  },
                                ],
                              },
                              target: 'party',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                'duration': { kind: 'blackboard', key: 'duration' },
                                'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                                'atb': { kind: 'blackboard', key: 'atb' },
                                'poise': { kind: 'blackboard', key: 'poise' },
                                'atk_up': { kind: 'blackboard', key: 'atk_up' },
                                'potential_1': { kind: 'blackboard', key: 'potential_1' },
                              },
                            }),
                            step('changeResourceByActionValue', {
                              resource: 'sp',
                              amount: { kind: 'blackboard', key: 'atb' },
                              recipient: 'team',
                              spGainKind: 'refund',
                              spGainSource: 'skill',
                            }),
                          ),
                        },
                      },
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                        'duration': { kind: 'blackboard', key: 'duration' },
                        'atb': { kind: 'blackboard', key: 'atb' },
                        'atk_up': { kind: 'blackboard', key: 'atk_up' },
                        'potential_1': { kind: 'blackboard', key: 'potential_1' },
                      },
                    }),
                    step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                  ),
                ),
              ],
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
              'duration': { kind: 'blackboard', key: 'duration' },
              'atb': { kind: 'blackboard', key: 'atb' },
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
              'potential_1': { kind: 'blackboard', key: 'potential_1' },
              'usp': { kind: 'blackboard', key: 'usp' },
            },
          }),
        ),
      ),
      scheduled(
        300,
        sequence(
          step('finishBuffsById', {
            target: 'party',
            buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
            reason: 'other',
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0026_lastrite_normal_skill_self',
            definition: {
              stackingType: 'stack',
              priority: 0,
              maxStackCount: 1,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'atb': 0,
                'atk_scale': 0,
                'atk_up': 0,
                'duration': 0,
                'poise': 0,
                'potential_1': 0,
              },
              lifecycleSequences: {
                start: sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0026_lastrite_normal_skill',
                    definition: {
                      stackingType: 'stack',
                      priority: 0,
                      maxStackCount: 1,
                      durationSeconds: { blackboardKey: 'duration' },
                      blackboard: {
                        'atb': 30,
                        'atk_scale': 3,
                        'atk_up': 0,
                        'duration': 15,
                        'poise': 0,
                        'potential_1': 0,
                      },
                      damageModifiers: [
                        {
                          enabledSide: 'attacker',
                          condition: {
                            kind: 'all',
                            conditions: [
                              {
                                kind: 'casterControlled',
                              },
                              {
                                kind: 'eventDamageTagsMatch',
                                match: 'hasAny',
                                tags: ['normalAttackLastCombo'],
                              },
                              {
                                kind: 'buffBlackboardCompare',
                                left: { blackboardKey: 'potential_1' },
                                operator: 'equal',
                                right: 1,
                              },
                            ],
                          },
                          processors: [
                            {
                              kind: 'damageScale',
                              side: 'attacker',
                              zone: 'normal',
                              addition: { blackboardKey: 'atk_up' },
                            },
                          ],
                        },
                      ],
                      abilityEventResponses: [
                        {
                          event: 'outputDamage',
                          priority: 0,
                          sequence:
                            sequence(
                              branch(
                                {
                                  kind: 'eventDamageTagsMatch',
                                  match: 'hasAny',
                                  tags: ['normalAttackLastCombo'],
                                },
                                sequence(
                                  branch(
                                    { kind: 'casterControlled' },
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'potential_1' },
                                          operator: 'equal',
                                          right: { kind: 'constant', value: 1 },
                                        },
                                        sequence(
                                          step('dealStagger', {
                                            value: { kind: 'blackboard', key: 'poise' },
                                          }),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                        },
                        {
                          event: 'outputDamage',
                          priority: 0,
                          sequence:
                            sequence(
                              branch(
                                {
                                  kind: 'eventDamageTagsMatch',
                                  match: 'hasAny',
                                  tags: ['normalAttackLastCombo'],
                                },
                                sequence(
                                  branch(
                                    { kind: 'casterControlled' },
                                    sequence(
                                      branch(
                                        {
                                          kind: 'entityTagMatch',
                                          target: 'caster',
                                          tagQueryType: 'hasAny',
                                          tagIds: [264623624],
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0026_lastrite_normal_skill_phantom_main',
                                            definition: {
                                              stackingType: 'unlimited',
                                              priority: 0,
                                              maxStackCount: 2,
                                              durationSeconds: 3,
                                              blackboard: {
                                                'atk_scale1': 0,
                                                'atk_scale2': 0,
                                              },
                                              scheduledSequences: [
                                                scheduled(
                                                  21,
                                                  sequence(
                                                    step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                                                    step('dealDamage', {
                                                      damageType: 'cryo',
                                                      attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                                                      tags: ['normalSkill'],
                                                      features: ['canBreakWeakness'],
                                                    }, '48:buff_chr_0026_lastrite_normal_skill_phantom_main4:buff48:buff_chr_0026_lastrite_normal_skill_phantom_main11:actionOrder2:12'),
                                                  ),
                                                ),
                                                scheduled(
                                                  21,
                                                  sequence(
                                                    step('dealDamage', {
                                                      damageType: 'cryo',
                                                      attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                                                      tags: ['normalSkill'],
                                                      features: ['canBreakWeakness'],
                                                    }, '48:buff_chr_0026_lastrite_normal_skill_phantom_main4:buff48:buff_chr_0026_lastrite_normal_skill_phantom_main11:actionOrder2:15'),
                                                  ),
                                                ),
                                              ],
                                            },
                                            target: 'enemy',
                                            inheritSourceSkillCastInfo: true,
                                            blackboardAssignments: {
                                              'atk_scale1': { kind: 'blackboard', key: 'atk_scale' },
                                            },
                                          }),
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0026_lastrite_normal_skill_tag',
                                            definition: {
                                              stackingType: 'stack',
                                              priority: 0,
                                              maxStackCount: 1,
                                              abilityEventResponses: [
                                                {
                                                  event: 'addedBuff',
                                                  priority: 0,
                                                  sequence:
                                                    sequence(
                                                      step('finishBuffsById', {
                                                        target: 'party',
                                                        buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                                                        reason: 'other',
                                                      }),
                                                      step('finishBuffsById', {
                                                        target: 'caster',
                                                        buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
                                                        reason: 'other',
                                                      }),
                                                    ),
                                                },
                                              ],
                                            },
                                            target: 'caster',
                                            inheritSourceSkillCastInfo: true,
                                          }),
                                        ),
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0026_lastrite_normal_skill_phantom',
                                            definition: {
                                              stackingType: 'unlimited',
                                              priority: 0,
                                              maxStackCount: 2,
                                              durationSeconds: 3,
                                              blackboard: {
                                                'atk_scale': 0,
                                              },
                                              scheduledSequences: [
                                                scheduled(
                                                  9,
                                                  sequence(
                                                    step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                                                    step('dealDamage', {
                                                      damageType: 'cryo',
                                                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                                      tags: ['normalSkill'],
                                                      features: ['canBreakWeakness'],
                                                    }, '43:buff_chr_0026_lastrite_normal_skill_phantom4:buff43:buff_chr_0026_lastrite_normal_skill_phantom11:actionOrder1:7'),
                                                  ),
                                                ),
                                                scheduled(
                                                  9,
                                                  sequence(
                                                    step('dealDamage', {
                                                      damageType: 'cryo',
                                                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                                      tags: ['normalSkill'],
                                                      features: ['canBreakWeakness'],
                                                    }, '43:buff_chr_0026_lastrite_normal_skill_phantom4:buff43:buff_chr_0026_lastrite_normal_skill_phantom11:actionOrder2:10'),
                                                  ),
                                                ),
                                              ],
                                            },
                                            target: 'enemy',
                                            inheritSourceSkillCastInfo: true,
                                            blackboardAssignments: {
                                              'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                                            },
                                          }),
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0026_lastrite_normal_skill_tag',
                                            definition: {
                                              stackingType: 'stack',
                                              priority: 0,
                                              maxStackCount: 1,
                                              abilityEventResponses: [
                                                {
                                                  event: 'addedBuff',
                                                  priority: 0,
                                                  sequence:
                                                    sequence(
                                                      step('finishBuffsById', {
                                                        target: 'party',
                                                        buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                                                        reason: 'other',
                                                      }),
                                                      step('finishBuffsById', {
                                                        target: 'caster',
                                                        buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
                                                        reason: 'other',
                                                      }),
                                                    ),
                                                },
                                              ],
                                            },
                                            target: 'caster',
                                            inheritSourceSkillCastInfo: true,
                                          }),
                                        ),
                                      ),
                                      step('createTimedMarker', {
                                        target: 'caster',
                                        markerId: 'buff_chr_0026_lastrite_normal_skill_marker',
                                        durationSeconds: { kind: 'constant', value: 0.1 },
                                        autoFinishByAction: false,
                                      }),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                        },
                      ],
                    },
                    target: 'party',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration': { kind: 'blackboard', key: 'duration' },
                      'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                      'atb': { kind: 'blackboard', key: 'atb' },
                      'poise': { kind: 'blackboard', key: 'poise' },
                      'atk_up': { kind: 'blackboard', key: 'atk_up' },
                      'potential_1': { kind: 'blackboard', key: 'potential_1' },
                    },
                  }),
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'refund',
                    spGainSource: 'skill',
                  }),
                ),
              },
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
              'duration': { kind: 'blackboard', key: 'duration' },
              'atb': { kind: 'blackboard', key: 'atb' },
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
              'potential_1': { kind: 'blackboard', key: 'potential_1' },
              'poise': { kind: 'blackboard', key: 'poise' },
            },
          }),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
            ultimateRecoveryTagId: 264623624,
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [1.42, 1.56, 1.71, 1.85, 1.99, 2.13, 2.28, 2.42, 2.56, 2.74, 2.95, 3.2],
    'duration': 15,
    'atb': 30,
    'atk_up': 0.2,
    'potential_1': 0,
    'usp': 16,
    'poise': 5,
  },
);

export const lastRiteComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    timelineBlockFrames: 65,
    cooldownFrames: [270, 270, 270, 270, 270, 270, 270, 270, 270, 270, 270, 240],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.6 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        15,
      ),
      scheduled(
        2,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0026_lastrite_combo_skill_hitstop',
            definition: {
              stackingType: 'stack',
              priority: 0,
              maxStackCount: 1,
              durationSeconds: 2,
            },
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([71, 78, 85, 92, 99, 107, 114, 121, 128, 137, 147, 160]),
            tags: ['comboSkill'],
          }, '10:comboSkill6:direct29:chr_0026_lastrite_combo_skill11:actionOrder2:13'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp_base' },
            recipient: 'caster',
            ultimateRecoveryTagId: 264623624,
          }),
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'current',
              operator: 'lessOrEqual',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'blackboard', key: 'infliction_num' },
                recipient: 'caster',
                ultimateRecoveryTagId: 264623624,
              }),
              step('modifyActionValue', {
                key: 'recover_usp',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        63,
        sequence(
          step('calculateActionValue', {
            key: 'final_combo_atkscale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale3' },
            right: { kind: 'blackboard', key: 'infliction_num' },
          }),
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: { kind: 'blackboard', key: 'final_combo_atkscale' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '10:comboSkill6:direct29:chr_0026_lastrite_combo_skill11:actionOrder2:25'),
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([71, 78, 85, 92, 99, 107, 114, 121, 128, 137, 147, 160]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 15,
          }, '10:comboSkill6:direct29:chr_0026_lastrite_combo_skill11:actionOrder2:26'),
        ),
      ),
      scheduled(
        63,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'recover_usp' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'infliction_num_total' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 4 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp' },
                    coefficient: 4,
                    recipient: 'caster',
                    ultimateRecoveryTagId: 264623624,
                  }),
                ),
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp' },
                    coefficient: { kind: 'blackboard', key: 'infliction_num_total' },
                    recipient: 'caster',
                    ultimateRecoveryTagId: 264623624,
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'infliction_num_total': 0,
    'recover_usp': 0,
    'atk_scale': [0.71, 0.78, 0.85, 0.92, 0.99, 1.07, 1.14, 1.21, 1.28, 1.37, 1.47, 1.6],
    'atk_scale2': [0.71, 0.78, 0.85, 0.92, 0.99, 1.07, 1.14, 1.21, 1.28, 1.37, 1.47, 1.6],
    'atk_scale3': [1.07, 1.17, 1.28, 1.39, 1.49, 1.6, 1.71, 1.81, 1.92, 2.05, 2.21, 2.4],
    'count': 3,
    'poise': 15,
    'usp': 15,
    'usp_base': 40,
  },
);

export const lastRiteUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    timelineBlockFrames: 140,
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 240 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: 1464849466,
            priority: 10,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        3,
      ),
      scheduled(
        0,
        sequence(
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        85,
      ),
      scheduled(
        85,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 2 },
            slot: 1464849466,
            priority: 50,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        145,
      ),
      scheduled(
        86,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([178, 196, 213, 231, 249, 267, 284, 302, 320, 342, 369, 400]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '8:ultimate11:conditional19:timelineActions[25]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:47'),
        ),
      ),
      scheduled(
        86,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.1 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        86,
      ),
      scheduled(
        105,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([178, 196, 213, 231, 249, 267, 284, 302, 320, 342, 369, 400]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '8:ultimate11:conditional19:timelineActions[26]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:57'),
        ),
      ),
      scheduled(
        134,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([356, 391, 427, 462, 498, 533, 569, 604, 640, 684, 738, 800]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '8:ultimate11:conditional19:timelineActions[27]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:67'),
        ),
      ),
    ],
  },
  {
    'talent_2': 0,
    'atk_scale': [1.78, 1.96, 2.13, 2.31, 2.49, 2.67, 2.84, 3.02, 3.2, 3.42, 3.69, 4],
    'atk_scale2': [3.56, 3.91, 4.27, 4.62, 4.98, 5.33, 5.69, 6.04, 6.4, 6.84, 7.38, 8],
    'poise1': 5,
    'poise2': 10,
    'usp': 10,
  },
);

export const lastRiteGeneratedOperator: OperatorDefinition = {
  slug: 'last-rite',
  gameId: 'LAST RITE',
  rarity: 6,
  weaponType: 'greatsword',
  element: 'cryo',
  role: 'striker',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [21, 50, 80, 110, 140, 155],
    agility: [8, 29, 50, 72, 93, 104],
    intellect: [9, 27, 46, 65, 84, 93],
    will: [15, 35, 56, 77, 98, 109],
    baseAttack: [30, 95, 162, 230, 298, 332],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [lastRiteBasicAttack1, lastRiteBasicAttack2, lastRiteBasicAttack3, lastRiteBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: lastRiteFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: lastRitePlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: lastRiteBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: lastRiteUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: lastRiteComboSkill },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [],
      eventHandlers: [
        {
          event: { kind: 'elementalAttachmentConsumed' },
          blackboard: {
            'crystal_up': [0.02, 0.04],
            'duration': 15,
          },
          sequence: sequence(
            step('calculateActionValue', {
              key: 'crystal_vul',
              operation: 'multiply',
              left: { kind: 'blackboard', key: 'infliction_num' },
              right: { kind: 'blackboard', key: 'crystal_up' },
            }),
            step('applyBuff', {
              buffId: 'buff_chr_0026_lastrite_talent_1_vul',
              definition: {
                stackingType: 'highPriority',
                priority: { blackboardKey: 'crystal_vul' },
                maxStackCount: 1,
                durationSeconds: { blackboardKey: 'duration' },
                blackboard: {
                  'crystal_vul': 0,
                  'duration': 0,
                  'real_duration': 0,
                },
                damageModifiers: [
                  {
                    enabledSide: 'defender',
                    condition: {
                      kind: 'eventDamageTypesMatch',
                      damageTypes: ['cryo'],
                    },
                    processors: [
                      {
                        kind: 'damageScale',
                        side: 'defender',
                        zone: 'vulnerable',
                        addition: { blackboardKey: 'crystal_vul' },
                      },
                    ],
                  },
                ],
              },
              target: 'enemy',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                'crystal_vul': { kind: 'blackboard', key: 'crystal_vul' },
                'duration': { kind: 'blackboard', key: 'duration' },
              },
            }),
          ),
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_2',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'rate',
          operation: 'assign',
          value: [1.2, 1.5],
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'poise',
          operation: 'assign',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_1',
          operation: 'assign',
          value: 1,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['strength'],
          value: 20,
        },
        { kind: 'addStaticDamageIncrease', target: 'cryo', value: 0.1 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale2',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale3',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale2',
          operation: 'multiply',
          value: 1.15,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillGroupKey: 'ultimate',
          resource: 'ultimateEnergy',
          multiplier: 0.85,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb',
          operation: 'add',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.2,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'skillBehavior', skillGroupKeys: ['ultimate'] }] },
};
