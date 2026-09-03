/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachTarget,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const daPanBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0018_dapan_attack1',
    timelineBlockFrames: 15,
    naturalDurationFrames: 176,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0018_dapan_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 15, endFrame: 30, sourceSkillIds: ['chr_0018_dapan_attack2'] },
      ],
    },
    costFrame: 9,
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
                'chr_0018_dapan_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0',
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
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.280000001192093, 0.310000002384186, 0.340000003576279, 0.370000004768372, 0.389999985694885,
      0.419999986886978, 0.449999988079071, 0.479999989271164, 0.509999990463257, 0.540000021457672,
      0.579999983310699, 0.629999995231628,
    ],
    env_dmg: 20,
  },
);

export const daPanBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0018_dapan_attack2',
    timelineBlockFrames: 20,
    naturalDurationFrames: 171,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 25,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0018_dapan_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 20, endFrame: 25, sourceSkillIds: ['chr_0018_dapan_attack3'] },
      ],
    },
    costFrame: 9,
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
            'chr_0018_dapan_attack2:/scheduledSequences/0/sequence/steps/0',
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
      0.340000003576279, 0.370000004768372, 0.400000005960464, 0.439999997615814, 0.469999998807907,
      0.5, 0.540000021457672, 0.569999992847443, 0.600000023841858, 0.639999985694885,
      0.699999988079071, 0.75,
    ],
    env_dmg: 20,
  },
);

export const daPanBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0018_dapan_attack3',
    timelineBlockFrames: 25,
    naturalDurationFrames: 193,
    exclusiveFrame: 38,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 40,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0018_dapan_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 25, endFrame: 40, sourceSkillIds: ['chr_0018_dapan_attack4'] },
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
                'chr_0018_dapan_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.100000001490116 },
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
                        coefficient: { kind: 'constant', value: 0.5 },
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
        13,
      ),
      scheduled(
        23,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
              tags: ['normalAttack'],
            },
            'chr_0018_dapan_attack3:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_zero' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 0.5 },
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
        24,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.170000001788139, 0.180000007152557, 0.200000002980232, 0.219999998807907, 0.230000004172325,
      0.25, 0.270000010728836, 0.280000001192093, 0.300000011920929, 0.319999992847443,
      0.349999994039536, 0.379999995231628,
    ],
    atk_scale_2: [
      0.340000003576279, 0.370000004768372, 0.400000005960464, 0.439999997615814, 0.469999998807907,
      0.5, 0.540000021457672, 0.569999992847443, 0.600000023841858, 0.639999985694885,
      0.699999988079071, 0.75,
    ],
    env_dmg: 5,
    env_dmg2: 15,
    display_atk_scale: [
      0.5, 0.550000011920929, 0.600000023841858, 0.649999976158142, 0.699999988079071, 0.75,
      0.800000011920929, 0.850000023841858, 0.899999976158142, 0.970000028610229, 1.03999996185303,
      1.12999999523163,
    ],
  },
);

export const daPanBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0018_dapan_attack4',
    timelineBlockFrames: 45,
    naturalDurationFrames: 236,
    exclusiveFrame: 60,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 70,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0018_dapan_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 45, endFrame: 70, sourceSkillIds: ['chr_0018_dapan_attack1'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        32,
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
            'chr_0018_dapan_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.100000001490116 },
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
        33,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 21,
    atk_scale: [
      0.600000023841858, 0.660000026226044, 0.720000028610229, 0.779999971389771, 0.839999973773956,
      0.899999976158142, 0.959999978542328, 1.02999997138977, 1.0900000333786, 1.1599999666214,
      1.25, 1.36000001430511,
    ],
    env_dmg: 50,
    poise: 20,
    talent_heal: 0,
  },
);

export const daPanFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0018_dapan_power_attack',
    timelineBlockFrames: 35,
    naturalDurationFrames: 215,
    exclusiveFrame: 46,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 35,
          endFrame: 56,
          sourceSkillIds: ['chr_0018_dapan_normal_skill', 'chr_0018_dapan_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        16,
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
            'chr_0018_dapan_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
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
        19,
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
            'chr_0018_dapan_power_attack:/scheduledSequences/1/sequence/steps/0',
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
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
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
        46,
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
    atb: 0,
    atk_scale: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
  },
);

export const daPanPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0018_dapan_plunging_attack_end',
    timelineBlockFrames: 16,
    naturalDurationFrames: 188,
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
            'chr_0018_dapan_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const daPanBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0018_dapan_normal_skill',
    timelineBlockFrames: 65,
    naturalDurationFrames: 210,
    exclusiveFrame: 65,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 65, endFrame: 89, sourceSkillIds: ['chr_0018_dapan_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_pre' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0018_dapan_normal_skill:/scheduledSequences/0/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.100000001490116 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        11,
      ),
      scheduled(
        43,
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
                orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
              },
              applyTags: ['Skill/Character/Common/NoGuard'],
              extendTags: [],
              blackboard: { atk_scale: 0, count: 0, duration: 20, skip_handle_cryst_break: 0 },
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
                orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
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
            duration: { kind: 'blackboard', key: 'airborne_duration' },
            height: { kind: 'constant', value: 2.09999990463257 },
            speedFactorMultiplier: 3,
            force: false,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5_interval' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                {
                  kind: 'not',
                  condition: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'potential_5_interval',
                  },
                },
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
                        buffId: 'buff_physical_no_guard',
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
            ),
            undefined,
            { alwaysNext: true },
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
            'chr_0018_dapan_normal_skill:/scheduledSequences/1/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.300000011920929 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
        46,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    airborne_duration: 1.79999995231628,
    atk_scale: [
      1.14999997615814, 1.26999998092651, 1.37999999523163, 1.5, 1.61000001430511, 1.73000001907349,
      1.8400000333786, 1.96000003814697, 2.0699999332428, 2.22000002861023, 2.39000010490417,
      2.58999991416931,
    ],
    atk_scale_pre: [
      0.180000007152557, 0.200000002980232, 0.219999998807907, 0.230000004172325, 0.25,
      0.270000010728836, 0.28999999165535, 0.310000002384186, 0.319999992847443, 0.349999994039536,
      0.370000004768372, 0.409999996423721,
    ],
    cam_angle: 0,
    cam_duration: 0,
    input_angle: 0,
    poise: 10,
    potential_5_interval: 0,
    display_atk_scale: [
      1.33000004291534, 1.47000002861023, 1.60000002384186, 1.73000001907349, 1.86000001430511, 2,
      2.13000011444092, 2.25999999046326, 2.40000009536743, 2.55999994277954, 2.75999999046326, 3,
    ],
  },
);

export const daPanUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0018_dapan_ultimate_skill',
    timelineBlockFrames: 86,
    naturalDurationFrames: 235,
    exclusiveFrame: 100,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 86,
          endFrame: 120,
          sourceSkillIds: ['chr_0018_dapan_normal_skill', 'chr_0018_dapan_combo_skill'],
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
        1,
      ),
      scheduled(
        0,
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
                orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
              },
              applyTags: ['Skill/Character/Common/NoGuard'],
              extendTags: [],
              blackboard: { atk_scale: 0, count: 0, duration: 20, skip_handle_cryst_break: 0 },
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
                orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
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
            duration: { kind: 'constant', value: 2 },
            height: { kind: 'constant', value: 2 },
            speedFactorMultiplier: 4,
            force: true,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
          }),
        ),
        1,
      ),
      scheduled(
        42,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_loop' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0018_dapan_ultimate_skill:/scheduledSequences/2/sequence/steps/0/body/steps/0',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.034000001847744 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 15,
                curve: { kind: 'named', key: 'RESETto1' },
                finishByAction: true,
                targets: ['caster'],
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 8,
                targetTriggerIntervalSeconds: 0.129999995231628,
              },
            },
          ),
        ),
        64,
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
              forEachTarget(
                'enemy',
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0018_dapan_talent_1_preparation',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'talent_1_duration' },
                      max_stack: { kind: 'blackboard', key: 'talent_1_stack' },
                      talent_1_cd_reduce: { kind: 'blackboard', key: 'talent_1_cd_reduce' },
                    },
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('applyKnockDown', {
            target: 'enemy',
            duration: { kind: 'constant', value: 2 },
            force: true,
            isExtra: false,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_end' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0018_dapan_ultimate_skill:/scheduledSequences/3/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.100000001490116 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        81,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 1.20000004768372 },
            slot: 'unassigned',
            priority: 100,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0.333333343267441,
                },
                {
                  time: 1,
                  value: 0,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0.333333343267441,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: true,
            ignoredTargets: ['caster'],
          }),
        ),
        36,
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
        100,
      ),
    ],
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale_end: [
      1.77999997138977, 1.96000003814697, 2.13000011444092, 2.30999994277954, 2.49000000953674,
      2.67000007629395, 2.83999991416931, 3.01999998092651, 3.20000004768372, 3.42000007629395,
      3.69000005722046, 4,
    ],
    atk_scale_loop: [
      0.219999998807907, 0.239999994635582, 0.259999990463257, 0.28999999165535, 0.310000002384186,
      0.330000013113022, 0.349999994039536, 0.370000004768372, 0.400000005960464, 0.419999986886978,
      0.46000000834465, 0.5,
    ],
    potential_1_dmg_up: 0,
    potential_1_duration: 0,
    select_radius: 4,
    talent_1: 0,
    talent_1_cd_reduce: 0,
    talent_1_duration: 0,
    talent_1_stack: 0,
  },
);

export const daPanComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0018_dapan_combo_skill',
    timelineBlockFrames: 24,
    naturalDurationFrames: 146,
    exclusiveFrame: 52,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 24, endFrame: 59, sourceSkillIds: ['chr_0018_dapan_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        23,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyPhysicalInfliction', {
                type: 'crush',
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
                  blackboard: { atk_scale: 0, count: 0, duration: 20, skip_handle_cryst_break: 0 },
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
                crushedBuffId: 'buff_physical_crushed',
                crushedDefinition: {
                  stackingType: 'stack',
                  stackingKey: 'physical',
                  priority: 0,
                  maxStackCount: 1,
                  durationSeconds: { blackboardKey: 'duration' },
                  triggerIntervalSeconds: 0,
                  waitFirstTriggerInterval: true,
                  maxTriggerCount: 1,
                  presentation: {
                    visible: true,
                    iconId: 'knockback',
                    iconPath: '/icons/knockback.webp',
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
                  applyTags: ['Skill/Character/Common/PhysicalStatus/CrushStatus'],
                  extendTags: [],
                  blackboard: {
                    atk_scale: 1,
                    count: 0,
                    dmg_multiplier: 1,
                    duration: 3,
                    ignore_hit_effect: 0,
                  },
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
                          step('readBuffStackCount', {
                            target: 'buffOwner',
                            outputKey: 'count',
                            query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
                          }),
                          step('readSkillSettingData', {
                            items: [
                              {
                                values: [3, 4.5, 6, 7.5],
                                column: { kind: 'blackboard', key: 'count' },
                                storeKey: 'atk_scale',
                                enhance: {
                                  target: 'caster',
                                  formula: { kind: 'linear', paramA: 0.01 },
                                },
                              },
                            ],
                          }),
                          step('modifyActionValue', {
                            key: 'atk_scale',
                            operation: 'multiply',
                            value: { kind: 'blackboard', key: 'dmg_multiplier' },
                          }),
                          step('finishBuffsById', {
                            target: 'buffOwner',
                            buffIds: ['buff_physical_no_guard'],
                            reason: 'early',
                          }),
                          step('dealDamage', {
                            damageType: 'physical',
                            attackScale: { kind: 'blackboard', key: 'atk_scale' },
                            tags: [],
                            features: ['physicalInfliction'],
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
                          scopeKey: 'native-buff-callback:2',
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
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'ignore_hit_effect' },
                              operator: 'less',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence({
                              kind: 'switch',
                              parameters: {
                                choice: { kind: 'blackboard', key: 'count' },
                                alwaysNext: true,
                              },
                              options: [
                                {
                                  value: { kind: 'constant', value: 0 },
                                  sequence: sequence(
                                    step('startTimeDilation', {
                                      scope: 'entity',
                                      durationSeconds: {
                                        kind: 'constant',
                                        value: 0.100000001490116,
                                      },
                                      slot: 'TimeDilation/Layer/Entity/HitStop',
                                      priority: 15,
                                      curve: { kind: 'named', key: 'interrupt_weakness' },
                                      finishByAction: false,
                                      targets: ['enemy', 'caster'],
                                    }),
                                  ),
                                },
                                {
                                  value: { kind: 'constant', value: 1 },
                                  sequence: sequence(
                                    step('startTimeDilation', {
                                      scope: 'entity',
                                      durationSeconds: {
                                        kind: 'constant',
                                        value: 0.100000001490116,
                                      },
                                      slot: 'TimeDilation/Layer/Entity/HitStop',
                                      priority: 10,
                                      curve: { kind: 'named', key: 'interrupt_weakness' },
                                      finishByAction: false,
                                      targets: ['enemy', 'caster'],
                                    }),
                                  ),
                                },
                                {
                                  value: { kind: 'constant', value: 2 },
                                  sequence: sequence(
                                    step('startTimeDilation', {
                                      scope: 'entity',
                                      durationSeconds: { kind: 'constant', value: 0.25 },
                                      slot: 'TimeDilation/Layer/Entity/HitStop',
                                      priority: 20,
                                      curve: { kind: 'named', key: 'interrupt_weakness' },
                                      finishByAction: false,
                                      targets: ['enemy', 'caster'],
                                    }),
                                  ),
                                },
                                {
                                  value: { kind: 'constant', value: 3 },
                                  sequence: sequence(
                                    step('startTimeDilation', {
                                      scope: 'entity',
                                      durationSeconds: { kind: 'constant', value: 0.5 },
                                      slot: 'TimeDilation/Layer/Entity/HitStop',
                                      priority: 20,
                                      curve: { kind: 'named', key: 'interrupt_weakness' },
                                      finishByAction: false,
                                      targets: ['enemy', 'caster'],
                                    }),
                                  ),
                                },
                                {
                                  value: { kind: 'constant', value: 4 },
                                  sequence: sequence(
                                    step('startTimeDilation', {
                                      scope: 'entity',
                                      durationSeconds: {
                                        kind: 'constant',
                                        value: 0.649999976158142,
                                      },
                                      slot: 'TimeDilation/Layer/Entity/HitStop',
                                      priority: 20,
                                      curve: { kind: 'named', key: 'interrupt_weakness' },
                                      finishByAction: false,
                                      targets: ['enemy', 'caster'],
                                    }),
                                  ),
                                },
                              ],
                            }),
                          ),
                        ),
                      },
                    ),
                  },
                },
                damageMultiplier: { kind: 'blackboard', key: 'crush_multi' },
                ignoreHitEffect: false,
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
                'chr_0018_dapan_combo_skill:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/1',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 50,
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
          ),
        ),
        26,
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
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 570],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [
      2.89000010490417, 3.1800000667572, 3.47000002861023, 3.75, 4.03999996185303, 4.32999992370605,
      4.61999988555908, 4.90999984741211, 5.19999980926514, 5.55999994277954, 5.98999977111816, 6.5,
    ],
    cam_angle: 0,
    cam_duration: 0,
    crush_multi: [
      1.10000002384186, 1.10000002384186, 1.10000002384186, 1.10000002384186, 1.10000002384186,
      1.10000002384186, 1.10000002384186, 1.10000002384186, 1.14999997615814, 1.14999997615814,
      1.14999997615814, 1.20000004768372,
    ],
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 15,
    potential_1: 0,
    usp: 10,
  },
);

export default {
  slug: 'da-pan',
  gameId: 'DAPAN',
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
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [daPanBasicAttack1, daPanBasicAttack2, daPanBasicAttack3, daPanBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: daPanFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: daPanPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: daPanBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: daPanUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: daPanComboSkill,
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
        'plungingAttack',
        'basicAttack1',
        'basicAttack2',
        'basicAttack3',
        'basicAttack4',
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
            buffTags: ['Skill/Character/Common/NoGuard'],
          },
          sequence(
            branch(
              { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
              sequence(
                branch(
                  {
                    kind: 'contextTargetBuffIdStackCompare',
                    contextKey: 'trigger',
                    buffIds: ['buff_physical_no_guard'],
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 4 },
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
      key: 'talent1',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0018_dapan_talent_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            dmg_up: [0.0399999991059303, 0.0599999986588955],
            stack: { kind: 'constant', value: 4 },
            duration: { kind: 'constant', value: 10 },
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
          value: [0.400000005960464, 0.400000005960464],
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
          value: 0.300000011920929,
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
        { kind: 'addBuildAttribute', attributes: ['strength'], value: 15 },
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_5_interval',
          operation: 'assign',
          value: 45,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0018_dapan_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { consumedLayer: 0, dmg_up: 0, duration: 0, stack: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'buffConsumed',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_physical_no_guard'] },
              sequence(
                branch(
                  {
                    kind: 'eventConsumedBuffLayerCompare',
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 1 },
                    outputKey: 'consumedLayer',
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0018_dapan_talent_0_dmg_up',
                      target: 'buffSource',
                      source: 'buffSource',
                      count: { kind: 'blackboard', key: 'consumedLayer' },
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        dmg_up: { kind: 'blackboard', key: 'dmg_up' },
                        duration: { kind: 'blackboard', key: 'duration' },
                        stack: { kind: 'blackboard', key: 'stack' },
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
    buff_chr_0018_dapan_talent_0_dmg_up: {
      stackingType: 'enhanceAndRefresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_physical_dmg_up',
        iconPath: '/icons/icon_battle_physical_dmg_up.webp',
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
      blackboard: { consumedLayer: 0, dmg_up: 0, duration: 0, stack: 0 },
      attributeModifiers: [
        {
          attribute: 'physicalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'dmg_up' },
        },
      ],
    },
    buff_chr_0018_dapan_talent_1_cd_reduce: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 2,
      applyTags: [],
      extendTags: [],
      blackboard: { cd_reduce: 0.5, duration: 15 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'outputDamage',
          priority: 0,
          sequence: sequence(
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
        {
          event: 'skillEnd',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillCastMatchesBuffSource' },
              sequence(step('finishCurrentBuff', { reason: 'other' })),
            ),
          ),
        },
      ],
    },
    buff_chr_0018_dapan_talent_1_preparation: {
      stackingType: 'enhanceAndRefresh',
      priority: 0,
      maxStackCount: 2,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_dapan_buff',
        iconPath: '/icons/icon_battle_dapan_buff.webp',
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
      blackboard: { duration: 15, max_stack: 2, talent_1_cd_reduce: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillTypeIn', skillTypes: ['comboSkill'] },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0018_dapan_talent_1_cd_reduce',
                  target: 'buffOwner',
                  source: 'buffSource',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    cd_reduce: { kind: 'blackboard', key: 'talent_1_cd_reduce' },
                  },
                }),
              ),
            ),
          ),
        },
      ],
    },
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
