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
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const snowshineBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0014_aurora_attack1',
    timelineBlockFrames: 32,
    naturalDurationFrames: 111,
    exclusiveFrame: 35,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 47,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0014_aurora_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 32, endFrame: 47, sourceSkillIds: ['chr_0014_aurora_attack2'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0014_aurora_attack1:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
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
        20,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.550000011920929, 0.610000014305115, 0.660000026226044, 0.720000028610229, 0.769999980926514,
      0.829999983310699, 0.879999995231628, 0.939999997615814, 0.990000009536743, 1.05999994277954,
      1.13999998569489, 1.24000000953674,
    ],
    env_dmg: 20,
  },
);

export const snowshineBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0014_aurora_attack2',
    timelineBlockFrames: 28,
    naturalDurationFrames: 110,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 43,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0014_aurora_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 28, endFrame: 43, sourceSkillIds: ['chr_0014_aurora_attack3'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0014_aurora_attack2:/scheduledSequences/0/sequence/steps/0',
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
        20,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.589999973773956, 0.639999985694885, 0.699999988079071, 0.759999990463257, 0.819999992847443,
      0.879999995231628, 0.939999997615814, 0.990000009536743, 1.04999995231628, 1.12999999523163,
      1.21000003814697, 1.32000005245209,
    ],
    env_dmg: 25,
  },
);

export const snowshineBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0014_aurora_attack3',
    timelineBlockFrames: 61,
    naturalDurationFrames: 131,
    exclusiveFrame: 65,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 75,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0014_aurora_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 61, endFrame: 75, sourceSkillIds: ['chr_0014_aurora_attack1'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        21,
        sequence(
          repeatEachTick(
            sequence(
              step('calculateActionValue', {
                key: 'atk_scale1',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale' },
                right: { kind: 'constant', value: 0.400000005960464 },
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                  tags: ['normalAttack'],
                },
                'chr_0014_aurora_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/1',
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
        27,
      ),
      scheduled(
        39,
        sequence(
          repeatEachTick(
            sequence(
              step('calculateActionValue', {
                key: 'atk_scale2',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale' },
                right: { kind: 'constant', value: 0.600000023841858 },
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0014_aurora_attack3:/scheduledSequences/1/sequence/steps/0/body/steps/1',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.349999994039536 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_normal_attack' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                  once(
                    'SkillData.chr_0014_aurora_attack3.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0].actionOnTick.actionData[3].succeedActions.actionData[0].succeedActions.actionData[2]',
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
        43,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 25,
    atk_scale: [
      1, 1.10000002384186, 1.20000004768372, 1.29999995231628, 1.39999997615814, 1.5,
      1.60000002384186, 1.70000004768372, 1.79999995231628, 1.92999994754791, 2.07999992370605,
      2.25,
    ],
    atk_scale1: 0,
    atk_scale2: 0.8,
    env_dmg: 25,
    env_dmg2: 30,
    poise: 23,
  },
);

export const snowshineFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0014_aurora_power_attack',
    timelineBlockFrames: 41,
    naturalDurationFrames: 133,
    exclusiveFrame: 75,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 41,
          endFrame: 75,
          sourceSkillIds: ['chr_0014_aurora_normal_skill', 'chr_0014_aurora_combo_skill'],
        },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        41,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0014_aurora_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.600000023841858 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'auro_power_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        43,
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
        41,
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

export const snowshinePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0014_aurora_plunging_attack_end',
    timelineBlockFrames: 21,
    naturalDurationFrames: 90,
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
            'chr_0014_aurora_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const snowshineBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0014_aurora_normal_skill',
    timelineBlockFrames: 135,
    naturalDurationFrames: 208,
    exclusiveFrame: 145,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 135, endFrame: 145, sourceSkillIds: ['chr_0014_aurora_normal_skill'] },
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
        5,
      ),
      scheduled(
        107,
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
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_2_sup' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'talent_2_sup' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        109,
      ),
      scheduled(106, sequence(step('finishTimeline', {})), 107),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0014_aurora_reduce_damage',
            target: 'party',
            finishByAction: true,
            blackboardAssignments: {
              taken_dmg: { kind: 'blackboard', key: 'taken_dmg' },
              potential_1: { kind: 'blackboard', key: 'potential_1' },
            },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_1' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0014_aurora_potential_1_listener',
                target: 'party',
                finishByAction: true,
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        51,
      ),
      scheduled(
        0,
        sequence(
          step('listenForCombatEvents', {
            responses: [
              {
                key: 'SkillData.chr_0014_aurora_normal_skill.actionGroupData.timelineActions[19]._sequenceActionData.actionData[0].abilityActionMap[0].actions[0]',
                event: { kind: 'operatorHit' },
                sequence: sequence(
                  branch(
                    {
                      kind: 'eventDamageFeaturesMatch',
                      match: 'exceptAny',
                      features: ['dot', 'remainArea'],
                    },
                    sequence(step('jumpTimeline', { destinationFrame: 107 })),
                  ),
                ),
              },
              {
                key: 'SkillData.chr_0014_aurora_normal_skill.actionGroupData.timelineActions[19]._sequenceActionData.actionData[0].abilityActionMap[1].actions[0]',
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
                        sequence(step('jumpTimeline', { destinationFrame: 107 })),
                      ),
                    ),
                  ),
                ),
              },
            ],
          }),
        ),
        51,
      ),
      scheduled(
        107,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0014_aurora_reduce_damage',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'constant', value: 1 },
              taken_dmg: { kind: 'blackboard', key: 'taken_dmg' },
            },
          }),
        ),
        108,
      ),
      scheduled(
        125,
        sequence(
          repeatEachTick(
            sequence(
              step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
              once(
                'SkillData.chr_0014_aurora_normal_skill.actionGroupData.timelineActions[25]._sequenceActionData.actionData[0].actionOnTick.actionData[1]',
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'potential_5_atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'refund',
                    spGainSource: 'skill',
                  }),
                ),
              ),
              step(
                'dealDamage',
                {
                  damageType: 'cryo',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0014_aurora_normal_skill:/scheduledSequences/8/sequence/steps/0/body/steps/2',
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
        127,
      ),
      scheduled(
        107,
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
        110,
      ),
      scheduled(
        107,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0014_aurora_reduce_damage',
            target: 'party',
            finishByAction: true,
            blackboardAssignments: { taken_dmg: { kind: 'blackboard', key: 'taken_dmg' } },
          }),
        ),
        125,
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
      2, 2.20000004768372, 2.40000009536743, 2.59999990463257, 2.79999995231628, 3,
      3.20000004768372, 3.40000009536743, 3.59999990463257, 3.84999990463257, 4.15000009536743, 4.5,
    ],
    is_cam: 1,
    poise: 20,
    potential_1: 0,
    potential_5_atb: 0,
    taken_dmg: 0.9,
    talent_2_sup: 0,
    dmg_reduce: 0.899999976158142,
  },
);

export const snowshineComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0014_aurora_combo_skill',
    timelineBlockFrames: 15,
    naturalDurationFrames: 123,
    exclusiveFrame: 45,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 15, endFrame: 60, sourceSkillIds: ['chr_0014_aurora_normal_skill'] },
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
        12,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'caster',
          }),
          branch(
            { kind: 'casterControlled' },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0014_aurora_combo_skill.actionGroupData.timelineActions[4]._sequenceActionData.actionData[2].succeedActions.actionData[1]:projectile_chr_0014_aurora_combo_skill_bear_out',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0014_aurora_combo_skill.actionGroupData.timelineActions[4]._sequenceActionData.actionData[2].succeedActions.actionData[1]:chr_0014_aurora_combo_skill_bear_gene',
                    {
                      atk_scale: 0.42,
                      duration: 0,
                      heal_scale: 0,
                      heal_scale_loop: 0,
                      heal_static_value: 0,
                      heal_static_value_loop: 0,
                      interval: 0,
                    },
                    true,
                    sequence(
                      step('spawnAbilityEntity', {
                        abilityEntityId: 'abilityentity_chr_0014_aurora_combo_skill',
                        childSkillId: 'chr_0014_aurora_combo_skill_abilityrange',
                        inheritActionBlackboard: true,
                        inheritSourceSkillCastInfo: true,
                        dieWhenSourceDies: false,
                        target: 'enemy',
                      }),
                    ),
                    undefined,
                    { lifetime: 'execution', alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution' },
              ),
            ),
            sequence(
              step('findCharacterTeamTargets', {
                saveToContextKey: 'BearPos',
                selection: { kind: 'controlledOperator' },
              }),
              withActionBlackboardScope(
                'SkillData.chr_0014_aurora_combo_skill.actionGroupData.timelineActions[4]._sequenceActionData.actionData[2].failActions.actionData[2]:projectile_chr_0014_aurora_combo_skill_bear_out',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0014_aurora_combo_skill.actionGroupData.timelineActions[4]._sequenceActionData.actionData[2].failActions.actionData[2]:chr_0014_aurora_combo_skill_bear_gene',
                    {
                      atk_scale: 0.42,
                      duration: 0,
                      heal_scale: 0,
                      heal_scale_loop: 0,
                      heal_static_value: 0,
                      heal_static_value_loop: 0,
                      interval: 0,
                    },
                    true,
                    sequence(
                      step('spawnAbilityEntity', {
                        abilityEntityId: 'abilityentity_chr_0014_aurora_combo_skill',
                        childSkillId: 'chr_0014_aurora_combo_skill_abilityrange',
                        inheritActionBlackboard: true,
                        inheritSourceSkillCastInfo: true,
                        dieWhenSourceDies: false,
                        target: 'enemy',
                      }),
                    ),
                    undefined,
                    { lifetime: 'execution', alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution' },
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        15,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.532999992370605 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        13,
      ),
    ],
    cooldownFrames: [750, 750, 750, 750, 750, 750, 750, 750, 720, 720, 720, 690],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: 0.42,
    cam_angle: 0,
    cam_duration: 0,
    duration: 3,
    heal_scale: [
      0.219999998807907, 0.270000010728836, 0.310000002384186, 0.360000014305115, 0.379999995231628,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.469999998807907, 0.479999989271164,
      0.490000009536743, 0.5,
    ],
    heal_scale_loop: [
      0.0599999986588955, 0.0700000002980232, 0.0799999982118607, 0.0900000035762787,
      0.100000001490116, 0.100000001490116, 0.109999999403954, 0.109999999403954, 0.119999997317791,
      0.119999997317791, 0.119999997317791, 0.129999995231628,
    ],
    heal_static_value: [
      96, 115.199996948242, 134.399993896484, 153.600006103516, 163.199996948242, 172.800003051758,
      182.399993896484, 192, 201.600006103516, 206.399993896484, 211.199996948242, 216,
    ],
    heal_static_value_loop: [
      24, 28.7999992370605, 33.5999984741211, 38.4000015258789, 40.7999992370605, 43.2000007629395,
      45.5999984741211, 48, 50.4000015258789, 51.5999984741211, 52.7999992370605, 54,
    ],
    input_angle: 0,
    interval: 0.5,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    usp: 10,
    trigger_hp_ratio: 0.600000023841858,
  },
);

export const snowshineUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0014_aurora_ultimate_skill',
    timelineBlockFrames: 71,
    naturalDurationFrames: 142,
    exclusiveFrame: 90,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 71,
          endFrame: 90,
          sourceSkillIds: ['chr_0014_aurora_normal_skill', 'chr_0014_aurora_combo_skill'],
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
        62,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0014_aurora_ultimate_skill:/scheduledSequences/1/sequence/steps/0',
          ),
        ),
        65,
      ),
      scheduled(
        62,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_2' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0014_aurora_ultimate_skill',
                childSkillId: 'chr_0014_aurora_ultimate_skill_abilityrange_potential2',
                inheritActionBlackboard: true,
                inheritSourceSkillCastInfo: true,
                dieWhenSourceDies: false,
              }),
            ),
            sequence(
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0014_aurora_ultimate_skill',
                childSkillId: 'chr_0014_aurora_ultimate_skill_abilityrange',
                inheritActionBlackboard: true,
                inheritSourceSkillCastInfo: true,
                dieWhenSourceDies: false,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        65,
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
        60,
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
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: [
      2, 2.20000004768372, 2.40000009536743, 2.59999990463257, 2.79999995231628, 3,
      3.20000004768372, 3.40000009536743, 3.59999990463257, 3.84999990463257, 4.15000009536743, 4.5,
    ],
    extra_duration: 0,
    frozen_level: 1,
    poise: [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
    potential_2: 0,
    potential_2_range: 0,
    atk_scale_loop: [
      0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372, 0.400000005960464,
      0.430000007152557, 0.46000000834465, 0.490000009536743, 0.519999980926514, 0.550000011920929,
      0.600000023841858, 0.649999976158142,
    ],
    duration: 5,
    forst_allow_count: 2,
    interval: 0.5,
  },
);

export default {
  slug: 'snowshine',
  gameId: 'SNOWSHINE',
  rarity: 5,
  weaponType: 'greatsword',
  element: 'cryo',
  role: 'defender',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [18, 47, 78, 108, 139, 154],
    agility: [12, 32, 52, 73, 94, 104],
    intellect: [9, 27, 46, 65, 84, 93],
    will: [10, 31, 53, 75, 97, 108],
    baseAttack: [30, 87, 147, 207, 267, 297],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [snowshineBasicAttack1, snowshineBasicAttack2, snowshineBasicAttack3],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: snowshineFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: snowshinePlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: snowshineBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: snowshineComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: snowshineUltimate },
  ],
  skillSlots: [
    { key: 'battleSkill', baseSkillKey: 'battleSkill', replacementSkillKeys: [] },
    { key: 'comboSkill', baseSkillKey: 'comboSkill', replacementSkillKeys: [] },
    { key: 'ultimate', baseSkillKey: 'ultimate', replacementSkillKeys: [] },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: ['basicAttack1', 'basicAttack2', 'basicAttack3', 'plungingAttack', 'finisher'],
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
                value: { kind: 'constant', value: 0.6 },
              },
              sequence(),
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
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0014_aurora_talent_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            heal_up: [0.150000005960464, 0.25],
            rate: [0.449999988079071, 0.550000011920929],
          },
        }),
      ),
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_2_sup',
          operation: 'assign',
          value: [6, 10],
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
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_2',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_2_range',
          operation: 'assign',
          value: 0.200000002980232,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'extra_duration',
          operation: 'add',
          value: 2,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        { kind: 'modifyBasePanelStat', stat: 'defense', operation: 'flat', value: 20 },
        { kind: 'addBuildAttribute', attributes: ['will'], value: 20 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_5_atb',
          operation: 'assign',
          value: 10,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0014_aurora_combo_skill_heal: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: 0.100000001490116,
      applyTags: [],
      extendTags: [],
      blackboard: { heal_scale: 1, heal_static_value: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('heal', {
            target: 'buffOwner',
            alwaysNext: true,
            tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
            attribute: 'will',
            multiplier: { kind: 'blackboard', key: 'heal_scale' },
            addition: { kind: 'blackboard', key: 'heal_static_value' },
          }),
        ),
      },
    },
    buff_chr_0014_aurora_combo_skill_heal_loop: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'interval' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: 999,
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0, heal_scale_loop: 0, heal_static_value_loop: 0, interval: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          step('heal', {
            target: 'buffOwner',
            alwaysNext: true,
            tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
            attribute: 'will',
            multiplier: { kind: 'blackboard', key: 'heal_scale_loop' },
            addition: { kind: 'blackboard', key: 'heal_static_value_loop' },
          }),
        ),
      },
    },
    buff_chr_0014_aurora_potential_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0.05 },
      attributeModifiers: [],
    },
    buff_chr_0014_aurora_potential_1_listener: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 9999 },
      attributeModifiers: [],
    },
    buff_chr_0014_aurora_reduce_damage: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ['Skill/Character/Common/Shielded'],
      extendTags: [],
      blackboard: { duration: 9999, potential_1: 0, taken_dmg: 0.1 },
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
            buffId: 'buff_chr_0014_aurora_reduce_damage_remain',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'constant', value: 0.5 },
              potential_1: { kind: 'blackboard', key: 'potential_1' },
              taken_dmg: { kind: 'blackboard', key: 'taken_dmg' },
            },
          }),
        ),
      },
    },
    buff_chr_0014_aurora_reduce_damage_remain: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0.5, potential_1: 0, taken_dmg: 0.1 },
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
      },
    },
    buff_chr_0014_aurora_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { heal_up: 0.1, rate: 0.5 },
      attributeModifiers: [],
      healModifiers: [
        {
          enabledSide: 'healer',
          condition: {
            kind: 'targetHealthCompare',
            valueType: 'ratio',
            operator: 'lessOrEqual',
            value: { blackboardKey: 'rate' },
          },
          processors: [
            {
              kind: 'modifyCalculationResult',
              timing: 'afterCalculation',
              baseMultiplier: { blackboardKey: 'heal_up' },
              multiplierCount: 1,
            },
          ],
        },
      ],
    },
    buff_chr_0014_aurora_ultimate_skill_dmg: {
      stackingType: 'highPriority',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 5,
      triggerIntervalSeconds: 0.5,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale_loop: 0.1 },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale_loop' },
              tags: ['ultimateSkill'],
            },
            'buff_chr_0014_aurora_ultimate_skill_dmg:/lifecycleSequences/trigger/steps/0',
          ),
        ),
      },
    },
    buff_chr_0014_aurora_ultimate_skill_frost: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: 2,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 5, extra_duration: 0, frozen_level: 1 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          branch(
            {
              kind: 'enemySuperArmorCompare',
              operator: 'less',
              value: { kind: 'constant', value: 30 },
            },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 2 },
                slot: 'TimeDilation/Layer/Entity/Frozen',
                priority: 50,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 1,
                      inTangent: -1,
                      outTangent: -1,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0.333333343267441,
                    },
                    {
                      time: 1,
                      value: 0,
                      inTangent: -1,
                      outTangent: -1,
                      weightedMode: 0,
                      inWeight: 0.333333343267441,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: true,
                targets: ['enemy'],
              }),
            ),
          ),
        ),
        trigger: sequence(
          step('applyBuff', {
            buffId: 'buff_common_cryst_cryst_frozen_triggered',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              extra_duration: { kind: 'blackboard', key: 'extra_duration' },
            },
          }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0014_aurora_combo_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'SelectCategory/ProjectilePassThru',
      ],
      lifetime: { kind: 'limited', durationSeconds: 3 },
      deathReleaseDelaySeconds: 0.100000001490116,
      childSkill: {
        skillId: 'chr_0014_aurora_combo_skill_abilityrange',
        blackboard: {
          duration: 0,
          heal_scale: 1,
          heal_scale_loop: 1,
          heal_static_value: 0,
          heal_static_value_loop: 0,
          interval: 0,
        },
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
              step('applyBuff', {
                buffId: 'buff_chr_0014_aurora_combo_skill_heal',
                target: 'partyExceptCaster',
                finishByAction: true,
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                  heal_static_value: { kind: 'blackboard', key: 'heal_static_value' },
                },
              }),
            ),
            3,
          ),
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0014_aurora_combo_skill_heal_loop',
                target: 'partyExceptCaster',
                finishByAction: true,
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  heal_scale_loop: { kind: 'blackboard', key: 'heal_scale_loop' },
                  heal_static_value_loop: { kind: 'blackboard', key: 'heal_static_value_loop' },
                  duration: { kind: 'blackboard', key: 'duration' },
                  interval: { kind: 'blackboard', key: 'interval' },
                },
              }),
            ),
            900,
          ),
          scheduled(90, sequence(step('finishActionOwnerAbilityEntity', {})), 93),
        ],
      },
    },
    abilityentity_chr_0014_aurora_ultimate_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'SelectCategory/ProjectilePassThru',
      ],
      lifetime: { kind: 'limited', durationSeconds: 8 },
      deathReleaseDelaySeconds: 0.100000001490116,
      childSkills: {
        chr_0014_aurora_ultimate_skill_abilityrange_potential2: {
          skillId: 'chr_0014_aurora_ultimate_skill_abilityrange_potential2',
          blackboard: { atk_scale: 4, atk_scale_loop: 1, extra_duration: 0, frozen_level: 1 },
          scheduledSequences: [
            scheduled(
              4,
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0014_aurora_ultimate_skill_frost',
                  target: 'enemy',
                  finishByAction: true,
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    extra_duration: { kind: 'blackboard', key: 'extra_duration' },
                  },
                }),
                step('applyBuff', {
                  buffId: 'buff_chr_0014_aurora_ultimate_skill_dmg',
                  target: 'enemy',
                  finishByAction: true,
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    atk_scale_loop: { kind: 'blackboard', key: 'atk_scale_loop' },
                  },
                }),
              ),
              156,
            ),
          ],
        },
        chr_0014_aurora_ultimate_skill_abilityrange: {
          skillId: 'chr_0014_aurora_ultimate_skill_abilityrange',
          blackboard: { atk_scale: 4, atk_scale_loop: 1, extra_duration: 0, frozen_level: 1 },
          scheduledSequences: [
            scheduled(
              4,
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0014_aurora_ultimate_skill_frost',
                  target: 'enemy',
                  finishByAction: true,
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    extra_duration: { kind: 'blackboard', key: 'extra_duration' },
                  },
                }),
                step('applyBuff', {
                  buffId: 'buff_chr_0014_aurora_ultimate_skill_dmg',
                  target: 'enemy',
                  finishByAction: true,
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    atk_scale_loop: { kind: 'blackboard', key: 'atk_scale_loop' },
                  },
                }),
              ),
              157,
            ),
          ],
        },
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
