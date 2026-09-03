/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  once,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const catcherBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0020_meurs_attack1',
    timelineBlockFrames: 21,
    naturalDurationFrames: 114,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 39,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0020_meurs_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 21, endFrame: 39, sourceSkillIds: ['chr_0020_meurs_attack2'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0020_meurs_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                  branch(
                    { kind: 'casterControlled' },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'normalAttack',
                      }),
                    ),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.0329999998211861,
              },
            },
          ),
        ),
        14,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.349999994039536, 0.389999985694885, 0.419999986886978, 0.46000000834465, 0.490000009536743,
      0.529999971389771, 0.560000002384186, 0.600000023841858, 0.629999995231628, 0.670000016689301,
      0.730000019073486, 0.790000021457672,
    ],
    env_dmg: 20,
  },
);

export const catcherBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0020_meurs_attack2',
    timelineBlockFrames: 21,
    naturalDurationFrames: 126,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 35,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0020_meurs_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 21, endFrame: 35, sourceSkillIds: ['chr_0020_meurs_attack3'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0020_meurs_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.25 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.0329999998211861,
              },
            },
          ),
        ),
        13,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.389999985694885, 0.419999986886978, 0.46000000834465, 0.5, 0.540000021457672,
      0.579999983310699, 0.620000004768372, 0.649999976158142, 0.689999997615814, 0.740000009536743,
      0.800000011920929, 0.870000004768372,
    ],
    env_dmg: 20,
  },
);

export const catcherBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0020_meurs_attack3',
    timelineBlockFrames: 28,
    naturalDurationFrames: 126,
    exclusiveFrame: 32,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 44,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0020_meurs_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 28, endFrame: 44, sourceSkillIds: ['chr_0020_meurs_attack4'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        16,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0020_meurs_attack3:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        17,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.540000021457672, 0.589999973773956, 0.649999976158142, 0.699999988079071, 0.759999990463257,
      0.810000002384186, 0.860000014305115, 0.920000016689301, 0.970000028610229, 1.03999996185303,
      1.12000000476837, 1.22000002861023,
    ],
    env_dmg: 20,
  },
);

export const catcherBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0020_meurs_attack4',
    timelineBlockFrames: 45,
    naturalDurationFrames: 114,
    exclusiveFrame: 47,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 60,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0020_meurs_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 45, endFrame: 60, sourceSkillIds: ['chr_0020_meurs_attack1'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        23,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0020_meurs_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                  once(
                    'SkillData.chr_0020_meurs_attack4.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0].actionOnTick.actionData[2].succeedActions.actionData[2]',
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'normalAttack',
                      }),
                    ),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.0329999998211861,
              },
            },
          ),
        ),
        25,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 25,
    atk_scale: [
      0.709999978542328, 0.779999971389771, 0.850000023841858, 0.920000016689301, 0.990000009536743,
      1.07000005245209, 1.13999998569489, 1.21000003814697, 1.27999997138977, 1.37000000476837,
      1.47000002861023, 1.60000002384186,
    ],
    atk_scale2: 0.5,
    env_dmg: 40,
    poise: 22,
  },
);

export const catcherFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0020_meurs_power_attack',
    timelineBlockFrames: 35,
    naturalDurationFrames: 135,
    exclusiveFrame: 75,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 35,
          endFrame: 75,
          sourceSkillIds: ['chr_0020_meurs_normal_skill', 'chr_0020_meurs_combo_skill'],
        },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        15,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.400000005960464,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0020_meurs_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        17,
      ),
      scheduled(
        35,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.600000023841858,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0020_meurs_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        37,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_power_attack_disable_cast_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        35,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_full_immune_medium',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        75,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  {
    atk_scale: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
  },
);

export const catcherPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0020_meurs_plunging_attack_end',
    timelineBlockFrames: 21,
    naturalDurationFrames: 108,
    exclusiveFrame: 20,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0020_meurs_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
        2,
      ),
    ],
    skillType: 'plungingAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
    env_dmg: 20,
  },
);

export const catcherBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0020_meurs_normal_skill',
    timelineBlockFrames: 95,
    naturalDurationFrames: 373,
    exclusiveFrame: 285,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 95, endFrame: 129, sourceSkillIds: ['chr_0020_meurs_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'MainChar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        3,
      ),
      scheduled(
        0,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_return_base' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'refund',
            spGainSource: 'default',
          }),
        ),
        3,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_common_obtain_ultimate_sp',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { ratio: { kind: 'constant', value: 0.5 } },
              }),
            ),
          ),
        ),
        3,
      ),
      scheduled(
        60,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_common_obtain_ultimate_sp',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { ratio: { kind: 'constant', value: 0.5 } },
              }),
            ),
          ),
        ),
        62,
      ),
      scheduled(45, sequence(step('jumpTimeline', { destinationFrame: 255 })), 46),
      scheduled(194, sequence(step('finishTimeline', {})), 195),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0020_meurs_reduce_damage',
            target: 'party',
            finishByAction: true,
            blackboardAssignments: { taken_dmg: { kind: 'blackboard', key: 'taken_dmg' } },
          }),
        ),
        83,
      ),
      scheduled(
        0,
        sequence(
          step('listenForCombatEvents', {
            responses: [
              {
                key: 'SkillData.chr_0020_meurs_normal_skill.actionGroupData.timelineActions[19]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                sequence: sequence(
                  branch(
                    {
                      kind: 'eventDamageFeaturesMatch',
                      match: 'exceptAny',
                      features: ['dot', 'remainArea'],
                    },
                    sequence(step('jumpTimeline', { destinationFrame: 60 })),
                  ),
                ),
              },
              {
                key: 'SkillData.chr_0020_meurs_normal_skill.actionGroupData.timelineActions[19]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
                event: { kind: 'buffApplied' },
                sequence: sequence(
                  branch(
                    { kind: 'eventBuffIdMatch', buffIds: ['buff_eny_0018_lbtough_pre_catch'] },
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 0 },
                          operator: 'lessOrEqual',
                          right: { kind: 'constant', value: 3 },
                        },
                        sequence(step('jumpTimeline', { destinationFrame: 60 })),
                      ),
                    ),
                  ),
                ),
              },
            ],
          }),
        ),
        60,
      ),
      scheduled(
        83,
        sequence(
          repeatEachTick(
            sequence(
              step('applyBuff', {
                buffId: 'buff_physical_no_guard',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
              once(
                'SkillData.chr_0020_meurs_normal_skill.actionGroupData.timelineActions[25]._sequenceActionData.actionData[0].actionOnTick.actionData[1]',
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'potential5_atb' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      branch(
                        {
                          kind: 'buffStackCompare',
                          target: 'caster',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/HpShield'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'sp',
                            amount: { kind: 'blackboard', key: 'potential5_atb' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'team',
                            spGainKind: 'refund',
                            spGainSource: 'skill',
                          }),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0020_meurs_normal_skill:/scheduledSequences/8/sequence/steps/0/body/steps/2',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0,
              },
            },
          ),
        ),
        85,
      ),
      scheduled(
        60,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.699999988079071 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.300000011920929,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0.333333343267441,
                },
                {
                  time: 0.5,
                  value: 0.300000011920929,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343267441,
                  outWeight: 0.333333343267441,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 4.59660577774048,
                  outTangent: 4.59660577774048,
                  weightedMode: 0,
                  inWeight: 0.0243593454360962,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        63,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb_return_base: 30,
    atk_scale: [
      1.77999997138977, 1.96000003814697, 2.13000011444092, 2.30999994277954, 2.49000000953674,
      2.67000007629395, 2.84999990463257, 3.01999998092651, 3.20000004768372, 3.42000007629395,
      3.69000005722046, 4,
    ],
    is_cam: 1,
    poise: 20,
    potential5_atb: 0,
    taken_dmg: 0.899999976158142,
    weak_duration: 8,
    weak_scale: -0.2,
  },
);

export const catcherComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0020_meurs_combo_skill',
    timelineBlockFrames: 24,
    naturalDurationFrames: 98,
    exclusiveFrame: 45,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 24, endFrame: 60, sourceSkillIds: ['chr_0020_meurs_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        17,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0020_meurs_combo_skill:/scheduledSequences/0/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.400000005960464 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'caster',
          }),
        ),
        18,
      ),
      scheduled(
        20,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0020_meurs_combo_skill:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'meurs_comboskill2' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        21,
      ),
      scheduled(
        20,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'shield_duration',
                operation: 'add',
                value: { kind: 'blackboard', key: 'potential3_duration' },
              }),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('findCharacterTeamTargets', {
                    saveToContextKey: 'aMate',
                    selection: { kind: 'lowestHealthRatioOperator', excludeCaster: true },
                  }),
                  step('mergeContextTargets', {
                    saveToContextKey: 'shieldTar',
                    sources: [
                      { kind: 'context', contextKey: 'aMate' },
                      { kind: 'target', target: 'caster' },
                    ],
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0020_meurs_combo_skill_shield',
                    target: 'casterAndLowestHealthRatioOperatorExceptCaster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      shield_def_rate: { kind: 'blackboard', key: 'shield_def_rate' },
                      shield_base: { kind: 'blackboard', key: 'shield_base' },
                      duration: { kind: 'blackboard', key: 'shield_duration' },
                    },
                  }),
                ),
                sequence(
                  step('findCharacterTeamTargets', {
                    saveToContextKey: 'mainChar',
                    selection: { kind: 'controlledOperator' },
                  }),
                  step('mergeContextTargets', {
                    saveToContextKey: 'shieldTar',
                    sources: [
                      { kind: 'context', contextKey: 'mainChar' },
                      { kind: 'target', target: 'caster' },
                    ],
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0020_meurs_combo_skill_shield',
                    target: 'casterAndControlledOperator',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      shield_def_rate: { kind: 'blackboard', key: 'shield_def_rate' },
                      shield_base: { kind: 'blackboard', key: 'shield_base' },
                      duration: { kind: 'blackboard', key: 'shield_duration' },
                    },
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        21,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.567000031471252 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        14,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [1050, 1050, 1050, 1050, 1050, 1050, 1050, 1050, 1050, 1050, 1050, 990],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [
      0.25, 0.270000010728836, 0.300000011920929, 0.319999992847443, 0.340000003576279,
      0.370000004768372, 0.389999985694885, 0.419999986886978, 0.439999997615814, 0.469999998807907,
      0.509999990463257, 0.550000011920929,
    ],
    atk_scale_1: [
      1, 1.10000002384186, 1.20000004768372, 1.29999995231628, 1.39999997615814, 1.5,
      1.60000002384186, 1.70000004768372, 1.79999995231628, 1.92999994754791, 2.07999992370605,
      2.25,
    ],
    cam_angle: 0,
    cam_duration: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    potential3_duration: 0,
    shield_base: [360, 432, 504, 576, 612, 648, 684, 720, 756, 774, 792, 810],
    shield_def_rate: [
      2.25, 2.70000004768372, 3.15000009536743, 3.59999990463257, 3.82500004768372,
      4.05000019073486, 4.27500009536743, 4.5, 4.72499990463257, 4.84000015258789, 4.94999980926514,
      5.05999994277954,
    ],
    shield_duration: 10,
    usp: 10,
    trigger_hp_ratio: 0.400000005960464,
  },
);

export const catcherUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0020_meurs_ultimate_skill',
    timelineBlockFrames: 103,
    naturalDurationFrames: 193,
    exclusiveFrame: 120,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 103,
          endFrame: 120,
          sourceSkillIds: ['chr_0020_meurs_combo_skill', 'chr_0020_meurs_normal_skill'],
        },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        3,
      ),
      scheduled(
        46,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0020_meurs_ult_weak',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              weak_scale: { kind: 'blackboard', key: 'weak_scale' },
              weak_duration: { kind: 'blackboard', key: 'weak_duration' },
            },
          }),
        ),
        49,
      ),
      scheduled(
        46,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0020_meurs_ultimate_skill:/scheduledSequences/2/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.200000002980232 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        49,
      ),
      scheduled(
        64,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0020_meurs_ultimate_skill:/scheduledSequences/3/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.200000002980232 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        67,
      ),
      scheduled(
        85,
        sequence(
          step('applyKnockDown', {
            target: 'enemy',
            duration: { kind: 'blackboard', key: 'knockdown_time' },
            force: false,
            isExtra: false,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0020_meurs_ultimate_skill:/scheduledSequences/4/sequence/steps/1',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.400000005960464 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        88,
      ),
      scheduled(
        102,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent_1' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0020_meurs_talent_shockwave',
                childSkillId: 'chr_0020_meurs_talent_shockwave',
                inheritActionBlackboard: true,
                inheritSourceSkillCastInfo: true,
                dieWhenSourceDies: false,
              }),
            ),
          ),
        ),
        105,
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
        38,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_ult_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        120,
      ),
    ],
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: [
      0.889999985694885, 0.980000019073486, 1.07000005245209, 1.1599999666214, 1.25,
      1.3400000333786, 1.42999994754791, 1.50999999046326, 1.60000002384186, 1.72000002861023,
      1.85000002384186, 2,
    ],
    atk_scale_1: [
      1.20000004768372, 1.32000005245209, 1.44000005722046, 1.55999994277954, 1.67999994754791,
      1.79999995231628, 1.91999995708466, 2.03999996185303, 2.16000008583069, 2.30999994277954,
      2.49000000953674, 2.70000004768372,
    ],
    atk_scale_2: [
      1.77999997138977, 1.96000003814697, 2.13000011444092, 2.30999994277954, 2.49000000953674,
      2.67000007629395, 2.83999991416931, 3.01999998092651, 3.20000004768372, 3.42000007629395,
      3.69000005722046, 4,
    ],
    atk_scale_shockwave: 0.45,
    knockdown_time: 2,
    poise: 5,
    poise1: 10,
    talent_1: 0,
    weak_duration: 8,
    weak_scale: [
      0.200000002980232, 0.200000002980232, 0.200000002980232, 0.200000002980232, 0.200000002980232,
      0.25, 0.25, 0.25, 0.25, 0.300000011920929, 0.300000011920929, 0.300000011920929,
    ],
    poise_display: 20,
  },
);

export default {
  slug: 'catcher',
  gameId: 'CATCHER',
  rarity: 4,
  weaponType: 'greatsword',
  element: 'physical',
  role: 'defender',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [21, 54, 89, 124, 159, 176],
    agility: [9, 28, 47, 67, 87, 96],
    intellect: [8, 25, 42, 60, 77, 86],
    will: [11, 31, 53, 74, 96, 106],
    baseAttack: [30, 88, 148, 209, 270, 300],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [catcherBasicAttack1, catcherBasicAttack2, catcherBasicAttack3, catcherBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: catcherFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: catcherPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: catcherBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: catcherComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: catcherUltimate },
  ],
  skillSlots: [
    { key: 'battleSkill', baseSkillKey: 'battleSkill', replacementSkillKeys: [] },
    { key: 'comboSkill', baseSkillKey: 'comboSkill', replacementSkillKeys: [] },
    { key: 'ultimate', baseSkillKey: 'ultimate', replacementSkillKeys: [] },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'basicAttack1',
        'basicAttack2',
        'basicAttack3',
        'basicAttack4',
        'plungingAttack',
        'finisher',
      ],
      defaultSkillKey: 'basicAttack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  comboSkillConditions: [
    {
      key: 'native-combo:0',
      skillKey: 'comboSkill',
      event: 'takeDamage',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'contextTargetIdentityMatch',
            contextKey: 'trigger',
            other: 'controlledOperator',
            operator: 'equal',
          },
          sequence(
            branch(
              {
                kind: 'healthCompare',
                target: 'contextTarget',
                contextKey: 'trigger',
                valueType: 'ratio',
                operator: 'less',
                value: { kind: 'constant', value: 0.4 },
              },
              sequence(
                branch(
                  {
                    kind: 'eventDamageFeaturesMatch',
                    match: 'exceptAny',
                    features: ['dot', 'remainArea'],
                  },
                  sequence(
                    branch(
                      { kind: 'actionInputTargetObjectTypeMatch', objectTypeMask: 16 },
                      sequence(),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    },
    {
      key: 'native-combo:1',
      skillKey: 'comboSkill',
      event: 'weaknessSet',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0020_meurs_signal_weakness_trigger_combo',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
        }),
        branch({ kind: 'constant', value: false }, sequence()),
      ),
    },
  ],
  comboSkillPriority: 'default',
  talents: [
    {
      key: 'talent1',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0020_meurs_talent_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { rate: [1, 1.20000004768372] },
        }),
      ),
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
          value: [1, 2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale_shockwave',
          operation: 'assign',
          value: [0.300000011920929, 0.449999988079071],
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0020_meurs_potential_1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            def_scale: { kind: 'constant', value: 5 },
            dmg_base: { kind: 'constant', value: 300 },
          },
        }),
      ),
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'modifyBasePanelStat', stat: 'defense', operation: 'flat', value: 20 },
        { kind: 'addBuildAttribute', attributes: ['will'], value: 10 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential3_duration',
          operation: 'assign',
          value: 5,
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
          multiplier: 0.899999976158142,
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
          blackboardKey: 'potential5_atb',
          operation: 'assign',
          value: 10,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0020_meurs_combo_skill_shield: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_up',
        iconPath: '/icons/icon_battle_buff_def_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        blinkInMainCharHpBar: false,
        showProgressInHpBar: false,
        showProgressInNormalSkillButton: false,
        useWeakProgressInNormalSkillButton: false,
        showProgressInUltimateSkillButton: false,
        forceRaiseIconEvent: false,
        showWarningBackground: false,
        playStrongInAnimation: false,
        hasCharHpBarVfxType: false,
        charHpBarVfxType: 'Fire',
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: ['Skill/Character/Common/HpShield'],
      extendTags: [],
      blackboard: { duration: 10, shield_base: 100, shield_def_rate: 0.5 },
      attributeModifiers: [],
      shields: [
        {
          infinityValue: false,
          value: {
            attributeSource: 'buffSource',
            attribute: 'Def',
            multiplier: { blackboardKey: 'shield_def_rate' },
            addition: { blackboardKey: 'shield_base' },
          },
          damageAbsorptions: [],
          absorbCount: -1,
          absorbAllDamageWhenConsumed: false,
          removeBuffWhenConsumed: true,
          priority: 'normal',
          replaceHitEffect: true,
        },
      ],
    },
    buff_chr_0020_meurs_potential_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 0,
      applyTags: [],
      extendTags: [],
      blackboard: { def_scale: 1, dmg_base: 100 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'outputDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventDamageTagsMatch',
                match: 'hasAny',
                tags: ['normalSkill', 'ultimateSkill'],
              },
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'def_scale' },
                    calculation: 'attribute',
                    calculationAttribute: 'Def',
                    calculationAddition: { kind: 'blackboard', key: 'dmg_base' },
                    tags: [],
                  },
                  'buff_chr_0020_meurs_potential_1:/abilityEventResponses/0/sequence/steps/0/whenTrue/steps/0',
                ),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0020_meurs_reduce_damage: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ['Skill/Character/Common/Shielded'],
      extendTags: [],
      blackboard: { duration: 9999, taken_dmg: 0.1 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_shelter',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'constant', value: 9999999 },
              rate: { kind: 'blackboard', key: 'taken_dmg' },
            },
          }),
        ),
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0020_meurs_reduce_damage_remain',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'constant', value: 0.5 },
              taken_dmg: { kind: 'blackboard', key: 'taken_dmg' },
            },
          }),
        ),
      },
    },
    buff_chr_0020_meurs_reduce_damage_remain: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0.5, taken_dmg: 0.1 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_shelter',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'taken_dmg' },
            },
          }),
        ),
      },
    },
    buff_chr_0020_meurs_signal_weakness_trigger_combo: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.400000005960464,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(step('openComboWindow', { nextSkillKeyFromSlot: 'comboSkill' })),
      },
    },
    buff_chr_0020_meurs_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 0,
      triggerIntervalSeconds: 0.100000001490116,
      waitFirstTriggerInterval: false,
      maxTriggerCount: 99999,
      applyTags: [],
      extendTags: [],
      blackboard: { def_up: 0, rate: 1 },
      attributeModifiers: [
        { attribute: 'Def', slot: 'baseAddition', value: { blackboardKey: 'def_up' } },
      ],
      lifecycleSequences: {
        trigger: sequence(
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'will' },
            stage: 'finalNonConverted',
            useFloor: true,
            divisor: { kind: 'constant', value: 10 },
            multiplier: { kind: 'blackboard', key: 'rate' },
            base: { kind: 'constant', value: 0 },
            targetKey: 'def_up',
          }),
        ),
      },
    },
    buff_chr_0020_meurs_ult_weak: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'weak_duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { weak_duration: 0, weak_scale: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_weak',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'weak_duration' },
              rate: { kind: 'blackboard', key: 'weak_scale' },
            },
          }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0020_meurs_talent_shockwave: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'SelectCategory/ProjectilePassThru',
      ],
      lifetime: { kind: 'limited', durationSeconds: 2 },
      deathReleaseDelaySeconds: 0.100000001490116,
      childSkill: {
        skillId: 'chr_0020_meurs_talent_shockwave',
        blackboard: { atb: 0, atk_scale_shockwave: 0.42, env_dmg: 20, spawn_count: 0, talent_1: 0 },
        scheduledSequences: [
          scheduled(
            3,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_shockwave' },
                  tags: ['ultimateSkill'],
                },
                'abilityentity_chr_0020_meurs_talent_shockwave:chr_0020_meurs_talent_shockwave:/childSkill/scheduledSequences/0/sequence/steps/0',
              ),
            ),
            5,
          ),
          scheduled(
            18,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_shockwave' },
                  tags: ['ultimateSkill'],
                },
                'abilityentity_chr_0020_meurs_talent_shockwave:chr_0020_meurs_talent_shockwave:/childSkill/scheduledSequences/1/sequence/steps/0',
              ),
            ),
            20,
          ),
          scheduled(
            33,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_shockwave' },
                  tags: ['ultimateSkill'],
                },
                'abilityentity_chr_0020_meurs_talent_shockwave:chr_0020_meurs_talent_shockwave:/childSkill/scheduledSequences/2/sequence/steps/0',
              ),
            ),
            35,
          ),
          scheduled(
            29,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_1' },
                  operator: 'less',
                  right: { kind: 'constant', value: 2 },
                },
                sequence(step('finishTimeline', {})),
              ),
            ),
            32,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
