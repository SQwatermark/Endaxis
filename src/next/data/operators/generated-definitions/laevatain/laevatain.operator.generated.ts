/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachContextTarget,
  forEachTarget,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const laevatainBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0016_laevat_attack1',
    timelineBlockFrames: 10,
    naturalDurationFrames: 120,
    exclusiveFrame: 16,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 33,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0016_laevat_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 10, endFrame: 33, sourceSkillIds: ['chr_0016_laevat_attack2'] },
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
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0016_laevat_attack1:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0329999998211861 },
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
      0.159999996423721, 0.180000007152557, 0.189999997615814, 0.209999993443489, 0.219999998807907,
      0.239999994635582, 0.259999990463257, 0.270000010728836, 0.28999999165535, 0.310000002384186,
      0.330000013113022, 0.360000014305115,
    ],
  },
);

export const laevatainBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0016_laevat_attack2',
    timelineBlockFrames: 16,
    naturalDurationFrames: 140,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 37,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0016_laevat_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 16, endFrame: 38, sourceSkillIds: ['chr_0016_laevat_attack3'] },
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
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0016_laevat_attack2:/scheduledSequences/0/sequence/steps/0',
          ),
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
        9,
      ),
      scheduled(
        13,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0016_laevat_attack2:/scheduledSequences/1/sequence/steps/0',
          ),
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
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0799999982118607 },
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
        16,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.119999997317791, 0.129999995231628, 0.140000000596046, 0.159999996423721, 0.170000001788139,
      0.180000007152557, 0.189999997615814, 0.200000002980232, 0.219999998807907, 0.230000004172325,
      0.25, 0.270000010728836,
    ],
    display_atk_scale: [
      0.239999994635582, 0.259999990463257, 0.28999999165535, 0.310000002384186, 0.340000003576279,
      0.360000014305115, 0.379999995231628, 0.409999996423721, 0.430000007152557, 0.46000000834465,
      0.5, 0.540000021457672,
    ],
  },
);

export const laevatainBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0016_laevat_attack3',
    timelineBlockFrames: 12,
    naturalDurationFrames: 105,
    exclusiveFrame: 22,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 32,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0016_laevat_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 12, endFrame: 32, sourceSkillIds: ['chr_0016_laevat_attack4'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0016_laevat_attack3:/scheduledSequences/0/sequence/steps/0',
          ),
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
            undefined,
            { alwaysNext: true },
          ),
        ),
        10,
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

export const laevatainBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0016_laevat_attack4',
    timelineBlockFrames: 22,
    naturalDurationFrames: 121,
    exclusiveFrame: 35,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 5,
          endFrame: 45,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0016_laevat_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 22, endFrame: 45, sourceSkillIds: ['chr_0016_laevat_attack5'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0016_laevat_attack4.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0016_laevat_attack_5',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0016_laevat_attack4.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0016_laevat_attack_5_projhit',
                { atk_scale: 0, duration: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0016_laevat_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        14,
      ),
      scheduled(
        19,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0016_laevat_attack4.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:projectile_chr_0016_laevat_attack_4_2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0016_laevat_attack4.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:chr_0016_laevat_attack_5_projhit',
                { atk_scale: 0, duration: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0016_laevat_attack4:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
        21,
      ),
      scheduled(
        6,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0016_laevat_attack4:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0500000007450581 },
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
      0.129999995231628, 0.140000000596046, 0.159999996423721, 0.170000001788139, 0.180000007152557,
      0.200000002980232, 0.209999993443489, 0.219999998807907, 0.230000004172325, 0.25,
      0.270000010728836, 0.28999999165535,
    ],
    display_atk_scale: [
      0.389999985694885, 0.430000007152557, 0.469999998807907, 0.509999990463257, 0.550000011920929,
      0.589999973773956, 0.620000004768372, 0.660000026226044, 0.699999988079071, 0.75,
      0.810000002384186, 0.879999995231628,
    ],
  },
);

export const laevatainBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0016_laevat_attack5',
    timelineBlockFrames: 34,
    naturalDurationFrames: 145,
    exclusiveFrame: 42,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 4,
          endFrame: 46,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0016_laevat_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 34, endFrame: 46, sourceSkillIds: ['chr_0016_laevat_attack1'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        23,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0016_laevat_attack5:/scheduledSequences/0/sequence/steps/0/body/steps/0',
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
        26,
      ),
      scheduled(
        26,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0016_laevat_attack5:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'constant', value: 1 },
                      operator: 'greaterOrEqual',
                      right: { kind: 'constant', value: 1 },
                    },
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                  ],
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'count',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
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
                        targets: ['caster'],
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
        30,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 20,
    atk_scale: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.340000003576279, 0.370000004768372,
      0.400000005960464, 0.419999986886978, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    count: 0,
    poise: 18,
    display_atk_scale: [
      0.529999971389771, 0.579999983310699, 0.639999985694885, 0.689999997615814, 0.740000009536743,
      0.800000011920929, 0.850000023841858, 0.899999976158142, 0.949999988079071, 1.01999998092651,
      1.10000002384186, 1.19000005722046,
    ],
  },
);

export const laevatainUltimateAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack1',
    sourceSkillId: 'chr_0016_laevat_ult_attack1',
    timelineBlockFrames: 17,
    naturalDurationFrames: 155,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 32,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0016_laevat_ult_attack2',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 17,
          endFrame: 32,
          sourceSkillIds: ['chr_0016_laevat_ult_attack2', 'chr_0016_laevat_attack1'],
        },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0016_laevat_ult_attack1:/scheduledSequences/0/sequence/steps/1/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
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
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'stopped' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'stopped',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.0500000007450581 },
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
                      ),
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
        24,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.649999976158142, 0.709999978542328, 0.779999971389771, 0.839999973773956, 0.910000026226044,
      0.970000028610229, 1.03999996185303, 1.10000002384186, 1.16999995708466, 1.25,
      1.3400000333786, 1.46000003814697,
    ],
    ratio: 1,
    stopped: 0,
  },
);

export const laevatainUltimateAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack2',
    sourceSkillId: 'chr_0016_laevat_ult_attack2',
    timelineBlockFrames: 27,
    naturalDurationFrames: 245,
    exclusiveFrame: 36,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 44,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0016_laevat_ult_attack3',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 27,
          endFrame: 44,
          sourceSkillIds: ['chr_0016_laevat_ult_attack3', 'chr_0016_laevat_attack1'],
        },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0016_laevat_ult_attack2:/scheduledSequences/0/sequence/steps/1/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
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
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'stopped1' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'stopped1',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.0500000007450581 },
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
                      ),
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
        19,
      ),
      scheduled(
        21,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0016_laevat_ult_attack2:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
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
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'stopped2' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'stopped2',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.0500000007450581 },
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
                      ),
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
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.409999996423721, 0.449999988079071, 0.490000009536743, 0.529999971389771, 0.569999992847443,
      0.610000014305115, 0.649999976158142, 0.689999997615814, 0.730000019073486, 0.779999971389771,
      0.839999973773956, 0.910000026226044,
    ],
    ratio: 1,
    stopped1: 0,
    stopped2: 0,
    display_atk_scale: [
      0.810000002384186, 0.889999985694885, 0.970000028610229, 1.04999995231628, 1.12999999523163,
      1.22000002861023, 1.29999995231628, 1.37999999523163, 1.46000003814697, 1.55999994277954,
      1.67999994754791, 1.82000005245209,
    ],
  },
);

export const laevatainUltimateAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack3',
    sourceSkillId: 'chr_0016_laevat_ult_attack3',
    timelineBlockFrames: 14,
    naturalDurationFrames: 180,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 28,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0016_laevat_ult_attack4',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 14,
          endFrame: 28,
          sourceSkillIds: ['chr_0016_laevat_ult_attack4', 'chr_0016_laevat_attack1'],
        },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
          repeatEachTick(
            sequence(
              step('applyElementalInfliction', { element: 'heat', isExtra: false }),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0016_laevat_ult_attack3:/scheduledSequences/0/sequence/steps/1/body/steps/1',
              ),
              branch(
                { kind: 'casterControlled' },
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
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'stopped' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'stopped',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.119999997317791 },
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
                      ),
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
        23,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      1.14999997615814, 1.26999998092651, 1.38999998569489, 1.5, 1.62000000476837, 1.73000001907349,
      1.85000002384186, 1.96000003814697, 2.07999992370605, 2.22000002861023, 2.40000009536743,
      2.59999990463257,
    ],
    ratio: 1,
    stopped: 0,
  },
);

export const laevatainUltimateAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack4',
    sourceSkillId: 'chr_0016_laevat_ult_attack4',
    timelineBlockFrames: 35,
    naturalDurationFrames: 181,
    exclusiveFrame: 47,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 68,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0016_laevat_ult_attack1',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 35,
          endFrame: 68,
          sourceSkillIds: ['chr_0016_laevat_ult_attack1', 'chr_0016_laevat_attack1'],
        },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        22,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0016_laevat_ult_attack4:/scheduledSequences/0/sequence/steps/1/body/steps/0',
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
        26,
      ),
      scheduled(
        26,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0016_laevat_ult_attack4:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
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
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'stopped' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'stopped',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.25 },
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
                      ),
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
        35,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  {
    atb: 22,
    atk_scale: [
      1.00999999046326, 1.11000001430511, 1.22000002861023, 1.32000005245209, 1.41999995708466,
      1.51999998092651, 1.62000000476837, 1.72000002861023, 1.82000005245209, 1.95000004768372,
      2.09999990463257, 2.27999997138977,
    ],
    hit: 0,
    poise: 24,
    ratio: 1,
    stopped: 0,
    display_atk_scale: [
      2.02999997138977, 2.23000001907349, 2.4300000667572, 2.63000011444092, 2.83999991416931,
      3.03999996185303, 3.24000000953674, 3.44000005722046, 3.65000009536743, 3.90000009536743,
      4.19999980926514, 4.55999994277954,
    ],
  },
);

export const laevatainFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0016_laevat_power_attack',
    timelineBlockFrames: 42,
    naturalDurationFrames: 141,
    exclusiveFrame: 50,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 42,
          endFrame: 62,
          sourceSkillIds: ['chr_0016_laevat_normal_skill', 'chr_0016_laevat_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.200000002980232,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0016_laevat_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'constant', value: 0 },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'default',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        11,
      ),
      scheduled(
        42,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.800000011920929,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0016_laevat_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.449999988079071 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 1,
                  inTangent: -2.31595301628113,
                  outTangent: -2.31595301628113,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.343648791313171,
                  value: 0.204125598073006,
                  inTangent: -0.643932223320007,
                  outTangent: 0.0176235996186733,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.820447087287903,
                  value: 0.36522251367569,
                  inTangent: 0.434538900852203,
                  outTangent: 2.72913193702698,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 3.53532290458679,
                  outTangent: 3.53532290458679,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        46,
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
        42,
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
    cam_angle: 0,
    cam_duration: 0,
    extra_dmg: 1,
    input_angle: 0,
    potential_5_cd: 0,
  },
);

export const laevatainPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0016_laevat_plunging_attack_end',
    timelineBlockFrames: 14,
    naturalDurationFrames: 145,
    exclusiveFrame: 13,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0016_laevat_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const laevatainBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0016_laevat_normal_skill',
    timelineBlockFrames: 118,
    naturalDurationFrames: 282,
    exclusiveFrame: 117,
    costFrame: 0,
    scheduledSequences: [
      scheduled(214, sequence(step('jumpTimeline', { destinationFrame: 231 })), 215),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0016_laevat_energy'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 4 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_has_max_energy',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
        3,
      ),
      scheduled(
        30,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 80,
            condition: {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0016_laevat_has_max_energy'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_has_max_energy'],
            reason: 'other',
          }),
        ),
        31,
      ),
      scheduled(37, sequence(step('jumpTimeline', { destinationFrame: 215 })), 51),
      scheduled(
        4,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0016_laevat_normal_skill',
            childSkillId: 'chr_0016_laevat_normal_skill_abilityentity',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            saveToContextKey: 'ball',
          }),
        ),
        7,
      ),
      scheduled(
        104,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale_3',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_energy'],
            reason: 'other',
          }),
          repeatEachTick(
            sequence(
              step('applyBuff', {
                buffId: 'buff_common_fire_fire_burning_triggered',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  duration: { kind: 'blackboard', key: 'duration' },
                  extra_scaling: { kind: 'blackboard', key: 'extra_scaling' },
                },
              }),
              step('modifyActionValue', {
                key: 'second_hit',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'second_hit' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'refund',
                    spGainSource: 'skill',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_extra' },
                },
                'chr_0016_laevat_normal_skill:/scheduledSequences/5/sequence/steps/2/body/steps/3',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.349999994039536 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'second_hit' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'extra_usp' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                ),
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
        105,
      ),
      scheduled(
        105,
        sequence(forEachContextTarget('ball', sequence(step('finishCurrentAbilityEntity', {})))),
        109,
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
      0.620000004768372, 0.680000007152557, 0.75, 0.810000002384186, 0.870000004768372,
      0.930000007152557, 0.990000009536743, 1.05999994277954, 1.12000000476837, 1.20000004768372,
      1.28999996185303, 1.39999997615814,
    ],
    atk_scale_2: [
      0.0599999986588955, 0.0700000002980232, 0.0799999982118607, 0.0799999982118607,
      0.0900000035762787, 0.0900000035762787, 0.100000001490116, 0.109999999403954,
      0.109999999403954, 0.119999997317791, 0.129999995231628, 0.140000000596046,
    ],
    atk_scale_3: [
      3.42000007629395, 3.75999999046326, 4.09999990463257, 4.44999980926514, 4.78999996185303,
      5.13000011444092, 5.46999979019165, 5.80999994277954, 6.15999984741211, 6.57999992370605,
      7.09999990463257, 7.69999980926514,
    ],
    cam_angle: 0,
    cam_duration: 0,
    consumed_fire_count: 0,
    count: 4,
    duration: 5,
    entered: 0,
    extra_scaling: 1,
    extra_usp: 100,
    input_angle: 0,
    level: 1,
    max_consumed_fire_count: 0,
    poise: 10,
    poise_extra: 10,
    ratio: 1,
    second_hit: 0,
    triggered_burning: 0,
  },
);

export const laevatainBattleSkillDuringUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkillDuringUltimate',
    sourceSkillId: 'chr_0016_laevat_normal_skill_during_ult',
    timelineBlockFrames: 33,
    naturalDurationFrames: 271,
    exclusiveFrame: 115,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 33,
          endFrame: 75,
          sourceSkillIds: [
            'chr_0016_laevat_normal_skill',
            'chr_0016_laevat_normal_skill_during_ult',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0016_laevat_energy'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 4 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_has_max_energy',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
        3,
      ),
      scheduled(
        24,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 75,
            condition: {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0016_laevat_has_max_energy'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
          }),
        ),
        27,
      ),
      scheduled(39, sequence(step('jumpTimeline', { destinationFrame: 196 })), 40),
      scheduled(195, sequence(step('jumpTimeline', { destinationFrame: 270 })), 196),
      scheduled(
        13,
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
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0016_laevat_normal_skill_during_ult:/scheduledSequences/4/sequence/steps/0/body/steps/0',
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
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'entered' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                  step('modifyActionValue', {
                    key: 'entered',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0016_laevat_energy',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
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
      scheduled(
        23,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0016_laevat_normal_skill_during_ult:/scheduledSequences/5/sequence/steps/0/body/steps/0',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.25 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'entered' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                  step('modifyActionValue', {
                    key: 'entered',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
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
        24,
      ),
      scheduled(
        98,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale_3',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_energy'],
            reason: 'other',
          }),
          repeatEachTick(
            sequence(
              step('applyBuff', {
                buffId: 'buff_common_fire_fire_burning_triggered',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  duration: { kind: 'blackboard', key: 'duration' },
                  extra_scaling: { kind: 'blackboard', key: 'extra_scaling' },
                },
              }),
              step('modifyActionValue', {
                key: 'second_hit',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'second_hit' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'refund',
                    spGainSource: 'skill',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0016_laevat_normal_skill_during_ult:/scheduledSequences/6/sequence/steps/2/body/steps/3',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'second_hit' },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.649999976158142 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_normal_attack' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
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
        99,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_pause_ult',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        115,
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
      1.47000002861023, 1.61000001430511, 1.75999999046326, 1.9099999666214, 2.04999995231628,
      2.20000004768372, 2.34999990463257, 2.49000000953674, 2.64000010490417, 2.8199999332428,
      3.03999996185303, 3.29999995231628,
    ],
    atk_scale_2: [
      1.63999998569489, 1.80999994277954, 1.97000002861023, 2.14000010490417, 2.29999995231628,
      2.47000002861023, 2.63000011444092, 2.78999996185303, 2.96000003814697, 3.16000008583069,
      3.41000008583069, 3.70000004768372,
    ],
    atk_scale_3: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
    cam_angle: 0,
    cam_duration: 0,
    consumed_fire_count: 0,
    duration: 5,
    entered: 0,
    extra_scaling: 1,
    input_angle: 0,
    level: 1,
    max_consumed_fire_count: 0,
    poise: 10,
    ratio: 1,
    second_hit: 0,
    triggered_burning: 0,
    count: 4,
    poise_extra: 10,
  },
);

export const laevatainUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0016_laevat_ultimate_skill',
    timelineBlockFrames: 74,
    naturalDurationFrames: 245,
    exclusiveFrame: 73,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: [
              'buff_chr_0016_laevat_ult_dash',
              'buff_chr_0016_laevat_show_weapon',
              'buff_chr_0016_laevat_ring_start_asset',
              'buff_chr_0016_laevat_ult_dash',
              'buff_chr_0016_laevat_ult_end',
              'buff_chr_0016_laevat_ultimate_sfx_loop',
            ],
            reason: 'other',
          }),
        ),
        3,
      ),
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
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('findCharacterTeamTargets', {
                saveToContextKey: 'mainchar',
                selection: { kind: 'controlledOperator' },
              }),
            ),
          ),
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
        61,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        87,
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
        73,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 300 }],
    enhancementStateBuffId: 'buff_chr_0016_laevat_show_weapon',
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    angle: 120,
    atk_scale: [
      2.70000004768372, 2.97000002861023, 3.24000000953674, 3.50999999046326, 3.77999997138977,
      4.05000019073486, 4.32000017166138, 4.59000015258789, 4.8600001335144, 5.19999980926514,
      5.59999990463257, 6.07999992370605,
    ],
    height: 4,
    radius: 5,
    count: 4,
    duration: 15,
  },
);

export const laevatainComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0016_laevat_combo_skill',
    timelineBlockFrames: 41,
    naturalDurationFrames: 180,
    exclusiveFrame: 57,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 41,
          endFrame: 85,
          sourceSkillIds: [
            'chr_0016_laevat_normal_skill',
            'chr_0016_laevat_normal_skill_during_ult',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_combo_skill_hit_self',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          forEachContextTarget(
            'tar',
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'index' },
                  operator: 'less',
                  right: { kind: 'constant', value: 5 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              {
                kind: 'switch',
                parameters: { choice: { kind: 'blackboard', key: 'index' }, alwaysNext: true },
                options: [
                  {
                    value: { kind: 'constant', value: 1 },
                    sequence: sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_combo_skill_start',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                          poise: { kind: 'blackboard', key: 'poise' },
                          trigger: { kind: 'constant', value: 0.699999988079071 },
                        },
                      }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 2 },
                    sequence: sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_combo_skill_start',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                          poise: { kind: 'blackboard', key: 'poise' },
                          trigger: { kind: 'constant', value: 0.649999976158142 },
                        },
                      }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 3 },
                    sequence: sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_combo_skill_start',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                          poise: { kind: 'blackboard', key: 'poise' },
                          trigger: { kind: 'constant', value: 0.600000023841858 },
                        },
                      }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 4 },
                    sequence: sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_combo_skill_start',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                          poise: { kind: 'blackboard', key: 'poise' },
                          trigger: { kind: 'constant', value: 0.550000011920929 },
                        },
                      }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 5 },
                    sequence: sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_combo_skill_start',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                          poise: { kind: 'blackboard', key: 'poise' },
                          trigger: { kind: 'constant', value: 0.550000011920929 },
                        },
                      }),
                    ),
                  },
                ],
              },
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_combo_skill_hitstop',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
        56,
      ),
      scheduled(
        0,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0016_laevat_ult_end'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0016_laevat_show_weapon',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'constant', value: 0.100000001490116 },
                    },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0016_laevat_ult_end',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'constant', value: 0.100000001490116 },
                    },
                  }),
                ),
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: false,
                triggerIntervalSeconds: 0.100000001490116,
                maxCountPerTarget: -1,
                targetTriggerIntervalSeconds: 0,
              },
            },
          ),
        ),
        57,
      ),
      scheduled(
        5,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tags: [
                'Skill/Character/Common/SpellStatus/Burning',
                'Skill/Character/Common/SpellStatus/Corrupt',
              ],
            },
            sequence(
              step('mergeContextTargets', {
                saveToContextKey: 'tar',
                sources: [{ kind: 'target', target: 'enemy' }],
              }),
            ),
            sequence(step('mergeContextTargets', { saveToContextKey: 'tar', sources: [] })),
          ),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'tar',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              forEachContextTarget(
                'tar',
                sequence(
                  step('modifyActionValue', {
                    key: 'count',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'count' },
                      operator: 'greaterOrEqual',
                      right: { kind: 'blackboard', key: 'limit' },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'count',
                        operation: 'assign',
                        value: { kind: 'blackboard', key: 'limit' },
                      }),
                    ),
                  ),
                ),
              ),
            ),
            sequence(
              step('mergeContextTargets', {
                saveToContextKey: 'tar',
                sources: [{ kind: 'context', contextKey: 'smart_target' }],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        8,
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
    cooldownFrames: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 270],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [
      2.40000009536743, 2.64000010490417, 2.88000011444092, 3.11999988555908, 3.35999989509583,
      3.59999990463257, 3.83999991416931, 4.07999992370605, 4.32000017166138, 4.61999988555908,
      4.98000001907349, 5.40000009536743,
    ],
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    duration: 10,
    index: 0,
    input_angle: 0,
    limit: 5,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    resistance: 0.2,
    select_radius: 7,
    usp: 0,
    usp_1_display: 25,
    usp_2_display: 30,
    usp_3_display: 35,
  },
);

export default {
  slug: 'laevatain',
  gameId: 'LAEVATAIN',
  rarity: 6,
  weaponType: 'sword',
  element: 'heat',
  role: 'striker',
  mainAttribute: 'intellect',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [13, 36, 60, 85, 109, 121],
    agility: [9, 28, 49, 69, 89, 99],
    intellect: [22, 55, 90, 125, 160, 177],
    will: [9, 26, 44, 62, 80, 89],
    baseAttack: [30, 91, 156, 221, 285, 318],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  passiveUi: { kind: 'numeric', appearance: 'laevatainCounter', maximum: 4, activeAt: 4 },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        laevatainBasicAttack1,
        laevatainBasicAttack2,
        laevatainBasicAttack3,
        laevatainBasicAttack4,
        laevatainBasicAttack5,
      ],
      variants: [
        {
          key: 'enhancedBasicAttack',
          levelSource: 'ultimate',
          libraryPresentation: 'enhanced',
          skills: [
            laevatainUltimateAttack1,
            laevatainUltimateAttack2,
            laevatainUltimateAttack3,
            laevatainUltimateAttack4,
          ],
        },
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: laevatainFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: laevatainPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: laevatainBattleSkill,
      replacementSkills: [laevatainBattleSkillDuringUltimate],
      replacementSkillPlacements: { battleSkillDuringUltimate: 'enhanced' },
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: laevatainUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: laevatainComboSkill,
    },
  ],
  skillSlots: [
    {
      key: 'battleSkill',
      baseSkillKey: 'battleSkill',
      replacementSkillKeys: ['battleSkillDuringUltimate'],
    },
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
        'basicAttack5',
        'plungingAttack',
        'ultimateAttack1',
        'ultimateAttack2',
        'ultimateAttack3',
        'ultimateAttack4',
        'finisher',
      ],
      defaultSkillKey: 'basicAttack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  playerActionModes: [
    {
      modeId: 'ult',
      modeLayer: 'ult',
      defaultEnabled: false,
      normalAttackSkillKeys: [
        'ultimateAttack1',
        'ultimateAttack2',
        'ultimateAttack3',
        'ultimateAttack4',
      ],
      commandMappings: {
        basicAttack: { sourceSkillId: 'chr_0016_laevat_ult_attack1', skillKey: 'ultimateAttack1' },
      },
    },
  ],
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
            buffTags: [
              'Skill/Character/Common/SpellStatus/Burning',
              'Skill/Character/Common/SpellStatus/Corrupt',
            ],
          },
          sequence(),
        ),
      ),
    },
  ],
  comboSkillPriority: 'default',
  talents: [
    {
      key: 'talent1',
      levels: 3,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0016_laevat_passive',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            ignore_fire_resist: [-10, -15, -20],
            ignore_fire_resist_duration: { kind: 'constant', value: 20 },
            max_stack: { kind: 'constant', value: 4 },
          },
        }),
      ),
    },
    {
      key: 'talent2',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0016_laevat_talent_2_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            hp_threshold: { kind: 'constant', value: 0.400000005960464 },
            heal_max_hp: { kind: 'constant', value: 0.0500000007450581 },
            shelter: { kind: 'constant', value: 0.899999976158142 },
            duration: [4, 8],
            cd: { kind: 'constant', value: 120 },
            shelter_real: { kind: 'constant', value: 0.899999976158142 },
          },
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
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'atb',
          operation: 'add',
          value: 20,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkillDuringUltimate',
          blackboardKey: 'atb',
          operation: 'add',
          value: 20,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkillDuringUltimate',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.20000004768372,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.20000004768372,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 20 },
        { kind: 'addStaticDamageIncrease', target: 'normalAttack', value: 0.15 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'duration',
          operation: 'multiply',
          value: 1.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'extra_scaling',
          operation: 'assign',
          value: 1.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkillDuringUltimate',
          blackboardKey: 'duration',
          operation: 'multiply',
          value: 1.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkillDuringUltimate',
          blackboardKey: 'extra_scaling',
          operation: 'assign',
          value: 1.5,
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
          skillGroupKey: 'basicAttack',
          skillKey: 'ultimateAttack1',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.20000004768372,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'basicAttack',
          skillKey: 'ultimateAttack2',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.20000004768372,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'basicAttack',
          skillKey: 'ultimateAttack3',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.20000004768372,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'basicAttack',
          skillKey: 'ultimateAttack4',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.20000004768372,
        },
      ],
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0016_laevat_potential_5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            extend_duration: { kind: 'constant', value: 1 },
            max_duration: { kind: 'constant', value: 7 },
          },
        }),
      ),
    },
  ],
  buffDefinitions: {
    buff_chr_0016_laevat_absorb_fire_inflict: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 3,
      triggerIntervalSeconds: 0.5,
      waitFirstTriggerInterval: false,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          branch(
            {
              kind: 'buffStackCompare',
              target: 'buffOwner',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('finishBuffsByTag', {
                target: 'buffOwner',
                tagQueryType: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                reason: 'early',
                count: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0016_laevat_combo_skill_hit: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      triggerIntervalSeconds: 0.699999988079071,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0, poise: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step(
              'dealDamage',
              {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
                stagger: { kind: 'blackboard', key: 'poise' },
              },
              'buff_chr_0016_laevat_combo_skill_hit:/scheduledSequences/0/sequence/steps/0',
            ),
            branch(
              { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
              sequence(
                branch(
                  { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
                  sequence(
                    branch(
                      { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
                      sequence(),
                      undefined,
                      { alwaysNext: true },
                    ),
                  ),
                  sequence(
                    branch(
                      { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
                      sequence(),
                      undefined,
                      { alwaysNext: true },
                    ),
                  ),
                  { alwaysNext: true },
                ),
              ),
              sequence(
                branch(
                  { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
                  sequence(
                    branch(
                      { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
                      sequence(),
                      undefined,
                      { alwaysNext: true },
                    ),
                  ),
                  sequence(
                    branch(
                      { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
                      sequence(),
                      undefined,
                      { alwaysNext: true },
                    ),
                  ),
                  { alwaysNext: true },
                ),
              ),
              { alwaysNext: true },
            ),
            step('applyBuff', {
              buffId: 'buff_chr_0016_laevat_combo_skill_usp',
              target: 'buffSource',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
            }),
          ),
          3,
        ),
      ],
    },
    buff_chr_0016_laevat_combo_skill_hit_self: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          21,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0016_laevat_energy',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
            }),
          ),
          24,
        ),
      ],
    },
    buff_chr_0016_laevat_combo_skill_hitstop: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          25,
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
          ),
          28,
        ),
      ],
    },
    buff_chr_0016_laevat_combo_skill_start: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      triggerIntervalSeconds: { blackboardKey: 'trigger' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0, poise: 0, trigger: 1 },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_combo_skill_hit',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              poise: { kind: 'blackboard', key: 'poise' },
              atk_scale: { kind: 'blackboard', key: 'atk_scale' },
            },
          }),
        ),
      },
    },
    buff_chr_0016_laevat_combo_skill_usp: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 3,
      applyTags: [],
      extendTags: [],
      blackboard: { count: 0, usp_1: 25, usp_2: 5, usp_3: 5, usp_4: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('readBuffStackCount', {
            target: 'buffOwner',
            outputKey: 'count',
            query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_combo_skill_usp'] },
          }),
          {
            kind: 'switch',
            parameters: { choice: { kind: 'blackboard', key: 'count' }, alwaysNext: true },
            options: [
              {
                value: { kind: 'constant', value: 0 },
                sequence: sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp_1' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                ),
              },
              {
                value: { kind: 'constant', value: 1 },
                sequence: sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp_2' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                ),
              },
              {
                value: { kind: 'constant', value: 2 },
                sequence: sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp_3' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                ),
              },
              {
                value: { kind: 'constant', value: 3 },
                sequence: sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp_4' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                ),
              },
            ],
          },
        ),
      },
    },
    buff_chr_0016_laevat_energy: {
      stackingType: 'enhance',
      priority: 0,
      maxStackCount: 5,
      applyTags: [],
      extendTags: [],
      blackboard: {
        count: 0,
        duration: 0,
        ignore: 0,
        ignore_fire_resist: 0,
        ignore_fire_resist_duration: 0,
        max_stack: 4,
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
              step('setCharacterPassiveUiValue', {
                target: 'caster',
                value: { kind: 'constant', value: 1 },
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
              step('readBuffBlackboard', {
                target: 'buffOwner',
                query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                desiredKey: 'ignore_fire_resist',
                outputKey: 'ignore_fire_resist',
              }),
              step('readBuffBlackboard', {
                target: 'buffOwner',
                query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                desiredKey: 'ignore_fire_resist_duration',
                outputKey: 'ignore_fire_resist_duration',
              }),
            ),
          },
        ),
        enhanceChanged: sequence(
          step('readBuffStackCount', {
            target: 'buffOwner',
            outputKey: 'count',
            query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_energy'] },
          }),
          step('setCharacterPassiveUiValue', {
            target: 'caster',
            value: { kind: 'blackboard', key: 'count' },
          }),
          {
            kind: 'switch',
            parameters: { choice: { kind: 'blackboard', key: 'count' }, alwaysNext: true },
            options: [
              {
                value: { kind: 'blackboard', key: 'max_stack' },
                sequence: sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0016_laevat_energy_icon_5',
                    target: 'buffOwner',
                    source: 'buffSource',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      ignore_fire_resist: { kind: 'blackboard', key: 'ignore_fire_resist' },
                      ignore_fire_resist_duration: {
                        kind: 'blackboard',
                        key: 'ignore_fire_resist_duration',
                      },
                    },
                  }),
                ),
              },
            ],
          },
        ),
        finish: sequence(
          step('setCharacterPassiveUiValue', {
            target: 'caster',
            value: { kind: 'constant', value: 0 },
          }),
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
            reason: 'other',
          }),
        ),
      },
    },
    buff_chr_0016_laevat_energy_icon_5: {
      stackingType: 'unlimited',
      priority: 5,
      maxStackCount: 5,
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0, ignore_fire_resist: 0, ignore_fire_resist_duration: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              ignore_fire_resist_duration: {
                kind: 'blackboard',
                key: 'ignore_fire_resist_duration',
              },
              ignore_fire_resist: { kind: 'blackboard', key: 'ignore_fire_resist' },
            },
          }),
        ),
      },
    },
    buff_chr_0016_laevat_has_max_energy: {
      stackingType: 'unlimited',
      priority: 1,
      maxStackCount: 5,
      durationSeconds: 2,
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0 },
      attributeModifiers: [],
    },
    buff_chr_0016_laevat_ignore_fire_resist: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_laevat_potential_1',
        iconPath: '/icons/icon_battle_laevat_potential_1.webp',
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
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { ignore_fire_resist: 0, ignore_fire_resist_duration: 0 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'defender',
              attribute: 'FireResistance',
              values: { slot: 'baseAddition', value: { blackboardKey: 'ignore_fire_resist' } },
              attributeTiming: 'runtime',
            },
          ],
        },
      ],
    },
    buff_chr_0016_laevat_passive: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { ignore_fire_resist: 0, ignore_fire_resist_duration: 0, max_stack: 4 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
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
                buffId: 'buff_chr_0016_laevat_passive_enemy',
                target: 'enemy',
                finishByAction: true,
                inheritSourceSkillCastInfo: true,
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
                buffId: 'buff_chr_0016_laevat_passive_teammate',
                target: 'party',
                finishByAction: true,
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { max_stack: { kind: 'blackboard', key: 'max_stack' } },
              }),
            ),
          },
        ),
      },
    },
    buff_chr_0016_laevat_passive_enemy: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { count: 0 },
      attributeModifiers: [],
    },
    buff_chr_0016_laevat_passive_teammate: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { count: 0, curve_rate: 0, distance: 0, max_stack: 0, speed: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeOutputDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventDamageTagsMatch',
                match: 'hasAny',
                tags: ['powerAttack', 'normalAttackLastCombo'],
              },
              sequence(
                branch(
                  { kind: 'casterControlled' },
                  sequence(
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy'],
                        operator: 'less',
                        value: { kind: 'blackboard', key: 'max_stack' },
                      },
                      sequence(
                        branch(
                          {
                            kind: 'buffIdStackCompare',
                            target: 'buffOwner',
                            buffIds: ['buff_chr_0016_laevat_passive_teammate_cd'],
                            operator: 'equal',
                            value: { kind: 'constant', value: 0 },
                          },
                          sequence(
                            step('applyBuff', {
                              buffId: 'buff_chr_0016_laevat_passive_teammate_cd',
                              target: 'buffOwner',
                              source: 'buffSource',
                              inheritSourceSkillCastInfo: true,
                            }),
                            branch(
                              {
                                kind: 'entityTagMatch',
                                target: 'enemy',
                                tagQueryType: 'hasAny',
                                tags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                              },
                              sequence(
                                step('mergeContextTargets', {
                                  saveToContextKey: 'fire_inflicted',
                                  sources: [{ kind: 'target', target: 'enemy' }],
                                }),
                              ),
                              sequence(
                                step('mergeContextTargets', {
                                  saveToContextKey: 'fire_inflicted',
                                  sources: [],
                                }),
                              ),
                            ),
                            forEachContextTarget(
                              'fire_inflicted',
                              sequence(
                                step('readBuffStackCount', {
                                  target: 'enemy',
                                  outputKey: 'count',
                                  query: {
                                    kind: 'tag',
                                    tagQueryType: 'hasAny',
                                    buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                                  },
                                }),
                                {
                                  kind: 'switch',
                                  parameters: {
                                    choice: { kind: 'blackboard', key: 'count' },
                                    alwaysNext: true,
                                  },
                                  options: [
                                    {
                                      value: { kind: 'constant', value: 1 },
                                      sequence: sequence(
                                        branch(
                                          {
                                            kind: 'buffIdStackCompare',
                                            target: 'caster',
                                            buffIds: ['buff_chr_0016_laevat_energy'],
                                            operator: 'less',
                                            value: { kind: 'blackboard', key: 'max_stack' },
                                          },
                                          sequence(
                                            step('finishBuffsByTag', {
                                              target: 'enemy',
                                              tagQueryType: 'hasAny',
                                              buffTags: [
                                                'Skill/Character/Common/SpellInflict/FireInflict',
                                              ],
                                              reason: 'absorbed',
                                            }),
                                            step('applyBuff', {
                                              buffId: 'buff_chr_0016_laevat_energy',
                                              target: 'buffSource',
                                              source: 'buffSource',
                                              inheritSourceSkillCastInfo: true,
                                            }),
                                          ),
                                        ),
                                      ),
                                    },
                                    {
                                      value: { kind: 'constant', value: 2 },
                                      sequence: sequence(
                                        branch(
                                          {
                                            kind: 'buffIdStackCompare',
                                            target: 'caster',
                                            buffIds: ['buff_chr_0016_laevat_energy'],
                                            operator: 'less',
                                            value: { kind: 'blackboard', key: 'max_stack' },
                                          },
                                          sequence(
                                            step('finishBuffsByTag', {
                                              target: 'enemy',
                                              tagQueryType: 'hasAny',
                                              buffTags: [
                                                'Skill/Character/Common/SpellInflict/FireInflict',
                                              ],
                                              reason: 'absorbed',
                                              count: { kind: 'constant', value: 1 },
                                            }),
                                            step('applyBuff', {
                                              buffId: 'buff_chr_0016_laevat_energy',
                                              target: 'buffSource',
                                              source: 'buffSource',
                                              inheritSourceSkillCastInfo: true,
                                            }),
                                            branch(
                                              {
                                                kind: 'buffIdStackCompare',
                                                target: 'caster',
                                                buffIds: ['buff_chr_0016_laevat_energy'],
                                                operator: 'less',
                                                value: { kind: 'blackboard', key: 'max_stack' },
                                              },
                                              sequence(
                                                step('finishBuffsByTag', {
                                                  target: 'enemy',
                                                  tagQueryType: 'hasAny',
                                                  buffTags: [
                                                    'Skill/Character/Common/SpellInflict/FireInflict',
                                                  ],
                                                  reason: 'absorbed',
                                                  count: { kind: 'constant', value: 1 },
                                                }),
                                                step('applyBuff', {
                                                  buffId: 'buff_chr_0016_laevat_energy',
                                                  target: 'buffSource',
                                                  source: 'buffSource',
                                                  inheritSourceSkillCastInfo: true,
                                                }),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    },
                                    {
                                      value: { kind: 'constant', value: 3 },
                                      sequence: sequence(
                                        branch(
                                          {
                                            kind: 'buffIdStackCompare',
                                            target: 'caster',
                                            buffIds: ['buff_chr_0016_laevat_energy'],
                                            operator: 'less',
                                            value: { kind: 'blackboard', key: 'max_stack' },
                                          },
                                          sequence(
                                            step('finishBuffsByTag', {
                                              target: 'enemy',
                                              tagQueryType: 'hasAny',
                                              buffTags: [
                                                'Skill/Character/Common/SpellInflict/FireInflict',
                                              ],
                                              reason: 'absorbed',
                                              count: { kind: 'constant', value: 1 },
                                            }),
                                            step('applyBuff', {
                                              buffId: 'buff_chr_0016_laevat_energy',
                                              target: 'buffSource',
                                              source: 'buffSource',
                                              inheritSourceSkillCastInfo: true,
                                            }),
                                            branch(
                                              {
                                                kind: 'buffIdStackCompare',
                                                target: 'caster',
                                                buffIds: ['buff_chr_0016_laevat_energy'],
                                                operator: 'less',
                                                value: { kind: 'blackboard', key: 'max_stack' },
                                              },
                                              sequence(
                                                step('finishBuffsByTag', {
                                                  target: 'enemy',
                                                  tagQueryType: 'hasAny',
                                                  buffTags: [
                                                    'Skill/Character/Common/SpellInflict/FireInflict',
                                                  ],
                                                  reason: 'absorbed',
                                                  count: { kind: 'constant', value: 1 },
                                                }),
                                                step('applyBuff', {
                                                  buffId: 'buff_chr_0016_laevat_energy',
                                                  target: 'buffSource',
                                                  source: 'buffSource',
                                                  inheritSourceSkillCastInfo: true,
                                                }),
                                                branch(
                                                  {
                                                    kind: 'buffIdStackCompare',
                                                    target: 'caster',
                                                    buffIds: ['buff_chr_0016_laevat_energy'],
                                                    operator: 'less',
                                                    value: { kind: 'blackboard', key: 'max_stack' },
                                                  },
                                                  sequence(
                                                    step('finishBuffsByTag', {
                                                      target: 'enemy',
                                                      tagQueryType: 'hasAny',
                                                      buffTags: [
                                                        'Skill/Character/Common/SpellInflict/FireInflict',
                                                      ],
                                                      reason: 'absorbed',
                                                      count: { kind: 'constant', value: 1 },
                                                    }),
                                                    step('applyBuff', {
                                                      buffId: 'buff_chr_0016_laevat_energy',
                                                      target: 'buffSource',
                                                      source: 'buffSource',
                                                      inheritSourceSkillCastInfo: true,
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
                                      value: { kind: 'constant', value: 4 },
                                      sequence: sequence(
                                        branch(
                                          {
                                            kind: 'buffIdStackCompare',
                                            target: 'caster',
                                            buffIds: ['buff_chr_0016_laevat_energy'],
                                            operator: 'less',
                                            value: { kind: 'blackboard', key: 'max_stack' },
                                          },
                                          sequence(
                                            step('finishBuffsByTag', {
                                              target: 'enemy',
                                              tagQueryType: 'hasAny',
                                              buffTags: [
                                                'Skill/Character/Common/SpellInflict/FireInflict',
                                              ],
                                              reason: 'absorbed',
                                              count: { kind: 'constant', value: 1 },
                                            }),
                                            step('applyBuff', {
                                              buffId: 'buff_chr_0016_laevat_energy',
                                              target: 'buffSource',
                                              source: 'buffSource',
                                              inheritSourceSkillCastInfo: true,
                                            }),
                                            branch(
                                              {
                                                kind: 'buffIdStackCompare',
                                                target: 'caster',
                                                buffIds: ['buff_chr_0016_laevat_energy'],
                                                operator: 'less',
                                                value: { kind: 'blackboard', key: 'max_stack' },
                                              },
                                              sequence(
                                                step('finishBuffsByTag', {
                                                  target: 'enemy',
                                                  tagQueryType: 'hasAny',
                                                  buffTags: [
                                                    'Skill/Character/Common/SpellInflict/FireInflict',
                                                  ],
                                                  reason: 'absorbed',
                                                  count: { kind: 'constant', value: 1 },
                                                }),
                                                step('applyBuff', {
                                                  buffId: 'buff_chr_0016_laevat_energy',
                                                  target: 'buffSource',
                                                  source: 'buffSource',
                                                  inheritSourceSkillCastInfo: true,
                                                }),
                                                branch(
                                                  {
                                                    kind: 'buffIdStackCompare',
                                                    target: 'caster',
                                                    buffIds: ['buff_chr_0016_laevat_energy'],
                                                    operator: 'less',
                                                    value: { kind: 'blackboard', key: 'max_stack' },
                                                  },
                                                  sequence(
                                                    step('finishBuffsByTag', {
                                                      target: 'enemy',
                                                      tagQueryType: 'hasAny',
                                                      buffTags: [
                                                        'Skill/Character/Common/SpellInflict/FireInflict',
                                                      ],
                                                      reason: 'absorbed',
                                                      count: { kind: 'constant', value: 1 },
                                                    }),
                                                    step('applyBuff', {
                                                      buffId: 'buff_chr_0016_laevat_energy',
                                                      target: 'buffSource',
                                                      source: 'buffSource',
                                                      inheritSourceSkillCastInfo: true,
                                                    }),
                                                    branch(
                                                      {
                                                        kind: 'buffIdStackCompare',
                                                        target: 'caster',
                                                        buffIds: ['buff_chr_0016_laevat_energy'],
                                                        operator: 'less',
                                                        value: {
                                                          kind: 'blackboard',
                                                          key: 'max_stack',
                                                        },
                                                      },
                                                      sequence(
                                                        step('finishBuffsByTag', {
                                                          target: 'enemy',
                                                          tagQueryType: 'hasAny',
                                                          buffTags: [
                                                            'Skill/Character/Common/SpellInflict/FireInflict',
                                                          ],
                                                          reason: 'absorbed',
                                                          count: { kind: 'constant', value: 1 },
                                                        }),
                                                        step('applyBuff', {
                                                          buffId: 'buff_chr_0016_laevat_energy',
                                                          target: 'buffSource',
                                                          source: 'buffSource',
                                                          inheritSourceSkillCastInfo: true,
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
                                    },
                                  ],
                                },
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
      ],
    },
    buff_chr_0016_laevat_passive_teammate_cd: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0016_laevat_pause_ult: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0016_laevat_potential_5: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { curr_duration: 0, extend_duration: 0, max_duration: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0016_laevat_ring_start_asset'] },
              sequence(
                step('modifyActionValue', {
                  key: 'curr_duration',
                  operation: 'assign',
                  value: { kind: 'constant', value: 0 },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0016_laevat_ring_start_asset: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('changePlayerActionMode', { modeId: 'ult', lifetime: 'finishByAction' }),
        ),
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0016_laevat_wpn_vfx'],
            reason: 'other',
          }),
        ),
      },
      skillSlotReplacements: [
        {
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'battleSkillDuringUltimate',
          revertedSkillKey: 'battleSkill',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
    },
    buff_chr_0016_laevat_show_weapon: {
      stackingType: 'extend',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: 15,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
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
      applyTags: ['Status/DisableBreakingAttack'],
      extendTags: [],
      blackboard: { duration: 16 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ring_start_asset',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        enable: sequence(
          step('restrictUltimateEnergyRecovery', {
            target: 'caster',
            allowedRecoveryTags: [],
            clearUltimateEnergyOnEnd: false,
          }),
        ),
        finish: sequence(
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'type', skillType: 'ultimate' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'constant', value: 10 },
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0016_laevat_pause_ult'] },
              sequence(step('setCurrentBuffTimePaused', { paused: true })),
            ),
          ),
        },
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0016_laevat_pause_ult'] },
              sequence(step('setCurrentBuffTimePaused', { paused: false })),
            ),
          ),
        },
      ],
    },
    buff_chr_0016_laevat_talent_2_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {
        cd: 0,
        duration: 0,
        heal_max_hp: 0,
        hp_threshold: 0,
        shelter: 0,
        shelter_real: 0,
      },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'takeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'healthCompare',
                target: 'caster',
                valueType: 'ratio',
                operator: 'less',
                value: { kind: 'blackboard', key: 'hp_threshold' },
              },
              sequence(
                branch(
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'caster',
                      markerId: 'buff_chr_0016_laevat_talent_2_0',
                    },
                  },
                  sequence(
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'buff_chr_0016_laevat_talent_2_0',
                      durationSeconds: { kind: 'blackboard', key: 'cd' },
                      autoFinishByAction: false,
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0016_laevat_talent_2_1',
                      target: 'buffOwner',
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        heal_max_hp: { kind: 'blackboard', key: 'heal_max_hp' },
                        duration: { kind: 'blackboard', key: 'duration' },
                        shelter: { kind: 'blackboard', key: 'shelter_real' },
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
    buff_chr_0016_laevat_talent_2_1: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 5,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0, heal_max_hp: 0, shelter: 0 },
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
              rate: { kind: 'blackboard', key: 'shelter' },
            },
          }),
        ),
        trigger: sequence(
          step('heal', {
            target: 'buffOwner',
            alwaysNext: true,
            tags: [],
            attribute: 'maxHealth',
            multiplier: { kind: 'blackboard', key: 'heal_max_hp' },
            addition: { kind: 'constant', value: 0 },
          }),
        ),
      },
    },
    buff_chr_0016_laevat_ult_end: {
      stackingType: 'extend',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
        blinkInMainCharHpBar: false,
        showProgressInHpBar: true,
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
      blackboard: { duration: 15 },
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: [
              'buff_chr_0016_laevat_ring_start_asset',
              'buff_chr_0016_laevat_ultimate_sfx_loop',
            ],
            reason: 'other',
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0016_laevat_pause_ult'] },
              sequence(step('setCurrentBuffTimePaused', { paused: true })),
            ),
          ),
        },
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0016_laevat_pause_ult'] },
              sequence(step('setCurrentBuffTimePaused', { paused: false })),
            ),
          ),
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0016_laevat_normal_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 5 },
      childSkill: {
        skillId: 'chr_0016_laevat_normal_skill_abilityentity',
        blackboard: { atk_scale: 3, atk_scale_2: 0, atk_scale_3: 0, hit_count: 0, poise: 0 },
        scheduledSequences: [
          scheduled(
            18,
            sequence(
              forEachTarget(
                'enemy',
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/0/sequence/steps/0/body/steps/0',
                  ),
                ),
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0016_laevat_energy',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                  step('modifyActionValue', {
                    key: 'hit_count',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
              ),
            ),
            18,
          ),
          scheduled(
            25,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/1/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            25,
          ),
          scheduled(
            29,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/2/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            29,
          ),
          scheduled(
            33,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/3/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            33,
          ),
          scheduled(
            37,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/4/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            37,
          ),
          scheduled(
            41,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/5/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            41,
          ),
          scheduled(
            45,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/6/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            45,
          ),
          scheduled(
            50,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/7/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            50,
          ),
          scheduled(
            54,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/8/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            54,
          ),
          scheduled(
            58,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/9/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            58,
          ),
          scheduled(
            62,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalSkill'],
                },
                'abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity:/childSkill/scheduledSequences/10/sequence/steps/0',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'hit_count' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'hit_count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_energy',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_obtain_ultimate_sp',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
            62,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
