/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachTarget,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const estellaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0021_whiten_attack1',
    timelineBlockFrames: 13,
    naturalDurationFrames: 105,
    exclusiveFrame: 18,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 6,
          endFrame: 28,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0021_whiten_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 13, endFrame: 28, sourceSkillIds: ['chr_0021_whiten_attack2'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0021_whiten_attack1:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0799999982118607 },
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
        7,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.25, 0.280000001192093, 0.300000011920929, 0.330000013113022, 0.349999994039536,
      0.379999995231628, 0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164,
      0.519999980926514, 0.560000002384186,
    ],
  },
);

export const estellaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0021_whiten_attack2',
    timelineBlockFrames: 16,
    naturalDurationFrames: 123,
    exclusiveFrame: 28,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 7,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0021_whiten_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 16, endFrame: 30, sourceSkillIds: ['chr_0021_whiten_attack3'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0021_whiten_attack2:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.159999996423721 },
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
        7,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978,
      0.449999988079071, 0.479999989271164, 0.509999990463257, 0.540000021457672, 0.579999983310699,
      0.620000004768372, 0.680000007152557,
    ],
  },
);

export const estellaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0021_whiten_attack3',
    timelineBlockFrames: 28,
    naturalDurationFrames: 153,
    exclusiveFrame: 28,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 15,
          endFrame: 43,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0021_whiten_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 28, endFrame: 43, sourceSkillIds: ['chr_0021_whiten_attack4'] },
      ],
    },
    costFrame: 20,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0021_whiten_attack3:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
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
        8,
      ),
      scheduled(
        18,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['normalAttack'],
            },
            'chr_0021_whiten_attack3:/scheduledSequences/1/sequence/steps/0',
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
        19,
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
    atk_scale2: [
      0.200000002980232, 0.219999998807907, 0.239999994635582, 0.259999990463257, 0.280000001192093,
      0.300000011920929, 0.319999992847443, 0.340000003576279, 0.360000014305115, 0.389999985694885,
      0.419999986886978, 0.449999988079071,
    ],
    display_atk_scale: [
      0.349999994039536, 0.389999985694885, 0.419999986886978, 0.46000000834465, 0.490000009536743,
      0.529999971389771, 0.560000002384186, 0.600000023841858, 0.629999995231628, 0.670000016689301,
      0.730000019073486, 0.790000021457672,
    ],
  },
);

export const estellaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0021_whiten_attack4',
    timelineBlockFrames: 46,
    naturalDurationFrames: 134,
    exclusiveFrame: 46,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 24,
          endFrame: 59,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0021_whiten_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 46, endFrame: 59, sourceSkillIds: ['chr_0021_whiten_attack1'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        21,
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
            'chr_0021_whiten_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.379999995231628 },
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
        22,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 19,
    atk_scale: [
      0.400000005960464, 0.439999997615814, 0.479999989271164, 0.519999980926514, 0.560000002384186,
      0.600000023841858, 0.639999985694885, 0.680000007152557, 0.720000028610229, 0.769999980926514,
      0.829999983310699, 0.899999976158142,
    ],
    atk_scale_2: 0,
    poise: 17,
  },
);

export const estellaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0021_whiten_power_attack',
    timelineBlockFrames: 30,
    naturalDurationFrames: 151,
    exclusiveFrame: 50,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 30,
          endFrame: 58,
          sourceSkillIds: ['chr_0021_whiten_normal_skill', 'chr_0021_whiten_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        30,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'white_power' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        33,
      ),
      scheduled(
        30,
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
            'chr_0021_whiten_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
        ),
        39,
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
        30,
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

export const estellaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0021_whiten_plunging_attack_end',
    timelineBlockFrames: 16,
    naturalDurationFrames: 175,
    exclusiveFrame: 15,
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
            'chr_0021_whiten_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const estellaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0021_whiten_normal_skill',
    timelineBlockFrames: 46,
    naturalDurationFrames: 121,
    exclusiveFrame: 45,
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
        3,
      ),
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        7,
      ),
      scheduled(
        21,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0021_whiten_normal_skill.actionGroupData.timelineActions[8]._sequenceActionData.actionData[1].succeedActions.actionData[1]:projectile_chr_0021_whiten_normal_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0021_whiten_normal_skill.actionGroupData.timelineActions[8]._sequenceActionData.actionData[1].succeedActions.actionData[1]:chr_0021_whiten_normal_skill_projhit',
                { atk_scale: 0, dmg_up: 0, poise: 30, up_atk_scale: 0 },
                true,
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  forEachTarget(
                    'enemy',
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'EntityBB_first_hit' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'EntityBB_first_hit',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                          step('modifyActionValue', {
                            key: 'up_atk_scale',
                            operation: 'assign',
                            value: { kind: 'blackboard', key: 'atk_scale' },
                          }),
                          step(
                            'dealDamage',
                            {
                              damageType: 'cryo',
                              attackScale: { kind: 'blackboard', key: 'up_atk_scale' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              instantDamageScaleModifiers: [
                                {
                                  side: 'attacker',
                                  zone: 'normal',
                                  addition: { kind: 'blackboard', key: 'dmg_up' },
                                },
                              ],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            },
                            'chr_0021_whiten_normal_skill:/scheduledSequences/2/sequence/steps/0/body/steps/0/body/steps/1/body/steps/0/whenTrue/steps/2',
                          ),
                          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.0500000007450581 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: { kind: 'named', key: 'char_hard_stop' },
                            finishByAction: false,
                            targets: ['enemy', 'caster'],
                          }),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'cryo',
                              attackScale: { kind: 'blackboard', key: 'atk_scale' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            },
                            'chr_0021_whiten_normal_skill:/scheduledSequences/2/sequence/steps/0/body/steps/0/body/steps/1/body/steps/0/whenFalse/steps/0',
                          ),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            { EntityBB_first_hit: 0 },
            { lifetime: 'execution' },
          ),
        ),
        24,
      ),
      scheduled(
        21,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0021_whiten_talent_0_active'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0021_whiten_talent_0_active'] },
                desiredKey: 'atb',
                outputKey: 'atb',
              }),
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'refund',
                spGainSource: 'default',
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0021_whiten_talent_0_active'],
                reason: 'other',
              }),
            ),
          ),
        ),
        24,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb: 0,
    atk_scale: [
      1.55999994277954, 1.71000003814697, 1.87000000476837, 2.01999998092651, 2.1800000667572,
      2.33999991416931, 2.49000000953674, 2.65000009536743, 2.79999995231628, 3, 3.23000001907349,
      3.5,
    ],
    blow_off_distance: 2,
    cam_angle: 0,
    cam_duration: 0,
    distance: 8,
    distance_random_range: 0.2,
    dmg_up: 0,
    input_angle: 0,
    poise: 10,
    select_radius: 7,
    trigger: 0,
  },
);

export const estellaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0021_whiten_ultimate_skill',
    timelineBlockFrames: 60,
    naturalDurationFrames: 168,
    exclusiveFrame: 77,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 51,
          endFrame: 77,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0021_whiten_attack1',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 60,
          endFrame: 77,
          sourceSkillIds: [
            'chr_0021_whiten_attack1',
            'chr_0021_whiten_normal_skill',
            'chr_0021_whiten_combo_skill',
          ],
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
        30,
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
        54,
      ),
      scheduled(
        54,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Skill/Character/Common/Affixes/Vulnerable/VulnerablePhysic'],
                },
                sequence(
                  step('applyPhysicalInfliction', {
                    type: 'airborne',
                    target: 'enemy',
                    isExtra: false,
                    noGuardBuffId: 'buff_physical_no_guard',
                    noGuardDefinition: {
                      stackingType: 'enhanceAndRefresh',
                      priority: 100,
                      maxStackCount: 4,
                      durationSeconds: { blackboardKey: 'duration' },
                      presentation: {
                        visible: true,
                        iconId: 'icon_shadow_attribute_penetrate',
                        iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
                        showInHeadBarCommon: false,
                        showInHeadBarAttached: true,
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
                        orderPriority: {
                          useDirectoryValue: false,
                          value: 0,
                          category: 'CommonCharBuff',
                        },
                      },
                      applyTags: ['Skill/Character/Common/NoGuard'],
                      extendTags: [],
                      blackboard: {
                        atk_scale: 0,
                        count: 0,
                        duration: 20,
                        skip_handle_cryst_break: 0,
                      },
                      attributeModifiers: [],
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
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          ),
                        ),
                        finish: sequence(
                          step('applyBuff', {
                            buffId: 'buff_physical_no_guard_fake',
                            target: 'buffOwner',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                        afterEnhance: sequence(
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:0',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'buffOwner',
                                igniteType: 'NoGuard',
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:1',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              branch(
                                {
                                  kind: 'currentBuffStackCompare',
                                  operator: 'greaterOrEqual',
                                  value: { kind: 'constant', value: 2 },
                                },
                                sequence(
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
                                        target: 'buffOwner',
                                        source: 'buffSource',
                                        inheritSourceSkillCastInfo: true,
                                      }),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          },
                        ),
                      },
                    },
                    airborneBuffId: 'buff_physical_airborne',
                    airborneDefinition: {
                      stackingType: 'stack',
                      stackingKey: 'physical',
                      priority: 0,
                      maxStackCount: 1,
                      durationSeconds: { blackboardKey: 'duration' },
                      triggerIntervalSeconds: 0.100000001490116,
                      waitFirstTriggerInterval: true,
                      maxTriggerCount: 1,
                      presentation: {
                        visible: true,
                        iconId: 'airborne',
                        iconPath: '/icons/airborne.webp',
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
                        orderPriority: {
                          useDirectoryValue: false,
                          value: 0,
                          category: 'CommonCharBuff',
                        },
                      },
                      applyTags: ['Skill/Character/Common/PhysicalStatus/AirborneStatus'],
                      extendTags: [],
                      blackboard: { atk_scale: 0, duration: 3, poise: 10 },
                      attributeModifiers: [],
                      lifecycleSequences: {
                        start: sequence(
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:0',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_no_guard',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  skip_handle_cryst_break: { kind: 'constant', value: 1 },
                                },
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:1',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('readSkillSettingData', {
                                items: [
                                  {
                                    values: [1.2, 1.2, 1.2, 1.2],
                                    column: { kind: 'constant', value: 1 },
                                    storeKey: 'atk_scale',
                                    enhance: {
                                      target: 'caster',
                                      formula: { kind: 'linear', paramA: 0.01 },
                                    },
                                  },
                                  {
                                    values: [10, 10, 10, 10],
                                    column: { kind: 'constant', value: 1 },
                                    storeKey: 'poise',
                                    enhance: {
                                      target: 'caster',
                                      formula: { kind: 'linear', paramA: 0.005 },
                                    },
                                  },
                                ],
                              }),
                              step('dealDamage', {
                                damageType: 'physical',
                                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                tags: [],
                                features: ['physicalInfliction'],
                                stagger: { kind: 'blackboard', key: 'poise' },
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:2',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_handle_cryst_break',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:3',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'caster',
                                igniteType: 'PhysicalStatus',
                              }),
                            ),
                          },
                        ),
                      },
                    },
                    duration: { kind: 'constant', value: 0 },
                    height: { kind: 'constant', value: 0 },
                    speedFactorMultiplier: 1,
                    force: true,
                    targetFilter: 'aliveOnly',
                    returnWhen: 'always',
                  }),
                ),
              ),
            ),
          ),
          step('modifyActionValue', {
            key: 'atk_scale_total',
            operation: 'add',
            value: { kind: 'blackboard', key: 'atk_scale' },
          }),
          step('modifyActionValue', {
            key: 'atk_scale_total',
            operation: 'add',
            value: { kind: 'blackboard', key: 'dmg_up_total' },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_total' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0021_whiten_ultimate_skill:/scheduledSequences/2/sequence/steps/3',
          ),
        ),
        57,
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
        77,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 70 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: [
      4.8899998664856, 5.38000011444092, 5.8600001335144, 6.34999990463257, 6.84000015258789,
      7.32999992370605, 7.82000017166138, 8.3100004196167, 8.80000019073486, 9.40999984741211,
      10.1400003433228, 11,
    ],
    atk_scale_total: 0,
    dmg_up: 0.5,
    dmg_up_total: 0,
    poise: [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
    radius: 5,
  },
);

export const estellaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0021_whiten_combo_skill',
    timelineBlockFrames: 20,
    naturalDurationFrames: 154,
    exclusiveFrame: 33,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 20, endFrame: 59, sourceSkillIds: ['chr_0021_whiten_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Skill/Character/Common/SpellStatus/Frozen'],
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'has_potential1' },
                      operator: 'greaterOrEqual',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'duration',
                        operation: 'add',
                        value: { kind: 'blackboard', key: 'rate_plus' },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0021_whiten_combo_skill_physical_vulnerable',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          duration: { kind: 'blackboard', key: 'duration' },
                          rate: { kind: 'blackboard', key: 'rate' },
                        },
                      }),
                      step('applyPhysicalInfliction', {
                        type: 'airborne',
                        target: 'enemy',
                        isExtra: false,
                        noGuardBuffId: 'buff_physical_no_guard',
                        noGuardDefinition: {
                          stackingType: 'enhanceAndRefresh',
                          priority: 100,
                          maxStackCount: 4,
                          durationSeconds: { blackboardKey: 'duration' },
                          presentation: {
                            visible: true,
                            iconId: 'icon_shadow_attribute_penetrate',
                            iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
                            showInHeadBarCommon: false,
                            showInHeadBarAttached: true,
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
                            orderPriority: {
                              useDirectoryValue: false,
                              value: 0,
                              category: 'CommonCharBuff',
                            },
                          },
                          applyTags: ['Skill/Character/Common/NoGuard'],
                          extendTags: [],
                          blackboard: {
                            atk_scale: 0,
                            count: 0,
                            duration: 20,
                            skip_handle_cryst_break: 0,
                          },
                          attributeModifiers: [],
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
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                              ),
                            ),
                            finish: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_no_guard_fake',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                            afterEnhance: sequence(
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:0',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'buffOwner',
                                    igniteType: 'NoGuard',
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:1',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  branch(
                                    {
                                      kind: 'currentBuffStackCompare',
                                      operator: 'greaterOrEqual',
                                      value: { kind: 'constant', value: 2 },
                                    },
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: {
                                            kind: 'blackboard',
                                            key: 'skip_handle_cryst_break',
                                          },
                                          operator: 'equal',
                                          right: { kind: 'constant', value: 0 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_physical_handle_cryst_break',
                                            target: 'buffOwner',
                                            source: 'buffSource',
                                            inheritSourceSkillCastInfo: true,
                                          }),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              },
                            ),
                          },
                        },
                        airborneBuffId: 'buff_physical_airborne',
                        airborneDefinition: {
                          stackingType: 'stack',
                          stackingKey: 'physical',
                          priority: 0,
                          maxStackCount: 1,
                          durationSeconds: { blackboardKey: 'duration' },
                          triggerIntervalSeconds: 0.100000001490116,
                          waitFirstTriggerInterval: true,
                          maxTriggerCount: 1,
                          presentation: {
                            visible: true,
                            iconId: 'airborne',
                            iconPath: '/icons/airborne.webp',
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
                            orderPriority: {
                              useDirectoryValue: false,
                              value: 0,
                              category: 'CommonCharBuff',
                            },
                          },
                          applyTags: ['Skill/Character/Common/PhysicalStatus/AirborneStatus'],
                          extendTags: [],
                          blackboard: { atk_scale: 0, duration: 3, poise: 10 },
                          attributeModifiers: [],
                          lifecycleSequences: {
                            start: sequence(
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:0',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_no_guard',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      skip_handle_cryst_break: { kind: 'constant', value: 1 },
                                    },
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:1',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('readSkillSettingData', {
                                    items: [
                                      {
                                        values: [1.2, 1.2, 1.2, 1.2],
                                        column: { kind: 'constant', value: 1 },
                                        storeKey: 'atk_scale',
                                        enhance: {
                                          target: 'caster',
                                          formula: { kind: 'linear', paramA: 0.01 },
                                        },
                                      },
                                      {
                                        values: [10, 10, 10, 10],
                                        column: { kind: 'constant', value: 1 },
                                        storeKey: 'poise',
                                        enhance: {
                                          target: 'caster',
                                          formula: { kind: 'linear', paramA: 0.005 },
                                        },
                                      },
                                    ],
                                  }),
                                  step('dealDamage', {
                                    damageType: 'physical',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                    tags: [],
                                    features: ['physicalInfliction'],
                                    stagger: { kind: 'blackboard', key: 'poise' },
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:2',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_handle_cryst_break',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:3',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'caster',
                                    igniteType: 'PhysicalStatus',
                                  }),
                                ),
                              },
                            ),
                          },
                        },
                        duration: { kind: 'constant', value: 0 },
                        height: { kind: 'constant', value: 0 },
                        speedFactorMultiplier: 1,
                        force: true,
                        targetFilter: 'aliveOnly',
                        returnWhen: 'always',
                      }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'physical',
                          attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                          tags: ['comboSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        },
                        'chr_0021_whiten_combo_skill:/scheduledSequences/0/sequence/steps/0/body/steps/0/whenTrue/steps/0/whenTrue/steps/3',
                      ),
                    ),
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0021_whiten_combo_skill_physical_vulnerable',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          duration: { kind: 'blackboard', key: 'duration' },
                          rate: { kind: 'blackboard', key: 'rate' },
                        },
                      }),
                      step('applyPhysicalInfliction', {
                        type: 'airborne',
                        target: 'enemy',
                        isExtra: false,
                        noGuardBuffId: 'buff_physical_no_guard',
                        noGuardDefinition: {
                          stackingType: 'enhanceAndRefresh',
                          priority: 100,
                          maxStackCount: 4,
                          durationSeconds: { blackboardKey: 'duration' },
                          presentation: {
                            visible: true,
                            iconId: 'icon_shadow_attribute_penetrate',
                            iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
                            showInHeadBarCommon: false,
                            showInHeadBarAttached: true,
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
                            orderPriority: {
                              useDirectoryValue: false,
                              value: 0,
                              category: 'CommonCharBuff',
                            },
                          },
                          applyTags: ['Skill/Character/Common/NoGuard'],
                          extendTags: [],
                          blackboard: {
                            atk_scale: 0,
                            count: 0,
                            duration: 20,
                            skip_handle_cryst_break: 0,
                          },
                          attributeModifiers: [],
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
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                              ),
                            ),
                            finish: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_no_guard_fake',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                            afterEnhance: sequence(
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:0',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'buffOwner',
                                    igniteType: 'NoGuard',
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:1',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  branch(
                                    {
                                      kind: 'currentBuffStackCompare',
                                      operator: 'greaterOrEqual',
                                      value: { kind: 'constant', value: 2 },
                                    },
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: {
                                            kind: 'blackboard',
                                            key: 'skip_handle_cryst_break',
                                          },
                                          operator: 'equal',
                                          right: { kind: 'constant', value: 0 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_physical_handle_cryst_break',
                                            target: 'buffOwner',
                                            source: 'buffSource',
                                            inheritSourceSkillCastInfo: true,
                                          }),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              },
                            ),
                          },
                        },
                        airborneBuffId: 'buff_physical_airborne',
                        airborneDefinition: {
                          stackingType: 'stack',
                          stackingKey: 'physical',
                          priority: 0,
                          maxStackCount: 1,
                          durationSeconds: { blackboardKey: 'duration' },
                          triggerIntervalSeconds: 0.100000001490116,
                          waitFirstTriggerInterval: true,
                          maxTriggerCount: 1,
                          presentation: {
                            visible: true,
                            iconId: 'airborne',
                            iconPath: '/icons/airborne.webp',
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
                            orderPriority: {
                              useDirectoryValue: false,
                              value: 0,
                              category: 'CommonCharBuff',
                            },
                          },
                          applyTags: ['Skill/Character/Common/PhysicalStatus/AirborneStatus'],
                          extendTags: [],
                          blackboard: { atk_scale: 0, duration: 3, poise: 10 },
                          attributeModifiers: [],
                          lifecycleSequences: {
                            start: sequence(
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:0',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_no_guard',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      skip_handle_cryst_break: { kind: 'constant', value: 1 },
                                    },
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:1',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('readSkillSettingData', {
                                    items: [
                                      {
                                        values: [1.2, 1.2, 1.2, 1.2],
                                        column: { kind: 'constant', value: 1 },
                                        storeKey: 'atk_scale',
                                        enhance: {
                                          target: 'caster',
                                          formula: { kind: 'linear', paramA: 0.01 },
                                        },
                                      },
                                      {
                                        values: [10, 10, 10, 10],
                                        column: { kind: 'constant', value: 1 },
                                        storeKey: 'poise',
                                        enhance: {
                                          target: 'caster',
                                          formula: { kind: 'linear', paramA: 0.005 },
                                        },
                                      },
                                    ],
                                  }),
                                  step('dealDamage', {
                                    damageType: 'physical',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                    tags: [],
                                    features: ['physicalInfliction'],
                                    stagger: { kind: 'blackboard', key: 'poise' },
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:2',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_handle_cryst_break',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                              },
                              {
                                kind: 'withActionBlackboardScope',
                                parameters: {
                                  scopeKey: 'native-buff-callback:3',
                                  lifetime: 'execution',
                                  alwaysNext: true,
                                  shareParentBlackboard: true,
                                  initialValues: {},
                                  inheritParent: true,
                                },
                                body: sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'caster',
                                    igniteType: 'PhysicalStatus',
                                  }),
                                ),
                              },
                            ),
                          },
                        },
                        duration: { kind: 'constant', value: 0 },
                        height: { kind: 'constant', value: 0 },
                        speedFactorMultiplier: 1,
                        force: true,
                        targetFilter: 'aliveOnly',
                        returnWhen: 'always',
                      }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'physical',
                          attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                          tags: ['comboSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        },
                        'chr_0021_whiten_combo_skill:/scheduledSequences/0/sequence/steps/0/body/steps/0/whenTrue/steps/0/whenFalse/steps/2',
                      ),
                    ),
                    { alwaysNext: true },
                  ),
                ),
                sequence(
                  step('applyPhysicalInfliction', {
                    type: 'airborne',
                    target: 'enemy',
                    isExtra: false,
                    noGuardBuffId: 'buff_physical_no_guard',
                    noGuardDefinition: {
                      stackingType: 'enhanceAndRefresh',
                      priority: 100,
                      maxStackCount: 4,
                      durationSeconds: { blackboardKey: 'duration' },
                      presentation: {
                        visible: true,
                        iconId: 'icon_shadow_attribute_penetrate',
                        iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
                        showInHeadBarCommon: false,
                        showInHeadBarAttached: true,
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
                        orderPriority: {
                          useDirectoryValue: false,
                          value: 0,
                          category: 'CommonCharBuff',
                        },
                      },
                      applyTags: ['Skill/Character/Common/NoGuard'],
                      extendTags: [],
                      blackboard: {
                        atk_scale: 0,
                        count: 0,
                        duration: 20,
                        skip_handle_cryst_break: 0,
                      },
                      attributeModifiers: [],
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
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          ),
                        ),
                        finish: sequence(
                          step('applyBuff', {
                            buffId: 'buff_physical_no_guard_fake',
                            target: 'buffOwner',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                        afterEnhance: sequence(
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:0',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'buffOwner',
                                igniteType: 'NoGuard',
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:1',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              branch(
                                {
                                  kind: 'currentBuffStackCompare',
                                  operator: 'greaterOrEqual',
                                  value: { kind: 'constant', value: 2 },
                                },
                                sequence(
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
                                        target: 'buffOwner',
                                        source: 'buffSource',
                                        inheritSourceSkillCastInfo: true,
                                      }),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          },
                        ),
                      },
                    },
                    airborneBuffId: 'buff_physical_airborne',
                    airborneDefinition: {
                      stackingType: 'stack',
                      stackingKey: 'physical',
                      priority: 0,
                      maxStackCount: 1,
                      durationSeconds: { blackboardKey: 'duration' },
                      triggerIntervalSeconds: 0.100000001490116,
                      waitFirstTriggerInterval: true,
                      maxTriggerCount: 1,
                      presentation: {
                        visible: true,
                        iconId: 'airborne',
                        iconPath: '/icons/airborne.webp',
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
                        orderPriority: {
                          useDirectoryValue: false,
                          value: 0,
                          category: 'CommonCharBuff',
                        },
                      },
                      applyTags: ['Skill/Character/Common/PhysicalStatus/AirborneStatus'],
                      extendTags: [],
                      blackboard: { atk_scale: 0, duration: 3, poise: 10 },
                      attributeModifiers: [],
                      lifecycleSequences: {
                        start: sequence(
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:0',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_no_guard',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  skip_handle_cryst_break: { kind: 'constant', value: 1 },
                                },
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:1',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('readSkillSettingData', {
                                items: [
                                  {
                                    values: [1.2, 1.2, 1.2, 1.2],
                                    column: { kind: 'constant', value: 1 },
                                    storeKey: 'atk_scale',
                                    enhance: {
                                      target: 'caster',
                                      formula: { kind: 'linear', paramA: 0.01 },
                                    },
                                  },
                                  {
                                    values: [10, 10, 10, 10],
                                    column: { kind: 'constant', value: 1 },
                                    storeKey: 'poise',
                                    enhance: {
                                      target: 'caster',
                                      formula: { kind: 'linear', paramA: 0.005 },
                                    },
                                  },
                                ],
                              }),
                              step('dealDamage', {
                                damageType: 'physical',
                                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                tags: [],
                                features: ['physicalInfliction'],
                                stagger: { kind: 'blackboard', key: 'poise' },
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:2',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_handle_cryst_break',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          },
                          {
                            kind: 'withActionBlackboardScope',
                            parameters: {
                              scopeKey: 'native-buff-callback:3',
                              lifetime: 'execution',
                              alwaysNext: true,
                              shareParentBlackboard: true,
                              initialValues: {},
                              inheritParent: true,
                            },
                            body: sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'caster',
                                igniteType: 'PhysicalStatus',
                              }),
                            ),
                          },
                        ),
                      },
                    },
                    duration: { kind: 'constant', value: 0 },
                    height: { kind: 'constant', value: 0 },
                    speedFactorMultiplier: 1,
                    force: true,
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
                    'chr_0021_whiten_combo_skill:/scheduledSequences/0/sequence/steps/0/body/steps/0/whenFalse/steps/1',
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'caster',
          }),
        ),
        34,
      ),
      scheduled(
        19,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'whiten_combo' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'whiten_combo' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        22,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.600000023841858 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        15,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [
      1.60000002384186, 1.75999999046326, 1.91999995708466, 2.07999992370605, 2.24000000953674,
      2.40000009536743, 2.55999994277954, 2.72000002861023, 2.88000011444092, 3.07999992370605,
      3.3199999332428, 3.59999990463257,
    ],
    atk_scale2: [
      2.79999995231628, 3.07999992370605, 3.35999989509583, 3.64000010490417, 3.92000007629395,
      4.19999980926514, 4.48000001907349, 4.76000022888184, 5.03999996185303, 5.3899998664856,
      5.80999994277954, 6.30000019073486,
    ],
    cam_angle: 0,
    cam_duration: 0,
    cd_reduction: 0,
    count: 0,
    duration: 6,
    has_potential1: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    rate: [
      0.100000001490116, 0.100000001490116, 0.100000001490116, 0.100000001490116, 0.100000001490116,
      0.100000001490116, 0.100000001490116, 0.100000001490116, 0.100000001490116, 0.150000005960464,
      0.150000005960464, 0.150000005960464,
    ],
    rate_plus: -0.1,
    usp: 10,
  },
);

export default {
  slug: 'estella',
  gameId: 'ESTELLA',
  rarity: 4,
  weaponType: 'polearm',
  element: 'cryo',
  role: 'guard',
  mainAttribute: 'will',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [13, 32, 53, 73, 94, 104],
    agility: [8, 27, 47, 67, 87, 97],
    intellect: [14, 34, 56, 78, 99, 110],
    will: [15, 44, 74, 105, 136, 151],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [estellaBasicAttack1, estellaBasicAttack2, estellaBasicAttack3, estellaBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: estellaFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: estellaPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: estellaBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: estellaUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: estellaComboSkill,
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
      event: 'addedBuff',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'eventBuffTagsMatch',
            match: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
          },
          sequence(
            branch(
              { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
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
          buffId: 'buff_chr_0021_whiten_talent_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { atb: [7.5, 15] },
        }),
      ),
    },
    {
      key: 'talent2',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0021_whiten_talent_1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { dmg_down: [-0.100000001490116, -0.200000002980232] },
        }),
      ),
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'has_potential1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'rate_plus',
          operation: 'assign',
          value: 3,
        },
      ],
    },
    {
      key: 'potential2',
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
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'distance',
          operation: 'assign',
          value: 12,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'dmg_up',
          operation: 'assign',
          value: 0.400000005960464,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['will'], value: 10 },
        { kind: 'addBuildAttribute', attributes: ['strength'], value: 10 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0021_whiten_potential_5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { usp: { kind: 'constant', value: 5 } },
        }),
      ),
    },
  ],
  buffDefinitions: {
    buff_chr_0021_whiten_combo_skill_physical_vulnerable: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 3, rate: -0.3 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_physical',
            target: 'enemy',
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
    buff_chr_0021_whiten_potential_5: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { cd: 1, usp: 5 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0021_whiten_potential_5_inaura',
            target: 'enemy',
            source: 'buffOwner',
            finishByAction: true,
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              usp: { kind: 'blackboard', key: 'usp' },
              cd: { kind: 'blackboard', key: 'cd' },
            },
          }),
        ),
      },
    },
    buff_chr_0021_whiten_potential_5_inaura: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { cd: 1, usp: 5 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffTagsMatch',
                match: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
              },
              sequence(
                branch(
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'caster',
                      markerId: 'buff_chr_0021_whiten_potential_5_cd',
                    },
                  },
                  sequence(
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'buff_chr_0021_whiten_potential_5_cd',
                      durationSeconds: { kind: 'blackboard', key: 'cd' },
                      autoFinishByAction: false,
                    }),
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'usp' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'caster',
                    }),
                  ),
                ),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0021_whiten_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atb: 5 },
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
                buffTags: ['Skill/Character/Common/SpellStatusSpecial/Shatter'],
              },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0021_whiten_talent_0_active',
                  target: 'buffSource',
                  source: 'buffSource',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: { atb: { kind: 'blackboard', key: 'atb' } },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0021_whiten_talent_0_active: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atb: 5 },
      attributeModifiers: [],
    },
    buff_chr_0021_whiten_talent_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: ['Immune/SpellInflictOnChar/CrystInflictOnChar'],
      extendTags: [],
      blackboard: { dmg_down: -0.2 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: { kind: 'eventDamageTypesMatch', damageTypes: ['cryo'] },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'product',
              addition: { blackboardKey: 'dmg_down' },
            },
          ],
        },
      ],
    },
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
