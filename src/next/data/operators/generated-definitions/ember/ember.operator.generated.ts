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

export const emberBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0009_azrila_attack1',
    timelineBlockFrames: 24,
    naturalDurationFrames: 163,
    exclusiveFrame: 38,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 38,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0009_azrila_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 24, endFrame: 38, sourceSkillIds: ['chr_0009_azrila_attack2'] },
      ],
    },
    costFrame: 15,
    scheduledSequences: [
      scheduled(
        13,
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
                'chr_0009_azrila_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
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
        18,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.379999995231628, 0.419999986886978, 0.46000000834465, 0.5, 0.540000021457672,
      0.569999992847443, 0.610000014305115, 0.649999976158142, 0.689999997615814, 0.740000009536743,
      0.790000021457672, 0.860000014305115,
    ],
  },
);

export const emberBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0009_azrila_attack2',
    timelineBlockFrames: 18,
    naturalDurationFrames: 151,
    exclusiveFrame: 26,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 41,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0009_azrila_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 18, endFrame: 41, sourceSkillIds: ['chr_0009_azrila_attack3'] },
      ],
    },
    costFrame: 6,
    scheduledSequences: [
      scheduled(
        6,
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
                'chr_0009_azrila_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.259999990463257 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
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
        12,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.540000021457672, 0.589999973773956, 0.639999985694885, 0.699999988079071, 0.75,
      0.800000011920929, 0.860000014305115, 0.910000026226044, 0.959999978542328, 1.02999997138977,
      1.11000001430511, 1.20000004768372,
    ],
  },
);

export const emberBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0009_azrila_attack3',
    timelineBlockFrames: 35,
    naturalDurationFrames: 182,
    exclusiveFrame: 47,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 50,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0009_azrila_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 35, endFrame: 50, sourceSkillIds: ['chr_0009_azrila_attack4'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        18,
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
                'chr_0009_azrila_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0',
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
        22,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.660000026226044, 0.730000019073486, 0.800000011920929, 0.860000014305115, 0.930000007152557,
      0.990000009536743, 1.05999994277954, 1.12999999523163, 1.19000005722046, 1.27999997138977,
      1.37999999523163, 1.49000000953674,
    ],
  },
);

export const emberBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0009_azrila_attack4',
    timelineBlockFrames: 53,
    naturalDurationFrames: 180,
    exclusiveFrame: 52,
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        26,
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
                'chr_0009_azrila_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                  once(
                    'SkillData.chr_0009_azrila_attack4.actionGroupData.timelineActions[7]._sequenceActionData.actionData[0].actionOnTick.actionData[2].succeedActions.actionData[2]',
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
        29,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 28,
    atk_scale: [
      0.819999992847443, 0.899999976158142, 0.980000019073486, 1.05999994277954, 1.13999998569489,
      1.22000002861023, 1.30999994277954, 1.38999998569489, 1.47000002861023, 1.57000005245209,
      1.69000005722046, 1.8400000333786,
    ],
    poise: 25,
  },
);

export const emberFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0009_azrila_power_attack',
    timelineBlockFrames: 28,
    naturalDurationFrames: 222,
    exclusiveFrame: 50,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 28,
          endFrame: 44,
          sourceSkillIds: ['chr_0009_azrila_normal_skill', 'chr_0009_azrila_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        23,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.899999976158142,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0009_azrila_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        32,
      ),
      scheduled(
        23,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.5 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        26,
      ),
      scheduled(
        9,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.100000001490116,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0009_azrila_power_attack:/scheduledSequences/2/sequence/steps/0',
          ),
          repeatEachTick(
            sequence(
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
        50,
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
        28,
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

export const emberPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0009_azrila_plunging_attack_end',
    timelineBlockFrames: 12,
    naturalDurationFrames: 128,
    exclusiveFrame: 20,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 12, endFrame: 21, sourceSkillIds: ['chr_0009_azrila_attack1'] },
      ],
    },
    costFrame: 0,
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
            'chr_0009_azrila_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
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
        6,
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
  },
);

export const emberBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0009_azrila_normal_skill',
    timelineBlockFrames: 51,
    naturalDurationFrames: 162,
    exclusiveFrame: 55,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 51, endFrame: 60, sourceSkillIds: ['chr_0009_azrila_normal_skill'] },
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
          step('listenForCombatEvents', {
            responses: [
              {
                key: 'SkillData.chr_0009_azrila_normal_skill.actionGroupData.timelineActions[2]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                sequence: sequence(
                  branch(
                    {
                      kind: 'eventDamageFeaturesMatch',
                      match: 'exceptAny',
                      features: ['dot', 'remainArea'],
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0009_azrila_normal_skill_gpsuccess',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              },
            ],
          }),
        ),
        38,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent1' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'shelterrate',
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'extrashelter' },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('applyBuff', {
                buffId: 'buff_chr_0009_azrila_normal_skill_shelter',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                blackboardAssignments: {
                  rate: { kind: 'blackboard', key: 'shelterrate' },
                  duration: { kind: 'constant', value: -1 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        38,
      ),
      scheduled(
        10,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0009_azrila_normal_skill:/scheduledSequences/3/sequence/steps/0/body/steps/0',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.159999996423721 },
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
                targetTriggerIntervalSeconds: 0.0329999998211861,
              },
            },
          ),
        ),
        15,
      ),
      scheduled(
        38,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0009_azrila_normal_skill_shelter',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  rate: { kind: 'blackboard', key: 'shelterrate' },
                  duration: { kind: 'blackboard', key: 'extratime' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('applyKnockDown', {
            target: 'enemy',
            duration: { kind: 'constant', value: 1.5 },
            force: false,
            isExtra: false,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0009_azrila_normal_skill:/scheduledSequences/4/sequence/steps/2',
          ),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0009_azrila_normal_skill_gpsuccess'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(step('dealStagger', { value: { kind: 'blackboard', key: 'extrapoise' } })),
            undefined,
            { alwaysNext: true },
          ),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
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
        41,
      ),
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'input_angle',
            operation: 'assign',
            value: { kind: 'constant', value: 100 },
          }),
        ),
        3,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    angle: 120,
    atk_scale: [
      0.319999992847443, 0.360000014305115, 0.389999985694885, 0.419999986886978, 0.449999988079071,
      0.490000009536743, 0.519999980926514, 0.550000011920929, 0.579999983310699, 0.620000004768372,
      0.670000016689301, 0.730000019073486,
    ],
    atk_scale2: [
      1.4099999666214, 1.54999995231628, 1.69000005722046, 1.83000004291534, 1.97000002861023,
      2.10999989509583, 2.25999999046326, 2.40000009536743, 2.53999996185303, 2.71000003814697,
      2.92000007629395, 3.17000007629395,
    ],
    buff_duration: 8,
    cam_angle: 0,
    cam_duration: 0,
    defend_reduct: 0,
    duration: 0,
    extrapoise: 10,
    extrashelter: 0,
    extratime: 0,
    height: 4,
    input_angle: 0,
    poise: 10,
    potential_1: 0,
    potential_lv: 0,
    prob: 0,
    radius: 4,
    select_radius: 5,
    shelterrate: 0,
    talent1: 0,
    display_atk_scale: [
      1.73000001907349, 1.9099999666214, 2.07999992370605, 2.25, 2.4300000667572, 2.59999990463257,
      2.76999998092651, 2.95000004768372, 3.11999988555908, 3.33999991416931, 3.59999990463257,
      3.90000009536743,
    ],
    displayextrapoise: 10,
    displaypoise: 10,
  },
);

export const emberUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0009_azrila_ultimate_skill',
    timelineBlockFrames: 59,
    naturalDurationFrames: 262,
    exclusiveFrame: 90,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 59,
          endFrame: 90,
          sourceSkillIds: ['chr_0009_azrila_normal_skill', 'chr_0009_azrila_combo_skill'],
        },
      ],
    },
    costFrame: 0,
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
        50,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hp_percent',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'extrashield' },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'maxHealth' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'constant', value: 1 },
            base: { kind: 'constant', value: 0 },
            targetKey: 'FinalShield',
          }),
          step('modifyActionValue', {
            key: 'FinalShield',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'hp_percent' },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0009_azrila_ultimate_skill:/scheduledSequences/1/sequence/steps/3',
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0009_azrila_ultimateshield',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              hp_percent: { kind: 'blackboard', key: 'hp_percent' },
              potential_5: { kind: 'blackboard', key: 'potential_5' },
              extraattack: { kind: 'blackboard', key: 'extraattack' },
              FinalShield: { kind: 'blackboard', key: 'FinalShield' },
            },
          }),
        ),
        51,
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
        90,
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
        48,
      ),
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_reduce_scale: -0.7,
    atk_scale: [
      2.89000010490417, 3.1800000667572, 3.47000002861023, 3.75999999046326, 4.03999996185303,
      4.32999992370605, 4.61999988555908, 4.90999984741211, 5.19999980926514, 5.55999994277954,
      5.98999977111816, 6.5,
    ],
    damage_scalar: 0,
    def_reduce_scale: -0.2,
    def_up_scale: 0,
    duration: 10,
    extraattack: 0,
    extrashield: 0,
    FinalShield: 0,
    heal_base: 0,
    heal_scale: 2,
    hp_percent: [
      0.180000007152557, 0.180000007152557, 0.180000007152557, 0.200000002980232, 0.200000002980232,
      0.200000002980232, 0.219999998807907, 0.219999998807907, 0.219999998807907, 0.25, 0.25, 0.25,
    ],
    poise: 25,
    potential_5: 0,
    radius: 5,
    shelter: 0,
    will_additive: 0,
  },
);

export const emberComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0009_azrila_combo_skill',
    timelineBlockFrames: 39,
    naturalDurationFrames: 161,
    exclusiveFrame: 38,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 40, endFrame: 60, sourceSkillIds: ['chr_0009_azrila_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent1' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'shelterrate',
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'extrashelter' },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('applyBuff', {
                buffId: 'buff_chr_0009_azrila_normal_skill_shelter',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                blackboardAssignments: {
                  rate: { kind: 'blackboard', key: 'shelterrate' },
                  duration: { kind: 'constant', value: -1 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        26,
      ),
      scheduled(
        26,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
              ],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0009_azrila_normal_skill_shelter',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  rate: { kind: 'blackboard', key: 'shelterrate' },
                  duration: { kind: 'blackboard', key: 'extratime' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('applyKnockDown', {
            target: 'enemy',
            duration: { kind: 'constant', value: 1.5 },
            force: false,
            isExtra: false,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0009_azrila_combo_skill:/scheduledSequences/1/sequence/steps/2',
          ),
          step('heal', {
            target: 'controlledOperator',
            alwaysNext: true,
            tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
            attribute: 'will',
            multiplier: { kind: 'blackboard', key: 'will_additive' },
            addition: { kind: 'blackboard', key: 'heal_base' },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_3' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('findCharacterTeamTargets', {
                saveToContextKey: 'Main',
                selection: { kind: 'controlledOperator' },
              }),
              step('findCharacterTeamTargets', {
                saveToContextKey: 'CureTarget',
                selection: { kind: 'lowestHealthRatioOperator', excludedContextKey: 'Main' },
              }),
              step('modifyActionValue', {
                key: 'will_additive',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'extracure' },
              }),
              step('modifyActionValue', {
                key: 'heal_base',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'extracure' },
              }),
              step('heal', {
                target: 'contextTarget',
                contextKey: 'CureTarget',
                alwaysNext: true,
                tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
                attribute: 'will',
                multiplier: { kind: 'blackboard', key: 'will_additive' },
                addition: { kind: 'blackboard', key: 'heal_base' },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'caster',
          }),
        ),
        27,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        12,
      ),
    ],
    smartTarget: 'input',
    cooldownFrames: [570, 570, 570, 570, 570, 570, 570, 570, 570, 570, 570, 540],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    angle: 120,
    atk_heal: 0,
    atk_scale: [
      1.01999998092651, 1.12000000476837, 1.22000002861023, 1.33000004291534, 1.42999994754791,
      1.52999997138977, 1.62999999523163, 1.73000001907349, 1.8400000333786, 1.96000003814697,
      2.11999988555908, 2.29999995231628,
    ],
    buff_duration: 0,
    cam_angle: 0,
    cam_duration: 0,
    defend_reduct: 0,
    duration: 2,
    extracure: 0,
    extrashelter: 0,
    extratime: 0,
    heal_base: [300, 360, 420, 480, 510, 540, 570, 600, 630, 645, 660, 675],
    height: 4,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    potential_1: 0,
    potential_3: 0,
    prob: 0,
    radius: 5,
    select_radius: 5,
    shelterrate: 0,
    talent1: 0,
    usp: 10,
    usp_everyone: 0,
    usp_self: 0,
    will_additive: [
      0.699999988079071, 0.839999973773956, 0.980000019073486, 1.12000000476837, 1.19000005722046,
      1.25999999046326, 1.33000004291534, 1.39999997615814, 1.47000002861023, 1.50999999046326,
      1.53999996185303, 1.58000004291534,
    ],
  },
);

export default {
  slug: 'ember',
  gameId: 'EMBER',
  rarity: 6,
  weaponType: 'greatsword',
  element: 'heat',
  role: 'defender',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [21, 54, 89, 124, 159, 176],
    agility: [9, 28, 47, 67, 87, 96],
    intellect: [8, 25, 42, 60, 77, 86],
    will: [13, 36, 60, 84, 108, 120],
    baseAttack: [30, 93, 159, 225, 291, 323],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [emberBasicAttack1, emberBasicAttack2, emberBasicAttack3, emberBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: emberFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: emberPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: emberBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: emberUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: emberComboSkill,
    },
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
    },
  ],
  comboSkillPriority: 'default',
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent1',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'shelterrate',
          operation: 'assign',
          value: [0.300000011920929, 0.5],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent1',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'shelterrate',
          operation: 'assign',
          value: [0.300000011920929, 0.5],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      passiveSkills: [
        {
          key: 'chr_0009_azrila_talent_2',
          blackboard: { attack: [0.0599999986588955, 0.0900000035762787], duration: [7, 7] },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0009_azrila_talent_2',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                attack: { kind: 'blackboard', key: 'attack' },
                duration: { kind: 'blackboard', key: 'duration' },
              },
            }),
          ),
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
          blackboardKey: 'potential_1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'extrashelter',
          operation: 'assign',
          value: 0.200000002980232,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'extratime',
          operation: 'assign',
          value: 1.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'extrashelter',
          operation: 'assign',
          value: 0.200000002980232,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'extratime',
          operation: 'assign',
          value: 1.5,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['strength'], value: 20 },
        { kind: 'addBuildAttribute', attributes: ['will'], value: 20 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'extracure',
          operation: 'assign',
          value: 0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
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
          multiplier: 0.850000023841858,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'extrashield',
          operation: 'assign',
          value: 1.20000004768372,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'extraattack',
          operation: 'assign',
          value: 0.100000001490116,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0009_azrila_normal_skill_gpsuccess: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      applyTags: [],
      extendTags: [],
      blackboard: { def: 0, dur: 0, prob: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('startTimeDilation', {
              scope: 'entity',
              durationSeconds: { kind: 'constant', value: 0.200000002980232 },
              slot: 'TimeDilation/Layer/Entity/HitStop',
              priority: 100,
              curve: { kind: 'named', key: 'char_hard_stop' },
              finishByAction: false,
              targets: ['enemy', 'caster'],
            }),
          ),
          96,
        ),
      ],
      abilityEventResponses: [
        {
          event: 'skillEnd',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillIdIn', skillIds: ['chr_0009_azrila_normal_skill'] },
              sequence(step('finishCurrentBuff', { reason: 'other' })),
            ),
          ),
        },
      ],
    },
    buff_chr_0009_azrila_normal_skill_shelter: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_affix_shelter',
        iconPath: '/icons/icon_battle_affix_shelter.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
        showInSquadIcon: false,
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
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0, rate: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_shelter',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
          }),
        ),
      },
    },
    buff_chr_0009_azrila_talent_2: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { attack: 0, duration: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'takeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'actionInputTargetObjectTypeMatch', objectTypeMask: 16 },
              sequence(
                branch(
                  {
                    kind: 'eventDamageFeaturesMatch',
                    match: 'exceptAny',
                    features: ['dot', 'remainArea'],
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0009_azrila_talent_2_buff',
                      target: 'buffOwner',
                      source: 'buffOwner',
                      inheritSourceSkillCastInfo: true,
                      asChildBuff: true,
                      blackboardAssignments: {
                        attack: { kind: 'blackboard', key: 'attack' },
                        duration: { kind: 'blackboard', key: 'duration' },
                      },
                    }),
                  ),
                ),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0009_azrila_talent_2_buff: {
      stackingType: 'enhanceAndOverwriteDuration',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
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
      applyTags: [],
      extendTags: [],
      blackboard: { attack: 0, duration: 0 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'attack' } },
      ],
    },
    buff_chr_0009_azrila_ultimate_skill_shield_extraattack: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 0,
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
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
      applyTags: [],
      extendTags: [],
      blackboard: {
        duration: 8,
        extraattack: 0,
        extrashield: 0,
        hp_percent: 0,
        potential_5: 0,
        shelter: 0,
      },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'extraattack' } },
      ],
    },
    buff_chr_0009_azrila_ultimateshield: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_shield',
        iconPath: '/icons/icon_battle_shield.webp',
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
      blackboard: {
        duration: 8,
        extraattack: 0,
        extrashield: 0,
        FinalShield: 0,
        hp_percent: 0,
        potential_5: 0,
        shelter: 0,
      },
      attributeModifiers: [],
      shields: [
        {
          infinityValue: false,
          value: { blackboardKey: 'FinalShield' },
          damageAbsorptions: [],
          absorbCount: -1,
          absorbAllDamageWhenConsumed: false,
          removeBuffWhenConsumed: true,
          priority: 'normal',
          replaceHitEffect: false,
        },
      ],
      lifecycleSequences: {
        start: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0009_azrila_ultimate_skill_shield_extraattack',
                target: 'buffOwner',
                source: 'buffSource',
                inheritSourceSkillCastInfo: true,
                asChildBuff: true,
                blackboardAssignments: { extraattack: { kind: 'blackboard', key: 'extraattack' } },
              }),
            ),
          ),
        ),
      },
    },
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
