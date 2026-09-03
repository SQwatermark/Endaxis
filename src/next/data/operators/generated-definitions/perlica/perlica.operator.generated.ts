/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const perlicaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0004_pelica_attack1',
    timelineBlockFrames: 16,
    naturalDurationFrames: 166,
    exclusiveFrame: 15,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 5,
          endFrame: 27,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0004_pelica_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 16, endFrame: 27, sourceSkillIds: ['chr_0004_pelica_attack2'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0004_pelica_attack1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:projectile_chr_0004_pelica_normal_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0004_pelica_attack1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:chr_0004_pelica_attack1_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0004_pelica_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
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
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        8,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.25, 0.280000001192093, 0.310000002384186, 0.330000013113022, 0.360000014305115,
      0.379999995231628, 0.409999996423721, 0.430000007152557, 0.46000000834465, 0.490000009536743,
      0.529999971389771, 0.569999992847443,
    ],
  },
);

export const perlicaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0004_pelica_attack2',
    timelineBlockFrames: 18,
    naturalDurationFrames: 168,
    exclusiveFrame: 22,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 28,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0004_pelica_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 18, endFrame: 28, sourceSkillIds: ['chr_0004_pelica_attack3'] },
      ],
    },
    costFrame: 11,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0004_pelica_attack2.actionGroupData.timelineActions[1]._sequenceActionData.actionData[0]:projectile_chr_0004_pelica_normal_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0004_pelica_attack2.actionGroupData.timelineActions[1]._sequenceActionData.actionData[0]:chr_0004_pelica_attack2_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0004_pelica_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'casterControlled' },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb' },
                        coefficient: { kind: 'constant', value: 0.333333313465118 },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'normalAttack',
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        9,
      ),
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0004_pelica_attack2.actionGroupData.timelineActions[2]._sequenceActionData.actionData[0]:projectile_chr_0004_pelica_normal_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0004_pelica_attack2.actionGroupData.timelineActions[2]._sequenceActionData.actionData[0]:chr_0004_pelica_attack2_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0004_pelica_attack2:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'casterControlled' },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb' },
                        coefficient: { kind: 'constant', value: 0.333333313465118 },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'normalAttack',
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
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
      0.150000005960464, 0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489,
      0.230000004172325, 0.239999994635582, 0.259999990463257, 0.270000010728836, 0.28999999165535,
      0.310000002384186, 0.340000003576279,
    ],
    display_atk_scale: [
      0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978,
      0.449999988079071, 0.479999989271164, 0.509999990463257, 0.540000021457672, 0.579999983310699,
      0.620000004768372, 0.680000007152557,
    ],
  },
);

export const perlicaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0004_pelica_attack3',
    timelineBlockFrames: 26,
    naturalDurationFrames: 173,
    exclusiveFrame: 29,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 8,
          endFrame: 40,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0004_pelica_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 26, endFrame: 40, sourceSkillIds: ['chr_0004_pelica_attack4'] },
      ],
    },
    costFrame: 13,
    scheduledSequences: [
      scheduled(
        16,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0004_pelica_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:projectile_chr_0004_pelica_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0004_pelica_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:chr_0004_pelica_attack3_projhit',
                {},
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0004_pelica_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
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
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        16,
      ),
      scheduled(
        19,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0004_pelica_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0004_pelica_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0004_pelica_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0004_pelica_attack3_projhit',
                {},
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0004_pelica_attack3:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
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
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        19,
      ),
      scheduled(
        22,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0004_pelica_attack3.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:projectile_chr_0004_pelica_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0004_pelica_attack3.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:chr_0004_pelica_attack3_projhit',
                {},
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0004_pelica_attack3:/scheduledSequences/2/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
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
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
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
      0.119999997317791, 0.140000000596046, 0.150000005960464, 0.159999996423721, 0.170000001788139,
      0.189999997615814, 0.200000002980232, 0.209999993443489, 0.219999998807907, 0.239999994635582,
      0.259999990463257, 0.280000001192093,
    ],
    display_atk_scale: [
      0.370000004768372, 0.409999996423721, 0.449999988079071, 0.479999989271164, 0.519999980926514,
      0.560000002384186, 0.589999973773956, 0.629999995231628, 0.670000016689301, 0.709999978542328,
      0.769999980926514, 0.839999973773956,
    ],
  },
);

export const perlicaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0004_pelica_attack4',
    timelineBlockFrames: 44,
    naturalDurationFrames: 269,
    exclusiveFrame: 43,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 29,
          endFrame: 64,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0004_pelica_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 54, endFrame: 64, sourceSkillIds: ['chr_0004_pelica_attack1'] },
      ],
    },
    costFrame: 13,
    scheduledSequences: [
      scheduled(
        27,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0004_pelica_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:projectile_chr_0004_pelica_normal_attack4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0004_pelica_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:chr_0004_pelica_attack4_projhit',
                {},
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack', 'normalAttackLastCombo'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                      staggerOnlyWhenCasterControlled: true,
                    },
                    'chr_0004_pelica_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
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
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        27,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 15,
    atk_scale: [
      0.569999992847443, 0.620000004768372, 0.680000007152557, 0.730000019073486, 0.790000021457672,
      0.850000023841858, 0.899999976158142, 0.959999978542328, 1.01999998092651, 1.0900000333786,
      1.16999995708466, 1.26999998092651,
    ],
    poise: 15,
  },
);

export const perlicaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0004_pelica_power_attack',
    timelineBlockFrames: 35,
    naturalDurationFrames: 135,
    exclusiveFrame: 50,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 35,
          endFrame: 58,
          sourceSkillIds: ['chr_0004_pelica_normal_skill', 'chr_0004_pelica_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        35,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0004_pelica_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('applyKnockDown', {
                target: 'enemy',
                duration: { kind: 'constant', value: 1.5 },
                force: true,
                isExtra: false,
                targetFilter: 'skipAll',
                returnWhen: 'always',
              }),
              step('gainFinisherSp', { factor: 1, recipient: 'team' }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        44,
      ),
      scheduled(
        35,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'common' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        38,
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
        35,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  {
    addition_vertical: 0,
    atk_scale: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
    cam_angle: 0,
    cam_duration: 0,
    input_angle: 0,
    look_at_x: 0,
    vertical: 0,
  },
);

export const perlicaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0004_pelica_plunging_attack_end',
    timelineBlockFrames: 21,
    naturalDurationFrames: 168,
    exclusiveFrame: 20,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0004_pelica_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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
        8,
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

export const perlicaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0004_pelica_normal_skill',
    timelineBlockFrames: 28,
    naturalDurationFrames: 155,
    exclusiveFrame: 30,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 28, endFrame: 54, sourceSkillIds: ['chr_0004_pelica_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        2,
      ),
      scheduled(
        13,
        sequence(
          step('applyElementalInfliction', { element: 'electric', isExtra: false }),
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0004_pelica_normal_skill:/scheduledSequences/1/sequence/steps/1',
          ),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
        13,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atk_scale: [
      1.77999997138977, 1.96000003814697, 2.13000011444092, 2.30999994277954, 2.49000000953674,
      2.67000007629395, 2.84999990463257, 3.01999998092651, 3.20000004768372, 3.42000007629395,
      3.69000005722046, 4,
    ],
    atk_scale_2: 0,
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    gained_atb: 0,
    input_angle: 0,
    poise: 10,
    select_radius: 10,
  },
);

export const perlicaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0004_pelica_combo_skill',
    timelineBlockFrames: 25,
    naturalDurationFrames: 115,
    exclusiveFrame: 45,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 25, endFrame: 54, sourceSkillIds: ['chr_0004_pelica_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        24,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0004_pelica_combo_skill.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:projectile_chr_0004_pelica_combo_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0004_pelica_combo_skill.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:chr_0004_pelica_combo_skill_projhit',
                {
                  atb: 0,
                  atk_scale: 1,
                  duration: 5,
                  extra_scaling: 1,
                  level: 1,
                  poise: 0,
                  talent2: 0,
                  usp: 0,
                },
                true,
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_common_pulse_pulse_conduct_triggered',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'duration' },
                      extra_scaling: { kind: 'blackboard', key: 'extra_scaling' },
                    },
                  }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['comboSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0004_pelica_combo_skill:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/1',
                  ),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'constant', value: 1 },
                      operator: 'greaterOrEqual',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'caster',
                      }),
                    ),
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            { EntityBB_bounced: 0 },
            { lifetime: 'execution' },
          ),
        ),
        27,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.833000004291534 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        22,
      ),
    ],
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 570],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atb: 0,
    atk_scale: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    duration: 5,
    extra_scaling: 1,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    select_radius: 4,
    talent2: 0,
    usp: 10,
  },
);

export const perlicaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0004_pelica_ultimate_skill',
    timelineBlockFrames: 63,
    naturalDurationFrames: 114,
    exclusiveFrame: 85,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 63,
          endFrame: 90,
          sourceSkillIds: ['chr_0004_pelica_normal_skill', 'chr_0004_pelica_combo_skill'],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        1,
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
        50,
      ),
      scheduled(
        58,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              instantAttributeModifiers: [
                {
                  targetSide: 'attacker',
                  attribute: 'criticalRate',
                  slot: 'baseAddition',
                  value: { kind: 'blackboard', key: 'crit' },
                  attributeTiming: 'runtime',
                },
              ],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0004_pelica_ultimate_skill:/scheduledSequences/2/sequence/steps/0',
          ),
        ),
        63,
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
        85,
      ),
      scheduled(
        55,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0004_pelica_ultimate_skill',
            childSkillId: 'chr_0004_pelica_ultimate_skill_abilityrange',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
          }),
        ),
        58,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: [
      4.44999980926514, 4.8899998664856, 5.34000015258789, 5.78000020980835, 6.21999979019165,
      6.67000007629395, 7.1100001335144, 7.55999994277954, 8, 8.5600004196167, 9.22999954223633, 10,
    ],
    atk_scale_2: 0,
    crit: 0,
    poise: 20,
    radius: 4,
    select_radius: 10,
  },
);

export default {
  slug: 'perlica',
  gameId: 'PERLICA',
  rarity: 5,
  weaponType: 'arts-unit',
  element: 'electric',
  role: 'caster',
  mainAttribute: 'intellect',
  secondaryAttribute: 'will',
  attributes: {
    strength: [9, 26, 45, 64, 82, 91],
    agility: [9, 27, 46, 65, 84, 93],
    intellect: [21, 51, 83, 114, 145, 161],
    will: [13, 34, 57, 79, 102, 113],
    baseAttack: [30, 88, 150, 211, 272, 303],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [perlicaBasicAttack1, perlicaBasicAttack2, perlicaBasicAttack3, perlicaBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: perlicaFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: perlicaPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: perlicaBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: perlicaComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: perlicaUltimate },
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
      event: 'beforeTakeDamage',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['normalAttackLastCombo'] },
          sequence(
            branch(
              { kind: 'eventSourceControlled' },
              sequence(
                branch(
                  {
                    kind: 'contextTargetObjectTypeMatch',
                    contextKey: 'trigger',
                    objectTypeMask: 16,
                  },
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
      key: 'staggerDamageBonus',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0004_pelica_talent_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { dmg: [0.200000002980232, 0.300000011920929] },
        }),
      ),
    },
    {
      key: 'comboRicochetAgainstBrokenEnemy',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent2',
          operation: 'assign',
          value: 1,
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'extendedElectrification',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'duration',
          operation: 'multiply',
          value: 1.75,
        },
      ],
    },
    {
      key: 'reducedUltimateCost',
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
      key: 'attackAfterElectrification',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0004_pelica_potential_3',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            atk_up: { kind: 'constant', value: 0.200000002980232 },
            atk_duration: { kind: 'constant', value: 5 },
            max_stack: { kind: 'constant', value: 2 },
          },
        }),
      ),
    },
    {
      key: 'strongerElectrification',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'extra_scaling',
          operation: 'assign',
          value: 1.33000004291534,
        },
      ],
    },
    {
      key: 'ultimateCriticalRate',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'crit',
          operation: 'add',
          value: 0.300000011920929,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0004_pelica_potential_3: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 20,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_duration: 0, atk_up: 0, max_stack: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffTagsMatch',
                match: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
              },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0004_pelica_potential_3_atkup',
                  target: 'buffOwner',
                  source: 'buffSource',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    atk_up: { kind: 'blackboard', key: 'atk_up' },
                    atk_duration: { kind: 'blackboard', key: 'atk_duration' },
                  },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0004_pelica_potential_3_atkup: {
      stackingType: 'enhanceAndRefresh',
      priority: 0,
      maxStackCount: 2,
      durationSeconds: { blackboardKey: 'atk_duration' },
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
      blackboard: { atk_duration: 0, atk_up: 0 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
      ],
    },
    buff_chr_0004_pelica_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: ['Skill/Character/chr_0004_pelica/PelicaTalent0'],
      extendTags: [],
      blackboard: { dmg: 0 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'targetPoiseCompare',
            target: 'enemy',
            returnValueIfMissing: false,
            operator: 'equal',
            value: 0,
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'attacker',
              zone: 'normal',
              addition: { blackboardKey: 'dmg' },
            },
          ],
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0004_pelica_ultimate_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      childSkill: {
        skillId: 'chr_0004_pelica_ultimate_skill_abilityrange',
        blackboard: {},
        scheduledSequences: [
          scheduled(54, sequence(step('finishActionOwnerAbilityEntity', {})), 54),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
