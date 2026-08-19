/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const daPanBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([28, 31, 34, 37, 39, 42, 45, 48, 51, 54, 58, 63]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct22:chr_0018_dapan_attack111:actionOrder1:8'),
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
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
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.28, 0.31, 0.34, 0.37, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.63],
  },
);

export const daPanBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    timelineBlockFrames: 20,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([34, 37, 40, 44, 47, 50, 54, 57, 60, 64, 70, 75]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0018_dapan_attack211:actionOrder1:6'),
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
    'atk_scale': [0.34, 0.37, 0.4, 0.44, 0.47, 0.5, 0.54, 0.57, 0.6, 0.64, 0.7, 0.75],
  },
);

export const daPanBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    timelineBlockFrames: 25,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([17, 18, 20, 22, 23, 25, 27, 28, 30, 32, 35, 38]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct22:chr_0018_dapan_attack311:actionOrder1:9'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: 0.5,
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([34, 37, 40, 44, 47, 50, 54, 57, 60, 64, 70, 75]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct22:chr_0018_dapan_attack311:actionOrder2:18'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.5,
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
    'atk_scale': [0.17, 0.18, 0.2, 0.22, 0.23, 0.25, 0.27, 0.28, 0.3, 0.32, 0.35, 0.38],
    'atk_scale_2': [0.34, 0.37, 0.4, 0.44, 0.47, 0.5, 0.54, 0.57, 0.6, 0.64, 0.7, 0.75],
    'display_atk_scale': [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.97, 1.04, 1.13],
  },
);

export const daPanBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    timelineBlockFrames: 45,
    scheduledSequences: [
      scheduled(
        32,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([60, 66, 72, 78, 84, 90, 96, 103, 109, 116, 125, 136]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 20,
          }, '12:basicAttack46:direct22:chr_0018_dapan_attack411:actionOrder1:7'),
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
    'atb': 21,
    'atk_scale': [0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 0.96, 1.03, 1.09, 1.16, 1.25, 1.36],
    'poise': 20,
  },
);

export const daPanFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    timelineBlockFrames: 35,
    availability: { kind: 'targetStaggered', target: 'enemy' },
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
        16,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.4,
          }, '8:finisher6:direct27:chr_0018_dapan_power_attack11:actionOrder1:6'),
        ),
      ),
      scheduled(
        35,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.6,
          }, '8:finisher6:direct27:chr_0018_dapan_power_attack11:actionOrder2:10'),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const daPanPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    timelineBlockFrames: 16,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct34:chr_0018_dapan_plunging_attack_end11:actionOrder1:4'),
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
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const daPanBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    timelineBlockFrames: 65,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([18, 20, 22, 23, 25, 27, 29, 31, 32, 35, 37, 41]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '11:battleSkill6:direct27:chr_0018_dapan_normal_skill11:actionOrder2:30'),
        ),
      ),
      scheduled(
        43,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5_interval' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'potential_5_interval' } },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_physical_no_guard',
                    definition: {
                      stackingType: 'enhanceAndRefresh',
                      priority: 100,
                      maxStackCount: 4,
                      durationSeconds: { blackboardKey: 'duration' },
                      applyTagIds: [1075718177],
                      blackboard: {
                        'atk_scale': 0,
                        'count': 0,
                        'duration': 20,
                        'skip_handle_cryst_break': 0,
                      },
                      lifecycleSequences: {
                        start: sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 0 },
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_handle_cryst_break',
                                definition: {
                                  stackingType: 'stack',
                                  priority: 0,
                                  maxStackCount: 1,
                                  durationSeconds: 10,
                                  triggerIntervalSeconds: 0,
                                  waitFirstTriggerInterval: true,
                                  maxTriggerCount: 1,
                                  blackboard: {
                                    'atk_scale': 0,
                                    'count': 0,
                                  },
                                  lifecycleSequences: {
                                    start: sequence(
                                      step('readBuffBlackboard', {
                                        target: 'enemy',
                                        query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1535684437] },
                                        desiredKey: 'count',
                                        outputKey: 'count',
                                      }),
                                      step('finishBuffsByTag', {
                                        target: 'enemy',
                                        tagQueryType: 'hasAny',
                                        buffTagIds: [1535684437],
                                        reason: 'early',
                                      }),
                                      step('applyBuff', {
                                        buffId: 'buff_common_cryst_triggered_physical_break',
                                        definition: {
                                          stackingType: 'unlimited',
                                          priority: 0,
                                          maxStackCount: 0,
                                          durationSeconds: 5,
                                          applyTagIds: [-615023885],
                                          blackboard: {
                                            'atk_scale': 0,
                                          },
                                          lifecycleSequences: {
                                            start: sequence(
                                              step('dealDamage', {
                                                damageType: 'physical',
                                                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                                tags: [],
                                                features: ['shatter'],
                                              }, '50:buff_common_cryst_triggered_physical_break:start:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:0'),
                                            ),
                                          },
                                        },
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: true,
                                        blackboardAssignments: {
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                                        },
                                      }),
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'count' },
                                          operator: 'equal',
                                          right: { kind: 'constant', value: 0 },
                                        },
                                        sequence(
                                          step('startTimeDilation', {
                                            scope: 'entity',
                                            durationSeconds: { kind: 'constant', value: 0.1 },
                                            slot: 1464849466,
                                            priority: 15,
                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                            finishByAction: false,
                                            targets: ['caster', 'caster'],
                                          }),
                                        ),
                                        sequence(
                                          branch(
                                            {
                                              kind: 'actionValueCompare',
                                              left: { kind: 'blackboard', key: 'count' },
                                              operator: 'equal',
                                              right: { kind: 'constant', value: 1 },
                                            },
                                            sequence(
                                              step('startTimeDilation', {
                                                scope: 'entity',
                                                durationSeconds: { kind: 'constant', value: 0.1 },
                                                slot: 1464849466,
                                                priority: 10,
                                                curve: { kind: 'named', key: 'interrupt_weakness' },
                                                finishByAction: false,
                                                targets: ['caster', 'caster'],
                                              }),
                                            ),
                                            sequence(
                                              branch(
                                                {
                                                  kind: 'actionValueCompare',
                                                  left: { kind: 'blackboard', key: 'count' },
                                                  operator: 'equal',
                                                  right: { kind: 'constant', value: 2 },
                                                },
                                                sequence(
                                                  step('startTimeDilation', {
                                                    scope: 'entity',
                                                    durationSeconds: { kind: 'constant', value: 0.25 },
                                                    slot: 1464849466,
                                                    priority: 20,
                                                    curve: { kind: 'named', key: 'interrupt_weakness' },
                                                    finishByAction: false,
                                                    targets: ['caster', 'caster'],
                                                  }),
                                                ),
                                                sequence(
                                                  branch(
                                                    {
                                                      kind: 'actionValueCompare',
                                                      left: { kind: 'blackboard', key: 'count' },
                                                      operator: 'equal',
                                                      right: { kind: 'constant', value: 3 },
                                                    },
                                                    sequence(
                                                      step('startTimeDilation', {
                                                        scope: 'entity',
                                                        durationSeconds: { kind: 'constant', value: 0.5 },
                                                        slot: 1464849466,
                                                        priority: 20,
                                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                                        finishByAction: false,
                                                        targets: ['caster', 'caster'],
                                                      }),
                                                    ),
                                                    sequence(
                                                      branch(
                                                        {
                                                          kind: 'actionValueCompare',
                                                          left: { kind: 'blackboard', key: 'count' },
                                                          operator: 'equal',
                                                          right: { kind: 'constant', value: 4 },
                                                        },
                                                        sequence(
                                                          step('startTimeDilation', {
                                                            scope: 'entity',
                                                            durationSeconds: { kind: 'constant', value: 0.65 },
                                                            slot: 1464849466,
                                                            priority: 20,
                                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                                            finishByAction: false,
                                                            targets: ['caster', 'caster'],
                                                          }),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  },
                                },
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          ),
                        ),
                        finish: sequence(
                          step('applyBuff', {
                            buffId: 'buff_physical_no_guard_fake',
                            definition: {
                              stackingType: 'refresh',
                              priority: 100,
                              maxStackCount: 1,
                              durationSeconds: { blackboardKey: 'duration' },
                              applyTagIds: [-508362979],
                              blackboard: {
                                'duration': 1,
                              },
                            },
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                        afterEnhance: sequence(
                          step('igniteBuffs', {
                            target: 'enemy',
                            source: 'currentBuffSource',
                            igniteType: 'NoGuard',
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 0 },
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_handle_cryst_break',
                                definition: {
                                  stackingType: 'stack',
                                  priority: 0,
                                  maxStackCount: 1,
                                  durationSeconds: 10,
                                  triggerIntervalSeconds: 0,
                                  waitFirstTriggerInterval: true,
                                  maxTriggerCount: 1,
                                  blackboard: {
                                    'atk_scale': 0,
                                    'count': 0,
                                  },
                                  lifecycleSequences: {
                                    start: sequence(
                                      step('readBuffBlackboard', {
                                        target: 'enemy',
                                        query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1535684437] },
                                        desiredKey: 'count',
                                        outputKey: 'count',
                                      }),
                                      step('finishBuffsByTag', {
                                        target: 'enemy',
                                        tagQueryType: 'hasAny',
                                        buffTagIds: [1535684437],
                                        reason: 'early',
                                      }),
                                      step('applyBuff', {
                                        buffId: 'buff_common_cryst_triggered_physical_break',
                                        definition: {
                                          stackingType: 'unlimited',
                                          priority: 0,
                                          maxStackCount: 0,
                                          durationSeconds: 5,
                                          applyTagIds: [-615023885],
                                          blackboard: {
                                            'atk_scale': 0,
                                          },
                                          lifecycleSequences: {
                                            start: sequence(
                                              step('dealDamage', {
                                                damageType: 'physical',
                                                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                                tags: [],
                                                features: ['shatter'],
                                              }, '50:buff_common_cryst_triggered_physical_break:start:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:0'),
                                            ),
                                          },
                                        },
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: true,
                                        blackboardAssignments: {
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                                        },
                                      }),
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'count' },
                                          operator: 'equal',
                                          right: { kind: 'constant', value: 0 },
                                        },
                                        sequence(
                                          step('startTimeDilation', {
                                            scope: 'entity',
                                            durationSeconds: { kind: 'constant', value: 0.1 },
                                            slot: 1464849466,
                                            priority: 15,
                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                            finishByAction: false,
                                            targets: ['caster', 'caster'],
                                          }),
                                        ),
                                        sequence(
                                          branch(
                                            {
                                              kind: 'actionValueCompare',
                                              left: { kind: 'blackboard', key: 'count' },
                                              operator: 'equal',
                                              right: { kind: 'constant', value: 1 },
                                            },
                                            sequence(
                                              step('startTimeDilation', {
                                                scope: 'entity',
                                                durationSeconds: { kind: 'constant', value: 0.1 },
                                                slot: 1464849466,
                                                priority: 10,
                                                curve: { kind: 'named', key: 'interrupt_weakness' },
                                                finishByAction: false,
                                                targets: ['caster', 'caster'],
                                              }),
                                            ),
                                            sequence(
                                              branch(
                                                {
                                                  kind: 'actionValueCompare',
                                                  left: { kind: 'blackboard', key: 'count' },
                                                  operator: 'equal',
                                                  right: { kind: 'constant', value: 2 },
                                                },
                                                sequence(
                                                  step('startTimeDilation', {
                                                    scope: 'entity',
                                                    durationSeconds: { kind: 'constant', value: 0.25 },
                                                    slot: 1464849466,
                                                    priority: 20,
                                                    curve: { kind: 'named', key: 'interrupt_weakness' },
                                                    finishByAction: false,
                                                    targets: ['caster', 'caster'],
                                                  }),
                                                ),
                                                sequence(
                                                  branch(
                                                    {
                                                      kind: 'actionValueCompare',
                                                      left: { kind: 'blackboard', key: 'count' },
                                                      operator: 'equal',
                                                      right: { kind: 'constant', value: 3 },
                                                    },
                                                    sequence(
                                                      step('startTimeDilation', {
                                                        scope: 'entity',
                                                        durationSeconds: { kind: 'constant', value: 0.5 },
                                                        slot: 1464849466,
                                                        priority: 20,
                                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                                        finishByAction: false,
                                                        targets: ['caster', 'caster'],
                                                      }),
                                                    ),
                                                    sequence(
                                                      branch(
                                                        {
                                                          kind: 'actionValueCompare',
                                                          left: { kind: 'blackboard', key: 'count' },
                                                          operator: 'equal',
                                                          right: { kind: 'constant', value: 4 },
                                                        },
                                                        sequence(
                                                          step('startTimeDilation', {
                                                            scope: 'entity',
                                                            durationSeconds: { kind: 'constant', value: 0.65 },
                                                            slot: 1464849466,
                                                            priority: 20,
                                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                                            finishByAction: false,
                                                            targets: ['caster', 'caster'],
                                                          }),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  },
                                },
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          ),
                        ),
                      },
                    },
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'potential_5_interval',
                    durationSeconds: { kind: 'blackboard', key: 'potential_5_interval' },
                    autoFinishByAction: false,
                  }),
                ),
              ),
            ),
          ),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([115, 127, 138, 150, 161, 173, 184, 196, 207, 222, 239, 259]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill6:direct27:chr_0018_dapan_normal_skill11:actionOrder2:41'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'potential_5_interval': 0,
    'airborne_duration': 1.8,
    'atk_scale': [1.15, 1.27, 1.38, 1.5, 1.61, 1.73, 1.84, 1.96, 2.07, 2.22, 2.39, 2.59],
    'atk_scale_pre': [0.18, 0.2, 0.22, 0.23, 0.25, 0.27, 0.29, 0.31, 0.32, 0.35, 0.37, 0.41],
    'display_atk_scale': [1.33, 1.47, 1.6, 1.73, 1.86, 2, 2.13, 2.26, 2.4, 2.56, 2.76, 3],
    'poise': 10,
  },
);

export const daPanComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    timelineBlockFrames: 24,
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 570],
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
        23,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0018_dapan_combo_skill_tutorial_marker',
            definition: {
              stackingType: 'unique',
              priority: 0,
              maxStackCount: 1,
              durationSeconds: 1,
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([289, 318, 347, 375, 404, 433, 462, 491, 520, 556, 599, 650]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 15,
          }, '10:comboSkill6:direct26:chr_0018_dapan_combo_skill11:actionOrder2:21'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [2.89, 3.18, 3.47, 3.75, 4.04, 4.33, 4.62, 4.91, 5.2, 5.56, 5.99, 6.5],
    'crush_multi': [1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.15, 1.15, 1.15, 1.2],
    'poise': 15,
    'usp': 10,
  },
);

export const daPanUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    timelineBlockFrames: 86,
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
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
        1,
      ),
      scheduled(
        0,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-9-0',
                  event: { kind: 'enemyDefeated', scope: 'operator' },
                  sequence: sequence(
                    branch(
                      {
                        kind: 'any',
                        conditions: [
                          {
                            kind: 'eventDamageTagsMatch',
                            match: 'hasAny',
                            tags: ['ultimateSkill'],
                          },
                          {
                            kind: 'eventDamageFeaturesMatch',
                            match: 'hasAny',
                            features: ['airborne'],
                          },
                        ],
                      },
                      sequence(
                        branch(
                          {
                            kind: 'actionValueCompare',
                            left: { kind: 'blackboard', key: 'potential_1_dmg_up' },
                            operator: 'greater',
                            right: { kind: 'constant', value: 0 },
                          },
                          sequence(
                            step('applyBuff', {
                              buffId: 'buff_chr_0018_dapan_potential_1',
                              definition: {
                                stackingType: 'refresh',
                                priority: 0,
                                maxStackCount: 1,
                                durationSeconds: { blackboardKey: 'duration' },
                                blackboard: {
                                  'dmg_up': 0.15,
                                  'duration': 15,
                                },
                                attributeModifiers: [
                                  {
                                    attribute: 'physicalDamageIncrease',
                                    slot: 'baseAddition',
                                    value: { blackboardKey: 'dmg_up' },
                                  },
                                ],
                              },
                              target: 'caster',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                'dmg_up': { kind: 'blackboard', key: 'potential_1_dmg_up' },
                                'duration': { kind: 'blackboard', key: 'potential_1_duration' },
                              },
                            }),
                          ),
                        ),
                      ),
                    ),
                  ),
                },
            ],
          }),
        ),
        89,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 1.2 },
            slot: 0,
            priority: 100,
            curve: { kind: 'inline', keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0.333333343 }, { time: 1, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0.333333343, outWeight: 0 }] },
            finishByAction: true,
            ignoredTargets: ['caster'],
          }),
        ),
        36,
      ),
      scheduled(
        42,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([22, 24, 26, 29, 31, 33, 35, 37, 40, 42, 46, 50]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0018_dapan_ultimate_skill11:actionOrder2:19'),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.034 },
            slot: 1464849466,
            priority: 15,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: true,
            targets: ['caster'],
          }),
        ),
        42,
      ),
      scheduled(
        46,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([22, 24, 26, 29, 31, 33, 35, 37, 40, 42, 46, 50]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0018_dapan_ultimate_skill11:actionOrder2:19'),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.034 },
            slot: 1464849466,
            priority: 15,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: true,
            targets: ['caster'],
          }),
        ),
        46,
      ),
      scheduled(
        50,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([22, 24, 26, 29, 31, 33, 35, 37, 40, 42, 46, 50]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0018_dapan_ultimate_skill11:actionOrder2:19'),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.034 },
            slot: 1464849466,
            priority: 15,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: true,
            targets: ['caster'],
          }),
        ),
        50,
      ),
      scheduled(
        54,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([22, 24, 26, 29, 31, 33, 35, 37, 40, 42, 46, 50]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0018_dapan_ultimate_skill11:actionOrder2:19'),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.034 },
            slot: 1464849466,
            priority: 15,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: true,
            targets: ['caster'],
          }),
        ),
        54,
      ),
      scheduled(
        58,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([22, 24, 26, 29, 31, 33, 35, 37, 40, 42, 46, 50]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0018_dapan_ultimate_skill11:actionOrder2:19'),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.034 },
            slot: 1464849466,
            priority: 15,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: true,
            targets: ['caster'],
          }),
        ),
        58,
      ),
      scheduled(
        62,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([22, 24, 26, 29, 31, 33, 35, 37, 40, 42, 46, 50]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0018_dapan_ultimate_skill11:actionOrder2:19'),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.034 },
            slot: 1464849466,
            priority: 15,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: true,
            targets: ['caster'],
          }),
        ),
        62,
      ),
      scheduled(
        80,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent_1' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0018_dapan_talent_1_preparation',
                definition: {
                  stackingType: 'enhanceAndRefresh',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'duration': 15,
                    'max_stack': 2,
                    'talent_1_cd_reduce': 0,
                  },
                  abilityEventResponses: [
                    {
                      event: 'beforeCastSkill',
                      priority: 0,
                      sequence:
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0018_dapan_talent_1_cd_reduce',
                            definition: {
                              stackingType: 'unique',
                              priority: 0,
                              maxStackCount: 2,
                              blackboard: {
                                'cd_reduce': 0.5,
                                'duration': 15,
                              },
                              abilityEventResponses: [
                                {
                                  event: 'outputDamage',
                                  priority: 0,
                                  sequence:
                                    sequence(
                                      step('adjustSkillCooldown', {
                                        target: 'caster',
                                        skill: { kind: 'type', skillType: 'comboSkill' },
                                        operation: 'reduce',
                                        basis: 'baseDurationRatio',
                                        value: { kind: 'blackboard', key: 'cd_reduce' },
                                      }),
                                      step('finishBuffsById', {
                                        target: 'caster',
                                        buffIds: ['buff_chr_0018_dapan_talent_1_preparation'],
                                        reason: 'other',
                                        count: { kind: 'constant', value: 1 },
                                      }),
                                      step('finishBuffsById', {
                                        target: 'caster',
                                        buffIds: ['buff_chr_0018_dapan_talent_1_cd_reduce'],
                                        reason: 'other',
                                      }),
                                    ),
                                },
                              ],
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'cd_reduce': { kind: 'blackboard', key: 'talent_1_cd_reduce' },
                            },
                          }),
                        ),
                    },
                  ],
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'duration': { kind: 'blackboard', key: 'talent_1_duration' },
                  'max_stack': { kind: 'blackboard', key: 'talent_1_stack' },
                  'talent_1_cd_reduce': { kind: 'blackboard', key: 'talent_1_cd_reduce' },
                },
              }),
            ),
          ),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([178, 196, 213, 231, 249, 267, 284, 302, 320, 342, 369, 400]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0018_dapan_ultimate_skill11:actionOrder2:26'),
        ),
      ),
    ],
  },
  {
    'talent_1': 0,
    'atk_scale_end': [1.78, 1.96, 2.13, 2.31, 2.49, 2.67, 2.84, 3.02, 3.2, 3.42, 3.69, 4],
    'atk_scale_loop': [0.22, 0.24, 0.26, 0.29, 0.31, 0.33, 0.35, 0.37, 0.4, 0.42, 0.46, 0.5],
  },
);

export const daPanGeneratedOperator: OperatorDefinition = {
  slug: 'da-pan',
  gameId: 'DA PAN',
  rarity: 5,
  weaponType: 'greatsword',
  element: 'physical',
  role: 'striker',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [24, 56, 90, 124, 158, 175],
    agility: [9, 28, 47, 67, 87, 96],
    intellect: [10, 28, 47, 66, 85, 94],
    will: [10, 30, 50, 71, 91, 102],
    baseAttack: [30, 88, 150, 211, 272, 303],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [daPanBasicAttack1, daPanBasicAttack2, daPanBasicAttack3, daPanBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: daPanFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: daPanPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: daPanBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: daPanUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: daPanComboSkill },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_1',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_1_stack',
          operation: 'assign',
          value: [1, 2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_1_duration',
          operation: 'assign',
          value: [20, 20],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_1_cd_reduce',
          operation: 'assign',
          value: [0.4, 0.4],
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
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_1_dmg_up',
          operation: 'assign',
          value: 0.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_1_duration',
          operation: 'assign',
          value: 15,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_1_stack',
          operation: 'add',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_1_duration',
          operation: 'add',
          value: 10,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['strength'],
          value: 15,
        },
        { kind: 'addStaticDamageIncrease', target: 'physical', value: 0.08 },
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
          blackboardKey: 'potential_5_interval',
          operation: 'assign',
          value: 45,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'talentEffects' }, { capability: 'skillBehavior', skillGroupKeys: ['finisher', 'ultimate'] }] },
};
